const emberThreads = [
  'M 96 218 C 156 156 220 130 286 148 C 340 164 392 208 450 198 C 506 188 548 134 592 106',
  'M 104 246 C 164 180 226 158 292 176 C 350 192 402 236 468 226 C 532 216 578 176 618 142',
  'M 116 192 C 182 138 244 120 302 130 C 370 142 418 170 484 160 C 536 152 582 116 626 88',
  'M 128 280 C 198 244 260 222 328 224 C 398 226 458 212 520 180 C 570 154 612 126 648 94',
  'M 142 162 C 214 116 282 98 344 110 C 412 124 462 160 530 158 C 582 156 624 130 660 96',
];

const orbitRows = [
  { y: 72, dots: [60, 112, 168, 232, 316, 392, 468, 538] },
  { y: 128, dots: [44, 94, 154, 220, 298, 374, 442, 512, 578] },
  { y: 192, dots: [72, 138, 206, 276, 348, 416, 486, 552] },
  { y: 254, dots: [52, 120, 188, 258, 324, 394, 460, 532, 594] },
  { y: 316, dots: [84, 150, 220, 286, 354, 430, 500, 566] },
];

const tesseractCluster = [
  { x: 338, y: 188, size: 164, rotate: -16, opacity: 0.94 },
  { x: 334, y: 194, size: 126, rotate: 12, opacity: 0.8 },
  { x: 328, y: 186, size: 92, rotate: -28, opacity: 0.72 },
  { x: 352, y: 206, size: 132, rotate: 26, opacity: 0.58 },
  { x: 308, y: 168, size: 66, rotate: 8, opacity: 0.54 },
  { x: 384, y: 202, size: 74, rotate: -14, opacity: 0.48 },
  { x: 262, y: 198, size: 52, rotate: -32, opacity: 0.4 },
  { x: 428, y: 158, size: 48, rotate: 18, opacity: 0.34 },
];

const tesseractScatter = [
  { x: 162, y: 146, size: 28, rotate: -16, opacity: 0.32 },
  { x: 192, y: 238, size: 20, rotate: 20, opacity: 0.26 },
  { x: 234, y: 102, size: 22, rotate: -8, opacity: 0.2 },
  { x: 470, y: 114, size: 24, rotate: 10, opacity: 0.26 },
  { x: 514, y: 198, size: 18, rotate: -24, opacity: 0.22 },
  { x: 486, y: 274, size: 22, rotate: 12, opacity: 0.22 },
  { x: 552, y: 156, size: 14, rotate: 10, opacity: 0.18 },
];

const tesseractLinks = [
  [262, 198, 338, 188],
  [308, 168, 334, 194],
  [352, 206, 428, 158],
  [162, 146, 262, 198],
  [470, 114, 384, 202],
  [486, 274, 352, 206],
  [192, 238, 328, 186],
];

const modularTiles = [
  { x: 26, y: 30, w: 128, h: 96, kind: 'speaker' },
  { x: 160, y: 30, w: 84, h: 96, kind: 'knobs' },
  { x: 250, y: 30, w: 86, h: 96, kind: 'meters' },
  { x: 342, y: 30, w: 96, h: 96, kind: 'switches' },
  { x: 444, y: 30, w: 132, h: 96, kind: 'speaker' },
  { x: 44, y: 132, w: 96, h: 94, kind: 'knobs' },
  { x: 146, y: 132, w: 122, h: 94, kind: 'switches' },
  { x: 274, y: 132, w: 98, h: 94, kind: 'screen' },
  { x: 378, y: 132, w: 92, h: 94, kind: 'knobs' },
  { x: 476, y: 132, w: 104, h: 94, kind: 'buttons' },
  { x: 64, y: 232, w: 110, h: 92, kind: 'faders' },
  { x: 180, y: 232, w: 96, h: 92, kind: 'screen' },
  { x: 282, y: 232, w: 126, h: 92, kind: 'knobs' },
  { x: 414, y: 232, w: 72, h: 92, kind: 'switches' },
  { x: 492, y: 232, w: 98, h: 92, kind: 'speaker' },
];

function WireFrame({ x, y, size, rotate, opacity }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`} opacity={opacity}>
      <rect x={-size / 2} y={-size / 2} width={size} height={size} fill="none" stroke="url(#tesseract-stroke)" strokeWidth="3" />
      <rect x={-size / 2 + 10} y={-size / 2 + 10} width={Math.max(size - 20, 8)} height={Math.max(size - 20, 8)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </g>
  );
}

function Tile({ x, y, w, h, children }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="5" fill="#DAD4CD" />
      <rect x="1.5" y="1.5" width={w - 3} height={h - 3} rx="4" fill="none" stroke="rgba(0,0,0,0.25)" />
      <rect x="5" y="5" width={w - 10} height={h - 10} rx="3" fill="none" stroke="rgba(255,255,255,0.2)" />
      {children}
    </g>
  );
}

function Knob({ cx, cy, r, accent = 'orange' }) {
  const ring = accent === 'teal' ? '#45BED7' : '#D96A39';
  const glow = accent === 'teal' ? 'rgba(69,190,215,0.18)' : 'rgba(217,106,57,0.18)';

  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r={r + 5} fill={glow} />
      <circle r={r} fill="#273038" stroke="#11161B" strokeWidth="5" />
      <circle r={r - 7} fill="none" stroke={ring} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${Math.max(r * 2.6, 18)} ${Math.max(r * 5.4, 34)}`} strokeDashoffset={Math.max(r * 0.42, 6)} />
      <path d={`M 0 ${-r + 10} L 0 ${-r + 22}`} stroke="#EEE6DB" strokeWidth="2.4" strokeLinecap="round" />
      <circle r={r * 0.22} fill="rgba(255,255,255,0.08)" />
    </g>
  );
}

export function ModularGridIllustration({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-[#161B20] ${className}`.trim()}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,190,118,0.18),transparent_18%),radial-gradient(circle_at_82%_14%,rgba(93,212,240,0.12),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%)]" />
      <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <g transform="translate(0 10) skewX(-16)">
          {modularTiles.map((tile) => (
            <Tile key={`${tile.x}-${tile.y}`} x={tile.x} y={tile.y} w={tile.w} h={tile.h}>
              {tile.kind === 'speaker' && (
                <>
                  <Knob cx={tile.w * 0.5} cy={tile.h * 0.52} r={Math.min(tile.w, tile.h) * 0.24} accent="teal" />
                  <circle cx={tile.w * 0.5} cy={tile.h * 0.52} r={Math.min(tile.w, tile.h) * 0.11} fill="rgba(238,230,219,0.25)" />
                </>
              )}
              {tile.kind === 'knobs' && (
                <>
                  <Knob cx={tile.w * 0.32} cy={tile.h * 0.36} r="15" accent="orange" />
                  <Knob cx={tile.w * 0.72} cy={tile.h * 0.64} r="15" accent="teal" />
                  <circle cx={18} cy={18} r="2" fill="#EAA38D" />
                </>
              )}
              {tile.kind === 'meters' && (
                <>
                  <rect x="12" y="16" width={tile.w - 24} height="18" rx="2" fill="#37414A" stroke="rgba(0,0,0,0.35)" />
                  <rect x="18" y="22" width={tile.w - 40} height="8" rx="1.5" fill="rgba(125,227,243,0.26)" />
                  <rect x="18" y="52" width={tile.w - 38} height="8" rx="1.5" fill="rgba(125,227,243,0.16)" />
                </>
              )}
              {tile.kind === 'switches' && (
                <>
                  <rect x="16" y="18" width="18" height="30" rx="2" fill="#A5573C" />
                  <rect x="40" y="18" width="18" height="30" rx="2" fill="#D1A14A" />
                  <rect x="64" y="18" width="18" height="30" rx="2" fill="#A5573C" />
                  <circle cx={tile.w - 18} cy={tile.h - 18} r="4" fill="#F0B7A1" />
                </>
              )}
              {tile.kind === 'screen' && (
                <>
                  <rect x="14" y="14" width={tile.w - 28} height={tile.h - 28} rx="3" fill="#444F58" stroke="rgba(255,255,255,0.14)" />
                  {Array.from({ length: 8 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => (
                      <rect
                        key={`${row}-${col}`}
                        x={22 + col * 7}
                        y={22 + row * 7}
                        width="4.4"
                        height="4.4"
                        rx="1"
                        fill={(row + col) % 3 === 0 ? 'rgba(255,188,222,0.9)' : 'rgba(255,188,222,0.24)'}
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
                      y={16 + Math.floor(index / 2) * 22}
                      width="22"
                      height="13"
                      rx="2"
                      fill={index === 1 || index === 4 ? '#D96A39' : '#2A313A'}
                    />
                  ))}
                </>
              )}
              {tile.kind === 'faders' && (
                <>
                  {Array.from({ length: 5 }, (_, index) => (
                    <g key={index} transform={`translate(${18 + index * 18} 14)`}>
                      <line x1="0" x2="0" y1="0" y2={tile.h - 30} stroke="rgba(0,0,0,0.4)" strokeWidth="2" />
                      <rect x="-5" y={18 + (index % 3) * 14} width="10" height="15" rx="2" fill="#2B333C" stroke="rgba(255,255,255,0.1)" />
                    </g>
                  ))}
                </>
              )}
            </Tile>
          ))}
        </g>
      </svg>
    </div>
  );
}

export function TesseractIllustration({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`.trim()}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_16%),radial-gradient(circle_at_54%_52%,rgba(255,184,77,0.12),transparent_24%)]" />
      <svg viewBox="0 0 640 400" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="tesseract-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(240,235,224,0.72)" />
            <stop offset="100%" stopColor="rgba(160,168,176,0.4)" />
          </linearGradient>
        </defs>

        {Array.from({ length: 22 }, (_, index) => (
          <circle
            key={index}
            cx={28 + (index * 33) % 590}
            cy={26 + (index * 47) % 348}
            r={index % 5 === 0 ? 1.4 : 0.7}
            fill={index % 4 === 0 ? 'rgba(255,255,255,0.26)' : 'rgba(200,200,200,0.16)'}
          />
        ))}

        <g opacity="0.2">
          <ellipse cx="330" cy="206" rx="112" ry="78" fill="rgba(160,160,160,0.22)" />
          <ellipse cx="330" cy="206" rx="70" ry="48" fill="rgba(40,40,40,0.34)" />
        </g>

        {tesseractLinks.map(([x1, y1, x2, y2], index) => (
          <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={index % 2 === 0 ? 'rgba(255,255,255,0.16)' : 'rgba(150,150,150,0.12)'} strokeWidth="1.3" />
        ))}

        {tesseractCluster.map((frame) => (
          <WireFrame key={`${frame.x}-${frame.y}-${frame.size}`} {...frame} />
        ))}
        {tesseractScatter.map((frame) => (
          <WireFrame key={`${frame.x}-${frame.y}-${frame.size}`} {...frame} />
        ))}
      </svg>
    </div>
  );
}

export function EmberNebulaIllustration({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-black ${className}`.trim()}>
      <div className="absolute inset-[-18%] bg-[radial-gradient(circle_at_52%_48%,rgba(255,233,185,0.98),rgba(255,187,91,0.88)_8%,rgba(255,114,44,0.78)_16%,rgba(139,29,6,0.38)_30%,transparent_58%)] blur-3xl opacity-95" />
      <div className="absolute inset-[-8%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,184,77,0.24),transparent_18%),radial-gradient(circle_at_54%_46%,rgba(255,106,51,0.18),transparent_18%)]" />
      <svg viewBox="0 0 720 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 26 }, (_, index) => (
          <circle
            key={index}
            cx={20 + (index * 37) % 676}
            cy={18 + (index * 61) % 384}
            r={index % 6 === 0 ? 1.2 : 0.55}
            fill={index % 5 === 0 ? 'rgba(255,236,210,0.82)' : 'rgba(255,255,255,0.32)'}
          />
        ))}
        {emberThreads.map((thread, index) => (
          <path
            key={thread}
            d={thread}
            fill="none"
            stroke={index % 2 === 0 ? 'rgba(255,114,44,0.34)' : 'rgba(255,212,172,0.2)'}
            strokeWidth={index === 0 ? '6.2' : index === 2 ? '4.6' : '3.4'}
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,184,77,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_40%)]" />
      <svg viewBox="0 0 640 380" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        {orbitRows.flatMap((row, rowIndex) =>
          row.dots.map((x, dotIndex) => {
            const radius = 8 + ((rowIndex * 5 + dotIndex) % 5) * 6;
            const glow = dotIndex % 4 === 0;
            const fill = glow ? 'rgba(255,196,95,0.94)' : dotIndex % 3 === 0 ? 'rgba(255,121,66,0.64)' : 'rgba(165,122,58,0.68)';

            return (
              <g key={`${rowIndex}-${x}`} opacity="0.96">
                <line x1={x} y1={row.y + radius} x2={x} y2={row.y + radius + 56 + rowIndex * 12} stroke={glow ? 'rgba(255,196,95,0.42)' : 'rgba(104,71,30,0.55)'} strokeWidth={Math.max(radius / 5, 2)} strokeLinecap="round" />
                <circle cx={x} cy={row.y} r={radius + (glow ? 7 : 0)} fill={glow ? 'rgba(255,196,95,0.12)' : 'transparent'} />
                <circle cx={x} cy={row.y} r={radius} fill={fill} />
              </g>
            );
          }),
        )}
      </svg>
    </div>
  );
}
