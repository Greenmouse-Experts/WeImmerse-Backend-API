import { Request, Response } from 'express';
import Blog, { BlogStatus } from '../models/blog';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import BlogCategory from '../models/blogcategory';

// Create new blog
export const createBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, content, featuredImage, status, categoryId } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    // Check if blog category exists
    const blogCategory = await BlogCategory.findOne({
      where: { id: categoryId },
    });

    if (!blogCategory) {
      throw new Error('Blog category does not exist.');
    }

    const blog = await Blog.create({
      id: uuidv4(),
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
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error?.message || 'Failed to create blog',
    });
  }
};

// Get all blogs (with pagination)
export const getBlogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Blog.findAndCountAll({
      where: { status: 'published' },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: BlogCategory, as: 'category' }],
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
    });
  }
};

// Get all blogs (with pagination)
export const getAllBlogs = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Blog.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [{ model: BlogCategory, as: 'category' }],
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
    });
  }
};

// Get single blog by slug
export const getBlogBySlug = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const blog = await Blog.findOne({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
    });
  }
};

// Get single blog by id
export const getBlogById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const blog = await Blog.findOne({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
    });
  }
};

// Update blog
export const updateBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, content, featuredImage, status } = req.body;
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const updates: any = { content, featuredImage, status };
    if (title) {
      updates.title = title;
      updates.slug = slugify(title, { lower: true, strict: true });
    }

    await blog.update(updates);

    return res.json({
      success: true,
      message: 'Blog updated successfully.',
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog',
    });
  }
};

// Delete blog
export const deleteBlog = async (req: Request, res: Response): Promise<any> => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    await blog.destroy();

    return res.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
    });
  }
};

// Create new blog category
export const createBlogCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const category = await BlogCategory.create({
      name,
      slug,
      description,
    });

    return res.status(201).json({
      success: true,
      message: 'Blog catgegory created successfully.',
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create blog category',
    });
  }
};

// Get all categories
export const getCategories = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const categories = await BlogCategory.findAll({
      order: [['name', 'ASC']],
    });

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog categories',
    });
  }
};

// Get single category by slug
export const getCategoryBySlug = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const category = await BlogCategory.findOne({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
    });
  }
};

// Get single category by id
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const category = await BlogCategory.findOne({
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
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
    });
  }
};

// Update category
export const updateBlogCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { name, description } = req.body;
    const category = await BlogCategory.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const updates: any = { description };
    if (name) {
      updates.name = name;
      updates.slug = slugify(name, { lower: true, strict: true });
    }

    await category.update(updates);

    return res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update category',
    });
  }
};

// Delete category (only if no blogs are associated)
export const deleteBlogCategory = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const category = await BlogCategory.findByPk(req.params.id, {
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

    await category.destroy();

    return res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete category',
    });
  }
};
