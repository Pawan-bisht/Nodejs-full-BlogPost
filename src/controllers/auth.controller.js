const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authConfig = require("../config/Auth.config");
module.exports = async function(req, res, next)
{
    try{
        const token = req.header("Authorization").replace("Bearer ",'');
        const decodedToken = jwt.verify(token, authConfig.secretKey);
        let user = await User.findOne({ username : decodedToken.username, 'tokens.token':token});
        if(!user)
        {
           return res.status(400).send({ msg: "INVALID AUTH TOKEN" });
        }
        req.profile = user;
        req.token = token;
        // console.log(" We are inside of auth", user, token);
        next();
    }
    catch(e)
    {
        res.status(404).send(e);
    }
}