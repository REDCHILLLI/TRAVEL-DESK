import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "../styles/AdminDashboard.css";

const API_BASE = "http://localhost:5000/api";

export default function AdminDashboard() {
  const { user, dispatch } = useContext(AuthContext);
  const [currentCollection, setCurrentCollection] = useState("users");
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  // Ensure admin is logged in
  useEffect(() => {
    if (!user) {
      dispatch({
        type: "LOGIN",
        payload: { username: "admin", email: "admin@gmail.com", role: "admin" },
      });
    }
  }, [user, dispatch]);

  const loadData = async () => {
    try {
      let url = `${API_BASE}/${currentCollection}`;
      if (currentCollection === "complaint") url = `${API_BASE}/complaint/admin`;
      const res = await axios.get(url);
      setData(res.data);
      setFormData({});
    } catch (err) {
      console.error("AxiosError", err);
      setData([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post(`${API_BASE}/${currentCollection}`, formData);
      setData(prev => [...prev, res.data.data]);
      setFormData({});
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  const handleUpdate = async () => {
    if (!formData._id) return alert("Select a record first");
    try {
      const res = await axios.put(`${API_BASE}/${currentCollection}/${formData._id}`, formData);
      setData(prev => prev.map(d => d._id === formData._id ? res.data.data : d));
      setFormData({});
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  const handleDelete = async () => {
    if (!formData._id) return alert("Select a record first");
    try {
      await axios.delete(`${API_BASE}/${currentCollection}/${formData._id}`);
      setData(prev => prev.filter(d => d._id !== formData._id));
      setFormData({});
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // Reply function
  const sendReply = async (complaintId, replyText) => {
    if (!replyText) return;
    try {
      const res = await axios.post(`${API_BASE}/complaint/${complaintId}/reply`, {
        text: replyText,
        adminId: "651234abcd1234ef56789012" // dummy admin ObjectId
      });
      setData(prev => prev.map(c => c._id === complaintId ? res.data : c));
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  // Individual complaint card component
  const ComplaintCard = ({ complaint }) => {
    const [reply, setReply] = useState("");

    return (
      <div className="complaint-card">
        <h4>User: {complaint.userId?.username || complaint.userId || "Unknown"}</h4>
        <p>Status: {complaint.status || "open"}</p>
        <div className="complaint-messages">
          {(complaint.messages || []).map((msg, idx) => (
            <div key={idx} className={msg.sender === "admin" ? "admin-msg" : "user-msg"}>
              <p>{msg.text || "No message"}</p>
              <div className="msg-time">{msg.date ? new Date(msg.date).toLocaleString() : ""}</div>
            </div>
          ))}
        </div>
        <div className="reply-section">
          <input
            type="text"
            placeholder="Reply..."
            value={reply}
            onChange={e => setReply(e.target.value)}
          />
          <button onClick={() => { sendReply(complaint._id, reply); setReply(""); }}>Send</button>
        </div>
      </div>
    );
  };

  const RenderComplaints = () => {
    if (!data.length) return <p>No complaints found</p>;
    return <div className="complaints-wrapper">{data.map(c => <ComplaintCard key={c._id} complaint={c} />)}</div>;
  };

  const RenderTableForm = () => {
    if (!data.length) return <p>No data found</p>;
    return (
      <>
        <div className="form-section">
          <h3>{currentCollection} Form</h3>
          {Object.keys(formData || {}).map(key =>
            key !== "__v" && key !== "createdAt" && key !== "updatedAt" ? (
              <input
                key={key}
                name={key}
                placeholder={key}
                value={formData[key] || ""}
                onChange={handleChange}
              />
            ) : null
          )}
          <div className="form-buttons">
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              {Object.keys(data[0])
                .filter(k => k !== "__v" && k !== "createdAt" && k !== "updatedAt")
                .map(key => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map(record => (
              <tr key={record._id} onClick={() => setFormData({ ...record })}>
                {Object.entries(record)
                  .filter(([k]) => k !== "__v" && k !== "createdAt" && k !== "updatedAt")
                  .map(([k, val]) => <td key={k}>{JSON.stringify(val)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="controls">
        <select
          value={currentCollection}
          onChange={e => { setCurrentCollection(e.target.value); setFormData({}); }}
        >
          <option value="users">Users</option>
          <option value="tours">Tours</option>
          <option value="blogs">Blogs</option>
          <option value="bookings">Bookings</option>
          <option value="contacts">Contacts</option>
          <option value="review">Review</option>
          <option value="complaint">Complaints</option>
        </select>
        <button onClick={loadData}>Load Data</button>
      </div>

      {currentCollection === "complaint" ? <RenderComplaints /> : <RenderTableForm />}
    </div>
  );
}
