import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FileText, Calendar, ArrowRight, AlertCircle, Users, 
    Gavel, Building, Landmark, ShoppingBag, Briefcase, Clock, X 
} from "lucide-react";

const LS_DOCS_KEY = "pj_docs";
const API_BASE_URL = (() => {
    return (import.meta?.env?.VITE_SERVER_BASE_URL || "http://localhost:3000").trim().replace(/\/+$/, "");
})();

// --- Helper Functions ---
function safeParseJson(value, fallback) {
    try {
        if (!value) return fallback;
        const parsed = JSON.parse(value);
        return parsed ?? fallback;
    } catch { return fallback; }
}

function formatDateTime(iso) {
    try {
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return iso;
        return d.toLocaleString();
    } catch { return iso; }
}


function dataUrlToBlob(dataUrl) {
    const str = String(dataUrl ?? "");
    const comma = str.indexOf(",");
    if (comma < 0) throw new Error("invalid_data_url");

    const header = str.slice(0, comma);
    const body = str.slice(comma + 1);
    const isBase64 = /;base64/i.test(header);
    const mimeMatch = header.match(/^data:([^;]+)/i);
    const mime = mimeMatch?.[1] || "application/octet-stream";

    if (!isBase64) {
        return new Blob([decodeURIComponent(body)], { type: mime });
    }

    const binary = atob(body);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}

// --- Main Component ---
function Libraries() {
    const [posts, setPosts] = useState([]);
    const [docs, setDocs] = useState([]);
    const [docOpenUrls, setDocOpenUrls] = useState({});
    const [isCriminalOpen, setIsCriminalOpen] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadDocs = () => {
            try {
                const d = safeParseJson(localStorage.getItem(LS_DOCS_KEY), []);
                setDocs(Array.isArray(d) ? d : []);
            } catch {
                setDocs([]);
            }
        };

        loadDocs();
        const onStorage = (e) => {
            if (e.key === LS_DOCS_KEY) loadDocs();
        };
        window.addEventListener("storage", onStorage);

        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/posts`);
                const data = await response.json().catch(() => ({}));
                if (!response.ok) {
                    if (!cancelled) setPosts([]);
                    return;
                }
                const next = Array.isArray(data?.posts) ? data.posts : [];
                if (!cancelled) setPosts(next);
            } catch {
                if (!cancelled) setPosts([]);
            }
        })();

        return () => {
            cancelled = true;
            window.removeEventListener("storage", onStorage);
        };
    }, []);

    useEffect(() => {
        const next = {};
        const toRevoke = [];

        for (const d of docs) {
            const id = d?.id;
            if (!id) continue;
            try {
                const blob = dataUrlToBlob(d?.dataUrl);
                const url = URL.createObjectURL(blob);
                next[id] = url;
                toRevoke.push(url);
            } catch {
                // Fallback to raw dataUrl if conversion fails.
                if (d?.dataUrl) next[id] = d.dataUrl;
            }
        }

        setDocOpenUrls(next);
        return () => {
            for (const url of toRevoke) {
                try { URL.revokeObjectURL(url); } catch {}
            }
        };
    }, [docs]);

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = isCriminalOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isCriminalOpen]);

    const featured = posts[0] ?? null;
    const rest = useMemo(() => posts.slice(1), [posts]);
    const postPath = (p) => `/libraries/${p?.slug || p?._id}`;

    // Reordered: Criminal Law is now the first object
    const libraryCards = [
        { title: "Criminal law", desc: "FIR basics, bail, investigation.", icon: Gavel, active: true },
        { title: "Family law", desc: "Nikah, khula, divorce.", icon: Users, active: false },
        { title: "Property & land", desc: "Mutation, registry.", icon: Building, active: false },
        { title: "Civil disputes", desc: "Suit filing, evidence.", icon: Landmark, active: false },
        { title: "Contracts", desc: "Agreements, breach.", icon: FileText, active: false },
        { title: "Consumer rights", desc: "Complaints, docs.", icon: ShoppingBag, active: false },
        { title: "Business & company", desc: "Compliance, setup.", icon: Briefcase, active: false },
        { title: "Court process", desc: "Hearings, orders.", icon: Clock, active: false },
    ];

    const fadeUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const Dot = () => (
        <span className="relative inline-flex h-2 w-2" aria-hidden="true">
            <span className="motion-reduce:animate-none animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
        </span>
    );

    return (
        <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] pt-28 md:pt-32 pb-16 font-sans">
            
            {/* Header */}
            <section className="px-4 sm:px-6 lg:px-32 mb-12">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                        <span className="text-cyan-300 text-xs font-medium uppercase tracking-widest">
                            Knowledge Base
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[color:var(--text-h)] mb-4">
                        Law Library & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">Resources</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                        Select a category to explore legal concepts. Click on active sections to view details.
                    </p>
                </div>
            </section>

            {/* Grid Section */}
            <section className="relative z-10 px-4 sm:px-6 lg:px-32 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {libraryCards.map((item) => (
                            <motion.div 
                                key={item.title} 
                                {...fadeUp}
                                onClick={() => item.active && setIsCriminalOpen(true)}
                                className={`relative group p-5 rounded-xl border transition-all duration-300 flex flex-col justify-between min-h-[180px] ${
                                    item.active 
                                    ? 'bg-[color:var(--code-bg)] border-[color:var(--border)] hover:border-cyan-500/40 cursor-pointer' 
                                    : 'bg-[color:var(--code-bg)] border-[color:var(--border)] cursor-not-allowed opacity-60'
                                }`}
                            >
                                <div>
                                    <div className={`h-10 w-10 rounded-lg grid place-items-center mb-4 transition-colors ${
                                        item.active ? 'bg-[color:var(--bg)] border border-[color:var(--border)] text-cyan-400 group-hover:bg-cyan-500/10' : 'bg-[color:var(--bg)] border border-[color:var(--border)] text-slate-600'
                                    }`}>
                                        <item.icon size={20} />
                                    </div>
                                    <h4 className="text-base font-semibold text-[color:var(--text-h)] mb-1">{item.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                </div>

                                {!item.active && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                                        <Clock size={20} className="text-cyan-400 mb-2" />
                                        <span className="text-xs font-bold text-cyan-300 tracking-wider uppercase">Coming Soon</span>
                                    </div>
                                )}
                                
                                {item.active && (
                                    <div className="absolute top-3 right-3 z-20">
                                        <Dot />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            <AnimatePresence>
                {isCriminalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCriminalOpen(false)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm cursor-pointer"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                            animate={{ scale: 1, opacity: 1, y: 0 }} 
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-4xl h-[85vh] md:h-[90vh] rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg)] shadow-2xl overflow-hidden flex flex-col relative cursor-default"
                        >
                            <div className="sticky top-0 z-10 bg-[color:var(--bg)] backdrop-blur-md border-b border-[color:var(--border)] p-4 md:p-5 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                                    <h3 className="text-lg font-bold text-[color:var(--text-h)]">Criminal Law Resources</h3>
                                </div>
                                <button 
                                    onClick={() => setIsCriminalOpen(false)} 
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors text-xs font-medium"
                                >
                                    Close <X size={14} />
                                </button>
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-8 md:space-y-10">
                                {posts.length === 0 ? (
                                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] p-8 text-center mt-10">
                                        <AlertCircle size={32} className="mx-auto text-slate-500 mb-4" />
                                        <p className="text-lg font-medium text-[color:var(--text-h)] mb-1">No posts yet</p>
                                        <p className="text-sm text-slate-400">No updates have been published yet.</p>
                                    </div>
                                ) : (
                                    <>
                                        {featured && (
                                            <Link to={postPath(featured)} className="block group rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/50 to-slate-900/30 overflow-hidden transition-all duration-300 hover:border-cyan-500/40">
                                                <div className="p-6 border-b border-[color:var(--border)] bg-[color:var(--code-bg)]">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30 rounded-full bg-cyan-500/10">Featured</span>
                                                        <div className="flex items-center gap-2 text-xs text-slate-400"><Calendar size={12} />{formatDateTime(featured.createdAt)}</div>
                                                    </div>
                                                    <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text-h)] group-hover:text-cyan-400 transition-colors tracking-tight">{featured.title}</h2>
                                                </div>
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="lg:col-span-2">
                                                        <p className="text-[color:var(--text)] leading-relaxed mb-4 text-sm">{featured.summary}</p>
                                                        <div className="inline-flex items-center gap-2 text-cyan-400 font-medium text-sm group-hover:gap-3 transition-all">Read Full Post <ArrowRight size={16} /></div>
                                                    </div>
                                                    <div className="border border-[color:var(--border)] rounded-xl bg-[color:var(--code-bg)] p-4 h-fit">
                                                        <div className="flex items-center gap-2 mb-3"><Dot /><span className="text-xs font-medium text-[color:var(--text-h)]">Live Status</span></div>
                                                        <div className="space-y-2 text-xs text-slate-400">
                                                            <div className="flex justify-between"><span>Type</span><span className="text-[color:var(--text-h)]">Criminal Law</span></div>
                                                            <div className="flex justify-between"><span>Visibility</span><span className="text-[color:var(--text-h)]">Published</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        )}

                                        {rest.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {rest.map((p) => (
                                                    <Link key={p._id} to={postPath(p)} className="group block rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] hover:border-cyan-500/20 transition-all overflow-hidden">
                                                        <div className="p-6">
                                                            <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2 text-xs text-slate-500"><Calendar size={12} />{formatDateTime(p.createdAt)}</div><Dot /></div>
                                                            <h3 className="text-base font-bold text-[color:var(--text-h)] mb-2 group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                                                            <p className="text-sm text-slate-400 line-clamp-2 mb-4">{p.summary}</p>
                                                            <div className="inline-flex items-center gap-2 text-cyan-400 font-medium text-xs group-hover:gap-3 transition-all">Read More <ArrowRight size={14} /></div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}

                                <section className="border-t border-[color:var(--border)] pt-10">
                                    <div className="mb-6"><h4 className="text-xl font-bold text-[color:var(--text-h)]">Uploaded Documents</h4><p className="text-slate-500 text-sm mt-1">Relevant PDFs and resources.</p></div>
                                    {docs.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-[color:var(--border)] p-6 text-center"><FileText size={20} className="mx-auto text-slate-600 mb-2" /><p className="text-xs text-slate-500">No documents uploaded yet.</p></div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {docs.map((d) => (
                                                <div key={d.id} className="group flex flex-col justify-between rounded-xl border border-[color:var(--border)] bg-[color:var(--code-bg)] hover:border-cyan-500/20 transition-all p-4">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"><FileText size={18} /></div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="text-sm font-semibold text-[color:var(--text-h)] truncate">{d.title}</h5>
                                                            <p className="text-[10px] text-slate-500 mt-1">{d.filename}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <a href={d.dataUrl} download={d.filename} className="flex-1 text-center bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-1.5 rounded-lg text-[11px] transition-colors">Download</a>
                                                        <a href={docOpenUrls[d.id] || d.dataUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center border border-[color:var(--border)] hover:bg-[color:var(--bg)] text-[color:var(--text-h)] py-1.5 rounded-lg text-[11px] transition-colors">Open</a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.4); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.7); }
            `}</style>
        </div>
    );
}

export default Libraries;