import Task from "../models/task.js";

// Get all tasks for authenticated user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new task for authenticated user
export const createTask = async (req, res) => {
  try {
    const { text, priority, dueDate } = req.body;

    const newTask = new Task({
      text,
      priority,
      dueDate,
      user: req.user._id,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update task (only if user owns it)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete task (only if user owns it)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle task completion (only if user owns it)
export const toggleTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get task analytics using aggregation pipeline
export const getTaskAnalytics = async (req, res) => {
  try {
    const analytics = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$completed",
          count: { $sum: 1 },
          averageTextLength: { $avg: { $strLenCP: "$text" } },
          tasks: { $push: "$$ROOT" }
        }
      },
      {
        $addFields: {
          status: {
            $cond: {
              if: { $eq: ["$_id", true] },
              then: "completed",
              else: "pending"
            }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $multiply: [
              { $divide: ["$completedCount", "$count"] },
              100
            ]
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      completionStats: analytics,
      priorityStats,
      totalTasks: analytics.reduce((sum, stat) => sum + stat.count, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get task statistics summary
export const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                completedTasks: {
                  $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
                },
                pendingTasks: {
                  $sum: { $cond: [{ $eq: ["$completed", false] }, 1, 0] }
                },
                averageTextLength: { $avg: { $strLenCP: "$text" } }
              }
            },
            {
              $addFields: {
                completionRate: {
                  $multiply: [
                    { $divide: ["$completedTasks", "$totalTasks"] },
                    100
                  ]
                }
              }
            }
          ],
          priorityBreakdown: [
            {
              $group: {
                _id: "$priority",
                total: { $sum: 1 },
                completed: {
                  $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] }
                }
              }
            }
          ]
        }
      }
    ]);

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
