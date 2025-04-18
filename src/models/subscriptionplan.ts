// models/subscriptionplan.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class SubscriptionPlan extends Model {
  public id!: string;
  public name!: string;
  public duration!: number; // Duration in days
  public price!: number;
  public currency!: string;
  public period!: number;
  public features!: object[]; // or Record<string, any>[]
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    SubscriptionPlan.hasMany(models.Subscription, {
      foreignKey: 'planId',
      as: 'subscriptions',
    });
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
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'NGN',
      },
      period: {
        type: DataTypes.ENUM('Quarterly', 'Monthly', 'Yearly'),
        allowNull: false,
      },
      features: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      sequelize,
      modelName: 'SubscriptionPlan',
      timestamps: true,
      paranoid: false,
      tableName: 'subscription_plans',
    }
  );
};

export default SubscriptionPlan;
export { initModel };
