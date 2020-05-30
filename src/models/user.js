const mongooose = require("mongoose");
const jwt = require("jsonwebtoken");
const Post = require("./post");
const bcrypt = require("bcrypt");
const configuration = require("../config/Auth.config");
const userSchema = new mongooose.Schema({

    username: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Username must be required"]
    },
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: [true, "Email Address already in Use"],
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    buffer: {
        type: Buffer
    }

}, {
    timestamps: true
});

userSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'userId'
})

userSchema.methods.getAuthToken = async function () {
    let user = this;
    let token = jwt.sign({
        id: user._id,
        username: user.username
    }, configuration.secretKey, {
        expiresIn: '1d'
    });
    user.tokens = user.tokens.concat({
        token
    });
    try {
        await user.save();
    } catch (e) {
        throw Error("Cant get auth token");
    }
    return token;
}

userSchema.pre('save', async function (next) {
    let user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

// userSchema.statics.findByCredentials = async(email, password){

// }
userSchema.statics.findByCredentials = async (username, password) => {
    const user = await userModel.findOne({
        username
    });
    if (!user) {
        throw Error("Unable to login");
    }
    let isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch)
        throw new Error("INVALID USERNAME OR PASSWORD");

    return user;
}
userSchema.pre('remove', async function (next) {
    let user = this;
    await Post.deleteMany({
        userId: user._id
    });
    next();
})
const userModel = new mongooose.model('User', userSchema);

module.exports = userModel;