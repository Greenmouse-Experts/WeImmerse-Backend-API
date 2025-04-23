import { Model, DataTypes, Sequelize } from 'sequelize';
import User from './user';

export enum BlogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

class Blog extends Model {
  public id!: string;
  public title!: string;
  public content!: string;
  public categoryId!: string;
  public slug!: string;
  public featuredImage?: string;
  public status!: 'draft' | 'published' | 'archived';
  public userId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public user?: User;

  static associate(models: any) {
    // Add this association
    this.belongsTo(models.BlogCategory, {
      as: 'category',
      foreignKey: 'categoryId',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  Blog.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [5, 255],
        },
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^[a-z0-9-]+$/i,
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [100, 10000],
        },
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      featuredImage: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(BlogStatus)),
        defaultValue: BlogStatus.DRAFT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Blog',
      tableName: 'blogs',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['slug'],
        },
        {
          fields: ['status'],
        },
      ],
    }
  );
};

export default Blog;
export { initModel };
