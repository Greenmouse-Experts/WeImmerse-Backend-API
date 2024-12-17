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
exports.deletePhysicalAsset = exports.updatePhysicalAsset = exports.viewPhysicalAsset = exports.getPhysicalAssets = exports.createPhysicalAsset = exports.deleteDigitalAsset = exports.updateDigitalAsset = exports.viewDigitalAsset = exports.getDigitalAssets = exports.createDigitalAsset = exports.deleteModuleLesson = exports.updateModuleLesson = exports.createModuleLesson = exports.getCourseLessons = exports.updateDraggableCourseModule = exports.deleteCourseModule = exports.updateCourseModule = exports.createCourseModule = exports.getCourseModules = exports.courseThumbnailImage = exports.courseBasic = exports.courseCreate = exports.courseCategories = void 0;
const logger_1 = __importDefault(require("../middlewares/logger"));
const sequelize_1 = require("sequelize");
const sequelize_service_1 = __importDefault(require("../services/sequelize.service"));
const course_1 = __importDefault(require("../models/course"));
const lesson_1 = __importDefault(require("../models/lesson"));
const module_1 = __importDefault(require("../models/module"));
const coursecategory_1 = __importDefault(require("../models/coursecategory"));
const modulequiz_1 = __importDefault(require("../models/modulequiz"));
const modulequizquestion_1 = __importDefault(require("../models/modulequizquestion"));
const digitalasset_1 = __importDefault(require("../models/digitalasset"));
const assetcategory_1 = __importDefault(require("../models/assetcategory"));
const physicalasset_1 = __importDefault(require("../models/physicalasset"));
const courseCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create courseCategory
        const courseCategory = yield coursecategory_1.default.findAll();
        res.status(200).json({
            data: courseCategory, // You can populate related data as needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message ||
                "fetching course category failed. Please try again later.",
        });
    }
});
exports.courseCategories = courseCategories;
const courseCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { categoryId } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming the user ID is passed in the URL params
    // Start transaction
    const transaction = yield sequelize_service_1.default.connection.transaction();
    try {
        // Category Check
        const category = coursecategory_1.default.findByPk(categoryId, { transaction });
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }
        // Create course
        const course = yield course_1.default.create({
            creatorId: userId,
            categoryId,
        }, { transaction });
        // Create module
        const module = yield module_1.default.create({
            courseId: course.id,
            title: "Module Title",
            sortOrder: 1,
        }, { transaction });
        // Create lesson
        yield lesson_1.default.create({
            moduleId: module.id,
            courseId: course.id,
            title: "Lesson Title",
            sortOrder: 1,
        }, { transaction });
        // Commit transaction
        yield transaction.commit();
        res.status(200).json({
            message: "Course created successfully, and moved to draft.",
            data: course, // You can populate related data as needed
        });
    }
    catch (error) {
        // Rollback transaction in case of error
        yield transaction.rollback();
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || "Creating course failed. Please try again later.",
        });
    }
});
exports.courseCreate = courseCreate;
const courseBasic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, courseId, title, subtitle, description, language, whatToLearn, requirement, level, price, currency, } = req.body;
    const category = coursecategory_1.default.findByPk(categoryId);
    if (!category) {
        res.status(404).json({
            message: "Category not found in our database.",
        });
        return;
    }
    // Fetch course
    const course = yield course_1.default.findByPk(courseId);
    if (!course) {
        res.status(404).json({
            message: "Course not found in our database.",
        });
        return;
    }
    // Check if the course can be edited
    if (!course.canEdit()) {
        res.status(403).json({
            message: `Cannot edit this course that is published and live. Please contact customer care for change of status to make modifications.`,
        });
        return;
    }
    try {
        // Update course details
        yield course.update({
            title,
            subtitle,
            description,
            language,
            whatToLearn,
            requirement,
            level,
            price,
            currency,
        });
        res.status(200).json({
            message: "Course basic created successfully.",
            data: course, // You can populate related data as needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message || "Failed to update course details.",
        });
    }
});
exports.courseBasic = courseBasic;
const courseThumbnailImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, thumbnail } = req.body;
    // Fetch course
    const course = yield course_1.default.findByPk(courseId);
    if (!course) {
        res.status(404).json({
            message: "Course not found in our database.",
        });
        return;
    }
    // Check if the course can be edited
    if (!course.canEdit()) {
        res.status(403).json({
            message: `Cannot edit this course that is published and live. Please contact customer care for change of status to make modifications.`,
        });
        return;
    }
    try {
        // Update course details
        yield course.update({
            image: thumbnail,
        });
        res.status(200).json({
            message: "Course thumbnail updated successfully.",
            data: course, // You can populate related data as needed
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            message: error.message ||
                "An error occurred while updating the course thumbnail.",
        });
    }
});
exports.courseThumbnailImage = courseThumbnailImage;
// Module
const getCourseModules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.query.courseId;
    try {
        const course = yield course_1.default.findByPk(courseId);
        if (!course) {
            res.status(404).json({
                message: "Course not found in our database.",
            });
            return;
        }
        const modules = yield module_1.default.findAll({ where: { courseId: course.id } });
        res.status(200).json({
            message: "Course modules retrieved successfully.",
            data: modules,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while processing your request.",
        });
    }
});
exports.getCourseModules = getCourseModules;
const createCourseModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, title } = req.body;
    try {
        const course = yield course_1.default.findByPk(courseId);
        if (!course) {
            res.status(404).json({
                message: "Course not found in our database.",
            });
            return;
        }
        if (course.canEdit()) {
            // Fetch the module with the highest sortOrder
            const maxSortModule = yield module_1.default.findOne({
                where: { courseId: course.id },
                order: [["sortOrder", "DESC"]], // Sort by sortOrder in descending order
            });
            // Calculate the new sortOrder
            const sortOrder = maxSortModule ? maxSortModule.sortOrder + 1 : 1;
            // Create the new module
            yield module_1.default.create({
                courseId: course.id,
                title,
                sortOrder,
            });
            res.status(200).json({
                message: "Course module created successfully.",
            });
        }
        else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while processing your request.",
        });
    }
});
exports.createCourseModule = createCourseModule;
const updateCourseModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { moduleId, title } = req.body;
    try {
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: "Module not found in our database.",
            });
            return;
        }
        const course = yield course_1.default.findByPk(module.courseId);
        if (course === null || course === void 0 ? void 0 : course.canEdit()) {
            yield module.update({
                title,
            });
            res.status(200).json({
                message: "Course module updated successfully.",
                data: module,
            });
        }
        else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while processing your request.",
        });
    }
});
exports.updateCourseModule = updateCourseModule;
const deleteCourseModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleId = req.query.moduleId;
    try {
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: "Module not found in our database.",
            });
            return;
        }
        const course = yield course_1.default.findByPk(module.courseId);
        if (course === null || course === void 0 ? void 0 : course.canEdit()) {
            // Delete all lessons associated with the module
            yield lesson_1.default.destroy({ where: { moduleId: module.id } });
            // Delete all quizzes associated with the module
            yield modulequiz_1.default.destroy({ where: { moduleId: module.id } });
            // Delete all quizzes associated with the module
            yield modulequizquestion_1.default.destroy({ where: { moduleId: module.id } });
            // Delete the module
            yield module.destroy();
            res.status(200).json({
                message: "Course module deleted successfully.",
            });
        }
        else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while processing your request.",
        });
    }
});
exports.deleteCourseModule = deleteCourseModule;
const updateDraggableCourseModule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    if (!Array.isArray(data)) {
        res.status(400).json({
            message: 'Invalid data format. Expected an array of objects with "moduleId" and "sortOrder".',
        });
        return;
    }
    try {
        // Call the static updateDraggable function on the Module model
        yield module_1.default.updateDraggable(data);
        res.status(200).json({
            message: "Modules updated successfully.",
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while processing your request.",
        });
    }
});
exports.updateDraggableCourseModule = updateDraggableCourseModule;
// Lesson
const getCourseLessons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const moduleId = req.query.moduleId;
    try {
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: "Module not found in our database.",
            });
            return;
        }
        const lessons = yield lesson_1.default.findAll({ where: { moduleId: module.id } });
        res.status(200).json({
            message: "Module lessons retrieved successfully.",
            data: lessons,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while processing your request.",
        });
    }
});
exports.getCourseLessons = getCourseLessons;
const createModuleLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { moduleId, courseId, title, content, contentType, contentUrl, duration, } = req.body;
        // Create a new lesson object
        const newLesson = {
            moduleId,
            courseId,
            title,
            content,
            contentType,
            contentUrl,
            duration,
        };
        const module = yield module_1.default.findByPk(moduleId);
        if (!module) {
            res.status(404).json({
                message: "Module not found in our database.",
            });
            return;
        }
        const course = yield course_1.default.findByPk(module.courseId);
        if (!course) {
            res.status(404).json({
                message: "Course not found in our database.",
            });
            return;
        }
        if (course.canEdit()) {
            // Fetch the lesson with the highest sortOrder
            const maxSortLesson = yield lesson_1.default.findOne({
                where: { moduleId: module.id },
                order: [["sortOrder", "DESC"]], // Sort by sortOrder in descending order
            });
            // Calculate the new sortOrder
            const sortOrder = maxSortLesson ? maxSortLesson.sortOrder + 1 : 1;
            yield lesson_1.default.create({
                moduleId,
                courseId,
                title,
                content,
                contentType,
                contentUrl,
                duration,
                sortOrder,
            });
            res.status(200).json({ message: "Lesson created successfully" });
        }
        else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: error.message || "Error creating lesson",
            error: error.message,
        });
    }
});
exports.createModuleLesson = createModuleLesson;
const updateModuleLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lessonId, title, content, contentType, contentUrl, duration } = req.body;
        // Find the lesson by ID (replace with actual DB logic)
        const lesson = yield lesson_1.default.findByPk(lessonId);
        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        const course = yield course_1.default.findByPk(lesson.courseId);
        if (course === null || course === void 0 ? void 0 : course.canEdit()) {
            // Update lesson properties
            lesson.title = title || lesson.title;
            lesson.content = content || lesson.content;
            lesson.contentType = contentType || lesson.contentType;
            lesson.contentUrl = contentUrl || lesson.contentUrl;
            lesson.duration = duration || lesson.duration;
            res.status(200).json({ message: "Lesson updated successfully" });
        }
        else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error updating lesson" });
    }
});
exports.updateModuleLesson = updateModuleLesson;
const deleteModuleLesson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lessonId = req.query.lessonId;
        // Find the lesson by ID (replace with actual DB logic)
        const lesson = yield lesson_1.default.findByPk(lessonId);
        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        lesson.destroy();
        res.status(200).json({ message: "Lesson deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting lesson" });
    }
});
exports.deleteModuleLesson = deleteModuleLesson;
// Digital Asset
const createDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { categoryId } = req.body;
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id; // Extract user ID from authenticated request
        // Category check
        const category = yield assetcategory_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }
        // Ensure the creatorId is included in the request payload
        const digitalAssetData = Object.assign(Object.assign({}, req.body), { creatorId: userId, categoryId: category.id });
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
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id; // Extract authenticated user's ID
    try {
        const { assetName, pricingType, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {
            creatorId: userId,
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
    var _d;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id; // Extract authenticated user's ID
    try {
        const { id } = req.query; // Extract search parameters
        // Fetch asset with optional search criteria
        const asset = yield digitalasset_1.default.findOne({
            where: { id, creatorId: userId },
            include: [
                {
                    model: assetcategory_1.default,
                    as: "assetCategory",
                    attributes: ["id", "name"], // You can specify the fields you want to include
                },
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
// Physical Asset
const createPhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { categoryId } = req.body;
        const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id; // Extract user ID from authenticated request
        // Category check
        const category = yield assetcategory_1.default.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }
        // Ensure the creatorId is included in the request payload
        const physicalAssetData = Object.assign(Object.assign({}, req.body), { creatorId: userId, categoryId: category.id });
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
    const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id; // Extract authenticated user's ID
    try {
        const { assetName, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {
            creatorId: userId,
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
    var _g;
    const userId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.id; // Extract authenticated user's ID
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
//# sourceMappingURL=creatorController.js.map