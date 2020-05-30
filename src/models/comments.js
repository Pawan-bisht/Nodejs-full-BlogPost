const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    description: {
        type: String
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    parentcommentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }
}, {
    timestamps: true
});

commentSchema.virtual('reply', {
    ref: "Comment",
    localField: '_id',
    foreignField: 'parentcommentid'
})

const commentModel = new mongoose.model('Comment', commentSchema);

module.exports = commentModel;