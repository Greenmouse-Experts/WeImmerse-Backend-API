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
    lessonDraggableValidationRules,
    quizCreationValidationRules,
    quizUpdateValidationRules,
    createQuizQuestionValidationRules,
    updateQuizQuestionValidationRules,
    createLessonAssignmentValidationRules,
    updateLessonAssignmentValidationRules,
    digitalAssetValidationRules,
    physicalAssetValidationRules,
    addJobValidationRules,
    postJobValidationRules,
    validate } from '../utils/validations/creatorValidations';

const creatorRoutes = Router();

creatorRoutes.get("/course/categories", authMiddleware, authorizeCreator, creatorController.courseCategories);

creatorRoutes.post("/course/create", authMiddleware, authorizeCreator, courseCreateValidationRules(), validate, creatorController.courseCreate);
creatorRoutes.post("/course/basic", authMiddleware, authorizeCreator, courseBasicValidationRules(), validate, creatorController.courseBasic);
creatorRoutes.post("/course/thumbnail", authMiddleware, authorizeCreator, creatorController.courseThumbnailImage);
creatorRoutes.get("/courses", authMiddleware, authorizeCreator, creatorController.getCourses);
creatorRoutes.get("/course", authMiddleware, authorizeCreator, creatorController.viewCourse);

// Module
creatorRoutes.get("/course/modules", authMiddleware, authorizeCreator, creatorController.getCourseModules);
creatorRoutes.post("/course/module/create", authMiddleware, authorizeCreator, moduleCreationValidationRules(), validate, creatorController.createCourseModule);
creatorRoutes.put("/course/module/update", authMiddleware, authorizeCreator, moduleUpdateValidationRules(), validate, creatorController.updateCourseModule);
creatorRoutes.delete("/course/module/delete", authMiddleware, authorizeCreator, moduleDeletionValidationRules(), validate, creatorController.deleteCourseModule);
creatorRoutes.patch("/course/module/draggable", authMiddleware, authorizeCreator, moduleDraggableValidationRules(), validate, creatorController.updateDraggableCourseModule);

// Lesson
creatorRoutes.get("/course/module/lessons", authMiddleware, authorizeCreator, creatorController.getModuleLessons);
creatorRoutes.post("/course/module/lesson/create", authMiddleware, authorizeCreator, lessonCreationValidationRules(), validate, creatorController.createModuleLesson);
creatorRoutes.put("/course/module/lesson/update", authMiddleware, authorizeCreator, lessonUpdatingValidationRules(), validate, creatorController.updateModuleLesson);
creatorRoutes.delete("/course/module/lesson/delete", authMiddleware, authorizeCreator, creatorController.deleteModuleLesson);
creatorRoutes.patch("/course/module/lesson/draggable", authMiddleware, authorizeCreator, lessonDraggableValidationRules(), validate, creatorController.updateDraggableLesson);

// Lesson Quiz
creatorRoutes.post('/course/lesson/quiz/create', authMiddleware, authorizeCreator, quizCreationValidationRules(), validate, creatorController.createLessonQuiz);
creatorRoutes.put('/course/lesson/quiz/update', authMiddleware, authorizeCreator, quizUpdateValidationRules(), validate, creatorController.updateLessonQuiz);
creatorRoutes.get('/course/lesson/quizzes', authMiddleware, authorizeCreator, creatorController.getLessonQuizzes);
creatorRoutes.delete('/course/lesson/quiz/delete', authMiddleware, authorizeCreator, creatorController.deleteLessonQuiz);

// Lesson Quiz Questions
creatorRoutes.post('/course/lesson/quiz/question/create', authMiddleware, authorizeCreator, createQuizQuestionValidationRules(), validate, creatorController.createLessonQuizQuestion);
creatorRoutes.put('/course/lesson/quiz/question/update', authMiddleware, authorizeCreator, updateQuizQuestionValidationRules(), validate, creatorController.updateLessonQuizQuestion);
creatorRoutes.get('/course/lesson/quiz/questions', authMiddleware, authorizeCreator, creatorController.getLessonQuizQuestion);
creatorRoutes.delete('/course/lesson/quiz/question/delete', authMiddleware, authorizeCreator, creatorController.deleteLessonQuizQuestion);

// Lesson Assignment
creatorRoutes.post('/course/lesson/assignment/create', authMiddleware, authorizeCreator, createLessonAssignmentValidationRules(), validate, creatorController.createLessonAssignment);
creatorRoutes.put('/course/lesson/assignment/update', authMiddleware, authorizeCreator, updateLessonAssignmentValidationRules(), validate, creatorController.updateLessonAssignment);
creatorRoutes.get('/course/lesson/assignments', authMiddleware, authorizeCreator, creatorController.getLessonAssignments);
creatorRoutes.delete('/course/lesson/assignment/delete', authMiddleware, authorizeCreator, creatorController.deleteLessonAssignment);

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

// Job
creatorRoutes.get("/job/categories", authMiddleware, authorizeCreator, creatorController.jobCategories);

creatorRoutes.post('/job/add', authMiddleware, authorizeCreator, addJobValidationRules(), validate, creatorController.addJob);
creatorRoutes.put('/job/post', authMiddleware, authorizeCreator, postJobValidationRules(), validate,creatorController.postJob);
creatorRoutes.get('/jobs', authMiddleware, authorizeCreator, creatorController.getJobs);
creatorRoutes.patch('/job/close', authMiddleware, authorizeCreator, creatorController.closeJob);
creatorRoutes.delete('/job/delete', authMiddleware, authorizeCreator, creatorController.deleteJob);

creatorRoutes.post('/job/repost', authMiddleware, authorizeCreator, creatorController.repostJob);
creatorRoutes.get('/job/applicants', authMiddleware, authorizeCreator, creatorController.getJobApplicants);
creatorRoutes.get('/job/view/applicant', authMiddleware, authorizeCreator, creatorController.viewApplicant);
creatorRoutes.patch('/job/reject/applicant', authMiddleware, authorizeCreator, creatorController.rejectApplicant);
creatorRoutes.post('/job/download/applicant/resume', authMiddleware, authorizeCreator, creatorController.downloadApplicantResume);


export default creatorRoutes;
