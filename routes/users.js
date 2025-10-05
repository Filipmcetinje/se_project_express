const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");

const {
  getUsers,
  getUser,
  getCurrentUser,
  createUser,
  login,
  updateUser,
} = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateUser);

router.get("/", auth, getUsers);
router.get("/:id", auth, getUser);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
