import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user';
import LessonQuiz from './lessonquiz';

class QuizAttempt extends Model {
  public id!: string;
  public userId!: string;
  public quizId!: string;
  public score!: number;
  public passed!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    this.belongsTo(models.LessonQuiz, { as: 'quiz', foreignKey: 'quizId' });
  }
}

const initModel = (sequelize: Sequelize) => {
  QuizAttempt.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users', // Ensure this matches the users table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quizId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'lesson_quizzes', // Ensure this matches the quizzes table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      score: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      passed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'QuizAttempt',
      timestamps: true,
      tableName: 'quiz_attempts',
    }
  );
};

export default QuizAttempt;
export { initModel };
