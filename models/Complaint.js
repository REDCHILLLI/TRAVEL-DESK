import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminId: { type: String },
  messages: [
    {
      sender: { type: String, enum: ["user", "admin"], required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    }
  ],
  status: { type: String, enum: ["open", "closed"], default: "open" }
}, { timestamps: true });

const Complaint = mongoose.model("Complaint", ComplaintSchema);
export default Complaint;
