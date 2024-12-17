// src/controllers/creatorController.ts
import { Request, Response, NextFunction } from "express";
import { sendMail } from "../services/mail.service";
import { emailTemplates } from "../utils/messages";
import JwtService from "../services/jwt.service";
import logger from "../middlewares/logger";
import { Op, ForeignKeyConstraintError, Sequelize } from "sequelize";
import sequelizeService from "../services/sequelize.service";
import Course from "../models/course";
import { AuthenticatedRequest } from "../types/index";
import Lesson from "../models/lesson";
import Module from "../models/module";
import CourseCategory from "../models/coursecategory";
import ModuleQuiz from "../models/modulequiz";
import ModuleQuizQuestion from "../models/modulequizquestion";
import DigitalAsset from "../models/digitalasset";
import AssetCategory from "../models/assetcategory";
import PhysicalAsset from "../models/physicalasset";

export const courseCategories = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Create courseCategory
        const courseCategory = await CourseCategory.findAll();

        res.status(200).json({
            data: courseCategory, // You can populate related data as needed
        });
    } catch (error: any) {
        logger.error(error);

        res.status(500).json({
            message:
                error.message ||
                "fetching course category failed. Please try again later.",
        });
    }
};

export const courseCreate = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { categoryId } = req.body;
    const userId = (req as AuthenticatedRequest).user?.id; // Assuming the user ID is passed in the URL params

    // Start transaction
    const transaction = await sequelizeService.connection!.transaction();

    try {
        // Category Check
        const category = CourseCategory.findByPk(categoryId, { transaction });
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }

        // Create course
        const course = await Course.create(
            {
                creatorId: userId, // Assuming user is authenticated and their ID is available
                categoryId,
            },
            { transaction }
        );

        // Create module
        const module = await Module.create(
            {
                courseId: course.id,
                title: "Module Title",
                sortOrder: 1,
            },
            { transaction }
        );

        // Create lesson
        await Lesson.create(
            {
                moduleId: module.id,
                courseId: course.id,
                title: "Lesson Title",
                sortOrder: 1,
            },
            { transaction }
        );

        // Commit transaction
        await transaction.commit();

        res.status(200).json({
            message: "Course created successfully, and moved to draft.",
            data: course, // You can populate related data as needed
        });
    } catch (error: any) {
        // Rollback transaction in case of error
        await transaction.rollback();

        logger.error(error);

        res.status(500).json({
            message:
                error.message || "Creating course failed. Please try again later.",
        });
    }
};

export const courseBasic = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {
        categoryId,
        courseId,
        title,
        subtitle,
        description,
        language,
        whatToLearn,
        requirement,
        level,
        price,
        currency,
    } = req.body;

    const category = CourseCategory.findByPk(categoryId);
    if (!category) {
        res.status(404).json({
            message: "Category not found in our database.",
        });
        return;
    }

    // Fetch course
    const course = await Course.findByPk(courseId);
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
        await course.update({
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
    } catch (error: any) {
        logger.error(error);
        res.status(500).json({
            message: error.message || "Failed to update course details.",
        });
    }
};

export const courseThumbnailImage = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { courseId, thumbnail } = req.body;

    // Fetch course
    const course = await Course.findByPk(courseId);
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
        await course.update({
            image: thumbnail,
        });

        res.status(200).json({
            message: "Course thumbnail updated successfully.",
            data: course, // You can populate related data as needed
        });
    } catch (error: any) {
        logger.error(error);
        res.status(500).json({
            message:
                error.message ||
                "An error occurred while updating the course thumbnail.",
        });
    }
};

// Module
export const getCourseModules = async (
    req: Request,
    res: Response
): Promise<void> => {
    const courseId = req.query.courseId as string;

    try {
        const course = await Course.findByPk(courseId);

        if (!course) {
            res.status(404).json({
                message: "Course not found in our database.",
            });
            return;
        }

        const modules = await Module.findAll({ where: { courseId: course.id } });
        res.status(200).json({
            message: "Course modules retrieved successfully.",
            data: modules,
        });
    } catch (error: any) {
        res.status(500).json({
            message:
                error.message || "An error occurred while processing your request.",
        });
    }
};

export const createCourseModule = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { courseId, title } = req.body;

    try {
        const course = await Course.findByPk(courseId);

        if (!course) {
            res.status(404).json({
                message: "Course not found in our database.",
            });
            return;
        }

        if (course.canEdit()) {
            // Fetch the module with the highest sortOrder
            const maxSortModule = await Module.findOne({
                where: { courseId: course.id },
                order: [["sortOrder", "DESC"]], // Sort by sortOrder in descending order
            });

            // Calculate the new sortOrder
            const sortOrder = maxSortModule ? maxSortModule.sortOrder + 1 : 1;

            // Create the new module
            await Module.create({
                courseId: course.id,
                title,
                sortOrder,
            });

            res.status(200).json({
                message: "Course module created successfully.",
            });
        } else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message:
                error.message || "An error occurred while processing your request.",
        });
    }
};

export const updateCourseModule = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { moduleId, title } = req.body;

    try {
        const module = await Module.findByPk(moduleId);

        if (!module) {
            res.status(404).json({
                message: "Module not found in our database.",
            });
            return;
        }

        const course = await Course.findByPk(module.courseId);

        if (course?.canEdit()) {
            await module.update({
                title,
            });

            res.status(200).json({
                message: "Course module updated successfully.",
                data: module,
            });
        } else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message:
                error.message || "An error occurred while processing your request.",
        });
    }
};

export const deleteCourseModule = async (
    req: Request,
    res: Response
): Promise<void> => {
    const moduleId = req.query.moduleId as string;

    try {
        const module = await Module.findByPk(moduleId);

        if (!module) {
            res.status(404).json({
                message: "Module not found in our database.",
            });
            return;
        }

        const course = await Course.findByPk(module.courseId);

        if (course?.canEdit()) {
            // Delete all lessons associated with the module
            await Lesson.destroy({ where: { moduleId: module.id } });

            // Delete all quizzes associated with the module
            await ModuleQuiz.destroy({ where: { moduleId: module.id } });

            // Delete all quizzes associated with the module
            await ModuleQuizQuestion.destroy({ where: { moduleId: module.id } });

            // Delete the module
            await module.destroy();

            res.status(200).json({
                message: "Course module deleted successfully.",
            });
        } else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message:
                error.message || "An error occurred while processing your request.",
        });
    }
};

export const updateDraggableCourseModule = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { data } = req.body;

    if (!Array.isArray(data)) {
        res.status(400).json({
            message:
                'Invalid data format. Expected an array of objects with "moduleId" and "sortOrder".',
        });
        return;
    }

    try {
        // Call the static updateDraggable function on the Module model
        await Module.updateDraggable(data);

        res.status(200).json({
            message: "Modules updated successfully.",
        });
    } catch (error: any) {
        res.status(500).json({
            message:
                error.message || "An error occurred while processing your request.",
        });
    }
};

// Lesson
export const getCourseLessons = async (
    req: Request,
    res: Response
): Promise<void> => {
    const moduleId = req.query.moduleId as string;

    try {
        const module = await Module.findByPk(moduleId);

        if (!module) {
            res.status(404).json({
                message: "Module not found in our database.",
            });
            return;
        }

        const lessons = await Lesson.findAll({ where: { moduleId: module.id } });
        res.status(200).json({
            message: "Module lessons retrieved successfully.",
            data: lessons,
        });
    } catch (error: any) {
        res.status(500).json({
            message:
                error.message || "An error occurred while processing your request.",
        });
    }
};

export const createModuleLesson = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            moduleId,
            courseId,
            title,
            content,
            contentType,
            contentUrl,
            duration,
        } = req.body;

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

        const module = await Module.findByPk(moduleId);

        if (!module) {
            res.status(404).json({
                message: "Module not found in our database.",
            });
            return;
        }

        const course = await Course.findByPk(module.courseId);

        if (!course) {
            res.status(404).json({
                message: "Course not found in our database.",
            });
            return;
        }

        if (course.canEdit()) {
            // Fetch the lesson with the highest sortOrder
            const maxSortLesson = await Lesson.findOne({
                where: { moduleId: module.id },
                order: [["sortOrder", "DESC"]], // Sort by sortOrder in descending order
            });

            // Calculate the new sortOrder
            const sortOrder = maxSortLesson ? maxSortLesson.sortOrder + 1 : 1;

            await Lesson.create({
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
        } else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    } catch (error: any) {
        res.status(500).json({
            message: error.message || "Error creating lesson",
            error: error.message,
        });
    }
};

export const updateModuleLesson = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { lessonId, title, content, contentType, contentUrl, duration } =
            req.body;

        // Find the lesson by ID (replace with actual DB logic)
        const lesson = await Lesson.findByPk(lessonId);

        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }

        const course = await Course.findByPk(lesson.courseId);

        if (course?.canEdit()) {
            // Update lesson properties
            lesson.title = title || lesson.title;
            lesson.content = content || lesson.content;
            lesson.contentType = contentType || lesson.contentType;
            lesson.contentUrl = contentUrl || lesson.contentUrl;
            lesson.duration = duration || lesson.duration;

            res.status(200).json({ message: "Lesson updated successfully" });
        } else {
            res.status(403).json({
                message: `Cannot edit this course that is published and live. Please contact ${process.env.APP_NAME} customer care for change of status to make modifications.`,
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating lesson" });
    }
};

export const deleteModuleLesson = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const lessonId = req.query.lessonId as string;

        // Find the lesson by ID (replace with actual DB logic)
        const lesson = await Lesson.findByPk(lessonId);

        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }

        lesson.destroy();

        res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Error deleting lesson" });
    }
};

// Digital Asset
export const createDigitalAsset = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { categoryId } = req.body;

        const userId = (req as AuthenticatedRequest).user?.id; // Extract user ID from authenticated request

        // Category check
        const category = await AssetCategory.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }

        // Ensure the creatorId is included in the request payload
        const digitalAssetData = {
            ...req.body,
            creatorId: userId,
            categoryId: category.id,
        };

        // Create the DigitalAsset
        const asset = await DigitalAsset.create(digitalAssetData);

        res.status(200).json({
            message: "Digital Asset created successfully",
            data: asset,
        });
    } catch (error: any) {
        logger.error("Error creating Digital Asset:", error);
        res.status(500).json({
            error: error.message || "Failed to create Digital Asset",
        });
    }
};

export const getDigitalAssets = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = (req as AuthenticatedRequest).user?.id; // Extract authenticated user's ID

    try {
        const { assetName, pricingType, status } = req.query; // Extract search parameters

        // Build search conditions
        const searchConditions: any = {
            creatorId: userId,
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
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });

        res.status(200).json({ data: assets });
    } catch (error: any) {
        logger.error("Error fetching digital assets:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch Digital Assets" });
    }
};

export const viewDigitalAsset = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = (req as AuthenticatedRequest).user?.id; // Extract authenticated user's ID

    try {
        const { id } = req.query; // Extract search parameters

        // Fetch asset with optional search criteria
        const asset = await DigitalAsset.findOne({
            where: { id, creatorId: userId },
            include: [
                {
                    model: AssetCategory, // Including the related AssetCategory model
                    as: "assetCategory", // Alias for the relationship (adjust if necessary)
                    attributes: ["id", "name"], // You can specify the fields you want to include
                },
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });

        res.status(200).json({ data: asset });
    } catch (error: any) {
        logger.error("Error fetching digital asset:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch Digital Asset" });
    }
};

export const updateDigitalAsset = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id, categoryId } = req.body; // ID is passed in the request body

    try {
        // Category check
        const category = await AssetCategory.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }

        // Find the Digital Asset by ID
        const asset = await DigitalAsset.findByPk(id);

        if (!asset) {
            res.status(404).json({ message: "Digital Asset not found" });
            return;
        }

        // Update the Digital Asset with new data
        await asset.update({ ...req.body, categoryId: category.id });

        res.status(200).json({
            message: "Digital Asset updated successfully",
        });
    } catch (error) {
        logger.error("Error updating Digital Asset:", error);
        res.status(500).json({ error: "Failed to update Digital Asset" });
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
            res.status(404).json({ message: "Digital Asset not found" });
            return;
        }

        // Delete the asset
        await asset.destroy();

        // Return success response
        res.status(200).json({ message: "Digital Asset deleted successfully" });
    } catch (error) {
        logger.error("Error deleting Digital Asset:", error);
        res.status(500).json({ error: "Failed to delete Digital Asset" });
    }
};

// Physical Asset
export const createPhysicalAsset = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { categoryId } = req.body;

        const userId = (req as AuthenticatedRequest).user?.id; // Extract user ID from authenticated request

        // Category check
        const category = await AssetCategory.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }

        // Ensure the creatorId is included in the request payload
        const physicalAssetData = {
            ...req.body,
            creatorId: userId,
            categoryId: category.id,
        };

        // Create the PhysicalAsset
        const asset = await PhysicalAsset.create(physicalAssetData);

        res.status(200).json({
            message: "Physical Asset created successfully",
            data: asset,
        });
    } catch (error: any) {
        logger.error("Error creating Physical Asset:", error);
        res.status(500).json({
            error: error.message || "Failed to create Physical Asset",
        });
    }
};

export const getPhysicalAssets = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = (req as AuthenticatedRequest).user?.id; // Extract authenticated user's ID

    try {
        const { assetName, status } = req.query; // Extract search parameters

        // Build search conditions
        const searchConditions: any = {
            creatorId: userId,
        };
        if (assetName) {
            searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
        }
        if (status) {
            searchConditions.status = status;
        }

        // Fetch assets with optional search criteria
        const assets = await PhysicalAsset.findAll({
            where: searchConditions,
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });

        res.status(200).json({ data: assets });
    } catch (error: any) {
        logger.error("Error fetching physical assets:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch physical Assets" });
    }
};

export const viewPhysicalAsset = async (
    req: Request,
    res: Response
): Promise<void> => {
    const userId = (req as AuthenticatedRequest).user?.id; // Extract authenticated user's ID

    try {
        const { id } = req.query; // Extract search parameters

        // Fetch asset with optional search criteria
        const asset = await PhysicalAsset.findOne({
            where: { id },
            include: [
                {
                    model: AssetCategory, // Including the related AssetCategory model
                    as: "assetCategory", // Alias for the relationship (adjust if necessary)
                    attributes: ["id", "name"], // You can specify the fields you want to include
                },
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });

        res.status(200).json({ data: asset });
    } catch (error: any) {
        logger.error("Error fetching physical asset:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch physical asset" });
    }
};

export const updatePhysicalAsset = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id, categoryId } = req.body; // ID is passed in the request body

    try {
        // Category check
        const category = await AssetCategory.findByPk(categoryId);
        if (!category) {
            res.status(404).json({
                message: "Category not found in our database.",
            });
            return;
        }

        // Find the Physical Asset by ID
        const asset = await PhysicalAsset.findByPk(id);

        if (!asset) {
            res.status(404).json({ message: "Physical Asset not found" });
            return;
        }

        // Update the Physical Asset with new data
        await asset.update({ ...req.body, categoryId: category.id });

        res.status(200).json({
            message: "Physical Asset updated successfully",
        });
    } catch (error) {
        logger.error("Error updating physical Asset:", error);
        res.status(500).json({ error: "Failed to update physical Asset" });
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
            res.status(404).json({ message: "Physical Asset not found" });
            return;
        }

        // Delete the asset
        await asset.destroy();

        // Return success response
        res.status(200).json({ message: "Physical Asset deleted successfully" });
    } catch (error) {
        logger.error("Error deleting physical asset:", error);
        res.status(500).json({ error: "Failed to delete physical asset" });
    }
};
