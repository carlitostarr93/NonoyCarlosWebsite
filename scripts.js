/* ─── NAVBAR SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

/* ─── SCROLL REVEAL (Animaciones al bajar) ─── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ─── PESTAÑAS PRODUCTO ─── */
document.querySelectorAll('.prod-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.prod-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.prod-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + target).classList.add('active');
  });
});

/* ─── CARRUSEL DE VÍDEOS/FOTOS ─── */
const carousels = {};

function initCarousel(id) {
  const el     = document.getElementById('carousel-' + id);
  const slides = el ? el.querySelectorAll('.carousel-slide') : [];
  const dotsEl = document.getElementById('dots-' + id);
  if (!slides.length) return;

  carousels[id] = { current: 0, total: slides.length };

  if (dotsEl) {
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'c-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(id, i));
      dotsEl.appendChild(d);
    });
  }
}

function goTo(id, idx) {
  const c      = carousels[id];
  const el     = document.getElementById('carousel-' + id);
  const slides = el.querySelectorAll('.carousel-slide');
  const dotsEl = document.getElementById('dots-' + id);

  slides[c.current].classList.remove('active');
  c.current = (idx + c.total) % c.total;
  slides[c.current].classList.add('active');

  if (dotsEl) {
    dotsEl.querySelectorAll('.c-dot').forEach((d, i) =>
      d.classList.toggle('active', i === c.current)
    );
  }
}

function moveCarousel(id, dir) {
  if (!carousels[id]) return;
  goTo(id, carousels[id].current + dir);
}

initCarousel('bachata');

/* ─── AUTOMATIZACIÓN DE RESEÑAS DESDE EXCEL/CSV ─── */
document.addEventListener("DOMContentLoaded", () => {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYz9PnwW9Oe8V_rVL-B1msf-vh1DZX_W44eI3fFDfEDr_bfsSmbP9-hb_1ai26d4fZXoEXlV8q-QfO/pub?output=csv';
  fetch(csvUrl).then(r => r.text()).then(txt => {
    const rows = parseCSV(txt); rows.shift();
    const col1 = document.getElementById('reviews-col-1'); const col2 = document.getElementById('reviews-col-2');
    rows.forEach((row, i) => {
      if (row.length < 5) return;
      const name = row[2], role = row[3], feedback = row[4], img = row[6]; if(!feedback) return;
      const card = document.createElement('div'); card.className = 'peer-card reveal in';
      let avatar = `<div class="peer-avatar text-avatar">${name.substring(0,2).toUpperCase()}</div>`;
      if(img) { const safeImg = img.trim().replace(/ /g, '%20'); avatar = `<div class="peer-avatar"><img src="${safeImg}" alt="Avatar" loading="lazy"></div>`; }
      card.innerHTML = `<div class="peer-author" style="margin-top: 0; margin-bottom: 1.25rem;">${avatar}<div><p class="peer-name">${name}</p><p class="peer-role"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${role}</p></div></div><p class="peer-text" style="margin-top: 0;">${feedback.replace(/\n/g, '<br>')}</p>`;
      if(i % 2 === 0) col1.appendChild(card); else col2.appendChild(card);
    });
  });
});

function parseCSV(s) {
  const r = []; let q = false; let row = 0, col = 0;
  for (let c = 0; c < s.length; c++) {
    let cc = s[c], nc = s[c+1]; r[row] = r[row] || []; r[row][col] = r[row][col] || '';
    if (cc == '"' && q && nc == '"') { r[row][col] += cc; ++c; continue; }
    if (cc == '"') { q = !q; continue; }
    if (cc == ',' && !q) { ++col; continue; }
    if (cc == '\n' && !q) { ++row; col = 0; continue; }
    if (cc == '\r' && !q) { ++row; col = 0; continue; }
    r[row][col] += cc;
  }
  return r;
}
/* ─── MENÚ MÓVIL ─── */
const hbg = document.getElementById('hbg');
const mobMenu = document.getElementById('mob-menu');
const mobClose = document.getElementById('mob-close');

// Abrir menú al tocar la hamburguesa
if(hbg && mobMenu) {
  hbg.addEventListener('click', () => {
    mobMenu.classList.add('open');
  });
}

// Cerrar menú al tocar la "X" (si existe en la página)
if(mobClose && mobMenu) {
  mobClose.addEventListener('click', () => {
    mobMenu.classList.remove('open');
  });
}

// Cerrar el menú automáticamente cuando tocas cualquier enlace
document.querySelectorAll('.mob-link, [data-close], #mob-menu a').forEach(link => {
  link.addEventListener('click', () => {
    if(mobMenu) mobMenu.classList.remove('open');
  });
});
