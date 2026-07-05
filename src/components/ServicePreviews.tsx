/* Hand-drawn SVG preview art for each Lexma Solutions service.
   Shared visual language: charcoal card, gold line-work, cream accents. */

const G = "#c9a24b";
const GB = "#e8c06f";
const CREAM = "rgba(245,239,230,0.85)";
const DIM = "rgba(245,239,230,0.28)";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="svcBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#191815" />
          <stop offset="1" stopColor="#0c0b0a" />
        </linearGradient>
        <radialGradient id="svcGlow" cx="0.5" cy="0.35" r="0.7">
          <stop offset="0" stopColor="rgba(201,162,75,0.22)" />
          <stop offset="1" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="400" height="300" fill="url(#svcBg)" />
      <rect width="400" height="300" fill="url(#svcGlow)" />
      {children}
    </svg>
  );
}

/* 01 — Website Design & Development: browser with hero + blocks */
const Website = (
  <Frame>
    <rect x="70" y="55" width="260" height="190" rx="10" fill="none" stroke={G} strokeWidth="2" />
    <line x1="70" y1="85" x2="330" y2="85" stroke={G} strokeWidth="1.5" />
    <circle cx="88" cy="70" r="4" fill={GB} />
    <circle cx="102" cy="70" r="4" fill={DIM} />
    <circle cx="116" cy="70" r="4" fill={DIM} />
    <rect x="90" y="105" width="120" height="12" rx="6" fill={CREAM} />
    <rect x="90" y="127" width="80" height="8" rx="4" fill={DIM} />
    <rect x="90" y="150" width="54" height="20" rx="10" fill={GB} />
    <rect x="230" y="105" width="80" height="65" rx="6" fill="none" stroke={GB} strokeWidth="1.5" />
    <path d="M238 158 L258 138 L272 150 L292 128" fill="none" stroke={GB} strokeWidth="2" strokeLinecap="round" />
    <circle cx="258" cy="138" r="3" fill={GB} />
    <rect x="90" y="192" width="66" height="34" rx="5" fill="none" stroke={DIM} />
    <rect x="167" y="192" width="66" height="34" rx="5" fill="none" stroke={DIM} />
    <rect x="244" y="192" width="66" height="34" rx="5" fill="none" stroke={DIM} />
  </Frame>
);

/* 02 — Custom Business Software: stacked modular panels */
const Software = (
  <Frame>
    <rect x="60" y="70" width="170" height="110" rx="8" fill="none" stroke={G} strokeWidth="2" />
    <rect x="75" y="90" width="60" height="8" rx="4" fill={CREAM} />
    <rect x="75" y="106" width="140" height="6" rx="3" fill={DIM} />
    <rect x="75" y="120" width="140" height="6" rx="3" fill={DIM} />
    <rect x="75" y="140" width="90" height="22" rx="6" fill="none" stroke={GB} strokeWidth="1.5" />
    <rect x="205" y="120" width="135" height="110" rx="8" fill="#12110f" stroke={GB} strokeWidth="2" />
    <circle cx="230" cy="150" r="12" fill="none" stroke={GB} strokeWidth="2" />
    <path d="M230 143 v-6 M230 157 v6 M237 150 h6 M217 150 h-6" stroke={GB} strokeWidth="2" strokeLinecap="round" />
    <rect x="255" y="142" width="70" height="7" rx="3.5" fill={CREAM} />
    <rect x="255" y="156" width="50" height="6" rx="3" fill={DIM} />
    <rect x="222" y="185" width="100" height="8" rx="4" fill={DIM} />
    <rect x="222" y="200" width="70" height="8" rx="4" fill={GB} />
  </Frame>
);

/* 03 — Automation: gears + flow arrow */
const Automation = (
  <Frame>
    <g stroke={G} strokeWidth="2" fill="none">
      <circle cx="150" cy="130" r="34" />
      <circle cx="150" cy="130" r="12" fill="rgba(201,162,75,0.2)" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        return (
          <line
            key={i}
            x1={150 + Math.cos(a) * 34}
            y1={130 + Math.sin(a) * 34}
            x2={150 + Math.cos(a) * 44}
            y2={130 + Math.sin(a) * 44}
            strokeLinecap="round"
          />
        );
      })}
    </g>
    <g stroke={GB} strokeWidth="2" fill="none">
      <circle cx="235" cy="185" r="22" />
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i * Math.PI) / 3 + 0.3;
        return (
          <line
            key={i}
            x1={235 + Math.cos(a) * 22}
            y1={185 + Math.sin(a) * 22}
            x2={235 + Math.cos(a) * 30}
            y2={185 + Math.sin(a) * 30}
            strokeLinecap="round"
          />
        );
      })}
    </g>
    <path d="M280 110 C320 110, 330 140, 330 165" fill="none" stroke={CREAM} strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" />
    <path d="M323 158 L330 168 L336 157" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="262" y="88" width="56" height="26" rx="13" fill="none" stroke={GB} strokeWidth="1.5" />
    <text x="290" y="105" textAnchor="middle" fill={GB} fontSize="12" fontFamily="monospace">AUTO</text>
  </Frame>
);

/* 04 — Tool Integration: connected nodes */
const Integration = (
  <Frame>
    <g stroke={DIM} strokeWidth="1.5">
      <line x1="200" y1="150" x2="110" y2="90" />
      <line x1="200" y1="150" x2="295" y2="92" />
      <line x1="200" y1="150" x2="105" y2="210" />
      <line x1="200" y1="150" x2="292" y2="212" />
    </g>
    <circle cx="200" cy="150" r="26" fill="rgba(201,162,75,0.15)" stroke={GB} strokeWidth="2.5" />
    <path d="M191 150 h18 M200 141 v18" stroke={GB} strokeWidth="2.5" strokeLinecap="round" />
    <g fill="#12110f" stroke={G} strokeWidth="2">
      <rect x="86" y="68" width="48" height="44" rx="10" />
      <rect x="271" y="70" width="48" height="44" rx="22" />
      <rect x="81" y="188" width="48" height="44" rx="10" />
      <rect x="268" y="190" width="48" height="44" rx="22" />
    </g>
    <path d="M98 90 h24 M98 98 h16" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
    <path d="M283 92 h24 M283 100 h14" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
    <path d="M93 210 h24 M93 218 h16" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
    <path d="M280 212 h24 M280 220 h14" stroke={CREAM} strokeWidth="2" strokeLinecap="round" />
  </Frame>
);

/* 05 — AI Automation: neural sparkle */
const AI = (
  <Frame>
    <g stroke={DIM} strokeWidth="1.2">
      {[[120, 90], [120, 150], [120, 210]].flatMap(([x, y]) =>
        [[200, 120], [200, 180]].map(([x2, y2], j) => (
          <line key={`${x}${y}${j}`} x1={x} y1={y} x2={x2} y2={y2} />
        ))
      )}
      {[[200, 120], [200, 180]].flatMap(([x, y]) =>
        [[280, 150]].map(([x2, y2], j) => (
          <line key={`b${x}${y}${j}`} x1={x} y1={y} x2={x2} y2={y2} />
        ))
      )}
    </g>
    {[[120, 90], [120, 150], [120, 210], [200, 120], [200, 180]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="9" fill="#12110f" stroke={G} strokeWidth="2" />
    ))}
    <circle cx="280" cy="150" r="16" fill="rgba(201,162,75,0.2)" stroke={GB} strokeWidth="2.5" />
    <path d="M280 138 l3.5 8 8 3.5 -8 3.5 -3.5 8 -3.5 -8 -8 -3.5 8 -3.5 z" fill={GB} />
    <path d="M320 95 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5 z" fill={CREAM} />
  </Frame>
);

/* 06 — SEO & Google Ads: magnifier + rising bars */
const SEO = (
  <Frame>
    <g>
      <rect x="95" y="180" width="26" height="45" rx="4" fill={DIM} />
      <rect x="133" y="160" width="26" height="65" rx="4" fill="rgba(201,162,75,0.45)" />
      <rect x="171" y="135" width="26" height="90" rx="4" fill={G} />
      <rect x="209" y="108" width="26" height="117" rx="4" fill={GB} />
    </g>
    <path d="M100 150 L146 128 L184 105 L222 78" fill="none" stroke={CREAM} strokeWidth="2" strokeLinecap="round" strokeDasharray="1 7" />
    <circle cx="278" cy="115" r="34" fill="none" stroke={GB} strokeWidth="3" />
    <line x1="302" y1="140" x2="330" y2="168" stroke={GB} strokeWidth="4" strokeLinecap="round" />
    <path d="M266 115 l8 8 16 -16" fill="none" stroke={CREAM} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Frame>
);

/* 07 — Email Marketing: envelope + paper plane trail */
const Email = (
  <Frame>
    <rect x="85" y="105" width="150" height="100" rx="8" fill="#12110f" stroke={G} strokeWidth="2" />
    <path d="M85 113 L160 165 L235 113" fill="none" stroke={GB} strokeWidth="2" strokeLinejoin="round" />
    <path d="M255 95 C290 105, 300 120, 318 148" fill="none" stroke={DIM} strokeWidth="1.5" strokeDasharray="4 6" />
    <path d="M300 128 L345 112 L322 155 L314 136 Z" fill={GB} />
    <circle cx="248" cy="88" r="3" fill={CREAM} />
    <circle cx="262" cy="80" r="2" fill={DIM} />
    <rect x="103" y="218" width="70" height="7" rx="3.5" fill={DIM} />
    <rect x="103" y="231" width="46" height="7" rx="3.5" fill="rgba(201,162,75,0.45)" />
  </Frame>
);

/* 08 — WhatsApp & CRM: chat bubbles + contact card */
const WhatsAppCRM = (
  <Frame>
    <path d="M95 90 h130 a12 12 0 0 1 12 12 v40 a12 12 0 0 1 -12 12 h-95 l-22 20 v-20 h-13 a12 12 0 0 1 -12 -12 v-40 a12 12 0 0 1 12 -12 z" fill="#12110f" stroke={G} strokeWidth="2" />
    <rect x="110" y="110" width="90" height="7" rx="3.5" fill={CREAM} />
    <rect x="110" y="124" width="60" height="7" rx="3.5" fill={DIM} />
    <path d="M250 140 h95 a10 10 0 0 1 10 10 v34 a10 10 0 0 1 -10 10 h-60 l-18 16 v-16 h-17 a10 10 0 0 1 -10 -10 v-34 a10 10 0 0 1 10 -10 z" fill="rgba(201,162,75,0.16)" stroke={GB} strokeWidth="2" />
    <rect x="264" y="156" width="66" height="6" rx="3" fill={GB} />
    <rect x="264" y="168" width="44" height="6" rx="3" fill={DIM} />
    <rect x="120" y="195" width="150" height="52" rx="8" fill="none" stroke={DIM} strokeWidth="1.5" />
    <circle cx="145" cy="221" r="13" fill="none" stroke={GB} strokeWidth="2" />
    <circle cx="145" cy="216" r="4.5" fill={GB} />
    <path d="M136 229 a9 6 0 0 1 18 0" fill={GB} />
    <rect x="168" y="210" width="70" height="6" rx="3" fill={CREAM} />
    <rect x="168" y="223" width="48" height="6" rx="3" fill={DIM} />
  </Frame>
);

/* 09 — Dashboards & Reports: charts */
const Dashboard = (
  <Frame>
    <rect x="70" y="70" width="260" height="160" rx="10" fill="#12110f" stroke={G} strokeWidth="2" />
    <line x1="200" y1="70" x2="200" y2="230" stroke={DIM} strokeWidth="1" />
    <line x1="70" y1="150" x2="200" y2="150" stroke={DIM} strokeWidth="1" />
    <path d="M85 130 L110 112 L135 122 L160 95 L185 104" fill="none" stroke={GB} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="160" cy="95" r="3.5" fill={GB} />
    <g>
      <rect x="86" y="200" width="16" height="18" rx="3" fill={DIM} />
      <rect x="110" y="188" width="16" height="30" rx="3" fill="rgba(201,162,75,0.5)" />
      <rect x="134" y="174" width="16" height="44" rx="3" fill={GB} />
      <rect x="158" y="182" width="16" height="36" rx="3" fill={G} />
    </g>
    <circle cx="265" cy="150" r="42" fill="none" stroke={DIM} strokeWidth="12" />
    <path d="M265 108 a42 42 0 0 1 40 29" fill="none" stroke={GB} strokeWidth="12" strokeLinecap="round" />
    <path d="M305 137 a42 42 0 0 1 -18 46" fill="none" stroke={G} strokeWidth="12" strokeLinecap="round" opacity="0.55" />
    <text x="265" y="156" textAnchor="middle" fill={CREAM} fontSize="16" fontWeight="700" fontFamily="sans-serif">78%</text>
  </Frame>
);

/* 10 — AI Business Assistants: friendly bot */
const Assistant = (
  <Frame>
    <rect x="145" y="95" width="110" height="90" rx="24" fill="#12110f" stroke={GB} strokeWidth="2.5" />
    <line x1="200" y1="95" x2="200" y2="72" stroke={GB} strokeWidth="2.5" />
    <circle cx="200" cy="66" r="6" fill={GB} />
    <circle cx="176" cy="135" r="9" fill={GB} />
    <circle cx="224" cy="135" r="9" fill={GB} />
    <path d="M182 162 a20 12 0 0 0 36 0" fill="none" stroke={CREAM} strokeWidth="2.5" strokeLinecap="round" />
    <path d="M120 120 a14 14 0 0 1 14 -14 M120 150 a14 14 0 0 0 14 14" stroke={DIM} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M280 120 a14 14 0 0 0 -14 -14 M280 150 a14 14 0 0 1 -14 14" stroke={DIM} strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M258 210 h70 a9 9 0 0 1 9 9 v20 a9 9 0 0 1 -9 9 h-40 l-16 14 v-14 h-14 a9 9 0 0 1 -9 -9 v-20 a9 9 0 0 1 9 -9 z" fill="rgba(201,162,75,0.16)" stroke={GB} strokeWidth="1.8" />
    <circle cx="278" cy="229" r="3" fill={GB} />
    <circle cx="293" cy="229" r="3" fill={GB} />
    <circle cx="308" cy="229" r="3" fill={GB} />
  </Frame>
);

export const SERVICE_PREVIEWS: React.ReactNode[] = [
  Website,
  Software,
  Automation,
  Integration,
  AI,
  SEO,
  Email,
  WhatsAppCRM,
  Dashboard,
  Assistant,
];
