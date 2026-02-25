import React, { useState, useContext } from "react";
import "./Booking.css";
import {
  Form,
  FormGroup,
  ListGroup,
  Button,
  ListGroupItem,
  Alert,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { BASE_URL } from "../../utils/config";
import axios from "axios";

const Booking = ({ tour, avgRating, totalRating, reviews }) => {
  const { price, title } = tour;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState({
    userId: user?.username || "",
    userEmail: user?.email || "",
    tourName: title,
    fullName: "",
    phone: "",
    bookAt: "",
    groupSize: "1",
  });

  const [walletBalance, setWalletBalance] = useState(0);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Handle input field changes
  const handleChange = (e) => {
    setBooking((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Utility to fetch userId from backend
  const getUserId = async (username, email) => {
    try {
      const res = await axios.get(`${BASE_URL}/users/getId`, {
        params: { username, email },
      });
      return res.data.userId;
    } catch (err) {
      console.error("Failed to get user ID:", err);
      return null;
    }
  };

  // =======================
  // MAIN BOOKING LOGIC
  // =======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setAlert({
        type: "warning",
        message: "Please login to proceed with the booking.",
      });
      return;
    }

    const groupSize = Number(booking.groupSize) || 1;
    const totalPrice = parseFloat((price * groupSize * 1.05).toFixed(2)); // 5% tax
    if (isNaN(totalPrice) || totalPrice <= 0) {
      setAlert({ type: "danger", message: "Invalid booking amount." });
      return;
    }

    const userId = await getUserId(user.username, user.email);
    if (!userId) {
      setAlert({
        type: "danger",
        message: "User not found. Please re-login and try again.",
      });
      return;
    }

    try {
      // 1️⃣ Fetch current wallet balance
      const walletRes = await axios.get(`${BASE_URL}/wallet/${userId}`);
      const walletBalance = Number(walletRes.data.balance);
      setWalletBalance(walletBalance);

      console.log("User ID:", userId);
      console.log("Wallet Balance:", walletBalance, "Total Price:", totalPrice);

      if (walletBalance < totalPrice) {
        setAlert({
          type: "warning",
          message: "Insufficient wallet balance. Please add money to your wallet.",
        });
        return;
      }

      // 2️⃣ Deduct money using PUT + negative delta
      const walletUpdateRes = await axios.put(`${BASE_URL}/wallet/${userId}`, {
        amount: -totalPrice, // deduct
      });

      setWalletBalance(Number(walletUpdateRes.data.balance));

      // 3️⃣ Proceed with booking
      const response = await axios.post(`${BASE_URL}/booking`, booking, {
        headers: { Authorization: `Bearer ${user?.token}` },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        setAlert({ type: "success", message: "Booking Successful!" });

        // Reset form
        setBooking({
          ...booking,
          fullName: "",
          phone: "",
          bookAt: "",
          groupSize: "1",
        });

        setTimeout(() => navigate("/thank-you"), 1500);
      } else {
        setAlert({
          type: "danger",
          message: "Failed to book. Please try again.",
        });
      }
    } catch (error) {
      console.error("Booking error:", error);
      setAlert({
        type: "danger",
        message:
          error.response?.data?.message || "Failed to book. Please try again.",
      });
    }

    setTimeout(() => setAlert({ type: "", message: "" }), 3000);
  };

  // Calculation for UI
  const currentDate = new Date().toISOString().split("T")[0];
  const groupSize = Number(booking.groupSize) || 1;
  const taxes = (0.05 * price * groupSize).toFixed(2);
  const total = (price * groupSize * 1.05).toFixed(2);

  return (
    <div className="booking">
      {alert.message && <Alert color={alert.type}>{alert.message}</Alert>}

      <div className="booking__top d-flex align-items-center justify-content-between">
        <h3>
          ${price} <span>/Per Person</span>
        </h3>
        <span className="tour__rating d-flex align-items-center gap-1">
          <i className="ri-star-fill"></i>
          {avgRating > 0 ? avgRating : null}
          {totalRating === 0 ? (
            <span>Not Rated</span>
          ) : (
            <span>({reviews.length || 0})</span>
          )}
        </span>
      </div>

      <div className="booking__form">
        <h5>Information</h5>
        <Form className="booking__info-form" onSubmit={handleSubmit}>
          <FormGroup>
            <input
              type="text"
              placeholder="Full Name"
              id="fullName"
              required
              onChange={handleChange}
              value={booking.fullName}
            />
          </FormGroup>
          <FormGroup>
            <input
              type="number"
              placeholder="Phone"
              id="phone"
              required
              onChange={handleChange}
              value={booking.phone}
            />
          </FormGroup>
          <FormGroup className="d-flex align-items-center gap-3">
            <input
              type="date"
              id="bookAt"
              required
              onChange={handleChange}
              value={booking.bookAt}
              min={currentDate}
            />
            <input
              type="number"
              placeholder="Group Size"
              id="groupSize"
              required
              onChange={handleChange}
              value={booking.groupSize}
              min="1"
            />
          </FormGroup>
          <Button type="submit" className="btn primary__btn w-100 mt-4">
            Book Now
          </Button>
        </Form>
      </div>

      <div className="booking__bottom">
        <ListGroup>
          <ListGroupItem className="border-0 px-0">
            <h5 className="d-flex align-items-center gap-1">
              ${price} <i className="ri-close-line"></i> {groupSize} Person
            </h5>
            <span>${(price * groupSize).toFixed(2)}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0">
            <h5>Taxes</h5>
            <span>${taxes}</span>
          </ListGroupItem>
          <ListGroupItem className="border-0 px-0 total">
            <h5>Total</h5>
            <span>${total}</span>
          </ListGroupItem>
        </ListGroup>
      </div>
    </div>
  );
};

export default Booking;
