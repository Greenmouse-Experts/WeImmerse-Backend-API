'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lessons', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      moduleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'modules', // Replace with your modules table name
          key: 'id',
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE', 
      },
      courseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'courses', // Replace with your courses table name
          key: 'id',
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE', 
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      contentType: {
        type: Sequelize.ENUM('text', 'quiz', 'assignment', 'youtube', 'video', 'audio', 'article'),
        defaultValue: 'video',
      },
      contentUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('draft', 'published'),
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
    await queryInterface.dropTable('lessons');
  }
};