const mongooose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const configuration = require("../config/Auth.config");
const userSchema = new mongooose.Schema({

    username :{
        type : String,
        unique : true,
        trim : true,
        required : [true, "Username must be required" ]
    },
    firstName :{
        type:String,
        trim : true,
        required : true
    },
    lastName : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        trim : true,
        unique : [true, "Email Address already in Use"],
        required : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        trim : true
    },
    tokens : [{
        token: 
        {
            type : String,
            required : true
        }
     }
    ],
    buffer : {
        type : Buffer
    }

}, 
{
    timestamps : true
});

    userSchema.virtual('posts',{
        ref : 'Post',
        localField : '_id',
        foreignField : 'userId'
    })

userSchema.methods.getAuthToken = async function()
{
    let user = this;
    let token = jwt.sign({ id : user._id, username: user.username }, configuration.secretKey, { expiresIn:'1d'});
    user.tokens = user.tokens.concat({ token });
    try
    {
        await user.save();
    }
    catch(e)
        {
            throw Error("Cant get auth token");
        }
    return token;
}

userSchema.pre('save', async function(next){
    let user = this;
   
    if(user.isModified("password"))
     {
        user.password = await bcrypt.hash(user.password, 8);
     }   
    next();    
})

// userSchema.statics.findByCredentials = async(email, password){

// }


const userModel = new mongooose.model('User',userSchema);

module.exports = userModel;