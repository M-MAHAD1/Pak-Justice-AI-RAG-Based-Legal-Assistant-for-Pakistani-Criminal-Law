import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Auth from "../Components/Auth.jsx";
import { motion } from "framer-motion";
import { AlertCircle, User, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";

function Register() {
    const navigate = useNavigate();
    
    // Form State
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setError("");
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data?.message || "Registration failed");
                return;
            }

            navigate("/signin");
        } catch (err) {
            setError(err?.message || "Failed to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[color:var(--bg)] text-[color:var(--text-h)] font-sans overflow-hidden">
            
            
            <div 
                className="pointer-events-none fixed inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: `radial-gradient(color-mix(in oklab, var(--text-h) 18%, transparent) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div 
                className="pointer-events-none fixed inset-0 z-0 transition duration-200"
                style={{
                    background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.08), transparent 70%)`
                }}
            />

            <motion.div 
                initial={{ x: -50, y: -50 }}
                animate={{ 
                    x: [0, 30, 0], 
                    y: [0, -30, 0],
                    rotate: [0, 20, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"
            />
            
            <motion.div 
                initial={{ x: 50, y: 50 }}
                animate={{ 
                    x: [0, -40, 0], 
                    y: [0, 40, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/10 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-white/5 rounded-full animate-[spin_60s_linear_infinite] pointer-events-none" />

            <div className="relative z-10 min-h-screen flex items-center justify-center pt-28 md:pt-32 pb-16 px-4">
                
                <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                            <UserPlus size={28} className="text-cyan-400" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--text-h)]">Create Account</h2>
                        <p className="text-[color:var(--text)] text-sm mt-2">Join pakJustice to explore AI legal guidance</p>
                    </div>

                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg)]/70 backdrop-blur-xl p-8 shadow-2xl shadow-cyan-500/5">
                        
                        <form onSubmit={handleRegister} className="space-y-4">
                            
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3" 
                                    role="alert"
                                >
                                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-red-300">Registration Failed</p>
                                        <p className="text-xs text-red-200 mt-0.5">{error}</p>
                                    </div>
                                </motion.div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-[color:var(--text)] mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={16} className="text-[color:var(--text)]/60" />
                                    </div>
                                    <input
                                        type="text"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full bg-[color:var(--code-bg)]/70 border border-[color:var(--border)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[color:var(--text-h)] placeholder:text-[color:var(--text)]/60 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                        placeholder="Choose a username"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[color:var(--text)] mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={16} className="text-[color:var(--text)]/60" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-[color:var(--code-bg)]/70 border border-[color:var(--border)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[color:var(--text-h)] placeholder:text-[color:var(--text)]/60 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                        placeholder="yourname@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[color:var(--text)] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-[color:var(--text)]/60" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-[color:var(--code-bg)]/70 border border-[color:var(--border)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[color:var(--text-h)] placeholder:text-[color:var(--text)]/60 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-[color:var(--text)] mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={16} className="text-[color:var(--text)]/60" />
                                    </div>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-[color:var(--code-bg)]/70 border border-[color:var(--border)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[color:var(--text-h)] placeholder:text-[color:var(--text)]/60 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-3 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-cyan-500/10 mt-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Registering...
                                    </span>
                                ) : (
                                    <>
                                        Create Account <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="my-6 flex items-center gap-3">
                            <hr className="flex-1 border-[color:var(--border)]" />
                            <span className="text-xs text-[color:var(--text)] uppercase tracking-wider">or</span>
                            <hr className="flex-1 border-[color:var(--border)]" />
                        </div>

                        <Auth onError={setError} />

                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-[color:var(--text)]">
                            Already have an account?{" "}
                            <Link to="/signin" className="text-cyan-400 hover:underline font-medium">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default Register;