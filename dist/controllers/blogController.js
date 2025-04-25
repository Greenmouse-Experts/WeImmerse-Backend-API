"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteBlogCategory = exports.updateBlogCategory = exports.getCategoryById = exports.getCategoryBySlug = exports.getCategories = exports.createBlogCategory = exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getBlogBySlug = exports.getUnPublishedBlogs = exports.getBlogs = exports.createBlog = void 0;
const blog_1 = __importStar(require("../models/blog"));
const uuid_1 = require("uuid");
const slugify_1 = __importDefault(require("slugify"));
const blogcategory_1 = __importDefault(require("../models/blogcategory"));
// Create new blog
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, featuredImage, status, categoryId } = req.body;
        const slug = (0, slugify_1.default)(title, { lower: true, strict: true });
        // Check if blog category exists
        const blogCategory = yield blogcategory_1.default.findOne({
            where: { id: categoryId },
        });
        if (!blogCategory) {
            throw new Error('Blog category does not exist.');
        }
        const blog = yield blog_1.default.create({
            id: (0, uuid_1.v4)(),
            title,
            slug,
            content,
            featuredImage,
            status: status || 'draft',
            categoryId,
        });
        return res.status(201).json({
            success: true,
            message: 'Blog created successfully.',
            data: blog,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) || 'Failed to create blog',
        });
    }
});
exports.createBlog = createBlog;
// Get all blogs (with pagination)
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { count, rows } = yield blog_1.default.findAndCountAll({
            where: { status: 'published' },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [{ model: blogcategory_1.default, as: 'category' }],
        });
        return res.json({
            success: true,
            data: rows,
            meta: {
                total: count,
                page,
                pages: Math.ceil(count / limit),
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
        });
    }
});
exports.getBlogs = getBlogs;
// Get all unpublished blogs (with pagination)
const getUnPublishedBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { count, rows } = yield blog_1.default.findAndCountAll({
            where: { status: blog_1.BlogStatus.DRAFT },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [{ model: blogcategory_1.default, as: 'category' }],
        });
        return res.json({
            success: true,
            data: rows,
            meta: {
                total: count,
                page,
                pages: Math.ceil(count / limit),
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
        });
    }
});
exports.getUnPublishedBlogs = getUnPublishedBlogs;
// Get single blog by slug
const getBlogBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield blog_1.default.findOne({
            where: { slug: req.params.slug },
        });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }
        return res.json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch blog',
        });
    }
});
exports.getBlogBySlug = getBlogBySlug;
// Get single blog by id
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield blog_1.default.findOne({
            where: { id: req.params.id },
        });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }
        return res.json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch blog',
        });
    }
});
exports.getBlogById = getBlogById;
// Update blog
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, featuredImage, status } = req.body;
        const blog = yield blog_1.default.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }
        const updates = { content, featuredImage, status };
        if (title) {
            updates.title = title;
            updates.slug = (0, slugify_1.default)(title, { lower: true, strict: true });
        }
        yield blog.update(updates);
        return res.json({
            success: true,
            message: 'Blog updated successfully.',
            data: blog,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update blog',
        });
    }
});
exports.updateBlog = updateBlog;
// Delete blog
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield blog_1.default.findByPk(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }
        yield blog.destroy();
        return res.json({
            success: true,
            message: 'Blog deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete blog',
        });
    }
});
exports.deleteBlog = deleteBlog;
// Create new blog category
const createBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        const category = yield blogcategory_1.default.create({
            name,
            slug,
            description,
        });
        return res.status(201).json({
            success: true,
            message: 'Blog catgegory created successfully.',
            data: category,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create blog category',
        });
    }
});
exports.createBlogCategory = createBlogCategory;
// Get all categories
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield blogcategory_1.default.findAll({
            order: [['name', 'ASC']],
        });
        return res.json({
            success: true,
            data: categories,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch blog categories',
        });
    }
});
exports.getCategories = getCategories;
// Get single category by slug
const getCategoryBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield blogcategory_1.default.findOne({
            where: { slug: req.params.slug },
            include: ['blogs'], // Include associated blogs if needed
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        return res.json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch category',
        });
    }
});
exports.getCategoryBySlug = getCategoryBySlug;
// Get single category by id
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield blogcategory_1.default.findOne({
            where: { id: req.params.id },
            include: ['blogs'], // Include associated blogs if needed
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        return res.json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch category',
        });
    }
});
exports.getCategoryById = getCategoryById;
// Update category
const updateBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const category = yield blogcategory_1.default.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        const updates = { description };
        if (name) {
            updates.name = name;
            updates.slug = (0, slugify_1.default)(name, { lower: true, strict: true });
        }
        yield category.update(updates);
        return res.json({
            success: true,
            data: category,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update category',
        });
    }
});
exports.updateBlogCategory = updateBlogCategory;
// Delete category (only if no blogs are associated)
const deleteBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield blogcategory_1.default.findByPk(req.params.id, {
            include: ['blogs'],
        });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }
        // Check if category has associated blogs
        if (category.blogs && category.blogs.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with associated blogs',
            });
        }
        yield category.destroy();
        return res.json({
            success: true,
            message: 'Category deleted successfully',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete category',
        });
    }
});
exports.deleteBlogCategory = deleteBlogCategory;
//# sourceMappingURL=blogController.js.map