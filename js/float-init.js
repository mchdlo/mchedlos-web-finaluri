import { fetchStationInfo, fetchCurrentSong } from './api.js';
import { initPlayer } from './player.js';

async function loadTrackName() {
  try {
    const info = await fetchStationInfo();
    const song = fetchCurrentSong(info);
    const trackEl = document.getElementById('float-player-track');
    if (trackEl) trackEl.textContent = `${song.artist} — ${song.title}`;
  } catch (err) {
    const trackEl = document.getElementById('float-player-track');
    if (trackEl) trackEl.textContent = 'Unable to load track';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPlayer();
  loadTrackName();
});