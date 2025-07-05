// src/components/Navbar.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <div>
        <h1 className="text-3xl font-bold">
          <Link to="/tasks">🧠 Tasko</Link>
        </h1>
        <p>A real-time task management App</p>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden sm:inline">
              Welcome, <strong>{user.name}</strong>
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
