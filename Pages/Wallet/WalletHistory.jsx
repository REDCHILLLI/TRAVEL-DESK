import React, { useState, useEffect } from "react";
import { Card, CardBody } from "reactstrap";
import axios from "axios";

const WalletHistory = ({ userId }) => {
  const [history, setHistory] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/wallet/history/${userId}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching wallet history:", err);
      }
    };
    if (userId) fetchHistory();
  }, [userId]);

  if (!history) return <div>Loading wallet history...</div>;

  return (
    <div className="container my-4">
      <h2>Wallet History</h2>
      {history.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        history.map((item) => (
          <Card key={item._id || item.id} className="mb-2">
            <CardBody>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{item.message}</strong>
                  <div>{new Date(item.date).toLocaleString()}</div>
                </div>
                <div>{item.type === "add" ? "+" : "-"}${item.amount}</div>
                <div className={item.status === "successful" ? "text-success" : "text-danger"}>
                  {item.status}
                </div>
              </div>
            </CardBody>
          </Card>
        ))
      )}
    </div>
  );
};

export default WalletHistory;
