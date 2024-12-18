// src/routes/userRoute.ts
import { Router } from 'express';
import * as creatorController from '../controllers/creatorController';
import authMiddleware from '../middlewares/authMiddleware';
import authorizeCreator from '../middlewares/authorizeCreator';
import {
    courseCreateValidationRules,
    courseBasicValidationRules,
    moduleCreationValidationRules,
    moduleUpdateValidationRules,
    moduleDeletionValidationRules,
    moduleDraggableValidationRules,
    lessonCreationValidationRules,
    lessonUpdatingValidationRules,
    digitalAssetValidationRules,
    physicalAssetValidationRules,
    validate } from '../utils/validations/creatorValidations';

const creatorRoutes = Router();

creatorRoutes.get("/course/categories", authMiddleware, authorizeCreator, creatorController.courseCategories);

creatorRoutes.post("/course/create", authMiddleware, authorizeCreator, courseCreateValidationRules(), validate, creatorController.courseCreate);
creatorRoutes.post("/course/basic", authMiddleware, authorizeCreator, courseBasicValidationRules(), validate, creatorController.courseBasic);
creatorRoutes.post("/course/thumbnail", authMiddleware, authorizeCreator, creatorController.courseThumbnailImage);

// Module
creatorRoutes.get("/course/modules", authMiddleware, authorizeCreator, creatorController.getCourseModules);
creatorRoutes.post("/course/module/create", authMiddleware, authorizeCreator, moduleCreationValidationRules(), validate, creatorController.createCourseModule);
creatorRoutes.put("/course/module/update", authMiddleware, authorizeCreator, moduleUpdateValidationRules(), validate, creatorController.updateCourseModule);
creatorRoutes.delete("/course/module/delete", authMiddleware, authorizeCreator, moduleDeletionValidationRules(), validate, creatorController.deleteCourseModule);
creatorRoutes.patch("/course/module/draggable", authMiddleware, authorizeCreator, moduleDraggableValidationRules(), validate, creatorController.updateDraggableCourseModule);

// Lesson
creatorRoutes.get("/course/module/lessons", authMiddleware, authorizeCreator, creatorController.getCourseLessons);
creatorRoutes.post("/course/module/lesson/create", authMiddleware, authorizeCreator, lessonCreationValidationRules(), validate, creatorController.createModuleLesson);
creatorRoutes.put("/course/module/lesson/update", authMiddleware, authorizeCreator, lessonUpdatingValidationRules(), validate, creatorController.updateModuleLesson);
creatorRoutes.delete("/course/module/lesson/delete", authMiddleware, authorizeCreator, moduleDeletionValidationRules(), validate, creatorController.deleteModuleLesson);
// creatorRoutes.patch("/course/module/lesson/draggable", authMiddleware, authorizeCreator, moduleDraggableValidationRules(), validate, creatorController.updateDraggableModule);

creatorRoutes.get("/asset/categories", authMiddleware, authorizeCreator, creatorController.assetCategories);
// Digital Asset
creatorRoutes.get("/digital/assets", authMiddleware, authorizeCreator, creatorController.getDigitalAssets);
creatorRoutes.get("/digital/asset/view", authMiddleware, authorizeCreator, creatorController.viewDigitalAsset);
creatorRoutes.post("/digital/asset/create", authMiddleware, authorizeCreator, digitalAssetValidationRules(), validate, creatorController.createDigitalAsset);
creatorRoutes.put("/digital/asset/update", authMiddleware, authorizeCreator, digitalAssetValidationRules(), validate, creatorController.updateDigitalAsset);
creatorRoutes.delete("/digital/asset/delete", authMiddleware, authorizeCreator, creatorController.deleteDigitalAsset);

// Physical Asset
creatorRoutes.get("/physical/assets", authMiddleware, authorizeCreator, creatorController.getPhysicalAssets);
creatorRoutes.get("/physical/asset/view", authMiddleware, authorizeCreator, creatorController.viewPhysicalAsset);
creatorRoutes.post("/physical/asset/create", authMiddleware, authorizeCreator, physicalAssetValidationRules(), validate, creatorController.createPhysicalAsset);
creatorRoutes.put("/physical/asset/update", authMiddleware, authorizeCreator, physicalAssetValidationRules(), validate, creatorController.updatePhysicalAsset);
creatorRoutes.delete("/physical/asset/delete", authMiddleware, authorizeCreator, creatorController.deletePhysicalAsset);

export default creatorRoutes;
