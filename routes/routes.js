const express = require('express');
const helpers = require('../middleware/helpers');

const UserAPI = require('../controllers/users');
const PostAPI = require('../controllers/posts');

const utils = require('../utils/utils');
const ph = utils.wrapPromiseHandler;

const router = express.Router();

// Users
router.post('/users/', ph(UserAPI.createUser));
router.post('/users/authenticate', ph(UserAPI.authenticateUser));
router.get('/users/', helpers.verifyToken, helpers.getUser, ph(UserAPI.getUser));

// Posts
router.get('/posts/:id', helpers.verifyToken, helpers.getUser, ph(PostAPI.getPost));
router.post('/posts', helpers.verifyToken, helpers.getUser, ph(PostAPI.createPost));

// Comments


module.exports = router;
