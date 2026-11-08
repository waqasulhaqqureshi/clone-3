import { useEffect, useRef, useState } from "react";
import { ROLES, STORY } from "../data/site";
import { Arrow } from "../components/Footer";
import Doors from "../sections/Doors";
import type { Route } from "../App";

type Props = {
  route: Route;
  onNavigate: (path: string) => void;
  onOpenCard: () => void;
};

export default function Home({ onNavigate, onOpenCard }: Props) {
  return (
    <>
      <Hero onNavigate={onNavigate} onOpenCard={onOpenCard} />
      <Doors onNavigate={onNavigate} />
      <Story />
    </>
  );
}

/* ================================================================== hero */

function Hero({ onNavigate, onOpenCard }: { onNavigate: (p: string) => void; onOpenCard: () => void }) {
  const [index, setIndex] = useState(3);
  const [flip, setFlip] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tick = () => {
      setFlip(true);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % ROLES.length);
        setFlip(false);
      }, 210);
    };

    const start = () => {
      stop();
      timer.current = window.setInterval(tick, 3200);
    };
    const stop = () => {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const role = ROLES[index];

  return (
    <section className="hero" id="home">
      <div className="shell hero__grid">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">Independent Freelancer</p>

          <h1 className="hero__title">
            <span>Hi, I'm Rishi.</span>
            <span className="hero__title-grey">I am a</span>
          </h1>

          <div className="calendar">
            <span className="calendar__rings" aria-hidden="true" />
            <span className="calendar__stack" aria-hidden="true" />
            <span className="calendar__stack" aria-hidden="true" />
            <span className="calendar__stack" aria-hidden="true" />
            <span className="calendar__stack" aria-hidden="true" />
            <div className="calendar__card">
              <span className="sr-only" aria-live="polite">
                {role.label}
              </span>
              <span className="calendar__face" data-flip={flip} aria-hidden="true">
                {role.label}
              </span>
              <span className="calendar__count">
                {role.index} / 05
              </span>
            </div>
          </div>

          <div className="hero__actions">
            <a className="btn" href="mailto:rishithakor218@gmail.com?subject=Project%20enquiry">
              Hire me
              <span className="btn__dot" aria-hidden="true">
                <Arrow />
              </span>
            </a>
            <button type="button" className="btn btn--ghost" onClick={() => onNavigate("/work")}>
              See my work
            </button>
          </div>
        </div>

        <figure className="hero__figure">
          {ROLES.map((item) => (
            <img
              key={item.id}
              className="hero__photo hero__photo--swap"
              src={item.portrait}
              alt={item.id === role.id ? `Rishi Thakor, ${item.label.toLowerCase()}` : ""}
              aria-hidden={item.id !== role.id}
              width={918}
              height={808}
              loading="eager"
              style={{
                position: item.id === role.id ? "relative" : "absolute",
                opacity: item.id === role.id ? 1 : 0,
                transition: "opacity .7s cubic-bezier(.16,1,.3,1)",
              }}
            />
          ))}
          <button type="button" className="ability" onClick={onOpenCard}>
            My ability card
          </button>
        </figure>
      </div>

      <div className="hero__strip">
        <span>Available for work</span>
        <span>Remote-first, worldwide</span>
        <span>
          Scroll to explore <Arrow up />
        </span>
      </div>
    </section>
  );
}

/* ================================================================== story */

function Story() {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const total = Math.max(1, rect.height - window.innerHeight * 0.75);
        const raw = (window.innerHeight * 0.45 - rect.top) / total;
        const p = Math.min(1, Math.max(0, raw));
        setProgress(p);
        setActive(Math.min(STORY.length - 1, Math.floor(p * STORY.length)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const year = Math.round(2026 - progress * 4);
  const digits = String(year).split("");

  return (
    <section className="story" id="story" ref={section}>
      <svg className="story__rings" viewBox="0 0 400 400" aria-hidden="true" fill="none">
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={i} cx="200" cy="200" r={30 + i * 7.2} stroke="currentColor" strokeWidth="0.7" opacity={0.5 - i * 0.012} />
        ))}
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={200 + Math.cos(a) * 150}
              y1={200 + Math.sin(a) * 150}
              x2={200 + Math.cos(a) * 240}
              y2={200 + Math.sin(a) * 240}
              stroke="currentColor"
              strokeWidth="0.7"
            />
          );
        })}
      </svg>

      <div className="shell story__grid">
        <div className="story__left">
          <p className="eyebrow">My story</p>
          <h2 className="story__title">Let's go back in time.</h2>

          <div className="odometer" aria-label={`${year}`}>
            {digits.map((digit, i) => (
              <span className="odometer__wheel" key={i} aria-hidden="true">
                <span className="odometer__reel" style={{ transform: `translateY(${-Number(digit) * 0.84}em)` }}>
                  {Array.from({ length: 10 }, (_, n) => (
                    <span key={n}>{n}</span>
                  ))}
                </span>
              </span>
            ))}
          </div>

          <p className="story__period">{STORY[active].period}</p>
          <div className="story__railrow">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.2" />
              <path d="M8 4.6v2.2l1.8 1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span>
              {String(active + 1).padStart(2, "0")} / 05
            </span>
            <span className="story__rail">
              <i style={{ transform: `scaleX(${(active + 1) / STORY.length})` }} />
            </span>
          </div>
        </div>

        <div className="story__list">
          {STORY.map((item, i) => (
            <article
              className="story__item"
              key={item.period}
              style={{ opacity: i === active ? 1 : 0.45, transition: "opacity .5s ease" }}
            >
              <p className="kicker">{item.period}</p>
              <h3>{item.role}</h3>
              <p className="story__org">{item.org}</p>
              <ul className="story__points">
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
