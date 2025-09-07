const express = require("express");
const router = express.Router();

const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
