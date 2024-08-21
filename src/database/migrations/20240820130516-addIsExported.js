'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add isExported column to dumpCustMember table
    await queryInterface.addColumn('dumpCustMember', 'isExported', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false, // Set default value to false
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove isExported column from dumpCustMember table
    await queryInterface.removeColumn('dumpCustMember', 'isExported');
  }
};

