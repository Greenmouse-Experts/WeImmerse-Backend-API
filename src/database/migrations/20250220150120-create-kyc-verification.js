'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kyc_verifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        // references: {
        //   model: 'users', // Ensure this matches the Users table name
        //   key: 'id',
        // },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      verificationProvider: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      verificationReference: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },
      adminReviewedBy: {
        type: Sequelize.STRING,
        allowNull: true,
        // references: {
        //   model: 'admins', // Ensure this matches the Admins table name
        //   key: 'id',
        // },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      adminReviewedAt: {
        type: Sequelize.DATE,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('kyc_verifications');
  },
};
