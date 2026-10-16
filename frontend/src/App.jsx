import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const API ="https://student-task-manager-4z8p.onrender.com/api/tasks";

  async function loadTasks() {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.log("Could not load tasks:", error);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask() {
    if (!title.trim()) {
      alert("Please enter a task title!");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (response.ok) {
        setTasks((previous) => [data, ...previous]);
        setTitle("");
      } else {
        alert(data.message || "Unable to add task");
      }
    } catch (error) {
      alert("Backend connection failed!");
      console.log(error);
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((previous) =>
          previous.filter((task) => task._id !== id)
        );
      }
    } catch (error) {
      console.log("Could not delete task:", error);
    }
  }

  return (
    <div className="container">
      <div className="task-box">
        <h1>Student Task Manager</h1>
        <p>Organize your daily study tasks</p>

        <div className="input-area">
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button onClick={addTask}>Add Task</button>
        </div>

        <h2>My Tasks ({tasks.length})</h2>

        {tasks.length === 0 ? (
          <p>No tasks available. Add your first task!</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id}>
                <span>{task.title}</span>
                <button onClick={() => deleteTask(task._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
