import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getIsAuthed, subscribeAuth } from "../utils/auth";
import { motion } from "framer-motion";
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Users,
  Building,
  Gavel,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// NEW: transparent crystal Lady Justice hero image
import justiceHero from "../assets/justice-hero.png";

const documentImg = "/doc.jpg";
const citizenImg = "/cit.jpg";
const professionalImg = "/prof.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

function Home() {
  const [isAuthed, setIsAuthed] = useState(() => getIsAuthed());

  useEffect(() => {
    return subscribeAuth(setIsAuthed);
  }, []);

  const floatingBadges = [
    // Square layout: two near shoulders (top corners) and two near legs (bottom corners)
    { name: "Criminal Law", icon: Gavel, pos: "top-[22%] left-[4%]", delay: 0 },
    { name: "Family Law", icon: Users, pos: "top-[22%] right-[4%]", delay: 0.25 },
    { name: "Property", icon: Building, pos: "bottom-[18%] left-[6%]", delay: 0.5 },
    { name: "Cyber Crime", icon: ShieldCheck, pos: "bottom-[18%] right-[6%]", delay: 0.75 },
  ];

  return (
    <div className="relative min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] font-sans overflow-x-hidden antialiased">
      {/* ============================================ */}
      {/* ===  REDESIGNED HERO SECTION  ============== */}
      {/* ============================================ */}
      <section className="relative z-0 min-h-screen flex items-center px-4 sm:px-6 lg:px-20 py-20 md:py-0 overflow-hidden">
        {/* Ambient background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(34,211,238,0.18),_transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.10),_transparent_60%)] pointer-events-none" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />

        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full max-w-7xl mx-auto">
          {/* ===== LEFT — Copy ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col gap-7"
          >
            {/* Title */}
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.02]">
                <span className="block text-[color:var(--text-h)]">Law</span>
                <span className="block text-[color:var(--text-h)]">Simplified By </span>
                <span className="block bg-clip-text text-transparent p-2 bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.35)]">
                  Artificial Intelligence
                </span>
              </h1>

              <p className="text-[color:var(--text)]  text-base md:text-lg max-w-xl leading-relaxed mt-6 font-medium">
                <span className="text-cyan-300 font-semibold">pakJustice</span> opens the door to
                Pakistan's law explore concepts, workflows, and the right questions to ask,
                guided by a conversational AI built for citizens and professionals alike.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mt-2">
              <Link
                to="/chat"
                className="group relative w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-white overflow-hidden shadow-[0_10px_40px_-10px_rgba(34,211,238,0.6)] transition-transform hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500" />
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  Open AI Chatbot
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>

              {!isAuthed && (
                <div className="flex w-full sm:w-auto gap-3">
                  <Link
                    to="/signin"
                    className="flex-1 sm:flex-initial text-center px-6 py-4 rounded-xl border border-[color:var(--border)] text-[color:var(--text-h)] hover:bg-[color:var(--code-bg)] transition-all font-bold backdrop-blur-md"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 sm:flex-initial text-center px-6 py-4 rounded-xl border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 transition-all font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-4 pt-6 border-t border-[color:var(--border)]">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <ShieldCheck size={16} className="text-cyan-400" />
                Verified Legal Sources
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Scale size={16} className="text-cyan-400" />
                Pakistan Law Database
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                <Sparkles size={16} className="text-cyan-400" />
                Powered by AI
              </div>
            </div>
          </motion.div>

          {/* ===== RIGHT — Crystal Justice Visual ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative flex justify-center items-center min-h-[500px] lg:min-h-[640px]"
          >
            {/* Soft glow halo behind statue */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[420px] h-[420px] rounded-full bg-cyan-500/20 blur-[100px]" />
            </div>

            {/* Rotating dashed ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[480px] h-[480px] rounded-full border border-dashed border-cyan-400/25 animate-[spin_50s_linear_infinite]" />
            </div>
            {/* Inner solid ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[360px] h-[360px] rounded-full border border-cyan-400/15" />
            </div>

            {/* Floating gentle motion on statue */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <img
                src={justiceHero}
                alt="Crystal Lady Justice — AI Legal Assistant"
                width={520}
                height={520}
                className="w-[340px] sm:w-[420px] lg:w-[520px] h-auto drop-shadow-[0_30px_60px_rgba(34,211,238,0.35)] select-none"
                draggable={false}
              />
            </motion.div>

            {/* Floating category badges around the statue */}
            {floatingBadges.map((b) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.6 + b.delay },
                  y: { duration: 4 + b.delay, repeat: Infinity, ease: "easeInOut" },
                }}
                className={`hidden md:flex absolute ${b.pos} z-20`}
              >
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--code-bg)] backdrop-blur-xl border border-[color:var(--border)] shadow-xl hover:border-cyan-400/50 transition-colors">
                  <div className="p-1 rounded-full bg-cyan-500/20">
                    <b.icon size={14} className="text-cyan-300" />
                  </div>
                  <span className="text-xs font-bold text-[color:var(--text-h)] whitespace-nowrap">{b.name}</span>
                </div>
              </motion.div>
            ))}

            {/* Bottom "AI Active" status chip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-cyan-400/30">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300" />
                </span>
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-cyan-200 uppercase">
                  AI Assistant Active
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[color:var(--bg)] pointer-events-none" />
      </section>

      {/* --- CAPABILITIES SECTION (unchanged) --- */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-32 py-16 md:py-24 border-t border-[color:var(--border)] bg-[color:var(--bg)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            {...fadeUp}
            className="h-[320px] md:h-[420px] lg:h-[460px] rounded-2xl overflow-hidden relative order-2 lg:order-1 border border-white/10"
          >
            <img src={documentImg} alt="Document Analysis" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bg)] via-transparent to-transparent opacity-80" />
          </motion.div>

          <motion.div {...fadeUp} className="space-y-5 md:space-y-8 order-1 lg:order-2">
            <div>
              <p className="text-cyan-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">Who is it for?</p>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-[color:var(--text-h)]">
                Built for <span className="text-black">Everyone</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {[
                {
                  t: "Legal Practitioners",
                  d: "Quickly access cases, statutes, & draft documents. Save time & work smarter.",
                  icon: Briefcase,
                },
                {
                  t: "Law Students",
                  d: "Study smarter with instant access to case laws and tools in one platform.",
                  icon: GraduationCap,
                },
                {
                  t: "Corporate Teams",
                  d: "Speed up compliance, contract reviews, and drafting with AI tools.",
                  icon: Building,
                },
                {
                  t: "General Public",
                  d: "Understand your rights and explore laws. Legal help made simple.",
                  icon: Users,
                },
              ].map((item, i) => (
                <div key={i} className="group flex flex-col h-full p-4 md:p-5 rounded-2xl bg-[color:var(--code-bg)] border border-[color:var(--border)] shadow-xl">
                  <div className="mb-3 inline-flex p-2 md:p-2.5 rounded-xl bg-cyan-900/30 text-cyan-400 w-fit">
                    <item.icon size={22} strokeWidth={2} />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h4 className="text-base md:text-lg font-bold text-[color:var(--text-h)] mb-1.5">{item.t}</h4>
                    <p className="text-xs md:text-[13px] text-[color:var(--text)] leading-snug font-medium">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- CITIZENS vs LAWYERS (unchanged) --- */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-32 py-16 md:py-24 border-t border-[color:var(--border)] bg-[color:var(--bg)]">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold text-[color:var(--text-h)] tracking-tight">Useful for Everyone</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div {...fadeUp} className="p-6 md:p-8 rounded-2xl bg-[color:var(--code-bg)] border border-[color:var(--border)] shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-900/50 text-cyan-400">
                <Users size={20} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[color:var(--text-h)]">For Citizens</h3>
            </div>
            <ul className="space-y-2 md:space-y-3 text-[color:var(--text)] text-xs md:text-sm mb-6 flex-grow font-medium">
              <li className="flex gap-2 items-start">
                <CheckCircle2 size={14} className="text-cyan-400 mt-1 shrink-0" />
                <span>Understand the process before you spend money.</span>
              </li>
              <li className="flex gap-2 items-start">
                <CheckCircle2 size={14} className="text-cyan-400 mt-1 shrink-0" />
                <span>Learn what documents and facts matter.</span>
              </li>
            </ul>
            <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden border border-[color:var(--border)] relative">
              <img src={citizenImg} alt="Citizens" className="w-full h-full object-cover opacity-80" />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="p-6 md:p-8 rounded-2xl bg-[color:var(--code-bg)] border border-[color:var(--border)] shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-cyan-900/50 text-cyan-400">
                <Scale size={20} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[color:var(--text-h)]">For Professionals</h3>
            </div>
            <ul className="space-y-2 md:space-y-3 text-[color:var(--text)] text-xs md:text-sm mb-6 flex-grow font-medium">
              <li className="flex gap-2 items-start">
                <CheckCircle2 size={14} className="text-cyan-400 mt-1 shrink-0" />
                <span>Explain concepts to clients in plain language.</span>
              </li>
              <li className="flex gap-2 items-start">
                <CheckCircle2 size={14} className="text-cyan-400 mt-1 shrink-0" />
                <span>Create checklists for common case types.</span>
              </li>
            </ul>
            <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden border border-[color:var(--border)] relative">
              <img src={professionalImg} alt="Professionals" className="w-full h-full object-cover opacity-80" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- TRUST & DISCLAIMER (unchanged) --- */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-32 py-16 md:py-24 bg-[color:var(--bg)] border-t border-[color:var(--border)]">
        <motion.div
          {...fadeUp}
          className="p-8 md:p-16 rounded-2xl bg-[color:var(--code-bg)] border border-[color:var(--border)] text-center max-w-4xl mx-auto shadow-2xl"
        >
          <div className="inline-flex p-3 rounded-xl bg-cyan-900/30 text-cyan-400 mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl md:text-3xl font-bold text-[color:var(--text-h)] tracking-tight mb-4">Responsible Guidance</h2>
          <p className="text-[color:var(--text)] text-center text-xs md:text-sm leading-relaxed max-w-xl mx-auto font-medium">
            pakJustice is an educational assistant. For any urgent or high stakes issue, consult a qualified lawyer. General information only not legal advice.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default Home;
