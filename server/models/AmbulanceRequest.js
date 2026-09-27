const mongoose = require("mongoose");

const ambulanceRequestSchema = new mongoose.Schema(
  {
    requesterName: { type: String, required: true },
    phone: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Dispatched", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AmbulanceRequest", ambulanceRequestSchema);
