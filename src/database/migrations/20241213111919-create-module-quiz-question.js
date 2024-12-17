'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('module_quiz_questions', {
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
      moduleQuizId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'module_quizzes', // Replace with the actual module questions table name
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      options: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      correctOption: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      score: {
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
    await queryInterface.dropTable('module_quiz_questions');
  }
};