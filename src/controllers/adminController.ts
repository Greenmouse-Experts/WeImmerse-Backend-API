// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { Op, Sequelize, ForeignKeyConstraintError } from "sequelize";
import { generateOTP } from "../utils/helpers";
import { sendMail } from "../services/mail.service";
import { emailTemplates } from "../utils/messages";
import JwtService from "../services/jwt.service";
import logger from "../middlewares/logger"; // Adjust the path to your logger.js
import { capitalizeFirstLetter } from "../utils/helpers";
import Admin from "../models/admin";
import Role from "../models/role";
import Permission from "../models/permission";
import RolePermission from "../models/rolepermission";
import SubscriptionPlan from "../models/subscriptionplan";
import User from "../models/user";
import CourseCategory from "../models/coursecategory";
import AssetCategory from "../models/assetcategory";

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
                message: "Token not provided",
            });
            return;
        }

        // Blacklist the token to prevent further usage
        await JwtService.jwtBlacklistToken(token);

        res.status(200).json({
            message: "Logged out successfully.",
        });
    } catch (error: any) {
        logger.error(error);
        res.status(500).json({
            message: error.message || "Server error during logout.",
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
            res.status(404).json({ message: "Admin not found." });
            return;
        }

        // Check if email is being updated
        if (email && email !== admin.email) {
            // Check if the email already exists for another user
            const emailExists = await Admin.findOne({ where: { email } });
            if (emailExists) {
                res
                    .status(400)
                    .json({ message: "Email is already in use by another user." });
                return;
            }
        }

        // Update admin profile information
        admin.name = name ? capitalizeFirstLetter(name) : admin.name;
        admin.photo = photo || admin.photo;
        admin.email = email || admin.email;

        await admin.save();

        res.status(200).json({
            message: "Profile updated successfully.",
            data: admin,
        });
    } catch (error: any) {
        logger.error("Error updating admin profile:", error);

        res.status(500).json({
            message: error.message || "Server error during profile update.",
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
        const admin = await Admin.scope("auth").findByPk(adminId);
        if (!admin) {
            res.status(404).json({ message: "admin not found." });
            return;
        }

        // Check if the old password is correct
        const isMatch = await admin.checkPassword(oldPassword);
        if (!isMatch) {
            res.status(400).json({ message: "Old password is incorrect." });
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
            logger.error("Error sending email:", emailError); // Log error for internal use
        }

        res.status(200).json({
            message: "Password updated successfully.",
        });
    } catch (error: any) {
        logger.error(error);

        res.status(500).json({
            message: error.message || "Server error during password update.",
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
                    as: "role", // Use the alias defined in the association (if any)
                },
            ],
        });

        if (subAdmins.length === 0) {
            res.status(404).json({ message: "Sub-admins not found" });
            return;
        }

        res
            .status(200)
            .json({ message: "Sub-admins retrieved successfully", data: subAdmins });
    } catch (error: any) {
        logger.error("Error retrieving sub-admins:", error);
        res
            .status(500)
            .json({
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
            res.status(400).json({ message: "Email already in use" });
            return;
        }

        // Generate a random password (you can change this to your desired method)
        const password = Math.random().toString(36).slice(-8);

        const checkRole = await Role.findByPk(roleId);
        if (!checkRole) {
            res.status(404).json({ message: "Role not found" });
            return;
        }

        // Create the sub-admin
        const newSubAdmin = await Admin.create({
            name,
            email,
            password: password,
            roleId,
            status: "active", // Default status
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
            logger.error("Error sending email:", emailError); // Log error for internal use
        }

        res.status(200).json({ message: "Sub Admin created successfully." });
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
            res.status(404).json({ message: "Sub-admin not found" });
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
                    .json({ message: "Email is already in use by another sub-admin." });
                return;
            }
        }

        // Update sub-admin details
        await subAdmin.update({
            name,
            email,
            roleId,
        });

        res.status(200).json({ message: "Sub Admin updated successfully." });
    } catch (error: any) {
        // Log and send the error message in the response
        logger.error("Error updating sub-admin:", error);
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
            res.status(404).json({ message: "Sub-admin not found" });
            return;
        }

        // Toggle status: if active, set to inactive; if inactive, set to active
        const newStatus = subAdmin.status === "active" ? "inactive" : "active";
        subAdmin.status = newStatus;

        // Save the updated status
        await subAdmin.save();

        res
            .status(200)
            .json({ message: `Sub-admin status updated to ${newStatus}.` });
    } catch (error: any) {
        // Log the error and send the response
        logger.error("Error updating sub-admin status:", error);
        res
            .status(500)
            .json({
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
            res.status(404).json({ message: "Sub-admin not found" });
            return;
        }

        await subAdmin.destroy();
        res.status(200).json({ message: "Sub-admin deleted successfully" });
    } catch (error: any) {
        logger.error(error);
        res
            .status(500)
            .json({
                message: error.message || "Error deleting sub-admin: ${error.message}",
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
            res.status(404).json({ message: "Sub-admin not found" });
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
            logger.error("Error sending email:", emailError); // Log error for internal use
        }

        res.status(200).json({ message: "Login details resent successfully" });
    } catch (error: any) {
        logger.error(error);
        res
            .status(500)
            .json({
                message:
                    error.message || "Error resending login details: ${error.message}",
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
            res.status(400).json({ message: "Name is required." });
            return;
        }

        // Check if a role with the same name already exists
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
            res.status(409).json({ message: "Role with this name already exists." });
            return;
        }

        // Create the new role
        const role = await Role.create({ name });
        res.status(200).json({ message: "Role created successfully" });
    } catch (error: any) {
        logger.error("Error creating role:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
        logger.error("Error fetching roles:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
            res.status(400).json({ message: "Name is required." });
            return;
        }

        const role = await Role.findByPk(roleId);

        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }

        // Check if another role with the same name exists
        const existingRole = await Role.findOne({
            where: { name, id: { [Op.ne]: roleId } }, // Exclude the current role ID
        });

        if (existingRole) {
            res
                .status(409)
                .json({ message: "Another role with this name already exists." });
            return;
        }

        // Update the role name
        role.name = name;
        await role.save();

        res.status(200).json({ message: "Role updated successfully", role });
    } catch (error: any) {
        logger.error("Error updating role:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
            include: [{ model: Permission, as: "permissions" }],
        });

        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }

        res.status(200).json({ data: role });
    } catch (error: any) {
        logger.error("Error fetching role permissions:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
            res.status(404).json({ message: "Role or Permission not found" });
            return;
        }

        // Check if the permission is already assigned to the role
        const existingRolePermission = await RolePermission.findOne({
            where: { roleId, permissionId },
        });

        if (existingRolePermission) {
            res
                .status(409)
                .json({ message: "Permission is already assigned to this role" });
            return;
        }

        // Assign permission to role
        await RolePermission.create({ roleId, permissionId });

        res
            .status(200)
            .json({ message: "Permission assigned to role successfully" });
    } catch (error: any) {
        logger.error("Error assigning permission to role:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
            res.status(404).json({ message: "Role not found" });
            return;
        }

        const rolePermission = await RolePermission.findOne({
            where: { roleId, permissionId },
        });

        if (!rolePermission) {
            res.status(404).json({ message: "Permission not found for the role" });
            return;
        }

        await rolePermission.destroy();

        res
            .status(200)
            .json({ message: "Permission removed from role successfully" });
    } catch (error: any) {
        logger.error("Error deleting permission from role:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
            res.status(400).json({ message: "Name is required." });
            return;
        }

        // Check if permission name already exists
        const existingPermission = await Permission.findOne({ where: { name } });
        if (existingPermission) {
            res.status(409).json({ message: "Permission name already exists." });
            return;
        }

        // Create new permission if it doesn't exist
        const permission = await Permission.create({ name });
        res.status(201).json({
            message: "Permission created successfully",
        });
    } catch (error: any) {
        logger.error("Error creating permission:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
        logger.error("Error fetching permissions:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
            res.status(400).json({ message: "Name is required." });
            return;
        }

        const permission = await Permission.findByPk(permissionId);

        if (!permission) {
            res.status(404).json({ message: "Permission not found" });
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
            res.status(409).json({ message: "Permission name already exists." });
            return;
        }

        permission.name = name;
        await permission.save();

        res.status(200).json({ message: "Permission updated successfully" });
    } catch (error: any) {
        logger.error("Error updating permission:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
            res.status(404).json({ message: "Permission not found" });
            return;
        }

        // Delete the permission and associated role_permissions
        await permission.destroy();
        await RolePermission.destroy({ where: { permissionId } });

        res.status(200).json({
            message:
                "Permission and associated role permissions deleted successfully",
        });
    } catch (error: any) {
        logger.error("Error deleting permission:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Get all course categories
export const getCourseCategories = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const categories = await CourseCategory.findAll();
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
        const { name } = req.body;

        // Check if a category with the same name already exists
        const existingCategory = await CourseCategory.findOne({ where: { name } });
        if (existingCategory) {
            res.status(400).json({ message: "A course category with the same name already exists." });
            return;
        }

        const category = await CourseCategory.create({ name });
        res
            .status(200)
            .json({
                message: "Course category created successfully",
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
        const { id, name } = req.body;

        const category = await CourseCategory.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Course category not found" });
            return;
        }

        // Check if another category with the same name exists (exclude the current category)
        const existingCategory = await CourseCategory.findOne({
            where: { name, id: { [Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
        });
        if (existingCategory) {
            res.status(400).json({ message: "Another course category with the same name already exists." });
            return;
        }

        await category.update({ name });
        res
            .status(200)
            .json({
                message: "Course category updated successfully",
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

        const category = await CourseCategory.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Course category not found" });
            return;
        }

        await category.destroy();
        res.status(200).json({ message: "Course category deleted successfully" });
    } catch (error: any) {
        if (error instanceof ForeignKeyConstraintError) {
            res.status(400).json({
                message:
                    "Cannot delete course category plan because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.",
            });
        } else {
            logger.error("Error deleting course category:", error);
            res
                .status(500)
                .json({ message: error.message || "Error deleting course category" });
        }
    }
};

// Get all asset categories
export const getAssetCategories = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const assets = await AssetCategory.findAll();
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
        const { name } = req.body;

        // Check if a category with the same name already exists
        const existingCategory = await AssetCategory.findOne({ where: { name } });
        if (existingCategory) {
            res.status(400).json({ message: "A asset category with the same name already exists." });
            return;
        }

        const category = await AssetCategory.create({ name });
        res
            .status(200)
            .json({
                message: "Asset category created successfully",
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

        const category = await AssetCategory.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Asset category not found" });
            return;
        }

        // Check if another category with the same name exists (exclude the current category)
        const existingCategory = await AssetCategory.findOne({
            where: { name, id: { [Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
        });
        if (existingCategory) {
            res.status(400).json({ message: "Another asset category with the same name already exists." });
            return;
        }

        await category.update({ name });
        res
            .status(200)
            .json({
                message: "Asset category updated successfully",
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

        const category = await AssetCategory.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Asset category not found" });
            return;
        }

        await category.destroy();
        res.status(200).json({ message: "Asset category deleted successfully" });
    } catch (error: any) {
        if (error instanceof ForeignKeyConstraintError) {
            res.status(400).json({
                message:
                    "Cannot delete asset category plan because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.",
            });
        } else {
            logger.error("Error deleting asset category:", error);
            res
                .status(500)
                .json({ message: error.message || "Error deleting asset category" });
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
        logger.error("Error fetching subscription plans:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const createSubscriptionPlan = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {
        name,
        duration,
        price,
        productLimit,
        allowsAuction,
        auctionProductLimit,
    } = req.body;

    try {
        // Check if the subscription plan name already exists
        const existingPlan = await SubscriptionPlan.findOne({ where: { name } });

        if (existingPlan) {
            res
                .status(400)
                .json({ message: "A plan with this name already exists." });
            return;
        }

        // Create the subscription plan
        await SubscriptionPlan.create({
            name,
            duration,
            price,
            productLimit,
            allowsAuction,
            auctionProductLimit,
        });

        res.status(200).json({
            message: "Subscription plan created successfully.",
        });
    } catch (error: any) {
        logger.error("Error creating subscription plan:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const updateSubscriptionPlan = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {
        planId,
        name,
        duration,
        price,
        productLimit,
        allowsAuction,
        auctionProductLimit,
    } = req.body;

    try {
        // Fetch the subscription plan to update
        const plan = await SubscriptionPlan.findByPk(planId);
        if (!plan) {
            res.status(404).json({ message: "Subscription plan not found." });
            return;
        }

        // Prevent name change for Free Plan
        if (plan.name === "Free Plan" && name !== "Free Plan") {
            res
                .status(400)
                .json({ message: "The Free Plan name cannot be changed." });
            return;
        }

        // Check if the new name already exists (ignoring the current plan)
        const existingPlan = await SubscriptionPlan.findOne({
            where: { name, id: { [Op.ne]: planId } },
        });

        if (existingPlan) {
            res
                .status(400)
                .json({ message: "A different plan with this name already exists." });
            return;
        }

        // Update fields
        plan.name = name;
        plan.duration = duration;
        plan.price = price;
        plan.productLimit = productLimit;
        plan.allowsAuction = allowsAuction;
        plan.auctionProductLimit = auctionProductLimit;
        await plan.save();

        res.status(200).json({ message: "Subscription plan updated successfully" });
    } catch (error: any) {
        logger.error("Error updating subscription plan:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
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
            res.status(404).json({ message: "Subscription plan not found." });
            return;
        }

        // Prevent deletion of the Free Plan
        if (plan.name === "Free Plan") {
            res.status(400).json({ message: "The Free Plan cannot be deleted." });
            return;
        }

        // Attempt to delete the plan
        await plan.destroy();
        res
            .status(200)
            .json({ message: "Subscription plan deleted successfully." });
    } catch (error: any) {
        if (error instanceof ForeignKeyConstraintError) {
            res.status(400).json({
                message:
                    "Cannot delete subscription plan because it is currently assigned to one or more vendors. Please reassign or delete these associations before proceeding.",
            });
        } else {
            logger.error("Error deleting subscription plan:", error);
            res
                .status(500)
                .json({ message: error.message || "Error deleting subscription plan" });
        }
    }
};
