import { useEffect, useState } from "react";

const PILLS = [
  { label: "Rishi Thakor", color: "#1F1C1C", text: "#E8E4E0" },
  { label: "Web development", color: "#24344d", text: "#E8E4E0" },
  { label: "App development", color: "#3a2a2c", text: "#E8E4E0" },
  { label: "UI/UX design", color: "#7f8f74", text: "#F3EEEC" },
  { label: "Graphic design", color: "#b05a2b", text: "#F3EEEC" },
  { label: "Photography", color: "#cfc6bd", text: "#1A1818" },
];

/** "Opening up the work" — the curtain shown while fonts and the first photo settle. */
export default function Intro() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      return;
    }
    let value = 0;
    const id = window.setInterval(() => {
      value = Math.min(100, value + Math.ceil(Math.random() * 13) + 5);
      setCount(value);
      if (value >= 100) {
        window.clearInterval(id);
        window.setTimeout(() => setDone(true), 240);
      }
    }, 110);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.intro = done ? "done" : "on";
  }, [done]);

  return (
    <div className="intro" data-done={done} aria-hidden={done}>
      <div className="intro__stack">
        {PILLS.map((pill, i) => (
          <span
            key={pill.label}
            className="intro__pill"
            style={{ background: pill.color, color: pill.text, animationDelay: `${i * 70}ms` }}
          >
            {pill.label}
          </span>
        ))}
      </div>
      <span className="intro__count">
        OPENING UP THE WORK {String(count).padStart(3, "0")}
      </span>
    </div>
  );
}
