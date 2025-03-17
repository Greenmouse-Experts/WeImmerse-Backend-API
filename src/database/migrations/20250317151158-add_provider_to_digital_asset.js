'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('digital_assets', 'provider', {
      type: Sequelize.ENUM('meshy-ai', 'system'),
      defaultValue: 'system',
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('digital_assets', 'provider');
  },
};
