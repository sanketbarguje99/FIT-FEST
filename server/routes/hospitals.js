const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");

// GET all / filter by location or type
router.get("/", async (req, res) => {
  try {
    const { location, type } = req.query;
    let filter = {};
    if (location) filter.location = { $regex: location, $options: "i" };
    if (type) filter.type = type;
    const hospitals = await Hospital.find(filter).sort({ name: 1 });
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE (seed/admin add)
router.post("/", async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json(hospital);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
