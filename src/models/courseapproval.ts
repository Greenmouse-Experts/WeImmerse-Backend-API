// models/courseapproval.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class CourseApproval extends Model {
  public id!: string;
  public approvableId!: number;
  public approvableType!: string;
  public decision!: "approved" | "disapproved" | null;
  public comment!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    
  }
}

const initModel = (sequelize: Sequelize) => {
  CourseApproval.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    approvableId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approvableType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    decision: {
      type: DataTypes.ENUM('approved', 'disapproved'),
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: "CourseApproval",
    timestamps: true,
    paranoid: false,
    tableName: "course_approvals"
  });
};

export default CourseApproval; 
export { initModel };
