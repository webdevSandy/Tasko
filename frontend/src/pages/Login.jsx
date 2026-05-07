import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiZap, FiStar, FiHexagon } from "react-icons/fi";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://tasko-io75.onrender.com/api/auth/login",
        { email, password }
      );

      login(res.data.token, res.data.user);
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center relative overflow-hidden font-sans selection:bg-cyan-500/30 pt-20 pb-12">
      {loading && <Loader />}
      
      {/* Abstract Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 dark:opacity-20 pointer-events-none mix-blend-screen"></div>

      {/* Animated Floating Icons on the Side */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[15%] top-[30%] text-cyan-500/40 hidden lg:block pointer-events-none"
      >
        <FiHexagon size={120} strokeWidth={1} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-[15%] bottom-[30%] text-violet-500/40 hidden lg:block pointer-events-none"
      >
        <FiStar size={100} strokeWidth={1} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-8 relative z-10"
      >
        {/* Glow effect behind card */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-white/5 to-transparent rounded-3xl blur-xl opacity-50 -z-10"></div>
        
        <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
          {/* Subtle border top glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

          <div className="text-center mb-10">
            <motion.div 
              animate={{ boxShadow: ["0px 0px 0px rgba(34,211,238,0)", "0px 0px 20px rgba(34,211,238,0.4)", "0px 0px 0px rgba(34,211,238,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/10 to-cyan-500/10 dark:from-violet-600/20 dark:to-cyan-500/20 border border-gray-200 dark:border-white/10 mb-6 shadow-inner"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <FiZap className="text-cyan-500 dark:text-cyan-400" size={28} />
              </motion.div>
            </motion.div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your credentials to access your workspace</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl text-sm mb-6 flex items-center gap-3 backdrop-blur-md"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <motion.div 
                  whileFocus={{ scale: 1.1 }}
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-cyan-500 transition-colors"
                >
                  <FiMail size={18} />
                </motion.div>
                <input
                  type="email"
                  placeholder="hello@tasko.io"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-[#1a1a1c] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all outline-none shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors font-medium">Forgot?</a>
              </div>
              <div className="relative group">
                <motion.div 
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-cyan-500 transition-colors"
                >
                  <FiLock size={18} />
                </motion.div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-[#1a1a1c] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all outline-none shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full relative mt-8 flex items-center justify-center gap-2 bg-gray-900 text-white dark:bg-white dark:text-black font-bold py-3.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden group/btn"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-400 opacity-0 group-hover/btn:opacity-20 dark:group-hover/btn:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center gap-2 z-10">
                Sign In <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-gray-900 dark:text-white font-medium hover:text-cyan-500 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
