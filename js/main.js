import { fetchStationInfo, fetchCurrentSong, fetchLastSongs, fetchListeners, fetchLiveStatus } from './api.js';
import { initPlayer } from './player.js';
import { initReactions, updateCurrentTrack } from './reactions.js';

const POLL_INTERVAL = 30000;

function updateCurrentSong(song) {
  document.getElementById('track-title').textContent = song.title;
  document.getElementById('track-artist').textContent = song.artist;
  document.getElementById('np-track').textContent = `${song.artist} — ${song.title}`;
  document.getElementById('float-player-track').textContent = `${song.artist} — ${song.title}`;
  updateCurrentTrack(song);
}

function updateHistory(songs) {
  const list = document.getElementById('history-list');
  list.innerHTML = '';

  songs.forEach(song => {
    const item = document.createElement('div');
    item.className = 'history-item';

    const title = document.createElement('span');
    title.className = 'history-item__title';
    title.textContent = `${song.artist} — ${song.title}`;

    const time = document.createElement('span');
    time.className = 'history-item__time';
    time.textContent = song.started;

    item.appendChild(title);
    item.appendChild(time);

    // closure: each handler remembers which song belongs to this item
    item.addEventListener('click', () => {
      navigator.clipboard.writeText(`${song.artist} — ${song.title}`);
      item.classList.add('history-item--copied');
      setTimeout(() => item.classList.remove('history-item--copied'), 1000);
    });

    list.appendChild(item);
  });
}

function updateListeners(count) {
  document.getElementById('listener-count').textContent = count;
}

function showLoading() {
  const loading = document.getElementById('loading-msg');
  if (loading) loading.classList.remove('state-loading--hidden');
}

function hideLoading() {
  const loading = document.getElementById('loading-msg');
  if (loading) loading.classList.add('state-loading--hidden');
}

function showError() {
  document.getElementById('error-msg').removeAttribute('hidden');
}

function hideError() {
  document.getElementById('error-msg').setAttribute('hidden', '');
}

function updateLiveIndicator(isLive) {
  const dot = document.querySelector('#live-indicator .live-dot');
  const label = document.getElementById('live-label');
  if (!dot || !label) return;

  dot.classList.remove('live-dot--offline', 'live-dot--autodj');

  if (isLive) {
    label.textContent = 'Live';
  } else {
    dot.classList.add('live-dot--autodj');
    label.textContent = 'AutoDJ';
  }
}

function setOffline() {
  const dot = document.querySelector('#live-indicator .live-dot');
  const label = document.getElementById('live-label');
  if (!dot || !label) return;

  dot.classList.remove('live-dot--autodj');
  dot.classList.add('live-dot--offline');
  label.textContent = 'Offline';
}

async function refresh() {
  try {
    const info = await fetchStationInfo();
    updateCurrentSong(fetchCurrentSong(info));
    updateListeners(fetchListeners(info));
    updateLiveIndicator(fetchLiveStatus(info));
    hideError();
  } catch (err) {
    showError();
    setOffline();
  }
}

async function init() {
  showLoading();
  const minDelay = new Promise(resolve => setTimeout(resolve, 600));

  try {
    const [info] = await Promise.all([fetchStationInfo(), minDelay]);
    updateCurrentSong(fetchCurrentSong(info));
    updateHistory(fetchLastSongs(info));
    updateListeners(fetchListeners(info));
    hideError();
  } catch (err) {
    await minDelay;
    showError();
  } finally {
    hideLoading();
  }

  initPlayer();
  initReactions();
  setInterval(refresh, POLL_INTERVAL);

  document.getElementById('share-btn').addEventListener('click', async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'MtveriFM', url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  });
}

document.addEventListener('DOMContentLoaded', init);