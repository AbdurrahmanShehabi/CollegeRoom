const Promise = require('bluebird');
const co = Promise.coroutine;
const jsonwebtoken = require('jsonwebtoken');
const CONFIG = require('../config.json');
const TOKEN_SECRET = CONFIG.token.secret;

const User = require('../models/user');

// Route middleware to verify a token
function verifyToken(req, res, next) {
  // Check header or url parameters or post parameters for token
  const token = req.headers['x-access-token'];

  // Decode token
  if (token) {
    // Verifies secret and checks exp
    jsonwebtoken.verify(token, TOKEN_SECRET, function (error, decoded) {
      if (error) {
        res.status(403).json({
          success: false,
          message: 'Failed to authenticate token.'
        });
        return;
      }

      // If everything is good, save to request for use in other routes
      req.decoded = decoded;
      req.username = decoded.username;

      next();
    });
  } else {
    // If there is no token return an error
    res.status(403).json({
      success: false,
      message: 'No token provided.'
    });
  }
}

const getUser = co(function *getUser(req, res, next) {
  req.user = yield User.findOne({ username: req.username } ).lean();
  delete req.user.password;
  next()
});


module.exports = { verifyToken, getUser };
