// models/user.ts
import bcrypt from "bcrypt";
import { Model, DataTypes, Sequelize } from "sequelize";
import KYC from "./kyc";

interface Location {
  country?: string;
  state?: string;
  city?: string;
  // Add other fields as needed
}

class User extends Model {
  public id!: string; // Use '!' to indicate these fields are definitely assigned
  public firstName!: string;
  public lastName!: string;
  public gender?: string;
  public email!: string;
  public email_verified_at?: Date;
  public password!: string;
  public phoneNumber!: string;
  public dateOfBirth?: string;
  public location?: Location; // This will be serialized as JSON
  public photo?: string;
  public wallet?: string;
  public accountType?: string;
  public status?: "active" | "inactive";
  public isVerified?: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  // Method to hash the password before saving
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  // Method to check the password
  checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  static associate(models: any ) { // Define expected model types
    this.hasOne(models.OTP, {
      as: 'otp',
      foreignKey: 'userId', // Ensure the OTP model has a 'userId' column
      onDelete: 'RESTRICT'
    });
    this.hasMany(models.VendorSubscription, { 
      as: 'subscriptions', 
      foreignKey: 'vendorId',
      onDelete: 'RESTRICT', 
    });
    this.hasMany(models.Store, { 
      as: 'stores', 
      foreignKey: 'vendorId',
      onDelete: 'RESTRICT', 
    });
  }

  // Add method to fetch KYC record
  public async getKyc(): Promise<KYC | null> {
    return await KYC.findOne({ where: { vendorId: this.id } }); // Assuming KYC has a userId field linking to User
  }
}

const initModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      gender: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true, // Ensure unique emails
        allowNull: false, // You might want to enforce this
      },
      email_verified_at: DataTypes.DATE,
      password: {
        type: DataTypes.STRING,
        allowNull: false, // Enforce password requirement
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false, // Enforce phone number requirement
      },
      dateOfBirth: DataTypes.STRING,
      location: DataTypes.JSON,
      photo: DataTypes.TEXT,
      wallet: DataTypes.DECIMAL(20, 2),
      facebookId: DataTypes.STRING,
      googleId: DataTypes.STRING,
      accountType: DataTypes.ENUM('Vendor', 'Customer'),
      status: DataTypes.ENUM("active", "inactive"),
    },
    {
      sequelize,
      modelName: "User",
      timestamps: true,
      paranoid: false,
      tableName: "users",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        auth: {
          attributes: { include: ["password"] }, // Add necessary fields for authentication
        },
      },
    }
  );

  // Add the password hashing hook before saving
  User.addHook("beforeSave", async (user: User) => {
    if (user.changed("password") || user.isNewRecord) {
      user.password = await User.hashPassword(user.password);
    }
  });
};

// Export the User model and the init function
export default User; // Ensure User is exported as default
export { initModel };
