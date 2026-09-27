const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// GET all appointments (optionally filter upcoming)
router.get("/", async (req, res) => {
  try {
    const { upcoming } = req.query;
    let filter = {};
    if (upcoming === "true") {
      filter.date = { $gte: new Date() };
    }
    const appointments = await Appointment.find(filter)
      .populate("patient", "name age phone bloodGroup")
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE appointment
router.post("/", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    const populated = await appointment.populate("patient", "name age phone bloodGroup");
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE appointment status / details
router.put("/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("patient", "name age phone bloodGroup");
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE appointment
router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
