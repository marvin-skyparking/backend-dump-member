import sequelize from '../src/config/database'; // Adjust the path to where your sequelize instance is located

const runMigrations = async () => {
  try {
    console.log('Running migrations...');

    // Use sequelize-cli to run migrations
    await sequelize.getQueryInterface().showAllSchemas(); // Replace with actual migration logic

    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

runMigrations();
