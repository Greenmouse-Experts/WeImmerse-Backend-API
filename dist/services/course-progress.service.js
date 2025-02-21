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
const courseprogress_1 = __importDefault(require("../models/courseprogress"));
const saveCourseProgress = (studentId, courseId, totalLessons, completedLessons) => __awaiter(void 0, void 0, void 0, function* () {
    const existingProgress = yield courseprogress_1.default.findOne({
        where: { studentId, courseId },
    });
    if (existingProgress) {
        existingProgress.completedLessons = completedLessons;
        existingProgress.progressPercentage =
            (completedLessons / totalLessons) * 100;
        existingProgress.totalLessons = totalLessons;
        existingProgress.lastAccessed = new Date();
        yield existingProgress.save();
        return existingProgress;
    }
    return yield courseprogress_1.default.create({
        studentId,
        courseId,
        completedLessons: 0,
        totalLessons,
        progressPercentage: 0,
        lastAccessed: new Date(),
    });
});
const getCourseProgress = (studentId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield courseprogress_1.default.findOne({ where: { studentId, courseId } });
});
const updateProgress = (studentId, courseId, completedLessons) => __awaiter(void 0, void 0, void 0, function* () {
    const progress = yield courseprogress_1.default.findOne({
        where: { studentId, courseId },
    });
    if (!progress) {
        throw new Error('Course progress not found');
    }
    progress.completedLessons = completedLessons;
    progress.progressPercentage =
        (completedLessons / progress.totalLessons) * 100;
    progress.lastAccessed = new Date();
    yield progress.save();
    return progress;
});
const getAllProgress = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield courseprogress_1.default.findAll({ where: { studentId } });
});
exports.default = {
    saveCourseProgress,
    getCourseProgress,
    updateProgress,
    getAllProgress,
};
//# sourceMappingURL=course-progress.service.js.map