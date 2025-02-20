const TwitterUser = require('../models/TwitterUser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

module.exports = {
  generateToken,
  verifyToken,
  findOrCreateTwitterUser
};
