import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT;
import connectDB from "./config/db.js";

app.use(cors());
app.use(express.json());

connectDB();

let tasks = [];

app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { text } = req.body;
  const newTask = { id: tasks.length + 1, text };
  tasks.push(newTask);
  res.json(newTask);
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
