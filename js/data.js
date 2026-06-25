/**
 * DATA.JS — Source unique des Porsche 911 GT3 RS
 *
 * Structure : GT3RS_GENERATIONS (groupé par génération)
 * Chaque génération contient un tableau `models` avec ses variantes.
 *
 * GT3RS_MODELS (plat) est dérivé automatiquement pour les autres sections.
 */

const GT3RS_GENERATIONS = [
  {
    gen:     '996',
    label:   'Génération 996',
    years:   [2003, 2005],
    current: false,
    image:   './assets/images/Porsche-911-GT3-RS-996-1.png',
    models: [
      {
        id:     'gen-996',
        name:   '911 GT3 RS',
        variant:'996',
        years:  [2003, 2005],
        engine: '3.6 L · Boxer 6 · 7 400 tr/min',
        weight: 1270,
        rpm:    7400,
        hp:     381,
        sprint: 4.4,
        vmax:   280,
        nring:  463.0,
        image:  './assets/images/996-gt3rs.jpg',
        badge:  null,
      },
    ],
  },

  {
    gen:     '997',
    label:   'Génération 997',
    years:   [2006, 2012],
    current: false,
    image:   './assets/images/Porsche-911-GT3-RS-997-2.png',
    models: [
      {
        id:     'gen-997-1',
        name:   '911 GT3 RS',
        variant:'997.1',
        years:  [2006, 2009],
        engine: '3.6 L · Boxer 6 · 7 600 tr/min',
        weight: 1375,
        rpm:    7600,
        hp:     415,
        sprint: 4.2,
        vmax:   310,
        nring:  455.0,
        image:  './assets/images/997-1-gt3rs.jpg',
        badge:  null,
      },
      {
        id:     'gen-997-2',
        name:   '911 GT3 RS 3.8',
        variant:'997.2',
        years:  [2009, 2011],
        engine: '3.8 L · Boxer 6 · 7 900 tr/min',
        weight: 1370,
        rpm:    7900,
        hp:     450,
        sprint: 3.9,
        vmax:   310,
        nring:  448.0,
        image:  './assets/images/997-2-gt3rs.jpg',
        badge:  '+35 ch',
      },
      {
        id:     'gen-997-40',
        name:   '911 GT3 RS 4.0',
        variant:'997 4.0',
        years:  [2011, 2012],
        engine: '4.0 L · 8 250 tr/min · Dérivé GT1',
        weight: 1360,
        rpm:    8250,
        hp:     500,
        sprint: 3.9,
        vmax:   312,
        nring:  444.0,
        image:  './assets/images/997-40-gt3rs.jpg',
        badge:  'Collector',
      },
    ],
  },

  {
    gen:     '991',
    label:   'Génération 991',
    years:   [2015, 2020],
    current: false,
    image:   './assets/images/Porsche-911-GT3-RS-991-3.png',
    models: [
      {
        id:     'gen-991',
        name:   '911 GT3 RS',
        variant:'991.1',
        years:  [2015, 2016],
        engine: '4.0 L · PDK 7 rapports',
        weight: 1420,
        rpm:    8800,
        hp:     500,
        sprint: 3.3,
        vmax:   310,
        nring:  432.0,
        image:  './assets/images/991-gt3rs.jpg',
        badge:  null,
      },
      {
        id:     'gen-991-2',
        name:   '911 GT3 RS',
        variant:'991.2',
        years:  [2018, 2020],
        engine: '4.0 L · Aileron actif PDCC',
        weight: 1430,
        rpm:    8800,
        hp:     520,
        sprint: 3.2,
        vmax:   312,
        nring:  416.4,
        image:  './assets/images/991-2-gt3rs.jpg',
        badge:  'Aéro active',
      },
    ],
  },

  {
    gen:     '992',
    label:   'Génération 992',
    years:   [2022, 2024],
    current: true,
    image:   './assets/images/Porsche-911-GT3-RS-992-4.png',
    models: [
      {
        id:     'gen-992',
        name:   '911 GT3 RS',
        variant:'992',
        years:  [2022, 2024],
        engine: '4.0 L · 8 500 tr/min · DRS',
        weight: 1450,
        rpm:    8500,
        hp:     525,
        sprint: 3.2,
        vmax:   296,
        nring:  409.3,
        image:  './assets/images/992-gt3rs.jpg',
        badge:  null,
      },
    ],
  },
];

// Liste plate dérivée (utilisée par les sections 4 et 5)
const GT3RS_MODELS = GT3RS_GENERATIONS.flatMap((g) => g.models);
