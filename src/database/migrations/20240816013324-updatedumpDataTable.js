'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the `noPass` column
    await queryInterface.removeColumn('dumpCustMember', 'noPass');

    // Add the `Payment` column
    await queryInterface.addColumn('dumpCustMember', 'Payment', {
      type: Sequelize.STRING, // Adjust the type based on your requirements
      allowNull: true // Adjust based on your requirements
    });

    // Add the `CodeProduct` column
    await queryInterface.addColumn('dumpCustMember', 'CodeProduct', {
      type: Sequelize.STRING, // Adjust the type based on your requirements
      allowNull: true // Adjust based on your requirements
    });
  },

  async down(queryInterface, Sequelize) {
    // Re-add the `noPass` column (specify its type and options as needed)
    await queryInterface.addColumn('dumpCustMember', 'noPass', {
      type: Sequelize.STRING, // Adjust the type based on your previous schema
      allowNull: true // Adjust based on your requirements
    });

    // Remove the `Payment` column
    await queryInterface.removeColumn('dumpCustMember', 'Payment');

    // Remove the `CodeProduct` column
    await queryInterface.removeColumn('dumpCustMember', 'CodeProduct');
  }
};
