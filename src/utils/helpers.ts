// utils/helpers.ts
import http from 'http';
import https from 'https';
import querystring from 'querystring';
import Admin from '../models/admin';
import Role from '../models/role';
import Permission from '../models/permission';
import SubscriptionPlan from '../models/subscriptionplan';
import logger from '../middlewares/logger';
import { Op } from 'sequelize';
import Job from '../models/job';
import User from '../models/user';
import Module from '../models/module';
import Course from '../models/course';

import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

interface PaystackResponse {
  status: boolean;
  message: string;
  data?: any; // Replace `any` with the specific type of the Paystack `data` object if known
}

// Function to generate a 6-digit OTP
const generateOTP = (): string => {
  const otp: string = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  return otp;
};

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function generateReferralCode(name: string): string {
  return `${name.substring(0, 3)}${Date.now().toString().slice(-5)}`;
}

const sendSMS = async (
  mobile: string,
  messageContent: string
): Promise<void> => {
  const apiUrl = 'portal.nigeriabulksms.com';
  const data = querystring.stringify({
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
    const req = http.request(options, (res) => {
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
          } else {
            reject(new Error(`SMS failed with error: ${result.error}`));
          }
        } catch (error) {
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
};

const fetchAdminWithPermissions = async (adminId: string) => {
  return await Admin.findByPk(adminId, {
    include: [
      {
        model: Role,
        include: [Permission], // Assuming you have a Role and Permission model with proper associations
      },
    ],
  });
};

const verifyPayment = (
  refId: string,
  paystackSecretKey: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      path: `/transaction/verify/${refId}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`, // Use dynamic key
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response: PaystackResponse = JSON.parse(data);

          if (response.status) {
            resolve(response.data);
          } else {
            reject(new Error(`Paystack Error: ${response.message}`));
          }
        } catch (err) {
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

// Utility function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getJobsBySearch = async (
  searchTerm: string,
  metadata:
    | {
        location: string;
        jobType: string;
        workplaceType: string;
        categoryId: string;
      }
    | any,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  const where: any = { status: 'active' };

  const {
    location = '',
    jobType = '',
    workplaceType = '',
    categoryId = '',
  } = metadata;

  if (searchTerm) {
    const searchRegex = { [Op.like]: `%${searchTerm}%` }; // Use Sequelize's Op.iLike for case-insensitive search.
    where[Op.or] = [
      { title: searchRegex },
      { company: searchRegex },
      { workplaceType: searchRegex },
      { jobType: searchRegex },
      { location: searchRegex },
      { categoryId: searchRegex },
    ];
  }

  // Add optional filters
  if (location) where.location = { [Op.like]: `%${location}%` };
  if (jobType) where.jobType = jobType;
  if (workplaceType) where.workplaceType = workplaceType;
  if (categoryId) where.categoryId = categoryId;

  const { count, rows: jobs } = await Job.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']], // Sort by createdAt in descending order.
  });

  return {
    jobs,
    pagination: {
      total: count,
      page,
      pages: Math.ceil(count / limit),
      limit,
    },
  };
};

const formatCourse = async (course: Course, authUserId: string) => {
  const isTutor = course.creatorId === authUserId;

  return {
    id: course.id,
    category: course.categoryId,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    durationHMS: (await course.getDurationHMS()) || null,
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
    totalArticles: (await course.getTotalArticles()) || 0,
    totalVideos: (await course.getTotalVideos()) || 0,
    totalYoutubes: (await course.getTotalYoutubes()) || 0,
    totalAudio: (await course.getTotalAudios()) || 0,
    totalHours: (await course.getTotalHours()) || 0,
    totalModules: (await course.getTotalModules()) || 0,
    totalLessons: (await course.getTotalLessons()) || 0,
    totalQuizzes: (await course.getTotalQuizzes()) || 0,
    totalQuizQuestions: (await course.getTotalQuizQuestions()) || 0,
    totalPublishedLessons: (await course.getTotalPublishedLessons()) || 0,
    totalReviews: (await course.getTotalReviews()) || 0,
    averageReviews: (await course.getAverageReviews()) || 0,
    totalStudents: (await course.getTotalStudents()) || 0,
    totalVideoHours: (await course.getTotalVideoHours()) || 0,
    totalLikes: (await course.getTotalLikes()) || 0,
    created_at: course.createdAt,
    updated_at: course.updatedAt,
  };
};

// Utility functions for related resources
const formatUser = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  // Add other fields as needed
});

const formatModule = (module: Module) => ({
  id: module.id,
  title: module.title,
  // Add other fields as needed
});

const getPaginationFields = (_page: string, _limit: string) => {
  const page = parseInt(_page as string, 10) || 1; // Default to page 1
  const limit = parseInt(_limit as string, 10) || 10; // Default to 10 items per page
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
};

const getTotalPages = (totalItems: number, limit: number) => {
  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / limit);

  return totalPages;
};

const uploadToS3 = async (
  fileBuffer: any,
  originalFileName: string,
  bucketName: string
) => {
  try {
    const fileExtension = path.extname(originalFileName);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;

    const params = {
      Bucket: bucketName,
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: 'application/octet-stream',
      ACL: 'public-read',
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('File upload failed');
  }
};

const formatMoney = (amount: number, currency = 'NGN'): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

enum AccountVettingStatus {
  APPROVED = 'approved',
  DISAPPROVED = 'disapproved',
}

const CurrencySymbol = (currency: string) => {
  switch (currency) {
    case '₦':
      return 'NGN';
    default:
      return 'NGN';
  }
};

const parseFormattedAmount = (amount: string | number): number => {
  let finalVal = null;
  if (typeof amount === 'string') {
    // Remove all characters except digits, comma, and dot
    let cleaned = amount.replace(/[^\d.,-]/g, '');

    // Handle European format (comma as decimal)
    if (cleaned.indexOf(',') > -1 && cleaned.indexOf('.') === -1) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, ''); // Remove thousands separator
    }

    finalVal = parseFloat(cleaned);
  } else {
    finalVal = amount;
  }

  return finalVal;
};

// Export functions
export {
  generateOTP,
  capitalizeFirstLetter,
  sendSMS,
  fetchAdminWithPermissions,
  verifyPayment,
  shuffleArray,
  generateReferralCode,
  getJobsBySearch,
  formatCourse,
  getPaginationFields,
  getTotalPages,
  uploadToS3,
  formatMoney,
  AccountVettingStatus,
  CurrencySymbol,
  parseFormattedAmount,
};
