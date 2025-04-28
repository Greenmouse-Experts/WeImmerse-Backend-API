import FAQCategory from '../models/faqcategory';
import FAQ from '../models/faq';
import { FAQCategoryStatus } from '../models/faqcategory';
import { FAQStatus } from '../models/faq';
import { BadRequestError, NotFoundError } from '../utils/ApiError';

export class FAQCategoryService {
  /**
   * Get all categories with optional filtering
   */
  async getAllCategories(
    filter: Partial<FAQCategory> = {}
  ): Promise<FAQCategory[]> {
    return FAQCategory.findAll({
      where: filter,
      order: [['name', 'ASC']],
    });
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<FAQCategory | null> {
    return FAQCategory.findByPk(id);
  }

  /**
   * Create new category
   */
  async createCategory(
    categoryData: Partial<FAQCategory>
  ): Promise<FAQCategory> {
    return FAQCategory.create(categoryData);
  }

  /**
   * Update category
   */
  async updateCategory(
    id: string,
    categoryData: Partial<FAQCategory>
  ): Promise<FAQCategory | null> {
    const category = await FAQCategory.findByPk(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category.update(categoryData);
  }

  /**
   * Delete category (soft delete by changing status)
   */
  async deleteCategory(id: string): Promise<boolean> {
    const category = (await FAQCategory.findOne({
      where: { id },
      include: [{ model: FAQ, as: 'faqs' }],
    })) as any;
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.faqs.length) {
      throw new BadRequestError(
        'Category cannot be deleted as it is not empty.'
      );
    }

    // Archive the category
    await category.destroy();

    return true;
  }

  /**
   * Get category with its FAQs
   */
  async getCategoryWithFAQs(
    id: string,
    faqFilter: Partial<FAQ> = {}
  ): Promise<FAQCategory | null> {
    return FAQCategory.findByPk(id, {
      include: [
        {
          model: FAQ,
          as: 'faqs',
          where: faqFilter,
          required: false,
          attributes: ['id', 'question', 'status', 'views', 'createdAt'],
        },
      ],
    });
  }

  /**
   * Change category status
   */
  async changeStatus(
    id: string,
    status: FAQCategoryStatus
  ): Promise<FAQCategory | null> {
    const category = await FAQCategory.findByPk(id);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category.update({ status });
  }
}
