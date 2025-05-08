import { Op } from 'sequelize';
import Course from '../models/course';
import DigitalAsset from '../models/digitalasset';
import User from '../models/user';
import PhysicalAsset from '../models/physicalasset';

class SearchService {
  async searchRecentItems(searchKey: string) {
    try {
      const searchOptions = {
        where: {
          [Op.or]: [
            { description: { [Op.like]: `%${searchKey}%` } },
            { assetDetails: { [Op.like]: `%${searchKey}%` } },
          ],
        },
        limit: 10,
        order: [['createdAt', 'DESC']],
      };

      const [courses, digitalAssets, physicalAssets] = await Promise.all([
        Course.findAll({
          ...searchOptions,
          where: {
            // ...searchOptions.where,
            status: 'live',
            published: true,
            ...(searchKey && { title: { [Op.like]: `%${searchKey}%` } }),
          },
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'email', 'photo'], // Only include necessary user fields
            },
          ],
        } as any),
        DigitalAsset.findAll({
          ...searchOptions,
          where: {
            // ...searchOptions.where,
            status: 'published',
            isPublished: true,
            ...(searchKey && { assetName: { [Op.like]: `%${searchKey}%` } }),
            ...(searchKey && {
              specificationTags: { [Op.contains]: [searchKey] },
            }),
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'photo'], // Only include necessary user fields
            },
          ],
        } as any),
        PhysicalAsset.findAll({
          ...searchOptions,
          where: {
            // ...searchOptions.where,
            status: 'published',
            isPublished: true,
            ...(searchKey && { assetName: { [Op.like]: `%${searchKey}%` } }),
            ...(searchKey && {
              specificationTags: { [Op.contains]: [searchKey] },
            }),
          },
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'photo'], // Only include necessary user fields
            },
          ],
        } as any),
      ]);

      return {
        success: true,
        data: {
          courses,
          digitalAssets,
          physicalAssets,
        },
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        success: false,
        message: 'An error occurred during search',
      };
    }
  }

  async searchAllRecentItems(searchKey: string) {
    try {
      const result: any = await this.searchRecentItems(searchKey);
      if (!result.success) return result;

      // Combine and sort all results by createdAt date
      const allItems = [
        ...result.data.courses.map((c: any) => ({
          ...c.get(),
          type: 'course',
        })),
        ...result.data.digitalAssets.map((da: any) => ({
          ...da.get(),
          type: 'digitalAsset',
        })),
        ...result.data.physicalAssets.map((pa: any) => ({
          ...pa.get(),
          type: 'physicalAsset',
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10);

      return {
        success: true,
        data: allItems,
      };
    } catch (error) {
      console.error('Combined search error:', error);
      return {
        success: false,
        message: 'An error occurred during combined search',
      };
    }
  }
}

export default new SearchService();
