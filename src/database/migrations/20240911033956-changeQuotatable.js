'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Rename columns
    await queryInterface.renameColumn('MasterLocations', 'motorMobilRemaining', 'QuotaMotorRemaining');
    await queryInterface.renameColumn('MasterLocations', 'cardMotorMobilRemaining', 'QuotaMobilRemaining');
  },

  async down (queryInterface, Sequelize) {
    // Revert column names to original names
    await queryInterface.renameColumn('MasterLocations', 'QuotaMotorRemaining', 'motorMobilRemaining');
    await queryInterface.renameColumn('MasterLocations', 'QuotaMobilRemaining', 'cardMotorMobilRemaining');
  }
};
