// ======================================================
// ✨ VisualOverlay2D.js — Core 2D Overlay Manager (GLYPH v0.1)
// ------------------------------------------------------
// - Manages a 2D canvas overlay (UI, particles, halos, etc.)
// - Maintains registry of visual overlay nodes
// - Handles resize + per-frame drawing with energy map
// ======================================================

export class VisualOverlay2D {
  constructor(canvasSelector = '#overlay2d') {
    // ---------- Canvas ----------
    this.canvas = document.querySelector(canvasSelector);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];

    // ---------- Resize ----------
    window.addEventListener('resize', () => this.resize());
    this.resize();

    console.log('%c[2D Soil] Ready', 'color:#0ff');
  }

  // ------------------------------------------------------
  // 🧱 Resize
  // ------------------------------------------------------
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // ------------------------------------------------------
  // 🧩 Node Management
  // ------------------------------------------------------
  addNode(node) {
    this.nodes.push(node);
  }

  removeNode(node) {
    const i = this.nodes.indexOf(node);
    if (i !== -1) this.nodes.splice(i, 1);
  }

  clearNodes() {
    this.nodes = [];
  }

  // ------------------------------------------------------
  // 🎨 Draw / Update
  // ------------------------------------------------------
  update(energies, t = 0) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update/draw all registered nodes
    for (const node of this.nodes) {
      try { node.update?.(energies, t, ctx, this.canvas); } 
      catch (e) { console.warn('[2D Node Error]', e); }
    }
  }
}
