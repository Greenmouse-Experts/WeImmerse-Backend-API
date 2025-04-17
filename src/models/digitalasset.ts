// DigitalAsset.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class DigitalAsset extends Model {
  public id!: string;
  public creatorId!: string;
  public categoryId!: string;
  public assetName!: string;
  public assetDetails!: string;
  public assetUpload!: string;
  public assetThumbnail!: string;
  public specificationSubjectMatter!: string;
  public specificationMedium!: string;
  public specificationSoftwareUsed!: string;
  public specificationTags!: string[]; // Array of tags
  public specificationVersion?: string; // Optional field
  public pricingType!: 'One-Time-Purchase' | 'Free';
  public currency?: string; // Optional, used when One Time Purchase is selected
  public amount?: number; // Optional, used when One Time Purchase is selected
  public status!: 'published' | 'unpublished' | 'under_review';
  public isPublished!: boolean;
  public adminNote?: string;
  public provider?: 'meshy-ai' | 'system';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here if needed
    this.belongsTo(models.Category, {
      as: 'assetCategory',
      foreignKey: 'categoryId',
    });
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'creatorId',
    });
    this.belongsTo(models.Admin, {
      as: 'admin',
      foreignKey: 'creatorId',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  DigitalAsset.init(
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
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'categories', // Ensure the related table is correct
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      assetName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      assetDetails: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      assetUpload: {
        type: DataTypes.STRING, // File path or URL
        allowNull: false,
      },
      assetThumbnail: {
        type: DataTypes.STRING, // Store file path or URL
        allowNull: false,
      },
      specificationSubjectMatter: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specificationMedium: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specificationSoftwareUsed: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specificationTags: {
        type: DataTypes.JSON, // Stored as a JSON array
        allowNull: false,
      },
      specificationVersion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      pricingType: {
        type: DataTypes.ENUM('One-Time-Purchase', 'Free'),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      status: {
        type: DataTypes.ENUM('published', 'unpublished', 'under_review'),
        defaultValue: 'under_review',
      },
      adminNote: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      provider: {
        type: DataTypes.ENUM('meshy-ai', 'system'),
        defaultValue: 'system',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'DigitalAsset',
      timestamps: true,
      paranoid: false,
      tableName: 'digital_assets',
    }
  );
};

export default DigitalAsset;
export { initModel };
