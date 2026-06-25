# GT3 RS Fansite — Avancement

## Sections

| # | Nom | État |
|---|-----|------|
| 1 | Hero (Three.js) | ✅ Fait |
| 2 | Tableau générations | ✅ Fait |
| 3 | Timeline — grille asymétrique | ✅ Fait |
| 4 | Évolution graphique | ✅ Fait |
| 5 | GT3 RS 992 · 3D + Hotspots | ⬜ À faire |

---

## Section 1 — Hero

- Scène Three.js, modèle GLB + fallback géométrique
- Éclairage cinématique (key / rim / fill)
- Sol réfléchissant + ligne orange au sol
- Titre, sous-titre, stats 992 bas droite
- Animations GSAP au chargement

---

## Section 2 — Tableau générations

- Structure 4 colonnes : Modèle | Ch | 0–100 | Vmax
- 4 générations : 996 / 997 / 991 / 992
- Flex proportionnel par génération (models.length + 1.5)
- Noms lisibles : "GT3 RS", "GT3 RS 3.8", "GT3 RS 4.0"
- Titres de génération en orange (--accent)

### Décisions actées
- Pas d'images dans la section 2
- Pas de fonds alternants entre générations
- Pas de badges colorés
- Orange réservé : hover, éléments actifs, décoratifs

---

## Section 3 — Timeline des générations

### Layout
- `height: 100vh`, fond noir (--black), padding 48px 7vw 0
- Header (eyebrow + titre) en haut, grille remplit le reste

### Grille
- CSS Grid asymétrique : `grid-template-columns: 1.4fr 1fr 1fr 1.2fr`, gap 2px
- 996 → colonne 1, pleine hauteur
- 997 → colonne 2, wrapper `.s3-col` (flex column) : carte 997 main (haut) + carte 4.0 Collector (bas)
- 991 → colonne 3, pleine hauteur
- 992 → colonne 4, pleine hauteur

### Cartes
- `background-image` depuis `gen.image` (assets/images/Porsche-911-GT3-RS-xxx.png)
- Overlay dégradé noir bas→haut pour lisibilité
- Numéro génération (996/997/991/992) en watermark décoratif (opacity 0.12)
- 992 : numéro en orange (opacity 0.3), liseré orange 2px en bas
- Hover : zoom léger image (scale 1.03, transition 0.6s)
- Phrase éditoriale par génération (GEN_PHRASES dans app.js)

### Animations
- Titre : fade-up au scroll (GSAP ScrollTrigger, start: top 75%)
- Cartes : cascade de fade-up (delay i × 0.08s, start: top 65%)

---

## Section 4 — Évolution graphique

### Layout
- `height: 100vh`, fond clair (--light-bg), padding 48px 7vw 56px
- `justify-content: space-between` entre `.s4-top` (titre + toggle) et `.s4-bars`
- `.s4-top` : flex-direction column, titre puis boutons toggle empilés à gauche
- `.s4-bars` : flex: 1, justify-content: space-between — les 7 lignes occupent toute la hauteur disponible

### Toggle
- 3 métriques : Puissance / 0–100 / Vmax
- Style : boutons à bordure rectangulaire (border-radius: 0), matching badge-item du hero
- Actif : border-color --light-hi (noir), inactifs : border-color --light-line (gris clair)
- Au clic : collapse des barres à 0% instantané, puis re-expand en cascade avec stagger (delay i × 0.04s)

### Barres
- Label (nom + variante·année) au-dessus de la barre → alignement gauche avec le titre
- Track : 6px, fond rgba(0,0,0,0.07)
- Fill : --accent (orange) pour tous les modèles
- Normalisation min→max : (val - min) / (max - min) × 78 + 14%
- 0–100 inversé : temps court = barre longue
- Valeur affichée : 1.4rem, font-weight 200, à droite de la barre

### Animations
- Titre : fade-up au scroll
- Rows : cascade de fade-in translateX au scroll (GSAP ScrollTrigger)

---

## Décisions de design globales

- Alternance sombre/clair : S1 noir → S2 clair → S3 noir → S4 clair → S5 ?
- Toutes les sections : `height: 100vh`, `overflow: hidden`, `box-sizing: border-box`
- Orange (--accent #e8620a) : seul élément d'accentuation, jamais utilisé en masse
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
--light-hi     #111111
--light-mid    #5a5a5a
--light-lo     #a8a49e
--light-ghost  #c8c4bc
--light-line   #d4d0c8
--light-bg     #f5f3f0
--white        #f8f7f4
```

---

## Stack technique

- HTML/CSS/JS vanilla (pas de framework)
- Three.js r128 (hero 3D)
- GSAP 3.12.5 + ScrollTrigger (animations)
- Données centralisées dans `js/data.js` (GT3RS_GENERATIONS + GT3RS_MODELS dérivé)
- Sections 2, 3, 4 construites par injection JS depuis les données
