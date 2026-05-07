import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FiCheckCircle, FiUsers, FiList, FiZap, FiArrowRight, FiShield, FiActivity } from "react-icons/fi";

const LandingPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
  });

  // Mouse tracker state
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for the tracker
  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/public/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();

    // Mouse move listener for the tracker
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-transparent text-gray-900 dark:text-white flex flex-col items-center w-full font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      
      {/* Animated Mouse Tracker Background */}
      <motion.div
        className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-600/10 to-violet-600/10 dark:from-cyan-600/30 dark:to-violet-600/30 blur-[120px] pointer-events-none z-0"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      />

      {/* Static ambient lighting */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-900/10 dark:bg-violet-900/20 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/10 dark:bg-cyan-900/20 blur-[150px] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-screen z-0"></div>

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 lg:py-48 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md mb-8 shadow-inner"
        >
          <FiZap className="text-cyan-500 dark:text-cyan-400" />
          <span className="text-sm font-semibold tracking-wide text-gray-600 dark:text-gray-300 uppercase">Tasko 2.0 is live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-[1.1]"
        >
          Master your time. <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-cyan-500 to-fuchsia-500 dark:from-violet-400 dark:via-cyan-400 dark:to-fuchsia-400">
            Design your life.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl font-light"
        >
          Tasko is the beautifully simple, powerfully intuitive way to manage your daily tasks, collaborate effortlessly, and boost your productivity.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-5"
        >
          <Link to="/register" className="relative group overflow-hidden rounded-full p-[1px] shadow-lg">
            <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-cyan-500 to-fuchsia-500 rounded-full blur-sm opacity-80 group-hover:opacity-100 transition duration-500"></span>
            <div className="relative bg-gray-900 dark:bg-[#050505] text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 group-hover:bg-transparent transition-all duration-300">
              Start for free <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link to="/login" className="px-8 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2">
            Sign In <FiShield />
          </Link>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 w-full py-24 border-y border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-[#0a0a0c]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Trusted by pioneers</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg font-light">Join thousands of high-performers already using Tasko.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="mx-auto w-16 h-16 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <FiUsers size={28} />
              </div>
              <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{stats.totalUsers.toLocaleString()}+</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-sm">Active Users</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="mx-auto w-16 h-16 bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <FiList size={28} />
              </div>
              <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{stats.totalTasks.toLocaleString()}+</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-sm">Tasks Created</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 bg-white dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl backdrop-blur-md relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="mx-auto w-16 h-16 bg-fuchsia-50 dark:bg-fuchsia-500/10 border border-fuchsia-100 dark:border-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <FiCheckCircle size={28} />
              </div>
              <h3 className="text-5xl font-black text-gray-900 dark:text-white mb-2">{stats.completedTasks.toLocaleString()}+</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest text-sm">Tasks Completed</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Highlight */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-50 dark:from-violet-600/20 dark:to-cyan-500/20 border border-gray-200 dark:border-white/10 mb-8 shadow-inner">
            <FiActivity className="text-cyan-600 dark:text-cyan-400" size={24} />
          </div>
          <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">Real-time sync.<br/>Zero latency.</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 font-light leading-relaxed">
            Experience task management that updates instantly. Built on cutting-edge WebSockets, whenever you check off a task, your entire team stays seamlessly in sync.
          </p>
          <ul className="space-y-6">
            {[
              { text: 'Lightning fast React frontend', color: 'text-cyan-600 dark:text-cyan-400' },
              { text: 'Live WebSockets infrastructure', color: 'text-violet-600 dark:text-violet-400' },
              { text: 'Bank-grade JWT authentication', color: 'text-fuchsia-600 dark:text-fuchsia-400' }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 text-gray-700 dark:text-gray-300 text-lg font-medium">
                <div className={`w-6 h-6 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-inner`}>
                  <FiCheckCircle className={item.color} size={14} />
                </div>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Abstract UI Mockup */}
        <div className="flex-1 w-full relative group perspective">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 blur-[100px] -z-10 group-hover:opacity-100 opacity-70 transition-opacity duration-500"></div>
          
          <motion.div 
            whileHover={{ rotateY: 5, rotateX: 5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white/90 dark:bg-[#0f0f11]/90 backdrop-blur-2xl rounded-[2rem] border border-gray-200 dark:border-white/10 p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-100 dark:border-cyan-400/20">Live Sync</span>
            </div>
            
            {/* Tasks List Mockup */}
            <div className="space-y-4">
              {[
                { active: true, title: "Design new landing page", color: "from-cyan-500 to-blue-500" },
                { active: false, title: "Implement WebSocket logic", color: "from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600" },
                { active: false, title: "Deploy to production server", color: "from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600" }
              ].map((task, i) => (
                <div key={i} className={`flex items-center gap-4 p-5 rounded-2xl border ${task.active ? 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10' : 'bg-transparent border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.active ? 'border-cyan-500 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-400/20' : 'border-gray-300 dark:border-gray-600'}`}>
                    {task.active && <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 dark:bg-cyan-400"></div>}
                  </div>
                  <div className="flex-1">
                    <div className={`h-2.5 rounded-full bg-gradient-to-r ${task.color} w-3/4 mb-2`}></div>
                    <div className={`h-2 rounded-full bg-gray-200 dark:bg-gray-700 ${task.active ? 'w-1/2' : 'w-1/3'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
