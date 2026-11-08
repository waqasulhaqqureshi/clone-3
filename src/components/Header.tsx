import { useEffect, useRef, useState } from "react";
import { formatClock } from "../utils/site";

type Props = {
  active: string;
  dark: boolean;
  onNavigate: (path: string) => void;
  onToggleDark: () => void;
};

const ITEMS = [
  { label: "Home", path: "/home" },
  { label: "Web Development", path: "/web-developer" },
  { label: "App Development", path: "/app-developer" },
  { label: "UI/UX Design", path: "/ui-ux-designer" },
  { label: "Graphic Design", path: "/graphic-designer" },
  { label: "My story", path: "/my-story" },
  { label: "Contact", path: "/contact" },
];

export default function Header({ active, dark, onNavigate, onToggleDark }: Props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);

  const clock = formatClock(now);

  return (
    <>
      <header className="header">
        <nav className="header__nav" aria-label="Primary">
          {ITEMS.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="header__link"
              aria-current={active === item.path ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.path);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="clockpill">
          <span>Local time</span>
          <b>{clock.time}</b>
          <span className="dot">·</span>
          <b className="clockpill__date">{clock.date}</b>
        </div>
      </header>

      <PullCord dark={dark} onToggle={onToggleDark} />
    </>
  );
}

/**
 * The brass cord that hangs from the top-right of every page. Drag it down (or
 * click the knob) and the lights go out: it is the site's dark-mode switch.
 */
function PullCord({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [pull, setPull] = useState(0);
  const start = useRef<{ y: number; base: number } | null>(null);
  const base = dark ? 26 : 0;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!start.current) return;
      const delta = Math.max(0, Math.min(120, e.clientY - start.current.y));
      setPull(delta);
    };
    const onUp = () => {
      if (!start.current) return;
      start.current = null;
      setPull((p) => {
        if (p > 46) onToggle();
        return 0;
      });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [onToggle]);

  return (
    <div className="cord">
      <div
        className="cord__line"
        style={{ height: `calc(var(--cord-len) + ${base + pull}px)`, transition: pull ? "none" : undefined }}
      />
      <button
        type="button"
        className="cord__knob"
        aria-label={dark ? "Turn the lights on" : "Pull the cord for lights out"}
        aria-pressed={dark}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          start.current = { y: e.clientY, base };
        }}
        onClick={() => {
          if (!start.current) onToggle();
        }}
      >
        <span className="cord__cap" />
      </button>
    </div>
  );
}
