const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server" });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    if (!name || !weather || !imageUrl || !owner) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "name, weather, imageUrl and owner are required" });
    }

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid data provided" });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item id" });
    }

    const deleted = await ClothingItem.findByIdAndDelete(itemId).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.json({ message: "Item deleted", data: deleted });
  } catch (err) {
    console.error(err);

    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }

    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server" });
  }
};

const likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.json(item);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server" });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.json(item);
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res
      .status(SERVER_ERROR)
      .json({ message: "An error has occurred on the server" });
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
