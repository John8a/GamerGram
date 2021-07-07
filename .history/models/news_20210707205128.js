var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: String,
    image: String,
    text: String,
    theme: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("News", newsSchema);