import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import PhysicalAsset from "../models/physicalasset";
import logger from "../middlewares/logger";
import AssetCategory from "../models/assetcategory";
import DigitalAsset from "../models/digitalasset";
import Job from "../models/job";
import { getJobsBySearch } from "../utils/helpers";
import User from "../models/user";
import Admin from "../models/admin";
import Role from "../models/role";

export const fetchDigitalAssets = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { assetName, pricingType } = req.query; // Extract search parameters

        // Build search conditions
        const searchConditions: any = {
            status: 'published',
        };
        if (assetName) {
            searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
        }
        if (pricingType) {
            searchConditions.pricingType = pricingType;
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
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: Admin,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                          model: Role, // Assuming you've imported the Role model
                          as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
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
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: Admin,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                          model: Role, // Assuming you've imported the Role model
                          as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
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
        const { assetName } = req.query; // Extract search parameters

        // Build search conditions
        const searchConditions: any = {
            status: 'published',
        };
        if (assetName) {
            searchConditions.assetName = { [Op.like]: `%${assetName}%` }; // Partial match
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
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: Admin,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                          model: Role, // Assuming you've imported the Role model
                          as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
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
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "accountType", "name", "email"],
                },
                {
                    model: Admin,
                    as: "admin",
                    attributes: ["id", "name", "email"],
                    include: [
                        {
                          model: Role, // Assuming you've imported the Role model
                          as: "role", // Make sure this alias matches the one you used in the association
                        },
                    ],
                }
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

export const fetchJobs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { keyword } = req.query;
        const jobs = await getJobsBySearch(keyword as string, 20);

        res.status(200).json({
            message: 'All jobs retrieved successfully.',
            data: jobs,
        });
    } catch (error: any) {
        logger.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const viewJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const jobId = req.query.jobId as string;

        const job = await Job.findByPk(jobId);
        if (!job) {
            res.status(404).json({
                message: 'Not found in our database.',
            });
            return;
        }

        // Ensure `views` is not null before incrementing
        job.views = (job.views ?? 0) + 1;
        await job.save();

        res.status(200).json({
            message: 'Job retrieved successfully.',
            data: job,
        });
    } catch (error: any) {
        logger.error(error);
        res.status(500).json({ message: error.message });
    }
};