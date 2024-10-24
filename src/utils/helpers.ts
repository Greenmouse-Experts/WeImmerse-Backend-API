// utils/helpers.ts
import http from 'http';
import querystring from 'querystring';
import Admin from '../models/admin';
import Role from '../models/role';
import Permission from '../models/permission';

// Function to generate a 6-digit OTP
const generateOTP = (): string => {
  const otp: string = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  return otp;
};

// Utility function to capitalize the first letter of a string
function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

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

// Export functions
export { generateOTP, capitalizeFirstLetter, sendSMS, fetchAdminWithPermissions };
