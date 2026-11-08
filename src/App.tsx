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
    let removeTimer = 0;
    const started = performance.now() + 90;
    const duration = 1120;

    const tick = (now: number) => {
      const progress = Math.max(0, Math.min(1, (now - started) / duration));
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
        onReady();
        loaderRef.current?.classList.add("out");
        removeTimer = window.setTimeout(() => setVisible(false), 980);
      }, 140);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(outTimer);
      window.clearTimeout(removeTimer);
    };
  }, [onReady]);

  if (!visible) return null;

  return (
    <div className="loader" aria-hidden="true" ref={loaderRef}>
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

function Header({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const [now, setNow] = useState(() => new Date());
  const [stuck, setStuck] = useState(false);
  const clock = formatClock(now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 10_000);
    const update = () => setStuck(window.scrollY > 24);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <header className={`hdr reveal ${stuck ? "stuck" : ""}`} style={revealDelay("150ms")}>
      <div className="shell hdr__in">
        <nav aria-label="Primary navigation">
          <ul className="nav">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-current={index === 0 ? "page" : undefined}
                  onClick={item.href === "#home" ? () => window.scrollTo({ top: 0, behavior: "smooth" }) : undefined}
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
            aria-controls="navm"
            aria-expanded={menuOpen}
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

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="navm open"
      id="navm"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="shell navm__in">
        <div className="navm__top">
          <a className="navm__brand" href="#home" onClick={onClose}>
            Rishi Thakor
          </a>
          <button className="navm__close" type="button" onClick={onClose} ref={closeRef}>
            Close
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" />
            </svg>
          </button>
        </div>
        <nav className="navm__nav" aria-label="Menu">
          <ol className="navm__list">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.label}>
                <a className="navm__item" href={item.href} onClick={onClose} style={revealDelay(`${index * 45}ms`)}>
                  <small>0{index + 1}</small>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="navm__bot">
          <span>Independent freelancer</span>
          <a href="mailto:rishithakor218@gmail.com">rishithakor218@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

function PullCord({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const [layout, setLayout] = useState({ width: 340, anchor: 282, length: 230 });
  const [pull, setPull] = useState(0);
  const pullRef = useRef(0);
  const startY = useRef(0);
  const startedAt = useRef(0);
  const active = useRef(false);
  const toggled = useRef(false);
  const springFrame = useRef(0);

  useEffect(() => {
    const measure = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const width = Math.min(viewportWidth, 340);
      const anchor = width - (viewportWidth >= 1200 ? 58 : 34);
      const length =
        viewportWidth >= 1024
          ? Math.min(270, Math.max(190, viewportHeight * 0.3))
          : viewportWidth >= 640
            ? Math.min(210, Math.max(150, viewportHeight * 0.22))
            : 82;

      setLayout({ width, anchor, length });
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => () => cancelAnimationFrame(springFrame.current), []);

  const endY = layout.length + pull;
  const endX = layout.anchor - 4;
  const path = `M ${layout.anchor} -88 C ${layout.anchor - 12} 30 ${layout.anchor + 14} ${endY * 0.62} ${endX} ${endY}`;

  const settle = () => {
    cancelAnimationFrame(springFrame.current);
    let position = pullRef.current;
    let velocity = 0;
    let previousTime = 0;

    const step = (time: number) => {
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.032) : 0.016;
      previousTime = time;
      velocity += (-105 * position - 16 * velocity) * delta;
      position += velocity * delta;

      if (Math.abs(position) < 0.45 && Math.abs(velocity) < 0.45) {
        pullRef.current = 0;
        setPull(0);
        springFrame.current = 0;
        return;
      }

      pullRef.current = position;
      setPull(position);
      springFrame.current = requestAnimationFrame(step);
    };

    springFrame.current = requestAnimationFrame(step);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    cancelAnimationFrame(springFrame.current);
    event.currentTarget.setPointerCapture(event.pointerId);
    active.current = true;
    toggled.current = false;
    startY.current = event.clientY;
    startedAt.current = performance.now();
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!active.current) return;
    const nextPull = Math.max(0, Math.min(74, event.clientY - startY.current));
    pullRef.current = nextPull;
    setPull(nextPull);
    if (nextPull > 40 && !toggled.current) {
      toggled.current = true;
      onToggle();
    }
  };

  const onPointerUp = () => {
    if (!active.current) return;
    active.current = false;
    if (!toggled.current && performance.now() - startedAt.current < 300) onToggle();
    settle();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div className="cord">
      <svg className="cord__cv" viewBox={`0 0 ${layout.width} 520`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="cord-metal" x1="-4" x2="4" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#5b4a2c" />
            <stop offset="0.3" stopColor="#e8d59e" />
            <stop offset="0.55" stopColor="#b0924f" />
            <stop offset="1" stopColor="#4a3a1f" />
          </linearGradient>
          <linearGradient id="cord-wood" x1="-10" x2="10" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#24150c" />
            <stop offset="0.22" stopColor="#6b3f22" />
            <stop offset="0.4" stopColor="#a8693d" />
            <stop offset="0.58" stopColor="#7c4828" />
            <stop offset="0.85" stopColor="#3b2213" />
            <stop offset="1" stopColor="#1d110a" />
          </linearGradient>
          <radialGradient id="cord-key" cx="-4" cy="17" r="9" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(255,226,190,.42)" />
            <stop offset="1" stopColor="rgba(255,226,190,0)" />
          </radialGradient>
        </defs>
        <g className="cord__art">
          <path d={path} transform="translate(7 11)" className="cord__shadow" />
          <path d={path} className="cord__rope" />
          <path d={path} transform="translate(-0.7 -0.3)" className="cord__shine" />
          <g transform={`translate(${endX + 7} ${endY + 10}) rotate(-5)`}>
            <path d="M-3 6 C-4 11 -9 13 -9 22 C-9 30 -5 35 0 35 C5 35 9 30 9 22 C9 13 4 11 3 6Z" className="cord__knob-shadow" />
          </g>
          <g transform={`translate(${endX} ${endY}) rotate(-5)`}>
            <rect x="-3.5" y="-1" width="7" height="7.5" rx="1.2" fill="url(#cord-metal)" />
            <path d="M-3.5 2.4h7M-3.5 4.3h7" className="cord__groove" />
            <path d="M-3 6 C-4 11 -9 13 -9 22 C-9 30 -5 35 0 35 C5 35 9 30 9 22 C9 13 4 11 3 6Z" fill="url(#cord-wood)" />
            <path d="M-7 9C-4 17-7 26-5 34M-2 8C0 16-2 27 0 35M3 8C5 16 4 27 6 34" className="cord__grain" />
            <path d="M-3 6 C-4 11 -9 13 -9 22 C-9 30 -5 35 0 35 C5 35 9 30 9 22 C9 13 4 11 3 6Z" fill="url(#cord-key)" />
          </g>
        </g>
      </svg>
      <button
        className="cord__hit"
        type="button"
        role="switch"
        aria-label="Dark mode (pull the cord)"
        aria-checked={theme === "dark"}
        style={{ left: `${endX}px`, top: `${endY + 20}px` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [isReady, setIsReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [skillIndex, setSkillIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [ringCount, setRingCount] = useState(8);
  const figureRef = useRef<HTMLDivElement>(null);
  const portraitCanvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const calendarRef = useRef<HTMLSpanElement>(null);
  const calendarBodyRef = useRef<HTMLSpanElement>(null);
  const calendarMeasureRef = useRef<HTMLSpanElement>(null);

  const onReady = useCallback(() => setIsReady(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.dataset.mode = "dark";
    else delete root.dataset.mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#1A1818" : "#EEEAE6");
    try {
      localStorage.setItem("rishi-mode", theme);
    } catch {
      // The current theme remains usable when browser storage is disabled.
    }
  }, [theme]);

  useLayoutEffect(() => {
    const calendar = calendarRef.current;
    const body = calendarBodyRef.current;
    const measure = calendarMeasureRef.current;
    const heading = headingRef.current;
    if (!calendar || !body || !measure || !heading) return;

    const fitCalendar = () => {
      calendar.style.fontSize = "";
      const fontSize = parseFloat(getComputedStyle(calendar).fontSize) || 1;
      let maxWidth = 0;
      SKILLS.forEach((skill) => {
        measure.textContent = skill;
        maxWidth = Math.max(maxWidth, measure.getBoundingClientRect().width);
      });

      const widthInEm = maxWidth / fontSize + 0.86;
      const width = widthInEm * fontSize;
      body.style.setProperty("--cal-w", `${widthInEm.toFixed(3)}em`);
      const available = Math.max(1, heading.getBoundingClientRect().width - fontSize * 0.25);
      if (width > available) calendar.style.fontSize = `${(fontSize * available) / width}px`;
      setRingCount(Math.max(5, Math.round((widthInEm - 0.64) / 0.7) + 1));
    };

    fitCalendar();
    const observer = new ResizeObserver(fitCalendar);
    observer.observe(heading);
    window.addEventListener("resize", fitCalendar);
    document.fonts?.ready.then(fitCalendar);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fitCalendar);
    };
  }, []);

  useEffect(() => {
    const stage = figureRef.current;
    const canvas = portraitCanvasRef.current;
    if (!stage || !canvas) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) {
      canvas.style.display = "none";
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) return;
    const maskCanvas = document.createElement("canvas");
    const maskContext = maskCanvas.getContext("2d");
    if (!maskContext) return;

    const colorImage = new Image();
    colorImage.decoding = "async";
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const points: Array<{ x: number; y: number }> = [];
    let width = 1;
    let height = 1;
    let brushRadius = 143 * ratio;
    let previous: { x: number; y: number } | null = null;
    let idleFrames = 0;
    let running = false;
    let animationFrame = 0;

    const drawPortrait = (target: CanvasRenderingContext2D) => {
      target.clearRect(0, 0, width, height);
      if (!colorImage.naturalWidth) return;
      const scale = Math.min(width / colorImage.naturalWidth, height / colorImage.naturalHeight);
      const drawWidth = colorImage.naturalWidth * scale;
      const drawHeight = colorImage.naturalHeight * scale;
      target.drawImage(colorImage, (width - drawWidth) / 2, height - drawHeight, drawWidth, drawHeight);
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width * ratio));
      height = Math.max(1, Math.round(bounds.height * ratio));
      canvas.width = width;
      canvas.height = height;
      maskCanvas.width = width;
      maskCanvas.height = height;
      brushRadius = Math.min(143, Math.max(88, bounds.width * 0.25)) * ratio;
      points.length = 0;
      previous = null;
      idleFrames = 0;
      context.clearRect(0, 0, width, height);
      maskContext.clearRect(0, 0, width, height);
    };

    const stamp = (x: number, y: number) => {
      const gradient = maskContext.createRadialGradient(x, y, 0, x, y, brushRadius);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.55, "rgba(255,255,255,.82)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      maskContext.globalCompositeOperation = "source-over";
      maskContext.fillStyle = gradient;
      maskContext.fillRect(x - brushRadius, y - brushRadius, brushRadius * 2, brushRadius * 2);
    };

    const frame = () => {
      const drawing = points.length > 0;
      idleFrames = drawing ? 0 : idleFrames + 1;
      if (idleFrames >= 90) {
        maskContext.clearRect(0, 0, width, height);
        context.clearRect(0, 0, width, height);
        running = false;
        return;
      }

      const fade = drawing ? 0.012 : idleFrames < 15 ? 0.02 : Math.min(0.02 + (idleFrames - 15) * 0.012, 0.3);
      maskContext.globalCompositeOperation = "destination-out";
      maskContext.fillStyle = `rgba(0,0,0,${fade})`;
      maskContext.fillRect(0, 0, width, height);
      points.forEach((point) => stamp(point.x, point.y));
      points.length = 0;

      context.globalCompositeOperation = "source-over";
      drawPortrait(context);
      context.globalCompositeOperation = "destination-in";
      context.drawImage(maskCanvas, 0, 0);
      context.globalCompositeOperation = "source-over";
      animationFrame = requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      const relativeX = (event.clientX - window.innerWidth / 2) / Math.max(window.innerWidth / 2, 1);
      const relativeY = (event.clientY - window.innerHeight / 2) / Math.max(window.innerHeight / 2, 1);
      stage.style.setProperty("--portrait-x", `${(-relativeX * 5).toFixed(2)}px`);
      stage.style.setProperty("--portrait-y", `${(-relativeY * 4).toFixed(2)}px`);
      if (!colorImage.naturalWidth) return;

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
        idleFrames = 0;
        animationFrame = requestAnimationFrame(frame);
      }
    };

    colorImage.onload = resize;
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();
    colorImage.src = "/assets/rishi-portrait-color.webp";

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrame);
      stage.style.removeProperty("--portrait-x");
      stage.style.removeProperty("--portrait-y");
    };
  }, []);

  useEffect(() => {
    if (!isReady || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let live = true;

    const flip = () => {
      if (!live) return;
      if (document.hidden) {
        timer = window.setTimeout(flip, 600);
        return;
      }
      setIsFlipping(true);
      timer = window.setTimeout(() => {
        if (!live) return;
        setSkillIndex((index) => (index + 1) % SKILLS.length);
        setIsFlipping(false);
        timer = window.setTimeout(flip, 1700);
      }, 1250);
    };

    timer = window.setTimeout(flip, 1350);
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
      <a className="skip" href="#home">Skip to content</a>
      <IntroLoader onReady={onReady} />
      <Header menuOpen={menuOpen} onMenu={() => setMenuOpen(true)} />
      <PullCord theme={theme} onToggle={toggleTheme} />

      <main id="home" className="hero" aria-label="Introduction">
        <div className="hero__vig" aria-hidden="true" />
        <div className="hero__stage">
          <div className="fig" id="fig" ref={figureRef}>
            <img
              id="figBase"
              src="/assets/rishi-portrait.webp"
              alt=""
              decoding="async"
              fetchPriority="high"
              aria-hidden="true"
            />
            <canvas id="figCanvas" ref={portraitCanvasRef} aria-hidden="true" />
          </div>
        </div>

        <div className="shell hero__content">
          <div className="hero__left">
            <p className="eyebrow reveal" style={revealDelay("200ms")}>
              Independent Freelancer
            </p>
            <h1 className="h1" ref={headingRef}>
              <span className="sr-only">Hi, I'm Rishi. I am a photographer, graphic designer, UI/UX designer and developer.</span>
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
                  <span className="cal reveal" id="cal" ref={calendarRef} style={revealDelay("520ms")}>
                    <span className="cal__body" ref={calendarBodyRef}>
                      <span className="cal__stand" />
                      <span className="cal__stack">
                        <span className="cal__back">
                          <span className="cal__holes">{holes}</span>
                        </span>
                        <span className="cal__page">
                          <span className="cal__holes">{holes}</span>
                          <span className="cal__word">{nextSkill}</span>
                          <span className="cal__no">{String(((skillIndex + 1) % SKILLS.length) + 1).padStart(2, "0")} / 05</span>
                          <span className="cal__shade" />
                        </span>
                        <span className={`cal__leaf ${isFlipping ? "turning" : ""}`}>
                          <span className="cal__face">
                            <span className="cal__holes">{holes}</span>
                            <span className="cal__word">{activeSkill}</span>
                            <span className="cal__no">{String(skillIndex + 1).padStart(2, "0")} / 05</span>
                            <span className="cal__shade" />
                          </span>
                          <span className="cal__rear">
                            <span className="cal__holes">{holes}</span>
                          </span>
                        </span>
                      </span>
                      <span className="cal__rings">{holes}</span>
                    </span>
                    <span className="cal__measure" ref={calendarMeasureRef} aria-hidden="true" />
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

        <div className="shell hero__bar reveal" style={revealDelay("900ms")}>
          <span>Available for work</span>
          <span className="mid">Remote-first, worldwide</span>
          <span className="scroll">
            Scroll to explore <i aria-hidden="true">↓</i>
          </span>
        </div>
      </main>

      {menuOpen && <MenuOverlay onClose={closeMenu} />}
    </div>
  );
}