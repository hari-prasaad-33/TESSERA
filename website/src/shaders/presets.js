export const shaderPresets = {
  hero: `
float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = mat2(1.6, -1.2, 1.2, 1.6) * p;
    amp *= 0.52;
  }
  return value;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime * 0.12;

  vec2 flowUv = uv * 2.2;
  float primary = fbm(flowUv + vec2(t * 0.9, -t * 0.35));
  float swirl = fbm(flowUv * 1.7 + vec2(-t * 0.28, t * 0.46) + primary * 1.4);
  float halo = exp(-3.8 * abs(length(uv - vec2(0.26, -0.08)) - 0.44 - 0.05 * sin(t * 2.0 + uv.x * 5.0)));
  float plume = smoothstep(0.2, 1.2, primary + swirl * 0.7 - length(uv) * 0.5);

  vec3 base = vec3(0.01, 0.02, 0.08);
  vec3 cyan = vec3(0.37, 0.83, 0.94);
  vec3 amber = vec3(1.0, 0.72, 0.30);
  vec3 cream = vec3(0.94, 0.92, 0.88);

  vec3 color = base;
  color += cyan * pow(max(swirl, 0.0), 2.1) * 0.58;
  color += amber * pow(max(primary * 0.85 + halo, 0.0), 2.9) * 0.34;
  color = mix(color, cream, halo * 0.08 + plume * 0.03);

  vec2 starGrid = floor((uv + 1.3) * vec2(180.0, 110.0));
  float star = pow(hash21(starGrid), 34.0);
  color += vec3(star) * (0.25 + 0.75 * sin(t * 3.0 + starGrid.x * 0.13 + starGrid.y * 0.19));

  float vignette = smoothstep(1.4, 0.25, length(uv * vec2(0.95, 1.2)));
  color *= vignette;

  fragColor = vec4(color, 1.0);
}
`,

  rain: `
float hash12(vec2 p) {
  return fract(sin(dot(p, vec2(91.31, 17.17))) * 14891.847);
}

float streakLayer(vec2 uv, float t, float scale) {
  vec2 p = uv * scale;
  vec2 id = floor(p);
  vec2 gv = fract(p) - 0.5;

  float n = hash12(id);
  float shift = n - 0.5;
  gv.x += shift * 0.55;
  gv.y += fract(t * (0.15 + n * 0.22) + n * 4.7) - 0.5;

  float drop = smoothstep(0.16, 0.0, length(vec2(gv.x * 1.8, gv.y)));
  float trail = smoothstep(0.04, 0.0, abs(gv.x)) * smoothstep(0.62, -0.18, gv.y) * 0.35;
  return drop + trail;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec2 centered = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime;

  float layerA = streakLayer(uv + vec2(0.0, t * 0.12), t, 8.0);
  float layerB = streakLayer(uv * 1.25 + vec2(0.2, t * 0.18), t * 1.2, 13.0) * 0.7;
  float layerC = streakLayer(uv * 1.6 + vec2(-0.12, t * 0.08), t * 0.8, 19.0) * 0.45;
  float drops = layerA + layerB + layerC;

  vec2 warp = centered;
  warp.x += drops * 0.07;
  warp.y += sin(warp.x * 6.0 + t * 0.5) * 0.02;

  float mist = smoothstep(0.9, 0.1, length(warp)) * 0.5;
  float horizon = smoothstep(-0.25, 0.4, warp.y + sin(warp.x * 2.4 + t * 0.2) * 0.08);

  vec3 base = mix(vec3(0.015, 0.02, 0.06), vec3(0.03, 0.10, 0.14), horizon);
  vec3 cyan = vec3(0.37, 0.83, 0.94);
  vec3 amber = vec3(1.0, 0.72, 0.30);

  vec3 color = base;
  color += cyan * (drops * 0.18 + mist * 0.22);
  color += amber * pow(max(layerA, 0.0), 2.0) * 0.12;
  color += vec3(0.04, 0.05, 0.09) * sin(t * 0.15 + warp.xyx * vec3(4.0, 0.0, 2.0));

  fragColor = vec4(color, 1.0);
}
`,

  pulse: `
float hash13(vec3 p) {
  return fract(sin(dot(p, vec3(17.1, 311.7, 59.2))) * 43758.5453);
}

float lineField(vec2 uv, float t, float offset) {
  float wave = sin(uv.x * 8.0 + offset + t * 0.6) * 0.18;
  return smoothstep(0.03, 0.0, abs(uv.y + wave));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime;

  float signal = 0.0;
  signal += lineField(uv * vec2(1.0, 1.6), t, 0.0);
  signal += lineField((uv + vec2(0.0, 0.18)) * vec2(1.2, 1.8), t * 1.1, 1.8) * 0.9;
  signal += lineField((uv - vec2(0.0, 0.18)) * vec2(1.35, 2.1), t * 1.3, 3.4) * 0.7;

  vec2 gridUv = uv * 9.0;
  vec2 gv = abs(fract(gridUv) - 0.5);
  float grid = smoothstep(0.49, 0.46, min(gv.x, gv.y));

  vec2 pulseUv = uv;
  pulseUv.x *= 1.3;
  float ring = exp(-6.0 * abs(length(pulseUv) - 0.38 - 0.04 * sin(t * 1.2)));
  float sweep = smoothstep(-0.1, 0.4, sin(uv.x * 4.0 - t * 1.7 + uv.y * 5.0));

  vec3 base = vec3(0.03, 0.02, 0.08);
  vec3 cyan = vec3(0.37, 0.83, 0.94);
  vec3 amber = vec3(1.0, 0.72, 0.30);

  vec3 color = base;
  color += cyan * signal * 0.32;
  color += amber * ring * 0.26;
  color += mix(cyan, amber, sweep) * grid * 0.07;
  color *= smoothstep(1.35, 0.2, length(uv));

  fragColor = vec4(color, 1.0);
}
`,

  lanterns: `
float hash22(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime * 0.55;

  vec2 warped = uv;
  warped.y += t * 0.1;
  vec2 gridUv = warped * vec2(4.4, 3.2);
  vec2 id = floor(gridUv);
  vec2 gv = fract(gridUv) - 0.5;

  float n = hash22(id);
  gv.x += (n - 0.5) * 0.28;
  gv.y += sin(t + n * 6.2831) * 0.08;

  float body = smoothstep(0.22, 0.05, length(vec2(gv.x * 0.9, gv.y * 1.4)));
  float halo = smoothstep(0.45, 0.0, length(gv));
  float stem = smoothstep(0.025, 0.0, abs(gv.x)) * smoothstep(-0.5, 0.0, gv.y);

  vec2 lineUv = abs(fract((uv + vec2(t * 0.02, 0.0)) * vec2(16.0, 10.0)) - 0.5);
  float lattice = smoothstep(0.49, 0.47, min(lineUv.x, lineUv.y));

  vec3 base = vec3(0.01, 0.06, 0.09);
  vec3 cyan = vec3(0.37, 0.83, 0.94);
  vec3 amber = vec3(1.0, 0.72, 0.30);

  vec3 color = base + cyan * lattice * 0.08;
  color += mix(cyan, amber, n) * body * 0.16;
  color += amber * halo * 0.12;
  color += cyan * stem * 0.12;
  color *= smoothstep(1.45, 0.25, length(uv));

  fragColor = vec4(color, 1.0);
}
`,

  cosmos: `
float hash31(vec3 p) {
  return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123);
}

float hash23(vec2 p) {
  return fract(sin(dot(p, vec2(151.1, 47.7))) * 43758.5453123);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash23(i);
  float b = hash23(i + vec2(1.0, 0.0));
  float c = hash23(i + vec2(0.0, 1.0));
  float d = hash23(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm2(vec2 p) {
  float value = 0.0;
  float amp = 0.55;
  for (int i = 0; i < 5; i++) {
    value += amp * noise2(p);
    p = mat2(1.5, -1.1, 1.1, 1.5) * p;
    amp *= 0.5;
  }
  return value;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime * 0.08;

  float nebula = fbm2(uv * 2.4 + vec2(t * 1.2, -t * 0.8));
  float dust = fbm2(uv * 4.6 - vec2(t * 0.7, t * 0.4));
  float orbit = exp(-5.5 * abs(length(uv - vec2(-0.18, 0.04)) - 0.55 - 0.08 * sin(t * 4.0)));
  float veil = smoothstep(0.2, 1.1, nebula + dust * 0.5 - length(uv) * 0.45);

  vec3 base = vec3(0.02, 0.01, 0.09);
  vec3 cyan = vec3(0.37, 0.83, 0.94);
  vec3 amber = vec3(1.0, 0.72, 0.30);
  vec3 cream = vec3(0.94, 0.92, 0.88);

  vec3 color = base;
  color += mix(cyan, amber, smoothstep(0.3, 0.9, dust)) * veil * 0.28;
  color += cream * orbit * 0.10;

  vec2 starCell = floor((uv + 1.4) * vec2(220.0, 140.0));
  float star = pow(hash23(starCell), 38.0);
  color += vec3(star) * (0.35 + 0.65 * sin(t * 8.0 + starCell.x * 0.07 + starCell.y * 0.11));

  color *= smoothstep(1.5, 0.18, length(uv));
  fragColor = vec4(color, 1.0);
}
`,
};
