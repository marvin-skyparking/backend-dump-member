'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add a new column 'paid_amount' to the 'transactions' table
    await queryInterface.addColumn('transactions', 'paidAmount', {
      type: Sequelize.INTEGER,  // INTEGER type
      allowNull: true,          // Allows NULL values
      defaultValue: null        // Sets the default value to NULL
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'paid_amount' column if we need to roll back
    await queryInterface.removeColumn('transactions', 'paidAmount');
  }
};

