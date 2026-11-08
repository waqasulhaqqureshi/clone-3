import { useEffect, useRef, useState } from "react";
import { PHOTOS } from "../data/site";
import { Arrow } from "../components/Footer";

type Props = { onNavigate: (p: string) => void };

const COLUMNS = 4;

export default function PhotographyPage({ onNavigate }: Props) {
  const plane = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [bounds, setBounds] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const measure = () => {
      const el = plane.current;
      if (!el) return;
      const inner = el.firstElementChild as HTMLElement | null;
      if (!inner) return;
      setBounds({
        x: Math.max(0, (inner.offsetWidth - el.clientWidth) / 2),
        y: Math.max(0, (inner.offsetHeight - el.clientHeight) / 2),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));

  const columns = Array.from({ length: COLUMNS }, (_, c) => PHOTOS.filter((_, i) => i % COLUMNS === c));

  return (
    <div className="photos">
      <div className="photos__head">
        <div style={{ display: "grid", gap: 14 }}>
          <h1 className="photos__title">Photography by Rishi</h1>
          <p className="page__hint" style={{ color: "var(--muted)" }}>
            Drag in any direction
          </p>
        </div>
        <button type="button" className="backpill" style={{ position: "static" }} onClick={() => onNavigate("/work")}>
          <Arrow up /> Back to the doors
        </button>
      </div>

      <div
        className="photos__plane"
        ref={plane}
        data-dragging={Boolean(drag.current)}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setOffset({
            x: clamp(drag.current.ox + (e.clientX - drag.current.x) * 0.8, bounds.x),
            y: clamp(drag.current.oy + (e.clientY - drag.current.y) * 0.8, bounds.y),
          });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onWheel={(e) => {
          setOffset((o) => ({ x: clamp(o.x - e.deltaX, bounds.x), y: clamp(o.y - e.deltaY * 0.6, bounds.y) }));
        }}
      >
        <div className="photos__inner" style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}>
          {columns.map((col, ci) => (
            <div className="photos__col" key={ci}>
              {col.map((src, i) => (
                <button
                  type="button"
                  className="photos__item"
                  key={src + i}
                  onClick={() => setOpen(PHOTOS.indexOf(src))}
                  aria-label={`Open photograph ${PHOTOS.indexOf(src) + 1}`}
                >
                  <img src={src} alt="" loading="lazy" draggable={false} />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {open !== null && (
        <div className="lightbox" data-open="true" role="dialog" aria-modal="true" aria-label="Photograph">
          <div className="lightbox__stage">
            <span className="lightbox__count">
              {open + 1} / {PHOTOS.length}
            </span>
            <button type="button" className="lightbox__close" onClick={() => setOpen(null)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              onClick={() => setOpen((o) => (o === null ? o : (o - 1 + PHOTOS.length) % PHOTOS.length))}
              aria-label="Previous"
            >
              ←
            </button>
            <img className="lightbox__img" src={PHOTOS[open]} alt={`Photograph ${open + 1}`} />
            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              onClick={() => setOpen((o) => (o === null ? o : (o + 1) % PHOTOS.length))}
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
