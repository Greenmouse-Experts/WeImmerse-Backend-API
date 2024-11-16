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
exports.getProductById = exports.products = exports.getCategoriesWithSubcategories = void 0;
const logger_1 = __importDefault(require("../middlewares/logger")); // Adjust the path to your logger.js
const product_1 = __importDefault(require("../models/product"));
const sequelize_1 = require("sequelize");
const subcategory_1 = __importDefault(require("../models/subcategory"));
const category_1 = __importDefault(require("../models/category"));
const user_1 = __importDefault(require("../models/user"));
const store_1 = __importDefault(require("../models/store"));
const kyc_1 = __importDefault(require("../models/kyc"));
const getCategoriesWithSubcategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.default.findAll({
            include: [
                {
                    model: subcategory_1.default,
                    as: "subCategories",
                },
            ],
        });
        res.status(200).json({ data: categories });
    }
    catch (error) {
        logger_1.default.error("Error fetching categories with subcategories:", error);
        res.status(500).json({
            message: error.message || "An error occurred while fetching categories.",
        });
    }
});
exports.getCategoriesWithSubcategories = getCategoriesWithSubcategories;
const products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { storeId, minPrice, maxPrice, name, // Product name
    subCategoryName, // Subcategory name filter
    condition, // Product condition filter
     } = req.query;
    try {
        // Define the base where clause with the active status
        const whereClause = { status: "active" };
        // Additional filters based on query parameters
        if (storeId) {
            whereClause.storeId = storeId;
        }
        if (minPrice) {
            whereClause.price = { [sequelize_1.Op.gte]: Number(minPrice) };
        }
        if (maxPrice) {
            whereClause.price = Object.assign(Object.assign({}, whereClause.price), { [sequelize_1.Op.lte]: Number(maxPrice) });
        }
        if (name) {
            whereClause.name = { [sequelize_1.Op.like]: `%${name}%` }; // Case-insensitive search for product name
        }
        if (condition) {
            whereClause.condition = condition; // Filter by product condition
        }
        // Construct the where clause for subCategory with conditional categoryId and subCategoryName
        const subCategoryWhereClause = {};
        if (subCategoryName) {
            subCategoryWhereClause.name = { [sequelize_1.Op.like]: `%${subCategoryName}%` };
        }
        // Include the subCategory relation with name and id filtering
        const includeClause = [
            {
                model: subcategory_1.default,
                as: "sub_category",
                where: Object.keys(subCategoryWhereClause).length > 0
                    ? subCategoryWhereClause
                    : undefined,
                attributes: ["id", "name"],
            },
        ];
        // Fetch active products with subcategory details
        const products = yield product_1.default.findAll({
            where: whereClause,
            include: includeClause,
        });
        res.status(200).json({ data: products });
    }
    catch (error) {
        logger_1.default.error("Error fetching products:", error);
        res.status(500).json({
            message: error.message || "An error occurred while fetching products.",
        });
    }
});
exports.products = products;
// Get Product By ID or SKU with Recommended Products
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.query;
    try {
        // Fetch the main product by ID or SKU
        const product = yield product_1.default.findOne({
            where: {
                status: "active",
                [sequelize_1.Op.or]: [
                    { id: productId },
                    { SKU: productId }, // Replace 'SKU' with the actual SKU column name if different
                ],
            },
            include: [
                {
                    model: user_1.default,
                    as: "vendor",
                    required: true, // Make sure the user is included in the result
                },
                {
                    model: store_1.default,
                    as: "store",
                },
                {
                    model: subcategory_1.default,
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
            const kyc = yield kyc_1.default.findOne({ where: { vendorId: product.vendor.id } });
            product.vendor.setDataValue('isVerified', kyc ? kyc.isVerified : false);
        }
        // Fetch recommended products based on the same category
        const recommendedProducts = yield product_1.default.findAll({
            where: {
                categoryId: product.categoryId,
                id: { [sequelize_1.Op.ne]: product.id },
                status: "active",
            },
            limit: 10,
            order: sequelize_1.Sequelize.fn('RAND'), // Randomize the order
        });
        // Send the product and recommended products in the response
        res.status(200).json({ data: product, recommendedProducts });
    }
    catch (error) {
        logger_1.default.error("Error fetching product:", error);
        res.status(500).json({
            message: error.message || "An error occurred while fetching the product.",
        });
    }
});
exports.getProductById = getProductById;
//# sourceMappingURL=homeController.js.map