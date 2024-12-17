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
exports.viewPhysicalAsset = exports.fetchPhysicalAssets = exports.viewDigitalAsset = exports.fetchDigitalAssets = void 0;
const sequelize_1 = require("sequelize");
const physicalasset_1 = __importDefault(require("../models/physicalasset"));
const logger_1 = __importDefault(require("../middlewares/logger"));
const assetcategory_1 = __importDefault(require("../models/assetcategory"));
const digitalasset_1 = __importDefault(require("../models/digitalasset"));
const fetchDigitalAssets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { assetName, pricingType, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {};
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        if (pricingType) {
            searchConditions.pricingType = pricingType;
        }
        if (status) {
            searchConditions.status = status;
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
        const { assetName, status } = req.query; // Extract search parameters
        // Build search conditions
        const searchConditions = {};
        if (assetName) {
            searchConditions.assetName = { [sequelize_1.Op.like]: `%${assetName}%` }; // Partial match
        }
        if (status) {
            searchConditions.status = status;
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
//# sourceMappingURL=frontendController.js.map