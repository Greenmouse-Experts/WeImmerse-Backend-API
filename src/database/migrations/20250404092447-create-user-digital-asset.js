'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_digital_assets', {
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
        //   model: 'digital_assets',
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
      accessGrantedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      downloadCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    // Add composite index for userId and assetId to prevent duplicates
    await queryInterface.addIndex('user_digital_assets', {
      fields: ['userId', 'assetId'],
      unique: true,
      name: 'user_digital_assets_userId_assetId_unique',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_digital_assets');
  },
};
