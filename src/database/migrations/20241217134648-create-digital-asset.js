'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('digital_assets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
        type: Sequelize.STRING, // Store file path or URL
        allowNull: false,
      },
      assetThumbnail: {
        type: Sequelize.STRING, // Store file path or URL
        allowNull: false,
      },
      specificationSubjectMatter: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specificationMedium: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specificationSoftwareUsed: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      specificationTags: {
        type: Sequelize.JSON, // Array of tags stored as JSON
        allowNull: false,
      },
      specificationVersion: {
        type: Sequelize.STRING, // Optional
        allowNull: true,
      },
      pricingType: {
        type: Sequelize.ENUM("One-Time-Purchase", "Free"),
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
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('digital_assets');
  },
};
