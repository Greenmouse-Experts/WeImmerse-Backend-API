// seeders/20241024104812-permissions.js
'use strict';

const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { id: uuidv4(), name: 'view-subadmin', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'create-subadmin', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'update-subadmin', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'delete-subadmin', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'activateanddeactivate-subadmin', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'resendlogindetails-subadmin', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'update-password', createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'update-profile', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
