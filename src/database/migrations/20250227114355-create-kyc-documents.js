'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('kyc_documents', {
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
      documentType: {
        type: Sequelize.ENUM(
          'passport',
          'national_id',
          'driver_license',
          'CAC_document'
        ),
        allowNull: false,
      },
      documentUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uploadedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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
    await queryInterface.dropTable('kyc_documents');
  },
};
