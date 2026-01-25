const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validateToken = require("../middleware/validateTokenHandler");

const registerUser = expressAsyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const availableUser = await User.findOne({ email });
  if (availableUser) {
    res.status(400);
    throw new Error("User already exists");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    userName,
    email,
    password: hashPassword,
  });
  await newUser.save();

  // return safe public fields only
  res.status(201).json({ id: newUser._id, userName: newUser.userName, email: newUser.email });
});

const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  // compare password with hashed password
  if (user && (await bcrypt.compare(password, user.password))) {
    const secret = process.env.ACCESS_TOKEN_SECRET || "dev_secret"
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.warn("WARNING: ACCESS_TOKEN_SECRET is not set. Using development fallback secret.");
    }

    const accessToken = jwt.sign(
      {
        user: {
          username: user.userName,
          email: user.email,
          id: user.id,
        },
      },
      secret,
      { expiresIn: "15m" }
    );
    console.log("Generated Access Token: ", accessToken);
    // Set cookie with reasonable dev options. In production set `secure: true` and proper domain.
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

const getCurrentUser = expressAsyncHandler(async (req, res) => {
  console.log("Inside getCurrentUser controller");
  console.log("Req User: ", req.user);
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.status(200).json({
    message: "Current User Information",
    user: { id: req.user._id, userName: req.user.userName, email: req.user.email },
  });
});

module.exports = { registerUser, loginUser, getCurrentUser };
