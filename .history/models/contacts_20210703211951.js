var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: String,
    email: String,
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Poll", pollSchema);