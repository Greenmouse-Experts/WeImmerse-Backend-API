'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('physical_assets', 'isPublished', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('physical_assets', 'isPublished');
  },
};
