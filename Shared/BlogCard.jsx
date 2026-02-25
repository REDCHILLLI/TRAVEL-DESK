import React from "react";
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./Blogcard.css";

const BlogCard = ({ blog }) => {
  const { _id, title, author, date, photo, comments } = blog;

  return (
    <div className="blog__card">
      <Card>
        <Link to={`/blogs/${_id}`} className="blog__img-link">
          <div className="blog__img">
            <img src={photo} alt={title} />
          </div>
        </Link>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <span className="blog__author d-flex align-items-center gap-1">
              <i className="ri-user-line"></i> {author}
            </span>
            <span className="blog__date">{date}</span>
          </div>

          <h5 className="blog__title">
            <Link to={`/blogs/${_id}`}>{title}</Link>
          </h5>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              {comments.length} <span>Comments</span>
            </h5>
            <Link to={`/blogs/${_id}`} className="btn booking__btn">
              Read More
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default BlogCard;
