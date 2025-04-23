'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('blog_categories', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });

    // Add indexes
    await queryInterface.addIndex('blog_categories', ['slug'], {
      unique: true,
      name: 'blog_categories_slug_unique',
    });

    await queryInterface.addIndex('blog_categories', ['name'], {
      name: 'blog_categories_name_index',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex(
      'blog_categories',
      'blog_categories_slug_unique'
    );
    await queryInterface.removeIndex(
      'blog_categories',
      'blog_categories_name_index'
    );

    // Then drop the table
    await queryInterface.dropTable('blog_categories');
  },
};
