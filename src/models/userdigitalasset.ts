import { Model, DataTypes, Sequelize } from 'sequelize';

class UserDigitalAsset extends Model {
  public id!: string;
  public userId!: string;
  public assetId!: string;
  public transactionId!: string;
  public accessGrantedAt!: Date;
  public downloadCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.DigitalAsset, { foreignKey: 'assetId', as: 'asset' });
    this.belongsTo(models.Transaction, {
      foreignKey: 'transactionId',
      as: 'transaction',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  UserDigitalAsset.init(
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
        references: { model: 'digital_assets', key: 'id' },
      },
      transactionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'transactions', key: 'id' },
      },
      accessGrantedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      downloadCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserDigitalAsset',
      tableName: 'user_digital_assets',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default UserDigitalAsset;
export { initModel };
