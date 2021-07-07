var mongoose = require('mongoose');
var passportLocalMongoose	= require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    username: String,
    password: String

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);