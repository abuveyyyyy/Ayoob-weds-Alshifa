const clock = document.querySelector('.clock');
const units = ['Days', 'Hours', 'Minutes', 'Seconds'];
for (const unit of units) {
  const cell = document.createElement('div');
  cell.innerHTML = '<strong>00</strong><small>' + unit + '</small>';
  clock.append(cell);
}
const start = Date.parse('2026-12-06T18:30:00+05:30');
function updateClock() {
  let remaining = Math.max(0, Math.floor((start - Date.now()) / 1000));
  if (!remaining) { clock.textContent = 'The reception has begun'; return; }
  [86400, 3600, 60, 1].forEach((size, index) => {
    const value = String(Math.floor(remaining / size)).padStart(2, '0');
    remaining %= size;
    const number = clock.children[index].firstChild;
    if (number.textContent !== value) {
      number.textContent = value;
      number.classList.remove('tick');
      void number.offsetWidth;
      number.classList.add('tick');
    }
  });
}
updateClock();
setInterval(updateClock, 1000);
const flowers = document.querySelector('.flower-shower');
const positions = [3, 12, 22, 36, 53, 68, 82, 94, 7, 17, 74, 88, 97];
positions.forEach((left, index) => {
  const trail = document.createElement('span');
  trail.style.left = left + '%';
  trail.style.setProperty('--duration', (12 + index % 6) + 's');
  trail.style.setProperty('--delay', (-index * 3.73) + 's');
  trail.style.setProperty('--size', (14 + index % 4 * 3) + 'px');
  const blossom = document.createElement('i');
  trail.append(blossom);
  flowers.append(trail);
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.15 });
  document.querySelectorAll('.arabic, .invite h2, .names, .event h2, .venue > div, footer strong').forEach(element => observer.observe(element));
}
