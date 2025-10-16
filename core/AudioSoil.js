// ======================================================
// 🎚️ AudioSoil.js — Core Adaptive Stem Engine (GLYPH v0.6)
// ------------------------------------------------------
// v0.6 updates:
// - Robust playback graph: persistent gain→analyser→master chain
// - New source per play to avoid stale/paused BufferSource
// - Vocals band tuned (120–3000 Hz) so vocal visuals react
// - Per-frame analyser caching (unchanged API)
// ======================================================

export class AudioSoil {
  constructor({ fftSize = 2048 } = {}) {
    // --- Context ---
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    // --- Master chain ---
    this.master = this.ctx.createGain();
    this.master.gain.value = 1.0;
    this.master.connect(this.ctx.destination);

    // --- Global analyser ---
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = fftSize;
    this.analyser.smoothingTimeConstant = 0.0;
    this.analyser.minDecibels  = -70;
    this.analyser.maxDecibels  = -5;
    this.master.connect(this.analyser);

    // --- Buffers & state ---
    this._spec = new Uint8Array(this.analyser.frequencyBinCount);
    this.stems = {};
    this.ready = false;

    // frame stamp for caching
    this._frameStamp = 0;
    this._lastGlobalFrame = -1;
    this._globalCached = 0;
  }

  // ======================================================
  // 📂 Load folder or individual files
  // ======================================================
  async loadFolder() {
    const dir = await window.showDirectoryPicker();
    for await (const entry of dir.values()) {
      if (entry.kind === 'file' && /\.(mp3|wav|ogg)$/i.test(entry.name)) {
        const file = await entry.getFile();
        await this.loadFile(file);
      }
    }
    this.ready = true;
  }

  async loadFile(file) {
    const arr = await file.arrayBuffer();
    const buf = await this.ctx.decodeAudioData(arr);
    const name = file.name.replace(/\..+$/, '').toLowerCase();
    this.addStem(name, buf);
  }

  // ======================================================
  // 🎧 Create stem graph (persistent analyser chain)
  // ======================================================
  addStem(name, buffer) {
    // persistent nodes (gain→analyser→master)
    const gain = this.ctx.createGain();
    gain.gain.value = 1.0;

    const ana = this.ctx.createAnalyser();
    ana.fftSize = this.analyser.fftSize;
    ana.smoothingTimeConstant = 0.0;
    ana.minDecibels = this.analyser.minDecibels;
    ana.maxDecibels = this.analyser.maxDecibels;

    gain.connect(ana);
    ana.connect(this.master);

    const data = new Uint8Array(ana.frequencyBinCount);

    this.stems[name] = {
      buffer,        // store decoded audio buffer
      src: null,     // will be created on play
      gain,
      ana,
      data,
      active: false,
      env: 0,
      _lastFrame: -1,
      _lastValue: 0
    };
  }

  // ======================================================
  // ▶️ Playback
  // ======================================================
  playAll(loop = true) {
    if (!Object.keys(this.stems).length) {
      console.warn('No stems loaded.');
      return;
    }

    for (const s of Object.values(this.stems)) {
      if (s.active) continue;

      // always create a fresh BufferSource for reliable playback
      const src = this.ctx.createBufferSource();
      src.buffer = s.buffer;
      src.loop = loop;

      // connect into the persistent chain
      src.connect(s.gain);

      src.start();
      s.src = src;
      s.active = true;
    }
  }

  stopAll() {
    for (const s of Object.values(this.stems)) {
      if (!s.active) continue;
      try { s.src.stop(); } catch {}
      s.src = null;
      s.active = false;
    }
  }

  resume() { return this.ctx.resume(); }
  pause()  { return this.ctx.suspend(); }

  // ======================================================
  // 📈 Analysis Helpers (Optimized + Safe)
  // ------------------------------------------------------
  // - Reads each stem analyser at most once per frame
  // - Computes RMS in band, smooths envelope, caches value
  // ======================================================
  getStemEnergy(name, lo = 50, hi = 8000, smooth = 0.3) {
    const s = this.stems[name];
    if (!s) return 0;

    const frame = this._frameStamp;

    // reuse cached value if analyser already read this frame
    if (s._lastFrame === frame) return s._lastValue ?? 0;
    s._lastFrame = frame;

    // Pull frequency data once
    try {
      s.ana.getByteFrequencyData(s.data);
    } catch {
      return s._lastValue ?? 0;
    }

    const len = s.data.length;
    if (len === 0) return 0;

    const nyq = this.ctx.sampleRate / 2;
    const i1 = Math.max(0, Math.floor((lo / nyq) * len));
    const i2 = Math.min(len, Math.floor((hi / nyq) * len));

    let sum = 0;
    const count = Math.max(1, i2 - i1);
    for (let i = i1; i < i2; i++) {
      const v = (s.data[i] ?? 0) / 255;
      sum += v * v;
    }

    // RMS for the band
    let rms = Math.sqrt(sum / count);
    if (!isFinite(rms) || isNaN(rms)) rms = 0;

    // Smooth envelope
    s.env = s.env ?? 0;
    s.env += (rms - s.env) * smooth;

    s._lastValue = s.env;
    return s.env;
  }

  // ======================================================
  // 🌍 Global Energy (Full Mix RMS) — Cached per frame
  // ======================================================
  getGlobalEnergy() {
    const frame = this._frameStamp;
    if (this._lastGlobalFrame === frame) return this._globalCached;

    this._lastGlobalFrame = frame;

    if (!this._spec || this._spec.length === 0) {
      this._globalCached = 0;
      return 0;
    }

    this.analyser.getByteFrequencyData(this._spec);

    let sum = 0;
    for (let i = 0; i < this._spec.length; i++) {
      const v = (this._spec[i] ?? 0);
      sum += v * v;
    }

    let rms = Math.sqrt(sum / this._spec.length) / 255;
    if (!isFinite(rms) || isNaN(rms)) rms = 0;

    this._globalCached = Math.min(1, rms);
    return this._globalCached;
  }

  // ======================================================
  // ⚡ Frame Snapshot Helper (for modular visuals)
  // ------------------------------------------------------
  // - Increments frame stamp to sync per-frame caching
  // - Calls getStemEnergy once per stem (cached inside)
  // ======================================================
  getEnergies() {
    // advance frame (int stamp avoids float equality issues)
    this._frameStamp = (performance.now() | 0);

    return {
      bass:   this.hasStem('bass')   ? this.getStemEnergy('bass',   40,  250, 0.30) : 0,
      drums:  this.hasStem('drums')  ? this.getStemEnergy('drums',  60, 8000, 0.30) : 0,
      vocals: this.hasStem('vocals') ? this.getStemEnergy('vocals', 120, 3000, 0.25) : 0, // <-- fixed band
      other:  this.hasStem('other')  ? this.getStemEnergy('other', 200, 3000, 0.30) : 0,
      global: this.getGlobalEnergy()
    };
  }

  // ======================================================
  // 🧩 Utility Helpers
  // ======================================================
  hasStem(name) {
    return !!this.stems[name];
  }
}
