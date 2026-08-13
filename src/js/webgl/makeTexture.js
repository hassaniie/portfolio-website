/**
 * Procedurally paint a duotone project thumbnail onto a 2D canvas.
 * No external image assets — every preview is generated at runtime.
 */

const PROJECTS = [
  { name: 'Aperture', tag: 'Design system', a: '#1b2a4a', b: '#c8ff4d' },
  { name: 'Halcyon', tag: 'Fintech · iOS', a: '#2a1b3d', b: '#ff9a6b' },
  { name: 'Monolith', tag: 'Brand · WebGL', a: '#111214', b: '#8f8a7e' },
  { name: 'Verdant', tag: 'Climate platform', a: '#12291f', b: '#9cf0c0' },
  { name: 'Sonder', tag: 'Editorial · Motion', a: '#33202a', b: '#f0d0a0' },
];

function seeded(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function makeProjectCanvas(index, size = 512) {
  const p = PROJECTS[index % PROJECTS.length];
  const w = size;
  const h = Math.round(size * 1.25);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const rand = seeded(index + 1);

  const [ar, ag, ab] = hexToRgb(p.a);
  const [br, bg, bb] = hexToRgb(p.b);

  // base gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0a0a0b');
  grad.addColorStop(0.55, p.a);
  grad.addColorStop(1, '#0a0a0b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // soft duotone light blobs
  for (let i = 0; i < 5; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const r = (0.25 + rand() * 0.5) * w;
    const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
    const mix = rand();
    const cr = Math.round(ar + (br - ar) * mix);
    const cg = Math.round(ag + (bg - ag) * mix);
    const cb = Math.round(ab + (bb - ab) * mix);
    rg.addColorStop(0, `rgba(${cr},${cg},${cb},0.5)`);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  }

  // fine grid
  ctx.strokeStyle = 'rgba(244,241,234,0.06)';
  ctx.lineWidth = 1;
  const step = w / 8;
  for (let x = step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // accent bar
  ctx.fillStyle = p.b;
  ctx.fillRect(w * 0.08, h * 0.12, w * 0.18, 4);

  // label
  ctx.fillStyle = 'rgba(244,241,234,0.55)';
  ctx.font = `500 ${Math.round(w * 0.035)}px "Space Grotesk", sans-serif`;
  ctx.fillText(p.tag.toUpperCase(), w * 0.08, h * 0.12 - 14);

  ctx.fillStyle = '#f4f1ea';
  ctx.font = `400 ${Math.round(w * 0.15)}px "Fraunces", Georgia, serif`;
  ctx.fillText(p.name, w * 0.075, h * 0.88);

  return canvas;
}

export const PROJECT_COUNT = PROJECTS.length;
