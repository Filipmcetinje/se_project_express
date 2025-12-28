const express = require("express");
const { celebrate, Joi } = require("celebrate");

const router = express.Router();

const auth = require("../middlewares/auth");

const { getCurrentUser, updateUser } = require("../controllers/users");

const NotFoundError = require("../errors/notFoundError");

router.use(auth);

router.get("/me", getCurrentUser);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      avatar: Joi.string().uri().required(),
    }),
  }),
  updateUser
);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
