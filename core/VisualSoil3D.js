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
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true
    });
    this.pixelRatio = this._getPixelRatio();
    this.renderer.setPixelRatio(this.pixelRatio);
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
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
      phase[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('phase', new THREE.BufferAttribute(phase, 1));
    this._dustUniforms = {
      time: { value: 0 },
      beat: { value: 0 },
      tint: { value: new THREE.Color(0xffffff) },
      size: { value: this._getDustSize() }
    };
    const mat = new THREE.ShaderMaterial({
      uniforms: this._dustUniforms,
      vertexShader: `
        uniform float time;
        uniform float beat;
        uniform float size;
        attribute float phase;
        varying float vFade;
        void main(){
          vec3 displaced = position;
          float offset = sin(time * 0.35 + phase) * 0.6;
          displaced.y += offset;
          displaced.x += sin(time * 0.15 + phase * 1.3) * 0.3;
          displaced.z += cos(time * 0.2 + phase * 0.7) * 0.3;
          float pulse = 0.7 + beat * 0.6;
          vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * pulse * (300.0 / max(1.0, -mvPosition.z));
          vFade = 0.45 + 0.35 * sin(phase * 13.37);
        }
      `,
      fragmentShader: `
        uniform vec3 tint;
        varying float vFade;
        void main(){
          vec2 uv = gl_PointCoord.xy - 0.5;
          float dist = length(uv);
          float alpha = smoothstep(0.5, 0.0, dist) * vFade;
          gl_FragColor = vec4(tint, alpha);
        }
      `,
      transparent: true,
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
    bloom.renderToScreen = false;
    this._bloom = bloom;
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
    this.pixelRatio = this._getPixelRatio();
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.composer?.setSize(window.innerWidth, window.innerHeight);
    if (this.composer?.setPixelRatio) this.composer.setPixelRatio(this.pixelRatio);
    if (this._bloom?.setSize) this._bloom.setSize(window.innerWidth, window.innerHeight);
    if (this._dustUniforms) this._dustUniforms.size.value = this._getDustSize();
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
      if (this._dustUniforms) {
        this._dustUniforms.time.value = t;
        this._dustUniforms.beat.value = globalEnergy;
      }
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

  _getPixelRatio() {
    const dpr = window.devicePixelRatio || 1;
    return Math.min(1.75, dpr);
  }

  _getDustSize() {
    const base = 4.5;
    return base * (window.devicePixelRatio ? Math.min(window.devicePixelRatio, 2.0) : 1);
  }
}
