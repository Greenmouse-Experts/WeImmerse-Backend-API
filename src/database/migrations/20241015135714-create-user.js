'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      email_verified_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      dateOfBirth: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      educationalLevel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      schoolId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      professionalSkill: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      industry: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      jobTitle: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      referralCode: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      photo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      evToken: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
      },
      accountType: {
        type: Sequelize.ENUM('student', 'user', 'institution', 'creator'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
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
    await queryInterface.dropTable('users');
  },
};
