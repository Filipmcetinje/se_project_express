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

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log("📩 Incoming request:", req.method, req.path);
  next();
});

app.post("/signup", createUser);
app.post("/signin", login);

app.use("/users", usersRouter);
app.use("/items", itemsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.use((err, req, res, _next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({ message });
});

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
