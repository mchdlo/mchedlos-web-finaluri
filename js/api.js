//hmmm
const STATION_ID = '1137'; // get from RadioBOSS control panel
const API_KEY = 'B2JVZU5B6ALN';       // get from Settings/Account
const API_BASE = `https://c30.radioboss.fm/api/info/${STATION_ID}?key=${API_KEY}`;

async function fetchStationInfo() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export function fetchCurrentSong(info) {
  const attr = info.currenttrack_info['@attributes'];
  return {
    title: attr.TITLE,
    artist: attr.ARTIST,
    duration: attr.DURATION,
  };
}

export function fetchLastSongs(info) {
  return info.recent.map(track => ({
    title: track.tracktitle,
    artist: track.trackartist,
    started: track.started,
  }));
}

export function fetchListeners(info) {
  return info.listeners;
}

export { fetchStationInfo };