'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('mutationData', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      dateinsert: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      nominal: {
        type: Sequelize.DECIMAL, // or Sequelize.FLOAT depending on your use case
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        onUpdate: 'CASCADE', // Use one of the allowed string values
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('mutationData');
  }
};
