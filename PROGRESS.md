# GT3 RS Fansite — Avancement

## Sections

| # | Nom | État |
|---|-----|------|
| 1 | Hero (Three.js) | ✅ Fait |
| 2 | Tableau générations | 🔄 En cours |
| 3 | Timeline | ✅ Fait |
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

### Fait
- Structure 4 colonnes : Modèle | Ch | 0–100 | Vmax
- 4 générations : 996 / 997 / 991 / 992
- Flex proportionnel par génération (models.length + 1.5)
- Noms lisibles : "GT3 RS", "GT3 RS 3.8", "GT3 RS 4.0"
- Espace normalisé entre dernier modèle et séparateur (align-items: end + padding-bottom fixe)
- Charte couleur établie depuis le hero, appliquée partout

### En discussion
- Couleur des titres génération (996, 997…) — orange en test

### Décisions actées
- Pas d'images dans la section 2
- Pas de fonds alternants entre générations
- Pas de badges colorés
- Orange réservé : hover, éléments actifs, décoratifs hero

---

## Section 3 — Timeline des générations

- Fond noir (continuité hero)
- 4 cartes en grille, une par génération (996 / 997 / 991 / 992)
- Rail horizontal orange animé au scroll (GSAP ScrollTrigger)
- Dot orange + halo pour la génération courante (992)
- Phrase éditoriale par génération
- Badge (Collector, Aéro active) si applicable
- Animations : titre fade-up + cards en cascade au scroll

---

## Section 4 — Évolution graphique

- Fond clair (--light-bg), alternance sombre/clair avec S3
- Toggle 3 métriques : Puissance / 0–100 / Vmax
- Barres horizontales animées au scroll pour les 7 modèles
- 992 mis en orange (--accent), autres en gris
- Logique invert pour le 0–100 (plus court = meilleure perf = barre plus longue)

---

## Charte couleur

```
--accent       #e8620a   Orange Racing — accentuation unique

Surface sombre (hero)
--dark-hi      #ffffff
--dark-mid     #b0aca6
--dark-lo      rgba(255,255,255,0.30)
--dark-line    rgba(255,255,255,0.10)

Surface claire (section 2+)
--light-hi     #111111
--light-mid    #5a5a5a
--light-lo     #a8a49e
--light-ghost  #c8c4bc
--light-line   #d4d0c8
--light-bg     #f5f3f0
```
