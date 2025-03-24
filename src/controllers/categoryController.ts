import { Request, Response } from 'express';
import categoryService from '../services/category.service';
import { handleError } from '../utils/errorHandler';
import { CategoryTypes } from '../models/category';

class CategoryController {
  async createCategory(req: Request, res: Response) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json({
        status: true,
        message: 'Category created successfully.',
        data: category,
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  async getCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const includeChildren = req.query.includeChildren === 'true';
      const category = await categoryService.getCategoryById(
        id,
        includeChildren
      );
      res.json({ status: true, data: category });
    } catch (error) {
      handleError(res, error);
    }
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const includeInactive = req.query.includeInactive === 'true';
      const type = req.query.type as CategoryTypes;
      const categories = await categoryService.getAllCategories(
        includeInactive,
        type
      );
      res.json({ status: true, data: categories });
    } catch (error) {
      handleError(res, error);
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await categoryService.updateCategory(id, req.body);
      res.json({
        status: true,
        message: 'Category updated successfully.',
        data: category,
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      res
        .status(200)
        .json({ status: true, message: 'Category deleted successfully.' });
    } catch (error) {
      handleError(res, error);
    }
  }

  async toggleCategoryStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await categoryService.toggleCategoryStatus(id);
      res.json({
        status: true,
        message: 'Category status updated successfully.',
        data: category,
      });
    } catch (error) {
      handleError(res, error);
    }
  }
}

export default new CategoryController();
