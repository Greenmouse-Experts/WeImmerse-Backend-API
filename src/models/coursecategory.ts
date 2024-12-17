// models/coursecategory.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class CourseCategory extends Model {
  public id!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    
  }
}

const initModel = (sequelize: Sequelize) => {
  CourseCategory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
    modelName: "CourseCategory",
    timestamps: true,
    paranoid: false,
    tableName: "course_categories"
  });
};

export default CourseCategory; 
export { initModel };
