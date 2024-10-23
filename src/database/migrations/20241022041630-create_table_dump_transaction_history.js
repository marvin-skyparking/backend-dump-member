'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions_dump_history', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phonenumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      membershipStatus: {
        type: Sequelize.ENUM('new', 'extend', 'ismember'),
        allowNull: false,
      },
      vehicletype: {
        type: Sequelize.ENUM('MOBIL', 'MOTOR'),
        allowNull: false,
      },
      NoCard: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PlateNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      licensePlate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      stnk: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paymentFile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      locationCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      NoRef: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      paidAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isBayar: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      createdBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      approvedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deletedOn: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deletedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      noRek: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      namaRek: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions_dump_history');
  }
};
