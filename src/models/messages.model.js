const mongoose = require("mongoose");

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
  user: { type: String, max: 50, required: true },
  message: { type: String, max: 280, required: true },
});

const messagesModel = mongoose.model(messagesCollection, messagesSchema);

module.exports = { messagesModel };
