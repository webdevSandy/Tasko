import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { FiActivity, FiCheckCircle, FiClock, FiList } from "react-icons/fi";
import { format, subDays, isSameDay } from "date-fns";

const Analytics = () => {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("https://tasko-io75.onrender.com/api/tasks", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks for analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[calc(100vh-80px)]">
        <span className="w-10 h-10 border-4 border-t-transparent border-violet-500 rounded-full animate-spin"></span>
      </div>
    );
  }

  // --- Metrics Calculation ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const overdueTasks = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;

  // --- Category Distribution Data (Pie Chart) ---
  const categoryCounts = tasks.reduce((acc, task) => {
    const cat = task.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map(key => ({
    name: key,
    value: categoryCounts[key]
  }));

  const COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

  // --- Activity Trend Data (Area Chart) ---
  // Last 7 days completion trend
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const completedOnDate = tasks.filter(t => t.completed && t.completedAt && isSameDay(new Date(t.completedAt), date)).length;
    trendData.push({
      name: format(date, 'EEE'), // e.g., 'Mon', 'Tue'
      completed: completedOnDate
    });
  }

  // --- Status Comparison Data (Bar Chart) ---
  const statusData = [
    { name: 'Pending', count: totalTasks - completedTasks, fill: '#f43f5e' },
    { name: 'Completed', count: completedTasks, fill: '#10b981' }
  ];

  return (
    <div className="w-full bg-transparent text-gray-900 dark:text-white pt-8 pb-16 px-6 font-sans min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Background Ambient Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/5 dark:bg-violet-600/10 blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Analytics Overview</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Visualize your productivity and track your progress.</p>
        </div>

        {/* KPI Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex items-center gap-4">
            <div className="p-3 bg-violet-50 dark:bg-violet-500/10 text-violet-500 rounded-xl">
              <FiList size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Tasks</p>
              <h3 className="text-2xl font-bold">{totalTasks}</h3>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl">
              <FiCheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed</p>
              <h3 className="text-2xl font-bold">{completedTasks}</h3>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex items-center gap-4">
            <div className="p-3 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-500 rounded-xl">
              <FiActivity size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completion Rate</p>
              <h3 className="text-2xl font-bold">{completionRate}%</h3>
            </div>
          </div>
          <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex items-center gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl">
              <FiClock size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Overdue</p>
              <h3 className="text-2xl font-bold text-rose-500">{overdueTasks}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Trend Chart */}
          <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex flex-col">
            <h3 className="text-lg font-bold mb-6">Activity Trend (Last 7 Days)</h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis dataKey="name" tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fill: '#9ca3af', fontSize: 12}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl flex flex-col">
            <h3 className="text-lg font-bold mb-6">Task Distribution</h3>
            <div className="flex-1 min-h-[300px] flex items-center justify-center">
              {categoryData.length === 0 ? (
                <p className="text-gray-500">No data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl dark:shadow-2xl lg:col-span-2 flex flex-col">
            <h3 className="text-lg font-bold mb-6">Completion Status</h3>
            <div className="min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(156, 163, 175, 0.2)" />
                  <XAxis type="number" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{fill: '#9ca3af', fontWeight: 'bold'}} axisLine={false} tickLine={false} width={80} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={40}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;
