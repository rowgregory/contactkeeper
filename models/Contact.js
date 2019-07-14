const mongoose = require("mongoose");

const ContactSchema = mongoose.Schema({
  // need to create a relationship netween contacts
  // and the user because each user has their own set of contacts
  user: {
    // when we create an entry with mongoDB,
    // the document has an object ID, so we're
    // saying thats the type that this is
    type: mongoose.Schema.Types.ObjectId,
    // refer to a specific collection
    ref: "users"
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  type: {
    type: String,
    default: "personal"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("contact", ContactSchema);
