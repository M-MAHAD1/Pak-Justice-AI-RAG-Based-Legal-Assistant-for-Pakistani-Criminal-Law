import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Gavel, Menu, Moon, Sun, User, X } from "lucide-react";
import { motion } from "framer-motion";
import { getIsAuthed, subscribeAuth } from "../utils/auth";
import { getTheme, subscribeTheme, toggleTheme } from "../utils/theme";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(() => getIsAuthed());
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => {
    return subscribeAuth(setIsAuthed);
  }, []);

  useEffect(() => {
    return subscribeTheme(setTheme);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Chatbot", path: "/chat" },
    { name: "Libraries", path: "/libraries" }, 
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] py-4 md:py-6 px-4 md:px-16 lg:px-32">
      <nav className="flex items-center justify-between w-full rounded-full border border-[color:var(--border)] bg-[color:var(--bg)]/70 backdrop-blur-2xl px-6 md:px-10 py-3 md:py-4 shadow-2xl">
        
        <NavLink to="/" className="flex items-center gap-2 md:gap-3 z-10">
          <div className="bg-cyan-600 p-2 rounded-xl shadow-[0_0_15px_rgba(8,145,178,0.4)]">
            <Gavel size={20} className="text-white" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-[color:var(--text-h)] uppercase italic">
            PAK <span className="text-cyan-500">JUSTICE</span>
          </span>
        </NavLink>

        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                text-[11px] font-bold tracking-[0.2em] uppercase transition-colors
                ${isActive ? 'text-cyan-500' : 'text-[color:var(--text)] hover:text-[color:var(--text-h)]'}
              `}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.92, rotate: theme === "dark" ? 10 : -10 }}
            className="group relative inline-flex items-center justify-center rounded-full p-[1px] bg-gradient-to-r from-cyan-400/40 to-emerald-500/40 hover:from-cyan-400/70 hover:to-emerald-500/70 transition-colors"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--bg)]/80 backdrop-blur-2xl border border-[color:var(--border)] shadow-2xl">
              {theme === "dark" ? (
                <Sun size={18} className="text-[color:var(--text-h)]/90 group-hover:text-[color:var(--text-h)] transition-colors" />
              ) : (
                <Moon size={18} className="text-[color:var(--text-h)]/90 group-hover:text-[color:var(--text-h)] transition-colors" />
              )}
            </span>
          </motion.button>

          {isAuthed ? (
            <Link
              to="/profile"
              aria-label="Open profile"
              className="group relative inline-flex items-center justify-center rounded-full p-[1px] bg-gradient-to-r from-cyan-400/50 to-emerald-500/50 hover:from-cyan-400 hover:to-emerald-500 transition-colors"
            >
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--bg)]/80 backdrop-blur-2xl border border-[color:var(--border)] shadow-2xl">
                <User size={18} className="text-white/90 group-hover:text-white transition-colors" />
                <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[color:var(--bg)]/80" />
              </span>
            </Link>
          ) : (
            <>
              <Link to="/signin" className="text-[11px] font-bold text-[color:var(--text)] hover:text-[color:var(--text-h)] uppercase tracking-widest">
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="group relative px-6 py-2.5 bg-cyan-600 text-white text-[11px] font-black rounded-full transition-all overflow-hidden border border-cyan-500/50"
              >
                <span className="relative z-10">Sign Up</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </>
          )}
        </div>

        <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="lg:hidden text-[color:var(--text-h)] z-10 p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-4 right-4 mt-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg)]/95 backdrop-blur-2xl p-6 shadow-2xl lg:hidden"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) => `
                      text-sm font-bold tracking-widest uppercase transition-colors
                      ${isActive ? 'text-cyan-500' : 'text-[color:var(--text)] hover:text-[color:var(--text-h)]'}
                    `}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <motion.button
                  type="button"
                  onClick={toggleTheme}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center justify-center gap-2 text-center text-sm font-bold text-[color:var(--text-h)] uppercase tracking-widest py-3 rounded-full border border-[color:var(--border)] hover:bg-black/5"
                >
                  {theme === "dark" ? <Sun size={16} className="text-cyan-400" /> : <Moon size={16} className="text-cyan-400" />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </motion.button>

                {isAuthed ? (
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 text-center text-sm font-bold text-[color:var(--text-h)] uppercase tracking-widest py-3 rounded-full border border-[color:var(--border)] hover:bg-black/5"
                  >
                    <User size={16} className="text-cyan-400" /> Profile
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/signin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-center text-sm font-bold text-[color:var(--text-h)] uppercase tracking-widest py-2 rounded-lg border border-[color:var(--border)] hover:bg-black/5"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register"
                      onClick={() => setIsMenuOpen(false)} 
                      className="text-center bg-cyan-600 text-white text-sm font-bold uppercase tracking-widest py-3 rounded-full transition-all border border-cyan-500/50"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
    </header>
  );
}

export default Header;