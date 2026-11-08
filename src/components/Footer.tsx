import { useEffect, useState } from "react";
import { formatClock } from "../utils/site";

const COLUMNS = [
  [
    { label: "Web Development", path: "/web-developer" },
    { label: "Graphic Design", path: "/graphic-designer" },
  ],
  [
    { label: "App Development", path: "/app-developer" },
    { label: "Photography", path: "/photographer" },
  ],
  [{ label: "UI/UX Design", path: "/ui-ux-designer" }],
  [
    { label: "Home", path: "/home" },
    { label: "My story", path: "/my-story" },
    { label: "Contact", path: "/contact" },
  ],
];

type Props = {
  onNavigate: (path: string) => void;
  onOpenCard: () => void;
  compact?: boolean;
};

/** The dark closing block: the call to action, the link grid and the wordmark. */
export default function Footer({ onNavigate, onOpenCard, compact = false }: Props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);

  const clock = formatClock(now);

  return (
    <footer className="cta footer" id="contact">
      {!compact && (
        <div className="shell cta__inner">
          <p className="cta__eyebrow">Available for new work</p>
          <h2 className="cta__title">
            <span>Need something built?</span>
            <span className="cta__title-grey">Let's make it happen.</span>
          </h2>
          <p className="cta__body">
            I'm available for freelance work: websites, apps, interfaces and visual content. Tell me what you need
            and I'll get back to you within a day.
          </p>
          <div className="cta__actions">
            <a className="btn btn--light" href="mailto:rishithakor218@gmail.com?subject=Project%20enquiry">
              Hire me
              <span className="btn__dot" aria-hidden="true">
                <Arrow />
              </span>
            </a>
            <button type="button" className="btn btn--outline" onClick={() => onNavigate("/work")}>
              See my work
            </button>
          </div>
        </div>
      )}

      <div className="shell">
        <div className="footer__grid">
          {COLUMNS.map((col, i) => (
            <div className="footer__col" key={i}>
              {col.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(link.path);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
          <div className="footer__col">
            <span>Available for work</span>
            <span>Remote-first, worldwide</span>
            <span>Local time {clock.time}</span>
          </div>
        </div>

        <div className="footer__word">
          <strong>
            Rishi<i>.</i>
          </strong>
          <div className="footer__meta">
            <button type="button" onClick={onOpenCard} className="footer__cardlink">
              My ability card
            </button>
            <a href="mailto:rishithakor218@gmail.com?subject=Project%20enquiry">
              Click to enter <Arrow />
            </a>
          </div>
        </div>

        <div className="footer__bar">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#e4ded7" }}
          >
            <Arrow up /> Back to top
          </button>
          <span>Local time — {clock.time}</span>
          <span>Independent freelancer · Remote-first, worldwide</span>
          <a href="mailto:rishithakor218@gmail.com?subject=Project%20enquiry">Hire me →</a>
        </div>
      </div>
    </footer>
  );
}

export function Arrow({ up = false }: { up?: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ transform: up ? "rotate(-90deg)" : undefined }}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
