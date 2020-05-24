const GetHomePage = (req, res)=>{
    console.log("Home")
    res.render('Home',{
        path : '/home'
    })
}

module.exports = {
    GetHomePage
}