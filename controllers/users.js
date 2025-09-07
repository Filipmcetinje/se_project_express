const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

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
  const { name, avatar } = req.body;
  try {
    const newUser = await User.create({ name, avatar });
    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid data provided" });
    }

    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
