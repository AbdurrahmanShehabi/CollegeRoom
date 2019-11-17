const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const co = Promise.coroutine;

const Post = require('./post');

const Schema = mongoose.Schema;

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  emailVerification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationHash: {
      type: String,
    },
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  updatedAt: {
    type: Date
  }
});

schema.methods = {
  toJSON: function () {
    return {
      id: this._id.toString(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
  getPosts: co(function *() {
    return Post.find({ _id: { $in: this.posts } }).sort({ createdAt: 1 });
  }),
};


// on every save, add the date
schema.pre('save', function (next) {
  // get the current date
  const currentDate = new Date();
  
  // change the updated_at field to current date
  this.updatedAt = currentDate;

  // if created_at doesn't exist, add to that field
  if (! this.createdAt) {
    this.createdAt = currentDate;
  }

  next();
});

module.exports = mongoose.model('User', schema, 'users');
