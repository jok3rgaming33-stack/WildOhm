(function (root) {
  "use strict";

  var NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  var MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
  var MINOR = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function emptyReading() {
    return {
      bpm: 0,
      energy: 0,
      dark: 50,
      key: "A minor",
      confident: false,
      mode: "minor",
      keyNote: "A",
      folded: false,
      tempoClear: false
    };
  }

  function decimate(samples, sampleRate) {
    if (sampleRate <= 24000) return { data: samples, rate: sampleRate };
    var factor = Math.max(2, Math.round(sampleRate / 22050));
    var n = Math.floor(samples.length / factor);
    var out = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var acc = 0;
      var base = i * factor;
      for (var k = 0; k < factor; k++) acc += samples[base + k];
      out[i] = acc / factor;
    }
    return { data: out, rate: sampleRate / factor };
  }

  function onsetEnvelope(data, rate) {
    var hop = Math.max(64, Math.round(rate / 100));
    var win = hop * 2;
    if (data.length <= win) return { env: new Float32Array(0), fps: rate / hop };
    var n = Math.floor((data.length - win) / hop);
    var env = new Float32Array(n);
    var prev = 0;
    for (var i = 0; i < n; i++) {
      var start = i * hop;
      var sum = 0;
      for (var j = 0; j < win; j++) {
        var s = data[start + j];
        sum += s * s;
      }
      var rms = Math.sqrt(sum / win);
      var diff = rms - prev;
      env[i] = diff > 0 ? diff : 0;
      prev = rms;
    }
    return { env: env, fps: rate / hop };
  }

  function corrAt(env, mean, lag) {
    if (lag < 1 || lag >= env.length - 1) return 0;
    var acc = 0;
    var a = 0;
    var b = 0;
    var count = env.length - lag;
    for (var i = 0; i < count; i++) {
      var x = env[i] - mean;
      var y = env[i + lag] - mean;
      acc += x * y;
      a += x * x;
      b += y * y;
    }
    var den = Math.sqrt(a * b);
    return den > 1e-12 ? acc / den : 0;
  }

  function bpmFromEnv(env, fps) {
    if (env.length < 16) return { bpm: 0, clear: false };
    var mean = 0;
    for (var i = 0; i < env.length; i++) mean += env[i];
    mean /= env.length;
    function score(bpm) {
      var exact = fps * 60 / bpm;
      var lag = Math.round(exact);
      return { corr: corrAt(env, mean, lag), error: Math.abs(exact - lag) };
    }
    function better(next, prevCorr, prevError) {
      return next.corr > prevCorr + 0.01 || (next.corr >= prevCorr - 0.01 && next.error < prevError);
    }
    var bestBpm = 140;
    var best = -1;
    var bestError = 1;
    for (var bpm = 120; bpm <= 200; bpm++) {
      var s = score(bpm);
      if (best < 0 || better(s, best, bestError)) {
        best = s.corr;
        bestError = s.error;
        bestBpm = bpm;
      }
    }
    var slowBpm = 80;
    var slow = -1;
    var slowError = 1;
    for (var half = 60; half <= 100; half++) {
      var s2 = score(half);
      if (slow < 0 || better(s2, slow, slowError)) {
        slow = s2.corr;
        slowError = s2.error;
        slowBpm = half;
      }
    }
    if (slow > best * 1.05) {
      var doubled = slowBpm * 2;
      if (doubled >= 120 && doubled <= 200) {
        var refine = doubled;
        var picked = score(doubled);
        for (var d = doubled - 2; d <= doubled + 2; d++) {
          if (d < 120 || d > 200) continue;
          var sd = score(d);
          if (better(sd, picked.corr, picked.error)) {
            picked = sd;
            refine = d;
          }
        }
        bestBpm = refine;
        best = picked.corr;
      }
    }
    return { bpm: bestBpm, clear: best >= 0.35 };
  }

  function goertzel(frame, sampleRate, freq) {
    var n = frame.length;
    var coeff = 2 * Math.cos(2 * Math.PI * freq / sampleRate);
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    for (var i = 0; i < n; i++) {
      s0 = frame[i] + coeff * s1 - s2;
      s2 = s1;
      s1 = s0;
    }
    return s1 * s1 + s2 * s2 - coeff * s1 * s2;
  }

  function frameSize(length) {
    var size = 256;
    while (size * 2 <= length && size < 8192) size *= 2;
    return size;
  }

  function chromaOf(data, rate) {
    var chroma = new Float64Array(12);
    var frame = frameSize(data.length);
    if (frame < 256 || data.length < frame) return chroma;
    var hann = new Float32Array(frame);
    for (var i = 0; i < frame; i++) {
      hann[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (frame - 1)));
    }
    var buf = new Float32Array(frame);
    for (var start = 0; start + frame <= data.length; start += frame) {
      for (var j = 0; j < frame; j++) buf[j] = data[start + j] * hann[j];
      for (var midi = 36; midi <= 84; midi++) {
        var freq = 440 * Math.pow(2, (midi - 69) / 12);
        if (freq >= rate * 0.45) continue;
        chroma[midi % 12] += Math.log(1 + goertzel(buf, rate, freq));
      }
    }
    return chroma;
  }

  function pearson(chroma, profile, shift) {
    var meanA = 0;
    var meanB = 0;
    var i;
    for (i = 0; i < 12; i++) {
      meanA += chroma[(i + shift) % 12];
      meanB += profile[i];
    }
    meanA /= 12;
    meanB /= 12;
    var num = 0;
    var da = 0;
    var db = 0;
    for (i = 0; i < 12; i++) {
      var xa = chroma[(i + shift) % 12] - meanA;
      var xb = profile[i] - meanB;
      num += xa * xb;
      da += xa * xa;
      db += xb * xb;
    }
    var den = Math.sqrt(da * db);
    return den > 1e-12 ? num / den : 0;
  }

  function keyFromChroma(chroma) {
    var best = { score: -2, pc: 9, mode: "minor" };
    var second = -2;
    for (var pc = 0; pc < 12; pc++) {
      var modes = [["major", pearson(chroma, MAJOR, pc)], ["minor", pearson(chroma, MINOR, pc)]];
      for (var m = 0; m < modes.length; m++) {
        var score = modes[m][1];
        if (score > best.score) {
          second = best.score;
          best = { score: score, pc: pc, mode: modes[m][0] };
        } else if (score > second) {
          second = score;
        }
      }
    }
    var folded = best.mode === "major";
    var outPc = folded ? (best.pc + 9) % 12 : best.pc;
    var margin = best.score - (second < -1 ? 0 : second);
    return {
      key: NAMES[outPc] + " minor",
      keyNote: NAMES[outPc],
      mode: best.mode,
      folded: folded,
      confident: best.score >= 0.45 && margin >= 0.04
    };
  }

  function measureColor(data) {
    var n = data.length || 1;
    var sum = 0;
    var crosses = 0;
    var prev = 0;
    for (var i = 0; i < data.length; i++) {
      var s = data[i];
      sum += s * s;
      if (i && ((prev >= 0 && s < 0) || (prev < 0 && s >= 0))) crosses += 1;
      prev = s;
    }
    var rms = Math.sqrt(sum / n);
    var db = 20 * Math.log10(Math.max(rms, 1e-8));
    var energy = clamp(Math.round(((db + 42) / 36) * 100), 0, 100);
    var zcr = crosses / n;
    var dark = clamp(Math.round(100 - zcr * 900), 0, 100);
    return { energy: energy, dark: dark };
  }

  function analyzeChannel(samples, sampleRate) {
    if (!samples || !samples.length || !(sampleRate > 0)) return emptyReading();
    var limit = Math.min(samples.length, Math.floor(sampleRate * 30));
    var slice = samples.length === limit ? samples : samples.subarray(0, limit);
    var dec = decimate(slice, sampleRate);
    var onset = onsetEnvelope(dec.data, dec.rate);
    var tempo = bpmFromEnv(onset.env, onset.fps);
    var tone = keyFromChroma(chromaOf(dec.data, dec.rate));
    var color = measureColor(dec.data);
    return {
      bpm: tempo.bpm,
      energy: color.energy,
      dark: color.dark,
      key: tone.key,
      confident: tone.confident,
      mode: tone.mode,
      keyNote: tone.keyNote,
      folded: tone.folded,
      tempoClear: tempo.clear
    };
  }

  function analyzeFile(file) {
    if (!file) return Promise.reject(new Error("Aucun fichier."));
    if (file.size > 45 * 1024 * 1024) {
      return Promise.reject(new Error("Fichier trop lourd. 45 Mo maximum."));
    }
    var AudioCtx = root.AudioContext || root.webkitAudioContext;
    if (!AudioCtx) return Promise.reject(new Error("Ce navigateur ne lit pas l'audio."));
    var ctx = new AudioCtx();
    return file.arrayBuffer().then(function (buf) {
      return ctx.decodeAudioData(buf);
    }).then(function (audio) {
      var seconds = Math.min(30, audio.duration || 0);
      var length = Math.max(1, Math.floor(seconds * audio.sampleRate));
      var mono = new Float32Array(length);
      var chans = audio.numberOfChannels || 1;
      for (var c = 0; c < chans; c++) {
        var channel = audio.getChannelData(c);
        var n = Math.min(length, channel.length);
        for (var i = 0; i < n; i++) mono[i] += channel[i] / chans;
      }
      var reading = analyzeChannel(mono, audio.sampleRate);
      if (ctx.close) ctx.close();
      return reading;
    }, function () {
      if (ctx.close) ctx.close();
      throw new Error("Ce fichier n'a pas pu être lu. Essaie un mp3, un wav ou un ogg.");
    });
  }

  root.RITE_EAR = {
    analyzeChannel: analyzeChannel,
    analyzeFile: analyzeFile
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
