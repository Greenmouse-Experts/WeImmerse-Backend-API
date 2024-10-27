import { Model, DataTypes, Sequelize } from 'sequelize';

class KYC extends Model {
  public id!: string;
  public vendorId!: string;
  public businessName!: string;
  public contactEmail!: string; // Use string instead of Text
  public contactPhoneNumber!: string;
  public businessDescription!: string;
  public businessLink!: string; // Use string instead of Text
  public businessRegistrationNumber!: string;
  public taxIdentificationNumber!: string;
  public idVerification!: { // Specify the structure for idVerification
    name: string;
    photoFront: string; // URL or path to the front photo
    photoBack: string; // URL or path to the back photo
  };
  public certificateOfIncorporation!: string;
  public isVerified!: boolean; // Change to boolean type
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    // Define associations here
  }
}

const initModel = (sequelize: Sequelize) => {
  KYC.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      businessName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure email is unique
      },
      contactPhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      businessDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      businessLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      businessRegistrationNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      taxIdentificationNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      idVerification: {
        type: DataTypes.JSON, // This will hold the structured data
        allowNull: true,
      },
      certificateOfIncorporation: {
        type: DataTypes.STRING, // This could be a URL to the uploaded document
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Default is not verified
      },
    },
    {
      sequelize,
      modelName: "KYC",
      timestamps: true,
      paranoid: false,
      tableName: "kycs"
    }
  );
};

export default KYC; 
export { initModel };
