// models/AuctionProduct.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class AuctionProduct extends Model {
  public id!: string;
  public vendorId!: string;
  public storeId!: string;
  public categoryId!: string;
  public name!: string;
  public sku!: string;
  public condition!: 'brand_new' | 'fairly_used' | 'fairly_foreign' | 'refurbished';
  public description!: string;
  public specification!: object;
  public price!: number;
  public bidIncrement?: number; // Percentage
  public maxBidsPerUser?: number;
  public participantsInterestFee!: number;
  public startDate!: Date;
  public endDate!: Date;
  public image?: string;
  public additionalImages?: object;
  public auctionStatus!: 'upcoming' | 'ongoing' | 'cancelled' | 'ended';
  public createdAt?: Date;
  public updatedAt?: Date;

  static associate(models: any) {
    // Define associations here
    this.belongsTo(models.User, {
      as: 'vendor',
      foreignKey: 'vendorId',
      onDelete: 'RESTRICT',
    });
    this.belongsTo(models.Store, {
      as: 'store',
      foreignKey: 'storeId',
      onDelete: 'RESTRICT',
    });
    this.belongsTo(models.SubCategory, {
      as: 'sub_category',
      foreignKey: 'categoryId',
      onDelete: 'RESTRICT',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  AuctionProduct.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      vendorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'sub_categories',
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      condition: {
        type: DataTypes.ENUM('brand_new', 'fairly_used', 'fairly_foreign', 'refurbished'),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      specification: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      bidIncrement: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      maxBidsPerUser: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      participantsInterestFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      additionalImages: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      auctionStatus: {
        type: DataTypes.ENUM('upcoming', 'ongoing', 'cancelled', 'ended'),
        defaultValue: 'upcoming',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AuctionProduct',
      timestamps: true,
      paranoid: false,
      tableName: 'auction_products',
    }
  );
};

export default AuctionProduct;
export { initModel };
