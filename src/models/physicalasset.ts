// PhysicalAsset.ts

import { Model, DataTypes, Sequelize } from 'sequelize';

class PhysicalAsset extends Model {
  public id!: string;
  public creatorId!: string;
  public categoryId!: string;
  public assetName!: string;
  public assetDetails!: string;
  public assetUpload!: string;
  public assetThumbnail!: string;
  public specification!: string;
  public specificationTags!: string[]; // Array of tags
  public currency!: string;
  public amount!: number;
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
    this.belongsTo(models.User, {
      as: "user",
      foreignKey: "creatorId",
    });
    this.belongsTo(models.Admin, {
      as: "admin",
      foreignKey: "creatorId",
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  PhysicalAsset.init(
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
          model: 'asset_categories', // Ensure the related table is correct
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
      specification: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      specificationTags: {
        type: DataTypes.JSON, // Stored as a JSON array
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
      modelName: 'PhysicalAsset',
      timestamps: true,
      paranoid: false,
      tableName: 'physical_assets',
    }
  );
};

export default PhysicalAsset;
export { initModel };
