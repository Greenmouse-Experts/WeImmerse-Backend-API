'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      creatorId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      discountType: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        allowNull: false,
      },
      discountValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      maxUses: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      currentUses: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      validFrom: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      validUntil: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      minPurchaseAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      applicableCourses: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue('applicableCourses');
          return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
          this.setDataValue('applicableCourses', JSON.stringify(value));
        },
      },
      applicableAccountTypes: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
          const rawValue = this.getDataValue('applicableAccountTypes');
          return rawValue ? JSON.parse(rawValue) : null;
        },
        set(value) {
          this.setDataValue('applicableAccountTypes', JSON.stringify(value));
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('coupons');
    // Drop the enum type explicitly
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_coupons_discountType"'
    );
  },
};
