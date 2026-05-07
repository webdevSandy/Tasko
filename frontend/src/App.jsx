import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskManager from "./pages/TaskManager";
import Analytics from "./pages/Analytics";
import CalendarView from "./pages/CalendarView";
import Settings from "./pages/Settings";
import DashboardLayout from "./components/DashboardLayout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// A layout for public pages (Landing, Login, Register) that includes the main Navbar
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#050505] transition-colors duration-300 text-gray-900 dark:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
