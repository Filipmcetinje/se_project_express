const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

const { JWT_SECRET = "dev-secret" } = require("../utils/config");

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    return res.status(200).json({
      name: user.name,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    return res
      .status(SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Email and password are required" });
    }
    if (password.length < 8) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(201).json(userSafe);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(CONFLICT).json({ message: "Email already in use" });
    }
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid data provided" });
    }
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ token });
  } catch (err) {
    if (err.message === "Incorrect email or password") {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Incorrect email or password" });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(NOT_FOUND).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid data provided" });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error occurred on the server" });
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
