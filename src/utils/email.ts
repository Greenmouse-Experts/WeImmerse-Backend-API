// utils/email.ts
import logger from '../middlewares/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  // In a real app, this would use your email service (Nodemailer, SendGrid, etc.)
  logger.info(
    `Sending email to ${options.to} with subject: ${options.subject}`
  );
  // console.log(options.html); // For debugging
  return true;
}

export async function sendSubscriptionConfirmation(subscription: any) {
  const html = `
    <h1>Subscription Confirmation</h1>
    <p>Thank you for subscribing to our service!</p>
    <p>Your subscription details:</p>
    <ul>
      <li>Plan: ${subscription.plan.name}</li>
      <li>Start Date: ${subscription.startDate}</li>
      <li>End Date: ${subscription.endDate}</li>
      <li>Price: ${subscription.plan.currency} ${subscription.plan.price}</li>
    </ul>
  `;

  return sendEmail({
    to: subscription.user.email, // Assuming user has email
    subject: 'Subscription Confirmation',
    html,
  });
}

// Add similar functions for other email types
