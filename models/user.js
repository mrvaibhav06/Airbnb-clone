const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // ✅ Fixed typo

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  // username: { type: String, required: true, unique: true }, // ✅ Required!
});

// Adds username, hash & salt fields to userSchema and necessary authentication methods
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
