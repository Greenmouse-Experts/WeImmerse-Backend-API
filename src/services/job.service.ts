// src/services/jobService.ts
import { Op } from 'sequelize';
import Job, { JobStatus } from '../models/job';
import User from '../models/user';
import JobCategory from '../models/jobcategory';

class JobService {
  async getAllJobs() {
    try {
      const jobs = await Job.findAll();
      return jobs;
    } catch (error) {
      throw new Error('Failed to retrieve jobs');
    }
  }

  async vetJobPost(jobId: string, status: JobStatus) {
    try {
      const job = (await Job.findOne({
        where: { id: jobId },
        include: [{ model: User, as: 'user' }],
      })) as Job & { user: User };

      if (!job) {
        throw new Error('Job not found');
      }
      job.status = status;
      await job.save();
      return job;
    } catch (error) {
      console.log(error);

      throw new Error('Failed to vet job post');
    }
  }

  async searchJobs(searchKey: string, filters: Record<string, any> = {}) {
    try {
      const {
        location = '',
        jobType = '',
        workplaceType = '',
        categoryId = '',
        status = JobStatus.ACTIVE,
        limit = 10,
        page = 1,
      } = filters;

      const offset = (page - 1) * limit;

      const whereClause: any = {
        ...(searchKey && {
          [Op.or]: [
            { title: { [Op.like]: `%${searchKey}%` } },
            { company: { [Op.like]: `%${searchKey}%` } },
            { description: { [Op.like]: `%${searchKey}%` } },
            { skills: { [Op.like]: `%${searchKey}%` } },
          ],
        }),
        status,
        isPublished: true,
      };

      // Add optional filters
      if (location) whereClause.location = { [Op.like]: `%${location}%` };
      if (jobType) whereClause.jobType = jobType;
      if (workplaceType) whereClause.workplaceType = workplaceType;
      if (categoryId) whereClause.categoryId = categoryId;

      const { count, rows: jobs } = await Job.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: JobCategory,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });

      return {
        success: true,
        data: {
          jobs,
          pagination: {
            total: count,
            page,
            pages: Math.ceil(count / limit),
            limit,
          },
        },
      };
    } catch (error) {
      console.error('Job search error:', error);
      return {
        success: false,
        message: 'An error occurred while searching for jobs',
      };
    }
  }
}

export default new JobService();
