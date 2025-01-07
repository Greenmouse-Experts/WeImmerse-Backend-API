// models/CourseLike.js

import { Model, DataTypes, Sequelize } from 'sequelize';

class CourseLike extends Model {
  public id!: string;
  public courseId!: string;
  public userId!: string;
  public liked!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
    });
    this.belongsTo(models.Course, {
      as: "course",
      foreignKey: "courseId",
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  CourseLike.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses', // Table name for `courses`
        key: 'id',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Table name for `users`
        key: 'id',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    },
    liked: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: "CourseLike",
    timestamps: true,
    paranoid: false,
    tableName: "course_likes"
  });
};

export default CourseLike; 
export { initModel };