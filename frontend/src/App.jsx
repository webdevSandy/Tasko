import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TaskManager from "./pages/TaskManager";
import ProtectedRoute from "./pages/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar /> {/* ✅ Always visible */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskManager />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
