// models/ref.ts
import { Model, DataTypes, Sequelize } from "sequelize";
import User from "./user";

class Referral extends Model {
  public referrerId!: string;
  public referredUserId!: string;
  public evToken?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
  public referrer?: User;
  public referredUser?: User;

  // Association with Referral model
  static associate(models: any) {
    this.belongsTo(models.User, {
      as: 'referrer',
      foreignKey: 'referrerId', // Ensure the Referral model has a 'userId' column
    });
    this.belongsTo(models.User, {
      as: 'referredUser',
      foreignKey: 'referredUserId', // Ensure the Referral model has a 'userId' column
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  Referral.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      referrerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      referredUserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      evToken: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Referral",
      timestamps: true,
      paranoid: false,
      tableName: "referrals"
    }
  );
};

export default Referral; 
export { initModel };
