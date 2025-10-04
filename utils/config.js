const {
  PORT = 3001,
  JWT_SECRET = "super-strong-secret",
  MONGODB_URI = "mongodb://127.0.0.1:27017/mydb",
} = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  MONGODB_URI,
};
