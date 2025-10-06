const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");

const { getCurrentUser, updateUser } = require("../controllers/users");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", updateUser);

router.use((req, res) => {
  res.status(404).json({ message: "Requested resource not found" });
});

module.exports = router;
