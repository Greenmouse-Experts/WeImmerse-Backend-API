'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('institution_informations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      institutionName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      institutionEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      institutionIndustry: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      institutionSize: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      institutionPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      institutionType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      institutionLocation: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('institution_informations');
  }
};