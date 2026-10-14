/**
 * Decorative Finnish lake scene behind the home hero: night sky, treeline,
 * a cabin and a reflected midnight sun. Pure inline SVG, no image asset, so it
 * scales and works offline.
 */
export function HeroArt() {
  return (
    <svg
      className="hero__art"
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2d4d" />
          <stop offset="60%" stopColor="#132340" />
          <stop offset="100%" stopColor="#0d1a31" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#13243f" />
          <stop offset="100%" stopColor="#0a1427" />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor="#ffc355" stopOpacity="0.38" />
          <stop offset="55%" stopColor="#f6a623" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#f6a623" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="220" fill="url(#sky)" />

      {/* stars */}
      <g fill="#cfe0ff" opacity="0.5">
        <circle cx="38" cy="26" r="1" />
        <circle cx="96" cy="48" r="0.8" />
        <circle cx="150" cy="22" r="0.9" />
        <circle cx="214" cy="40" r="0.7" />
        <circle cx="292" cy="24" r="1" />
        <circle cx="348" cy="56" r="0.8" />
        <circle cx="62" cy="72" r="0.7" />
        <circle cx="258" cy="66" r="0.8" />
      </g>

      {/* sun glow + disc */}
      <circle cx="305" cy="100" r="72" fill="url(#sunGlow)" />
      <circle cx="305" cy="100" r="26" fill="#f6a623" opacity="0.92" />

      {/* far treeline */}
      <path
        d="M0 118 l14-20 10 14 12-22 11 18 13-24 12 20 14-16 11 18 13-22 12 18 14-14 12 20 13-18 12 16 14-20 11 18 13-14 12 18 14-16 12 18 13-12 12 16 14-18 11 16 13-12 12 16 14-14 12 16V140H0z"
        fill="#0c1b33"
      />

      {/* near treeline */}
      <path
        d="M0 132 l16-22 13 16 15-20 12 18 16-16 13 20 15-18 12 16 16-20 13 18 15-14 12 18 16-16 13 16 15-18 12 16 16-14 13 18 15-16 12 16 16-18 13 16 15-14V152H0z"
        fill="#09162a"
      />

      {/* cabin */}
      <g transform="translate(300 118)">
        <path d="M0 10 L13 0 L26 10 V26 H0 Z" fill="#111f36" />
        <path d="M-2 10 L13 -1 L28 10 Z" fill="#1a2b47" />
        <rect x="9" y="15" width="8" height="7" fill="#f6a623" opacity="0.9" />
      </g>

      {/* water */}
      <rect y="150" width="400" height="70" fill="url(#water)" />

      {/* sun reflection */}
      <g fill="#f6a623" opacity="0.4">
        <rect x="292" y="156" width="26" height="2.5" rx="1.2" />
        <rect x="288" y="163" width="34" height="2" rx="1" />
        <rect x="295" y="170" width="20" height="2" rx="1" />
        <rect x="290" y="178" width="30" height="1.8" rx="0.9" />
        <rect x="298" y="186" width="15" height="1.6" rx="0.8" />
      </g>

      {/* ripples */}
      <g stroke="#2a4066" strokeWidth="1" opacity="0.35" fill="none">
        <path d="M20 162h46M96 170h38M40 184h58M150 178h44M210 192h52" />
      </g>
    </svg>
  );
}
