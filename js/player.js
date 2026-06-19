// ts playing i hope :Sob:

const STREAM_URL = 'https://c30.radioboss.fm:9137/stream';
const VOLUME_KEY = 'mtverifm_volume';

const PLAY_ICON = '<polygon points="5 3 19 12 5 21 5 3"/>';
const PAUSE_ICON = '<rect x="5" y="3" width="5" height="18"/><rect x="14" y="3" width="5" height="18"/>';

const audio = new Audio(STREAM_URL);
audio.preload = 'none';

function getSavedVolume() {
  const saved = localStorage.getItem(VOLUME_KEY);
  return saved !== null ? parseInt(saved, 10) : 60;
}

function setVolume(value) {
  audio.volume = value / 100;
  localStorage.setItem(VOLUME_KEY, value);

  const display = document.getElementById('vol-display');
  if (display) display.textContent = `${value}%`;

  const mainSlider = document.getElementById('volume');
  const floatSlider = document.getElementById('float-volume');
  if (mainSlider) mainSlider.value = value;
  if (floatSlider) floatSlider.value = value;
}

function setPlayIcon(svgId, isPlaying) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  svg.innerHTML = isPlaying ? PAUSE_ICON : PLAY_ICON;
}

function startWaveform() {
  const waveform = document.getElementById('waveform');
  if (waveform) waveform.classList.remove('waveform-paused');
}

function stopWaveform() {
  const waveform = document.getElementById('waveform');
  if (waveform) waveform.classList.add('waveform-paused');
}

function showError() {
  const errorMsg = document.getElementById('error-msg');
  if (errorMsg) errorMsg.removeAttribute('hidden');
}

async function togglePlay() {
  if (audio.paused) {
    try {
      await audio.play();
      setPlayIcon('play-icon', true);
      setPlayIcon('float-player-icon', true);
      startWaveform();
    } catch (err) {
      showError();
    }
  } else {
    audio.pause();
    setPlayIcon('play-icon', false);
    setPlayIcon('float-player-icon', false);
    stopWaveform();
  }
}

function setupVolumeControls() {
  const mainSlider = document.getElementById('volume');
  const floatSlider = document.getElementById('float-volume');
  const initial = getSavedVolume();

  setVolume(initial);

  mainSlider?.addEventListener('input', (e) => setVolume(parseInt(e.target.value, 10)));
  floatSlider?.addEventListener('input', (e) => setVolume(parseInt(e.target.value, 10)));
}

function setupFloatPlayerVisibility() {
  const card = document.getElementById('player-card');
  const floatPlayer = document.getElementById('float-player');
  if (!card || !floatPlayer) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        floatPlayer.classList.add('hidden');
      } else {
        floatPlayer.classList.remove('hidden');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(card);
}

export function initPlayer() {
  document.getElementById('play-btn')?.addEventListener('click', togglePlay);
  document.getElementById('float-player-btn')?.addEventListener('click', togglePlay);

  audio.addEventListener('error', showError);

  setupVolumeControls();
  setupFloatPlayerVisibility();
  stopWaveform(); // paused state by default
}

export function getAudioElement() {
  return audio;
}