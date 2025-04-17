"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createPhysicalAsset = exports.getAllPhysicalAssets = exports.updateDigitalAssetStatus = exports.deleteDigitalAsset = exports.updateDigitalAsset = exports.viewDigitalAsset = exports.getDigitalAssets = exports.createDigitalAsset = exports.getAllDigitalAssets = exports.deleteJobCategory = exports.updateJobCategory = exports.createJobCategory = exports.getJobCategories = exports.getSingleUser = exports.getAllInstitution = exports.getAllStudent = exports.getAllUser = exports.getAllCreator = exports.deleteSubscriptionPlan = exports.updateSubscriptionPlan = exports.createSubscriptionPlan = exports.getSubscriptionPlan = exports.getAllSubscriptionPlans = exports.deleteAssetCategory = exports.updateAssetCategory = exports.createAssetCategory = exports.getAssetCategories = exports.deleteCourseCategory = exports.updateCourseCategory = exports.createCourseCategory = exports.getCourseCategories = exports.deletePermission = exports.updatePermission = exports.getPermissions = exports.createPermission = exports.deletePermissionFromRole = exports.assignPermissionToRole = exports.viewRolePermissions = exports.updateRole = exports.getRoles = exports.createRole = exports.resendLoginDetailsSubAdmin = exports.deleteSubAdmin = exports.deactivateOrActivateSubAdmin = exports.updateSubAdmin = exports.createSubAdmin = exports.subAdmins = exports.updatePassword = exports.updateProfile = exports.logout = void 0;
exports.fetchAllJobs = exports.vetJobPost = exports.fetchJobs = exports.vetAccount = exports.reviewJobPost = exports.getAllCourses = exports.unpublishCourse = exports.publishCourse = exports.updatePhysicalAssetStatus = exports.deletePhysicalAsset = exports.updatePhysicalAsset = exports.viewPhysicalAsset = exports.getPhysicalAssets = void 0;
const sequelize_1 = require("sequelize");
const helpers_1 = require("../utils/helpers");
const mail_service_1 = require("../services/mail.service");
const messages_1 = require("../utils/messages");
const jwt_service_1 = __importDefault(require("../services/jwt.service"));
const logger_1 = __importDefault(require("../middlewares/logger")); // Adjust the path to your logger.js
const helpers_2 = require("../utils/helpers");
const admin_1 = __importDefault(require("../models/admin"));
const role_1 = __importDefault(require("../models/role"));
const permission_1 = __importDefault(require("../models/permission"));
const rolepermission_1 = __importDefault(require("../models/rolepermission"));
const subscriptionplan_1 = __importDefault(require("../models/subscriptionplan"));
const user_1 = __importDefault(require("../models/user"));
const physicalasset_1 = __importDefault(require("../models/physicalasset"));
const digitalasset_1 = __importDefault(require("../models/digitalasset"));
const course_1 = __importStar(require("../models/course"));
const job_1 = __importDefault(require("../models/job"));
const sequelize_service_1 = __importDefault(require("../services/sequelize.service"));
const job_service_1 = __importDefault(require("../services/job.service"));
const kycdocument_1 = __importDefault(require("../models/kycdocument"));
const kycverification_1 = __importDefault(require("../models/kycverification"));
const wallet_1 = __importDefault(require("../models/wallet"));
const withdrawalaccount_1 = __importDefault(require("../models/withdrawalaccount"));
const category_1 = __importStar(require("../models/category"));
const notification_1 = __importDefault(require("../models/notification"));
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get the token from the request
        const token = jwt_service_1.default.jwtGetToken(req);
        if (!token) {
            res.status(400).json({
                message: 'Token not provided',
            });
            return;
        }
        // Blacklist the token to prevent further usage
        yield jwt_service_1.default.jwtBlacklistToken(token);
        res.status(200).json({
            message: 'Logged out successfully.',
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'Server error during logout.',
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
            res.status(404).json({ message: 'Admin not found.' });
            return;
        }
        // Check if email is being updated
        if (email && email !== admin.email) {
            // Check if the email already exists for another user
            const emailExists = yield admin_1.default.findOne({ where: { email } });
            if (emailExists) {
                res
                    .status(400)
                    .json({ message: 'Email is already in use by another user.' });
                return;
            }
        }
        // Update admin profile information
        admin.name = name ? (0, helpers_2.capitalizeFirstLetter)(name) : admin.name;
        admin.photo = photo || admin.photo;
        admin.email = email || admin.email;
        yield admin.save();
        res.status(200).json({
            message: 'Profile updated successfully.',
            data: admin,
        });
    }
    catch (error) {
        logger_1.default.error('Error updating admin profile:', error);
        res.status(500).json({
            message: error.message || 'Server error during profile update.',
        });
    }
});
exports.updateProfile = updateProfile;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id; // Using optional chaining to access adminId
    try {
        // Find the admin
        const admin = yield admin_1.default.scope('auth').findByPk(adminId);
        if (!admin) {
            res.status(404).json({ message: 'admin not found.' });
            return;
        }
        // Check if the old password is correct
        const isMatch = yield admin.checkPassword(oldPassword);
        if (!isMatch) {
            res.status(400).json({ message: 'Old password is incorrect.' });
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
            logger_1.default.error('Error sending email:', emailError); // Log error for internal use
        }
        res.status(200).json({
            message: 'Password updated successfully.',
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'Server error during password update.',
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
                    model: role_1.default, // Include the Role model in the query
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
    }
    catch (error) {
        logger_1.default.error('Error retrieving sub-admins:', error);
        res.status(500).json({
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
            res.status(400).json({ message: 'Email already in use' });
            return;
        }
        // Generate a random password (you can change this to your desired method)
        const password = Math.random().toString(36).slice(-8);
        const checkRole = yield role_1.default.findByPk(roleId);
        if (!checkRole) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        // Create the sub-admin
        const newSubAdmin = yield admin_1.default.create({
            name,
            email,
            password: password,
            roleId,
            status: 'active', // Default status
        });
        // Send mail
        let message = messages_1.emailTemplates.subAdminCreated(newSubAdmin, password);
        try {
            yield (0, mail_service_1.sendMail)(email, `${process.env.APP_NAME} - Your Sub-Admin Login Details`, message);
        }
        catch (emailError) {
            logger_1.default.error('Error sending email:', emailError); // Log error for internal use
        }
        res.status(200).json({ message: 'Sub Admin created successfully.' });
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
            res.status(404).json({ message: 'Sub-admin not found' });
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
                    .json({ message: 'Email is already in use by another sub-admin.' });
                return;
            }
        }
        // Update sub-admin details
        yield subAdmin.update({
            name,
            email,
            roleId,
        });
        res.status(200).json({ message: 'Sub Admin updated successfully.' });
    }
    catch (error) {
        // Log and send the error message in the response
        logger_1.default.error('Error updating sub-admin:', error);
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
            res.status(404).json({ message: 'Sub-admin not found' });
            return;
        }
        // Toggle status: if active, set to inactive; if inactive, set to active
        const newStatus = subAdmin.status === 'active' ? 'inactive' : 'active';
        subAdmin.status = newStatus;
        // Save the updated status
        yield subAdmin.save();
        res
            .status(200)
            .json({ message: `Sub-admin status updated to ${newStatus}.` });
    }
    catch (error) {
        // Log the error and send the response
        logger_1.default.error('Error updating sub-admin status:', error);
        res.status(500).json({
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
            res.status(404).json({ message: 'Sub-admin not found' });
            return;
        }
        yield subAdmin.destroy();
        res.status(200).json({ message: 'Sub-admin deleted successfully' });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'Error deleting sub-admin: ${error.message}',
        });
    }
});
exports.deleteSubAdmin = deleteSubAdmin;
const resendLoginDetailsSubAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subAdminId = req.query.subAdminId;
    try {
        const subAdmin = yield admin_1.default.findByPk(subAdminId);
        if (!subAdmin) {
            res.status(404).json({ message: 'Sub-admin not found' });
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
            logger_1.default.error('Error sending email:', emailError); // Log error for internal use
        }
        res.status(200).json({ message: 'Login details resent successfully' });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || 'Error resending login details: ${error.message}',
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
            res.status(400).json({ message: 'Name is required.' });
            return;
        }
        // Check if a role with the same name already exists
        const existingRole = yield role_1.default.findOne({ where: { name } });
        if (existingRole) {
            res.status(409).json({ message: 'Role with this name already exists.' });
            return;
        }
        // Create the new role
        const role = yield role_1.default.create({ name });
        res.status(200).json({ message: 'Role created successfully' });
    }
    catch (error) {
        logger_1.default.error('Error creating role:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
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
        logger_1.default.error('Error fetching roles:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});
exports.getRoles = getRoles;
// Update an existing Role
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roleId, name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ message: 'Name is required.' });
            return;
        }
        const role = yield role_1.default.findByPk(roleId);
        if (!role) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        // Check if another role with the same name exists
        const existingRole = yield role_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: roleId } }, // Exclude the current role ID
        });
        if (existingRole) {
            res
                .status(409)
                .json({ message: 'Another role with this name already exists.' });
            return;
        }
        // Update the role name
        role.name = name;
        yield role.save();
        res.status(200).json({ message: 'Role updated successfully', role });
    }
    catch (error) {
        logger_1.default.error('Error updating role:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});
exports.updateRole = updateRole;
// View a Role's Permissions
const viewRolePermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleId = req.query.roleId;
    try {
        const role = yield role_1.default.findByPk(roleId, {
            include: [{ model: permission_1.default, as: 'permissions' }],
        });
        if (!role) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        res.status(200).json({ data: role });
    }
    catch (error) {
        logger_1.default.error('Error fetching role permissions:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
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
            res.status(404).json({ message: 'Role or Permission not found' });
            return;
        }
        // Check if the permission is already assigned to the role
        const existingRolePermission = yield rolepermission_1.default.findOne({
            where: { roleId, permissionId },
        });
        if (existingRolePermission) {
            res
                .status(409)
                .json({ message: 'Permission is already assigned to this role' });
            return;
        }
        // Assign permission to role
        yield rolepermission_1.default.create({ roleId, permissionId });
        res
            .status(200)
            .json({ message: 'Permission assigned to role successfully' });
    }
    catch (error) {
        logger_1.default.error('Error assigning permission to role:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
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
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        const rolePermission = yield rolepermission_1.default.findOne({
            where: { roleId, permissionId },
        });
        if (!rolePermission) {
            res.status(404).json({ message: 'Permission not found for the role' });
            return;
        }
        yield rolePermission.destroy();
        res
            .status(200)
            .json({ message: 'Permission removed from role successfully' });
    }
    catch (error) {
        logger_1.default.error('Error deleting permission from role:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});
exports.deletePermissionFromRole = deletePermissionFromRole;
// Permission
// Create a new Permission
const createPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ message: 'Name is required.' });
            return;
        }
        // Check if permission name already exists
        const existingPermission = yield permission_1.default.findOne({ where: { name } });
        if (existingPermission) {
            res.status(409).json({ message: 'Permission name already exists.' });
            return;
        }
        // Create new permission if it doesn't exist
        const permission = yield permission_1.default.create({ name });
        res.status(201).json({
            message: 'Permission created successfully',
        });
    }
    catch (error) {
        logger_1.default.error('Error creating permission:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
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
        logger_1.default.error('Error fetching permissions:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});
exports.getPermissions = getPermissions;
// Update an existing Permission
const updatePermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { permissionId, name } = req.body;
    try {
        if (!name) {
            res.status(400).json({ message: 'Name is required.' });
            return;
        }
        const permission = yield permission_1.default.findByPk(permissionId);
        if (!permission) {
            res.status(404).json({ message: 'Permission not found' });
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
            res.status(409).json({ message: 'Permission name already exists.' });
            return;
        }
        permission.name = name;
        yield permission.save();
        res.status(200).json({ message: 'Permission updated successfully' });
    }
    catch (error) {
        logger_1.default.error('Error updating permission:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
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
            res.status(404).json({ message: 'Permission not found' });
            return;
        }
        // Delete the permission and associated role_permissions
        yield permission.destroy();
        yield rolepermission_1.default.destroy({ where: { permissionId } });
        res.status(200).json({
            message: 'Permission and associated role permissions deleted successfully',
        });
    }
    catch (error) {
        logger_1.default.error('Error deleting permission:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});
exports.deletePermission = deletePermission;
// Get all course categories
const getCourseCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, children = 0 } = req.query;
        const includeChildren = req.query.includeChildren === 'true';
        const options = {
            where: Object.assign(Object.assign({}, (type && { type })), { parentId: Boolean(+children) ? { [sequelize_1.Op.ne]: null } : null }),
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
        const categories = yield category_1.default.findAll(options);
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
        const { name, description } = req.body;
        // Check if a category with the same name already exists
        const existingCategory = yield category_1.default.findOne({ where: { name } });
        if (existingCategory) {
            res.status(400).json({
                message: 'A course category with the same name already exists.',
            });
            return;
        }
        const category = yield category_1.default.create({
            name,
            description,
            type: category_1.CategoryTypes.COURSE,
            isActive: true,
        });
        res.status(200).json({
            message: 'Course category created successfully',
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
        const { id, name, description } = req.body;
        const category = yield category_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: 'Course category not found' });
            return;
        }
        // Check if another category with the same name exists (exclude the current category)
        const existingCategory = yield category_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
        });
        if (existingCategory) {
            res.status(400).json({
                message: 'Another course category with the same name already exists.',
            });
            return;
        }
        yield category.update({ name, description });
        res.status(200).json({
            message: 'Course category updated successfully',
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
        const category = yield category_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: 'Course category not found' });
            return;
        }
        yield category.destroy();
        res.status(200).json({ message: 'Course category deleted successfully' });
    }
    catch (error) {
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            res.status(400).json({
                message: 'Cannot delete course category plan because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.',
            });
        }
        else {
            logger_1.default.error('Error deleting course category:', error);
            res
                .status(500)
                .json({ message: error.message || 'Error deleting course category' });
        }
    }
});
exports.deleteCourseCategory = deleteCourseCategory;
// Get all asset categories
const getAssetCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assets = yield category_1.default.findAll();
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
        const { name, description } = req.body;
        // Check if a category with the same name already exists
        const existingCategory = yield category_1.default.findOne({ where: { name } });
        if (existingCategory) {
            res.status(400).json({
                message: 'A asset category with the same name already exists.',
            });
            return;
        }
        const category = yield category_1.default.create({
            name,
            description,
            type: category_1.CategoryTypes.ASSET,
            isActive: true,
        });
        res.status(200).json({
            message: 'Asset category created successfully',
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
        const category = yield category_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: 'Asset category not found' });
            return;
        }
        // Check if another category with the same name exists (exclude the current category)
        const existingCategory = yield category_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
        });
        if (existingCategory) {
            res.status(400).json({
                message: 'Another asset category with the same name already exists.',
            });
            return;
        }
        yield category.update({ name });
        res.status(200).json({
            message: 'Asset category updated successfully',
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
        const category = yield category_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: 'Asset category not found' });
            return;
        }
        yield category.destroy();
        res.status(200).json({ message: 'Asset category deleted successfully' });
    }
    catch (error) {
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            res.status(400).json({
                message: 'Cannot delete asset category plan because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.',
            });
        }
        else {
            logger_1.default.error('Error deleting asset category:', error);
            res
                .status(500)
                .json({ message: error.message || 'Error deleting asset category' });
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
        logger_1.default.error('Error fetching subscription plans:', error);
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
});
exports.getAllSubscriptionPlans = getAllSubscriptionPlans;
// Subscription Plan
const getSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the name from query parameters
        const plan = yield subscriptionplan_1.default.findOne({ where: { id } }); // Use query options
        res.status(200).json({ status: true, data: plan });
    }
    catch (error) {
        logger_1.default.error('Error fetching subscription plan details:', error);
        res.status(500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.getSubscriptionPlan = getSubscriptionPlan;
const createSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, duration, price, currency, period, features } = req.body;
    try {
        // Check if the subscription plan name already exists
        const existingPlan = yield subscriptionplan_1.default.findOne({ where: { name } });
        if (existingPlan) {
            res.status(400).json({
                status: false,
                message: 'A plan with this name already exists.',
            });
            return;
        }
        // Create the subscription plan
        yield subscriptionplan_1.default.create({
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
    }
    catch (error) {
        logger_1.default.error('Error creating subscription plan:', error);
        res.status(500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.createSubscriptionPlan = createSubscriptionPlan;
const updateSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { planId, name, price, period, currency } = req.body;
    try {
        // Fetch the subscription plan to update
        const plan = yield subscriptionplan_1.default.findByPk(planId);
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
        const existingPlan = yield subscriptionplan_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: planId } },
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
        yield plan.save();
        res.status(200).json({
            status: true,
            message: 'Subscription plan updated successfully',
        });
    }
    catch (error) {
        logger_1.default.error('Error updating subscription plan:', error);
        res.status(500).json({
            status: false,
            message: error.message || 'Internal server error',
        });
    }
});
exports.updateSubscriptionPlan = updateSubscriptionPlan;
const deleteSubscriptionPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const planId = req.query.planId;
    try {
        // Fetch the subscription plan
        const plan = yield subscriptionplan_1.default.findByPk(planId);
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
        yield plan.destroy();
        res.status(200).json({
            status: true,
            message: 'Subscription plan deleted successfully.',
        });
    }
    catch (error) {
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            res.status(400).json({
                status: false,
                message: 'Cannot delete subscription plan because it is currently assigned to one or more vendors. Please reassign or delete these associations before proceeding.',
            });
        }
        else {
            logger_1.default.error('Error deleting subscription plan:', error);
            res.status(500).json({
                status: false,
                message: error.message || 'Error deleting subscription plan',
            });
        }
    }
});
exports.deleteSubscriptionPlan = deleteSubscriptionPlan;
const getAllCreator = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status, email } = req.query; // Extract filter parameters from query
        // Build search conditions
        const searchConditions = { accountType: 'creator' }; // Filter by accountType
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
            order: [['createdAt', 'DESC']], // Order by creation date descending
        });
        res.status(200).json({ data: creators });
    }
    catch (error) {
        logger_1.default.error('Error fetching creators:', error);
        res
            .status(500)
            .json({ message: error.message || 'Failed to fetch creators.' });
    }
});
exports.getAllCreator = getAllCreator;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status, email } = req.query; // Extract filter parameters from query
        // Build search conditions
        const searchConditions = { accountType: 'user' }; // Filter by accountType
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
            order: [['createdAt', 'DESC']], // Order by creation date descending
        });
        res.status(200).json({ data: users });
    }
    catch (error) {
        logger_1.default.error('Error fetching general users:', error);
        res
            .status(500)
            .json({ message: error.message || 'Failed to fetch general users.' });
    }
});
exports.getAllUser = getAllUser;
const getAllStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status, email } = req.query; // Extract filter parameters from query
        // Build search conditions
        const searchConditions = { accountType: 'student' }; // Filter by accountType
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
            order: [['createdAt', 'DESC']], // Order by creation date descending
        });
        res.status(200).json({ status: true, data: students });
    }
    catch (error) {
        logger_1.default.error('Error fetching students:', error);
        res.status(500).json({
            status: false,
            message: error.message || 'Failed to fetch students.',
        });
    }
});
exports.getAllStudent = getAllStudent;
const getAllInstitution = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status, email } = req.query; // Extract filter parameters from query
        // Build search conditions
        const searchConditions = { accountType: 'institution' }; // Filter by accountType
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
            order: [['createdAt', 'DESC']], // Order by creation date descending
        });
        res.status(200).json({ status: true, data: institutions });
    }
    catch (error) {
        logger_1.default.error('Error fetching institutions:', error);
        res.status(500).json({
            status: false,
            message: error.message || 'Failed to fetch institutions.',
        });
    }
});
exports.getAllInstitution = getAllInstitution;
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user_details = yield user_1.default.findOne({
            where: { id },
            include: [
                { model: kycdocument_1.default, as: 'kyc_docs' },
                { model: kycverification_1.default, as: 'kyc_verification' },
                { model: wallet_1.default, as: 'wallet' },
                { model: withdrawalaccount_1.default, as: 'withdrawalAccount' },
            ],
        });
        return res.json({
            status: true,
            data: user_details,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching single user details:', error);
        res.status(500).json({
            message: error.message || 'Failed to fetch single user details.',
        });
    }
});
exports.getSingleUser = getSingleUser;
// Job Categories
const getJobCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobs = yield category_1.default.findAll();
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
        const existingCategory = yield category_1.default.findOne({ where: { name } });
        if (existingCategory) {
            res
                .status(400)
                .json({ message: 'A job category with the same name already exists.' });
            return;
        }
        const category = yield category_1.default.create({
            name,
            type: category_1.CategoryTypes.JOB,
            isActive: true,
        });
        res.status(200).json({
            message: 'Job category created successfully',
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
        const { id, name, description } = req.body;
        const category = yield category_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: 'Job category not found' });
            return;
        }
        // Check if another category with the same name exists (exclude the current category)
        const existingCategory = yield category_1.default.findOne({
            where: { name, id: { [sequelize_1.Op.ne]: id } }, // Use Op.ne (not equal) to exclude the current category by ID
        });
        if (existingCategory) {
            res.status(400).json({
                message: 'Another job category with the same name already exists.',
            });
            return;
        }
        yield category.update({ name, description });
        res.status(200).json({
            message: 'Job category updated successfully',
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
        const category = yield category_1.default.findByPk(id);
        if (!category) {
            res.status(404).json({ message: 'Job category not found' });
            return;
        }
        yield category.destroy();
        res.status(200).json({ message: 'Asset category deleted successfully' });
    }
    catch (error) {
        if (error instanceof sequelize_1.ForeignKeyConstraintError) {
            res.status(400).json({
                message: 'Cannot delete job category because it is currently assigned to one or more models. Please reassign or delete these associations before proceeding.',
            });
        }
        else {
            logger_1.default.error('Error deleting job category:', error);
            res
                .status(500)
                .json({ message: error.message || 'Error deleting job category' });
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
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({
            data: assets,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching digital assets:', error);
        res.status(500).json({
            message: error.message || 'Failed to fetch digital assets',
        });
    }
});
exports.getAllDigitalAssets = getAllDigitalAssets;
const createDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryId } = req.body;
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id;
        // Category check
        const category = yield category_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Ensure the creatorId is included in the request payload
        const digitalAssetData = Object.assign(Object.assign({}, req.body), { creatorId: adminId, categoryId: category.id, status: 'published' });
        // Create the DigitalAsset
        const asset = yield digitalasset_1.default.create(digitalAssetData);
        res.status(200).json({
            message: 'Digital Asset created successfully',
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error('Error creating Digital Asset:', error);
        res.status(500).json({
            error: error.message || 'Failed to create Digital Asset',
        });
    }
});
exports.createDigitalAsset = createDigitalAsset;
const getDigitalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id;
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
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({ data: assets });
    }
    catch (error) {
        logger_1.default.error('Error fetching digital assets:', error);
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch Digital Assets' });
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
                    model: category_1.default, // Including the related Category model
                    as: 'assetCategory', // Alias for the relationship (adjust if necessary)
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
                {
                    model: user_1.default,
                    as: 'user',
                    attributes: ['id', 'accountType', 'name', 'email'],
                },
                {
                    model: admin_1.default,
                    as: 'admin',
                    attributes: ['id', 'name', 'email'],
                    include: [
                        {
                            model: role_1.default, // Assuming you've imported the Role model
                            as: 'role', // Make sure this alias matches the one you used in the association
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({ data: asset });
    }
    catch (error) {
        logger_1.default.error('Error fetching digital asset:', error);
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch Digital Asset' });
    }
});
exports.viewDigitalAsset = viewDigitalAsset;
const updateDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, categoryId } = req.body; // ID is passed in the request body
    try {
        // Category check
        const category = yield category_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Find the Digital Asset by ID
        const asset = yield digitalasset_1.default.findByPk(id);
        if (!asset) {
            res.status(404).json({ message: 'Digital Asset not found' });
            return;
        }
        // Update the Digital Asset with new data
        yield asset.update(Object.assign(Object.assign({}, req.body), { categoryId: category.id }));
        res.status(200).json({
            message: 'Digital Asset updated successfully',
        });
    }
    catch (error) {
        logger_1.default.error('Error updating Digital Asset:', error);
        res.status(500).json({ error: 'Failed to update Digital Asset' });
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
            res.status(404).json({ message: 'Digital Asset not found' });
            return;
        }
        // Delete the asset
        yield asset.destroy();
        // Return success response
        res.status(200).json({ message: 'Digital Asset deleted successfully' });
    }
    catch (error) {
        logger_1.default.error('Error deleting Digital Asset:', error);
        res.status(500).json({ error: 'Failed to delete Digital Asset' });
    }
});
exports.deleteDigitalAsset = deleteDigitalAsset;
const updateDigitalAssetStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetId, status, adminNote } = req.body; // Extract status and adminNote from request body
        // Validate status
        if (!['published', 'unpublished'].includes(status)) {
            res.status(400).json({
                message: "Invalid status. Allowed values are 'published' or 'unpublished'.",
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
        const asset = yield digitalasset_1.default.findByPk(assetId);
        if (!asset) {
            res.status(404).json({
                message: 'Asset not found.',
            });
            return;
        }
        // Update the asset's status and adminNote
        yield asset.update({
            status,
            adminNote: status === 'unpublished' ? adminNote : null,
        });
        // Send email notification to admin
        if (status === 'published') {
            // Create notification
            yield notification_1.default.create({
                message: `Your digital asset '${asset.assetName}' has been published.`,
                link: `${process.env.APP_URL}/creator/assets`,
                userId: asset.creatorId,
            });
            try {
                const messageToSubscriber = yield messages_1.emailTemplates.sendDigitalAssetPublishedNotification(process.env.ADMIN_EMAIL, asset.assetName);
                // Send email
                yield (0, mail_service_1.sendMail)(process.env.ADMIN_EMAIL, `${process.env.APP_NAME} - Your digital asset has been published`, messageToSubscriber);
            }
            catch (emailError) {
                console.error('Failed to send digital asset publish notification:', emailError);
                // Continue even if email fails
            }
        }
        else {
            // Create notification
            yield notification_1.default.create({
                message: `Your digital asset '${asset.assetName}' has been unpublished.`,
                link: `${process.env.APP_URL}/creator/assets`,
                userId: asset.creatorId,
            });
            try {
                const messageToSubscriber = yield messages_1.emailTemplates.sendDigitalAssetUnpublishedNotification(process.env.ADMIN_EMAIL, asset.assetName);
                // Send email
                yield (0, mail_service_1.sendMail)(process.env.ADMIN_EMAIL, `${process.env.APP_NAME} - Your digital asset has been unpublished`, messageToSubscriber);
            }
            catch (emailError) {
                console.error('Failed to send digital asset unpublish notification:', emailError);
                // Continue even if email fails
            }
        }
        res.status(200).json({
            message: 'Digital Asset status updated successfully.',
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error('Error updating asset status:', error);
        res.status(500).json({
            message: error.message || 'Failed to update asset status.',
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
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({
            data: assets,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching physical assets:', error);
        res.status(500).json({
            message: error.message || 'Failed to fetch physical assets',
        });
    }
});
exports.getAllPhysicalAssets = getAllPhysicalAssets;
const createPhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { categoryId } = req.body;
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id; // Extract user ID from authenticated request
        // Category check
        const category = yield category_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Ensure the creatorId is included in the request payload
        const physicalAssetData = Object.assign(Object.assign({}, req.body), { creatorId: adminId, categoryId: category.id, status: 'published' });
        // Create the PhysicalAsset
        const asset = yield physicalasset_1.default.create(physicalAssetData);
        res.status(200).json({
            message: 'Physical Asset created successfully',
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error('Error creating Physical Asset:', error);
        res.status(500).json({
            error: error.message || 'Failed to create Physical Asset',
        });
    }
});
exports.createPhysicalAsset = createPhysicalAsset;
const getPhysicalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a.id; // Extract authenticated user's ID
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
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({ data: assets });
    }
    catch (error) {
        logger_1.default.error('Error fetching physical assets:', error);
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch physical Assets' });
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
                    model: category_1.default, // Including the related AssetCategory model
                    as: 'assetCategory', // Alias for the relationship (adjust if necessary)
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
                {
                    model: user_1.default,
                    as: 'user',
                    attributes: ['id', 'accountType', 'name', 'email'],
                },
                {
                    model: admin_1.default,
                    as: 'admin',
                    attributes: ['id', 'name', 'email'],
                    include: [
                        {
                            model: role_1.default, // Assuming you've imported the Role model
                            as: 'role', // Make sure this alias matches the one you used in the association
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']], // Sort by creation date descending
        });
        res.status(200).json({ data: asset });
    }
    catch (error) {
        logger_1.default.error('Error fetching physical asset:', error);
        res
            .status(500)
            .json({ error: error.message || 'Failed to fetch physical asset' });
    }
});
exports.viewPhysicalAsset = viewPhysicalAsset;
const updatePhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, categoryId } = req.body; // ID is passed in the request body
    try {
        // Category check
        const category = yield category_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: 'Category not found in our database.',
            });
            return;
        }
        // Find the Physical Asset by ID
        const asset = yield physicalasset_1.default.findByPk(id);
        if (!asset) {
            res.status(404).json({ message: 'Physical Asset not found' });
            return;
        }
        // Update the Physical Asset with new data
        yield asset.update(Object.assign(Object.assign({}, req.body), { categoryId: category.id }));
        res.status(200).json({
            message: 'Physical Asset updated successfully',
        });
    }
    catch (error) {
        logger_1.default.error('Error updating physical Asset:', error);
        res.status(500).json({ error: 'Failed to update physical Asset' });
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
            res.status(404).json({ message: 'Physical Asset not found' });
            return;
        }
        // Delete the asset
        yield asset.destroy();
        // Return success response
        res.status(200).json({ message: 'Physical Asset deleted successfully' });
    }
    catch (error) {
        logger_1.default.error('Error deleting physical asset:', error);
        res.status(500).json({ error: 'Failed to delete physical asset' });
    }
});
exports.deletePhysicalAsset = deletePhysicalAsset;
const updatePhysicalAssetStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetId, status, adminNote } = req.body; // Extract status and adminNote from request body
        // Validate status
        if (!['published', 'unpublished'].includes(status)) {
            res.status(400).json({
                message: "Invalid status. Allowed values are 'published' or 'unpublished'.",
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
        const asset = yield physicalasset_1.default.findByPk(assetId);
        if (!asset) {
            res.status(404).json({
                message: 'Asset not found.',
            });
            return;
        }
        // Update the asset's status and adminNote
        yield asset.update({
            status,
            adminNote: status === 'unpublished' ? adminNote : null,
        });
        // Send email notification to admin
        if (status === 'published') {
            // Create notification
            yield notification_1.default.create({
                message: `Your physical asset '${asset.assetName}' has been published.`,
                link: `${process.env.APP_URL}/creator/assets`,
                userId: asset.creatorId,
            });
            try {
                const messageToSubscriber = yield messages_1.emailTemplates.sendPhysicalAssetPublishedNotification(process.env.ADMIN_EMAIL, asset.assetName);
                // Send email
                yield (0, mail_service_1.sendMail)(process.env.ADMIN_EMAIL, `${process.env.APP_NAME} - Your physical asset has been published`, messageToSubscriber);
            }
            catch (emailError) {
                console.error('Failed to send physical asset publish notification:', emailError);
                // Continue even if email fails
            }
        }
        else {
            // Create notification
            yield notification_1.default.create({
                message: `Your physical asset '${asset.assetName}' has been unpublished.`,
                link: `${process.env.APP_URL}/creator/assets`,
                userId: asset.creatorId,
            });
            try {
                const messageToSubscriber = yield messages_1.emailTemplates.sendPhysicalAssetUnpublishedNotification(process.env.ADMIN_EMAIL, asset.assetName);
                // Send email
                yield (0, mail_service_1.sendMail)(process.env.ADMIN_EMAIL, `${process.env.APP_NAME} - Your physical asset has been unpublished`, messageToSubscriber);
            }
            catch (emailError) {
                console.error('Failed to send physical asset unpublish notification:', emailError);
                // Continue even if email fails
            }
        }
        res.status(200).json({
            message: 'Asset status updated successfully.',
            data: asset,
        });
    }
    catch (error) {
        logger_1.default.error('Error updating asset status:', error);
        res.status(500).json({
            message: error.message || 'Failed to update asset status.',
        });
    }
});
exports.updatePhysicalAssetStatus = updatePhysicalAssetStatus;
// Course
// Publish course
const publishCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const courseId = req.params.id;
        // Find the course by its ID
        const course = yield course_1.default.findOne({
            where: { id: courseId },
            include: [{ model: user_1.default, as: 'creator' }],
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
        const missingFields = [];
        for (const field of requiredFields) {
            if (course[field] === null ||
                course[field] === undefined) {
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
        course.status = course_1.CourseStatus.LIVE;
        yield course.save();
        // Create notification
        yield notification_1.default.create({
            message: `Your course '${course.title}' is now live.`,
            link: `${process.env.APP_URL}/creator/courses`,
            userId: (_a = course.creator) === null || _a === void 0 ? void 0 : _a.id,
        });
        // Send email notification to creator
        try {
            const messageToSubscriber = yield messages_1.emailTemplates.sendCoursePublishedNotification((_b = course.creator) === null || _b === void 0 ? void 0 : _b.email, course.title);
            // Send email
            yield (0, mail_service_1.sendMail)((_c = course.creator) === null || _c === void 0 ? void 0 : _c.email, `${process.env.APP_NAME} - Your Course Has Been Published 🎉`, messageToSubscriber);
        }
        catch (emailError) {
            console.error('Failed to send publish notification:', emailError);
            // Continue even if email fails
        }
        res.status(200).json({
            message: 'Course is now live.',
            data: course,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while publishing the course.',
        });
    }
});
exports.publishCourse = publishCourse;
// unpublish course
const unpublishCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const courseId = req.params.id;
        // Find the course by its ID
        const course = yield course_1.default.findOne({
            where: { id: courseId },
            include: [{ model: user_1.default, as: 'creator' }],
        });
        if (!course) {
            res.status(404).json({
                message: 'Course not found in our database.',
            });
            return;
        }
        if (course.status === course_1.CourseStatus.UNPUBLISHED) {
            return res.status(400).json({
                status: false,
                message: 'Course has already been unpublished',
            });
        }
        // Update the course status to published (true)
        course.status = course_1.CourseStatus.UNPUBLISHED;
        yield course.save();
        // Create notification
        yield notification_1.default.create({
            message: `Your course '${course.title}' has been unpublished by the admin.`,
            link: `${process.env.APP_URL}/creator/courses`,
            userId: (_a = course.creator) === null || _a === void 0 ? void 0 : _a.id,
        });
        // Send email notification to creator
        try {
            const messageToSubscriber = yield messages_1.emailTemplates.sendCoursePublishedNotification((_b = course.creator) === null || _b === void 0 ? void 0 : _b.email, course.title);
            // Send email
            yield (0, mail_service_1.sendMail)((_c = course.creator) === null || _c === void 0 ? void 0 : _c.email, `${process.env.APP_NAME} - Your Course Has Been Published 🎉`, messageToSubscriber);
        }
        catch (emailError) {
            console.error('Failed to send publish notification:', emailError);
            // Continue even if email fails
        }
        res.status(200).json({
            message: 'Course is now unpublished.',
            data: course,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while publishing the course.',
        });
    }
});
exports.unpublishCourse = unpublishCourse;
// Get all courses with filters (categoryId)
const getAllCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve the authenticated user's ID
        const userId = req.adminId;
        const { categoryId } = req.query;
        // Ensure userId is defined
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: User ID is missing.' });
            return;
        }
        // Extract pagination query parameters
        const { page, limit, offset } = (0, helpers_1.getPaginationFields)(req.query.page, req.query.limit);
        let whereCondition = {};
        const { rows: courses, count: totalItems } = yield course_1.default.findAndCountAll({
            where: whereCondition,
            include: [
                { model: user_1.default, as: 'creator' },
                { model: category_1.default, as: 'courseCategory' },
                // Adjust alias to match your associations
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        // Calculate pagination metadata
        const totalPages = (0, helpers_1.getTotalPages)(totalItems, limit);
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Error fetching courses',
        });
    }
});
exports.getAllCourses = getAllCourses;
// Job Post
// Review job post
const reviewJobPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobPostId = req.params.id;
        const { status } = req.body;
        // Find the job by its ID
        const job = yield job_1.default.findByPk(jobPostId);
        if (!job) {
            return res.status(404).json({
                message: 'Job not found in our database.',
            });
        }
        // Update job
        yield job.update(Object.assign({}, (status && { status })));
        // Send email to creator about the review
        return res.status(200).json({
            message: 'Job reviewed successfully.',
            data: job,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'An error occurred while review the job post.',
        });
    }
});
exports.reviewJobPost = reviewJobPost;
/**
 * Creator/Institution account vetting
 * @param req
 * @param res
 */
const vetAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reason, status } = req.body;
    const { userId } = req.params;
    // Start transaction
    const transaction = yield sequelize_service_1.default.connection.transaction();
    try {
        // Check if email already exists
        const existingUser = yield user_1.default.findOne({
            where: { id: userId },
            transaction, // Pass transaction in options
        });
        if (!existingUser) {
            return res.status(404).json({ message: 'Account not found' });
        }
        // Determine if approved or not
        const verified = status == helpers_1.AccountVettingStatus.APPROVED ? true : false;
        // Update
        yield user_1.default.update(Object.assign({ verified }, (!verified && { reason })), { where: { id: userId } });
        // Prepare and send notify account owner about verification
        const message = messages_1.emailTemplates.vettedAccount(existingUser, status, reason, '');
        try {
            yield (0, mail_service_1.sendMail)(existingUser.email, `${process.env.APP_NAME} - Update on Your Account Verification`, message);
        }
        catch (emailError) {
            logger_1.default.error('Error sending email:', emailError); // Log error for internal use
        }
        return res.json({
            status: true,
            message: `Account ${status} successfully.`,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: error.message });
    }
});
exports.vetAccount = vetAccount;
// Get all jobs with filters (categoryId)
const fetchJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { page, limit, offset } = (0, helpers_1.getPaginationFields)(req.query.page, req.query.limit);
        let whereCondition = {
            creatorId: userId,
        };
        const { rows: jobs, count: totalItems } = yield job_1.default.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: user_1.default,
                    as: 'user',
                },
                // Adjust alias to match your associations
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        // Calculate pagination metadata
        const totalPages = (0, helpers_1.getTotalPages)(totalItems, limit);
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error fetching jobs' });
    }
});
exports.fetchJobs = fetchJobs;
// Vet job post
const vetJobPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: jobId } = req.params;
        const { status } = req.body;
        if (!['active', 'closed'].includes(status)) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid status value' });
        }
        const updatedJob = yield job_service_1.default.vetJobPost(jobId, status);
        // Send email to creator
        // Prepare and send the notification email to creator about vetting
        const message = messages_1.emailTemplates.vettedJob(updatedJob.user, updatedJob); // Ensure verifyEmailMessage generates the correct email message
        try {
            yield (0, mail_service_1.sendMail)(updatedJob.user.email, `${process.env.APP_NAME} - Your Job Post Status Update`, message);
        }
        catch (emailError) {
            logger_1.default.error('Error sending email:', emailError); // Log error for internal use
        }
        res.status(200).json({
            success: true,
            message: 'Job vetted successfully.',
            data: updatedJob,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.vetJobPost = vetJobPost;
// Get all jobs with filters
const fetchAllJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Retrieve the authenticated user's ID
        // const userId = (req as AuthenticatedRequest).user?.id;
        // Extract pagination query parameters
        const { page, limit, offset } = (0, helpers_1.getPaginationFields)(req.query.page, req.query.limit);
        const { rows: jobs, count: totalItems } = yield job_1.default.findAndCountAll({
            include: [
                {
                    model: user_1.default,
                    as: 'user',
                },
                // Adjust alias to match your associations
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        // Calculate pagination metadata
        const totalPages = (0, helpers_1.getTotalPages)(totalItems, limit);
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ status: false, message: 'Error fetching jobs' });
    }
});
exports.fetchAllJobs = fetchAllJobs;
//# sourceMappingURL=adminController.js.map