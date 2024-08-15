'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adding the 'stnk' and 'licensePlate' columns to the Transactions table
    await queryInterface.addColumn('transactions', 'stnk', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust as needed, true if it's optional
    });
    
    await queryInterface.addColumn('transactions', 'licensePlate', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust as needed, true if it's optional
    });
  },

  async down (queryInterface, Sequelize) {
    // Removing the 'stnk' and 'licensePlate' columns from the Transactions table
    await queryInterface.removeColumn('transactions', 'stnk');
    await queryInterface.removeColumn('transactions', 'licensePlate');
  }
};
