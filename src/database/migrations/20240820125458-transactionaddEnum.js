'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableName = 'transactions';

    // Modify membershipStatus ENUM column to include any new values
    await queryInterface.changeColumn(tableName, 'membershipStatus', {
      type: Sequelize.ENUM('new', 'extend', 'ismember'),
      allowNull: false,
      defaultValue: 'new', // Optional: set a default value if necessary
    });

    // Modify statusProgress ENUM column to include any new values
    await queryInterface.changeColumn(tableName, 'statusProgress', {
      type: Sequelize.ENUM('new', 'done', 'take', 'progress'),
      allowNull: false,
      defaultValue: 'new', // Optional: set a default value if necessary
    });
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'transactions';

    // Revert changes by changing ENUM fields back if necessary
    await queryInterface.changeColumn(tableName, 'membershipStatus', {
      type: Sequelize.ENUM('new', 'extend'),
      allowNull: false,
    });

    await queryInterface.changeColumn(tableName, 'statusProgress', {
      type: Sequelize.ENUM('new', 'done', 'progress'),
      allowNull: false,
    });
  }
};
