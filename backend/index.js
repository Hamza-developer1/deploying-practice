const express = require("express");
const cors = require("cors");
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

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
