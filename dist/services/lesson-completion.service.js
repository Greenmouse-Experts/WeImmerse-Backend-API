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
const lessoncompletion_1 = __importDefault(require("../models/lessoncompletion"));
const markUnmarkLessonCompleted = (userId, lessonId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the lesson is already marked as completed
    const existingRecord = yield lessoncompletion_1.default.findOne({
        where: { userId, lessonId },
    });
    if (existingRecord) {
        // delete a lesson completion record
        yield lessoncompletion_1.default.destroy({
            where: {
                id: existingRecord.id,
            },
        });
        return;
    }
    // Create a new record
    yield lessoncompletion_1.default.create({
        userId,
        lessonId,
    });
});
exports.default = { markUnmarkLessonCompleted };
//# sourceMappingURL=lesson-completion.service.js.map