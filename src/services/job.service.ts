// src/services/jobService.ts
import Job, { JobStatus } from '../models/job';
import User from '../models/user';

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
}

export default new JobService();
