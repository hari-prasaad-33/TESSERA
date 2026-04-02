const tesseractFrames = [
  { x: 214, y: 126, size: 168, rotate: -14, opacity: 0.85 },
  { x: 250, y: 108, size: 132, rotate: 10, opacity: 0.72 },
  { x: 284, y: 92, size: 102, rotate: -20, opacity: 0.66 },
  { x: 320, y: 120, size: 126, rotate: 18, opacity: 0.58 },
  { x: 350, y: 148, size: 92, rotate: -8, opacity: 0.52 },
  { x: 382, y: 166, size: 74, rotate: 12, opacity: 0.48 },
];

const strayFrames = [
  { x: 96, y: 144, size: 28, rotate: -18, opacity: 0.28 },
  { x: 128, y: 208, size: 18, rotate: 14, opacity: 0.24 },
  { x: 178, y: 70, size: 22, rotate: -8, opacity: 0.22 },
  { x: 436, y: 84, size: 26, rotate: 12, opacity: 0.24 },
  { x: 470, y: 150, size: 18, rotate: -26, opacity: 0.2 },
  { x: 472, y: 246, size: 24, rotate: 18, opacity: 0.22 },
  { x: 522, y: 212, size: 16, rotate: 8, opacity: 0.18 },
];

const connectionLines = [
  [214, 126, 320, 120],
  [250, 108, 350, 148],
  [284, 92, 382, 166],
  [214, 126, 382, 166],
  [250, 108, 350, 148],
  [178, 70, 320, 120],
  [470, 150, 350, 148],
  [128, 208, 214, 126],
  [472, 246, 382, 166],
];

const emberThreads = [
  'M 112 198 C 174 120 250 104 308 150 C 360 192 432 180 504 136',
  'M 126 226 C 190 150 266 122 326 160 C 382 194 446 206 524 170',
  'M 130 170 C 202 118 258 108 318 126 C 384 146 442 126 506 92',
  'M 148 250 C 220 210 280 190 344 198 C 418 208 470 188 534 152',
];

const orbitRows = [
  { y: 74, dots: [64, 110, 164, 236, 314, 388, 452, 534] },
  { y: 128, dots: [44, 96, 156, 220, 294, 366, 428, 494, 558] },
  { y: 188, dots: [70, 132, 200, 264, 338, 404, 468, 520] },
  { y: 246, dots: [50, 118, 176, 246, 306, 376, 446, 512, 566] },
  { y: 302, dots: [82, 150, 214, 286, 352, 430, 488, 548] },
];

function Frame({ x, y, size, rotate, opacity }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      <rect
        x={-size / 2}
        y={-size / 2}
        width={size}
        height={size}
        fill="none"
        stroke="url(#tesseract-stroke)"
        strokeWidth="3"
      />
      <rect
        x={-size / 2 + 10}
        y={-size / 2 + 10}
        width={Math.max(size - 20, 8)}
        height={Math.max(size - 20, 8)}
        fill="none"
        stroke="rgba(240, 235, 224, 0.12)"
        strokeWidth="1"
      />
    </g>
  );
}

const modularTiles = [
  { x: 36, y: 38, w: 126, h: 92, kind: 'speaker' },
  { x: 170, y: 38, w: 92, h: 92, kind: 'knobs' },
  { x: 270, y: 38, w: 84, h: 92, kind: 'meters' },
  { x: 362, y: 38, w: 102, h: 92, kind: 'switches' },
  { x: 472, y: 38, w: 112, h: 92, kind: 'speaker' },
  { x: 54, y: 138, w: 96, h: 96, kind: 'knobs' },
  { x: 158, y: 138, w: 120, h: 96, kind: 'switches' },
  { x: 286, y: 138, w: 94, h: 96, kind: 'screen' },
  { x: 388, y: 138, w: 92, h: 96, kind: 'knobs' },
  { x: 488, y: 138, w: 96, h: 96, kind: 'buttons' },
  { x: 72, y: 242, w: 106, h: 92, kind: 'faders' },
  { x: 186, y: 242, w: 92, h: 92, kind: 'screen' },
  { x: 286, y: 242, w: 124, h: 92, kind: 'knobs' },
  { x: 418, y: 242, w: 72, h: 92, kind: 'switches' },
  { x: 498, y: 242, w: 92, h: 92, kind: 'speaker' },
];

function TileShell({ x, y, w, h, children }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="5" fill="#D7D0C7" />
      <rect x="1.5" y="1.5" width={w - 3} height={h - 3} rx="4" fill="none" stroke="rgba(0,0,0,0.24)" />
      <rect x="4" y="4" width={w - 8} height={h - 8} rx="3" fill="none" stroke="rgba(255,255,255,0.2)" />
      {children}
    </g>
  );
}

function Knob({ cx, cy, r, accent = 'orange' }) {
  const ring = accent === 'teal' ? '#3AB8D4' : '#D86B3A';
  const glow = accent === 'teal' ? 'rgba(58,184,212,0.16)' : 'rgba(216,107,58,0.16)';

  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r + 5} fill={glow} />
      <circle r={r} fill="#252D34" stroke="#0E1419" strokeWidth="5" />
      <circle r={r - 8} fill="none" stroke={ring} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${Math.max(r * 2.4, 18)} ${Math.max(r * 4.8, 34)}`} strokeDashoffset={Math.max(r * 0.4, 6)} />
      <path d={`M 0 ${-r + 9} L 0 ${-r + 22}`} stroke="#D7D0C7" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

export function ModularGridIllustration({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-[#11161C] ${className}`.trim()}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,184,77,0.18),transparent_20%),radial-gradient(circle_at_82%_22%,rgba(93,212,240,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%)]" />
      <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g transform="translate(0 14) skewX(-14)">
          {modularTiles.map((tile) => (
            <TileShell key={`${tile.x}-${tile.y}`} x={tile.x} y={tile.y} w={tile.w} h={tile.h}>
              {tile.kind === 'speaker' && (
                <>
                  <Knob cx={tile.w * 0.5} cy={tile.h * 0.52} r={Math.min(tile.w, tile.h) * 0.24} accent="teal" />
                  <circle cx={tile.w * 0.5} cy={tile.h * 0.52} r={Math.min(tile.w, tile.h) * 0.11} fill="rgba(215,208,199,0.22)" />
                </>
              )}
              {tile.kind === 'knobs' && (
                <>
                  <Knob cx={tile.w * 0.34} cy={tile.h * 0.38} r={16} accent="orange" />
                  <Knob cx={tile.w * 0.7} cy={tile.h * 0.66} r={16} accent="teal" />
                </>
              )}
              {tile.kind === 'meters' && (
                <>
                  <rect x="14" y="18" width={tile.w - 28} height="18" rx="2" fill="#303842" stroke="rgba(0,0,0,0.35)" />
                  <rect x="18" y="22" width={tile.w - 36} height="10" rx="1.5" fill="rgba(107,201,211,0.28)" />
                  <rect x="18" y="52" width={tile.w - 36} height="10" rx="1.5" fill="rgba(109,216,233,0.14)" />
                </>
              )}
              {tile.kind === 'switches' && (
                <>
                  <rect x="18" y="20" width="18" height="32" rx="2" fill="#A7533A" />
                  <rect x="42" y="20" width="18" height="32" rx="2" fill="#D3A24A" />
                  <rect x="66" y="20" width="18" height="32" rx="2" fill="#A7533A" />
                  <circle cx={tile.w - 18} cy={tile.h - 18} r="4" fill="#F0B7A1" />
                </>
              )}
              {tile.kind === 'screen' && (
                <>
                  <rect x="14" y="14" width={tile.w - 28} height={tile.h - 28} rx="3" fill="#39454F" stroke="rgba(255,255,255,0.14)" />
                  {Array.from({ length: 7 }, (_, row) =>
                    Array.from({ length: 7 }, (_, col) => (
                      <rect
                        key={`${row}-${col}`}
                        x={24 + col * 8}
                        y={24 + row * 8}
                        width="5"
                        height="5"
                        rx="1"
                        fill={(row + col) % 3 === 0 ? 'rgba(255,190,220,0.85)' : 'rgba(255,190,220,0.25)'}
                      />
                    )),
                  )}
                </>
              )}
              {tile.kind === 'buttons' && (
                <>
                  {Array.from({ length: 6 }, (_, index) => (
                    <rect
                      key={index}
                      x={16 + (index % 2) * 34}
                      y={16 + Math.floor(index / 2) * 24}
                      width="22"
                      height="14"
                      rx="2"
                      fill={index === 1 ? '#D86B3A' : '#2A313A'}
                    />
                  ))}
                </>
              )}
              {tile.kind === 'faders' && (
                <>
                  {Array.from({ length: 5 }, (_, index) => (
                    <g key={index} transform={`translate(${18 + index * 18} 16)`}>
                      <line x1="0" x2="0" y1="0" y2={tile.h - 34} stroke="rgba(0,0,0,0.36)" strokeWidth="2" />
                      <rect x="-5" y={18 + (index % 3) * 14} width="10" height="16" rx="2" fill="#2B333C" stroke="rgba(255,255,255,0.1)" />
                    </g>
                  ))}
                </>
              )}
            </TileShell>
          ))}
        </g>
      </svg>
    </div>
  );
}

export function TesseractIllustration({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-[#03050a] ${className}`.trim()}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_52%_50%,rgba(255,184,77,0.12),transparent_28%),radial-gradient(circle_at_34%_38%,rgba(93,212,240,0.06),transparent_26%)]" />
      <svg viewBox="0 0 600 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="tesseract-stroke" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(240,235,224,0.68)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.82)" />
            <stop offset="100%" stopColor="rgba(93,212,240,0.58)" />
          </linearGradient>
        </defs>

        {Array.from({ length: 28 }, (_, index) => (
          <circle
            key={index}
            cx={24 + (index * 31) % 560}
            cy={30 + (index * 47) % 360}
            r={index % 6 === 0 ? 1.6 : 0.8}
            fill={index % 5 === 0 ? 'rgba(255,184,77,0.45)' : 'rgba(255,255,255,0.28)'}
          />
        ))}

        {connectionLines.map(([x1, y1, x2, y2], index) => (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={index % 2 === 0 ? 'rgba(240,235,224,0.22)' : 'rgba(93,212,240,0.16)'}
            strokeWidth="1.4"
          />
        ))}

        {tesseractFrames.map((frame) => (
          <Frame key={`${frame.x}-${frame.y}`} {...frame} />
        ))}

        {strayFrames.map((frame) => (
          <Frame key={`${frame.x}-${frame.y}`} {...frame} />
        ))}

        <g opacity="0.42">
          <path d="M 244 248 C 286 212 324 184 358 170" fill="none" stroke="rgba(255,184,77,0.38)" strokeWidth="1.6" />
          <path d="M 222 206 C 268 176 314 156 374 150" fill="none" stroke="rgba(93,212,240,0.28)" strokeWidth="1.4" />
          <path d="M 266 286 C 312 244 350 228 404 220" fill="none" stroke="rgba(240,235,224,0.18)" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

export function EmberNebulaIllustration({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`.trim()}>
      <div className="absolute inset-[-18%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,208,128,0.94),rgba(255,142,63,0.72)_13%,rgba(255,106,51,0.46)_24%,rgba(118,24,7,0.22)_40%,transparent_64%)] blur-3xl opacity-90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(255,184,77,0.2),transparent_24%),radial-gradient(circle_at_58%_44%,rgba(255,106,51,0.18),transparent_22%)]" />
      <svg viewBox="0 0 620 360" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 34 }, (_, index) => (
          <circle
            key={index}
            cx={18 + (index * 29) % 584}
            cy={20 + (index * 53) % 318}
            r={index % 7 === 0 ? 1.4 : 0.7}
            fill={index % 5 === 0 ? 'rgba(255,232,196,0.8)' : 'rgba(255,255,255,0.38)'}
          />
        ))}
        {emberThreads.map((thread, index) => (
          <path
            key={thread}
            d={thread}
            fill="none"
            stroke={index % 2 === 0 ? 'rgba(255,132,58,0.24)' : 'rgba(255,214,170,0.18)'}
            strokeWidth={index === 1 ? '3.8' : '2.4'}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

export function OrbFieldIllustration({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-[#05070c] ${className}`.trim()}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,184,77,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_40%)]" />
      <svg viewBox="0 0 620 360" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {orbitRows.flatMap((row, rowIndex) =>
          row.dots.map((x, dotIndex) => {
            const radius = 8 + ((rowIndex * 5 + dotIndex) % 5) * 6;
            const glow = dotIndex % 4 === 0;
            const fill = glow ? 'rgba(255,196,95,0.92)' : dotIndex % 3 === 0 ? 'rgba(255,121,66,0.6)' : 'rgba(165,122,58,0.68)';

            return (
              <g key={`${rowIndex}-${x}`} opacity={0.96}>
                <line x1={x} y1={row.y + radius} x2={x} y2={row.y + radius + 56 + rowIndex * 12} stroke={glow ? 'rgba(255,196,95,0.42)' : 'rgba(104,71,30,0.55)'} strokeWidth={Math.max(radius / 5, 2)} strokeLinecap="round" />
                <circle cx={x} cy={row.y} r={radius + (glow ? 6 : 0)} fill={glow ? 'rgba(255,196,95,0.12)' : 'transparent'} />
                <circle cx={x} cy={row.y} r={radius} fill={fill} />
              </g>
            );
          }),
        )}
      </svg>
    </div>
  );
}
