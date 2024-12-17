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
  public pricingType!: "One-Time-Purchase" | "Free";
  public currency?: string; // Optional, used when One Time Purchase is selected
  public amount?: number; // Optional, used when One Time Purchase is selected
  public status!: "published" | "unpublished" | "under_review";
  public adminNote?: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here if needed
    this.belongsTo(models.AssetCategory, {
      as: "assetCategory",
      foreignKey: "categoryId",
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
        references: {
          model: "users", // Ensure this matches the name of the Users table
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'asset_categories', // Ensure the related table is correct
          key: 'id',
        },
        onDelete: 'RESTRICT',
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
        type: DataTypes.ENUM("One-Time-Purchase", "Free"),
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
      status: {
        type: DataTypes.ENUM('published', 'unpublished', 'under_review'),
        defaultValue: 'under_review',
      },
      adminNote: {
        type: DataTypes.TEXT,
        allowNull: true
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