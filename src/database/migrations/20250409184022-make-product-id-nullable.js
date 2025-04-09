'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('transactions', 'productId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('transactions', 'productId', {
      type: Sequelize.UUID,
      allowNull: false, // 👈 restore original state
    });
  },
};
