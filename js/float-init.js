import { fetchCurrentSong } from './api.js';
import { initPlayer } from './player.js';

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

document.addEventListener('DOMContentLoaded', () => {
  initPlayer();
  loadTrackName();
});