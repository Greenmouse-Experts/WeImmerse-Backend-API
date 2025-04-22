// controllers/analysis.controller.ts
import { Request, Response } from 'express';
import AnalysisService from '../services/analysis.service';
import PurchaseAdminAnalysisService from '../services/admin-analysis.service';
import StudentAnalyticsService from '../services/student-analysis.service';
import InstitutionAnalysis from '../services/institution-analysis.service';

export const getYearlyAnalysis = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    const year = req.query.year
      ? parseInt(req.query.year as string)
      : new Date().getFullYear();
    const analysis = await AnalysisService.getYearlyAnalysis(year, userId);
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

export const getRecentSignups = async (req: Request, res: Response) => {
  try {
    const filters: any = { userType: null, limit: null };
    filters.userType = req.query.userType as string | undefined;
    filters.limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;

    const analysis = await PurchaseAdminAnalysisService.getRecentSignups(
      filters
    );
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching yearly analysis:', error);
    res.status(500).json({ message: 'Failed to fetch yearly analysis' });
  }
};

export async function getUserStats(req: Request, res: Response) {
  try {
    const stats = await PurchaseAdminAnalysisService.getUserStats();
    res.json(stats);
  } catch (error) {
    console.error('Failed to fetch user stats:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
}

export async function getUsersByCountry(req: Request, res: Response) {
  try {
    const stats = await PurchaseAdminAnalysisService.getUsersByCountry();
    res.json(stats);
  } catch (error) {
    console.error('Failed to fetch user country stats:', error);
    res.status(500).json({ error: 'Failed to fetch user country statistics' });
  }
}

// Add this to your existing controller file
export const getStudentAnalysis = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;

    const year = req.query.year
      ? parseInt(req.query.year as string)
      : new Date().getFullYear();

    const analysis = await StudentAnalyticsService.getStudentAnalytics(userId);
    res.json(analysis);
  } catch (error) {
    console.error('Error fetching student analysis:', error);
    res.status(500).json({ message: 'Failed to fetch student analysis' });
  }
};

// get user analysis
export const getUserAnalysis = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = (req.user as any)?.id;

    const analysis = await StudentAnalyticsService.compiledForUser(userId);
    return res.json(analysis);
  } catch (error) {
    console.error('Error fetching user analysis:', error);
    res.status(500).json({ message: 'Failed to fetch user analysis' });
  }
};

export const getInstitutionAnalytics = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = (req.user as any)?.id;

    const analysis = await InstitutionAnalysis.compiledForInstitution(userId);
    return res.json(analysis);
  } catch (error) {
    console.error('Error fetching user analysis:', error);
    res.status(500).json({ message: 'Failed to fetch user analysis' });
  }
};
