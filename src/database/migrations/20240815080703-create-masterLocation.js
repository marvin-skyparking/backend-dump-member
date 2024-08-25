'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create a new table 'locations'
    await queryInterface.createTable('MasterLocations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      LocationCode: {
        type: Sequelize.STRING,
        allowNull: false
      },
      LocationName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      QuotaMobil: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      QuotaMotor: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      CardMobilQuota: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      CardMotorQuota: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      VirtualAccount: {
        type: Sequelize.STRING,
        allowNull: true
      },
      CreateBy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      UpdatedBy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      DeletedBy: {
        type: Sequelize.STRING,
        allowNull: true
      },
      CreatedOn: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      UpdateOn: {
        type: Sequelize.DATE,
        allowNull: true
      },
      DeleteOn: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      InitialLocation: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the 'locations' table if it exists
    await queryInterface.dropTable('MasterLocations');
  }
};
