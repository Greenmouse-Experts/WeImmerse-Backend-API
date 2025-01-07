'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('physical_assets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'asset_categories', // Ensure the related table is correct
          key: 'id',
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
      },
      assetName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      assetDetails: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      assetUpload: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      assetThumbnail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specification: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      specificationTags: {
        type: Sequelize.JSON, // Array of tags stored as JSON
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('published', 'unpublished', 'under_review'),
        defaultValue: 'under_review',
      },
      adminNote: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('physical_assets');
  },
};
