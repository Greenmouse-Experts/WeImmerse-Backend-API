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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoute.ts
const express_1 = require("express");
const creatorController = __importStar(require("../controllers/creatorController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authorizeCreator_1 = __importDefault(require("../middlewares/authorizeCreator"));
const creatorValidations_1 = require("../utils/validations/creatorValidations");
const creatorRoutes = (0, express_1.Router)();
creatorRoutes.get("/course/categories", authMiddleware_1.default, authorizeCreator_1.default, creatorController.courseCategories);
creatorRoutes.post("/course/create", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.courseCreateValidationRules)(), creatorValidations_1.validate, creatorController.courseCreate);
creatorRoutes.post("/course/basic", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.courseBasicValidationRules)(), creatorValidations_1.validate, creatorController.courseBasic);
creatorRoutes.post("/course/thumbnail", authMiddleware_1.default, authorizeCreator_1.default, creatorController.courseThumbnailImage);
// Module
creatorRoutes.get("/course/modules", authMiddleware_1.default, authorizeCreator_1.default, creatorController.getCourseModules);
creatorRoutes.post("/course/module/create", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.moduleCreationValidationRules)(), creatorValidations_1.validate, creatorController.createCourseModule);
creatorRoutes.put("/course/module/update", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.moduleUpdateValidationRules)(), creatorValidations_1.validate, creatorController.updateCourseModule);
creatorRoutes.delete("/course/module/delete", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.moduleDeletionValidationRules)(), creatorValidations_1.validate, creatorController.deleteCourseModule);
creatorRoutes.patch("/course/module/draggable", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.moduleDraggableValidationRules)(), creatorValidations_1.validate, creatorController.updateDraggableCourseModule);
// Lesson
creatorRoutes.get("/course/module/lessons", authMiddleware_1.default, authorizeCreator_1.default, creatorController.getCourseLessons);
creatorRoutes.post("/course/module/lesson/create", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.lessonCreationValidationRules)(), creatorValidations_1.validate, creatorController.createModuleLesson);
creatorRoutes.put("/course/module/lesson/update", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.lessonUpdatingValidationRules)(), creatorValidations_1.validate, creatorController.updateModuleLesson);
creatorRoutes.delete("/course/module/lesson/delete", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.moduleDeletionValidationRules)(), creatorValidations_1.validate, creatorController.deleteModuleLesson);
// creatorRoutes.patch("/course/module/lesson/draggable", authMiddleware, authorizeCreator, moduleDraggableValidationRules(), validate, creatorController.updateDraggableModule);
creatorRoutes.get("/asset/categories", authMiddleware_1.default, authorizeCreator_1.default, creatorController.assetCategories);
// Digital Asset
creatorRoutes.get("/digital/assets", authMiddleware_1.default, authorizeCreator_1.default, creatorController.getDigitalAssets);
creatorRoutes.get("/digital/asset/view", authMiddleware_1.default, authorizeCreator_1.default, creatorController.viewDigitalAsset);
creatorRoutes.post("/digital/asset/create", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.digitalAssetValidationRules)(), creatorValidations_1.validate, creatorController.createDigitalAsset);
creatorRoutes.put("/digital/asset/update", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.digitalAssetValidationRules)(), creatorValidations_1.validate, creatorController.updateDigitalAsset);
creatorRoutes.delete("/digital/asset/delete", authMiddleware_1.default, authorizeCreator_1.default, creatorController.deleteDigitalAsset);
// Physical Asset
creatorRoutes.get("/physical/assets", authMiddleware_1.default, authorizeCreator_1.default, creatorController.getPhysicalAssets);
creatorRoutes.get("/physical/asset/view", authMiddleware_1.default, authorizeCreator_1.default, creatorController.viewPhysicalAsset);
creatorRoutes.post("/physical/asset/create", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.physicalAssetValidationRules)(), creatorValidations_1.validate, creatorController.createPhysicalAsset);
creatorRoutes.put("/physical/asset/update", authMiddleware_1.default, authorizeCreator_1.default, (0, creatorValidations_1.physicalAssetValidationRules)(), creatorValidations_1.validate, creatorController.updatePhysicalAsset);
creatorRoutes.delete("/physical/asset/delete", authMiddleware_1.default, authorizeCreator_1.default, creatorController.deletePhysicalAsset);
exports.default = creatorRoutes;
//# sourceMappingURL=creatorRoute.js.map