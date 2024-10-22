'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adding the 'namaProduk' column to 'MasterLocationPrices' table
    await queryInterface.addColumn('MasterLocationPrices', 'namaProduk', {
      type: Sequelize.STRING, // You can change the data type if needed (e.g., TEXT)
      allowNull: true, // Set true/false based on whether the field can be null
    });
  },

  async down (queryInterface, Sequelize) {
    // Removing the 'namaProduk' column from 'MasterLocationPrices' table
    await queryInterface.removeColumn('MasterLocationPrices', 'namaProduk');
  }
};
