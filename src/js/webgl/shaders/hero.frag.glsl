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

/* fractal brownian motion */
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

/* cheap hash for grain */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  // aspect-correct coordinates
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;

  float t = uTime * 0.045;

  // mouse ripple center
  vec2 m = uMouse;
  m.x *= uResolution.x / uResolution.y;
  float md = distance(p, m);
  float ripple = smoothstep(0.9, 0.0, md) * 0.25;

  // domain warping — flowing field
  vec2 q = vec2(fbm(p * 1.4 + t), fbm(p * 1.4 - t + 4.7));
  vec2 r = vec2(
    fbm(p * 1.9 + q * 1.5 + vec2(1.7, 9.2) + t * 1.4 + ripple),
    fbm(p * 1.9 + q * 1.5 + vec2(8.3, 2.8) - t * 1.2)
  );
  float f = fbm(p * 1.6 + r * 1.3);
  f = f * 0.5 + 0.5;                 // -> 0..1
  f = mix(f, f + ripple, 0.8);

  // duotone: near-black -> deep plum/indigo -> warm bone highlights
  vec3 c0 = vec3(0.039, 0.039, 0.043); // #0a0a0b
  vec3 c1 = vec3(0.10, 0.075, 0.13);   // deep plum
  vec3 c2 = vec3(0.16, 0.15, 0.20);    // dim indigo-grey
  vec3 c3 = vec3(0.72, 0.70, 0.64);    // warm bone

  vec3 col = mix(c0, c1, smoothstep(0.15, 0.5, f));
  col = mix(col, c2, smoothstep(0.5, 0.78, f));
  col = mix(col, c3, smoothstep(0.82, 1.0, f) * 0.6);

  // faint chartreuse glow in the brightest filaments (used sparingly)
  float spark = smoothstep(0.93, 1.0, f);
  col += vec3(0.78, 1.0, 0.30) * spark * 0.10;

  // flowing contour lines for an editorial, drawn feel
  float lines = abs(sin(f * 22.0 + t * 6.0));
  lines = smoothstep(0.0, 0.06, lines);
  col *= mix(0.82, 1.0, lines);

  // darken toward top (behind nav) & scroll fade
  col *= 1.0 - uv.y * 0.12;
  col *= 1.0 - uScroll * 0.55;

  // vignette
  float vig = smoothstep(1.25, 0.35, length((uv - 0.5) * vec2(1.15, 1.3)));
  col *= mix(0.55, 1.0, vig);

  // grain
  float g = hash(gl_FragCoord.xy + fract(uTime) * 100.0);
  col += (g - 0.5) * 0.035;

  // intro reveal — sweep up from black
  float reveal = smoothstep(uv.y - 0.15, uv.y + 0.15, uIntro * 1.3);
  col *= reveal;

  gl_FragColor = vec4(col, 1.0);
}
