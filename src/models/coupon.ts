import { Model, DataTypes, Sequelize } from 'sequelize';

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

class Coupon extends Model {
  public id!: string;
  public creatorId!: string;
  public code!: string;
  public discountType!: DiscountType;
  public discountValue!: number;
  public maxUses?: number;
  public currentUses!: number;
  public validFrom!: Date;
  public validUntil!: Date;
  public minPurchaseAmount?: number;
  public isActive!: boolean;
  public applicableCourses?: string[]; // Array of course IDs
  public applicableAccountTypes?: string[]; // Array of account types
  public createdAt?: Date;
  public updatedAt?: Date;

  static associate(models: any) {
    this.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'creatorId',
      onDelete: 'CASCADE',
    });
    this.hasMany(models.CouponUsage, {
      as: 'usages',
      foreignKey: 'couponId',
      onDelete: 'CASCADE',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  Coupon.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      creatorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      discountType: {
        type: DataTypes.ENUM(...Object.values(DiscountType)),
        allowNull: false,
      },
      discountValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      maxUses: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      currentUses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      validFrom: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      minPurchaseAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      applicableCourses: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      applicableAccountTypes: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Coupon',
      tableName: 'coupons',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default Coupon;
export { initModel };
