'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the new field 'paymentFile'
    await queryInterface.addColumn('transactions', 'paymentFile', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Modify 'licensePlate' and 'stnk' to be optional (allow NULL)
    await queryInterface.changeColumn('transactions', 'licensePlate', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('transactions', 'stnk', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes: remove the 'paymentFile' column
    await queryInterface.removeColumn('transactions', 'paymentFile');

    // Revert 'licensePlate' and 'stnk' to not allow NULL if they were not nullable before
    await queryInterface.changeColumn('transactions', 'licensePlate', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('transactions', 'stnk', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
