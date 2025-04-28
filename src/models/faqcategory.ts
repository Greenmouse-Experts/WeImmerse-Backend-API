import { Model, DataTypes, Sequelize } from 'sequelize';

export enum FAQCategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

class FAQCategory extends Model {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public icon!: string | null;
  public status!: FAQCategoryStatus;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    FAQCategory.hasMany(models.FAQ, {
      foreignKey: 'categoryId',
      as: 'faqs',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  FAQCategory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(FAQCategoryStatus)),
        allowNull: false,
        defaultValue: FAQCategoryStatus.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: 'FAQCategory',
      tableName: 'faq_categories',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default FAQCategory;
export { initModel };
