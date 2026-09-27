const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");

// GET all / search by bloodGroup & location
router.get("/", async (req, res) => {
  try {
    const { bloodGroup, location, type } = req.query;
    let filter = {};
    if (bloodGroup) filter.bloodGroup = bloodGroup;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.type = type;
    const results = await BloodRequest.find(filter).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE (report need or donation availability)
router.post("/", async (req, res) => {
  try {
    const entry = new BloodRequest(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE status
router.put("/:id", async (req, res) => {
  try {
    const entry = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!entry) return res.status(404).json({ error: "Entry not found" });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
