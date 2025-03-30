// jobs/subscription.job.ts
import cron from 'node-cron';
import SubscriptionService from '../services/subscription.service';
import logger from '../middlewares/logger';

// Run every day at midnight
export function setupSubscriptionJobs() {
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Checking for expired subscriptions...');
      const count = await SubscriptionService.checkExpiredSubscriptions();
      logger.info(`Processed ${count} expired subscriptions`);
    } catch (error) {
      logger.error('Error processing expired subscriptions:', error);
    }
  });
}
