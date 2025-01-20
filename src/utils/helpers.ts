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
};

const sendSMS = async (mobile: string, messageContent: string): Promise<void> => {
  const apiUrl = 'portal.nigeriabulksms.com';
  const data = querystring.stringify({
    username: process.env.SMS_USERNAME, // Your SMS API username
    password: process.env.SMS_PASSWORD, // Your SMS API password
    sender: process.env.APP_NAME,     // Sender ID
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

const verifyPayment = (refId: string, paystackSecretKey: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.paystack.co",
      path: `/transaction/verify/${refId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`, // Use dynamic key
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response: PaystackResponse = JSON.parse(data);

          if (response.status) {
            resolve(response.data);
          } else {
            reject(new Error(`Paystack Error: ${response.message}`));
          }
        } catch (err) {
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

// Utility function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getJobsBySearch = async (searchTerm: string, number: number) => {
  const where: any = { status: 'active' };

  if (searchTerm) {
      const searchRegex = { [Op.iLike]: `%${searchTerm}%` }; // Use Sequelize's Op.iLike for case-insensitive search.
      where[Op.or] = [
          { title: searchRegex },
          { company: searchRegex },
          { workplace_type: searchRegex },
          { job_type: searchRegex },
          { location: searchRegex },
          { category: searchRegex },
      ];
  }

  return await Job.findAll({
      where,
      order: [['createdAt', 'DESC']], // Sort by createdAt in descending order.
      limit: number, // Limit the number of results.
  });
};

const formatCourse = async (course: Course , authUserId: string) => {
  const isTutor = course.creatorId === authUserId;

  return {
    id: course.id,
    category: course.categoryId,
    title: course.title,
    subtitle: course.subtitle,
    description: course.description,
    durationHMS: await course.getDurationHMS() || null,
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
    totalArticles: await course.getTotalArticles() || 0,
    totalVideos: await course.getTotalVideos() || 0,
    totalYoutubes: await course.getTotalYoutubes() || 0,
    totalAudio: await course.getTotalAudios() || 0,
    totalHours: await course.getTotalHours() || 0,
    totalModules: await course.getTotalModules() ||  0,
    totalLessons: await course.getTotalLessons() || 0,
    totalQuizzes: await course.getTotalQuizzes() || 0,
    totalQuizQuestions: await course.getTotalQuizQuestions() || 0,
    totalPublishedLessons: await course.getTotalPublishedLessons() || 0,
    totalReviews: await course.getTotalReviews() || 0,
    averageReviews: await course.getAverageReviews() || 0,
    totalStudents: await course.getTotalStudents() || 0,
    totalVideoHours: await course.getTotalVideoHours() || 0,
    totalLikes: await course.getTotalLikes() || 0,
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
  title: module.title
  // Add other fields as needed
});

// Export functions
export { generateOTP, capitalizeFirstLetter, sendSMS, fetchAdminWithPermissions, verifyPayment, shuffleArray, generateReferralCode, getJobsBySearch, formatCourse };
