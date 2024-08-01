import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { MESSAGES } from "../../common/constant";
import { BACKEND_URL } from "../../utils/domainConfig";
import "./EditReview.css";

const EditReview = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/reviews/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        toast.error(MESSAGES.GENERAL_ERROR_MESSAGE);
      }
    };

    fetchReview();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BACKEND_URL}/reviews/${id}`, { title, content });
      toast.success(MESSAGES.REVIEW_EDITED_SUCCESSFULLY);
      navigate("/");
    } catch (error) {
      toast.error(MESSAGES.GENERAL_ERROR_MESSAGE);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/reviews/${id}`);
      toast.success(MESSAGES.REVIEW_DELETED_SUCCESSFULLY);
      navigate("/");
    } catch (error) {
      toast.error(MESSAGES.GENERAL_ERROR_MESSAGE);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Edit Review</h1>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            setTitle("");
            setContent("");
          }}
        >
          Reset
        </button>
        <button type="button" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </form>
    </div>
  );
};

export default EditReview;
