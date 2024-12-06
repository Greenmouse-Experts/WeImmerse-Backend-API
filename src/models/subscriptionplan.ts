// models/subscriptionplan.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class SubscriptionPlan extends Model {
  public id!: string;
  public name!: string;
  public duration!: number; // Duration in days
  public price!: number;
  public productLimit!: number;
  public allowsAuction!: boolean;
  public auctionProductLimit!: number | null; // Null if auctions are not allowed
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {

  }
}

const initModel = (sequelize: Sequelize) => {
  SubscriptionPlan.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER, // Duration in days
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0, // Free plan has price 0
      },
      productLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      allowsAuction: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Free plan may not allow auctions
      },
      auctionProductLimit: {
        type: DataTypes.INTEGER,
        allowNull: true, // Null if auctions are not allowed
      },
    },
    {
      sequelize,
      modelName: "SubscriptionPlan",
      timestamps: true,
      paranoid: false,
      tableName: "subscription_plans"
    }
  );
};

export default SubscriptionPlan;
export { initModel };