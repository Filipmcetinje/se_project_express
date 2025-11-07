const mongoose = require("mongoose");

const validator = require("validator");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password
) {
  console.log("🔍 Looking for user:", email);

  const user = await this.findOne({ email }).select("+password");
  if (!user) {
    console.log("❌ No user found for:", email);
    throw new Error("Incorrect email or password");
  }

  console.log("🧂 Comparing passwords...");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("❌ Password mismatch for:", email);
    throw new Error("Incorrect email or password");
  }
  console.log("✅ Password match for:", email);
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
