const Promise = require('bluebird');
const co = Promise.coroutine;

const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');
const UserPostMapping = require('../models/userPostMapping');

const ApiError = require('../utils/utils').ApiError;
const selectRandomName = require('../utils/utils').selectRandomName;

const createComment = co(function *createComment(req, res) {
  // Params
  const post = yield Post.findOne({ _id: req.body.postId });
  if (!post) {
    throw new ApiError(404, "No post found");
  }
  
  // Check if mapping exists
  let userPostMap = yield UserPostMapping.findOne({ post: req.body.postId, user: req.user._id });

  let userRandomName;
  if (!userPostMap) {
    // Select new random name
    if (req.user._id.equals(post.user)) {
      userRandomName = 'OP';
    } else {
      userRandomName = selectRandomName(post.randomNamesUsed);
    }

    // Add user to post and random name mapping
    userPostMap = new UserPostMapping({
      user: req.user._id,
      post: req.body.postId,
      userRandomName: userRandomName
    });
    yield userPostMap.save();

    // Add random name to post
    post.randomNamesUsed.push(userRandomName);  
  } else {
    userRandomName = userPostMap.userRandomName;
  }
  
  // Save comment
  const comment = new Comment({
    user: req.user._id,
    post: req.body.postId,
    content: req.body.content,
    userRandomName: userRandomName
  });
  yield comment.save();

  // Save random name and comment id on post
  post.comments.push(comment._id);
  yield post.save();

  // Save comment id on user
  req.user.comments.push(comment._id);
  yield req.user.save();
  
  // Return comment
  return comment;
});

module.exports = { createComment };
