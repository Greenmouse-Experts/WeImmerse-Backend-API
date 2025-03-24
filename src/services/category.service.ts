import { Op } from 'sequelize';
import Category, {
  CategoryAttributes,
  CategoryTypes,
} from '../models/category';
import { NotFoundError } from '../utils/ApiError';

class CategoryService {
  async createCategory(data: {
    name: string;
    description?: string;
    parentId?: string;
    isActive?: boolean;
  }) {
    const existingCategory = await Category.findOne({
      where: {
        name: data.name,
        parentId: data.parentId || null,
      },
    });

    if (existingCategory) {
      throw new Error(
        data.parentId
          ? 'Subcategory with this name already exists under the specified parent'
          : 'Category with this name already exists'
      );
    }

    return Category.create(data as CategoryAttributes);
  }

  async getCategoryById(id: string, includeChildren: boolean = false) {
    const options: any = {
      where: { id },
    };

    if (includeChildren) {
      options.include = [
        {
          association: 'children',
          where: { isActive: true },
          required: false,
        },
      ];
    }

    const category = await Category.findOne(options);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  async getAllCategories(
    includeInactive: boolean = false,
    type?: CategoryTypes
  ) {
    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (type) {
      where.type = type;
    }

    return Category.findAll({
      where,
      include: [
        {
          association: 'children',
          where: includeInactive ? {} : { isActive: true },
          required: false,
        },
      ],
      order: [
        ['parentId', 'ASC'],
        ['name', 'ASC'],
      ],
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      parentId?: string | null;
      isActive?: boolean;
    }
  ) {
    const category = await this.getCategoryById(id);

    if (data.name) {
      const existingCategory = await Category.findOne({
        where: {
          name: data.name,
          parentId:
            data.parentId !== undefined ? data.parentId : category.parentId,
          id: { [Op.ne]: id },
        },
      });

      if (existingCategory) {
        throw new Error(
          data.parentId
            ? 'Subcategory with this name already exists under the specified parent'
            : 'Category with this name already exists'
        );
      }
    }

    return category.update(data);
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);

    // Check if category has children
    const childCount = await Category.count({
      where: { parentId: id },
    });

    if (childCount > 0) {
      throw new Error('Cannot delete category that has subcategories');
    }

    await category.destroy();
    return true;
  }

  async toggleCategoryStatus(id: string) {
    const category = await this.getCategoryById(id);
    return category.update({ isActive: !category.isActive });
  }
}

export default new CategoryService();
