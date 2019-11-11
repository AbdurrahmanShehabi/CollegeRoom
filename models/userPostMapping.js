const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Schema = mongoose.Schema;

const schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  userRandomName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date
  },
});

schema.methods = {
  toJSON: function () {
    return {
      id: this._id.toString(),
      user: this.user.toString(),
      post: this.post.toString(),
      userRandomName: this.userRandomName,
      createdAt: this.createdAt,
    }
  }
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

module.exports = mongoose.model('UserPostMapping', schema, 'user_post_mapping');
