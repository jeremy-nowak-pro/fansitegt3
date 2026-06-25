/**
 * HERO.JS — Three.js scene (Section 1)
 *
 * Responsabilités :
 *  - Renderer WebGL, scène, caméra
 *  - Éclairage cinématique (SpotLight key + rim + ambient)
 *  - Sol réfléchissant + ligne lumineuse
 *  - Chargement GLB avec fallback géométrique
 *  - Boucle de rendu + rotation lente caméra
 *  - Resize
 *
 * Dispatche window CustomEvent('hero:car-loaded') quand le modèle est prêt.
 * app.js écoute cet event pour lancer l'animation texte GSAP.
 */

(function () {
  'use strict';

  /* ── Renderer ── */
  const canvas = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding      = THREE.sRGBEncoding;
  renderer.toneMapping         = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.6;
  renderer.setClearColor(0x080808, 1);
  renderer.shadowMap.enabled   = true;
  renderer.shadowMap.type      = THREE.PCFSoftShadowMap;

  /* ── Scène ── */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080808);
  scene.fog = new THREE.FogExp2(0x080808, 0.045);

  /* ── Caméra ── */
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(4.5, 1.4, 5.5);
  camera.lookAt(-2.0, 0.3, 0);

  /* ── Éclairage ── */

  // Key light — spot latéral gauche chaud (principal)
  const spotKey = new THREE.SpotLight(0xfff4e0, 9.0, 22, Math.PI / 5, 0.25, 1.2);
  spotKey.position.set(-5, 7, 3);
  spotKey.target.position.set(0, 0.2, 0);
  spotKey.castShadow = true;
  spotKey.shadow.mapSize.set(2048, 2048);
  spotKey.shadow.bias = -0.0005;
  scene.add(spotKey, spotKey.target);

  // Rim light — contre-jour froid (droite arrière)
  const spotRim = new THREE.SpotLight(0xc8d8ff, 5.5, 20, Math.PI / 6, 0.35, 1.5);
  spotRim.position.set(6, 5, -5);
  spotRim.target.position.set(0, 0.2, 0);
  scene.add(spotRim, spotRim.target);

  // Fill light — face avant, doux (révèle les détails du capot)
  const spotFill = new THREE.SpotLight(0xfff8f0, 3.5, 16, Math.PI / 5, 0.5, 2.0);
  spotFill.position.set(2, 3, 7);
  spotFill.target.position.set(0, 0.4, 0);
  scene.add(spotFill, spotFill.target);

  // Ambiance générale (lève les ombres trop noires)
  scene.add(new THREE.AmbientLight(0x222230, 2.5));

  // Reflet sol
  const fillFloor = new THREE.PointLight(0x444455, 1.5, 7);
  fillFloor.position.set(0, -1.2, 0);
  scene.add(fillFloor);

  /* ── Sol réfléchissant ── */
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x090909, metalness: 0.85, roughness: 0.20 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y  = -0.42;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ligne lumineuse sol (accent orange)
  const glowLine = new THREE.Mesh(
    new THREE.PlaneGeometry(0.03, 6),
    new THREE.MeshBasicMaterial({ color: 0xe8620a, transparent: true, opacity: 0.6 })
  );
  glowLine.rotation.x = -Math.PI / 2;
  glowLine.position.set(-2.2, -0.41, 0);
  scene.add(glowLine);

  /* ── Caméra — position fixe, la voiture tourne sur Y ── */
  const HERO_RADIUS     = 6.5;
  const HERO_CAM_Y      = 1.4;
  const HERO_BASE_ANGLE = -0.52;  // angle fixe (voiture dans le tiers droit)
  const TARGET_LOOK     = new THREE.Vector3(-1.2, 0.3, 0);

  // Référence à la voiture pour la rotation
  let carGroup = null;

  function initCameraForHero() {
    camera.position.set(
      Math.sin(HERO_BASE_ANGLE) * HERO_RADIUS,
      HERO_CAM_Y,
      Math.cos(HERO_BASE_ANGLE) * HERO_RADIUS
    );
    camera.lookAt(TARGET_LOOK);
  }

  /* ── Boucle de rendu ── */
  const clock = new THREE.Clock();
  let rendering = true;

  renderer.setAnimationLoop(() => {
    if (!rendering) return;
    const dt = clock.getDelta();
    if (carGroup) carGroup.rotation.y += dt * 0.22;
    renderer.render(scene, camera);
  });

  new IntersectionObserver(
    ([entry]) => {
      rendering = entry.isIntersecting;
      if (rendering) clock.getDelta(); // flush le delta accumulé pendant la pause
    },
    { threshold: 0.01 }
  ).observe(canvas);

  /* ── Setup modèle ── */
  function setupCar(group) {
    carGroup = group;

    // Normaliser taille
    const box  = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const maxD = Math.max(size.x, size.y, size.z);
    group.scale.setScalar(3.8 / maxD);

    // Centrer et poser sur sol
    const box2 = new THREE.Box3().setFromObject(group);
    const ctr  = box2.getCenter(new THREE.Vector3());
    group.position.set(-ctr.x, -box2.min.y - 0.42, -ctr.z);

    // Ombres — matériaux intacts (pas de transparence)
    group.traverse((c) => {
      if (c.isMesh) {
        c.castShadow    = true;
        c.receiveShadow = true;
      }
    });

    scene.add(group);
    initCameraForHero();

    // Révélation via l'overlay CSS (voiture toujours opaque → pas d'intérieur visible)
    const overlay       = document.getElementById('hero-overlay');
    const FADE_DURATION = 0.5;
    const FADE_DELAY    = 0.1;

    if (overlay && typeof gsap !== 'undefined') {
      gsap.to(overlay, {
        opacity:  0,
        duration: FADE_DURATION,
        delay:    FADE_DELAY,
        ease:     'power2.inOut',
        onComplete() { overlay.style.display = 'none'; },
      });
      // Texte démarre à 70% de la révélation
      gsap.delayedCall(FADE_DELAY + FADE_DURATION * 0.7, () => {
        window.dispatchEvent(new CustomEvent('hero:car-loaded'));
      });
    } else {
      window.dispatchEvent(new CustomEvent('hero:car-loaded'));
    }
  }

  /* ── Fallback géométrique ── */
  function buildFallback() {
    const g = new THREE.Group();

    function addMesh(geo, mat, x, y, z, rx) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x || 0, y || 0, z || 0);
      if (rx !== undefined) m.rotation.x = rx;
      m.castShadow = true;
      g.add(m);
    }

    const body  = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x334455, transparent: true, opacity: 0.5, roughness: 0 });
    const dark  = new THREE.MeshStandardMaterial({ color: 0x060606, metalness: 0.4, roughness: 0.6 });
    const rim   = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 1.0, roughness: 0.1 });

    addMesh(new THREE.BoxGeometry(2.0, 0.44, 4.2), body,  0, 0.28, 0);
    addMesh(new THREE.BoxGeometry(1.7, 0.42, 2.1), body,  0, 0.70, 0.1);
    addMesh(new THREE.BoxGeometry(1.6, 0.38, 0.06), glass, 0, 0.72, -0.95, -0.18);
    addMesh(new THREE.BoxGeometry(1.6, 0.32, 0.06), glass, 0, 0.72,  1.12,  0.18);
    addMesh(new THREE.BoxGeometry(1.8, 0.05, 0.28), dark,  0, 0.96,  2.06);

    [[-1.04, 0, -1.26], [1.04, 0, -1.26], [-1.04, 0, 1.26], [1.04, 0, 1.26]].forEach(([x, y, z]) => {
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 40), dark);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(x, y, z);
      tire.castShadow = true;
      g.add(tire);
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.26, 20), rim);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(x, y, z);
      g.add(wheel);
    });

    return g;
  }

  /* ── Chargement dynamique GLTFLoader + DRACOLoader ── */
  function loadScript(url, fallbackUrl, cb) {
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => cb(null);
    s.onerror = () => {
      if (!fallbackUrl) { cb(new Error('CDN failed')); return; }
      const s2 = document.createElement('script');
      s2.src = fallbackUrl;
      s2.onload = () => cb(null);
      s2.onerror = () => cb(new Error('All CDN failed'));
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  }

  loadScript(
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js',
    'https://unpkg.com/three@0.128.0/examples/js/loaders/GLTFLoader.js',
    (err) => {
      if (err || typeof THREE.GLTFLoader === 'undefined') {
        setupCar(buildFallback());
        return;
      }
      loadScript(
        'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/DRACOLoader.js',
        'https://unpkg.com/three@0.128.0/examples/js/loaders/DRACOLoader.js',
        () => {
          try {
            const loader = new THREE.GLTFLoader();
            if (typeof THREE.DRACOLoader !== 'undefined') {
              const draco = new THREE.DRACOLoader();
              draco.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
              loader.setDRACOLoader(draco);
            }
            loader.load(
              './assets/models/gt3rs.glb',
              (data) => setupCar(data.scene),
              null,
              () => setupCar(buildFallback())
            );
          } catch (e) {
            setupCar(buildFallback());
          }
        }
      );
    }
  );

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

})();
