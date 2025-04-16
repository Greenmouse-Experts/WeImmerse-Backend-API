import { Model, DataTypes, Sequelize } from 'sequelize';

class Notification extends Model {
  public id!: string;
  public message!: string;
  public link!: string;
  public date!: Date;
  public read!: boolean;
  public userId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  Notification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notifications',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default Notification;
export { initModel };
