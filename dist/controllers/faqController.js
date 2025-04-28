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
const faq_service_1 = require("../services/faq.service");
const responseHandler_1 = require("../utils/responseHandler");
const faq_1 = require("../models/faq");
class FAQController {
    constructor() {
        /**
         * Get all FAQs
         */
        this.getAllFAQs = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, visibility } = req.query;
                const filter = {};
                if (status && Object.values(faq_1.FAQStatus).includes(status)) {
                    filter.status = status;
                }
                if (visibility &&
                    Object.values(faq_1.FAQVisibility).includes(visibility)) {
                    filter.visibility = visibility;
                }
                const faqs = yield this.faqService.getAllFAQs(filter);
                (0, responseHandler_1.sendResponse)(res, 200, faqs);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        /**
         * Get FAQ by ID
         */
        this.getFAQById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const faq = yield this.faqService.getFAQById(req.params.id);
                if (!faq) {
                    return (0, responseHandler_1.sendResponse)(res, 404, { message: 'FAQ not found' });
                }
                (0, responseHandler_1.sendResponse)(res, 200, faq);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        /**
         * Get FAQs by category
         */
        this.getFAQsByCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.query;
                const filter = { categoryId: req.params.categoryId };
                if (status && Object.values(faq_1.FAQStatus).includes(status)) {
                    filter.status = status;
                }
                const faqs = yield this.faqService.getFAQsByCategory(filter);
                (0, responseHandler_1.sendResponse)(res, 200, faqs);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        /**
         * Create new FAQ
         */
        this.createFAQ = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const faqData = Object.assign(Object.assign({}, req.body), { status: req.body.status || faq_1.FAQStatus.DRAFT, visibility: req.body.visibility || faq_1.FAQVisibility.PUBLIC });
                const faq = yield this.faqService.createFAQ(faqData);
                (0, responseHandler_1.sendResponse)(res, 201, faq);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 400, { message: error.message });
            }
        });
        /**
         * Update FAQ
         */
        this.updateFAQ = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedFAQ = yield this.faqService.updateFAQ(req.params.id, req.body);
                if (!updatedFAQ) {
                    return (0, responseHandler_1.sendResponse)(res, 404, { message: 'FAQ not found' });
                }
                (0, responseHandler_1.sendResponse)(res, 200, updatedFAQ);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 400, { message: error.message });
            }
        });
        /**
         * Delete FAQ
         */
        this.deleteFAQ = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.faqService.deleteFAQ(req.params.id);
                if (!result) {
                    return (0, responseHandler_1.sendResponse)(res, 404, { message: 'FAQ not found' });
                }
                (0, responseHandler_1.sendResponse)(res, 200, null, 'FAQ deleted successfully.');
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        /**
         * Mark FAQ as helpful
         */
        this.markHelpful = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.faqService.markHelpful(req.params.id);
                if (!result) {
                    return (0, responseHandler_1.sendResponse)(res, 404, { message: 'FAQ not found' });
                }
                (0, responseHandler_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        /**
         * Mark FAQ as not helpful
         */
        this.markNotHelpful = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.faqService.markNotHelpful(req.params.id);
                if (!result) {
                    return (0, responseHandler_1.sendResponse)(res, 404, { message: 'FAQ not found' });
                }
                (0, responseHandler_1.sendResponse)(res, 200, result);
            }
            catch (error) {
                (0, responseHandler_1.sendResponse)(res, 500, { message: error.message });
            }
        });
        this.faqService = new faq_service_1.FAQService();
    }
}
exports.default = new FAQController();
//# sourceMappingURL=faqController.js.map