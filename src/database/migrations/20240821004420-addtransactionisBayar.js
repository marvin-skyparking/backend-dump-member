'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add the 'isBayar' boolean column to the table
    await queryInterface.addColumn('transactions', 'isBayar', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the 'isBayar' column if needed
    await queryInterface.removeColumn('transactions', 'isBayar');
  }
};

