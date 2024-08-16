'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dumpCustMember', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false
      },
      noPass: {
        type: Sequelize.STRING,
        allowNull: false
      },
      noPolisi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      idProdukPass: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      TGL_AKHIR: {
        type: Sequelize.DATE,
        allowNull: false
      },
      idGrup: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      FAKTIF: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      FUPDATE: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      NoKartu: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('dumpCustMember');
  }
};
