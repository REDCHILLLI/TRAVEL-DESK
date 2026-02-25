// router/wallet.js
import express from "express";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// =======================
// GET Wallet Balance
// =======================
router.get("/:userId", async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.params.userId });
    
    // If wallet does not exist, initialize it
    if (!wallet) {
      wallet = new Wallet({ userId: req.params.userId, balance: 0 });
      await wallet.save();
    }

    res.json({ balance: wallet.balance }); // return as object
  } catch (err) {
    console.error("Wallet GET error:", err);
    res.status(500).json({ message: err.message });
  }
});

// =======================
// ADD Money to Wallet
// =======================
router.post("/", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    let wallet = await Wallet.findOne({ userId });

    // If wallet does not exist, initialize it
    if (!wallet) {
      wallet = new Wallet({ userId, balance: amount });
    } else {
      wallet.balance += amount;
    }
    await wallet.save();

    // Record transaction
    const transaction = new Transaction({
      userId,
      type: "add",
      amount,
      message: "Added money",
      status: "successful",
    });
    await transaction.save();

    res.json({ balance: wallet.balance, message: "Money added successfully" });
  } catch (err) {
    console.error("Wallet POST error:", err);
    res.status(500).json({ message: err.message });
  }
});

// =======================
// GET Wallet History
// =======================
router.get("/history/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Wallet history error:", err);
    res.status(500).json({ message: err.message });
  }
});
// ...existing code...
// =======================
// UPDATE Wallet (set balance or add/deduct amount)
// =======================
router.put("/:userId", async (req, res) => {
  try {
    const { balance, amount } = req.body;
    const userId = req.params.userId;

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet({ userId, balance: 0 });
      await wallet.save();
    }

    // 1️⃣ Set absolute balance
    if (typeof balance !== "undefined") {
      if (balance < 0)
        return res.status(400).json({ message: "Balance cannot be negative" });

      const diff = Number(balance) - Number(wallet.balance || 0);
      wallet.balance = Number(balance);
      await wallet.save();

      await Transaction.create({
        userId,
        type: diff < 0 ? "booking" : "add", // use your enum
        amount: Math.abs(diff),
        message: diff < 0 ? "Balance adjusted for booking" : "Balance added",
        status: "successful",
      });

      return res.json({ balance: wallet.balance, message: "Wallet balance set" });
    }

    // 2️⃣ Apply delta (amount)
    if (typeof amount !== "undefined") {
      const delta = Number(amount);
      const currentBalance = Number(wallet.balance || 0);
      const newBalance = currentBalance + delta;

      if (isNaN(delta)) return res.status(400).json({ message: "Invalid amount value" });
      if (newBalance < 0) return res.status(400).json({ message: "Insufficient balance" });

      wallet.balance = newBalance;
      await wallet.save();

      await Transaction.create({
        userId,
        type: delta < 0 ? "booking" : "add", // ✅ key change
        amount: Math.abs(delta),
        message: delta < 0 ? "Deducted for booking" : "Added to wallet",
        status: "successful",
      });

      return res.json({ balance: wallet.balance, message: "Wallet updated" });
    }

    return res.status(400).json({ message: "Provide either 'balance' or 'amount' in request body" });
  } catch (err) {
    console.error("Wallet UPDATE error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ...existing code...
export default router;
