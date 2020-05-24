const express = require('express');
const userCtrl = require("../controllers/user.controller");
const authRoute = require("../controllers/auth.controller");
const router = express.Router();

// router.get('/', (req, res, next)=>{
//     res.send("User Router");
// })

router.route('/login')
      .get(userCtrl.Login)

router.route('/signup')
      .post(userCtrl.validArray, userCtrl.UserValidation, userCtrl.SigupUser)
      .get(userCtrl.SignUpPage)

router.route('/logout')
      .get(authRoute, userCtrl.SignOut)      

module.exports = router;