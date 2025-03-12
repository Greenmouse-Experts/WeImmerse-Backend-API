'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('subscription_plans', 'period', {
      type: Sequelize.ENUM('Quarterly', 'Monthly', 'Yearly'),
      allowNull: true,
    });
    await queryInterface.addColumn('subscription_plans', 'currency', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('subscription_plans', 'productLimit');
    await queryInterface.removeColumn('subscription_plans', 'allowsAuction');
    await queryInterface.removeColumn(
      'subscription_plans',
      'auctionProductLimit'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('subscription_plans', 'period');
    await queryInterface.removeColumn('subscription_plans', 'currency');
    await queryInterface.addColumn('subscription_plans', 'productLimit', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addColumn('subscription_plans', 'allowsAuction', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Free plan may not allow auctions
    });
    await queryInterface.addColumn(
      'subscription_plans',
      'auctionProductLimit',
      {
        type: Sequelize.INTEGER,
        allowNull: true, // Null if auctions are not allowed
      }
    );
  },
};
