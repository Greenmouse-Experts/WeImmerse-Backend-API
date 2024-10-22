'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessDescription: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      businessLink: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      businessDescription: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable('business_details');
  }
};