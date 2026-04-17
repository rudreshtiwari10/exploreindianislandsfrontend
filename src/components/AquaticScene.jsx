/**
 * AquaticScene.jsx
 * Reusable animated deep-ocean background used by Login and Signup pages.
 * All animations are defined in src/pages/styles/auth.css
 */

// ── Static config arrays (outside component — no re-creation on render) ───────

const BUBBLES = [
  { left: '7%',  w: 8,  dur: '9s',    delay: '0s'    },
  { left: '13%', w: 5,  dur: '12s',   delay: '-4s'   },
  { left: '21%', w: 12, dur: '7.5s',  delay: '-6s'   },
  { left: '34%', w: 6,  dur: '14s',   delay: '-2s'   },
  { left: '46%', w: 4,  dur: '10s',   delay: '-8s'   },
  { left: '57%', w: 9,  dur: '11s',   delay: '-1s'   },
  { left: '68%', w: 5,  dur: '13s',   delay: '-5s'   },
  { left: '76%', w: 8,  dur: '8s',    delay: '-3s'   },
  { left: '84%', w: 11, dur: '15s',   delay: '-9s'   },
  { left: '92%', w: 4,  dur: '9.5s',  delay: '-7s'   },
  { left: '18%', w: 6,  dur: '16s',   delay: '-11s'  },
  { left: '44%', w: 8,  dur: '10.5s', delay: '-13s'  },
];

const SPARKLES = [
  { top: '18%', left: '11%', s: 3, dur: '3.2s', delay: '0s'    },
  { top: '36%', left: '24%', s: 2, dur: '4.1s', delay: '-1.2s' },
  { top: '53%', left: '7%',  s: 4, dur: '2.8s', delay: '-2.0s' },
  { top: '21%', left: '80%', s: 3, dur: '3.7s', delay: '-0.5s' },
  { top: '46%', left: '91%', s: 2, dur: '5.1s', delay: '-3.1s' },
  { top: '68%', left: '68%', s: 3, dur: '4.0s', delay: '-1.5s' },
  { top: '82%', left: '32%', s: 2, dur: '3.3s', delay: '-2.8s' },
  { top: '14%', left: '57%', s: 4, dur: '5.8s', delay: '-4.0s' },
];

const SEAWEED_LEFT = [
  { height: 140, opacity: 0.70, delay: 0.0,  duration: 3.5 },
  { height: 100, opacity: 0.55, delay: 0.8,  duration: 4.2 },
  { height: 165, opacity: 0.65, delay: 0.3,  duration: 3.8 },
  { height: 85,  opacity: 0.50, delay: 1.2,  duration: 4.8 },
  { height: 120, opacity: 0.60, delay: 0.6,  duration: 4.0 },
];

const SEAWEED_RIGHT = [
  { height: 110, opacity: 0.60, delay: 0.4,  duration: 4.3 },
  { height: 150, opacity: 0.70, delay: 1.0,  duration: 3.6 },
  { height: 90,  opacity: 0.50, delay: 0.2,  duration: 5.0 },
  { height: 130, opacity: 0.65, delay: 0.7,  duration: 3.9 },
  { height: 80,  opacity: 0.45, delay: 1.5,  duration: 4.5 },
];

// ── SVG Creature Components ───────────────────────────────────────────────────

/**
 * Fish — SVG silhouette that faces right by default.
 * Pass flip={true} to reverse (fish faces left, used for left-swimming fish).
 */
const Fish = ({ size = 60, color = 'rgba(0,212,255,0.45)', flip = false }) => {
  const w = size;
  const h = Math.round(size * 0.5);
  return (
    <div
      style={{
        display: 'block',
        lineHeight: 0,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    >
      <svg
        className="fish-svg"
        width={w}
        height={h}
        viewBox="0 0 120 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Tail fan */}
        <path d="M 20 27 L 2 6 L 2 48 Z" fill={color} />
        {/* Body */}
        <ellipse cx="72" cy="27" rx="50" ry="22" fill={color} />
        {/* Top fin */}
        <path d="M 62 11 Q 78 1 92 11" fill={color} opacity="0.75" />
        {/* Pectoral / bottom fin */}
        <path d="M 68 44 Q 82 55 78 43" fill={color} opacity="0.65" />
        {/* Body highlight */}
        <ellipse
          cx="84" cy="20" rx="22" ry="9"
          fill="rgba(255,255,255,0.13)"
          transform="rotate(-18, 84, 20)"
        />
        {/* Eye white */}
        <circle cx="110" cy="23" r="5.5" fill="rgba(255,255,255,0.94)" />
        {/* Pupil */}
        <circle cx="111" cy="23" r="2.8" fill="rgba(0,5,30,0.88)" />
        {/* Eye shine */}
        <circle cx="113" cy="21" r="1.2" fill="rgba(255,255,255,0.9)" />
      </svg>
    </div>
  );
};

/**
 * Jellyfish — bell + trailing tentacles.
 * The outer .jelly-bell div receives bellPulse animation from auth.css.
 */
const Jellyfish = ({ size = 70, color = 'rgba(168,85,247,0.5)' }) => {
  const w = size;
  const h = Math.round(size * 2.4);
  return (
    <div className="jelly-bell" style={{ width: w, display: 'block', lineHeight: 0 }}>
      <svg
        width={w}
        height={h}
        viewBox="0 0 80 192"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bell dome */}
        <path
          d="M 3 44 Q 3 3 40 3 Q 77 3 77 44 Q 77 63 40 67 Q 3 63 3 44 Z"
          fill={color}
        />
        {/* Inner highlight */}
        <ellipse cx="40" cy="32" rx="27" ry="18" fill="rgba(255,255,255,0.14)" />
        {/* Underside cup */}
        <path d="M 8 52 Q 40 70 72 52" fill={color} opacity="0.55" />
        {/* Oral arms */}
        <path d="M 30 64 Q 25 73 32 76" stroke={color} strokeWidth="3" fill="none" opacity="0.7" />
        <path d="M 40 66 L 40 78"        stroke={color} strokeWidth="3" fill="none" opacity="0.7" />
        <path d="M 50 64 Q 55 73 48 76" stroke={color} strokeWidth="3" fill="none" opacity="0.7" />
        {/* Tentacles */}
        <path
          d="M 16 66 Q 10 92 18 122 Q 24 150 16 165"
          stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.80"
        />
        <path
          d="M 27 68 Q 25 96 31 126 Q 29 152 35 168"
          stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65"
        />
        <path
          d="M 40 69 Q 43 100 38 130 Q 40 158 45 172"
          stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.80"
        />
        <path
          d="M 53 68 Q 55 96 49 126 Q 51 152 45 168"
          stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.65"
        />
        <path
          d="M 64 66 Q 70 92 62 122 Q 56 150 64 165"
          stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.80"
        />
      </svg>
    </div>
  );
};

/**
 * Seaweed — a single wavy upward stem with CSS sway animation.
 */
const Seaweed = ({ height = 100, opacity = 0.65, delay = 0, duration = 4 }) => (
  <svg
    className="seaweed-stem"
    width="22"
    height={height}
    viewBox={`0 0 22 ${height}`}
    style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
  >
    <path
      d={`M 11 ${height} Q 0 ${height * 0.82} 19 ${height * 0.64} Q 22 ${height * 0.46} 4 ${height * 0.28} Q 0 ${height * 0.12} 14 0`}
      stroke={`rgba(16,185,129,${opacity})`}
      strokeWidth="3.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Main AquaticScene Component ────────────────────────────────────────────────

const AquaticScene = () => (
  <>
    {/* ── Ambient glow orbs ── */}
    <div className="ocean-orb ocean-orb-1" />
    <div className="ocean-orb ocean-orb-2" />
    <div className="ocean-orb ocean-orb-3" />

    {/* ── Surface light rays ── */}
    <div className="light-rays">
      <div className="light-ray light-ray-1" />
      <div className="light-ray light-ray-2" />
      <div className="light-ray light-ray-3" />
      <div className="light-ray light-ray-4" />
    </div>

    {/* ── Fish ──
        fish-1,3,5 → swim LEFT  → pass flip={true} so they face the direction of travel
        fish-2,4   → swim RIGHT → face right naturally                                  */}
    <div className="fish-wrapper fish-1">
      <Fish size={74} color="rgba(0,195,255,0.43)" flip />
    </div>
    <div className="fish-wrapper fish-2">
      <Fish size={38} color="rgba(16,185,129,0.52)" />
    </div>
    <div className="fish-wrapper fish-3">
      <Fish size={58} color="rgba(99,102,241,0.42)" flip />
    </div>
    <div className="fish-wrapper fish-4">
      <Fish size={28} color="rgba(0,220,255,0.60)" />
    </div>
    <div className="fish-wrapper fish-5">
      <Fish size={66} color="rgba(20,184,166,0.40)" flip />
    </div>

    {/* ── Jellyfish (nested divs decouple translateY from translateX from bellPulse) ── */}
    <div className="jelly-float jelly-1">
      <div className="jelly-drift">
        <Jellyfish size={72} color="rgba(168,85,247,0.50)" />
      </div>
    </div>
    <div className="jelly-float jelly-2">
      <div className="jelly-drift">
        <Jellyfish size={46} color="rgba(236,72,153,0.46)" />
      </div>
    </div>
    <div className="jelly-float jelly-3">
      <div className="jelly-drift">
        <Jellyfish size={58} color="rgba(59,130,246,0.50)" />
      </div>
    </div>

    {/* ── Bubbles ── */}
    {BUBBLES.map((b, i) => (
      <div
        key={i}
        className="bubble"
        style={{
          left: b.left,
          width: b.w,
          height: b.w,
          animationDuration: b.dur,
          animationDelay: b.delay,
        }}
      />
    ))}

    {/* ── Bioluminescent sparkles ── */}
    {SPARKLES.map((s, i) => (
      <div
        key={i}
        className="sparkle"
        style={{
          top: s.top,
          left: s.left,
          width: s.s,
          height: s.s,
          animationDuration: s.dur,
          animationDelay: s.delay,
        }}
      />
    ))}

    {/* ── Seaweed — left cluster ── */}
    <div className="seaweed-group seaweed-group-left">
      {SEAWEED_LEFT.map((sw, i) => (
        <Seaweed
          key={i}
          height={sw.height}
          opacity={sw.opacity}
          delay={sw.delay}
          duration={sw.duration}
        />
      ))}
    </div>

    {/* ── Seaweed — right cluster (mirrored via CSS scaleX(-1)) ── */}
    <div className="seaweed-group seaweed-group-right">
      {SEAWEED_RIGHT.map((sw, i) => (
        <Seaweed
          key={i}
          height={sw.height}
          opacity={sw.opacity}
          delay={sw.delay}
          duration={sw.duration}
        />
      ))}
    </div>

    {/* ── Ocean floor gradient ── */}
    <div className="ocean-floor" />
  </>
);

export default AquaticScene;
