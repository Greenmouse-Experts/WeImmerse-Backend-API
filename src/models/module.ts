// models/module.ts

import { Model, DataTypes, Sequelize } from 'sequelize';
import ModuleQuiz from './modulequiz';
import Lesson from './lesson';

class Module extends Model {
  public id!: string;
  public courseId!: string;
  public title!: string | null;
  public sortOrder!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.Course, { as: "course", foreignKey: "courseId" });
    this.hasMany(models.Lesson, { as: "lessons", foreignKey: "moduleId" });
    this.hasMany(models.ModuleQuiz, { as: "quizzes", foreignKey: "moduleId" });
  }

  // Check if the module has associated quizzes
  async hasQuiz(): Promise<boolean> {
    const quizCount = await ModuleQuiz.count({ where: { moduleId: this.id } });
    return quizCount > 0;
  }

  // Find all modules by course ID
  static async findByCourse(courseId: string): Promise<Module[]> {
    return await Module.findAll({
      where: { courseId },
      include: [
        { model: Lesson, as: 'lessons' }
      ],
      order: [['sortOrder', 'ASC']],
    });
  }

  // Update sort order for draggable modules
  static async updateDraggable(data: Array<{ module_id: string; sortOrder: number }>): Promise<void> {
    const updates = data.map(item => 
      Module.update({ sortOrder: item.sortOrder }, { where: { id: item.module_id } })
    );
    await Promise.all(updates);
  }
}

const initModel = (sequelize: Sequelize) => {
  Module.init({
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
        model: 'courses', // Ensure this matches your courses table
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: "Module",
    timestamps: true,
    paranoid: false,
    tableName: "modules",
  });
};

export default Module;
export { initModel };
