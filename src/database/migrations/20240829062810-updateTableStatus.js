/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ActivityLog', 'status', {
      type: Sequelize.TEXT, // Change to LONGTEXT to allow larger data
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('ActivityLog', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};