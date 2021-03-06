const express = require('express');
const userCtrl = require("../controllers/user.controller");
const authRoute = require("../controllers/auth.controller");
const router = express.Router();

// router.get('/', (req, res, next)=>{
//     res.send("User Router");
// })

router.route('/login')
      .get(userCtrl.GetLogin)
      .post(userCtrl.validLoginArray, userCtrl.UserLoginValidation, userCtrl.LoginUser)

router.route('/signup')
      .post(userCtrl.validSignupArray, userCtrl.UserValidation, userCtrl.SigupUser)
      .get(userCtrl.SignUpPage)

router.route('/logout')
      .get(userCtrl.PostLogout)

router.route("/delete")
      .post(userCtrl.DeleteUser)
      .get(userCtrl.GetDelete)
module.exports = router;