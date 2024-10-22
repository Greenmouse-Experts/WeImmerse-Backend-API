import bcrypt from "bcrypt";
import { Model, DataTypes, Sequelize } from "sequelize";

class Admin extends Model {
  public id!: string; // Use '!' to indicate these fields are definitely assigned
  public name!: string;
  public email!: string;
  public password!: string;
  public photo?: string;
  public role?: string;
  public permission?: string;
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

}

const initUserModel = (sequelize: Sequelize) => {
  Admin.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUIDs
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true, // Ensure unique emails
      },
      password: DataTypes.STRING,
      photo: DataTypes.TEXT,
      role: DataTypes.STRING,
      permission: DataTypes.STRING,
      status: DataTypes.ENUM("active", "inactive"),
    },
    {
      sequelize,
      modelName: "Admin",
      timestamps: true,
      paranoid: false,
      tableName: "admins",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ["password"] },
        },
        auth: {
          attributes: { include: ["email", "password", "status"] }, // Add necessary fields for authentication
        },
      },
    }
  );

  // Add the password hashing hook before saving
  Admin.addHook("beforeSave", async (admin: Admin) => {
    if (admin.changed("password") || admin.isNewRecord) {
      admin.password = await Admin.hashPassword(admin.password);
    }
  });
  
};

// Export the User model and the init function
export default Admin; // Ensure User is exported as default
export { initUserModel };
