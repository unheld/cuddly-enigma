// ======================================================
// 🌌 VisualSoil3D.js — GLYPH v1.5 “Rainbow Nave Lightspace”
// ------------------------------------------------------
// - Uses nave.hdr as environment map
// - Adds rainbow spectrum fade across all lights
// - Lights pulse gently with global audio energy
// - Keeps additive volumetric glow + bloom
// ======================================================

import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class VisualSoil3D {
  constructor(canvasSelector = '#gl3d') {
    // ---------- Renderer ----------
    this.canvas = document.querySelector(canvasSelector);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    const ratio = window.devicePixelRatio > 1.5 ? 1.25 : window.devicePixelRatio;
    this.renderer.setPixelRatio(ratio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = false;

    // ---------- Scene & Camera ----------
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.FogExp2(0x000010, 0.04);
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(0, 0, 0);

    // ---------- Components ----------
    this._initLighting();
    this._initEnvironment();
    this._addDustParticles();
    this._initPostFX();

    this.nodes = [];

    window.addEventListener('resize', () => this.resize());
    this.resize();

    console.log('%c[3D Soil] v1.5 Rainbow Nave Lightspace ready', 'color:#0ff');
  }

  // ======================================================
  // 🌈 LIGHTING — Rainbow Hue Shift + Pulse
  // ======================================================
  _initLighting() {
    // --- Primary lights ---
    this.keyLight = new THREE.PointLight(0xffffff, 80, 40, 2.5);
    this.keyLight.position.set(0, 0, 0);
    this.scene.add(this.keyLight);

    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    this.rimLight.position.set(3, 2, 5);
    this.scene.add(this.rimLight);

    this.ambientLight = new THREE.HemisphereLight(0xffffff, 0x111122, 0.3);
    this.scene.add(this.ambientLight);

    // --- Animation state ---
    this._lightCtl = {
      hue: 0,               // hue in degrees
      hueSpeed: 10,         // how fast the hue rotates per second
      pulsePhase: 0,        // sine phase
      pulseSpeed: .10,      // speed of pulsing
      audioReactive: true,  // link to global audio energy
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

    const pulse = (Math.sin(L.pulsePhase) + 1) * 0.5; // 0..1
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
  // 🌁 ENVIRONMENT — Load nave.hdr locally
  // ======================================================
  _initEnvironment() {
    const hdrURL = './new.hdr'; // local file in GLYPH folder
    new RGBELoader().load(hdrURL, (hdrTex) => {
      hdrTex.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = hdrTex;
      this.scene.background = hdrTex; // visible background
      console.log('%cLoaded hdr successfully', 'color:#ff6');
    }, undefined, (err) => {
      console.warn('HDR load error:', err);
    });
  }

  _addDustParticles() {
    const count = 200;
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

  _initPostFX() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0, 0.5, 0.85
    );
    this.composer.addPass(bloom);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 },
        beat: { value: 0 },
        color: { value: new THREE.Color(0xff55ff) },
        intensity: { value: 1.5 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){vUv=uv;gl_Position=vec4(position,1.0);}
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

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.composer?.setSize(window.innerWidth, window.innerHeight);
  }

  addNode(node) {
    if (node?.object3D) this.scene.add(node.object3D);
    this.nodes.push(node);
  }

  // ======================================================
  // 🔁 Frame Update — global sync
  // ======================================================
  update(energies, dt = 0.016) {
    const t = performance.now() * 0.001;
    const globalEnergy = energies?.global ?? 0;

    this._updateLighting(dt, energies);

    let usedComposer = false;
    for (const node of this.nodes) {
      try {
        if (node._hasTrails && node._composer && typeof node._composer.render === 'function') {
          node.update?.(energies, dt, this.renderer, this.scene, this.camera);
          node._composer.render();
          usedComposer = true;
        } else {
          node.update?.(energies, dt, this.renderer, this.scene, this.camera);
        }
      } catch (e) {
        console.warn('[3D Node Error]', e);
      }
    }

    if (this.dust) {
      this.dust.rotation.y += dt * 0.05;
      const pos = this.dust.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += Math.sin(t + i * 0.03) * 0.0008;
      }
      this.dust.geometry.attributes.position.needsUpdate = true;
    }

    this.camera.position.x = Math.sin(t * 0.05) * 10; // left-right
    this.camera.position.y = Math.sin(t * 2.09) * 0; // up-down
    this.camera.position.z = Math.cos(t * 0.05) * 10; // in-out
    this.camera.lookAt(0, 0, 0);

    if (!usedComposer && this.composer) this.composer.render();

    this._glow.mat.uniforms.time.value = t;
    this._glow.mat.uniforms.beat.value = globalEnergy * 1.2;
    this.renderer.autoClear = false;
    this.renderer.render(this._glow.scene, this._glow.cam);
    this.renderer.autoClear = true;
  }
}
