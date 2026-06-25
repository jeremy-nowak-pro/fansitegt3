/**
 * APP.JS — GSAP + rendu DOM Section 2
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════
     HERO — Animation texte
  ═══════════════════════════════════════════════════ */

  function animateHeroText() {
    const tl = gsap.timeline();
    tl
      .to('.hero-overline',  { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' })
      .to('.hero-title',     { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }, '-=0.1')
      .to('.hero-sub',       { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }, '-=0.1')
      .to(['.hero-meta', '.hero-model-tag', '.hero-engine-tag'], { opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.05')
      .to('.scroll-cta',     { opacity: 1, duration: 0.2, ease: 'power2.out' }, '-=0.1')
      .to('#scroll-line',    { scaleX: 1, duration: 0.3, ease: 'power2.inOut' }, '-=0.15');
  }

  window.addEventListener('hero:car-loaded', animateHeroText, { once: true });

  /* ═══════════════════════════════════════════════════
     SECTION 2 — Construction DOM (par générations)
  ═══════════════════════════════════════════════════ */

  function buildStatCell(value) {
    const cell = document.createElement('div');
    cell.className = 'car-stat';
    cell.innerHTML = `<div class="car-stat-num">${value}</div>`;
    return cell;
  }

  function buildCarRow(model) {
    const row = document.createElement('div');
    row.className = 'car-row';
    row.dataset.id = model.id;

    // Nom : variante + année + moteur
    const nameBlock = document.createElement('div');
    nameBlock.className = 'car-name-block';
    const yearRange = `${model.years[0]}${model.years[1] ? ' – ' + model.years[1] : ''}`;
    const variantLabel = (model.name || '').replace('911 ', '');
    nameBlock.innerHTML =
      `<div class="car-name">` +
        `<span class="car-variant-title">${variantLabel}</span>` +
        `<span class="car-year-tag">${yearRange}</span>` +
        (model.badge ? ` <span class="car-badge">${model.badge}</span>` : '') +
      `</div>` +
      `<div class="car-engine">${model.engine}</div>`;
    row.appendChild(nameBlock);

    // Stats
    row.appendChild(buildStatCell(model.hp));
    row.appendChild(buildStatCell(model.sprint.toFixed(1) + ' s'));
    row.appendChild(buildStatCell(model.vmax));

    return row;
  }

  function buildGenGroup(generation) {
    const group = document.createElement('div');
    group.className = 'gen-group' + (generation.current ? ' gen-current' : '');
    group.dataset.gen = generation.gen;

    // 1.5 pour le header (le gen-header est haut ~64px) + 1 par modèle.
    // Evite que les gens à 1 seul modèle (996, 992) compriment leur car-row sous le lisible.
    group.style.flex = (generation.models.length + 1.5).toString();

    // Header génération
    const header = document.createElement('div');
    header.className = 'gen-header';

    const genRange = `${generation.years[0]} – ${generation.years[1]}`;
    const variantCount = generation.models.length;
    const variantLabel = variantCount > 1 ? `${variantCount} variantes` : '1 modèle';

    header.innerHTML =
      `<span class="gen-label">${generation.gen}</span>` +
      `<span class="gen-range">${genRange}</span>` +
      ``;

    group.appendChild(header);

    // Lignes modèles
    const modelList = document.createElement('div');
    modelList.className = 'gen-models';
    generation.models.forEach((model) => {
      modelList.appendChild(buildCarRow(model));
    });
    group.appendChild(modelList);

    return group;
  }

  function renderSection2() {
    const listEl = document.getElementById('cars-list');
    if (!listEl || typeof GT3RS_GENERATIONS === 'undefined') return;

    GT3RS_GENERATIONS.forEach((gen) => {
      listEl.appendChild(buildGenGroup(gen));
    });

    // Mettre à jour le compteur dans le titre
    const countEl = document.getElementById('s2-model-count');
    if (countEl) countEl.textContent = GT3RS_MODELS.length;

  }

  /* ═══════════════════════════════════════════════════
     SECTION 3 — Timeline (construction DOM)
  ═══════════════════════════════════════════════════ */

  // Phrase éditoriale par génération
  const GEN_PHRASES = {
    '996': 'La première. L\'audace d\'exister dans un monde qui attendait le GT3.',
    '997': 'Trois variantes. Un sommet : le 4.0, moteur dérivé de la GT1.',
    '991': 'PDK obligatoire. L\'aéro active arrive. L\'ère de la technologie.',
    '992': 'DRS. Ailes actives. L\'aboutissement de vingt ans de radicalité.',
  };

  function renderSection3() {
    const container = document.getElementById('s3-cards');
    if (!container || typeof GT3RS_GENERATIONS === 'undefined') return;

    GT3RS_GENERATIONS.forEach((gen) => {
      const card = document.createElement('div');
      card.className = 's3-card' + (gen.current ? ' current' : '');

      // Stat principale : ch max de la génération
      const maxHp = Math.max(...gen.models.map((m) => m.hp));

      // Badge : prendre le badge du dernier modèle notable
      const badgeModel = [...gen.models].reverse().find((m) => m.badge);
      const badgeHtml = badgeModel
        ? `<div class="s3-badge">${badgeModel.badge}</div>`
        : '';

      const yearRange = `${gen.years[0]} — ${gen.years[1] ?? 'aujourd\'hui'}`;
      const phrase = GEN_PHRASES[gen.gen] || '';

      card.innerHTML =
        `<div class="s3-dot"></div>` +
        `<p class="s3-years">${yearRange}</p>` +
        `<p class="s3-gen">${gen.gen}</p>` +
        `<p class="s3-phrase">${phrase}</p>` +
        `<div class="s3-stat">` +
          `<span class="s3-stat-num">${maxHp}</span>` +
          `<span class="s3-stat-unit">ch</span>` +
        `</div>` +
        badgeHtml;

      container.appendChild(card);
    });
  }

  function animateSection3() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Titre
    gsap.to('.s3-title', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#s3', start: 'top 75%' },
    });

    // Ligne orange
    ScrollTrigger.create({
      trigger: '#s3',
      start: 'top 60%',
      onEnter: () => {
        document.getElementById('s3-line-fill').style.width = '100%';
      },
    });

    // Cards en cascade
    gsap.utils.toArray('.s3-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: '#s3', start: 'top 60%' },
      });
    });
  }


  /* ═══════════════════════════════════════════════════
     SECTION 4 — Évolution graphique (construction DOM + logique)
  ═══════════════════════════════════════════════════ */

  const S4_METRICS = {
    hp:     { key: 'hp',     unit: 'ch',    invert: false },
    sprint: { key: 'sprint', unit: 's',     invert: true  },
    vmax:   { key: 'vmax',   unit: 'km/h',  invert: false },
  };

  let s4CurrentMetric = 'hp';

  function renderS4Bars(metric) {
    const container = document.getElementById('s4-bars');
    if (!container || typeof GT3RS_MODELS === 'undefined') return;

    const m = S4_METRICS[metric];
    const vals = GT3RS_MODELS.map((x) => x[m.key]);
    const maxVal = Math.max(...vals);
    const minVal = Math.min(...vals);

    // Vider et reconstruire (première fois) ou juste mettre à jour les barres
    const isFirstRender = container.children.length === 0;

    GT3RS_MODELS.forEach((model, i) => {
      const val = model[m.key];
      const pct = m.invert
        ? ((maxVal - val) / (maxVal - minVal || 1)) * 88 + 8
        : (val / maxVal) * 88 + 8;

      const isCurrent = model.variant === '992';
      const variantLabel = model.variant;
      const shortName = (model.name || '').replace('911 ', '');
      const displayVal = m.key === 'sprint' ? val.toFixed(1) : val;

      if (isFirstRender) {
        const row = document.createElement('div');
        row.className = 's4-row' + (isCurrent ? ' highlight' : '');
        row.dataset.index = i;
        row.innerHTML =
          `<div class="s4-label">` +
            `<div class="s4-label-name">${shortName}</div>` +
            `<div class="s4-label-sub">${variantLabel} · ${model.years[0]}</div>` +
          `</div>` +
          `<div class="s4-track">` +
            `<div class="s4-fill" style="width:0%" data-pct="${pct.toFixed(1)}"></div>` +
          `</div>` +
          `<div class="s4-value">${displayVal}<span class="s4-value-unit">${m.unit}</span></div>`;
        container.appendChild(row);
      } else {
        const row = container.children[i];
        const fill = row.querySelector('.s4-fill');
        const valEl = row.querySelector('.s4-value');
        fill.style.width = pct.toFixed(1) + '%';
        valEl.innerHTML = `${displayVal}<span class="s4-value-unit">${m.unit}</span>`;
      }
    });
  }

  function animateSection4() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Titre
    gsap.to('.s4-title', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#s4', start: 'top 75%' },
    });

    // Rows en cascade
    ScrollTrigger.create({
      trigger: '#s4',
      start: 'top 60%',
      onEnter: () => {
        gsap.utils.toArray('.s4-row').forEach((row, i) => {
          gsap.to(row, {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: 'power2.out',
            delay: i * 0.06,
          });
        });
        // Déclencher les barres après un léger délai
        setTimeout(() => {
          document.querySelectorAll('.s4-fill').forEach((f) => {
            f.style.width = f.dataset.pct + '%';
          });
        }, 100);
      },
    });
  }

  function initS4Toggle() {
    const toggle = document.getElementById('s4-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.s4-btn');
      if (!btn) return;

      toggle.querySelectorAll('.s4-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      s4CurrentMetric = btn.dataset.metric;
      renderS4Bars(s4CurrentMetric);
    });
  }


  /* ═══════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', () => {
    renderSection2();
    renderSection3();
    renderS4Bars('hp');
    initS4Toggle();

    // ScrollTrigger disponible via le CDN (chargé dans index.html)
    if (typeof ScrollTrigger !== 'undefined') {
      animateSection3();
      animateSection4();
    } else {
      // Fallback si ScrollTrigger absent : on affiche tout statiquement
      document.querySelectorAll('.s3-title, .s4-title').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      document.querySelectorAll('.s3-card, .s4-row').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      const lineFill = document.getElementById('s3-line-fill');
      if (lineFill) lineFill.style.width = '100%';
      setTimeout(() => {
        document.querySelectorAll('.s4-fill').forEach((f) => {
          f.style.width = f.dataset.pct + '%';
        });
      }, 100);
    }
  });

})();
