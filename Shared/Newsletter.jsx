import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import MaleTourist from "../assets/images/male-tourist.png";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();

    // Optional: basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    // Show thank you message
    setIsSubscribed(true);

    // Clear input
    setEmail("");
  };

  return (
    <section className="newsletter">
      <Container>
        <Row>
          <Col lg="6">
            <div className="newsletter__content">
              <h2>Subscribe to get Useful Traveling Information</h2>

              {isSubscribed ? (
                <p className="thank-you-msg">Thank you for subscribing!</p>
              ) : (
                <form className="newsletter__input" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button className="btn newsletter__btn" type="submit">
                    Subscribe
                  </button>
                </form>
              )}

              <p>
                Travel smarter, dream bigger. Experience world-class destinations
                with comfort, care, and style — your perfect getaway starts here.
              </p>
            </div>
          </Col>

          <Col lg="6">
            <div className="newsletter__img">
              <img src={MaleTourist} alt="Male Tourist" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Newsletter;
