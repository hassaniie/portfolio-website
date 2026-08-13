import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  CanvasTexture,
  LinearFilter,
  ClampToEdgeWrapping,
  SRGBColorSpace,
  Vector2,
} from 'three';
import { gsap } from 'gsap';
import { makeProjectCanvas, PROJECT_COUNT } from './makeTexture.js';

const frag = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform float uProgress;
uniform float uTime;
uniform vec2 uTilt;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main(){
  vec2 uv = vUv;
  uv += uTilt * 0.04 * (uv - 0.5);
  float n = noise(uv * 3.5 + uTime * 0.08);
  float disp = 0.16;
  vec2 uvA = uv - uProgress * disp * vec2(n - 0.5, (n - 0.5) * 0.6);
  vec2 uvB = uv + (1.0 - uProgress) * disp * vec2(n - 0.5, (n - 0.5) * 0.6);
  vec4 texA = texture2D(uTexA, uvA);
  vec4 texB = texture2D(uTexB, uvB);
  float reveal = smoothstep(uProgress - 0.12, uProgress + 0.12, n);
  gl_FragColor = mix(texB, texA, reveal);
}
`;

const vert = /* glsl */ `
precision highp float;
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
`;

/**
 * A small floating WebGL panel that transitions between procedurally
 * generated project thumbnails with a noise-displacement wipe.
 */
export default class WorkPreview {
  constructor(canvas) {
    this.canvas = canvas;
    this.textures = [];
    this.current = -1;
    this.running = false;
    this.tilt = new Vector2(0, 0);
    this.targetTilt = new Vector2(0, 0);

    this._init();
  }

  _makeTexture(i) {
    const tex = new CanvasTexture(makeProjectCanvas(i, 512));
    tex.colorSpace = SRGBColorSpace;
    tex.minFilter = LinearFilter;
    tex.magFilter = LinearFilter;
    tex.generateMipmaps = false;
    tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
    return tex;
  }

  _init() {
    for (let i = 0; i < PROJECT_COUNT; i++) this.textures.push(this._makeTexture(i));

    this.scene = new Scene();
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: false, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this._resize();

    this.uniforms = {
      uTexA: { value: this.textures[0] },
      uTexB: { value: this.textures[0] },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uTilt: { value: this.tilt },
    };

    this.material = new ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: this.uniforms,
      transparent: true,
    });
    this.mesh = new Mesh(new PlaneGeometry(2, 2), this.material);
    this.scene.add(this.mesh);
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width || 320;
    const h = rect.height || 400;
    this.renderer.setSize(w, h, false);
  }

  setTilt(x, y) {
    this.targetTilt.set(x, y);
  }

  show(index) {
    if (index === this.current) return;
    const from = this.current === -1 ? index : this.current;
    this.uniforms.uTexA.value = this.textures[from];
    this.uniforms.uTexB.value = this.textures[index];
    this.uniforms.uProgress.value = 0;
    this.current = index;
    gsap.killTweensOf(this.uniforms.uProgress);
    gsap.to(this.uniforms.uProgress, {
      value: 1,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        this.uniforms.uTexA.value = this.textures[index];
        this.uniforms.uProgress.value = 0;
      },
    });
    this.start();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.t0 = this.t0 || performance.now();
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  _loop(now) {
    if (!this.running) return;
    this.uniforms.uTime.value = (now - this.t0) / 1000;
    this.tilt.lerp(this.targetTilt, 0.08);
    this.renderer.render(this.scene, this.camera);
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }
}
