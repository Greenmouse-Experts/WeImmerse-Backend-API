"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewPhysicalAsset = exports.getPhysicalAssets = exports.createPhysicalAsset = exports.getAllPhysicalAssets = exports.updateDigitalAssetStatus = exports.deleteDigitalAsset = exports.updateDigitalAsset = exports.viewDigitalAsset = exports.getDigitalAssets = exports.createDigitalAsset = exports.getAllDigitalAssets = exports.deleteJobCategory = exports.updateJobCategory = exports.createJobCategory = exports.getJobCategories = exports.getAllInstitution = exports.getAllStudent = exports.getAllUser = exports.getAllCreator = exports.deleteSubscriptionPlan = exports.updateSubscriptionPlan = exports.createSubscriptionPlan = exports.getAllSubscriptionPlans = exports.deleteAssetCategory = exports.updateAssetCategory = exports.createAssetCategory = exports.getAssetCategories = exports.deleteCourseCategory = exports.updateCourseCategory = exports.createCourseCategory = exports.getCourseCategories = exports.deletePermission = exports.updatePermission = exports.getPermissions = exports.createPermission = exports.deletePermissionFromRole = exports.assignPermissionToRole = exports.viewRolePermissions = exports.updateRole = exports.getRoles = exports.createRole = exports.resendLoginDetailsSubAdmin = exports.deleteSubAdmin = exports.deactivateOrActivateSubAdmin = exports.updateSubAdmin = exports.createSubAdmin = exports.subAdmins = exports.updatePassword = exports.updateProfile = exports.logout = void 0;
exports.updatePhysicalAssetStatus = exports.deletePhysicalAsset = exports.updatePhysicalAsset = void 0;
const sequelize_1 = require("sequelize");
const mail_service_1 = require("../services/mail.service");
const messages_1 = require("../utils/messages");
const jwt_service_1 = __importDefault(require("../services/jwt.service"));
const logger_1 = __importDefault(require("../middlewares/logger")); // Adjust the path to your logger.js
const helpers_1 = require("../utils/helpers");
const admin_1 = __importDefault(require("../models/admin"));
const role_1 = __importDefault(require("../models/role"));
const permission_1 = __importDefault(require("../models/permission"));
const rolepermission_1 = __importDefault(require("../models/rolepermission"));
const subscriptionplan_1 = __importDefault(require("../models/subscriptionplan"));
const user_1 = __importDefault(require("../models/user"));
const coursecategory_1 = __importDefault(require("../models/coursecategory"));
const assetcategory_1 = __importDefault(require("../models/assetcategory"));
const jobcategory_1 = __importDefault(require("../models/jobcategory"));
const physicalasset_1 = __importDefault(require("../models/physicalasset"));
const digitalasset_1 = __importDefault(require("../models/digitalasset"));
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the token from the request
        const token = jwt_service_1.default.jwtGetToken(req);
        if (!token) {
            res.status(400).json({
                message: "Token not provided",
            });
            return;
        }
        // Blacklist the token to prevent further usage
        yield jwt_service_1.default.jwtBlacklistToken(token);
        res.status(200).json({
            message: "Logged out successfully.",
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || "Server error during logout.",
        });
    }
});
exports.logout = logout;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, photo } = req.body;
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id;
        // Fetch the admin by their ID
        const admin = yield admin_1.default.findByPk(adminId);
        if (!admin) {
            res.status(404).json({ message: "Admin not found." });
            return;
        }
        // Check if email is being updated
        if (email && email !== admin.email) {
            // Check if the email already exists for another user
            const emailExists = yield admin_1.default.findOne({ where: { email } });
            if (emailExists) {
                res
                    .status(400)
                    .json({ message: "Email is already in use by another user." });
                return;
            }
        }
        // Update admin profile information
        admin.name = name ? (0, helpers_1.capitalizeFirstLetter)(name) : admin.name;
        admin.photo = photo || admin.photo;
        admin.email = email || admin.email;
        yield admin.save();
        res.status(200).json({
            message: "Profile updated successfully.",
            data: admin,
        });
    }
    catch (error) {
        logger_1.default.error("Error updating admin profile:", error);
        res.status(500).json({
            message: error.message || "Server error during profile update.",
        });
    }
});
exports.updateProfile = updateProfile;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const adminId = (_b = req.admin) === null || _b === void 0 ? void 0 : _b.id; // Using optional chaining to access adminId
    try {
        // Find the admin
        const admin = yield admin_1.default.scope("auth").findByPk(adminId);
        if (!admin) {
            res.status(404).json({ message: "admin not found." });
            return;
        }
        // Check if the old password is correct
        const isMatch = yield admin.checkPassword(oldPassword);
        if (!isMatch) {
            res.status(400).json({ message: "Old password is incorrect." });
            return;
        }
        // Update the password
        admin.password = yield admin_1.default.hashPassword(newPassword); // Hash the new password before saving
        yield admin.save();
        // Send password reset notification email
        const message = messages_1.emailTemplates.adminPasswordResetNotification(admin);
        try {
            yield (0, mail_service_1.sendMail)(admin.email, `${process.env.APP_NAME} - Password Reset Notification`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        res.status(200).json({
            message: "Password updated successfully.",
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || "Server error during password update.",
        });
    }
});
exports.updatePassword = updatePassword;
const subAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email } = req.query; // Get the search query parameters
        // Build the where condition dynamically based on the presence of name and email
        const whereCondition = {};
        if (name) {
            whereCondition.name = {
                [sequelize_1.Op.like]: `%${name}%`, // Use LIKE for case-insensitive match
            };
        }
        if (email) {
            whereCondition.email = {
                [sequelize_1.Op.like]: `%${email}%`, // Use LIKE for case-insensitive match
            };
        }
        // Fetch sub-admins along with their roles, applying the search conditions
        const subAdmins = yield admin_1.default.findAll({
            where: whereCondition,
            include: [
                {
                    model: role_1.default,
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
    }
    catch (error) {
        logger_1.default.error("Error retrieving sub-admins:", error);
        res
            .status(500)
            .json({
            message: error.message || `Error retrieving sub-admins: ${error}`,
        });
    }
});
exports.subAdmins = subAdmins;
const createSubAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, roleId } = req.body;
        // Check if the email already exists
        const existingSubAdmin = yield admin_1.default.findOne({ where: { email } });
        if (existingSubAdmin) {
            res.status(400).json({ message: "Email already in use" });
            return;
        }
        // Generate a random password (you can change this to your desired method)
        const password = Math.random().toString(36).slice(-8);
        const checkRole = yield role_1.default.findByPk(roleId);
        if (!checkRole) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        // Create the sub-admin
        const newSubAdmin = yield admin_1.default.create({
            name,
            email,
            password: password,
            roleId,
            status: "active", // Default status
        });
        // Send mail
        let message = messages_1.emailTemplates.subAdminCreated(newSubAdmin, password);
        try {
            yield (0, mail_service_1.sendMail)(email, `${process.env.APP_NAME} - Your Sub-Admin Login Details`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        res.status(200).json({ message: "Sub Admin created successfully." });
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({ message: error.message || `Error creating sub-admin: ${error}` });
    }
});
exports.createSubAdmin = createSubAdmin;
const updateSubAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subAdminId, name, email, roleId } = req.body;
    try {
        // Find the sub-admin by their ID
        const subAdmin = yield admin_1.default.findByPk(subAdminId);
        if (!subAdmin) {
            res.status(404).json({ message: "Sub-admin not found" });
            return;
        }
        // Check if the email is already in use by another sub-admin
        if (email && email !== subAdmin.email) {
            // Only check if the email has changed
            const existingAdmin = yield admin_1.default.findOne({
                where: {
                    email,
                    id: { [sequelize_1.Op.ne]: subAdminId }, // Ensure it's not the same sub-admin
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
        yield subAdmin.update({
            name,
            email,
            roleId,
        });
        res.status(200).json({ message: "Sub Admin updated successfully." });
    }
    catch (error) {
        // Log and send the error message in the response
        logger_1.default.error("Error updating sub-admin:", error);
        res
            .status(500)
            .json({ message: error.message || `Error updating sub-admin: ${error}` });
    }
});
exports.updateSubAdmin = updateSubAdmin;
const deactivateOrActivateSubAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subAdminId = req.query.subAdminId;
    try {
        // Find the sub-admin by ID
        const subAdmin = yield admin_1.default.findByPk(subAdminId);
        if (!subAdmin) {
            res.status(404).json({ message: "Sub-admin not found" });
            return;
        }
        // Toggle status: if active, set to inactive; if inactive, set to active
        const newStatus = subAdmin.status === "active" ? "inactive" : "active";
        subAdmin.status = newStatus;
        // Save the updated status
        yield subAdmin.save();
        res
            .status(200)
            .json({ message: `Sub-admin status updated to ${newStatus}.` });
    }
    catch (error) {
        // Log the error and send the response
        logger_1.default.error("Error updating sub-admin status:", error);
        res
            .status(500)
            .json({
            message: error.message || `Error updating sub-admin status: ${error}`,
        });
    }
});
exports.deactivateOrActivateSubAdmin = deactivateOrActivateSubAdmin;
const deleteSubAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subAdminId = req.query.subAdminId;
    try {
        const subAdmin = yield admin_1.default.findByPk(subAdminId);
        if (!subAdmin) {
            res.status(404).json({ message: "Sub-admin not found" });
            return;
        }
        yield subAdmin.destroy();
        res.status(200).json({ message: "Sub-admin deleted successfully" });
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({
            message: error.message || "Error deleting sub-admin: ${error.message}",
        });
    }
});
exports.deleteSubAdmin = deleteSubAdmin;
const resendLoginDetailsSubAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subAdminId = req.query.subAdminId;
    try {
        const subAdmin = yield admin_1.default.findByPk(subAdminId);
        if (!subAdmin) {
            res.status(404).json({ message: "Sub-admin not found" });
            return;
        }
        // Generate a new password (or reuse the existing one)
        const password = Math.random().toString(36).slice(-8);
        // Update the password in the database
        subAdmin.password = password;
        yield subAdmin.save();
        // Send mail
        let message = messages_1.emailTemplates.subAdminCreated(subAdmin, password);
        try {
            yield (0, mail_service_1.sendMail)(subAdmin.email, `${process.env.APP_NAME} - Your New Login Details`, message);
        }
        catch (emailError) {
            logger_1.default.error("Error sending email:", emailError); // Log error for internal use
        }
        res.status(200).json({ message: "Login details resent successfully" });
    }
    catch (error) {
        logger_1.default.error(error);
        res
            .status(500)
            .json({
            message: error.message || "Error resending login details: ${error.message}",
        });
    }
});
exports.resendLoginDetailsSubAdmin = resendLoginDetailsSubAdmin;
// Roles
// Create a new Role
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ message: "Name is required." });
            return;
        }
        // Check if a role with the same name already exists
        const existingRole = yield role_1.default.findOne({ where: { name } });
        if (existingRole) {
            res.status(409).json({ message: "Role with this name already exists." });
            return;
        }
        // Create the new role
        const role = yield role_1.default.create({ name });
        res.status(200).json({ message: "Role created successfully" });
    }
    catch (error) {
        logger_1.default.error("Error creating role:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.createRole = createRole;
// Get all Roles
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield role_1.default.findAll();
        res.status(200).json({ data: roles });
    }
    catch (error) {
        logger_1.default.error("Error fetching roles:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.getRoles = getRoles;
// Update an existing Role
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleId, name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ message: "Name is required." });
            return;
        }
        const role = yield role_1.default.findByPk(roleId);
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        // Check if another role with the same name exists
        const existingRole = yield role_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: roleId } }, // Exclude the current role ID
        });
        if (existingRole) {
            res
                .status(409)
                .json({ message: "Another role with this name already exists." });
            return;
        }
        // Update the role name
        role.name = name;
        yield role.save();
        res.status(200).json({ message: "Role updated successfully", role });
    }
    catch (error) {
        logger_1.default.error("Error updating role:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.updateRole = updateRole;
// View a Role's Permissions
const viewRolePermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleId = req.query.roleId;
    try {
        const role = yield role_1.default.findByPk(roleId, {
            include: [{ model: permission_1.default, as: "permissions" }],
        });
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        res.status(200).json({ data: role });
    }
    catch (error) {
        logger_1.default.error("Error fetching role permissions:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.viewRolePermissions = viewRolePermissions;
// Assign a New Permission to a Role
const assignPermissionToRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleId, permissionId } = req.body;
    try {
        // Ensure role and permission exist
        const role = yield role_1.default.findByPk(roleId);
        const permission = yield permission_1.default.findByPk(permissionId);
        if (!role || !permission) {
            res.status(404).json({ message: "Role or Permission not found" });
            return;
        }
        // Check if the permission is already assigned to the role
        const existingRolePermission = yield rolepermission_1.default.findOne({
            where: { roleId, permissionId },
        });
        if (existingRolePermission) {
            res
                .status(409)
                .json({ message: "Permission is already assigned to this role" });
            return;
        }
        // Assign permission to role
        yield rolepermission_1.default.create({ roleId, permissionId });
        res
            .status(200)
            .json({ message: "Permission assigned to role successfully" });
    }
    catch (error) {
        logger_1.default.error("Error assigning permission to role:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.assignPermissionToRole = assignPermissionToRole;
// Delete a Permission from a Role
const deletePermissionFromRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleId, permissionId } = req.body;
    try {
        const role = yield role_1.default.findOne({
            where: { id: roleId },
        });
        if (!role) {
            res.status(404).json({ message: "Role not found" });
            return;
        }
        const rolePermission = yield rolepermission_1.default.findOne({
            where: { roleId, permissionId },
        });
        if (!rolePermission) {
            res.status(404).json({ message: "Permission not found for the role" });
            return;
        }
        yield rolePermission.destroy();
        res
            .status(200)
            .json({ message: "Permission removed from role successfully" });
    }
    catch (error) {
        logger_1.default.error("Error deleting permission from role:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.deletePermissionFromRole = deletePermissionFromRole;
// Permission
// Create a new Permission
const createPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ message: "Name is required." });
            return;
        }
        // Check if permission name already exists
        const existingPermission = yield permission_1.default.findOne({ where: { name } });
        if (existingPermission) {
            res.status(409).json({ message: "Permission name already exists." });
            return;
        }
        // Create new permission if it doesn't exist
        const permission = yield permission_1.default.create({ name });
        res.status(201).json({
            message: "Permission created successfully",
        });
    }
    catch (error) {
        logger_1.default.error("Error creating permission:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.createPermission = createPermission;
// Get all Permissions
const getPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = yield permission_1.default.findAll();
        res.status(200).json({ data: permissions });
    }
    catch (error) {
        logger_1.default.error("Error fetching permissions:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.getPermissions = getPermissions;
// Update an existing Permission
const updatePermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { permissionId, name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ message: "Name is required." });
            return;
        }
        const permission = yield permission_1.default.findByPk(permissionId);
        if (!permission) {
            res.status(404).json({ message: "Permission not found" });
            return;
        }
        // Check if the new name exists in another permission
        const existingPermission = yield permission_1.default.findOne({
            where: {
                name,
                id: { [sequelize_1.Op.ne]: permissionId }, // Exclude current permission
            },
        });
        if (existingPermission) {
            res.status(409).json({ message: "Permission name already exists." });
            return;
        }
        permission.name = name;
        yield permission.save();
        res.status(200).json({ message: "Permission updated successfully" });
    }
    catch (error) {
        logger_1.default.error("Error updating permission:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.updatePermission = updatePermission;
// Delete a Permission and cascade delete from role_permissions
const deletePermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissionId = req.query.permissionId;
        // Find the permission
        const permission = yield permission_1.default.findByPk(permissionId);
        if (!permission) {
            res.status(404).json({ message: "Permission not found" });
            return;
        }
        // Delete the permission and associated role_permissions
        yield permission.destroy();
        yield rolepermission_1.default.destroy({ where: { permissionId } });
        res.status(200).json({
            message: "Permission and associated role permissions deleted successfully",
        });
    }
    catch (error) {
        logger_1.default.error("Error deleting permission:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.deletePermission = deletePermission;
// Get all course categories
const getCourseCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield coursecategory_1.default.findAll();
        res.status(200).json({ data: categories });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getCourseCategories = getCourseCategories;
// Create a new course category
const createCourseCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        // Check if a category with the same name already exists
        const existingCategory = yield coursecategory_1.default.findOne({ where: { name } });
        if (existingCategory) {
            res.status(400).json({ message: "A course category with the same name already exists." });
            return;
        }
        const category = yield coursecategory_1.default.create({ name });
        res
            .status(200)
            .json({
            message: "Course category created successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createCourseCategory = createCourseCategory;
// Update an existing course category
const updateCourseCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = req.body;
        const category = yield coursecategory_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Course category not found" });
            return;
        }
        // Check if another category with the same name exists (exclude the current category)
        const existingCategory = yield coursecategory_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
        });
        if (existingCategory) {
            res.status(400).json({ message: "Another course category with the same name already exists." });
            return;
        }
        yield category.update({ name });
        res
            .status(200)
            .json({
            message: "Course category updated successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateCourseCategory = updateCourseCategory;
// Delete a course category
const deleteCourseCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const category = yield coursecategory_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Course category not found" });
            return;
        }
        yield category.destroy();
        res.status(200).json({ message: "Course category deleted successfully" });
    }
    catch (error) {
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            res.status(400).json({
                message: "Cannot delete course category plan because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.",
            });
        }
        else {
            logger_1.default.error("Error deleting course category:", error);
            res
                .status(500)
                .json({ message: error.message || "Error deleting course category" });
        }
    }
});
exports.deleteCourseCategory = deleteCourseCategory;
// Get all asset categories
const getAssetCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assets = yield assetcategory_1.default.findAll();
        res.status(200).json({ data: assets });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAssetCategories = getAssetCategories;
// Create a new asset category
const createAssetCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        // Check if a category with the same name already exists
        const existingCategory = yield assetcategory_1.default.findOne({ where: { name } });
        if (existingCategory) {
            res.status(400).json({ message: "A asset category with the same name already exists." });
            return;
        }
        const category = yield assetcategory_1.default.create({ name });
        res
            .status(200)
            .json({
            message: "Asset category created successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createAssetCategory = createAssetCategory;
// Update an existing asset category
const updateAssetCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = req.body;
        const category = yield assetcategory_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Asset category not found" });
            return;
        }
        // Check if another category with the same name exists (exclude the current category)
        const existingCategory = yield assetcategory_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
        });
        if (existingCategory) {
            res.status(400).json({ message: "Another asset category with the same name already exists." });
            return;
        }
        yield category.update({ name });
        res
            .status(200)
            .json({
            message: "Asset category updated successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateAssetCategory = updateAssetCategory;
// Delete a asset category
const deleteAssetCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const category = yield assetcategory_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Asset category not found" });
            return;
        }
        yield category.destroy();
        res.status(200).json({ message: "Asset category deleted successfully" });
    }
    catch (error) {
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            res.status(400).json({
                message: "Cannot delete asset category plan because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.",
            });
        }
        else {
            logger_1.default.error("Error deleting asset category:", error);
            res
                .status(500)
                .json({ message: error.message || "Error deleting asset category" });
        }
    }
});
exports.deleteAssetCategory = deleteAssetCategory;
// Subscription Plan
const getAllSubscriptionPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query; // Get the name from query parameters
        const queryOptions = {}; // Initialize query options
        // If a name is provided, add a condition to the query
        if (name) {
            queryOptions.where = {
                name: {
                    [sequelize_1.Op.like]: `%${name}%`, // Use a partial match for name
                },
            };
        }
        const plans = yield subscriptionplan_1.default.findAll(queryOptions); // Use query options
        res.status(200).json({ data: plans });
    }
    catch (error) {
        logger_1.default.error("Error fetching subscription plans:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.getAllSubscriptionPlans = getAllSubscriptionPlans;
const createSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, duration, price, productLimit, allowsAuction, auctionProductLimit, } = req.body;
    try {
        // Check if the subscription plan name already exists
        const existingPlan = yield subscriptionplan_1.default.findOne({ where: { name } });
        if (existingPlan) {
            res
                .status(400)
                .json({ message: "A plan with this name already exists." });
            return;
        }
        // Create the subscription plan
        yield subscriptionplan_1.default.create({
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
    }
    catch (error) {
        logger_1.default.error("Error creating subscription plan:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.createSubscriptionPlan = createSubscriptionPlan;
const updateSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { planId, name, duration, price, productLimit, allowsAuction, auctionProductLimit, } = req.body;
    try {
        // Fetch the subscription plan to update
        const plan = yield subscriptionplan_1.default.findByPk(planId);
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
        const existingPlan = yield subscriptionplan_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: planId } },
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
        yield plan.save();
        res.status(200).json({ message: "Subscription plan updated successfully" });
    }
    catch (error) {
        logger_1.default.error("Error updating subscription plan:", error);
        res.status(500).json({ message: error.message || "Internal server error" });
    }
});
exports.updateSubscriptionPlan = updateSubscriptionPlan;
const deleteSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planId = req.query.planId;
    try {
        // Fetch the subscription plan
        const plan = yield subscriptionplan_1.default.findByPk(planId);
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
        yield plan.destroy();
        res
            .status(200)
            .json({ message: "Subscription plan deleted successfully." });
    }
    catch (error) {
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            res.status(400).json({
                message: "Cannot delete subscription plan because it is currently assigned to one or more vendors. Please reassign or delete these associations before proceeding.",
            });
        }
        else {
            logger_1.default.error("Error deleting subscription plan:", error);
            res
                .status(500)
                .json({ message: error.message || "Error deleting subscription plan" });
        }
    }
});
exports.deleteSubscriptionPlan = deleteSubscriptionPlan;
const getAllCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status, email } = req.query; // Extract filter parameters from query
        // Build search conditions
        const searchConditions = { accountType: "creator" }; // Filter by accountType
        if (name) {
            searchConditions.name = { [sequelize_1.Op.like]: `%${name}%` }; // Partial match for name
        }
        if (status) {
            searchConditions.status = status; // Exact match for status
        }
        if (email) {
            searchConditions.email = { [sequelize_1.Op.like]: `%${email}%` }; // Partial match for email
        }
        // Fetch creators with optional filters
        const creators = yield user_1.default.findAll({
            where: searchConditions,
            order: [["createdAt", "DESC"]], // Order by creation date descending
        });
        res.status(200).json({ data: creators });
    }
    catch (error) {
        logger_1.default.error("Error fetching creators:", error);
        res.status(500).json({ message: error.message || "Failed to fetch creators." });
    }
});
exports.getAllCreator = getAllCreator;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status, email } = req.query; // Extract filter parameters from query
        // Build search conditions
        const searchConditions = { accountType: "user" }; // Filter by accountType
        if (name) {
            searchConditions.name = { [sequelize_1.Op.like]: `%${name}%` }; // Partial match for name
        }
        if (status) {
            searchConditions.status = status; // Exact match for status
        }
        if (email) {
            searchConditions.email = { [sequelize_1.Op.like]: `%${email}%` }; // Partial match for email
        }
        // Fetch users with optional filters
        const users = yield user_1.default.findAll({
            where: searchConditions,
            order: [["createdAt", "DESC"]], // Order by creation date descending
        });
        res.status(200).json({ data: users });
    }
    catch (error) {
        logger_1.default.error("Error fetching general users:", error);
        res.status(500).json({ message: error.message || "Failed to fetch general users." });
    }
});
exports.getAllUser = getAllUser;
const getAllStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status, email } = req.query; // Extract filter parameters from query
        // Build search conditions
        const searchConditions = { accountType: "student" }; // Filter by accountType
        if (name) {
            searchConditions.name = { [sequelize_1.Op.like]: `%${name}%` }; // Partial match for name
        }
        if (status) {
            searchConditions.status = status; // Exact match for status
        }
        if (email) {
            searchConditions.email = { [sequelize_1.Op.like]: `%${email}%` }; // Partial match for email
        }
        // Fetch students with optional filters
        const students = yield user_1.default.findAll({
            where: searchConditions,
            order: [["createdAt", "DESC"]], // Order by creation date descending
        });
        res.status(200).json({ data: students });
    }
    catch (error) {
        logger_1.default.error("Error fetching students:", error);
        res.status(500).json({ message: error.message || "Failed to fetch students." });
    }
});
exports.getAllStudent = getAllStudent;
const getAllInstitution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status, email } = req.query; // Extract filter parameters from query
        // Build search conditions
        const searchConditions = { accountType: "institution" }; // Filter by accountType
        if (name) {
            searchConditions.name = { [sequelize_1.Op.like]: `%${name}%` }; // Partial match for name
        }
        if (status) {
            searchConditions.status = status; // Exact match for status
        }
        if (email) {
            searchConditions.email = { [sequelize_1.Op.like]: `%${email}%` }; // Partial match for email
        }
        // Fetch institutions with optional filters
        const institutions = yield user_1.default.findAll({
            where: searchConditions,
            order: [["createdAt", "DESC"]], // Order by creation date descending
        });
        res.status(200).json({ data: institutions });
    }
    catch (error) {
        logger_1.default.error("Error fetching institutions:", error);
        res.status(500).json({ message: error.message || "Failed to fetch institutions." });
    }
});
exports.getAllInstitution = getAllInstitution;
// Job Categories
const getJobCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield jobcategory_1.default.findAll();
        res.status(200).json({ data: jobs });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getJobCategories = getJobCategories;
const createJobCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        // Check if a category with the same name already exists
        const existingCategory = yield jobcategory_1.default.findOne({ where: { name } });
        if (existingCategory) {
            res.status(400).json({ message: "A job category with the same name already exists." });
            return;
        }
        const category = yield jobcategory_1.default.create({ name });
        res
            .status(200)
            .json({
            message: "Job category created successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createJobCategory = createJobCategory;
const updateJobCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = req.body;
        const category = yield jobcategory_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Job category not found" });
            return;
        }
        // Check if another category with the same name exists (exclude the current category)
        const existingCategory = yield jobcategory_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
        });
        if (existingCategory) {
            res.status(400).json({ message: "Another job category with the same name already exists." });
            return;
        }
        yield category.update({ name });
        res
            .status(200)
            .json({
            message: "Job category updated successfully",
            data: category,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateJobCategory = updateJobCategory;
const deleteJobCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const category = yield jobcategory_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: "Job category not found" });
            return;
        }
        yield category.destroy();
        res.status(200).json({ message: "Asset category deleted successfully" });
    }
    catch (error) {
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            res.status(400).json({
                message: "Cannot delete job category because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.",
            });
        }
        else {
            logger_1.default.error("Error deleting job category:", error);
            res
                .status(500)
                .json({ message: error.message || "Error deleting job category" });
        }
    }
});
exports.deleteJobCategory = deleteJobCategory;
// Digital Asset
const getAllDigitalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetName, pricingType, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {};
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        if (pricingType) {
            searchConditions.pricingType = pricingType;
        }
        if (status) {
            searchConditions.status = status;
        }
        // Fetch assets with optional search criteria
        const assets = yield digitalasset_1.default.findAll({
            where: searchConditions,
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({
            data: assets
        });
    }
    catch (error) {
        logger_1.default.error("Error fetching digital assets:", error);
        res.status(500).json({
            message: error.message || "Failed to fetch digital assets"
        });
    }
});
exports.getAllDigitalAssets = getAllDigitalAssets;
const createDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { categoryId } = req.body;
        const adminId = (_c = req.admin) === null || _c === void 0 ? void 0 : _c.id;
        // Category check
        const category = yield assetcategory_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }
        // Ensure the creatorId is included in the request payload
        const digitalAssetData = Object.assign(Object.assign({}, req.body), { creatorId: adminId, categoryId: category.id, status: "published" });
        // Create the DigitalAsset
        const asset = yield digitalasset_1.default.create(digitalAssetData);
        res.status(200).json({
            message: "Digital Asset created successfully",
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error("Error creating Digital Asset:", error);
        res.status(500).json({
            error: error.message || "Failed to create Digital Asset",
        });
    }
});
exports.createDigitalAsset = createDigitalAsset;
const getDigitalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const adminId = (_d = req.admin) === null || _d === void 0 ? void 0 : _d.id;
    try {
        const { assetName, pricingType, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {
            creatorId: adminId,
        };
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        if (pricingType) {
            searchConditions.pricingType = pricingType;
        }
        if (status) {
            searchConditions.status = status;
        }
        // Fetch assets with optional search criteria
        const assets = yield digitalasset_1.default.findAll({
            where: searchConditions,
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({ data: assets });
    }
    catch (error) {
        logger_1.default.error("Error fetching digital assets:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch Digital Assets" });
    }
});
exports.getDigitalAssets = getDigitalAssets;
const viewDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query; // Extract search parameters
        // Fetch asset with optional search criteria
        const asset = yield digitalasset_1.default.findOne({
            where: { id },
            include: [
                {
                    model: assetcategory_1.default,
                    as: "assetCategory",
                    attributes: ["id", "name"], // You can specify the fields you want to include
                },
                {
                    model: user_1.default,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: admin_1.default,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                            model: role_1.default,
                            as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({ data: asset });
    }
    catch (error) {
        logger_1.default.error("Error fetching digital asset:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch Digital Asset" });
    }
});
exports.viewDigitalAsset = viewDigitalAsset;
const updateDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, categoryId } = req.body; // ID is passed in the request body
    try {
        // Category check
        const category = yield assetcategory_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }
        // Find the Digital Asset by ID
        const asset = yield digitalasset_1.default.findByPk(id);
        if (!asset) {
            res.status(404).json({ message: "Digital Asset not found" });
            return;
        }
        // Update the Digital Asset with new data
        yield asset.update(Object.assign(Object.assign({}, req.body), { categoryId: category.id }));
        res.status(200).json({
            message: "Digital Asset updated successfully",
        });
    }
    catch (error) {
        logger_1.default.error("Error updating Digital Asset:", error);
        res.status(500).json({ error: "Failed to update Digital Asset" });
    }
});
exports.updateDigitalAsset = updateDigitalAsset;
const deleteDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        // Find the Digital Asset by ID
        const asset = yield digitalasset_1.default.findByPk(id);
        // If the asset is not found, return a 404 response
        if (!asset) {
            res.status(404).json({ message: "Digital Asset not found" });
            return;
        }
        // Delete the asset
        yield asset.destroy();
        // Return success response
        res.status(200).json({ message: "Digital Asset deleted successfully" });
    }
    catch (error) {
        logger_1.default.error("Error deleting Digital Asset:", error);
        res.status(500).json({ error: "Failed to delete Digital Asset" });
    }
});
exports.deleteDigitalAsset = deleteDigitalAsset;
const updateDigitalAssetStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetId, status, adminNote } = req.body; // Extract status and adminNote from request body
        // Validate status
        if (!["published", "unpublished"].includes(status)) {
            res.status(400).json({
                message: "Invalid status. Allowed values are 'published' or 'unpublished'.",
            });
            return;
        }
        // Ensure adminNote is provided if status is 'unpublished'
        if (status === "unpublished" && (!adminNote || adminNote.trim() === "")) {
            res.status(400).json({
                message: "Admin note is required when status is 'unpublished'.",
            });
            return;
        }
        // Find the asset by ID
        const asset = yield digitalasset_1.default.findByPk(assetId);
        if (!asset) {
            res.status(404).json({
                message: "Asset not found.",
            });
            return;
        }
        // Update the asset's status and adminNote
        yield asset.update({ status, adminNote: status === "unpublished" ? adminNote : null });
        res.status(200).json({
            message: "Asset status updated successfully.",
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error("Error updating asset status:", error);
        res.status(500).json({
            message: error.message || "Failed to update asset status.",
        });
    }
});
exports.updateDigitalAssetStatus = updateDigitalAssetStatus;
// Physical Asset
const getAllPhysicalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetName, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {};
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        if (status) {
            searchConditions.status = status;
        }
        // Fetch assets with optional search criteria
        const assets = yield physicalasset_1.default.findAll({
            where: searchConditions,
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({
            data: assets,
        });
    }
    catch (error) {
        logger_1.default.error("Error fetching physical assets:", error);
        res.status(500).json({
            message: error.message || "Failed to fetch physical assets",
        });
    }
});
exports.getAllPhysicalAssets = getAllPhysicalAssets;
const createPhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { categoryId } = req.body;
        const adminId = (_e = req.admin) === null || _e === void 0 ? void 0 : _e.id; // Extract user ID from authenticated request
        // Category check
        const category = yield assetcategory_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }
        // Ensure the creatorId is included in the request payload
        const physicalAssetData = Object.assign(Object.assign({}, req.body), { creatorId: adminId, categoryId: category.id, status: "published" });
        // Create the PhysicalAsset
        const asset = yield physicalasset_1.default.create(physicalAssetData);
        res.status(200).json({
            message: "Physical Asset created successfully",
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error("Error creating Physical Asset:", error);
        res.status(500).json({
            error: error.message || "Failed to create Physical Asset",
        });
    }
});
exports.createPhysicalAsset = createPhysicalAsset;
const getPhysicalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    const adminId = (_f = req.admin) === null || _f === void 0 ? void 0 : _f.id; // Extract authenticated user's ID
    try {
        const { assetName, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {
            creatorId: adminId,
        };
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        if (status) {
            searchConditions.status = status;
        }
        // Fetch assets with optional search criteria
        const assets = yield physicalasset_1.default.findAll({
            where: searchConditions,
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({ data: assets });
    }
    catch (error) {
        logger_1.default.error("Error fetching physical assets:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch physical Assets" });
    }
});
exports.getPhysicalAssets = getPhysicalAssets;
const viewPhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query; // Extract search parameters
        // Fetch asset with optional search criteria
        const asset = yield physicalasset_1.default.findOne({
            where: { id },
            include: [
                {
                    model: assetcategory_1.default,
                    as: "assetCategory",
                    attributes: ["id", "name"], // You can specify the fields you want to include
                },
                {
                    model: user_1.default,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: admin_1.default,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                            model: role_1.default,
                            as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({ data: asset });
    }
    catch (error) {
        logger_1.default.error("Error fetching physical asset:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch physical asset" });
    }
});
exports.viewPhysicalAsset = viewPhysicalAsset;
const updatePhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, categoryId } = req.body; // ID is passed in the request body
    try {
        // Category check
        const category = yield assetcategory_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }
        // Find the Physical Asset by ID
        const asset = yield physicalasset_1.default.findByPk(id);
        if (!asset) {
            res.status(404).json({ message: "Physical Asset not found" });
            return;
        }
        // Update the Physical Asset with new data
        yield asset.update(Object.assign(Object.assign({}, req.body), { categoryId: category.id }));
        res.status(200).json({
            message: "Physical Asset updated successfully",
        });
    }
    catch (error) {
        logger_1.default.error("Error updating physical Asset:", error);
        res.status(500).json({ error: "Failed to update physical Asset" });
    }
});
exports.updatePhysicalAsset = updatePhysicalAsset;
const deletePhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        // Find the Physical Asset by ID
        const asset = yield physicalasset_1.default.findByPk(id);
        // If the asset is not found, return a 404 response
        if (!asset) {
            res.status(404).json({ message: "Physical Asset not found" });
            return;
        }
        // Delete the asset
        yield asset.destroy();
        // Return success response
        res.status(200).json({ message: "Physical Asset deleted successfully" });
    }
    catch (error) {
        logger_1.default.error("Error deleting physical asset:", error);
        res.status(500).json({ error: "Failed to delete physical asset" });
    }
});
exports.deletePhysicalAsset = deletePhysicalAsset;
const updatePhysicalAssetStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetId, status, adminNote } = req.body; // Extract status and adminNote from request body
        // Validate status
        if (!["published", "unpublished"].includes(status)) {
            res.status(400).json({
                message: "Invalid status. Allowed values are 'published' or 'unpublished'.",
            });
            return;
        }
        // Ensure adminNote is provided if status is 'unpublished'
        if (status === "unpublished" && (!adminNote || adminNote.trim() === "")) {
            res.status(400).json({
                message: "Admin note is required when status is 'unpublished'.",
            });
            return;
        }
        // Find the asset by ID
        const asset = yield physicalasset_1.default.findByPk(assetId);
        if (!asset) {
            res.status(404).json({
                message: "Asset not found.",
            });
            return;
        }
        // Update the asset's status and adminNote
        yield asset.update({ status, adminNote: status === "unpublished" ? adminNote : null });
        res.status(200).json({
            message: "Asset status updated successfully.",
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error("Error updating asset status:", error);
        res.status(500).json({
            message: error.message || "Failed to update asset status.",
        });
    }
});
exports.updatePhysicalAssetStatus = updatePhysicalAssetStatus;
//# sourceMappingURL=adminController.js.map