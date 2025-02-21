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
const quizattempt_1 = __importDefault(require("../models/quizattempt"));
const lessonquiz_1 = __importDefault(require("../models/lessonquiz"));
const lessonquizquestion_1 = __importDefault(require("../models/lessonquizquestion"));
const validateQuizAnswers = (quizId, userAnswers) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield lessonquizquestion_1.default.findAll({
        where: { lessonQuizId: quizId },
    });
    let correctAnswers = 0;
    const totalQuestions = questions.length;
    questions.forEach((question) => {
        const userAnswer = userAnswers.find((ua) => ua.questionId === question.id);
        if (userAnswer && userAnswer.selectedOption === question.correctOption) {
            correctAnswers++;
        }
    });
    return {
        correctAnswers,
        totalQuestions,
        score: (correctAnswers / totalQuestions) * 100,
        passed: correctAnswers / totalQuestions >= 0.7, // Assuming 70% is the pass threshold
    };
});
const saveQuizAttempt = (userId, quizId, userAnswers) => __awaiter(void 0, void 0, void 0, function* () {
    const quiz = yield lessonquiz_1.default.findByPk(quizId);
    if (!quiz) {
        throw new Error('Quiz not found');
    }
    const { correctAnswers, totalQuestions, score, passed } = yield validateQuizAnswers(quizId, userAnswers);
    const attempt = yield quizattempt_1.default.create({
        userId,
        quizId,
        score,
        passed,
    });
    return {
        attempt,
        correctAnswers,
        totalQuestions,
        score,
        passed,
    };
});
const getQuizAttempts = (userId, quizId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield quizattempt_1.default.findAll({
        where: { userId, quizId },
        order: [['createdAt', 'DESC']],
    });
});
const getLatestQuizAttempt = (userId, quizId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield quizattempt_1.default.findOne({
        where: { userId, quizId },
        order: [['createdAt', 'DESC']],
    });
});
const getUserAttempts = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield quizattempt_1.default.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
    });
});
exports.default = {
    saveQuizAttempt,
    getQuizAttempts,
    getLatestQuizAttempt,
    getUserAttempts,
};
//# sourceMappingURL=quiz.service.js.map