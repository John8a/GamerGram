var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
    ja: String,
    nein: String,
    message: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Abonnements", aboSchema);