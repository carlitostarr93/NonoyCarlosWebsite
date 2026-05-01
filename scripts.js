/* ==========================================================================
   1. LECTURA Y PINTADO DE JSON (NUEVA LÓGICA DE DATOS)
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Detectar idioma de la página (<html lang="es"> o <html lang="en">)
  const lang = document.documentElement.lang || "es";
  const jsonFile = lang === "en" ? "datos_en.json" : "datos_es.json";

  // 2. Cargar los datos
  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      // Intentamos pintar cada sección si existe en la página actual
      renderHomeReviews(data.home?.reviews);
      renderStudentsReviews(data.students?.reviews);
      renderPricing(data.students?.pricing);
      
      // Reiniciar animaciones 'reveal' para el contenido recién inyectado
      if (window.revObs) {
        document.querySelectorAll('.reveal').forEach(el => window.revObs.observe(el));
      }
    })
    .catch(error => console.error("Error cargando los datos JSON:", error));
});

/* --- Funciones de inyección de JSON --- */
function renderHomeReviews(reviews) {
  const container = document.getElementById("home-reviews-container");
  if (!container || !reviews) return;
  
  container.innerHTML = "";
  reviews.forEach((review, index) => {
    container.innerHTML += `
      <div class="test-card reveal" style="transition-delay: ${index * 0.1}s;">
        <div class="test-stars">★★★★★</div>
        <span class="test-badge ${review.badgeClass}">${review.badge}</span>
        <p class="test-text">${review.text.replace(/\n/g, '<br>')}</p>
        <div class="test-author">
          <div class="test-name">${review.name}</div>
          <div class="test-role">${review.role}</div>
        </div>
      </div>
    `;
  });
}

function renderStudentsReviews(reviews) {
  const container = document.getElementById("students-reviews-container");
  if (!container || !reviews) return;

  container.innerHTML = "";
  const starsHtml = `<div class="flex flex-row gap-1 mb-6 text-[#FFD700]">` + 
    `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`.repeat(5) + 
    `</div>`;

  reviews.forEach((review, index) => {
    container.innerHTML += `
      <div class="card-premium t-card reveal" style="transition-delay: ${index * 0.1}s;">
        ${starsHtml}
        <div class="mb-6"><span class="${review.badgeClass}">${review.badge}</span></div>
        <p class="test-text italic">${review.text}</p>
        <div class="test-author mt-auto">
          <div>
            <p class="test-name">${review.name}</p>
            <p class="test-role">${review.role}</p>
          </div>
        </div>
      </div>
    `;
  });
}

function renderPricing(pricing) {
  const container = document.getElementById("pricing-container");
  if (!container || !pricing) return;

  container.innerHTML = "";
  pricing.forEach((plan, index) => {
    const isFeatured = plan.is_featured ? "featured relative transform md:-translate-y-4" : "";
    const badge = plan.badge_text ? `<span class="popular-badge absolute -top-3 right-5 md:right-8">${plan.badge_text}</span>` : "";
    const btnStyle = plan.is_featured ? `background:var(--red); color:white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);` : `border-color:var(--red); color:var(--red); border: 2px solid;`;
    const titleColor = plan.is_featured ? `color:var(--red);` : `color:var(--muted);`;

    let featuresHtml = plan.features.map(f => `<li class="flex items-start gap-3"><span class="font-bold" style="color:var(--red);">✓</span> ${f}</li>`).join("");
    let disabledHtml = plan.disabled_features.map(f => `<li class="flex items-start gap-3 opacity-40"><span class="font-bold">–</span> ${f}</li>`).join("");

    container.innerHTML += `
      <div class="card-premium p-card reveal ${isFeatured}" style="transition-delay: ${index * 0.1}s;">
        ${badge}
        <p class="font-bold tracking-widest uppercase mb-6" style="${titleColor} font-size: 0.75rem;">${plan.label}</p>
        <div class="flex items-end gap-1 mb-2">
          <span class="text-5xl lg:text-6xl font-bold text-ink">${plan.price}</span>
          <span class="text-2xl text-muted mb-1">${plan.currency}</span>
        </div>
        <p class="text-muted text-sm font-light mb-8">${plan.period}</p>
        <ul class="text-muted space-y-4 mb-10 font-light flex-grow" style="font-size: 0.9rem;">
          ${featuresHtml}
          ${disabledHtml}
        </ul>
        <a href="#contact" class="block w-full text-center py-3 text-sm font-bold tracking-widest uppercase rounded mt-auto transition hover:opacity-80" style="${btnStyle}">${plan.button_text}</a>
      </div>
    `;
  });
}


/* ==========================================================================
   2. LÓGICA DE INTERFAZ E INTERACCIONES (TU CÓDIGO ORIGINAL)
   ========================================================================== */

/* ─── NAVBAR SCROLL ─── */
const nav = document.getElementById('nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

/* ─── SCROLL REVEAL (Animaciones al bajar) ─── */
window.revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); window.revObs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => window.revObs.observe(el));

/* ─── PESTAÑAS PRODUCTO ─── */
document.querySelectorAll('.prod-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    document.querySelectorAll('.prod-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.prod-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const targetPanel = document.getElementById('panel-' + target);
    if(targetPanel) targetPanel.classList.add('active');
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

/* ─── AUTOMATIZACIÓN DE RESEÑAS DESDE EXCEL/CSV (ORGANIZERS) ─── */
document.addEventListener("DOMContentLoaded", () => {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTYz9PnwW9Oe8V_rVL-B1msf-vh1DZX_W44eI3fFDfEDr_bfsSmbP9-hb_1ai26d4fZXoEXlV8q-QfO/pub?output=csv';
  fetch(csvUrl).then(r => r.text()).then(txt => {
    const rows = parseCSV(txt); rows.shift();
    const col1 = document.getElementById('reviews-col-1'); 
    const col2 = document.getElementById('reviews-col-2');
    if(!col1 || !col2) return; // Evitar errores si no estamos en la landing de organizers

    rows.forEach((row, i) => {
      // Ignoramos la primera fila (cabeceras) o filas vacías
      if (i === 0 || row.length < 5) return; 
      
      // NUEVOS ÍNDICES SEGÚN TU EXCEL:
      const name = row[2] || "";       // Columna C: Name
      const role = row[3] || "";       // Columna D: Role
      const eventName = row[4] || "";  // Columna E: Event Name
      const feedback = row[5] || "";   // Columna F: Feedback
      const img = row[7] || "";        // Columna H: Event Logo

      if (!feedback.trim()) return; // Si no hay reseña, no crea tarjeta

      const card = document.createElement('div'); 
      card.className = 'peer-card reveal in';
      card.style.width = "100%"; // Fuerza a ocupar todo el ancho de su columna
      card.style.boxSizing = "border-box";
      
      // Crear el Avatar o Logo
      let avatar = `<div class="peer-avatar text-avatar" style="width: 50px; height: 50px; flex-shrink: 0; background: var(--red); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">${name.substring(0,2).toUpperCase()}</div>`;
      
      if(img && img.trim() !== '') { 
        const safeImg = img.trim().replace(/ /g, '%20'); 
        avatar = `<div class="peer-avatar" style="width: 60px; height: 60px; flex-shrink: 0; border-radius: 50%; overflow: hidden; border: 2px solid #eee; background: #000;"><img src="${safeImg}" alt="Logo" loading="lazy" style="width: 100%; height: 100%; object-fit: contain; padding: 4px;"></div>`; 
      }

      // Estructura Premium de la Tarjeta
      card.innerHTML = `
        <div class="peer-author" style="margin-top: 0; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;">
          ${avatar}
          <div>
            <p class="peer-name" style="font-weight: 700; color: #0A0A0A; font-size: 1.15rem; margin: 0; letter-spacing: -0.01em;">${name}</p>
            <p class="peer-role" style="font-size: 0.8rem; color: #6B6B6B; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">
              <span style="color: var(--red); font-size: 0.9rem;">★</span> ${role} <span style="opacity: 0.4; margin: 0 4px;">|</span> ${eventName}
            </p>
          </div>
        </div>
        <p class="peer-text" style="margin-top: 0; color: #444; line-height: 1.7; font-size: 0.95rem; font-weight: 300;">${feedback.replace(/\n/g, '<br>')}</p>
      `;

      // Repartir en dos columnas
      if(i % 2 !== 0) col1.appendChild(card); else col2.appendChild(card);
    });
  }); // <-- ¡ESTE CIERRE DEL FETCH FALTABA!
}); // <-- ¡ESTE CIERRE DEL DOMContentLoaded FALTABA!

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

if(hbg && mobMenu) {
  hbg.addEventListener('click', () => {
    mobMenu.classList.add('open');
  });
}

if(mobClose && mobMenu) {
  mobClose.addEventListener('click', () => {
    mobMenu.classList.remove('open');
  });
}

document.querySelectorAll('.mob-link, [data-close], #mob-menu a').forEach(link => {
  link.addEventListener('click', () => {
    if(mobMenu) mobMenu.classList.remove('open');
  });
});
