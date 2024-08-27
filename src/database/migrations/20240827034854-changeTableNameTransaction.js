'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename the updatedBy column to approvedBy
    await queryInterface.renameColumn('transactions', 'updatedBy', 'approvedBy');

    // Add the NoRef column
    await queryInterface.addColumn('transactions', 'NoRef', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the column name back to updatedBy
    await queryInterface.renameColumn('transactions', 'approvedBy', 'updatedBy');

    // Remove the NoRef column
    await queryInterface.removeColumn('transactions', 'NoRef');
  }
};
