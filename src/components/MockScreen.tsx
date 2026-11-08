/**
 * The project cards on the service pages show screen recordings. The recordings
 * themselves are not distributable here, so each one is drawn as a miniature of
 * the real interface: same palette, same layout, crisp at any size.
 */

import type { ReactElement } from "react";

type Props = { variant: string };

export default function MockScreen({ variant }: Props) {
  const className = `mock mock--${variant}`;
  return (
    <div className={className} aria-hidden="true">
      {SCREENS[variant]?.() ?? null}
    </div>
  );
}

const SCREENS: Record<string, () => ReactElement> = {
  sundown: () => (
    <>
      <div className="mock__top">
        <span className="mock__brand">
          Sundown <i />
          Studio
        </span>
        <span className="mock__nav">
          <b>Work</b>
          <b>Studio</b>
          <b>Contact</b>
        </span>
      </div>
      <div className="mock__glow" />
      <div className="mock__split">
        <p className="mock__para">
          Sundown is a multi-disciplinary studio focused on creating unique, end-to-end experiences and environments.
        </p>
        <h4 className="mock__display mock__display--right">
          SPACES
          <br />
          THAT
          <br />
          INSPIRE
        </h4>
      </div>
      <div className="mock__monitor">
        <span>CONVERSE</span>
      </div>
    </>
  ),
  portfolio: () => (
    <>
      <div className="mock__top mock__top--dark">
        <span className="mock__brand">product designer</span>
        <span className="mock__nav">
          <b>Work</b>
          <b>About</b>
          <b>Contact</b>
        </span>
      </div>
      <h4 className="mock__display mock__display--huge">PRODUCT DESIGNER</h4>
      <div className="mock__rows">
        {["Fintech dashboard", "Travel planner", "Design system", "Brand site"].map((r, i) => (
          <div className="mock__row" key={r}>
            <span>{r}</span>
            <em>{String(i + 1).padStart(2, "0")}</em>
          </div>
        ))}
      </div>
    </>
  ),
  zerodha: () => (
    <>
      <div className="mock__top mock__top--dark">
        <span className="mock__brand">pnl.page</span>
        <span className="mock__nav">
          <b>Brokers</b>
          <b>Guides</b>
        </span>
      </div>
      <h4 className="mock__display mock__display--mid">
        P&amp;L for <span className="mock__accent">Zerodha</span>
      </h4>
      <div className="mock__chart">
        {[38, 62, 44, 78, 56, 88, 70, 94].map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="mock__btnrow">
        <span className="mock__cta">Connect demat</span>
        <span className="mock__ghost">How it works</span>
      </div>
    </>
  ),
  cgcalc: () => (
    <>
      <div className="mock__card">
        <p className="mock__kicker">quicko · free tool</p>
        <h4 className="mock__display mock__display--small">Capital Gains Tax Calculator</h4>
        <div className="mock__fields">
          <span>Buy price — ₹ 1,20,000</span>
          <span>Sell date — 18 Mar 2026</span>
        </div>
        <div className="mock__result">
          <em>LTCG tax</em>
          <b>₹ 10,400</b>
        </div>
        <span className="mock__cta">Calculate</span>
      </div>
    </>
  ),
  taxapi: () => (
    <>
      <div className="mock__top">
        <span className="mock__brand">sandbox</span>
        <span className="mock__nav">
          <b>APIs</b>
          <b>Pricing</b>
        </span>
      </div>
      <h4 className="mock__display mock__display--small">Tax API cost calculator</h4>
      <div className="mock__tiers">
        {[
          { n: "KYC", v: "₹ 4.00" },
          { n: "Income Tax", v: "₹ 6.50" },
          { n: "GST", v: "₹ 3.20" },
        ].map((t) => (
          <div className="mock__tier" key={t.n}>
            <em>{t.n}</em>
            <b>{t.v}</b>
            <span />
            <span />
          </div>
        ))}
      </div>
    </>
  ),
  taxpnl: () => (
    <>
      <article className="mock__article">
        <p className="mock__kicker">pnl.page · guide</p>
        <h4 className="mock__display mock__display--small">What is Tax P&amp;L report?</h4>
        <div className="mock__lines">
          {[92, 84, 88, 66].map((w, i) => (
            <i key={i} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mock__table">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </article>
    </>
  ),
  cgstatement: () => (
    <>
      <div className="mock__heroband">
        <h4 className="mock__display mock__display--small">Capital Gains Statement, explained</h4>
      </div>
      <article className="mock__article mock__article--tight">
        <div className="mock__lines">
          {[88, 94, 76, 90, 62].map((w, i) => (
            <i key={i} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="mock__table">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </article>
    </>
  ),
  expense: () => (
    <div className="mock__phone mock__phone--finance">
      <p className="mock__kicker">Personal</p>
      <div className="mock__balance">
        <em>Spent this month</em>
        <b>₹ 24,180</b>
        <span>
          <i style={{ width: "62%" }} />
        </span>
      </div>
      {[
        ["Groceries", "₹ 2,140"],
        ["Travel", "₹ 5,600"],
        ["Business", "₹ 9,300"],
        ["Rent", "₹ 7,140"],
      ].map(([a, b]) => (
        <div className="mock__listrow" key={a}>
          <i />
          <span>{a}</span>
          <em>{b}</em>
        </div>
      ))}
      <div className="mock__tabbar">
        <i />
        <i />
        <i />
      </div>
    </div>
  ),
  vault: () => (
    <div className="mock__phone mock__phone--calc">
      <div className="mock__calcout">0</div>
      <div className="mock__keys">
        {Array.from({ length: 20 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  ),
  brick: () => (
    <div className="mock__phone mock__phone--game">
      <div className="mock__bricks">
        {Array.from({ length: 30 }, (_, i) => (
          <i key={i} style={{ opacity: 1 - (i % 6) * 0.09 }} />
        ))}
      </div>
      <span className="mock__ball" />
      <span className="mock__paddle" />
      <p className="mock__score">01240</p>
    </div>
  ),
  dice: () => (
    <div className="mock__phone mock__phone--dice">
      {["#e4573d", "#4a8bd6", "#e0b23c", "#3fa06f", "#8d5bd8", "#d95d94"].map((c, i) => (
        <i key={i} style={{ background: c }} />
      ))}
      <span className="mock__total">18</span>
    </div>
  ),
  cliq: () => (
    <>
      <div className="mock__dash">
        <aside className="mock__side">
          {Array.from({ length: 6 }, (_, i) => (
            <i key={i} />
          ))}
        </aside>
        <div className="mock__main">
          <div className="mock__stats">
            {[
              ["Revenue", "₹ 4.2L"],
              ["Commission", "₹ 62k"],
              ["Signups", "1,284"],
            ].map(([a, b]) => (
              <div className="mock__stat" key={a}>
                <em>{a}</em>
                <b>{b}</b>
              </div>
            ))}
          </div>
          <div className="mock__chart mock__chart--line">
            {[42, 58, 38, 72, 62, 84, 74, 92, 70].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mock__table mock__table--rows">
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  ),
  prime: () => (
    <>
      <div className="mock__top">
        <span className="mock__brand">Prime Hostel</span>
        <span className="mock__nav">
          <b>Stays</b>
          <b>Help</b>
        </span>
      </div>
      <div className="mock__search">
        <span>Ahmedabad</span>
        <span>12 — 15 Mar</span>
        <b>Search</b>
      </div>
      <div className="mock__stays">
        {[0, 1, 2].map((i) => (
          <div className="mock__stay" key={i}>
            <div className="mock__stayimg" />
            <span />
            <span />
          </div>
        ))}
      </div>
    </>
  ),
  webuild: () => (
    <>
      <div className="mock__top mock__top--dark">
        <span className="mock__brand">WeBuildTech</span>
        <span className="mock__nav">
          <b>Services</b>
          <b>Work</b>
        </span>
      </div>
      <div className="mock__mascot" />
      <h4 className="mock__display mock__display--mid">We build with AI</h4>
      <div className="mock__cards">
        {[0, 1, 2].map((i) => (
          <div className="mock__minicard" key={i}>
            <i />
            <span />
            <span />
          </div>
        ))}
      </div>
    </>
  ),
  jordan: () => (
    <>
      <div className="mock__top">
        <span className="mock__brand">Jordan One Take 4</span>
        <span className="mock__nav">
          <b>Cart (1)</b>
        </span>
      </div>
      <div className="mock__product">
        <div className="mock__shoe" />
        <div className="mock__buyside">
          <em>Air Jordan</em>
          <h4 className="mock__display mock__display--small">One Take 4</h4>
          <div className="mock__swatches">
            <i style={{ background: "#d64b3a" }} />
            <i style={{ background: "#2f3b56" }} />
            <i style={{ background: "#e6e2da" }} />
          </div>
          <div className="mock__sizes">
            {["8", "9", "10", "11"].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <span className="mock__cta">Add to cart</span>
        </div>
      </div>
    </>
  ),
};
