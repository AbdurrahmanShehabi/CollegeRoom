const Promise = require('bluebird');
const co = Promise.coroutine;
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const CONFIG = require('../config.json');
const TOKEN_SECRET = CONFIG.token.secret;
const TOKEN_EXPIRES = parseInt(CONFIG.token.expiresInSeconds, 10);

const User = require('../models/user');

const ApiError = require('../utils/utils').ApiError;

// Email server
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
     user: CONFIG.mailtrap.username,
     pass: CONFIG.mailtrap.password
  }
});

const createUser = co(function *createUser(req, res) {
  const username = req.body.username;
  if (!/(\W|^)[\w.+-]*@sjsu\.edu(\W|$)/.test(username)) {
    throw new ApiError(400, 'Invalid email, must be an @sjsu.edu email');
  }

  // Find the user
  let user = yield User.findOne({ username: username });
  if (user) {
    throw new ApiError(409, 'User with the username \'' + username + '\' already exists.');
  }

  const salt = yield bcrypt.genSalt(10);
  const hash = yield bcrypt.hash(req.body.password, salt);
  const verificationHash = crypto.randomBytes(40).toString('hex');

  user = new User({
    username: username,
    password: hash,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailVerification: {
      verificationHash: verificationHash
    }
  });

  yield user.save();

  // Send verification email
  const message = {
    from: 'signup@collegeroom.com',
    to: username,
    subject: 'Verify Email',
    html: `<a href="localhost:8888/api/users/verify?username=${username}&verificationHash=${verificationHash}">Click to verify</a>`
  };
  yield transporter.sendMail(message);

  return user.toJSON();
});

const getUser = co(function *getUser(req, res) {
  const user = yield User.findOne({ username: req.user.username });
  const userPosts = yield user.getPosts();
  const result = user.toJSON();
  result.posts = userPosts.map((post) => { return post.toSummaryJSON(); });
  return result;
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

  if (user.emailVerification.isVerified === false) {
    throw new ApiError(401, 'Email must be verified in order to complete authentication');
  }

  // If user is found and password is right then we create a token
  return {
    token: jsonwebtoken.sign({ username: user.username }, TOKEN_SECRET, { expiresIn: TOKEN_EXPIRES })
  };
});

const verifyUser = co(function *verifyUser(req, res) {
  const user = yield User.findOne({ username: req.query.username, 'emailVerification.verificationHash': req.query.verificationHash });
  if (!user) {
    throw new ApiError(401, 'Unable to verify email');
  }

  user.emailVerification.isVerified = true;
  user.emailVerification.verificationHash = undefined; 
  yield user.save();

  return user.toJSON();
});

const resendVerificationEmail = co(function *(req, res) {
  const username = req.body.username;
  const user = yield User.findOne({ username: username });
  if (user.emailVerification.isVerified === true) {
    return {};
  }

  const verificationHash = crypto.randomBytes(40).toString('hex');
  user.emailVerification.verificationHash = verificationHash;
  yield user.save();

  // Send verification email
  const message = {
    from: 'signup@collegeroom.com',
    to: username,
    subject: 'Verify Email',
    html: `<a href="localhost:8888/api/users/verify?username=${username}&verificationHash=${verificationHash}">Click to verify</a>`
  };
  yield transporter.sendMail(message);

  return {};
});

module.exports = { createUser, authenticateUser, getUser, verifyUser, resendVerificationEmail };
