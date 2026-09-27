const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Hospital", "Clinic", "Blood Bank"], required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    hasAmbulance: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
