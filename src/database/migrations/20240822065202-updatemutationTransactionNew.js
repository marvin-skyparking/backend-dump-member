'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('mutationData', 'nominal', {
      type: Sequelize.INTEGER, // Change to FLOAT or INTEGER
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('mutationData', 'nominal', {
      type: Sequelize.DECIMAL, // Revert back if needed
      allowNull: true,
    });
  }
};

