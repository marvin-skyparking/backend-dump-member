'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create the 'mutationData' table with the specified columns
    await queryInterface.createTable('mutationData', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,  // Adjust according to your requirements
      },
      dateinsert: {
        type: Sequelize.DATE,
        allowNull: true,  // Adjust according to your requirements
      },
      nominal: {
        type: Sequelize.DECIMAL, // or Sequelize.FLOAT depending on your use case
        allowNull: true,  // Adjust according to your requirements
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
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // Drop the 'mutationData' table if it exists
    await queryInterface.dropTable('mutationData');
  }
};
