```javascript
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || !mongoURI.startsWith("mongodb")) {
    console.error("Error: MONGO_URI is missing or invalid.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
}

// GET Tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch tasks" });
  }
});

// ADD Task
app.post("/api/tasks", async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({ title });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Could not add task" });
  }
});

// DELETE Task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Could not delete task" });
  }
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```
