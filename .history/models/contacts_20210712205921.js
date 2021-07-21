var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  title: {
    type: String,
    default: "Kontaktanfragen",
  },
  subtitle: {
    type: String,
    default: "Alle Kontaktanfragen auf einem Blick!",
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