(function (root) {
  "use strict";

  var genres = [
    { id: "psy", label: "Psytrance", sub: "full-on et progressif" },
    { id: "hardtek", label: "Hardtek", sub: "tekno, mental, tribe" },
    { id: "hardcore", label: "Hardcore", sub: "frenchcore, kick saturé" },
    { id: "hardtechno", label: "Hard techno", sub: "industriel, rave, 150–162" }
  ];

  var artists = [
    {
      id: "hilight",
      name: "Hilight Tribe",
      family: "psy",
      also: ["tribe"],
      bpm: [142, 148],
      hint: "Full-on tribal, didgeridoo, rite",
      traits: [
        { slot: "lead", tag: "didgeridoo lead", lanes: ["psy", "tribe", "prog"], minTribal: 20 },
        { slot: "color", tag: "tribal hand drums", lanes: ["psy", "tribe", "prog", "hardtek"], minTribal: 35 }
      ]
    },
    {
      id: "basswell",
      name: "Basswell",
      family: "hardtechno",
      also: [],
      bpm: [150, 162],
      hint: "Hard techno industriel, gros bas, 150–162",
      traits: [
        { slot: "kick", tag: "industrial hard-techno kick", lanes: ["hardtechno", "industek"] },
        { slot: "bass", tag: "distorted techno bass", lanes: ["hardtechno", "industek", "hardtek"] },
        { slot: "color", tag: "warehouse rave stab", lanes: ["hardtechno", "industek"] }
      ]
    },
    {
      id: "lebask",
      name: "LeBask",
      family: "hardtek",
      also: ["tribe"],
      bpm: [176, 190],
      hint: "Hardtek free-party, kick brut",
      traits: [
        { slot: "kick", tag: "raw hardtek kick", lanes: ["hardtek", "tribe", "frenchcore"] },
        { slot: "color", tag: "fast rattling hats", lanes: ["hardtek", "frenchcore", "tribe", "industek"] }
      ]
    },
    {
      id: "billx",
      name: "Billx",
      family: "hardtek",
      also: ["frenchcore", "tribe"],
      bpm: [170, 192],
      hint: "Hardtek mélodique, frenchcore, tribe",
      traits: [
        { slot: "kick", tag: "bouncy distorted kick", lanes: ["hardtek", "frenchcore", "tribe", "industek"] },
        { slot: "lead", tag: "festive hardtek lead", lanes: ["hardtek", "frenchcore", "tribe"], minMelodic: 32 },
        { slot: "bass", tag: "massive bass tail", lanes: ["hardtek", "frenchcore", "tribe"] }
      ]
    },
    {
      id: "vini",
      name: "Vini Vici",
      family: "psy",
      also: [],
      bpm: [140, 148],
      hint: "Full-on festival, lead hymne",
      traits: [
        { slot: "lead", tag: "eastern anthemic lead", lanes: ["psy", "prog", "tribe"], minMelodic: 36 },
        { slot: "color", tag: "festival chord stab", lanes: ["psy", "prog", "trance"], minMelodic: 48 }
      ]
    },
    {
      id: "marsai",
      name: "Marsai Ventura",
      family: "psy",
      also: [],
      bpm: [144, 150],
      hint: "Full-on roulant, lead qui vrille",
      traits: [
        { slot: "bass", tag: "rolling psy bassline", lanes: ["psy", "prog", "tribe"] },
        { slot: "lead", tag: "twisting psychedelic lead", lanes: ["psy", "tribe"] }
      ]
    },
    {
      id: "perceval",
      name: "Perceval",
      family: "hardtek",
      also: [],
      bpm: [180, 194],
      hint: "Mental hardtek, sombre, très saturé",
      traits: [
        { slot: "kick", tag: "mental distorted kick", lanes: ["hardtek", "frenchcore"] },
        { slot: "color", tag: "paranoid synth stab", lanes: ["hardtek", "frenchcore", "industek"], minDark: 28 }
      ]
    },
    {
      id: "astrix",
      name: "Astrix",
      family: "prog",
      also: [],
      bpm: [136, 140],
      hint: "Psy progressif, profond, autour de 138",
      traits: [
        { slot: "bass", tag: "deep rolling bass", lanes: ["prog", "psy", "trance"] },
        { slot: "lead", tag: "hypnotic arpeggio", lanes: ["prog", "trance", "psy"] },
        { slot: "color", tag: "warm analog pad", lanes: ["prog", "trance"], maxDark: 66 }
      ]
    },
    {
      id: "lpf",
      name: "La p'tite fumée",
      family: "tribe",
      also: ["psy", "hardtek"],
      bpm: [154, 176],
      hint: "Tribe psyché, entre psy et tek",
      traits: [
        { slot: "lead", tag: "didgeridoo lead", lanes: ["tribe", "psy", "hardtek"], minTribal: 30 },
        { slot: "color", tag: "festive hand percussion", lanes: ["tribe", "psy", "hardtek"], minTribal: 25 }
      ]
    },
    {
      id: "hitch",
      name: "Technical Hitch",
      family: "psy",
      also: [],
      bpm: [144, 150],
      hint: "Full-on nerveux, lead acide",
      traits: [
        { slot: "lead", tag: "acid psychedelic lead", lanes: ["psy", "tribe", "prog", "hardtechno"], minAcid: 28 },
        { slot: "color", tag: "driving offbeat hats", lanes: ["psy", "prog", "tribe"] }
      ]
    },
    {
      id: "kloxn",
      name: "Le Kloxn",
      family: "hardtek",
      also: [],
      bpm: [176, 190],
      hint: "Hardtek nocturne, kick claquant",
      traits: [
        { slot: "kick", tag: "clanging tek kick", lanes: ["hardtek", "frenchcore", "industek"] },
        { slot: "bass", tag: "gritty rolling bass", lanes: ["hardtek", "frenchcore", "industek"] },
        { slot: "color", tag: "short aggressive stab", lanes: ["hardtek", "frenchcore", "hardtechno", "industek"] }
      ]
    },
    {
      id: "armin",
      name: "Armin van Buuren",
      family: "trance",
      also: [],
      bpm: [136, 140],
      hint: "Uplifting trance, 138, supersaw",
      traits: [
        { slot: "lead", tag: "supersaw chord stack", lanes: ["trance"] },
        { slot: "color", tag: "pluck arpeggio", lanes: ["trance", "prog"] },
        { slot: "color", tag: "long breakdown riser", lanes: ["trance", "prog"] },
        { slot: "color", tag: "bright synth stab", lanes: ["hardtek", "tribe", "frenchcore"], minMelodic: 58 }
      ]
    }
  ];

  var presets = [
    {
      id: "fullon",
      name: "Full-on tribal",
      note: "Rite festival, ~146",
      apply: {
        genres: { psy: 3, hardtek: 0, hardcore: 0, hardtechno: 0 },
        artists: ["hilight", "vini", "marsai", "hitch"],
        acid: 30, dark: 28, tribal: 84, melodic: 64, energy: 76,
        vocal: "instrumental"
      }
    },
    {
      id: "prog",
      name: "Progressif",
      note: "Profond, ~138",
      apply: {
        genres: { psy: 0, hardtek: 0, hardcore: 0, hardtechno: 0 },
        artists: ["astrix", "hitch"],
        acid: 12, dark: 44, tribal: 18, melodic: 46, energy: 46,
        vocal: "instrumental"
      }
    },
    {
      id: "mental",
      name: "Mental hardtek",
      note: "Sombre, 180+",
      apply: {
        genres: { psy: 0, hardtek: 3, hardcore: 2, hardtechno: 0 },
        artists: ["perceval", "kloxn", "lebask"],
        acid: 16, dark: 88, tribal: 10, melodic: 14, energy: 82,
        vocal: "instrumental"
      }
    },
    {
      id: "tribe",
      name: "Tribe psyché",
      note: "Le pont psy / tek",
      apply: {
        genres: { psy: 2, hardtek: 2, hardcore: 0, hardtechno: 0 },
        artists: ["lpf", "billx", "hilight"],
        acid: 44, dark: 32, tribal: 90, melodic: 58, energy: 74,
        vocal: "chops"
      }
    },
    {
      id: "rave",
      name: "Hard techno",
      note: "Indus, ~155",
      apply: {
        genres: { psy: 0, hardtek: 0, hardcore: 0, hardtechno: 3 },
        artists: ["basswell"],
        acid: 50, dark: 64, tribal: 6, melodic: 20, energy: 72,
        vocal: "instrumental"
      }
    },
    {
      id: "trance",
      name: "Trance large",
      note: "Hymne, 138",
      apply: {
        genres: { psy: 0, hardtek: 0, hardcore: 0, hardtechno: 0 },
        artists: ["armin"],
        acid: 6, dark: 16, tribal: 4, melodic: 86, energy: 74,
        vocal: "trance", voiceGender: "femme", sungLang: "fr"
      }
    },
    {
      id: "acid",
      name: "Acide 303",
      note: "Squelch devant",
      apply: {
        genres: { psy: 2, hardtek: 0, hardcore: 0, hardtechno: 1 },
        artists: ["hitch", "basswell", "lpf"],
        acid: 92, dark: 48, tribal: 36, melodic: 28, energy: 68,
        vocal: "instrumental"
      }
    },
    {
      id: "core",
      name: "Frenchcore",
      note: "Festif et très vite",
      apply: {
        genres: { psy: 0, hardtek: 0, hardcore: 3, hardtechno: 0 },
        artists: ["billx"],
        acid: 20, dark: 34, tribal: 18, melodic: 74, energy: 90,
        vocal: "instrumental"
      }
    },
    {
      id: "free",
      name: "Free party",
      note: "Tek + tribe + MC",
      apply: {
        genres: { psy: 0, hardtek: 3, hardcore: 1, hardtechno: 0 },
        artists: ["perceval", "lebask", "kloxn", "lpf", "billx"],
        acid: 36, dark: 56, tribal: 48, melodic: 30, energy: 84,
        vocal: "mc", voiceGender: "homme", sungLang: "fr"
      }
    }
  ];

  root.RITE_DATA = {
    genres: genres,
    artists: artists,
    presets: presets
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
