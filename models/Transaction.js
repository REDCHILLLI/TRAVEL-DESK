import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["add", "booking"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["successful", "unsuccessful"],
    default: "successful"
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
