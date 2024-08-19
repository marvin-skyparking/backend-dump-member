'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Rename existing columns
    await queryInterface.renameColumn('MasterLocations', 'motorMobilRemaining', 'QuotaMotorRemaining');
    await queryInterface.renameColumn('MasterLocations', 'cardMotorMobilRemaining','QuotaMobilRemaining');
  },
  async down (queryInterface, Sequelize) {
    // Revert renames
    await queryInterface.renameColumn('MasterLocations', 'motorMobilRemaining', 'QuotaMotorRemaining');
    await queryInterface.renameColumn('MasterLocations', 'cardMotorMobilRemaining', 'QuotaMobilRemaining');
  }
};
