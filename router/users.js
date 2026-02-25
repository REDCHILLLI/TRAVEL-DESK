import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import verifyToken, { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
import User from "../models/User.js";


const userRoute = express.Router();

userRoute.post("/", verifyAdmin, createUser);

userRoute.get("/", verifyAdmin, getAllUsers); 
userRoute.get("/getId", async (req, res) => {
  const { email, username } = req.query;
  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ userId: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
userRoute.get("/:id", verifyUser, getUserById);

userRoute.put("/:id", verifyUser, updateUser);

userRoute.delete("/:id", verifyUser, deleteUser);




export default userRoute;
