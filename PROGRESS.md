# GT3 RS Fansite — Avancement

## Sections

| # | Nom | État |
|---|-----|------|
| 1 | Hero (Three.js) | ✅ Fait |
| 2 | Tableau générations | ✅ Fait |
| 3 | Timeline des générations | ✅ Fait |
| 4 | Évolution graphique | ✅ Fait |
| 5 | GT3 RS 992 · 3D + Hotspots | ⬜ À faire |

---

## Section 1 — Hero

- Scène Three.js, modèle GLB + fallback géométrique (boîtes + roues)
- GLTFLoader + DRACOLoader chargés dynamiquement (CDN jsDelivr → unpkg en fallback)
- Éclairage cinématique : SpotLight key (chaud, gauche), rim (froid, arrière droite), fill (face)
- Brouillard exponentiel (`FogExp2`, densité 0.045) pour fondre le fond
- Sol réfléchissant (metalness 0.85 / roughness 0.20) + ligne lumineuse orange au sol
- Titre, sous-titre, stats 992 bas droite
- **La voiture tourne** sur Y (`carGroup.rotation.y += dt * 0.22`) — la caméra est fixe
- IntersectionObserver sur le canvas : boucle de rendu suspendue quand hors viewport
- Révélation via overlay CSS (#hero-overlay) fondu GSAP (0.5s)
- Animations texte GSAP déclenchées par `window.CustomEvent('hero:car-loaded')`

---

## Section 2 — Tableau générations

- Structure 4 colonnes : Modèle | Ch | 0–100 | Vmax
- 4 générations : 996 / 997 / 991 / 992, chacune avec ses variantes
- Flex proportionnel par génération (`models.length + 1.5`)
- Liseré vertical gauche sur chaque génération (2px `--light-line`), orange + glow sur 992
- Titres de génération en orange sur 992 uniquement (`.gen-current .gen-label`)

### Décisions actées
- Pas d'images dans la section 2
- Pas de fonds alternants entre générations
- Pas de badges colorés (`.car-badge { display: none }`)
- Orange réservé : génération active + liseré accent

---

## Section 3 — Timeline des générations

### Layout
- `height: 100vh`, fond noir (`--black`), padding `48px 7vw`
- Header (eyebrow + titre) en haut, grille remplit le reste via `flex: 1`

### Grille
- CSS Grid **4 colonnes égales** : `repeat(4, 1fr)`, gap 12px
- Une carte par génération (996 / 997 / 991 / 992) — pas de split 997 en sous-cartes
- Chaque carte occupe toute la hauteur disponible

### Cartes
- Image de fond depuis `gen.image` (assets/images/Porsche-911-GT3-RS-xxx.png)
- `background-size: 80%`, `background-repeat: no-repeat`, `background-position: center`
- Overlay dégradé bas→haut pour lisibilité texte
- Numéro génération (996/997/991/992) en grand watermark décoratif (`rgba(255,255,255,0.12)`)
- 992 : numéro en `--accent` (orange)
- Hover : zoom léger image (scale 1.03, transition 0.6s)
- Contenu éditorial depuis `GEN_CONTENT` dans app.js : `innovation` (texte long) + `stats` (4 lignes) + `engine`

### Animations
- Titre : fade-up au scroll (GSAP ScrollTrigger, `start: top 75%`)
- Cartes : cascade de fade-up (`delay i × 0.08s`, `start: top 65%`)

---

## Section 4 — Évolution graphique

### Layout
- `height: 100vh`, fond clair (`--light-bg`), padding `48px 7vw 56px`
- `justify-content: space-between` entre `.s4-top` (titre + toggle) et `.s4-bars`
- `.s4-top` : flex-direction column, titre puis boutons toggle empilés à gauche
- `.s4-bars` : `flex: 1`, `justify-content: space-between` — les 7 lignes occupent toute la hauteur

### Toggle
- 3 métriques : **Ch / tonne** (`pwratio`) · **Régime** (`rpm`) · **Nürburgring** (`nring`)
- Style : boutons à bordure rectangulaire (border-radius: 0)
- Actif : `border-color --light-hi` (noir), inactifs : `border-color --light-line` (gris)
- Au clic : collapse des barres à 0% instantané, puis re-expand en cascade (`delay i × 0.04s`)

### Barres
- Label (nom + variante · année) au-dessus de la barre
- Track : 6px, fond `rgba(0,0,0,0.07)`
- Fill : `--accent` (orange) pour tous les modèles
- Normalisation min→max : `(val - min) / (max - min) × 78 + 14%`
- **Nürburgring inversé** : temps court = barre longue (`invert: true` dans S4_METRICS)
- Valeur affichée : 1.4rem, font-weight 200, à droite de la barre (format `m:ss` pour Nürburgring)

### Animations
- Titre : fade-up au scroll (GSAP ScrollTrigger)
- Rows : cascade de fade-in translateX au scroll (`delay i × 0.06s`)

---

## Décisions de design globales

- Alternance sombre/clair : S1 noir → S2 clair → S3 noir → S4 clair → S5 ?
- Toutes les sections : `height: 100vh`, `overflow: hidden`, `box-sizing: border-box`
- Orange (`--accent #e8620a`) : seul élément d'accentuation, jamais utilisé en masse
- Titres de section : `clamp(2.4rem, 4vw, 4.5rem)`, font-weight 200
- Eyebrows : 0.58rem, letter-spacing 0.44em, uppercase
- ScrollTrigger chargé depuis cdnjs (gsap 3.12.5)

---

## Charte couleur

```
--accent       #e8620a   Orange Racing — accentuation unique

Surface sombre (hero, S3)
--dark-hi      #ffffff
--dark-mid     #b0aca6
--dark-lo      rgba(255,255,255,0.30)
--dark-line    rgba(255,255,255,0.10)
--black        #080808

Surface claire (S2, S4)
--light-hi     #3a3a3a
--light-mid    #7a7a7a
--light-lo     #b0aca6
--light-ghost  #d0ccc4
--light-line   #d4d0c8
--light-bg     #f5f3f0
--white        #f8f7f4
```

---

## Stack technique

- HTML/CSS/JS vanilla (pas de framework)
- Three.js r128 (hero 3D) — GLTFLoader + DRACOLoader dynamiques
- GSAP 3.12.5 + ScrollTrigger (animations scroll)
- Données centralisées dans `js/data.js` (`GT3RS_GENERATIONS` + `GT3RS_MODELS` dérivé à plat)
- Sections 2, 3, 4 construites par injection JS depuis les données
