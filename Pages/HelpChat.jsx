import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // correct path
import axios from "axios";
import { BASE_URL } from "../utils/config"; // correct path
import "../styles/helpChat.css";

const HelpChat = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [text, setText] = useState("");
  const [alert, setAlert] = useState("");

  // Fetch userId from backend if not present
  const getUserId = async () => {
    if (!user) return null;
    if (user._id) return user._id;

    try {
      const res = await axios.get(`${BASE_URL}/users/getId`, {
        params: { username: user.username, email: user.email },
      });
      return res.data.userId;
    } catch (err) {
      console.error("Failed to fetch userId:", err);
      return null;
    }
  };

  // Fetch all user complaints
  const fetchComplaints = async () => {
    const userId = await getUserId();
    if (!userId) return;

    try {
      const res = await axios.get(`${BASE_URL}/complaint/user/${userId}`);
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  // Submit new complaint
  const submitComplaint = async () => {
    if (!text.trim()) {
      setAlert("Please enter a complaint");
      setTimeout(() => setAlert(""), 3000);
      return;
    }

    const userId = await getUserId();
    if (!userId) {
      setAlert("User not found. Please login again.");
      setTimeout(() => setAlert(""), 3000);
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/complaint`, {
        userId,
        text,
      });
      setComplaints((prev) => [...prev, res.data]);
      setText("");
      setAlert("Complaint submitted successfully!");
      setTimeout(() => setAlert(""), 3000);
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setAlert("Failed to submit complaint.");
      setTimeout(() => setAlert(""), 3000);
    }
  };

  return (
    <div className="help-chat">
      <h2>Help / Complaints</h2>
      {alert && <p className="alert">{alert}</p>}

      <div className="new-complaint">
        <textarea
          placeholder="Describe your issue..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={submitComplaint}>Submit Complaint</button>
      </div>

      <div className="complaints-list">
        <h3>Your Complaints:</h3>
        {complaints.length === 0 && <p>No complaints yet.</p>}
        {complaints.map((c) => (
          <div key={c._id} className="complaint-item">
            <p><strong>You:</strong> {c.messages[0].text}</p>
            {c.messages.slice(1).map((msg, idx) => (
              <p key={idx}><strong>Admin:</strong> {msg.text}</p>
            ))}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpChat;
