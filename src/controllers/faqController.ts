import { Request, Response } from 'express';
import { FAQService } from '../services/faq.service';
import { sendResponse } from '../utils/responseHandler';
import FAQ, { FAQStatus, FAQVisibility } from '../models/faq';

class FAQController {
  private faqService: FAQService;

  constructor() {
    this.faqService = new FAQService();
  }

  /**
   * Get all FAQs
   */
  getAllFAQs = async (req: Request, res: Response) => {
    try {
      const { status, visibility } = req.query;

      const filter: Partial<FAQ> = {};

      if (status && Object.values(FAQStatus).includes(status as FAQStatus)) {
        filter.status = status as FAQStatus;
      }

      if (
        visibility &&
        Object.values(FAQVisibility).includes(visibility as FAQVisibility)
      ) {
        filter.visibility = visibility as FAQVisibility;
      }

      const faqs = await this.faqService.getAllFAQs(filter);
      sendResponse(res, 200, faqs);
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };

  /**
   * Get FAQ by ID
   */
  getFAQById = async (req: Request, res: Response) => {
    try {
      const faq = await this.faqService.getFAQById(req.params.id);
      if (!faq) {
        return sendResponse(res, 404, { message: 'FAQ not found' });
      }
      sendResponse(res, 200, faq);
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };

  /**
   * Get FAQs by category
   */
  getFAQsByCategory = async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      const filter: Partial<FAQ> = { categoryId: req.params.categoryId };

      if (status && Object.values(FAQStatus).includes(status as FAQStatus)) {
        filter.status = status as FAQStatus;
      }

      const faqs = await this.faqService.getFAQsByCategory(filter);
      sendResponse(res, 200, faqs);
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };

  /**
   * Create new FAQ
   */
  createFAQ = async (req: Request, res: Response) => {
    try {
      const faqData = {
        ...req.body,
        status: req.body.status || FAQStatus.DRAFT,
        visibility: req.body.visibility || FAQVisibility.PUBLIC,
      };

      const faq = await this.faqService.createFAQ(faqData);
      sendResponse(res, 201, faq);
    } catch (error: any) {
      sendResponse(res, 400, { message: error.message });
    }
  };

  /**
   * Update FAQ
   */
  updateFAQ = async (req: Request, res: Response) => {
    try {
      const updatedFAQ = await this.faqService.updateFAQ(
        req.params.id,
        req.body
      );
      if (!updatedFAQ) {
        return sendResponse(res, 404, { message: 'FAQ not found' });
      }
      sendResponse(res, 200, updatedFAQ);
    } catch (error: any) {
      sendResponse(res, 400, { message: error.message });
    }
  };

  /**
   * Delete FAQ
   */
  deleteFAQ = async (req: Request, res: Response) => {
    try {
      const result = await this.faqService.deleteFAQ(req.params.id);
      if (!result) {
        return sendResponse(res, 404, { message: 'FAQ not found' });
      }
      sendResponse(res, 200, null, 'FAQ deleted successfully.');
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };

  /**
   * Mark FAQ as helpful
   */
  markHelpful = async (req: Request, res: Response) => {
    try {
      const result = await this.faqService.markHelpful(req.params.id);
      if (!result) {
        return sendResponse(res, 404, { message: 'FAQ not found' });
      }
      sendResponse(res, 200, result);
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };

  /**
   * Mark FAQ as not helpful
   */
  markNotHelpful = async (req: Request, res: Response) => {
    try {
      const result = await this.faqService.markNotHelpful(req.params.id);
      if (!result) {
        return sendResponse(res, 404, { message: 'FAQ not found' });
      }
      sendResponse(res, 200, result);
    } catch (error: any) {
      sendResponse(res, 500, { message: error.message });
    }
  };
}

export default new FAQController();
