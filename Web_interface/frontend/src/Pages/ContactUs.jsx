import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle } from "lucide-react";

function ContactUs() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const [contactInfo, setContactInfo] = useState({
        email: "",
        phone: "+92 326 3146353",
        location: "Pakistan",
        responseTime: "This is a final year project — replies depend on availability.",
    });

    const onChange = (key) => (e) => {
        setSubmitted(false);
        if (error) setError("");
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const response = await fetch("http://localhost:3000/api/contact/config");
                const data = await response.json().catch(() => ({}));
                if (!response.ok) return;
                if (cancelled) return;
                setContactInfo({
                    email: typeof data?.email === "string" ? data.email : "",
                    phone: typeof data?.phone === "string" ? data.phone : "",
                    location: typeof data?.location === "string" ? data.location : "Pakistan",
                    responseTime:
                        typeof data?.responseTime === "string"
                            ? data.responseTime
                            : "This is a final year project — replies depend on availability.",
                });
            } catch {
                // Ignore — page can still work without config
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (sending) return;
        setSending(true);
        setSubmitted(false);
        setError("");

        try {
            const response = await fetch("http://localhost:3000/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    subject: form.subject,
                    message: form.message,
                }),
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data?.message || `Failed to send message (${response.status})`);
            }

            setSubmitted(true);
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            setError(err?.message || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] font-sans pt-28 md:pt-32 pb-16">
            
            <section className="px-4 sm:px-6 lg:px-32 mb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                        <span className="text-cyan-300 text-xs font-medium uppercase tracking-widest">
                            Get in Touch
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[color:var(--text-h)] mb-4">
                        Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">pakJustice</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                        Share your feedback, report an issue, or ask questions about our AI-powered criminal law guide.
                    </p>
                </div>
            </section>

            <section className="px-4 sm:px-6 lg:px-32 mb-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-[color:var(--text-h)] mb-4">Project Contact</h3>
                            <p className="text-xs text-slate-500 mb-6">Update these details to your real email/phone.</p>
                            
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="text-sm text-[color:var(--text-h)] mt-0.5">{contactInfo.email || "—"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Phone</p>
                                        <p className="text-sm text-[color:var(--text-h)] mt-0.5">{contactInfo.phone || "(+92) 326 3146353"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Location</p>
                                        <p className="text-sm text-[color:var(--text-h)] mt-0.5">{contactInfo.location || "Pakistan"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)]">
                            <div className="flex items-center gap-3 mb-2">
                                <Clock size={16} className="text-slate-400" />
                                <h4 className="text-sm font-semibold text-[color:var(--text-h)]">Response Time</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {contactInfo.responseTime || "This is a final year project — replies depend on availability."}
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] overflow-hidden relative">
                        
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <div className="relative p-6 md:p-8 border-b border-[color:var(--border)] bg-[color:var(--code-bg)]">
                            <h3 className="text-lg font-bold text-[color:var(--text-h)]">Send a message</h3>
                            <p className="text-xs text-slate-500 mt-1">Fill out the form below to get in touch.</p>
                        </div>

                        <form onSubmit={onSubmit} className="relative p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-2">Full name</label>
                                <input
                                    value={form.name}
                                    onChange={onChange("name")}
                                    className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-lg px-4 py-3 text-sm text-[color:var(--text-h)] placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-2">Email</label>
                                <input
                                    value={form.email}
                                    onChange={onChange("email")}
                                    type="email"
                                    className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-lg px-4 py-3 text-sm text-[color:var(--text-h)] placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-300 mb-2">Subject</label>
                                <input
                                    value={form.subject}
                                    onChange={onChange("subject")}
                                    className="w-full bg-[color:var(--bg)] border border-[color:var(--border)] rounded-lg px-4 py-3 text-sm text-[color:var(--text-h)] placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    placeholder="What is this about?"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-slate-300 mb-2">Message</label>
                                <textarea
                                    value={form.message}
                                    onChange={onChange("message")}
                                    rows={5}
                                    className="w-full resize-none bg-[color:var(--bg)] border border-[color:var(--border)] rounded-lg px-4 py-3 text-sm text-[color:var(--text-h)] placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    placeholder="Write your message…"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between border-t border-[color:var(--border)] pt-6 mt-2">
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <AlertCircle size={12} /> Please don’t share sensitive personal information.
                                </p>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
                                >
                                    {sending ? "Sending…" : "Send Message"} <Send size={14} />
                                </button>
                            </div>

                            {error && (
                                <div className="md:col-span-2 mt-2">
                                    <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10">
                                        <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-[color:var(--text-h)]">Message not sent</p>
                                            <p className="text-xs text-red-200 mt-0.5">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {submitted && (
                                <div className="md:col-span-2 mt-2">
                                    <div className="flex items-center gap-3 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                                        <CheckCircle size={18} className="text-cyan-400 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-[color:var(--text-h)]">Message submitted</p>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Thanks! Your message was sent to support.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 lg:px-32">
                <div className="max-w-6xl mx-auto">
                    <div className="p-8 rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)]">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle size={16} className="text-slate-400" />
                            <h3 className="text-sm font-bold text-[color:var(--text-h)] uppercase tracking-wide">For legal emergencies</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-4xl">
                            pakJustice is an educational project. If you need urgent legal help, contact
                            a qualified lawyer or relevant authorities.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default ContactUs;