'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('physical_asset_orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'users',
        //   key: 'id',
        // },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      assetId: {
        type: Sequelize.UUID,
        allowNull: false,
        // references: {
        //   model: 'physical_assets',
        //   key: 'id',
        // },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      transactionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'transactions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
        type: Sequelize.ENUM('processing', 'shipped', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'processing',
      },
      shippingAddress: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      trackingNumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add index for status field for faster queries
    await queryInterface.addIndex('physical_asset_orders', {
      fields: ['status'],
      name: 'physical_asset_orders_status_index',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('physical_asset_orders');
  },
};
