import { Request, Response } from 'express';
import { FAQCategoryService } from '../services/faq-category.service';
import { sendResponse } from '../utils/responseHandler';
import FAQCategory, { FAQCategoryStatus } from '../models/faqcategory';
import FAQ, { FAQStatus } from '../models/faq';

class FAQCategoryController {
  private categoryService: FAQCategoryService;

  constructor() {
    this.categoryService = new FAQCategoryService();
  }

  /**
   * Get all categories
   */
  getAllCategories = async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      const filter: Partial<FAQCategory> = {};

      if (
        status &&
        Object.values(FAQCategoryStatus).includes(status as FAQCategoryStatus)
      ) {
        filter.status = status as FAQCategoryStatus;
      }

      const categories = await this.categoryService.getAllCategories(filter);
      sendResponse(res, 200, categories);
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };

  /**
   * Get category by ID
   */
  getCategoryById = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.getCategoryById(
        req.params.id
      );
      if (!category) {
        return sendResponse(res, 404, { message: 'Category not found' });
      }
      sendResponse(res, 200, category);
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };

  /**
   * Create new category
   */
  createCategory = async (req: Request, res: Response) => {
    try {
      const categoryData = {
        ...req.body,
        status: req.body.status || FAQCategoryStatus.ACTIVE,
      };

      const category = await this.categoryService.createCategory(categoryData);
      sendResponse(res, 201, category);
    } catch (error: any) {
      sendResponse(res, 400, { message: error.message });
    }
  };

  /**
   * Update category
   */
  updateCategory = async (req: Request, res: Response) => {
    try {
      const updatedCategory = await this.categoryService.updateCategory(
        req.params.id,
        req.body
      );
      if (!updatedCategory) {
        return sendResponse(res, 404, { message: 'Category not found' });
      }
      sendResponse(res, 200, updatedCategory);
    } catch (error: any) {
      sendResponse(res, 400, { message: error.message });
    }
  };

  /**
   * Delete category
   */
  deleteCategory = async (req: Request, res: Response) => {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      if (!result) {
        return sendResponse(res, 404, { message: 'Category not found' });
      }
      sendResponse(res, 200, null, 'Category deleted successfully.');
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };

  /**
   * Get category with FAQs
   */
  getCategoryWithFAQs = async (req: Request, res: Response) => {
    try {
      const { faqStatus } = req.query;
      const filter: Partial<FAQ> = {};

      if (
        faqStatus &&
        Object.values(FAQStatus).includes(faqStatus as FAQStatus)
      ) {
        filter.status = faqStatus as FAQStatus;
      }

      const category = await this.categoryService.getCategoryWithFAQs(
        req.params.id,
        filter
      );

      if (!category) {
        return sendResponse(res, 404, null, 'Category not found');
      }
      sendResponse(res, 200, category);
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };
}

export default new FAQCategoryController();
