const {
    check,
    validationResult
} = require("express-validator");

const User = require("../models/user");


//------------Logout Controller-------------------------
const PostLogout = (req, res) => {
    console.log("Inside of logout", req.session.isLoggedIn);
    // if (req.session) {

    //     req.session.destroy((err) => {
    //         if (err) {
    //             console.log(err);
    //         } else {

    //             res.redirect("/signup")
    //         }

    //     })
    // }
    req.session = null;
    console.log(req.session);
    res.redirect("/signup")
}


//------------Login controller--------------------------
const GetLogin = (req, res) => {

    if (req.session.user)
        res.redirect("/home");

    let errorMessage = req.flash("validError");
    // console.log(req.get("Cookie"))
    // let isLoggedIn = req.get("Cookie").split(';')[0].trim().split('=')[1] === 'true';
    // let isLoggedIn = req.get("Cookie").includes("true") ? true : false;
    // console.log("Get login", message);
    let passwordMessage = null,
        usernameMessage = null;
    let isLoggedIn = req.session.isLoggedIn;
    // console.log("logged in", req.session);
    if (errorMessage.length === 0)
        errorMessage = null;
    else {
        errorMessage.forEach(object => {
            switch (object.param) {
                case 'password':
                    passwordMessage = object.msg;
                    break;
                case 'username':
                    usernameMessage = object.msg;
            }
        })
    }
    let message = req.flash("error");
    console.log(errorMessage);
    if (message.length === 0)
        message = null;
    // console.log(req.get("Cookie"));
    res.render("Auth/Login", {
        path: "/login",
        usernameMessage,
        message,
        passwordMessage,
        isAuthenticate: isLoggedIn
    });
}

const validLoginArray = [
    check('username', "Username is required").notEmpty(),
    check('password', "Password can't be empty").notEmpty()
]

const UserLoginValidation = (req, res, next) => {
    let error;
    error = validationResult(req);
    //console.log("error is",error.isEmpty()); 

    if (!error.isEmpty()) {

        req.flash("validError", error.array());
        return res.redirect("/login")
    }
    next();
}

const LoginUser = async (req, res) => {
    try {

        let user = await User.findByCredentials(req.body.username, req.body.password);
        console.log("The user is ", user);
        req.session.isLoggedIn = true;
        req.session.user = user;
        res.session.save((err) => {
            if (err)
                console.log(err);
            res.redirect('/home');
        })
    } catch (e) {
        req.flash("error", "INVALID USERNAME OR PASSWORD!");
        res.redirect('/login');
    }

}


// ----------------User Signup and validation -------------
const validSignupArray = [
    check('firstName', 'First Name is required').notEmpty(),

    check('lastName', 'Last Name is required').notEmpty(),

    check('username').isLength({
        min: 4
    }).withMessage("Username should be atleast 4 character long")
    .notEmpty().withMessage('User Name is required'),

    check('', 'User Name is required').notEmpty(),

    check('email', 'Email shoud not be empty').notEmpty().isEmail(),

    check('password').matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).+$/).withMessage("Password must contain alphanumeric characters")
    .isLength({
        min: 8
    }).withMessage("Password length should be atleast 8 character")
    .notEmpty().withMessage("Password should not empty")


];

const UserValidation = (req, res, next) => {
    let error;
    error = validationResult(req);
    //console.log("error is",error.isEmpty()); 

    if (!error.isEmpty()) {

        req.flash("error", error.array());
        return res.redirect("/signUp")
    }
    next();
}

const SigupUser = async (req, res) => {
    const user = new User(req.body);
    try {
        console.log(2);
        const findUser = await User.findOne({
            $or: [{
                    email: req.body.email
                },
                {
                    username: req.body.username
                }
            ]
        });
        console.log("user at", findUser)
        if (findUser) {
            console.log("user is ", findUser)
            if (findUser.username == req.body.username) {
                req.flash("errorExist", "Username is already occupied Please type another one");
                return res.redirect('/signup');
            } else if (findUser.email == req.body.email) {
                req.flash("errorExist", "Email address is already in use Please use different email address");
                return res.redirect('/signup');
            }
        }

        console.log(5);
        let token = await user.getAuthToken();

        // return res.status(201).send({ user, token });

        req.flash("message", "User is sucessfully registered");
        req.isLoggedIn = true;
        res.redirect('/login')
    } catch (e) {
        console.log("3");
        res.status(400).redirect('/signup');
    }
}


const SignUpPage = (req, res) => {
    let message = req.flash('error');
    let passwordMessage = null,
        emailmsg = null,
        usernameMsg = null,
        firstNameMsg = null,
        lastNameMsg = null;
    if (message.length === 0) {
        message = null;
    } else {
        message.forEach(object => {
            switch (object.param) {
                case 'password':
                    passwordMessage = object.msg;
                    break;
                case 'email':
                    emailmsg = object.msg;
                    break;
                case 'firstName':
                    firstNameMsg = object.msg;
                    break;
                case 'lastName':
                    lastNameMsg = object.msg;
                    break;
                case 'username':
                    usernameMsg = object.msg;
            }
        })
    }
    let existMsg = req.flash("errorExist");
    console.log(existMsg);
    let isLoggedIn = req.session.isLoggedIn;
    let emailExistedMsg = null,
        usernameExistedMsg = null;
    if (existMsg.length > 0)
        emailExistedMsg = existMsg[0].includes("Email") ? existMsg[0] : null;
    if (existMsg.length > 0)
        usernameExistedMsg = existMsg[0].includes("Username") ? existMsg[0] : null;
    res.render('Auth/SignUp', {
        path: "/signup",
        emailExistedMsg,
        usernameExistedMsg,
        usernameMsg,
        firstNameMsg,
        lastNameMsg,
        emailmsg,
        passwordMessage,
        isAuthenticate: isLoggedIn
    });
}



const SignOut = async (req, res) => {

    try {
        let user = req.profile;
        user.tokens = user.tokens.filter(token => token.token !== req.token);
        await user.save();
        res.send({
            msg: "Signed Out"
        })
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    SigupUser,
    GetLogin,
    SignUpPage,
    UserValidation,
    validSignupArray,
    LoginUser,
    PostLogout,
    validLoginArray,
    UserLoginValidation
}