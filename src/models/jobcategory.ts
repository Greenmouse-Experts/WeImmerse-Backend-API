// models/Jobcategory.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class JobCategory extends Model {
  public id!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    
  }
}

const initModel = (sequelize: Sequelize) => {
  JobCategory.init({
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
    modelName: "JobCategory",
    timestamps: true,
    paranoid: false,
    tableName: "job_categories"
  });
};

export default JobCategory; 
export { initModel };
