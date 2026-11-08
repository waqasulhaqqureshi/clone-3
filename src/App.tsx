import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

const SKILLS = [
  "Web Developer",
  "App Developer",
  "UI/UX Designer",
  "Graphic Designer",
  "Photographer",
];

const LOADER_PILLS = [
  { label: "Rishi Thakor", color: "#1F1C1C", text: "#E8E4E0", direction: 1 },
  { label: "Web development", color: "#22304A", text: "#E8E4E0", direction: -1 },
  { label: "App development", color: "#4A3540", text: "#E8E4E0", direction: 1 },
  { label: "UI/UX design", color: "#7A8670", text: "#F3EEEC", direction: -1 },
  { label: "Graphic design", color: "#A4552C", text: "#F3EEEC", direction: 1 },
  { label: "Photography", color: "#C4B0B0", text: "#1A1818", direction: -1 },
];

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Web Development", href: "#web-development" },
  { label: "App Development", href: "#app-development" },
  { label: "UI/UX Design", href: "#ui-ux-design" },
  { label: "Graphic Design", href: "#graphic-design" },
  { label: "My story", href: "#about" },
  { label: "Contact", href: "mailto:rishithakor218@gmail.com" },
];

type Theme = "light" | "dark";
type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

function revealDelay(delay: string): StyleWithVars {
  return { "--d": delay };
}

function readTheme(): Theme {
  try {
    return localStorage.getItem("rishi-mode") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function readAnalyticsChoice() {
  try {
    return localStorage.getItem("rishi-analytics") === null;
  } catch {
    return true;
  }
}

function IntroLoader({ onReady }: { onReady: () => void }) {
  const [visible, setVisible] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const pillsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      onReady();
      return;
    }

    let raf = 0;
    let outTimer = 0;
    let readyTimer = 0;
    let removeTimer = 0;
    const started = performance.now() + 1000;

    const tick = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - started) / 1600));
      const eased =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      loaderRef.current?.style.setProperty("--p", eased.toFixed(3));
      if (countRef.current) {
        countRef.current.textContent = String(Math.round(eased * 100)).padStart(3, "0");
      }
      pillsRef.current.forEach((pill, index) => {
        pill?.classList.toggle("on", eased >= index / 6 + 0.02 || eased >= 1);
      });

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }

      outTimer = window.setTimeout(() => {
        loaderRef.current?.classList.add("out");
        readyTimer = window.setTimeout(onReady, 260);
        removeTimer = window.setTimeout(() => setVisible(false), 1250);
      }, 520);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(outTimer);
      window.clearTimeout(readyTimer);
      window.clearTimeout(removeTimer);
    };
  }, [onReady]);

  if (!visible) return null;

  return (
    <div className="loader" id="loader" aria-hidden="true" ref={loaderRef}>
      <div className="ld__bg" />
      <div className="ld__stack">
        {LOADER_PILLS.map((pill, index) => (
          <div
            className="ld__pill"
            key={pill.label}
            ref={(node) => {
              pillsRef.current[index] = node;
            }}
            style={
              {
                "--k": index,
                "--c": pill.color,
                "--t": pill.text,
                "--dir": pill.direction,
              } as CSSProperties
            }
          >
            <span>{pill.label}</span>
          </div>
        ))}
      </div>
      <div className="ld__hud">
        <div className="ld__top">
          <span>
            <b>Rishi Thakor</b> · Portfolio
          </span>
          <span>Web · App · UI/UX · Graphic design</span>
        </div>
        <div className="ld__bot">
          <p className="ld__num">
            <small>Opening up the work</small>
            <span ref={countRef}>000</span>
          </p>
          <div className="ld__bar">
            <i />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatClock(date: Date) {
  const hour = date.getHours();
  const month = date.toLocaleString("en", { month: "long" });
  const shortMonth = date.toLocaleString("en", { month: "short" });
  return {
    time: `${hour % 12 || 12}:${String(date.getMinutes()).padStart(2, "0")}${hour < 12 ? "am" : "pm"}`,
    date: `${date.getDate()} ${month}, ${date.getFullYear()}`,
    shortDate: `${date.getDate()} ${shortMonth}`,
  };
}

function Header({ onMenu }: { onMenu: () => void }) {
  const [now, setNow] = useState(() => new Date());
  const [stuck, setStuck] = useState(false);
  const clock = formatClock(now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    const update = () => setStuck(window.scrollY > 24);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <header className={`hdr reveal ${stuck ? "stuck" : ""}`}>
      <div className="shell hdr__in">
        <nav aria-label="Primary">
          <ul className="nav">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-current={index === 0 ? "page" : undefined}
                  onClick={item.href === "#home" ? () => window.scrollTo({ top: 0 }) : undefined}
                >
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hdr__right">
          <div className="chip clock" aria-label={`Local time ${clock.time}`}>
            <span className="clock__lbl">Local time</span>
            <span className="clock__time tnum">{clock.time}</span>
            <span className="clock__sep" aria-hidden="true">
              ·
            </span>
            <span className="clock__date">{clock.date}</span>
            <span className="clock__ds">{clock.shortDate}</span>
          </div>
          <button
            className="chip menu-btn"
            type="button"
            aria-label="Menu"
            aria-haspopup="dialog"
            onClick={onMenu}
          >
            <span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="word">Menu</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function PullCord({
  theme,
  isReady,
  onToggle,
}: {
  theme: Theme;
  isReady: boolean;
  onToggle: () => void;
}) {
  const [layout, setLayout] = useState({ width: 340, anchor: 320, length: 250 });
  const [pull, setPull] = useState(0);
  const startY = useRef(0);
  const startAt = useRef(0);
  const active = useRef(false);
  const toggled = useRef(false);

  useEffect(() => {
    const measure = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const width = Math.min(viewportWidth, 340);
      const clockElement = document.querySelector<HTMLElement>(".clock");
      const clockRight = clockElement?.getBoundingClientRect().right ?? 0;
      const offset =
        viewportWidth >= 1200 && clockElement?.offsetWidth
          ? Math.max(1.2 * rem, viewportWidth - clockRight - 1.4 * rem)
          : 2.4 * rem;
      const length =
        viewportWidth >= 1024
          ? Math.min(270, Math.max(190, viewportHeight * 0.3))
          : viewportWidth >= 640
            ? Math.min(220, Math.max(160, viewportHeight * 0.2))
            : 70;

      setLayout({ width, anchor: width - offset, length });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const endY = layout.length + pull;
  const endX = layout.anchor - 4;
  const path = `M ${layout.anchor} -88 C ${layout.anchor - 12} 30 ${layout.anchor + 14} ${endY * 0.62} ${endX} ${endY}`;

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    active.current = true;
    toggled.current = false;
    startY.current = event.clientY;
    startAt.current = performance.now();
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!active.current) return;
    const nextPull = Math.max(0, Math.min(74, event.clientY - startY.current));
    setPull(nextPull);
    if (nextPull > 40 && !toggled.current) {
      toggled.current = true;
      onToggle();
    }
  };

  const onPointerUp = () => {
    if (!active.current) return;
    active.current = false;
    if (!toggled.current && performance.now() - startAt.current < 300) onToggle();
    setPull(0);
  };

  const keyToggle = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div className={`cord ${isReady ? "dropped" : ""}`}>
      <svg
        className="cord__cv"
        viewBox={`0 0 ${layout.width} 520`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cord-knob" x1="-3.6" x2="3.6" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5b4a2c" />
            <stop offset="0.3" stopColor="#e8d59e" />
            <stop offset="0.55" stopColor="#b0924f" />
            <stop offset="1" stopColor="#4a3a1f" />
          </linearGradient>
          <linearGradient id="cord-wood" x1="-9.6" x2="9.6" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#24150c" />
            <stop offset="0.22" stopColor="#6b3f22" />
            <stop offset="0.4" stopColor="#a8693d" />
            <stop offset="0.58" stopColor="#7c4828" />
            <stop offset="0.85" stopColor="#3b2213" />
            <stop offset="1" stopColor="#1d110a" />
          </linearGradient>
          <radialGradient id="cord-key" cx="-3.6" cy="17" r="9" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(255,226,190,.42)" />
            <stop offset="1" stopColor="rgba(255,226,190,0)" />
          </radialGradient>
          <linearGradient id="cord-occlusion" x1="0" x2="0" y1="24" y2="35.5" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(0,0,0,0)" />
            <stop offset="1" stopColor="rgba(0,0,0,.35)" />
          </linearGradient>
          <clipPath id="cord-knob-clip">
            <path d="M-3.1 6.2 C-3.6 10.5 -9.6 13.5 -9.6 22.5 C-9.6 30.5 -5.4 35 0 35 C5.4 35 9.6 30.5 9.6 22.5 C9.6 13.5 3.6 10.5 3.1 6.2Z" />
          </clipPath>
        </defs>
        <g className="cord__art">
          <path
            d={path}
            transform="translate(7 11)"
            stroke={theme === "dark" ? "rgba(0,0,0,.46)" : "rgba(0,0,0,.18)"}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          <path d={path} stroke="#6f6455" strokeWidth="4.6" strokeLinecap="round" fill="none" />
          <path d={path} stroke="#d6ccba" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path
            d={path}
            stroke="rgba(96,82,64,.62)"
            strokeWidth="0.9"
            strokeLinecap="round"
            strokeDasharray="2.6 2.2"
            fill="none"
          />
          <path d={path} transform="translate(-0.7 -0.3)" stroke="rgba(255,252,244,.55)" strokeWidth="0.9" strokeLinecap="round" fill="none" />
          <g transform={`translate(${endX + 7} ${endY + 11}) rotate(-5)`}>
            <path d="M-3.1 6.2 C-3.6 10.5 -9.6 13.5 -9.6 22.5 C-9.6 30.5 -5.4 35 0 35 C5.4 35 9.6 30.5 9.6 22.5 C9.6 13.5 3.6 10.5 3.1 6.2Z" fill="rgba(0,0,0,.28)" />
          </g>
          <g transform={`translate(${endX} ${endY}) rotate(-5)`}>
            <rect x="-3.5" y="-0.6" width="7" height="7.6" rx="1.2" fill="url(#cord-knob)" />
            <path d="M-3.5 2.6h7M-3.5 4.4h7" stroke="rgba(0,0,0,.25)" strokeWidth="0.6" />
            <path d="M-3.1 6.2 C-3.6 10.5 -9.6 13.5 -9.6 22.5 C-9.6 30.5 -5.4 35 0 35 C5.4 35 9.6 30.5 9.6 22.5 C9.6 13.5 3.6 10.5 3.1 6.2Z" fill="url(#cord-wood)" />
            <g clipPath="url(#cord-knob-clip)" fill="none" stroke="rgba(30,14,6,.28)" strokeWidth="0.55">
              <path d="M-7 8C-4 16-7 25-5 35M-5 8C-2 16-5 26-3 35M-2.5 8C0 16-2 27 0 35M0 8C2 16 1 27 2 35M2.5 8C5 16 4 27 5 35M5 8C8 16 7 26 8 35" />
            </g>
            <path d="M-3.1 6.2 C-3.6 10.5 -9.6 13.5 -9.6 22.5 C-9.6 30.5 -5.4 35 0 35 C5.4 35 9.6 30.5 9.6 22.5 C9.6 13.5 3.6 10.5 3.1 6.2Z" fill="url(#cord-key)" />
            <path d="M-3.1 6.2 C-3.6 10.5 -9.6 13.5 -9.6 22.5 C-9.6 30.5 -5.4 35 0 35 C5.4 35 9.6 30.5 9.6 22.5 C9.6 13.5 3.6 10.5 3.1 6.2Z" fill="url(#cord-occlusion)" />
            <ellipse cx="-4.4" cy="20.5" rx="1.1" ry="5.2" transform="rotate(-4.6 -4.4 20.5)" fill="rgba(255,240,220,.38)" />
          </g>
        </g>
      </svg>
      <button
        className="cord__hit"
        type="button"
        role="switch"
        aria-label="Dark mode (pull the cord)"
        aria-checked={theme === "dark"}
        style={{ left: `${layout.anchor - 34}px`, top: `${endY + 16}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={keyToggle}
      />
    </div>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="nav-modal" role="dialog" aria-modal="true" aria-label="Navigation menu" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="nav-modal__panel">
        <div className="nav-modal__top">
          <span>Rishi Thakor</span>
          <button className="nav-modal__close" type="button" onClick={onClose} ref={closeRef}>
            Close
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>
        <ol className="nav-modal__list">
          {NAV_ITEMS.map((item, index) => (
            <li key={item.label}>
              <a href={item.href} onClick={onClose}>
                <small>0{index + 1}</small>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function AbilityCardDialog({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const tiltCard = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const px = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const py = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    card.style.setProperty("--rx", `${-py * 10}deg`);
    card.style.setProperty("--ry", `${px * 10}deg`);
    card.style.setProperty("--px", px.toFixed(3));
    card.style.setProperty("--py", py.toFixed(3));
  };

  const resetTilt = () => {
    const card = cardRef.current;
    card?.style.setProperty("--rx", "0deg");
    card?.style.setProperty("--ry", "0deg");
    card?.style.setProperty("--px", "0");
    card?.style.setProperty("--py", "0");
  };

  return (
    <div className="holo" role="dialog" aria-modal="true" aria-label="Rishi's ability card" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="holo__lite in">
        <button
          className={`hc ${flipped ? "flip" : "live"}`}
          id="hc"
          type="button"
          aria-label="Flip the card"
          ref={cardRef}
          onPointerMove={tiltCard}
          onPointerLeave={resetTilt}
          onClick={() => setFlipped((value) => !value)}
        >
          <i className="hc__aura" />
          <span className="hc__in">
            <span className="hc__face hc__front">
              <span className="hc__win">
                <img className="hc__bg" src="/card/win_bg.webp" alt="" />
                <img className="hc__sub" src="/card/win_sub.webp" alt="" />
                <i className="hc__wsh" />
              </span>
              <img className="hc__plate" src="/card/plate.webp" alt="Rishi Thakor's ability card" />
              <i className="hc__foil" />
              <i className="hc__sheen" />
              <i className="hc__glare" />
              <i className="hc__rim" />
            </span>
            <span className="hc__face hc__back">
              <img className="hc__backimg" src="/card/back.webp" alt="" />
              <i className="hc__foil" />
              <i className="hc__glare" />
              <i className="hc__rim" />
            </span>
          </span>
        </button>
        <p className="hc__hint">
          <span className="hc__hm">Move across the card</span>
          <span className="hc__ht">Tilt or drag it</span> · tap to flip
        </p>
      </div>
      <button className="holo__x" type="button" onClick={onClose} ref={closeRef}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
        Close
      </button>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [isReady, setIsReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [showAnalyticsChoice, setShowAnalyticsChoice] = useState(readAnalyticsChoice);
  const [skillIndex, setSkillIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [ringCount, setRingCount] = useState(8);
  const figureRef = useRef<HTMLDivElement>(null);
  const portraitCanvasRef = useRef<HTMLCanvasElement>(null);
  const calendarRef = useRef<HTMLSpanElement>(null);
  const calendarBodyRef = useRef<HTMLSpanElement>(null);
  const calendarMeasureRef = useRef<HTMLSpanElement>(null);
  const cardTriggerRef = useRef<HTMLButtonElement>(null);

  const onReady = useCallback(() => setIsReady(true), []);
  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);
  const closeCard = useCallback(() => {
    setCardOpen(false);
    window.setTimeout(() => cardTriggerRef.current?.focus(), 80);
  }, []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const saveAnalyticsChoice = (choice: "yes" | "no") => {
    try {
      localStorage.setItem("rishi-analytics", choice);
    } catch {
      // Consent remains dismissible if storage is unavailable.
    }
    setShowAnalyticsChoice(false);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.dataset.mode = "dark";
    else delete root.dataset.mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#1A1818" : "#EEEAE6");
    try {
      localStorage.setItem("rishi-mode", theme);
    } catch {
      // The visual mode still works when storage is unavailable.
    }
  }, [theme]);

  useLayoutEffect(() => {
    const cal = calendarRef.current;
    const body = calendarBodyRef.current;
    const measure = calendarMeasureRef.current;
    if (!cal || !body || !measure) return;

    const fit = () => {
      cal.style.fontSize = "";
      const fontSize = parseFloat(getComputedStyle(cal).fontSize) || 1;
      const heading = cal.closest(".h1");
      if (!heading) return;

      let maxWidth = 0;
      SKILLS.forEach((skill) => {
        measure.textContent = skill;
        maxWidth = Math.max(maxWidth, measure.getBoundingClientRect().width);
      });
      const widthInEm = maxWidth / fontSize + 0.86;
      const width = widthInEm * fontSize;
      body.style.setProperty("--cal-w", `${widthInEm.toFixed(3)}em`);
      cal.style.setProperty("--cal-w", `${widthInEm.toFixed(3)}em`);

      const available = heading.getBoundingClientRect().width - fontSize * 0.25;
      if (width > available) cal.style.fontSize = `${(fontSize * available) / width}px`;
      setRingCount(Math.max(5, Math.round((widthInEm - 0.64) / 0.7) + 1));
    };

    fit();
    const observer = new ResizeObserver(fit);
    const heading = cal.closest(".h1");
    if (heading) observer.observe(heading);
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useEffect(() => {
    const stage = figureRef.current;
    const canvas = portraitCanvasRef.current;
    const base = stage?.querySelector("img");
    if (!stage || !canvas || !base) return;
    if (
      window.matchMedia("(max-width: 1023.98px), (hover: none), (prefers-reduced-motion: reduce)").matches
    ) {
      canvas.remove();
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) return;
    const makeCanvas = () => {
      const buffer = document.createElement("canvas");
      return [buffer, buffer.getContext("2d")!] as const;
    };
    const [bwCanvas, bwContext] = makeCanvas();
    const [colorCanvas, colorContext] = makeCanvas();
    const [maskCanvas, maskContext] = makeCanvas();
    const [tempCanvas, tempContext] = makeCanvas();
    const bwImage = new Image();
    const colorImage = new Image();
    bwImage.src = base.currentSrc || base.src;
    colorImage.src = "/images/rishi-portrait-color.webp";

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    let width = 1;
    let height = 1;
    let brushRadius = 143 * ratio;
    const points: Array<{ x: number; y: number }> = [];
    let previous: { x: number; y: number } | null = null;
    let idle = 999;
    let running = false;
    let showing = false;
    let animationFrame = 0;

    const fitDraw = (target: CanvasRenderingContext2D, image: HTMLImageElement) => {
      target.clearRect(0, 0, width, height);
      if (!image.naturalWidth) return;
      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      target.drawImage(image, (width - drawWidth) / 2, height - drawHeight, drawWidth, drawHeight);
    };

    const hide = () => {
      showing = false;
      base.style.visibility = "";
      context.clearRect(0, 0, width, height);
      maskContext.clearRect(0, 0, width, height);
    };

    const measure = () => {
      const bounds = stage.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width * ratio));
      height = Math.max(1, Math.round(bounds.height * ratio));
      [canvas, bwCanvas, colorCanvas, maskCanvas, tempCanvas].forEach((buffer) => {
        buffer.width = width;
        buffer.height = height;
      });
      brushRadius = 143 * ratio;
      fitDraw(bwContext, bwImage);
      fitDraw(colorContext, colorImage);
      hide();
    };

    bwImage.onload = () => fitDraw(bwContext, bwImage);
    colorImage.onload = () => fitDraw(colorContext, colorImage);

    const stamp = (x: number, y: number) => {
      const gradient = maskContext.createRadialGradient(x, y, 0, x, y, brushRadius);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.55, "rgba(255,255,255,.82)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      maskContext.globalCompositeOperation = "source-over";
      maskContext.fillStyle = gradient;
      maskContext.fillRect(x - brushRadius, y - brushRadius, brushRadius * 2, brushRadius * 2);
    };

    const render = () => {
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, width, height);
      context.drawImage(bwCanvas, 0, 0);
      context.globalCompositeOperation = "destination-out";
      context.drawImage(maskCanvas, 0, 0);
      tempContext.globalCompositeOperation = "source-over";
      tempContext.clearRect(0, 0, width, height);
      tempContext.drawImage(colorCanvas, 0, 0);
      tempContext.globalCompositeOperation = "destination-in";
      tempContext.drawImage(maskCanvas, 0, 0);
      context.globalCompositeOperation = "lighter";
      context.drawImage(tempCanvas, 0, 0);
      context.globalCompositeOperation = "source-over";
    };

    const frame = () => {
      const drawing = points.length > 0;
      if (drawing) idle = 0;
      else idle += 1;
      if (idle >= 120) {
        hide();
        running = false;
        return;
      }

      const fade = drawing ? 0.016 : Math.min(0.016 + idle * 0.004, 0.5);
      maskContext.globalCompositeOperation = "destination-out";
      maskContext.fillStyle = `rgba(0,0,0,${fade})`;
      maskContext.fillRect(0, 0, width, height);
      if (drawing) {
        points.forEach((point) => stamp(point.x, point.y));
        points.length = 0;
      }
      render();
      if (!showing) {
        showing = true;
        base.style.visibility = "hidden";
      }
      animationFrame = requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!colorImage.naturalWidth || !bwImage.naturalWidth) return;
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) * ratio;
      const y = (event.clientY - bounds.top) * ratio;
      if (x < -brushRadius || y < -brushRadius || x > width + brushRadius || y > height + brushRadius) {
        previous = null;
        return;
      }
      if (previous) {
        const dx = x - previous.x;
        const dy = y - previous.y;
        const distance = Math.hypot(dx, dy);
        const step = Math.max(brushRadius * 0.3, 1);
        const count = Math.min(Math.ceil(distance / step), 60);
        for (let index = 1; index <= count; index += 1) {
          points.push({ x: previous.x + (dx * index) / count, y: previous.y + (dy * index) / count });
        }
      } else {
        points.push({ x, y });
      }
      previous = { x, y };
      if (!running) {
        running = true;
        idle = 0;
        animationFrame = requestAnimationFrame(frame);
      }
    };

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrame);
      base.style.visibility = "";
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;
    let live = true;

    const flip = () => {
      if (!live) return;
      if (document.hidden) {
        timer = window.setTimeout(flip, 600);
        return;
      }
      if (reduced) {
        setSkillIndex((index) => (index + 1) % SKILLS.length);
        timer = window.setTimeout(flip, 2400);
        return;
      }
      setIsFlipping(true);
      timer = window.setTimeout(() => {
        setSkillIndex((index) => (index + 1) % SKILLS.length);
        setIsFlipping(false);
        timer = window.setTimeout(flip, 1700);
      }, 1250);
    };

    timer = window.setTimeout(flip, 1300);
    return () => {
      live = false;
      window.clearTimeout(timer);
    };
  }, [isReady]);

  const holes = Array.from({ length: ringCount }, (_, index) => <i key={index} />);
  const activeSkill = SKILLS[skillIndex];
  const nextSkill = SKILLS[(skillIndex + 1) % SKILLS.length];

  return (
    <div className={`site ${isReady ? "is-ready" : ""}`}>
      <IntroLoader onReady={onReady} />
      <Header onMenu={() => setMenuOpen(true)} />
      <PullCord theme={theme} isReady={isReady} onToggle={toggleTheme} />

      <main id="home" className="hero" aria-label="Introduction">
        <div className="hero__vig" aria-hidden="true" />
        <div className="hero__stage">
          <div className="fig" id="fig" ref={figureRef}>
            <img
              id="figBase"
              src="/images/rishi-portrait-bw.webp"
              alt=""
              decoding="async"
              fetchPriority="high"
              aria-hidden="true"
            />
            <canvas id="figCanvas" ref={portraitCanvasRef} aria-hidden="true" />
            <button
              className="fig__card"
              type="button"
              aria-haspopup="dialog"
              aria-label="Open my ability card"
              onClick={() => setCardOpen(true)}
              ref={cardTriggerRef}
            >
              My ability card
            </button>
          </div>
        </div>

        <div className="shell hero__content">
          <div className="hero__left">
            <p className="eyebrow reveal" style={revealDelay("200ms")}>
              Independent Freelancer
            </p>
            <h1 className="h1">
              <span className="sr-only">
                Hi, I'm Rishi. I am a photographer, graphic designer, UI/UX designer and developer.
              </span>
              <span aria-hidden="true">
                <span className="line">
                  <span style={revealDelay("250ms")}>Hi, I'm Rishi.</span>
                </span>
                <span className="line">
                  <span className="soft" style={revealDelay("370ms")}>
                    I am a
                  </span>
                </span>
                <span className="cal-line">
                  <span
                    className="cal reveal"
                    id="cal"
                    ref={calendarRef}
                    style={revealDelay("520ms")}
                  >
                    <span className="cal__body" ref={calendarBodyRef}>
                      <span className="cal__stand" />
                      <span className="cal__stack">
                        <span className="cal__back">
                          <span className="cal__holes">{holes}</span>
                        </span>
                        <span className="cal__page">
                          <span className="cal__holes">{holes}</span>
                          <span className="cal__word">{nextSkill}</span>
                          <span className="cal__no">
                            {String((skillIndex + 1) % SKILLS.length + 1).padStart(2, "0")} / 05
                          </span>
                          <span className="cal__shade" />
                        </span>
                        <span className={`cal__leaf ${isFlipping ? "turning" : ""}`}>
                          <span className="cal__face">
                            <span className="cal__holes">{holes}</span>
                            <span className="cal__word">{activeSkill}</span>
                            <span className="cal__no">
                              {String(skillIndex + 1).padStart(2, "0")} / 05
                            </span>
                            <span className="cal__shade" />
                          </span>
                          <span className="cal__rear">
                            <span className="cal__holes">{holes}</span>
                          </span>
                        </span>
                      </span>
                      <span className="cal__rings">
                        {holes}
                      </span>
                    </span>
                    <span className="cal__measure" ref={calendarMeasureRef} />
                  </span>
                </span>
              </span>
            </h1>
            <div className="ctas reveal" style={revealDelay("750ms")}>
              <a className="pill pill--dark pill--arrow" href="mailto:rishithakor218@gmail.com">
                <span className="pill__in">
                  Hire me
                  <span className="pill__badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </a>
              <a className="pill pill--outline" href="#works">
                <span className="pill__in">See my work</span>
              </a>
            </div>
          </div>
        </div>

        <div className="shell hero__bar reveal">
          <span>Available for work</span>
          <span className="mid">Remote-first, worldwide</span>
          <span className="scroll">
            Scroll to explore <i aria-hidden="true">↓</i>
          </span>
        </div>
      </main>

      {menuOpen && <MenuOverlay onClose={closeMenu} />}
      {cardOpen && <AbilityCardDialog onClose={closeCard} />}
      {showAnalyticsChoice && (
        <aside className="ck" role="region" aria-label="Analytics choice">
          <p>
            May I count your visit with Google Analytics? It sets cookies. <a href="https://therishithakor.com/legal/">Details</a>
          </p>
          <div>
            <button type="button" data-ck="no" onClick={() => saveAnalyticsChoice("no")}>
              No thanks
            </button>
            <button type="button" data-ck="yes" onClick={() => saveAnalyticsChoice("yes")}>
              Allow
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}