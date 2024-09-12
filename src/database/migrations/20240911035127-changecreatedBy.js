'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Rename columns
    await queryInterface.renameColumn('MasterLocations', 'CreateBy', 'createdBy');
  },

  async down (queryInterface, Sequelize) {
    // Revert column names to original names
    await queryInterface.renameColumn('MasterLocations', 'createdBy', 'CreateBy');
  }
};
