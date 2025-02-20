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
router.get('/twitter', (req, res, next) => {
    console.log('Twitter auth config:', {
        callbackURL: process.env.TWITTER_CALLBACK_URL,
        hasConsumerKey: !!process.env.TWITTER_CONSUMER_KEY,
        hasConsumerSecret: !!process.env.TWITTER_CONSUMER_SECRET
    });

    passport.authenticate('twitter')(req, res, next);
});

router.get('/twitter/callback',
    passport.authenticate('twitter', {
        failureRedirect: '/auth/error'
    }),
    (req, res) => {
        try {
            const token = generateToken(req.user);
            res.json({
                success: true,
                token: token,
                user: {
                    id: req.user.id,
                    username: req.user.username
                }
            });
        } catch (error) {
            console.error('Token generation error:', error);
            res.status(500).json({
                success: false,
                error: 'Authentication failed: ' + error.message
            });
        }
    }
);

// Error handling route
router.get('/error', (req, res) => {
    res.status(401).json({
        success: false,
        error: 'Twitter authentication failed. Please try again.'
    });
});

module.exports = router;