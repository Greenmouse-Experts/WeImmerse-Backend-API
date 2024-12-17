'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('module_quizzes', {
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
          model: 'users', // Replace with the actual users table name
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      courseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'courses', // Replace with the actual courses table name
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      moduleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'modules', // Replace with the actual modules table name
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      timePerQuestion: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('module_quizzes');
  }
};