import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Lock, Edit, FileText, Trash2, PlusCircle, LogOut } from "lucide-react";
import { clearAuth, getAuthToken, getIsAuthed, parseJwt, setAuth, subscribeAuth } from "../utils/auth";

const LS_DOCS_KEY = "pj_docs";
const API_BASE_URL = (() => {
  // Server uses localhost:3000 in current auth pages.
  return (import.meta?.env?.VITE_SERVER_BASE_URL || "http://localhost:3000").trim().replace(/\/+$/, "");
})();

function safeParseJson(value, fallback) {
  try { if (!value) return fallback; const parsed = JSON.parse(value); return parsed ?? fallback; } catch { return fallback; }
}
function formatDateTime(iso) {
  try { const d = new Date(iso); if (Number.isNaN(d.getTime())) return iso; return d.toLocaleString(); } catch { return iso; }
}
function uid(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`; }

function dataUrlToBlob(dataUrl) {
  const str = String(dataUrl ?? "");
  const comma = str.indexOf(",");
  if (comma < 0) throw new Error("invalid_data_url");

  const header = str.slice(0, comma);
  const body = str.slice(comma + 1);
  const isBase64 = /;base64/i.test(header);
  const mimeMatch = header.match(/^data:([^;]+)/i);
  const mime = mimeMatch?.[1] || "application/octet-stream";

  if (!isBase64) return new Blob([decodeURIComponent(body)], { type: mime });

  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function Admin() {
  const [tab, setTab] = useState("posts");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [postNotice, setPostNotice] = useState(null);
  const [docNotice, setDocNotice] = useState(null);
  const [posts, setPosts] = useState([]);
  const [docs, setDocs] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postDraft, setPostDraft] = useState({ title: "", summary: "", content: "" });
  const [docDraft, setDocDraft] = useState({ title: "", file: null });
  const [docOpenUrls, setDocOpenUrls] = useState({});

  const [authTick, setAuthTick] = useState(0);

  useEffect(() => {
    return subscribeAuth(() => setAuthTick((t) => t + 1));
  }, []);

  const claims = useMemo(() => parseJwt(getAuthToken()) || null, [authTick]);
  const isAdmin = useMemo(() => claims?.role === "admin", [claims]);
  const isAuthed = useMemo(() => getIsAuthed() && Boolean(getAuthToken()), [authTick]);

  useEffect(() => {
    try {
      const d = safeParseJson(localStorage.getItem(LS_DOCS_KEY), []);
      setDocs(Array.isArray(d) ? d : []);
    } catch {
      setDocs([]);
    }
  }, []);

  const persistDocs = (next) => { setDocs(next); try { localStorage.setItem(LS_DOCS_KEY, JSON.stringify(next)); } catch {} try { window.dispatchEvent(new Event("pj_storage")); } catch {} };

  useEffect(() => {
    if (!isAdmin) {
      setPosts([]);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const msg = data?.message || `Failed to load posts (${response.status})`;
          if (!cancelled) setPostNotice({ type: "error", text: msg });
          return;
        }

        const next = Array.isArray(data?.posts) ? data.posts : [];
        if (!cancelled) setPosts(next);
      } catch (err) {
        if (!cancelled) setPostNotice({ type: "error", text: err?.message || "Failed to load posts." });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

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

  const login = async (e) => {
    e.preventDefault();
    setPostNotice(null);

    const normalizedEmail = email.trim();
    const rawPassword = password;
    if (!normalizedEmail || !rawPassword) {
      setPostNotice({ type: "error", text: "Email and password are required." });
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password: rawPassword }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPostNotice({ type: "error", text: data?.message || `Login failed (${response.status})` });
        return;
      }

      const token = data?.token;
      if (!token) {
        setPostNotice({ type: "error", text: "Login succeeded but no token was returned." });
        return;
      }

      const nextClaims = parseJwt(token);
      if (nextClaims?.role !== "admin") {
        setPostNotice({ type: "error", text: "This account is not authorized for admin access." });
        return;
      }

      setAuth(token);
      setEmail("");
      setPassword("");
      setTab("posts");
      setPostNotice({ type: "success", text: "Admin access granted." });

      // Load posts immediately after login.
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts`);
        const data = await response.json().catch(() => ({}));
        if (response.ok) setPosts(Array.isArray(data?.posts) ? data.posts : []);
      } catch {
        // ignore
      }
    } catch (err) {
      setPostNotice({ type: "error", text: err?.message || "Failed to connect to server." });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    clearAuth();
    setEmail("");
    setPassword("");
    setPostNotice(null);
    setDocNotice(null);
  };

  const resetPostDraft = () => {
    setEditingPostId(null);
    setPostDraft({ title: "", summary: "", content: "" });
  };

  const beginEditPost = (post) => {
    setPostNotice(null);
    setEditingPostId(post?._id ?? null);
    setPostDraft({
      title: String(post?.title ?? ""),
      summary: String(post?.summary ?? ""),
      content: String(post?.content ?? ""),
    });
  };

  const savePost = async (e) => {
    e.preventDefault();
    setPostNotice(null);
    const title = postDraft.title.trim();
    const summary = postDraft.summary.trim();
    const content = postDraft.content.trim();
    if (!title || !summary || !content) return;

    const token = getAuthToken();
    if (!token) {
      setPostNotice({ type: "error", text: "Missing admin token. Please login again." });
      return;
    }

    // Update existing
    if (editingPostId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${editingPostId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, summary, content }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setPostNotice({ type: "error", text: data?.message || `Update failed (${response.status})` });
          return;
        }

        const updated = data?.post;
        if (!updated?._id) {
          setPostNotice({ type: "error", text: "Update succeeded but server returned an invalid post." });
          return;
        }

        setPosts((prev) => prev.map((p) => (p?._id === updated._id ? updated : p)));
        resetPostDraft();
        setPostNotice({ type: "success", text: "Post updated." });
        return;
      } catch (err) {
        setPostNotice({ type: "error", text: err?.message || "Failed to update post." });
        return;
      }
    }

    // Create new
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, summary, content }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPostNotice({ type: "error", text: data?.message || `Publish failed (${response.status})` });
        return;
      }

      const created = data?.post;
      if (!created?._id) {
        setPostNotice({ type: "error", text: "Publish succeeded but server returned an invalid post." });
        return;
      }

      setPosts((prev) => [created, ...prev]);
      resetPostDraft();
      setPostNotice({ type: "success", text: "Post published." });
    } catch (err) {
      setPostNotice({ type: "error", text: err?.message || "Failed to publish post." });
    }
  };

  const deletePost = async (id) => {
    setPostNotice(null);
    const token = getAuthToken();
    if (!token) {
      setPostNotice({ type: "error", text: "Missing admin token. Please login again." });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPostNotice({ type: "error", text: data?.message || `Delete failed (${response.status})` });
        return;
      }
      setPosts((prev) => prev.filter((p) => p?._id !== id));
      if (editingPostId === id) resetPostDraft();
      setPostNotice({ type: "success", text: "Post deleted." });
    } catch (err) {
      setPostNotice({ type: "error", text: err?.message || "Failed to delete post." });
    }
  };

  const addDoc = async (e) => {
    e.preventDefault(); setDocNotice(null);
    const title = docDraft.title.trim(); const file = docDraft.file;
    if (!title || !file) return;
    if (file.type !== "application/pdf") { setDocNotice({ type: "error", text: "Only PDF files are allowed." }); return; }
    const maxBytes = 4 * 1024 * 1024;
    if (file.size > maxBytes) { setDocNotice({ type: "error", text: "PDF is too large. Max size is 4MB." }); return; }
    let dataUrl;
    try { dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error("read_failed")); reader.readAsDataURL(file); }); } catch { setDocNotice({ type: "error", text: "Failed to read file." }); return; }
    const next = [{ id: uid("doc"), title, filename: file.name, mime: file.type, size: file.size, uploadedAt: new Date().toISOString(), dataUrl }, ...docs];
    persistDocs(next);
    setDocDraft({ title: "", file: null });
    setDocNotice({ type: "success", text: "PDF uploaded." });
    const inputEl = document.getElementById("pj-doc-file"); if (inputEl) inputEl.value = "";
  };

  const deleteDoc = (id) => { persistDocs(docs.filter((d) => d.id !== id)); setDocNotice({ type: "success", text: "PDF deleted." }); };

  const Alert = ({ type, text }) => (
    <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-start gap-3 p-4 rounded-lg border ${type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}
    >
        {type === 'error' ? <AlertCircle size={18} className="shrink-0 mt-0.5" /> : <CheckCircle size={18} className="shrink-0 mt-0.5" />}
        <p className="text-sm">{text}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] font-sans pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-cyan-400 font-semibold text-xs uppercase tracking-[0.2em] mb-2">Control Center</p>
            <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--text-h)]">Admin Panel</h1>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Manage blog posts and project documents.
            </p>
          </div>
          {isAdmin && (
            <button onClick={logout} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* Content */}
        {!isAdmin ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] backdrop-blur-xl p-8 shadow-2xl max-w-md mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
                <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <Lock size={24} className="text-cyan-400" />
                </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-6">Admin Login</h2>
            <form onSubmit={login} className="space-y-4">
              {isAuthed && (
                <Alert type="error" text="You are logged in, but not as an admin. Logout and sign in with the admin account." />
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-lg py-2.5 px-4 text-sm text-[color:var(--text-h)] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="admin email"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-lg py-2.5 px-4 text-sm text-[color:var(--text-h)] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="admin password"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-2.5 rounded-lg transition-colors ${isLoggingIn ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoggingIn ? "Signing in..." : "Access Panel"}
              </button>
              {postNotice && !isAdmin && <Alert type={postNotice.type} text={postNotice.text} />}
            </form>
            <p className="text-xs text-slate-500 text-center mt-4">Admin access requires an admin account.</p>

            {isAuthed && (
              <button
                type="button"
                onClick={logout}
                className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-[color:var(--border)] pb-2">
              <button onClick={() => setTab("posts")} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === 'posts' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-[color:var(--text-h)]'}`}>
                    Posts
                </button>
              <button onClick={() => setTab("docs")} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === 'docs' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-[color:var(--text-h)]'}`}>
                    Documents
                </button>
            </div>

            {tab === "posts" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="p-7 rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] backdrop-blur-xl shadow-[0_12px_28px_-18px_rgba(0,0,0,0.35)]">
                        <div className="flex items-start justify-between gap-3 mb-5">
                          <div className="flex items-center gap-2">
                            <Edit size={18} className="text-cyan-400" />
                            <div>
                              <h3 className="text-lg font-bold text-[color:var(--text-h)] leading-tight">{editingPostId ? "Update Post" : "Create Post"}</h3>
                              <p className="text-xs text-slate-500 mt-1">{editingPostId ? "Edit and save changes to the selected post." : "Write a new post and publish it to the library."}</p>
                            </div>
                          </div>
                          {editingPostId && (
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-cyan-300 border border-cyan-500/30 rounded-full bg-cyan-500/10 px-2.5 py-1">
                              Editing
                            </span>
                          )}
                        </div>

                        <form onSubmit={savePost} className="space-y-5">
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-2 block">Title</label>
                                <input
                                  value={postDraft.title}
                                  onChange={(e) => setPostDraft((p) => ({ ...p, title: e.target.value }))}
                                  className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-xl py-3 px-4 text-sm text-[color:var(--text-h)] placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                                  placeholder="Post title"
                                  required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-2 block">Summary</label>
                                <textarea
                                  value={postDraft.summary}
                                  onChange={(e) => setPostDraft((p) => ({ ...p, summary: e.target.value }))}
                                  rows={3}
                                  className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-xl py-3 px-4 text-sm text-[color:var(--text-h)] placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                                  placeholder="Short summary"
                                  required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-600 mb-2 block">Content</label>
                                <textarea
                                  value={postDraft.content}
                                  onChange={(e) => setPostDraft((p) => ({ ...p, content: e.target.value }))}
                                  rows={8}
                                  className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-xl py-3 px-4 text-sm text-[color:var(--text-h)] placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                                  placeholder="Full content..."
                                  required
                                />
                            </div>

                            <div className="flex gap-3">
                              {editingPostId && (
                                <button
                                  type="button"
                                  onClick={() => resetPostDraft()}
                                  className="flex-1 border border-[color:var(--border)] hover:bg-[color:var(--bg)] text-[color:var(--text-h)] font-semibold py-3 rounded-xl transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                              <button
                                type="submit"
                                className="flex-[2] bg-cyan-500 hover:bg-cyan-400 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                              >
                                <PlusCircle size={16} /> {editingPostId ? "Update" : "Publish"}
                              </button>
                            </div>
                            {postNotice && <Alert type={postNotice.type} text={postNotice.text} />}
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] backdrop-blur-xl">
                        <h3 className="text-lg font-bold text-[color:var(--text-h)] mb-4">Published Posts</h3>
                        <div className="space-y-3 max-h-[600px] overflow-auto pr-2">
                            {posts.length === 0 ? <p className="text-slate-500 text-sm text-center py-8">No posts yet.</p> : 
                            posts.map((p) => (
                                <div key={p._id} className="group p-4 rounded-xl bg-[color:var(--bg)] border border-[color:var(--border)] hover:border-cyan-500/20 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                              <h4 className="text-[color:var(--text-h)] font-medium">{p.title}</h4>
                                            <p className="text-xs text-slate-500 mt-1">{formatDateTime(p.createdAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() => beginEditPost(p)}
                                            className={`p-1.5 rounded-md transition-colors ${editingPostId === p._id ? "text-cyan-400 bg-cyan-500/10" : "text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10"}`}
                                            aria-label="Update post"
                                            title="Update"
                                          >
                                            <Edit size={16} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => deletePost(p._id)}
                                            className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            aria-label="Delete post"
                                            title="Delete"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-xs mt-2 line-clamp-2">{p.summary}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              </div>
            )}

            {tab === "docs" && (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Form */}
                 <div className="lg:col-span-1 space-y-4">
                     <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
                         <div className="flex items-center gap-2 mb-4">
                             <FileText size={18} className="text-cyan-400" />
                             <h3 className="text-lg font-bold">Upload PDF</h3>
                         </div>
                         <form onSubmit={addDoc} className="space-y-4">
                             <div>
                                 <label className="text-xs text-slate-300 mb-1 block">Title</label>
                           <input value={docDraft.title} onChange={(e) => setDocDraft((d) => ({ ...d, title: e.target.value }))} className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-lg py-2 px-3 text-sm text-[color:var(--text-h)] focus:outline-none focus:border-cyan-500" placeholder="Doc title" required />
                             </div>
                             <div>
                                 <label className="text-xs text-slate-300 mb-1 block">File (Max 4MB)</label>
                                 <input id="pj-doc-file" type="file" accept="application/pdf" onChange={(e) => setDocDraft((d) => ({ ...d, file: e.target.files?.[0] ?? null }))} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-white/10 file:bg-slate-800 file:text-white hover:file:bg-slate-700" required />
                             </div>
                             <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2">
                                 <PlusCircle size={16} /> Upload
                             </button>
                             {docNotice && <Alert type={docNotice.type} text={docNotice.text} />}
                         </form>
                     </div>
                 </div>
 
                 {/* List */}
                 <div className="lg:col-span-2">
                     <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/30 backdrop-blur-xl">
                         <h3 className="text-lg font-bold mb-4">Uploaded Documents</h3>
                         <div className="space-y-3">
                             {docs.length === 0 ? <p className="text-slate-500 text-sm text-center py-8">No documents yet.</p> : 
                             docs.map((d) => (
                                 <div key={d.id} className="p-4 rounded-xl bg-slate-800/20 border border-white/5">
                                     <div className="flex justify-between items-center">
                                         <div className="flex items-center gap-3">
                                             <FileText size={20} className="text-cyan-400" />
                                             <div>
                                       <h4 className="text-[color:var(--text-h)] font-medium text-sm">{d.title}</h4>
                                                 <p className="text-xs text-slate-500">{Math.round((d.size / 1024) * 10) / 10} KB</p>
                                             </div>
                                         </div>
                                         <div className="flex gap-2">
                                             <a href={d.dataUrl} download={d.filename} className="text-xs text-cyan-400 hover:underline px-2 py-1 rounded border border-cyan-500/20">Download</a>
                                           <a href={docOpenUrls[d.id] || d.dataUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[color:var(--text-h)] hover:underline px-2 py-1 rounded border border-[color:var(--border)]">Open</a>
                                             <button onClick={() => deleteDoc(d.id)} className="text-slate-500 hover:text-red-400 p-1 transition-colors">
                                                 <Trash2 size={16} />
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;