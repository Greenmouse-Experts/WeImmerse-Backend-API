// src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { Op, Sequelize, ForeignKeyConstraintError } from 'sequelize';
import {
  AccountVettingStatus,
  generateOTP,
  getPaginationFields,
  getTotalPages,
} from '../utils/helpers';
import { sendMail } from '../services/mail.service';
import { emailTemplates } from '../utils/messages';
import JwtService from '../services/jwt.service';
import logger from '../middlewares/logger'; // Adjust the path to your logger.js
import { capitalizeFirstLetter } from '../utils/helpers';
import Admin from '../models/admin';
import Role from '../models/role';
import Permission from '../models/permission';
import RolePermission from '../models/rolepermission';
import SubscriptionPlan from '../models/subscriptionplan';
import User from '../models/user';
import CourseCategory from '../models/coursecategory';
import AssetCategory from '../models/assetcategory';
import JobCategory from '../models/jobcategory';
import PhysicalAsset from '../models/physicalasset';
import DigitalAsset from '../models/digitalasset';
import Course, { CourseStatus } from '../models/course';
import Job from '../models/job';
import sequelizeService from '../services/sequelize.service';
import jobService from '../services/job.service';
import KYCDocuments from '../models/kycdocument';
import KYCVerification from '../models/kycverification';
import Wallet from '../models/wallet';
import WithdrawalAccount from '../models/withdrawalaccount';
import Category, { CategoryTypes } from '../models/category';
import Notification from '../models/notification';

// Extend the Express Request interface to include adminId and admin
interface AuthenticatedRequest extends Request {
  adminId?: string;
  admin?: Admin; // This is the instance type of the Admin model
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the token from the request
    const token = JwtService.jwtGetToken(req);

    if (!token) {
      res.status(400).json({
        message: 'Token not provided',
      });
      return;
    }

    // Blacklist the token to prevent further usage
    await JwtService.jwtBlacklistToken(token);

    res.status(200).json({
      message: 'Logged out successfully.',
    });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'Server error during logout.',
    });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, photo } = req.body;
    const adminId = req.admin?.id;

    // Fetch the admin by their ID
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      res.status(404).json({ message: 'Admin not found.' });
      return;
    }

    // Check if email is being updated
    if (email && email !== admin.email) {
      // Check if the email already exists for another user
      const emailExists = await Admin.findOne({ where: { email } });
      if (emailExists) {
        res
          .status(400)
          .json({ message: 'Email is already in use by another user.' });
        return;
      }
    }

    // Update admin profile information
    admin.name = name ? capitalizeFirstLetter(name) : admin.name;
    admin.photo = photo || admin.photo;
    admin.email = email || admin.email;

    await admin.save();

    res.status(200).json({
      message: 'Profile updated successfully.',
      data: admin,
    });
  } catch (error: any) {
    logger.error('Error updating admin profile:', error);

    res.status(500).json({
      message: error.message || 'Server error during profile update.',
    });
  }
};

export const updatePassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const adminId = req.admin?.id; // Using optional chaining to access adminId

  try {
    // Find the admin
    const admin = await Admin.scope('auth').findByPk(adminId);
    if (!admin) {
      res.status(404).json({ message: 'admin not found.' });
      return;
    }

    // Check if the old password is correct
    const isMatch = await admin.checkPassword(oldPassword);
    if (!isMatch) {
      res.status(400).json({ message: 'Old password is incorrect.' });
      return;
    }

    // Update the password
    admin.password = await Admin.hashPassword(newPassword); // Hash the new password before saving
    await admin.save();

    // Send password reset notification email
    const message = emailTemplates.adminPasswordResetNotification(admin);
    try {
      await sendMail(
        admin.email,
        `${process.env.APP_NAME} - Password Reset Notification`,
        message
      );
    } catch (emailError) {
      logger.error('Error sending email:', emailError); // Log error for internal use
    }

    res.status(200).json({
      message: 'Password updated successfully.',
    });
  } catch (error: any) {
    logger.error(error);

    res.status(500).json({
      message: error.message || 'Server error during password update.',
    });
  }
};

export const subAdmins = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email } = req.query; // Get the search query parameters

    // Build the where condition dynamically based on the presence of name and email
    const whereCondition: any = {};

    if (name) {
      whereCondition.name = {
        [Op.like]: `%${name}%`, // Use LIKE for case-insensitive match
      };
    }

    if (email) {
      whereCondition.email = {
        [Op.like]: `%${email}%`, // Use LIKE for case-insensitive match
      };
    }

    // Fetch sub-admins along with their roles, applying the search conditions
    const subAdmins = await Admin.findAll({
      where: whereCondition,
      include: [
        {
          model: Role, // Include the Role model in the query
          as: 'role', // Use the alias defined in the association (if any)
        },
      ],
    });

    if (subAdmins.length === 0) {
      res.status(404).json({ message: 'Sub-admins not found' });
      return;
    }

    res
      .status(200)
      .json({ message: 'Sub-admins retrieved successfully', data: subAdmins });
  } catch (error: any) {
    logger.error('Error retrieving sub-admins:', error);
    res.status(500).json({
      message: error.message || `Error retrieving sub-admins: ${error}`,
    });
  }
};

export const createSubAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, roleId } = req.body;

    // Check if the email already exists
    const existingSubAdmin = await Admin.findOne({ where: { email } });
    if (existingSubAdmin) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    // Generate a random password (you can change this to your desired method)
    const password = Math.random().toString(36).slice(-8);

    const checkRole = await Role.findByPk(roleId);
    if (!checkRole) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    // Create the sub-admin
    const newSubAdmin = await Admin.create({
      name,
      email,
      password: password,
      roleId,
      status: 'active', // Default status
    });

    // Send mail
    let message = emailTemplates.subAdminCreated(newSubAdmin, password);
    try {
      await sendMail(
        email,
        `${process.env.APP_NAME} - Your Sub-Admin Login Details`,
        message
      );
    } catch (emailError) {
      logger.error('Error sending email:', emailError); // Log error for internal use
    }

    res.status(200).json({ message: 'Sub Admin created successfully.' });
  } catch (error: any) {
    logger.error(error);
    res
      .status(500)
      .json({ message: error.message || `Error creating sub-admin: ${error}` });
  }
};

export const updateSubAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { subAdminId, name, email, roleId } = req.body;

  try {
    // Find the sub-admin by their ID
    const subAdmin = await Admin.findByPk(subAdminId);
    if (!subAdmin) {
      res.status(404).json({ message: 'Sub-admin not found' });
      return;
    }

    // Check if the email is already in use by another sub-admin
    if (email && email !== subAdmin.email) {
      // Only check if the email has changed
      const existingAdmin = await Admin.findOne({
        where: {
          email,
          id: { [Op.ne]: subAdminId }, // Ensure it's not the same sub-admin
        },
      });

      if (existingAdmin) {
        res
          .status(400)
          .json({ message: 'Email is already in use by another sub-admin.' });
        return;
      }
    }

    // Update sub-admin details
    await subAdmin.update({
      name,
      email,
      roleId,
    });

    res.status(200).json({ message: 'Sub Admin updated successfully.' });
  } catch (error: any) {
    // Log and send the error message in the response
    logger.error('Error updating sub-admin:', error);
    res
      .status(500)
      .json({ message: error.message || `Error updating sub-admin: ${error}` });
  }
};

export const deactivateOrActivateSubAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const subAdminId = req.query.subAdminId as string;

  try {
    // Find the sub-admin by ID
    const subAdmin = await Admin.findByPk(subAdminId);
    if (!subAdmin) {
      res.status(404).json({ message: 'Sub-admin not found' });
      return;
    }

    // Toggle status: if active, set to inactive; if inactive, set to active
    const newStatus = subAdmin.status === 'active' ? 'inactive' : 'active';
    subAdmin.status = newStatus;

    // Save the updated status
    await subAdmin.save();

    res
      .status(200)
      .json({ message: `Sub-admin status updated to ${newStatus}.` });
  } catch (error: any) {
    // Log the error and send the response
    logger.error('Error updating sub-admin status:', error);
    res.status(500).json({
      message: error.message || `Error updating sub-admin status: ${error}`,
    });
  }
};

export const deleteSubAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const subAdminId = req.query.subAdminId as string;

  try {
    const subAdmin = await Admin.findByPk(subAdminId);
    if (!subAdmin) {
      res.status(404).json({ message: 'Sub-admin not found' });
      return;
    }

    await subAdmin.destroy();
    res.status(200).json({ message: 'Sub-admin deleted successfully' });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message: error.message || 'Error deleting sub-admin: ${error.message}',
    });
  }
};

export const resendLoginDetailsSubAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const subAdminId = req.query.subAdminId as string;

  try {
    const subAdmin = await Admin.findByPk(subAdminId);

    if (!subAdmin) {
      res.status(404).json({ message: 'Sub-admin not found' });
      return;
    }

    // Generate a new password (or reuse the existing one)
    const password = Math.random().toString(36).slice(-8);

    // Update the password in the database
    subAdmin.password = password;
    await subAdmin.save();

    // Send mail
    let message = emailTemplates.subAdminCreated(subAdmin, password);
    try {
      await sendMail(
        subAdmin.email,
        `${process.env.APP_NAME} - Your New Login Details`,
        message
      );
    } catch (emailError) {
      logger.error('Error sending email:', emailError); // Log error for internal use
    }

    res.status(200).json({ message: 'Login details resent successfully' });
  } catch (error: any) {
    logger.error(error);
    res.status(500).json({
      message:
        error.message || 'Error resending login details: ${error.message}',
    });
  }
};

// Roles
// Create a new Role
export const createRole = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { name } = req.body;

  try {
    if (!name) {
      res.status(400).json({ message: 'Name is required.' });
      return;
    }

    // Check if a role with the same name already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      res.status(409).json({ message: 'Role with this name already exists.' });
      return;
    }

    // Create the new role
    const role = await Role.create({ name });
    res.status(200).json({ message: 'Role created successfully' });
  } catch (error: any) {
    logger.error('Error creating role:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Get all Roles
export const getRoles = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({ data: roles });
  } catch (error: any) {
    logger.error('Error fetching roles:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Update an existing Role
export const updateRole = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { roleId, name } = req.body;

  try {
    if (!name) {
      res.status(400).json({ message: 'Name is required.' });
      return;
    }

    const role = await Role.findByPk(roleId);

    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    // Check if another role with the same name exists
    const existingRole = await Role.findOne({
      where: { name, id: { [Op.ne]: roleId } }, // Exclude the current role ID
    });

    if (existingRole) {
      res
        .status(409)
        .json({ message: 'Another role with this name already exists.' });
      return;
    }

    // Update the role name
    role.name = name;
    await role.save();

    res.status(200).json({ message: 'Role updated successfully', role });
  } catch (error: any) {
    logger.error('Error updating role:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// View a Role's Permissions
export const viewRolePermissions = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const roleId = req.query.roleId as string;

  try {
    const role = await Role.findByPk(roleId, {
      include: [{ model: Permission, as: 'permissions' }],
    });

    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    res.status(200).json({ data: role });
  } catch (error: any) {
    logger.error('Error fetching role permissions:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Assign a New Permission to a Role
export const assignPermissionToRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { roleId, permissionId } = req.body;

  try {
    // Ensure role and permission exist
    const role = await Role.findByPk(roleId);

    const permission = await Permission.findByPk(permissionId);

    if (!role || !permission) {
      res.status(404).json({ message: 'Role or Permission not found' });
      return;
    }

    // Check if the permission is already assigned to the role
    const existingRolePermission = await RolePermission.findOne({
      where: { roleId, permissionId },
    });

    if (existingRolePermission) {
      res
        .status(409)
        .json({ message: 'Permission is already assigned to this role' });
      return;
    }

    // Assign permission to role
    await RolePermission.create({ roleId, permissionId });

    res
      .status(200)
      .json({ message: 'Permission assigned to role successfully' });
  } catch (error: any) {
    logger.error('Error assigning permission to role:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Delete a Permission from a Role
export const deletePermissionFromRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { roleId, permissionId } = req.body;

  try {
    const role = await Role.findOne({
      where: { id: roleId },
    });

    if (!role) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    const rolePermission = await RolePermission.findOne({
      where: { roleId, permissionId },
    });

    if (!rolePermission) {
      res.status(404).json({ message: 'Permission not found for the role' });
      return;
    }

    await rolePermission.destroy();

    res
      .status(200)
      .json({ message: 'Permission removed from role successfully' });
  } catch (error: any) {
    logger.error('Error deleting permission from role:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Permission
// Create a new Permission
export const createPermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.body;

  try {
    if (!name) {
      res.status(400).json({ message: 'Name is required.' });
      return;
    }

    // Check if permission name already exists
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      res.status(409).json({ message: 'Permission name already exists.' });
      return;
    }

    // Create new permission if it doesn't exist
    const permission = await Permission.create({ name });
    res.status(201).json({
      message: 'Permission created successfully',
    });
  } catch (error: any) {
    logger.error('Error creating permission:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Get all Permissions
export const getPermissions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json({ data: permissions });
  } catch (error: any) {
    logger.error('Error fetching permissions:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Update an existing Permission
export const updatePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { permissionId, name } = req.body;

  try {
    if (!name) {
      res.status(400).json({ message: 'Name is required.' });
      return;
    }

    const permission = await Permission.findByPk(permissionId);

    if (!permission) {
      res.status(404).json({ message: 'Permission not found' });
      return;
    }

    // Check if the new name exists in another permission
    const existingPermission = await Permission.findOne({
      where: {
        name,
        id: { [Op.ne]: permissionId }, // Exclude current permission
      },
    });

    if (existingPermission) {
      res.status(409).json({ message: 'Permission name already exists.' });
      return;
    }

    permission.name = name;
    await permission.save();

    res.status(200).json({ message: 'Permission updated successfully' });
  } catch (error: any) {
    logger.error('Error updating permission:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Delete a Permission and cascade delete from role_permissions
export const deletePermission = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const permissionId = req.query.permissionId as string;

    // Find the permission
    const permission = await Permission.findByPk(permissionId);

    if (!permission) {
      res.status(404).json({ message: 'Permission not found' });
      return;
    }

    // Delete the permission and associated role_permissions
    await permission.destroy();
    await RolePermission.destroy({ where: { permissionId } });

    res.status(200).json({
      message:
        'Permission and associated role permissions deleted successfully',
    });
  } catch (error: any) {
    logger.error('Error deleting permission:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Get all course categories
export const getCourseCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, children = 0 } = req.query as any;
    const includeChildren = req.query.includeChildren === 'true';

    const options: any = {
      where: {
        ...(type && { type }),
        parentId: Boolean(+children) ? { [Op.ne]: null } : null,
      },
    };

    if (includeChildren) {
      options.include = [
        {
          association: 'children',
          where: { isActive: true },
          required: false,
        },
      ];
    }

    const categories = await Category.findAll(options);

    res.status(200).json({ data: categories });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new course category
export const createCourseCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      res.status(400).json({
        message: 'A course category with the same name already exists.',
      });
      return;
    }

    const category = await Category.create({
      name,
      description,
      type: CategoryTypes.COURSE,
      isActive: true,
    });
    res.status(200).json({
      message: 'Course category created successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing course category
export const updateCourseCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Course category not found' });
      return;
    }

    // Check if another category with the same name exists (exclude the current category)
    const existingCategory = await Category.findOne({
      where: { name, id: { [Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
    });
    if (existingCategory) {
      res.status(400).json({
        message: 'Another course category with the same name already exists.',
      });
      return;
    }

    await category.update({ name, description });
    res.status(200).json({
      message: 'Course category updated successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a course category
export const deleteCourseCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.query.id as string;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Course category not found' });
      return;
    }

    await category.destroy();
    res.status(200).json({ message: 'Course category deleted successfully' });
  } catch (error: any) {
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({
        message:
          'Cannot delete course category plan because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.',
      });
    } else {
      logger.error('Error deleting course category:', error);
      res
        .status(500)
        .json({ message: error.message || 'Error deleting course category' });
    }
  }
};

// Get all asset categories
export const getAssetCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const assets = await Category.findAll();
    res.status(200).json({ data: assets });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new asset category
export const createAssetCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      res.status(400).json({
        message: 'A asset category with the same name already exists.',
      });
      return;
    }

    const category = await Category.create({
      name,
      description,
      type: CategoryTypes.ASSET,
      isActive: true,
    });
    res.status(200).json({
      message: 'Asset category created successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing asset category
export const updateAssetCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Asset category not found' });
      return;
    }

    // Check if another category with the same name exists (exclude the current category)
    const existingCategory = await Category.findOne({
      where: { name, id: { [Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
    });
    if (existingCategory) {
      res.status(400).json({
        message: 'Another asset category with the same name already exists.',
      });
      return;
    }

    await category.update({ name });
    res.status(200).json({
      message: 'Asset category updated successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a asset category
export const deleteAssetCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.query.id as string;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Asset category not found' });
      return;
    }

    await category.destroy();
    res.status(200).json({ message: 'Asset category deleted successfully' });
  } catch (error: any) {
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({
        message:
          'Cannot delete asset category plan because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.',
      });
    } else {
      logger.error('Error deleting asset category:', error);
      res
        .status(500)
        .json({ message: error.message || 'Error deleting asset category' });
    }
  }
};

// Subscription Plan
export const getAllSubscriptionPlans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.query; // Get the name from query parameters

    const queryOptions: any = {}; // Initialize query options

    // If a name is provided, add a condition to the query
    if (name) {
      queryOptions.where = {
        name: {
          [Op.like]: `%${name}%`, // Use a partial match for name
        },
      };
    }

    const plans = await SubscriptionPlan.findAll(queryOptions); // Use query options
    res.status(200).json({ data: plans });
  } catch (error: any) {
    logger.error('Error fetching subscription plans:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

// Subscription Plan
export const getSubscriptionPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Get the name from query parameters

    const plan = await SubscriptionPlan.findOne({ where: { id } }); // Use query options
    res.status(200).json({ status: true, data: plan });
  } catch (error: any) {
    logger.error('Error fetching subscription plan details:', error);
    res.status(500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const createSubscriptionPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, duration, price, currency, period, features } = req.body;

  try {
    // Check if the subscription plan name already exists
    const existingPlan = await SubscriptionPlan.findOne({ where: { name } });

    if (existingPlan) {
      res.status(400).json({
        status: false,
        message: 'A plan with this name already exists.',
      });
      return;
    }

    // Create the subscription plan
    await SubscriptionPlan.create({
      name,
      duration,
      price,
      currency,
      period,
      features,
    });

    res.status(200).json({
      status: true,
      message: 'Subscription plan created successfully.',
    });
  } catch (error: any) {
    logger.error('Error creating subscription plan:', error);
    res.status(500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const updateSubscriptionPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { planId, name, price, period, currency } = req.body;

  try {
    // Fetch the subscription plan to update
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) {
      res
        .status(404)
        .json({ status: false, message: 'Subscription plan not found.' });
      return;
    }

    // Prevent name change for Free Plan
    if (plan.name === 'Free Plan' && name !== 'Free Plan') {
      res.status(400).json({
        status: false,
        message: 'The Free Plan name cannot be changed.',
      });
      return;
    }

    // Check if the new name already exists (ignoring the current plan)
    const existingPlan = await SubscriptionPlan.findOne({
      where: { name, id: { [Op.ne]: planId } },
    });

    if (existingPlan) {
      res.status(400).json({
        status: false,
        message: 'A different plan with this name already exists.',
      });
      return;
    }

    // Update fields
    if (name) {
      plan.name = name;
    }
    if (period) {
      plan.period = period;
    }
    if (currency) {
      plan.currency = currency;
    }
    if (price) {
      plan.price = price;
    }
    await plan.save();

    res.status(200).json({
      status: true,
      message: 'Subscription plan updated successfully',
    });
  } catch (error: any) {
    logger.error('Error updating subscription plan:', error);
    res.status(500).json({
      status: false,
      message: error.message || 'Internal server error',
    });
  }
};

export const deleteSubscriptionPlan = async (
  req: Request,
  res: Response
): Promise<void> => {
  const planId = req.query.planId as string;

  try {
    // Fetch the subscription plan
    const plan = await SubscriptionPlan.findByPk(planId);
    if (!plan) {
      res
        .status(404)
        .json({ status: false, message: 'Subscription plan not found.' });
      return;
    }

    // Prevent deletion of the Free Plan
    if (plan.name === 'Free Plan') {
      res
        .status(400)
        .json({ status: false, message: 'The Free Plan cannot be deleted.' });
      return;
    }

    // Check if plan has been subscribed for (TODO)

    // Attempt to delete the plan
    await plan.destroy();
    res.status(200).json({
      status: true,
      message: 'Subscription plan deleted successfully.',
    });
  } catch (error: any) {
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({
        status: false,
        message:
          'Cannot delete subscription plan because it is currently assigned to one or more vendors. Please reassign or delete these associations before proceeding.',
      });
    } else {
      logger.error('Error deleting subscription plan:', error);
      res.status(500).json({
        status: false,
        message: error.message || 'Error deleting subscription plan',
      });
    }
  }
};

export const getAllCreator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, status, email } = req.query; // Extract filter parameters from query

    // Build search conditions
    const searchConditions: any = { accountType: 'creator' }; // Filter by accountType

    if (name) {
      searchConditions.name = { [Op.like]: `%${name}%` }; // Partial match for name
    }
    if (status) {
      searchConditions.status = status; // Exact match for status
    }
    if (email) {
      searchConditions.email = { [Op.like]: `%${email}%` }; // Partial match for email
    }

    // Fetch creators with optional filters
    const creators = await User.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Order by creation date descending
    });

    res.status(200).json({ data: creators });
  } catch (error: any) {
    logger.error('Error fetching creators:', error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch creators.' });
  }
};

export const getAllUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, status, email } = req.query; // Extract filter parameters from query

    // Build search conditions
    const searchConditions: any = { accountType: 'user' }; // Filter by accountType

    if (name) {
      searchConditions.name = { [Op.like]: `%${name}%` }; // Partial match for name
    }
    if (status) {
      searchConditions.status = status; // Exact match for status
    }
    if (email) {
      searchConditions.email = { [Op.like]: `%${email}%` }; // Partial match for email
    }

    // Fetch users with optional filters
    const users = await User.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Order by creation date descending
    });

    res.status(200).json({ data: users });
  } catch (error: any) {
    logger.error('Error fetching general users:', error);
    res
      .status(500)
      .json({ message: error.message || 'Failed to fetch general users.' });
  }
};

export const getAllStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, status, email } = req.query; // Extract filter parameters from query

    // Build search conditions
    const searchConditions: any = { accountType: 'student' }; // Filter by accountType

    if (name) {
      searchConditions.name = { [Op.like]: `%${name}%` }; // Partial match for name
    }
    if (status) {
      searchConditions.status = status; // Exact match for status
    }
    if (email) {
      searchConditions.email = { [Op.like]: `%${email}%` }; // Partial match for email
    }

    // Fetch students with optional filters
    const students = await User.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Order by creation date descending
    });

    res.status(200).json({ status: true, data: students });
  } catch (error: any) {
    logger.error('Error fetching students:', error);
    res.status(500).json({
      status: false,
      message: error.message || 'Failed to fetch students.',
    });
  }
};

export const getAllInstitution = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, status, email } = req.query; // Extract filter parameters from query

    // Build search conditions
    const searchConditions: any = { accountType: 'institution' }; // Filter by accountType

    if (name) {
      searchConditions.name = { [Op.like]: `%${name}%` }; // Partial match for name
    }
    if (status) {
      searchConditions.status = status; // Exact match for status
    }
    if (email) {
      searchConditions.email = { [Op.like]: `%${email}%` }; // Partial match for email
    }

    // Fetch institutions with optional filters
    const institutions = await User.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Order by creation date descending
    });

    res.status(200).json({ status: true, data: institutions });
  } catch (error: any) {
    logger.error('Error fetching institutions:', error);
    res.status(500).json({
      status: false,
      message: error.message || 'Failed to fetch institutions.',
    });
  }
};

export const getSingleUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    const user_details = await User.findOne({
      where: { id },
      include: [
        { model: KYCDocuments, as: 'kyc_docs' },
        { model: KYCVerification, as: 'kyc_verification' },
        { model: Wallet, as: 'wallet' },
        { model: WithdrawalAccount, as: 'withdrawalAccount' },
      ],
    });

    return res.json({
      status: true,
      data: user_details,
    });
  } catch (error: any) {
    logger.error('Error fetching single user details:', error);
    res.status(500).json({
      message: error.message || 'Failed to fetch single user details.',
    });
  }
};

// Job Categories
export const getJobCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const jobs = await Category.findAll();
    res.status(200).json({ data: jobs });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createJobCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      res
        .status(400)
        .json({ message: 'A job category with the same name already exists.' });
      return;
    }

    const category = await Category.create({
      name,
      type: CategoryTypes.JOB,
      isActive: true,
    });
    res.status(200).json({
      message: 'Job category created successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJobCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, name, description } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Job category not found' });
      return;
    }

    // Check if another category with the same name exists (exclude the current category)
    const existingCategory = await Category.findOne({
      where: { name, id: { [Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
    });
    if (existingCategory) {
      res.status(400).json({
        message: 'Another job category with the same name already exists.',
      });
      return;
    }

    await category.update({ name, description });
    res.status(200).json({
      message: 'Job category updated successfully',
      data: category,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJobCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.query.id as string;

    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: 'Job category not found' });
      return;
    }

    await category.destroy();
    res.status(200).json({ message: 'Asset category deleted successfully' });
  } catch (error: any) {
    if (error instanceof ForeignKeyConstraintError) {
      res.status(400).json({
        message:
          'Cannot delete job category because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.',
      });
    } else {
      logger.error('Error deleting job category:', error);
      res
        .status(500)
        .json({ message: error.message || 'Error deleting job category' });
    }
  }
};

// Digital Asset
export const getAllDigitalAssets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { assetName, pricingType, status } = req.query; // Extract search parameters

    // Build search conditions
    const searchConditions: any = {};

    if (assetName) {
      searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
    }
    if (pricingType) {
      searchConditions.pricingType = pricingType;
    }
    if (status) {
      searchConditions.status = status;
    }

    // Fetch assets with optional search criteria
    const assets = await DigitalAsset.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({
      data: assets,
    });
  } catch (error: any) {
    logger.error('Error fetching digital assets:', error);
    res.status(500).json({
      message: error.message || 'Failed to fetch digital assets',
    });
  }
};

export const createDigitalAsset = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.body;

    const adminId = req.admin?.id;

    // Category check
    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Ensure the creatorId is included in the request payload
    const digitalAssetData = {
      ...req.body,
      creatorId: adminId,
      categoryId: category.id,
      status: 'published',
    };

    // Create the DigitalAsset
    const asset = await DigitalAsset.create(digitalAssetData);

    res.status(200).json({
      message: 'Digital Asset created successfully',
      data: asset,
    });
  } catch (error: any) {
    logger.error('Error creating Digital Asset:', error);
    res.status(500).json({
      error: error.message || 'Failed to create Digital Asset',
    });
  }
};

export const getDigitalAssets = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const adminId = req.admin?.id;

  try {
    const { assetName, pricingType, status } = req.query; // Extract search parameters

    // Build search conditions
    const searchConditions: any = {
      creatorId: adminId,
    };

    if (assetName) {
      searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
    }
    if (pricingType) {
      searchConditions.pricingType = pricingType;
    }
    if (status) {
      searchConditions.status = status;
    }

    // Fetch assets with optional search criteria
    const assets = await DigitalAsset.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({ data: assets });
  } catch (error: any) {
    logger.error('Error fetching digital assets:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to fetch Digital Assets' });
  }
};

export const viewDigitalAsset = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.query; // Extract search parameters

    // Fetch asset with optional search criteria
    const asset = await DigitalAsset.findOne({
      where: { id },
      include: [
        {
          model: Category, // Including the related Category model
          as: 'assetCategory', // Alias for the relationship (adjust if necessary)
          attributes: ['id', 'name'], // You can specify the fields you want to include
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'accountType', 'name', 'email'],
        },
        {
          model: Admin,
          as: 'admin',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: Role, // Assuming you've imported the Role model
              as: 'role', // Make sure this alias matches the one you used in the association
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({ data: asset });
  } catch (error: any) {
    logger.error('Error fetching digital asset:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to fetch Digital Asset' });
  }
};

export const updateDigitalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, categoryId } = req.body; // ID is passed in the request body

  try {
    // Category check
    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Find the Digital Asset by ID
    const asset = await DigitalAsset.findByPk(id);

    if (!asset) {
      res.status(404).json({ message: 'Digital Asset not found' });
      return;
    }

    // Update the Digital Asset with new data
    await asset.update({ ...req.body, categoryId: category.id });

    res.status(200).json({
      message: 'Digital Asset updated successfully',
    });
  } catch (error) {
    logger.error('Error updating Digital Asset:', error);
    res.status(500).json({ error: 'Failed to update Digital Asset' });
  }
};

export const deleteDigitalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.query.id as string;

  try {
    // Find the Digital Asset by ID
    const asset = await DigitalAsset.findByPk(id);

    // If the asset is not found, return a 404 response
    if (!asset) {
      res.status(404).json({ message: 'Digital Asset not found' });
      return;
    }

    // Delete the asset
    await asset.destroy();

    // Return success response
    res.status(200).json({ message: 'Digital Asset deleted successfully' });
  } catch (error) {
    logger.error('Error deleting Digital Asset:', error);
    res.status(500).json({ error: 'Failed to delete Digital Asset' });
  }
};

export const updateDigitalAssetStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { assetId, status, adminNote } = req.body; // Extract status and adminNote from request body

    // Validate status
    if (!['published', 'unpublished'].includes(status)) {
      res.status(400).json({
        message:
          "Invalid status. Allowed values are 'published' or 'unpublished'.",
      });
      return;
    }

    // Ensure adminNote is provided if status is 'unpublished'
    if (status === 'unpublished' && (!adminNote || adminNote.trim() === '')) {
      res.status(400).json({
        message: "Admin note is required when status is 'unpublished'.",
      });
      return;
    }

    // Find the asset by ID
    const asset = await DigitalAsset.findByPk(assetId);
    if (!asset) {
      res.status(404).json({
        message: 'Asset not found.',
      });
      return;
    }

    // Update the asset's status and adminNote
    await asset.update({
      status,
      adminNote: status === 'unpublished' ? adminNote : null,
    });

    // Send email notification to admin
    if (status === 'published') {
      // Create notification
      await Notification.create({
        message: `Your digital asset '${asset.assetName}' has been published.`,
        link: `${process.env.APP_URL}/creator/assets`,
        userId: asset.creatorId,
      });

      try {
        const messageToSubscriber =
          await emailTemplates.sendDigitalAssetPublishedNotification(
            process.env.ADMIN_EMAIL!,
            asset.assetName!
          );

        // Send email
        await sendMail(
          process.env.ADMIN_EMAIL!,
          `${process.env.APP_NAME} - Your digital asset has been published`,
          messageToSubscriber
        );
      } catch (emailError) {
        console.error(
          'Failed to send digital asset publish notification:',
          emailError
        );
        // Continue even if email fails
      }
    } else {
      // Create notification
      await Notification.create({
        message: `Your digital asset '${asset.assetName}' has been unpublished.`,
        link: `${process.env.APP_URL}/creator/assets`,
        userId: asset.creatorId,
      });

      try {
        const messageToSubscriber =
          await emailTemplates.sendDigitalAssetUnpublishedNotification(
            process.env.ADMIN_EMAIL!,
            asset.assetName!
          );

        // Send email
        await sendMail(
          process.env.ADMIN_EMAIL!,
          `${process.env.APP_NAME} - Your digital asset has been unpublished`,
          messageToSubscriber
        );
      } catch (emailError) {
        console.error(
          'Failed to send digital asset unpublish notification:',
          emailError
        );
        // Continue even if email fails
      }
    }

    res.status(200).json({
      message: 'Digital Asset status updated successfully.',
      data: asset,
    });
  } catch (error: any) {
    logger.error('Error updating asset status:', error);
    res.status(500).json({
      message: error.message || 'Failed to update asset status.',
    });
  }
};

// Physical Asset
export const getAllPhysicalAssets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { assetName, status } = req.query; // Extract search parameters

    // Build search conditions
    const searchConditions: any = {};
    if (assetName) {
      searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
    }
    if (status) {
      searchConditions.status = status;
    }

    // Fetch assets with optional search criteria
    const assets = await PhysicalAsset.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({
      data: assets,
    });
  } catch (error: any) {
    logger.error('Error fetching physical assets:', error);
    res.status(500).json({
      message: error.message || 'Failed to fetch physical assets',
    });
  }
};

export const createPhysicalAsset = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { categoryId } = req.body;

    const adminId = req.admin?.id; // Extract user ID from authenticated request

    // Category check
    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Ensure the creatorId is included in the request payload
    const physicalAssetData = {
      ...req.body,
      creatorId: adminId,
      categoryId: category.id,
      status: 'published',
    };

    // Create the PhysicalAsset
    const asset = await PhysicalAsset.create(physicalAssetData);

    res.status(200).json({
      message: 'Physical Asset created successfully',
      data: asset,
    });
  } catch (error: any) {
    logger.error('Error creating Physical Asset:', error);
    res.status(500).json({
      error: error.message || 'Failed to create Physical Asset',
    });
  }
};

export const getPhysicalAssets = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const adminId = req.admin?.id; // Extract authenticated user's ID

  try {
    const { assetName, status } = req.query; // Extract search parameters

    // Build search conditions
    const searchConditions: any = {};
    if (assetName) {
      searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
    }
    if (status) {
      searchConditions.status = status;
    }

    // Fetch assets with optional search criteria
    const assets = await PhysicalAsset.findAll({
      where: searchConditions,
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({ data: assets });
  } catch (error: any) {
    logger.error('Error fetching physical assets:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to fetch physical Assets' });
  }
};

export const viewPhysicalAsset = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.query; // Extract search parameters

    // Fetch asset with optional search criteria
    const asset = await PhysicalAsset.findOne({
      where: { id },
      include: [
        {
          model: Category, // Including the related AssetCategory model
          as: 'assetCategory', // Alias for the relationship (adjust if necessary)
          attributes: ['id', 'name'], // You can specify the fields you want to include
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'accountType', 'name', 'email'],
        },
        {
          model: Admin,
          as: 'admin',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: Role, // Assuming you've imported the Role model
              as: 'role', // Make sure this alias matches the one you used in the association
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']], // Sort by creation date descending
    });

    res.status(200).json({ data: asset });
  } catch (error: any) {
    logger.error('Error fetching physical asset:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to fetch physical asset' });
  }
};

export const updatePhysicalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, categoryId } = req.body; // ID is passed in the request body

  try {
    // Category check
    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        message: 'Category not found in our database.',
      });
      return;
    }

    // Find the Physical Asset by ID
    const asset = await PhysicalAsset.findByPk(id);

    if (!asset) {
      res.status(404).json({ message: 'Physical Asset not found' });
      return;
    }

    // Update the Physical Asset with new data
    await asset.update({ ...req.body, categoryId: category.id });

    res.status(200).json({
      message: 'Physical Asset updated successfully',
    });
  } catch (error) {
    logger.error('Error updating physical Asset:', error);
    res.status(500).json({ error: 'Failed to update physical Asset' });
  }
};

export const deletePhysicalAsset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.query.id as string;

  try {
    // Find the Physical Asset by ID
    const asset = await PhysicalAsset.findByPk(id);

    // If the asset is not found, return a 404 response
    if (!asset) {
      res.status(404).json({ message: 'Physical Asset not found' });
      return;
    }

    // Delete the asset
    await asset.destroy();

    // Return success response
    res.status(200).json({ message: 'Physical Asset deleted successfully' });
  } catch (error) {
    logger.error('Error deleting physical asset:', error);
    res.status(500).json({ error: 'Failed to delete physical asset' });
  }
};

export const updatePhysicalAssetStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { assetId, status, adminNote } = req.body; // Extract status and adminNote from request body

    // Validate status
    if (!['published', 'unpublished'].includes(status)) {
      res.status(400).json({
        message:
          "Invalid status. Allowed values are 'published' or 'unpublished'.",
      });
      return;
    }

    // Ensure adminNote is provided if status is 'unpublished'
    if (status === 'unpublished' && (!adminNote || adminNote.trim() === '')) {
      res.status(400).json({
        message: "Admin note is required when status is 'unpublished'.",
      });
      return;
    }

    // Find the asset by ID
    const asset = await PhysicalAsset.findByPk(assetId);
    if (!asset) {
      res.status(404).json({
        message: 'Asset not found.',
      });
      return;
    }

    // Update the asset's status and adminNote
    await asset.update({
      status,
      adminNote: status === 'unpublished' ? adminNote : null,
    });

    // Send email notification to admin
    if (status === 'published') {
      // Create notification
      await Notification.create({
        message: `Your physical asset '${asset.assetName}' has been published.`,
        link: `${process.env.APP_URL}/creator/assets`,
        userId: asset.creatorId,
      });

      try {
        const messageToSubscriber =
          await emailTemplates.sendPhysicalAssetPublishedNotification(
            process.env.ADMIN_EMAIL!,
            asset.assetName!
          );

        // Send email
        await sendMail(
          process.env.ADMIN_EMAIL!,
          `${process.env.APP_NAME} - Your physical asset has been published`,
          messageToSubscriber
        );
      } catch (emailError) {
        console.error(
          'Failed to send physical asset publish notification:',
          emailError
        );
        // Continue even if email fails
      }
    } else {
      // Create notification
      await Notification.create({
        message: `Your physical asset '${asset.assetName}' has been unpublished.`,
        link: `${process.env.APP_URL}/creator/assets`,
        userId: asset.creatorId,
      });

      try {
        const messageToSubscriber =
          await emailTemplates.sendPhysicalAssetUnpublishedNotification(
            process.env.ADMIN_EMAIL!,
            asset.assetName!
          );

        // Send email
        await sendMail(
          process.env.ADMIN_EMAIL!,
          `${process.env.APP_NAME} - Your physical asset has been unpublished`,
          messageToSubscriber
        );
      } catch (emailError) {
        console.error(
          'Failed to send physical asset unpublish notification:',
          emailError
        );
        // Continue even if email fails
      }
    }

    res.status(200).json({
      message: 'Asset status updated successfully.',
      data: asset,
    });
  } catch (error: any) {
    logger.error('Error updating asset status:', error);
    res.status(500).json({
      message: error.message || 'Failed to update asset status.',
    });
  }
};

// Course
// Publish course
export const publishCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const courseId = req.params.id as string;

    // Find the course by its ID
    const course = await Course.findOne({
      where: { id: courseId },
      include: [{ model: User, as: 'creator' }],
    });
    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    // Check if all required fields are present and not null
    const requiredFields = [
      'creatorId',
      'categoryId',
      'title',
      'subtitle',
      'description',
      'language',
      'image',
      'level',
      'currency',
      'price',
      'requirement',
      'whatToLearn',
    ];

    const missingFields: string[] = [];
    for (const field of requiredFields) {
      if (
        course[field as keyof typeof course] === null ||
        course[field as keyof typeof course] === undefined
      ) {
        missingFields.push(field);
      }
    }

    // If there are missing fields, return an error
    if (missingFields.length > 0) {
      res.status(400).json({
        message: 'Course cannot be published. Missing required fields.',
        data: missingFields,
      });
      return;
    }

    // Update the course status to published (true)
    course.published = true; // Assuming `status` is a boolean column
    course.status = CourseStatus.LIVE;
    await course.save();

    // Create notification
    await Notification.create({
      message: `Your course '${course.title}' is now live.`,
      link: `${process.env.APP_URL}/creator/courses`,
      userId: course.creator?.id,
    });

    // Send email notification to creator
    try {
      const messageToSubscriber =
        await emailTemplates.sendCoursePublishedNotification(
          course.creator?.email!,
          course.title!
        );

      // Send email
      await sendMail(
        course.creator?.email!,
        `${process.env.APP_NAME} - Your Course Has Been Published 🎉`,
        messageToSubscriber
      );
    } catch (emailError) {
      console.error('Failed to send publish notification:', emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      message: 'Course is now live.',
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while publishing the course.',
    });
  }
};

// unpublish course
export const unpublishCourse = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const courseId = req.params.id as string;

    // Find the course by its ID
    const course = await Course.findOne({
      where: { id: courseId },
      include: [{ model: User, as: 'creator' }],
    });
    if (!course) {
      res.status(404).json({
        message: 'Course not found in our database.',
      });
      return;
    }

    if (course.status === CourseStatus.UNPUBLISHED) {
      return res.status(400).json({
        status: false,
        message: 'Course has already been unpublished',
      });
    }

    // Update the course status to published (true)
    course.status = CourseStatus.UNPUBLISHED;
    await course.save();

    // Create notification
    await Notification.create({
      message: `Your course '${course.title}' has been unpublished by the admin.`,
      link: `${process.env.APP_URL}/creator/courses`,
      userId: course.creator?.id,
    });

    // Send email notification to creator
    try {
      const messageToSubscriber =
        await emailTemplates.sendCoursePublishedNotification(
          course.creator?.email!,
          course.title!
        );

      // Send email
      await sendMail(
        course.creator?.email!,
        `${process.env.APP_NAME} - Your Course Has Been Published 🎉`,
        messageToSubscriber
      );
    } catch (emailError) {
      console.error('Failed to send publish notification:', emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      message: 'Course is now unpublished.',
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({
      message:
        error.message || 'An error occurred while publishing the course.',
    });
  }
};

// Get all courses with filters (categoryId)
export const getAllCourses = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Retrieve the authenticated user's ID
    const userId = (req as AuthenticatedRequest).adminId;

    const { categoryId } = req.query;

    // Ensure userId is defined
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
      return;
    }

    // Extract pagination query parameters
    const { page, limit, offset } = getPaginationFields(
      req.query.page as string,
      req.query.limit as string
    );

    let whereCondition: any = {};

    const { rows: courses, count: totalItems } = await Course.findAndCountAll({
      where: whereCondition,
      include: [
        { model: User, as: 'creator' },
        { model: Category, as: 'courseCategory' },
        // Adjust alias to match your associations
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Calculate pagination metadata
    const totalPages = getTotalPages(totalItems, limit);

    // Respond with the paginated courses and metadata
    return res.status(200).json({
      message: 'Courses retrieved successfully.',
      data: courses,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      status: false,
      message: error?.message || 'Error fetching courses',
    });
  }
};

// Job Post
// Review job post
export const reviewJobPost = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const jobPostId = req.params.id as string;
    const { status } = req.body;

    // Find the job by its ID
    const job = await Job.findByPk(jobPostId);
    if (!job) {
      return res.status(404).json({
        message: 'Job not found in our database.',
      });
    }

    // Update job
    await job.update({
      ...(status && { status }),
    });

    // Send email to creator about the review

    return res.status(200).json({
      message: 'Job reviewed successfully.',
      data: job,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message || 'An error occurred while review the job post.',
    });
  }
};

/**
 * Creator/Institution account vetting
 * @param req
 * @param res
 */
export const vetAccount = async (req: Request, res: Response): Promise<any> => {
  const { reason, status } = req.body;

  const { userId } = req.params;

  // Start transaction
  const transaction = await sequelizeService.connection!.transaction();

  try {
    // Check if email already exists
    const existingUser = await User.findOne({
      where: { id: userId },
      transaction, // Pass transaction in options
    });
    if (!existingUser) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Determine if approved or not
    const verified = status == AccountVettingStatus.APPROVED ? true : false;

    // Update
    await User.update(
      { verified, ...(!verified && { reason }) },
      { where: { id: userId } }
    );

    // Prepare and send notify account owner about verification
    const message = emailTemplates.vettedAccount(
      existingUser,
      status,
      reason,
      ''
    );
    try {
      await sendMail(
        existingUser.email,
        `${process.env.APP_NAME} - Update on Your Account Verification`,
        message
      );
    } catch (emailError) {
      logger.error('Error sending email:', emailError); // Log error for internal use
    }

    return res.json({
      status: true,
      message: `Account ${status} successfully.`,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// Get all jobs with filters (categoryId)
export const fetchJobs = async (req: Request, res: Response): Promise<any> => {
  try {
    // Retrieve the authenticated user's ID
    // const userId = (req as AuthenticatedRequest).user?.id;

    const { userId } = req.params;

    // Ensure userId is defined
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
      return;
    }

    // Extract pagination query parameters
    const { page, limit, offset } = getPaginationFields(
      req.query.page as string,
      req.query.limit as string
    );

    let whereCondition: any = {
      creatorId: userId,
    };

    const { rows: jobs, count: totalItems } = await Job.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'user',
        },
        // Adjust alias to match your associations
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Calculate pagination metadata
    const totalPages = getTotalPages(totalItems, limit);

    // Respond with the paginated jobs and metadata
    return res.status(200).json({
      message: 'Jobs retrieved successfully.',
      data: jobs,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ status: false, message: 'Error fetching jobs' });
  }
};

// Vet job post
export const vetJobPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id: jobId } = req.params;
    const { status } = req.body;

    if (!['active', 'closed'].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid status value' });
    }

    const updatedJob = await jobService.vetJobPost(jobId, status);

    // Send email to creator
    // Prepare and send the notification email to creator about vetting
    const message = emailTemplates.vettedJob(updatedJob.user, updatedJob); // Ensure verifyEmailMessage generates the correct email message
    try {
      // Create notification
      await Notification.create({
        message: `Your job post '${updatedJob.title}' is now live.`,
        link: `${process.env.APP_URL}/creator/jobs`,
        userId: updatedJob.creatorId,
      });

      await sendMail(
        updatedJob.user.email,
        `${process.env.APP_NAME} - Your Job Post Status Update`,
        message
      );
    } catch (emailError) {
      logger.error('Error sending email:', emailError); // Log error for internal use
    }

    res.status(200).json({
      success: true,
      message: 'Job vetted successfully.',
      data: updatedJob,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all jobs with filters
export const fetchAllJobs = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    // Retrieve the authenticated user's ID
    // const userId = (req as AuthenticatedRequest).user?.id;

    // Extract pagination query parameters
    const { page, limit, offset } = getPaginationFields(
      req.query.page as string,
      req.query.limit as string
    );

    const { rows: jobs, count: totalItems } = await Job.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
        },
        // Adjust alias to match your associations
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // Calculate pagination metadata
    const totalPages = getTotalPages(totalItems, limit);

    // Respond with the paginated jobs and metadata
    return res.status(200).json({
      message: 'Jobs retrieved successfully.',
      data: jobs,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({ status: false, message: 'Error fetching jobs' });
  }
};
