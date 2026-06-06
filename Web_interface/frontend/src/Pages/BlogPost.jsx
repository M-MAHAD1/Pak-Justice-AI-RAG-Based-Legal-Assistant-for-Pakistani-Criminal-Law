import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const API_BASE_URL = (() => {
  return (import.meta?.env?.VITE_SERVER_BASE_URL || "http://localhost:3000").trim().replace(/\/+$/, "");
})();

function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const slugValue = useMemo(() => String(slug ?? ""), [slug]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    (async () => {
      try {
        if (!slugValue) {
          if (!cancelled) {
            setPost(null);
            setLoading(false);
          }
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(slugValue)}`);
        const data = await response.json().catch(() => ({}));

        if (response.status === 404) {
          if (!cancelled) {
            setPost(null);
            setLoading(false);
          }
          return;
        }

        if (!response.ok) {
          throw new Error(data?.message || `Failed to load post (${response.status})`);
        }

        if (!cancelled) {
          setPost(data?.post || null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setPost(null);
          setError(err?.message || "Failed to load post.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slugValue]);

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] font-sans pt-28 md:pt-32 pb-16 px-4 sm:px-6 lg:px-32">
        
        {/* Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-900/5 via-transparent to-transparent pointer-events-none" />
        <div className="fixed top-1/3 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
            
            {/* Back Button */}
            <Link to="/libraries" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors mb-8 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
            </Link>

            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 border border-dashed border-[color:var(--border)] rounded-2xl"
              >
                <h2 className="text-2xl font-bold text-[color:var(--text-h)] mb-2">Loading…</h2>
                <p className="text-slate-400">Fetching post from server.</p>
              </motion.div>
            ) : post ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-[color:var(--text-h)] leading-tight tracking-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 mt-4 text-slate-400 text-sm">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDateTime(post.createdAt)}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> 5 min read</span>
                        </div>
                    </div>

                    {/* Summary Card */}
                    {post.summary && (
                        <div className="p-6 rounded-xl bg-cyan-500/5 border border-cyan-500/20 mb-8">
                            <p className="text-cyan-200 text-sm leading-relaxed italic">
                                "{post.summary}"
                            </p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 md:p-8 rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] backdrop-blur-sm shadow-2xl">
                      <div className="text-[color:var(--text)] text-base leading-relaxed space-y-4 whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 border border-dashed border-[color:var(--border)] rounded-2xl"
                >
                    <h2 className="text-2xl font-bold text-[color:var(--text-h)] mb-2">Post Not Found</h2>
                <p className="text-slate-400">{error ? error : "This post might have been deleted or moved."}</p>
                </motion.div>
            )}
        </div>
    </div>
  );
}

export default BlogPost;