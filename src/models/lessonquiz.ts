// models/LessonQuiz.ts

import { Model, DataTypes, Sequelize } from "sequelize";

class LessonQuiz extends Model {
  public id!: string;
  public creatorId!: string;
  public courseId!: string;
  public moduleId!: string;
  public lessonId!: string;
  public title!: string | null;
  public description!: string | null;
  public timePerQuestion!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    // Example:
    this.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    this.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    this.belongsTo(models.Module, { foreignKey: 'moduleId', as: 'module' });
  }
}

const initModel = (sequelize: Sequelize) => {
  LessonQuiz.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      courseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "courses", // Ensure this matches the courses table name
          key: "id",
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
      },
      moduleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "modules", // Ensure this matches the modules table name
          key: "id",
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
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      timePerQuestion: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "LessonQuiz",
      timestamps: true,
      paranoid: false,
      tableName: "lesson_quizzes",
    }
  );
};

export default LessonQuiz;
export { initModel };
