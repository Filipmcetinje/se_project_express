const express = require("express");
const mongoose = require("mongoose");

const { NOT_FOUND } = require("./utils/errors");
const { JWT_SECRET } = require("./utils/config");

const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/clothingItems");
const authRouter = require("./routes/auth");

const auth = require("./middlewares/auth");

const { PORT = 3001 } = process.env;

const app = express();

app.use(express.json());

app.use("/", authRouter);

app.use(auth);

app.use("/", usersRouter);
app.use("/items", itemsRouter);

app.get("/", (req, res) => {
  res.send("Hello from Express! and bonjour ciao");
});

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
