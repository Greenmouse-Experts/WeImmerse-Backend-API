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
exports.generateReferralCode = exports.shuffleArray = exports.verifyPayment = exports.fetchAdminWithPermissions = exports.sendSMS = exports.capitalizeFirstLetter = exports.generateOTP = void 0;
// utils/helpers.ts
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const querystring_1 = __importDefault(require("querystring"));
const admin_1 = __importDefault(require("../models/admin"));
const role_1 = __importDefault(require("../models/role"));
const permission_1 = __importDefault(require("../models/permission"));
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
function generateReferralCode(name) {
    return `${name.substring(0, 3)}${Date.now().toString().slice(-5)}`;
}
exports.generateReferralCode = generateReferralCode;
;
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
const verifyPayment = (refId, paystackSecretKey) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: "api.paystack.co",
            path: `/transaction/verify/${refId}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`, // Use dynamic key
            },
        };
        const req = https_1.default.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                try {
                    const response = JSON.parse(data);
                    if (response.status) {
                        resolve(response.data);
                    }
                    else {
                        reject(new Error(`Paystack Error: ${response.message}`));
                    }
                }
                catch (err) {
                    reject(new Error("Invalid response from Paystack"));
                }
            });
        });
        req.on("error", (e) => {
            reject(new Error(`Error validating payment: ${e.message}`));
        });
        req.end();
    });
};
exports.verifyPayment = verifyPayment;
// Utility function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
exports.shuffleArray = shuffleArray;
//# sourceMappingURL=helpers.js.map