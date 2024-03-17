const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    "email" : {
        type : String,
        required: true,
        trim: true
    },
    "password" : {
        type : String,
        required : true,
        trim : true,
    },
    "role" : {
        type : String,
        required : true,
        trim : true,
        enum : ["Admin", "User"]
    },
    "purchasedBooks" : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }],
    "borrowedBooks" : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    }]
},{
    timestamps : true,
})

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 5)
        next()
    }
})

userSchema.methods.isPasswordCorrect = async function(email,password){
    const user = UserModel.findOne({email});
    if(!user){
        return false;
    }
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id
    }, process.env.ACCESS_TOKEN_SECRET ,{ expiresIn : process.env.ACCESS_TOKEN_EXP})
}

const UserModel = mongoose.model("User", userSchema)

module.exports = {UserModel}
