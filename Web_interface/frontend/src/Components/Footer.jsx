import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getIsAuthed, subscribeAuth } from "../utils/auth";
import { Gavel } from "lucide-react";

function Footer() {
    const [isAuthed, setIsAuthed] = useState(() => getIsAuthed());

    useEffect(() => {
        return subscribeAuth(setIsAuthed);
    }, []);

    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-[color:var(--border)] bg-[color:var(--bg)] text-[color:var(--text-h)]">
            <div className="mx-auto max-w-6xl px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    
                    {/* Brand Section */}
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 mb-4">
                            <div className="bg-cyan-600/20 p-2 rounded-lg border border-cyan-500/30">
                                <Gavel size={18} className="text-cyan-400" />
                            </div>
                            <span className="text-xl font-black tracking-tighter uppercase italic">
                                PAK <span className="text-cyan-500">JUSTICE</span>
                            </span>
                        </Link>
                        <p className="text-[color:var(--text)] text-xs leading-relaxed max-w-sm">
                            Educational guidance about Pakistan legal topics and workflows. 
                            <span className="block mt-2 text-slate-500 italic">Not legal advice.</span>
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <p className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4">Quick Links</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <Link to="/" className="text-[color:var(--text)] hover:text-[color:var(--text-h)] transition-colors">
                                Home
                            </Link>
                            <Link to="/about" className="text-[color:var(--text)] hover:text-[color:var(--text-h)] transition-colors">
                                About Us
                            </Link>
                            <Link to="/libraries" className="text-[color:var(--text)] hover:text-[color:var(--text-h)] transition-colors">
                                Libraries
                            </Link>
                            <Link to="/contact" className="text-[color:var(--text)] hover:text-[color:var(--text-h)] transition-colors">
                                Contact Us
                            </Link>
                            {!isAuthed && (
                                <>
                                    <Link to="/signin" className="text-[color:var(--text)] hover:text-[color:var(--text-h)] transition-colors">
                                        Sign in
                                    </Link>
                                    <Link to="/register" className="text-[color:var(--text)] hover:text-[color:var(--text-h)] transition-colors">
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Project Info */}
                    <div>
                        <p className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4">Project</p>
                        <div className="space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Use the chatbot to understand concepts, prepare questions, and organize next steps.
                            </p>
                            {!isAuthed && (
                                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                                    <p className="text-xs text-cyan-300 flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                        Tip: Sign in to unlock the chatbot.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-t border-[color:var(--border)] pt-8">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">© {year} pakJustice. All rights reserved.</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">
                        For urgent matters, consult a qualified lawyer.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;