import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import PhysicalAsset from "../models/physicalasset";
import logger from "../middlewares/logger";
import AssetCategory from "../models/assetcategory";
import DigitalAsset from "../models/digitalasset";

export const fetchDigitalAssets = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { assetName, pricingType, status } = req.query; // Extract search parameters

        // Build search conditions
        const searchConditions: any = {};
        if (assetName) {
            searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
        }
        if (pricingType) {
            searchConditions.pricingType = pricingType;
        }
        if (status) {
            searchConditions.status = status;
        }

        // Fetch assets with optional search criteria
        const assets = await DigitalAsset.findAll({
            where: searchConditions,
            include: [
                {
                    model: AssetCategory, // Including the related AssetCategory model
                    as: 'assetCategory', // Alias for the relationship (adjust if necessary)
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });

        res.status(200).json({ data: assets });
    } catch (error: any) {
        logger.error("Error fetching digital assets:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch Digital Assets" });
    }
};

export const viewDigitalAsset = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.query; // Extract search parameters

        // Fetch asset with optional search criteria
        const asset = await DigitalAsset.findOne({
            where: { id },
            include: [
                {
                    model: AssetCategory, // Including the related AssetCategory model
                    as: 'assetCategory', // Alias for the relationship (adjust if necessary)
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });

        res.status(200).json({ data: asset });
    } catch (error: any) {
        logger.error("Error fetching digital asset:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch Digital Asset" });
    }
};

export const fetchPhysicalAssets = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { assetName, status } = req.query; // Extract search parameters

        // Build search conditions
        const searchConditions: any = {};
        if (assetName) {
            searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
        }
        if (status) {
            searchConditions.status = status;
        }

        // Fetch assets with optional search criteria
        const assets = await PhysicalAsset.findAll({
            where: searchConditions,
            include: [
                {
                    model: AssetCategory, // Including the related AssetCategory model
                    as: 'assetCategory', // Alias for the relationship (adjust if necessary)
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });

        res.status(200).json({ data: assets });
    } catch (error: any) {
        logger.error("Error fetching physical assets:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch physical Assets" });
    }
};

export const viewPhysicalAsset = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.query; // Extract search parameters

        // Fetch asset with optional search criteria
        const asset = await PhysicalAsset.findOne({
            where: { id },
            include: [
                {
                    model: AssetCategory, // Including the related AssetCategory model
                    as: 'assetCategory', // Alias for the relationship (adjust if necessary)
                    attributes: ['id', 'name'], // You can specify the fields you want to include
                },
            ],
            order: [["createdAt", "DESC"]], // Sort by creation date descending
        });

        res.status(200).json({ data: asset });
    } catch (error: any) {
        logger.error("Error fetching physical asset:", error);
        res
            .status(500)
            .json({ error: error.message || "Failed to fetch physical asset" });
    }
};