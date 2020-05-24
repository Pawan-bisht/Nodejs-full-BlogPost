const express = require('express');
const router = express.Router();
const homeCtrl = require("../controllers/home.controller");

console.log("route home")
router.route('/home')
      .get(homeCtrl.GetHomePage)

 module.exports = router;     