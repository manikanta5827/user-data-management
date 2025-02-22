const express = require('express');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const { findOrCreateTwitterUser, generateToken } = require('../services/auth');
const router = express.Router();

// Configure Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
},
    async (token, tokenSecret, profile, done) => {
        try {
            console.log('Twitter auth successful, profile:', {
                id: profile.id,
                username: profile.username
            });

            const user = await findOrCreateTwitterUser(profile, token, tokenSecret);
            return done(null, user);
        } catch (error) {
            console.error('Twitter auth error:', error);
            return done(error, null);
        }
    }
));

// Initialize Passport
router.use(passport.initialize());

// Twitter auth routes
router.get('/twitter', 
  (req, res, next) => {
    // Ensure session is saved before redirecting
    req.session.save(() => {
      next();
    });
  },
  passport.authenticate('twitter')
);

router.get('/twitter/callback',
  (req, res, next) => {
    // Ensure session is loaded
    req.session.reload((err) => {
      if (err) {
        console.error('Session reload error:', err);
      }
      next();
    });
  },
  passport.authenticate('twitter', {
    failureRedirect: '/login',
    successRedirect: '/'
  })
);

// Error handling route
router.get('/error', (req, res) => {
    res.status(401).json({
        success: false,
        error: 'Twitter authentication failed. Please try again.'
    });
});

module.exports = router;