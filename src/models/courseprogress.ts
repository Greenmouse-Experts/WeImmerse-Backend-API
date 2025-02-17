import { Model, DataTypes, Sequelize } from 'sequelize';

class CourseProgress extends Model {
  public studentId!: string;
  public courseId!: string;
  public completedLessons!: number;
  public totalLessons!: number;
  public progressPercentage!: number;
  public lastAccessed!: Date;

  static associate(models: any) {
    CourseProgress.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'student',
    });
    CourseProgress.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  CourseProgress.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      studentId: {
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
      completedLessons: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalLessons: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      progressPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      lastAccessed: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'CourseProgress',
      timestamps: true,
      tableName: 'course_progress',
    }
  );
};

export default CourseProgress;
export { initModel };
