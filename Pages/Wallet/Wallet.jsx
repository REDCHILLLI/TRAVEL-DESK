import React, { useContext, useEffect, useState } from "react";
import WalletBalance from "./WalletBalance";
import WalletHistory from "./WalletHistory";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Wallet = () => {
  const { user } = useContext(AuthContext); // logged-in user
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        if (!user) return;

        const res = await axios.get("http://localhost:4000/api/users/getId", {
          params: { email: user.email, username: user.username }
        });

        setUserId(res.data.userId);
      } catch (err) {
        console.error("Failed to fetch userId:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, [user]);

  if (!user)
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Please login to access your wallet</h2>
      </div>
    );
  if (loading)
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Loading wallet...</h2>
      </div>
    );

  return (
    <div className="Wallet" style={{ padding: "2rem" }}>
      <h1>Welcome, {user.username || user.email}</h1>
      {userId && (
        <>
          <div style={{ marginTop: "2rem" }}>
            <WalletBalance userId={userId} />
          </div>
          <div style={{ marginTop: "3rem" }}>
            <WalletHistory userId={userId} />
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;
