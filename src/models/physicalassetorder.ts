import { Model, DataTypes, Sequelize } from 'sequelize';

export enum OrderStatus {
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

class PhysicalAssetOrder extends Model {
  public id!: string;
  public userId!: string;
  public assetId!: string;
  public transactionId!: string;
  public amount!: number;
  public currency!: string;
  public status!: OrderStatus;
  public shippingAddress!: any;
  public trackingNumber!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.PhysicalAsset, {
      foreignKey: 'assetId',
      as: 'asset',
    });
    this.belongsTo(models.Transaction, {
      foreignKey: 'transactionId',
      as: 'transaction',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  PhysicalAssetOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      assetId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'physical_assets', key: 'id' },
      },
      transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'transactions', key: 'id' },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: 'NGN',
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(OrderStatus)),
        defaultValue: OrderStatus.PROCESSING,
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PhysicalAssetOrder',
      tableName: 'physical_asset_orders',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default PhysicalAssetOrder;
export { initModel };
