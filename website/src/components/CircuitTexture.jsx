import React from 'react';

/**
 * PCB-style circuit board texture overlay.
 * Uses an SVG pattern tile — no external images needed.
 * Place as absolute inset inside a relative container.
 */
const CircuitTexture = ({ opacity = 1, className = '' }) => (
  <svg
    className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    style={{ opacity }}
  >
    <defs>
      {/* 96×96 tile — nodes every 32px, PCB traces between them */}
      <pattern id="pcb-tile" width="96" height="96" patternUnits="userSpaceOnUse">

        {/* ── Grid node squares ─────────────────────────────────────────────
            Centered at every 32px intersection. 4×4px rounded rects.
            Edge nodes are half-visible and tile correctly.
        ──────────────────────────────────────────────────────────────── */}
        {/* Row y=0 */}
        <rect x="-2" y="-2" width="4" height="4" rx="1" fill="rgba(77,124,138,0.30)"/>
        <rect x="30"  y="-2" width="4" height="4" rx="1" fill="rgba(77,124,138,0.30)"/>
        <rect x="62"  y="-2" width="4" height="4" rx="1" fill="rgba(77,124,138,0.30)"/>
        {/* Row y=32 */}
        <rect x="-2" y="30" width="4" height="4" rx="1" fill="rgba(77,124,138,0.30)"/>
        <rect x="30"  y="30" width="4" height="4" rx="1" fill="rgba(77,124,138,0.30)"/>
        <rect x="62"  y="30" width="4" height="4" rx="1" fill="rgba(77,124,138,0.30)"/>
        {/* Row y=64 */}
        <rect x="-2" y="62" width="4" height="4" rx="1" fill="rgba(77,124,138,0.30)"/>
        <rect x="30"  y="62" width="4" height="4" rx="1" fill="rgba(77,124,138,0.30)"/>
        <rect x="62"  y="62" width="4" height="4" rx="1" fill="rgba(77,124,138,0.30)"/>

        {/* ── PCB Routing Traces ────────────────────────────────────────────
            Thin 1px lines with right-angle routing between nodes.
            Designed to tile: traces that exit an edge re-enter the opposite edge.
        ──────────────────────────────────────────────────────────────── */}

        {/* Route A: (32,0) → down 14 → left 18 → down to (0,32) */}
        <path d="M32,2 L32,14 L14,14 L14,30"
          stroke="rgba(77,124,138,0.18)" strokeWidth="1" fill="none"/>

        {/* Route B: (64,0) → down 8 → right to edge (continues as left entry) */}
        <path d="M64,2 L64,10 L80,10"
          stroke="rgba(77,124,138,0.14)" strokeWidth="1" fill="none"/>
        {/* Route B cont: enters from left edge at y=10 → right to (0,32) node area */}
        <path d="M0,10 L14,10 L14,30"
          stroke="rgba(77,124,138,0.14)" strokeWidth="1" fill="none"/>

        {/* Route C: (0,32) → right to center gap → up 10 → right → (32,32) */}
        <path d="M2,32 L18,32 L18,22 L30,22"
          stroke="rgba(77,124,138,0.16)" strokeWidth="1" fill="none"/>

        {/* Route D: (64,32) → right to edge (continues as left entry at y=32) */}
        <path d="M66,32 L96,32"
          stroke="rgba(77,124,138,0.18)" strokeWidth="1" fill="none"/>
        <path d="M0,32 L-2,32"
          stroke="rgba(77,124,138,0.18)" strokeWidth="1" fill="none"/>

        {/* Route E: (32,32) → down 16 → right 24 → down to (64,64) */}
        <path d="M32,34 L32,50 L56,50 L56,62"
          stroke="rgba(77,124,138,0.16)" strokeWidth="1" fill="none"/>

        {/* Route F: (0,64) → right 12 → up 12 → right to (32,64) */}
        <path d="M2,64 L12,64 L12,52 L30,52"
          stroke="rgba(77,124,138,0.14)" strokeWidth="1" fill="none"/>

        {/* Route G: (32,64) → down to bottom edge (continues from top) */}
        <path d="M32,66 L32,80 L44,80 L44,96"
          stroke="rgba(77,124,138,0.15)" strokeWidth="1" fill="none"/>
        {/* Route G cont: enters from top */}
        <path d="M44,0 L44,10"
          stroke="rgba(77,124,138,0.15)" strokeWidth="1" fill="none"/>

        {/* Route H: (64,64) → right to edge */}
        <path d="M66,64 L80,64 L80,50 L96,50"
          stroke="rgba(77,124,138,0.13)" strokeWidth="1" fill="none"/>
        {/* Route H cont: enters from left */}
        <path d="M0,50 L14,50 L14,62"
          stroke="rgba(77,124,138,0.13)" strokeWidth="1" fill="none"/>

        {/* Route I: short stub from (64,32) going up */}
        <path d="M64,28 L64,16 L78,16 L78,2"
          stroke="rgba(77,124,138,0.11)" strokeWidth="1" fill="none"/>
        {/* Route I cont: enters from bottom */}
        <path d="M78,96 L78,82 L96,82"
          stroke="rgba(77,124,138,0.11)" strokeWidth="1" fill="none"/>
        <path d="M0,82 L14,82 L14,66"
          stroke="rgba(77,124,138,0.11)" strokeWidth="1" fill="none"/>

        {/* Route J: diagonal-ish hop — (0,0) area to (32,32) via different path */}
        <path d="M0,20 L22,20 L22,30"
          stroke="rgba(77,124,138,0.09)" strokeWidth="1" fill="none"/>

        {/* Subtle via pads (small circles at trace junctions) */}
        <circle cx="32" cy="14" r="2" fill="rgba(77,124,138,0.20)"/>
        <circle cx="64" cy="10" r="2" fill="rgba(77,124,138,0.16)"/>
        <circle cx="32" cy="50" r="2" fill="rgba(77,124,138,0.18)"/>
        <circle cx="56" cy="50" r="2" fill="rgba(77,124,138,0.16)"/>
        <circle cx="44" cy="10" r="1.5" fill="rgba(77,124,138,0.14)"/>
        <circle cx="78" cy="16" r="1.5" fill="rgba(77,124,138,0.14)"/>

      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pcb-tile)"/>
  </svg>
);

export default CircuitTexture;
