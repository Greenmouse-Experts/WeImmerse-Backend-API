'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transactions', 'productId', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Remove paymentMethod column
    await queryInterface.removeColumn('transactions', 'paymentMethod');

    // Remove paymentMethod column
    await queryInterface.removeColumn('transactions', 'paymentType');

    // Add paymentMethod column
    await queryInterface.addColumn('transactions', 'paymentMethod', {
      type: Sequelize.ENUM('card', 'bank_transfer', 'wallet', 'paystack'),
      allowNull: false,
      defaultValue: 'paystack',
    });

    // Add paymentMethod column
    await queryInterface.addColumn('transactions', 'paymentType', {
      type: Sequelize.ENUM(
        'product',
        'subscription',
        'digital_asset',
        'physical_asset',
        'course'
      ),
      allowNull: false,
      defaultValue: 'product',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactions', 'productId');

    // Remove paymentMethod column
    await queryInterface.removeColumn('transactions', 'paymentMethod');

    // Remove paymentType column
    await queryInterface.removeColumn('transactions', 'paymentType');

    // Drop ENUM type if necessary (PostgreSQL)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_transactions_paymentMethod";'
    );
  },
};
