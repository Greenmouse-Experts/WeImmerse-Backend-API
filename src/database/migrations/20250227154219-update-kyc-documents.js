'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('kyc_documents', 'vettingStatus', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    });

    await queryInterface.addColumn('kyc_documents', 'vettedBy', {
      type: Sequelize.UUID,
      allowNull: true,
      // references: {
      //   model: 'admins', // Ensure this matches the Admins table
      //   key: 'id',
      // },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addColumn('kyc_documents', 'vettedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('kyc_documents', 'vettingStatus');
    await queryInterface.removeColumn('kyc_documents', 'vettedBy');
    await queryInterface.removeColumn('kyc_documents', 'vettedAt');
  },
};
