<head>
<style>
   
   <script src="https://unpkg.com/three@0.161.0/build/three.min.js"> </script>
  
html,body{margin:0;padding:0;overflow:hidden;
  
  font-family:monospace;
  
  border:10px solid black;}

canvas{position:fixed;top:0;left:0;display:block;}
  
canvas#audioCanvas{position:static;}
  
#menuContainer{  font-family:monospace; position:fixed;top:10px;left:10px;display:flex;flex-direction:column; z-index: 9999;}
  
.menu{background:black;color:white;padding:50px;display:grid;grid-template-columns:1fr;gap:10px;

border:2px

solid white;font-size:10px;text-transform:uppercase;box-sizing:border-box;}
  
.menu button,.menu input[type="range"],.menu input[type="checkbox"],.menu select,.showMenuButton{background:black;color:white;

border:2px

solid white;font-family:monospace;font-size:10px;text-transform:uppercase;cursor:pointer;text-decoration:none;transition:.5s;} 
  
.menu button:hover,.showMenuButton:hover,.menu a:hover{background:white;color:black;}
  
.menu label{display:flex;justify-content:space-between;align-items:center;}
  
.menu select{
  letter-spacing: 5px; 
}

.modeGroup {
  display: flex;
  flex-direction: column;
}

  
input[type="range"]{-webkit-appearance:none;width:120px;height:10px;}
  
input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;background:white;border:0px solid white;}
  
input[type="range"]::-moz-range-thumb{width:12px;height:12px;background:white;border:0px solid white;}
  
input[type="checkbox"]{width:10px;height:10px;background:black;border:1px solid white;appearance:none;-webkit-appearance:none;position:relative;cursor:pointer;}
  
input[type="checkbox"]::after{content:'';display:block;width:100%;height:100%;background:white;opacity:0;}
input[type="checkbox"]:checked::after{opacity:1;}
  
.menu select{background:white;color:black;border:10px solid white;font-size:20px;cursor:pointer;text-transform:uppercase;}
 
#contentWindow{position:fixed;top:10px;right:10px;z-index:1000;min-width:240px;max-width:150px; font-family:monospace; display:flex;justify-content:space-between;align-items:center; }
  
                                                .fix div { width:120px; display: flex; margin-bottom:5px; border:2px solid white;}
  
  
  
#clock{   letter-spacing: 5px;padding:5px;}
  
#fps{padding:5px;}
  
#audioMonitor{text-align:center;padding:0px 0;border-bottom:0px solid white;margin-bottom:0px;}
  
#audioCanvas{border:2px solid white;}
  
#asciiHeader{font-size:2.3px;line-height:.7em;white-space:pre;}
  
#permissionButton{background:red;color:white;padding:10px;margin:5px 0;border:none;cursor:pointer;text-transform:uppercase;}
  
#permissionButton.granted {
background:black;}

#mediaPreview {
position:static!important;}
  
#fractalControls {
display: flex !important;
flex-direction: column !important;}

#fractalControls {
display: flex !important;
flex-direction: column !important;}

#fractalControls 
select {
margin: 2px 2px !important;}

#mediaPreview {
width: 130px !important;
height: 90px !important;
display: block;
margin-bottom: 5px;
margin-top: 5px;
image-rendering: pixelated;}

 
  
 
  .modeGroup { margin-top: 0px; }
  .fluidOption,.fractalOption,.rippleOption,.particleOption,.waveOption,.kaleidoOption,.audioOption,.retroOption { display:block; }
  .universalOption { display: block; }

  .fractal-only{display:none}
.fractal-active .fractal-only{display:block}
.fractal-active .julia-only{display:none}
.fractal-active.julia-active .julia-only{display:block}

  .fractalOption { display:none; }
body.fractal-active .fractalOption { display:block; }
body.fractal-active .juliaOption { display:none; }
body.fractal-active.julia-active .juliaOption { display:block; }

  .fractalOption { display:none; }
body.fractal-active .fractalOption { display:block; }
 
</style></head><body>
  
<div id="menuContainer">
<div class="menu" id="controls">
    
<button id="toggleMenu">
HIDE OPTIONS
</button>
    
<button id="randomizeSettings">
Randomize
</button>
  
<button id="panicButton">
PANIC BUTTON
</button>
    
   <select id="modeSelect">
    <option value="1">
     Fluid
    </option>
    <option value="2">
     Fractal Zoom
    </option>
    <option value="3">
     Ripple
    </option>
    <option value="4">
     Particle Field
    </option>
    <option value="5">
     Wave Interference
    </option>
    <option value="6">
     Kaleidoscope
    </option>
    <option value="7">
     Audio-Visual
    </option>
    <option value="8">
     Retro
    </option>
    <option value="9">
     Piano
    </option>
    <option value="10">
     Julia 2D
    </option>
    <option value="11">
     Julia 3D
    </option>
    <option value="12">
     Julia GL (3D)
    </option>
   </select>
   
   <div class="modeGroup fluidOption">
   </div>
   <!-- Fractal Extra Controls -->
   <div class="modeGroup fractalOption">
   </div>
   <!-- Ripple Extra Controls -->
   <div class="modeGroup rippleOption">
   </div>
  
   <!-- Wave Extra Controls -->
   <div class="modeGroup waveOption">
    <label id="waveFreqLabel">
     Wave Frequency
     <input id="waveFreq" max="1" min="0.01" step="0.01" type="range" value="0.05"/>
    </label>
    <label id="waveAmpLabel">
     Wave Amplitude
     <input id="waveAmp" max="100" min="1" step="1" type="range" value="20"/>
    </label>
    <label id="waveFalloffLabel">
     Wave Falloff
     <input id="waveFalloff" max="0.05" min="0.001" step="0.001" type="range" value="0.006"/>
    </label>
   </div>
   <!-- Kaleidoscope Extra Controls -->
   <div class="modeGroup kaleidoOption">
    <label id="patternRotationLabel">
     Pattern Rotation Speed
     <input id="patternRotation" max="5" min="-5" step="0.1" type="range" value="0"/>
    </label>
    <label id="patternComplexityFactorLabel">
     Pattern Complexity Factor
     <input id="patternComplexityFactor" max="10" min="0.1" step="0.1" type="range" value="1"/>
    </label>
   </div>
   <!-- Audio Extra Controls -->
   <div class="modeGroup audioOption">
    <label id="fftSizeLabel">
     Analyser FFT Size
     <input id="fftSize" max="2048" min="256" step="256" type="range" value="512"/>
    </label>
    <label id="smoothingLabel">
     Analyser Smoothing
     <input id="smoothing" max="1" min="0" step="0.01" type="range" value="0.8"/>
    </label>
    <label id="minDbLabel">
     Min Decibels
     <input id="minDb" max="0" min="-120" step="1" type="range" value="-90"/>
    </label>
    <label id="maxDbLabel">
     Max Decibels
     <input id="maxDb" max="0" min="-120" step="1" type="range" value="-10"/>
    </label>
   </div>
    
   <div class="modeGroup retroOption">
     <label id="starCountLabel">Starfield Count<input id="starCount" max="1000" min="10" step="10" type="range" value="200"/></label>
<label id="matrixTrailLabel">Matrix Trail Length<input id="matrixTrail" max="100" min="5" step="1" type="range" value="20"/></label>
 <label id="terminalSpeedLabel">Terminal Refresh Speed<input id="terminalSpeed" max="1000" min="50" step="10" type="range" value="200"/></label></div>

    
   <details open="True">
    
     <summary>
EFFECTS
    </summary>

    <label id="blurLabel">
     Blur
     <input id="blur" max="20" min="0" type="range" value="0"/>
    </label>
     
      <label id="dispLabel">
     Displacement
     <input id="disp" max="0.2" min="0.01" step="0.01" type="range" value="0.06"/>
    </label>
     
     
     
      <label id="pulseToggleLabel">
     Pulse
     <input id="pulseToggle" type="checkbox"/>
    </label>
         <label id="pulseSpeedLabel">
     Pulse Speed
     <input id="pulseSpeed" max="5" min="0" step="0.1" type="range" value="1"/>
    </label>
     
     
    <label id="invertLabel">
     Invert Colors
     <input id="invert" type="checkbox"/>
    </label>
    <label id="rippleCycleLabel">
     Color Cycle
     <input id="rippleCycle" type="checkbox"/>
    </label>
    <label id="gradientBGLabel">
     Gradient Background
     <input id="gradientBG" type="checkbox"/>
    </label>
    <label id="trailsLabel">
     Trails
     <input id="trails" type="checkbox"/>
    </label>
    <label id="reactiveLabel">
     Mouse Reactive
     <input checked="" id="reactive" type="checkbox"/>
    </label>
     
   </details>
    
  
    
   <details open="True">
    <summary>
CONTROLS
    </summary>
     
<label id="rippleColorLabel">Hue<input id="rippleColor" max="360" min="0" type="range" value="200"/></label>
     
<label id="brightnessLabel">Brightness<input id="brightness" max="1" min="0" step="0.01" type="range" value="0.5"/></label>
     
<label class="pianoOption" id="pianoAttackLabel">Attack<input id="pianoAttack" max="2" min="0" step="0.01" type="range" value="0.1"/></label>
     
<label class="pianoOption" id="pianoDecayLabel">Decay<input id="pianoDecay" max="2" min="0" step="0.01" type="range" value="0.3"/></label>
     
    <label class="pianoOption" id="pianoSustainLabel">
     Sustain
     <input id="pianoSustain" max="1" min="0" step="0.01" type="range" value="0.7"/>
    </label>
    <label class="pianoOption" id="pianoReleaseLabel">
     Release
     <input id="pianoRelease" max="5" min="0" step="0.01" type="range" value="1.0"/>
    </label>
    <label class="pianoOption" id="pianoReverbLabel">
     Reverb
     <input id="pianoReverb" max="1" min="0" step="0.01" type="range" value="0.3"/>
    </label>
    <label id="strengthLabel">
     Strength
     <input id="strength" max="9000" min="500" type="range" value="1000"/>
    </label>
    <label id="dampingLabel">
     Damping
     <input id="damping" max="0.99" min="0.90" step="0.001" type="range" value="0.98"/>
    </label>
   <label id="particleCountLabel">
     Particle Count
     <input id="particleCount" max="10000" min="1" type="range" value="200"/>
    </label>
    <label id="particleSizeLabel">
     Particle Size
     <input id="particleSize" max="20" min="1" type="range" value="3"/>
    </label>
      <!-- Particle Extra Controls -->
   <div class="modeGroup particleOption">
    <label id="particleFrictionLabel">
     Particle Friction
     <input id="particleFriction" max="1" min="0.8" step="0.001" type="range" value="0.99"/>
    </label>
    <label id="particleRadiusLabel">
     Particle Interaction Radius
     <input id="particleRadius" max="500" min="10" step="1" type="range" value="150"/>
    </label>
    <div class="particleOption">
     <label>
       Particle Attraction Mode
      <input id="particleAttract" type="checkbox"/>
      
     </label>
    </div>
   </div>
     

<label id="radiusLabel">Radius<input id="radius" max="20" min="0" type="range" value="4"/></label>
<label id="waveCountLabel">Wave Sources<input id="waveCount" max="8" min="1" type="range" value="3"/></label>
<label id="waveSpeedLabel">Wave Speed<input id="waveSpeed" max="3" min="0.1" step="0.1" type="range" value="1"/></label>
<label id="kaleidoSegmentsLabel">Segments<input id="kaleidoSegments" max="16" min="3" type="range" value="8"/></label>
<label id="kaleidoZoomLabel">Zoom<input id="kaleidoZoom" max="3" min="0.1" step="0.1" type="range" value="1"/></label>
<label id="kaleidoRotationLabel">Rotation Speed<input id="kaleidoRotation" max="5" min="0" step="0.1" type="range" value="1"/></label>
<label id="kaleidoComplexityLabel">Pattern Count<input id="kaleidoComplexity" max="20" min="3" type="range" value="8"/></label>
<label id="kaleidoMorphLabel">Morph Speed<input id="kaleidoMorph" max="3" min="0" step="0.1" type="range" value="1"/></label>
<label id="videoOpacityLabel">Video Opacity<input id="videoOpacity" max="1" min="0" step="0.1" type="range" value="0.7"/>

    </label>
    <label id="retroModeLabel">
     Retro Mode
     <select id="retroMode">
      <option value="oscilloscope">
       Oscilloscope
      </option>
      <option value="spectrum">
       Spectrum
      </option>
    
      <option value="starfield">
       Starfield
      </option>
      <option value="matrix">
       Matrix
      </option>
      <option value="terminal">
       Terminal
      </option>
     </select>
    </label>
    <label id="retroSpeedLabel">
     Animation Speed
     <input id="retroSpeed" max="3" min="0.1" step="0.1" type="range" value="1"/>
    </label>
    <label id="retroSizeLabel">
     Element Size
     <input id="retroSize" max="3" min="0.5" step="0.1" type="range" value="1"/>
    </label>
    <label id="retroIntensityLabel">
     Effect Intensity
     <input id="retroIntensity" max="3" min="0.1" step="0.1" type="range" value="1"/>
    </label>
    <label id="scanLinesLabel">
     Scan Lines
     <input checked="" id="scanLines" type="checkbox"/>
    </label>
    <label id="crtGlowLabel">
     CRT Glow
     <input checked="" id="crtGlow" type="checkbox"/>
    </label>
    <label id="retroGreenLabel">
     Green Phosphor
     <input id="retroGreen" type="checkbox"/>
    </label>


<label id="overallSpeedLabel">Overall Speed<input id="overallSpeed" max="5" min="0" step="0.1" type="range" value="0"/></label>
   
     
     

<div id="fractalControls" style="display:none;">
  <label>Zoom Speed
    <input id="fractalZoomSpeed" max="100" min="0" step="0.01" type="range" value="1"/>
  </label>
  <label>Iterations
    <input id="fractalMaxIter" max="150" min="3" step="1" type="range" value="150"/>
  </label>
  <label>Hue Offset
    <input id="fractalHueOffset" max="360" min="0" step="1" type="range" value="0"/>
  </label>
  <label>Saturation
    <input id="fractalSaturation" max="100" min="0" step="1" type="range" value="100"/>
  </label>

  <!-- Only show on fractal mode -->
  <div class="fractalOption">
    <label>Fractal Type
      <select id="fractalType" style="font-size: 10px; width: 124px; margin:0px 2px;">
        <option value="mandelbrot">Mandelbrot</option>
        <option value="julia">Julia</option>
        <option value="burning">Burning Ship</option>
      </select>
    </label>
  </div>
</div>

  
  
     
<label id="resLabel">Resolution<input id="res" max="600" min="0" type="range" value="200"/></label>
     
</details>
    
<details open="True">
<summary>
HYPERLINKS
</summary>
</details>
    
<button class="primary" id="permissionButton">
Enable Camera &amp; Mic
</button>
    
</div>
  
<button class="showMenuButton" id="showMenuButton" style="display:none;">OPTIONS</button>
</div>
 
<div class="menu" id="contentWindow">
<div id="contentHeader">
<pre id="asciiHeader">


</pre>
  <div class="fix" id="fix">
  <div class="content-block" id="clock">
  
--:--:--
  
</div>
  
<div class="content-block" id="fps";>

FPS: --
  
</div>
  </div>
  
<div class="content-block" id="audioMonitor">
<canvas height="130" id="audioCanvas" width="130">
</canvas>
</div>
  

   
<canvas id="mediaPreview" style="border:2px solid white;background:black;image-rendering:pixelated;">
</canvas>
  
<label style="display:block;text-align:center;color:white;font-size:10px;">
Threshold
<input id="thresholdSlider" max="255" min="0" style="width:130px;

(function(){
  const ms = document.getElementById('maskStrengthSlider');
  if(ms){
    window.maskStrength = parseInt(ms.value)||100;
    ms.addEventListener('input', e =&gt; window.maskStrength = parseInt(e.target.value)||100);
  }
  const rs = document.getElementById('maskResSlider');
  if(rs){
    window.maskRes = parseInt(rs.value)||96;
    rs.addEventListener('input', e =&gt; window.maskRes = parseInt(e.target.value)||96);
  }
})();" type="range" value="128"/>
  
</label>
<label style="display:block;text-align:center;">Resolution
<input id="maskResSlider" max="1000" min="1" style="width:130px;" type="range" value="100"/>
</label>
<label style="display:block;text-align:center;">
Strength
<input id="maskStrengthSlider" max="1000" min="0" style="width:130px;" type="range" value="100"/>
</label>
  </div>
 </div>
 <canvas id="c">
 </canvas>
 <video autoplay="" id="videoElement" muted="" playsinline="" style="display:none;">
 </video>
 <script>
  // = RIP : normal mask st.
function getMaskStrength(){
  // === Fractal param application ===
  try {
    const fx = (typeof fractalOffsetX==='number') ? fractalOffsetX : 0;
    const fy = (typeof fractalOffsetY==='number') ? fractalOffsetY : 0;
    const fz = (typeof fractalZoom==='number') ? fractalZoom : 1.0;
    const fres = (typeof fractalResolution==='number') ? Math.max(1, Math.floor(fractalResolution)) : 1;
    const jx = (typeof juliaConstX==='number') ? juliaConstX : -0.7;
    const jy = (typeof juliaConstY==='number') ? juliaConstY : 0.27015;
    // expose to render loop if it uses globals
    window.__fract = {fx, fy, fz, fres, jx, jy};
  } catch(e) { console.warn('fractal param update', e); }

  return (typeof window.maskStrength !== 'undefined' ? window.maskStrength : 100) / 100;
}

// Canvas setup
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
// =RIP : silho samp
function getSilhouetteI(x, y){
  const img = window.mediaImageData;
  const mc = window.mediaCanvas;
  if (!img || !mc || !canvas) return 0;
  const mcw = mc.width, mch = mc.height;
  if (!mcw || !mch) return 0;
  const mx = Math.max(0, Math.min(mcw-1, Math.floor((x / canvas.width) * mcw)));
  const my = Math.max(0, Math.min(mch-1, Math.floor((y / canvas.height) * mch)));
  const idx = (my * mcw + mx) * 4;
  const d = img.data;
  const r = d[idx]||0, g = d[idx+1]||0, b = d[idx+2]||0;
  const luma = (0.2126*r + 0.7152*g + 0.0722*b);
  const th = (typeof thresholdLevel !== 'undefined' ? thresholdLevel : 128);
  const inside = luma > th ? 1 : 0;
  const ms = getMaskStrength();
  return inside * getMaskStrength();
}
function getSilhouetteInfluence(x,y){ // compatibility for existing calls
  return getSilhouetteI(x,y);
}


// === RIPPLE-STICK post-render mask impact ===
function maskImpactPostRender(mode){
  const mc = window.mediaPreview;
  if (!mc) return;
  const ms = getMaskStrength();
  const alphaBase = 0.2 + 0.6 * ms;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  switch (mode){
    case 1: // Fluid
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alphaBase;
      ctx.filter = 'blur(12px)';
      ctx.drawImage(mc, 0, 0, canvas.width, canvas.height);
      break;
    case 2: // Fractal/Fire
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = Math.min(1, alphaBase+0.2);
      ctx.filter = 'blur(6px)';
      ctx.drawImage(mc, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
      ctx.globalAlpha *= 0.6;
      ctx.drawImage(mc, 0, 0, canvas.width, canvas.height);
      break;
    case 3: // Ripples
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alphaBase;
      ctx.filter = 'blur(4px)';
      ctx.drawImage(mc, 0, 0, canvas.width, canvas.height);
      break;
    case 4: // Particles
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alphaBase;
      ctx.filter = 'blur(2px)';
      ctx.drawImage(mc, 0, 0, canvas.width, canvas.height);
      break;
    case 5: // Waves (already internal)
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alphaBase*0.3;
      ctx.filter = 'blur(1px)';
      ctx.drawImage(mc, 0, 0, canvas.width, canvas.height);
      break;
    case 6: // Kaleidoscope
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alphaBase;
      ctx.filter = 'blur(3px)';
      ctx.drawImage(mc, 0, 0, canvas.width, canvas.height);
      break;
    case 7: // AV
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = Math.min(1, alphaBase+0.15);
      ctx.filter = 'none';
      ctx.drawImage(mc, 0, 0, canvas.width, canvas.height);
      break;
    case 8: // Retro
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = alphaBase;
      ctx.filter = 'blur(1px)';
      ctx.drawImage(mc, 0, 0, canvas.width, canvas.height);
      break;
  }
  ctx.restore();
}

const videoElement = document.getElementById('videoElement');
// Media preview + threshold globals
const mediaPreview = document.getElementById('mediaPreview');
const mediaPrevCtx = mediaPreview ? mediaPreview.getContext('2d') : null;
window.mediaCanvas = document.createElement('canvas');

window.mediaCtx = mediaCanvas.getContext('2d', { willReadFrequently: true });
window.mediaImageData = null;
let thresholdLevel = 128;
const thresholdSlider = document.getElementById('thresholdSlider');
if (thresholdSlider) thresholdSlider.addEventListener('input', (e)=>{ thresholdLevel = parseInt(e.target.value); });
// RIP hook: wire mask and resolution sliders
const maskStrengthSlider = document.getElementById('maskStrengthSlider');
if (maskStrengthSlider){
  window.maskStrength = parseInt(maskStrengthSlider.value) || 100;
  maskStrengthSlider.addEventListener('input', e => { window.maskStrength = parseInt(e.target.value) || 100; });
}

const maskResSlider = document.getElementById('maskResSlider');
if (maskResSlider && mediaPreview){
  const applyMaskRes = (val) => {
    const w = Math.max(32, Math.min(2048, parseInt(val) || 96));
    const h = Math.max(1, Math.round(w * (mediaPreview.height && mediaPreview.width ? (mediaPreview.height / mediaPreview.width) : 0.75)));
    mediaPreview.width = w;
    mediaPreview.height = h;
    if (window.mediaCanvas){
      mediaCanvas.width = w;
      mediaCanvas.height = h;
    }
  };
  applyMaskRes(maskResSlider.value);
  maskResSlider.addEventListener('input', e => applyMaskRes(e.target.value));
}

const resSlider = document.getElementById('res');
if (resSlider){
  window.targetResolutionFactor = parseInt(resSlider.value) / 200;
  resSlider.addEventListener('input', e => { window.targetResolutionFactor = parseInt(e.target.value) / 200; });
}


const audioCanvas = document.getElementById('audioCanvas');
const audioCtx = audioCanvas.getContext('2d');


// Hi-DPI sizing for audioCanvas (final)
const CSS_AUDIO_W = Number(audioCanvas.getAttribute('width')) || 130;
const CSS_AUDIO_H = Number(audioCanvas.getAttribute('height')) || 130;
function scaleAudioCanvasForDPR() {
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  audioCanvas.style.width  = CSS_AUDIO_W + 'px';
  audioCanvas.style.height = CSS_AUDIO_H + 'px';
  audioCanvas.width  = Math.round(CSS_AUDIO_W * dpr);
  audioCanvas.height = Math.round(CSS_AUDIO_H * dpr);
  audioCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  audioCtx.imageSmoothingEnabled = false;
}
scaleAudioCanvasForDPR();
window.addEventListener('resize', scaleAudioCanvasForDPR);
// Rotation state for spiky ring
let ringAngle = 0;


let W = 100, H = 100, size = W * H;

// Core buffers
let curr = new Float32Array(size);
let prev = new Float32Array(size);
let base = new Uint8Array(size);
let imageData = ctx.createImageData(W, H);

// Parameters
let damping = 0.98, disp = 0.06, rippleStrength = 1000, radius = 4, blur = 0;
let rippleHue = 200, brightness = 0.5, rippleCycle = false, pulseSpeed = 1, pulseToggle = false, brightnessPulse = 0;
let invert = false, overallSpeed = 1, fluidMode = 1, gradientBG = false, trails = false, reactive = true;
let particleCount = 200, particleSize = 3, waveCount = 3, waveSpeed = 1;

// Kaleidoscope parameters
let kaleidoSegments = 8, kaleidoZoom = 1, kaleidoRotation = 1, kaleidoComplexity = 8, kaleidoMorph = 1;
let kaleidoAngle = 0, kaleidoPatterns = [];

// Global audio parameters
let audioContext = null, analyser = null, audioData = null, mediaStream = null;
let hasPermissions = false;

// Audio-Visual parameters
let videoOpacity = 0.7;

// Retro Audio Visual parameters
let retroMode = 'oscilloscope', retroSpeed = 1, retroSize = 1, retroIntensity = 1;
let scanLines = true, crtGlow = true, retroGreen = false;
let retroStars = [], matrixChars = [], terminalLines = [];
let waveformHistory = [];
const matrixCharset = 'SEX';
let retroTime = 0;

// Offscreen canvas
const offCanvas = document.createElement('canvas');
const offCtx = offCanvas.getContext('2d');

// Dynamic layers
let layers = [
{ amp: 50, speed: 0.02, offset: 0 },
{ amp: 30, speed: 0.035, offset: 10 },
{ amp: 20, speed: 0.05, offset: 20 }
];

let ripples = [];
let particles = [];
let waveSources = [];
let time = 0;

// FRACTAL ZOOM
let zoom = 1, zoomDir = 1, fractalOffsetX = 0, fractalOffsetY = 0;
let fractalZoomSpeed = 1, fractalMaxIter = 150, fractalHueOffset = 0, fractalSaturation = 100;
let fractalType = 'mandelbrot';
let fractalRes = 300;
let juliaC = { x: -0.7, y: 0.27015 };

// AUDIO SUN
function updateAudioMonitor() {
if (typeof analyser !== 'undefined' && analyser) { try {
if (typeof fftSize === 'number' && analyser.fftSize !== fftSize && (fftSize & (fftSize-1)) === 0) { 
analyser.fftSize = fftSize;
        }
  
if (typeof smoothing === 'number') analyser.smoothingTimeConstant = smoothing;
if (typeof minDb === 'number') analyser.minDecibels = minDb;
if (typeof maxDb === 'number') analyser.maxDecibels = maxDb;
      } 
catch(e) {
console.warn('Analyser param update error', e);
      }
    }
    
  ringAngle += 0.01;
  const CSS_W = CSS_AUDIO_W, CSS_H = CSS_AUDIO_H;
  // background
  audioCtx.fillStyle = 'black';
  audioCtx.fillRect(0, 0, CSS_W, CSS_H);

  if (!hasPermissions) {
    audioCtx.fillStyle = 'white';
    audioCtx.font = '10px monospace';
    audioCtx.textAlign = 'center';
    audioCtx.fillText('NO MIC', CSS_W / 2, CSS_H / 2);
    return;
  }

  if (analyser && audioData) {
    analyser.getByteFrequencyData(audioData);

    // Average level for inner fill + top bar
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) sum += audioData[i];
    const avg = (sum / audioData.length) / 255;

    const cx = CSS_W / 2;
    const cy = CSS_H / 2;
    const outerGuide = Math.min(CSS_W, CSS_H) / 2 - 5; // small inset
    const ringBase = outerGuide - 12;  // where spikes start
    const maxSpike = 152;

    // Guide ring
    audioCtx.strokeStyle = 'white';
    audioCtx.globalAlpha = 0;
    audioCtx.lineWidth = 10;
    audioCtx.beginPath();
    audioCtx.arc(cx, cy, outerGuide, 0, Math.PI * 2);
    audioCtx.stroke();
    audioCtx.globalAlpha = 1;

    // Spikes around the outside ring (radial bars)
    const N = 100;
    if (!updateAudioMonitor._buf || updateAudioMonitor._buf.length !== N) {
      updateAudioMonitor._buf = new Float32Array(N);
    }
    const buf = updateAudioMonitor._buf;
    const step = Math.max(1, Math.floor(audioData.length / N));

    audioCtx.beginPath();
    for (let i = 0, idx = 0; i < N; i++, idx += step) {
      let acc = 0, n = 0;
      for (let j = 0; j < step && (idx + j) < audioData.length; j++) { acc += audioData[idx + j]; n++; }
      const v = (acc / (n || 1)) / 100;    // 0..1
      const eased = v * v;                 // emphasize peaks
      buf[i] = buf[i] * 0.65 + eased * 0.35; // smoothing
      const spike = buf[i] * maxSpike;

      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      const aRot = a + ringAngle;
      const x1 = cx + Math.cos(aRot) * ringBase;
      const y1 = cy + Math.sin(aRot) * ringBase;
      const x2 = cx + Math.cos(aRot) * (ringBase + spike);
      const y2 = cy + Math.sin(aRot) * (ringBase + spike);
      audioCtx.moveTo(x1, y1);
      audioCtx.lineTo(x2, y2);
    }
    audioCtx.strokeStyle = 'white';
    audioCtx.lineWidth = 1.5;
    audioCtx.stroke();

    // Inner reactive circle
    const innerBase = 800;
    const inner = innerBase + avg * 14;
    if (avg > 0.03) {
      audioCtx.beginPath();
      audioCtx.arc(cx, cy, inner, 0, Math.PI * 2);
      audioCtx.fillStyle = 'white';
      audioCtx.globalAlpha = 0;
      audioCtx.fill();
      audioCtx.globalAlpha = 1;
    }

    // Top sound strip
    for (let i = 0; i < 10; i++) {
      const level = (i + 1) / 10;
      audioCtx.fillStyle = avg > level ? 'white' : '#000';
      audioCtx.fillRect(10 + i * 12, 10, 2, 10);
    }
  } else {
    audioCtx.fillStyle = 'white';
    audioCtx.font = '10px monospace';
    audioCtx.textAlign = 'center';
    audioCtx.fillText('MIC OK', CSS_W / 2, 20);
  }
}

// Global audio setup
async function setupAudio() {
    try {
        const constraints = {
            audio: true,
            video: { width: 320, height: 240 }
        };
        
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Always set up video if available
if (videoElement) {
    try { videoElement.srcObject = mediaStream; await videoElement.play(); } catch (err) { console.error('Video play failed:', err); }
}

        
        // Set up audio context and analyser
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
analyser.smoothingTimeConstant = 0.8;
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
        
        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(analyser);
        
        audioData = new Uint8Array(analyser.frequencyBinCount);
        hasPermissions = true;
        
        document.getElementById('permissionButton').textContent = 'CAMERA & MIC ENABLED';
        document.getElementById('permissionButton').classList.add('granted');
        
        if (fluidMode === 8) {
            initRetroEffects();
        }
    } catch (err) {
        console.error('Failed to get media permissions:', err);
        document.getElementById('permissionButton').textContent = 'PERMISSION DENIED';
    }
}

function initBase(res = W) {
    W = H = res;
    size = W * H;
    
    base = new Uint8Array(size);
    curr = new Float32Array(size);
    prev = new Float32Array(size);
    
    for (let y = 0; y < H; y++) {
        const row = y * W;
        for (let x = 0; x < W; x++) {
            base[row + x] = ((x + y) & 1) ? 0 : 255;
        }
    }
    
    imageData = ctx.createImageData(W, H);
    offCanvas.width = W;
    offCanvas.height = H;
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (fluidMode === 8) {
        initRetroEffects();
    }
}

window.addEventListener('resize', resizeCanvas);
initBase();
resizeCanvas();

// Mouse interaction
let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
let mouseVelX = 0, mouseVelY = 0;

canvas.addEventListener('pointermove', e => {
    const newX = e.clientX;
    const newY = e.clientY;
    
    mouseVelX = newX - mouseX;
    mouseVelY = newY - mouseY;
    mouseX = newX;
    mouseY = newY;
    
    if (reactive) {
        const intensity = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY) * 0.1;
        
        if (fluidMode === 3) {
            ripples.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                maxRadius: 100 + intensity * 50,
                speed: 2 + intensity * 0.5,
                intensity: Math.min(1, intensity)
            });
        } else if (fluidMode === 1) {
            disturb(e.clientX, e.clientY, rippleStrength * (1 + intensity));
        }
    }
});

// Initialize functions
function initRetroEffects() {
    retroStars = [];
    matrixChars = [];
    terminalLines = [];
    waveformHistory = [];
    
    for (let i = 0; i < 200; i++) {
        retroStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * 1000 + 1,
            speed: Math.random() * 5 + 1
        });
    }
    
    const cols = Math.floor(canvas.width / (12 * retroSize));
    for (let x = 0; x < cols; x++) {
        matrixChars[x] = {
            y: Math.random() * canvas.height,
            speed: Math.random() * 3 + 1,
            chars: [],
            trail: Math.floor(Math.random() * 20) + 10
        };
        
        for (let i = 0; i < matrixChars[x].trail; i++) {
            matrixChars[x].chars.push({
                char: matrixCharset[Math.floor(Math.random() * matrixCharset.length)],
                brightness: 1 - (i / matrixChars[x].trail)
            });
        }
    }
    
    for (let i = 0; i < 30; i++) {
        terminalLines.push({
            text: generateRandomCommand(),
            y: i * 16,
            age: Math.random() * 100,
            maxAge: 200 + Math.random() * 300
        });
    }
}

function generateRandomCommand() {
    const commands = [
        '> LAME EFFECT ON...',
        '> FREQUENCY DETECTED: GAY Hz',
        '> BUTTPLUG INPUT: ACTIVE'
    ];
    return commands[Math.floor(Math.random() * commands.length)];
}

function initKaleidoPatterns() {
    kaleidoPatterns = [];
    for (let i = 0; i < kaleidoComplexity; i++) {
        kaleidoPatterns.push({
            x: Math.random() * 0.8 + 0.1,
            y: Math.random() * 0.8 + 0.1,
            baseX: Math.random() * 0.8 + 0.1,
            baseY: Math.random() * 0.8 + 0.1,
            size: Math.random() * 0.08 + 0.02,
            speed: Math.random() * 2 + 0.5,
            rotationSpeed: Math.random() * 4 - 2,
            phase: Math.random() * Math.PI * 2,
            rotation: 0,
            hueOffset: Math.random() * 360,
            pulsePhase: Math.random() * Math.PI * 2,
            type: Math.floor(Math.random() * 8),
            sides: Math.floor(Math.random() * 6) + 3,
            complexity: Math.random() * 3 + 1
        });
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            hue: Math.random() * 360
        });
    }
}

function initWaveSources() {
    waveSources = [];
    for (let i = 0; i < waveCount; i++) {
        waveSources.push({
            x: Math.random() * W,
            y: Math.random() * H,
            phase: Math.random() * Math.PI * 2,
            frequency: 0.05 + Math.random() * 0.15,
            amplitude: 20 + Math.random() * 30
        });
    }
}

// Step functions
function step() {
    time += 0.02 * overallSpeed;
    retroTime += 0.02 * retroSpeed * overallSpeed;
    
    switch (fluidMode) {
        case 1: stepFluid(); break;
        case 2: stepFractal(); break;
        case 3: stepRipples(); break;
        case 4: stepParticles(); break;
        case 5: stepWaves(); break;
        case 6: stepKaleidoscope(); break;
        case 7: stepAudioVisual(); break;
        case 8: stepRetroAudioVisual(); break;
            case 9: stepPiano(); break;
        case 10: stepJulia2D(); break;
        case 11: stepJulia3D(); break;
        case 12: stepJuliaGL(); break;
}
    
    if (pulseToggle) {
        const freq = pulseSpeed * 0.1 * overallSpeed;
        brightnessPulse = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(Date.now() * freq));
        brightness = brightnessPulse;
    }
    
    if (rippleCycle) {
        rippleHue = (rippleHue + 2 * overallSpeed) % 360;
    }
}

function stepFluid() {
    for (let y = 1; y < H - 1; y++) {
        const row = y * W;
        const prevRow = (y - 1) * W;
        const nextRow = (y + 1) * W;
        
        for (let x = 1; x < W - 1; x++) {
            const i = row + x;
            const neighbors = (curr[i - 1] + curr[i + 1] + curr[prevRow + x] + curr[nextRow + x]) * 0.5;
            let newVal = (neighbors - prev[i]) * damping;
            
           
            
            prev[i] = newVal;
        }
    }
    
    [curr, prev] = [prev, curr];
    
    for (const layer of layers) {
        const t = time * layer.speed * overallSpeed + layer.offset;
        for (let y = 0; y < H; y++) {
            const row = y * W;
            for (let x = 0; x < W; x++) {
                const wave = Math.sin((x + y) * 0.1 + t) * layer.amp * 0.001;
                curr[row + x] += wave;
            }
        }
    }
}

function stepFractal() {
    if (reactive) {
        const cX = (mouseX / canvas.width - 0.5) * 3;
        const cY = (mouseY / canvas.height - 0.5) * 3;
        
        fractalOffsetX += (cX - fractalOffsetX) * 0.05;
        fractalOffsetY += (cY - fractalOffsetY) * 0.05;
        
        if (fractalType === 'julia') {
            juliaC.x = (mouseX / canvas.width - 0.5) * 2;
            juliaC.y = (mouseY / canvas.height - 0.5) * 2;
        }
    }
    
    const targetZoom = 1000000;
    const minZoom = 0.1;
    const delta = fractalZoomSpeed * 0.001 * overallSpeed;
    
    if (zoomDir > 0) {
        zoom = Math.min(targetZoom, zoom * (1 + delta));
        if (zoom >= targetZoom) zoomDir = -1;
    } else {
        zoom = Math.max(minZoom, zoom * (1 - delta));
        if (zoom <= minZoom) zoomDir = 1;
    }
}

function stepRipples() {
    ripples.forEach(ripple => {
        ripple.radius += ripple.speed * overallSpeed;
        ripple.intensity *= 0.995;
    });
    
    ripples = ripples.filter(ripple => ripple.radius < ripple.maxRadius && ripple.intensity > 0.01);
    
    if (!reactive && Math.random() < 0.01) {
        ripples.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 0,
            maxRadius: 150,
            speed: 3,
            intensity: 1
        });
    }
}

function stepParticles() {
    if (particles.length !== particleCount) initParticles();
    
    particles.forEach(particle => {
        particle.x += particle.vx * overallSpeed;
        particle.y += particle.vy * overallSpeed;
        
        if (reactive) {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const force = (150 - dist) * 0.0002;
                particle.vx += dx * force;
                particle.vy += dy * force;
            }
        }
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8;
        
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        
        particle.vx *= (typeof particleFriction==='number' ? particleFriction : 0.99);
        particle.vy *= (typeof particleFriction==='number' ? particleFriction : 0.99);
        
        if (rippleCycle) {
            particle.hue = (particle.hue + 2) % 360;
        }
    });

    // Particle interaction forces (repel/attract within particleRadius)
    (function(){
      const N = particles.length;
      const r = (typeof particleRadius==='number' ? particleRadius : 150);
      const useAttract = !!window.particleAttract;
      for (let i = 0; i < N; i++) {
        for (let j = i+1; j < N; j++) {
          const dx = particles[j].x - particles[i].x;
          const dy = particles[j].y - particles[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < r) {
            const force = (1 - dist / r) * 0.02;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            if (useAttract) {
              particles[i].vx += fx;
              particles[i].vy += fy;
              particles[j].vx -= fx;
              particles[j].vy -= fy;
            } else {
              particles[i].vx -= fx;
              particles[i].vy -= fy;
              particles[j].vx += fx;
              particles[j].vy += fy;
            }
          }
        }
      }
    })();
    }

function stepWaves() {
// --- stepWaves with media init (RIP) ---
    if (waveSources.length !== waveCount) initWaveSources();

    // Lazy init media systems + keybind
    if (!window.__mediaInit) {
        window.__mediaInit = true;
        window.mediaReactive = false; // toggle with 'M'
        window.mediaCanvas = document.createElement('canvas');
        window.mediaCanvas.width = 96; // small offscreen
        window.mediaCanvas.height = 72;
        window.mediaCtx = window.mediaCanvas.getContext('2d', { willReadFrequently: true });

        // Keyboard toggle
        window.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                window.mediaReactive = !window.mediaReactive;
            }
        }, { passive: true });

        // Try to grab camera + mic
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
              .then(stream => {
                  window.mediaStream = stream;
                  // Video element (hidden)
                  const vid = document.createElement('video');
                  vid.muted = true; vid.autoplay = true; vid.playsInline = true;
                  vid.srcObject = stream;
                  window.mediaVideo = vid;
                  // Audio analyser
                  try {
                      const ac = new (window.AudioContext || window.webkitAudioContext)();
                      const src = ac.createMediaStreamSource(stream);
                      const analyser = ac.createAnalyser();
                      analyser.fftSize = 256;
                      src.connect(analyser);
                      window.mediaAudio = { ac, analyser, data: new Uint8Array(analyser.frequencyBinCount) };
                  } catch (err) {
                      console.warn('Audio init failed:', err);
                  }
              })
              .catch(err => {
                  console.warn('Media permission denied or failed:', err);
              });
        }
    }

    // Update media frame + audio level if available
    if (window.mediaReactive && window.mediaVideo && window.mediaCtx) {
        const v = window.mediaVideo;
        const mctx = window.mediaCtx;
        const mc = window.mediaCanvas;
        try {
            mctx.drawImage(v, 0, 0, mc.width, mc.height);
            window.mediaImageData = mctx.getImageData(0, 0, mc.width, mc.height);
        } catch (e) {
            // ignore if frame not ready
        }
    }
    if (window.mediaReactive && window.mediaAudio && window.mediaAudio.analyser) {
        const A = window.mediaAudio;
        A.analyser.getByteFrequencyData(A.data);
        // Compute average energy 0..1
        let sum = 0;
        for (let i = 0; i < A.data.length; i++) sum += A.data[i];
        const avg = sum / (A.data.length * 255);
        window.mediaAudioLevel = avg; // 0..1
    } else {
        window.mediaAudioLevel = 0;
    }

    const mouseInfluence = reactive ? 0.15 : 0.0;
    for (let idx = 0; idx < waveSources.length; idx++) {
        const source = waveSources[idx];
        source.phase += 0.12 * waveSpeed * overallSpeed;

        if (!reactive) {
            source.x += Math.sin(source.phase * 0.07 + idx) * 0.25;
            source.y += Math.cos(source.phase * 0.06 + idx) * 0.25;
        } else {
            const tx = (mouseX / canvas.width) * W;
            const ty = (mouseY / canvas.height) * H;
            source.x += (tx - source.x) * mouseInfluence * 0.02;
            source.y += (ty - source.y) * mouseInfluence * 0.02;
        }

        if (source.x < 0) source.x = 0; else if (source.x > W) source.x = W;
        if (source.y < 0) source.y = 0; else if (source.y > H) source.y = H;
    }
}



function stepKaleidoscope() {
    var __kc = Math.max(1, Math.floor(kaleidoComplexity * (typeof patternComplexityFactor==='number'? patternComplexityFactor : 1)));
    if (kaleidoPatterns.length !== __kc) { kaleidoComplexity = __kc; initKaleidoPatterns(); }
    
    kaleidoAngle += kaleidoRotation * 0.02 * overallSpeed;
    if (typeof patternRotation==='number') { kaleidoAngle += patternRotation * 0.01 * overallSpeed; }
    
    kaleidoPatterns.forEach(pattern => {
        pattern.phase += pattern.speed * 0.03 * overallSpeed;
        pattern.rotation += pattern.rotationSpeed * 0.02 * overallSpeed;
        pattern.pulsePhase += 0.05 * overallSpeed;
        
        const morphX = Math.sin(pattern.phase * kaleidoMorph) * 0.1;
        const morphY = Math.cos(pattern.phase * kaleidoMorph * 0.7) * 0.1;
        pattern.x = pattern.baseX + morphX;
        pattern.y = pattern.baseY + morphY;
        
        if (reactive) {
            const dx = (mouseX / canvas.width - 0.5) * 0.05;
            const dy = (mouseY / canvas.height - 0.5) * 0.05;
            pattern.x += dx;
            pattern.y += dy;
        }
        
        pattern.x = ((pattern.x % 1) + 1) % 1;
        pattern.y = ((pattern.y % 1) + 1) % 1;
    });
}

function stepAudioVisual() {
    // Audio-Visual mode
}

function stepRetroAudioVisual() {
    if (hasPermissions && analyser && retroMode === 'oscilloscope') {
        const timeData = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(timeData);
        waveformHistory.push([...timeData]);
        if (waveformHistory.length > 100) {
            waveformHistory.shift();
        }
    }
    
    if (retroMode === 'starfield') {
        retroStars.forEach(star => {
            star.z -= star.speed * retroSpeed * overallSpeed;
            if (star.z <= 0) {
                star.x = Math.random() * canvas.width;
                star.y = Math.random() * canvas.height;
                star.z = 1000;
            }
        });
    }
    
    if (retroMode === 'matrix') {
        matrixChars.forEach(col => {
            col.y += col.speed * retroSpeed * overallSpeed;
            if (col.y > canvas.height + col.trail * 16) {
                col.y = -col.trail * 16;
                col.speed = Math.random() * 3 + 1;
                
                if (Math.random() < 0.1) {
                    col.chars.forEach(charObj => {
                        if (Math.random() < 0.3) {
                            charObj.char = matrixCharset[Math.floor(Math.random() * matrixCharset.length)];
                        }
                    });
                }
            }
        });
    }
    
    if (retroMode === 'terminal') {
        terminalLines.forEach(line => {
            line.age += retroSpeed * overallSpeed;
            if (line.age > line.maxAge) {
                line.text = generateRandomCommand();
                line.age = 0;
                line.maxAge = 200 + Math.random() * 300;
            }
        });
    }
}

// Render functions
function render() {
    if (trails && ![1, 2].includes(fluidMode)) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (gradientBG && ![1, 2].includes(fluidMode)) {
        ctx.fillStyle = createGradient();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    switch (fluidMode) {
        case 1: renderFluid(); break;
        case 2: renderFractal(); break;
        case 3: renderRipples(); break;
        case 4: renderParticles(); break;
        case 5: renderWaves(); break;
        case 6: renderKaleidoscope(); break;
        case 7: renderAudioVisual(); break;
        case 8: renderRetroAudioVisual(); break;
            case 9: renderPiano(); break;
        case 10: renderJulia2D(); break;
        case 11: renderJulia3D(); break;
        case 12: renderJuliaGL(); break;
}

    maskImpactPostRender(fluidMode);
    if (window.showMaskOverlay) drawMaskOverlay();
}

function createGradient() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const hue1 = rippleHue % 360;
    const hue2 = (rippleHue + 120) % 360;
    gradient.addColorStop(0, `hsl(${hue1}, 80%, 10%)`);
    gradient.addColorStop(0.5, `hsl(${hue2}, 60%, 15%)`);
    gradient.addColorStop(1, `hsl(${(hue1 + 240) % 360}, 80%, 10%)`);
    return gradient;
}

function renderFluid() {
    const pixels = imageData.data;
    const rippleRGB = hslToRgb(rippleHue / 360, 1, brightness);
    
    for (let i = 0; i < size; i++) {
        const d = curr[i];
        const x = i % W;
        const y = (i / W) | 0;
        
        const sx = Math.max(0, Math.min(W - 1, x + (d * disp) | 0));
        const sy = Math.max(0, Math.min(H - 1, y + (d * disp) | 0));
        const sample = base[sy * W + sx];
        
        const shade = Math.max(0, Math.min(255, sample + d * 50));
        const pi = i * 4;
        
        let r = rippleRGB[0] * shade / 255;
        let g = rippleRGB[1] * shade / 255;
        let b = rippleRGB[2] * shade / 255;
        
        if (invert) {
            r = 255 - r;
            g = 255 - g;
            b = 255 - b;
        }
        
        pixels[pi] = r;
        pixels[pi + 1] = g;
        pixels[pi + 2] = b;
        pixels[pi + 3] = 255;
    }
    
    offCtx.putImageData(imageData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.filter = blur > 0 ? `blur(${blur}px)` : 'none';
    ctx.drawImage(offCanvas, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';
}

function renderFractal() {
    const fCanvas = document.createElement('canvas');
    fCanvas.width = fractalRes;
    fCanvas.height = fractalRes;
    const fCtx = fCanvas.getContext('2d');
    const fImage = fCtx.createImageData(fractalRes, fractalRes);
    const fPixels = fImage.data;
    
    const scale = 4 / zoom;
    const maxIter = fractalMaxIter;
    
    for (let py = 0; py < fractalRes; py++) {
        const row = py * fractalRes;
        for (let px = 0; px < fractalRes; px++) {
            let iter = 0;
            
            switch (fractalType) {
                case 'mandelbrot':
                    iter = mandelbrot(px, py, fractalRes, fractalRes, scale, maxIter);
                    break;
                case 'julia':
                    iter = julia(px, py, fractalRes, fractalRes, scale, maxIter);
                    break;
                case 'burning':
                    iter = burningShip(px, py, fractalRes, fractalRes, scale, maxIter);
                    break;
            }
            
            const t = iter === maxIter ? 0 : iter / maxIter;
            const hue = (t * 360 + fractalHueOffset + time * 20) % 360;
            const rgb = hslToRgb(hue / 360, fractalSaturation / 100, t * 0.8);
            
            const pi = (row + px) * 4;
            fPixels[pi] = invert ? 255 - rgb[0] : rgb[0];
            fPixels[pi + 1] = invert ? 255 - rgb[1] : rgb[1];
            fPixels[pi + 2] = invert ? 255 - rgb[2] : rgb[2];
            fPixels[pi + 3] = 255;
        }
    }
    
    fCtx.putImageData(fImage, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(fCanvas, 0, 0, canvas.width, canvas.height);
}

function renderRipples() {
    const rippleRGB = hslToRgb(rippleHue / 360, 1, brightness);
    
    ripples.forEach(ripple => {
        const si = getSilhouetteInfluence(ripple.x, ripple.y);
        const alpha = Math.min(1,(ripple.intensity*0.8)*(1+si*1.5));
        ctx.strokeStyle = invert
            ? `rgba(${255 - rippleRGB[0]}, ${255 - rippleRGB[1]}, ${255 - rippleRGB[2]}, ${alpha})`
            : `rgba(${rippleRGB[0]}, ${rippleRGB[1]}, ${rippleRGB[2]}, ${alpha})`;
        
        ctx.lineWidth = (2 + ripple.intensity * 2) * (1 + si*1.2);
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        if (ripple.radius > 30) {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
    });
}

function renderParticles() {
    particles.forEach(particle => {
        const si = getSilhouetteInfluence(particle.x, particle.y);
        const boost = 1 + si * 2.0;
        const rgb = hslToRgb(particle.hue / 360, 1, brightness);
        ctx.fillStyle = invert
            ? `rgb(${255 - rgb[0]}, ${255 - rgb[1]}, ${255 - rgb[2]})`
            : `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize*boost, 0, Math.PI*2);
        ctx.fill();
        
        if (trails) {
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 1 + si*3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
            ctx.stroke();
        }
    });
}

function renderWaves() {
// --- renderWaves with media-driven modulation (RIP) ---
    // resolutionFactor morph (existing)
    if (!window.resolutionFactor) window.resolutionFactor = 1.0;
    if (!window.targetResolutionFactor) window.targetResolutionFactor = 1.0;
    window.resolutionFactor += (window.targetResolutionFactor - window.resolutionFactor) * 0.05;

    let baseTile = Math.max(8, Math.floor(canvas.width / (W * 0.5)));
    baseTile = Math.max(baseTile, Math.floor(canvas.height / (H * 0.5)));
    baseTile = Math.max(8, Math.min(24, baseTile));
    let tile = Math.floor(baseTile * 2 * window.resolutionFactor);
    tile = Math.max(12, Math.min(48, tile));

    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const LEVELS = 7;
    const falloff = (typeof waveFalloff==='number'? waveFalloff : 0.006);
    const hueBase = rippleHue;
    const sat = 100;
    const lBase = brightness * 60 + 20;
    const sx = canvas.width / W;
    const sy = canvas.height / H;

    if (!window.waveDisturb) window.waveDisturb = {};
    const disturb = window.waveDisturb;
    const now = performance.now();

    // Mouse velocity tracker (existing from prior rip)
    if (!window.waveMouse) window.waveMouse = {x: mouseX || 0, y: mouseY || 0, t: now, vx: 0, vy: 0, speed: 0};
    const wm = window.waveMouse;
    const dt = Math.max(0.016, (now - wm.t) / 1000.0);
    const dxv = (mouseX - wm.x) || 0;
    const dyv = (mouseY - wm.y) || 0;
    const speed = Math.hypot(dxv, dyv) / dt;
    const velNorm = Math.min(1, speed / 1200);
    wm.x = mouseX; wm.y = mouseY; wm.t = now; wm.vx = dxv / dt; wm.vy = dyv / dt; wm.speed = speed;

    // --- Media inputs ---
    const mediaOn = !!(window.mediaReactive || (window.mediaImageData && window.mediaCtx));
    const micLevel = (window.mediaAudioLevel || 0); // 0..1
    const img = window.mediaImageData || null;
    const mcw = window.mediaCanvas ? window.mediaCanvas.width : 0;
    const mch = window.mediaCanvas ? window.mediaCanvas.height : 0;

    // Radius: base + pulse + velocity + audio thump
    const baseRadius = 170;
    const pulseAmp = 80;
    const pulseSpeed = 2.0;
    const velBoost = 180 * velNorm;
    const audioBoost = mediaOn ? (220 * micLevel) : 0;
    const radius = baseRadius + Math.sin(time * pulseSpeed) * pulseAmp + velBoost + audioBoost;

    const vlen = Math.hypot(wm.vx, wm.vy);
    const vdx = vlen > 1 ? (wm.vx / vlen) : 0;
    const vdy = vlen > 1 ? (wm.vy / vlen) : 0;

    // Pre-calc pointer to pixel buffer
    let pixels = null;
    if (img && img.data) pixels = img.data;

    // Slight overlay to blend video silhouettes when on
    if (mediaOn) ctx.globalCompositeOperation = 'source-over';

    for (let y = 0; y < canvas.height; y += tile) {
        for (let x = 0; x < canvas.width; x += tile) {
            const cx = x + tile * 0.5;
            const cy = y + tile * 0.5;
            const gx = cx / sx;
            const gy = cy / sy;

            // Sample interference
            let amp = 0;
            for (let i = 0; i < waveSources.length; i++) {
                const s = waveSources[i];
                const dx = gx - s.x;
                const dy = gy - s.y;
                const dist = Math.hypot(dx, dy) + 0.0001;
                amp += Math.sin(dist * s.frequency + s.phase) * (s.amplitude / (1 + dist * falloff));
            }
            const norm = Math.tanh(amp * 0.02);
            let q = Math.floor(((norm + 1) * 0.5) * LEVELS);
            if (q < 0) q = 0; if (q > LEVELS) q = LEVELS;

            // Base color
            let hue = (hueBase + q * 18 + (rippleCycle ? (time * 120) : 0)) % 360;
            const light = Math.max(10, Math.min(90, lBase + (q - LEVELS/2) * 6));

            // Media pixel sample → 0..1 brightness + optional hue nudge
            let mediaVal = 0, mediaHue = 0;
            if (mediaOn && pixels) {
                // Map tile center onto media offscreen
                const mx = Math.floor((cx / canvas.width) * mcw);
                const my = Math.floor((cy / canvas.height) * mch);
                const idx = (my * mcw + mx) * 4;
                const r = pixels[idx] || 0, g = pixels[idx+1] || 0, b = pixels[idx+2] || 0;
                mediaVal = (0.2126*r + 0.7152*g + 0.0722*b) / 255; // luma
                // quick hue proxy via channel dominance
                if (r >= g && r >= b) mediaHue = 0;
                else if (g >= r && g >= b) mediaHue = 120;
                else mediaHue = 240;
                // Nudge hue towards media tint a bit
                hue = (hue * 0.85 + mediaHue * 0.15) % 360;
            }
            // Derived silhouette intensity from threshold (0 or 1 in mask)
            var silhouetteI = (mediaOn && mediaVal > 0.55) ? Math.min(1, (mediaVal - 0.55) * 2.5 * getMaskStrength()) : 0;


            const baseColor = invert
                ? `hsl(${(hue + 180) % 360}, ${sat}%, ${100 - light}%)`
                : `hsl(${hue}, ${sat}%, ${light}%)`;

            // Mouse distance
            const dxm = cx - mouseX;
            const dym = cy - mouseY;
            const distm = Math.hypot(dxm, dym);
            const key = x + "," + y;

            // Disturbance intensity: ring + velocity + audio + video threshold
            let intensity = 0;
            const mediaKick = mediaOn ? (mediaVal > 0.55 ? (mediaVal - 0.55) * getMaskStrength() : 0) : 0; // thresholdy
            if (distm < radius) {
                const edgeBand = Math.max(20, radius * 0.25);
                const edgeCenter = radius * 0.8;
                const edgeFactor = Math.max(0, 1 - Math.abs(distm - edgeCenter) / edgeBand);
                const baseI = 0.45 + 0.55 * edgeFactor;
                const velI = 0.4 * velNorm;
                const audI = 0.6 * micLevel;
                const pixI = 0.7 * mediaKick;
                const newI = Math.min(1, baseI + velI + audI + pixI);
                disturb[key] = { t: now, i: newI };
                intensity = newI;
            } else if (disturb[key]) {
                const age = (now - disturb[key].t) / 1000.0;
                const fade = Math.max(0, 1.0 - age / 2.0);
                if (fade > 0) intensity = disturb[key].i * fade;
                else delete disturb[key];
            }

            // Apply silhouette-driven intensity when outside ring
            if (silhouetteI > intensity) intensity = silhouetteI;

            if (intensity > 0.01) {
                // Disturbed: chromatic ghosting + directional shards, amplified by audio
                const shardCount = 6 + Math.floor(6 * micLevel);
                const baseOffset = tile * 0.5 * intensity * (1.0 + micLevel * 0.8);
                let sxdir = vdx, sydir = vdy;
                if (vlen <= 1) {
                    const rl = Math.hypot(dxm, dym) || 1;
                    sxdir = dxm / rl; sydir = dym / rl;
                }
                for (let s = 0; s < shardCount; s++) {
                    const rand = (Math.random() * 2 - 1);
                    const off = baseOffset * (0.3 + 0.7 * Math.random());
                    const ox = sxdir * off + rand * (tile * 0.25 * intensity);
                    const oy = sydir * off + rand * (tile * 0.25 * intensity);
                    const w = tile / 3, h = tile / 3;
                    const jlight = Math.max(0, Math.min(100, light + (Math.random() * 2 - 1) * 15 * intensity));
                    const offs = [
                        { dh: 0,   dx: 0,                 dy: 0                },
                        { dh: 120, dx: 1.5 * intensity,   dy: 0.5 * intensity  },
                        { dh: 240, dx: -1.0 * intensity,  dy: -1.0 * intensity }
                    ];
                    for (let k = 0; k < offs.length; k++) {
                        const hu = (hue + offs[k].dh) % 360;
                        const col = invert
                            ? `hsl(${(hu + 180) % 360}, ${sat}%, ${100 - jlight}%)`
                            : `hsl(${hu}, ${sat}%, ${jlight}%)`;
                        ctx.fillStyle = col;
                        ctx.globalAlpha = 0.9 - k * 0.15;
                        ctx.fillRect(cx + ox + offs[k].dx, cy + oy + offs[k].dy, w, h);
                    }
                    ctx.globalAlpha = 1.0;
                }

                // Optional silhouette overlay from media: draw faint threshold blocks
                if (mediaOn && mediaKick > 0.0) {
                    ctx.globalAlpha = 0.15 * mediaKick;
                    ctx.fillStyle = invert
                        ? `hsl(${(mediaHue + 180) % 360}, ${sat}%, ${100 - light}%)`
                        : `hsl(${mediaHue}, ${sat}%, ${light}%)`;
                    ctx.fillRect(x, y, tile, tile);
                    ctx.globalAlpha = 1.0;
                }
            } else {
                // Normal block
                ctx.fillStyle = baseColor;
                ctx.fillRect(x, y, tile, tile);
                if (q >= LEVELS - 2) {
                    ctx.globalAlpha = 0.25;
                    ctx.fillStyle = "#000";
                    ctx.fillRect(x, y, tile, 1);
                    ctx.fillRect(x, y, 1, tile);
                    ctx.globalAlpha = 1;
                }

                // Mild overlay when media is bright, even outside ring
                if (mediaOn && mediaVal > 0.75) {
                    ctx.globalAlpha = 0.08 * (mediaVal - 0.75) * 4;
                    ctx.fillStyle = invert
                        ? `hsl(${(mediaHue + 180) % 360}, ${sat}%, ${100 - light}%)`
                        : `hsl(${mediaHue}, ${sat}%, ${light}%)`;
                    ctx.fillRect(x, y, tile, tile);
                    ctx.globalAlpha = 1.0;
                }
            }
        }
    }

// === Mask Overlay Debug ===
if (window.showMaskOverlay && window.mediaImageData) {
    const img = window.mediaImageData;
    const w = img.width, h = img.height;
    if (!window._maskCanvas) window._maskCanvas = document.createElement('canvas');
    const mc = window._maskCanvas;
    if (mc.width !== w || mc.height !== h) { mc.width = w; mc.height = h; }
    const mctx = mc.getContext('2d');
    try { mctx.putImageData(img, 0, 0); } catch(e) {}
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(mc, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
    ctx.restore();
}


}



function renderKaleidoscope() {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(kaleidoAngle);
    ctx.scale(kaleidoZoom, kaleidoZoom);
    
    const segmentAngle = (Math.PI * 2) / kaleidoSegments;
    
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, Math.max(canvas.width, canvas.height), 0, segmentAngle);
    ctx.closePath();
    ctx.clip();
    
    kaleidoPatterns.forEach(pattern => {
        const x = (pattern.x - 0.5) * canvas.width;
        const y = (pattern.y - 0.5) * canvas.height;
        const size = pattern.size * canvas.width;
        const pulse = 1 + Math.sin(pattern.pulsePhase) * 0.4;
        const hue = (rippleHue + pattern.hueOffset + pattern.phase * 30) % 360;
        const rgb = hslToRgb(hue / 360, 1, brightness);
        
        ctx.fillStyle = invert
            ? `rgba(${255 - rgb[0]}, ${255 - rgb[1]}, ${255 - rgb[2]}, 0.8)`
            : `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`;
        
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 2;
        
        const animatedSize = size * pulse;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(pattern.rotation);
        
        switch (pattern.type) {
            case 0:
                ctx.beginPath();
                ctx.arc(0, 0, animatedSize, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 1:
                drawPolygon(ctx, 0, 0, animatedSize, pattern.sides);
                ctx.fill();
                ctx.stroke();
                break;
            case 2:
                drawStar(ctx, 0, 0, animatedSize, pattern.sides);
                ctx.fill();
                ctx.stroke();
                break;
        }
        
        ctx.restore();
    });
    
    ctx.restore();
    
    for (let i = 1; i < kaleidoSegments; i++) {
        ctx.save();
        ctx.rotate(i * segmentAngle);
        if (i % 2 === 1) {
            ctx.scale(1, -1);
        }
        
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, Math.max(canvas.width, canvas.height), 0, segmentAngle);
        ctx.closePath();
        ctx.clip();
        
        kaleidoPatterns.forEach(pattern => {
            const x = (pattern.x - 0.5) * canvas.width;
            const y = (pattern.y - 0.5) * canvas.height;
            const size = pattern.size * canvas.width;
            const pulse = 1 + Math.sin(pattern.pulsePhase) * 0.4;
            const hue = (rippleHue + pattern.hueOffset + pattern.phase * 30) % 360;
            const rgb = hslToRgb(hue / 360, 1, brightness);
            
            ctx.fillStyle = invert
                ? `rgba(${255 - rgb[0]}, ${255 - rgb[1]}, ${255 - rgb[2]}, 0.8)`
                : `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.8)`;
            
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 2;
            
            const animatedSize = size * pulse;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(pattern.rotation);
            
            switch (pattern.type) {
                case 0:
                    ctx.beginPath();
                    ctx.arc(0, 0, animatedSize, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 1:
                    drawPolygon(ctx, 0, 0, animatedSize, pattern.sides);
                    ctx.fill();
                    ctx.stroke();
                    break;
                case 2:
                    drawStar(ctx, 0, 0, animatedSize, pattern.sides);
                    ctx.fill();
                    ctx.stroke();
                    break;
            }
            
            ctx.restore();
        });
        
        ctx.restore();
        ctx.restore();
    }
    
    ctx.restore();
}

function renderAudioVisual() {
    // Draw video only - no audio visualization (moved to global monitor)
    if (hasPermissions && videoElement && videoElement.videoWidth > 0 && videoElement.readyState >= 2 && !videoElement.paused) {
        try {
            ctx.save();
            ctx.globalAlpha = videoOpacity;
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            ctx.restore();
        } catch (err) {
            console.error('Video render error:', err);
        }
    } else if (!hasPermissions) {
        ctx.fillStyle = 'white';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CLICK "ENABLE CAMERA & MIC"', canvas.width / 2, canvas.height / 2);
        ctx.fillText('TO USE AUDIO-VISUAL MODE', canvas.width / 2, canvas.height / 2 + 30);
    }
}

function renderRetroAudioVisual() {
    const baseColor = retroGreen ? '#00ff00' : (invert ? `hsl(${360 - rippleHue}, 100%, 70%)` : `hsl(${rippleHue}, 100%, 70%)`);
    const dimColor = retroGreen ? '#008800' : (invert ? `hsl(${360 - rippleHue}, 80%, 40%)` : `hsl(${rippleHue}, 80%, 40%)`);
    
    switch (retroMode) {
        case 'oscilloscope':
            renderOscilloscope(baseColor, dimColor);
            break;
        case 'spectrum':
            renderSpectrum(baseColor, dimColor);
        
            break;
        case 'starfield':
            renderStarfield(baseColor, dimColor);
            break;
        case 'matrix':
            renderMatrix(baseColor, dimColor);
            break;
        case 'terminal':
            renderTerminal(baseColor, dimColor);
            break;
    }
    
    if (scanLines || crtGlow) {
        applyCRTEffects();
    }
    
    if (!hasPermissions) {
        ctx.fillStyle = baseColor;
        ctx.font = `${16 * retroSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText('ENABLE MICROPHONE FOR AUDIO REACTIVE EFFECTS', canvas.width / 2, canvas.height / 2);
        ctx.fillText('>>> PRESS ENABLE CAMERA & MIC BUTTON <<<', canvas.width / 2, canvas.height / 2 + 30 * retroSize);
    }
}

// Retro render functions (condensed versions)
function renderOscilloscope(baseColor, dimColor) {
    const centerY = canvas.height / 2;
    const amplitude = canvas.height * 0.3 * retroIntensity;
    
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 2 * retroSize;
    
    if (hasPermissions && waveformHistory.length > 0) {
        const latestWaveform = waveformHistory[waveformHistory.length - 1];
        const step = canvas.width / latestWaveform.length;
        
        ctx.beginPath();
        for (let i = 0; i < latestWaveform.length; i++) {
            const x = i * step;
            const y = centerY + ((latestWaveform[i] - 128) / 128) * amplitude;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}

function renderSpectrum(baseColor, dimColor) {
    if (!hasPermissions || !audioData) return;
    
    const barCount = Math.min(audioData.length, 128);
    const barWidth = canvas.width / barCount;
    const maxHeight = canvas.height * 0.8;
    
    for (let i = 0; i < barCount; i++) {
        const amplitude = audioData[i] / 255;
        const height = amplitude * maxHeight * retroIntensity;
        const x = i * barWidth;
        
        ctx.fillStyle = retroGreen ?
            `rgba(0, 255, 0, ${amplitude})` :
            `hsla(${rippleHue + i * 2}, 100%, 70%, ${amplitude})`;
        
        ctx.fillRect(x, canvas.height - height, barWidth - 2, height);
    }
}



function renderStarfield(baseColor, dimColor) {
    retroStars.forEach(star => {
        const x = (star.x - canvas.width/2) * (1000 / star.z) + canvas.width/2;
        const y = (star.y - canvas.height/2) * (1000 / star.z) + canvas.height/2;
        
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
            const size = (1000 / star.z) * retroSize;
            const brightness = Math.min(1, (1000 - star.z) / 1000);
            
            ctx.fillStyle = retroGreen ?
                `rgba(0, 255, 0, ${brightness})` :
                `hsla(${rippleHue}, 100%, 70%, ${brightness})`;
            
            ctx.beginPath();
            ctx.arc(x, y, Math.max(1, size), 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function renderMatrix(baseColor, dimColor) {
    const charSize = 12 * retroSize;
    
    ctx.font = `${charSize}px monospace`;
    ctx.textAlign = 'center';
    
    matrixChars.forEach((col, colIndex) => {
        const x = colIndex * charSize + charSize/2;
        
        col.chars.forEach((charObj, charIndex) => {
            const y = col.y - (charIndex * charSize);
            
            if (y > -charSize && y < canvas.height + charSize) {
                let color = retroGreen ?
                    `rgba(0, 255, 0, ${charObj.brightness})` :
                    `hsla(${rippleHue + colIndex * 5}, 100%, 70%, ${charObj.brightness})`;
                
                ctx.fillStyle = color;
                ctx.fillText(charObj.char, x, y);
            }
        });
    });
}

function renderTerminal(baseColor, dimColor) {
    const lineHeight = 16 * retroSize;
    const fontSize = 12 * retroSize;
    
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = 'left';
    
    terminalLines.forEach((line, index) => {
        const y = (index * lineHeight) + 20;
        const alpha = Math.max(0.2, 1 - (line.age / line.maxAge));
        
        ctx.fillStyle = retroGreen ?
            `rgba(0, 255, 0, ${alpha})` :
            `hsla(${rippleHue}, 100%, 70%, ${alpha})`;
        
        ctx.fillText(line.text, 10, y);
    });
}

function applyCRTEffects() {
    if (scanLines) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let y = 0; y < canvas.height; y += 4) {
            ctx.fillRect(0, y, canvas.width, 2);
        }
    }
    
    if (crtGlow) {
        const gradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2, 0,
            canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Geometry drawing functions
function drawPolygon(ctx, x, y, radius, sides) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

function drawStar(ctx, x, y, radius, points) {
    ctx.beginPath();
    const outerRadius = radius;
    const innerRadius = radius * 0.5;
    
    for (let i = 0; i < points * 2; i++) {
        const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

// Fractal calculation functions
function mandelbrot(px, py, width, height, scale, maxIter) {
    const x0 = (px - width / 2) * scale + fractalOffsetX;
    const y0 = (py - height / 2) * scale + fractalOffsetY;
    let x = 0, y = 0, iter = 0;
    
    while (x * x + y * y <= 4 && iter < maxIter) {
        const xt = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xt;
        iter++;
    }
    
    return iter;
}

function julia(px, py, width, height, scale, maxIter) {
    let x = (px - width / 2) * scale + fractalOffsetX;
    let y = (py - height / 2) * scale + fractalOffsetY;
    let iter = 0;
    
    while (x * x + y * y <= 4 && iter < maxIter) {
        const xt = x * x - y * y + juliaC.x;
        y = 2 * x * y + juliaC.y;
        x = xt;
        iter++;
    }
    
    return iter;
}

function burningShip(px, py, width, height, scale, maxIter) {
    const x0 = (px - width / 2) * scale + fractalOffsetX;
    const y0 = (py - height / 2) * scale + fractalOffsetY;
    let x = 0, y = 0, iter = 0;
    
    while (x * x + y * y <= 4 && iter < maxIter) {
        const xt = x * x - y * y + x0;
        y = Math.abs(2 * x * y) + y0;
        x = Math.abs(xt);
        iter++;
    }
    
    return iter;
}

// Main loop

function updateMediaPreview() {
if (!mediaPreview || !mediaPrevCtx) return;
const v = videoElement;
if (!v || v.readyState < 2 || v.videoWidth === 0) {
    mediaPrevCtx.fillStyle = 'black';
    mediaPrevCtx.fillRect(0,0,mediaPreview.width,mediaPreview.height);
    window.mediaImageData = null;
    return;
}
if (mediaCanvas.width !== mediaPreview.width || mediaCanvas.height !== mediaPreview.height) {
    mediaCanvas.width = mediaPreview.width;
    mediaCanvas.height = mediaPreview.height;
}
const mctx = mediaCtx;
try {
    mctx.drawImage(v, 0, 0, mediaCanvas.width, mediaCanvas.height);
    const frame = mctx.getImageData(0, 0, mediaCanvas.width, mediaCanvas.height);
    const data = frame.data;
    const t = (typeof thresholdLevel !== 'undefined') ? thresholdLevel : 128;
    for (let p = 0; p < data.length; p += 4) {
        const l = 0.2126*data[p] + 0.7152*data[p+1] + 0.0722*data[p+2];
        const on = l > t ? 255 : 0;
        data[p]=data[p+1]=data[p+2]=on;
        data[p+3]=255;
    }
    window.mediaImageData = frame;
    mediaPrevCtx.putImageData(frame, 0, 0);
} catch(e) {
    mediaPrevCtx.fillStyle='black';
    mediaPrevCtx.fillRect(0,0,mediaPreview.width,mediaPreview.height);
    window.mediaImageData=null;
}
}


function loop() {
    requestAnimationFrame(loop);
    
    step();
    render();
    updateMediaPreview();
    updateAudioMonitor(); // Update global audio monitor
    
    // FPS calculation
    const now = performance.now();
    const fpsEl = document.getElementById('fps');
    if (fpsEl) {
        const fps = Math.round(1000 / (now - (loop.last || now)));
        fpsEl.textContent = `FPS: ${fps}`;
    }
    loop.last = now;
    
    // Clock update
    const d = new Date();
    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.textContent = d.toLocaleTimeString();
    }
}

// Helper functions
function hslToRgb(h, s, l) {
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function disturb(x, y, strength) {
    const rect = canvas.getBoundingClientRect();
    const cx = Math.floor((x - rect.left) / rect.width * W);
    const cy = Math.floor((y - rect.top) / rect.height * H);
    const r2 = radius * radius;
    
    for (let y0 = Math.max(0, cy - radius); y0 <= Math.min(H - 1, cy + radius); y0++) {
        const row = y0 * W;
        
        for (let x0 = Math.max(0, cx - radius); x0 <= Math.min(W - 1, cx + radius); x0++) {
            const dx = x0 - cx;
            const dy = y0 - cy;
            const dist2 = dx * dx + dy * dy;
            
            if (dist2 <= r2) {
                const falloff = 1 - Math.sqrt(dist2) / (radius + 0.001);
                curr[row + x0] += strength * falloff * 0.001;
            }
        }
    }
}

// Controls
const controls = {
    strength: document.getElementById('strength'),
    damping: document.getElementById('damping'),
    disp: document.getElementById('disp'),
    radius: document.getElementById('radius'),
    res: document.getElementById('res'),
    rippleColor: document.getElementById('rippleColor'),
    brightness: document.getElementById('brightness'),
    blur: document.getElementById('blur'),
    pulseSpeed: document.getElementById('pulseSpeed'),
    overallSpeed: document.getElementById('overallSpeed'),
    particleCount: document.getElementById('particleCount'),
    particleSize: document.getElementById('particleSize'),
    waveCount: document.getElementById('waveCount'),
    waveSpeed: document.getElementById('waveSpeed'),
    kaleidoSegments: document.getElementById('kaleidoSegments'),
    kaleidoZoom: document.getElementById('kaleidoZoom'),
    kaleidoRotation: document.getElementById('kaleidoRotation'),
    kaleidoComplexity: document.getElementById('kaleidoComplexity'),
    kaleidoMorph: document.getElementById('kaleidoMorph'),
    videoOpacity: document.getElementById('videoOpacity'),
    retroMode: document.getElementById('retroMode'),
    retroSpeed: document.getElementById('retroSpeed'),
    retroSize: document.getElementById('retroSize'),
    retroIntensity: document.getElementById('retroIntensity'),
    pulseToggle: document.getElementById('pulseToggle'),
    invert: document.getElementById('invert'),
    rippleCycle: document.getElementById('rippleCycle'),
    gradientBG: document.getElementById('gradientBG'),
    trails: document.getElementById('trails'),
    reactive: document.getElementById('reactive'),
    scanLines: document.getElementById('scanLines'),
    crtGlow: document.getElementById('crtGlow'),
    retroGreen: document.getElementById('retroGreen'),
    fractalZoomSpeed: document.getElementById('fractalZoomSpeed'),
    fractalMaxIter: document.getElementById('fractalMaxIter'),
    fractalHueOffset: document.getElementById('fractalHueOffset'),
    fractalSaturation: document.getElementById('fractalSaturation'),
    fractalType: document.getElementById('fractalType')
};

// Control event listeners
controls.strength.oninput = e => rippleStrength = +e.target.value;
controls.damping.oninput = e => damping = +e.target.value;
controls.disp.oninput = e => disp = +e.target.value;
controls.radius.oninput = e => radius = +e.target.value;
controls.res.oninput = e => initBase(+e.target.value);
controls.rippleColor.oninput = e => rippleHue = +e.target.value;
controls.brightness.oninput = e => brightness = +e.target.value;
controls.blur.oninput = e => blur = +e.target.value;
controls.pulseSpeed.oninput = e => pulseSpeed = +e.target.value;
controls.overallSpeed.oninput = e => overallSpeed = +e.target.value;
controls.particleCount.oninput = e => { particleCount = +e.target.value; initParticles(); };
controls.particleSize.oninput = e => particleSize = +e.target.value;
controls.waveCount.oninput = e => { waveCount = +e.target.value; initWaveSources(); };
controls.waveSpeed.oninput = e => waveSpeed = +e.target.value;
controls.kaleidoSegments.oninput = e => kaleidoSegments = +e.target.value;
controls.kaleidoZoom.oninput = e => kaleidoZoom = +e.target.value;
controls.kaleidoRotation.oninput = e => kaleidoRotation = +e.target.value;
controls.kaleidoComplexity.oninput = e => { kaleidoComplexity = +e.target.value; initKaleidoPatterns(); };
controls.kaleidoMorph.oninput = e => kaleidoMorph = +e.target.value;
controls.videoOpacity.oninput = e => videoOpacity = +e.target.value;
controls.retroMode.onchange = e => { retroMode = e.target.value; initRetroEffects(); };
controls.retroSpeed.oninput = e => retroSpeed = +e.target.value;
controls.retroSize.oninput = e => retroSize = +e.target.value;
controls.retroIntensity.oninput = e => retroIntensity = +e.target.value;
controls.pulseToggle.onchange = e => pulseToggle = e.target.checked;
controls.invert.onchange = e => invert = e.target.checked;
controls.rippleCycle.onchange = e => rippleCycle = e.target.checked;
controls.gradientBG.onchange = e => gradientBG = e.target.checked;
controls.trails.onchange = e => trails = e.target.checked;
controls.reactive.onchange = e => reactive = e.target.checked;
controls.scanLines.onchange = e => scanLines = e.target.checked;
controls.crtGlow.onchange = e => crtGlow = e.target.checked;
controls.retroGreen.onchange = e => retroGreen = e.target.checked;
controls.fractalZoomSpeed.oninput = e => fractalZoomSpeed = +e.target.value;
controls.fractalMaxIter.oninput = e => fractalMaxIter = +e.target.value;
controls.fractalHueOffset.oninput = e => fractalHueOffset = +e.target.value;
controls.fractalSaturation.oninput = e => fractalSaturation = +e.target.value;
controls.fractalType.onchange = e => fractalType = e.target.value;

// Mode selection and control visibility
const modeSelect = document.getElementById('modeSelect');
const fractalControls = document.getElementById('fractalControls');

function updateControlVisibility() {
    const mode = fluidMode;
    
    document.getElementById('strengthLabel').style.display = mode === 1 ? 'flex' : 'none';
    document.getElementById('dampingLabel').style.display = mode === 1 ? 'flex' : 'none';
    document.getElementById('dispLabel').style.display = mode === 1 ? 'flex' : 'none';
    
    document.getElementById('blurLabel').style.display = mode === 1 ? 'flex' : 'none';
    
    document.getElementById('radiusLabel').style.display = [1, 3].includes(mode) ? 'flex' : 'none';
    document.getElementById('resLabel').style.display = [1, 5].includes(mode) ? 'flex' : 'none';
    
    document.getElementById('particleCountLabel').style.display = mode === 4 ? 'flex' : 'none';
    document.getElementById('particleSizeLabel').style.display = mode === 4 ? 'flex' : 'none';
    
    document.getElementById('waveCountLabel').style.display = mode === 5 ? 'flex' : 'none';
    document.getElementById('waveSpeedLabel').style.display = mode === 5 ? 'flex' : 'none';
    
    document.getElementById('kaleidoSegmentsLabel').style.display = mode === 6 ? 'flex' : 'none';
    document.getElementById('kaleidoZoomLabel').style.display = mode === 6 ? 'flex' : 'none';
    document.getElementById('kaleidoRotationLabel').style.display = mode === 6 ? 'flex' : 'none';
    document.getElementById('kaleidoComplexityLabel').style.display = mode === 6 ? 'flex' : 'none';
    document.getElementById('kaleidoMorphLabel').style.display = mode === 6 ? 'flex' : 'none';
    
    document.getElementById('videoOpacityLabel').style.display = mode === 7 ? 'flex' : 'none';
    
    document.getElementById('retroModeLabel').style.display = mode === 8 ? 'flex' : 'none';
    document.getElementById('retroSpeedLabel').style.display = mode === 8 ? 'flex' : 'none';
    document.getElementById('retroSizeLabel').style.display = mode === 8 ? 'flex' : 'none';
    document.getElementById('retroIntensityLabel').style.display = mode === 8 ? 'flex' : 'none';
    document.getElementById('scanLinesLabel').style.display = mode === 8 ? 'flex' : 'none';
    document.getElementById('crtGlowLabel').style.display = mode === 8 ? 'flex' : 'none';
    document.getElementById('retroGreenLabel').style.display = mode === 8 ? 'flex' : 'none';
    
    document.getElementById('rippleColorLabel').style.display = mode !== 2 ? 'flex' : 'none';
    document.getElementById('brightnessLabel').style.display = 'flex';
    document.getElementById('pulseSpeedLabel').style.display = 'flex';
    document.getElementById('overallSpeedLabel').style.display = 'flex';
    
    document.getElementById('pulseToggleLabel').style.display = 'flex';
    document.getElementById('invertLabel').style.display = 'flex';
    document.getElementById('rippleCycleLabel').style.display = mode !== 2 ? 'flex' : 'none';
    document.getElementById('gradientBGLabel').style.display = [3, 4, 5, 6, 7, 8].includes(mode) ? 'flex' : 'none';
    document.getElementById('trailsLabel').style.display = [3, 4, 5, 6, 7, 8].includes(mode) ? 'flex' : 'none';
    document.getElementById('reactiveLabel').style.display = 'flex';
    
    fractalControls.style.display = mode === 2 ? 'flex' : 'none';
}

modeSelect.onchange = e => {
    fluidMode = +e.target.value;
    updateControlVisibility();
    
    if (fluidMode === 4) initParticles();
    if (fluidMode === 5) initWaveSources();
    if (fluidMode === 6) initKaleidoPatterns();
    if (fluidMode === 8) initRetroEffects();
    
    // Handle video stream for audio-visual mode
    if (fluidMode === 7 && hasPermissions && !videoElement.srcObject) {
        setupAudio();
    
    // RIP: Piano lifecycle
    if (!window.__ripPianoInit) window.__ripPianoInit=false;
    if (fluidMode===9 && !window.__ripPianoInit) { initPiano(); window.__ripPianoInit=true; }
    if (fluidMode!==9 && window.__ripPianoInit) { teardownPiano(); window.__ripPianoInit=false; }
}
};

updateControlVisibility();

// Permission button for Audio modes
document.getElementById('permissionButton').addEventListener('click', setupAudio);

// Menu toggles
const controlsEl = document.getElementById('controls');
const showMenuButton = document.getElementById('showMenuButton');

document.getElementById('toggleMenu').addEventListener('click', () => {
    controlsEl.style.display = 'none';
    showMenuButton.style.display = 'block';
});

showMenuButton.addEventListener('click', () => {
    controlsEl.style.display = 'grid';
    showMenuButton.style.display = 'none';
});

// Randomization
document.getElementById('randomizeSettings').addEventListener('click', () => {
    controls.strength.value = rippleStrength = Math.random() * 8500 + 500;
    controls.damping.value = damping = Math.random() * 0.08 + 0.91;
    controls.disp.value = disp = Math.random() * 0.19 + 0.01;
    controls.radius.value = radius = Math.floor(Math.random() * 20) + 1;
    controls.blur.value = blur = Math.floor(Math.random() * 20);
  
    
    controls.rippleColor.value = rippleHue = Math.floor(Math.random() * 360);
    controls.brightness.value = brightness = Math.random() * 0.8 + 0.2;
    controls.pulseSpeed.value = pulseSpeed = Math.random() * 4 + 0.5;
    controls.overallSpeed.value = overallSpeed = Math.random() * 4 + 0.5;
    
    controls.pulseToggle.checked = pulseToggle = Math.random() > 0.6;
    controls.invert.checked = invert = Math.random() > 0.7;
    controls.rippleCycle.checked = rippleCycle = Math.random() > 0.4;
    controls.gradientBG.checked = gradientBG = Math.random() > 0.5;
    controls.trails.checked = trails = Math.random() > 0.6;
    controls.reactive.checked = reactive = Math.random() > 0.2;
    
    controls.particleCount.value = particleCount = Math.floor(Math.random() * 9900) + 100;
    controls.particleSize.value = particleSize = Math.floor(Math.random() * 17) + 3;
    
    controls.waveCount.value = waveCount = Math.floor(Math.random() * 7) + 1;
    controls.waveSpeed.value = waveSpeed = Math.random() * 2.9 + 0.1;
    
    controls.kaleidoSegments.value = kaleidoSegments = Math.floor(Math.random() * 13) + 4;
    controls.kaleidoZoom.value = kaleidoZoom = Math.random() * 2.9 + 0.1;
    controls.kaleidoRotation.value = kaleidoRotation = Math.random() * 5;
    controls.kaleidoComplexity.value = kaleidoComplexity = Math.floor(Math.random() * 17) + 3;
    controls.kaleidoMorph.value = kaleidoMorph = Math.random() * 3;
    
    controls.videoOpacity.value = videoOpacity = Math.random() * 0.8 + 0.2;
    
    const retroModes = ['oscilloscope', 'spectrum', 'vumeter', 'starfield', 'matrix', 'terminal'];
    controls.retroMode.value = retroMode = retroModes[Math.floor(Math.random() * retroModes.length)];
    controls.retroSpeed.value = retroSpeed = Math.random() * 2.9 + 0.1;
    controls.retroSize.value = retroSize = Math.random() * 2.5 + 0.5;
    controls.retroIntensity.value = retroIntensity = Math.random() * 2.9 + 0.1;
    controls.scanLines.checked = scanLines = Math.random() > 0.3;
    controls.crtGlow.checked = crtGlow = Math.random() > 0.3;
    controls.retroGreen.checked = retroGreen = Math.random() > 0.7;
    
    controls.fractalZoomSpeed.value = fractalZoomSpeed = Math.random() * 199 + 1;
    controls.fractalMaxIter.value = fractalMaxIter = Math.floor(Math.random() * 147) + 3;
    controls.fractalHueOffset.value = fractalHueOffset = Math.floor(Math.random() * 360);
    controls.fractalSaturation.value = fractalSaturation = Math.floor(Math.random() * 100);
    
    const fractalTypes = ['mandelbrot', 'julia', 'burning'];
    controls.fractalType.value = fractalType = fractalTypes[Math.floor(Math.random() * fractalTypes.length)];
    
    if (fluidMode === 4) initParticles();
    if (fluidMode === 5) initWaveSources();
    if (fluidMode === 6) initKaleidoPatterns();
    if (fluidMode === 8) initRetroEffects();
});

// Initialize everything and start
initParticles();
initWaveSources();
initKaleidoPatterns();
initRetroEffects();
loop();

// ==== RIP: Canvas Piano Mode (Wired + Debug) ==================================
(function(){
    let active=false;
    let keyRects=[];
    const NOTES=[60,62,64,65,67,69,71,72]; // C major scale
    const NOTE_NAMES=['C','D','E','F','G','A','B','C'];

    function getAC(){
        if (!window.audioContext){
            const AC=window.AudioContext||window.webkitAudioContext;
            window.audioContext=new AC();
        }
        return window.audioContext;
    }
    function midiToFreq(m){ return 440*Math.pow(2,(m-69)/12); }
    function beep(midi){
        const ac=getAC(); if (ac.state==="suspended") ac.resume();
        const now=ac.currentTime;
        const osc=ac.createOscillator();
        osc.type="sine";
        osc.frequency.value=midiToFreq(midi);
        osc.connect(ac.destination);
        osc.start(now);
        osc.stop(now+1.0);
        console.log("[RIP Piano] BEEP", midi);
    }

    // Global resume guarantee
    (function setupResume(){
        const resume=()=>{ try{getAC().resume();}catch(e){}; };
        document.addEventListener("pointerdown", resume, {once:true});
        document.addEventListener("keydown", resume, {once:true});
    })();

    window.initPiano=function(){
        if (active) return; active=true;
        canvas.addEventListener("click", handleClick);
        canvas.addEventListener("pointerdown", handleClick);
        canvas.addEventListener("mousedown", handleClick);
        console.log("[RIP Piano] init");
    };
    window.teardownPiano=function(){
        if (!active) return; active=false;
        canvas.removeEventListener("click", handleClick);
        canvas.removeEventListener("pointerdown", handleClick);
        canvas.removeEventListener("mousedown", handleClick);
        console.log("[RIP Piano] teardown");
    };

    function buildLayout(){
        keyRects=[];
        const whiteCount=NOTES.length;
        const keyW=canvas.width/whiteCount;
        const keyH=Math.min(canvas.height*0.4,200);
        const y=(canvas.height/2)-(keyH/2);
        for(let i=0;i<NOTES.length;i++){
            keyRects.push({midi:NOTES[i],name:NOTE_NAMES[i],x:i*keyW,y,w:keyW,h:keyH});
        }
    }

    function handleClick(e){
        const r=canvas.getBoundingClientRect();
        const x=e.clientX-r.left,y=e.clientY-r.top;
        console.log("[RIP Piano] click",x,y);
        let hit=false;
        for(const k of keyRects){
            if(x>=k.x&&x<=k.x+k.w&&y>=k.y&&y<=k.y+k.h){
                console.log("[RIP Piano] HIT",k.name,k.midi);
                beep(k.midi);
                hit=true;
                break;
            }
        }
        if(!hit) console.log("[RIP Piano] MISS");
    }

    window.stepPiano=function(){};
    window.renderPiano=function(){
        ctx.fillStyle="#000"; ctx.fillRect(0,0,canvas.width,canvas.height);
        buildLayout();
        for(const k of keyRects){
            ctx.fillStyle="#fff";
            ctx.fillRect(k.x,k.y,k.w,k.h);
            ctx.strokeStyle="#000";
            ctx.strokeRect(k.x,k.y,k.w,k.h);
            ctx.fillStyle="#000"; ctx.font="20px sans-serif";
            ctx.fillText(k.name, k.x+k.w/2-6, k.y+k.h/2+6);
        }
        ctx.fillStyle="#ddd"; ctx.font="18px sans-serif";
        ctx.fillText("Canvas Piano Mode — click a key", 20, 30);
    };
})();
// ==== END Canvas Piano Mode ===================================================


// ==== RIP: Minimal Piano Mode ================================================
(function(){
    let active=false;
    let keyRects=[];
    const NOTES=[60,62,64,65,67,69,71,72]; // C major scale
    const NOTE_NAMES=['C','D','E','F','G','A','B','C'];

    function getAC(){
        if (!window.audioContext){
            const AC=window.AudioContext||window.webkitAudioContext;
            window.audioContext=new AC();
        }
        return window.audioContext;
    }
    function midiToFreq(m){ return 440*Math.pow(2,(m-69)/12); }
    function beep(midi){
        const ac=getAC(); if (ac.state==="suspended") ac.resume();
        const now=ac.currentTime;
        const osc=ac.createOscillator();
        const gain=ac.createGain();
        osc.type="sine";
        osc.frequency.value=midiToFreq(midi);
        osc.connect(gain);
        gain.connect(ac.destination);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now+1.0);
        osc.start(now);
        osc.stop(now+1.0);
        console.log("[RIP Piano] BEEP", midi);
    }

    function initPiano(){
        if (active) return; active=true;
        canvas.addEventListener("click", handleClick);
        console.log("[RIP Piano] init");
    }
    function teardownPiano(){
        if (!active) return; active=false;
        canvas.removeEventListener("click", handleClick);
        console.log("[RIP Piano] teardown");
    }

    function buildLayout(){
        keyRects=[];
        const whiteCount=NOTES.length;
        const keyW=canvas.width/whiteCount;
        const keyH=Math.min(canvas.height*0.4,200);
        const y=canvas.height-keyH-20;
        for(let i=0;i<NOTES.length;i++){
            keyRects.push({midi:NOTES[i],name:NOTE_NAMES[i],x:i*keyW,y,w:keyW,h:keyH});
        }
    }

    function handleClick(e){
        const r=canvas.getBoundingClientRect();
        const x=e.clientX-r.left,y=e.clientY-r.top;
        console.log("[RIP Piano] click",x,y);
        for(const k of keyRects){
            if(x>=k.x&&x<=k.x+k.w&&y>=k.y&&y<=k.y+k.h){
                console.log("[RIP Piano] HIT",k.name,k.midi);
                beep(k.midi);
                return;
            }
        }
        console.log("[RIP Piano] MISS");
    }

    window.stepPiano=function(){};
    window.renderPiano=function(){
        ctx.fillStyle="#000"; ctx.fillRect(0,0,canvas.width,canvas.height);
        buildLayout();
        for(const k of keyRects){
            ctx.fillStyle="#fff";
            ctx.fillRect(k.x,k.y,k.w,k.h);
            ctx.strokeStyle="#000";
            ctx.strokeRect(k.x,k.y,k.w,k.h);
            ctx.fillStyle="#000"; ctx.font="16px sans-serif";
            ctx.fillText(k.name, k.x+k.w/2-6, k.y+k.h/2);
        }
        ctx.fillStyle="lime"; ctx.font="16px sans-serif";
        ctx.fillText("PIANO MODE READY", 20, 30);
        if (!active) initPiano();
    };
})();
// ==== END Minimal Piano Mode ==================================================


// ==== RIP: Polyphonic Piano Mode (black keys + polyphony) ======================
(function(){
    let active=false;
    let keyRects=[];        // white + black in arrays
    let whiteKeys=[];
    let blackKeys=[];
    const NOTES=[60,62,64,65,67,69,71,72]; // white: C D E F G A B C (C4..C5)
    const BLACK_OFFSETS = { 61:0.66, 63:1.66, 66:3.66, 68:4.66, 70:5.66 }; // midi -> position approx
    const NOTE_NAMES=['C','D','E','F','G','A','B','C'];
    const voices = new Map(); // midi -> {osc, gain, release}

    function getAC(){
        if (!window.audioContext){
            const AC=window.AudioContext||window.webkitAudioContext;
            window.audioContext=new AC();
        }
        return window.audioContext;
    }
    function midiToFreq(m){ return 440*Math.pow(2,(m-69)/12); }

    function playNote(midi){
  const ac = getAC();
  if(ac.state==="suspended") ac.resume();
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type="sine";
  osc.frequency.value=midiToFreq(midi);

  const {attack,decay,sustain,release,reverb} = pianoParams;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(0.45, now+attack);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0001,0.45*sustain), now+attack+decay);

  // Reverb routing
  const reverbNode=getReverbNode(ac);
  const revGain=ac.createGain();
  revGain.gain.value=reverb;
  g.connect(ac.destination);
  g.connect(revGain);
  revGain.connect(reverbNode);
  reverbNode.connect(ac.destination);

  osc.connect(g);
  osc.start(now);
  voices.set(midi,{osc,g,release});
  console.log("[RIP Piano] PLAY",midi);
}

function releaseNote(midi){
        const entry = voices.get(midi);
        if (!entry) return;
        const ac = getAC();
        const now = ac.currentTime;
        try {
            entry.g.gain.cancelScheduledValues(now);
            entry.g.gain.setValueAtTime(entry.g.gain.value, now);
            entry.g.gain.exponentialRampToValueAtTime(0.0001, now + entry.release);
            entry.osc.stop(now + entry.release + 0.05);
        } catch(e){ console.warn('release failed', e); }
        voices.delete(midi);
        console.log('[RIP Piano] RELEASE', midi);
    }

    function stopAllNotes(){
        for(const m of Array.from(voices.keys())) releaseNote(m);
    }

    // ensure AudioContext resumes on first gesture
    (function setupResume(){
        const resume = ()=>{ try{ getAC().resume(); }catch(e){}; };
        document.addEventListener('pointerdown', resume, {once:true});
        document.addEventListener('keydown', resume, {once:true});
    })();

    function initPiano(){
        if (active) return; active = true;
        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('keydown', keyboardDown);
        window.addEventListener('keyup', keyboardUp);
        console.log('[RIP Piano] init polyphonic');
    }
    function teardownPiano(){
        if (!active) return; active=false;
        canvas.removeEventListener('pointerdown', handlePointerDown);
        canvas.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('keydown', keyboardDown);
        window.removeEventListener('keyup', keyboardUp);
        stopAllNotes();
        console.log('[RIP Piano] teardown polyphonic');
    }

    function buildLayout(){
        whiteKeys = [];
        blackKeys = [];
        keyRects = [];
        const whiteCount = NOTES.length;
        const keyW = canvas.width / whiteCount;
        const keyH = Math.min(canvas.height * 0.35, 220);
        const y = canvas.height - keyH - 18;
        // white keys
        for(let i=0;i<NOTES.length;i++){
            const x = i * keyW;
            const midi = NOTES[i];
            const rect = {midi, name: NOTE_NAMES[i], x, y, w: keyW, h: keyH, black:false};
            whiteKeys.push(rect);
            keyRects.push(rect);
        }
        // black keys: relative positions between whites (C# between C & D)
        // We'll compute approximate positions using keyW
        for(const midiStr in BLACK_OFFSETS){
            const midi = parseInt(midiStr);
            const offset = BLACK_OFFSETS[midi];
            const x = offset * keyW - (keyW * 0.36);
            const w = keyW * 0.7;
            const h = keyH * 0.62;
            const rect = {midi, name: '#', x, y, w, h, black:true};
            blackKeys.push(rect);
            keyRects.push(rect);
        }
        // sort so black keys are drawn after whites
        keyRects = keyRects.sort((a,b)=> (a.black === b.black)? a.x-b.x : (a.black?1:-1));
    }

    function hitTest(px,py){
        // check black keys first (top layer)
        for(const k of blackKeys){
            if(px>=k.x && px<=k.x+k.w && py>=k.y && py<=k.y+k.h) return k;
        }
        for(const k of whiteKeys){
            if(px>=k.x && px<=k.x+k.w && py>=k.y && py<=k.y+k.h) return k;
        }
        return null;
    }

    function handlePointerDown(e){
        const r = canvas.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const k = hitTest(x,y);
        if(k){
            playNote(k.midi);
        }
    }
    function handlePointerUp(e){
        const r = canvas.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const k = hitTest(x,y);
        if(k){
            releaseNote(k.midi);
        }
    }

    // keyboard mapping (Z-M and Q-U style)
    const KEYMAP = {
        'z':60,'s':61,'x':62,'d':63,'c':64,'v':65,'g':66,'b':67,'h':68,'n':69,'j':70,'m':71,
        'q':72,'2':73,'w':74,'3':75,'e':76,'r':77,'5':78,'t':79,'6':80,'y':81,'7':82,'u':83
    };
    const keyDownSet = new Set();
    function keyboardDown(e){
        const k = (e.key||'').toLowerCase();
        if (keyDownSet.has(k)) return; // avoid repeat
        keyDownSet.add(k);
        const midi = KEYMAP[k];
        if(midi!=null){
            playNote(midi);
        }
    }
    function keyboardUp(e){
        const k = (e.key||'').toLowerCase();
        keyDownSet.delete(k);
        const midi = KEYMAP[k];
        if(midi!=null){
            releaseNote(midi);
        }
    }

    window.stepPiano = function(){};
    window.renderPiano = function(){
        ctx.fillStyle = '#0b0b0b';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        buildLayout();
        // white keys
        for(const k of whiteKeys){
            ctx.fillStyle = '#fff';
            ctx.fillRect(k.x,k.y,k.w,k.h);
            ctx.strokeStyle = '#222';
            ctx.lineWidth = 2;
            ctx.strokeRect(k.x,k.y,k.w,k.h);
            ctx.fillStyle = '#111';
            ctx.font = Math.max(12, Math.floor(k.w*0.18)) + 'px sans-serif';
            ctx.fillText(k.name, k.x + k.w*0.45, k.y + k.h*0.55);
        }
        // black keys
        for(const k of blackKeys){
            ctx.fillStyle = '#111';
            ctx.fillRect(k.x,k.y,k.w,k.h);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(k.x,k.y,k.w,k.h);
        }
        ctx.fillStyle = '#7fffd4';
        ctx.font = '18px sans-serif';
        ctx.fillText('Polyphonic Piano Mode — click keys or use keyboard (Z..M, Q..U)', 16, 26);
        // init auto if not yet active
        if (!active) initPiano();
    };
})();
// ==== END Polyphonic Piano Mode ===============================================


// ==== RIP: Piano Params =======================================================
window.pianoParams = {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.6,
    release: 1.2,
    reverb: 0.25
};
// Create reverb impulse buffer
function makeReverbIR(ac, seconds=2.5, decay=2.0){
    const rate = ac.sampleRate;
    const len = rate * seconds;
    const buf = ac.createBuffer(2, len, rate);
    for (let ch=0; ch<2; ch++){
        const data = buf.getChannelData(ch);
        for (let i=0;i<len;i++){
            data[i] = (Math.random()*2-1) * Math.pow(1 - i/len, decay);
        }
    }
    return buf;
}
window.getReverbNode = function(ac){
    if (!window._pianoReverb){
        const convolver = ac.createConvolver();
        convolver.buffer = makeReverbIR(ac);
        window._pianoReverb = convolver;
    }
    return window._pianoReverb;
};
// ==== END Piano Params ========================================================


// ==== RIP: Piano Options UI ===================================================
(function(){
    const container = document.getElementById("options") || document.body;
    const pianoDiv = document.createElement("div");
    pianoDiv.id = "pianoOptions";
    pianoDiv.style.display = "none";
    pianoDiv.innerHTML = `
        <h3>Piano Options</h3>
        <label>Attack <input type="range" id="pianoAttack" min="0" max="1" step="0.01" value="0.01"></label><br>
        <label>Decay <input type="range" id="pianoDecay" min="0" max="2" step="0.01" value="0.2"></label><br>
        <label>Sustain <input type="range" id="pianoSustain" min="0" max="1" step="0.01" value="0.6"></label><br>
        <label>Release <input type="range" id="pianoRelease" min="0" max="3" step="0.01" value="1.2"></label><br>
        <label>Reverb <input type="range" id="pianoReverb" min="0" max="1" step="0.01" value="0.25"></label><br>
    `;
    container.appendChild(pianoDiv);
    function bind(id,key){
        document.getElementById(id).addEventListener("input", e=>{
            pianoParams[key] = parseFloat(e.target.value);
        });
    }
    bind("pianoAttack","attack");
    bind("pianoDecay","decay");
    bind("pianoSustain","sustain");
    bind("pianoRelease","release");
    bind("pianoReverb","reverb");

    // Show/hide depending on mode
    const modeSelect = document.getElementById("modeSelect");
    if(modeSelect){
        modeSelect.addEventListener("change", e=>{
            if(parseInt(e.target.value)===9){
                pianoDiv.style.display="block";
            }else{
                pianoDiv.style.display="none";
            }
        });
    }
})();
// ==== END Piano Options UI ====================================================


// ==== RIP: Piano Options Binding ==============================================
function bindPianoControls(){
  function bind(id,key){
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener("input", e=>{
      pianoParams[key] = parseFloat(e.target.value);
    });
  }
  bind("pianoAttack","attack");
  bind("pianoDecay","decay");
  bind("pianoSustain","sustain");
  bind("pianoRelease","release");
  bind("pianoReverb","reverb");
}
window.addEventListener("DOMContentLoaded", bindPianoControls);
// ==== END Piano Options Binding ===============================================


// ==== RIP: Piano Options Toggle & Binding ====
(function(){
  function showPianoControls(show){
    const rows = document.querySelectorAll('.pianoOption');
    rows.forEach(r => { r.style.display = show ? 'flex' : 'none'; });
  }
  function bindSliders(){
    const map = {
      'pianoAttack': 'attack',
      'pianoDecay': 'decay',
      'pianoSustain': 'sustain',
      'pianoRelease': 'release',
      'pianoReverb': 'reverb'
    };
    if(!window.pianoParams) window.pianoParams = {attack:0.1,decay:0.3,sustain:0.7,release:1.0,reverb:0.3};
    Object.keys(map).forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      el.addEventListener('input', e=>{
        pianoParams[map[id]] = parseFloat(e.target.value);
        // tiny debug echo
        try{ console.log('[RIP Piano] param', map[id], pianoParams[map[id]]); }catch(e){}
      });
    });
  }
  function initToggle(){
    const modeSel = document.getElementById('modeSelect');
    if(!modeSel) return;
    modeSel.addEventListener('change', ()=>{
      const v = parseInt(modeSel.value);
      showPianoControls(v === 9);
    });
    // set initial state
    showPianoControls(parseInt(modeSel.value) === 9);
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    bindSliders();
    initToggle();
  });
  // also try immediate bind in case DOMContentLoaded already fired
  try{ bindSliders(); initToggle(); }catch(e){}
})();
// ==== END Piano Options Toggle & Binding ====


// === RIP: Piano Options toggle ===
(function(){
  function showPianoControls(show){
    document.querySelectorAll('.pianoOption').forEach(row => {
      row.style.display = show ? 'flex' : 'none';
    });
  }
  const modeSel = document.getElementById('modeSelect');
  if(modeSel){
    modeSel.addEventListener('change', e => {
      const v = parseInt(e.target.value);
      showPianoControls(v === 9);
    });
    showPianoControls(parseInt(modeSel.value) === 9);
  }
})();
 </script>
 <!-- Panic + Safety Decay Script (Step 3, V2) -->
 <script>
  (function() {
  const activeNotes = new Map();

  // Wrap original noteOn/noteOff if exist, otherwise define
  function noteOn(freq, ctx, gainDest, attack=0.01, release=0.3) {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = "sine"; // assume sine, actual code may vary

    // Start envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, ctx.currentTime + attack);

    osc.connect(gainNode).connect(gainDest);
    osc.start();

    // Safety auto-stop after 8s in case noteOff is missed
    const safetyStop = ctx.currentTime + 8.0;
    osc.stop(safetyStop);
    gainNode.gain.setTargetAtTime(0.0001, safetyStop - 0.5, 0.2);

    activeNotes.set(freq, { osc, gainNode });
  }

  function noteOff(freq, ctx, release=0.3) {
    const note = activeNotes.get(freq);
    if (note) {
      note.gainNode.gain.setTargetAtTime(0.0001, ctx.currentTime, release);
      try { note.osc.stop(ctx.currentTime + release + 0.05); } catch(e){}
      activeNotes.delete(freq);
    }
  }

  function killAllNotes(ctx) {
    activeNotes.forEach(note => {
      note.gainNode.gain.cancelScheduledValues(ctx.currentTime);
      note.gainNode.gain.setValueAtTime(note.gainNode.gain.value, ctx.currentTime);
      note.gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      try { note.osc.stop(ctx.currentTime + 0.05); } catch(e){}
    });
    activeNotes.clear();
  }

  // Panic button binding
  const btn = document.getElementById('panicButton');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.audioCtx) {
        killAllNotes(window.audioCtx);
      }
      btn.textContent = "RESET";
      setTimeout(() => btn.textContent = "PANIC BUTTON", 1000);
    });
  }

  // Expose globally for integration
  window._pianoControls = { noteOn, noteOff, killAllNotes, activeNotes };
})();
 </script>
 <!-- === RIP SAFETY PATCH: Panic + Auto-Decay Registry (no other code touched) === -->
 <script>
  (function(){
  // Track all oscillators created via any AudioContext in this page
  const allOsc = new Set();
  const MAX_SECONDS = 8.0; // safety cap (does NOT change your envelope; just forces a hard stop if something gets stuck)

  // Hook AudioContext.createOscillator to register & auto-cap
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC && !AC.prototype.__ripPatchedCreateOsc){
    const _origCreateOsc = AC.prototype.createOscillator;
    AC.prototype.createOscillator = function(){
      const osc = _origCreateOsc.call(this);
      // ensure any oscillator that starts will be auto-stopped by MAX_SECONDS
      const _origStart = osc.start;
      const _origStop  = osc.stop;
      let startedAt = null;

      osc.start = function(when){
        const ctx = osc.context || (window.audioContext || window.audioCtx);
        _origStart.call(osc, when);
        startedAt = (ctx && ctx.currentTime) ? ctx.currentTime : 0;
        // schedule a hard stop as a safety net
        try { _origStop.call(osc, (ctx ? ctx.currentTime : 0) + MAX_SECONDS); } catch(e){}
        allOsc.add(osc);
      };

      osc.stop = function(when){
        try{ _origStop.call(osc, when); } finally { allOsc.delete(osc); }
      };

      return osc;
    };
    AC.prototype.__ripPatchedCreateOsc = true;
  }

  function panicAll(){
    // stop everything immediately
    allOsc.forEach(o => { try { o.stop(0); } catch(e){} });
    allOsc.clear();
  }

  // Wire the existing Panic button (id="panicButton") to the registry
  const btn = document.getElementById("panicButton");
  if (btn && !btn.__ripPanicWired){
    btn.addEventListener("click", () => {
      panicAll();
      // quick visual feedback
      const old = btn.textContent;
      btn.textContent = "RESET";
      setTimeout(() => btn.textContent = old || "OFF", 800);
    });
    btn.__ripPanicWired = true;
  }

  // Bonus: if mouse is released outside the canvas during drags, broadcast a global "rip-pointer-release"
  // Your piano code (if using pointerdown for sustained notes) can listen for this to release notes.
  window.addEventListener("pointerup", () => window.dispatchEvent(new CustomEvent("rip-pointer-release")));
  window.addEventListener("pointercancel", () => window.dispatchEvent(new CustomEvent("rip-pointer-release")));
  window.addEventListener("mouseup", () => window.dispatchEvent(new CustomEvent("rip-pointer-release")));
})();
 </script>
 <!-- === /RIP SAFETY PATCH === -->
 <!-- RIPPLE Step 11: Smooth Fade Auto-Release -->
 <script>
  (function(){
  // Replace panicAll with smooth fade-out
  function smoothPanicAll(){
    if (window.allOsc){
      window.allOsc.forEach(o => {
        try {
          if (o.context) {
            const ctx = o.context;
            if (!o.__gain) {
              // try to backtrack to gainNode if possible
              if (o.__connectedGain) {
                o.__gain = o.__connectedGain;
              }
            }
            if (o.__gain) {
              o.__gain.gain.cancelScheduledValues(ctx.currentTime);
              o.__gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
            }
            o.stop(ctx.currentTime + 0.1);
          } else {
            o.stop();
          }
        } catch(e){}
      });
      window.allOsc.clear();
    }
  }
  window.smoothPanicAll = smoothPanicAll;

  // Rewire panic button to smooth fade
  const btn = document.getElementById("panicButton");
  if (btn && !btn.__ripSmoothWired){
    btn.addEventListener("click", () => {
      smoothPanicAll();
      const old = btn.textContent;
      btn.textContent = "RESET";
      setTimeout(() => btn.textContent = old || "OFF", 800);
    });
    btn.__ripSmoothWired = true;
  }

  // Also auto-fire smooth panic on pointer/touch release
  function autoPressSmoothPanic(){
    smoothPanicAll();
  }
  window.addEventListener("rip-pointer-release", autoPressSmoothPanic);
  window.addEventListener("mouseup", autoPressSmoothPanic);
  window.addEventListener("pointerup", autoPressSmoothPanic);
  window.addEventListener("pointercancel", autoPressSmoothPanic);
  window.addEventListener("touchend", autoPressSmoothPanic);
})();
 </script>
 <!-- EXTENDED MODE TOGGLE SCRIPT -->
 <script>
  // === Mode-specific UI toggle (single instance) ===
(function(){
  const modeSelect = document.getElementById('modeSelect');
  function updateModeUI() {
    if (!modeSelect) return;
    const mode = parseInt(modeSelect.value, 10);

    const all = document.querySelectorAll('.fluidOption,.fractalOption,.rippleOption,.particleOption,.waveOption,.kaleidoOption,.audioOption,.retroOption');
    all.forEach(el => el.style.display = 'none');

    const map = {
      1: '.fluidOption',
      2: '.fractalOption',
      3: '.rippleOption',
      4: '.particleOption',
      5: '.waveOption',
      6: '.kaleidoOption',
      7: '.audioOption',
      8: '.retroOption'
      // 9,10,11,12 have no extra groups; nothing to show
    };

    const sel = map[mode];
    if (sel) document.querySelectorAll(sel).forEach(el => el.style.display = 'block');
  }
  window.addEventListener('load', updateModeUI);
  document.addEventListener('change', (e) => { if (e.target && e.target.id === 'modeSelect') updateModeUI(); });
})();
 </script>
 <script>
  // === SLIDER → VARIABLE MAPPING (STABLE v5) ===
(function(){
  function bindRange(id, variable, transform = v=>v, def=0){
    const el = document.getElementById(id);
    if (!el) return;
    window[variable] = transform(parseFloat(el.value) || def);
    el.addEventListener('input', e => {
      window[variable] = transform(parseFloat(e.target.value) || def);
    });
  }
  function bindCheckbox(id, variable){
    const el = document.getElementById(id);
    if (!el) return;
    window[variable] = el.checked;
    el.addEventListener('input', e => { window[variable] = el.checked; });
  }
  function bindSelect(id, variable){
    const el = document.getElementById(id);
    if (!el) return;
    window[variable] = el.value;
    el.addEventListener('input', e => { window[variable] = el.value; });
  }

  // Bindings
  bindRange('strength','rippleStrength', v=>v,1000);
  bindRange('damping','damping', v=>v,0.98);
  bindRange('disp','disp', v=>v,0.06);
  bindRange('radius','radius', v=>Math.floor(v),4);
  bindRange('blur','blur', v=>Math.floor(v),0);
  bindRange('rippleColor','rippleHue', v=>Math.floor(v),200);
  bindRange('brightness','brightness', v=>v,0.5);
  bindRange('pulseSpeed','pulseSpeed', v=>v,1);
  bindRange('overallSpeed','overallSpeed', v=>v,1);
  bindCheckbox('pulseToggle','pulseToggle');
  bindCheckbox('invert','invert');
  bindCheckbox('rippleCycle','rippleCycle');
  bindCheckbox('gradientBG','gradientBG');
  bindCheckbox('trails','trails');
  bindCheckbox('reactive','reactive');
  bindRange('particleCount','particleCount', v=>Math.floor(v),200);
  bindRange('particleSize','particleSize', v=>Math.floor(v),3);
  bindRange('particleFriction','particleFriction', v=>v,0.99);
  bindRange('particleRadius','particleRadius', v=>Math.floor(v),150);
  bindRange('waveCount','waveCount', v=>Math.floor(v),3);
  bindRange('waveSpeed','waveSpeed', v=>v,1);
  bindRange('waveFreq','waveFreq', v=>v,0.05);
  bindRange('waveAmp','waveAmp', v=>v,20);
  // Layered wave controls

  bindRange('waveFalloff','waveFalloff', v=>v,0.006);
  bindRange('kaleidoSegments','kaleidoSegments', v=>Math.floor(v),8);
  bindRange('kaleidoZoom','kaleidoZoom', v=>v,1);
  bindRange('kaleidoRotation','kaleidoRotation', v=>v,1);
  bindRange('kaleidoComplexity','kaleidoComplexity', v=>Math.floor(v),8);
  bindRange('kaleidoMorph','kaleidoMorph', v=>v,1);
  bindRange('patternRotation','patternRotation', v=>v,0);
  bindRange('patternComplexityFactor','patternComplexityFactor', v=>v,1);
  bindSelect('retroMode','retroMode');
  bindRange('retroSpeed','retroSpeed', v=>v,1);
  bindRange('retroSize','retroSize', v=>v,1);
  bindRange('retroIntensity','retroIntensity', v=>v,1);
  bindCheckbox('scanLines','scanLines');
  bindCheckbox('crtGlow','crtGlow');
  bindCheckbox('retroGreen','retroGreen');
  bindRange('starCount','starCount', v=>Math.floor(v),200);
  bindRange('matrixTrail','matrixTrail', v=>Math.floor(v),20);
  bindRange('terminalSpeed','terminalSpeed', v=>Math.floor(v),200);
  bindRange('fractalOffsetX','fractalOffsetX', v=>v,0);
  bindRange('fractalOffsetY','fractalOffsetY', v=>v,0);
  bindRange('fractalZoom','zoom', v=>v,1);
  bindRange('fractalRes','fractalRes', v=>Math.floor(v),350);
  bindRange('fractalZoomSpeed','fractalZoomSpeed', v=>v,100);
  bindRange('fractalMaxIter','fractalMaxIter', v=>Math.floor(v),150);
  bindRange('fractalHueOffset','fractalHueOffset', v=>Math.floor(v),0);
  bindRange('fractalSaturation','fractalSaturation', v=>Math.floor(v),100);
  bindSelect('fractalType','fractalType');
  bindRange('juliaCx','juliaCx', v=>v,-0.7);
  bindRange('juliaCy','juliaCy', v=>v,0.27015);
  bindRange('fftSize','fftSize', v=>Math.floor(v),512);
  bindRange('smoothing','smoothing', v=>v,0.8);
  bindRange('minDb','minDb', v=>Math.floor(v),-90);
  bindRange('maxDb','maxDb', v=>Math.floor(v),-10);
  bindRange('videoOpacity','videoOpacity', v=>v,0.7);
  bindRange('ringSpeed','ringSpeed', v=>v,0.01);
  bindRange('pianoAttack','pianoAttack', v=>v,0.1);
  bindRange('pianoDecay','pianoDecay', v=>v,0.3);
  bindRange('pianoSustain','pianoSustain', v=>v,0.7);
  bindRange('pianoRelease','pianoRelease', v=>v,1.0);
  bindRange('pianoReverb','pianoReverb', v=>v,0.3);
  bindCheckbox('particleAttract','particleAttract');
})();

// === RANDOMIZER v11 ===
(function(){
  function byId(id){ return document.getElementById(id); }
  function randomiseSliders_v11() {
    const ids = Array.from(document.querySelectorAll('input,select')).map(e => e.id).filter(Boolean);
    ids.forEach(id => {
      const el = byId(id);
      if (!el) return;
      if (el.tagName === 'INPUT' && el.type === 'range') {
        const min = parseFloat(el.min) || 0;
        const max = parseFloat(el.max) || 1;
        const step = parseFloat(el.step) || 1;
        const raw = min + Math.random() * (max - min);
        const val = Math.round(raw / step) * step;
        el.value = val;
        el.dispatchEvent(new Event('input'));
      } else if (el.tagName === 'INPUT' && el.type === 'checkbox') {
        el.checked = Math.random() > 0.5;
        el.dispatchEvent(new Event('input'));
    });
  }
  const btn = byId('randomizeSettings');
  if (btn) {
    btn.replaceWith(btn.cloneNode(true));
    const newBtn = byId('randomizeSettings');
    newBtn.addEventListener('click', randomiseSliders_v11);
  }
})();

// === PATCH: Kaleido + Global Blur ===
function drawKaleido(ctx) {
  ctx.save();
  ctx.translate(canvas.width/2, canvas.height/2);
  kaleidoAngle += (patternRotation || 0) * 0.01;
  ctx.rotate(kaleidoAngle);
  const complexity = kaleidoComplexity * (patternComplexityFactor || 1);
  for (let i = 0; i < kaleidoSegments; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 / kaleidoSegments) * i);
    ctx.scale(kaleidoZoom, kaleidoZoom);
    // Existing kaleido drawing logic should use "complexity"
    ctx.restore();
  }
  ctx.restore();
}

// Hook global blur in main loop
const oldLoop = loop;
loop = function() {
  oldLoop();
  if (globalBlur > 0) {
    ctx.filter = `blur(${globalBlur}px)`;
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';
  }
};
// Fractal param bindings
bindRange('fractalOffsetX','fractalOffsetX', v=>v, 0);
bindRange('fractalOffsetY','fractalOffsetY', v=>v, 0);
bindRange('fractalZoom','fractalZoom', v=>v, 1);
bindRange('fractalResolution','fractalResolution', v=>v, 1);
bindRange('juliaConstX','juliaConstX', v=>v, -0.7);
bindRange('juliaConstY','juliaConstY', v=>v, 0.27015);
 </script>
 <script>
  // ==== Layered Waves Override (distinct colors) ====
(function(){
  const __orig = window.renderWaves;
  window.renderWaves = function(){
    // Call original to preserve existing visuals/side-effects
    try { if (typeof __orig === 'function') __orig(); } catch(e) { console.warn('orig renderWaves error', e); }
    // Draw layered waves controlled by Layer1/2/3 sliders
    try {
      const freq = (typeof waveFreq==='number'? waveFreq : 0.05);
      const centerY = canvas.height / 2;
      const layers = [
        { amp: (typeof layer1Amp==='number'? layer1Amp : (typeof waveAmp==='number'?waveAmp:20)), speed: (typeof layer1Speed==='number'? layer1Speed : (typeof waveSpeed==='number'?waveSpeed:1)) },
        { amp: (typeof layer2Amp==='number'? layer2Amp : (typeof waveAmp==='number'?waveAmp:20)), speed: (typeof layer2Speed==='number'? layer2Speed : (typeof waveSpeed==='number'?waveSpeed:1)) },
        { amp: (typeof layer3Amp==='number'? layer3Amp : (typeof waveAmp==='number'?waveAmp:20)), speed: (typeof layer3Speed==='number'? layer3Speed : (typeof waveSpeed==='number'?waveSpeed:1)) }
      ];
      const falloff = (typeof waveFalloff==='number' ? waveFalloff : 0.006);
      const colors = ['rgba(0,200,255,0.8)','rgba(0,255,150,0.8)','rgba(255,200,0,0.8)'];
      layers.forEach((layer, idx) => {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += (__fract?.fres ?? 1)) {
          const decay = Math.exp(-falloff * idx); // slight attenuation per layer
          const y = centerY + Math.sin((x * freq) + (time * layer.speed)) * layer.amp * decay;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors[idx % colors.length];
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    } catch(e) { console.warn('layered renderWaves error', e); }
  };
})();
 </script>
 <script>
  (function(){
  const mainSel = document.getElementById('modeSelect');
  function updateFractalUI(){
    const root = document.body;
    const val = mainSel ? mainSel.value : '';
    if (val === '2'){
      root.classList.add('fractal-active');
    } else {
      root.classList.remove('fractal-active');
    }
  }
  if (mainSel) mainSel.addEventListener('change', updateFractalUI);
  document.addEventListener('DOMContentLoaded', updateFractalUI);
})();
 </script>
</body>
<script>
 // ===== RIPPLE-SPIKE: Julia modes (2D & faux-3D) =====

// UI helpers (robust to missing sliders)
function valNum(id, defv){
  const el = document.getElementById(id);
  if(!el) return defv;
  const v = parseFloat(el.value);
  return isFinite(v) ? v : defv;
}

let juliaState = {
  zoom: 1.0,
  maxIter: 150,
  bright: 1.5,
  detail: 1.0,
  centerX: 0.0,
  centerY: 0.0,
  cRe: -0.8,
  cIm: 0.156,
  hueOffset: 0
};

function updateJuliaParams(){
  // Map existing sliders where available
  juliaState.maxIter = Math.max(32, Math.round(valNum('fractalMaxIter', valNum('thresholdSlider', 150))));
  const zoomSlider = valNum('res', 1) || valNum('fractalZoomSpeed', 1);
  juliaState.zoom = Math.max(0.2, Math.min(8.0, zoomSlider));
  juliaState.bright = Math.max(0.2, valNum('maskStrengthSlider', valNum('brightness', 1.5)));
  juliaState.detail = Math.max(0.25, valNum('maskResSlider', 1.0));
  juliaState.hueOffset = valNum('fractalHueOffset', 0);

  // if mouse coords exist, use them for Julia c
  if(window.mouseX !== undefined && window.mouseY !== undefined){
    const nx = (window.mouseX / canvas.width) * 2 - 1;
    const ny = (window.mouseY / canvas.height) * 2 - 1;
    juliaState.cRe = nx * 0.9;
    juliaState.cIm = ny * 0.9;
  }
}

function hslToRgb(h, s, l){
  h = (h%1+1)%1;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  if (s === 0) { const v = Math.round(l*255); return [v,v,v]; }
  const hue2rgb = (p, q, t)=>{
    if(t<0) t+=1; if(t>1) t-=1;
    if(t<1/6) return p+(q-p)*6*t;
    if(t<1/2) return q;
    if(t<2/3) return p+(q-p)*(2/3 - t)*6;
    return p;
  };
  const q = l < 0.5 ? l*(1+s) : l + s - l*s;
  const p = 2*l - q;
  const r = hue2rgb(p,q,h+1/3);
  const g = hue2rgb(p,q,h);
  const b = hue2rgb(p,q,h-1/3);
  return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
}

function stepJulia2D(){ updateJuliaParams(); }
function stepJulia3D(){ updateJuliaParams(); }

function renderJulia2D(){
  const w = canvas.width, h = canvas.height;
  const scale = .5/Math.max(1, Math.floor(2/juliaState.detail)); // detail
  const rw = Math.max(1, Math.floor(w*scale));
  const rh = Math.max(1, Math.floor(h*scale));
  const img = ctx.createImageData(rw, rh);
  const data = img.data;
  const zoom = juliaState.zoom;
  const maxIter = juliaState.maxIter;
  const cRe = juliaState.cRe, cIm = juliaState.cIm;
  const bright = juliaState.bright;

  let i=0;
  for(let y=0;y<rh;y++){
    const ny = ( (y/rh)-0.5 ) * 2 / zoom + juliaState.centerY;
    for(let x=0;x<rw;x++){
      const nx = ( (x/rw)-0.5 ) * 2 / zoom + juliaState.centerX;
      let zr = nx, zi = ny;
      let iter=0;
      let r2=0;
      for(; iter<maxIter; iter++){
        // z = z^2 + c
        const zr2 = zr*zr - zi*zi + cRe;
        zi = 2*zr*zi + cIm;
        zr = zr2;
        r2 = zr*zr+zi*zi;
        if(r2>4.0) break;
      }
      // smooth color
      let t = iter;
      if(iter < maxIter){
        // log smooth
        const log_zn = Math.log(zr*zr+zi*zi)/2;
        const nu = Math.log(log_zn/Math.log(2))/Math.log(2);
        t = iter + 1 - nu;
      }
      const v = Math.min(1, Math.max(0, (t / maxIter)));
      const hue = ((v*0.85)+ (juliaState.hueOffset/360)) % 1;
      const sat = 0.9;
      const lum = 0.15 + 0.7 * v * bright/(bright+1);
      const [r,g,b] = hslToRgb(hue, sat, lum);
      data[i++] = r; data[i++] = g; data[i++] = b; data[i++] = 255;
    }
  }
  // paint scaled
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0,0,w,h);
  const tmp = document.createElement('canvas');
  tmp.width = rw; tmp.height = rh;
  tmp.getContext('2d').putImageData(img,0,0);
  ctx.drawImage(tmp, 0,0, w,h);
  ctx.restore();
}

// simple faux-3D shading from height = v (iterations/ maxIter)
function renderJulia3D(){
  const w = canvas.width, h = canvas.height;
  const rw = Math.max(1, Math.floor(w*0.5));
  const rh = Math.max(1, Math.floor(h*0.5));
  const height = new Float32Array(rw*rh);
  const zoom = juliaState.zoom*.07; // julia-3d
  const maxIter = juliaState.maxIter;
  const cRe = juliaState.cRe, cIm = juliaState.cIm;

  let idx=0;
  for(let y=0;y<rh;y++){
    const ny = ( (y/rh)-0.5 ) * 2 / zoom + juliaState.centerY;
    for(let x=0;x<rw;x++){
      const nx = ( (x/rw)-0.5 ) * 2 / zoom + juliaState.centerX;
      let zr = nx, zi = ny;
      let iter=0, r2=0;
      for(; iter<maxIter; iter++){
        const zr2 = zr*zr - zi*zi + cRe;
        zi = 2*zr*zi + cIm;
        zr = zr2;
        r2 = zr*zr+zi*zi;
        if(r2>4.0) break;
      }
      let v = iter/maxIter;
      height[idx++] = v;
    }
  }

  // shading via finite differences
  const img = ctx.createImageData(rw, rh);
  const data = img.data;
  const light = [ -0.5, -0.8, 1.0 ];
  const lnorm = Math.hypot(...light);
  light[0]/=lnorm; light[1]/=lnorm; light[2]/=lnorm;
  let i=0;
  for(let y=0;y<rh;y++){
    for(let x=0;x<rw;x++){
      const ix = y*rw + x;
      const hC = height[ix];
      const hR = height[y*rw + Math.min(rw-1,x+1)];
      const hL = height[y*rw + Math.max(0,x-1)];
      const hU = height[Math.max(0,y-1)*rw + x];
      const hD = height[Math.min(rh-1,y+1)*rw + x];
      // normal approx
      const nx = (hL - hR);
      const ny = (hU - hD);
      const nz = 0.5/(juliaState.detail*0.5 + 0.5);
      const nlen = Math.hypot(nx,ny,nz)||1;
      const nxn = nx/nlen, nyn = ny/nlen, nzn = nz/nlen;
      const diff = Math.max(0, nxn*light[0] + nyn*light[1] + nzn*light[2]);
      const amb = 0.25;
      const v = Math.pow(hC, 0.9);
      const lum = amb + diff * (0.75);
      const hue = ((v*0.85) + (juliaState.hueOffset/360)) % 1;
      const [r,g,b] = hslToRgb(hue, 0.9, Math.max(0.1, Math.min(0.9, lum * juliaState.bright/(juliaState.bright+0.5))));
      data[i++] = r; data[i++] = g; data[i++] = b; data[i++] = 255;
    }
  }
  // paint scaled
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0,0,w,h);
  const tmp = document.createElement('canvas');
  tmp.width = rw; tmp.height = rh;
  tmp.getContext('2d').putImageData(img,0,0);
  ctx.drawImage(tmp, 0,0, w,h);
  ctx.restore();
}
</script>
<script>
 // pointer tracking for Julia parameter control
window.addEventListener('mousemove', function(e){
  window.mouseX = e.clientX;
  window.mouseY = e.clientY;
});
</script>
<script>
 // ===== RIPPLE-SPIKE: True GL "3D" Julia via displaced mesh =====
(function(){
  // DOM canvas for GL
  let glRenderer, glScene, glCamera, glMesh, glLight, glInitted=false;
  let glW=0, glH=0;
  let lastC = {re: 999, im: 999};
  // State mapping from UI
  const G = {
    zoom: 1.0,
    maxIter: 120,
    bright: 1.0,
    detail: 1.0,
    centerX: 0.0,
    centerY: 0.0,
    cRe: -0.8,
    cIm: 0.156,
    rotY: 0.0
  };

  function ensureGL(){
    if(glInitted) return;
    if(typeof THREE === 'undefined'){ console.warn('THREE not loaded'); return; }
    glRenderer = new THREE.WebGLRenderer({antialias:true, alpha:false});
    glRenderer.setClearColor(0x000000, 1);
    glRenderer.domElement.id = 'glc';
    glRenderer.domElement.style.position = 'absolute';
    glRenderer.domElement.style.left = '0';
    glRenderer.domElement.style.top = '0';
    glRenderer.domElement.style.pointerEvents = 'none'; // so UI still works
    document.body.appendChild(glRenderer.domElement);

    glScene = new THREE.Scene();
    glCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    glCamera.position.set(0, 120, 220);
    glCamera.lookAt(0,0,0);

    const amb = new THREE.AmbientLight(0xffffff, 0.35);
    glScene.add(amb);
    glLight = new THREE.DirectionalLight(0xffffff, 0.9);
    glLight.position.set(-1,2,1);
    glScene.add(glLight);

    // Plane geometry (XZ plane), we displace Y
    const segs = 160; // balance between perf and detail
    const size = 300;
    const geo = new THREE.PlaneGeometry(size, size, segs, segs);
    geo.rotateX(-Math.PI/2); // make it horizontal

    const mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.0,
      roughness: 1.0,
      flatShading: true
    });

    glMesh = new THREE.Mesh(geo, mat);
    glScene.add(glMesh);

    window.addEventListener('resize', resizeGL);
    resizeGL();
    glInitted = true;
  }

  function resizeGL(){
    if(!glRenderer) return;
    glW = window.innerWidth - 40;
    glH = window.innerHeight - 40;
    glRenderer.setSize(glW, glH);
    glCamera.aspect = glW/glH;
    glCamera.updateProjectionMatrix();
  }

  function updateParams(){
    // Reuse sliders if present
    G.maxIter = Math.max(40, Math.round(valNum('fractalMaxIter', 120)));
    G.zoom = Math.max(0.3, Math.min(6.0, valNum('res', 1.0)));
    G.bright = Math.max(0.2, valNum('brightness', valNum('maskStrengthSlider', 1.0)));
    G.detail = Math.max(0.4, valNum('maskResSlider', 1.0));
    // Mouse drives c
    if(window.mouseX !== undefined && window.mouseY !== undefined){
      const nx = (window.mouseX / (glW||1)) * 2 - 1;
      const ny = (window.mouseY / (glH||1)) * 2 - 1;
      G.cRe = nx * 0.9;
      G.cIm = ny * 0.9;
    }
  }

  function computeJuliaHeightAndColor(){
    if(!glMesh) return;
    const geo = glMesh.geometry;
    const pos = geo.attributes.position;
    const col = geo.getAttribute('color') || (function(){
      const c = new THREE.BufferAttribute(new Float32Array(pos.count*3), 3);
      geo.setAttribute('color', c);
      return c;
    })();

    const maxIter = G.maxIter;
    // Map plane XZ coords to complex plane
    const scale = 2.2 / G.zoom; // bigger = zoom out
    const cx = G.centerX, cy = G.centerY;
    const cRe = G.cRe, cIm = G.cIm;

    // Only recompute if c changed notably to save some CPU
    const changed = Math.abs(cRe - lastC.re) + Math.abs(cIm - lastC.im) > 0.002;
    if(!changed) return;
    lastC.re = cRe; lastC.im = cIm;

    for(let i=0;i<pos.count;i++){
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const nx = (x/150)*scale + cx; // size/2 = 150
      const ny = (z/150)*scale + cy;

      let zr = nx, zi = ny;
      let iter=0, r2=0;
      for(; iter<maxIter; iter++){
        const zr2 = zr*zr - zi*zi + cRe;
        zi = 2*zr*zi + cIm;
        zr = zr2;
        r2 = zr*zr + zi*zi;
        if(r2>4.0) break;
      }

      // height proportional to smooth iteration ratio
      const v = iter/maxIter;
      const height = (iter===maxIter? 0.0 : Math.pow(v,0.65)) * 35 * G.detail;
      pos.setY(i, height);

      // color via simple palette HSL
      const hue = (0.65 * v + (valNum('fractalHueOffset',0)/360)) % 1;
      const sat = 0.9;
      const lum = 0.2 + 0.6 * v * G.bright/(G.bright+1);
      const rgb = hslToRgb(hue, sat, lum);
      col.setXYZ(i, rgb[0]/255, rgb[1]/255, rgb[2]/255);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    geo.computeVertexNormals();
  }

  // Public hooks called by the main loop
  window.stepJuliaGL = function(){
    ensureGL();
    updateParams();
    computeJuliaHeightAndColor();
    // spin a touch so it feels alive
    if(glMesh){
      glMesh.rotation.y += 0.003;
    }
  };

  window.renderJuliaGL = function(){
    if(!glRenderer) return;
    glRenderer.domElement.style.display = (window.fluidMode===12?'block':'none');
    // If not in GL mode, do nothing (keeps your 2D canvas free)
    if(window.fluidMode!==12) return;
    glRenderer.render(glScene, glCamera);
  };
})();
</script>

