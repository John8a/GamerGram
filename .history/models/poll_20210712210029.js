var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollSchema = new Schema({
  title: {
    type: String,
    default: "Polls",
  },
  subtitle: {
    type: String,
    default: "Wir haben die Abstimmungen gezählt
",
  },
  poll: String,
  message: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Poll", pollSchema);