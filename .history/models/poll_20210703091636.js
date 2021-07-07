var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
    yes: String,
    no: String,
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Poll", pollSchema);