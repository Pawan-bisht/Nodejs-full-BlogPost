const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    description : {
        type : String
    },
    post : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : 'Post',
        required : true
    },
    user : {
        type :  mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    parentcommentid :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }
},{
    timestamps : true
});

const commentModel = new mongoose.Model('Comment',commentSchema);

module.exports = commentModel;