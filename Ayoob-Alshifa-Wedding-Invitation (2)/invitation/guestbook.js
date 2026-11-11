const form = document.querySelector('#wish-form');
const statusText = document.querySelector('#wish-status');
const list = document.querySelector('#wishes');
const older = document.createElement('button');
older.textContent = 'Earlier wishes';
older.hidden = true;
list.after(older);
let cursor = null;
let attempt;
const seen = new Set();
function display(wish, first = false) {
  if (seen.has(wish.id)) return;
  seen.add(wish.id);
  const item = document.createElement('article');
  item.className = 'wish';
  const author = document.createElement('strong');
  author.textContent = wish.name;
  const message = document.createElement('p');
  message.textContent = wish.message;
  item.append(author, message);
  if (first) list.prepend(item); else list.append(item);
}
async function loadWishes() {
  older.disabled = true;
  try {
    const response = await fetch('/api/wishes' + (cursor ? '?before=' + cursor : ''));
    if (!response.ok) throw Error();
    const data = await response.json();
    data.wishes.forEach(w => display(w));
    cursor = data.wishes.at(-1)?.id ?? cursor;
    older.hidden = !data.more;
    older.textContent = 'Earlier wishes';
    statusText.textContent = seen.size ? '' : 'Be the first to leave a wish.';
  } catch {
    statusText.textContent = 'Wishes could not be loaded.';
    older.textContent = 'Try again';
    older.hidden = false;
  } finally { older.disabled = false; }
}
older.onclick = loadWishes;
form.addEventListener('submit', async event => {
  event.preventDefault();
  const name = form.elements.name.value.trim();
  const message = form.elements.message.value.trim();
  if (!name || !message) { statusText.textContent = 'Please enter your name and wish.'; return; }
  if (!attempt || attempt.name !== name || attempt.message !== message) attempt = {name,message,requestId:crypto.randomUUID()};
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    const response = await fetch('/api/wishes',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(attempt)});
    if (!response.ok) throw Error();
    display(await response.json(),true);
    attempt = null;
    form.reset();
    statusText.textContent = 'Thank you. Your wish is in the guest book.';
  } catch { statusText.textContent = 'Your wish could not be confirmed. Please try again.'; }
  finally { button.disabled = false; }
});
loadWishes();
