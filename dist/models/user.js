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
exports.initModel = void 0;
// models/user.ts
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    // Method to hash the password before saving
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, 10);
        });
    }
    // Method to check the password
    checkPassword(password) {
        return bcrypt_1.default.compare(password, this.password);
    }
    static associate(models) {
        // Define expected model types
        this.hasOne(models.OTP, {
            as: 'otp',
            foreignKey: 'userId',
            onDelete: 'RESTRICT',
        });
        this.hasMany(models.CourseProgress, {
            as: 'progress',
            foreignKey: 'studentId',
        });
    }
}
const initModel = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            primaryKey: true,
            defaultValue: sequelize_1.DataTypes.UUIDV4, // Automatically generate UUIDs
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        email_verified_at: {
            allowNull: true,
            type: sequelize_1.DataTypes.DATE,
        },
        gender: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        dateOfBirth: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        educationalLevel: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        schoolId: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        professionalSkill: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        industry: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        jobTitle: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        referralCode: {
            type: sequelize_1.DataTypes.STRING,
            unique: true,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        photo: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        evToken: {
            type: sequelize_1.DataTypes.DECIMAL(20, 2),
            allowNull: true,
        },
        accountType: {
            type: sequelize_1.DataTypes.ENUM('student', 'user', 'institution', 'creator'),
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
            allowNull: false,
            defaultValue: 'active',
        },
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true,
        paranoid: false,
        tableName: 'users',
        defaultScope: {
            attributes: { exclude: ['password'] },
        },
        scopes: {
            auth: {
                attributes: { include: ['password'] }, // Add necessary fields for authentication
            },
        },
    });
    // Add the password hashing hook before saving
    User.addHook('beforeSave', (user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user.changed('password') || user.isNewRecord) {
            user.password = yield User.hashPassword(user.password);
        }
    }));
};
exports.initModel = initModel;
// Export the User model and the init function
exports.default = User; // Ensure User is exported as default
//# sourceMappingURL=user.js.map