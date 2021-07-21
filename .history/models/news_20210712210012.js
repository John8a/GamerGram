var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: {
    type: String,
    default: "News",
  },
  subtitle: {
    type: String,
    default: "Alle News auf einen Blick",
  },
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