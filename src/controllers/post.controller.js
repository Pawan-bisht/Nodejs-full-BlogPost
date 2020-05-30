const Post = require("../models/post");
const User = require("../models/user");
const Comment = require('../models/comments');
const mongoose = require('mongoose');
const CreatePost = async (req, res) => {

    const post = new Post(req.body);
    try {
        let resPost = await post.save();
        res.status(201).send({
            resPost
        });
    } catch (e) {
        res.status(404).send(e);
    }
}

const GetAllPosts = async (req, res) => {
    let isLoggedIn = req.session.isLoggedIn;
    try {
        const posts = await Post.find({}).populate({
                path: 'userId'
            })
            .sort({
                createdAt: -1
            }).exec();
        //res.send({posts});  
        res.render('Posts', {
            posts,
            path: '/posts',
            isAuthenticate: isLoggedIn
        });
    } catch (e) {
        res.status(404).send(e);
    }
}

const BlogPosts = async (req, res) => {
    let isLoggedIn = req.session.isLoggedIn;
    let user = req.user;
    if (!user)
        res.redirect("/login");
    const posts = await Post.find({
        userId: user._id
    }).populate({
        path: 'userId'
    }).sort({
        createdAt: -1
    }).exec();

    res.render('BlogPost', {
        path: '/blogpost',
        isAuthenticate: isLoggedIn,
        user,
        posts
    })
}

const getAUserPosts = async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        await user.populate({
            path: "posts"
        }).execPopulate();
        res.send({
            posts: user.posts
        })
    } catch (e) {
        res.status(404).send(e);
    }
}

const getAllCommentInAPost = async (req, res) => {
    try {
        let postId = req.params.id;
        console.log(1 + "  " + postId);
        let post = await Post.findById(postId);
        console.log(post)
        await post.populate({
            path: 'comments'
        }).execPopulate();

        res.send({
            comments: post.comments
        })
    } catch (e) {
        res.status(404).send(e);
    }
}

const getAllReplyOfAComment = async (req, res) => {
    try {
        let parentId = req.params.id; //To get a parent comment ID
        let comment = await Comment.findById(parentId);
        console.log("comment", comment)
        await comment.populate({
            path: 'reply'
        }).execPopulate();
        res.send({
            reply: comment.reply
        })
    } catch (e) {
        res.status(404).send(e)
    }
}

const CreateACommentInAPost = async (req, res) => {
    try {
        let postId = req.params.id;
        let comment = new Comment(req.body);
        console.log(req.body);
        // comment.post = postId;
        comment.user = mongoose.Types.ObjectId('5ec7d4c138a2c04068d5b9e5');
        let result = await comment.save();
        console.log(result);
        res.send(result);
    } catch (e) {
        console.log(e);
        res.status(404).send(e)
    }
}
const GetAPostDetail = async (req, res) => {
    let id = req.params.id.trim();
    let isLoggedIn = req.session.isLoggedIn;
    try {
        let postDetail = await Post.findOne({
            _id: id
        }).populate({
            path: 'userId'
        });

        res.render('PostDetail', {
            postDetail,
            path: null,
            isAuthenticate: isLoggedIn
        })
    } catch (e) {
        res.status(404).send(e);
    }
}

module.exports = {
    BlogPosts,
    CreatePost,
    getAUserPosts,
    GetAllPosts,
    GetAPostDetail,
    getAllCommentInAPost,
    CreateACommentInAPost,
    getAllReplyOfAComment
}