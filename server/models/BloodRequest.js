const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Need", "Donate"], required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    location: { type: String, required: true },
    unitsNeeded: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["Open", "Fulfilled", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
