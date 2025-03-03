'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('withdrawal_accounts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        unique: true,
      },
      accountNumber: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      accountType: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      bankName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      routingNumber: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(255),
        defaultValue: 'Nigeria',
      },
      countryCode: {
        type: Sequelize.CHAR(2),
        defaultValue: 'NG',
      },
      currency: {
        type: Sequelize.STRING(255),
        defaultValue: 'NGN',
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
    await queryInterface.addIndex('withdrawal_accounts', ['userId']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('withdrawal_accounts');
  },
};
