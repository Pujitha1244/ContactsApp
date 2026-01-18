const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const validateToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    console.log("Cookies: ", cookies);
    if (!token) {
      throw new Error("Invalid Token, Please login again");
    }
    const decodeObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodeObj.user.id);
    const id = decodeObj.user.id;

    const user = await User.findById(id);
    if (!user) {
      throw new Error("User does not Exit");
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = validateToken;
