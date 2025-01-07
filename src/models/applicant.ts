// models/Applicant.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class Applicant extends Model {
  public id!: string;
  public userId!: string;
  public jobId!: string;
  public emailAddress!: string | null;
  public phoneNumber!: string | null;
  public resumeType!: string | null;
  public resume!: string | null;
  public view!: boolean;
  public status!: 'applied' | 'rejected' | 'in-progress';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
    // Example:
    this.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    this.belongsTo(models.Job, { as: 'job', foreignKey: 'jobId'  });
  }
}

const initModel = (sequelize: Sequelize) => {
  Applicant.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Ensure the related table is correct
        key: 'id',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    },
    jobId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'jobs', // Ensure this matches the jobs table name
        key: 'id',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE',
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resumeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resume: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    view: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('applied', 'rejected', 'in-progress'),
      defaultValue: 'in-progress',
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: "Applicant",
    timestamps: true,
    paranoid: false,
    tableName: "applicants", // Matches your migration table name
  });
};

export default Applicant;
export { initModel };
