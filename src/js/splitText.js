/**
 * Lightweight text splitter (no paid dependencies).
 * Wraps content in word / char / line spans so it can be masked and animated.
 */

export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  const frag = document.createDocumentFragment();
  const chars = [];
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'char';
    span.style.display = 'inline-block';
    span.style.willChange = 'transform';
    span.textContent = ch === ' ' ? ' ' : ch;
    frag.appendChild(span);
    chars.push(span);
  }
  el.appendChild(frag);
  return chars;
}

/**
 * Split into lines. Handles inline markup (e.g. <em>, <strong>) by measuring
 * word positions after layout, then wrapping each line in a masked container.
 */
export function splitLines(el) {
  // build a flat list of word spans while preserving inline tags
  const words = [];
  const walk = (node, wrapper) => {
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        parts.forEach((part) => {
          if (part === '') return;
          if (/^\s+$/.test(part)) {
            wrapper.appendChild(document.createTextNode(' '));
          } else {
            const span = document.createElement('span');
            span.className = 'w';
            span.style.display = 'inline-block';
            span.textContent = part;
            wrapper.appendChild(span);
            words.push(span);
          }
        });
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const clone = child.cloneNode(false);
        wrapper.appendChild(clone);
        walk(child, clone);
      }
    });
  };

  const container = document.createElement('span');
  walk(el, container);
  el.textContent = '';
  el.appendChild(container);

  // group words by vertical offset -> lines
  const lines = [];
  let currentTop = null;
  let currentLine = null;
  words.forEach((w) => {
    const top = w.offsetTop;
    if (currentTop === null || Math.abs(top - currentTop) > 4) {
      currentTop = top;
      currentLine = [];
      lines.push(currentLine);
    }
    currentLine.push(w);
  });

  // rebuild DOM with a masked wrapper + inner per line
  el.textContent = '';
  const inners = [];
  lines.forEach((lineWords) => {
    const mask = document.createElement('span');
    mask.className = 'line';
    mask.style.display = 'block';
    mask.style.overflow = 'hidden';
    const inner = document.createElement('span');
    inner.className = 'line__inner';
    inner.style.display = 'block';
    inner.style.willChange = 'transform';
    lineWords.forEach((w, i) => {
      inner.appendChild(w);
      if (i < lineWords.length - 1) inner.appendChild(document.createTextNode(' '));
    });
    mask.appendChild(inner);
    el.appendChild(mask);
    inners.push(inner);
  });

  return inners;
}
