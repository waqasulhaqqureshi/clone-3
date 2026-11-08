import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { formatClock, readStored, readTheme, writeStored } from "./utils/site";
import type { Theme } from "./utils/site";

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
  { label: "Photography", href: "#photography" },
  { label: "Story", href: "#story" },
  { label: "Contact", href: "#contact" },
];

const STORY_ITEMS = [
  {
    period: "Oct 2026 — Now",
    role: "Independent freelancer",
    org: "Working for myself, remote-first",
    points: [
      "Websites, iOS apps, interfaces and brand creatives, carried from the first sketch to launch.",
      "Working directly with clients, wherever they are.",
    ],
    /* The odometer's final reading: the year this chapter starts. */
    year: 2026,
  },
  {
    period: "Jul 2026 — Sep 2026",
    role: "Graphic designer",
    org: "Himspring LLC",
    points: [
      "Managed visual content across social media handles for real estate, luxury water bottle and clothing brands.",
      "Designed social media creatives, stories and carousels in Adobe Illustrator, keeping every brand consistent across platforms.",
    ],
    year: 2026,
  },
  {
    period: "Jan 2026 — Jun 2026",
    role: "UI/UX designer",
    org: "Quicko Pvt Ltd, Ahmedabad",
    points: [
      "Designed website interfaces and user experiences in Figma, focused on usability, visual clarity and function.",
      "Built no-code web pages and interactive financial tools in Framer, turning designs into working products.",
    ],
    year: 2026,
  },
  {
    period: "Jan 2025 — May 2025",
    role: "Graphic designer intern",
    org: "WBT, Delhi · Remote",
    points: [
      "Designed pitch decks and presentations that communicate ideas and business concepts clearly.",
      "Created social media creatives and visual assets for branding, marketing and digital communication.",
    ],
    year: 2025,
  },
  {
    period: "Jul 2022 — May 2026",
    role: "B.Tech, Computer Science",
    org: "Pandit Deendayal Energy University (PDEU)",
    points: [
      "Four years of computer science: where it all started, with code in the classroom and design on the side.",
      "Graduated in May 2026, with internships and real projects already under way.",
    ],
    year: 2022,
  },
];

const DOOR_ITEMS = [
  {
    id: "web-development",
    label: "Web Developer",
    title: "Web Development",
    summary: "End to end, from sketch to live site",
    services: ["Discovery & planning", "UX & visual design", "Front-end & back-end development", "Technical SEO & performance", "Analytics, launch & ongoing support"],
    color: "#22304a",
    darkColor: "#1c2840",
  },
  {
    id: "app-development",
    label: "App Developer",
    title: "App Development",
    summary: "From the first idea to the app store",
    services: ["Product scoping & user flows", "Interface design", "Cross-platform development", "Device testing & store launch", "Analytics, monitoring & updates"],
    color: "#4a3540",
    darkColor: "#3f2d37",
  },
  {
    id: "ui-ux-design",
    label: "UI/UX Designer",
    title: "UI/UX Design",
    summary: "Research first, pixels second",
    services: ["Brand & business needs analysis", "User & competitor research", "Information architecture & flows", "Wireframes & high-fidelity UI", "Interactive prototypes & testing"],
    color: "#7a8670",
    darkColor: "#66705d",
  },
  {
    id: "graphic-design",
    label: "Graphic Designer",
    title: "Graphic Design",
    summary: "Visual content true to the brand",
    services: ["Brand, audience & tone analysis", "Built around brand guidelines", "Posters & social media creatives", "Strong type & clear hierarchy", "Every format each platform needs"],
    color: "#a4552c",
    darkColor: "#8c4826",
  },
  {
    id: "photography",
    label: "Photographer",
    title: "Photography",
    summary: "The eye behind every layout",
    services: ["Architecture, concerts & sport", "Nature & product", "Light & composition first"],
    color: "#262523",
    darkColor: "#201f1d",
  },
];

type StyleWithVars = CSSProperties & Record<`--${string}`, string | number>;

function revealDelay(delay: string): StyleWithVars {
  return { "--d": delay };
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
    let cancelled = false;
    const started = performance.now() + 90;
    const duration = 1120;

    // Hold the curtain until the Onest subsets and the hero portrait are
    // really decoded; otherwise the headline reflows the moment it appears.
    const assetsReady = Promise.race([
      Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise<void>((resolve) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () => resolve();
          image.src = "/assets/rishi-portrait.webp";
          if (image.complete) resolve();
        }),
      ]),
      new Promise<void>((resolve) => window.setTimeout(resolve, 2600)),
    ]);

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

      void assetsReady.then(() => {
        if (cancelled) return;
        outTimer = window.setTimeout(() => {
          if (cancelled) return;
          onReady();
          loaderRef.current?.classList.add("out");
          removeTimer = window.setTimeout(() => setVisible(false), 980);
        }, 140);
      });
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
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
  const [activeSection, setActiveSection] = useState("#home");
  const clock = formatClock(now);

  useEffect(() => {
    const ids = NAV_ITEMS.filter((item) => item.href.startsWith("#")).map((item) => item.href);
    const sections = ids
      .map((id) => document.querySelector(id))
      .filter((node): node is Element => Boolean(node));
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const seen = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => seen.set(entry.target, entry.intersectionRatio));
        let best = "#home";
        let bestRatio = 0;
        seen.forEach((ratio, node) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = `#${node.id}`;
          }
        });
        if (bestRatio > 0) setActiveSection(best);
      },
      { threshold: [0.15, 0.35, 0.6], rootMargin: "-20% 0px -35% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 10_000);
    let frame = 0;
    const update = () => {
      frame = 0;
      setStuck(window.scrollY > 24);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={`hdr reveal ${stuck ? "stuck" : ""}`} style={revealDelay("150ms")}>
      <div className="shell hdr__in">
        <nav aria-label="Primary navigation">
          <ul className="nav">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-current={item.href === activeSection ? "true" : undefined}
                  onClick={
                    item.href === "#home"
                      ? (event) => {
                          event.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      : undefined
                  }
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
      // Keep the cord inside its own viewBox, otherwise the knob (and its hit
      // target) is clipped on narrow screens and dark mode becomes unreachable.
      const anchor = width - (viewportWidth >= 1200 ? 58 : Math.min(34, width * 0.12));
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
    // On touch the hit area used to eat the vertical swipe, which made the
    // top-right corner of the page feel dead. Let the page scroll instead.
    if (event.pointerType === "touch") return;
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
        onClick={(event) => {
          // Keyboard and touch activation. Mouse users get the drag release.
          if (event.detail === 0 || active.current === false) onToggle();
        }}
      />
    </div>
  );
}

function WorkDoors() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const activeDoor = DOOR_ITEMS[activeIndex];

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    let revealObserver: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver((entries, observer) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setIsVisible(true);
            observer.disconnect();
          }
        }, { threshold: 0.18 });
      revealObserver.observe(section);
    } else {
      setIsVisible(true);
    }

    let frame = 0;
    const syncWall = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (window.matchMedia("(min-width: 1024px)").matches) {
          const travel = Math.max(1, section.offsetHeight - window.innerHeight);
          const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / travel));
          const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
          const nextIndex = Math.round(progress * (DOOR_ITEMS.length - 1));
          track.style.transform = `translate3d(${-distance * progress}px, 0, 0)`;
          setActiveIndex((current) => current === nextIndex ? current : nextIndex);
          return;
        }

        track.style.transform = "";
        const center = viewport.getBoundingClientRect().left + viewport.clientWidth / 2;
        const doors = Array.from(track.children) as HTMLElement[];
        let nearest = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;
        doors.forEach((door, index) => {
          const bounds = door.getBoundingClientRect();
          const distance = Math.abs(bounds.left + bounds.width / 2 - center);
          if (distance < nearestDistance) {
            nearest = index;
            nearestDistance = distance;
          }
        });
        setActiveIndex((current) => current === nearest ? current : nearest);
      });
    };

    window.addEventListener("scroll", syncWall, { passive: true });
    window.addEventListener("resize", syncWall, { passive: true });
    viewport.addEventListener("scroll", syncWall, { passive: true });
    const resizeObserver = new ResizeObserver(syncWall);
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);
    syncWall();

    return () => {
      revealObserver?.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", syncWall);
      window.removeEventListener("resize", syncWall);
      viewport.removeEventListener("scroll", syncWall);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const selectDoor = (index: number) => {
    setActiveIndex(index);
    setOpenIndex((current) => current === index ? null : index);
  };

  return (
    <section ref={sectionRef} className={`doors ${isVisible ? "is-visible" : ""}`} id="works" aria-labelledby="doorsTitle">
      <div className="doors__tex" aria-hidden="true" />
      <div className="doors__pin">
        <div className="shell doors__wall">
          <div className="doors__heading">
            <h2 className="paint" id="doorsTitle">Magic happens <br className="mbr" />behind the doors</h2>
            <p className="doors__hint">Swipe along the wall</p>
          </div>

          <div className="doors__viewport" ref={viewportRef} role="region" aria-label="Explore Rishi's services">
            <ul className="doors__row" ref={trackRef}>
              {DOOR_ITEMS.map((door, index) => (
                <li
                  className={`unit${activeIndex === index ? " is-active" : ""}${openIndex === index ? " is-open" : ""}`}
                  id={door.id}
                  key={door.id}
                  style={{ "--i": index, "--door": door.color, "--door-dk": door.darkColor } as StyleWithVars}
                >
                  <button
                    className="doorway"
                    type="button"
                    aria-label={`${openIndex === index ? "Close" : "Open"} the ${door.label} door`}
                    aria-controls="door-information"
                    aria-expanded={openIndex === index}
                    onPointerEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => selectDoor(index)}
                  >
                    <span className="casing" />
                    <span className="opening">
                      <span className="room"><span className="room__light" /></span>
                      <span className="spill" />
                      <span className="door">
                        <span className="door__flute" />
                        <span className="plate">{door.label}</span>
                        <span className="handle"><span className="handle__lever" /><span className="handle__lock" /></span>
                        <span className="door__shade" />
                        <span className="leak" />
                      </span>
                      <span className="sill" />
                    </span>
                    <span className="pool" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="doors__footer" id="door-information" aria-live="polite">
            <div className="doors__counter" aria-hidden="true">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <i><b style={{ transform: `scaleX(${(activeIndex + 1) / DOOR_ITEMS.length})` }} /></i>
              <span>05</span>
            </div>
            <div className="dinfo" key={activeDoor.id}>
              <h3 className="dinfo__h">{activeDoor.title}</h3>
              <p className="dinfo__t">{activeDoor.summary}</p>
            </div>
            <ul className="dinfo__p" key={`${activeDoor.id}-list`}>
              {activeDoor.services.map((service, index) => (
                <li key={service} style={{ "--i": index } as StyleWithVars}>{service}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="doors__floor" aria-hidden="true" />
      </div>
    </section>
  );
}

/* "My story" — a sticky heading over a scroll-driven odometer, then the
   timeline. The digits scrub as the section travels, exactly like the
   reference: each wheel is a 0-9 ladder translated by its own digit. */
function StoryOdometer({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(STORY_ITEMS[0].year);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(1, bounds.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      /* 2021 is where the ladder starts: the earliest year in the story,
         minus one so every wheel has to travel on the way in. */
      const target = Math.round(STORY_ITEMS[STORY_ITEMS.length - 1].year - 1 + progress * 5);
      setShown((current) => (current === target ? current : target));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [sectionRef]);

  const digits = String(Math.max(2021, Math.min(2029, shown))).padStart(4, "0").split("");

  return (
    <div className="odo" aria-hidden="true">
      {digits.map((digit, digitIndex) => (
        <span className="odo__wheel" key={digitIndex} style={{ "--d": `${digitIndex * 70}ms` } as StyleWithVars}>
          {/* A 0-9 ladder; each wheel slides to the digit the scroll position asks for. */}
          <span className="odo__roll" style={{ transform: `translate3d(0, ${-Number(digit) * 10}%, 0)` }}>
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </div>
  );
}

function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    revealObserver.observe(section);

    const entries = Array.from(section.querySelectorAll<HTMLElement>(".entry"));
    const entryObserver = new IntersectionObserver(
      (records) => {
        records.forEach((record) => {
          if (!record.isIntersecting) return;
          const index = entries.indexOf(record.target as HTMLElement);
          if (index >= 0) setActive(index);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    entries.forEach((entry) => entryObserver.observe(entry));

    return () => {
      revealObserver.disconnect();
      entryObserver.disconnect();
    };
  }, []);

  const jumpTo = (index: number) => {
    const entry = sectionRef.current?.querySelectorAll<HTMLElement>(".entry")[index];
    entry?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      ref={sectionRef}
      className={`story${visible ? " is-visible" : ""}`}
      id="story"
      aria-labelledby="storyTitle"
    >
      <div className="shell story__head">
        <p className="story__eyebrow">
          <span aria-hidden="true">◆</span> My story
        </p>
        <div className="story__titleRow">
          <h2 className="story__title" id="storyTitle">
            Let&rsquo;s go back in time.
          </h2>
          <StoryOdometer sectionRef={sectionRef} />
        </div>
      </div>

      <div className="shell story__body">
        <div className="story__rail" aria-hidden="true">
          <span className="story__railTrack">
            <span
              className="story__railFill"
              style={{ transform: `scaleY(${(active + 1) / STORY_ITEMS.length})` }}
            />
          </span>
          <span className="story__railNo">
            {String(active + 1).padStart(2, "0")}
            <i>/ {String(STORY_ITEMS.length).padStart(2, "0")}</i>
          </span>
        </div>

        <ol className="story__list">
          {STORY_ITEMS.map((item, index) => (
            <li
              className={`entry${active === index ? " is-active" : ""}`}
              key={item.period}
              style={{ "--i": index } as StyleWithVars}
            >
              <button
                className="entry__no"
                type="button"
                onClick={() => jumpTo(index)}
                aria-label={`Jump to ${item.period}: ${item.role}`}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
              <div className="entry__main">
                <p className="entry__period">{item.period}</p>
                <h3 className="entry__role">{item.role}</h3>
                <p className="entry__org">{item.org}</p>
                <ul className="entry__points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function SiteFooter() {
  const clock = useLocalClock();

  return (
    <footer className="foot" id="contact" aria-labelledby="footTitle">
      <div className="shell">
        <div className="foot__top">
          <button
            className="foot__back"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="foot__backArrow" aria-hidden="true">↑</span>
            Back to top
          </button>
          <a className="foot__enter" href="mailto:rishithakor218@gmail.com">
            Click to enter
            <span className="foot__enterBadge" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </a>
        </div>

        <div className="foot__mark">
          <h2 className="foot__word" id="footTitle">
            Rishi<span className="foot__dot">.</span>
          </h2>
          <p className="foot__tag">Web · App · UI/UX · Graphic design · Photography</p>
        </div>

        <div className="foot__bot">
          <span className="foot__local">
            Local time — <b>{clock}</b>
          </span>
          <span className="foot__meta">Independent freelancer · Remote-first, worldwide</span>
          <a className="foot__hire" href="mailto:rishithakor218@gmail.com">
            Hire me <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

/* Tiny clock hook, shared by the footer and the consent bar. */
function useLocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(timer);
  }, []);
  return formatClock(now).time;
}

function ConsentBar() {
  const [state, setState] = useState<"open" | "allowed" | "denied" | "closed">(() => {
    const stored = readStored("rishi-consent");
    if (stored === "allowed") return "allowed";
    if (stored === "denied") return "denied";
    return "open";
  });
  const [mounted, setMounted] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    if (state !== "open") return;
    const timer = window.setTimeout(() => setMounted(true), 2400);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state === "allowed" || state === "denied") return null;

  const decide = (answer: "allowed" | "denied") => {
    writeStored("rishi-consent", answer);
    setState(answer);
  };

  return (
    <div className={`consent${mounted ? " in" : ""}`} role="region" aria-label="Analytics consent">
      <div className="consent__copy">
        <p>
          May I count your visit with Google Analytics? It sets cookies.{" "}
          <button type="button" className="consent__details" onClick={() => setDetails((open) => !open)} aria-expanded={details}>
            Details
          </button>
        </p>
        {details && (
          <p className="consent__more">
            It records the pages you open, roughly where in the world you are and what device you
            use. Nothing is sold or shared, and choosing “No thanks” keeps the whole site working.
          </p>
        )}
      </div>
      <div className="consent__actions">
        <button type="button" onClick={() => decide("denied")}>
          No thanks
        </button>
        <button type="button" className="consent__yes" onClick={() => decide("allowed")}>
          Allow
        </button>
      </div>
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

  const [portraitFailed, setPortraitFailed] = useState(false);

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
    if (!finePointer) {
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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const points: Array<{ x: number; y: number }> = [];
    let width = 1;
    let height = 1;
    let brushRadius = 143 * ratio;
    let previous: { x: number; y: number } | null = null;
    let idleFrames = 0;
    let running = false;
    let animationFrame = 0;
    let introTimer = 0;
    let destroyed = false;

    const STARTS = [
      { x: 0.5, y: 0.3 },
      { x: 0.45, y: 0.36 },
      { x: 0.55, y: 0.24 },
    ];

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

    const start = () => {
      if (destroyed || !colorImage.naturalWidth || !width) return;
      if (!running) {
        running = true;
        idleFrames = 0;
        animationFrame = requestAnimationFrame(frame);
      }
    };

    /* The reference reveals the colour portrait with a brush that sweeps on by
       itself once, then hands the brush to the cursor. Nothing used to paint on
       first load, so the figure stayed flat grey until the visitor moved. */
    const intro = () => {
      if (destroyed) return;
      if (reducedMotion) {
        points.push({ x: width / 2, y: height * 0.42 });
        start();
        return;
      }
      let step = 0;
      const total = 26;
      const tick = () => {
        if (destroyed) return;
        const progress = step / total;
        STARTS.forEach((origin, index) => {
          const angle = progress * Math.PI * 1.7 + index * 2.1;
          const spread = brushRadius * (0.5 + progress * 1.9);
          points.push({
            x: width * origin.x + Math.cos(angle) * spread,
            y: height * origin.y + Math.sin(angle) * spread * 1.15,
          });
        });
        start();
        step += 1;
        if (step <= total) introTimer = window.setTimeout(tick, 34);
      };
      introTimer = window.setTimeout(tick, 260);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect();
      const relativeX = (event.clientX - window.innerWidth / 2) / Math.max(window.innerWidth / 2, 1);
      const relativeY = (event.clientY - window.innerHeight / 2) / Math.max(window.innerHeight / 2, 1);
      stage.style.setProperty("--portrait-x", `${(-relativeX * 7).toFixed(2)}px`);
      stage.style.setProperty("--portrait-y", `${(-relativeY * 5).toFixed(2)}px`);
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
      start();
    };

    const onLeave = () => {
      previous = null;
    };

    colorImage.onload = () => {
      resize();
      intro();
    };
    const observer = new ResizeObserver(() => {
      resize();
      // A resize wipes the mask; re-seed the colour so the figure never
      // flickers back to flat grey on rotate.
      if (colorImage.naturalWidth) intro();
    });
    observer.observe(stage);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    resize();
    colorImage.src = "/assets/rishi-portrait-color.webp";

    return () => {
      destroyed = true;
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.clearTimeout(introTimer);
      cancelAnimationFrame(animationFrame);
      stage.style.removeProperty("--portrait-x");
      stage.style.removeProperty("--portrait-y");
    };
  }, []);

  const flipTimer = useRef(0);

  useEffect(() => {
    if (!isReady || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let live = true;

    const flip = () => {
      if (!live) return;
      if (document.hidden) {
        flipTimer.current = window.setTimeout(flip, 600);
        return;
      }
      setIsFlipping(true);
      flipTimer.current = window.setTimeout(() => {
        if (!live) return;
        setSkillIndex((index) => (index + 1) % SKILLS.length);
        setIsFlipping(false);
        flipTimer.current = window.setTimeout(flip, 1900);
      }, 1250);
    };

    flipTimer.current = window.setTimeout(flip, 1500);
    return () => {
      live = false;
      window.clearTimeout(flipTimer.current);
    };
  }, [isReady]);

  // Tab-away pauses the role cycle instead of burning frames in the background.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) window.clearTimeout(flipTimer.current);
      else if (isReady) {
        window.clearTimeout(flipTimer.current);
        flipTimer.current = window.setTimeout(() => {
          setIsFlipping(true);
          window.setTimeout(() => {
            setSkillIndex((index) => (index + 1) % SKILLS.length);
            setIsFlipping(false);
          }, 1250);
        }, 600);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
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
          <div className="fig" id="fig" ref={figureRef} data-failed={portraitFailed ? "" : undefined}>
            {portraitFailed ? (
              <span className="fig__fallback" aria-hidden="true">
                R
              </span>
            ) : (
              <img
                id="figBase"
                src="/assets/rishi-portrait.webp"
                alt=""
                decoding="async"
                fetchPriority="high"
                width={662}
                height={1600}
                onError={() => setPortraitFailed(true)}
                aria-hidden="true"
              />
            )}
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

      <WorkDoors />

      <Story />

      <SiteFooter />

      <ConsentBar />

      {menuOpen && <MenuOverlay onClose={closeMenu} />}
    </div>
  );
}