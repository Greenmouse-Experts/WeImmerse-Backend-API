// models/Assetcategory.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class AssetCategory extends Model {
  public id!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    
  }
}

const initModel = (sequelize: Sequelize) => {
  AssetCategory.init({
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
    modelName: "AssetCategory",
    timestamps: true,
    paranoid: false,
    tableName: "asset_categories"
  });
};

export default AssetCategory; 
export { initModel };
