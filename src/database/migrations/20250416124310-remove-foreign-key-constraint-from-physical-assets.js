'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint(
      'physical_assets',
      'physical_assets_ibfk_2'
    );
  },

  async down(queryInterface, Sequelize) {
    // Re-add the constraint if you want to rollback
    await queryInterface.addConstraint('physical_assets', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'physical_assets_ibfk_2',
      references: {
        table: 'physical_categories',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};
