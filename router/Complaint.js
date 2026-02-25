import express from "express";
import Complaint from "../models/Complaint.js";

const router = express.Router();

// =======================
// Create new complaint
// =======================
router.post("/", async (req, res) => {
  try {
    const { userId, text } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ message: "UserId and text are required" });
    }

    const newComplaint = new Complaint({
      userId,
      messages: [{ sender: "user", text }],
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    console.error("Complaint creation error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// =======================
// Admin replies to a complaint
// =======================
router.post("/:id/reply", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Reply text required" });

    complaint.messages.push({ sender: "admin", text });
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error("Admin reply error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// =======================
// Get all complaints for a user
// =======================
router.get("/user/:userId", async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.params.userId });
    res.json(complaints);
  } catch (err) {
    console.error("Fetch complaints error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// =======================
// Admin view all complaints
// =======================
router.get("/admin", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (err) {
    console.error("Fetch all complaints error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
