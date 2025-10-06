const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const usersRouter = require("./routes/users");

const itemsRouter = require("./routes/clothingItems");

const { createUser, login } = require("./controllers/users");

const auth = require("./middlewares/auth");

const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001, MONGO_URI = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.post("/signup", createUser);
app.post("/signin", login);

app.use("/users", auth, usersRouter);
app.use("/items", auth, itemsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({ message });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {});
  })
  .catch(() => {});
