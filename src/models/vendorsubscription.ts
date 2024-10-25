// models/VendorSubscription.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class VendorSubscription extends Model {
  public id!: string;
  public vendorId!: string;
  public subscriptionPlanId!: string;
  public startDate!: Date;
  public endDate!: Date;
  public isActive!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    // Associate with User model
    this.belongsTo(models.User, { 
      as: 'vendor',
      foreignKey: 'vendorId' 
    });
    // Associate with SubscriptionPlan model
    this.belongsTo(models.SubscriptionPlan, { 
      as: 'subscriptionPlans',
      foreignKey: 'subscriptionPlanId' 
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  VendorSubscription.init(
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
      },
      subscriptionPlanId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "VendorSubscription",
      timestamps: true,
      paranoid: false,
      tableName: "vendor_subscriptions"
    }
  );
};

export default VendorSubscription;
export { initModel };