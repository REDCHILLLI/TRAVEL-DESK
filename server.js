import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import User from "./models/User.js";
//import Admin from "./models/Admin.js"; // optional if you have separate Admin model
import Complaint from "./models/Complaint.js";
import Tour from "./models/Tour.js";
import Blog from "./models/Blog.js";
import Booking from "./models/Booking.js";
import Contact from "./models/Contact.js";
import Review from "./models/Review.js";

dotenv.config();
const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/travelworld_local");

// Models mapping for dynamic CRUD
const models = { users: User, tours: Tour, blogs: Blog, bookings: Booking, contacts: Contact, review: Review };

// ========== DYNAMIC CRUD ==========

app.get("/api/:collection", async (req, res) => {
  const Model = models[req.params.collection];
  if (!Model) return res.status(404).json({ error: "Collection not found" });
  const data = await Model.find();
  res.json(data);
});

app.post("/api/:collection", async (req, res) => {
  const Model = models[req.params.collection];
  if (!Model) return res.status(404).json({ error: "Collection not found" });
  const doc = new Model(req.body);
  await doc.save();
  res.json({ success: true, data: doc });
});

app.put("/api/:collection/:id", async (req, res) => {
  const Model = models[req.params.collection];
  if (!Model) return res.status(404).json({ error: "Collection not found" });
  const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: updated });
});

app.delete("/api/:collection/:id", async (req, res) => {
  const Model = models[req.params.collection];
  if (!Model) return res.status(404).json({ error: "Collection not found" });
  await Model.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// ========== COMPLAINT ROUTES ==========

// Get all complaints (admin view)
app.get("/api/complaint/admin", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "username email") // populate user info
      .populate("adminId", "username email");
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
});

// Reply to a complaint (admin)
app.post("/api/complaint/:id/reply", async (req, res) => {
  try {
    const { text, adminId } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.messages.push({ sender: "admin", text, date: new Date() });
    complaint.adminId = adminId; // optional
    await complaint.save();
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error replying to complaint" });
  }
});




app.post("/complaint/:id/reply", async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body; // ignore adminId from frontend

    if (!text) return res.status(400).json({ error: "Text is required" });

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });

    // Push admin reply
    complaint.messages.push({
      sender: "admin",
      text,
      date: new Date()
    });

    // Set adminId with valid ObjectId (your dummy admin)
    complaint.adminId = mongoose.Types.ObjectId("651234abcd1234ef56789012");

    await complaint.save();

    res.json(complaint);
  } catch (err) {
    console.error("Reply Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





const PORT = 5000;
app.listen(PORT, () => console.log(`Admin server running on http://localhost:${PORT}`));
