'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`transactions\` 
      CHANGE \`paymentType\` \`paymentType\` 
      ENUM('product','subscription','digital_asset','physical_asset','course') 
      CHARACTER SET utf8 
      COLLATE utf8_general_ci 
      NOT NULL 
      DEFAULT 'product';
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE \`transactions\` 
      CHANGE \`paymentType\` \`paymentType\` 
      ENUM('subscription','digital_asset','physical_asset','course') 
      CHARACTER SET utf8 
      COLLATE utf8_general_ci 
      NOT NULL 
      DEFAULT 'subscription';
    `);
  },
};
