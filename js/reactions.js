const REACTIONS_KEY = 'mtverifm_reactions';

function getTrackKey(song) {
  return `${song.artist} - ${song.title}`;
}

function getAllReactions() {
  const stored = localStorage.getItem(REACTIONS_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveAllReactions(data) {
  localStorage.setItem(REACTIONS_KEY, JSON.stringify(data));
}

function getTrackReactions(trackKey) {
  const all = getAllReactions();
  return all[trackKey] || { likes: 0, userAction: null };
}

function setTrackReactions(trackKey, reactions) {
  const all = getAllReactions();
  all[trackKey] = reactions;
  saveAllReactions(all);
}

function renderLikeCount(trackKey) {
  const { likes } = getTrackReactions(trackKey);
  const countEl = document.getElementById('like-count');
  if (countEl) countEl.textContent = likes;
}

function renderActiveStates(trackKey) {
  const { userAction } = getTrackReactions(trackKey);
  const likeBtn = document.getElementById('like-btn');
  const dislikeBtn = document.getElementById('dislike-btn');

  likeBtn?.classList.toggle('player-card__reaction-btn--active', userAction === 'like');
  dislikeBtn?.classList.toggle('player-card__reaction-btn--active', userAction === 'dislike');
}

function handleLike(trackKey) {
  const reactions = getTrackReactions(trackKey);

  if (reactions.userAction === 'like') {
    reactions.likes -= 1;
    reactions.userAction = null;
  } else {
    if (reactions.userAction === 'dislike') {
      reactions.userAction = null;
    }
    reactions.likes += 1;
    reactions.userAction = 'like';
  }

  setTrackReactions(trackKey, reactions);
  renderLikeCount(trackKey);
  renderActiveStates(trackKey);
}

function handleDislike(trackKey) {
  const reactions = getTrackReactions(trackKey);

  if (reactions.userAction === 'dislike') {
    reactions.userAction = null;
  } else {
    if (reactions.userAction === 'like') {
      reactions.likes -= 1;
    }
    reactions.userAction = 'dislike';
  }

  setTrackReactions(trackKey, reactions);
  renderLikeCount(trackKey);
  renderActiveStates(trackKey);
}

let currentTrackKey = null;

export function updateCurrentTrack(song) {
  currentTrackKey = getTrackKey(song);
  renderLikeCount(currentTrackKey);
  renderActiveStates(currentTrackKey);
}

export function initReactions() {
  document.getElementById('like-btn')?.addEventListener('click', () => {
    if (currentTrackKey) handleLike(currentTrackKey);
  });

  document.getElementById('dislike-btn')?.addEventListener('click', () => {
    if (currentTrackKey) handleDislike(currentTrackKey);
  });
}