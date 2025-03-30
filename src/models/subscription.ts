// models/subscription.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

class Subscription extends Model {
  public id!: string;
  public userId!: string;
  public planId!: string;
  public startDate!: Date;
  public endDate!: Date;
  public status!: 'active' | 'cancelled' | 'expired' | 'pending';
  public isAutoRenew!: boolean;
  public paymentMethod!: string;
  public transactionId!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    Subscription.belongsTo(models.SubscriptionPlan, {
      foreignKey: 'planId',
      as: 'plan',
    });
    Subscription.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  Subscription.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      planId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'subscription_plans',
          key: 'id',
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'canceled', 'expired', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
      isAutoRenew: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Subscription',
      tableName: 'subscriptions',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default Subscription;
export { initModel };
