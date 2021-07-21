var mongoose                = require('mongoose');
var passportLocalMongoose	= require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    username: {
        type: String,
        required: true
    },
    image: String,
    name: String,
    password: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);