// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { generateOTP } from "../utils/helpers";
import { sendMail } from "../services/mail.service";
import { emailTemplates } from "../utils/messages";
import JwtService from "../services/jwt.service";
import logger from "../middlewares/logger"; // Adjust the path to your logger.js
import { capitalizeFirstLetter } from "../utils/helpers";
import Admin from "../models/admin";
import Role from "../models/role";

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
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "Server error during logout.",
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
      message: "Server error during profile update.",
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
  } catch (error) {
    logger.error(error);

    res.status(500).json({
      message: "Server error during password update.",
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
  } catch (error) {
    logger.error("Error retrieving sub-admins:", error);
    res
      .status(500)
      .json({ message: `Error retrieving sub-admins: ${error.message}` });
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
  } catch (error) {
    logger.error(error);
    res
      .status(400)
      .json({ message: "Error creating sub-admin: ${error.message}" });
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
  } catch (error) {
    // Log and send the error message in the response
    logger.error("Error updating sub-admin:", error);
    res
      .status(400)
      .json({ message: `Error updating sub-admin: ${error.message}` });
  }
};

export const deactivateOrActivateSubAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { subAdminId } = req.body;

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
  } catch (error) {
    // Log the error and send the response
    logger.error("Error updating sub-admin status:", error);
    res
      .status(500)
      .json({ message: `Error updating sub-admin status: ${error.message}` });
  }
};

export const deleteSubAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { subAdminId } = req.body;

  try {
    const subAdmin = await Admin.findByPk(subAdminId);
    if (!subAdmin) {
      res.status(404).json({ message: "Sub-admin not found" });
      return;
    }

    await subAdmin.destroy();
    res.status(200).json({ message: "Sub-admin deleted successfully" });
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .json({ message: "Error deleting sub-admin: ${error.message}" });
  }
};

export const resendLoginDetailsSubAdmin = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { subAdminId } = req.body;

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
  } catch (error) {
    logger.error(error);
    res
      .status(400)
      .json({ message: "Error resending login details: ${error.message}" });
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

    const role = await Role.create({ name });
    res.status(200).json({ message: "Role created successfully" });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Internal server error" });
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
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ message: "Internal server error" });
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
    }

    role.name = name;
    await role.save();

    res.status(200).json({ message: "Role updated successfully", role });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
