'use strict';
const bcrypt = require("bcrypt"); // Use require to import the bcrypt library
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    return queryInterface.bulkInsert('admins', [{
      id: uuidv4(),
      name: 'Administrator',
      email: "admin@kudumart.com",
      password: await bcrypt.hash("Password", saltRounds),
      role: "superadmin",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    
    return queryInterface.bulkDelete('admins', null, {});
  }
};
