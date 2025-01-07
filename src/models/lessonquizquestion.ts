// models/LessonQuizQuestion.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class LessonQuizQuestion extends Model {
  public id!: string;
  public creatorId!: string;
  public courseId!: string;
  public moduleId!: string;
  public lessonId!: string;
  public lessonQuizId!: string;
  public question!: string;
  public options!: Record<string, string>;
  public correctOption!: string;
  public score!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    this.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    this.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    this.belongsTo(models.Module, { foreignKey: 'moduleId', as: 'module' });
    this.belongsTo(models.LessonQuiz, { foreignKey: 'lessonQuizId', as: 'quiz' });
  }
}

const initModel = (sequelize: Sequelize) => {
  LessonQuizQuestion.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses', // Ensure this matches the courses table name
        key: 'id',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    },
    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'modules', // Ensure this matches the modules table name
        key: 'id',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "lessons", // Ensure this matches the lessons table name
        key: "id",
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    },
    lessonQuizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'lesson_quizzes', // Ensure this matches the module_quizzes table name
        key: 'id',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    correctOption: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: "LessonQuizQuestion",
    timestamps: true,
    paranoid: false,
    tableName: "lesson_quiz_questions",
  });
};

export default LessonQuizQuestion;
export { initModel };
