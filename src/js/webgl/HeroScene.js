import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Vector2,
} from 'three';
import { gsap } from 'gsap';
import vertexShader from './shaders/hero.vert.glsl?raw';
import fragmentShader from './shaders/hero.frag.glsl?raw';

/**
 * Full-screen WebGL shader background for the hero.
 * Flowing domain-warped noise, duotone palette, grain + vignette,
 * subtly reactive to the mouse and to scroll.
 */
export default class HeroScene {
  constructor(canvas, { reducedMotion = false } = {}) {
    this.canvas = canvas;
    this.reducedMotion = reducedMotion;
    this.mouse = new Vector2(0.5, 0.5);
    this.targetMouse = new Vector2(0.5, 0.5);
    this.running = false;
    this.visible = true;
    this.scroll = 0;

    this._init();
    this._bind();
    this.resize();
    this.start();
  }

  _init() {
    this.scene = new Scene();
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setClearColor(0x0a0c14, 1);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(this.dpr);

    this.uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new Vector2(1, 1) },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uScroll: { value: 0 },
      uIntro: { value: this.reducedMotion ? 1 : 0 },
    };

    const geometry = new PlaneGeometry(2, 2);
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false,
    });

    this.mesh = new Mesh(geometry, this.material);
    this.scene.add(this.mesh);
  }

  _bind() {
    this._onResize = this.resize.bind(this);
    this._onPointer = this._pointerMove.bind(this);
    this._onVisibility = () => {
      if (document.hidden) this.stop();
      else if (this.visible) this.start();
    };

    window.addEventListener('resize', this._onResize, { passive: true });
    window.addEventListener('pointermove', this._onPointer, { passive: true });
    document.addEventListener('visibilitychange', this._onVisibility);

    // pause the loop when the hero scrolls off-screen
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver(
        ([entry]) => {
          this.visible = entry.isIntersecting;
          if (this.visible && !document.hidden) this.start();
          else this.stop();
        },
        { threshold: 0 }
      );
      this._io.observe(this.canvas);
    }
  }

  _pointerMove(e) {
    this.targetMouse.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
  }

  reveal() {
    if (this.reducedMotion) return;
    gsap.to(this.uniforms.uIntro, {
      value: 1,
      duration: 2.4,
      ease: 'power2.out',
      delay: 0.1,
    });
  }

  setScroll(progress) {
    this.scroll = progress;
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.uniforms.uResolution.value.set(w * this.dpr, h * this.dpr);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clockStart = this.clockStart || performance.now();
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  _loop(now) {
    if (!this.running) return;
    const t = (now - this.clockStart) / 1000;

    // smooth mouse
    this.mouse.lerp(this.targetMouse, this.reducedMotion ? 1 : 0.05);
    this.uniforms.uMouse.value.copy(this.mouse);
    this.uniforms.uScroll.value = this.scroll;
    this.uniforms.uTime.value = this.reducedMotion ? 0 : t;

    this.renderer.render(this.scene, this.camera);
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('pointermove', this._onPointer);
    document.removeEventListener('visibilitychange', this._onVisibility);
    this._io?.disconnect();
    this.material.dispose();
    this.mesh.geometry.dispose();
    this.renderer.dispose();
  }
}
