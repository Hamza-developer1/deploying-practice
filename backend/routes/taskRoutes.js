import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskAnalytics,
  getTaskStats,
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Analytics routes (must be before /:id routes)
router.get("/analytics", protect, getTaskAnalytics);
router.get("/stats", protect, getTaskStats);

// Standard CRUD routes
router.route("/").get(protect, getTasks).post(protect, createTask);

router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

router.patch("/:id/toggle", protect, toggleTaskCompletion);

export default router;
