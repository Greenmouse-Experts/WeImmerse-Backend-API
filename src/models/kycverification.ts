// models/kycverification.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

export enum KYCVerificationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

class KYCVerification extends Model {
  public id!: string;
  public userId!: string;
  public verificationProvider!: string;
  public verificationReference!: string;
  public status!: 'pending' | 'approved' | 'rejected';
  public adminReviewedBy!: string | null;
  public adminReviewedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.Admin, {
      foreignKey: 'adminReviewedBy',
      as: 'admin',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  KYCVerification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'users', // Ensure this matches the name of the Users table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      verificationProvider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      verificationReference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      adminReviewedBy: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
          model: 'admins', // Ensure this matches the name of the Admins table
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      adminReviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'KYCVerification',
      timestamps: true,
      paranoid: false,
      tableName: 'kyc_verifications',
    }
  );
};

export default KYCVerification;
export { initModel };
