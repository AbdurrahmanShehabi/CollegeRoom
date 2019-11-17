const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const co = Promise.coroutine;


const Schema = mongoose.Schema;

const Comment = require('./comment');

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  randomNamesUsed: [{
    type: String
  }],
  createdAt: {
    type: Date
  },
});

schema.methods = {
  toJSON: function (includeUser = false) {
    const result = {
      id: this._id.toString(),
      category: this.category,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
    };
    if (includeUser) {
      result.user = this.user.toString();
    }
    return result;
  },
  toSummaryJSON: function () {
    return {
      id: this._id.toString(),
      title: this.title,
      content: this.content,
      category: this.category,
      createdAt: this.createdAt,
    }
  },
  getComments: co(function *(asJSON = false) {
    const comments = yield Comment.find({ _id: { $in: this.comments } });
    if (asJSON) {
      return comments.map((comment) => { return comment.toJSON(true); });
    }
    return comments;
  }),
};

// on every save, add the date
schema.pre('save', function (next) {
  // get the current date
  const currentDate = new Date();

  // if created_at doesn't exist, add to that field
  if (!this.createdAt) {
    this.createdAt = currentDate;
  }

  next();
});

module.exports = mongoose.model('Post', schema, 'posts');
