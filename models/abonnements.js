var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboSchema = new Schema({
    email: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Abonnements", aboSchema);