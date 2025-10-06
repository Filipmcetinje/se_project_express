const mongoose = require("mongoose");

const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find({});
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

const createItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    if (!name || !weather || !imageUrl) {
      return res.status(BAD_REQUEST).json({
        message: "name, weather, and imageUrl are required",
      });
    }

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid data provided" });
    }
    console.error(err);
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findById(itemId).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    if (item.owner.toString() !== req.user._id) {
      return res
        .status(FORBIDDEN)
        .json({ message: "You cannot delete this item" });
    }

    await item.deleteOne();
    return res.json({ message: "Item deleted", data: item });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

const likeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

const dislikeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      const error = new Error("Item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });

    return res.json(item);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err);
    return res.status(SERVER_ERROR).json({ message: "Server error" });
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
