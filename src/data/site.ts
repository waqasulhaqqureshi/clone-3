/**
 * Every string on the site, copied verbatim from the reference
 * (https://therishithakor.com — /home, /work, /my-story and the five service pages).
 */

export type Role = {
  id: string;
  label: string;
  short: string;
  nav: string;
  path: string;
  index: string;
  door: { color: string; plaque: string; image: string };
  room: { kicker: string; points: string[] };
  portrait: string;
};

export const ROLES: Role[] = [
  {
    id: "web",
    label: "Web Developer",
    short: "Web Development",
    nav: "Web Development",
    path: "/web-developer",
    index: "01",
    door: { color: "#24344d", plaque: "WEB\nDEVELOPER", image: "/assets/img/door-web.webp" },
    room: {
      kicker: "End to end, from sketch to live site",
      points: [
        "Discovery & planning",
        "UX & visual design",
        "Front-end & back-end development",
        "Technical SEO & performance",
        "Analytics, launch & ongoing support",
      ],
    },
    portrait: "/assets/img/portrait-web.webp",
  },
  {
    id: "app",
    label: "App Developer",
    short: "App Development",
    nav: "App Development",
    path: "/app-developer",
    index: "02",
    door: { color: "#3a2a2c", plaque: "APP\nDEVELOPER", image: "/assets/img/door-app.webp" },
    room: {
      kicker: "From the first idea to the App Store",
      points: [
        "Product scoping & user flows",
        "Interface design",
        "Cross-platform development",
        "Device testing & store launch",
        "Analytics, monitoring & updates",
      ],
    },
    portrait: "/assets/img/portrait-app.webp",
  },
  {
    id: "uiux",
    label: "UI/UX Designer",
    short: "UI/UX Design",
    nav: "UI/UX Design",
    path: "/ui-ux-designer",
    index: "03",
    door: { color: "#7f8f74", plaque: "UI/UX\nDESIGNER", image: "/assets/img/door-uiux.webp" },
    room: {
      kicker: "Research first, pixels second",
      points: [
        "Research & competitor analysis",
        "Interaction architecture & flows",
        "Wireframes & high-fidelity UI",
        "Prototyping & usability testing",
        "Design systems & handoff",
      ],
    },
    portrait: "/assets/img/portrait-uiux.webp",
  },
  {
    id: "graphic",
    label: "Graphic Designer",
    short: "Graphic Design",
    nav: "Graphic Design",
    path: "/graphic-designer",
    index: "04",
    door: { color: "#b05a2b", plaque: "GRAPHIC\nDESIGNER", image: "/assets/img/door-graphic.webp" },
    room: {
      kicker: "Visual content, true to the brand",
      points: [
        "Brand audit & tone analysis",
        "Built around brand guidelines",
        "Posters & social media creatives",
        "Strong type & clear hierarchy",
        "Every format each platform needs",
      ],
    },
    portrait: "/assets/img/portrait-graphic.webp",
  },
  {
    id: "photographer",
    label: "Photographer",
    short: "Photography",
    nav: "Photography",
    path: "/photographer",
    index: "05",
    door: { color: "#2f3b36", plaque: "PHOTO-\nGRAPHER", image: "/assets/img/door-web.webp" },
    room: {
      kicker: "Light, framing and the moment",
      points: [
        "Concept & moodboards",
        "Location & studio scouting",
        "Shooting & art direction",
        "Selection & colour grading",
        "Print-ready delivery",
      ],
    },
    portrait: "/assets/img/portrait-photographer.webp",
  },
];

export const NAV = [
  { label: "Home", path: "/home" },
  { label: "Web Development", path: "/web-developer" },
  { label: "App Development", path: "/app-developer" },
  { label: "UI/UX Design", path: "/ui-ux-designer" },
  { label: "Graphic Design", path: "/graphic-designer" },
  { label: "My story", path: "/my-story" },
  { label: "Contact", path: "/contact" },
];

export const STORY = [
  {
    period: "Oct 2026 — Now",
    role: "Independent freelancer",
    org: "Working for myself, remote-first",
    points: [
      "Websites, iOS apps, interfaces and brand creatives, carried from the first sketch to launch.",
      "Working directly with clients, wherever they are.",
    ],
    year: "2026",
  },
  {
    period: "Jul 2026 — Sep 2026",
    role: "Graphic designer",
    org: "Himspring LLC",
    points: [
      "Managed visual content across social media handles for real estate, luxury water bottle and clothing brands.",
      "Designed social media creatives, stories and carousels in Adobe Illustrator, keeping every brand consistent across platforms.",
    ],
    year: "2026",
  },
  {
    period: "Jan 2026 — Jun 2026",
    role: "UI/UX designer",
    org: "Quicko Pvt Ltd, Ahmedabad",
    points: [
      "Designed website interfaces and user experiences in Figma, focused on usability, visual clarity and function.",
      "Built no-code web pages and interactive financial tools in Framer, turning designs into working products.",
    ],
    year: "2026",
  },
  {
    period: "Jan 2025 — May 2025",
    role: "Graphic designer intern",
    org: "WBT, Delhi · Remote",
    points: [
      "Designed pitch decks and presentations that communicate ideas and business concepts clearly.",
      "Created social media creatives and visual assets for branding, marketing and digital communication.",
    ],
    year: "2025",
  },
  {
    period: "Jul 2022 — May 2026",
    role: "B.Tech, Computer Science",
    org: "Pandit Deendayal Energy University (PDEU)",
    points: [
      "Four years of computer science: where it all started, with code in the classroom and design on the side.",
      "Graduated in May 2026, with internships and real projects already under way.",
    ],
    year: "2022",
  },
];

export type Project = {
  kicker: string;
  title: string;
  sub: string;
  body: string;
  tags: string[];
  media: { src: string; kind: "browser" | "phone" | "plain"; alt: string; icon?: string };
  href?: string;
};

export const WEB_PROJECTS: Project[] = [
  {
    kicker: "Website build",
    title: "Sundown Studio",
    sub: "Studio website",
    body: "An editorial website for a multi-disciplinary studio that creates spaces and experiences: oversized type, a soft red glow that follows the story and a project list that reveals imagery on hover.",
    tags: ["Design & build", "Motion", "Hover interactions"],
    media: { src: "variant:sundown", kind: "browser", alt: "Screen recording of the Sundown Studio build" },
  },
  {
    kicker: "Website build",
    title: "Personal portfolio",
    sub: "Product designer portfolio",
    body: "A dark, type-led portfolio with a large display headline, a project list with hover previews and an about section.",
    tags: ["Design & build", "Typography", "Hover previews"],
    media: { src: "variant:portfolio", kind: "phone", alt: "Screen recording of the portfolio build" },
  },
  {
    kicker: "Quicko · Live",
    title: "P&L Page for Zerodha",
    sub: "Broker landing page · pnl.page",
    body: "Landing page that helps Zerodha users connect their demat account, track profit & loss, download tax-ready reports and share verified P&L with their tax advisor.",
    tags: ["Landing page", "Responsive build", "SEO"],
    media: { src: "variant:zerodha", kind: "browser", alt: "P&L Page for Zerodha: full-page screenshot" },
    href: "https://pnl.page/brokers/zerodha",
  },
  {
    kicker: "Quicko · Live",
    title: "Capital Gains Tax Calculator",
    sub: "Interactive tool · quicko.com",
    body: "Calculates LTCG and STCG on shares, property, mutual funds and crypto: enter the buy price and sell date to get capital gains tax and indexed cost instantly.",
    tags: ["Calculator", "Interactive UI", "SEO"],
    media: { src: "variant:cgcalc", kind: "plain", alt: "Capital Gains Tax Calculator: full-page screenshot" },
    href: "https://quicko.com/tools/capital-gains-tax-calculator",
  },
  {
    kicker: "Sandbox · Live",
    title: "Tax API Cost Calculator",
    sub: "Pricing tool · sandbox.co.in",
    body: "Estimates the cost of tax APIs for KYC, Income Tax, TDS and GST: choose a plan, add monthly usage and download a pricing estimate.",
    tags: ["Pricing calculator", "Interactive UI", "Embedded tool"],
    media: { src: "variant:taxapi", kind: "browser", alt: "Tax API Cost Calculator: full-page screenshot" },
    href: "https://sandbox.co.in/tools/cost-calculator",
  },
  {
    kicker: "Quicko · Live",
    title: "Tax P&L Report, explained",
    sub: "Long-form guide · pnl.page",
    body: "A guide to every sheet of the Tax P&L report: capital gains on shares, mutual funds and real estate, intraday and F&O income, dividends and loss adjustment, with tables and FAQs.",
    tags: ["Content page", "Data tables", "SEO"],
    media: { src: "variant:taxpnl", kind: "plain", alt: "Tax P&L Report, explained: full-page screenshot" },
    href: "https://pnl.page/guides/understand-tax-pnl-report",
  },
  {
    kicker: "Quicko · Live",
    title: "Capital Gains Statement, explained",
    sub: "Long-form guide · pnl.page",
    body: "Walks Indian investors through each section of the Capital Gains Statement: STCG and LTCG on equity shares, mutual funds and real estate.",
    tags: ["Content page", "Data tables", "SEO"],
    media: { src: "variant:cgstatement", kind: "plain", alt: "Capital Gains Statement, explained: full-page screenshot" },
    href: "https://pnl.page/guides/understand-capital-gains-statement",
  },
];

export const APP_PROJECTS: Project[] = [
  {
    kicker: "iOS app · Finance",
    title: "Expense Tracker",
    sub: "Personal finance, organised into books",
    body: "Spending is grouped into expense books such as Personal, Travel and Business, each with its own budget. Add income or an expense in a couple of taps, see the balance, spend and budget used at a glance, and search across every entry.",
    tags: ["Budgets", "Expense books", "Shortcuts & Back Tap"],
    media: { src: "variant:expense", kind: "phone", alt: "Screen recording on iPhone" },
  },
  {
    kicker: "iOS app · Privacy",
    title: "Secret Vault",
    sub: "A photo vault disguised as a calculator",
    body: "It looks and works like an ordinary calculator. Type your secret equation and double-tap % to open a private vault: photos you import are hidden there and can be removed from your photo library.",
    tags: ["Privacy", "Equation passcode", "Photos access"],
    media: { src: "variant:vault", kind: "phone", alt: "Recorded on iPhone with sample photos" },
  },
  {
    kicker: "iOS game · Arcade",
    title: "Brick Breaker",
    sub: "Arcade game with pixel-art levels",
    body: "A fast arcade brick breaker: pixel-art levels, multi-ball power-ups that flood the screen, combos and a live score, with a pause menu and level-by-level progression.",
    tags: ["Game design", "Power-ups", "Level design"],
    media: { src: "variant:brick", kind: "phone", alt: "Gameplay recorded on iPhone" },
  },
  {
    kicker: "iOS app · Utility",
    title: "Dice",
    sub: "A colourful dice roller",
    body: "Roll several dice at once: each die fills its own block of colour and the total updates instantly, so a board-game night needs nothing but a phone.",
    tags: ["Utility", "Minimal UI", "Tap to roll"],
    media: { src: "variant:dice", kind: "phone", alt: "Screen recording on iPhone" },
  },
];

export const UX_PROJECTS: Project[] = [
  {
    kicker: "Product design",
    title: "Cliq",
    sub: "Affiliate management · self-hosted SaaS",
    body: "A full affiliate platform a company runs on its own servers. Admins see revenue, commission, signups and purchases, top-promoter leaderboards and a daily chart; promoters get their own dashboard to create and track referral links. Fully white-label, so each company runs it under its own brand.",
    tags: ["SaaS dashboard", "Data visualisation", "White-label"],
    media: { src: "variant:cliq", kind: "browser", alt: "Admin and promoter screens, shown under three client brands" },
  },
  {
    kicker: "Figma prototype",
    title: "Prime Hostel",
    sub: "Hotel booking · web app design",
    body: "A booking flow from search to reservation: location and date pickers, hotel listings with filters, a property page with gallery, facilities, reviews and a price breakdown, plus login and sign-up.",
    tags: ["User flow", "Interactive prototype", "Booking UX"],
    media: { src: "variant:prime", kind: "browser", alt: "Prototype walkthrough recorded in Figma" },
  },
  {
    kicker: "Figma prototype",
    title: "WeBuildTech",
    sub: "AI agency · website design",
    body: "A bold, dark landing page for an AI product studio: a 3D mascot hero, service cards, cloud partners, a technology wall, case studies and a project enquiry call to action.",
    tags: ["Landing page", "Visual design", "Brand look"],
    media: { src: "variant:webuild", kind: "browser", alt: "Prototype walkthrough recorded in Figma" },
  },
  {
    kicker: "Figma prototype",
    title: "Jordan One Take 4",
    sub: "Product page · e-commerce concept",
    body: "A product page concept where each colourway flies in with smart-animate transitions, with oversized type, colour swatches, size select and add to cart.",
    tags: ["E-commerce", "Smart animate", "Product showcase"],
    media: { src: "variant:jordan", kind: "browser", alt: "Prototype walkthrough recorded in Figma" },
  },
  {
    kicker: "Quicko · Live",
    title: "P&L Page for Zerodha",
    sub: "Designed and shipped · pnl.page",
    body: "Designed end to end: the dark trading-terminal look, a clear hero with the product shown in context, and the sections that explain P&L, tax reports and accrual summaries.",
    tags: ["UI design", "Design to build", "Live product"],
    media: { src: "variant:zerodha", kind: "plain", alt: "P&L Page for Zerodha: full-page screenshot" },
    href: "https://pnl.page/brokers/zerodha",
  },
];

export type Brand = {
  name: string;
  kicker: string;
  sub: string;
  theme: "dark" | "light" | "rose" | "violet" | "ink";
  description?: string;
  tags: string[];
  prints: { src: string; kind?: "poster" | "story" | "carousel"; slides?: number }[];
  bg: string;
  fg: string;
};

export const BRANDS: Brand[] = [
  {
    name: "Odooro Realty",
    kicker: "01 — Real estate",
    sub: "Editorial property campaigns",
    theme: "dark",
    description:
      "Property campaigns built around light and architecture: quiet type, wide margins and a listing template that stays readable at every crop.",
    tags: ["Art direction", "Listing creatives", "Instagram"],
    bg: "#1d2a25",
    fg: "#f0ece5",
    prints: [
      { src: "/assets/img/brand-odooro-1.webp" },
      { src: "/assets/img/brand-odooro-2.webp" },
      { src: "/assets/img/brand-odooro-3.webp" },
      { src: "/assets/img/brand-odooro-4.webp" },
      { src: "/assets/img/brand-odooro-5.webp" },
      { src: "/assets/img/brand-odooro-6.webp" },
      { src: "/assets/img/brand-odooro-7.webp" },
      { src: "/assets/img/brand-odooro-8.webp" },
    ],
  },
  {
    name: "Himspring",
    kicker: "02 — Social campaign · Premium water",
    sub: "A social campaign for a premium water brand",
    theme: "light",
    description:
      "Cool light, clean headlines and quiet details that make a bottle of water feel like luxury.",
    tags: ["Art direction", "Instagram posts", "Brand voice"],
    bg: "#cfd3d6",
    fg: "#1e2224",
    prints: [
      { src: "/assets/img/brand-him-1.webp" },
      { src: "/assets/img/brand-him-2.webp" },
      { src: "/assets/img/brand-him-3.webp" },
      { src: "/assets/img/brand-him-4.webp" },
      { src: "/assets/img/brand-him-5.webp" },
      { src: "/assets/img/brand-him-6.webp" },
      { src: "/assets/img/brand-him-7.webp" },
      { src: "/assets/img/brand-him-8.webp" },
    ],
  },
  {
    name: "Kallisto Miorah",
    kicker: "03 — Posts & stories · Fashion",
    sub: "Posts and stories for a contemporary womenswear label",
    theme: "rose",
    description:
      "Fashion-editorial layouts, product cutouts and shop-the-look stories in soft, editorial tones.",
    tags: ["Fashion editorial", "Posts & stories", "Product cutouts"],
    bg: "#c9b6b9",
    fg: "#241d1e",
    prints: [
      { src: "/assets/img/brand-kal-1.webp" },
      { src: "/assets/img/brand-kal-2.webp" },
      { src: "/assets/img/brand-kal-3.webp" },
      { src: "/assets/img/brand-kal-4.webp" },
      { src: "/assets/img/brand-kal-5.webp" },
      { src: "/assets/img/brand-kal-6.webp" },
      { src: "/assets/img/brand-kal-7.webp" },
      { src: "/assets/img/brand-kal-8.webp" },
    ],
  },
  {
    name: "WeBuildTech",
    kicker: "04 — Events · Community",
    sub: "Posters for college fests and clubs",
    theme: "violet",
    description:
      "Posters for college fests and clubs: festive creatives and logo marks, from bold type-led launches to clean identities.",
    tags: ["Event posters", "Logo design", "Typography"],
    bg: "#7f7d8c",
    fg: "#f4f1ee",
    prints: [
      { src: "/assets/img/brand-wbt-1.webp" },
      { src: "/assets/img/brand-wbt-2.webp" },
      { src: "/assets/img/brand-wbt-3.webp" },
      { src: "/assets/img/brand-wbt-4.webp" },
      { src: "/assets/img/brand-wbt-5.webp" },
      { src: "/assets/img/brand-wbt-6.webp" },
    ],
  },
  {
    name: "Posters & logos",
    kicker: "05 — Prints",
    sub: "Assorted prints",
    theme: "ink",
    description: "A pinboard of everything else: club posters, recruitment prints and identity marks.",
    tags: ["Posters", "Logos"],
    bg: "#211f1d",
    fg: "#f2efe9",
    prints: [
      { src: "/assets/img/brand-pos-1.webp" },
      { src: "/assets/img/brand-pos-2.webp" },
      { src: "/assets/img/brand-pos-3.webp" },
      { src: "/assets/img/brand-pos-4.webp" },
      { src: "/assets/img/brand-pos-5.webp" },
      { src: "/assets/img/brand-pos-6.webp" },
      { src: "/assets/img/brand-pos-7.webp" },
    ],
  },
];

const PHOTO_COUNT = 24;

export const PHOTOS = Array.from({ length: PHOTO_COUNT }, (_, i) => `/assets/img/photo-${String(i + 1).padStart(2, "0")}.webp`);
