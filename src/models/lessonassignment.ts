import { Model, DataTypes, Sequelize } from 'sequelize';

class LessonAssignment extends Model {
  public id!: string;
  public creatorId!: string;
  public courseId!: string;
  public moduleId!: string;
  public lessonId!: string;
  public title!: string;
  public description!: string | null;
  public dueDate!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    LessonAssignment.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' });
    LessonAssignment.belongsTo(models.Lesson, { foreignKey: 'lessonId', as: 'lesson' });
    LessonAssignment.belongsTo(models.User, { foreignKey: 'creatorId', as: 'creator' });
  }
}

const initModel = (sequelize: Sequelize) => {
  LessonAssignment.init(
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
          model: 'lessons', // Ensure this matches the lessons table name
          key: 'id',
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'LessonAssignment',
      tableName: 'lesson_assignments',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default LessonAssignment;
export { initModel };
