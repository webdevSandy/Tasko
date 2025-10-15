import React, { useEffect, useState, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const socket = io("https://tasko-io75.onrender.com");

const TaskManager = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loadingRows, setLoadingRows] = useState({}); // { taskId: {complete: bool, delete: bool} }
  const [adding, setAdding] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tasks
    axios
      .get("https://tasko-io75.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) => {
        console.error(err);
        navigate("/login");
      });

    // Real-time socket listeners
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

  const addTask = async () => {
    if (!title.trim()) return;
    setAdding(true);
    try {
      await axios.post(
        "https://tasko-io75.onrender.com/api/tasks",
        { title, completed: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const toggleComplete = async (task) => {
    setLoadingRows((prev) => ({
      ...prev,
      [task._id]: { ...prev[task._id], complete: true },
    }));
    try {
      await axios.put(
        `https://tasko-io75.onrender.com/api/tasks/${task._id}`,
        { ...task, completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRows((prev) => ({
        ...prev,
        [task._id]: { ...prev[task._id], complete: false },
      }));
    }
  };

  const deleteTask = async (id) => {
    setLoadingRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], delete: true },
    }));
    try {
      await axios.delete(`https://tasko-io75.onrender.com/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRows((prev) => ({
        ...prev,
        [id]: { ...prev[id], delete: false },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* ➕ Add Task */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">➕ Add Task</h2>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              className="flex-1 p-3 border rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Enter task and press Enter"
            />
            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2"
              disabled={adding}
            >
              {adding && (
                <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              )}
              Add
            </button>
          </div>
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
                className={`flex justify-between items-center p-3 rounded-md transition-colors duration-300 ${
                  task.completed ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <span
                  className={`${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-3">
                  {/* Complete Button */}
                  <button
                    onClick={() => toggleComplete(task)}
                    className="text-green-600 font-bold relative flex items-center gap-1"
                    disabled={loadingRows[task._id]?.complete}
                  >
                    ✓
                    {loadingRows[task._id]?.complete && (
                      <span className="w-3 h-3 border-2 border-t-transparent border-green-600 rounded-full animate-spin"></span>
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="text-red-600 font-bold relative flex items-center gap-1"
                    disabled={loadingRows[task._id]?.delete}
                  >
                    ✕
                    {loadingRows[task._id]?.delete && (
                      <span className="w-3 h-3 border-2 border-t-transparent border-red-600 rounded-full animate-spin"></span>
                    )}
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
