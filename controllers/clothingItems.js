const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../errors/badRequestError");
const NotFoundError = require("../errors/notFoundError");
const ForbiddenError = require("../errors/forbiddenError");

const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    return res.json(items);
  } catch (err) {
    return next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;

    if (!name || !weather || !imageUrl || !owner) {
      return next(
        new BadRequestError("name, weather, imageUrl and owner are required")
      );
    }

    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).json(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data provided"));
    }

    return next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return next(new BadRequestError("Invalid item ID"));
    }

    const item = await ClothingItem.findById(itemId).orFail(() => {
      throw new NotFoundError("Item not found");
    });

    if (item.owner.toString() !== req.user._id) {
      return next(new ForbiddenError("Cannot delete another user's item"));
    }

    await item.deleteOne();
    return res.json({ message: "Item deleted", data: item });
  } catch (err) {
    return next(err);
  }
};

const likeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return next(new BadRequestError("Invalid item ID"));
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Item not found");
    });

    return res.json(item);
  } catch (err) {
    return next(err);
  }
};

const dislikeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return next(new BadRequestError("Invalid item ID"));
    }

    const item = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Item not found");
    });

    return res.json(item);
  } catch (err) {
    return next(err);
  }
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
