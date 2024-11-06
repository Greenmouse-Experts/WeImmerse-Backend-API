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
exports.checkVendorAuctionProductLimit = exports.checkVendorProductLimit = exports.fetchAdminWithPermissions = exports.sendSMS = exports.capitalizeFirstLetter = exports.generateOTP = void 0;
// utils/helpers.ts
const http_1 = __importDefault(require("http"));
const querystring_1 = __importDefault(require("querystring"));
const admin_1 = __importDefault(require("../models/admin"));
const role_1 = __importDefault(require("../models/role"));
const permission_1 = __importDefault(require("../models/permission"));
const vendorsubscription_1 = __importDefault(require("../models/vendorsubscription"));
const subscriptionplan_1 = __importDefault(require("../models/subscriptionplan"));
const product_1 = __importDefault(require("../models/product"));
const auctionproduct_1 = __importDefault(require("../models/auctionproduct"));
// Function to generate a 6-digit OTP
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    return otp;
};
exports.generateOTP = generateOTP;
// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
const sendSMS = (mobile, messageContent) => __awaiter(void 0, void 0, void 0, function* () {
    const apiUrl = 'portal.nigeriabulksms.com';
    const data = querystring_1.default.stringify({
        username: process.env.SMS_USERNAME,
        password: process.env.SMS_PASSWORD,
        sender: process.env.APP_NAME,
        message: messageContent,
        mobiles: mobile,
    });
    const options = {
        hostname: apiUrl,
        path: '/api/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length,
        },
    };
    return new Promise((resolve, reject) => {
        const req = http_1.default.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    if (result.status && result.status.toUpperCase() === 'OK') {
                        console.log('SMS sent successfully');
                        resolve();
                    }
                    else {
                        reject(new Error(`SMS failed with error: ${result.error}`));
                    }
                }
                catch (error) {
                    reject(new Error('Failed to parse SMS response'));
                }
            });
        });
        req.on('error', (error) => {
            reject(new Error(`Failed to send SMS: ${error.message}`));
        });
        // Send the request with the post data
        req.write(data);
        req.end();
    });
});
exports.sendSMS = sendSMS;
const fetchAdminWithPermissions = (adminId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield admin_1.default.findByPk(adminId, {
        include: [
            {
                model: role_1.default,
                include: [permission_1.default], // Assuming you have a Role and Permission model with proper associations
            },
        ],
    });
});
exports.fetchAdminWithPermissions = fetchAdminWithPermissions;
/**
 * Checks if a vendor has reached their product limit based on their active subscription plan.
 * @param vendorId - The ID of the vendor to check.
 * @returns A promise that resolves to an object indicating the status and a message.
 */
const checkVendorProductLimit = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the active subscription for the vendor
        const activeSubscription = yield vendorsubscription_1.default.findOne({
            where: {
                vendorId,
                isActive: true,
            },
        });
        if (!activeSubscription) {
            return { status: false, message: 'Vendor does not have an active subscription.' };
        }
        // Fetch the subscription plan details
        const subscriptionPlan = yield subscriptionplan_1.default.findByPk(activeSubscription.subscriptionPlanId);
        if (!subscriptionPlan) {
            return { status: false, message: 'Subscription plan not found.' };
        }
        const { productLimit } = subscriptionPlan;
        // Count the number of products already created by the vendor
        const productCount = yield product_1.default.count({
            where: { vendorId },
        });
        if (productCount >= productLimit) {
            return { status: false, message: 'You have reached the maximum number of products allowed for your current subscription plan. Please upgrade your plan to add more products.' };
        }
        return { status: true, message: 'Vendor can create more products.' };
    }
    catch (error) {
        // Error type should be handled more gracefully if you have custom error types
        throw new Error(error.message || 'An error occurred while checking the product limit.');
    }
});
exports.checkVendorProductLimit = checkVendorProductLimit;
const checkVendorAuctionProductLimit = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the active subscription for the vendor
        const activeSubscription = yield vendorsubscription_1.default.findOne({
            where: {
                vendorId,
                isActive: true,
            },
        });
        if (!activeSubscription) {
            return { status: false, message: 'Vendor does not have an active subscription.' };
        }
        // Fetch the subscription plan details
        const subscriptionPlan = yield subscriptionplan_1.default.findByPk(activeSubscription.subscriptionPlanId);
        if (!subscriptionPlan) {
            return { status: false, message: 'Subscription plan not found.' };
        }
        const auctionProductLimit = subscriptionPlan.auctionProductLimit;
        // Handle the case where auctionProductLimit is null
        if (auctionProductLimit === null) {
            return { status: false, message: 'Subscription plan does not define a limit for auction products.' };
        }
        // Count the number of products already created by the vendor
        const auctionProductCount = yield auctionproduct_1.default.count({
            where: { vendorId },
        });
        if (auctionProductCount >= auctionProductLimit) {
            return { status: false, message: 'You have reached the maximum number of products allowed for your current subscription plan. Please upgrade your plan to add more products.' };
        }
        return { status: true, message: 'Vendor can create more auction products.' };
    }
    catch (error) {
        // Error type should be handled more gracefully if you have custom error types
        throw new Error(error.message || 'An error occurred while checking the auction product limit.');
    }
});
exports.checkVendorAuctionProductLimit = checkVendorAuctionProductLimit;
//# sourceMappingURL=helpers.js.map