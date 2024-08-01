const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

mongoose.connect(process.env.DB_URL);

const reviewSchema = new mongoose.Schema({
  title: String,
  content: String,
  dateTime: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

app.use(cors());
app.use(express.json());

app.get("/reviews", async (req, res) => {
  const reviews = await Review.find().sort({ dateTime: -1 });
  res.json(reviews);
});

app.post("/reviews", async (req, res) => {
  const review = new Review(req.body);
  await review.save();
  io.emit("review-added", review);
  res.status(201).json(review);
});

app.get("/reviews/:id", async (req, res) => {
  const review = await Review.findById(req.params.id);
  res.json(review);
});

app.put("/reviews/:id", async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  io.emit("review-updated", review);
  res.json(review);
});

app.delete("/reviews/:id", async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  io.emit("review-deleted", req.params.id);
  res.status(204).send();
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
