// ======================================================
// 🌌 VisualSoil3D.js — GLYPH v1.7 “Unified Trails & Bloom”
// ------------------------------------------------------
// - Single global composer (RenderPass → Afterimage → Bloom)
// - No per-node composers; nodes only update meshes/materials
// - Correct sRGB/ACES pipeline, matched pixel ratios & sizes
// - Safe trail clearing (prevents bloom blowout when toggling)
// - Proper bloom sizing (no square/tiling artifacts)
// - Smooth opacity fades that preserve base material opacity
// ======================================================

import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';

export class VisualSoil3D {
  constructor(canvasSelector = '#gl3d') {
    // ---------- Renderer ----------
    this.canvas = document.querySelector(canvasSelector);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });

    // Keep pixel ratio sane to avoid tiny blur kernels / block artifacts
    const pxr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(pxr);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Modern color pipeline
    // (outputEncoding is deprecated in newer three; use outputColorSpace if available)
    if ('outputColorSpace' in this.renderer) {
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else {
      // Fallback for older three
      this.renderer.outputEncoding = THREE.sRGBEncoding;
    }

    this.renderer.setClearColor(0x000000, 1);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0; // keep neutral; let emissive drive bloom
    this.renderer.shadowMap.enabled = false;

    // ---------- Scene & Camera ----------
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.FogExp2(0x000010, 0.04);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    // Start a bit back so we see geometry (avoid z=0)
    this.camera.position.set(0, 0, 10);

    // ---------- Components ----------
    this._initLighting();
    this._initEnvironment();
    this._addDustParticles();
    this._initPostFX(pxr);

    this.nodes = [];
    this._trailConfig = { damp: 0.2, clearFrames: 0 }; // global trail cfg

    window.addEventListener('resize', () => this.resize());
    this.resize();

    console.log('%c[3D Soil] v1.7 Unified Trails & Bloom ready', 'color:#0ff');
  }

  // ======================================================
  // 🌈 LIGHTING — Rainbow Hue Shift + Pulse
  // ======================================================
  _initLighting() {
    this.keyLight = new THREE.PointLight(0xffffff, 80, 40, 2.5);
    this.keyLight.position.set(0, 0, 0);
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    this.rimLight.position.set(3, 2, 5);
    this.scene.add(this.rimLight);

    this.ambientLight = new THREE.HemisphereLight(0xffffff, 0x111122, 0.3);
    this.scene.add(this.ambientLight);

    this._lightCtl = {
      hue: 0,
      hueSpeed: 10,
      pulsePhase: 0,
      pulseSpeed: 0.1,
      audioReactive: true,
      keyBase: 0, keyRange: 360000,
      rimBase: 0, rimRange: 360000,
      ambBase: 0, ambRange: 360000
    };
  }

  _updateLighting(dt = 0.016, energies) {
    const L = this._lightCtl;
    if (!L) return;

    L.hue = (L.hue + L.hueSpeed * dt) % 360;
    L.pulsePhase += Math.PI * 2 * L.pulseSpeed * dt;

    const pulse = (Math.sin(L.pulsePhase) + 1) * 0.5;
    const energy = L.audioReactive ? (0.6 + (energies?.global ?? 0) * 1.0) : 1.0;

    const hKey = L.hue / 360;
    const hRim = ((L.hue + 120) % 360) / 360;
    const hAmb = ((L.hue + 240) % 360) / 360;

    this.keyLight.color.setHSL(hKey, 1.0, 0.6);
    this.rimLight.color.setHSL(hRim, 1.0, 0.5);
    this.ambientLight.color.setHSL(hAmb, 0.8, 0.6);
    this.ambientLight.groundColor.setHSL(hAmb, 0.6, 0.25);

    this.keyLight.intensity = (L.keyBase + L.keyRange * pulse) * energy;
    this.rimLight.intensity = (L.rimBase + L.rimRange * pulse) * energy;
    this.ambientLight.intensity = (L.ambBase + L.ambRange * pulse) * energy;
  }

  // ======================================================
  // 🌁 ENVIRONMENT — Load hdr locally
  // ======================================================
  _initEnvironment() {
    const hdrURL = './new.hdr';
    new RGBELoader().load(
      hdrURL,
      (hdrTex) => {
        hdrTex.mapping = THREE.EquirectangularReflectionMapping;
        this.scene.environment = hdrTex;
        this.scene.background = hdrTex;
        console.log('%cLoaded hdr successfully', 'color:#ff6');
      },
      undefined,
      (err) => console.warn('HDR load error:', err)
    );
  }

  _addDustParticles() {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.03,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.dust = new THREE.Points(geo, mat);
    this.scene.add(this.dust);
  }

  _initPostFX(pixelRatio = 1) {
    // --- Global post chain ---
    this.composer = new EffectComposer(this.renderer);
    this.composer.setPixelRatio?.(pixelRatio);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    // Afterimage (global trails)
    this.afterimagePass = new AfterimagePass(this._trailConfig?.damp ?? 0.55);
    this.composer.addPass(this.afterimagePass);

    // Bloom (global glow) — sane defaults (no squares/tiling)
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.05,  // strength
      0.4,   // radius
      0.6    // threshold
    );
    this.composer.addPass(this.bloomPass);

    // Overlay shader (post-composer)
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        beat: { value: 0 },
        color: { value: new THREE.Color(0xff55ff) },
        intensity: { value: 0.9 } // slightly calmer default
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){ vUv=uv; gl_Position=vec4(position,1.0); }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform vec3 color;
        uniform float time;
        uniform float beat;
        uniform float intensity;
        void main(){
          vec4 base = texture2D(tDiffuse, vUv);
          float d = distance(vUv, vec2(0.5));
          float radial = smoothstep(0.8, 0.0, d);
          float pulse = (0.5 + 0.5 * sin(time*1.5)) + beat*1.5;
          vec3 glow = color * radial * pulse * intensity;
          gl_FragColor = vec4(base.rgb + glow, 1.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat);
    const overlayScene = new THREE.Scene();
    const overlayCam = new THREE.Camera();
    overlayScene.add(quad);
    this._glow = { mat, scene: overlayScene, cam: overlayCam };
  }

  // Public helpers for trails/bloom
  setTrailDamp(v) {
    const val = THREE.MathUtils.clamp(v, 0, 0.999);
    this._trailConfig.damp = val;
    if (this.afterimagePass) this.afterimagePass.uniforms.damp.value = val;
  }
  clearTrails(frames = 2) { // force-clear ghost buffers safely over a couple frames
    this._trailConfig.clearFrames = Math.max(1, Math.min(5, frames));
  }
  setBloom({ strength, radius, threshold } = {}) {
    if (!this.bloomPass) return;
    if (strength !== undefined) this.bloomPass.strength = strength;
    if (radius !== undefined) this.bloomPass.radius = radius;
    if (threshold !== undefined) this.bloomPass.threshold = threshold;
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.renderer.setSize(w, h);
    // Keep composer & bloom in sync with renderer size to avoid tiling/squares
    this.composer?.setSize(w, h);
    this.bloomPass?.setSize?.(w, h); // exists on newer three; safe-guarded

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // ======================================================
  // 🧩 Node Management — Preserved Transparency Fade
  // ======================================================
  addNode(node) {
    if (!node) return;
    const obj = node.root || node.object3D;
    if (!obj) return;
    if (!this.scene.children.includes(obj)) this.scene.add(obj);
    if (!this.nodes.includes(node)) this.nodes.push(node);
    this._fadeObject(obj, true);
    this.clearTrails(2); // refresh trails when new visuals appear
  }

  removeNode(node) {
    if (!node) return;
    const obj = node.root || node.object3D;
    if (!obj) return;
    this._fadeObject(obj, false, () => {
      if (this.scene.children.includes(obj)) this.scene.remove(obj);
      const i = this.nodes.indexOf(node);
      if (i !== -1) this.nodes.splice(i, 1);
      this.clearTrails(2); // clear ghosting on removal
    });
  }

  toggleNode(node, enable = null) {
    const isActive = this.nodes.includes(node);
    const shouldEnable = enable !== null ? enable : !isActive;
    if (shouldEnable) this.addNode(node);
    else this.removeNode(node);
  }

  // ======================================================
  // ✨ Fade Utility (Accurate Smooth Fade)
  // ======================================================
  _fadeObject(obj, fadeIn = true, onComplete = null) {
    const duration = 0.8; // seconds
    const start = performance.now();
    const mats = [];

    // Capture original opacities once
    obj.traverse?.((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        mat.transparent = true;
        if (mat.userData.baseOpacity === undefined) {
          mat.userData.baseOpacity = mat.opacity ?? 1.0;
        }
        mats.push(mat);
      }
    });

    const loop = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const k = fadeIn ? ease : 1 - ease;

      mats.forEach((mat) => {
        const base = mat.userData.baseOpacity;
        mat.opacity = base * THREE.MathUtils.clamp(k, 0, 1);
      });

      if (t < 1) {
        requestAnimationFrame(loop);
      } else {
        mats.forEach((mat) => {
          const base = mat.userData.baseOpacity;
          mat.opacity = fadeIn ? base : 0;
        });
        if (!fadeIn) obj.visible = false;
        if (onComplete) onComplete();
      }
    };

    obj.visible = true;
    requestAnimationFrame(loop);
  }

  // ======================================================
  // 🔁 Frame Update — global sync
  // ======================================================
  update(energies, dt = 0.016) {
    const t = performance.now() * 0.001;
    const globalEnergy = energies?.global ?? 0;

    // Lighting
    this._updateLighting(dt, energies);

    // Nodes update (no per-node composers!)
    for (const node of this.nodes) {
      try {
        node.update?.(energies, dt, this.renderer, this.scene, this.camera);
      } catch (e) {
        console.warn('[3D Node Error]', e);
      }
    }

    // Dust anim
    if (this.dust) {
      this.dust.rotation.y += dt * 0.05;
      const pos = this.dust.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += Math.sin(t + i * 0.03) * 0.0008;
      }
      this.dust.geometry.attributes.position.needsUpdate = true;
    }

    // Camera drift (keep Z nonzero to avoid “inside geometry” artifacts)
    this.camera.position.x = Math.sin(t * 0.100) * 10;
    this.camera.position.y = Math.sin(t * 0.100) * 10;
    this.camera.position.z = 10 + Math.cos(t * 0.100) * 10;
    this.camera.lookAt(0, 0, 0);

    // ---- Global Trails control ----
    // If there are no active nodes, kill persistence to avoid ghost bloom
    const noNodes = this.nodes.length === 0;
    if (this.afterimagePass) {
      if (this._trailConfig.clearFrames > 0) {
        // flush buffers quickly
        this.afterimagePass.uniforms.damp.value = 0.0;
        this._trailConfig.clearFrames--;
      } else {
        this.afterimagePass.uniforms.damp.value = noNodes ? 0.0 : this._trailConfig.damp;
      }
    }

    // Global render
    if (this.composer) this.composer.render();

    // Overlay glow (post)
    this._glow.mat.uniforms.time.value = t;
    this._glow.mat.uniforms.beat.value = globalEnergy * 1.2;
    this.renderer.autoClear = false;
    this.renderer.render(this._glow.scene, this._glow.cam);
    this.renderer.autoClear = true;
  }
}
