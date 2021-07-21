var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const aboSchema = new Schema({
  title: {
    type: String,
    default: "Abonennten",
  },
  subtitle: {
    type: String,
    default: "Jeder, der Early-Access haben möchte",
  },
  email: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Abonnements", aboSchema);