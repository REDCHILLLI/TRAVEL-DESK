import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import loginImg from "../assets/images/login.png";
import userIcon from "../assets/images/user.png";
import { AuthContext } from "../context/AuthContext";
import { BASE_URL } from "../utils/config";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (e) => setRole(e.target.value);

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Admin Static Login ---
    if (role === "admin") {
      if (
        credentials.email === "admin@gmail.com" &&
        credentials.password === "password123"
      ) {
        const adminUser = { username: "Admin", email: credentials.email, _id: "admin-id" };
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: adminUser, role: "admin" },
        });
        localStorage.setItem("user", JSON.stringify(adminUser));
        localStorage.setItem("token", "admin-token");
        localStorage.setItem("role", "admin");
        navigate("/");
        return;
      } else {
        setError("Invalid admin credentials.");
        return;
      }
    }

    // --- User Login Validation ---
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(credentials.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (credentials.password.trim().length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // --- User Login API Call ---
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Login failed");
        dispatch({ type: "LOGIN_FAILURE", payload: result.message });
      } else {
        // Store user info including _id
        const userPayload = {
          _id: result._id, // backend userId
          username: result.username || result.email.split("@")[0],
          email: result.email,
        };

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: userPayload, role: "user" },
        });

        // Store user info and token in localStorage for wallet/booking usage
        localStorage.setItem("user", JSON.stringify(userPayload));
        localStorage.setItem("userId", result._id); // optional separate key for convenience
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", "user");

        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="8" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img">
                <img src={loginImg} alt="" />
              </div>

              <div className="login__form">
                <div className="user">
                  <img src={userIcon} alt="" />
                </div>
                <h2>Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}

                <Form onSubmit={handleClick}>
                  {/* Role Selector */}
                  <FormGroup>
                    <select value={role} onChange={handleRoleChange}>
                      <option value="user">User Login</option>
                      <option value="admin">Admin Login</option>
                    </select>
                  </FormGroup>

                  <FormGroup>
                    <input
                      type="email"
                      placeholder={role === "admin" ? "Admin Email" : "Email"}
                      required
                      autoComplete="true"
                      id="email"
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <FormGroup>
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      autoComplete="true"
                      id="password"
                      onChange={handleChange}
                    />
                  </FormGroup>

                  <Button className="btn secondary__btn auth__btn" type="submit">
                    Login
                  </Button>
                </Form>
                <p>
                  Don't have an account? <Link to="/register">Register</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
