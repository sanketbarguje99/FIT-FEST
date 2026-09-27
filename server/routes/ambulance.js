const express = require("express");
const router = express.Router();
const AmbulanceRequest = require("../models/AmbulanceRequest");

// GET all ambulance requests
router.get("/", async (req, res) => {
  try {
    const requests = await AmbulanceRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE ambulance request
router.post("/", async (req, res) => {
  try {
    const request = new AmbulanceRequest(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// UPDATE status
router.put("/:id", async (req, res) => {
  try {
    const request = await AmbulanceRequest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!request) return res.status(404).json({ error: "Request not found" });
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
