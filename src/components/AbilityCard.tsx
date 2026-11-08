import { useEffect, useRef, useState } from "react";

const STATS = [
  { label: "Web development", value: 90 },
  { label: "UI/UX design", value: 85 },
  { label: "Graphic design", value: 85 },
  { label: "App development", value: 75 },
];

/**
 * The "My ability card" overlay: a laminated card that tilts with the pointer,
 * flips on tap and lists the four readings (90 / 85 / 85 / 75).
 */
export default function AbilityCard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setFlipped(false);
      setTilt({ x: 0, y: 0 });
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -14, y: px * 18 });
  };

  return (
    <div
      className="cardwrap"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label="My ability card"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className="cardwrap__close" onClick={onClose} aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div
        ref={stage}
        className="cardwrap__stage"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (flipped ? 180 : 0)}deg)` }}
        onPointerMove={move}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        onClick={() => setFlipped((f) => !f)}
      >
        <div className="card">
          <div className="card__art" />
          <div className="card__frame">
            <span className="card__mono">Rishi Thakor · Portfolio</span>
            <span className="card__role" style={{ marginTop: 10 }}>Independent freelancer</span>
            <span className="card__name">Ability card</span>
            <div className="card__stats">
              {STATS.map((s) => (
                <div className="card__stat" key={s.label}>
                  <span>{s.label}</span>
                  <b>{s.value}</b>
                  <span className="card__bar">
                    <i style={{ width: `${s.value}%` }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card card--back">
          <div className="card__art" />
          <div className="card__frame">
            <span className="card__mono">Web · App · UI/UX · Graphic design</span>
            <span className="card__name" style={{ marginTop: 12 }}>Available for work</span>
            <span className="card__role" style={{ marginTop: 8, textTransform: "none", letterSpacing: 0 }}>
              Remote-first, worldwide
            </span>
            <div className="card__stats">
              <div className="card__stat">
                <span>Local time</span>
                <b>
                  {new Date().toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" }).toLowerCase()}
                </b>
              </div>
              <div className="card__stat">
                <span>Email</span>
                <b>rishithakor218@gmail.com</b>
              </div>
            </div>
          </div>
        </div>

        <p className="card__hint">Move across the card — tilt or drag it · tap to flip</p>
      </div>
    </div>
  );
}
