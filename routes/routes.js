const express = require('express');
const helpers = require('../middleware/helpers');

const UserAPI = require('../controllers/users');
const PostAPI = require('../controllers/posts');
const CommentAPI = require('../controllers/comments');

const utils = require('../utils/utils');
const ph = utils.wrapPromiseHandler;

const router = express.Router();

// Users
router.post('/users/signup', ph(UserAPI.createUser));
router.post('/users/login', ph(UserAPI.authenticateUser));
router.get('/users/', helpers.verifyToken, helpers.getUser, ph(UserAPI.getUser));
router.get('/users/verify', ph(UserAPI.verifyUser));
router.post('/users/resendVerificationEmail', ph(UserAPI.resendVerificationEmail));

// Posts
router.get('/posts/:id', helpers.verifyToken, helpers.getUser, ph(PostAPI.getPost));
router.get('/posts', helpers.verifyToken, helpers.getUser, ph(PostAPI.getPosts));
router.post('/posts', helpers.verifyToken, helpers.getUser, ph(PostAPI.createPost));

// Comments
router.post('/comments', helpers.verifyToken, helpers.getUser, ph(CommentAPI.createComment));

module.exports = router;
