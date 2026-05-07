import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight, FiZap, FiActivity, FiLayers } from "react-icons/fi";

const Register = () => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "https://tasko-io75.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      login(res.data.token, res.data.user);
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center relative overflow-hidden font-sans selection:bg-violet-500/30 pt-20 pb-12">
      {loading && <Loader />}
      
      {/* Abstract Background Effects */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 dark:opacity-20 pointer-events-none mix-blend-screen"></div>

      {/* Animated Floating Icons on the Side */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[10%] bottom-[20%] text-fuchsia-500/30 hidden lg:block pointer-events-none"
      >
        <FiActivity size={150} strokeWidth={1} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute right-[12%] top-[20%] text-violet-500/30 hidden lg:block pointer-events-none"
      >
        <FiLayers size={130} strokeWidth={1} />
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
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"></div>

          <div className="text-center mb-10">
            <motion.div 
              animate={{ boxShadow: ["0px 0px 0px rgba(139,92,246,0)", "0px 0px 20px rgba(139,92,246,0.4)", "0px 0px 0px rgba(139,92,246,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-600/10 to-violet-500/10 dark:from-fuchsia-600/20 dark:to-violet-500/20 border border-gray-200 dark:border-white/10 mb-6 shadow-inner"
            >
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <FiZap className="text-fuchsia-500 dark:text-fuchsia-400" size={28} />
              </motion.div>
            </motion.div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Join Tasko and supercharge your workflow</p>
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

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-violet-500 transition-colors">
                  <FiUser size={18} />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-[#1a1a1c] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all outline-none shadow-inner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-violet-500 transition-colors">
                  <FiMail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="hello@tasko.io"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-[#1a1a1c] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all outline-none shadow-inner"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-violet-500 transition-colors">
                  <FiLock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:bg-white dark:focus:bg-[#1a1a1c] focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all outline-none shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full relative mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.3)] dark:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              disabled={loading}
            >
              <span className="relative flex items-center gap-2 z-10">
                Create Account <FiArrowRight />
              </span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-gray-900 dark:text-white font-medium hover:text-violet-500 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
