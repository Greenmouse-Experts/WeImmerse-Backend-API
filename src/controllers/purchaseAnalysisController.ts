// controllers/purchaseAnalysis.controller.ts
import { Request, Response } from 'express';
import PurchaseAnalysisService from '../services/analysis.service';
import PurchaseAdminAnalysisService from '../services/admin-analysis.service';

export const getYearlyAnalysis = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

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

export const getAdminYearlyAnalysis = async (req: Request, res: Response) => {
  try {
    const year = req.query.year
      ? parseInt(req.query.year as string)
      : new Date().getFullYear();

    const analysis = await PurchaseAdminAnalysisService.getYearlyAnalysis(year);
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching yearly analysis:', error);
    res.status(500).json({ message: 'Failed to fetch yearly analysis' });
  }
};

// export const getCreatorAnalysis = async (req: Request, res: Response) => {
//   try {
//     const creatorId = req.params.creatorId;
//     const year = req.query.year
//       ? parseInt(req.query.year as string)
//       : new Date().getFullYear();
//     const analysis = await PurchaseAnalysisService.getCreatorAnalysis(
//       creatorId,
//       year
//     );
//     res.json(analysis);
//   } catch (error) {
//     console.error('Error fetching creator analysis:', error);
//     res.status(500).json({ message: 'Failed to fetch creator analysis' });
//   }
// };
