var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title: {
    type: String,
    default: "Abonennten",
  },
  subtitle: {
    type: String,
    default: "Jeder, der Early-Access haben möchte",
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