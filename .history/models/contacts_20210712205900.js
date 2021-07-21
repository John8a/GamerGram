var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  title: {
    type: String,
    default: "Abonennten",
  },
  subtitle: {
    type: String,
    default: "Jeder, der Early-Access haben möchte",
  },
  name: String,
  email: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", contactSchema);