precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;      // 0..1, smoothed
uniform float uScroll;    // 0..1 scroll progress
uniform float uIntro;     // 0..1 reveal on load

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

/* One layer of soft, sparse bokeh stars on a hashed cell grid. */
float starLayer(vec2 uv, float tw) {
  float m = 0.0;
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offs = vec2(float(x), float(y));
      vec2 cid = id + offs;
      // only ~40% of cells carry a star -> sparse, calm
      float present = step(0.6, hash21(cid + 7.1));
      float n = hash21(cid);
      float n2 = hash21(cid + 41.3);
      vec2 pos = offs + vec2(n, n2) - 0.5 - gv;
      float d = length(pos);
      float size = mix(0.015, 0.26, n2 * n2);       // few large, soft bokeh
      float bright = mix(0.05, 0.8, n);
      float twinkle = 0.82 + 0.18 * sin(tw * 1.2 + n * 30.0);
      float core = smoothstep(size, 0.0, d) * bright * twinkle;
      float glow = smoothstep(size * 3.5, 0.0, d) * bright * 0.10;
      m += (core + glow) * present;
    }
  }
  return m;
}

void main() {
  vec2 uv = vUv;
  float asp = uResolution.x / uResolution.y;
  vec2 p = uv;
  p.x *= asp;

  float t = uTime * 0.04;

  // subtle navy base gradient
  vec3 top = vec3(0.030, 0.038, 0.060);    // ~#080a0f
  vec3 bottom = vec3(0.044, 0.052, 0.080); // ~#0b0d14
  vec3 col = mix(bottom, top, smoothstep(0.0, 1.0, uv.y));

  // soft mouse glow — a faint breath of light
  vec2 mo = uMouse;
  mo.x *= asp;
  float glow = smoothstep(0.75, 0.0, distance(p, mo));
  col += vec3(0.05, 0.045, 0.085) * glow * 0.5;

  // three parallaxed star layers (deeper layers drift + scroll slower/faster)
  float s = 0.0;
  s += starLayer(p * 3.0 + vec2(t * 0.20, uScroll * 0.6), uTime) * 0.60;
  s += starLayer(p * 6.0 + vec2(-t * 0.12, uScroll * 1.1) + 20.0, uTime) * 0.42;
  s += starLayer(p * 10.0 + vec2(t * 0.08, uScroll * 1.9) + 50.0, uTime) * 0.30;

  // cool white with a lilac tint
  vec3 starCol = mix(vec3(0.86, 0.88, 0.96), vec3(0.72, 0.66, 0.96), 0.4);
  col += starCol * s;

  // vignette
  float vig = smoothstep(1.4, 0.35, length((uv - 0.5) * vec2(1.05, 1.2)));
  col *= mix(0.72, 1.0, vig);

  // scroll fade
  col *= 1.0 - uScroll * 0.4;

  // faint grain to avoid banding
  float g = hash21(gl_FragCoord.xy + fract(uTime) * 50.0);
  col += (g - 0.5) * 0.015;

  // intro reveal — sweep up from black
  float reveal = smoothstep(uv.y - 0.2, uv.y + 0.2, uIntro * 1.4);
  col *= reveal;

  gl_FragColor = vec4(col, 1.0);
}
