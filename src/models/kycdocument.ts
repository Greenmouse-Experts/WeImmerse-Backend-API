// models/kycdocuments.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

export enum KYCDocumentType {
  PASSPORT = 'passport',
  NATIONAL_ID = 'national_id',
  DRIVER_LICENSE = 'driver_license',
  CAC_DOCUMENT = 'CAC_document',
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
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
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
      uploadedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
