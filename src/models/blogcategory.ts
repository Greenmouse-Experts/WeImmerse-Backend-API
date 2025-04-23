import { Model, DataTypes, Sequelize } from 'sequelize';
import Blog from './blog';

class BlogCategory extends Model {
  public id!: string;
  public name!: string;
  public slug!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public blogs?: Blog[];

  static associate(models: any) {
    this.hasMany(models.Blog, {
      as: 'blogs',
      foreignKey: 'categoryId',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  BlogCategory.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 50],
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'BlogCategory',
      tableName: 'blog_categories',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['slug'],
        },
        {
          fields: ['name'],
        },
      ],
    }
  );
};

export default BlogCategory;
export { initModel };
