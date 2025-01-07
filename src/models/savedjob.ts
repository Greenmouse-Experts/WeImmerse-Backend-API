// models/SavedJob.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class SavedJob extends Model {
  public id!: string;
  public userId!: string;
  public jobId!: string;
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
  SavedJob.init({
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
  }, {
    sequelize,
    modelName: 'SavedJob',
    timestamps: true,
    tableName: 'saved_jobs',
  });
};

export default SavedJob;
export { initModel };
