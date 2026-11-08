import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import AbilityCard from "./components/AbilityCard";
import Footer from "./components/Footer";
import Intro from "./components/Intro";
import Home from "./pages/Home";
import ServicePage from "./pages/ServicePage";
import GraphicPage from "./pages/GraphicPage";
import PhotographyPage from "./pages/PhotographyPage";
import LegalPage from "./pages/LegalPage";
import { APP_PROJECTS, NAV, ROLES, UX_PROJECTS, WEB_PROJECTS } from "./data/site";
import type { Project } from "./data/site";
import { readStored, writeStored } from "./utils/site";

/* ------------------------------------------------------------------ routing */

export type Route = {
  path: string;
  page: "home" | "work" | "story" | "contact" | "web" | "app" | "uiux" | "graphic" | "photography" | "legal";
  anchor?: string;
};

const TABLE: Record<string, Route> = {
  "/": { path: "/home", page: "home" },
  "/home": { path: "/home", page: "home" },
  "/work": { path: "/work", page: "work", anchor: "work" },
  "/my-story": { path: "/my-story", page: "story", anchor: "story" },
  "/contact": { path: "/contact", page: "contact", anchor: "contact" },
  "/web-developer": { path: "/web-developer", page: "web" },
  "/app-developer": { path: "/app-developer", page: "app" },
  "/ui-ux-designer": { path: "/ui-ux-designer", page: "uiux" },
  "/graphic-designer": { path: "/graphic-designer", page: "graphic" },
  "/photographer": { path: "/photographer", page: "photography" },
  "/legal": { path: "/legal", page: "legal" },
};

function currentRoute(): Route {
  const raw = window.location.pathname.replace(/\/+$/, "") || "/";
  const hash = window.location.hash.replace(/^#/, "");
  if (TABLE[raw]) return { ...TABLE[raw], anchor: hash || TABLE[raw].anchor };
  return TABLE["/home"];
}

const SERVICE_PAGES: Record<string, { title: string; lede: string; projects: Project[]; roleId: string }> = {
  web: {
    title: "Web Development",
    lede: "Websites, landing pages and interactive tools, built end to end: from layout and interaction to responsive front-end, SEO and launch.",
    projects: WEB_PROJECTS,
    roleId: "web",
  },
  app: {
    title: "App Development",
    lede: "iOS apps and games, designed and built end to end: from the first screen and the small interactions to the details that make an app feel at home on iPhone.",
    projects: APP_PROJECTS,
    roleId: "app",
  },
  uiux: {
    title: "UI/UX Design",
    lede: "Interfaces researched, structured and prototyped: from user flows and wireframes to polished, interactive designs ready to build.",
    projects: UX_PROJECTS,
    roleId: "uiux",
  },
};

/* ------------------------------------------------------------------ app */

export default function App() {
  const [route, setRoute] = useState<Route>(() => currentRoute());
  const [fading, setFading] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [dark, setDark] = useState(() => readStored("rishi-mode") === "dark");
  const [consent, setConsent] = useState<string | null>(() => readStored("rishi-consent"));
  const pendingScroll = useRef<{ top: number; anchor?: string } | null>(null);

  /* keep the document in sync with the address bar */
  useEffect(() => {
    const onPop = () => {
      setFading(true);
      window.setTimeout(() => {
        setRoute(currentRoute());
        setFading(false);
      }, 300);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((path: string) => {
    const target = path.startsWith("#") ? path.slice(1) : path;
    const next = TABLE[target.replace(/\/+$/, "")] ?? TABLE["/home"];
    if (next.path === route.path && !next.anchor) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setFading(true);
    pendingScroll.current = { top: 0, anchor: next.anchor };
    window.setTimeout(() => {
      window.history.pushState({}, "", next.path);
      setRoute(next);
      setFading(false);
    }, 300);
  }, [route.path]);

  /* after a route swap: land on the anchor the reference lands on */
  useEffect(() => {
    const pending = pendingScroll.current;
    pendingScroll.current = null;
    const anchor = pending?.anchor ?? route.anchor;
    if (anchor) {
      requestAnimationFrame(() => {
        const el = document.getElementById(anchor);
        if (el) window.scrollTo({ top: el.offsetTop, behavior: "auto" });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [route]);

  useEffect(() => {
    document.documentElement.dataset.mode = dark ? "dark" : "light";
    writeStored("rishi-mode", dark ? "dark" : "light");
  }, [dark]);

  const activePath = useMemo(() => {
    const page = route.page;
    if (page === "home") return "/home";
    if (page === "work") return "/work";
    if (page === "story") return "/my-story";
    if (page === "contact") return "/contact";
    return route.path;
  }, [route]);

  const role = ROLES.find((r) => r.id === SERVICE_PAGES[route.page]?.roleId);

  return (
    <>
      <Header active={activePath} onNavigate={navigate} dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <main id="main">
        {route.page === "home" || route.page === "work" || route.page === "story" || route.page === "contact" ? (
          <Home route={route} onNavigate={navigate} onOpenCard={() => setCardOpen(true)} />
        ) : null}

        {SERVICE_PAGES[route.page] ? (
          <ServicePage
            title={SERVICE_PAGES[route.page].title}
            lede={SERVICE_PAGES[route.page].lede}
            projects={SERVICE_PAGES[route.page].projects}
            role={role}
            onNavigate={navigate}
          />
        ) : null}

        {route.page === "graphic" ? <GraphicPage onNavigate={navigate} /> : null}
        {route.page === "photography" ? <PhotographyPage onNavigate={navigate} /> : null}
        {route.page === "legal" ? <LegalPage onNavigate={navigate} /> : null}
      </main>

      {route.page !== "graphic" && route.page !== "photography" && route.page !== "legal" ? (
        <Footer onNavigate={navigate} onOpenCard={() => setCardOpen(true)} />
      ) : (
        <Footer onNavigate={navigate} onOpenCard={() => setCardOpen(true)} compact />
      )}

      <AbilityCard open={cardOpen} onClose={() => setCardOpen(false)} />
      <ConsentBar
        value={consent}
        onDetails={() => navigate("/legal")}
        onDecide={(v) => {
          setConsent(v);
          writeStored("rishi-consent", v);
        }}
      />
      <BackToTop />
      <Intro />
      <div className="pagefade" data-on={fading} aria-hidden="true" />

      <nav aria-label="All pages" className="sr-only">
        {NAV.map((item) => (
          <a key={item.path} href={item.path} onClick={(e) => { e.preventDefault(); navigate(item.path); }}>
            {item.label}
          </a>
        ))}
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ chrome bits */

function ConsentBar({ value, onDecide, onDetails }: { value: string | null; onDecide: (v: string) => void; onDetails: () => void }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (value) return;
    const t = window.setTimeout(() => setShown(true), 2600);
    return () => window.clearTimeout(t);
  }, [value]);
  if (value) return null;
  return (
    <aside className="consent" data-in={shown} aria-live="polite">
      <p>
        May I count your visit with Google Analytics? It sets cookies.{" "}
        <button type="button" className="consent__details" onClick={onDetails}>
          Details
        </button>
      </p>
      <div className="consent__actions">
        <button type="button" className="consent__btn consent__btn--ghost" onClick={() => onDecide("declined")}>
          No thanks
        </button>
        <button type="button" className="consent__btn consent__btn--solid" onClick={() => onDecide("allowed")}>
          Allow
        </button>
      </div>
    </aside>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setShow(window.scrollY > window.innerHeight * 0.6));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <button
      type="button"
      className="totop"
      data-show={show}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 13V3M8 3L3.5 7.5M8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
