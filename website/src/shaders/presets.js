export const shaderPresets = {
  hero: `
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
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
  float amp = 0.55;
  for (int i = 0; i < 6; i++) {
    value += amp * noise2(p);
    p = mat2(1.6, -1.2, 1.2, 1.6) * p;
    amp *= 0.52;
  }
  return value;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime * 0.09;

  vec2 p = uv;
  p.x *= 0.88;

  float nebulaA = fbm(p * 2.2 + vec2(t * 1.1, -t * 0.6));
  float nebulaB = fbm(p * 4.0 - vec2(t * 0.45, t * 0.28));
  float veil = smoothstep(0.18, 1.08, nebulaA + nebulaB * 0.42 - length(p) * 0.5);
  float ring = exp(-5.6 * abs(length(p - vec2(0.18, -0.04)) - 0.5 - 0.06 * sin(t * 3.7)));

  vec3 base = vec3(0.01, 0.015, 0.08);
  vec3 cyan = vec3(0.36, 0.83, 0.95);
  vec3 amber = vec3(1.0, 0.72, 0.30);
  vec3 cream = vec3(0.95, 0.92, 0.87);

  vec3 color = base;
  color += cyan * pow(max(veil, 0.0), 1.5) * 0.28;
  color += amber * pow(max(nebulaB, 0.0), 2.3) * 0.18;
  color += cream * ring * 0.08;

  vec2 stars = floor((uv + 1.8) * vec2(220.0, 130.0));
  float star = pow(hash21(stars), 36.0);
  color += vec3(star) * (0.25 + 0.75 * sin(t * 8.0 + stars.x * 0.09 + stars.y * 0.13));

  color *= smoothstep(1.45, 0.16, length(uv));
  fragColor = vec4(color, 1.0);
}
`,

  rain: `
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float drip(vec2 uv, float t, float scale, float speed) {
  vec2 g = uv * scale;
  vec2 id = floor(g);
  vec2 st = fract(g) - 0.5;

  float n = hash21(id);
  float x = (n - 0.5) * 0.72;
  float y = fract(-t * speed - n * 7.13) - 0.5;

  st.x -= x;
  st.y -= y;

  float drop = smoothstep(0.22, 0.0, length(vec2(st.x * 1.7, st.y)));
  float trail = smoothstep(0.05, 0.0, abs(st.x)) * smoothstep(0.46, -0.4, st.y) * 0.32;
  return drop + trail;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec2 p = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime;

  float r1 = drip(uv + vec2(0.0, t * 0.04), t, 8.0, 0.28);
  float r2 = drip(uv * 1.35 + vec2(0.1, t * 0.06), t, 13.0, 0.36) * 0.72;
  float r3 = drip(uv * 1.8 + vec2(-0.08, t * 0.05), t, 18.0, 0.48) * 0.38;
  float rain = r1 + r2 + r3;

  vec2 distort = p;
  distort.x += rain * 0.055;
  distort.y += sin(distort.x * 5.0 + t * 0.4) * 0.018;

  float fog = smoothstep(0.95, 0.05, length(distort)) * 0.38;
  float glow = exp(-12.0 * abs(distort.y + 0.12 + 0.06 * sin(distort.x * 3.0 + t * 0.5)));

  vec3 base = vec3(0.016, 0.018, 0.05);
  vec3 deep = vec3(0.03, 0.07, 0.11);
  vec3 cyan = vec3(0.35, 0.82, 0.95);
  vec3 amber = vec3(1.0, 0.72, 0.30);

  vec3 color = mix(base, deep, smoothstep(-0.45, 0.55, distort.y + 0.1));
  color += cyan * (fog * 0.25 + rain * 0.14);
  color += amber * glow * 0.08;
  color += vec3(0.05, 0.04, 0.07) * smoothstep(0.7, 0.0, abs(distort.y + 0.2));

  fragColor = vec4(color, 1.0);
}
`,

  pulse: `
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float lineField(vec2 uv, float t, float offset, float freq) {
  float wave = sin(uv.x * freq + offset + t * 0.55) * 0.18;
  return smoothstep(0.03, 0.0, abs(uv.y + wave));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime;

  float signal = 0.0;
  signal += lineField(uv * vec2(1.0, 1.5), t, 0.0, 7.5);
  signal += lineField((uv + vec2(0.0, 0.18)) * vec2(1.1, 1.8), t * 1.08, 1.7, 8.2) * 0.95;
  signal += lineField((uv - vec2(0.0, 0.18)) * vec2(1.3, 2.0), t * 1.22, 3.1, 8.8) * 0.72;

  vec2 gridUv = uv * 10.0;
  vec2 cell = abs(fract(gridUv) - 0.5);
  float grid = smoothstep(0.49, 0.46, min(cell.x, cell.y));

  float ring = exp(-6.8 * abs(length(vec2(uv.x * 1.2, uv.y)) - 0.4 - 0.04 * sin(t * 1.15)));
  float flicker = smoothstep(0.2, 0.85, sin(uv.x * 4.0 - t * 1.6 + uv.y * 5.5));

  vec3 base = vec3(0.03, 0.02, 0.08);
  vec3 cyan = vec3(0.37, 0.83, 0.94);
  vec3 amber = vec3(1.0, 0.72, 0.30);

  vec3 color = base;
  color += cyan * signal * 0.34;
  color += amber * ring * 0.24;
  color += mix(cyan, amber, flicker) * grid * 0.06;
  color *= smoothstep(1.35, 0.18, length(uv));

  fragColor = vec4(color, 1.0);
}
`,

  lanterns: `
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float box(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime * 0.55;

  vec3 color = vec3(0.01, 0.04, 0.06);
  vec3 cyan = vec3(0.37, 0.83, 0.94);
  vec3 amber = vec3(1.0, 0.72, 0.30);

  vec2 grid = uv * vec2(6.0, 4.4);
  vec2 id = floor(grid);
  vec2 st = fract(grid) - 0.5;

  float n = hash21(id);
  float subdiv = step(0.55, n);
  vec2 cell = mix(vec2(0.36, 0.32), vec2(0.17, 0.14), subdiv);
  vec2 local = st;

  if (subdiv > 0.5) {
    vec2 q = abs(st);
    if (q.x > q.y) {
      local.x = fract(st.x * 2.0 + 0.5) - 0.5;
      local.y = st.y;
    } else {
      local.y = fract(st.y * 2.0 + 0.5) - 0.5;
      local.x = st.x;
    }
  }

  float panel = box(local, cell);
  float frame = smoothstep(0.03, 0.0, abs(panel) - 0.02);
  float fill = smoothstep(0.22, 0.0, panel);

  float pulse = 0.5 + 0.5 * sin(t * (1.2 + n) + n * 10.0);
  color += cyan * frame * 0.22;
  color += mix(cyan, amber, pulse) * fill * 0.11;

  vec2 wires = abs(fract(uv * vec2(18.0, 10.0) + vec2(t * 0.06, 0.0)) - 0.5);
  float traces = smoothstep(0.49, 0.47, min(wires.x, wires.y));
  color += cyan * traces * 0.04;

  vec2 glowCell = fract(grid + vec2(0.0, t * 0.2)) - 0.5;
  float dotGlow = smoothstep(0.1, 0.0, length(glowCell));
  color += amber * dotGlow * 0.04;

  color *= smoothstep(1.42, 0.2, length(uv));
  fragColor = vec4(color, 1.0);
}
`,

  cosmos: `
float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise2(vec2 p) {
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
  float amp = 0.55;
  for (int i = 0; i < 6; i++) {
    value += amp * noise2(p);
    p = mat2(1.5, -1.1, 1.1, 1.5) * p;
    amp *= 0.5;
  }
  return value;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
  float t = iTime * 0.08;

  float nebula = fbm(uv * 2.5 + vec2(t * 1.1, -t * 0.75));
  float dust = fbm(uv * 4.8 - vec2(t * 0.6, t * 0.35));
  float disk = exp(-6.0 * abs(length(uv - vec2(-0.14, 0.06)) - 0.56 - 0.07 * sin(t * 4.0)));
  float veil = smoothstep(0.18, 1.08, nebula + dust * 0.45 - length(uv) * 0.45);

  vec3 base = vec3(0.02, 0.01, 0.09);
  vec3 cyan = vec3(0.37, 0.83, 0.94);
  vec3 amber = vec3(1.0, 0.72, 0.30);
  vec3 cream = vec3(0.94, 0.92, 0.88);

  vec3 color = base;
  color += mix(cyan, amber, smoothstep(0.3, 0.92, dust)) * veil * 0.28;
  color += cream * disk * 0.09;

  vec2 stars = floor((uv + 1.6) * vec2(240.0, 150.0));
  float star = pow(hash21(stars), 38.0);
  color += vec3(star) * (0.28 + 0.72 * sin(t * 8.2 + stars.x * 0.07 + stars.y * 0.11));

  color *= smoothstep(1.5, 0.15, length(uv));
  fragColor = vec4(color, 1.0);
}
`,
};
