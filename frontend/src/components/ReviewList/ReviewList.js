import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { MESSAGES, SOCKET_CONFIGURATION } from "../../common/constant";
import { BACKEND_URL } from "../../utils/domainConfig";
import "./ReviewList.css";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/reviews`);
        setReviews(response.data);
      } catch (error) {
        toast.error(MESSAGES.GENERAL_ERROR_MESSAGE);
      }
    };

    fetchReviews();

    const socket = socketIOClient(BACKEND_URL);

    socket.on(SOCKET_CONFIGURATION.ADD_REVIEW, (review) => {
      setReviews((prevReviews) => [review, ...prevReviews]);
    });

    socket.on(SOCKET_CONFIGURATION.UPDATE_REVIEW, (updatedReview) => {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
    });

    socket.on(SOCKET_CONFIGURATION.DELETE_REVIEW, (id) => {
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review._id !== id)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_URL}/reviews/${id}`);
      toast.success(MESSAGES.REVIEW_DELETED_SUCCESSFULLY);
    } catch (error) {
      toast.error(MESSAGES.GENERAL_ERROR_MESSAGE);
    }
  };

  return (
    <div className="container">
      <h1>Reviews</h1>
      <Link to="/new" className="create-button">
        Create New Review
      </Link>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Content</th>
            <th>Date-Time</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review._id}>
              <td>{index + 1}</td>
              <td>{review.title}</td>
              <td>{review.content}</td>
              <td>{new Date(review.dateTime).toLocaleString()}</td>
              <td>
                <Link to={`/edit/${review._id}`} className="edit-button">
                  Edit
                </Link>
              </td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewList;
