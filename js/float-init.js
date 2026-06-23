import { fetchCurrentSong, fetchLiveStatus } from './api.js';
import { initPlayer } from './player.js';

function setLiveState(isLive) {
  const dot = document.querySelector('#live-indicator .live-dot');
  const label = document.getElementById('live-label');

  document.body.classList.toggle('is-live', isLive);
  document.body.classList.toggle('is-offline', !isLive);

  if (!dot || !label) return;

  if (isLive) {
    dot.classList.remove('live-dot--offline');
    label.textContent = 'Live';
  } else {
    dot.classList.add('live-dot--offline');
    label.textContent = 'Offline';
  }
}

async function loadTrackName() {
  const trackEl = document.getElementById('float-player-track');
  if (!trackEl) return;

  try {
    const song = await fetchCurrentSong();
    trackEl.textContent = `${song.artist} — ${song.title}`;
  } catch (err) {
    trackEl.textContent = 'Unable to load track';
  }
}

async function loadLiveState() {
  try {
    const isLive = await fetchLiveStatus();
    setLiveState(isLive);
  } catch (err) {
    setLiveState(false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPlayer();
  loadTrackName();
  loadLiveState();
});