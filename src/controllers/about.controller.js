const GetAboutPage = (req, res) => {
    let isLoggedIn = req.session.isLoggedIn;
    res.render('About', {
        path: '/about',
        isAuthenticate: isLoggedIn
    })
}

module.exports = {
    GetAboutPage
}