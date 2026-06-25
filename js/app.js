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

  // Contenu structuré par génération
  const GEN_CONTENT = {
    '996': {
      engine: '3.6 L · Boxer 6',
      stats: [
        { label: 'Exemplaires',       value: '682' },
        { label: 'Poids',             value: '1 270 kg' },
        { label: 'Régime max',        value: '7 400 tr/min' },
        { label: 'Transmission',      value: 'Manuelle 6 rapports' },
      ],
      innovation: 'Première 911 GT3 RS homologuée route, la 996 pose les bases de la lignée. Elle inaugure les freins céramiques PCCB en option — une première Porsche — réduisant les masses non suspendues de 18 kg. Carrosserie élargie de 44 mm, suspension réglable en hauteur et boîte manuelle 6 rapports : le modèle fondateur.',
    },
    '997': {
      engine: '3.6 → 3.8 → 4.0 L · Boxer 6',
      stats: [
        { label: 'Exemplaires',       value: '~3 268 (3 variantes)' },
        { label: 'Poids',             value: '1 360 kg' },
        { label: 'Régime max',        value: '8 250 tr/min (4.0)' },
        { label: 'Transmission',      value: 'Manuelle 6 rapports' },
      ],
      innovation: 'La 997 introduit le PASM — première suspension adaptative de série sur une GT3 RS — et le contrôle de traction TC en standard. Elle évolue en trois variantes : 997.1 (415 ch), 997.2 (450 ch) et le mythique 4.0 (500 ch · 600 exemplaires). Ce dernier, dérivé de la 911 GT1 de course, reste à ce jour l\'un des moteurs atmosphériques les plus révérés de Porsche.',
    },
    '991': {
      engine: '4.0 L · PDK 7 rapports',
      stats: [
        { label: 'Exemplaires',       value: '~9 270 (.1 + .2)' },
        { label: 'Poids',             value: '1 420 kg' },
        { label: 'Régime max',        value: '8 800 tr/min' },
        { label: 'Transmission',      value: 'PDK 7 rapports' },
      ],
      innovation: 'La 991 marque un tournant : abandon de la boîte manuelle au profit du PDK 7 rapports, plus rapide à chaque rapport. Suspension active PASM Sport en série. La 991.2 (2018) franchit un cap avec l\'aileron arrière actif PDCC — une première sur GT3 RS — et atteint 520 ch. Le kit Weissach optionnel allège jusqu\'à 35 kg supplémentaires.',
    },
    '992': {
      engine: '4.0 L · DRS actif',
      stats: [
        { label: 'Exemplaires',       value: '~5 000 (estimé)' },
        { label: 'Poids',             value: '1 450 kg' },
        { label: 'Régime max',        value: '8 500 tr/min' },
        { label: 'Transmission',      value: 'PDK 7 rapports · DRS' },
      ],
      innovation: 'L\'aboutissement de vingt ans. La 992 emprunte à la 911 RSR de course sa double triangulation avant — une première sur une 911 de série. Son système PAA ajuste en continu les ailes avant et le becquet arrière. À 285 km/h : 860 kg d\'appui, soit 3 fois plus qu\'un GT3 standard. Le DRS réduit la traînée en ligne droite. Résultat : 6:49.328 au Nürburgring, record toutes catégories à sa sortie.',
    },
  };

  function buildS3Card(className, imgSrc, genLabel, yearRange, content) {
    const statsHtml = (content.stats || []).map(s =>
      `<div class="s3-stat">` +
        `<span class="s3-stat-label">${s.label}</span>` +
        `<span class="s3-stat-value">${s.value}</span>` +
      `</div>`
    ).join('');
    const card = document.createElement('div');
    card.className = 's3-card ' + className;
    card.innerHTML =
      `<div class="s3-card-img" style="background-image:url('${imgSrc}')"></div>` +
      `<div class="s3-card-inner">` +
        `<div class="s3-card-top">` +
          `<span class="s3-card-gen">${genLabel}</span>` +
          `<p class="s3-card-years">${yearRange}</p>` +
        `</div>` +
        `<p class="s3-card-innovation">${content.innovation}</p>` +
        `<div class="s3-card-bot">` +
          `<p class="s3-card-engine">${content.engine}</p>` +
          `<div class="s3-card-stats">${statsHtml}</div>` +
        `</div>` +
      `</div>`;
    return card;
  }

  function renderSection3() {
    const grid = document.getElementById('s3-grid');
    if (!grid || typeof GT3RS_GENERATIONS === 'undefined') return;

    GT3RS_GENERATIONS.forEach((gen) => {
      const content = GEN_CONTENT[gen.gen] || { engine: '', weight: '', facts: [] };
      const img = gen.image || '';
      const yearRange = `${gen.years[0]} — ${gen.years[1] ? gen.years[1] : 'aujourd\'hui'}`;

      const card = buildS3Card(`s3-card--${gen.gen}`, img, gen.gen, yearRange, content);
      grid.appendChild(card);
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

    // Cartes en cascade au scroll
    gsap.utils.toArray('.s3-card').forEach((card, i) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power2.out',
        delay: i * 0.08,
        scrollTrigger: { trigger: '#s3', start: 'top 65%' },
      });
    });
  }


  /* ═══════════════════════════════════════════════════
     SECTION 4 — Évolution graphique (construction DOM + logique)
  ═══════════════════════════════════════════════════ */

  const S4_METRICS = {
    pwratio: { key: 'pwratio', unit: 'ch/t', invert: false },
    rpm:    { key: 'rpm',    unit: 'tr/min',    invert: false },
    nring:  { key: 'nring',  unit: '',          invert: true  },
  };

  function secsToLap(s) {
    const m = Math.floor(s / 60);
    const rem = s - m * 60;
    return m + ':' + (rem < 10 ? '0' : '') + rem.toFixed(0).padStart(2, '0');
  }

  let s4CurrentMetric = 'pwratio';

  function calcPct(val, minVal, maxVal, invert) {
    if (invert) return ((maxVal - val) / (maxVal - minVal || 1)) * 78 + 14;
    return ((val - minVal) / (maxVal - minVal || 1)) * 78 + 14;
  }

  function getVal(model, m) {
    if (m.key === 'pwratio') return Math.round(model.hp / (model.weight / 1000));
    return model[m.key];
  }

  function renderS4Bars(metric) {
    const container = document.getElementById('s4-bars');
    if (!container || typeof GT3RS_GENERATIONS === 'undefined') return;

    const m = S4_METRICS[metric];
    const allVals = GT3RS_MODELS.map((x) => getVal(x, m));
    const maxVal = Math.max(...allVals);
    const minVal = Math.min(...allVals);

    const isFirstRender = container.children.length === 0;

    if (isFirstRender) {
      // Construction des lignes (sans séparateurs)
      GT3RS_GENERATIONS.forEach((gen) => {
        gen.models.forEach((model) => {
          const shortName = (model.name || '').replace('911 ', '');
          const row = document.createElement('div');
          row.className = 's4-row' + (gen.current ? ' highlight' : '');
          row.innerHTML =
            `<div class="s4-label">` +
              `<span class="s4-label-name">${shortName}</span>` +
              `<span class="s4-label-sub">${model.variant} · ${model.years[0]}</span>` +
            `</div>` +
            `<div class="s4-row-bar">` +
              `<div class="s4-track"><div class="s4-fill" style="width:0%"></div></div>` +
              `<div class="s4-value"><span class="s4-value-unit"></span></div>` +
            `</div>`;
          container.appendChild(row);
        });
      });

    } else {
      // Collapse toutes les barres à 0 instantanément
      container.querySelectorAll('.s4-fill').forEach((f) => {
        f.style.transition = 'none';
        f.style.width = '0%';
      });

      // Puis re-expand avec stagger après un tick
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const rows = container.querySelectorAll('.s4-row');
          let i = 0;
          GT3RS_MODELS.forEach((model) => {
            const row = rows[i++];
            if (!row) return;
            const fill = row.querySelector('.s4-fill');
            fill.style.transition = 'width 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
            fill.style.transitionDelay = (i * 0.04) + 's';
            const val = getVal(model, m);
            const pct = calcPct(val, minVal, maxVal, m.invert);
            fill.style.width = pct.toFixed(1) + '%';
            const displayVal = m.key === 'nring' ? secsToLap(val) : val;
            row.querySelector('.s4-row-bar .s4-value').innerHTML =
              `${displayVal}<span class="s4-value-unit">${m.unit}</span>`;
          });
        });
      });
      return; // les valeurs sont mises à jour dans le rAF
    }

    // Première animation (depuis 0 → valeurs) au chargement
    setTimeout(() => {
      const rows = container.querySelectorAll('.s4-row');
      let i = 0;
      GT3RS_MODELS.forEach((model) => {
        const row = rows[i++];
        if (!row) return;
        const fill = row.querySelector('.s4-fill');
        fill.style.transitionDelay = (i * 0.04) + 's';
        const val = getVal(model, m);
        const pct = calcPct(val, minVal, maxVal, m.invert);
        fill.style.width = pct.toFixed(1) + '%';
        const displayVal = m.key === 'nring' ? secsToLap(val) : val;
        row.querySelector('.s4-row-bar .s4-value').innerHTML =
          `${displayVal}<span class="s4-value-unit">${m.unit}</span>`;
      });
    }, 100);
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
    renderS4Bars('pwratio');
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
