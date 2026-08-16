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

void main() {
  vec2 uv = vUv;
  float asp = uResolution.x / uResolution.y;
  float t = uTime * 0.25;

  // warm vertical gradient: dark top -> orange middle -> pure white bottom
  vec3 white = vec3(1.0, 1.0, 1.0);
  vec3 orange = vec3(1.000, 0.420, 0.160);
  vec3 dark = vec3(0.140, 0.060, 0.035);
  vec3 col = mix(white, orange, smoothstep(0.0, 0.54, uv.y));
  col = mix(col, dark, smoothstep(0.56, 1.0, uv.y));

  // soft breathing radial glow around the upper-middle
  vec2 c = vec2(0.5 + sin(t * 0.3) * 0.03, 0.46 + cos(t * 0.24) * 0.02);
  float d = distance(vec2(uv.x * asp, uv.y), vec2(c.x * asp, c.y));
  float glow = smoothstep(0.62, 0.0, d);
  col += vec3(1.0, 0.55, 0.24) * glow * 0.14;

  // gentle mouse warmth
  vec2 mo = vec2(uMouse.x * asp, uMouse.y);
  float md = smoothstep(0.55, 0.0, distance(vec2(uv.x * asp, uv.y), mo));
  col += vec3(1.0, 0.5, 0.2) * md * 0.05;

  // faint grain to avoid banding across the large gradient
  float g = hash21(gl_FragCoord.xy + fract(uTime) * 50.0);
  col += (g - 0.5) * 0.012;

  // intro reveal — sweep up from black
  float reveal = smoothstep(uv.y - 0.25, uv.y + 0.25, uIntro * 1.5);
  col = mix(vec3(0.04, 0.02, 0.015), col, reveal);

  gl_FragColor = vec4(col, 1.0);
}
