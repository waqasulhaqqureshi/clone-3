import { useCallback, useEffect, useRef, useState } from "react";
import { ROLES } from "../data/site";

/**
 * "Magic happens behind the doors" — the plaster wall with one door per skill.
 * The wall is a pinned horizontal strip: drag it (or swipe on touch) to walk
 * along it, click a leaf to open that discipline's room.
 */
export default function Doors({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [shift, setShift] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ startX: number; startShift: number; moved: boolean } | null>(null);
  const [limit, setLimit] = useState(0);

  const measure = useCallback(() => {
    if (!track.current || !stage.current) return;
    const max = Math.max(0, track.current.scrollWidth - stage.current.clientWidth);
    setLimit(max);
    setShift((s) => Math.min(s, max));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { startX: e.clientX, startShift: shift, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    setShift(Math.max(0, Math.min(limit, d.startShift - dx)));
  };

  const endDrag = () => {
    drag.current = null;
  };

  const active = ROLES.find((r) => r.id === open) ?? null;

  return (
    <section className="doors" id="work" aria-label="My work, one door per skill">
      <div className="shell doors__head">
        <p className="eyebrow doors__eyebrow">My work, one door per skill</p>
        <h2 className="doors__title">Magic happens behind the doors</h2>
        <p className="doors__hint">Swipe along the wall</p>
      </div>

      <div
        className="doors__stage"
        ref={stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <div
          className="doors__track"
          ref={track}
          data-dragging={drag.current?.moved ?? false}
          style={{ transform: `translate3d(${-shift}px,0,0)`, transition: drag.current ? "none" : undefined }}
        >
          {ROLES.map((role) => {
            const isOpen = open === role.id;
            return (
              <div className="door" key={role.id} data-open={isOpen}>
                <span className="door__frame" aria-hidden="true" />
                <div className="door__recess">
                  <span className="door__room" aria-hidden="true" />
                  <div className="door__leaf" aria-hidden="true">
                    <img src={role.door.image} alt="" draggable={false} />
                    <span className="door__plaque">
                      {role.door.plaque.split("\n").map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="door__hit"
                  aria-expanded={isOpen}
                  aria-controls="door-room"
                  aria-label={isOpen ? `Close the ${role.short} door` : `Open the ${role.short} door`}
                  onClick={() => {
                    if (drag.current?.moved) return;
                    setOpen(isOpen ? null : role.id);
                  }}
                />

                {isOpen && (
                  <button type="button" className="door__here" onClick={() => onNavigate(role.path)}>
                    Click to enter
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="doors__walltrim" aria-hidden="true" />
      <div className="doors__floor" aria-hidden="true" />

      <div className="doors__panel" data-open={Boolean(active)} id="door-room" role="dialog" aria-label={active ? `${active.short} room` : undefined}>
        {active && (
          <>
            <span className="kicker">{active.room.kicker}</span>
            <h3>{active.short}</h3>
            <ul>
              {active.room.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="doors__panel-foot">
              <button type="button" className="doors__enter" onClick={() => onNavigate(active.path)}>
                Click to enter <ArrowRight />
              </button>
              <button type="button" className="doors__close" onClick={() => setOpen(null)}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
