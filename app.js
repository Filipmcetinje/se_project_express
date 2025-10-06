const express = require("express");
const mongoose = require("mongoose");

const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/clothingItems");
const auth = require("./middlewares/auth");
const { NOT_FOUND } = require("./utils/errors");

const { PORT = 3001 } = process.env;
const app = express();

app.use(express.json());

app.post("/signup", usersRouter);
app.post("/signin", usersRouter);

app.use(auth);
app.use("/users", usersRouter);
app.use("/items", itemsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
