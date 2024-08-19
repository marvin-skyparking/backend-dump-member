'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('MasterLocations', 'motorMobilRemaining', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if this field should not allow nulls
      defaultValue: 0, // Set default value as needed
    });

    await queryInterface.addColumn('MasterLocations', 'cardMotorMobilRemaining', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if this field should not allow nulls
      defaultValue: 0, // Set default value as needed
    });

    await queryInterface.addColumn('MasterLocations', 'cardMobilRemaining', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if this field should not allow nulls
      defaultValue: 0, // Set default value as needed
    });

    await queryInterface.addColumn('MasterLocations', 'cardMotorRemaining', {
      type: Sequelize.INTEGER,
      allowNull: true, // Set to false if this field should not allow nulls
      defaultValue: 0, // Set default value as needed
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('MasterLocations', 'motorMobilRemaining');
    await queryInterface.removeColumn('MasterLocations', 'cardMotorMobilRemaining');
    await queryInterface.removeColumn('MasterLocations', 'cardMobilRemaining');
    await queryInterface.removeColumn('MasterLocations', 'cardMotorRemaining');
  }
};
