import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogOut, FiUser, FiZap, FiMenu, FiX, FiActivity, FiSun, FiMoon } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 py-4 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-lg">
            <FiZap size={20} className="drop-shadow-md" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tighter">
              Tasko<span className="text-cyan-500 dark:text-cyan-400">.</span>
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-white/10"></div>

          {user ? (
            <>
              <Link 
                to="/tasks" 
                className={`relative font-medium text-sm transition-all duration-300 ${location.pathname === '/tasks' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Dashboard
                {location.pathname === '/tasks' && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyan-500 dark:bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                )}
              </Link>
              <div className="flex items-center gap-5 ml-4">
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm backdrop-blur-md">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-inner">
                    <FiUser size={12} />
                  </div>
                  <span className="font-medium tracking-wide">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                >
                  <FiLogOut size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="relative px-6 py-2.5 rounded-full text-sm font-semibold text-white group overflow-hidden shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-[1px] bg-white dark:bg-[#0a0a0a] rounded-full group-hover:bg-opacity-0 transition-all duration-300"></div>
                <span className="relative flex items-center gap-2 text-gray-900 dark:text-white group-hover:text-white transition-colors">
                  Get Started <FiActivity size={14} className="group-hover:animate-pulse" />
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-300">
            {theme === "dark" ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
          <button 
            className="relative z-50 p-2 text-gray-900 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 md:hidden bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-3xl border-b border-gray-200 dark:border-white/10"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {user ? (
                <>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white">
                      <FiUser size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest">Welcome</p>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{user.name}</p>
                    </div>
                  </div>
                  <Link 
                    to="/tasks" 
                    className="flex items-center gap-3 p-4 font-medium text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiZap className="text-cyan-500" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full p-4 font-semibold text-rose-500 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl border border-rose-200 dark:border-rose-500/20 transition-all mt-4"
                  >
                    <FiLogOut />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4 mt-2">
                  <Link
                    to="/login"
                    className="w-full text-center p-4 font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center p-4 font-bold text-white bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
