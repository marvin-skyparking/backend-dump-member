'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Change the type of `idProdukPass` to ENUM
    await queryInterface.changeColumn('dumpCustMember', 'idGrup', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the ENUM changes to the previous state (assuming INTEGER was the previous type)
    await queryInterface.changeColumn('dumpCustMember', 'idGrup', {
      type: Sequelize.INTEGER, // Assuming the previous type was INTEGER
      allowNull: false,
    });
  }
};
