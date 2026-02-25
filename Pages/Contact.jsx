import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Button, Alert } from "reactstrap";
import axios from "axios";
import "../styles/Contact.css";
import Subtitle from "../Shared/Subtitle";
import { BASE_URL } from "../utils/config";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Trim inputs
  const name = formData.name.trim();
  const email = formData.email.trim();
  const phone = formData.phone.trim();
  const message = formData.message.trim();

  // Name validation
  if (!/^[a-zA-Z\s]{2,}$/.test(name)) {
    setAlertType("danger");
    setAlertMessage("Name must have at least 2 letters and only alphabets.");
    setAlertVisible(true);
    return;
  }

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setAlertType("danger");
    setAlertMessage("Please enter a valid email address.");
    setAlertVisible(true);
    return;
  }

  // Phone validation
  if (!/^\d{10}$/.test(phone)) {
    setAlertType("danger");
    setAlertMessage("Phone number must be 10 digits.");
    setAlertVisible(true);
    return;
  }

  // Message validation
  if (message.length < 10) {
    setAlertType("danger");
    setAlertMessage("Message must be at least 10 characters long.");
    setAlertVisible(true);
    return;
  }

  // Submit data if all validations pass
  axios
    .post(`${BASE_URL}/contact`, { name, email, phone, message })
    .then((response) => {
      setAlertType("success");
      setAlertMessage("Form submitted successfully!");
      setAlertVisible(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    })
    .catch((error) => {
      setAlertType("danger");
      setAlertMessage("Failed to submit form. Please try again later.");
      setAlertVisible(true);
    });
};

  return (
    <section>
      <Container>
        <Row>
          <Col sm={12} md={{ size: 6, offset: 3 }}>
            <Subtitle subtitle={"Contact Us"} />
            <div className="contact-info">
              <p>Contact No: 8056491212</p>
              <p>Email: ajeezajeez969@example.com</p>
            </div>
            {alertVisible && (
              <Alert color={alertType} className="mt-3">
                {alertMessage}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <FormGroup className="form__group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup className="form__group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup className="form__group">
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <FormGroup className="form__group">
              <input
                type="textarea"
                id="message"
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </FormGroup>
            <Button type="submit" className="btn primary__btn">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;
