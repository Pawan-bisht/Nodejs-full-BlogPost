const express = require("express");
const aboutCtrl = require("../controllers/about.controller")
const router = express.Router();


router.route('/about')
      .get(aboutCtrl.GetAboutPage)

  module.exports = router;    