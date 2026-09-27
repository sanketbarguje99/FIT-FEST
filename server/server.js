const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const patientRoutes = require("./routes/patients");
const appointmentRoutes = require("./routes/appointments");
const ambulanceRoutes = require("./routes/ambulance");
const bloodRoutes = require("./routes/blood");
const hospitalRoutes = require("./routes/hospitals");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/blood", bloodRoutes);
app.use("/api/hospitals", hospitalRoutes);

app.get("/", (req, res) => {
  res.send("Clinic Management API is running");
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/clinicDB";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
