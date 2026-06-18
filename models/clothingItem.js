const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  objectID: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  artistDisplayName: {
    type: String,
    default: "Unknown artist",
  },
  objectDate: {
    type: String,
    default: "",
  },
  primaryImageSmall: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ClothingItem = mongoose.model("ClothingItem", clothingItemSchema);

module.exports = ClothingItem;
