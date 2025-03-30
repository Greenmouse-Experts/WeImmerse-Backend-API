'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      subscriptionId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      paymentType: {
        type: Sequelize.ENUM('subscription', 'job', 'asset', 'course'),
        allowNull: false,
        defaultValue: 'subscription',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'NGN',
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed', 'refunded'),
        allowNull: false,
        defaultValue: 'pending',
      },
      paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      paymentGateway: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gatewayReference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  },
};
