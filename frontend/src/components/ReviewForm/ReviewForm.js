import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { MESSAGES } from "../../common/constant";
import { BACKEND_URL } from "../../utils/domainConfig";
import "./ReviewForm.css";

const ReviewForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/reviews`, { title, content });
      toast.success(MESSAGES.REVIEW_ADDED_SUCCESSFULLY);
      navigate("/");
    } catch (error) {
      toast.error(MESSAGES.GENERAL_ERROR_MESSAGE);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>New Review</h1>
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
      </form>
    </div>
  );
};

export default ReviewForm;
