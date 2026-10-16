const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Error:", error));

// GET Tasks
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json(tasks);
});

// ADD Task
app.post("/api/tasks", async (req, res) => {
  const title = req.body.title?.trim();

  if (!title) {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const task = await Task.create({ title });

  res.status(201).json(task);
});

// DELETE Task
app.delete("/api/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "Task deleted successfully"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});