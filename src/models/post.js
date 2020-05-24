const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title :{
        type : String,
        trim : true,
        unique : [true, "The required title is already there"],
        required : true
    },
    description : {
        type : String,
        trim : true,
        required : true
    },
    userId : {
        type :  mongoose.Schema.Types.ObjectId,
        ref :   'User',
        required : true
    }
}, 
    {
    timestamps : true
    });

const postModel = new mongoose.model('Post',postSchema);
module.exports = postModel;
