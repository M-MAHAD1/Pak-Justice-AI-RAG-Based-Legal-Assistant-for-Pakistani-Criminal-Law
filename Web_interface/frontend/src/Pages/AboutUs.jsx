import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, AlertTriangle, Eye, Target, Lightbulb, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import lawBooks from "../assets/law_books-removebg-preview.png";

function AboutUs() {
    const steps = useMemo(
        () => [
            {
                n: 1,
                title: "Define legal scope ",
                desc: "Focus strictly on the Pakistan Penal Code (PPC) and Code of Criminal Procedure (CrPC) for precise, criminal-law guidance.",
            },
            {
                n: 2,
                title: "Empower citizens with clarity",
                desc: "Explain core protections and concepts in plain language so the public understands rights and safeguards.",
            },
            {
                n: 3,
                title: "Procedural workflows in steps",
                desc: "Map processes like FIR registration, arrest procedure, and bail applications into simple, actionable steps.",
            },
            {
                n: 4,
                title: "Offenses & penalties",
                desc: "Organize common crimes and show their exact legal consequences under Pakistani law (PPC), with careful wording.",
            },
            {
                n: 5,
                title: "Authentic referencing ",
                desc: "Back each answer with verifiable statutory sections and authentic text references from PPC/CrPC where applicable.",
            },
            {
                n: 6,
                title: "Guide legal actions ",
                desc: "Provide clear, practical directions on what to do next: what to ask, what to document, and when to seek a lawyer.",
            },
            {
                n: 7,
                title: "Broaden legal horizons ",
                desc: "Continuously update statutes and plan expansion into family, property, and cyber laws—while keeping current guidance scope-limited.",
            },
        ],
        []
    );

    const [active, setActive] = useState(1);
    const shouldReduceMotion = useReducedMotion();

    const heroJitter = useMemo(() => {
        const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        return {
            x: randInt(-12, 12),
            y: randInt(-8, 8),
            r: randInt(-2, 2),
        };
    }, []);

    const faqs = useMemo(
        () => [
            {
                q: "What is pakJustice AI and what laws does it cover?",
                a: "pakJustice AI is an education-first criminal law guide. It focuses strictly on the Pakistan Penal Code (PPC) and the Code of Criminal Procedure (CrPC) to explain concepts, procedures, and practical next steps in plain language.",
            },
            {
                q: "How does pakJustice help citizens and students?",
                a: "It simplifies legal terminology, helps you organize key facts and documents, and provides structured guidance so you’re better prepared before consulting a legal professional.",
            },
            {
                q: "Does it provide step-by-step workflows for FIR, arrest, and bail?",
                a: "Yes. pakJustice maps common criminal justice workflows (e.g., FIR registration, arrest-related procedure, and bail applications) into clear steps, within PPC/CrPC scope.",
            },
            {
                q: "How are offenses and penalties presented?",
                a: "Offenses are categorized clearly and paired with section-based references where applicable, so users can understand the consequences and verify details against authentic statutory text.",
            },
            {
                q: "How do you ensure answers are verifiable?",
                a: "The platform is designed to keep a section-based reference trail for PPC/CrPC topics where possible, encouraging users to cross-check the official text for accuracy.",
            },
            {
                q: "Is pakJustice legal advice?",
                a: "No. It provides educational guidance only. For urgent, sensitive, or high-stakes matters, consult a qualified lawyer and rely on official statutory text and court/legal advice.",
            },
        ],
        []
    );

    const [openFaq, setOpenFaq] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setActive((prev) => (prev >= 7 ? 1 : prev + 1));
        }, 2400);
        return () => clearInterval(id);
    }, []);

    const StepCard = ({ step }) => {
        const isActive = active === step.n;
        return (
            <button
                type="button"
                onMouseEnter={() => setActive(step.n)}
                onFocus={() => setActive(step.n)}
                className={`w-full text-left rounded-xl border p-5 transition-all duration-300 group
                    ${isActive 
                        ? "bg-[color:var(--code-bg)] border-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-[1.02]" 
                        : "bg-[color:var(--code-bg)] border-[color:var(--border)] hover:border-cyan-500/20"
                    }
                `}
            >
                <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-lg grid place-items-center shrink-0 transition-colors duration-300
                        ${isActive ? "bg-cyan-500 text-white" : "bg-slate-800 text-cyan-400 border border-cyan-500/30"}
                    `}>
                        <span className="text-sm font-bold">{step.n}</span>
                    </div>
                    <div>
                        <p className={`text-sm font-semibold transition-colors ${isActive ? "text-[color:var(--text-h)]" : "text-[color:var(--text-h)]"}`}>
                            {step.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--text)] font-sans pt-28 md:pt-32 pb-16">
            
            <section className="px-4 sm:px-6 lg:px-32 mb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                                <span className="text-cyan-300 text-xs font-medium uppercase tracking-widest">
                                    About The Project
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[color:var(--text-h)] mb-4">
                                PakJustice AI <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">An Intelligent Criminal Law Guide</span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
                                Pak Justice is an advanced AI-powered assistant dedicated to Pakistani criminal law. Focusing strictly on the
                                Pakistan Penal Code (PPC) and the Code of Criminal Procedure (CrPC), our platform utilizes modern AI to provide
                                citizens and students with accurate, verifiable legal insights, procedural workflows, and practical next steps —
                                all within clear, responsible boundaries.
                            </p>
                        </div>

                        <div className="relative">
                            <div
                                className="relative mx-auto w-[260px] h-[260px] md:w-[320px] md:h-[320px]"
                                style={{
                                    transform: `translate(${heroJitter.x}px, ${heroJitter.y}px) rotate(${heroJitter.r}deg)`,
                                }}
                            >
                                <motion.div
                                    className="relative w-full h-full"
                                    animate={shouldReduceMotion ? { y: 0 } : { y: [0, -14, 0] }}
                                    transition={
                                        shouldReduceMotion
                                            ? { duration: 0 }
                                            : { duration: 6, repeat: Infinity, ease: "easeInOut" }
                                    }
                                >
                                    <div
                                        className="absolute -inset-8 rounded-full bg-cyan-500/10 blur-3xl animate-pulse"
                                        aria-hidden="true"
                                    />

                                    <div className="relative w-full h-full rounded-full overflow-hidden ring-1 ring-[color:var(--border)] shadow-2xl shadow-cyan-500/10">
                                        <img
                                            src={lawBooks}
                                            alt="Law books"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 lg:px-32 mb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="relative rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] p-6 md:p-10 overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

                        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <StepCard step={steps[1]} />
                                <StepCard step={steps[2]} />
                                <StepCard step={steps[3]} />
                            </div>

                            <div className="flex flex-col justify-center items-center gap-6">
                                <StepCard step={steps[0]} />
                                
                                    <div className="w-full rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[color:var(--code-bg)] to-[color:var(--code-bg)] p-8 text-center shadow-xl shadow-cyan-500/5">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 mb-4">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                                            Our Project Vision
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold text-[color:var(--text-h)] tracking-tight">Vision Roadmap</p>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Current focus: <span className="text-cyan-400 font-semibold">Step {active}</span>
                                    </p>

                                    <div className="mt-6 flex justify-center gap-1.5">
                                        {steps.map((s) => (
                                            <div
                                                key={s.n}
                                                className={`h-1.5 w-8 rounded-full transition-all duration-300 
                                                    ${active === s.n ? "bg-cyan-500" : "bg-[color:var(--border)]"}
                                                `}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Steps */}
                            <div className="space-y-4">
                                <StepCard step={steps[4]} />
                                <StepCard step={steps[5]} />
                                <StepCard step={steps[6]} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 lg:px-32 mb-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Mission",
                            desc: "Simplify PPC and CrPC concepts for everyone using plain-language, AI-driven explanations.",
                            icon: Target
                        },
                        {
                            title: "Vision",
                            desc: "Expand to cover all Pakistani laws, empowering citizens to navigate the justice system confidently.",
                            icon: Eye
                        },
                        {
                            title: "Approach",
                            desc: "Deliver accurate, section-based answers and step-by-step legal workflows using advanced AI.",
                            icon: Lightbulb
                        },
                    ].map((card) => (
                        <div
                            key={card.title}
                            className="group p-6 rounded-2xl bg-[color:var(--code-bg)] border border-[color:var(--border)] hover:border-cyan-500/20 transition-all"
                        >
                            <div className="p-3 rounded-lg bg-cyan-500/10 w-fit mb-4 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                                <card.icon size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[color:var(--text-h)] mb-2">{card.title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-4 sm:px-6 lg:px-32 mb-16">
                <div className="max-w-6xl mx-auto grid grid-cols-1 gap-8">
                    
                    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--code-bg)] p-8">
                        <p className="text-cyan-400 font-semibold text-xs uppercase tracking-[0.2em] mb-3">FREQUENTLY ASKED QUESTIONS</p>
                        <h2 className="text-2xl font-bold text-[color:var(--text-h)] mb-4">Quick answers about PPC, CrPC & workflows</h2>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Common questions people ask when trying to understand criminal procedure and next steps. pakJustice keeps guidance scope-limited to PPC/CrPC and encourages verification against authentic statutory text.
                        </p>

                        <div className="space-y-3">
                            {faqs.map((item, i) => {
                                const isOpen = openFaq === i;
                                const contentId = `faq-${i}`;

                                return (
                                    <div
                                        key={item.q}
                                        className="rounded-xl border border-[color:var(--border)] bg-[color:var(--bg)]"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenFaq((prev) => (prev === i ? -1 : i))}
                                            className="w-full flex items-center justify-between gap-4 p-4 text-left"
                                            aria-expanded={isOpen}
                                            aria-controls={contentId}
                                        >
                                            <span className="text-sm font-semibold text-[color:var(--text-h)]">
                                                {item.q}
                                            </span>
                                            <span
                                                className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--code-bg)] text-cyan-400 transition-transform duration-300 ${
                                                    isOpen ? "rotate-45" : "rotate-0"
                                                }`}
                                                aria-hidden="true"
                                            >
                                                <Plus size={18} />
                                            </span>
                                        </button>

                                        <div
                                            id={contentId}
                                            className={`px-4 overflow-hidden transition-all duration-300 ${
                                                isOpen ? "max-h-[220px] pb-4 opacity-100" : "max-h-0 pb-0 opacity-0"
                                            }`}
                                        >
                                            <p className="text-sm text-slate-400 leading-relaxed">{item.a}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 sm:px-6 lg:px-32">
                <div className="max-w-6xl mx-auto">
                    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[color:var(--code-bg)] to-cyan-950/20 p-8 md:p-10 shadow-xl shadow-cyan-500/5">

                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ShieldCheck size={120} className="text-cyan-500" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                            <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-[color:var(--text-h)] mb-2 tracking-tight">
                                    Educational guidance only
                                </h2>
                                <p className="text-[color:var(--text)] text-sm leading-relaxed max-w-3xl">
                                    pakJustice provides general information and helps users think through legal
                                    questions. It does <span className="text-[color:var(--text-h)] font-medium">not</span> provide legal advice. Always verify key points
                                    against the official statutory text and, for urgent or high-stakes matters, consult a qualified lawyer.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-[color:var(--bg)] border border-[color:var(--border)] text-[color:var(--text)]">NOT LEGAL ADVICE</span>
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-[color:var(--bg)] border border-[color:var(--border)] text-[color:var(--text)]">EDUCATIONAL PURPOSE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default AboutUs;