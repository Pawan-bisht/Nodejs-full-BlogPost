const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require('express-session');
const mongodbStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const userRoute = require("./routes/user.route");
const aboutRoute = require("./routes/about.route");
const homeRoute = require("./routes/home.route");
const blogPostRoute = require("./routes/post.route");
const User = require("./models/user");
const app = express();
const MongoDbURI = "mongodb://127.0.0.1:27017/blogging";

const store = new mongodbStore({
    uri: MongoDbURI,
    collection: 'sessions' //also can add expire to mongodb expire the session
})
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

mongoose.connect(MongoDbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
})

app.get('/', (req, res) => {
    res.redirect("/home")
})

app.use(express.static(__dirname + "/public"));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    store: store,
    unset: 'destroy'
}))
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            console.log(user);
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


app.use(aboutRoute);
app.use(homeRoute);
app.use(blogPostRoute);
app.use(userRoute);

app.use("*", (req, res) => {

    res.status(404).render("pageNotFound", {
        msg: "Page was not there",
        path: "*",
        isAuthenticate: req.session.isLoggedIn
    });
})

app.listen(4500, () => {
    console.log("Server running at 4500");
})