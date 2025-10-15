// ======================================================
// 🥁 Drums.js — v3.0 “Full Range Debug UI”
// ------------------------------------------------------
// - Kick/Snare/Hat → X/Y/Z axis rotation
// - Massive debug panel (bottom-left), collapsible sections
// - Wide experimental ranges (negatives allowed where sensible)
// - Live updates for rotation, scale, emissive, envelopes, bands, trails
// - Trail framebuffer persistence kept
// ======================================================

import * as THREE from 'three';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

export class Drums {
  constructor(scene = null, renderer = null, camera = null) {
    // ---------- Geometry / Material ----------
    this._sharedGeo = new THREE.IcosahedronGeometry(0.7, 6);
    const matBase = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 1,
      roughness: 0,
      emissive: 0x000000,
      envMapIntensity: 10.2,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this._sharedMaterials = {
      kick: matBase,
      snare: matBase.clone(),
      hat: matBase.clone()
    };

    this.root = new THREE.Group();
    scene?.add(this.root);

    this.cluster = this._createDrumCluster(this._sharedGeo, this._sharedMaterials);
    this._shareResources(this.cluster);
    this.root.add(this.cluster);

    // ---------- Shared scratch values ----------
    this._combinedAxis = new THREE.Vector3();
    this._axisX = new THREE.Vector3(1, 0, 0);
    this._axisY = new THREE.Vector3(0, 1, 0);
    this._axisZ = new THREE.Vector3(0, 0, 1);
    this._quat = new THREE.Quaternion();
    this._twistOffset = new THREE.Vector3();
    this._kickColor = new THREE.Color();
    this._snareColor = new THREE.Color();
    this._hatColor = new THREE.Color();
    this._trailSize = new THREE.Vector2();
    this._trailRenderer = null;
    this._lastTrailWidth = 0;
    this._lastTrailHeight = 0;
    this._lastTrailPixelRatio = 0;
    this._fractalDirections = [
      new THREE.Vector3(+1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, +1, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, +1),
      new THREE.Vector3(0, 0, -1)
    ];
    this._fractalDirScratch = new THREE.Vector3();

    // ---------- Fractal copies ----------
    this.fractalLayers = [];
    this._allClusters = [this.cluster];
    // ---------- Fractal copies ----------
    this.fractalLayers = [];
    this._createFractalLayer(this.root, this.cluster, 2, 0.8, 1.5);

    // ---------- State ----------
    this._kickEnv = this._snareEnv = this._hatEnv = 0;
    this._rotAxis = new THREE.Vector3(0.6, 1.0, 0.4).normalize();
    this._rotAxisTarget = this._rotAxis.clone();

    // ---------- Parameters (HUGE experimental ranges) ----------
    this.params = {
      // Rotation
      kickSpinScale: 4.0,        // [-1000..1000]
      snareSpinScale: 6.0,       // [-1000..1000]
      hatSpinScale: 8.0,         // [-1000..1000]
      axisLerp: 0.08,            // [-1..1] (clamped to >=0 on use)
      totalSpinScale: 0.2,       // [-1000..1000] (sign flips spin)
      randomTwistChance: 0.01,   // [-1..1] (clamped to [0..1])

      // Scale response (final scale clamped to >= 0.01)
      kickScaleBase: 1.0,        // [-5..5]
      kickScaleMult: 0.4,        // [-1000..1000]
      snareScaleBase: 0.5,       // [-5..5]
      snareScaleMult: 0.4,       // [-1000..1000]
      hatScaleBase: 0.25,        // [-5..5]
      hatScaleMult: 0.3,         // [-1000..1000]

      // Emissive multipliers (clamped to >=0 at use)
      kickEmissiveMult: 4.0,     // [-1000..1000]
      snareEmissiveMult: 3.0,    // [-1000..1000]
      hatEmissiveMult: 2.5,      // [-1000..1000]

      // Envelopes (per band)
      attackKick: 50,  releaseKick: 5,     // [0..1000]
      attackSnare: 50, releaseSnare: 5,    // [0..1000]
      attackHat: 50,   releaseHat: 5,      // [0..1000]

      // Frequency bands (Hz) — order-insensitive; sorted internally
      kickBandLow: 60,   kickBandHigh: 120,     // [0..20000]
      snareBandLow: 700, snareBandHigh: 2000,   // [0..20000]
      hatBandLow: 7000,  hatBandHigh: 8000,     // [0..20000]

      // Trails
      afterimageDamp: 0.8,          // [-10..10] (clamped to [0..0.999])
      trailResolutionScale: 0.5     // [0.1..1] (downscales FBO resolution)
      afterimageDamp: 0.8           // [-10..10] (clamped to [0..0.999])
    };

    // ---------- Trails ----------
    if (renderer && camera && scene) this._setupTrails(renderer, scene, camera);

    // ---------- Debug UI ----------
    this._createDebugUI();
  }

  // ======================================================
  // 🌠 Trail persistence compositor
  // ======================================================
  _setupTrails(renderer, scene, camera) {
    this._trailRenderer = renderer;
    this._composer = new EffectComposer(renderer);
    this._composer.addPass(new RenderPass(scene, camera));
    this._afterimage = new AfterimagePass();
    this._afterimage.uniforms['damp'].value = this._clampTrail(this.params.afterimageDamp);
    this._composer.addPass(this._afterimage);
    this._hasTrails = true;
    this._updateTrailResolution();
  }

  // ======================================================
  // 🧰 Debug UI (collapsible, bottom-left)
  // ======================================================
  _createDebugUI() {
    if (document.getElementById('drums-debug')) return; // avoid duplicates

    const ui = document.createElement('div');
    ui.id = 'drums-debug';
    Object.assign(ui.style, {
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.65)',
      color: '#0ff',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: '12px',
      padding: '10px',
      borderRadius: '10px',
      zIndex: 9999,
      width: '260px',
      maxHeight: '50vh',
      overflowY: 'auto',
      boxShadow: '0 0 12px rgba(0,255,255,0.25)',
      border: '1px solid rgba(0,255,255,0.15)'
    });

    // Title + collapse-all
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '6px';
    header.innerHTML = `<b>🥁 Drums Debug</b>`;
    const collapseAllBtn = document.createElement('button');
    collapseAllBtn.textContent = 'toggle';
    Object.assign(collapseAllBtn.style, {
      background: 'transparent', color: '#0ff', border: '1px solid #066',
      padding: '2px 6px', borderRadius: '6px', cursor: 'pointer'
    });
    header.appendChild(collapseAllBtn);
    ui.appendChild(header);

    const makeSection = (title) => {
      const sec = document.createElement('div');
      sec.style.margin = '8px 0 10px 0';
      const bar = document.createElement('div');
      Object.assign(bar.style, {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', padding: '4px 0', color: '#8ff'
      });
      const label = document.createElement('span');
      label.textContent = title;
      const chevron = document.createElement('span');
      chevron.textContent = '▼';
      chevron.style.opacity = '0.8';
      bar.appendChild(label); bar.appendChild(chevron);
      const body = document.createElement('div');
      body.style.marginTop = '6px';
      bar.onclick = () => {
        const vis = body.style.display !== 'none';
        body.style.display = vis ? 'none' : 'block';
        chevron.textContent = vis ? '►' : '▼';
      };
      sec.appendChild(bar);
      sec.appendChild(body);
      ui.appendChild(sec);
      return body;
    };

    const addSlider = (container, label, key, min, max, step = 0.01) => {
      const wrap = document.createElement('div');
      wrap.style.margin = '6px 0';
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';

      const text = document.createElement('label');
      text.textContent = label;
      text.style.flex = '1';

      const val = document.createElement('input');
      val.type = 'number';
      val.value = this.params[key];
      Object.assign(val.style, { width: '76px', marginLeft: '8px', background: '#001417', color: '#bff', border: '1px solid #055', borderRadius: '4px', padding: '2px 4px' });

      const input = document.createElement('input');
      Object.assign(input, { type: 'range', min, max, step, value: this.params[key] });
      Object.assign(input.style, { width: '100%', accentColor: '#0ff' });

      // Sync functions
      const apply = (v) => {
        let num = parseFloat(v);
        if (!Number.isFinite(num)) return;
        if (key === 'afterimageDamp') num = this._clampTrail(num);
        else if (key === 'trailResolutionScale') num = this._clampTrailScale(num);

        const num = parseFloat(v);
        if (!Number.isFinite(num)) return;
        this.params[key] = num;
        input.value = String(num);
        val.value = String(num);

        // live side-effects
        if (key === 'afterimageDamp' && this._afterimage) {
          this._afterimage.uniforms['damp'].value = num;
        } else if (key === 'trailResolutionScale') {
          this._updateTrailResolution();
          this._afterimage.uniforms['damp'].value = this._clampTrail(num);
        }
      };

      input.oninput = (e) => apply(e.target.value);
      val.onchange = (e) => apply(e.target.value);

      row.appendChild(text);
      row.appendChild(val);
      wrap.appendChild(row);
      wrap.appendChild(input);
      container.appendChild(wrap);
    };

    // ---- Sections + sliders ----
    const rot = makeSection('Rotation');
    addSlider(rot, 'Kick Spin', 'kickSpinScale', -1000, 1000, 0.1);
    addSlider(rot, 'Snare Spin', 'snareSpinScale', -1000, 1000, 0.1);
    addSlider(rot, 'Hat Spin', 'hatSpinScale', -1000, 1000, 0.1);
    addSlider(rot, 'Axis Lerp', 'axisLerp', -1, 1, 0.005);
    addSlider(rot, 'Spin Scale', 'totalSpinScale', -1000, 1000, 0.01);
    addSlider(rot, 'Twist Chance', 'randomTwistChance', -1, 1, 0.001);

    const scl = makeSection('Scale');
    addSlider(scl, 'Kick Base', 'kickScaleBase', -5, 5, 0.01);
    addSlider(scl, 'Kick Mult', 'kickScaleMult', -1000, 1000, 0.1);
    addSlider(scl, 'Snare Base', 'snareScaleBase', -5, 5, 0.01);
    addSlider(scl, 'Snare Mult', 'snareScaleMult', -1000, 1000, 0.1);
    addSlider(scl, 'Hat Base', 'hatScaleBase', -5, 5, 0.01);
    addSlider(scl, 'Hat Mult', 'hatScaleMult', -1000, 1000, 0.1);

    const emi = makeSection('Emissive');
    addSlider(emi, 'Kick Emissive', 'kickEmissiveMult', -1000, 1000, 0.1);
    addSlider(emi, 'Snare Emissive', 'snareEmissiveMult', -1000, 1000, 0.1);
    addSlider(emi, 'Hat Emissive', 'hatEmissiveMult', -1000, 1000, 0.1);

    const env = makeSection('Envelopes');
    addSlider(env, 'Atk Kick', 'attackKick', 0, 1000, 1);
    addSlider(env, 'Rel Kick', 'releaseKick', 0, 1000, 1);
    addSlider(env, 'Atk Snare', 'attackSnare', 0, 1000, 1);
    addSlider(env, 'Rel Snare', 'releaseSnare', 0, 1000, 1);
    addSlider(env, 'Atk Hat', 'attackHat', 0, 1000, 1);
    addSlider(env, 'Rel Hat', 'releaseHat', 0, 1000, 1);

    const fft = makeSection('FFT Bands (Hz)');
    addSlider(fft, 'Kick Low', 'kickBandLow', 0, 20000, 1);
    addSlider(fft, 'Kick High', 'kickBandHigh', 0, 20000, 1);
    addSlider(fft, 'Snare Low', 'snareBandLow', 0, 20000, 1);
    addSlider(fft, 'Snare High', 'snareBandHigh', 0, 20000, 1);
    addSlider(fft, 'Hat Low', 'hatBandLow', 0, 20000, 1);
    addSlider(fft, 'Hat High', 'hatBandHigh', 0, 20000, 1);

    const trl = makeSection('Trails');
    addSlider(trl, 'Trail Damp', 'afterimageDamp', -10, 10, 0.01);
    addSlider(trl, 'Trail Res Scale', 'trailResolutionScale', 0.1, 1, 0.05);

    // collapse/expand all
    collapseAllBtn.onclick = () => {
      [...ui.querySelectorAll('div > div > div')].forEach((body) => {
        if (body.style && body.style.display !== 'none') body.style.display = 'none';
      });
      ui.querySelectorAll('span').forEach((s) => { if (s.textContent === '▼') s.textContent = '►'; });
    };

    document.body.appendChild(ui);
  }

  // ======================================================
  // 🧩 Cluster / fractal helpers
  // ======================================================
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

  _shareResources(group) {
    group.traverse((o) => {
      if (!o.isMesh) return;
      o.geometry = this._sharedGeo;
      const role = o.userData?.role;
      if (role && this._sharedMaterials[role]) {
        o.material = this._sharedMaterials[role];
      }
    });
  }

  // ======================================================
  // 🔄 Update — rotation, symmetry, energy mapping
  // ======================================================
  update(_, dt = 0.016, renderer = null, scene = null, camera = null) {
    const soil = window.audio;
    if (!soil?.hasStem('drums')) return;

    const s = soil.stems['drums'];
    s.ana.getByteFrequencyData(s.data);
    const arr = s.data, len = arr.length, nyq = soil.ctx.sampleRate / 2;

    // band helper (order-insensitive)
    const band = (lo, hi) => {
      const a = Math.max(0, Math.min(lo, hi));
      const b = Math.max(0, Math.max(lo, hi));
      const i1 = Math.floor((a / nyq) * len);
      const i2 = Math.floor((b / nyq) * len);
      if (i2 <= i1) return 0;
      let sum = 0;
      for (let i = i1; i < i2; i++) sum += arr[i];
      return (sum / Math.max(1, i2 - i1)) / 255;
    };

    const ps = this.params;

    const kick = band(ps.kickBandLow,  ps.kickBandHigh);
    const snare = band(ps.snareBandLow, ps.snareBandHigh);
    const hat = band(ps.hatBandLow,    ps.hatBandHigh);

    // envelopes (per band), attack/release clamped >=0
    const smooth = (v, t, atk, rel) => {
      const A = Math.max(0, atk), R = Math.max(0, rel);
      return v + (t - v) * (t > v ? A : R) * dt;
    };
    this._kickEnv  = smooth(this._kickEnv,  kick,  ps.attackKick,  ps.releaseKick);
    this._snareEnv = smooth(this._snareEnv, snare, ps.attackSnare, ps.releaseSnare);
    this._hatEnv   = smooth(this._hatEnv,   hat,   ps.attackHat,   ps.releaseHat);

    // --- Axis-mapped rotation (with experimental ranges) ---
    const kickSpin  = this._kickEnv  * ps.kickSpinScale;
    const snareSpin = this._snareEnv * ps.snareSpinScale;
    const hatSpin   = this._hatEnv   * ps.hatSpinScale;

    const combinedAxis = this._combinedAxis;
    combinedAxis.copy(this._axisX).multiplyScalar(kickSpin);
    combinedAxis.addScaledVector(this._axisY, snareSpin);
    combinedAxis.addScaledVector(this._axisZ, hatSpin);
    const combinedAxis = new THREE.Vector3()
      .addScaledVector(new THREE.Vector3(1, 0, 0), kickSpin)
      .addScaledVector(new THREE.Vector3(0, 1, 0), snareSpin)
      .addScaledVector(new THREE.Vector3(0, 0, 1), hatSpin);

    // avoid NaN when all spins are 0
    if (combinedAxis.lengthSq() > 1e-8) combinedAxis.normalize(); else combinedAxis.set(0,1,0);

    const totalSpin = (kickSpin + snareSpin + hatSpin) * ps.totalSpinScale;

    // clamp risky params at use
    const safeLerp = Math.max(0, ps.axisLerp);
    const twistP = THREE.MathUtils.clamp(ps.randomTwistChance, 0, 1);

    this._rotAxisTarget.copy(combinedAxis);
    this._rotAxis.lerp(this._rotAxisTarget, safeLerp);

    const quat = this._quat.setFromAxisAngle(this._rotAxis, totalSpin * dt);
    this.root.quaternion.multiplyQuaternions(quat, this.root.quaternion);

    if (Math.random() < twistP && Math.abs(totalSpin) > 0.02) {
      this._twistOffset.set(
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 0.4
      );
      this._rotAxisTarget.add(this._twistOffset).normalize();
    const quat = new THREE.Quaternion().setFromAxisAngle(this._rotAxis, totalSpin * dt);
    this.root.quaternion.multiplyQuaternions(quat, this.root.quaternion);

    if (Math.random() < twistP && Math.abs(totalSpin) > 0.02) {
      this._rotAxisTarget.add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        )
      ).normalize();
    }

    // --- Visuals (scale + emissive with clamps) ---
    const kScale = Math.max(0.01, ps.kickScaleBase  + this._kickEnv  * ps.kickScaleMult);
    const sScale = Math.max(0.01, ps.snareScaleBase + this._snareEnv * ps.snareScaleMult);
    const hScale = Math.max(0.01, ps.hatScaleBase   + this._hatEnv   * ps.hatScaleMult);

    const kEm = Math.max(0, this._kickEnv  * ps.kickEmissiveMult);
    const sEm = Math.max(0, this._snareEnv * ps.snareEmissiveMult);
    const hEm = Math.max(0, this._hatEnv   * ps.hatEmissiveMult);

    const kickCol = this._kickColor.set(0xff0000).multiplyScalar(kEm);
    const snareCol = this._snareColor.set(0x0088ff).multiplyScalar(sEm);
    const hatCol = this._hatColor.set(0x00ff88).multiplyScalar(hEm);

    for (const c of this._allClusters) {
    const kickCol  = new THREE.Color(0xff0000).multiplyScalar(kEm);
    const snareCol = new THREE.Color(0x0088ff).multiplyScalar(sEm);
    const hatCol   = new THREE.Color(0x00ff88).multiplyScalar(hEm);

    const allClusters = [this.cluster, ...this.fractalLayers];
    for (const c of allClusters) {
      const ud = c.userData;
      if (!ud || !ud.kick) continue;

      ud.kick.scale.setScalar(kScale);
      ud.kick.material.emissive.copy(kickCol);

      for (const s of ud.snares) {
        s.scale.setScalar(sScale);
        s.material.emissive.copy(snareCol);
      }
      for (const h of ud.hats) {
        h.scale.setScalar(hScale);
        h.material.emissive.copy(hatCol);
      }
    }

    if (this._hasTrails && renderer && scene && camera) {
      if (renderer !== this._trailRenderer) {
        this._trailRenderer = renderer;
      }
      this._ensureTrailResolutionSync(renderer);
      this._composer.render();
    }
    if (this._hasTrails && renderer && scene && camera) this._composer.render();
  }

  // ===== Utils =====
  _clampTrail(v) { return THREE.MathUtils.clamp(v, 0, 0.999); }

  _clampTrailScale(v) { return THREE.MathUtils.clamp(v, 0.1, 1); }

  _updateTrailResolution() {
    if (!this._composer || !this._trailRenderer) return;
    const scale = this._clampTrailScale(this.params.trailResolutionScale ?? 1);
    const renderer = this._trailRenderer;
    renderer.getSize(this._trailSize);
    const basePixelRatio = renderer.getPixelRatio();
    const pixelRatio = basePixelRatio * scale;
    this._composer.setPixelRatio(pixelRatio);
    this._composer.setSize(this._trailSize.x, this._trailSize.y);
    this._lastTrailWidth = this._trailSize.x;
    this._lastTrailHeight = this._trailSize.y;
    this._lastTrailPixelRatio = basePixelRatio;
  }

  _ensureTrailResolutionSync(renderer) {
    if (!renderer || renderer !== this._trailRenderer) return;
    renderer.getSize(this._trailSize);
    const width = this._trailSize.x;
    const height = this._trailSize.y;
    const pixelRatio = renderer.getPixelRatio();
    if (
      width !== this._lastTrailWidth ||
      height !== this._lastTrailHeight ||
      pixelRatio !== this._lastTrailPixelRatio
    ) {
      this._updateTrailResolution();
    }
  }


  // ======================================================
  // 🧮 Fractal replication
  // ======================================================
  _createFractalLayer(parent, baseCluster, depth, scaleDecay, dist) {
    if (depth <= 0) return;
    for (const dir of this._fractalDirections) {
    const dirs = [
      new THREE.Vector3(+1, 0, 0), new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, +1, 0), new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, +1), new THREE.Vector3(0, 0, -1)
    ];
    for (const dir of dirs) {
      const clone = baseCluster.clone(true);
      this._shareResources(clone);
      this._rehydrateClusterUserData(clone);
      const scale = Math.pow(scaleDecay, (4 - depth));
      clone.scale.setScalar(scale);
      this._fractalDirScratch.copy(dir).multiplyScalar(dist * (4 - depth));
      clone.position.copy(this._fractalDirScratch);
      parent.add(clone);
      this.fractalLayers.push(clone);
      this._allClusters.push(clone);
      clone.position.copy(dir.clone().multiplyScalar(dist * (4 - depth)));
      parent.add(clone);
      this.fractalLayers.push(clone);
      this._createFractalLayer(clone, baseCluster, depth - 1, scaleDecay, dist * scaleDecay);
    }
  }

  _createDrumCluster(geo, mats) {
    const cluster = new THREE.Group();
    const kick = new THREE.Mesh(geo, mats.kick);
    kick.userData.role = 'kick';
    cluster.add(kick);

    const snares = [];
    const SN_DIST = 5.0;
    const snOffsets = [
      new THREE.Vector3(+SN_DIST, 0, 0),
      new THREE.Vector3(-SN_DIST, 0, 0),
      new THREE.Vector3(0, +SN_DIST, 0),
      new THREE.Vector3(0, -SN_DIST, 0),
      new THREE.Vector3(0, 0, +SN_DIST),
      new THREE.Vector3(0, 0, -SN_DIST)
    ];
    for (const o of snOffsets) {
      const s = new THREE.Mesh(geo, mats.snare);
      s.position.copy(o);
      s.scale.setScalar(0.6);
      s.userData.role = 'snare';
      cluster.add(s);
      snares.push(s);
    }

    const hats = [];
    const AXIAL = 0.5, SPREAD = 0.5;
    const tmp = new THREE.Vector3(), d = new THREE.Vector3(), u = new THREE.Vector3(), v = new THREE.Vector3();
    const worldUp = new THREE.Vector3(0, 1, 0);
    const makeHat = (pos, scale = 0.25) => {
      const h = new THREE.Mesh(geo, mats.hat);
      h.position.copy(pos);
      h.scale.setScalar(scale);
      h.userData.role = 'hat';
      cluster.add(h);
      hats.push(h);
    };
    for (const s of snares) {
      d.copy(s.position).normalize();
      u.copy(Math.abs(d.dot(worldUp)) > 0.9 ? new THREE.Vector3(1, 0, 0) : worldUp).cross(d).normalize();
      v.copy(d).cross(u).normalize();
      makeHat(tmp.copy(s.position).addScaledVector(d, AXIAL));
      makeHat(tmp.copy(s.position).addScaledVector(u, SPREAD));
      makeHat(tmp.copy(s.position).addScaledVector(u, -SPREAD));
      makeHat(tmp.copy(s.position).addScaledVector(v, SPREAD));
      makeHat(tmp.copy(s.position).addScaledVector(v, -SPREAD));
    }
    cluster.userData = { kick, snares, hats };
    return cluster;
  }
}
