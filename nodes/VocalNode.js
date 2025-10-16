// ======================================================
// 🎙️ VocalNode.js — v1.7 “Dynamic Diffraction Overlay”
// ------------------------------------------------------
// - Audio-reactive holographic overlay that follows the camera
// - 3-band radial interference (low/mid/high)
// - Additive + internal subtractive glow blending
// - Looks volumetric but always faces camera (HUD-style)
// - Smooth turbulence and hue shimmer
// ======================================================

import * as THREE from 'three';

export class VocalNode {
  constructor(scene = null, renderer = null, camera = null) {
    this.root = new THREE.Group();
    if (scene) scene.add(this.root);
    this.camera = camera;

    const geo = new THREE.PlaneGeometry(22, 22, 1, 1);
    this.uniforms = {
      uTime: { value: 0 },
      uLow: { value: 0 },
      uMid: { value: 0 },
      uHigh: { value: 0 },
      uAspect: { value: 1.0 },
      uHue: { value: 0.55 },
      uColor: { value: new THREE.Color(0x99ccff) }
    };

    // ---------- GLSL ----------
    const frag = /* glsl */`
      varying vec2 vUv;
      uniform float uTime;
      uniform float uLow;
      uniform float uMid;
      uniform float uHigh;
      uniform float uAspect;
      uniform float uHue;
      uniform vec3  uColor;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
      }

      vec3 hsl2rgb(vec3 hsl){
        vec3 rgb = clamp(abs(mod(hsl.x*6.0+vec3(0,4,2),6.0)-3.0)-1.0,0.0,1.0);
        return hsl.z + hsl.y*(rgb-0.5)*(1.0-abs(2.0*hsl.z-1.0));
      }

      void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= uAspect;
        float r = length(uv);
        float n = noise(uv * 6.0 + uTime * 0.3) * 2.0 - 1.0;

        // --- Dynamic frequencies ---
        float lowBand  = sin(r * (12.0 + uLow  * 90.0)  + uTime * 2.0);
        float midBand  = sin(r * (30.0 + uMid  * 160.0) + uTime * 4.0 + n);
        float highBand = sin(r * (60.0 + uHigh * 300.0 + n * 3.0) + uTime * 6.0);

        // Combine bands (balanced additive)
        float rings = abs(lowBand*0.6 + midBand*0.4 + highBand*0.3);

        // Radial brightness shaping
        float center = smoothstep(0.1, 0.0, r);
        float edge   = smoothstep(0.0, 0.5, r);
        float fade   = center * (1.0 - edge);

        // Turbulence shimmer
        float shimmer = noise(uv * 25.0 + uTime * 3.0);
        float glow = rings * fade + shimmer * uHigh * 0.5;

        // Hue shimmer based on time
        float hueShift = uHue + sin(uTime * 0.5) * 0.05 + uMid * 0.2;
        vec3 hueCol = hsl2rgb(vec3(hueShift, 0.8, 0.5 + uHigh * 0.4));

        vec3 col = mix(uColor, hueCol, 0.6) * glow * (0.5 + uLow * 1.6);
        col -= pow(rings, 2.5) * 0.1; // slight subtractive shadow between rings

        gl_FragColor = vec4(col, glow * 1.5);
      }
    `;

    const vert = /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // ---------- Material ----------
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: true
    });

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.renderOrder = 999; // always drawn last
    this.root.add(this.mesh);

    // ---------- State ----------
    this._lowEnv = 0;
    this._midEnv = 0;
    this._highEnv = 0;
    this._bandIdxCache = null;
  }

  // ---------- Helpers ----------
  _getBandIndices(len, nyq, lo, hi) {
    const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
    const i1 = clamp(Math.floor((lo / nyq) * len), 0, len-1);
    const i2 = clamp(Math.floor((hi / nyq) * len), i1+1, len);
    return [i1,i2];
  }

  _bandEnergy(arr,i1,i2){
    let s=0;
    for(let i=i1;i<i2;i++) s+=arr[i];
    return (s/(i2-i1))/255;
  }

  _slew(v,t,atk,rel,dt){
    const c = t>v?atk:rel;
    return v+(t-v)*c*dt;
  }

  // ---------- Update ----------
  update(_,dt=0.016,renderer=null,scene=null,camera=null){
    const soil = window.audio;
    if(!soil||!soil.hasStem||!soil.hasStem('vocals')) return;
    const s = soil.stems['vocals'];
    if(!s||!s.ana||!s.data) return;

    s.ana.getByteFrequencyData(s.data);
    const arr = s.data;
    const len = arr.length>>>0;
    const nyq = soil.ctx?soil.ctx.sampleRate*0.5:22050;

    if(!this._bandIdxCache||this._bandIdxCache.len!==len){
      this._bandIdxCache={
        len,
        low:this._getBandIndices(len,nyq,120,500),
        mid:this._getBandIndices(len,nyq,500,3000),
        high:this._getBandIndices(len,nyq,3000,9000)
      };
    }

    const {low,mid,high}=this._bandIdxCache;
    let lowE=this._bandEnergy(arr,low[0],low[1]);
    let midE=this._bandEnergy(arr,mid[0],mid[1]);
    let highE=this._bandEnergy(arr,high[0],high[1]);

    lowE=Math.pow(lowE,0.8);
    midE=Math.pow(midE,0.8);
    highE=Math.pow(highE,0.8);

    this._lowEnv=this._slew(this._lowEnv,lowE,6,3,dt);
    this._midEnv=this._slew(this._midEnv,midE,6,3,dt);
    this._highEnv=this._slew(this._highEnv,highE,8,4,dt);

    this.uniforms.uLow.value=this._lowEnv;
    this.uniforms.uMid.value=this._midEnv;
    this.uniforms.uHigh.value=this._highEnv;
    this.uniforms.uTime.value+=dt;
    this.uniforms.uAspect.value=window.innerWidth/window.innerHeight;
    this.uniforms.uHue.value=(this.uniforms.uHue.value+dt*0.02)%1.0;

    // 🔁 Camera-follow: plane always faces and sticks to camera
    if (camera) {
      camera.getWorldDirection(this.root.position);
      this.root.position.copy(camera.position);
      this.root.quaternion.copy(camera.quaternion);
      this.root.translateZ(-4.5); // [ADJUST] how far in front of camera
    }
  }
}
