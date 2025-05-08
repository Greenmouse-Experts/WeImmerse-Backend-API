import { Request, Response } from 'express';
import SearchService from '../services/search.service';
import JobService from '../services/job.service';

class SearchController {
  async searchItems(req: Request, res: Response): Promise<any> {
    const { q: searchKey } = req.query;

    if (
      !searchKey ||
      typeof searchKey !== 'string' ||
      searchKey.trim() === ''
    ) {
      return res.status(200).json({
        success: true,
        data: {
          courses: [],
          digitalAssets: [],
          physicalAssets: [],
        },
      });
    }

    const result = await SearchService.searchRecentItems(searchKey);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json(result);
  }

  async searchAllItems(req: Request, res: Response): Promise<any> {
    const { q: searchKey } = req.query;

    if (
      !searchKey ||
      typeof searchKey !== 'string' ||
      searchKey.trim() === ''
    ) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const result = await SearchService.searchAllRecentItems(searchKey);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json(result);
  }

  async searchJobs(req: Request, res: Response): Promise<any> {
    const {
      q: searchKey = '',
      location,
      jobType,
      workplaceType,
      categoryId,
      page = 1,
      limit = 10,
    } = req.query;

    const result = await JobService.searchJobs(searchKey as string, {
      location: location as string,
      jobType: jobType as string,
      workplaceType: workplaceType as string,
      categoryId: categoryId,
      page: Number(page),
      limit: Number(limit),
    });

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.status(200).json(result);
  }
}

export default new SearchController();
