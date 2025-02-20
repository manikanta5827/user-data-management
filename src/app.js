const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const basicRoutes = require('./routes/basicRoutes');
const sequelize = require('./config/dbConfig');
const errorHandler = require('./middlewares/errorMiddleware');
const morgan = require('morgan');
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic routes
app.use('/', basicRoutes);

// API routes
app.use('/api', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Sync database and start server
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Force sync only during development
    await sequelize.sync({ force: true }); // This will drop and recreate the table
    console.log('Database synced successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; 