const STATION_NAME = 'mtverifmradio';
const API_BASE = `https://api.laut.fm/station/${STATION_NAME}`;

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchCurrentSong() {
  const data = await fetchJSON(`${API_BASE}/current_song`);
  return {
    title: data.title ?? 'Unknown Track',
    artist: data.artist?.name ?? 'Unknown Artist',
  };
}

export async function fetchLastSongs() {
  const data = await fetchJSON(`${API_BASE}/last_songs`);
  return data.map(track => ({
    title: track.title ?? 'Unknown Track',
    artist: track.artist?.name ?? 'Unknown Artist',
    started: formatTime(track.started_at),
  }));
}

export async function fetchListeners() {
  const data = await fetchJSON(`${API_BASE}/listeners`);
  return typeof data === 'number' ? data : 0;
}

export async function fetchLiveStatus() {
  const data = await fetchJSON(API_BASE);
  return data.current_playlist != null;
}

function formatTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}