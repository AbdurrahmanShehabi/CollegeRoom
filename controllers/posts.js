const Promise = require('bluebird');
const co = Promise.coroutine;

const Post = require('../models/post');
const ApiError = require('../utils/utils').ApiError;

const createPost = co(function *createPost(req, res) {
  const post = new Post({
    user: req.user._id,
    title: req.body.title,
    content: req.body.content,
  });

  yield post.save();

  res.json({
    success: true,
    post: post
  });
});

const getPost = co(function *createPost(req, res) {
  const post = yield Post.findOne({ id: req.params.id }).lean();

  if (!post) {
    throw new ApiError(400, 'No post found');
  }

  res.json({
    success: true,
    post: post
  });
});

module.exports = { getPost, createPost };
