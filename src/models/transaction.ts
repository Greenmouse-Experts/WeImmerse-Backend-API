// models/transaction.ts
import { Model, DataTypes, Sequelize } from 'sequelize';

export enum PaymentType {
  SUBSCRIPTION = 'subscription',
  DIGITAL_ASSET = 'digital_asset',
  PHYSICAL_ASSET = 'physical_asset',
  COURSE = 'course',
}

export enum ProductType {
  SUBSCRIPTION = 'subscription',
  DIGITAL_ASSET = 'digital_asset',
  PHYSICAL_ASSET = 'physical_asset',
  COURSE = 'course',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
  PAYSTACK = 'paystack',
}

class Transaction extends Model {
  public id!: string;
  public subscriptionId!: string | null;
  public productId!: string | null;
  public userId!: string;
  public amount!: number;
  public currency!: string;
  public status!: PaymentStatus;
  public paymentType!: ProductType;
  public paymentMethod!: PaymentMethod;
  public paymentGateway!: string;
  public gatewayReference!: string | null;
  public metadata!: any;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    Transaction.belongsTo(models.Subscription, {
      foreignKey: 'subscriptionId',
      as: 'subscription',
    });
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      subscriptionId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'subscriptions',
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      paymentType: {
        type: DataTypes.ENUM(...Object.keys(ProductType)),
        allowNull: false,
        defaultValue: ProductType.SUBSCRIPTION,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'NGN',
      },
      status: {
        type: DataTypes.ENUM(...Object.keys(PaymentStatus)),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentMethod: {
        type: DataTypes.ENUM(...Object.keys(PaymentMethod)),
        allowNull: false,
        defaultValue: PaymentMethod.PAYSTACK,
      },
      paymentGateway: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gatewayReference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default Transaction;
export { initModel };
