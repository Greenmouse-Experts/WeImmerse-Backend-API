// models/lessonCompletion.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class LessonCompletion extends Model {
  public id!: string;
  public userId!: string;
  public lessonId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    // Example:
    // LessonCompletion.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    // LessonCompletion.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
  }
}

const initModel = (sequelize: Sequelize) => {
  LessonCompletion.init({
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
        model: 'users', // Ensure this matches the users table name
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'lessons', // Ensure this matches the courses table name
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
  }, {
    sequelize,
    modelName: 'LessonCompletion',
    timestamps: true,
    tableName: 'lesson_completions',
  });
};

export default LessonCompletion;
export { initModel };
