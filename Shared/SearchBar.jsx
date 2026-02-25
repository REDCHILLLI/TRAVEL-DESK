import React, { useRef, useState } from "react";
import { Col, Form, FormGroup, Button, Alert } from "reactstrap";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { useNavigate } from "react-router-dom";
import "./searchbar.css";

const SearchBar = () => {
  const locationRef = useRef("");
  const distanceRef = useRef("");
  const maxGroupSizeRef = useRef("");
  const navigate = useNavigate();

  const [error, setError] = useState(""); // Error message state
  const [success, setSuccess] = useState(""); // Success message state

  const searchHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const location = locationRef.current.value.trim();
    const distance = Number(distanceRef.current.value);
    const maxGroupSize = Number(maxGroupSizeRef.current.value);

    // Client-side validation
    if (!location) {
      setError("Please enter a location.");
      return;
    }

    if (distance <= 0 || isNaN(distance)) {
      setError("Distance must be a positive number.");
      return;
    }

    if (maxGroupSize <= 0 || isNaN(maxGroupSize)) {
      setError("Max people must be a positive number.");
      return;
    }

    const searchParams = new URLSearchParams();
    searchParams.append("city", location);
    searchParams.append("distance", distance);
    searchParams.append("maxGroupSize", maxGroupSize);

    try {
      const response = await axios.get(`${BASE_URL}/search?${searchParams}`);
      setSuccess("Search completed successfully!");
      navigate(`/search?${searchParams}`, {
        state: { searchResult: response.data.data },
      });
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
    }
  };

  return (
    <Col lg="12">
      <div className="search__bar">
        <Form className="d-flex align-items-center gap-4" onSubmit={searchHandler}>
          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{success}</Alert>}

          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri-map-pin-line" />
            </span>
            <div>
              <h6>Location</h6>
              <input type="text" placeholder="Where are you going?" ref={locationRef} />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri-map-pin-time-line" />
            </span>
            <div>
              <h6>Distance</h6>
              <input type="number" placeholder="Distance k/m" ref={distanceRef} min="1" />
            </div>
          </FormGroup>

          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span>
              <i className="ri-group-line" />
            </span>
            <div>
              <h6>Max People</h6>
              <input type="number" placeholder="0" ref={maxGroupSizeRef} min="1" />
            </div>
          </FormGroup>

          <Button color="primary" type="submit">
            <i className="ri-search-line" />
          </Button>
        </Form>
      </div>
    </Col>
  );
};

export default SearchBar;
