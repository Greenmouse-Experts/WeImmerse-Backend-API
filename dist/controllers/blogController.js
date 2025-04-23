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
exports.deleteBlogCategory = exports.updateBlogCategory = exports.getCategoryById = exports.getCategoryBySlug = exports.getCategories = exports.createBlogCategory = exports.deleteBlog = exports.updateBlog = exports.getBlogBySlug = exports.getBlogs = exports.createBlog = void 0;
const blog_1 = __importDefault(require("../models/blog"));
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
            include: ['user'],
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
// Get single blog by slug
const getBlogBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield blog_1.default.findOne({
            where: { slug: req.params.slug },
            include: ['user'],
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
        // Check ownership
        if (blog.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this blog',
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
        // Check ownership
        if (blog.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this blog',
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