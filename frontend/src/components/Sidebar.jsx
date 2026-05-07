import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { 
  FiHome, FiCheckSquare, FiPieChart, FiSettings, 
  FiLogOut, FiSun, FiMoon, FiZap, FiCalendar
} from "react-icons/fi";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Tasks", path: "/tasks", icon: <FiCheckSquare size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <FiCalendar size={20} /> },
    { name: "Analytics", path: "/analytics", icon: <FiPieChart size={20} /> },
    { name: "Settings", path: "/settings", icon: <FiSettings size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-[#0a0a0c] border-r border-gray-200 dark:border-white/10 flex flex-col justify-between hidden md:flex sticky top-0 transition-colors duration-300">
      
      {/* Brand & Nav */}
      <div>
        <div className="h-20 flex items-center px-8 border-b border-gray-200 dark:border-white/10">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-violet-600 to-cyan-500 p-2 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform">
              <FiZap size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Tasko CRM</span>
          </Link>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? "bg-violet-500/10 dark:bg-cyan-500/10 text-violet-600 dark:text-cyan-400" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Theme Toggle & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-white/10 space-y-2">
        
        {/* User Info */}
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "user@tasko.io"}</p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all font-medium"
        >
          {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all font-medium"
        >
          <FiLogOut size={20} />
          Sign Out
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
