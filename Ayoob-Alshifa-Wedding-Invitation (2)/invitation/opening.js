const cover = document.querySelector('#cover');
const score = document.querySelector('#score');
const music = document.querySelector('#music');
const openButton = document.querySelector('#unseal');
score.volume = 0.55;
function showPlayback() {
  const label = score.paused ? 'Play music' : 'Pause music';
  music.textContent = '♫  ' + label;
  music.setAttribute('aria-label', label);
  music.setAttribute('aria-pressed', String(!score.paused));
}
function playScore() { score.play().catch(showPlayback); }
score.addEventListener('playing', showPlayback);
score.addEventListener('pause', showPlayback);
music.addEventListener('click', () => score.paused ? playScore() : score.pause());
function reveal(withMusic) {
  if (openButton.disabled) return;
  openButton.disabled = true;
  if (withMusic) playScore();
  cover.classList.add('unfold');
  setTimeout(() => {
    cover.close();
    music.hidden = false;
    document.querySelector('.enter').focus({preventScroll:true});
  }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1700);
}
openButton.addEventListener('click', () => reveal(true));
cover.addEventListener('cancel', event => { event.preventDefault(); reveal(false); });
if (!location.hash) cover.showModal();
else music.hidden = false;
