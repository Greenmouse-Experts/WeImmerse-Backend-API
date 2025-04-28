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
exports.FAQCategoryService = void 0;
const faqcategory_1 = __importDefault(require("../models/faqcategory"));
const faq_1 = __importDefault(require("../models/faq"));
const ApiError_1 = require("../utils/ApiError");
class FAQCategoryService {
    /**
     * Get all categories with optional filtering
     */
    getAllCategories() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return faqcategory_1.default.findAll({
                where: filter,
                order: [['name', 'ASC']],
            });
        });
    }
    /**
     * Get category by ID
     */
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return faqcategory_1.default.findByPk(id);
        });
    }
    /**
     * Create new category
     */
    createCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            return faqcategory_1.default.create(categoryData);
        });
    }
    /**
     * Update category
     */
    updateCategory(id, categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield faqcategory_1.default.findByPk(id);
            if (!category) {
                throw new ApiError_1.NotFoundError('Category not found');
            }
            return category.update(categoryData);
        });
    }
    /**
     * Delete category (soft delete by changing status)
     */
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = (yield faqcategory_1.default.findOne({
                where: { id },
                include: [{ model: faq_1.default, as: 'faqs' }],
            }));
            if (!category) {
                throw new ApiError_1.NotFoundError('Category not found');
            }
            if (category.faqs.length) {
                throw new ApiError_1.BadRequestError('Category cannot be deleted as it is not empty.');
            }
            // Archive the category
            yield category.destroy();
            return true;
        });
    }
    /**
     * Get category with its FAQs
     */
    getCategoryWithFAQs(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, faqFilter = {}) {
            return faqcategory_1.default.findByPk(id, {
                include: [
                    {
                        model: faq_1.default,
                        as: 'faqs',
                        where: faqFilter,
                        required: false,
                        attributes: ['id', 'question', 'status', 'views', 'createdAt'],
                    },
                ],
            });
        });
    }
    /**
     * Change category status
     */
    changeStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield faqcategory_1.default.findByPk(id);
            if (!category) {
                throw new ApiError_1.NotFoundError('Category not found');
            }
            return category.update({ status });
        });
    }
}
exports.FAQCategoryService = FAQCategoryService;
//# sourceMappingURL=faq-category.service.js.map