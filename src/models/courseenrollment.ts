// models/courseEnrollment.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class CourseEnrollment extends Model {
  public id!: string;
  public userId!: string;
  public courseId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    // Example:
    // CourseEnrollment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    // CourseEnrollment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
  }
}

const initModel = (sequelize: Sequelize) => {
  CourseEnrollment.init({
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
  }, {
    sequelize,
    modelName: 'CourseEnrollment',
    timestamps: true,
    tableName: 'course_enrollments',
  });
};

export default CourseEnrollment;
export { initModel };
