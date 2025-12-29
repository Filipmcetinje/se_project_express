const express = require("express");

const router = express.Router();

const auth = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch("/me", validateUserUpdate, updateUser);

module.exports = router;
