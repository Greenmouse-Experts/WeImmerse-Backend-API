// controllers/purchaseAnalysis.controller.ts
import { Request, Response } from 'express';
import PurchaseAnalysisService from '../services/analysis.service';

export const getYearlyAnalysis = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;

    const year = req.query.year
      ? parseInt(req.query.year as string)
      : new Date().getFullYear();
    const analysis = await PurchaseAnalysisService.getYearlyAnalysis(
      year,
      userId
    );
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching yearly analysis:', error);
    res.status(500).json({ message: 'Failed to fetch yearly analysis' });
  }
};
