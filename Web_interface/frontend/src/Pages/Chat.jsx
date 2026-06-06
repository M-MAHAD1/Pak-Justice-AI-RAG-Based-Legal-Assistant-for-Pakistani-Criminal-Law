import { useEffect, useMemo, useRef, useState } from "react";
import { 
  MoreVertical, Plus, Send, 
  Trash2, Copy, User, Bot, AlertCircle 
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { getAuthToken, getIsAuthed, subscribeAuth } from "../utils/auth";

// --- NEW: Dynamic Storage Key Generator ---
// Yeh function har logged-in user ke liye alag key banayega
const getDynamicStorageKey = () => {
  const token = getAuthToken();
  if (!token) return "pj_chat_history_guest";

  try {
    // Agar JWT token hai, toh usme se user ki ID/Email nikal lay ga
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.email || payload.id || payload.sub || "user";
    return `pj_chat_history_${userId}`;
  } catch (err) {
    // Agar simple token hai toh token ka kuch hissa use karega
    return `pj_chat_history_${token.substring(0, 10)}`;
  }
};
const ASSISTANT_GREETING = "Hello! I am your AI Legal Assistant. How can I help you with Pakistan's legal concepts today?";

const API_BASE_URL = (() => {
  const raw = import.meta?.env?.VITE_API_BASE_URL || "https://mmahad01-pak-justice-ai.hf.space";
  return raw.trim().replace(/\/+$/, "");
})();

// --- NEW: RTL Detection Helper ---
const isRTL = (text) => {
  const rtlChars = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlChars.test(text);
};

function createId() { 
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 11); 
}

function createNewThread() {
  const now = Date.now();
  return {
    id: createId(),
    title: "New chat",
    createdAt: now,
    updatedAt: now,
    messages: [{ id: createId(), role: "assistant", content: ASSISTANT_GREETING, createdAt: now }],
  };
}

function loadChatState() {
  try {
    const key = getDynamicStorageKey(); 
    const saved = localStorage.getItem(key); 
    if (!saved) {
      const t = createNewThread();
      return { threads: [t], activeId: t.id };
    }
    const parsed = JSON.parse(saved);
    if (!parsed.threads || !Array.isArray(parsed.threads) || parsed.threads.length === 0) {
        const t = createNewThread();
        return { threads: [t], activeId: t.id };
    }
    return { ...parsed, activeId: parsed.activeId || parsed.threads[0]?.id };
  } catch (err) {
    const t = createNewThread();
    return { threads: [t], activeId: t.id };
  }
}

export default function Chat() {
  const [authTick, setAuthTick] = useState(0);
  const [state, setState] = useState(() => loadChatState());
  const { threads, activeId } = state;
  
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null); 
  const [sidebarMenuId, setSidebarMenuId] = useState(null); 

  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    return subscribeAuth(() => setAuthTick((t) => t + 1));
  }, []);

  const isAuthed = useMemo(
    () => getIsAuthed() && Boolean(getAuthToken()),
    [authTick]
  );

  const activeThread = useMemo(() => 
    threads.find((t) => t.id === activeId) || threads[0], 
  [threads, activeId]);

  if (!isAuthed) {
    return (
      <div className="relative min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] pt-28 md:pt-32 pb-16 px-4 transition-colors duration-300">
        <div className="max-w-xl mx-auto">
          <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--code-bg)] p-8 shadow-2xl">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[color:var(--text-h)]">
              Sign in required
            </h1>
            <p className="mt-3 text-sm md:text-base text-[color:var(--text)] leading-relaxed">
              Please sign in or create an account to open the AI chatbot.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                to="/signin"
                className="flex-1 text-center px-6 py-3 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-500 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center px-6 py-3 rounded-xl border border-[color:var(--border)] text-[color:var(--text-h)] font-bold hover:bg-[color:var(--bg)] transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const updateState = (updates) => {
    setState(prev => {
        const newState = { ...prev, ...updates };
        // YAHAN BHI DYNAMIC KEY USE KI
        localStorage.setItem(getDynamicStorageKey(), JSON.stringify(newState));
        return newState;
    });
  };

  // --- NEW: Jab Account (Auth) change ho toh nayi history load karo ---
  useEffect(() => {
    if (isAuthed) {
      setState(loadChatState());
    }
  }, [authTick, isAuthed]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [activeId]);

  useEffect(() => {
    const handleClickOutside = () => { setActiveMenuId(null); setSidebarMenuId(null); };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (listRef.current) {
        listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [activeThread?.messages, isSending]);

  const send = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setError(null);
    setInput("");
    setIsSending(true);

    const userMsg = { id: createId(), role: "user", content: trimmed, createdAt: Date.now() };
    
    const updatedThreads = threads.map(t => {
      if (t.id !== activeId) return t;
      return {
        ...t,
        messages: [...t.messages, userMsg],
        title: t.title === "New chat" ? (trimmed.slice(0, 30)) : t.title,
        updatedAt: Date.now()
      };
    });

    updateState({ threads: updatedThreads });

    try {
      const token = getAuthToken();
      const history = activeThread.messages
        .filter(m => m.content !== ASSISTANT_GREETING)
        .slice(-6)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            ...(token ? { "Authorization": `Bearer ${token}` } : {}) 
        },
        body: JSON.stringify({ messages: [...history, { role: "user", content: trimmed }] }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();
      const assistantMsg = {
        id: createId(),
        role: "assistant",
        content: data.content || data.message || "I encountered an error processing that legal query.",
        createdAt: Date.now()
      };

      const finalThreads = updatedThreads.map(t => 
        t.id === activeId ? { ...t, messages: [...t.messages, assistantMsg], updatedAt: Date.now() } : t
      );
      
      updateState({ threads: finalThreads });
    } catch (err) {
      setError("Connection lost. Please check your internet or try again.");
    } finally {
      setIsSending(false);
    }
  };

  const deleteThread = (e, threadId) => {
    e.stopPropagation();
    const nextThreads = threads.filter(t => t.id !== threadId);
    if (nextThreads.length === 0) {
        const n = createNewThread();
        updateState({ threads: [n], activeId: n.id });
    } else {
        updateState({ 
            threads: nextThreads, 
            activeId: activeId === threadId ? nextThreads[0].id : activeId 
        });
    }
  };

  return (
    <div className="relative min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] pt-28 md:pt-32 pb-6 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 h-[85vh]">
        
        {/* --- SIDEBAR --- */}
        <aside className="hidden md:flex md:col-span-3 flex-col bg-[color:var(--code-bg)] border border-[color:var(--border)] rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[color:var(--border)] flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">History</h2>
            <button 
                onClick={() => { const n = createNewThread(); updateState({ threads: [n, ...threads], activeId: n.id }); }} 
                className="p-2 bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20 rounded-xl transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {threads.map((t) => (
              <div key={t.id} className="relative group/sidebar">
                <button 
                  onClick={() => updateState({ activeId: t.id })} 
                  className={`w-full text-left p-3 pr-10 rounded-2xl transition-all border ${
                    activeId === t.id 
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500 font-bold" 
                    : "hover:bg-[color:var(--bg)] text-slate-400 border-transparent"
                  }`}
                >
                  <p className={`text-sm truncate ${isRTL(t.title) ? 'text-right' : 'text-left'}`}>{t.title}</p>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setSidebarMenuId(sidebarMenuId === t.id ? null : t.id); }} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover/sidebar:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-slate-500"
                >
                  <MoreVertical size={14} />
                </button>
                {sidebarMenuId === t.id && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-[color:var(--bg)] border border-[color:var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden">
                    <button onClick={(e) => deleteThread(e, t.id)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={12} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* --- MAIN CHAT --- */}
        <main className="md:col-span-9 flex flex-col bg-[color:var(--code-bg)] border border-[color:var(--border)] rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300">
          
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-10 custom-scrollbar">
            {activeThread.messages.map((m) => {
              const isUrdu = isRTL(m.content);
              return (
                <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${m.role === 'user' ? 'bg-cyan-600' : 'bg-[color:var(--bg)] border border-[color:var(--border)] text-cyan-500'}`}>
                    {m.role === 'user' ? <User size={18} className="text-white" /> : <Bot size={18} />}
                  </div>
                  <div className={`relative group max-w-[85%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div 
                      dir={isUrdu ? "rtl" : "ltr"}
                      className={`inline-block p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user' 
                      ? 'bg-cyan-600 text-white rounded-tr-none' 
                      : 'bg-[color:var(--bg)] border border-[color:var(--border)] text-[color:var(--text)] rounded-tl-none'
                    } ${isUrdu ? 'font-urdu text-lg' : ''}`}>
                      <div className={`prose dark:prose-invert max-w-none text-inherit break-words ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                      
                      <div className={`absolute top-0 ${m.role === 'user' ? '-left-10' : '-right-10'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === m.id ? null : m.id); }} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-slate-500">
                          <MoreVertical size={16} />
                        </button>
                        {activeMenuId === m.id && (
                          <div className="absolute top-10 right-0 w-32 bg-[color:var(--bg)] border border-[color:var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
                            <button onClick={() => { navigator.clipboard.writeText(m.content); setActiveMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[color:var(--code-bg)] text-[color:var(--text)]"><Copy size={12} /> Copy</button>
                            <button onClick={() => updateState({ threads: threads.map(t => t.id === activeId ? {...t, messages: t.messages.filter(msg => msg.id !== m.id)} : t) })} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10"><Trash2 size={12} /> Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {isSending && (
              <div className="flex gap-4 items-center text-cyan-500 text-xs animate-pulse font-medium ml-12">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                Analyzing legal statutes...
              </div>
            )}
            {error && (
                <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-3 rounded-xl border border-red-500/20 max-w-fit mx-auto">
                    <AlertCircle size={14} /> {error}
                </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[color:var(--bg)]/50 border-t border-[color:var(--border)]">
            <div className="max-w-3xl mx-auto flex items-end gap-3 bg-[color:var(--bg)] rounded-2xl p-3 border border-[color:var(--border)] focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all shadow-sm">
              <textarea
                ref={inputRef}
                value={input}
                dir={isRTL(input) ? "rtl" : "ltr"}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                placeholder="Ask your legal assistant..."
                className={`flex-1 bg-transparent border-none text-sm p-1 focus:outline-none resize-none max-h-40 text-[color:var(--text)] placeholder:text-slate-500 ${isRTL(input) ? 'text-right font-urdu text-lg' : 'text-left'}`}
                rows="1"
              />
              <button 
                onClick={send} 
                disabled={isSending || !input.trim()} 
                className="bg-cyan-600 text-white p-2.5 rounded-xl hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-600/20"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-500 mt-3 uppercase tracking-widest font-medium opacity-70">
              AI can make mistakes. Verify important legal information. Supported Only Criminal Law.
            </p>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0891b2; }
        
        /* Urdu font refinement if available on system */
        .font-urdu {
          font-family: 'Noto Nastaliq Urdu', 'Urdu Typesetting', 'Tahoma', sans-serif;
          line-height: 1.8;
        }
      `}</style>
    </div>
  );
}