import { Model, DataTypes, Sequelize } from 'sequelize';

class WithdrawalAccount extends Model {
  public id!: string;
  public userId!: string;
  public accountNumber!: string;
  public accountType!: string;
  public bankName!: string;
  public accountName!: string;
  public bankCode!: string;
  public routingNumber!: string | null;
  public country!: string;
  public countryCode!: string;
  public currency!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public deletedAt!: Date | null;

  static associate(models: any) {
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  WithdrawalAccount.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING(36),
        allowNull: false,
        unique: true,
      },
      accountNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      accountType: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      bankName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      routingNumber: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(255),
        defaultValue: 'Nigeria',
      },
      countryCode: {
        type: DataTypes.CHAR(2),
        defaultValue: 'NG',
      },
      currency: {
        type: DataTypes.STRING(255),
        defaultValue: 'NGN',
      },
      accountName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bankCode: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'WithdrawalAccount',
      timestamps: true,
      paranoid: false,
      tableName: 'withdrawal_accounts',
    }
  );
};

export default WithdrawalAccount;
export { initModel };
