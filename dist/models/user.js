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
    // Association with OTP model
    static associate(models) {
        this.hasOne(models.OTP, {
            as: 'otp',
            foreignKey: 'userId', // Ensure the OTP model has a 'userId' column
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
        firstName: sequelize_1.DataTypes.STRING,
        lastName: sequelize_1.DataTypes.STRING,
        gender: sequelize_1.DataTypes.STRING,
        email: {
            type: sequelize_1.DataTypes.STRING,
            unique: true, // Ensure unique emails
        },
        email_verified_at: sequelize_1.DataTypes.DATE,
        password: sequelize_1.DataTypes.STRING,
        phoneNumber: {
            type: sequelize_1.DataTypes.STRING,
            unique: true
        },
        dateOfBirth: sequelize_1.DataTypes.STRING,
        location: sequelize_1.DataTypes.JSON,
        photo: sequelize_1.DataTypes.TEXT,
        facebookId: sequelize_1.DataTypes.STRING,
        googleId: sequelize_1.DataTypes.STRING,
        accountType: sequelize_1.DataTypes.ENUM('Vendor', 'Customer'),
        status: sequelize_1.DataTypes.ENUM("active", "inactive"),
    }, {
        sequelize,
        modelName: "User",
        timestamps: true,
        paranoid: false,
        tableName: "users",
        defaultScope: {
            attributes: { exclude: ["password"] },
        },
        scopes: {
            withPassword: {
                attributes: { include: ["password"] },
            },
            auth: {
                attributes: { include: ["email", "password", "status", "email_verified_at"] }, // Add necessary fields for authentication
            },
        },
    });
    // Add the password hashing hook before saving
    User.addHook("beforeSave", (user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user.changed("password") || user.isNewRecord) {
            user.password = yield User.hashPassword(user.password);
        }
    }));
};
exports.initModel = initModel;
// Export the User model and the init function
exports.default = User; // Ensure User is exported as default
