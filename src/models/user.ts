// models/user.ts
import bcrypt from "bcrypt";
import { Model, DataTypes, Sequelize } from "sequelize";
class User extends Model {
  public id!: string; // Use '!' to indicate these fields are definitely assigned
  public name!: string;
  public email!: string;
  public email_verified_at?: Date;
  public password!: string;
  public phoneNumber!: string;
  public dateOfBirth!: string;
  public educationalLevel?: string;
  public gender?: string;
  public schoolId?: string; // This will be serialized as JSON
  public professionalSkill?: string;
  public industry?: string;
  public jobTitle?: string;
  public referralCode?: string;
  public photo?: string;
  public evToken?: number;
  public accountType?: string;
  public status?: "active" | "inactive";
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      email_verified_at: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: true
      },
      educationalLevel: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      schoolId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      professionalSkill: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jobTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      referralCode: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      photo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      evToken: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: true,
      },
      accountType: {
        type: DataTypes.ENUM('student', 'user', 'institution', 'creator'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
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
