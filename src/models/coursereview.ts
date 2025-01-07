// models/courseReview.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class CourseReview extends Model {
  public id!: string;
  public userId!: string;
  public courseId!: string;
  public rating!: number;
  public title?: string;
  public body?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    // Example:
    // CourseReview.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    // CourseReview.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
  }
}

const initModel = (sequelize: Sequelize) => {
  CourseReview.init({
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
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
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
    rating: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'CourseReview',
    timestamps: true,
    tableName: 'course_reviews',
  });
};

export default CourseReview;
export { initModel };
