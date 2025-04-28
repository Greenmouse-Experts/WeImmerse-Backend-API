import { Model, DataTypes, Sequelize } from 'sequelize';

export enum FAQStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum FAQVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  MEMBERS_ONLY = 'members_only',
}

class FAQ extends Model {
  public id!: string;
  public question!: string;
  public answer!: string;
  public categoryId!: string;
  public status!: FAQStatus;
  public visibility!: FAQVisibility;
  public views!: number;
  public helpfulCount!: number;
  public notHelpfulCount!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    FAQ.belongsTo(models.FAQCategory, {
      foreignKey: 'categoryId',
      as: 'category',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  FAQ.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'faq_categories',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(FAQStatus)),
        allowNull: false,
        defaultValue: FAQStatus.DRAFT,
      },
      visibility: {
        type: DataTypes.ENUM(...Object.values(FAQVisibility)),
        allowNull: false,
        defaultValue: FAQVisibility.PUBLIC,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      helpfulCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      notHelpfulCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'FAQ',
      tableName: 'faqs',
      timestamps: true,
      paranoid: false,
    }
  );
};

export default FAQ;
export { initModel };
