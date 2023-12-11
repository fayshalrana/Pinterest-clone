const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postImage: {
        type: String  // Assuming a string for the image URL
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
