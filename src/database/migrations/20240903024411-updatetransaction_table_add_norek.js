'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Adding new columns to the transactions table.
     */
    await queryInterface.addColumn('transactions', 'noRek', {
      type: Sequelize.STRING, // Adjust the type as needed (e.g., STRING, INTEGER)
      allowNull: false // Set to false if this field is required
    });

    await queryInterface.addColumn('transactions', 'namaRek', {
      type: Sequelize.STRING, // Adjust the type as needed
      allowNull: false // Set to false if this field is required
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Removing the columns if the migration is rolled back.
     */
    await queryInterface.removeColumn('transactions', 'noRek');
    await queryInterface.removeColumn('transactions', 'namaRek');
  }
};
