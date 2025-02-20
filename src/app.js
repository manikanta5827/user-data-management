const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const basicRoutes = require('./routes/basicRoutes');
const sequelize = require('./config/dbConfig');
const errorHandler = require('./middlewares/errorMiddleware');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const validateEnv = require('./config/envConfig');

// Load and validate environment variables
dotenv.config();
validateEnv();

const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Basic routes
app.use('/', basicRoutes);

// API routes
app.use('/api', userRoutes);
app.use('/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

// Sync database and start server
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Only sync without dropping tables
    await sequelize.sync({ force: false }); // Changed to false
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