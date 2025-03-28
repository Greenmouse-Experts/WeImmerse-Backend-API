import CourseProgress from '../models/courseprogress';

const saveCourseProgress = async (
  studentId: string,
  courseId: string,
  totalLessons: number,
  completedLessons: number
) => {
  const existingProgress = await CourseProgress.findOne({
    where: { studentId, courseId },
  });

  if (existingProgress) {
    existingProgress.completedLessons = completedLessons;
    existingProgress.progressPercentage =
      (completedLessons / totalLessons) * 100;
    existingProgress.totalLessons = totalLessons;
    existingProgress.lastAccessed = new Date();

    await existingProgress.save();
    return existingProgress;
  }

  return await CourseProgress.create({
    studentId,
    courseId,
    completedLessons: completedLessons,
    totalLessons,
    progressPercentage: 0,
    lastAccessed: new Date(),
  });
};

const getCourseProgress = async (studentId: string, courseId: string) => {
  return await CourseProgress.findOne({ where: { studentId, courseId } });
};

const updateProgress = async (
  studentId: string,
  courseId: string,
  completedLessons: number
) => {
  const progress = await CourseProgress.findOne({
    where: { studentId, courseId },
  });

  if (!progress) {
    throw new Error('Course progress not found');
  }

  progress.completedLessons = completedLessons;
  progress.progressPercentage =
    (completedLessons / progress.totalLessons) * 100;
  progress.lastAccessed = new Date();

  await progress.save();
  return progress;
};

const getAllProgress = async (studentId: string) => {
  return await CourseProgress.findAll({ where: { studentId } });
};

export default {
  saveCourseProgress,
  getCourseProgress,
  updateProgress,
  getAllProgress,
};
