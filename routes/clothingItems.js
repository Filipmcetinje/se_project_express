const express = require("express");
const router = express.Router();
const { likeItem, dislikeItem } = require("../controllers/clothingItems");

const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.post("/", createItem);

router.delete("/:itemId", deleteItem);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });

  router.put("/:itemId/likes", likeItem);
  router.delete("/:itemId/dislikes", dislikeItem);
});

module.exports = router;
