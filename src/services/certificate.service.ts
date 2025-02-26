import { createCanvas, loadImage } from 'canvas';
import { uploadToS3 } from '../utils/helpers'; // Utility function to upload files to S3
import CourseProgress from '../models/courseprogress';
import QuizAttempt from '../models/quizattempt';
import Certificate from '../models/certificate';
import LessonQuiz from '../models/lessonquiz';

const generateCertificatePdf = async (userId: string, courseId: string) => {
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Load certificate template
  const background = await loadImage('./assets/certificate_template.png');
  ctx.drawImage(background, 0, 0, 800, 600);

  // Add text
  ctx.font = '30px Arial';
  ctx.fillText(`Certificate of Completion`, 250, 200);
  ctx.font = '20px Arial';
  ctx.fillText(
    `Awarded to User ${userId} for completing Course ${courseId}`,
    150,
    300
  );

  // Convert canvas to buffer
  const buffer = canvas.toBuffer('image/png');

  // Upload to S3 and return URL
  return await uploadToS3(
    buffer,
    `certificates/${userId}_${courseId}.png`,
    'test-weimmersive-bucket'
  );
};

const generateCertificate = async (userId: string, courseId: string) => {
  // Check if course is 100% complete
  const progress = await CourseProgress.findOne({
    where: { studentId: userId, courseId },
  });

  if (!progress || progress.progressPercentage < 100) {
    throw new Error('Course is not fully completed.');
  }

  console.log(progress, courseId);

  // Check if quiz is passed
  const quizAttempt = await QuizAttempt.findOne({
    where: { userId, passed: true },
    include: [{ model: LessonQuiz, as: 'quiz', where: { courseId } }],
    order: [['createdAt', 'DESC']],
  });

  console.log(quizAttempt);

  if (!quizAttempt) {
    throw new Error('User has not passed the required quiz.');
  }

  // Generate certificate
  const certificateUrl = await generateCertificatePdf(userId, courseId);

  // Store certificate in the database
  const certificate = await Certificate.create({
    userId,
    courseId,
    certificateUrl,
    issueDate: new Date(),
  });

  return certificate;
};

const getCertificate = async (userId: string, courseId: string) => {
  return await Certificate.findOne({ where: { userId, courseId } });
};

export default {
  generateCertificate,
  getCertificate,
};
