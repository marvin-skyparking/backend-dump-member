'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add the new ENUM type to the `vehicletype` column
    await queryInterface.changeColumn('transactions', 'vehicletype', {
      type: Sequelize.ENUM('MOTOR', 'MOBIL'),
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the ENUM changes to the previous state
    await queryInterface.changeColumn('transactions', 'vehicletype', {
      type: Sequelize.ENUM('MOTOR', 'MOBIL'),
      allowNull: false
    });
  }
};
