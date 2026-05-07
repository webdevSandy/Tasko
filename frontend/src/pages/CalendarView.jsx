import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isToday, parseISO
} from "date-fns";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const CalendarView = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("https://tasko-io75.onrender.com/api/tasks", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks for calendar:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // --- Calendar Grid Logic ---
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const renderDaysOfWeek = () => {
    const days = [];
    const dateFormat = "EEEE";
    let startDateOfWeek = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center font-bold text-sm text-gray-500 uppercase tracking-widest py-4" key={i}>
          {format(addDays(startDateOfWeek, i), dateFormat).substring(0, 3)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 border-b border-gray-200 dark:border-white/10">{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        // Find tasks for this specific day
        const dayTasks = tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), cloneDay));
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-white/10 transition-colors cursor-pointer
              ${!isCurrentMonth ? "bg-gray-50 dark:bg-[#111113] opacity-50" : "bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5"}
              ${isSameDay(day, selectedDate) ? "bg-violet-50/50 dark:bg-violet-900/20" : ""}
            `}
            key={day}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                ${isToday(day) ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30" : "text-gray-600 dark:text-gray-300"}
              `}>
                {formattedDate}
              </span>
              {dayTasks.length > 0 && (
                <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                  {dayTasks.length}
                </span>
              )}
            </div>

            <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
              {dayTasks.map(task => (
                <div 
                  key={task._id} 
                  className={`text-xs p-1.5 rounded-md truncate transition-all duration-300 ${
                    task.completed 
                      ? "bg-gray-100 dark:bg-white/5 text-gray-500 line-through" 
                      : "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-medium border border-cyan-100 dark:border-cyan-500/20 shadow-sm"
                  }`}
                  title={task.title}
                >
                  {task.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="border-l border-t border-gray-200 dark:border-white/10 rounded-b-2xl overflow-hidden">{rows}</div>;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[calc(100vh-80px)]">
        <span className="w-10 h-10 border-4 border-t-transparent border-violet-500 rounded-full animate-spin"></span>
      </div>
    );
  }

  // Details for selected date
  const selectedDayTasks = tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), selectedDate));

  return (
    <div className="w-full bg-transparent text-gray-900 dark:text-white pt-8 pb-16 px-6 font-sans min-h-[calc(100vh-80px)] relative overflow-hidden flex gap-8 flex-col xl:flex-row">
      {/* Background Ambient Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/5 dark:bg-cyan-600/10 blur-[150px] pointer-events-none z-0"></div>

      {/* Main Calendar Area */}
      <div className="flex-1 relative z-10 space-y-6">
        <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <FiCalendar className="text-violet-500" />
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your schedule and deadlines.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={prevMonth}
                className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <FiChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 font-bold bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                Today
              </button>
              <button 
                onClick={nextMonth}
                className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="bg-white/50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
            {renderDaysOfWeek()}
            {renderCells()}
          </div>
        </div>
      </div>

      {/* Sidebar Focus View */}
      <div className="w-full xl:w-96 relative z-10 shrink-0">
        <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl sticky top-8">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            Schedule
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium text-lg">
            {isToday(selectedDate) ? "Today, " : ""}{format(selectedDate, "MMM do, yyyy")}
          </p>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {selectedDayTasks.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10"
                >
                  <p className="text-gray-500">No tasks due on this date.</p>
                </motion.div>
              ) : (
                selectedDayTasks.map(task => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border ${
                      task.completed ? "bg-gray-50 dark:bg-[#111113] border-gray-200 dark:border-white/5 opacity-60" : "bg-white dark:bg-[#1a1a1c]/80 border-cyan-200 dark:border-cyan-500/30 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-gray-400' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}`}></div>
                      <h4 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
                    </div>
                    {task.category && (
                      <span className="inline-block mt-3 text-xs font-bold px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                        {task.category}
                      </span>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
};

export default CalendarView;
