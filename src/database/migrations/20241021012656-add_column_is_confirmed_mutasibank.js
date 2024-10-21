'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add the isConfirmed boolean column to mutationData table
    await queryInterface.addColumn('mutationData', 'isConfirmed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,  // Set to false if the column should not allow null values
      defaultValue: false // Optional, set the default value to false
    });
  },

  async down (queryInterface, Sequelize) {
    // Remove the isConfirmed column from mutationData table
    await queryInterface.removeColumn('mutationData', 'isConfirmed');
  }
};
