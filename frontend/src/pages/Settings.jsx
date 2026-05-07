import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUser, FiMail, FiLock, FiBell, FiShield, 
  FiCheckCircle, FiLogOut, FiGlobe, FiSmartphone
} from "react-icons/fi";

const Settings = () => {
  const { user, token, logout, updateUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [emailNotifications, setEmailNotifications] = useState(user?.preferences?.emailNotifications || false);
  const [pushNotifications, setPushNotifications] = useState(user?.preferences?.pushNotifications || false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Parse the member since date if it exists, otherwise just show a placeholder
  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Just Now";

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.put(
        "https://tasko-io75.onrender.com/api/users/profile",
        {
          name,
          preferences: {
            emailNotifications,
            pushNotifications
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      updateUser(res.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to update profile." });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-transparent text-gray-900 dark:text-white pt-8 pb-16 px-6 font-sans min-h-[calc(100vh-80px)] relative overflow-hidden">
      
      {/* Background Ambient Effects */}
      <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-rose-600/5 dark:bg-rose-600/10 blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Account Settings</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your profile, preferences, and security.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Sidebar (Navigation Mockup) */}
          <div className="md:col-span-4 space-y-2">
            {[
              { icon: FiUser, label: "Public Profile", active: true },
              { icon: FiLock, label: "Password & Security", active: false },
              { icon: FiBell, label: "Notifications", active: false },
              { icon: FiGlobe, label: "Integrations", active: false },
            ].map((item, i) => (
              <button 
                key={i}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  item.active 
                    ? "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-white/10">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <FiLogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Global Message Banner */}
            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-xl flex items-center gap-3 font-semibold text-sm border ${
                    message.type === 'success' 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                  }`}
                >
                  {message.type === 'success' ? <FiCheckCircle size={20} /> : <FiLock size={20} />}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Card */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiUser className="text-violet-500" /> Personal Information
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-white/10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-500 p-1 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#1a1a1c] flex items-center justify-center text-3xl font-bold text-gray-900 dark:text-white">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || "User Name"}</h4>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Tasko Member since {memberSince}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#1a1a1c]/50 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ""}
                      disabled
                      className="w-full bg-gray-100 dark:bg-[#1a1a1c]/30 border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm text-gray-500 dark:text-gray-500 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-300 text-sm shadow-lg shadow-violet-500/20 flex items-center justify-center min-w-[140px] mt-4"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </motion.div>

            {/* Preferences Section */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-xl dark:shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiShield className="text-cyan-500" /> Notifications & Alerts
              </h3>
              
              <div className="space-y-6">
                
                {/* Email Notifications Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${emailNotifications ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>
                      <FiMail size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Email Notifications</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive daily summaries of your tasks.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${emailNotifications ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-300 ${emailNotifications ? 'right-1 translate-x-0' : 'left-1 translate-x-0'}`}></div>
                  </button>
                </div>

                {/* Push Notifications Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${pushNotifications ? 'bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300'}`}>
                      <FiSmartphone size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Push Notifications</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Get real-time updates when tasks are updated.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${pushNotifications ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-300 ${pushNotifications ? 'right-1 translate-x-0' : 'left-1 translate-x-0'}`}></div>
                  </button>
                </div>

              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all duration-300 text-sm shadow-lg shadow-violet-500/20 flex items-center justify-center min-w-[140px]"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    "Save Preferences"
                  )}
                </button>
              </div>

            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
