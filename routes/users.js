const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");

const { getCurrentUser, updateUser } = require("../controllers/users");

const { NOT_FOUND } = require("../utils/errors");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", updateUser);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
