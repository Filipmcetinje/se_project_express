const express = require("express");

const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  login,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
