import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });
// Error handler middleware
app.use(errorHandler);

// 404 handler
// app.use("*", (req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
