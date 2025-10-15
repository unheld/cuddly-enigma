// ======================================================
// 🌌 VisualSoil3D.js — GLYPH v1.4 “Visible God-Glow”
// ------------------------------------------------------
// - Strong additive volumetric glow (no CORS)
// - Reacts to global audio energy
// - Tuned bloom + additive overlay pass
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
    this.camera.position.set(0, 0, 8);

    // ---------- Components ----------
    this._initLighting();
    this._initEnvironment();
    this._addDustParticles();
    this._initPostFX();

    this.nodes = [];

    window.addEventListener('resize', () => this.resize());
    this.resize();

    console.log('%c[3D Soil] v1.4 Visible God-Glow ready', 'color:#0ff');
  }

  _initLighting() {
    this.keyLight = new THREE.PointLight(0xff66ff, 100, 40, 2.5);
    this.keyLight.position.set(0, 0, 0);
    this.scene.add(this.keyLight);

    const rim = new THREE.DirectionalLight(0x66ccff, 0.4);
    rim.position.set(3, 2, 5);
    this.scene.add(rim);

    const ambient = new THREE.HemisphereLight(0x3344ff, 0x110022, 0.35);
    this.scene.add(ambient);
  }

  _initEnvironment() {
    const hdrURL = 'https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr';
    new RGBELoader().load(hdrURL, (hdrTex) => {
      hdrTex.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = hdrTex;
    });
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

  // ------------------------------------------------------
  // 🌞 Post FX — Bloom + Additive Glow Overlay
  // ------------------------------------------------------
  _initPostFX() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0,
      0.5,
      0.85
    );
    this.composer.addPass(bloom);

    // Custom additive full-screen glow shader
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

  update(energies, dt = 0.016) {
    const t = performance.now() * 0.001;
    const globalEnergy = energies?.global ?? 0; // 🔊 drive brightness

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

    // Dust shimmer
    if (this.dust) {
      this.dust.rotation.y += dt * 0.05;
      const pos = this.dust.geometry.attributes.position.array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i + 1] += Math.sin(t + i * 0.03) * 0.0008;
      }
      this.dust.geometry.attributes.position.needsUpdate = true;
    }

    // Camera drift
    this.camera.position.x = Math.sin(t * 0.015) * 4;
    this.camera.position.y = Math.sin(t * 0.09) * 10.5;
    this.camera.position.z = 8 + Math.cos(t * 0.2) * 10.5;
    this.camera.lookAt(0, 0, 0);

    // Render main scene with bloom
    if (!usedComposer && this.composer) this.composer.render();

    // --- Add strong volumetric glow overlay ---
    this._glow.mat.uniforms.time.value = t;
    this._glow.mat.uniforms.beat.value = globalEnergy * 1.2; // beat pulse
    this.renderer.autoClear = false;
    this.renderer.render(this._glow.scene, this._glow.cam);
    this.renderer.autoClear = true;
  }
}
