const Promise = require('bluebird');
const co = Promise.coroutine;

const Post = require('../models/post');

const ApiError = require('../utils/utils').ApiError;

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

  return post.toJSON();
});

const getPost = co(function *getPost(req, res) {
  let post = yield Post.findOne({ _id: req.params.id });
  if (!post) {
    throw new ApiError(404, 'No post found');
  }

  // Fetch all comments for post
  const comments = yield post.getComments(true);
  comments.forEach((comment) => {
    if (req.user.id === comment.user) {
      comment.userRandomName += ' (You)';
    }
    // This line below is the anonymizer, removing this line will return user ids for all comments
    delete comment.user;
  });


  // Convert post to JSON
  post = post.toJSON();
  post.comments = comments;

  return post;
});

const getPosts = co(function *getPosts(req, res) {
  const query = {};
  if (req.body.search) {
    query.title = { $regex: req.body.search };
  }

  if (req.body.category) {
    query.category = req.body.category;
  }

  let posts = yield Post.find(query).sort({ createdAt: -1 });
  posts = posts.map((post) => { return post.toSummaryJSON() });
  
  return posts;
});

module.exports = { getPost, getPosts, createPost };
