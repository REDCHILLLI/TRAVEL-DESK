import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./Tourcard.css";
import calculateAvgRating from "../utils/avgRating";

const TourCard = ({ tour }) => {
  const { _id, title, city, photo, price, reviews } = tour;
  const { totalRating, avgRating } = calculateAvgRating(reviews);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <Link to={`/tours/${_id}`} onClick={handleScrollToTop}>
            <img src={photo} alt={title} />
          </Link>
          <span>Featured</span>
        </div>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="tour__location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i>
              {city}
            </span>
            <span className="tour__rating d-flex align-items-center gap-1">
              <i className="ri-star-fill"></i>
              {avgRating > 0 ? avgRating : null}
              {totalRating === 0 ? <span>Not Rated</span> : <span>({reviews.length})</span>}
            </span>
          </div>

          <h5 className="tour__title">
            <Link to={`/tours/${_id}`} onClick={handleScrollToTop}>
              {title}
            </Link>
          </h5>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              ${price} <span>/Per Person</span>
            </h5>
            <Link to={`/tours/${_id}`} onClick={handleScrollToTop} className="btn booking__btn">
              Book Now
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
