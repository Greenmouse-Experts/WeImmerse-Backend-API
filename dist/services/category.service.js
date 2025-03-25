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
const sequelize_1 = require("sequelize");
const category_1 = __importDefault(require("../models/category"));
const ApiError_1 = require("../utils/ApiError");
class CategoryService {
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield category_1.default.findOne({
                where: {
                    name: data.name,
                    parentId: data.parentId || null,
                },
            });
            if (existingCategory) {
                throw new Error(data.parentId
                    ? 'Subcategory with this name already exists under the specified parent'
                    : 'Category with this name already exists');
            }
            return category_1.default.create(data);
        });
    }
    getCategoryById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, includeChildren = false) {
            const options = {
                where: { id },
            };
            if (includeChildren) {
                options.include = [
                    {
                        association: 'children',
                        where: { isActive: true },
                        required: false,
                    },
                ];
            }
            const category = yield category_1.default.findOne(options);
            if (!category) {
                throw new ApiError_1.NotFoundError('Category not found');
            }
            return category;
        });
    }
    getAllCategories() {
        return __awaiter(this, arguments, void 0, function* (includeInactive = false, type) {
            const where = {};
            if (!includeInactive) {
                where.isActive = true;
            }
            if (type) {
                where.type = type;
            }
            return category_1.default.findAll({
                where,
                include: [
                    {
                        association: 'children',
                        where: includeInactive ? {} : { isActive: true },
                        required: false,
                    },
                ],
                order: [
                    ['parentId', 'ASC'],
                    ['name', 'ASC'],
                ],
            });
        });
    }
    updateCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getCategoryById(id);
            if (data.name) {
                const existingCategory = yield category_1.default.findOne({
                    where: {
                        name: data.name,
                        parentId: data.parentId !== undefined ? data.parentId : category.parentId,
                        id: { [sequelize_1.Op.ne]: id },
                    },
                });
                if (existingCategory) {
                    throw new Error(data.parentId
                        ? 'Subcategory with this name already exists under the specified parent'
                        : 'Category with this name already exists');
                }
            }
            return category.update(data);
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getCategoryById(id);
            // Check if category has children
            const childCount = yield category_1.default.count({
                where: { parentId: id },
            });
            if (childCount > 0) {
                throw new Error('Cannot delete category that has subcategories');
            }
            yield category.destroy();
            return true;
        });
    }
    toggleCategoryStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.getCategoryById(id);
            return category.update({ isActive: !category.isActive });
        });
    }
}
exports.default = new CategoryService();
//# sourceMappingURL=category.service.js.map