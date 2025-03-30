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
exports.setupSubscriptionJobs = setupSubscriptionJobs;
// jobs/subscription.job.ts
const node_cron_1 = __importDefault(require("node-cron"));
const subscription_service_1 = __importDefault(require("../services/subscription.service"));
const logger_1 = __importDefault(require("../middlewares/logger"));
// Run every day at midnight
function setupSubscriptionJobs() {
    node_cron_1.default.schedule('0 0 * * *', () => __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.default.info('Checking for expired subscriptions...');
            const count = yield subscription_service_1.default.checkExpiredSubscriptions();
            logger_1.default.info(`Processed ${count} expired subscriptions`);
        }
        catch (error) {
            logger_1.default.error('Error processing expired subscriptions:', error);
        }
    }));
}
//# sourceMappingURL=subscription.job.js.map