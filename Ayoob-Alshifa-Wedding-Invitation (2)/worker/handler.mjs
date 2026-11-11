const json = (body, status = 200) => Response.json(body, { status, headers: {'Cache-Control':'no-store'} });
async function wishes(request, env, url) {
  const db = env.DB;
  if (request.method === 'GET') {
    const before = Number(url.searchParams.get('before') || Number.MAX_SAFE_INTEGER);
    if (!Number.isSafeInteger(before) || before < 1) return json({error:'Invalid page'},400);
    const { results } = await db.prepare('SELECT id,name,message FROM guest_wishes WHERE id < ? ORDER BY id DESC LIMIT 31').bind(before).all();
    return json({ wishes: results.slice(0,30), more: results.length > 30 });
  }
  if (request.method !== 'POST') return json({error:'Method not allowed'},405);
  if (request.headers.get('Origin') !== url.origin || !request.headers.get('Content-Type')?.startsWith('application/json')) return json({error:'Invalid request'},403);
  const raw = await request.text();
  if (raw.length > 8000) return json({error:'Message too long'},413);
  const body = JSON.parse(raw);
  const name = typeof body?.name === 'string' && body.name.trim();
  const message = typeof body?.message === 'string' && body.message.trim();
  if (!name || name.length > 80 || !message || message.length > 1000 || !/^[a-f0-9-]{36}$/.test(body.requestId)) return json({error:'Check your name and wish.'},400);
  await db.prepare('INSERT INTO guest_wishes (request_id,name,message) VALUES (?,?,?) ON CONFLICT(request_id) DO NOTHING').bind(body.requestId,name,message).run();
  const wish = await db.prepare('SELECT id,name,message FROM guest_wishes WHERE request_id=?').bind(body.requestId).first();
  return json(wish,201);
}
export default { async fetch(request, env) {
  const url = new URL(request.url);
  if (url.pathname === '/api/wishes') {
    try { return await wishes(request, env, url); }
    catch (error) { return json({error:'Unable to process the wish.'},error instanceof SyntaxError ? 400 : 503); }
  }
  const asset = assets[url.pathname === '/' ? '/index.html' : url.pathname];
  if (!asset || !['GET','HEAD'].includes(request.method)) return new Response('Not found',{status:404});
  const bytes = Uint8Array.from(atob(asset.data), c => c.charCodeAt(0));
  return new Response(request.method === 'HEAD' ? null : bytes,{headers:{'Content-Type':asset.type}});
}};
