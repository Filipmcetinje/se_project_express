const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    console.error(err);
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.json(user);
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid user ID" });
    }

    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server" });
  }
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userSafe = newUser.toObject();
    delete userSafe.password;

    return res.status(201).json(userSafe);
  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid data provided" });
    }

    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server" });
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

    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Incorrect email or password" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
};
