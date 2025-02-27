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
const canvas_1 = require("canvas");
const helpers_1 = require("../utils/helpers"); // Utility function to upload files to S3
const courseprogress_1 = __importDefault(require("../models/courseprogress"));
const quizattempt_1 = __importDefault(require("../models/quizattempt"));
const certificate_1 = __importDefault(require("../models/certificate"));
const lessonquiz_1 = __importDefault(require("../models/lessonquiz"));
const generateCertificatePdf = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = (0, canvas_1.createCanvas)(800, 600);
    const ctx = canvas.getContext('2d');
    // Load certificate template
    const background = yield (0, canvas_1.loadImage)('./assets/certificate_template.png');
    ctx.drawImage(background, 0, 0, 800, 600);
    // Add text
    ctx.font = '30px Arial';
    ctx.fillText(`Certificate of Completion`, 250, 200);
    ctx.font = '20px Arial';
    ctx.fillText(`Awarded to User ${userId} for completing Course ${courseId}`, 150, 300);
    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');
    // Upload to S3 and return URL
    return yield (0, helpers_1.uploadToS3)(buffer, `certificates/${userId}_${courseId}.png`, 'test-weimmersive-bucket');
});
const generateCertificate = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if course is 100% complete
    const progress = yield courseprogress_1.default.findOne({
        where: { studentId: userId, courseId },
    });
    if (!progress || progress.progressPercentage < 100) {
        throw new Error('Course is not fully completed.');
    }
    console.log(progress, courseId);
    // Check if quiz is passed
    const quizAttempt = yield quizattempt_1.default.findOne({
        where: { userId, passed: true },
        include: [{ model: lessonquiz_1.default, as: 'quiz', where: { courseId } }],
        order: [['createdAt', 'DESC']],
    });
    console.log(quizAttempt);
    if (!quizAttempt) {
        throw new Error('User has not passed the required quiz.');
    }
    // Generate certificate
    const certificateUrl = yield generateCertificatePdf(userId, courseId);
    // Store certificate in the database
    const certificate = yield certificate_1.default.create({
        userId,
        courseId,
        certificateUrl,
        issueDate: new Date(),
    });
    return certificate;
});
const getCertificate = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield certificate_1.default.findOne({ where: { userId, courseId } });
});
exports.default = {
    generateCertificate,
    getCertificate,
};
//# sourceMappingURL=certificate.service.js.map