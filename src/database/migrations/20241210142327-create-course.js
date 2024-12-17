'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users', // Ensure the related table is correct
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'course_categories', // Ensure the related table is correct
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      subtitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      language: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      level: {
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      requirement: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      whatToLearn: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM('live', 'unpublished', 'under_review', 'draft'),
        defaultValue: 'draft',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('courses');
  }
};