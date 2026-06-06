import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getIsAuthed, clearAuth, subscribeAuth } from "../utils/auth";
import { motion } from "framer-motion";
import { User, LogOut, AlertCircle } from "lucide-react";

function Profile() {
  const [isAuthed, setIsAuthed] = useState(() => getIsAuthed());
  const navigate = useNavigate();

  // Sync auth state
  useEffect(() => {
    return subscribeAuth(setIsAuthed);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {
    }

    clearAuth();
    navigate("/"); 
  };

  return (
        <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] font-sans pt-28 md:pt-32 pb-16">
        
        {/* Background Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="fixed top-1/3 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-6 lg:px-32 flex justify-center">
            
            <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] backdrop-blur-xl p-8 shadow-2xl text-center">
                    
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                        <User size={32} className="text-cyan-400" />
                    </div>

                    {isAuthed ? (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--text-h)] mb-2">My Profile</h2>
                            <p className="text-slate-400 text-sm mb-8">
                                You are securely logged in. Manage your account settings below.
                            </p>

                            {/* Placeholder for user info */}
                            <div className="w-full p-4 rounded-lg bg-[color:var(--bg)] border border-[color:var(--border)] mb-6 text-left">
                                <p className="text-xs text-slate-500">Status</p>
                                <p className="text-sm text-emerald-400 flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Verified User
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold py-3 rounded-lg transition-colors"
                            >
                                <LogOut size={18} /> Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--text-h)] mb-2">Access Denied</h2>
                            <p className="text-slate-400 text-sm mb-8">
                                You need to be signed in to view this page.
                            </p>

                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 text-left flex items-start gap-3">
                                <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-200">
                                    Please sign in to access your profile and saved data.
                                </p>
                            </div>

                            <Link
                                to="/signin"
                                className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-cyan-500/10"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    </div>
  );
}

export default Profile;
