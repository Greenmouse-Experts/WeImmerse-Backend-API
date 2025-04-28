import FAQ from '../models/faq';
import FAQCategory from '../models/faqcategory';
import { FAQStatus, FAQVisibility } from '../models/faq';
import { NotFoundError } from '../utils/ApiError';

export class FAQService {
  /**
   * Get all FAQs with optional filtering
   */
  async getAllFAQs(filter: Partial<FAQ> = {}): Promise<FAQ[]> {
    return FAQ.findAll({
      where: filter,
      include: [
        {
          model: FAQCategory,
          as: 'category',
          attributes: ['id', 'name', 'icon'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Get FAQ by ID and increment views
   */
  async getFAQById(id: string): Promise<FAQ | null> {
    const faq = await FAQ.findByPk(id, {
      include: [
        {
          model: FAQCategory,
          as: 'category',
          attributes: ['id', 'name', 'icon'],
        },
      ],
    });

    if (faq) {
      await faq.increment('views');
      return faq;
    }
    return null;
  }

  /**
   * Get FAQs by category with optional filtering
   */
  async getFAQsByCategory(filter: Partial<FAQ>): Promise<FAQ[]> {
    return FAQ.findAll({
      where: filter,
      include: [
        {
          model: FAQCategory,
          as: 'category',
          attributes: ['id', 'name', 'icon'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Create new FAQ
   */
  async createFAQ(faqData: Partial<FAQ>): Promise<FAQ> {
    return FAQ.create(faqData);
  }

  /**
   * Update FAQ
   */
  async updateFAQ(id: string, faqData: Partial<FAQ>): Promise<FAQ | null> {
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      throw new NotFoundError('FAQ not found');
    }

    return faq.update(faqData);
  }

  /**
   * Delete FAQ (soft delete by changing status)
   */
  async deleteFAQ(id: string): Promise<boolean> {
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      throw new NotFoundError('FAQ not found');
    }

    await faq.destroy();
    return true;
  }

  /**
   * Mark FAQ as helpful
   */
  async markHelpful(id: string): Promise<FAQ | null> {
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      throw new NotFoundError('FAQ not found');
    }

    return faq.increment('helpfulCount');
  }

  /**
   * Mark FAQ as not helpful
   */
  async markNotHelpful(id: string): Promise<FAQ | null> {
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      throw new NotFoundError('FAQ not found');
    }

    return faq.increment('notHelpfulCount');
  }

  /**
   * Change FAQ status
   */
  async changeStatus(id: string, status: FAQStatus): Promise<FAQ | null> {
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      throw new NotFoundError('FAQ not found');
    }

    return faq.update({ status });
  }
}
