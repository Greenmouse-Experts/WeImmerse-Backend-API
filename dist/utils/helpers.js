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
exports.formatMoney = exports.uploadToS3 = exports.getTotalPages = exports.getPaginationFields = exports.formatCourse = exports.getJobsBySearch = exports.shuffleArray = exports.verifyPayment = exports.fetchAdminWithPermissions = exports.sendSMS = exports.generateOTP = void 0;
exports.capitalizeFirstLetter = capitalizeFirstLetter;
exports.generateReferralCode = generateReferralCode;
// utils/helpers.ts
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const querystring_1 = __importDefault(require("querystring"));
const admin_1 = __importDefault(require("../models/admin"));
const role_1 = __importDefault(require("../models/role"));
const permission_1 = __importDefault(require("../models/permission"));
const sequelize_1 = require("sequelize");
const job_1 = __importDefault(require("../models/job"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
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
function generateReferralCode(name) {
    return `${name.substring(0, 3)}${Date.now().toString().slice(-5)}`;
}
const sendSMS = (mobile, messageContent) => __awaiter(void 0, void 0, void 0, function* () {
    const apiUrl = 'portal.nigeriabulksms.com';
    const data = querystring_1.default.stringify({
        username: process.env.SMS_USERNAME, // Your SMS API username
        password: process.env.SMS_PASSWORD, // Your SMS API password
        sender: process.env.APP_NAME, // Sender ID
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
            hostname: 'api.paystack.co',
            path: `/transaction/verify/${refId}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`, // Use dynamic key
            },
        };
        const req = https_1.default.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
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
                    reject(new Error('Invalid response from Paystack'));
                }
            });
        });
        req.on('error', (e) => {
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
const getJobsBySearch = (searchTerm, number) => __awaiter(void 0, void 0, void 0, function* () {
    const where = { status: 'active' };
    if (searchTerm) {
        const searchRegex = { [sequelize_1.Op.iLike]: `%${searchTerm}%` }; // Use Sequelize's Op.iLike for case-insensitive search.
        where[sequelize_1.Op.or] = [
            { title: searchRegex },
            { company: searchRegex },
            { workplace_type: searchRegex },
            { job_type: searchRegex },
            { location: searchRegex },
            { category: searchRegex },
        ];
    }
    return yield job_1.default.findAll({
        where,
        order: [['createdAt', 'DESC']], // Sort by createdAt in descending order.
        limit: number, // Limit the number of results.
    });
});
exports.getJobsBySearch = getJobsBySearch;
const formatCourse = (course, authUserId) => __awaiter(void 0, void 0, void 0, function* () {
    const isTutor = course.creatorId === authUserId;
    return {
        id: course.id,
        category: course.categoryId,
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        durationHMS: (yield course.getDurationHMS()) || null,
        tutor: course.creator ? formatUser(course.creator) : null, // Assume formatUser is a utility to format user data
        modules: course.modules ? course.modules.map(formatModule) : [], // Assume formatModule formats a module
        images: course.image,
        language: course.language,
        level: course.level,
        price: course.price,
        requirement: course.requirement,
        whatToLearn: course.whatToLearn,
        published: course.published,
        // isEnrolled: course.is_enrolled,
        status: course.status,
        // Tutor-specific data
        // total_sales: isTutor ? course.getTotalSales() : null,
        // sales_this_month: isTutor ? course.getSalesThisMonth() : null,
        // enrolledThisMonth: isTutor ? course.getEnrollmentsThisMonth() : null,
        // percentCompleted: course.getPercentComplete ? course.getPercentComplete() : null,
        totalArticles: (yield course.getTotalArticles()) || 0,
        totalVideos: (yield course.getTotalVideos()) || 0,
        totalYoutubes: (yield course.getTotalYoutubes()) || 0,
        totalAudio: (yield course.getTotalAudios()) || 0,
        totalHours: (yield course.getTotalHours()) || 0,
        totalModules: (yield course.getTotalModules()) || 0,
        totalLessons: (yield course.getTotalLessons()) || 0,
        totalQuizzes: (yield course.getTotalQuizzes()) || 0,
        totalQuizQuestions: (yield course.getTotalQuizQuestions()) || 0,
        totalPublishedLessons: (yield course.getTotalPublishedLessons()) || 0,
        totalReviews: (yield course.getTotalReviews()) || 0,
        averageReviews: (yield course.getAverageReviews()) || 0,
        totalStudents: (yield course.getTotalStudents()) || 0,
        totalVideoHours: (yield course.getTotalVideoHours()) || 0,
        totalLikes: (yield course.getTotalLikes()) || 0,
        created_at: course.createdAt,
        updated_at: course.updatedAt,
    };
});
exports.formatCourse = formatCourse;
// Utility functions for related resources
const formatUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    // Add other fields as needed
});
const formatModule = (module) => ({
    id: module.id,
    title: module.title,
    // Add other fields as needed
});
const getPaginationFields = (_page, _limit) => {
    const page = parseInt(_page, 10) || 1; // Default to page 1
    const limit = parseInt(_limit, 10) || 10; // Default to 10 items per page
    const offset = (page - 1) * limit;
    return {
        page,
        limit,
        offset,
    };
};
exports.getPaginationFields = getPaginationFields;
const getTotalPages = (totalItems, limit) => {
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);
    return totalPages;
};
exports.getTotalPages = getTotalPages;
const uploadToS3 = (fileBuffer, originalFileName, bucketName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileExtension = path_1.default.extname(originalFileName);
        const uniqueFileName = `${(0, uuid_1.v4)()}${fileExtension}`;
        const params = {
            Bucket: bucketName,
            Key: uniqueFileName,
            Body: fileBuffer,
            ContentType: 'application/octet-stream',
            ACL: 'public-read',
        };
        const uploadResult = yield s3.upload(params).promise();
        return uploadResult.Location;
    }
    catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('File upload failed');
    }
});
exports.uploadToS3 = uploadToS3;
const formatMoney = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
};
exports.formatMoney = formatMoney;
//# sourceMappingURL=helpers.js.map