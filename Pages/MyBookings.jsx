import React, { useState, useEffect } from "react";
import { Container, Table, Button, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/booking/my-bookings`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setBookings(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch bookings");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Failed to fetch bookings. Make sure you are logged in.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/booking/cancel`, {
        data: { bookingId },
        withCredentials: true,
      });

      if (res.data.success) {
        setSuccess(res.data.message);
        setError(null);
        setModalOpen(false);
        fetchBookings();
      } else {
        setError(res.data.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      setError("Failed to cancel booking");
    }
  };

  return (
    <section className="my-bookings">
      <Container>
        <h2 className="mb-4">My Bookings</h2>

        {error && <Alert color="danger">{error}</Alert>}
        {success && <Alert color="success">{success}</Alert>}

        {bookings.length === 0 && !error && <p>You have no bookings yet.</p>}

        {bookings.length > 0 && (
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Tour Name</th>
                <th>Date</th>
                <th>Group Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.tourName}</td>
                  <td>{new Date(booking.bookAt).toLocaleDateString()}</td>
                  <td>{booking.groupSize}</td>
                  <td>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setModalOpen(true);
                      }}
                    >
                      Cancel
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Confirmation Modal */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
            Confirm Cancellation
          </ModalHeader>
          <ModalBody>
            Are you sure you want to cancel booking for <b>{selectedBooking?.tourName}</b> on{" "}
            {selectedBooking && new Date(selectedBooking.bookAt).toLocaleDateString()}?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalOpen(false)}>
              No
            </Button>
            <Button
              color="danger"
              onClick={() => cancelBooking(selectedBooking._id)}
            >
              Yes, Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </section>
  );
};

export default MyBookings;
