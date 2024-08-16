'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('dumpMember', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
        type: Sequelize.STRING,
        allowNull: false
      },
      TGLAKHIR: {
        type: Sequelize.DATE,
        allowNull: false
      },
      idGrup: {
        type: Sequelize.STRING,
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
      noKartu: {
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
    await queryInterface.dropTable('dumpMember');
  }
};
