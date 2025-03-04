import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user';
import Admin from './admin';

export enum PaymentProvider {
  PAYSTACK = 'paystack',
  STRIPE = 'stripe',
  MANUAL_TRANSFER = 'manual_transfer',
}

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
}

class WithdrawalRequest extends Model {
  public id!: string;
  public userId!: string;
  public amount!: number;
  public currency!: string;
  public paymentProvider!: PaymentProvider;
  public recipientCode!: string;
  public status!: WithdrawalStatus;
  public adminReviewedBy?: string;
  public adminReviewedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initModel = (sequelize: Sequelize) => {
  WithdrawalRequest.init(
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
      recipientCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'approved',
          'rejected',
          'processing',
          'completed'
        ),
        defaultValue: 'pending',
      },
      adminReviewedBy: {
        type: DataTypes.UUID,
        references: {
          model: Admin,
          key: 'id',
        },
        allowNull: true,
      },
      adminReviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'WithdrawalRequest',
      tableName: 'withdrawal_requests',
      timestamps: true,
    }
  );
};

export default WithdrawalRequest;
export { initModel };
