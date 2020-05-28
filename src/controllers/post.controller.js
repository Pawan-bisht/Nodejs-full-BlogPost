const Post = require("../models/post");
const User = require("../models/user");
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
        console.log(user);
        await user.populate({
            path: "posts"
        }).execPopulate();
        console.log(user.posts);
        res.send({
            posts: user.posts
        })
    } catch (e) {
        res.status(404).send(e);
    }
}



const GetAPostDetail = async (req, res) => {
    let id = req.params.id.trim();
    let isLoggedIn = req.session.isLoggedIn;
    console.log(id);
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
    GetAPostDetail
}