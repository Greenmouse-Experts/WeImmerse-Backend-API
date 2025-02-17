import { Sequelize } from 'sequelize';
import LessonCompletion from '../models/lessoncompletion';

const markUnmarkLessonCompleted = async (userId: string, lessonId: string) => {
  // Check if the lesson is already marked as completed
  const existingRecord = await LessonCompletion.findOne({
    where: { userId, lessonId },
  });

  if (existingRecord) {
    // delete a lesson completion record
    await LessonCompletion.destroy({
      where: {
        id: existingRecord.id,
      },
    });
    return;
  }

  // Create a new record
  await LessonCompletion.create({
    userId,
    lessonId,
  });
};

export default { markUnmarkLessonCompleted };
