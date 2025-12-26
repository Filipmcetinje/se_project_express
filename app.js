require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const usersRouter = require("./routes/users");

const itemsRouter = require("./routes/clothingItems");

const { createUser, login } = require("./controllers/users");

const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001, MONGO_URI = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;

const app = express();

const errorHandler = require("./middlewares/error-handler");

const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");

app.use(cors());

app.use(express.json());

app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signup", createUser);
app.post("/signin", login);

app.use("/users", usersRouter);
app.use("/items", itemsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
