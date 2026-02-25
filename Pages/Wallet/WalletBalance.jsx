import React, { useState, useEffect } from "react";
import { Button, Input, InputGroup, InputGroupText, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, Row, Col } from "reactstrap";
import { FaMoneyBillWave, FaCreditCard, FaWallet, FaArrowDown } from "react-icons/fa";
import axios from "axios";

const WalletBalance = ({ userId }) => {
  const [balance, setBalance] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [transactionType, setTransactionType] = useState("credit"); // default

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/wallet/${userId}`);
        setBalance(res.data.balance);
      } catch (err) {
        console.error("Error fetching wallet:", err);
      }
    };
    if (userId) fetchBalance();
  }, [userId]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleAddMoney = async () => {
    const amount = parseInt(addAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {
      await axios.post(`http://localhost:4000/api/wallet`, { userId, amount });
      setBalance(prev => prev + amount);
      alert(`$${amount} added successfully as ${transactionType.toUpperCase()}`);
      setAddAmount("");
      setTransactionType("credit");
      setModalOpen(false);
    } catch (err) {
      console.error("Error adding money:", err);
      alert("Failed to add money");
    }
  };

  if (balance === null) return <div>Loading wallet...</div>;

  return (
    <div className="container my-4">
      <h2>My Wallet</h2>
      <Card className="p-4 mb-3 shadow-sm border-0">
        <CardBody>
          <h4>Current Balance</h4>
          <h2 className="text-success"><FaWallet /> ${balance}</h2>
          <Button color="primary" onClick={toggleModal} className="mt-3">
            <FaMoneyBillWave /> Add Money
          </Button>
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal} centered>
        <ModalHeader toggle={toggleModal}>Add Money</ModalHeader>
        <ModalBody>
          <InputGroup className="mb-3">
            <InputGroupText>$</InputGroupText>
            <Input
              type="number"
              placeholder="Enter amount"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
            />
          </InputGroup>

          <div>
            <h6>Select Transaction Type:</h6>
            <Row className="g-2 mt-2">
              <Col>
                <Button
                  color={transactionType === "credit" ? "success" : "secondary"}
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => setTransactionType("credit")}
                >
                  <FaArrowDown className="me-2" /> Credit
                </Button>
              </Col>
              <Col>
                <Button
                  color={transactionType === "debit" ? "danger" : "secondary"}
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => setTransactionType("debit")}
                >
                  <FaArrowDown className="me-2" /> Debit
                </Button>
              </Col>
              <Col>
                <Button
                  color={transactionType === "upi" ? "info" : "secondary"}
                  className="w-100 d-flex align-items-center justify-content-center"
                  onClick={() => setTransactionType("upi")}
                >
                  <FaCreditCard className="me-2" /> UPI
                </Button>
              </Col>
            </Row>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
          <Button color="primary" onClick={handleAddMoney}>Add</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default WalletBalance;
