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
Object.defineProperty(exports, "__esModule", { value: true });
const faq_category_service_1 = require("../services/faq-category.service");
const responseHandler_1 = require("../utils/responseHandler");
const faqcategory_1 = require("../models/faqcategory");
const faq_1 = require("../models/faq");
class FAQCategoryController {
    constructor() {
        /**
         * Get all categories
         */
        this.getAllCategories = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.query;
                const filter = {};
                if (status &&
                    Object.values(faqcategory_1.FAQCategoryStatus).includes(status)) {
                    filter.status = status;
                }
                const categories = yield this.categoryService.getAllCategories(filter);
                (0, responseHandler_1.sendResponse)(res, 200, categories);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        /**
         * Get category by ID
         */
        this.getCategoryById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.categoryService.getCategoryById(req.params.id);
                if (!category) {
                    return (0, responseHandler_1.sendResponse)(res, 404, { message: 'Category not found' });
                }
                (0, responseHandler_1.sendResponse)(res, 200, category);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        /**
         * Create new category
         */
        this.createCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryData = Object.assign(Object.assign({}, req.body), { status: req.body.status || faqcategory_1.FAQCategoryStatus.ACTIVE });
                const category = yield this.categoryService.createCategory(categoryData);
                (0, responseHandler_1.sendResponse)(res, 201, category);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 400, { message: error.message });
            }
        });
        /**
         * Update category
         */
        this.updateCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCategory = yield this.categoryService.updateCategory(req.params.id, req.body);
                if (!updatedCategory) {
                    return (0, responseHandler_1.sendResponse)(res, 404, { message: 'Category not found' });
                }
                (0, responseHandler_1.sendResponse)(res, 200, updatedCategory);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 400, { message: error.message });
            }
        });
        /**
         * Delete category
         */
        this.deleteCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.categoryService.deleteCategory(req.params.id);
                if (!result) {
                    return (0, responseHandler_1.sendResponse)(res, 404, { message: 'Category not found' });
                }
                (0, responseHandler_1.sendResponse)(res, 200, null, 'Category deleted successfully.');
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        /**
         * Get category with FAQs
         */
        this.getCategoryWithFAQs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { faqStatus } = req.query;
                const filter = {};
                if (faqStatus &&
                    Object.values(faq_1.FAQStatus).includes(faqStatus)) {
                    filter.status = faqStatus;
                }
                const category = yield this.categoryService.getCategoryWithFAQs(req.params.id, filter);
                if (!category) {
                    return (0, responseHandler_1.sendResponse)(res, 404, null, 'Category not found');
                }
                (0, responseHandler_1.sendResponse)(res, 200, category);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        this.categoryService = new faq_category_service_1.FAQCategoryService();
    }
}
exports.default = new FAQCategoryController();
//# sourceMappingURL=faqCategoryController.js.map