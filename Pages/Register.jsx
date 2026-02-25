import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import registerImg from "../assets/images/register.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,63}\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};


  const handleEmailChange = (e) => {
    const { value } = e.target;
    setIsEmailValid(validateEmail(value));
    handleChange(e);
  };

  const validateUsername = (username) => {
    return /^[a-zA-Z0-9\s]{3,20}$/.test(username.trim());
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Validation ---
    if (!validateUsername(credentials.username)) {
      setError("Username must be 3-20 characters long and contain only letters, numbers, or spaces.");
      return;
    }

    if (!validateEmail(credentials.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (credentials.password.trim().length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // --- API Call ---
    dispatch({ type: "REGISTER_START" });

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message);
        dispatch({ type: "REGISTER_FAILURE", payload: result.message });
      } else {
        setSuccess("Registration successful!");
        dispatch({ type: "REGISTER_SUCCESS", payload: result });
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (err) {
      setError("An error occurred while registering. Please try again later.");
      dispatch({ type: "REGISTER_FAILURE", payload: err.message });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={registerImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Register</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <Form onSubmit={handleClick}>
                  <FormGroup>
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      id="username"
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      autoComplete="true"
                      id="email"
                      onChange={handleEmailChange}
                    />
                    {!isEmailValid && (
                      <div className="alert alert-danger">
                        Please enter a valid email address
                      </div>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <div className="password__input">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        autoComplete="true"
                        id="password"
                        onChange={handleChange}
                      />
                      <i
                        className={`ri-eye-line${showPassword ? "-slash" : ""}`}
                        onClick={togglePasswordVisibility}
                      ></i>
                    </div>
                  </FormGroup>
                  <Button
                    className="btn secondary__btn auth__btn"
                    type="submit"
                    onClick={handleClick}
                  >
                    Create Account
                  </Button>
                </Form>
                <p>
                  <Link to="/forgotpassword">Forgot Password?</Link>
                </p>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
