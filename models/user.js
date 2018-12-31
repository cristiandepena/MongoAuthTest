var mongoose = require("mongoose");
var passoportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username : String,
    password: String
});

userSchema.plugin(passoportLocalMongoose);

module.exports = mongoose.model("User", userSchema);