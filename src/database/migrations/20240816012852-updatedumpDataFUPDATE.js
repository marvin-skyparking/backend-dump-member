'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change the type of `FUPDATE` to INTEGER
    await queryInterface.changeColumn('dumpCustMember', 'FUPDATE', {
      type: Sequelize.INTEGER, // Use INTEGER or another valid numeric type
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the column type to DATE
    await queryInterface.changeColumn('dumpCustMember', 'FUPDATE', {
      type: Sequelize.DATE, // Revert to DATE or the original type
      allowNull: false,
    });
  }
};
