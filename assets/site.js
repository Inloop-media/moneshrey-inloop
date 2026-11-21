/* Monèshrey demo — shared data and site chrome for every page:
   header, menu drawer, bag drawer (kept across pages), footer, WhatsApp button, scroll reveals.
   Each page adds its own script after this one and uses window.MB. */
(() => {
/* ---- store settings: confirm these with the client (open questions in the brief) ---- */
const CFG = {
  WA_NUMBER: '',                 // WhatsApp number with country code, e.g. '919800000000'. Empty = links go to the Contact page.
  FREE_SHIP: 999,                // free-shipping threshold in ₹ (0 hides the bar)
  COD: true,                     // is cash on delivery offered?
  DELIVERY_DAYS: 5,              // typical delivery time, used for "Delivery by" dates
  EMAIL: 'moneshrey@gmail.com',  // from the live Contact page; the brief recommends a brand address
  PHONE: '',                     // customer-care number; empty hides it
  RESPONSE: 'within 24 hours',   // promised reply time
  INSTAGRAM: 'https://www.instagram.com/moneshreyy/',
  CHECKOUT: 'https://moneshrey.in/cart',
  ADDRESS: '84A/B-1, Sector-5, Akash Plaza, Rajendra Nagar, Sahibabad, Ghaziabad, Uttar Pradesh 201005, India',
};

/* ---- the 8 shades. Copy (d, x, end) is the store's own product description.
   c = swatch colour sampled from the on-lip photo. fam = shade families for the Shop filters. ---- */
const LOVE = ['Rich, highly pigmented colour in a single swipe', 'Lightweight, comfortable matte finish', 'Long-lasting and transfer-resistant wear', 'Smooth application that doesn’t feel cakey'];
const S = [
  { n: 'Nude Eclipse', slug: 'nude-eclipse', c: '#A64B49', t: 'Balanced warm nude', fam: ['nudes'], tag: 'Bestseller',
    d: ['A beautifully balanced nude that redefines effortless elegance. Designed to enhance your natural beauty, this timeless shade delivers the perfect blend of warmth and sophistication — for the office, brunch with friends, or an evening out.',
        'Its lightweight liquid formula glides on effortlessly, delivering intense colour payoff with a comfortable matte finish that stays put for hours without feeling heavy or drying.'],
    x: 'A universally flattering nude perfect for every occasion', end: 'The perfect nude for every mood and moment.' },
  { n: 'Pink Whisper', slug: 'pink-whisper', c: '#A73B27', t: 'Soft rosy pink', fam: ['pinks'],
    d: ['A delicate pink that captures the essence of effortless femininity. Fresh, charming and undeniably elegant, it adds a subtle flush of colour for a naturally radiant look — perfect for everyday wear and brunch dates.',
        'Its lightweight liquid formula glides on effortlessly, delivering intense colour payoff with a comfortable matte finish that stays put for hours without feeling heavy or drying.'],
    x: 'A soft, feminine pink perfect for everyday elegance', end: 'True beauty lies in the little details.' },
  { n: 'Bronze Flame', slug: 'bronze-flame', c: '#903527', t: 'Warm fiery bronze', fam: ['browns', 'bolds'],
    d: ['A captivating bronze-toned shade with warm, fiery undertones that exude confidence and sophistication. Bold yet effortlessly wearable — made for festive celebrations, evening events, or whenever you’re ready to command attention.',
        'Its lightweight liquid formula glides on effortlessly, delivering intense colour payoff with a comfortable matte finish that stays put for hours without feeling heavy or drying.'],
    x: 'A warm bronze shade perfect for elevating any look', end: 'A bold expression of elegance that leaves a lasting impression.' },
  { n: 'Brown Theory', slug: 'brown-theory', c: '#9F4532', t: 'Rich earthy brown', fam: ['browns'],
    d: ['A rich, sophisticated brown that proves timeless elegance never goes out of style. Bold yet effortlessly wearable, it brings warmth and depth to your look — from power meetings to evening outings — with flattering, earthy undertones.',
        'Its lightweight liquid formula glides on effortlessly, delivering intense colour payoff with a comfortable matte finish that stays put for hours without feeling heavy or drying.'],
    x: 'A versatile brown that transitions seamlessly from day to night', end: 'Because confidence is always in style.' },
  { n: 'Miss Mauve', slug: 'miss-mauve', c: '#A15243', t: 'Dusty mauve nude', fam: ['nudes'],
    d: ['A sophisticated dusty mauve that strikes the perfect balance between elegance and everyday wear. This universally flattering shade adds a soft touch of glamour — ideal for everything from office meetings to evening plans.',
        'Its lightweight liquid formula glides on effortlessly, delivering intense colour payoff with a comfortable matte finish that stays put for hours without feeling heavy or drying.'],
    x: 'Perfect for everyday elegance and special occasions', end: 'Timeless beauty never goes out of style.' },
  { n: 'Dusky Petal', slug: 'dusky-petal', c: '#BC4438', t: 'Rosy petal red', fam: ['pinks', 'bolds'],
    d: ['Inspired by the soft beauty of blooming petals at dusk. Elegant and effortlessly chic, this shade strikes the perfect balance between subtle and striking — an ideal choice for everyday wear as well as special occasions.',
        'Its lightweight liquid formula glides on effortlessly, delivering intense colour payoff with a comfortable matte finish that stays put for hours without feeling heavy or drying.'],
    x: 'A soft rosy shade that complements a variety of skin tones', end: 'A graceful shade that blooms beautifully from day to night.' },
  { n: 'Chocolate Obsessed', slug: 'chocolate-obsessed', c: '#95372D', t: 'Deep chocolate brown', fam: ['browns', 'bolds'],
    d: ['A decadent chocolate brown crafted for those who love rich, indulgent hues. Deep, luxurious and irresistibly chic, this statement colour adds warmth and sophistication to every look.',
        'Its lightweight liquid formula glides on effortlessly, delivering intense colour payoff with a comfortable matte finish that stays put for hours without feeling heavy or drying.'],
    x: 'A luxurious chocolate brown that makes a bold yet sophisticated statement', end: 'Some cravings are simply too beautiful to resist.' },
  { n: 'Shocking Pink', slug: 'shocking-pink', c: '#B13C4D', t: 'Vibrant statement pink', fam: ['pinks', 'bolds'],
    d: ['A vibrant, electrifying pink made to turn heads. Bold, playful and unapologetically confident — for girls’ nights out, festive celebrations, or any day you want your lips to do the talking.',
        'Its lightweight liquid formula glides on effortlessly, delivering intense colour payoff with a comfortable matte finish that stays put for hours without feeling heavy or drying.'],
    x: 'A bold, vibrant pink that instantly brightens any look', end: 'Confidence looks best when worn boldly.' },
];
S.forEach((s, i) => { s.i = i; s.love = [...LOVE, s.x]; s.price = 520; s.mrp = 650; });
const FAM = { nudes: 'Nudes', pinks: 'Pinks', browns: 'Browns', bolds: 'Bolds' };

/* DEMO: sample quotes; replace with Judge.me reviews (already installed on the store) */
const REV = [
  { q: 'Finally a nude that doesn’t make me look washed out. Wore it through a full shaadi day.', s: 'Nude Eclipse' },
  { q: 'Survived chai, lunch and a forty-minute metro ride. Barely needed a touch-up.', s: 'Bronze Flame' },
  { q: 'Matte without the cracked-lip feeling. I forget I’m wearing it.', s: 'Miss Mauve' },
];
const FAQ = [
  ['Is it drying?', 'Not at all. It’s a soft matte — lightweight, comfy and non-crusty all day.'],
  ['How long does it last?', 'Up to 16 hours — through coffee dates, office hours, weddings and random life drama, with minimal touch-ups.'],
  ['Is it transfer-proof?', 'Mostly, yes. It stays put really well, though oily food can test the formula.'],
  ['Is it waterproof?', 'Yes — sweat, humidity and hot-girl summers approved.'],
  ['Can I return or exchange?', 'For hygiene reasons, opened beauty products can’t be returned. If your order arrives damaged or incorrect, we’ll fix it as soon as possible.'],
];

/* ---- helpers ---- */
const $ = id => document.getElementById(id);
const fmt = n => '₹' + n.toLocaleString('en-IN');
const lip = (s, w) => `/images/lips/${s.slug}-${w}.webp`;            // on-lip swatch 900 / 1600
const pk = (s, w, v = '') => `/images/products/${s.slug}${v}-${w}.webp`; // pack shot 400 / 800 / 1400 (v = '-open')
const img = (n, ws) => ({ src: `/images/campaign/${n}-${ws[1] || ws[0]}.webp`, srcset: ws.map(w => `/images/campaign/${n}-${w}.webp ${w}w`).join(', ') });
const wa = t => CFG.WA_NUMBER ? `https://wa.me/${CFG.WA_NUMBER}?text=${encodeURIComponent(t)}` : '/contact';
const bySlug = slug => S.find(s => s.slug === slug);
const byName = n => S.find(s => s.n === n) || S[0];
const url = {
  shop: '/shop', fam: f => '/shop?family=' + f, shade: s => '/shades/' + s.slug, trio: '/trio',
  trioWith: s => '/trio?with=' + s.slug, about: '/about', contact: '/contact', help: '/help', finder: '/find-your-shade',
};
const eta = new Date(Date.now() + CFG.DELIVERY_DAYS * 864e5).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
const path = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
const cur = href => (href === path ? ' aria-current="page"' : '');
const LOGO = '/images/brand/logo-600.webp';

/* ---- product card (used on Home, Shop and product pages) ---- */
const card = s => `
<article class="pc" data-fam="${s.fam.join(' ')}">
  <a class="ov" href="${url.shade(s)}" aria-label="${s.n} — view shade"></a>
  <div class="top"><h3 class="disp nm">${s.n}</h3>${s.tag ? `<span class="tag">${s.tag}</span>` : ''}</div>
  <div class="stage"><img src="${pk(s, 800)}" srcset="${pk(s, 400)} 400w, ${pk(s, 800)} 800w, ${pk(s, 1400)} 1400w" sizes="(max-width:600px) 50vw, (max-width:900px) 45vw, 24vw" alt="${s.n} liquid matte lipstick" draggable="false" loading="lazy"><img class="lip" src="${lip(s, 900)}" srcset="${lip(s, 900)} 900w, ${lip(s, 1600)} 1600w" sizes="(max-width:900px) 70vw, 30vw" alt="" draggable="false" loading="lazy"></div>
  <div class="bot"><div><b>${s.t}</b></div><div class="pr">${fmt(s.price)}<s>${fmt(s.mrp)}</s></div></div>
  <button class="qa" data-add="${s.i}">Add to bag — ${fmt(s.price)}</button>
</article>`;

/* ---- header (hero overlay on Home, sticky bar elsewhere) ---- */
const famLinks = Object.entries(FAM).map(([k, v]) => `<a href="${url.fam(k)}">${v}<i style="background:${S.find(s => s.fam.includes(k)).c}"></i></a>`).join('');
const navL = `<button class="menu ui" aria-label="Open menu" aria-controls="drawer" aria-expanded="false">Menu</button>
  <a href="/shop"${cur('/shop')}>Shop</a>
  <div class="dd"><button type="button" aria-haspopup="true">Shades</button><div class="dd-m ui">${famLinks}</div></div>
  <a href="/trio"${cur('/trio')}>The Trio</a>`;
const navR = `<a href="/about"${cur('/about')}>About</a>
  <div class="dd"><button type="button" aria-haspopup="true">Help</button><div class="dd-m ui"><a href="/contact">Contact us</a><a href="/help#track">Track order</a><a href="/help#returns">Returns</a><a href="/help">Help centre</a></div></div>
  <a class="fys" href="/find-your-shade"${cur('/find-your-shade')}>Find your shade</a>
  <a class="bagl" href="#" data-bag aria-controls="bagD">Bag (<span class="bc">0</span>)</a>`;
document.querySelectorAll('[data-nav]').forEach(el => {
  el.innerHTML = `<div class="l">${navL}</div><a class="logo" href="/" aria-label="Monèshrey home"><img src="${LOGO}" alt="Monèshrey Beauty" width="140" height="30"></a><div class="r">${navR}</div>`;
});

/* ---- body-level chrome: mini header (home), drawers, toast, WhatsApp ---- */
const isHome = document.body.dataset.page === 'home';
const chrome = `
${isHome ? `<div class="mini ui" id="mini"><button class="mm ui" aria-label="Open menu" aria-controls="drawer" aria-expanded="false">Menu</button><img src="${LOGO}" alt="Monèshrey" width="94" height="20"><a href="/shop">Shop</a><a href="/find-your-shade">Find your shade</a><a href="/trio">The Trio</a><a class="bag" href="#" data-bag aria-controls="bagD">Bag <span class="bc">0</span></a></div>` : ''}
<a class="wa ui" id="waF" href="#" target="_blank" rel="noopener" aria-label="Ask us on WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg><span>Ask about your shade</span></a>
<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Menu" inert>
  <div class="dr-in">
    <div class="dr-top"><img src="${LOGO}" alt="Monèshrey"><button class="ui" data-close>Close</button></div>
    <nav class="dr-nav">
      <a href="/shop">Shop all <span>8 shades</span></a>
      <a href="/find-your-shade">Find your shade <span>Quiz</span></a>
      <a href="/trio">The Trio <span>3 for ₹999</span></a>
      <a href="/about">Our story</a>
      <a href="/help">Help</a>
    </nav>
    <div class="dr-fam ui">${famLinks}</div>
    <div class="dr-sub ui"><a href="/contact">Contact</a><a href="/help#track">Track order</a><a href="/help#returns">Returns</a><a href="${CFG.INSTAGRAM}">Instagram</a></div>
    <a class="pill solid" href="/trio">Any 3 shades for ₹999</a>
  </div>
</div>
<div class="drawer right" id="bagD" role="dialog" aria-modal="true" aria-label="Your bag" inert>
  <div class="dr-in">
    <div class="dr-top"><span class="disp bag-h">Your <em>bag</em><small class="ui" id="bagN"></small></span><button class="ui" data-close>Close</button></div>
    <div class="ship"><p class="ui" id="shipT"></p><div class="bar"><i id="shipBar"></i></div></div>
    <div class="items" id="bagItems"></div>
    <a class="upsell" id="upsell" href="/trio" hidden><span>Any 3 shades for <b>₹999</b> — build your trio</span><span aria-hidden="true">→</span></a>
    <div class="bag-ft" id="bagFt">
      <label class="gift"><input type="checkbox" id="gift"><span><b>Gift wrap this order</b><small>Complimentary — wrapped in our signature pink, with your note inside.</small></span></label>
      <textarea id="giftNote" maxlength="200" placeholder="Your gift note (optional)" aria-label="Gift note" hidden></textarea>
      <div class="tot"><span class="ui">Subtotal</span><b id="bagTot">₹0</b></div>
      <a class="pill solid" href="${CFG.CHECKOUT}">Checkout</a>
      <ul class="assure ui">${CFG.COD ? '<li>Cash on delivery</li>' : ''}<li>Delivery by ${eta}</li><li>Secure checkout</li></ul>
    </div>
  </div>
</div>
<div class="toast" id="toast" role="status"><img id="tImg" alt=""><div><b id="tT"></b><small id="tS"></small></div></div>`;
document.body.insertAdjacentHTML('beforeend', chrome);

/* ---- footer ---- */
const foot = $('site-foot');
if (foot) foot.outerHTML = `
<footer class="panel foot">
  <div class="news">
    <div><span class="ui eb">The Monèshrey list</span><h3 class="disp">Join the <em>list</em></h3><p>Sign up to unlock any 3 shades for ₹999, plus first dibs on new drops.</p></div>
    <div>
      <!-- Posts to Shopify's built-in customer (newsletter) form; on the Shopify theme replace with {% form 'customer' %} -->
      <form id="news" method="post" action="https://moneshrey.in/contact#contact_form" accept-charset="UTF-8" target="_blank">
        <input type="hidden" name="form_type" value="customer"><input type="hidden" name="utf8" value="✓"><input type="hidden" name="contact[tags]" value="newsletter">
        <input type="email" name="contact[email]" id="email" required placeholder="Your email address" aria-label="Email address" autocomplete="email">
        <button class="sub ui" type="submit">Subscribe <span aria-hidden="true">→</span></button>
      </form>
      <div class="ok" id="ok" role="status"></div>
    </div>
  </div>
  <div class="cols">
    <div class="brand"><a class="flogo" href="/" aria-label="Monèshrey home"></a><p>Liquid matte lipsticks made for Indian skin tones — comfort, confidence &amp; compliments in one swipe.</p><a class="ig ui" href="${CFG.INSTAGRAM}">Instagram · @moneshreyy</a></div>
    <div><h4>Shop</h4><ul><li><a href="/shop">Shop all</a></li>${Object.entries(FAM).map(([k, v]) => `<li><a href="${url.fam(k)}">${v}</a></li>`).join('')}<li><a href="/trio">The Trio — 3 for ₹999</a></li></ul></div>
    <div><h4>Discover</h4><ul><li><a href="/find-your-shade">Find your shade</a></li><li><a href="/about">Our story</a></li><li><a href="/#reviews">Reviews</a></li></ul></div>
    <div><h4>Help</h4><ul><li><a href="/contact">Contact us</a></li><li><a href="/help#track">Track order</a></li><li><a href="/help#shipping">Shipping</a></li><li><a href="/help#returns">Returns &amp; exchange</a></li><li><a href="/help#cancellation">Cancellation</a></li></ul></div>
  </div>
  <div class="legal"><span>© 2026 Monèshrey Beauty · Ghaziabad, India</span><span>Made for Indian skin · Paraben free · Cruelty free</span><span><a href="/help#privacy">Privacy</a> · <a href="/help#terms">Terms</a></span></div>
  <div class="wm" aria-hidden="true"></div>
</footer>`;
const news = $('news');
if (news) news.addEventListener('submit', () => { $('ok').textContent = 'You’re in — your 3 for ₹999 code is on its way.'; setTimeout(() => { $('email').value = ''; }, 0); });

/* ---- toast ---- */
let tt;
const note = (title, sub, im) => { $('tT').textContent = title; $('tS').textContent = sub; $('tImg').src = im; $('toast').classList.add('on'); clearTimeout(tt); tt = setTimeout(() => $('toast').classList.remove('on'), 2600); };

/* ---- drawers ---- */
const mkDrawer = (el, openers) => {
  let lastF;
  const open = () => { if (el.classList.contains('on')) return; lastF = document.activeElement; el.inert = false; el.classList.add('on'); document.body.style.overflow = 'hidden'; openers.forEach(b => b.setAttribute('aria-expanded', 'true')); setTimeout(() => { const f = el.querySelector('[data-close]'); f && f.focus(); }, 60); };
  const close = () => { if (!el.classList.contains('on')) return; el.classList.remove('on'); el.inert = true; document.body.style.overflow = ''; openers.forEach(b => b.setAttribute('aria-expanded', 'false')); lastF && lastF.focus && lastF.focus(); };
  openers.forEach(b => b.addEventListener('click', e => { e.preventDefault(); open(); }));
  el.addEventListener('click', e => { if (e.target === el || e.target.closest('[data-close]') || e.target.closest('a')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  return { open, close };
};
const menu = mkDrawer($('drawer'), [...document.querySelectorAll('.menu,.mm')]);
matchMedia('(min-width:901px)').addEventListener('change', e => { if (e.matches) menu.close(); });
const bagD = mkDrawer($('bagD'), [...document.querySelectorAll('[data-bag]')]);

/* ---- bag (saved in this browser so it follows you between pages) ---- */
let bag = [];
try { bag = JSON.parse(localStorage.getItem('mb_bag') || '[]'); } catch (e) { bag = []; }
const saveBag = () => { try { localStorage.setItem('mb_bag', JSON.stringify(bag)); } catch (e) { /* private mode */ } };
$('gift').addEventListener('change', e => { $('giftNote').hidden = !e.target.checked; });
const drawBag = () => {
  const n = bag.reduce((a, b) => a + b.qty, 0), tot = bag.reduce((a, b) => a + b.price * b.qty, 0);
  document.querySelectorAll('.bc').forEach(e => { e.textContent = n; });
  $('bagN').textContent = n ? `${n} item${n > 1 ? 's' : ''}` : '';
  $('bagTot').textContent = fmt(tot);
  $('bagFt').hidden = !n;
  $('upsell').hidden = !bag.some(b => !b.trio);
  const ship = $('shipT').parentElement; ship.hidden = !CFG.FREE_SHIP || !n;
  if (CFG.FREE_SHIP) { $('shipT').textContent = tot >= CFG.FREE_SHIP ? 'You’ve unlocked free shipping' : `You’re ${fmt(CFG.FREE_SHIP - tot)} away from free shipping`; $('shipBar').style.width = Math.min(100, tot / CFG.FREE_SHIP * 100) + '%'; }
  $('bagItems').innerHTML = n ? bag.map(b => `
  <div class="it"><img src="${b.img}" alt=""><div><b>${b.n}</b><small>${b.sub}</small>
    <div class="qty"><button data-k="${b.k}" data-d="-1" aria-label="Decrease quantity">−</button><span>${b.qty}</span><button data-k="${b.k}" data-d="1" aria-label="Increase quantity">+</button></div></div>
    <div class="pr">${fmt(b.price * b.qty)}<s>${fmt(b.mrp * b.qty)}</s><button class="rm" data-k="${b.k}">Remove</button></div></div>`).join('')
    : `<div class="empty"><span class="disp">Your bag is <em>empty</em></span><span>Eight shades, made for Indian skin.</span><a class="pill" href="/shop">Shop all shades</a></div>`;
};
$('bagItems').addEventListener('click', e => {
  const b = e.target.closest('[data-k]'); if (!b) return; const it = bag.find(x => x.k === b.dataset.k); if (!it) return;
  if (b.classList.contains('rm')) it.qty = 0; else it.qty += +b.dataset.d; bag = bag.filter(x => x.qty > 0); saveBag(); drawBag();
});
const addItem = (it, qty = 1) => { const f = bag.find(b => b.k === it.k); f ? f.qty += qty : bag.push({ ...it, qty }); saveBag(); drawBag(); bagD.open(); };
const addShade = (i, qty = 1) => { const s = S[i]; addItem({ k: 's' + i, n: s.n, sub: s.t, img: pk(s, 400), price: s.price, mrp: s.mrp }, qty); };
const addTrio = ids => addItem({ k: 'trio:' + [...ids].sort().join('-'), trio: true, n: 'The Trio', sub: ids.map(i => S[i].n).join(' · '), img: pk(S[ids[0]], 400), price: 999, mrp: 1950 });
drawBag();
document.addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (b) { e.preventDefault(); addShade(+b.dataset.add); } });

/* ---- WhatsApp button: appears once you scroll ---- */
const waF = $('waF');
waF.href = wa('Hi Monèshrey! Can you help me pick a shade for my skin tone?');
if (!CFG.WA_NUMBER) waF.removeAttribute('target');
const heroEl = $('hero');
if (heroEl) new IntersectionObserver(([en]) => waF.classList.toggle('on', !en.isIntersecting)).observe(heroEl);
else { const t = () => waF.classList.toggle('on', scrollY > 320); addEventListener('scroll', t, { passive: true }); t(); }

/* ---- scroll reveals ---- */
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .15 });
const reveal = root => (root || document).querySelectorAll('.rv:not(.in),.reveal:not(.in)').forEach(el => io.observe(el));
reveal();

/* ---- shared snippets ---- */
const reviewsHTML = () => REV.map(r => { const s = byName(r.s); return `<figure class="q"><span class="st" aria-label="5 out of 5 stars">★★★★★</span><blockquote>“${r.q}”</blockquote><figcaption class="ui"><i style="background:${s.c}"></i>Verified buyer · ${s.n}</figcaption></figure>`; }).join('');
const faqHTML = (list = FAQ, openFirst = true) => list.map((q, i) => `<details${i || !openFirst ? '' : ' open'}><summary>${q[0]}<span>+</span></summary><p>${q[1]}</p></details>`).join('');
const pic = (el, n, sizes, ws) => { const o = img(n, ws); el.sizes = sizes; el.srcset = o.srcset; el.src = o.src; };

window.MB = { CFG, S, FAM, REV, FAQ, $, fmt, lip, pk, img, pic, wa, url, bySlug, byName, eta, card, note, addItem, addShade, addTrio, openBag: () => bagD.open(), reviewsHTML, faqHTML, reveal };
})();
