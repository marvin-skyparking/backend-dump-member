'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adding the locationCode column to the Transactions table
    await queryInterface.addColumn('transactions', 'locationCode', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    // Removing the locationCode column from the Transactions table
    await queryInterface.removeColumn('transactions', 'locationCode');
  }
};
