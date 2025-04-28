'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Alter the `email` column to be UNIQUE
    await queryInterface.sequelize.query(`
      ALTER TABLE \`admins\`
      CHANGE \`email\` \`email\` VARCHAR(255) UNIQUE;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Optional: Revert the change if needed
    await queryInterface.sequelize.query(`
      ALTER TABLE \`admins\`
      CHANGE \`email\` \`email\` VARCHAR(255);
    `);
  },
};
