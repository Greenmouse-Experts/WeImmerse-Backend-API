'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First add the isPublished column if it doesn't exist
    // await queryInterface.addColumn('jobs', 'isPublished', {
    //   type: Sequelize.BOOLEAN,
    //   allowNull: true,
    //   defaultValue: true,
    // });

    // Then update the status enum to include 'live'
    await queryInterface.sequelize.query(`
      ALTER TABLE \`jobs\`
      CHANGE \`status\`  \`status\`
      ENUM('draft', 'active', 'closed', 'live') 
      CHARACTER SET utf8 
      COLLATE utf8_general_ci 
      NOT NULL 
      DEFAULT 'draft';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the isPublished column
    await queryInterface.removeColumn('jobs', 'isPublished');

    // Revert the status enum to its previous values
    await queryInterface.sequelize.query(`
      ALTER TABLE \'jobs\' 
      CHANGE \'status\'  \'status\'
      ENUM('draft', 'active', 'closed') 
      CHARACTER SET utf8 
      COLLATE utf8_general_ci 
      NOT NULL 
      DEFAULT 'draft';
    `);
  },
};
