import { Model, DataTypes, Sequelize } from 'sequelize';

class CouponUsage extends Model {
  public id!: string;
  public couponId!: string;
  public userId!: string;
  public orderId?: string;
  public discountApplied!: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  static associate(models: any) {
    this.belongsTo(models.Coupon, {
      as: 'coupon',
      foreignKey: 'couponId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  CouponUsage.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      couponId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'coupons',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      discountApplied: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CouponUsage',
      tableName: 'coupon_usages',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default CouponUsage;
export { initModel };
