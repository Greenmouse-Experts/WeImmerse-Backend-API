"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.sendSubscriptionConfirmation = sendSubscriptionConfirmation;
// utils/email.ts
const logger_1 = __importDefault(require("../middlewares/logger"));
function sendEmail(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // In a real app, this would use your email service (Nodemailer, SendGrid, etc.)
        logger_1.default.info(`Sending email to ${options.to} with subject: ${options.subject}`);
        // console.log(options.html); // For debugging
        return true;
    });
}
function sendSubscriptionConfirmation(subscription) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
// Add similar functions for other email types
//# sourceMappingURL=email.js.map