import QuizAttempt from '../models/quizattempt';
import LessonQuiz from '../models/lessonquiz';
import LessonQuizQuestion from '../models/lessonquizquestion';

const validateQuizAnswers = async (
  quizId: string,
  userAnswers: { questionId: string; selectedOption: string }[]
) => {
  const questions = await LessonQuizQuestion.findAll({
    where: { lessonQuizId: quizId },
  });

  let correctAnswers = 0;
  const totalQuestions = questions.length;

  questions.forEach((question) => {
    const userAnswer = userAnswers.find((ua) => ua.questionId === question.id);

    if (userAnswer && userAnswer.selectedOption === question.correctOption) {
      correctAnswers++;
    }
  });

  return {
    correctAnswers,
    totalQuestions,
    score: (correctAnswers / totalQuestions) * 100,
    passed: correctAnswers / totalQuestions >= 0.7, // Assuming 70% is the pass threshold
  };
};

const saveQuizAttempt = async (
  userId: string,
  quizId: string,
  userAnswers: { questionId: string; selectedOption: string }[]
) => {
  const quiz = await LessonQuiz.findByPk(quizId);
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  const { correctAnswers, totalQuestions, score, passed } =
    await validateQuizAnswers(quizId, userAnswers);

  const attempt = await QuizAttempt.create({
    userId,
    quizId,
    score,
    passed,
  });

  return {
    attempt,
    correctAnswers,
    totalQuestions,
    score,
    passed,
  };
};

const getQuizAttempts = async (userId: string, quizId: string) => {
  return await QuizAttempt.findAll({
    where: { userId, quizId },
    order: [['createdAt', 'DESC']],
  });
};

const getLatestQuizAttempt = async (userId: string, quizId: string) => {
  return await QuizAttempt.findOne({
    where: { userId, quizId },
    order: [['createdAt', 'DESC']],
  });
};

const getUserAttempts = async (userId: string) => {
  return await QuizAttempt.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
};

export default {
  saveQuizAttempt,
  getQuizAttempts,
  getLatestQuizAttempt,
  getUserAttempts,
};
