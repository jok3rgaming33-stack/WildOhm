(function () {
  "use strict";

  var DATA = globalThis.RITE_DATA;
  var ENGINE = globalThis.RITE_ENGINE;
  var STORE = "rite.suno.v1";

  var EAR = globalThis.RITE_EAR;
  var state = defaultState();
  var history = [];
  var toastTimer = 0;
  var audioReading = null;
  var demoCtx = null;
  var demoGains = [];
  var lyricsCaret = null;

  var KEY_HELP = {
    auto: "Laisse Suno choisir. Le plus simple pour commencer.",
    "A minor": "La plus courante en free et en psy. Directe, sombre, facile à suivre.",
    "A# minor": "Un peu plus tendue que la mineur. Nuit, légère instabilité.",
    "B minor": "Sombre mais ouverte. Ça passe en psy comme en trance.",
    "C minor": "Lourde, grave, presque classique. Du poids.",
    "C# minor": "Dramatique, un peu ciné. Utile pour une trance large.",
    "D minor": "La plus mélancolique. Claire, un peu triste.",
    "D# minor": "Épaisse et voilée. Rare, donc plus étrange.",
    "E minor": "Plus naturelle, un peu rock. Moins club que la mineur.",
    "F minor": "Nuit profonde. Très sombre, plutôt mental.",
    "F# minor": "Froide et brillante. Souvent bien avec l'acide.",
    "G minor": "Ronde, moins agressive. Un peu folk.",
    "G# minor": "Serrée, métallique. Proche d'un hard techno froid."
  };

  var KEY_ROOT = {
    "C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4,
    "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2
  };

  function defaultState() {
    return {
      presetId: "fullon",
      genres: { psy: 0, hardtek: 0, hardcore: 0, hardtechno: 0 },
      artists: {},
      acid: 30,
      dark: 40,
      tribal: 40,
      melodic: 40,
      energy: 65,
      vocal: "instrumental",
      voiceGender: "femme",
      sungLang: "fr",
      theme: "",
      key: "auto",
      bpmAuto: true,
      bpm: 146,
      length: "standard",
      lexicon: "scene",
      seed: 1,
      demands: "",
      intro: "vary",
      phrase: "sec",
      ownLyrics: "",
      idea: ""
    };
  }

  function applyPreset(preset, keepSeed) {
    var seed = state.seed;
    var lexicon = state.lexicon;
    var length = state.length;
    var key = state.key;
    var bpmAuto = state.bpmAuto;
    var bpm = state.bpm;
    var theme = state.theme;
    var demands = state.demands;
    var intro = state.intro;
    var phrase = state.phrase;
    var ownLyrics = state.ownLyrics;
    var idea = state.idea;
    state = defaultState();
    state.presetId = preset.id;
    state.seed = keepSeed ? seed : seed;
    state.lexicon = lexicon;
    state.length = length;
    state.key = key;
    state.bpmAuto = bpmAuto;
    state.bpm = bpm;
    state.theme = theme;
    state.demands = demands || "";
    state.intro = intro || "vary";
    state.phrase = phrase || "sec";
    state.ownLyrics = ownLyrics || "";
    state.idea = idea || "";
    var g = preset.apply.genres || {};
    Object.keys(state.genres).forEach(function (id) {
      state.genres[id] = g[id] || 0;
    });
    state.artists = {};
    (preset.apply.artists || []).forEach(function (id) {
      state.artists[id] = true;
    });
    ["acid", "dark", "tribal", "melodic", "energy"].forEach(function (keyName) {
      if (preset.apply[keyName] != null) state[keyName] = preset.apply[keyName];
    });
    if (preset.apply.vocal) state.vocal = preset.apply.vocal;
    if (preset.apply.voiceGender) state.voiceGender = preset.apply.voiceGender;
    if (preset.apply.sungLang) state.sungLang = preset.apply.sungLang;
  }

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (!data || !data.state) return false;
      state = Object.assign(defaultState(), data.state);
      state.genres = Object.assign({ psy: 0, hardtek: 0, hardcore: 0, hardtechno: 0 }, data.state.genres || {});
      state.artists = data.state.artists || {};
      history = Array.isArray(data.history) ? data.history.slice(0, 12) : [];
      return true;
    } catch (err) {
      return false;
    }
  }

  function saveStore() {
    try {
      localStorage.setItem(STORE, JSON.stringify({ state: state, history: history }));
    } catch (err) {
      /* fichier local : le navigateur peut refuser le stockage */
    }
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function paintPresets() {
    var mount = document.getElementById("presets");
    mount.replaceChildren();
    DATA.presets.forEach(function (preset) {
      var btn = el("button", "preset" + (state.presetId === preset.id ? " on" : ""));
      btn.type = "button";
      btn.appendChild(el("strong", "", preset.name));
      btn.appendChild(el("small", "", preset.note));
      btn.addEventListener("click", function () {
        applyPreset(preset, true);
        paint();
        commit(true);
      });
      mount.appendChild(btn);
    });
  }

  function paintGenres() {
    var mount = document.getElementById("genres");
    mount.replaceChildren();
    DATA.genres.forEach(function (genre) {
      var level = state.genres[genre.id] || 0;
      var btn = el("button", "genre" + (level ? " on lv" + level : ""));
      btn.type = "button";
      btn.setAttribute("aria-pressed", level ? "true" : "false");
      var top = el("span", "genre-top");
      top.appendChild(el("strong", "", genre.label));
      top.appendChild(el("b", "", level ? String(level) : "off"));
      btn.appendChild(top);
      btn.appendChild(el("small", "", genre.sub));
      var pips = el("span", "pips");
      for (var i = 1; i <= 3; i++) {
        pips.appendChild(el("i", i <= level ? "on" : ""));
      }
      btn.appendChild(pips);
      btn.addEventListener("click", function () {
        state.genres[genre.id] = (level + 1) % 4;
        state.presetId = "";
        paintGenres();
        paintPresets();
        commit(true);
      });
      mount.appendChild(btn);
    });
  }

  function paintArtists() {
    var mount = document.getElementById("artists");
    mount.replaceChildren();
    DATA.artists.forEach(function (artist) {
      var on = !!state.artists[artist.id];
      var btn = el("button", "artist" + (on ? " on" : ""));
      btn.type = "button";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.appendChild(el("strong", "", artist.name));
      btn.appendChild(el("small", "", artist.hint));
      btn.addEventListener("click", function () {
        state.artists[artist.id] = !on;
        if (!state.artists[artist.id]) delete state.artists[artist.id];
        state.presetId = "";
        paintArtists();
        paintPresets();
        commit(true);
      });
      mount.appendChild(btn);
    });
  }

  function setSlider(id, value) {
    var input = document.getElementById(id);
    var label = document.getElementById(id + "-val");
    input.value = String(value);
    label.textContent = String(value);
  }

  function paintFields() {
    setSlider("acid", state.acid);
    setSlider("dark", state.dark);
    setSlider("tribal", state.tribal);
    setSlider("melodic", state.melodic);
    setSlider("energy", state.energy);
    setSlider("bpm", state.bpm);
    document.getElementById("vocal").value = state.vocal;
    document.getElementById("gender").value = state.voiceGender;
    document.getElementById("lang").value = state.sungLang;
    document.getElementById("theme").value = state.theme;
    document.getElementById("key").value = state.key;
    var demands = document.getElementById("demands");
    if (demands && demands.value !== (state.demands || "")) demands.value = state.demands || "";
    var ownLyrics = document.getElementById("own-lyrics");
    if (ownLyrics && ownLyrics.value !== (state.ownLyrics || "")) ownLyrics.value = state.ownLyrics || "";
    var idea = document.getElementById("idea");
    if (idea && idea.value !== (state.idea || "")) idea.value = state.idea || "";
    document.getElementById("length").value = state.length;
    document.getElementById("intro").value = state.intro || "vary";
    document.getElementById("phrase").value = state.phrase || "sec";
    document.getElementById("seed").value = String(state.seed);
    document.getElementById("bpm-auto").checked = !!state.bpmAuto;
    document.getElementById("bpm").disabled = !!state.bpmAuto;
    document.getElementById("gender-wrap").hidden = ["mc", "whisper", "trance"].indexOf(state.vocal) === -1;
    document.getElementById("lang-wrap").hidden = ["mc", "whisper", "trance", "chant"].indexOf(state.vocal) === -1;
    document.querySelectorAll("[data-lex]").forEach(function (btn) {
      btn.classList.toggle("on", btn.getAttribute("data-lex") === state.lexicon);
    });
    paintKeyHelp();
    paintDemandPreview();
    paintLyricsPreview();
    paintIdeaPreview();
  }

  function paintKeyHelp() {
    var key = state.key || "auto";
    var text = KEY_HELP[key] || KEY_HELP.auto;
    if (key === "auto") text += " L'exemple sonore est en la mineur.";
    document.getElementById("key-help").textContent = text;
  }

  function paintDemandPreview() {
    var box = document.getElementById("demands-preview");
    var info = ENGINE.interpretDemands(state.demands || "");
    var bits = [];
    if (info.cues.length) bits.push("Repère : " + info.cues.join(" "));
    if (info.styleTags.length) bits.push("Style : " + info.styleTags.join(", "));
    if (info.patches.bpm) bits.push("Tempo demandé : " + info.patches.bpm + " BPM");
    if (info.patches.vocal === "instrumental") bits.push("Voix retirée");
    else if (info.patches.vocal === "whisper") bits.push("Voix chuchotée");
    else if (info.patches.vocal === "mc") bits.push("Voix MC");
    info.hints.forEach(function (hint) { bits.push(hint); });
    box.textContent = bits.join(" · ");
  }

  function paintIdeaPreview() {
    var box = document.getElementById("idea-preview");
    if (!box) return;
    var info = ENGINE.interpretIdea(state.idea || "");
    var bits = [];
    if (info.styleTag) bits.push("Style : " + info.styleTag);
    if (info.sections && info.sections.length) {
      bits.push(info.sections.map(function (section) {
        return "[" + section.tag + (section.text ? ": " + section.text : "") + "]";
      }).join("\n"));
    }
    (info.hints || []).forEach(function (hint) { bits.push(hint); });
    box.textContent = bits.join("\n");
  }

  function paintLyricsPreview() {
    var box = document.getElementById("lyrics-preview");
    var fitted = ENGINE.fitOwnLyrics(state.ownLyrics || "", state);
    if (!fitted.preview) {
      box.textContent = "";
      return;
    }
    var head = fitted.hints.length ? fitted.hints.join(" ") + "\n" : "";
    box.textContent = head + fitted.preview;
  }

  function readLive() {
    var demands = document.getElementById("demands");
    if (demands) state.demands = demands.value;
    var ownLyrics = document.getElementById("own-lyrics");
    if (ownLyrics) state.ownLyrics = ownLyrics.value;
    var idea = document.getElementById("idea");
    if (idea) state.idea = idea.value;
    var theme = document.getElementById("theme");
    if (theme) state.theme = theme.value;
  }

  function noteFreq(keyName) {
    var note = String(keyName || "A minor").replace(" minor", "");
    var semis = Object.prototype.hasOwnProperty.call(KEY_ROOT, note) ? KEY_ROOT[note] : 0;
    return 220 * Math.pow(2, semis / 12);
  }

  function playKeyDemo() {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      toast("Audio indisponible");
      return;
    }
    if (!demoCtx) demoCtx = new AudioCtx();
    if (demoCtx.state === "suspended") demoCtx.resume();
    var now = demoCtx.currentTime;
    demoGains.forEach(function (gain) {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setTargetAtTime(0.0001, now, 0.03);
      } catch (err) { /* ancienne note déjà finie */ }
    });
    demoGains = [];
    var keyName = state.key && state.key !== "auto" ? state.key : "A minor";
    var rootFreq = noteFreq(keyName);
    var freqs = [
      rootFreq,
      rootFreq * Math.pow(2, 3 / 12),
      rootFreq * Math.pow(2, 7 / 12),
      rootFreq * 2
    ];
    var filter = demoCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 1200;
    var master = demoCtx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 2.15);
    filter.connect(master);
    master.connect(demoCtx.destination);
    demoGains.push(master);
    freqs.forEach(function (freq) {
      var osc = demoCtx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      osc.connect(filter);
      osc.start(now);
      osc.stop(now + 2.25);
    });
    if (!state.key || state.key === "auto") toast("Exemple en la mineur");
  }

  function paintAudioReport(text, isError) {
    var box = document.getElementById("audio-report");
    box.hidden = !text;
    box.textContent = text || "";
    box.classList.toggle("warning", !!isError);
    document.getElementById("btn-apply-audio").hidden = !audioReading;
  }

  function describeReading(reading) {
    var bpmNote = !reading.bpm ? "tempo non trouvé" : (reading.tempoClear ? reading.bpm + " BPM" : reading.bpm + " BPM, à vérifier");
    var keyNote = reading.confident
      ? reading.key + (reading.folded ? " (relatif mineur)" : "")
      : "tonalité incertaine, Auto reste en place";
    var line = "Mesuré sur place : " + bpmNote + " · énergie " + reading.energy + " · nuit " + reading.dark + " · " + keyNote + ".";
    if (reading.bpm < 130 || reading.bpm > 205) {
      line += " Le curseur va de 130 à 205 : à l'application, le tempo sera calé au plus près.";
    }
    return line;
  }

  function applyReading() {
    if (!audioReading) return;
    var measured = Math.round(audioReading.bpm);
    var bpm = state.bpm;
    if (measured) {
      bpm = Math.max(130, Math.min(205, measured));
      state.bpm = bpm;
      state.bpmAuto = false;
    }
    state.energy = audioReading.energy;
    state.dark = audioReading.dark;
    if (audioReading.confident && audioReading.key) state.key = audioReading.key;
    state.presetId = "";
    paint();
    var note = "Mesures appliquées";
    if (measured && measured !== bpm) note = "Tempo " + measured + " calé à " + bpm;
    if (!audioReading.confident) note += " · tonalité laissée telle quelle";
    toast(note);
    commit(true);
  }

  function paint() {
    paintPresets();
    paintGenres();
    paintArtists();
    paintFields();
    renderDiagnosis();
  }

  function renderDiagnosis() {
    var box = document.getElementById("diagnosis");
    var info = ENGINE.diagnose(state);
    box.replaceChildren();
    var title = el("p", "diag-kicker", "Trois cartes, trois tempos");
    box.appendChild(title);
    info.lines.forEach(function (line) {
      box.appendChild(el("p", "", line));
    });
    box.appendChild(el("p", "diag-warn", "Ne colle pas ce bloc dans Suno. Il explique seulement le choix."));
  }

  function countTags(text) {
    return String(text || "").split(",").map(function (part) { return part.trim(); }).filter(Boolean);
  }

  function renderResults(results, fromHistory) {
    var mount = document.getElementById("cards");
    mount.replaceChildren();
    results.forEach(function (result, index) {
      mount.appendChild(renderCard(result, index));
    });
    if (!fromHistory) remember(results);
    renderHistory();
    if (state.bpmAuto && results[0]) {
      state.bpm = results[0].bpm;
      setSlider("bpm", state.bpm);
    }
  }

  function renderCard(result, index) {
    var card = el("article", "sheet");
    var head = el("header", "sheet-head");
    var ident = el("div");
    ident.appendChild(el("p", "kicker", result.kicker));
    ident.appendChild(el("p", "reason", result.reason));
    head.appendChild(ident);
    var bpm = el("p", "bpm");
    bpm.appendChild(el("strong", "", String(result.bpm)));
    bpm.appendChild(el("span", "", "BPM · zone " + result.zone));
    head.appendChild(bpm);
    card.appendChild(head);

    if (result.problems && result.problems.length) {
      card.appendChild(el("p", "problem", result.problems.join(" ")));
    }
    (result.warnings || []).forEach(function (warning) {
      card.appendChild(el("p", "warning", warning));
    });

    card.appendChild(fieldBlock("Titre", "title-" + index, result.title, 1, function (value) {
      result.title = value;
    }));

    var styleBlock = el("div", "block");
    styleBlock.appendChild(el("div", "block-label", "Style of Music"));
    var chips = el("div", "chips");
    (result.roles || []).forEach(function (tag) {
      var chip = el("span", "chip chip-" + tag.role, tag.text);
      chips.appendChild(chip);
    });
    styleBlock.appendChild(chips);
    var styleArea = el("textarea");
    styleArea.id = "style-" + index;
    styleArea.rows = 4;
    styleArea.spellcheck = false;
    styleArea.value = result.style;
    var meta = el("p", "meta", metaText(result.style));
    styleArea.addEventListener("input", function () {
      result.style = styleArea.value;
      chips.hidden = true;
      meta.textContent = metaText(styleArea.value);
      meta.className = "meta" + (metaBad(styleArea.value) ? " bad" : "");
    });
    styleBlock.appendChild(styleArea);
    styleBlock.appendChild(meta);
    card.appendChild(styleBlock);

    card.appendChild(fieldBlock("Exclude Styles", "exclude-" + index, result.exclude, 2, function (value) {
      result.exclude = value;
    }));
    card.appendChild(fieldBlock("Lyrics", "lyrics-" + index, result.lyrics.trim(), 12, function (value) {
      result.lyrics = value;
    }));

    var row = el("div", "row");
    row.appendChild(copyBtn("Copier le style", function () { return result.style; }));
    row.appendChild(copyBtn("Copier le bloc", function () { return plainOf(result); }));
    var fileBtn = el("button", "btn tiny", "Fichier .txt");
    fileBtn.type = "button";
    fileBtn.addEventListener("click", function () {
      download(slug(result.title) + ".txt", plainOf(result));
    });
    row.appendChild(fileBtn);
    card.appendChild(row);
    return card;
  }

  function fieldBlock(label, id, value, rows, onInput) {
    var block = el("div", "block");
    block.appendChild(el("div", "block-label", label));
    var area = label === "Titre" ? el("input") : el("textarea");
    area.id = id;
    if (area.tagName === "TEXTAREA") area.rows = rows;
    area.spellcheck = false;
    area.value = value;
    area.addEventListener("input", function () { onInput(area.value); });
    block.appendChild(area);
    return block;
  }

  function metaText(style) {
    var tags = countTags(style);
    var last = tags[tags.length - 1] || "";
    var note = tags.length + " tags · " + style.length + " caractères";
    if (!/^\d{2,3} BPM$/.test(last)) note += " · le BPM n'est plus en dernier";
    return note;
  }

  function metaBad(style) {
    var tags = countTags(style);
    var last = tags[tags.length - 1] || "";
    return tags.length < 8 || tags.length > 15 || style.length > 1000 || !/^\d{2,3} BPM$/.test(last);
  }

  function plainOf(result) {
    return [
      result.title,
      "",
      "Style of Music",
      result.style,
      "",
      "Exclude Styles",
      result.exclude,
      "",
      "Lyrics",
      String(result.lyrics || "").trim()
    ].join("\n");
  }

  function copyBtn(label, getText) {
    var btn = el("button", "btn tiny", label);
    btn.type = "button";
    btn.addEventListener("click", function () {
      copyText(getText()).then(function () { toast("Copié"); });
    });
    return btn;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve) {
      var area = el("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try { document.execCommand("copy"); } catch (err) { /* copie manuelle */ }
      area.remove();
      resolve();
    });
  }

  function download(filename, text) {
    var link = el("a");
    link.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function slug(title) {
    var base = String(title || "rite").toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
    return base || "rite";
  }

  function toast(message) {
    var node = document.getElementById("toast");
    node.textContent = message;
    node.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { node.classList.remove("on"); }, 1400);
  }

  function remember(results) {
    var item = {
      at: Date.now(),
      seed: state.seed,
      label: results[0] ? results[0].title + " · " + results[0].bpm : "prompt",
      state: JSON.parse(JSON.stringify(state)),
      results: results.map(function (result) {
        return {
          variant: result.variant,
          lane: result.lane,
          kicker: result.kicker,
          reason: result.reason,
          zone: result.zone,
          range: result.range,
          bpm: result.bpm,
          title: result.title,
          tags: result.tags,
          roles: result.roles,
          genreCount: result.genreCount,
          style: result.style,
          exclude: result.exclude,
          lyrics: result.lyrics,
          vocalTag: result.vocalTag,
          vocalMode: result.vocalMode,
          warnings: result.warnings,
          problems: result.problems
        };
      })
    };
    history.unshift(item);
    history = history.slice(0, 12);
    saveStore();
  }

  function renderHistory() {
    var mount = document.getElementById("history");
    mount.replaceChildren();
    if (!history.length) return;
    mount.appendChild(el("h2", "", "Déjà généré"));
    var list = el("div", "history-list");
    history.forEach(function (item, index) {
      var btn = el("button", "history-item");
      btn.type = "button";
      var when = new Date(item.at);
      var hh = String(when.getHours()).padStart(2, "0");
      var mm = String(when.getMinutes()).padStart(2, "0");
      btn.appendChild(el("strong", "", item.label));
      btn.appendChild(el("small", "", hh + ":" + mm + " · graine " + item.seed));
      btn.addEventListener("click", function () {
        state = Object.assign(defaultState(), item.state);
        state.genres = Object.assign({ psy: 0, hardtek: 0, hardcore: 0, hardtechno: 0 }, item.state.genres || {});
        state.artists = item.state.artists || {};
        paint();
        renderResults(item.results, true);
        var cards = document.getElementById("cards");
        cards.scrollIntoView({ behavior: "smooth", block: "start" });
        toast("Session rechargée");
      });
      list.appendChild(btn);
      if (index === 0) btn.classList.add("latest");
    });
    mount.appendChild(list);
  }

  function generate() {
    readLive();
    var results = ENGINE.generateTrio(state);
    renderResults(results, false);
    renderDiagnosis();
    paintDemandPreview();
    paintLyricsPreview();
    paintIdeaPreview();
    saveStore();
  }

  function rememberLyricsCaret() {
    var area = document.getElementById("own-lyrics");
    if (!area) return;
    lyricsCaret = { start: area.selectionStart, end: area.selectionEnd };
  }

  function lyricClock(raw) {
    var match = String(raw || "").match(/(\d{1,2})\s*[:hH]\s*(\d{2})/);
    if (!String(raw || "").trim()) return "";
    if (!match) return null;
    var min = Math.min(14, Number(match[1]));
    var sec = Math.min(59, Number(match[2]));
    return (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function insertLyricTag(tagLine) {
    var area = document.getElementById("own-lyrics");
    var value = area.value;
    var start = area.selectionStart;
    var end = area.selectionEnd;
    if (document.activeElement !== area && lyricsCaret) {
      start = lyricsCaret.start;
      end = lyricsCaret.end;
    }
    if (start == null || start > value.length) start = value.length;
    if (end == null || end > value.length || end < start) end = start;
    var before = value.slice(0, start);
    var after = value.slice(end);
    var lead = before.length && before.charAt(before.length - 1) !== "\n" ? "\n" : "";
    var chunk = lead + tagLine + "\n";
    area.value = before + chunk + after;
    var pos = before.length + chunk.length;
    lyricsCaret = { start: pos, end: pos };
    state.ownLyrics = area.value;
    area.focus();
    area.selectionStart = area.selectionEnd = pos;
    paintLyricsPreview();
    commit(true);
  }

  function commit(doGenerate) {
    renderDiagnosis();
    saveStore();
    if (doGenerate) generate();
  }

  function bindSlider(id, key) {
    var input = document.getElementById(id);
    input.addEventListener("input", function () {
      state[key] = Number(input.value);
      document.getElementById(id + "-val").textContent = input.value;
      state.presetId = "";
      paintPresets();
      renderDiagnosis();
    });
    input.addEventListener("change", function () {
      commit(true);
    });
  }

  function bind() {
    bindSlider("acid", "acid");
    bindSlider("dark", "dark");
    bindSlider("tribal", "tribal");
    bindSlider("melodic", "melodic");
    bindSlider("energy", "energy");

    document.getElementById("bpm").addEventListener("input", function (event) {
      state.bpm = Number(event.target.value);
      state.bpmAuto = false;
      document.getElementById("bpm-auto").checked = false;
      document.getElementById("bpm").disabled = false;
      document.getElementById("bpm-val").textContent = event.target.value;
      state.presetId = "";
      paintPresets();
    });
    document.getElementById("bpm").addEventListener("change", function () {
      commit(true);
    });
    document.getElementById("bpm-auto").addEventListener("change", function (event) {
      state.bpmAuto = event.target.checked;
      document.getElementById("bpm").disabled = state.bpmAuto;
      commit(true);
    });

    document.getElementById("vocal").addEventListener("change", function (event) {
      state.vocal = event.target.value;
      state.presetId = "";
      paintFields();
      paintPresets();
      commit(true);
    });
    document.getElementById("gender").addEventListener("change", function (event) {
      state.voiceGender = event.target.value;
      commit(true);
    });
    document.getElementById("lang").addEventListener("change", function (event) {
      state.sungLang = event.target.value;
      commit(true);
    });
    document.getElementById("theme").addEventListener("change", function (event) {
      state.theme = event.target.value;
      commit(true);
    });
    document.getElementById("key").addEventListener("change", function (event) {
      state.key = event.target.value;
      paintKeyHelp();
      commit(true);
    });
    document.getElementById("btn-key-demo").addEventListener("click", playKeyDemo);
    var lyricsBox = document.getElementById("own-lyrics");
    ["keyup", "mouseup", "select", "focus"].forEach(function (name) {
      lyricsBox.addEventListener(name, rememberLyricsCaret);
    });
    lyricsBox.addEventListener("input", function (event) {
      state.ownLyrics = event.target.value;
      rememberLyricsCaret();
      paintLyricsPreview();
    });
    document.getElementById("btn-insert-voice").addEventListener("click", function () {
      var who = document.getElementById("tag-who").value;
      var how = document.getElementById("tag-how").value;
      var parts = [how, who].filter(Boolean);
      if (!parts.length) {
        toast("Choisis qui ou la façon");
        return;
      }
      insertLyricTag("[" + parts.join(" ") + "]");
    });
    document.getElementById("btn-insert-place").addEventListener("click", function () {
      var place = document.getElementById("tag-place").value;
      if (!place) {
        toast("Choisis une place");
        return;
      }
      var clock = lyricClock(document.getElementById("tag-time").value);
      if (clock === null) {
        toast("Heure au format 01:30");
        return;
      }
      insertLyricTag("[" + place + (clock ? " at " + clock : "") + "]");
    });
    document.getElementById("idea").addEventListener("input", function (event) {
      state.idea = event.target.value;
      paintIdeaPreview();
    });
    document.getElementById("idea").addEventListener("change", function (event) {
      state.idea = event.target.value;
      commit(true);
    });
    document.getElementById("own-lyrics").addEventListener("change", function (event) {
      state.ownLyrics = event.target.value;
      commit(true);
    });
    document.getElementById("demands").addEventListener("input", function (event) {
      state.demands = event.target.value;
      paintDemandPreview();
    });
    document.getElementById("demands").addEventListener("change", function (event) {
      state.demands = event.target.value;
      commit(true);
    });
    document.getElementById("audio-file").addEventListener("change", function (event) {
      var file = event.target.files && event.target.files[0];
      audioReading = null;
      paintAudioReport("", false);
      if (!file) return;
      paintAudioReport("Lecture du fichier, sur cette machine…", false);
      EAR.analyzeFile(file).then(function (reading) {
        audioReading = reading;
        paintAudioReport(describeReading(reading), false);
      }).catch(function (err) {
        audioReading = null;
        paintAudioReport(err && err.message ? err.message : "Lecture impossible.", true);
      });
    });
    document.getElementById("btn-apply-audio").addEventListener("click", applyReading);
    document.getElementById("length").addEventListener("change", function (event) {
      state.length = event.target.value;
      commit(true);
    });
    document.getElementById("intro").addEventListener("change", function (event) {
      state.intro = event.target.value;
      commit(true);
    });
    document.getElementById("phrase").addEventListener("change", function (event) {
      state.phrase = event.target.value;
      commit(true);
    });
    document.getElementById("seed").addEventListener("change", function (event) {
      var next = Number(event.target.value);
      state.seed = Number.isFinite(next) ? Math.max(1, Math.floor(next)) : 1;
      event.target.value = String(state.seed);
      commit(true);
    });

    document.querySelectorAll("[data-lex]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.lexicon = btn.getAttribute("data-lex");
        paintFields();
        commit(true);
      });
    });

    document.getElementById("btn-generate").addEventListener("click", function () {
      commit(true);
    });
    document.getElementById("btn-vary").addEventListener("click", function () {
      state.seed = (Math.floor(Math.random() * 900000) + 1);
      document.getElementById("seed").value = String(state.seed);
      commit(true);
    });
    document.getElementById("btn-clear-artists").addEventListener("click", function () {
      state.artists = {};
      state.presetId = "";
      paint();
      commit(true);
    });

    document.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        commit(true);
      }
    });
  }

  function boot() {
    var restored = loadStore();
    if (!restored) {
      var preset = DATA.presets[0];
      applyPreset(preset, true);
      state.presetId = preset.id;
    }
    bind();
    paint();
    if (history.length && restored) {
      renderResults(history[0].results, true);
    } else {
      generate();
    }
  }

  boot();
})();
