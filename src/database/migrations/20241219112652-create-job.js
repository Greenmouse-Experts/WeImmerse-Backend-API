'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
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
          model: 'job_categories', // Ensure the related table is correct
          key: 'id',
        },
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      company: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      logo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      workplaceType: {
        type: Sequelize.ENUM('remote', 'on-site', 'hybrid'),
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      jobType: {
        type: Sequelize.ENUM('full-time', 'part-time', 'contract', 'temporary', 'volunteer', 'internship'),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      skills: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      applyLink: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      applicantCollectionEmailAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rejectionEmails: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'closed'),
        defaultValue: 'draft',
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
    await queryInterface.dropTable('jobs');
  }
};