import React, { useEffect, useState, useRef, useContext } from "react";
const socket = io("http://localhost:5000");
import axios from "axios";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TaskManager = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Fetch existing tasks
    axios
      .get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });

    // ✅ Real-time Listeners
    socket.on("taskCreated", (task) => {
      setTasks((prev) => {
        if (prev.some((t) => t._id === task._id)) return prev;
        return [...prev, task];
      });
    });

    socket.on("taskUpdated", (updated) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updated._id ? updated : task))
      );
    });

    socket.on("taskDeleted", (id) => {
      setTasks((prev) => prev.filter((task) => task._id !== id));
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [token]);

  // ✅ Don't update UI manually — let sockets handle real-time state
  const addTask = async () => {
    if (title.trim() === "") return;
    await axios.post(
      "http://localhost:5000/api/tasks",
      { title, completed: false },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle(""); // ✅ Only reset input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const toggleComplete = async (task) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${task._id}`,
      { ...task, completed: !task.completed },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* ➕ Task Adder */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">➕ Add Task</h2>  
          <input
            ref={inputRef}
            className="w-full p-3 border rounded-md mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Enter task and press Enter"
          />
          <button
            onClick={addTask}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md"
          >
            Add
          </button>
        </div>

        {/* 📋 Task List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            📋 Task List
          </h2>
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="flex justify-between items-center p-3 bg-gray-100 rounded-md"
              >
                <span
                  className={
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }
                >
                  {task.title}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => toggleComplete(task)}
                    className="text-green-600 font-bold"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-600 font-bold"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
