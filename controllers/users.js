const Promise = require('bluebird');
const co = Promise.coroutine;
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const CONFIG = require('../config.json');
const TOKEN_SECRET = CONFIG.token.secret;
const TOKEN_EXPIRES = parseInt(CONFIG.token.expiresInSeconds, 10);

const User = require('../models/user');

const ApiError = require('../utils/utils').ApiError;

const createUser = co(function *createUser(req, res) {
  // find the user
  let user = yield User.findOne({ username: req.body.username });
  if (user) {
    throw new ApiError(409, 'User with the username \'' + req.body.username + '\' already exists.');
  }

  const salt = yield bcrypt.genSalt(10);
  const hash = yield bcrypt.hash(req.body.password, salt);

  user = new User({
    username: req.body.username,
    password: hash,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  yield user.save();

  return user;
});

const getUser = co(function *createUser(req, res) {
  const user = yield User.findOne({ username: req.user.username });
  delete user.password;
  return user;
});


const authenticateUser = co(function *authenticateUser(req, res) {
  // Find the user
  const user = yield User.findOne({ username: req.body.username });
  if (!user) {
    throw new ApiError(401, 'Authentication failed');
  }

  const result = yield bcrypt.compare(req.body.password, user.password);
  if (!result) {
    throw new ApiError(401, 'Authentication failed');
  }

  // If user is found and password is right then we create a token
  return {
    token: jsonwebtoken.sign({ username: user.username }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES })
  };
});

module.exports = { createUser, authenticateUser, getUser };
