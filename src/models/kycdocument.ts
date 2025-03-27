// models/kycdocuments.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

export enum KYCDocumentType {
  PASSPORT = 'passport',
  NATIONAL_ID = 'national_id',
  DRIVER_LICENSE = 'driver_license',
  CAC_DOCUMENT = 'CAC_document',
}

export enum KYCDocumentVettingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

class KYCDocuments extends Model {
  public id!: string;
  public userId!: string;
  public documentType!:
    | 'passport'
    | 'national_id'
    | 'driver_license'
    | 'CAC_document';
  public documentUrl!: string;
  public uploadedAt!: Date;
  public vettingStatus!: 'pending' | 'approved' | 'rejected';
  public reason?: string;
  public vettedBy!: string | null; // Admin who vetted the document
  public vettedAt!: Date | null; // Date when vetting was done
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.Admin, { foreignKey: 'vettedBy', as: 'admin' }); // Reference Admin who reviewed
  }
}

const initModel = (sequelize: Sequelize) => {
  KYCDocuments.init(
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
      documentType: {
        type: DataTypes.ENUM(
          'passport',
          'national_id',
          'driver_license',
          'CAC_document'
        ),
        allowNull: false,
      },
      documentUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      documentUrlBack: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      vettingStatus: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vettedBy: {
        type: DataTypes.UUID, // Ensure it matches the `id` type in Admins table
        allowNull: true,
        references: {
          model: 'admins',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'KYCDocuments',
      timestamps: true,
      paranoid: false,
      tableName: 'kyc_documents',
    }
  );
};

export default KYCDocuments;
export { initModel };
