const express = require("express");
const blogCtrl = require("../controllers/post.controller");
const router = express.Router();

router.route("/create")
      .post(blogCtrl.CreatePost)

router.route("/blogpost")
      .get(blogCtrl.BlogPosts)

router.route('/posts')
      .get(blogCtrl.GetAllPosts)

router.route('/post/:id')
      .get(blogCtrl.GetAPostDetail)

router.route("/getposts/:id")
      .get(blogCtrl.getAUserPosts)

router.route('/postComments/:id')
      .get(blogCtrl.getAllCommentInAPost)

router.route('/postAComment/:id')
      .post(blogCtrl.CreateACommentInAPost)

router.route('/getAllComment/:id')
      .get(blogCtrl.getAllReplyOfAComment);

module.exports = router;