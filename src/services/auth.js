const TwitterUser = require('../models/TwitterUser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const TwitterStrategy = require('passport-twitter').Strategy;
const passport = require('passport');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      twitterId: user.twitterId,
      role: 'ADMIN' // Since Twitter auth users are admins
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const findOrCreateTwitterUser = async (profile, token, tokenSecret) => {
  const [user] = await TwitterUser.findOrCreate({
    where: { twitterId: profile.id },
    defaults: {
      username: profile.username,
      displayName: profile.displayName,
      token: token,
      tokenSecret: tokenSecret
    }
  });
  return user;
};

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    proxy: true // Add this for reverse proxy support
  },
  function(token, tokenSecret, profile, cb) {
    // Your user handling logic here
    return cb(null, profile);
  }
));

// Ensure proper serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = {
  generateToken,
  verifyToken,
  findOrCreateTwitterUser
};
