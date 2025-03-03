import { Model, DataTypes, Sequelize } from 'sequelize';
import { PaymentProvider } from './withdrawalrequest';
import User from './user';

class PayoutHistory extends Model {
  public id!: string;
  public userId!: string;
  public amount!: number;
  public currency!: string;
  public paymentProvider!: PaymentProvider;
  public payoutReference!: string;
  public status!: 'successful' | 'failed' | 'pending';
  public transactionDate!: Date;
  public readonly createdAt!: Date;
}

const initModel = (sequelize: Sequelize) => {
  PayoutHistory.init(
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
          model: User,
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentProvider: {
        type: DataTypes.ENUM('paystack', 'stripe', 'manual_transfer'),
        allowNull: false,
      },
      payoutReference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('successful', 'failed', 'pending'),
        defaultValue: 'pending',
      },
      transactionDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PayoutHistory',
      tableName: 'payout_history',
      timestamps: true,
    }
  );
};

export default PayoutHistory;
export { initModel };
