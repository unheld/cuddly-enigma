// ======================================================
// 🌀 GLYPH — Core Bootstrap (v0.7)
// Modular Edition: 3D/2D Soils + Demo Nodes
// ------------------------------------------------------
// - Integrates VisualSoil3D & VisualOverlay2D
// - Moves demo visuals into separate node classes
// - Centralized energy routing via AudioSoil.getEnergies()
// - Clean orchestration loop
// ======================================================

import { AudioSoil } from './core/AudioSoil.js';
import { VisualSoil3D } from './core/VisualSoil3D.js';
import { VisualOverlay2D } from './core/VisualOverlay2D.js';


import { Drums } from './nodes/Drums.js';


// ======================================================
// 🔊 AUDIO CORE
// ======================================================
const audio = new AudioSoil({ fftSize: 2048 });
window.audio = audio;

// ======================================================
// 🎨 VISUAL SOIL INIT
// ======================================================
const visual3D = new VisualSoil3D('#gl3d');
const visual2D = new VisualOverlay2D('#overlay2d');

// Register demo nodes
const drumsNode = new Drums(visual3D.scene, visual3D.renderer, visual3D.camera);
visual3D.addNode(drumsNode);



// ======================================================
// 🧩 UI PANEL (unchanged mixer UI)
// ======================================================
const uiPanel = document.createElement('div');
Object.assign(uiPanel.style, {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '12px 14px',
  borderRadius: '8px',
  background: 'rgba(0,0,0,0.65)',
  color: '#0ff',
  fontFamily: 'ui-monospace, monospace',
  fontSize: '13px',
  lineHeight: '1.4em',
  zIndex: 900,
  backdropFilter: 'blur(8px)',
  boxShadow: '0 0 10px rgba(0,255,255,0.2)',
  maxWidth: '300px',
});
uiPanel.innerHTML = '<b>🎧 GLYPH Audio Panel</b><br><span id="stemStatus" style="opacity:0.75;">Waiting for stems...</span>';
document.body.appendChild(uiPanel);
const stemStatus = document.getElementById('stemStatus');

// ======================================================
// 📂 STEM LOADERS
// ======================================================
const dirInput = document.createElement('input');
dirInput.type = 'file';
dirInput.multiple = true;
dirInput.webkitdirectory = true;
dirInput.style.display = 'none';
document.body.appendChild(dirInput);

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'audio/*,.mp3,.wav,.ogg';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// --- UI Builder ---
function buildStemUI() {
  const names = Object.keys(audio.stems);
  if (!names.length) {
    uiPanel.innerHTML = '<b>🎧 GLYPH Audio Panel</b><br><span style="opacity:0.75;">Waiting for stems...</span>';
    return;
  }

  let title = '🎧 GLYPH Mixer';
  if (audio._lastLoadedFileName && names.length === 1) title = `🎧 ${audio._lastLoadedFileName}`;
  else if (audio._lastLoadedFolderName) title = `📁 ${audio._lastLoadedFolderName}`;
  else if (names.length > 1) title = '🎛️ Mixed Stems';

  uiPanel.innerHTML = `<b>${title}</b><br>`;

  const container = document.createElement('div');
  Object.assign(container.style, {
    marginTop: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  });

  for (const [name, stem] of Object.entries(audio.stems)) {
    const row = document.createElement('div');
    Object.assign(row.style, { display: 'flex', alignItems: 'center', gap: '8px' });

    const label = document.createElement('div');
    label.textContent = name.toUpperCase();
    Object.assign(label.style, {
      width: '80px',
      textAlign: 'right',
      color: '#0ff',
      opacity: 0.9,
      letterSpacing: '0.04em',
    });

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = stem.gain.gain.value;
    Object.assign(slider.style, { flex: '1', accentColor: '#0ff', cursor: 'pointer' });

    const val = document.createElement('div');
    val.textContent = parseFloat(slider.value).toFixed(2);
    Object.assign(val.style, { width: '38px', textAlign: 'left', opacity: 0.7 });

    slider.addEventListener('input', () => {
      const v = parseFloat(slider.value);
      stem.gain.gain.value = v;
      val.textContent = v.toFixed(2);
    });

    row.appendChild(label);
    row.appendChild(slider);
    row.appendChild(val);
    container.appendChild(row);
  }

  uiPanel.appendChild(container);
}

// --- Folder/File loading ---
async function loadStemsFromFiles(files, folderName = null) {
  const list = Array.from(files).filter(f => /\.(mp3|wav|ogg)$/i.test(f.name));
  if (!list.length) {
    if (stemStatus) stemStatus.textContent = '⚠️ No audio files found.';
    return;
  }

  if (stemStatus) stemStatus.textContent = '📂 Loading stems...';

  if (folderName) {
    audio._lastLoadedFolderName = folderName;
  } else if (list[0]?.webkitRelativePath) {
    audio._lastLoadedFolderName = list[0].webkitRelativePath.split('/')[0] || null;
  } else {
    audio._lastLoadedFolderName = null;
  }
  audio._lastLoadedFileName = null;

  for (const file of list) {
    try {
      await audio.loadFile(file);
    } catch (err) {
      console.warn('Stem load failed:', file.name, err);
    }
  }

  console.log('✅ Loaded stems:', Object.keys(audio.stems));
  buildStemUI();
}

async function triggerFolderPick() {
  try {
    if ('showDirectoryPicker' in window) {
      const dir = await window.showDirectoryPicker();
      const files = [];
      for await (const entry of dir.values()) {
        if (entry.kind === 'file') files.push(await entry.getFile());
      }
      const folderName = dir.name || 'Folder';
      await loadStemsFromFiles(files, folderName);
    } else {
      dirInput.click();
    }
  } catch (err) {
    console.warn('Directory picker error/fallback:', err);
    dirInput.click();
  }
}

dirInput.addEventListener('change', async (ev) => {
  await loadStemsFromFiles(ev.target.files || []);
  dirInput.value = '';
});

fileInput.addEventListener('change', async (ev) => {
  const f = ev.target.files?.[0];
  if (!f) return;
  try {
    if (stemStatus) stemStatus.textContent = '📄 Loading stem...';
    audio._lastLoadedFileName = f.name;
    audio._lastLoadedFolderName = null;
    await audio.loadFile(f);
    buildStemUI();
  } catch (err) {
    console.warn('❌ File load failed:', err);
    if (stemStatus) stemStatus.textContent = '⚠️ No file loaded.';
  } finally {
    fileInput.value = '';
  }
});

// ======================================================
// 🖱️ BUTTONS
// ======================================================
const $ = (id) => document.getElementById(id);
$('loadFolder')?.addEventListener('click', () => triggerFolderPick());
$('loadStem')?.addEventListener('click', () => fileInput.click());
$('play')?.addEventListener('click', async () => {
  try {
    await audio.resume();
    audio.playAll();
    console.log('▶️ Playing all stems');
  } catch (e) {
    console.error('Playback failed:', e);
  }
});
$('stop')?.addEventListener('click', () => {
  audio.stopAll();
  console.log('⏹ All stems stopped');
});

// ======================================================
// 🎞️ MAIN LOOP
// ======================================================
let t = 0;
let last = performance.now();

function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  const energies = audio.getEnergies();

  // Update visual soils
  visual3D.update(energies, dt);
  t += 0.01 + energies.global * 0.05;
  visual2D.update(energies, t);
}

animate();

// ======================================================
// 🧠 INFO
// ======================================================
console.log('%cGLYPH v0.7 initialized — modular system live', 'color:#0ff;font-weight:bold;');
