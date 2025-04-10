'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint(
      'digital_assets',
      'digital_assets_ibfk_2'
    );
  },

  async down(queryInterface, Sequelize) {
    // Re-add the constraint if you want to rollback
    await queryInterface.addConstraint('digital_assets', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'digital_assets_ibfk_2',
      references: {
        table: 'asset_categories',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
