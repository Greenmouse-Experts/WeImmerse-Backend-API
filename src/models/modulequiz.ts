// models/moduleQuiz.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class ModuleQuiz extends Model {
  public id!: string;
  public creatorId!: string;
  public courseId!: string;
  public moduleId!: string;
  public title!: string | null;
  public description!: string | null;
  public timePerQuestion!: number | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    // Example:
    // ModuleQuiz.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
    // ModuleQuiz.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    // ModuleQuiz.belongsTo(models.Module, { foreignKey: 'moduleId', as: 'module' });
  }
}

const initModel = (sequelize: Sequelize) => {
  ModuleQuiz.init({
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
  }, {
    sequelize,
    modelName: "ModuleQuiz",
    timestamps: true,
    paranoid: false,
    tableName: "module_quizzes",
  });
};

export default ModuleQuiz;
export { initModel };
