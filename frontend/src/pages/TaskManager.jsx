import React, { useEffect, useState, useRef, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  FiPlus, FiTrash2, FiCheck, FiCircle, FiCheckCircle, 
  FiActivity, FiList, FiArrowRight, FiCalendar, 
  FiTag, FiChevronDown, FiChevronUp, FiClock, FiX, FiSearch, FiFilter
} from "react-icons/fi";

const socket = io("https://tasko-io75.onrender.com");

const DEFAULT_CATEGORIES = ["General", "Work", "Personal", "Urgent"];

const TaskManager = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  
  // New Task Form State
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  // Compute available categories dynamically based on existing tasks
  const dynamicCategories = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...tasks.map(t => t.category).filter(Boolean)])
  );
  
  // UI States
  const [loadingRows, setLoadingRows] = useState({});
  const [adding, setAdding] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [newSubtaskTitle, setNewSubtaskTitle] = useState({}); // { taskId: "title" }

  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();

    socket.on("taskCreated", (task) => {
      setTasks((prev) => {
        if (prev.some((t) => t._id === task._id)) return prev;
        return [...prev, task].sort((a, b) => a.order - b.order);
      });
    });

    socket.on("taskUpdated", (updated) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updated._id ? updated : task)).sort((a, b) => a.order - b.order)
      );
    });

    socket.on("taskDeleted", (id) => {
      setTasks((prev) => prev.filter((task) => task._id !== id));
    });

    socket.on("tasksReordered", (reorderedData) => {
      // reorderedData is [{_id, order}]
      setTasks(prev => {
        const orderMap = new Map(reorderedData.map(item => [item._id, item.order]));
        const newTasks = prev.map(t => orderMap.has(t._id) ? { ...t, order: orderMap.get(t._id) } : t);
        return newTasks.sort((a, b) => a.order - b.order);
      });
    });

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
      socket.off("tasksReordered");
    };
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("https://tasko-io75.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    setAdding(true);
    try {
      const res = await axios.post(
        "https://tasko-io75.onrender.com/api/tasks",
        { title, category: selectedCategory, dueDate: dueDate || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Real-time fix: Update local state immediately
      setTasks(prev => {
        if (prev.some(t => t._id === res.data._id)) return prev;
        return [...prev, res.data];
      });

      setTitle("");
      setDueDate("");
      setSelectedCategory("General");
      setIsCustomCategory(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const toggleComplete = async (task) => {
    setLoadingRows((prev) => ({ ...prev, [task._id]: { ...prev[task._id], complete: true } }));
    
    // Optimistic UI Update
    setTasks(prev => prev.map(t => t._id === task._id ? { ...t, completed: !t.completed } : t));

    try {
      await axios.put(
        `https://tasko-io75.onrender.com/api/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
      // Revert if failed
      setTasks(prev => prev.map(t => t._id === task._id ? { ...t, completed: !t.completed } : t));
    } finally {
      setLoadingRows((prev) => ({ ...prev, [task._id]: { ...prev[task._id], complete: false } }));
    }
  };

  const deleteTask = async (id) => {
    setLoadingRows((prev) => ({ ...prev, [id]: { ...prev[id], delete: true } }));
    try {
      await axios.delete(`https://tasko-io75.onrender.com/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optimistic delete
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRows((prev) => ({ ...prev, [id]: { ...prev[id], delete: false } }));
    }
  };

  const handleReorder = async (newOrder) => {
    setTasks(newOrder); // Update UI instantly
    
    // Create mapping for backend
    const reorderedTasks = newOrder.map((task, index) => ({
      _id: task._id,
      order: index
    }));

    try {
      await axios.put(
        "https://tasko-io75.onrender.com/api/tasks/reorder",
        { reorderedTasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to reorder tasks in DB", err);
    }
  };

  const toggleExpand = (id) => {
    const next = new Set(expandedTasks);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedTasks(next);
  };

  const addSubtask = async (taskId) => {
    const subtaskTitle = newSubtaskTitle[taskId];
    if (!subtaskTitle?.trim()) return;

    setLoadingRows((prev) => ({ ...prev, [taskId]: { ...prev[taskId], subtask: true } }));
    try {
      const task = tasks.find(t => t._id === taskId);
      const updatedSubtasks = [...(task.subtasks || []), { title: subtaskTitle, completed: false }];
      
      const res = await axios.put(
        `https://tasko-io75.onrender.com/api/tasks/${taskId}`,
        { subtasks: updatedSubtasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(prev => prev.map(t => t._id === taskId ? res.data : t));
      setNewSubtaskTitle(prev => ({ ...prev, [taskId]: "" }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRows((prev) => ({ ...prev, [taskId]: { ...prev[taskId], subtask: false } }));
    }
  };

  const toggleSubtask = async (taskId, subtaskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const updatedSubtasks = task.subtasks.map(st => 
        st._id === subtaskId ? { ...st, completed: !st.completed } : st
      );

      // Optimistic update
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, subtasks: updatedSubtasks } : t));

      await axios.put(
        `https://tasko-io75.onrender.com/api/tasks/${taskId}`,
        { subtasks: updatedSubtasks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error(error);
      fetchTasks(); // Refresh if failed
    }
  };

  const getCategoryColor = (cat) => {
    switch(cat) {
      case "Urgent": return "text-rose-500 bg-rose-50 dark:text-rose-400 dark:bg-rose-400/10 border-rose-200 dark:border-rose-400/20";
      case "Work": return "text-blue-500 bg-blue-50 dark:text-blue-400 dark:bg-blue-400/10 border-blue-200 dark:border-blue-400/20";
      case "Personal": return "text-emerald-500 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20";
      default: return "text-violet-500 bg-violet-50 dark:text-violet-400 dark:bg-violet-400/10 border-violet-200 dark:border-violet-400/20";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Compute Filtered Tasks
  const isFiltered = searchQuery.trim() !== "" || filterStatus !== "All" || filterCategory !== "All";
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" ? true : filterStatus === "Active" ? !task.completed : task.completed;
    const matchesCategory = filterCategory === "All" ? true : task.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="w-full bg-transparent text-gray-900 dark:text-white pt-8 pb-16 px-6 font-sans selection:bg-cyan-500/30 relative overflow-hidden min-h-[calc(100vh-80px)]">
      
      {/* Background Ambient Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/5 dark:bg-violet-600/10 blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/5 dark:bg-cyan-600/10 blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header / Progress Bar */}
        <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">My Workspace</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Organize, track, and complete your tasks in real-time.</p>
            </div>
            
            <div className="w-full md:w-72 bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Progress</span>
                <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{progressPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Search & Filter Bar */}
        <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <FiSearch size={18} />
            </div>
            <input 
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:border-cyan-500/50 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiFilter size={16} />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-40 bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-600 dark:text-gray-300 focus:border-cyan-500/50 outline-none appearance-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiTag size={16} />
              </div>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-40 bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-600 dark:text-gray-300 focus:border-cyan-500/50 outline-none appearance-none"
              >
                <option value="All">All Categories</option>
                {dynamicCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add Task Input Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl relative group">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <FiPlus className="text-violet-500 dark:text-violet-400" /> Create New
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="What needs to be done?"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl px-5 py-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-[#1a1a1c] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all outline-none shadow-inner"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Category Dropdown / Custom Input */}
                  {isCustomCategory ? (
                    <div className="flex-1 relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <FiTag size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Type new category..."
                        className="w-full bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#1a1a1c] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none shadow-inner"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        autoFocus
                      />
                      <button 
                        onClick={() => { setIsCustomCategory(false); setSelectedCategory("General"); }} 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <FiTag size={16} />
                      </div>
                      <select 
                        className="w-full bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-600 dark:text-gray-300 focus:bg-white dark:focus:bg-[#1a1a1c] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none appearance-none shadow-inner"
                        value={selectedCategory}
                        onChange={(e) => {
                          if (e.target.value === "ADD_CUSTOM") {
                            setIsCustomCategory(true);
                            setSelectedCategory("");
                          } else {
                            setSelectedCategory(e.target.value);
                          }
                        }}
                      >
                        {dynamicCategories.map(c => <option key={c} value={c} className="bg-white dark:bg-[#0f0f11]">{c}</option>)}
                        <option value="ADD_CUSTOM" className="bg-white dark:bg-[#0f0f11] text-cyan-600 dark:text-cyan-400 font-bold">+ Add Custom...</option>
                      </select>
                    </div>
                  )}
                  
                  {/* Due Date Picker */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <FiCalendar size={16} />
                    </div>
                    <input 
                      type="date"
                      className="w-full bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-600 dark:text-gray-300 focus:bg-white dark:focus:bg-[#1a1a1c] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 outline-none shadow-inner dark:css-date-icon-fix"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <button
                  onClick={addTask}
                  disabled={adding || !title.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-[0_0_15px_rgba(139,92,246,0.3)] active:scale-95 mt-2"
                >
                  {adding ? (
                    <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    <>Add Task <FiArrowRight /></>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Task List Section */}
          <div className="lg:col-span-8 bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl flex flex-col h-[65vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiList className="text-cyan-500 dark:text-cyan-400" /> 
                {isFiltered ? "Filtered Results" : "My Tasks"}
              </h3>
              <span className="text-xs font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-full text-gray-500 dark:text-gray-400">
                {filteredTasks.length} items
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {filteredTasks.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-gray-400 dark:text-gray-500">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 dark:bg-white/5 mb-6 shadow-inner border border-gray-100 dark:border-transparent">
                    <FiSearch className="text-gray-400 dark:text-gray-600" size={32} />
                  </div>
                  <p className="text-lg">{isFiltered ? "No tasks match your filters." : "All caught up! You have no pending tasks."}</p>
                </motion.div>
              ) : (
                <Reorder.Group 
                  axis="y" 
                  values={isFiltered ? filteredTasks : tasks} 
                  onReorder={isFiltered ? () => {} : handleReorder} 
                  className="space-y-4"
                >
                  <AnimatePresence>
                    {filteredTasks.map((task) => (
                      <Reorder.Item 
                        key={task._id} 
                        value={task} 
                        drag={!isFiltered} // Disable drag if filtered to prevent weird ordering issues
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`group relative flex flex-col p-5 rounded-2xl border transition-colors duration-300 ${!isFiltered && "cursor-grab active:cursor-grabbing"} ${
                          task.completed 
                            ? "bg-gray-50 dark:bg-[#111113] border-gray-200 dark:border-white/5 opacity-60" 
                            : "bg-white dark:bg-[#1a1a1c]/80 border-gray-200 dark:border-white/10 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 shadow-sm"
                        }`}
                      >
                        {/* Task Main Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleComplete(task); }}
                              className="text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors focus:outline-none flex-shrink-0 mt-0.5"
                              disabled={loadingRows[task._id]?.complete}
                            >
                              {loadingRows[task._id]?.complete ? (
                                <span className="w-6 h-6 border-2 border-t-transparent border-cyan-500 dark:border-cyan-400 rounded-full animate-spin block"></span>
                              ) : task.completed ? (
                                <FiCheckCircle className="text-emerald-500" size={24} />
                              ) : (
                                <FiCircle size={24} />
                              )}
                            </button>
                            
                            <div className="flex flex-col flex-1 min-w-0">
                              <span className={`text-lg font-semibold truncate transition-all duration-300 ${task.completed ? "line-through text-gray-500" : "text-gray-900 dark:text-gray-100"}`}>
                                {task.title}
                              </span>
                              
                              {/* Metadata Row */}
                              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium">
                                {/* Category Badge */}
                                <span className={`px-2 py-0.5 rounded-md border ${getCategoryColor(task.category)}`}>
                                  {task.category || "General"}
                                </span>
                                
                                {/* Due Date */}
                                {task.dueDate && (
                                  <span className={`flex items-center gap-1 ${new Date(task.dueDate) < new Date() && !task.completed ? 'text-rose-500 dark:text-rose-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <FiCalendar /> {formatDate(task.dueDate)}
                                  </span>
                                )}

                                {/* Subtasks count */}
                                {(task.subtasks?.length > 0) && (
                                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors" onClick={() => toggleExpand(task._id)}>
                                    <FiList /> {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}
                              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
                              disabled={loadingRows[task._id]?.delete}
                            >
                              {loadingRows[task._id]?.delete ? (
                                <span className="w-4 h-4 border-2 border-t-transparent border-rose-500 rounded-full animate-spin block"></span>
                              ) : (
                                <FiTrash2 size={16} />
                              )}
                            </button>
                            
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleExpand(task._id); }}
                              className="p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mt-auto"
                            >
                              {expandedTasks.has(task._id) ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Area (Subtasks & Advanced Timestamps) */}
                        <AnimatePresence>
                          {expandedTasks.has(task._id) && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5 overflow-hidden cursor-default"
                            >
                              {/* Timestamps */}
                              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 bg-gray-50 dark:bg-white/5 p-2 rounded-lg inline-flex">
                                <span className="flex items-center gap-1" title="Created At">
                                  <FiPlus size={12}/> {formatDate(task.createdAt)}
                                </span>
                                {task.completedAt && (
                                  <span className="flex items-center gap-1 text-emerald-500/70" title="Completed At">
                                    <FiCheck size={12}/> {formatDate(task.completedAt)}
                                  </span>
                                )}
                              </div>

                              {/* Subtasks List */}
                              <div className="space-y-2 mb-3 pl-2">
                                {task.subtasks?.map(subtask => (
                                  <div key={subtask._id} className="flex items-center gap-3">
                                    <button 
                                      onClick={() => toggleSubtask(task._id, subtask._id)}
                                      className="text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400"
                                    >
                                      {subtask.completed ? <FiCheckCircle className="text-cyan-500" size={16} /> : <FiCircle size={16} />}
                                    </button>
                                    <span className={`text-sm ${subtask.completed ? 'text-gray-400 dark:text-gray-600 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                      {subtask.title}
                                    </span>
                                  </div>
                                ))}
                              </div>

                              {/* Add Subtask Input */}
                              <div className="flex gap-2 items-center pl-2 mt-4">
                                <input 
                                  type="text"
                                  placeholder="Add subtask..."
                                  className="flex-1 bg-transparent border-b border-gray-300 dark:border-white/10 pb-1 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:border-cyan-500/50 outline-none transition-colors"
                                  value={newSubtaskTitle[task._id] || ""}
                                  onChange={(e) => setNewSubtaskTitle(prev => ({ ...prev, [task._id]: e.target.value }))}
                                  onKeyDown={(e) => e.key === "Enter" && addSubtask(task._id)}
                                />
                                <button 
                                  onClick={() => addSubtask(task._id)}
                                  disabled={loadingRows[task._id]?.subtask}
                                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 p-1 bg-cyan-50 dark:bg-cyan-400/10 rounded disabled:opacity-50"
                                >
                                  {loadingRows[task._id]?.subtask ? (
                                    <span className="w-4 h-4 border border-t-transparent border-cyan-500 dark:border-cyan-400 rounded-full animate-spin block"></span>
                                  ) : (
                                    <FiPlus size={16} />
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              )}
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.5); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
        .dark .css-date-icon-fix::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.5; cursor: pointer; }
        .dark .css-date-icon-fix::-webkit-calendar-picker-indicator:hover { opacity: 0.8; }
      `}} />
    </div>
  );
};

export default TaskManager;
