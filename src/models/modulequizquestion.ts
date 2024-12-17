// models/moduleQuizQuestion.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class ModuleQuizQuestion extends Model {
  public id!: string;
  public creatorId!: string;
  public courseId!: string;
  public moduleId!: string;
  public moduleQuizId!: string;
  public question!: string;
  public options!: Record<string, string>;
  public correctOption!: string;
  public score!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    // Example:
    // ModuleQuizQuestion.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    // ModuleQuizQuestion.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    // ModuleQuizQuestion.belongsTo(models.Module, { foreignKey: 'moduleId', as: 'module' });
    // ModuleQuizQuestion.belongsTo(models.ModuleQuiz, { foreignKey: 'moduleQuizId', as: 'quiz' });
  }
}

const initModel = (sequelize: Sequelize) => {
  ModuleQuizQuestion.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Ensure this matches the users table name
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses', // Ensure this matches the courses table name
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    moduleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'modules', // Ensure this matches the modules table name
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    moduleQuizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'module_quizzes', // Ensure this matches the module_quizzes table name
        key: 'id',
      },
      onDelete: 'RESTRICT',
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
    modelName: "ModuleQuizQuestion",
    timestamps: true,
    paranoid: false,
    tableName: "module_quiz_questions",
  });
};

export default ModuleQuizQuestion;
export { initModel };
