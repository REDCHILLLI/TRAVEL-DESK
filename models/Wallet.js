import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Wallet = mongoose.model("Wallet", WalletSchema);
export default Wallet;
