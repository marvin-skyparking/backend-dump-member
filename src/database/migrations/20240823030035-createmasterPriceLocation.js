'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create the MasterLocationPrice table
    await queryInterface.createTable('MasterLocationPrices', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      locationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      locationName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      priceMotor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      priceMobil: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    // Drop the MasterLocationPrice table
    await queryInterface.dropTable('MasterLocationPrices');
  }
};
