import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ReviewList from "./components/ReviewList/ReviewList";
import ReviewForm from "./components/ReviewForm/ReviewForm";
import EditReview from "./components/EditReview/EditReview";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<ReviewList />} />
          <Route path="/new" element={<ReviewForm />} />
          <Route path="/edit/:id" element={<EditReview />} />
        </Routes>
      </Router>
      <ToastContainer
        autoClose={5000}
        className="toast-notification"
        closeOnClick={false}
        position={"bottom-right"}
        hideProgressBar={true}
      />
    </>
  );
};

export default App;
