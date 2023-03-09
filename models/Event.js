const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true },
    nbre_participants: Number,
    description: String,
    date_event: Date,
  },
  { timestamps: true }
);
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
