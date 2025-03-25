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
const category_service_1 = __importDefault(require("../services/category.service"));
const errorHandler_1 = require("../utils/errorHandler");
class CategoryController {
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield category_service_1.default.createCategory(req.body);
                res.status(201).json({
                    status: true,
                    message: 'Category created successfully.',
                    data: category,
                });
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const includeChildren = req.query.includeChildren === 'true';
                const category = yield category_service_1.default.getCategoryById(id, includeChildren);
                res.json({ status: true, data: category });
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const includeInactive = req.query.includeInactive === 'true';
                const type = req.query.type;
                const categories = yield category_service_1.default.getAllCategories(includeInactive, type);
                res.json({ status: true, data: categories });
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield category_service_1.default.updateCategory(id, req.body);
                res.json({
                    status: true,
                    message: 'Category updated successfully.',
                    data: category,
                });
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield category_service_1.default.deleteCategory(id);
                res
                    .status(200)
                    .json({ status: true, message: 'Category deleted successfully.' });
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
    toggleCategoryStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const category = yield category_service_1.default.toggleCategoryStatus(id);
                res.json({
                    status: true,
                    message: 'Category status updated successfully.',
                    data: category,
                });
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
}
exports.default = new CategoryController();
//# sourceMappingURL=categoryController.js.map