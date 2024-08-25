'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the MasterLocations table with id as the primary key
    await queryInterface.createTable('MasterLocations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      locationCode: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true, // Ensure locationCode is unique
      },
      locationName: {
        type: Sequelize.STRING(100),
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

    // Create the MasterLocationPrices table with a foreign key relationship to MasterLocations
    await queryInterface.createTable('MasterLocationPrices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      locationId: {
        type: Sequelize.INTEGER, // Change to INTEGER to match the id in MasterLocations
        allowNull: false,
        references: {
          model: 'MasterLocations', // Reference the MasterLocations table
          key: 'id', // Reference the id column in MasterLocations
        },
        onUpdate: 'CASCADE', // Update strategy
        onDelete: 'CASCADE', // Delete strategy
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

  async down(queryInterface, Sequelize) {
    // Drop the MasterLocationPrices table first because it depends on MasterLocations
    await queryInterface.dropTable('MasterLocationPrices');

    // Then drop the MasterLocations table
    await queryInterface.dropTable('MasterLocations');
  }
};
