// js/main.js

import { fetchStationInfo, fetchCurrentSong, fetchLastSongs, fetchListeners } from './api.js';
import { initPlayer, getAudioElement } from './player.js';
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
  if (loading) loading.removeAttribute('hidden');
}

function hideLoading() {
  const loading = document.getElementById('loading-msg');
  if (loading) loading.setAttribute('hidden', '');
}

function showError() {
  document.getElementById('error-msg').removeAttribute('hidden');
}

function hideError() {
  document.getElementById('error-msg').setAttribute('hidden', '');
}

async function refresh() {
  try {
    const info = await fetchStationInfo();
    updateCurrentSong(fetchCurrentSong(info));
    updateListeners(fetchListeners(info));
    hideError();
  } catch (err) {
    showError();
  }
}

async function init() {
  showLoading();
  try {
    const info = await fetchStationInfo();
    updateCurrentSong(fetchCurrentSong(info));
    updateHistory(fetchLastSongs(info));
    updateListeners(fetchListeners(info));
    hideError();
  } catch (err) {
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

  document.getElementById('restart-btn').addEventListener('click', () => {
    const audio = getAudioElement();
    audio.src = audio.src;
    audio.play();
  });
}

document.addEventListener('DOMContentLoaded', init);