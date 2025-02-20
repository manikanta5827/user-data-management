const sequelize = require('../config/dbConfig');

const resetDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database reset successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to reset database:', error);
    process.exit(1);
  }
};

resetDatabase(); 