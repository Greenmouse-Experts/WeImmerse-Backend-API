import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

export enum CategoryTypes {
  COURSE = 'course',
  ASSET = 'asset',
  JOB = 'job',
}

export interface CategoryAttributes {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  type?: CategoryTypes;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public name!: string;
  public description!: string | null;
  public parentId!: string | null;
  public isActive!: boolean;
  public type!: CategoryTypes;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly parent?: Category;
  public readonly children?: Category[];

  static associate(models: any) {
    this.belongsTo(models.Category, {
      as: 'parent',
      foreignKey: 'parentId',
      onDelete: 'SET NULL',
    });

    this.hasMany(models.Category, {
      as: 'children',
      foreignKey: 'parentId',
    });
  }
}

const initModel = (sequelize: Sequelize) => {
  Category.init(
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
        type: DataTypes.TEXT,
        allowNull: true,
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(CategoryTypes)),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true,
    }
  );
};

export default Category;
export { initModel };
