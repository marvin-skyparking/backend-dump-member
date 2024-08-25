'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transactions', 'statusProgress', {
      type: Sequelize.ENUM,
      values: ['done', 'take', 'progress'],
      defaultValue: 'progress', // Default value
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactions', 'statusProgress');
  }
};
