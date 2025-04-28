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
exports.FAQService = void 0;
const faq_1 = __importDefault(require("../models/faq"));
const faqcategory_1 = __importDefault(require("../models/faqcategory"));
const ApiError_1 = require("../utils/ApiError");
class FAQService {
    /**
     * Get all FAQs with optional filtering
     */
    getAllFAQs() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return faq_1.default.findAll({
                where: filter,
                include: [
                    {
                        model: faqcategory_1.default,
                        as: 'category',
                        attributes: ['id', 'name', 'icon'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        });
    }
    /**
     * Get FAQ by ID and increment views
     */
    getFAQById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const faq = yield faq_1.default.findByPk(id, {
                include: [
                    {
                        model: faqcategory_1.default,
                        as: 'category',
                        attributes: ['id', 'name', 'icon'],
                    },
                ],
            });
            if (faq) {
                yield faq.increment('views');
                return faq;
            }
            return null;
        });
    }
    /**
     * Get FAQs by category with optional filtering
     */
    getFAQsByCategory(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return faq_1.default.findAll({
                where: filter,
                include: [
                    {
                        model: faqcategory_1.default,
                        as: 'category',
                        attributes: ['id', 'name', 'icon'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        });
    }
    /**
     * Create new FAQ
     */
    createFAQ(faqData) {
        return __awaiter(this, void 0, void 0, function* () {
            return faq_1.default.create(faqData);
        });
    }
    /**
     * Update FAQ
     */
    updateFAQ(id, faqData) {
        return __awaiter(this, void 0, void 0, function* () {
            const faq = yield faq_1.default.findByPk(id);
            if (!faq) {
                throw new ApiError_1.NotFoundError('FAQ not found');
            }
            return faq.update(faqData);
        });
    }
    /**
     * Delete FAQ (soft delete by changing status)
     */
    deleteFAQ(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const faq = yield faq_1.default.findByPk(id);
            if (!faq) {
                throw new ApiError_1.NotFoundError('FAQ not found');
            }
            yield faq.destroy();
            return true;
        });
    }
    /**
     * Mark FAQ as helpful
     */
    markHelpful(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const faq = yield faq_1.default.findByPk(id);
            if (!faq) {
                throw new ApiError_1.NotFoundError('FAQ not found');
            }
            return faq.increment('helpfulCount');
        });
    }
    /**
     * Mark FAQ as not helpful
     */
    markNotHelpful(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const faq = yield faq_1.default.findByPk(id);
            if (!faq) {
                throw new ApiError_1.NotFoundError('FAQ not found');
            }
            return faq.increment('notHelpfulCount');
        });
    }
    /**
     * Change FAQ status
     */
    changeStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const faq = yield faq_1.default.findByPk(id);
            if (!faq) {
                throw new ApiError_1.NotFoundError('FAQ not found');
            }
            return faq.update({ status });
        });
    }
}
exports.FAQService = FAQService;
//# sourceMappingURL=faq.service.js.map