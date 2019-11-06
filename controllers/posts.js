const Promise = require('bluebird');
const co = Promise.coroutine;

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const UserPostMapping = require('../models/userPostMapping');

const ApiError = require('../utils/utils').ApiError;
const selectRandomName = require('../utils/utils').selectRandomName;

const createPost = co(function *createPost(req, res) {

  const post = new Post({
    user: req.user._id,
    category: req.body.category,
    title: req.body.title,
    content: req.body.content,
  });

  yield post.save();

  req.user.posts.push(post._id);
  req.user.save();

  return post;
});

const getPost = co(function *getPost(req, res) {
  const post = yield Post.findOne({ _id: req.params.id }).lean();
  if (!post) {
    throw new ApiError(400, 'No post found');
  }

  // Fetch all comments for post
  const comments = yield Comment.find({ _id: { $in: post.comments } }).lean();
  const userPostMap = yield UserPostMapping.findOne({ user: req.user._id, post: req.params.id });
  if (userPostMap) {
    comments.forEach((comment) => {
      if (req.user._id.equals(comment.user)) {
        comment.userRandomName = 'You';
      }
    });
  }
  comments.forEach((comment) => { delete comment.user });
  post.comments = comments;

  return post;
});

const getPosts = co(function *getPosts(req, res) {
  const query = {};
  if (req.body.category) {
    query.category = req.body.category;
  }

  const posts = yield Post.find(query, { _id: 1, title: 1, createdAt: 1 }).sort({ createdAt: 1 }).lean();
  
  return posts;
});

module.exports = { getPost, getPosts, createPost };
