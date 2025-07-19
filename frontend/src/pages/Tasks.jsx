import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState("");
  const { token, logout, user } = useAuth();

  const API_URL = "http://localhost:5001/api";

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: getAuthHeaders(),
      });
      
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      } else {
        console.error("Error fetching tasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setText("");
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setTasks(tasks.filter(task => task._id !== id));
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const toggleTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map(task => 
          task._id === id ? updatedTask : task
        ));
      }
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditText(task.text);
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: editText }),
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map(task => 
          task._id === id ? updatedTask : task
        ));
        setEditingTask(null);
        setEditText("");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>My Tasks</h1>
        <div>
          <span style={{ marginRight: "1rem" }}>Welcome, {user?.username}!</span>
          <button onClick={logout} style={{ padding: "0.5rem 1rem" }}>
            Logout
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task"
          required
          style={{ width: "70%", padding: "0.5rem", marginRight: "1rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Add Task
        </button>
      </form>

      <div>
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one above!</p>
        ) : (
          tasks.map((task) => (
            <div 
              key={task._id} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: task.completed ? "#f0f0f0" : "white"
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task._id)}
                style={{ marginRight: "1rem" }}
              />
              
              {editingTask === task._id ? (
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    style={{ flex: 1, padding: "0.25rem", marginRight: "1rem" }}
                  />
                  <button 
                    onClick={() => saveEdit(task._id)}
                    style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem" }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={cancelEdit}
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span 
                    style={{ 
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#666" : "black"
                    }}
                  >
                    {task.text}
                  </span>
                  <div>
                    <button 
                      onClick={() => startEdit(task)}
                      style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem" }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteTask(task._id)}
                      style={{ padding: "0.25rem 0.5rem", backgroundColor: "#ff4444", color: "white" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;
