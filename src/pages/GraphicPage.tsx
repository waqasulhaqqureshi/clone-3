import { useEffect, useRef, useState } from "react";
import { BRANDS } from "../data/site";
import { Arrow } from "../components/Footer";

type Props = { onNavigate: (p: string) => void };

export default function GraphicPage({ onNavigate }: Props) {
  const [lightbox, setLightbox] = useState<{ brand: number; index: number } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const step = (dir: number) => {
    setLightbox((current) => {
      if (!current) return current;
      const prints = BRANDS[current.brand].prints;
      return { ...current, index: (current.index + dir + prints.length) % prints.length };
    });
  };

  const active = lightbox ? BRANDS[lightbox.brand].prints[lightbox.index] : null;

  return (
    <div className="page" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <div className="shell" style={{ paddingTop: "clamp(110px, 11vw, 170px)" }}>
        <div className="page__headrow">
          <div style={{ display: "grid", gap: 22 }}>
            <h1 className="page__title">Graphic Design</h1>
            <p className="page__lede">
              Brand campaigns, social media creatives, posters and logos. Each brand hangs on its own line, in its own
              colours: scroll to walk along it, click any print to see it up close.
            </p>
          </div>
          <p className="page__hint">Scroll to walk the line</p>
        </div>
      </div>

      <div className="gallery">
        {BRANDS.map((brand, bi) => (
          <BrandRow
            key={brand.name}
            brand={brand}
            onOpen={(index) => setLightbox({ brand: bi, index })}
          />
        ))}
      </div>

      <div style={{ padding: "0 0 40px" }}>
        <div className="shell">
          <button type="button" className="backpill" style={{ position: "static" }} onClick={() => onNavigate("/work")}>
            <Arrow up /> Back to the doors
          </button>
        </div>
      </div>

      <div className="lightbox" data-open={Boolean(lightbox)} role="dialog" aria-modal="true" aria-label="Print viewer">
        {active && lightbox && (
          <>
            <div className="lightbox__stage">
              <span className="lightbox__count">
                {lightbox.index + 1} / {BRANDS[lightbox.brand].prints.length}
              </span>
              <button type="button" className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Close viewer">
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => step(-1)} aria-label="Previous print">
                ←
              </button>
              <img className="lightbox__img" src={active.src} alt={`${BRANDS[lightbox.brand].name} print ${lightbox.index + 1}`} />
              <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => step(1)} aria-label="Next print">
                →
              </button>
            </div>
            <div className="lightbox__thumbs">
              {BRANDS[lightbox.brand].prints.map((print, i) => (
                <button
                  type="button"
                  key={print.src + i}
                  className="lightbox__thumb"
                  data-active={i === lightbox.index}
                  onClick={() => setLightbox({ brand: lightbox.brand, index: i })}
                  aria-label={`Print ${i + 1}`}
                >
                  <img src={print.src} alt="" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function BrandRow({ brand, onOpen }: { brand: (typeof BRANDS)[number]; onOpen: (i: number) => void }) {
  const strip = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const drag = useRef<{ x: number; base: number } | null>(null);

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const max = () => Math.max(0, el.scrollWidth - el.clientWidth);
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
      e.preventDefault();
      setShift((s) => Math.max(0, Math.min(max(), s + e.deltaX)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section className="brand" style={{ background: brand.bg, color: brand.fg }}>
      <div className="brand__head">
        <div>
          <p className="brand__kicker">{brand.kicker}</p>
          <h2 className="brand__name">{brand.name}</h2>
        </div>
        <p className="brand__sub">{brand.sub}</p>
      </div>

      <div
        className="brand__line"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, base: shift };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !strip.current) return;
          const max = Math.max(0, strip.current.scrollWidth - strip.current.clientWidth);
          const next = drag.current.base - (e.clientX - drag.current.x);
          setShift(Math.max(0, Math.min(max, next)));
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
      >
        <div
          className="brand__strip"
          ref={strip}
          style={{ transform: `translate3d(${-shift}px,0,0)`, transition: drag.current ? "none" : "transform .35s cubic-bezier(.4,.1,.2,1)" }}
        >
          {brand.prints.map((print, i) => (
            <button type="button" className="print" key={print.src + i} onClick={() => onOpen(i)} aria-label={`View print ${i + 1}`}>
              <span className="print__clip" aria-hidden="true" />
              <span className="print__img">
                <img src={print.src} alt="" loading="lazy" draggable={false} />
                {print.slides ? <span className="print__badge">Carousel · {print.slides} slides</span> : null}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="brand__foot">
        <div className="brand__tags">
          {brand.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <span className="brand__scroll">
          Scroll <Arrow />
        </span>
      </div>
    </section>
  );
}
