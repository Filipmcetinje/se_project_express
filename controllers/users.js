const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const BadRequestError = require("../errors/badRequestError.js");
const NotFoundError = require("../errors/notFoundError.js");
const ConflictError = require("../errors/conflictError.js");
const UnauthorizedError = require("../errors/unauthorizedError.js");

const { JWT_SECRET = "dev-secret" } = require("../utils/config");

const getCurrentUser = async (req, res, next) => {
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
      return next(new NotFoundError("User not found"));
    }

    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError("Email and password are required"));
    }
    if (password.length < 8) {
      return next(
        new BadRequestError("Password must be at least 8 characters long")
      );
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
      return next(new ConflictError("Email already in use"));
    }
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data provided"));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new BadRequestError("Email and password are required"));
    }

    console.log("🟢 LOGIN ATTEMPT:", email, password);
    const user = await User.findUserByCredentials(email, password);
    console.log("✅ LOGIN SUCCESS:", user.email);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({ token });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError("Incorrect email or password"));
    }
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    return res.status(200).json(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data provided"));
    }
    return next(err);
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
