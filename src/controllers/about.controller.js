const GetAboutPage = (req, res)=>{
    res.render('About',{
        path : '/about'
    })
}

module.exports ={
    GetAboutPage
}