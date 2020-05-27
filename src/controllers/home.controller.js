const GetHomePage = (req, res) => {
    // console.log(req.get('Cookie'));
    let isLoggedIn = req.session.isLoggedIn;
    console.log("At home", req.session);
    res.render('Home', {
        path: '/home',
        isAuthenticate: isLoggedIn
    })
}

module.exports = {
    GetHomePage
}