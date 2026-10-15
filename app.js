(function () {
  "use strict";

  var DATA = globalThis.RITE_DATA;
  var ENGINE = globalThis.RITE_ENGINE;
  var STORE = "rite.suno.v1";

  var state = defaultState();
  var history = [];
  var toastTimer = 0;

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
      seed: 1
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
    state = defaultState();
    state.presetId = preset.id;
    state.seed = keepSeed ? seed : seed;
    state.lexicon = lexicon;
    state.length = length;
    state.key = key;
    state.bpmAuto = bpmAuto;
    state.bpm = bpm;
    state.theme = theme;
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
    document.getElementById("length").value = state.length;
    document.getElementById("seed").value = String(state.seed);
    document.getElementById("bpm-auto").checked = !!state.bpmAuto;
    document.getElementById("bpm").disabled = !!state.bpmAuto;
    document.getElementById("gender-wrap").hidden = ["mc", "whisper", "trance"].indexOf(state.vocal) === -1;
    document.getElementById("lang-wrap").hidden = ["mc", "whisper", "trance", "chant"].indexOf(state.vocal) === -1;
    document.querySelectorAll("[data-lex]").forEach(function (btn) {
      btn.classList.toggle("on", btn.getAttribute("data-lex") === state.lexicon);
    });
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
    var results = ENGINE.generateTrio(state);
    renderResults(results, false);
    renderDiagnosis();
    saveStore();
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
      commit(true);
    });
    document.getElementById("length").addEventListener("change", function (event) {
      state.length = event.target.value;
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
