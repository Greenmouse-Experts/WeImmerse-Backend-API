// models/user.ts
import bcrypt from 'bcrypt';
import { Model, DataTypes, Op, Sequelize } from 'sequelize';
import Lesson from './lesson';

export enum UserType {
  STUDENT = 'student',
  USER = 'user',
  INSTITUTION = 'institution',
  CREATOR = 'creator',
}

export enum UserAccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum Country {
  NG = 'NG',
  GB = 'GB',
  US = 'US',
  CA = 'CA',
  GH = 'GH',
  ES = 'ES',
}

export const countryDetails = {
  NG: {
    title: 'Nigeria',
    latitude: 9.082,
    longitude: 8.6753,
  },
  GB: {
    title: 'United Kingdom',
    latitude: 55.3781,
    longitude: -3.436,
  },
  CA: {
    title: 'Canada',
    latitude: 56.1304,
    longitude: -106.3468,
  },
  GH: {
    title: 'Ghana',
    latitude: 7.9465,
    longitude: -1.0232,
  },
  ES: {
    title: 'Spain',
    latitude: 40.4637,
    longitude: -3.7492,
  },
  US: {
    title: 'United States',
    latitude: 19.50139,
    longitude: 64.85694,
  },
};

class User extends Model {
  public id!: string; // Use '!' to indicate these fields are definitely assigned
  public name!: string;
  public email!: string;
  public email_verified_at?: Date;
  public password!: string;
  public phoneNumber!: string;
  public dateOfBirth!: string;
  public educationalLevel?: string;
  public gender?: Gender;
  public schoolId?: string; // This will be serialized as JSON
  public professionalSkill?: string;
  public industry?: string;
  public jobTitle?: string;
  public referralCode?: string;
  public photo?: string;
  public evToken?: number;
  public accountType?: UserType;
  public status?: UserAccountStatus;
  public verified?: boolean;
  public reason?: string;
  public lastLogin?: Date;
  public country?: Country;
  public institutionId?: string;
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

  static associate(models: any) {
    // Define expected model types
    this.hasOne(models.OTP, {
      as: 'otp',
      foreignKey: 'userId', // Ensure the OTP model has a 'userId' column
      onDelete: 'RESTRICT',
    });
    this.hasMany(models.CourseProgress, {
      as: 'progress',
      foreignKey: 'studentId',
    });
    this.hasMany(models.KYCDocuments, {
      as: 'kyc_docs',
      foreignKey: 'userId',
    });
    this.hasMany(models.KYCVerification, {
      as: 'kyc_verification',
      foreignKey: 'userId',
    });
    this.hasOne(models.Wallet, {
      as: 'wallet',
      foreignKey: 'userId',
    });
    this.hasOne(models.WithdrawalAccount, {
      as: 'withdrawalAccount',
      foreignKey: 'userId',
    });
    this.hasMany(models.WithdrawalRequest, {
      as: 'withdrawalRequests',
      foreignKey: 'userId',
    });
    this.hasOne(models.WithdrawalHistory, {
      as: 'withdrawalHistory',
      foreignKey: 'userId',
    });
    this.hasMany(models.Coupon, {
      as: 'coupons',
      foreignKey: 'couponId',
    });
    this.belongsTo(models.InstitutionInformation, {
      as: 'institution',
      foreignKey: 'institutionId',
    });
  }

  // async percentCompleted(courseId: string): Promise<number> {
  //   try {
  //       // Get all lessons for the course that have content
  //       const lessonsWithContent = await Lesson.findAll({
  //           where: {
  //               courseId,
  //               contentType: { [Op.in]: ['article', 'video', 'youtube'] }, // Equivalent of hasContent
  //           },
  //           attributes: ['id'], // Only fetch the lesson IDs
  //       });

  //       const lessonIds = lessonsWithContent.map(lesson => lesson.id);

  //       // Count total lessons with content
  //       const totalLessons = lessonIds.length;

  //       if (totalLessons === 0) {
  //           return 0; // No lessons to complete
  //       }

  //       // Get the count of lessons completed by the user for this course
  //       const userCompletedCount = await Completion.count({
  //           where: {
  //               lessonId: { [Op.in]: lessonIds },
  //               userId: this.id, // Assuming `this.id` refers to the current user
  //           },
  //       });

  //       // Calculate the percentage completed
  //       const percentCompleted = (userCompletedCount / totalLessons) * 100;

  //       return Math.floor(percentCompleted); // Return as an integer
  //   } catch (error) {
  //       console.error('Error calculating percent completed:', error);
  //       throw new Error('Could not calculate percent completed');
  //   }
  // }
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
        allowNull: true,
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
        type: DataTypes.ENUM(...Object.keys(UserType)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.keys(UserAccountStatus)),
        allowNull: false,
        defaultValue: 'active',
      },
      verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      country: {
        type: DataTypes.ENUM(...Object.values(Country)),
        allowNull: false,
        defaultValue: Country.NG,
      },
      institutionId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true,
      paranoid: false,
      tableName: 'users',
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        auth: {
          attributes: { include: ['password'] }, // Add necessary fields for authentication
        },
      },
    }
  );

  // Add the password hashing hook before saving
  User.addHook('beforeSave', async (user: User) => {
    if (user.changed('password') || user.isNewRecord) {
      user.password = await User.hashPassword(user.password);
    }
  });
};

// Export the User model and the init function
export default User; // Ensure User is exported as default
export { initModel };
