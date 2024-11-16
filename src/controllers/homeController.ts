// src/controllers/authController.ts
import { Request, Response, NextFunction } from "express";
import { sendMail } from "../services/mail.service";
import { emailTemplates } from "../utils/messages";
import JwtService from "../services/jwt.service";
import logger from "../middlewares/logger"; // Adjust the path to your logger.js
import Product from "../models/product";
import { Op, ForeignKeyConstraintError, Sequelize } from "sequelize";
import SubCategory from "../models/subcategory";
import Category from "../models/category";
import User from "../models/user";
import Store from "../models/store";
import KYC from "../models/kyc";

export const getCategoriesWithSubcategories = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const categories = await Category.findAll({
            include: [
                {
                    model: SubCategory,
                    as: "subCategories",
                },
            ],
        });

        res.status(200).json({ data: categories });
    } catch (error: any) {
        logger.error("Error fetching categories with subcategories:", error);
        res.status(500).json({
            message: error.message || "An error occurred while fetching categories.",
        });
    }
};

export const products = async (req: Request, res: Response): Promise<void> => {
    const {
        storeId,
        minPrice,
        maxPrice,
        name, // Product name
        subCategoryName, // Subcategory name filter
        condition, // Product condition filter
    } = req.query;

    try {
        // Define the base where clause with the active status
        const whereClause: any = { status: "active" };

        // Additional filters based on query parameters
        if (storeId) {
            whereClause.storeId = storeId;
        }
        if (minPrice) {
            whereClause.price = { [Op.gte]: Number(minPrice) };
        }
        if (maxPrice) {
            whereClause.price = { ...whereClause.price, [Op.lte]: Number(maxPrice) };
        }
        if (name) {
            whereClause.name = { [Op.like]: `%${name}%` }; // Case-insensitive search for product name
        }
        if (condition) {
            whereClause.condition = condition; // Filter by product condition
        }

        // Construct the where clause for subCategory with conditional categoryId and subCategoryName
        const subCategoryWhereClause: any = {};
        if (subCategoryName) {
            subCategoryWhereClause.name = { [Op.like]: `%${subCategoryName}%` };
        }

        // Include the subCategory relation with name and id filtering
        const includeClause = [
            {
                model: SubCategory,
                as: "sub_category",
                where:
                    Object.keys(subCategoryWhereClause).length > 0
                        ? subCategoryWhereClause
                        : undefined,
                attributes: ["id", "name"],
            },
        ];

        // Fetch active products with subcategory details
        const products = await Product.findAll({
            where: whereClause,
            include: includeClause,
        });

        res.status(200).json({ data: products });
    } catch (error: any) {
        logger.error("Error fetching products:", error);
        res.status(500).json({
            message: error.message || "An error occurred while fetching products.",
        });
    }
};

// Get Product By ID or SKU with Recommended Products
export const getProductById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { productId } = req.query;

    try {
        // Fetch the main product by ID or SKU
        const product = await Product.findOne({
            where: {
                status: "active",
                [Op.or]: [
                    { id: productId },
                    { SKU: productId }, // Replace 'SKU' with the actual SKU column name if different
                ],
            },
            include: [
                {
                    model: User,
                    as: "vendor",
                    required: true, // Make sure the user is included in the result
                },
                {
                    model: Store,
                    as: "store",
                },
                {
                    model: SubCategory,
                    as: "sub_category",
                    attributes: ["id", "name"],
                },
            ],
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        if (product && product.vendor) { // This should now return the associated User (vendor)
            const kyc = await KYC.findOne({ where: { vendorId: product.vendor.id } });
            product.vendor.setDataValue('isVerified', kyc ? kyc.isVerified : false);
        }

        // Fetch recommended products based on the same category
        const recommendedProducts = await Product.findAll({
            where: {
                categoryId: product.categoryId,
                id: { [Op.ne]: product.id }, // Exclude the currently viewed product
                status: "active",
            },
            limit: 10,
            order: Sequelize.fn('RAND'), // Randomize the order
        });

        // Send the product and recommended products in the response
        res.status(200).json({ data: product, recommendedProducts });
    } catch (error: any) {
        logger.error("Error fetching product:", error);
        res.status(500).json({
            message: error.message || "An error occurred while fetching the product.",
        });
    }
};
