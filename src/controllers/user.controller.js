const { UserModel } = require("../models/user.model");


const generateToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    const accessToken = user.generateAccessToken();

    return accessToken;
  } catch (error) {
    throw new Error("Unable to create Accesstoken right now");
  }
};

const RegisterUser = async (userData) => {
  const { email, password, role } = userData;

  try {
    if (!email || !password || !role) {
      throw new Error("All fields are required, Please add all reqired infromastion");
    }
    const user = await UserModel.findOne({ "email": email });
    if (user) {
      throw new Error("User Already Exist with this email id");
    }

    const newUser = await UserModel.create({ email, password, role });
    if(!newUser){
        throw Error("Unable to create user at that moment");
    }

    const userwithOutpass = await UserModel.findById(newUser._id).select("-password");

    return userwithOutpass;
  } catch (error) {
    throw error;
  }
};

const LoginUser = async (LoginData, context) => {
    const { email, password } = LoginData;
   
    try {
      if (!email || !password) {
        throw new Error(
          "All fields are required, Please add all required information"
        );
      }
  
      const existedUser = await UserModel.findOne({ email: email });
      if (!existedUser) {
        throw new Error("No account found with this email");
      }
  
      const isPasswordCorrect = await existedUser.isPasswordCorrect(email,password);
      if (!isPasswordCorrect) {
        throw new Error("Incorrect Password");
      }
   
      const accessToken = await generateToken(existedUser._id);
      const loggedInUser = await UserModel.findById(existedUser._id).select(
        "-password"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };
      loggedInUser.accessToken = accessToken;

      context.res.cookie("accessToken", accessToken, options);
      return loggedInUser;
    } catch (error) {
      throw error;
    }
};
  
const updateUser = async (data, context)=>{
    const {email, password} = data;
    try {
        if(!context.user?._id){
            throw new Error("Token not found login first");
        }

        const user = await UserModel.findById(context.user._id);
        if (!user) {
            throw new Error("User not found");
        }

        if (email){
            user.email = email;
        }
        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save({ validateBeforeSave: false });
        if(!updatedUser){
            throw new Error("user not found or unable to update the user right now");
        }
        return updatedUser;
    } catch (error) {
        throw error
    }
}

const DeleteUser = async (context) => {
  try {
    if(!context.user?._id){
        throw new Error("Token not found login first");
    }

    const deletedUser = await UserModel.findByIdAndDelete(context.user?._id);
    if (!deletedUser) {
      throw new Error("User not found");
    }

    return deletedUser
  } catch (error) {
    throw error;
  }
};

const getUserProfile = async (id) => {
  if (!id) {
    throw new Error("id not found");
  }
  try {
    const user = await UserModel.findById(id).populate("purchasedBooks").populate("borrowedBooks");
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

const getAllUser = async () => {
  try {
    const users = await UserModel.find().populate("purchasedBooks").populate("borrowedBooks");
    if (!users) {
      throw new Error("Unable to access users right now");
    }

    return users;
  } catch (error) {
    throw error;
  }
};


module.exports = {RegisterUser, LoginUser, DeleteUser, updateUser, getUserProfile, getAllUser}