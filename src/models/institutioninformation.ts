// models/otp.ts
import { Model, DataTypes, Sequelize } from "sequelize";
import User from "./user";

class InstitutionInformation extends Model {
  public userId!: string;
  public institutionName!: string;
  public institutionEmail!: string;
  public institutionIndustry!: string;
  public institutionPhoneNumber!: string;
  public institutionType!: string;
  public institutionLocation!: string;
  public updatedAt?: Date;
  public deletedAt?: Date | null;
  public user?: User;

  // Association with User model
  static associate(models: any) {
    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId', // Ensure the InstitutionInformation model has a 'userId' column
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  InstitutionInformation.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      institutionName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      institutionEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      institutionIndustry: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      institutionPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      institutionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      institutionLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "InstitutionInformation",
      timestamps: true,
      paranoid: false,
      tableName: "institution_informations"
    }
  );
};

export default InstitutionInformation; 
export { initModel };
