// ======================================================
// 🥁 Drums.js — v3.2 “Pure Node Edition”
// ------------------------------------------------------
// - No internal EffectComposer or AfterimagePass
// - Reacts to 'drums' stem via AudioSoil
// - Unified with VisualSoil3D global post stack
// - Retains fractal system, emissive/scale logic, debug UI
// ======================================================

import * as THREE from 'three';

export class Drums {
  constructor(scene = null) {
    // ---------- Shared geometry/material ----------
    this._sharedGeo = new THREE.IcosahedronGeometry(0.7, 6);
    const matBase = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 1,
      roughness: 0,
      emissive: 0x000000,
      envMapIntensity: 10.2,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    this._sharedMaterials = {
      kick: matBase,
      snare: matBase.clone(),
      hat:   matBase.clone(),
    };

    // ---------- Root & Clusters ----------
    this.root = new THREE.Group();
    if (scene) scene.add(this.root);

    this.cluster = this._createDrumCluster(this._sharedGeo, this._sharedMaterials);
    this._shareResources(this.cluster);
    this.root.add(this.cluster);

    // ---------- Fractal layers ----------
    this.fractalLayers = [];
    this._fractalDepth = 2;
    this._fractalScale = 0.5;
    this._fractalDist  = -2.15;
    this._createFractalLayer(this.root, this.cluster, this._fractalDepth, this._fractalScale, this._fractalDist);

    // ---------- State ----------
    this._kickEnv = 0; this._snareEnv = 0; this._hatEnv = 0;
    this._rotAxis = new THREE.Vector3(0.6, 1.0, 0.4).normalize();
    this._rotAxisTarget = this._rotAxis.clone();

    // ---------- Parameters ----------
    this.params = {
      // Rotation
      kickSpinScale: 4.0,
      snareSpinScale: 6.0,
      hatSpinScale: 8.0,
      totalSpinScale: 0.2,
      randomTwistChance: 0.01,

      // Scale
      kickScaleBase: 1.0,  kickScaleMult: 0.4,
      snareScaleBase: 0.5, snareScaleMult: 0.4,
      hatScaleBase: 0.25,  hatScaleMult: 0.3,

      // Emissive
      kickEmissiveMult: 4.0,
      snareEmissiveMult: 3.0,
      hatEmissiveMult: 2.5,

      // Envelopes
      attackKick: 50,  releaseKick: 5,
      attackSnare: 50, releaseSnare: 5,
      attackHat: 50,   releaseHat: 5,

      // Bands (Hz)
      kickBandLow: 100,   kickBandHigh: 400,
      snareBandLow: 5000, snareBandHigh: 9000,
      hatBandLow: 13000,  hatBandHigh: 20000,

      // Fractal proxies (UI-safe)
      get fractalDepth()  { return this._owner._fractalDepth;  },
      set fractalDepth(v) { this._owner._setFractal('depth',  v); },
      get fractalScale()  { return this._owner._fractalScale;  },
      set fractalScale(v) { this._owner._setFractal('scale',  v); },
      get fractalDist()   { return this._owner._fractalDist;   },
      set fractalDist(v)  { this._owner._setFractal('dist',   v); },
      _owner: this
    };

    // ---------- Reuse Buffers ----------
    this._vKick = new THREE.Vector3(1,0,0);
    this._vSnr  = new THREE.Vector3(0,1,0);
    this._vHat  = new THREE.Vector3(0,0,1);
    this._axisCombined = new THREE.Vector3();
    this._quat = new THREE.Quaternion();
    this._kickCol = new THREE.Color(0xff0000);
    this._snrCol  = new THREE.Color(0x0088ff);
    this._hatCol  = new THREE.Color(0x00ff88);

    // ---------- Debug UI ----------
    this._createDebugUI();
  }

  // ----------------------------------------------------
  // 🔁 Update
  // ----------------------------------------------------
  update(_, dt = 0.016) {
    const soil = window.audio;
    if (!soil || !soil.hasStem?.('drums')) return;

    const s = soil.stems['drums'];
    if (!s?.ana || !s.data) return;

    s.ana.getByteFrequencyData(s.data);
    const arr = s.data;
    const len = arr.length;
    const nyq = soil.ctx ? soil.ctx.sampleRate / 2 : 22050;

    // Band avg helper
    const band = (lo, hi) => {
      const i1 = Math.floor((Math.min(lo, hi) / nyq) * len);
      const i2 = Math.floor((Math.max(lo, hi) / nyq) * len);
      if (i2 <= i1) return 0;
      let sum = 0; for (let i = i1; i < i2; i++) sum += arr[i];
      return (sum / (i2 - i1)) / 255;
    };

    const ps = this.params;

    // Energies
    const kickE  = band(ps.kickBandLow,  ps.kickBandHigh);
    const snrE   = band(ps.snareBandLow, ps.snareBandHigh);
    const hatE   = band(ps.hatBandLow,   ps.hatBandHigh);

    // Envelope smoothing
    const smooth = (v, t, atk, rel) => v + (t - v) * (t > v ? atk : rel) * dt;
    this._kickEnv  = smooth(this._kickEnv,  kickE, ps.attackKick,  ps.releaseKick);
    this._snareEnv = smooth(this._snareEnv, snrE,  ps.attackSnare, ps.releaseSnare);
    this._hatEnv   = smooth(this._hatEnv,   hatE,  ps.attackHat,   ps.releaseHat);

    // Rotation
    const kickSpin  = this._kickEnv  * ps.kickSpinScale;
    const snareSpin = this._snareEnv * ps.snareSpinScale;
    const hatSpin   = this._hatEnv   * ps.hatSpinScale;

    this._axisCombined
      .set(0,0,0)
      .addScaledVector(this._vKick, kickSpin)
      .addScaledVector(this._vSnr,  snareSpin)
      .addScaledVector(this._vHat,  hatSpin);

    if (this._axisCombined.lengthSq() > 1e-8) this._axisCombined.normalize();

    const totalSpin = (kickSpin + snareSpin + hatSpin) * ps.totalSpinScale;
    this._quat.setFromAxisAngle(this._axisCombined, totalSpin * dt);
    this.root.quaternion.premultiply(this._quat);

    // Occasional twist
    if (Math.random() < THREE.MathUtils.clamp(ps.randomTwistChance, 0, 1)) {
      this._axisCombined.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      )).normalize();
    }

    // Visual modulation
    const kScale = Math.max(0.01, ps.kickScaleBase  + this._kickEnv  * ps.kickScaleMult);
    const sScale = Math.max(0.01, ps.snareScaleBase + this._snareEnv * ps.snareScaleMult);
    const hScale = Math.max(0.01, ps.hatScaleBase   + this._hatEnv   * ps.hatScaleMult);

    const kEm = Math.max(0, this._kickEnv  * ps.kickEmissiveMult);
    const sEm = Math.max(0, this._snareEnv * ps.snareEmissiveMult);
    const hEm = Math.max(0, this._hatEnv   * ps.hatEmissiveMult);

    const clusters = this._allClusters();
    for (let i = 0; i < clusters.length; i++) {
      const ud = clusters[i].userData;
      if (!ud?.kick) continue;

      // Emissive glow
      ud.kick.material.emissive.copy(this._kickCol).multiplyScalar(kEm);
      ud.snares.forEach(o => o.material.emissive.copy(this._snrCol).multiplyScalar(sEm));
      ud.hats.forEach(o => o.material.emissive.copy(this._hatCol).multiplyScalar(hEm));

      // Scale
      ud.kick.scale.setScalar(kScale);
      ud.snares.forEach(o => o.scale.setScalar(sScale));
      ud.hats.forEach(o => o.scale.setScalar(hScale));
    }
  }

  // ----------------------------------------------------
  // Fractal System
  // ----------------------------------------------------
  _setFractal(kind, value) {
    if (kind === 'depth') this._fractalDepth = Math.min(Math.max(0, Math.floor(value)), 4);
    if (kind === 'scale') this._fractalScale = Number(value);
    if (kind === 'dist')  this._fractalDist  = Number(value);
    this._debouncedRebuild();
  }

  _debouncedRebuild() {
    clearTimeout(this._rebuildTimer);
    this._rebuildTimer = setTimeout(() => {
      for (const f of this.fractalLayers) this.root.remove(f);
      this.fractalLayers.length = 0;
      this._createFractalLayer(this.root, this.cluster, this._fractalDepth, this._fractalScale, this._fractalDist);
    }, 50);
  }

  _createFractalLayer(parent, baseCluster, depth, scaleDecay, dist) {
    if (depth <= 0) return;
    for (const dir of Drums._DIRS) {
      const clone = baseCluster.clone(true);
      this._shareResources(clone);
      this._rehydrateClusterUserData(clone);
      const scale = Math.pow(scaleDecay, (this._fractalDepth - depth + 1));
      clone.scale.setScalar(scale);
      clone.position.copy(dir).multiplyScalar(dist * (this._fractalDepth - depth + 1));
      parent.add(clone);
      this.fractalLayers.push(clone);
      this._createFractalLayer(clone, baseCluster, depth - 1, scaleDecay, dist * scaleDecay);
    }
  }

  _allClusters() { return [this.cluster, ...this.fractalLayers]; }

  // ----------------------------------------------------
  // Cluster creation
  // ----------------------------------------------------
  _createDrumCluster(geo, mats) {
    const cluster = new THREE.Group();
    const kick = new THREE.Mesh(geo, mats.kick);
    kick.userData.role = 'kick';
    cluster.add(kick);

    const snares = [];
    const SN_DIST = 5.0;
    for (const d of Drums._DIRS) {
      const s = new THREE.Mesh(geo, mats.snare);
      s.position.copy(d).multiplyScalar(SN_DIST);
      s.scale.setScalar(0.6);
      s.userData.role = 'snare';
      cluster.add(s);
      snares.push(s);
    }

    const hats = [];
    const AXIAL = 0.5, SPREAD = 0.5;
    const tmp = new THREE.Vector3(), d = new THREE.Vector3(), u = new THREE.Vector3(), v = new THREE.Vector3();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const addHat = (pos, scale = 0.25) => {
      const h = new THREE.Mesh(geo, mats.hat);
      h.position.copy(pos);
      h.scale.setScalar(scale);
      h.userData.role = 'hat';
      cluster.add(h);
      hats.push(h);
    };
    for (const s of snares) {
      d.copy(s.position).normalize();
      u.copy(Math.abs(d.dot(worldUp)) > 0.9 ? new THREE.Vector3(1,0,0) : worldUp).cross(d).normalize();
      v.copy(d).cross(u).normalize();
      addHat(tmp.copy(s.position).addScaledVector(d, AXIAL));
      addHat(tmp.copy(s.position).addScaledVector(u, SPREAD));
      addHat(tmp.copy(s.position).addScaledVector(u, -SPREAD));
      addHat(tmp.copy(s.position).addScaledVector(v, SPREAD));
      addHat(tmp.copy(s.position).addScaledVector(v, -SPREAD));
    }

    cluster.userData = { kick, snares, hats };
    return cluster;
  }

  _shareResources(group) {
    group.traverse((o) => {
      if (!o.isMesh) return;
      o.geometry = this._sharedGeo;
      const role = o.userData?.role;
      if (role && this._sharedMaterials[role]) o.material = this._sharedMaterials[role];
    });
  }

  _rehydrateClusterUserData(group) {
    let kick = null; const snares = []; const hats = [];
    group.traverse((o) => {
      if (!o.isMesh) return;
      const role = o.userData?.role;
      if (role === 'kick') kick = o;
      else if (role === 'snare') snares.push(o);
      else if (role === 'hat') hats.push(o);
    });
    group.userData = { kick, snares, hats };
  }

  // ----------------------------------------------------
  // Debug UI (same as before, minus trail control)
  // ----------------------------------------------------
  _createDebugUI() {
    if (document.getElementById('drums-debug')) return;
    const ui = document.createElement('div');
    ui.id = 'drums-debug';
    Object.assign(ui.style, {
      position: 'fixed', bottom: '20px', left: '10px', zIndex: 9999,
      background: 'rgba(255, 255, 255, 0.08)', color: '#0ff',
      fontFamily: 'ui-monospace, monospace',
      fontSize: '8px', padding: '5px', borderRadius: '8px',
      width: '260px', overflowY: 'auto',
      boxShadow: '0 0 12px rgba(0,255,255,0.25)',
    });
    ui.innerHTML = '<b>🥁 Drums Debug</b><br><small>Now using global trails/bloom</small>';
    document.body.appendChild(ui);
  }
}

// Static basis
Drums._DIRS = [
  new THREE.Vector3(+1, 0, 0), new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, +1, 0), new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, +1), new THREE.Vector3(0, 0, -1)
];
