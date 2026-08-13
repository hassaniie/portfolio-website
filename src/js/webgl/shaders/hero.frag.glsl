precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;      // 0..1, smoothed
uniform float uScroll;    // 0..1 scroll progress
uniform float uIntro;     // 0..1 reveal on load

/* ---- Simplex 2D noise (Ashima / Gustavson) ---- */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

/* soft, low-octave fbm — kept deliberately smooth (no fine detail) */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 3; i++) {
    v += a * snoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;

  // very slow drift
  float t = uTime * 0.02;

  // gentle, wide mouse lift — a soft breath of light, not a ripple
  vec2 mo = uMouse;
  mo.x *= uResolution.x / uResolution.y;
  float lift = smoothstep(0.85, 0.0, distance(p, mo)) * 0.10;

  // one large-scale, low-frequency field — smooth, no veins
  float n = fbm(p * 0.65 + vec2(t, -t * 0.7));
  n = n * 0.5 + 0.5;                     // -> 0..1

  // a calm directional base gradient so the surface reads as one soft wash
  float grad = clamp(uv.x * 0.45 + (1.0 - uv.y) * 0.7, 0.0, 1.0);

  // mostly gradient, a whisper of noise for organic depth
  float field = grad * 0.6 + n * 0.4 + lift;

  // near-value dark duotone -> smooth, low cognitive load
  vec3 c0 = vec3(0.035, 0.035, 0.040); // ~#09090a
  vec3 c1 = vec3(0.072, 0.068, 0.092); // deep plum-grey
  vec3 c2 = vec3(0.110, 0.104, 0.134); // gentle lift
  vec3 col = mix(c0, c1, smoothstep(0.12, 0.78, field));
  col = mix(col, c2, smoothstep(0.72, 1.05, field) * 0.5);

  // subtle top darkening (behind nav) + scroll fade
  col *= 1.0 - uv.y * 0.08;
  col *= 1.0 - uScroll * 0.5;

  // soft vignette
  float vig = smoothstep(1.4, 0.4, length((uv - 0.5) * vec2(1.1, 1.25)));
  col *= mix(0.7, 1.0, vig);

  // barely-there grain to avoid banding
  float g = hash(gl_FragCoord.xy + fract(uTime) * 100.0);
  col += (g - 0.5) * 0.012;

  // intro reveal — sweep up from black
  float reveal = smoothstep(uv.y - 0.15, uv.y + 0.15, uIntro * 1.3);
  col *= reveal;

  gl_FragColor = vec4(col, 1.0);
}
