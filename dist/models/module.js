"use strict";
// models/module.ts
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
exports.initModel = void 0;
const sequelize_1 = require("sequelize");
const modulequiz_1 = __importDefault(require("./modulequiz"));
const lesson_1 = __importDefault(require("./lesson"));
class Module extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.Course, { as: "course", foreignKey: "courseId" });
        this.hasMany(models.Lesson, { as: "lessons", foreignKey: "moduleId" });
        this.hasMany(models.ModuleQuiz, { as: "quizzes", foreignKey: "moduleId" });
    }
    // Check if the module has associated quizzes
    hasQuiz() {
        return __awaiter(this, void 0, void 0, function* () {
            const quizCount = yield modulequiz_1.default.count({ where: { moduleId: this.id } });
            return quizCount > 0;
        });
    }
    // Find all modules by course ID
    static findByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Module.findAll({
                where: { courseId },
                include: [
                    { model: lesson_1.default, as: 'lessons' }
                ],
                order: [['sortOrder', 'ASC']],
            });
        });
    }
    // Update sort order for draggable modules
    static updateDraggable(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updates = data.map(item => Module.update({ sortOrder: item.sortOrder }, { where: { id: item.module_id } }));
            yield Promise.all(updates);
        });
    }
}
const initModel = (sequelize) => {
    Module.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        courseId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id',
            },
            onDelete: 'RESTRICT',
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        sortOrder: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: "Module",
        timestamps: true,
        paranoid: false,
        tableName: "modules",
    });
};
exports.initModel = initModel;
exports.default = Module;
//# sourceMappingURL=module.js.map