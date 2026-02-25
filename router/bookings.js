import express from "express";
import {
    createBooking,
    getAllBookings,
    getBooking,
    getMyBookings,
    cancelBooking, // new
} from "../controllers/bookingController.js";
import verifyToken, { verifyUser, verifyAdmin } from "../utils/verifyToken.js";


const bookingRoute = express.Router();

// Create a booking (any logged-in user)
bookingRoute.post("/", verifyToken, verifyUser, createBooking);

// Get all bookings (admin only)
bookingRoute.get("/", verifyAdmin, getAllBookings);
bookingRoute.get("/my-bookings", verifyToken, verifyUser, getMyBookings);
// Cancel current user's booking by tourName (or any other identifier)
bookingRoute.delete("/cancel", verifyToken, verifyUser, cancelBooking);


// Get a single booking by ID (admin only or owner)
bookingRoute.get("/:id", verifyUser, getBooking);

// Get current user's bookings


export default bookingRoute;