const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECTION_URL)
const plg = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true,
      unique: true
  },
  fullname: {
      type: String,
  },
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
  }
  ],
  profileImage: {
      type: String ,
      default: " " // You can store the image URL or use another approach based on your requirements
  }
});

userSchema.plugin(plg);

const User = mongoose.model('User', userSchema);

module.exports = User;