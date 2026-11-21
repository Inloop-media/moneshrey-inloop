/* Homepage: product grid, try-on, trio builder, reels, FAQ */
(() => {
const { S, $, lip, pk, pic, wa, card, note, addShade, addTrio, reviewsHTML, faqHTML } = window.MB;

requestAnimationFrame(() => $('hero').classList.add('on'));
pic($('s1img'), 'model', '(max-width:600px) 100vw, 50vw', [800, 1400, 2000, 2800]);
pic($('s2img'), 'hearts', '(max-width:600px) 100vw, 50vw', [800, 1600]);
pic($('s3img'), 'lip-drip', '(max-width:600px) 100vw, 50vw', [800, 1400, 2000, 2205]);
pic($('s4img'), 'noughts-crosses', '(max-width:600px) 100vw, (max-width:900px) 50vw, 45vw', [800, 1600]);

/* mini header appears once the hero scrolls away */
new IntersectionObserver(([en]) => $('mini').classList.toggle('on', !en.isIntersecting), { threshold: 0 }).observe($('hero'));

/* product grid */
$('rail').innerHTML = S.slice(0, 4).map((s, i) => card(s, i)).join('');
$('rail2').innerHTML = S.slice(4).map((s, i) => card(s, i + 4)).join('');

/* drag-to-scroll + progress bar for swipe rails */
const dragify = (el, bar) => {
  let down = false, x0 = 0, s0 = 0, moved = 0;
  el.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; x0 = e.clientX; s0 = el.scrollLeft; el.classList.add('drag'); });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - x0; moved = Math.abs(dx); el.scrollLeft = s0 - dx; });
  addEventListener('pointerup', () => { if (!down) return; down = false; el.classList.remove('drag'); });
  el.addEventListener('click', e => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
  const upd = () => { const m = el.scrollWidth - el.clientWidth; const vis = Math.min(1, el.clientWidth / el.scrollWidth); bar.style.width = (vis * 100) + '%'; bar.style.transform = `translateX(${m > 0 ? (el.scrollLeft / m) * (1 / vis - 1) * 100 : 0}%)`; };
  el.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
};
dragify($('rail'), $('railBar'));
dragify($('rail2'), $('railBar2'));

/* try-on list */
let cur = -1, front = 'lipA';
const lipW = () => $('lipcol').clientWidth * Math.min(2, devicePixelRatio || 1) > 900 ? 1600 : 900;
const show = i => {
  if (i === cur) return; cur = i; const s = S[i];
  const back = front === 'lipA' ? 'lipB' : 'lipA', im = $(back);
  const swap = () => { im.onload = null; if (cur !== i) return; im.style.opacity = 1; $(front).style.opacity = 0; front = back; };
  im.onload = swap;
  im.src = lip(s, lipW()); im.alt = s.n + ' on lips'; if (im.complete && im.naturalWidth) swap();
  $('capN').textContent = s.n; $('capE').textContent = s.t; $('capC').textContent = (i + 1) + ' / ' + S.length;
  $('waTry').href = wa(`Hi Monèshrey! Would ${s.n} suit my skin tone?`);
  document.querySelectorAll('.row').forEach((r, j) => r.classList.toggle('act', j === i));
};
$('rows').innerHTML = S.map((s, i) => `
<div class="row" data-i="${i}" tabindex="0" role="button" aria-label="Show ${s.n}">
  <div class="th"><img src="${pk(s, 400)}" alt="" loading="lazy"></div>
  <div><div class="nm"><i style="background:${s.c}"></i>${s.n}</div><small>${s.t}</small></div>
  <div class="r"><span class="p">₹520<s>₹650</s></span><button class="pill" data-add="${i}">Add</button></div>
</div>`).join('');
const rows = $('rows');
rows.addEventListener('mouseover', e => { const r = e.target.closest('.row'); if (r) show(+r.dataset.i); });
rows.addEventListener('click', e => { if (e.target.closest('[data-add]')) return; const r = e.target.closest('.row'); if (r) show(+r.dataset.i); });
rows.addEventListener('keydown', e => { const r = e.target.closest('.row'); if (r && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); show(+r.dataset.i); } });
show(0);
new IntersectionObserver(([en], o) => { if (en.isIntersecting) { const w = lipW(); S.forEach(s => { const i = new Image(); i.src = lip(s, w); }); o.disconnect(); } }, { rootMargin: '600px' }).observe($('try'));

/* trio builder */
let trio = [];
const drawTrio = () => {
  $('slots').innerHTML = [0, 1, 2].map(k => { const s = trio[k] != null ? S[trio[k]] : null; return s ? `<button class="slot full" style="background:${s.c}" data-k="${k}" aria-label="Remove ${s.n}"></button>` : `<div class="slot">${k + 1}</div>`; }).join('');
  const b = $('trioAdd'); b.disabled = trio.length < 3; b.textContent = trio.length < 3 ? `Pick ${3 - trio.length} more` : 'Add trio to bag';
};
$('chips').innerHTML = S.map((s, i) => `<button class="chip" data-i="${i}"><i style="background:${s.c}"></i>${s.n}</button>`).join('');
$('chips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; if (trio.length >= 3) { note('Your trio is full', 'Tap a circle to swap a shade', pk(S[trio[0]], 400)); return; } trio.push(+b.dataset.i); drawTrio(); });
$('slots').addEventListener('click', e => { const b = e.target.closest('.slot.full'); if (b) { trio.splice(+b.dataset.k, 1); drawTrio(); } });
$('trioAdd').addEventListener('click', () => { if (trio.length < 3) return; addTrio(trio); trio = []; drawTrio(); });
drawTrio();

/* faq */
$('faq').innerHTML = faqHTML();

/* reels — the 7 real creator reels from the store. Add a creator by adding one row:
   v = short preview file, p = video id, hd = HD file number, s = shade name, by = creator handle (optional) */
const SH = 'https://cdn.shopify.com/s/files/1/0807/4677/4776/files/';
const R = [
  { v: 'reelUp_x835cedi7s1777361856174_short.mp4', p: 'e55d4eb74e734ce098d5f32e588e6cba', hd: '82844859', s: 'Shocking Pink', by: '' },
  { v: 'reelUp_qk055wvm2r1779668392039_short.mp4', p: 'bee3068c50854aa0b6f4fb3a0067f5bc', hd: '84852369', s: 'Pink Whisper', by: '' },
  { v: 'reelUp_uj4juvfjmvb1779668392038_short.mp4', p: '1673de170a4a46c8b2a9a242e560d50f', hd: '84852368', s: 'Nude Eclipse', by: '' },
  { v: 'reelUp_kwjpog5re51779668269196_short.mp4', p: 'a68ad3e129b645d7ac6310cf379b327c', hd: '84852288', s: 'Bronze Flame', by: '' },
  { v: 'reelUp_an1k12t48y1779668269192_short.mp4', p: '378d853df0fc442b87bfa28858651d37', hd: '84852287', s: 'Miss Mauve', by: '' },
  { v: 'reelUp_qjf6wzo6zfr1779668269196_short.mp4', p: '1ba620cfd3bf4937acce9eb7a19b967b', hd: '84852290', s: 'Brown Theory', by: '' },
  { v: 'reelUp_3rvaxth03491779668269193_short.mp4', p: 'd4666e3edd494f6c9dca4b5b2b234d00', hd: '84852291', s: 'Dusky Petal', by: '' },
];
const byName = n => S.find(s => s.n === n) || S[0];
const vsrc = r => SH + r.v; const fsrc = r => r.hd ? `https://cdn.shopify.com/videos/c/vp/${r.p}/${r.p}.HD-720p-1.6Mbps-${r.hd}.mp4` : vsrc(r); const psrc = r => `/images/reels/reel-${r.p}.webp`;
$('reelRail').innerHTML = R.map((r, i) => { const s = byName(r.s); return `
  <article class="reel" data-i="${i}">
    <img class="po" src="${psrc(r)}" alt="Creator reel wearing ${s.n}" draggable="false" loading="lazy">
    <video muted loop playsinline preload="none" data-src="${vsrc(r)}"></video>
    <span class="by">${r.by}</span>
    <span class="pl"><svg viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5v9l7.5-4.5z"/></svg></span>
    <div class="prod"><img src="${pk(s, 400)}" alt="" loading="lazy"><div><b>${s.n}</b><small>Shop the look · ₹520</small></div><button class="radd" aria-label="Shop the look: add ${s.n} to bag">+</button></div>
  </article>`; }).join('');
const rio = new IntersectionObserver(es => es.forEach(en => { const c = en.target, v = c.querySelector('video'); if (en.intersectionRatio > .6) { if (!v.src) v.src = v.dataset.src; v.play().then(() => c.classList.add('playing')).catch(() => {}); } else { v.pause(); c.classList.remove('playing'); } }), { threshold: [0, .6, 1] });
document.querySelectorAll('.reel').forEach(c => rio.observe(c));
$('reelRail').addEventListener('click', e => { const c = e.target.closest('.reel'); if (!c) return; const r = R[+c.dataset.i]; if (e.target.closest('.radd')) { addShade(byName(r.s).i); return; } openV(+c.dataset.i); });
dragify($('reelRail'), $('reelBar'));
const step = d => { const el = $('reelRail'); const f = el.querySelector('.reel'); if (!f) return; el.scrollBy({ left: d * (f.offsetWidth + 12) * 2, behavior: 'smooth' }); };
$('uL').onclick = () => step(-1); $('uR').onclick = () => step(1);

/* full-screen story viewer */
let vi = 0, muted = true; const vv = $('vVid');
const openV = i => { vi = i; $('vw').classList.add('on'); document.body.style.overflow = 'hidden'; document.querySelectorAll('.reel video').forEach(v => v.pause()); loadV(); };
const closeV = () => { $('vw').classList.remove('on'); document.body.style.overflow = ''; vv.pause(); vv.removeAttribute('src'); vv.load(); };
const loadV = () => { const r = R[vi], s = byName(r.s);
  $('vBars').innerHTML = R.map((_, j) => `<i class="${j < vi ? 'done' : ''}"><b></b></i>`).join('');
  vv.src = fsrc(r); vv.poster = psrc(r); vv.muted = muted; vv.play().catch(() => {});
  $('vBy').textContent = r.by; $('vImg').src = pk(s, 400); $('vName').textContent = s.n; $('vTone').textContent = s.t + ' · ₹520';
};
const go = d => { const n = vi + d; if (n < 0) return; if (n >= R.length) { closeV(); return; } vi = n; loadV(); };
vv.addEventListener('timeupdate', () => { const b = $('vBars').children[vi]?.firstChild; if (b && vv.duration) b.style.width = (vv.currentTime / vv.duration * 100) + '%'; });
vv.addEventListener('ended', () => go(1));
$('vPrev').onclick = $('vTapL').onclick = () => go(-1); $('vNext').onclick = $('vTapR').onclick = () => go(1);
$('vClose').onclick = closeV;
$('vw').addEventListener('click', e => { if (e.target.id === 'vw') closeV(); });
$('vMute').onclick = () => { muted = !muted; vv.muted = muted; $('vMuteX').style.display = muted ? '' : 'none'; $('vMute').setAttribute('aria-label', muted ? 'Unmute' : 'Mute'); };
$('vAdd').onclick = () => { const s = byName(R[vi].s); closeV(); addShade(s.i); };
addEventListener('keydown', e => { if (!$('vw').classList.contains('on')) return; if (e.key === 'Escape') closeV(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
let ty = 0; $('vw').addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
$('vw').addEventListener('touchend', e => { const d = e.changedTouches[0].clientY - ty; if (d > 90) closeV(); else if (d < -60) go(1); });
})();
