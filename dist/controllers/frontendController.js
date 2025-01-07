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
exports.viewJob = exports.fetchJobs = exports.viewPhysicalAsset = exports.fetchPhysicalAssets = exports.viewDigitalAsset = exports.fetchDigitalAssets = void 0;
const sequelize_1 = require("sequelize");
const physicalasset_1 = __importDefault(require("../models/physicalasset"));
const logger_1 = __importDefault(require("../middlewares/logger"));
const assetcategory_1 = __importDefault(require("../models/assetcategory"));
const digitalasset_1 = __importDefault(require("../models/digitalasset"));
const job_1 = __importDefault(require("../models/job"));
const helpers_1 = require("../utils/helpers");
const user_1 = __importDefault(require("../models/user"));
const admin_1 = __importDefault(require("../models/admin"));
const role_1 = __importDefault(require("../models/role"));
const fetchDigitalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetName, pricingType } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {
            status: 'published',
        };
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        if (pricingType) {
            searchConditions.pricingType = pricingType;
        }
        // Fetch assets with optional search criteria
        const assets = yield digitalasset_1.default.findAll({
            where: searchConditions,
            include: [
                {
                    model: assetcategory_1.default,
                    as: 'assetCategory',
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
                {
                    model: user_1.default,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: admin_1.default,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                            model: role_1.default,
                            as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({ data: assets });
    }
    catch (error) {
        logger_1.default.error("Error fetching digital assets:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch Digital Assets" });
    }
});
exports.fetchDigitalAssets = fetchDigitalAssets;
const viewDigitalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query; // Extract search parameters
        // Fetch asset with optional search criteria
        const asset = yield digitalasset_1.default.findOne({
            where: { id },
            include: [
                {
                    model: assetcategory_1.default,
                    as: 'assetCategory',
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
                {
                    model: user_1.default,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: admin_1.default,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                            model: role_1.default,
                            as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({ data: asset });
    }
    catch (error) {
        logger_1.default.error("Error fetching digital asset:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch Digital Asset" });
    }
});
exports.viewDigitalAsset = viewDigitalAsset;
const fetchPhysicalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetName } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {
            status: 'published',
        };
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        // Fetch assets with optional search criteria
        const assets = yield physicalasset_1.default.findAll({
            where: searchConditions,
            include: [
                {
                    model: assetcategory_1.default,
                    as: 'assetCategory',
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
                {
                    model: user_1.default,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: admin_1.default,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                            model: role_1.default,
                            as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({ data: assets });
    }
    catch (error) {
        logger_1.default.error("Error fetching physical assets:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch physical Assets" });
    }
});
exports.fetchPhysicalAssets = fetchPhysicalAssets;
const viewPhysicalAsset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query; // Extract search parameters
        // Fetch asset with optional search criteria
        const asset = yield physicalasset_1.default.findOne({
            where: { id },
            include: [
                {
                    model: assetcategory_1.default,
                    as: 'assetCategory',
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
                {
                    model: user_1.default,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: admin_1.default,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                            model: role_1.default,
                            as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });
        res.status(200).json({ data: asset });
    }
    catch (error) {
        logger_1.default.error("Error fetching physical asset:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch physical asset" });
    }
});
exports.viewPhysicalAsset = viewPhysicalAsset;
const fetchJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword } = req.query;
        const jobs = yield (0, helpers_1.getJobsBySearch)(keyword, 20);
        res.status(200).json({
            message: 'All jobs retrieved successfully.',
            data: jobs,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.fetchJobs = fetchJobs;
const viewJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const jobId = req.query.jobId;
        const job = yield job_1.default.findByPk(jobId);
        if (!job) {
            res.status(404).json({
                message: 'Not found in our database.',
            });
            return;
        }
        // Ensure `views` is not null before incrementing
        job.views = ((_a = job.views) !== null && _a !== void 0 ? _a : 0) + 1;
        yield job.save();
        res.status(200).json({
            message: 'Job retrieved successfully.',
            data: job,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.viewJob = viewJob;
//# sourceMappingURL=frontendController.js.map