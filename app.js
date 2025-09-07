const express = require("express");
const mongoose = require("mongoose");

const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/clothingItems");

const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: "68ba42a401993a8900f2ed18" };
  next();
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.get("/", (req, res) => {
  res.send("Hello from Express! and bonjour ciao");
});

app.use("/users", usersRouter);
app.use("/items", itemsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
