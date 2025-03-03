'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wallets', {
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
      balance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      previousBalance: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
      currency: {
        type: Sequelize.STRING(3),
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
    await queryInterface.addIndex('wallets', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('wallets');
  },
};
