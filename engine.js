(function (root) {
  "use strict";

  var DATA = root.RITE_DATA;

  var LANES = {
    psy: { bpm: [142, 150] },
    prog: { bpm: [136, 142] },
    trance: { bpm: [136, 140] },
    hardtechno: { bpm: [150, 162] },
    tribe: { bpm: [154, 170] },
    hardtek: { bpm: [174, 192] },
    frenchcore: { bpm: [188, 200] },
    industek: { bpm: [162, 174] }
  };

  var LANE_FR = {
    psy: "Full-on psytrance",
    prog: "Psy progressif",
    trance: "Uplifting trance",
    hardtechno: "Hard techno",
    tribe: "Tribe psychédélique",
    hardtek: "Hardtek",
    frenchcore: "Frenchcore",
    industek: "Hardtek industriel"
  };

  var TIE_ORDER = ["psy", "tribe", "hardtek", "frenchcore", "hardtechno", "prog", "trance", "industek"];

  var LANE_SOUND = {
    psy: {
      kick: "punchy psytrance kick",
      bass: "rolling psy bassline",
      lead: "wide psychedelic lead",
      extras: ["tight offbeat hats", "wide club mix"],
      backups: ["minor key tension", "driving percussion"]
    },
    prog: {
      kick: "groovy progressive kick",
      bass: "deep rolling bass",
      lead: "hypnotic arpeggio",
      extras: ["spacious mix", "soft percussion"],
      backups: ["analog sequence", "long reverb tail"]
    },
    trance: {
      kick: "clean trance kick",
      bass: "sidechained trance bass",
      lead: "supersaw chord stack",
      extras: ["pluck arpeggio", "wide clean mix"],
      backups: ["uplifting riser", "bright open hats"]
    },
    hardtechno: {
      kick: "industrial hard-techno kick",
      bass: "distorted techno bass",
      lead: "dark industrial stab",
      extras: ["tight rave hats", "dry warehouse mix"],
      backups: ["looped techno riff", "short room reverb"]
    },
    tribe: {
      kick: "bouncy distorted kick",
      bass: "rolling tribe bass",
      lead: "psychedelic tribe lead",
      extras: ["tribal hand drums", "fast rave mix"],
      backups: ["didgeridoo texture", "offbeat percussion"]
    },
    hardtek: {
      kick: "distorted hardtek kick",
      bass: "saturated bass tail",
      lead: "dark synth stab",
      extras: ["fast rattling hats", "raw warehouse mix"],
      backups: ["short noise sweep", "relentless drum fill"]
    },
    frenchcore: {
      kick: "heavily distorted kick",
      bass: "massive bass tail",
      lead: "hardcore synth stab",
      extras: ["fast rattling hats", "in-your-face mix"],
      backups: ["short synth hit", "dense drum bus"]
    },
    industek: {
      kick: "industrial hard-techno kick",
      bass: "gritty rolling bass",
      lead: "dark industrial stab",
      extras: ["fast rattling hats", "dry warehouse mix"],
      backups: ["metallic percussion", "short room reverb"]
    }
  };

  var TITLES = {
    psy: ["Sève noire", "Rite clair", "Liane", "Orbite basse", "Canopée", "Nerf solaire", "Danse minérale", "Feu lent"],
    prog: ["Profondeur", "Marée lente", "Sable noir", "Chambre d'écho", "Seuil calme", "Arc lent", "Nappe", "Orbite creuse"],
    trance: ["Grand ciel", "Lumière haute", "Plus haut", "Aube artificielle", "Ligne claire", "Champ large", "Après la nuit", "Tenir"],
    hardtechno: ["Hangar", "Béton chaud", "Mâchoire", "Usine ouverte", "Frappe sèche", "Rail", "Cave 3", "Tôle"],
    tribe: ["Ronde de feu", "Peau et kick", "Forêt vite", "Sillon", "Nuit claire", "Bois tonnerre", "Cercle ouvert", "Piste rouge"],
    hardtek: ["Kick cru", "Nuit serrée", "Dent dure", "Sans toit", "Ligne brisée", "Carré noir", "Vitesse sèche", "Plein phare"],
    frenchcore: ["Plein régime", "Denture", "Trop vite", "Moteur", "Choc franc", "Rampe", "Brûle clair", "Dernier mur"],
    industek: ["Tôle vive", "Rail noir", "Suie", "Frappe", "Cave rapide", "Sirène basse", "Zone", "Métal mou"]
  };

  var FR_SUNG = [
    {
      verse: ["On court plus vite cette nuit", "Le sol s'efface sous la pluie", "On ne regarde plus en arrière", "La basse nous tient par la lumière"],
      pre: ["Plus haut", "Encore"],
      chorus: ["On reste éveillés", "Le monde est tombé", "On reste éveillés", "Rien n'est fermé"],
      whisper: "reste là",
      bridge: ["Un dernier souffle", "Et le jour attend"]
    },
    {
      verse: ["Les murs tombent sans faire de bruit", "On avance au milieu de la nuit", "Chaque lampe devient un signal", "On suit la ligne jusqu'au final"],
      pre: ["Tiens bon", "Regarde"],
      chorus: ["On lève les bras", "On oublie le froid", "On lève les bras", "La nuit est à nous"],
      whisper: "tout bas",
      bridge: ["Le silence dure une mesure", "Puis tout repart"]
    },
    {
      verse: ["On a laissé le jour derrière", "Le beat remplace la poussière", "Nos voix se mêlent au moteur", "On roule encore, on roule ailleurs"],
      pre: ["Ce soir", "Plus clair"],
      chorus: ["Lumière après lumière", "On traverse le ciel", "Lumière après lumière", "On ne tombe pas"],
      whisper: "reste près",
      bridge: ["Si le sol se dérobe", "On danse quand même"]
    }
  ];

  var EN_SUNG = [
    {
      verse: ["We run faster than the night", "The floor dissolves under the light", "We don't look back at the ground", "The bass is pulling us around"],
      pre: ["Higher", "Hold on"],
      chorus: ["We stay wide awake", "The world falls away", "We stay wide awake", "Until the day"],
      whisper: "stay here",
      bridge: ["One quiet measure", "Then the sky returns"]
    },
    {
      verse: ["The lights are turning overhead", "We forget every word we said", "The kick is writing a new law", "We follow it and we don't stall"],
      pre: ["Right now", "Don't fall"],
      chorus: ["Hands up in the bright", "We burn through the night", "Hands up in the bright", "We hold the line"],
      whisper: "stay close",
      bridge: ["The room goes thin", "We start again"]
    },
    {
      verse: ["We left the morning at the door", "The speakers ask for more and more", "Every color starts to climb", "We keep the rhythm one more time"],
      pre: ["Again", "With me"],
      chorus: ["Light after light", "We cross the sky", "Light after light", "We don't drop"],
      whisper: "breathe",
      bridge: ["If the ground lets go", "We move anyway"]
    }
  ];

  var FR_CHANT = [
    ["le feu tourne", "le feu tourne"],
    ["on tient la nuit", "on tient la nuit"],
    ["sol et ciel", "sol et ciel"],
    ["plus près du son", "plus près du son"]
  ];

  var EN_CHANT = [
    ["the fire turns", "the fire turns"],
    ["we hold the night", "we hold the night"],
    ["ground and sky", "ground and sky"],
    ["closer to the sound", "closer to the sound"]
  ];

  var FR_MC = [
    ["plus fort", "on lâche rien"],
    ["encore", "tout le hangar"],
    ["la nuit", "est à nous"],
    ["sens le kick", "sens le sol"],
    ["on reste", "jusqu'au jour"]
  ];

  var EN_MC = [
    ["louder", "don't stop"],
    ["again", "whole warehouse"],
    ["all night", "it's ours"],
    ["feel the kick", "feel the floor"],
    ["we stay", "until daylight"]
  ];

  var FR_WHISPER = [
    ["reste près", "tout bas"],
    ["écoute", "le sol"],
    ["pas un mot", "juste le kick"]
  ];

  var EN_WHISPER = [
    ["stay close", "down low"],
    ["listen", "to the floor"],
    ["quiet now", "only the kick"]
  ];

  var BANNED = [
    "hilight", "vini vici", "\\bvini\\b", "\\bvici\\b", "marsai", "ventura", "astrix",
    "perceval", "basswell", "billx", "lebask", "le bask", "kloxn", "\\barmin\\b",
    "buuren", "technical hitch", "p'tite fum", "ptite fum", "la p'tite"
  ];

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(list, rng) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function unique(list) {
    var out = [];
    var seen = {};
    for (var i = 0; i < list.length; i++) {
      var item = String(list[i] || "").replace(/\s+/g, " ").trim();
      if (!item) continue;
      var key = item.toLowerCase();
      if (seen[key]) continue;
      seen[key] = true;
      out.push(item);
    }
    return out;
  }

  function selectedArtists(state) {
    var on = state.artists || {};
    return DATA.artists.filter(function (artist) {
      return !!on[artist.id];
    });
  }

  function scoresOf(state) {
    var s = {
      psy: 0, prog: 0, trance: 0, hardtechno: 0,
      tribe: 0, hardtek: 0, frenchcore: 0
    };
    var g = state.genres || {};
    s.psy += (g.psy || 0) * 4;
    s.hardtek += (g.hardtek || 0) * 4;
    s.frenchcore += (g.hardcore || 0) * 4;
    s.hardtek += (g.hardcore || 0) * 2;
    s.hardtechno += (g.hardtechno || 0) * 4;
    s.tribe += (state.tribal || 0) / 25;
    s.prog += (state.melodic || 0) / 40;

    selectedArtists(state).forEach(function (artist) {
      s[artist.family] += 3;
      (artist.also || []).forEach(function (extra) {
        s[extra] += 1.5;
      });
    });

    if (s.prog < 3 && s.trance >= 3) s.prog = 0;
    if (s.prog > 0 && s.prog < 3 && (s.hardtek >= 8 || s.frenchcore >= 8) && (state.melodic || 0) < 55) {
      s.prog = 0;
    }
    return s;
  }

  function rank(scores) {
    return Object.keys(scores)
      .map(function (name) { return [name, scores[name]]; })
      .filter(function (row) { return row[1] > 0.9; })
      .sort(function (a, b) {
        if (b[1] !== a[1]) return b[1] - a[1];
        return TIE_ORDER.indexOf(a[0]) - TIE_ORDER.indexOf(b[0]);
      });
  }

  function namesInFamily(state, family) {
    return selectedArtists(state)
      .filter(function (artist) { return artist.family === family; })
      .map(function (artist) { return artist.name; });
  }

  function bridge(a, b, state) {
    var key = [a, b].sort().join("+");
    var table = {
      "hardtek+psy": "tribe",
      "frenchcore+psy": "tribe",
      "psy+tribe": "tribe",
      "hardtek+tribe": "tribe",
      "frenchcore+tribe": "hardtek",
      "hardtechno+psy": (state.tribal || 0) >= 45 ? "tribe" : "hardtechno",
      "hardtechno+tribe": "industek",
      "hardtechno+hardtek": "industek",
      "frenchcore+hardtechno": "industek",
      "prog+psy": "prog",
      "psy+trance": "prog",
      "prog+trance": "trance",
      "prog+tribe": "tribe",
      "hardtek+prog": "tribe",
      "frenchcore+prog": "hardtek",
      "hardtechno+prog": "hardtechno",
      "hardtechno+trance": "hardtechno",
      "hardtek+trance": "hardtek",
      "frenchcore+trance": "hardtek",
      "trance+tribe": "prog",
      "frenchcore+hardtek": "frenchcore"
    };
    return table[key] || null;
  }

  function sibling(lane, state) {
    switch (lane) {
      case "psy": return (state.melodic || 0) >= 55 ? "prog" : "tribe";
      case "prog": return "psy";
      case "trance": return "prog";
      case "hardtechno": return "industek";
      case "industek": return "hardtek";
      case "tribe": return (state.energy || 0) >= 62 ? "hardtek" : "psy";
      case "hardtek": return (state.tribal || 0) >= 55 ? "tribe" : "frenchcore";
      case "frenchcore": return "hardtek";
      default: return "psy";
    }
  }

  function planVariant(state, variant) {
    var scores = scoresOf(state);
    var ranked = rank(scores);
    var night = variant === "nuit";
    var darkBoost = night ? 48 : 0;
    var acidBoost = night ? 22 : 0;

    if (!ranked.length) {
      return {
        lane: "psy",
        darkBoost: darkBoost,
        acidBoost: acidBoost,
        mark: night ? "night" : "pure",
        reason: "Aucun genre ni référence : full-on psytrance par défaut."
      };
    }

    var topName = ranked[0][0];
    var topScore = ranked[0][1];
    var second = ranked[1];
    var tie = !!(second && topScore - second[1] <= 0.75);
    var outsider = null;
    var outsiderScore = 0;
    selectedArtists(state).forEach(function (artist) {
      if (artist.family === topName) return;
      var sc = scores[artist.family] || 0;
      if (sc > outsiderScore) {
        outsiderScore = sc;
        outsider = artist.family;
      }
    });

    if (variant === "net" && tie) {
      var tiedLane = bridge(topName, second[0], state) || topName;
      return {
        lane: tiedLane,
        darkBoost: 0,
        acidBoost: 0,
        mark: "bridge",
        reason: "Égalité entre " + LANE_FR[topName] + " et " + LANE_FR[second[0]] + ". Cette carte prend " + LANE_FR[tiedLane] + " : un tempo de rencontre, pas la moyenne des deux BPM."
      };
    }

    if (variant === "fusion" && tie) {
      return {
        lane: second[0],
        darkBoost: 0,
        acidBoost: 0,
        mark: "pure",
        reason: "L'autre famille à égalité, " + LANE_FR[second[0]] + ", gardée sur son propre tempo."
      };
    }

    if (variant === "nuit" && tie) {
      return {
        lane: topName,
        darkBoost: darkBoost,
        acidBoost: acidBoost,
        mark: "night",
        reason: "Version nuit de " + LANE_FR[topName] + ". Les deux autres cartes couvrent le croisement et l'autre famille."
      };
    }

    if (variant === "fusion" && outsider) {
      var toward = bridge(topName, outsider, state) || outsider;
      if (toward === topName) toward = outsider;
      var who = namesInFamily(state, outsider);
      var whoTxt = who.length ? who.join(", ") : LANE_FR[outsider];
      return {
        lane: toward,
        darkBoost: 0,
        acidBoost: 0,
        mark: toward === topName ? "pure" : "bridge",
        reason: whoTxt + " ne rentre pas dans la piste principale. Carte à part : " + LANE_FR[toward] + "."
      };
    }

    if (variant === "fusion" && second && second[1] >= topScore * 0.4) {
      var mixed = bridge(topName, second[0], state) || sibling(topName, state);
      if (mixed === topName) mixed = sibling(topName, state);
      return {
        lane: mixed,
        darkBoost: 0,
        acidBoost: 0,
        mark: "bridge",
        reason: "Second courant assez fort (" + LANE_FR[second[0]] + "). Croisement tenu en " + LANE_FR[mixed] + "."
      };
    }

    if (variant === "fusion") {
      var near = sibling(topName, state);
      return {
        lane: near,
        darkBoost: 0,
        acidBoost: 0,
        mark: "sibling",
        reason: "Variation voisine, " + LANE_FR[near] + ", pour ne pas répéter la même piste."
      };
    }

    return {
      lane: topName,
      darkBoost: darkBoost,
      acidBoost: acidBoost,
      mark: night ? "night" : "pure",
      reason: night
        ? "Même zone que la piste principale, poussée vers le sombre et l'acide. Le tempo reste dans la famille."
        : "Direction principale : " + LANE_FR[topName] + "."
    };
  }

  function kickerOf(plan) {
    var base = LANE_FR[plan.lane] || plan.lane;
    if (plan.mark === "night") return base + " · nuit";
    if (plan.mark === "bridge") return base + " · croisement";
    if (plan.mark === "sibling") return base + " · variation";
    return base;
  }

  function boostState(state, plan) {
    return {
      genres: state.genres,
      artists: state.artists,
      acid: clamp((state.acid || 0) + (plan.acidBoost || 0), 0, 100),
      dark: clamp((state.dark || 0) + (plan.darkBoost || 0), 0, 100),
      tribal: state.tribal || 0,
      melodic: state.melodic || 0,
      energy: state.energy || 0,
      vocal: state.vocal || "instrumental",
      voiceGender: state.voiceGender || "femme",
      sungLang: state.sungLang || "fr",
      theme: state.theme || "",
      key: state.key || "auto",
      bpmAuto: state.bpmAuto !== false,
      bpm: state.bpm || 146,
      length: state.length || "standard",
      lexicon: state.lexicon || "scene",
      seed: state.seed || 1,
      demands: state.demands || "",
      intro: state.intro || "vary",
      phrase: state.phrase || "sec",
      ownLyrics: state.ownLyrics || ""
    };
  }

  function genrePair(lane, s) {
    var acid = s.acid >= 64;
    var dark = s.dark >= 58;
    var melodic = s.melodic >= 58;
    var tribal = s.tribal >= 58;
    switch (lane) {
      case "psy":
        if (acid) return ["acid psytrance", "full-on psytrance"];
        if (dark && tribal) return ["dark tribal psytrance", "full-on psytrance"];
        if (tribal) return ["tribal psytrance", "full-on psytrance"];
        if (dark) return ["dark full-on psytrance", "rolling psytrance"];
        if (melodic) return ["melodic full-on psytrance", "festival psytrance"];
        return ["full-on psytrance", "rolling psytrance"];
      case "prog":
        if (acid) return ["acid trance", "progressive psytrance"];
        if (dark) return ["dark progressive psytrance", "hypnotic trance"];
        return ["progressive psytrance", "hypnotic trance"];
      case "trance":
        if (acid) return ["acid trance", "uplifting trance"];
        return ["uplifting trance", "euphoric trance"];
      case "hardtechno":
        if (acid) return ["acid techno", "industrial hard techno"];
        if (dark) return ["industrial hard techno", "rave techno"];
        return ["hard techno", "industrial rave"];
      case "tribe":
        if (acid && dark) return ["dark acid tribe", "fast psytrance"];
        if (acid) return ["acid tribe", "fast psytrance"];
        if (dark) return ["dark psychedelic tribe", "fast psytrance"];
        return ["psychedelic tribe", "fast psytrance"];
      case "hardtek":
        if (acid && dark) return ["dark acid hardtek", "fast hardcore techno"];
        if (acid) return ["acid hardtek", "fast hardcore techno"];
        if (dark) return ["mental hardtek", "fast hardcore techno"];
        if (melodic) return ["melodic hardtek", "fast hardcore techno"];
        return ["hardtek", "fast hardcore techno"];
      case "frenchcore":
        if (acid && dark) return ["dark acid frenchcore", "fast hardcore techno"];
        if (acid) return ["acid frenchcore", "fast hardcore techno"];
        if (dark && melodic) return ["dark frenchcore", "fast hardcore techno"];
        if (melodic) return ["melodic frenchcore", "fast hardcore techno"];
        if (dark) return ["dark frenchcore", "fast hardcore techno"];
        return ["frenchcore", "fast hardcore techno"];
      case "industek":
        if (acid) return ["industrial acid techno", "fast hard techno"];
        return ["industrial hardtek", "fast hard techno"];
      default:
        return ["psytrance", "electronic dance"];
    }
  }

  function orderGenres(pair, lexicon) {
    var scene = pair[0];
    var model = pair[1];
    if (!model || scene.toLowerCase() === model.toLowerCase()) return [scene];
    if (lexicon === "model") return [model, scene];
    return [scene, model];
  }

  function moodFor(lane, s) {
    var dark = s.dark >= 58;
    var melodic = s.melodic >= 58;
    var tribal = s.tribal >= 58;
    if (lane === "trance") return dark ? "dramatic and hopeful" : "euphoric and luminous";
    if (lane === "prog") return dark ? "deep and hypnotic" : "deep and groovy";
    if (lane === "psy") {
      if (tribal && dark) return "ceremonial and ominous";
      if (tribal) return "ceremonial and hypnotic";
      if (dark) return "ominous and driving";
      if (melodic) return "festive and intense";
      return "hypnotic and driving";
    }
    if (lane === "tribe") {
      if (dark) return "wild and nocturnal";
      if (melodic) return "festive and hypnotic";
      return "raw and ceremonial";
    }
    if (lane === "hardtechno" || lane === "industek") {
      return dark ? "brutal and hypnotic" : "relentless and physical";
    }
    if (dark && melodic) return "fierce and festive";
    if (dark) return "raw and aggressive";
    if (melodic) return "festive and aggressive";
    return "relentless and raw";
  }

  var INTROS = [
    {
      id: "didge",
      style: "didgeridoo drone ceremonial intro",
      lyric: "[Intro: didgeridoo drone only, tribal hand percussion building slowly, no kick]",
      avoid: "rolling bass intro"
    },
    {
      id: "acid",
      style: "filtered acid line solo intro",
      lyric: "[Intro: filtered TB-303 acid line alone, dark atmosphere, no drums]",
      avoid: "rolling bass intro"
    },
    {
      id: "hats",
      style: "ceremonial rattling hats intro",
      lyric: "[Intro: ceremonial didgeridoo and rattling hats only, rising tension, no kick until the drop]",
      avoid: "rolling bass intro"
    },
    {
      id: "drone",
      style: "low ritual drone sparse percussion",
      lyric: "[Intro: low ritual drone, sparse tribal percussion, sudden hard entry]",
      avoid: "rolling bass intro"
    },
    {
      id: "perc",
      style: "ceremonial percussion only intro",
      lyric: "[Intro: ceremonial percussion only, no bass]",
      avoid: "synth pad intro"
    },
    {
      id: "sudden",
      style: "sudden hard ritual entry",
      lyric: "[Intro: short silence then sudden hard entry, no long filter rise]",
      avoid: "long filter rise"
    }
  ];

  function pickIntro(state, variant) {
    var mode = state.intro || "vary";
    if (mode === "off") return null;
    if (mode !== "vary") {
      for (var i = 0; i < INTROS.length; i++) {
        if (INTROS[i].id === mode) return INTROS[i];
      }
    }
    var shift = variant === "fusion" ? 1 : variant === "nuit" ? 2 : 0;
    return INTROS[(Math.abs(state.seed || 1) + shift) % INTROS.length];
  }

  function vocalTag(vocal, gender, phrase) {
    var female = gender !== "homme";
    var dry = phrase === "sec" || phrase === "crie";
    var shout = phrase === "crie";
    switch (vocal) {
      case "chops":
        return dry ? "dry rhythmic vocal chops" : "rhythmic vocal chops";
      case "chant":
        return shout ? "raw speech-like group shout" : dry ? "dry ritual group shout" : "ritual group chant";
      case "mc":
        if (shout) return female ? "aggressive speech-like female MC" : "aggressive speech-like male MC";
        if (dry) return female ? "dry shouted female MC straight tone" : "dry shouted male MC straight tone";
        return female ? "shouted female MC" : "shouted male MC";
      case "whisper":
        if (dry) return female ? "dry whispered female vocal straight tone" : "dry whispered male vocal straight tone";
        return female ? "close whispered female vocal" : "close whispered male vocal";
      case "trance":
        if (dry) return female ? "straight-tone female lead vocal" : "straight-tone male lead vocal";
        return female ? "anthemic female lead vocal" : "anthemic male lead vocal";
      default:
        return "instrumental";
    }
  }

  function traitOk(trait, state, lane) {
    if (trait.lanes && trait.lanes.indexOf(lane) === -1) return false;
    if (trait.minAcid != null && state.acid < trait.minAcid) return false;
    if (trait.minDark != null && state.dark < trait.minDark) return false;
    if (trait.minTribal != null && state.tribal < trait.minTribal) return false;
    if (trait.minMelodic != null && state.melodic < trait.minMelodic) return false;
    if (trait.maxDark != null && state.dark > trait.maxDark) return false;
    return true;
  }

  function buildInstruments(lane, state, rng) {
    var spec = LANE_SOUND[lane];
    var kick = spec.kick;
    var bass = spec.bass;
    var lead = spec.lead;
    var kickSet = false;
    var bassSet = false;
    var leadSet = false;
    var colors = [];
    var pool = [];

    selectedArtists(state).forEach(function (artist) {
      (artist.traits || []).forEach(function (trait) {
        if (traitOk(trait, state, lane)) pool.push(trait);
      });
    });
    pool = shuffle(pool, rng);

    pool.forEach(function (trait) {
      if (trait.slot === "kick" && !kickSet) {
        kick = trait.tag;
        kickSet = true;
      } else if (trait.slot === "bass" && !bassSet) {
        bass = trait.tag;
        bassSet = true;
      } else if (trait.slot === "lead" && !leadSet) {
        lead = trait.tag;
        leadSet = true;
      } else if (trait.slot === "color" && colors.length < 2) {
        colors.push(trait.tag);
      }
    });

    var acidTags = [];
    var allowAcid = !(lane === "trance" && state.acid < 64);
    if (allowAcid && state.acid >= 38) acidTags.push("resonant TB-303 squelch");
    if (allowAcid && state.acid >= 85) acidTags.push("filter cutoff movement");

    var list = [kick, bass, lead].concat(acidTags);
    if (state.key && state.key !== "auto") list.push(state.key);
    colors.forEach(function (tag) { list.push(tag); });
    spec.extras.forEach(function (tag) { list.push(tag); });

    list = unique(list).slice(0, 7);
    var backupIndex = 0;
    while (list.length < 5 && backupIndex < spec.backups.length) {
      list = unique(list.concat([spec.backups[backupIndex]]));
      backupIndex += 1;
    }
    return list.slice(0, 7);
  }

  function relatedArtists(state, lane) {
    return selectedArtists(state).filter(function (artist) {
      return artist.family === lane || (artist.also || []).indexOf(lane) !== -1;
    });
  }

  function resolveBpm(state, lane, variant, rng) {
    var range = LANES[lane].bpm;
    if (!state.bpmAuto) {
      return {
        bpm: clamp(Math.round(state.bpm || 146), 120, 210),
        forced: true,
        range: range
      };
    }
    var center;
    var related = relatedArtists(state, lane);
    if (related.length) {
      var sum = 0;
      related.forEach(function (artist) {
        sum += (artist.bpm[0] + artist.bpm[1]) / 2;
      });
      center = sum / related.length;
    } else {
      center = (range[0] + range[1]) / 2;
    }
    center = clamp(center, range[0], range[1]);
    var bpm = center;
    if (variant === "nuit") bpm += 2;
    if ((state.energy || 0) >= 78) bpm += 1;
    if ((state.energy || 0) <= 30) bpm -= 1;
    bpm += Math.round(rng() * 2) - 1;
    bpm = clamp(Math.round(bpm), range[0], range[1]);
    return { bpm: bpm, forced: false, range: range };
  }

  function excludesFor(lane, vocal, phrase, intro) {
    var base;
    if (vocal === "instrumental") {
      if (lane === "trance" || lane === "prog") base = ["vocals", "singing", "rap", "distorted gabber kick"];
      else if (lane === "hardtechno") base = ["vocals", "singing", "acoustic guitar", "trance supersaw"];
      else if (lane === "hardtek" || lane === "frenchcore" || lane === "industek") base = ["vocals", "singing", "acoustic guitar", "trap hi-hats"];
      else base = ["vocals", "singing", "trap hi-hats", "dubstep growl"];
    } else if (vocal === "mc") base = ["melodic singing", "choir", "acoustic guitar", "lo-fi"];
    else if (vocal === "chant") base = ["rap", "speech", "acoustic guitar", "trap hi-hats"];
    else if (vocal === "whisper") base = ["shouting", "rap", "distorted gabber kick", "trap hi-hats"];
    else if (vocal === "chops") base = ["rap", "spoken word", "acoustic guitar", "trap hi-hats"];
    else base = ["rap", "screaming", "distorted gabber kick", "lo-fi"];

    var dry = phrase === "sec" || phrase === "crie";
    if (dry && vocal === "trance") {
      base = ["vibrato", "emotional delivery", "humming", "rap"];
    } else if (dry && vocal === "whisper") {
      base = ["vibrato", "melodic singing", "shouting", "emotional delivery"];
    } else if (dry && vocal === "instrumental") {
      base = base.slice(0, 3).concat(["vibrato"]);
    } else if (dry) {
      base = ["vibrato", "melodic singing", "emotional delivery", "sustained notes", "humming"];
    }
    if (intro && intro.avoid) {
      base = [intro.avoid].concat(base.filter(function (item) {
        return item.toLowerCase() !== intro.avoid.toLowerCase();
      }));
    }
    return unique(base).slice(0, 5);
  }

  function safeTheme(raw) {
    return String(raw || "")
      .replace(/[\[\]\(\)\{\}<>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 42);
  }

  function themeLines(theme) {
    if (!theme || theme.length > 32) return null;
    var words = theme.split(" ").filter(Boolean);
    if (!words.length || words.length > 6) return null;
    if (theme.length <= 22) return [theme, theme];
    var mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }

  function joinBlock(lines) {
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  function instrumentalLyrics(extended) {
    var lines = ["[Instrumental]", "[Intro]", "[Build]", "[Drop]", "[Bridge]", "[Build]", "[Drop]"];
    if (extended) lines.push("[Bridge]", "[Build]", "[Drop]");
    lines.push("[Outro]");
    return joinBlock(lines);
  }

  function chopsLyrics(extended) {
    var hook = ["oh eh oh", "eh oh eh"];
    var lines = ["[Intro]", "[Build]", "[Drop]"].concat(hook).concat(["", "[Bridge]", "[Build]", "[Drop]"]).concat(hook);
    if (extended) lines = lines.concat(["", "[Bridge]", "[Build]", "[Drop]"]).concat(hook);
    lines.push("", "[Outro]");
    return joinBlock(lines);
  }

  function chantLyrics(lang, theme, extended, rng) {
    var bank = lang === "en" ? EN_CHANT : FR_CHANT;
    var seedLine = themeLines(theme);
    var pair = seedLine || bank[Math.floor(rng() * bank.length)];
    var lines = ["[Intro]", "[Build]", "[Drop]", "[Choir]"].concat(pair);
    lines = lines.concat(["", "[Bridge]", "[Whispered]", lang === "en" ? "down low" : "tout bas"]);
    lines = lines.concat(["", "[Build]", "[Drop]", "[Harmony]"]).concat(pair);
    if (extended) lines = lines.concat(["", "[Bridge]", "[Build]", "[Drop]", "[Choir]"]).concat(pair);
    lines.push("", "[Outro]");
    return joinBlock(lines);
  }

  function mcLyrics(lang, theme, extended, rng) {
    var bank = (lang === "en" ? EN_MC : FR_MC).slice();
    bank = shuffle(bank, rng);
    var themed = themeLines(theme);
    var first = themed || bank[0];
    var second = bank[1] || bank[0];
    var third = bank[2] || bank[0];
    var lines = ["[Intro]", "[Build]", "[Drop]", "[Spoken]"].concat(first);
    lines = lines.concat(["", "[Bridge]", "[Build]", "[Drop]", "[Spoken]"]).concat(second);
    if (extended) lines = lines.concat(["", "[Bridge]", "[Build]", "[Drop]", "[Spoken]"]).concat(third);
    lines.push("", "[Outro]");
    return joinBlock(lines);
  }

  function whisperLyrics(lang, theme, extended, rng) {
    var bank = (lang === "en" ? EN_WHISPER : FR_WHISPER).slice();
    var pair = themeLines(theme) || bank[Math.floor(rng() * bank.length)];
    var lines = ["[Intro]", "[Whispered]"].concat(pair);
    lines = lines.concat(["", "[Build]", "[Drop]", "[Bridge]", "[Whispered]"]).concat(pair);
    lines = lines.concat(["", "[Build]", "[Drop]"]);
    if (extended) lines = lines.concat(["", "[Bridge]", "[Whispered]"]).concat(pair).concat(["", "[Drop]"]);
    lines.push("[Outro]");
    return joinBlock(lines);
  }

  function sungLyrics(lang, theme, extended, rng) {
    var sets = lang === "en" ? EN_SUNG : FR_SUNG;
    var set = sets[Math.floor(rng() * sets.length)];
    var pre = themeLines(theme) || set.pre;
    var lines = ["[Intro]", "", "[Verse]"].concat(set.verse);
    lines = lines.concat(["", "[Pre-Chorus]"]).concat(pre);
    lines = lines.concat(["", "[Chorus]", "[Belted]"]).concat(set.chorus);
    lines = lines.concat(["", "[Bridge]", "[Whispered]", set.whisper]);
    lines = lines.concat(["", "[Chorus]", "[Belted]"]).concat(set.chorus);
    if (extended) {
      lines = lines.concat(["", "[Bridge]"]).concat(set.bridge);
      lines = lines.concat(["", "[Chorus]", "[Harmony]"]).concat(set.chorus);
    }
    lines.push("", "[Outro]");
    return joinBlock(lines);
  }

  function makeLyrics(state, rng) {
    var vocal = state.vocal || "instrumental";
    var lang = state.sungLang === "en" ? "en" : "fr";
    var theme = safeTheme(state.theme);
    var extended = state.length === "extended";
    if (vocal === "instrumental") return instrumentalLyrics(extended);
    if (vocal === "chops") return chopsLyrics(extended);
    if (vocal === "chant") return chantLyrics(lang, theme, extended, rng);
    if (vocal === "mc") return mcLyrics(lang, theme, extended, rng);
    if (vocal === "whisper") return whisperLyrics(lang, theme, extended, rng);
    return sungLyrics(lang, theme, extended, rng);
  }

  function applyIntroLyric(lyrics, intro) {
    if (!intro || !intro.lyric) return lyrics;
    return lyrics.replace("[Intro]", intro.lyric);
  }

  function applyPhraseLyric(lyrics, vocal, phrase) {
    if (phrase !== "sec" && phrase !== "crie") return lyrics;
    var text = lyrics;
    if (vocal === "mc") {
      var spoken = phrase === "crie"
        ? "[Shouted: dry aggressive, no vibrato]"
        : "[Spoken: dry aggressive MC, no vibrato]";
      text = text.replace(/\[Spoken\]/g, spoken);
    } else if (vocal === "whisper") {
      text = text.replace(/\[Whispered\]/g, "[Whispered: dry straight tone, no vibrato]");
    } else if (vocal === "chant") {
      text = text.replace(/\[Choir\]/g, "[Shouted: dry group, straight tone]");
      text = text.replace(/\[Harmony\]/g, "[Shouted: dry group, straight tone]");
    } else if (vocal === "trance") {
      text = text.replace(/\[Belted\]/g, "[Belted: straight tone, no vibrato]");
    }
    return text;
  }

  function weaveCues(lyrics, cues) {
    var text = lyrics;
    var anchors = [
      { name: "Drop" },
      { name: "Build" },
      { name: "Bridge", alt: "Longer bridge" },
      { name: "Chorus" },
      { name: "Intro" },
      { name: "Outro" }
    ];
    (cues || []).forEach(function (cue) {
      if (!cue || text.indexOf(cue) !== -1) return;
      var low = cue.toLowerCase();
      var placed = false;
      for (var i = 0; i < anchors.length; i++) {
        var anchor = anchors[i];
        var starts = low.indexOf("[" + anchor.name.toLowerCase()) === 0;
        var related = !starts && anchor.alt && low.indexOf("[" + anchor.alt.toLowerCase()) === 0;
        if (!starts && !related) continue;
        var re = new RegExp("\\[" + anchor.name + "(?::[^\\]]*)?\\]", "i");
        var found = text.match(re);
        if (!found) continue;
        var clockOnDetailed = starts && /^\[intro at /i.test(cue) && /^\[intro:/i.test(found[0]);
        text = (clockOnDetailed || related) ? text.replace(re, found[0] + "\n" + cue) : text.replace(re, cue);
        placed = true;
        break;
      }
      if (!placed && text.indexOf("[Outro]") !== -1) text = text.replace("[Outro]", cue + "\n[Outro]");
    });
    return text;
  }

  function makeTitle(lane, theme, rng) {
    var clean = safeTheme(theme);
    if (clean && clean.length <= 22 && clean.indexOf(".") === -1 && rng() < 0.45) {
      return clean.charAt(0).toUpperCase() + clean.slice(1);
    }
    var bank = TITLES[lane] || TITLES.psy;
    return bank[Math.floor(rng() * bank.length)];
  }

  function assemble(genres, mood, vocal, instruments, extras, bpm, introTag) {
    var head = [];
    if (introTag) head.push(introTag);
    head = head.concat(genres.slice(0, 2), [mood, vocal]);
    var body = [];
    (extras || []).concat(instruments).forEach(function (tag) {
      if (body.length >= 8) return;
      if (head.indexOf(tag) !== -1 || body.indexOf(tag) !== -1) return;
      body.push(tag);
    });
    var tags = unique(head.concat(body));
    if (tags.indexOf(vocal) === -1) tags.splice(Math.min(tags.length, 3), 0, vocal);
    if (tags.length > 14) tags = tags.slice(0, 14);
    tags.push(bpm + " BPM");
    return tags;
  }

  function tagRoles(tags, genreCount, introCount) {
    var lead = introCount || 0;
    return tags.map(function (text, index) {
      var role = "inst";
      if (index < lead) role = "intro";
      else if (index < lead + genreCount) role = "genre";
      else if (index === lead + genreCount) role = "mood";
      else if (index === lead + genreCount + 1) role = "vocal";
      else if (index === tags.length - 1) role = "bpm";
      return { text: text, role: role };
    });
  }

  var DEMAND_BLOCK = /copi|plagi|m[eê]me m[eé]lod|reprend|cover|\bidentiqu|paroles du|à l'identique|a l'identique|sample le|clone/i;

  function clockOf(line) {
    var match = String(line).match(/(\d{1,2})\s*[:h]\s*(\d{2})/);
    if (!match) return "";
    var min = Math.min(14, Number(match[1]));
    var sec = Math.min(59, Number(match[2]));
    return (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function cueFromLine(line) {
    var low = line.toLowerCase();
    var at = clockOf(line);
    var tail = at ? " at " + at : "";
    if (/drop/.test(low)) return "[Drop" + tail + "]";
    if (/build|mont[ée]e|montee/.test(low)) return "[Build" + tail + "]";
    if (/break|pont|bridge/.test(low)) {
      return (/\blong/.test(low) ? "[Longer bridge" : "[Bridge") + tail + "]";
    }
    if (/\bintro\b/.test(low)) return "[Intro" + tail + "]";
    if (/outro|finale/.test(low)) return "[Outro" + tail + "]";
    if (/refrain|chorus/.test(low)) return "[Chorus" + tail + "]";
    if (at) return "[Section at " + at + "]";
    return "";
  }

  function sonicFromLine(line) {
    var low = line.toLowerCase();
    var bpm = low.match(/(\d{2,3})\s*bpm/);
    if (bpm) {
      return { patch: { bpm: clamp(Number(bpm[1]), 120, 210), bpmAuto: false } };
    }
    if (/303|acide|acid/.test(low)) return { tag: "resonant TB-303 squelch" };
    if (/didgeridoo|didj|tribal/.test(low)) return { tag: "didgeridoo lead" };
    if (/sans voix|instrumental/.test(low)) return { patch: { vocal: "instrumental" } };
    if (/chuchot|whisper/.test(low)) return { patch: { vocal: "whisper" } };
    if (/\bmc\b|cri[ée]e?/.test(low)) return { patch: { vocal: "mc" } };
    return null;
  }

  function interpretDemands(raw) {
    var lines = String(raw || "").split(/\n+/).map(function (line) {
      return line.trim();
    }).filter(Boolean).slice(0, 8);
    var out = { cues: [], styleTags: [], patches: {}, blocked: [], hints: [] };
    lines.forEach(function (original) {
      var line = original;
      if (containsBanned(line)) {
        out.blocked.push(original);
        out.hints.push("Nom d'artiste retiré : il ne part pas dans le prompt.");
        return;
      }
      if (DEMAND_BLOCK.test(line)) {
        out.blocked.push(original);
        out.hints.push("Demande de copie refusée. On garde le tempo, l'énergie et la tonalité, pas la mélodie.");
        return;
      }
      var cue = cueFromLine(line);
      var sonic = sonicFromLine(line);
      if (cue) out.cues.push(cue);
      if (sonic) {
        if (sonic.tag) out.styleTags.push(sonic.tag);
        if (sonic.patch) {
          Object.keys(sonic.patch).forEach(function (key) {
            out.patches[key] = sonic.patch[key];
          });
        }
      }
      if (cue || sonic) return;
      var clean = line.replace(/[\[\]\(\),]/g, " ").replace(/\s+/g, " ").trim().slice(0, 48);
      if (clean) out.cues.push("[Direction: " + clean + "]");
    });
    if (out.cues.some(function (cue) { return /at \d/.test(cue); })) {
      out.hints.push("Suno ne suit pas une horloge. L'heure devient un repère dans les paroles, pas une seconde exacte.");
    }
    out.cues = unique(out.cues).slice(0, 4);
    out.styleTags = unique(out.styleTags).slice(0, 2);
    out.hints = unique(out.hints);
    return out;
  }

  function containsBanned(text) {
    var hay = String(text || "");
    for (var i = 0; i < BANNED.length; i++) {
      var re = new RegExp(BANNED[i], "i");
      if (re.test(hay)) return BANNED[i];
    }
    return "";
  }

  function hasSection(lyrics, name) {
    return new RegExp("\\[" + name + "(?:\\]|:|\\s)", "i").test(lyrics);
  }

  function selfCheck(result) {
    var problems = [];
    var tags = result.tags || [];
    if (tags.length < 8 || tags.length > 15) problems.push("Le style doit faire 8 à 15 tags, pas " + tags.length + ".");
    var last = tags[tags.length - 1] || "";
    if (!/^\d{2,3} BPM$/.test(last)) problems.push("Le dernier tag doit être le BPM.");
    if (result.style !== tags.join(", ")) problems.push("Le style ne correspond pas aux tags.");
    tags.forEach(function (tag) {
      if (tag.indexOf(",") !== -1) problems.push("Un tag contient une virgule : " + tag);
      if (/^\s*no\b/i.test(tag)) problems.push("Négation dans le style : " + tag);
    });
    var blob = [result.title, result.style, result.exclude, result.lyrics].join("\n");
    var hit = containsBanned(blob);
    if (hit) problems.push("Nom d'artiste détecté (" + hit + ").");
    if (/in the style of/i.test(blob)) problems.push("Formule « in the style of » interdite.");
    if ((result.style || "").length > 1000) problems.push("Style au-dessus de 1000 caractères.");
    var vocal = result.vocalTag;
    var lead = result.introCount || 0;
    if (tags.indexOf(vocal) !== result.genreCount + lead + 1) problems.push("La voix n'est pas à sa place dans la formule.");
    if (result.vocalMode === "instrumental") {
      if (vocal !== "instrumental") problems.push("Mode instrumental incohérent.");
      if (/\b(singing|choir|chant|mc)\b/i.test(result.style)) problems.push("Le style instrumental contient une voix.");
    }
    if (!result.bpmAuto) {
      /* manual tempo is a warning, handled elsewhere */
    } else if (result.bpm < result.range[0] || result.bpm > result.range[1]) {
      problems.push("BPM auto hors zone " + result.range[0] + "–" + result.range[1] + ".");
    }
    var lyrics = result.lyrics || "";
    if (!hasSection(lyrics, "Intro") || !hasSection(lyrics, "Outro")) problems.push("Les paroles doivent avoir [Intro] et [Outro].");
    if (/\[Breakdown\]/.test(lyrics)) problems.push("Utiliser [Bridge], pas [Breakdown].");
    if (!result.customLyrics && result.vocalMode === "trance") {
      ["Verse", "Pre-Chorus", "Chorus", "Bridge", "Belted"].forEach(function (name) {
        if (!hasSection(lyrics, name)) problems.push("Tag manquant : [" + name + "]");
      });
    } else if (!result.customLyrics && (!hasSection(lyrics, "Build") || !hasSection(lyrics, "Drop"))) {
      problems.push("Il manque [Build] ou [Drop].");
    }
    if (/[\(\)]/.test(lyrics)) problems.push("Parenthèses dans les paroles : Suno peut les chanter.");
    var excludeBits = (result.exclude || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    if (excludeBits.length < 2 || excludeBits.length > 5) problems.push("Exclude styles doit contenir 2 à 5 termes.");
    return problems;
  }

  var CUE_FILLER = { a: 1, de: 1, du: 1, des: 1, la: 1, le: 1, les: 1, en: 1, et: 1, au: 1, aux: 1, un: 1, une: 1, puis: 1, the: 1, and: 1, with: 1 };
  var CUE_LEX = {
    drop: { section: "Drop" },
    build: { section: "Build" },
    montee: { section: "Build" },
    silence: { section: "Break" },
    pause: { section: "Break" },
    break: { section: "Break" },
    instrumental: { section: "Instrumental" },
    intro: { section: "Intro" },
    outro: { section: "Outro" },
    fin: { section: "Outro" },
    refrain: { section: "Chorus" },
    chorus: { section: "Chorus" },
    couplet: { section: "Verse" },
    verse: { section: "Verse" },
    pont: { section: "Bridge" },
    bridge: { section: "Bridge" },
    femme: { gender: "female" },
    female: { gender: "female" },
    homme: { gender: "male" },
    male: { gender: "male" },
    lesdeux: { gender: "both" },
    duo: { gender: "both" },
    both: { gender: "both" },
    ensemble: { gender: "both" },
    chuchote: { delivery: "whisper" },
    chuchotement: { delivery: "whisper" },
    chuchoter: { delivery: "whisper" },
    whisper: { delivery: "whisper" },
    whispered: { delivery: "whisper" },
    hurle: { delivery: "shout" },
    hurlement: { delivery: "shout" },
    cri: { delivery: "shout" },
    crie: { delivery: "shout" },
    scream: { delivery: "shout" },
    shout: { delivery: "shout" },
    gueule: { delivery: "shout" },
    parle: { delivery: "spoken" },
    spoken: { delivery: "spoken" },
    chante: { delivery: "sung" },
    sing: { delivery: "sung" },
    belted: { delivery: "sung" },
    choeur: { delivery: "choir" },
    choir: { delivery: "choir" },
    harmonie: { delivery: "harmony" },
    harmony: { delivery: "harmony" },
    souffle: { tone: "breathy" },
    breathy: { tone: "breathy" },
    grave: { tone: "low" },
    aigu: { tone: "high" },
    radio: { tone: "radio" },
    megaphone: { tone: "megaphone" },
    vocodeur: { tone: "vocoder" },
    vocoder: { tone: "vocoder" },
    robot: { tone: "vocoder" },
    sec: { tone: "dry" },
    dry: { tone: "dry" }
  };

  function foldCue(text) {
    return String(text || "").toLowerCase()
      .replace(/[àâä]/g, "a")
      .replace(/[éèêë]/g, "e")
      .replace(/[ïî]/g, "i")
      .replace(/[ôö]/g, "o")
      .replace(/[ùûü]/g, "u")
      .replace(/ç/g, "c");
  }

  function readCue(line) {
    var clock = clockOf(line);
    var norm = foldCue(line)
      .replace(/[\[\]\(\)]/g, " ")
      .replace(/homme et femme|femme et homme/g, " lesdeux ")
      .replace(/les deux/g, " lesdeux ")
      .replace(/sans vibrato/g, " sec ");
    norm = norm.replace(/[^a-z0-9:h\s]/g, " ").replace(/\s+/g, " ").trim();
    if (!norm && !clock) return null;
    var tokens = norm ? norm.split(" ") : [];
    var known = 0;
    var unknown = 0;
    var cue = { clock: clock, gender: "", delivery: "", tones: [], section: "" };
    tokens.forEach(function (token) {
      if (CUE_FILLER[token] || /^\d{1,2}[:h]\d{2}$/.test(token)) return;
      var hit = CUE_LEX[token];
      if (!hit) {
        unknown += 1;
        return;
      }
      known += 1;
      if (hit.gender) cue.gender = hit.gender;
      if (hit.delivery) cue.delivery = hit.delivery;
      if (hit.tone && cue.tones.indexOf(hit.tone) === -1) cue.tones.push(hit.tone);
      if (hit.section) cue.section = hit.section;
    });
    if (!known || unknown) return null;
    return cue;
  }

  function lyricCue(voice) {
    var way = {
      whisper: "Whispered",
      shout: "Shouted",
      spoken: "Spoken",
      sung: "Belted",
      choir: "Choir",
      harmony: "Harmony"
    }[voice.delivery] || "";
    var who = voice.gender === "female" ? "female vocal" : voice.gender === "male" ? "male vocal" : voice.gender === "both" ? "male and female vocals" : "";
    var toneLabel = {
      dry: "dry straight tone, no vibrato",
      breathy: "breathy",
      low: "low voice",
      high: "high voice",
      radio: "radio filter",
      megaphone: "megaphone",
      vocoder: "vocoder"
    };
    var extra = [];
    (voice.tones || []).forEach(function (tone) {
      if (toneLabel[tone]) extra.push(toneLabel[tone]);
    });
    var head = "";
    if (way && who) head = way + " " + who;
    else if (way) head = way;
    else if (who) head = who.charAt(0).toUpperCase() + who.slice(1);
    if (!head && !extra.length) return "";
    if (!head) head = extra.shift();
    head = head.charAt(0).toUpperCase() + head.slice(1);
    return "[" + [head].concat(extra).join(", ") + "]";
  }

  function sectionTag(kind, clock) {
    var name = kind || "Break";
    if (clock) return "[" + name + " at " + clock + "]";
    return "[" + name + "]";
  }

  function cleanLyric(text) {
    return String(text || "").replace(/[\[\]\(\)\{\}<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, 140);
  }

  function styleFromVoices(seen, phrase) {
    if (!seen.words) return { vocalTag: "", vocalMode: "" };
    var dry = phrase === "sec" || phrase === "crie";
    var who = seen.male && seen.female ? "male and female vocals" : seen.female ? "female vocal" : seen.male ? "male vocal" : "vocal";
    var way = "";
    if (seen.ways.length === 1) {
      way = { whisper: "whispered", shout: "shouted", spoken: "spoken", sung: "sung", choir: "group", harmony: "layered" }[seen.ways[0]] || "";
    }
    var tag = ((dry ? "dry " : "") + (way ? way + " " : "") + who + (dry ? " straight tone" : "")).replace(/\s+/g, " ").trim();
    var mode = "mc";
    if (seen.ways.length === 1 && seen.ways[0] === "whisper") mode = "whisper";
    else if (seen.ways.length === 1 && seen.ways[0] === "sung") mode = "trance";
    else if (seen.ways.length === 1 && seen.ways[0] === "choir") mode = "chant";
    return { vocalTag: tag, vocalMode: mode };
  }

  function fitOwnLyrics(raw, state) {
    var source = String(raw || "").replace(/\r/g, "");
    var empty = { text: "", vocalTag: "", vocalMode: "", hints: [], blocked: [], preview: "" };
    if (!source.trim()) return empty;
    var phrase = (state && state.phrase) || "sec";
    var voice = { gender: "", delivery: "", tones: [] };
    if (state && state.vocal && state.vocal !== "instrumental" && state.vocal !== "chops") {
      voice.gender = state.voiceGender === "homme" ? "male" : "female";
    }
    if (state && state.vocal === "whisper") voice.delivery = "whisper";
    else if (state && state.vocal === "mc") voice.delivery = phrase === "crie" ? "shout" : "spoken";
    else if (state && state.vocal === "trance") voice.delivery = "sung";
    else if (state && state.vocal === "chant") voice.delivery = "choir";
    if (phrase === "sec" || phrase === "crie") voice.tones = ["dry"];
    var out = [];
    var lastCue = "";
    var seen = { words: false, male: false, female: false, ways: [] };
    var hints = [];
    var blocked = [];
    var sawSilence = false;
    var sawClock = false;

    function noteVoice(next) {
      if (next.gender === "both" || next.gender === "female") seen.female = true;
      if (next.gender === "both" || next.gender === "male") seen.male = true;
      if (next.delivery && seen.ways.indexOf(next.delivery) === -1) seen.ways.push(next.delivery);
    }

    function emitVoice() {
      noteVoice(voice);
      var cue = lyricCue(voice);
      if (!cue || cue === lastCue) return;
      out.push(cue);
      lastCue = cue;
    }

    function pushSection(tag) {
      if (out.length && out[out.length - 1] !== "") out.push("");
      out.push(tag);
      lastCue = "";
    }

    source.split("\n").slice(0, 80).forEach(function (original) {
      var line = original.trim();
      if (!line) return;
      if (containsBanned(line) || DEMAND_BLOCK.test(line)) {
        blocked.push(line);
        return;
      }
      var whole = readCue(line);
      if (whole) {
        if (whole.gender) voice.gender = whole.gender;
        if (whole.delivery) {
          voice.delivery = whole.delivery;
          if (!whole.tones.length) voice.tones = phrase === "sec" || phrase === "crie" ? ["dry"] : [];
        } else if (whole.tones.length) voice.delivery = "";
        if (whole.tones.length) voice.tones = whole.tones.slice();
        if (whole.section) {
          if (whole.section === "Break") sawSilence = true;
          if (whole.clock) sawClock = true;
          pushSection(sectionTag(whole.section, whole.clock));
        }
        noteVoice(voice);
        return;
      }
      var notes = [];
      var spoken = line.replace(/\(([^)]*)\)/g, function (_, inner) {
        notes.push(inner);
        return " ";
      });
      var local = { gender: voice.gender, delivery: voice.delivery, tones: (voice.tones || []).slice() };
      var extra = [];
      notes.forEach(function (note) {
        var cue = readCue(note);
        if (!cue) {
          var kept = cleanLyric(note);
          if (kept) extra.push(kept);
          return;
        }
        if (cue.gender) local.gender = cue.gender;
        if (cue.delivery) {
          local.delivery = cue.delivery;
          if (!cue.tones.length) local.tones = phrase === "sec" || phrase === "crie" ? ["dry"] : [];
        } else if (cue.tones.length) local.delivery = "";
        if (cue.tones.length) local.tones = cue.tones.slice();
        if (cue.section) pushSection(sectionTag(cue.section, cue.clock));
      });
      var text = cleanLyric([spoken].concat(extra).join(" "));
      if (!text) return;
      var saved = voice;
      var scoped = notes.length > 0;
      voice = local;
      emitVoice();
      out.push(text);
      seen.words = true;
      voice = saved;
      if (scoped) lastCue = "";
    });

    if (!out.length && !blocked.length) return empty;
    var text = out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    if (!hasSection(text, "Intro")) text = "[Intro]\n" + text;
    if (!hasSection(text, "Outro")) text = text.replace(/\s*$/, "") + "\n[Outro]";
    if (sawSilence) hints.push("Silence placé en [Break]. Suno ouvre un trou dans le rythme, pas un blanc parfait.");
    if (sawClock) hints.push("Suno ne suit pas une horloge. L'heure reste un repère.");
    if (seen.male && seen.female) hints.push("Homme et femme sont tous les deux écrits dans les paroles.");
    var styled = styleFromVoices(seen, phrase);
    if (seen.words && !styled.vocalTag) {
      styled.vocalTag = phrase === "sec" || phrase === "crie" ? "dry spoken vocal straight tone" : "spoken vocal";
      styled.vocalMode = "mc";
      hints.push("Pas de consigne de voix : parlé par défaut. Précise par exemple [femme, chuchoté].");
    }
    blocked.forEach(function (line) {
      hints.push("Ligne retirée : " + line);
    });
    return {
      text: text.trim() + "\n",
      vocalTag: styled.vocalTag,
      vocalMode: styled.vocalMode,
      hints: unique(hints),
      blocked: blocked,
      preview: text.trim()
    };
  }

  function generateOne(state, variant, rng) {
    var plan = planVariant(state, variant);
    var tuned = boostState(state, plan);
    var pair = genrePair(plan.lane, tuned);
    var genres = orderGenres(pair, tuned.lexicon);
    var mood = moodFor(plan.lane, tuned);
    if (genres.some(function (genre) { return genre.toLowerCase() === mood.toLowerCase(); })) {
      mood = "driving club energy";
    }
    var demand = interpretDemands(tuned.demands);
    if (demand.patches.vocal) tuned.vocal = demand.patches.vocal;
    if (demand.patches.bpm) {
      tuned.bpm = demand.patches.bpm;
      tuned.bpmAuto = false;
    }
    var vocalMode = tuned.vocal || "instrumental";
    var intro = pickIntro(tuned, variant);
    var fitted = fitOwnLyrics(tuned.ownLyrics, tuned);
    if (fitted.vocalTag) vocalMode = fitted.vocalMode || vocalMode;
    var vocal = fitted.vocalTag || vocalTag(vocalMode, tuned.voiceGender, tuned.phrase);
    var instruments = buildInstruments(plan.lane, tuned, rng);
    var bpmInfo = resolveBpm(tuned, plan.lane, variant, rng);
    var tags = assemble(genres, mood, vocal, instruments, demand.styleTags, bpmInfo.bpm, intro && intro.style);
    var warnings = demand.blocked.map(function (line) {
      return "Demande non reprise : " + line;
    }).concat((fitted.blocked || []).map(function (line) {
      return "Parole non reprise : " + line;
    }));
    if (bpmInfo.forced && (bpmInfo.bpm < bpmInfo.range[0] - 6 || bpmInfo.bpm > bpmInfo.range[1] + 6)) {
      warnings.push("BPM " + bpmInfo.bpm + " hors de la zone " + bpmInfo.range[0] + "–" + bpmInfo.range[1] + " pour " + LANE_FR[plan.lane] + ". Suno peut changer de genre.");
    }
    var result = {
      variant: variant,
      lane: plan.lane,
      kicker: kickerOf(plan),
      reason: plan.reason,
      zone: bpmInfo.range[0] + "–" + bpmInfo.range[1],
      range: bpmInfo.range,
      bpm: bpmInfo.bpm,
      bpmAuto: tuned.bpmAuto,
      title: makeTitle(plan.lane, tuned.theme, rng),
      tags: tags,
      roles: tagRoles(tags, genres.length, intro ? 1 : 0),
      genreCount: genres.length,
      introCount: intro ? 1 : 0,
      style: tags.join(", "),
      exclude: excludesFor(plan.lane, vocalMode, tuned.phrase, intro).join(", "),
      lyrics: fitted.text
        ? weaveCues(applyIntroLyric(fitted.text, intro), demand.cues)
        : weaveCues(
          applyPhraseLyric(applyIntroLyric(makeLyrics(tuned, rng), intro), vocalMode, tuned.phrase),
          demand.cues
        ),
      vocalTag: vocal,
      vocalMode: vocalMode,
      customLyrics: !!fitted.text,
      warnings: warnings,
      problems: []
    };
    result.problems = selfCheck(result);
    result.plain = [
      result.title,
      "",
      "Style of Music",
      result.style,
      "",
      "Exclude Styles",
      result.exclude,
      "",
      "Lyrics",
      result.lyrics.trim()
    ].join("\n");
    return result;
  }

  function generateTrio(state) {
    var seed = (state.seed || 1) >>> 0;
    var variants = ["net", "fusion", "nuit"];
    var results = [];
    variants.forEach(function (variant, index) {
      var attempt = 0;
      var result;
      do {
        var rng = mulberry32(seed + index * 997 + attempt * 17);
        result = generateOne(state, variant, rng);
        attempt += 1;
      } while (attempt < 5 && results.some(function (prev) { return prev.style === result.style; }));
      results.push(result);
    });
    return results;
  }

  function diagnose(state) {
    var scores = scoresOf(state);
    var ranked = rank(scores);
    var plans = ["net", "fusion", "nuit"].map(function (variant) {
      return planVariant(state, variant);
    });
    var lines = plans.map(function (plan) {
      var zone = LANES[plan.lane].bpm;
      return kickerOf(plan) + " — " + plan.reason + " Zone " + zone[0] + "–" + zone[1] + " BPM.";
    });
    var strong = ranked.filter(function (row) { return row[1] >= 6; });
    if (strong.length >= 4) {
      lines.unshift("Quatre courants sont forts en même temps. Les trois cartes les séparent : un prompt = un tempo.");
    }
    return { lines: lines, strong: strong.map(function (row) { return row[0]; }) };
  }

  root.RITE_ENGINE = {
    LANES: LANES,
    LANE_FR: LANE_FR,
    generateTrio: generateTrio,
    diagnose: diagnose,
    selfCheck: selfCheck,
    scoresOf: scoresOf,
    interpretDemands: interpretDemands,
    fitOwnLyrics: fitOwnLyrics
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
