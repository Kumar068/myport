import {
  useEffect, useRef, useState, useCallback,
  createContext, useContext, useMemo
} from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import {
  Sun, Moon, ArrowUpRight, Mail, Phone,
  Linkedin, Github, ChevronDown, ExternalLink, Star
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

// ─── Theme ────────────────────────────────────────────────────────────────────
const ThemeCtx = createContext<{ dark: boolean; toggle: () => void }>({ dark: false, toggle: () => { } });
const useTheme = () => useContext(ThemeCtx);

// ─── Images ───────────────────────────────────────────────────────────────────
const IMG = {
  desk1: "https://images.unsplash.com/photo-1515504846179-94ac6b34ebb9?w=900&h=600&fit=crop&auto=format",
  desk2: "https://images.unsplash.com/photo-1672957581665-bdc4a16b8347?w=900&h=600&fit=crop&auto=format",
  desk3: "https://images.unsplash.com/photo-1643114964010-8b077e281a50?w=900&h=600&fit=crop&auto=format",
  abstract1: "https://images.unsplash.com/photo-1689443111130-6e9c7dfd8f9e?w=800&h=600&fit=crop&auto=format",
  abstract2: "https://images.unsplash.com/photo-1689443111070-2c1a1110fe82?w=800&h=600&fit=crop&auto=format",
  abstract3: "https://images.unsplash.com/photo-1754738381790-8caa4bb0a670?w=900&h=600&fit=crop&auto=format",
  dashboard: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop&auto=format",
  dashboard2: "https://images.unsplash.com/photo-1686061593213-98dad7c599b9?w=900&h=600&fit=crop&auto=format",
  ecom: "https://images.unsplash.com/photo-1757301714935-c8127a21abc6?w=900&h=600&fit=crop&auto=format",
  mobile: "https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?w=600&h=900&fit=crop&auto=format",
  portrait: "https://images.unsplash.com/photo-1735948055457-8d816fb80a87?w=800&h=1000&fit=crop&auto=format",
  stock1: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=900&h=600&fit=crop&auto=format",
  stock2: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900&h=600&fit=crop&auto=format",
};

// ─── Noise SVG overlay (premium texture) ─────────────────────────────────────
const NoiseOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "128px",
    }}
  />
);

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const [p, setP] = useState(0);
  const { dark } = useTheme();
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setP(el.scrollTop / (el.scrollHeight - el.clientHeight));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent">
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: p,
          background: dark ? "linear-gradient(90deg,#22D3EE,#818CF8)" : "linear-gradient(90deg,#4F46E5,#7C3AED)",
        }}
      />
    </div>
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 450, damping: 35 });
  const ringY = useSpring(cursorY, { stiffness: 450, damping: 35 });
  const [variant, setVariant] = useState<"default" | "hover" | "image">("default");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      const t = e.target as HTMLElement;
      const nearest = t.closest("[data-cursor]") as HTMLElement | null;
      if (nearest) {
        setVariant(nearest.dataset.cursor as any);
        setLabel(nearest.dataset.cursorLabel || "");
      } else if (t.closest("a,button")) {
        setVariant("hover");
        setLabel("");
      } else {
        setVariant("default");
        setLabel("");
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-foreground pointer-events-none z-[9998] mix-blend-difference"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      {/* Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997] mix-blend-difference flex items-center justify-center rounded-full border border-foreground/60 transition-all duration-200"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          width: variant === "image" ? 96 : variant === "hover" ? 52 : 32,
          height: variant === "image" ? 96 : variant === "hover" ? 52 : 32,
        }}
      >
        {label && (
          <span className="text-[9px] font-black tracking-widest uppercase text-white leading-tight text-center px-1">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}

// ─── Preloader ────────────────────────────────────────────────────────────────
function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"counting" | "done">("counting");

  useEffect(() => {
    let c = 0;
    const id = setInterval(() => {
      const step = Math.floor(Math.random() * 7) + 2;
      c = Math.min(c + step, 100);
      setCount(c);
      if (c >= 100) {
        clearInterval(id);
        setTimeout(() => { setPhase("done"); setTimeout(onDone, 600); }, 300);
      }
    }, 35);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9990] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Background abstract */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${IMG.abstract3})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(40px) saturate(1.5)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <div className="overflow-hidden mb-2">
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="text-[clamp(3.5rem,12vw,10rem)] font-black tracking-[-0.05em] leading-none text-white"
            style={{ fontFamily: "'Clash Display','Inter',sans-serif" }}
          >
            KUMAR C.
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#22D3EE] text-xs tracking-[0.4em] uppercase mb-12"
        >
          UI/UX · Frontend
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="w-64 h-px bg-white/10 relative origin-left"
        >
          <motion.div
            className="absolute inset-y-0 left-0 bg-[#22D3EE]"
            animate={{ width: `${count}%` }}
            transition={{ duration: 0.05 }}
          />
        </motion.div>
        <motion.p
          className="mt-3 text-4xl font-black tabular-nums text-white/20"
          style={{ fontFamily: "'Clash Display',sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {String(count).padStart(3, "0")}
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─── Marquee Ticker ───────────────────────────────────────────────────────────
function Marquee({ items, reverse = false, speed = 40 }: { items: string[]; reverse?: boolean; speed?: number }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-0"
        animate={{ x: reverse ? ["0%", "33.333%"] : ["0%", "-33.333%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-4">
            <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
              {item}
            </span>
            <span className="text-primary opacity-50">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Tilt Card ────────────────────────────────────────────────────────────────
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1)", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = to / 50;
        const id = setInterval(() => {
          start = Math.min(start + step, to);
          setVal(Math.floor(start));
          if (start >= to) clearInterval(id);
        }, 30);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const { dark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15, duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      className={`fixed top-2 left-4 right-4 z-50 rounded-2xl transition-all duration-500 ${scrolled ? "bg-background/70 backdrop-blur-2xl border border-border shadow-lg shadow-black/5" : ""
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.a
          href="#"
          className="text-xl font-black tracking-tight text-foreground"
          style={{ fontFamily: "'Clash Display',sans-serif" }}
          whileHover={{ scale: 1.05 }}
        >
          KC.
        </motion.a>
        <div className="hidden md:flex items-center gap-8">
          {["Work", "About", "Experience", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/Kumar_C_UI_UX_Resume_04_07_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Resume <ArrowUpRight size={12} />
          </a>
          <button
            onClick={toggle}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-card transition-colors"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={dark ? "moon" : "sun"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {dark ? <Sun size={14} /> : <Moon size={14} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { dark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [roleIdx, setRoleIdx] = useState(0);
  const roles = ["UI/UX Designer", "Product Designer", "Frontend Specialist"];

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    setMouse({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  }, []);

  const floatingImages = [
    { src: IMG.desk1, style: "top-[12%] right-[8%] w-52 h-36 rotate-3", depth: 18 },
    { src: IMG.abstract1, style: "top-[55%] right-[4%] w-36 h-44 -rotate-2", depth: 12 },
    { src: IMG.mobile, style: "bottom-[15%] right-[22%] w-28 h-44 rotate-1", depth: 22 },
    { src: IMG.desk3, style: "top-[20%] left-[2%] w-40 h-28 -rotate-3", depth: 10 },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-0 overflow-hidden"
      onMouseMove={onMove}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full blur-[140px] transition-all duration-1000"
          style={{
            background: dark ? "radial-gradient(circle,rgba(34,211,238,0.08) 0%,transparent 70%)" : "radial-gradient(circle,rgba(79,70,229,0.08) 0%,transparent 70%)",
            transform: `translate(${mouse.x * 30}px,${mouse.y * 30}px)`,
          }}
        />
      </div>

      {/* Floating images */}
      {floatingImages.map((img, i) => (
        <div
          key={i}
          className={`absolute rounded-2xl overflow-hidden shadow-2xl ${img.style}`}
          style={{
            transform: `translate(${mouse.x * img.depth}px,${mouse.y * img.depth}px)`,
            transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            zIndex: 2,
            boxShadow: dark ? "0 25px 60px rgba(0,0,0,0.6)" : "0 25px 60px rgba(0,0,0,0.15)",
          }}
          data-cursor="image"
          data-cursor-label="VIEW"
        >
          <img src={img.src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ))}

      <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-6 flex items-center gap-4"
        >
          <div className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-primary border border-primary/20 rounded-full px-4 py-1.5 bg-primary/5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Available for work
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">UX Certified</span>
          </div>
        </motion.div>

        {/* Massive headline */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-[clamp(5rem,16vw,14rem)] font-black tracking-[-0.05em] leading-[0.85] text-foreground"
            style={{
              fontFamily: "'Clash Display','Inter',sans-serif",
              transform: `translate(${mouse.x * 8}px,${mouse.y * 5}px)`,
              transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
            }}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          >
            KUMAR
          </motion.h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-0 justify-between">
          <div className="overflow-hidden">
            <motion.h1
              className="text-[clamp(5rem,16vw,14rem)] font-black tracking-[-0.05em] leading-[0.85]"
              style={{
                fontFamily: "'Clash Display','Inter',sans-serif",
                WebkitTextStroke: dark ? "2px rgba(255,255,255,0.15)" : "2px rgba(0,0,0,0.12)",
                color: "transparent",
                transform: `translate(${mouse.x * -6}px,${mouse.y * -4}px)`,
                transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
              }}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.12, ease: [0.76, 0, 0.24, 1] }}
            >
              C.
            </motion.h1>
          </div>

          <div className="md:mb-4 max-w-xs">
            <div className="overflow-hidden h-9 mb-3">
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIdx}
                  className="text-xl font-light text-muted-foreground"
                  style={{ fontFamily: "'Inter',sans-serif" }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                >
                  {roles[roleIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
            <motion.p
              className="text-sm text-muted-foreground leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Crafting pixel-perfect digital experiences at the intersection of design thinking and frontend mastery.
            </motion.p>
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <a
                href="#work"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:scale-105 active:scale-95 transition-transform duration-200"
              >
                View Work <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 border border-border text-foreground text-sm font-medium rounded-full hover:bg-card transition-colors"
              >
                Contact
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="relative z-10 mt-16 py-5 border-y border-border overflow-hidden">
        <Marquee items={["UI/UX Design", "React Development", "Design Systems", "Prototyping", "User Research", "Figma", "Accessibility", "Product Design"]} speed={35} />
      </div>

      <a href="#about" className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors z-10">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown size={14} />
        </motion.div>
      </a>
    </section>
  );
}

// ─── About / Manifesto ────────────────────────────────────────────────────────
function About() {
  const { dark } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  const text = "I bridge the gap between design thinking and frontend execution. With 3 years of experience, I transform complex business problems into intuitive, pixel-perfect user journeys. I don't just design interfaces; I build performant, production-grade experiences.";
  const words = text.split(" ");

  useEffect(() => {
    const els = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
    const ctx = gsap.context(() => {
      gsap.fromTo(els,
        { opacity: 0.12, color: "var(--muted-foreground)" },
        {
          opacity: 1,
          color: "var(--foreground)",
          stagger: 0.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "bottom 35%",
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const stats = [
    { value: 3, suffix: "+", label: "Years Experience" },
    { value: 20, suffix: "+", label: "Projects Shipped" },
    { value: 100, suffix: "%", label: "Client Satisfaction" },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-[1fr_1.8fr] gap-20 items-start">
          {/* Left col */}
          <div className="sticky top-28">
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary mb-4 block">
              01 / About
            </span>

            {/* Portrait image */}
            <TiltCard className="relative rounded-2xl overflow-hidden mb-8 aspect-[4/5] bg-card">
              <img
                src={IMG.portrait}
                alt="Kumar C workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div
                  className="px-4 py-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <p className="text-white text-xs font-medium">Kumar C.</p>
                  <p className="text-white/60 text-xs">UI/UX · Frontend</p>
                </div>
              </div>
            </TiltCard>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="p-4 rounded-xl border border-border text-center"
                  style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                >
                  <p
                    className="text-2xl font-black text-foreground"
                    style={{ fontFamily: "'Clash Display',sans-serif", color: dark ? "#22D3EE" : "#4F46E5" }}
                  >
                    <Counter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right col — word-by-word text */}
          <div className="pt-12">
            <p
              className="text-[clamp(1.4rem,2.8vw,2.2rem)] font-light leading-[1.5] mb-12"
              style={{ fontFamily: "'Inter',sans-serif" }}
            >
              {words.map((w, i) => (
                <span
                  key={i}
                  ref={(el) => { wordsRef.current[i] = el; }}
                  className="inline-block mr-[0.28em]"
                  style={{ opacity: 0.12, willChange: "opacity,color" }}
                >
                  {w}
                </span>
              ))}
            </p>

            {/* Image collage */}
            <div className="grid grid-cols-2 gap-4">
              <TiltCard className="rounded-2xl overflow-hidden aspect-video bg-card">
                <img src={IMG.desk2} alt="Workspace" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </TiltCard>
              <TiltCard className="rounded-2xl overflow-hidden aspect-video bg-card">
                <img src={IMG.abstract2} alt="Abstract design" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </TiltCard>
              <TiltCard className="col-span-2 rounded-2xl overflow-hidden h-48 bg-card">
                <img src={IMG.desk3} alt="Design setup" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-end p-6">
                  <div>
                    <p className="text-white text-sm font-semibold">Bengaluru, India</p>
                    <p className="text-white/60 text-xs">Available for remote + onsite</p>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills Bento ─────────────────────────────────────────────────────────────
function Skills() {
  const { dark } = useTheme();

  const skillBars = [
    { name: "Figma / XD", pct: 95 },
    { name: "React / JS", pct: 88 },
    { name: "UI Design", pct: 92 },
    { name: "CSS / Tailwind", pct: 90 },
  ];

  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">02 / Skills</span>
          <h2
            className="mt-3 text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tight text-foreground"
            style={{ fontFamily: "'Clash Display',sans-serif" }}
          >
            Core Competencies
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto gap-4">
          {/* Design tools — large card */}
          <TiltCard className="md:col-span-2 md:row-span-1 relative rounded-2xl overflow-hidden border border-border p-8 min-h-[280px] group cursor-default"
            style={{ background: dark ? "rgba(255,255,255,0.03)" : "#F4F4F8" } as any}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: dark ? "radial-gradient(circle at 50% 0%,rgba(34,211,238,0.08) 0%,transparent 60%)" : "radial-gradient(circle at 50% 0%,rgba(79,70,229,0.06) 0%,transparent 60%)" }} />
            <span className="text-5xl mb-4 block">✦</span>
            <h3 className="text-2xl font-black text-foreground mb-4" style={{ fontFamily: "'Clash Display',sans-serif" }}>Design</h3>
            <div className="flex flex-wrap gap-2">
              {["Figma", "Adobe XD", "FigJam", "UI/UX Design", "Wireframing", "Prototyping", "Design Systems", "AI"].map((s) => (
                <span key={s} className="text-xs font-medium px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-default"
                  style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                  {s}
                </span>
              ))}
            </div>
          </TiltCard>

          {/* Skill bars */}
          <TiltCard className="relative rounded-2xl overflow-hidden border border-border p-7 group cursor-default"
            style={{ background: dark ? "rgba(255,255,255,0.03)" : "#F4F4F8" } as any}>
            <h3 className="text-lg font-black text-foreground mb-6" style={{ fontFamily: "'Clash Display',sans-serif" }}>Proficiency</h3>
            <div className="flex flex-col gap-4">
              {skillBars.map((bar, i) => (
                <motion.div key={bar.name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-foreground">{bar.name}</span>
                    <span className="text-muted-foreground font-mono">{bar.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: dark ? "linear-gradient(90deg,#22D3EE,#818CF8)" : "linear-gradient(90deg,#4F46E5,#7C3AED)" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </TiltCard>

          {/* Frontend */}
          <TiltCard className="relative rounded-2xl overflow-hidden border border-border p-7 group cursor-default"
            style={{ background: dark ? "rgba(255,255,255,0.03)" : "#F4F4F8" } as any}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(circle at 50% 0%,rgba(52,211,153,0.08) 0%,transparent 60%)" }} />
            <span className="text-5xl mb-4 block">⬡</span>
            <h3 className="text-xl font-black text-foreground mb-4" style={{ fontFamily: "'Clash Display',sans-serif" }}>Frontend</h3>
            <div className="flex flex-wrap gap-2">
              {["React", "HTML5", "CSS3", "JavaScript", "TypeScript", "Tailwind CSS"].map((s) => (
                <span key={s} className="text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-default">
                  {s}
                </span>
              ))}
            </div>
          </TiltCard>

          {/* Image card */}
          <TiltCard className="relative rounded-2xl overflow-hidden border border-border group cursor-default aspect-square md:aspect-auto">
            <img src={IMG.abstract3} alt="Abstract" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-lg font-black mb-1" style={{ fontFamily: "'Clash Display',sans-serif" }}>Expertise</h3>
              <div className="flex flex-wrap gap-1.5">
                {["User Research", "Accessibility", "Interaction"].map((s) => (
                  <span key={s} className="text-[10px] font-medium px-2 py-1 rounded-full text-white/80"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </TiltCard>

          {/* Marquee mini */}
          <TiltCard className="rounded-2xl overflow-hidden border border-border p-0 flex flex-col justify-center gap-3 py-6 cursor-default"
            style={{ background: dark ? "rgba(255,255,255,0.03)" : "#F4F4F8" } as any}>
            <Marquee items={["Figma", "React", "Tailwind", "GSAP", "TypeScript"]} speed={18} />
            <Marquee items={["UX Research", "Prototyping", "Design Systems", "Accessibility"]} reverse speed={20} />
            <Marquee items={["Figma", "React", "Tailwind", "GSAP", "TypeScript"]} speed={22} />
          </TiltCard>
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────
function Experience() {
  const { dark } = useTheme();
  const lineRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeJob, setActiveJob] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current,
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "bottom 50%", scrub: 1 } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const jobs = [
    {
      title: "Software Engineer (SDE-I)",
      company: "Acufore",
      period: "Dec 2023 – Present",
      type: "Full-time",
      color: dark ? "#22D3EE" : "#4F46E5",
      img: IMG.dashboard,
      metrics: [{ v: "40%", l: "Faster Delivery" }, { v: "60%", l: "Less Tickets" }, { v: "3×", l: "Team Scale" }],
      bullets: [
        "Crafted interactive web interfaces for enterprise applications, ensuring accessibility and modular component design in React.",
        "Developed a scalable new design system, drastically reducing project turnaround time and boosting team productivity.",
        "Redesigned core UI, resulting in increased user engagement and reduced usability support queries.",
      ],
    },
    {
      title: "Web Developer Intern",
      company: "IBM",
      period: "Aug 2022 – Sep 2022",
      type: "Internship",
      color: dark ? "#34D399" : "#059669",
      img: IMG.dashboard2,
      metrics: [{ v: "2mo", l: "Duration" }, { v: "5+", l: "Features Built" }, { v: "A+", l: "Performance" }],
      bullets: [
        "Assisted in developing responsive React/Node.js applications, optimizing UI performance and refining frontend functionality.",
        "Collaborated with cross-functional teams to implement UI improvements informed by user testing feedback.",
      ],
    },
  ];

  return (
    <section id="experience" ref={sectionRef} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">03 / Experience</span>
        <h2 className="mt-3 mb-20 text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tight text-foreground"
          style={{ fontFamily: "'Clash Display',sans-serif" }}>
          Where I've Worked
        </h2>

        <div className="grid md:grid-cols-[300px_1fr] gap-16">
          {/* Timeline nav */}
          <div className="relative">
            <div className="absolute left-4 top-2 bottom-2 w-px bg-border">
              <div ref={lineRef} className="absolute top-0 left-0 w-full bg-primary h-full" style={{ scaleY: 0, transformOrigin: "top" }} />
            </div>
            <div className="flex flex-col gap-6 pl-12">
              {jobs.map((job, i) => (
                <button
                  key={i}
                  onClick={() => setActiveJob(i)}
                  className="text-left group"
                >
                  <div className={`absolute left-2.5 mt-1 w-3 h-3 rounded-full border-2 transition-all duration-300 ${activeJob === i ? "border-primary scale-125" : "border-muted-foreground scale-100"}`}
                    style={{ background: activeJob === i ? "var(--primary)" : "var(--background)" }} />
                  <p className={`text-sm font-semibold transition-colors ${activeJob === i ? "text-foreground" : "text-muted-foreground"}`}>
                    {job.company}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{job.period}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active job detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeJob}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Hero image for role */}
              <div className="relative rounded-2xl overflow-hidden h-48 mb-8 bg-card">
                <img src={jobs[activeJob].img} alt={jobs[activeJob].company} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 flex items-center px-8">
                  <div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full mb-3 inline-block"
                      style={{ background: `${jobs[activeJob].color}20`, color: jobs[activeJob].color, border: `1px solid ${jobs[activeJob].color}30` }}>
                      {jobs[activeJob].type}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-1" style={{ fontFamily: "'Clash Display',sans-serif" }}>
                      {jobs[activeJob].title}
                    </h3>
                    <p style={{ color: jobs[activeJob].color }} className="font-semibold text-sm">
                      @ {jobs[activeJob].company}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {jobs[activeJob].metrics.map((m) => (
                  <div key={m.l} className="p-4 rounded-xl border border-border text-center"
                    style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                    <p className="text-2xl font-black" style={{ fontFamily: "'Clash Display',sans-serif", color: jobs[activeJob].color }}>
                      {m.v}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{m.l}</p>
                  </div>
                ))}
              </div>

              {/* Bullets */}
              <ul className="flex flex-col gap-3">
                {jobs[activeJob].bullets.map((b, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.08 }}
                    className="flex gap-3 text-sm text-muted-foreground leading-relaxed"
                  >
                    <span className="mt-0.5 shrink-0 text-xs" style={{ color: jobs[activeJob].color }}>▸</span>
                    {b}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// ─── Projects — Horizontal Scroll ────────────────────────────────────────────
function Projects() {
  const { dark } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const isDragging = useRef(false);

  const projects = [
    {
      title: "HR Management System",
      desc: "Intuitive dashboards and employee workflows for enterprise HR operations. End-to-end UX research, wireframing, and React implementation.",
      tags: ["React", "Figma", "Design System", "Enterprise"],
      img: IMG.dashboard,
      preview: IMG.dashboard2,
      num: "01",
      year: "2024",
      accent: dark ? "#22D3EE" : "#4F46E5",
      bg: dark ? "linear-gradient(135deg,#0D1A2A,#0A0F14)" : "linear-gradient(135deg,#EEF2FF,#F8FAFC)",
      link: "#",
    },
    {
      title: "Enterprise level product showcase 3d interactable",
      desc: "Immersive 3D product experience for enterprise-level marketing. Featuring interactive camera movement, custom real-time shaders, and optimized WebGL/R3F rendering.",
      tags: ["Three.js", "React Three Fiber", "WebGL", "GSAP"],
      img: IMG.ecom,
      preview: IMG.mobile,
      num: "02",
      year: "2024",
      accent: dark ? "#34D399" : "#059669",
      bg: dark ? "linear-gradient(135deg,#0A1F1A,#080F0D)" : "linear-gradient(135deg,#ECFDF5,#F8FAFC)",
      link: "https://growth.playerstat.ai",
    },
    {
      title: "Video Editor Portfolio",
      desc: "Cinematic personal portfolio for a professional video editor, featuring smooth web animations, custom video integration, and dynamic projects showreel.",
      tags: ["React", "GSAP", "Lenis", "Motion"],
      img: IMG.abstract1,
      preview: IMG.abstract3,
      num: "03",
      year: "2025",
      accent: dark ? "#F472B6" : "#DB2777",
      bg: dark ? "linear-gradient(135deg,#1A0D1A,#0F080F)" : "linear-gradient(135deg,#FDF2F8,#F8FAFC)",
      link: "https://vepup.netlify.app/",
    },
    {
      title: "Interactive Riders Connect",
      desc: "A real-time platform connecting motorcycle riders. Features interactive route planning, live group ride tracking, and community event organization.",
      tags: ["React", "Leaflet", "WebSockets", "Tailwind"],
      img: IMG.abstract2,
      preview: IMG.desk2,
      num: "04",
      year: "2024",
      accent: dark ? "#FBBF24" : "#D97706",
      bg: dark ? "linear-gradient(135deg,#1A1500,#0F0E00)" : "linear-gradient(135deg,#FFFBEB,#F8FAFC)",
      link: "https://www.figma.com/design/Peza3mSCpvI1Eq2Cp07psY/Riders-Connect-Case-Study?m=auto&t=mtAU6xvtRI51bia4-1",
    },
    {
      title: "Stock Market News Platform",
      desc: "Real-time financial market tracker and news aggregation hub. Featuring high-density data tables, responsive interactive charts, and tailored stock alert configurations.",
      tags: ["Figma", "UX/UI Design", "Data Visualization", "Finance"],
      img: IMG.stock1,
      preview: IMG.stock2,
      num: "05",
      year: "2025",
      accent: dark ? "#A78BFA" : "#7C3AED",
      bg: dark ? "linear-gradient(135deg,#1E112C,#0F0816)" : "linear-gradient(135deg,#F5F3FF,#F8FAFC)",
      link: "https://www.figma.com/design/tRokg4vrgjbyfc5kJCDHxs/stock-news-update?m=auto&t=JirJrfYn67enI9LN-1",
    },
  ];

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        const maxDrag = trackWidth - containerWidth;
        setConstraints({
          left: maxDrag > 0 ? -maxDrag : 0,
          right: 0,
        });
      }
    };

    updateConstraints();
    const timer = setTimeout(updateConstraints, 100);

    window.addEventListener("resize", updateConstraints);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateConstraints);
    };
  }, [projects]);

  const onMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section id="work" ref={sectionRef} className="h-screen overflow-hidden" onMouseMove={onMouseMove}>
      <div className="h-full flex flex-col justify-center">
        {/* Header */}
        <div className="px-6 pt-20 pb-8 max-w-7xl mx-auto w-full flex items-end justify-between shrink-0">
          <div>
            <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">04 / Selected Works</span>
            <h2 className="mt-3 text-[clamp(2.5rem,6vw,5rem)] font-black tracking-tight text-foreground"
              style={{ fontFamily: "'Clash Display',sans-serif" }}>
              What I've Built
            </h2>
          </div>
          <p className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <motion.span animate={{ x: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>→</motion.span>
            drag to explore
          </p>
        </div>

        {/* Drag Container */}
        <div ref={containerRef} className="w-full overflow-hidden cursor-grab active:cursor-grabbing">
          {/* Horizontal track */}
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={constraints}
            dragElastic={0.15}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="flex gap-5 px-6 pb-6 will-change-transform shrink-0 touch-pan-y"
            style={{ width: "max-content" }}
          >
            {projects.map((p, i) => (
              <motion.a
                key={i}
                href={p.link}
                onClick={handleLinkClick}
                target={p.link && p.link !== "#" ? "_blank" : undefined}
                rel={p.link && p.link !== "#" ? "noopener noreferrer" : undefined}
                className="relative w-[min(82vw,440px)] shrink-0 rounded-2xl overflow-hidden border border-border group block"
                style={{ background: p.bg, minHeight: 480 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                data-cursor="hover"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-900">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                      style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.25)" }}>
                      {p.link && p.link.includes("figma.com") ? "View Case Study" : p.link && p.link.startsWith("http") ? "View Live Site" : "View Case Study"} <ExternalLink size={12} />
                    </div>
                  </div>
                  {/* Year badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-mono font-medium text-white"
                    style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}>
                    {p.year}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-black opacity-30" style={{ fontFamily: "'Clash Display',sans-serif" }}>
                      {p.num}
                    </span>
                    <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </div>
                  <h3 className="text-xl font-black text-foreground mb-2" style={{ fontFamily: "'Clash Display',sans-serif" }}>
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">{p.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ color: p.accent, background: `${p.accent}12`, border: `1px solid ${p.accent}25` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom rim glow on hover */}
                <div
                  className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg,transparent,${p.accent},transparent)` }}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating preview image on hover */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div
            className="fixed pointer-events-none z-50 w-36 h-24 rounded-xl overflow-hidden shadow-2xl"
            style={{ left: cursorPos.x + 20, top: cursorPos.y - 50 }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <img src={projects[hoveredIdx].preview} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Footer / Contact ─────────────────────────────────────────────────────────
function Footer() {
  const { dark } = useTheme();
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".footer-line", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: { trigger: headRef.current, start: "top 80%" },
      });
    }, headRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="relative py-24 px-6 overflow-hidden">
      {/* BG image with overlay */}
      <div className="absolute inset-0">
        <img src={IMG.abstract3} alt="" className="w-full h-full object-cover opacity-[0.06] dark:opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <span className="text-xs font-medium tracking-[0.25em] uppercase text-primary">05 / Contact</span>

        {/* Giant heading */}
        <div ref={headRef} className="mt-8 mb-16 overflow-hidden">
          {["LET'S", "TALK."].map((line) => (
            <div key={line} className="overflow-hidden">
              <div
                className="footer-line text-[clamp(5rem,16vw,13rem)] font-black tracking-[-0.05em] leading-[0.85] text-foreground"
                style={{ fontFamily: "'Clash Display',sans-serif" }}
              >
                {line}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Contact details */}
          <div className="flex flex-col gap-5">
            {[
              { icon: Mail, label: "kumaruiuxmail@gmail.com", href: "mailto:kumaruiuxmail@gmail.com" },
              { icon: Phone, label: "+91 79756 72941", href: "tel:+917975672941" },
            ].map(({ icon: Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                className="group flex items-center gap-4 p-5 rounded-2xl border border-border hover:border-primary/30 transition-all duration-300"
                style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                whileHover={{ x: 6 }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: dark ? "rgba(34,211,238,0.1)" : "rgba(79,70,229,0.08)" }}>
                  <Icon size={16} className="text-primary" />
                </div>
                <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">{label}</span>
                <ArrowUpRight size={14} className="ml-auto text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
              </motion.a>
            ))}

            {/* Social links */}
            <div className="flex gap-4 pt-2">
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Github, label: "GitHub" },
              ].map(({ icon: Icon, label }) => (
                <a key={label} href="#"
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all duration-300">
                  <Icon size={14} />
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right col — image + badge */}
          <div className="flex flex-col gap-4">
            <TiltCard className="relative rounded-2xl overflow-hidden h-52 bg-card">
              <img src={IMG.desk1} alt="Workspace" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <p className="text-white font-semibold text-sm mb-1">Open to opportunities</p>
                  <p className="text-white/60 text-xs">Full-time · Contract · Freelance</p>
                </div>
              </div>
            </TiltCard>

            <div className="flex items-center gap-3 p-4 rounded-2xl border border-border"
              style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Star size={16} className="fill-amber-400 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Certified Google UX Design Professional</p>
                <p className="text-xs text-muted-foreground">Google · UX Design Certificate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="mt-20 pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <span className="font-black text-lg text-foreground" style={{ fontFamily: "'Clash Display',sans-serif" }}>KC.</span>
          <span className="font-mono">© {new Date().getFullYear()} Kumar C. All rights reserved.</span>
          <span className="flex items-center gap-1">Designed & Developed with <span className="text-red-400">♥</span></span>
        </div>
      </div>
    </section>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const toggle = useCallback(() => setDark((d) => !d), []);

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  useEffect(() => {
    if (!loaded) return;
    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
    const tick = (t: number) => { lenis.raf(t); requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    return () => lenis.destroy();
  }, [loaded]);

  return (
    <ThemeCtx.Provider value={{ dark, toggle }}>
      <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500"
        style={{ fontFamily: "'Inter',sans-serif" }}>
        <style>{`
          *, *::before, *::after { cursor: none !important; }
          html { scroll-behavior: auto !important; }
          ::-webkit-scrollbar { display: none; }
          * { scrollbar-width: none; }
        `}</style>

        <NoiseOverlay />
        <Cursor />
        <ScrollProgress />

        <AnimatePresence onExitComplete={() => setLoaded(true)}>
          {loading && <Preloader key="loader" onDone={() => setLoading(false)} />}
        </AnimatePresence>

        {loaded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Nav />
            <Hero />
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Footer />
          </motion.div>
        )}
      </div>
    </ThemeCtx.Provider>
  );
}
