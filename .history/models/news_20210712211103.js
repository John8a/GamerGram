var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  header: String,
  image: String,
  theme: String,
  text: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("News", newsSchema);