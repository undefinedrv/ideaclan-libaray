const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const { compare } = require("bcrypt");

const authentication = async (req, res) => { 
    const token = req.headers?.authorization?.split(" ")[1] || " ";
    try {
        if (!token) { 
            throw new Error("No token found")
        }

        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await UserModel.findById(decoded._id).select("-password");
        
        return user;
    } catch (error) {
        throw new Error("Error in authentication middleware:", error)
    }
}

module.exports = {authentication}; 
