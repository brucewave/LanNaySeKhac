// Âm thanh tự sinh bằng Web Audio: nhạc nền đổi theo tình huống + tiếng động. Không cần file, chạy offline.
// Bật/tắt nhạc và tiếng động riêng; lựa chọn lưu trong máy (localStorage).
var G = window.G || (window.G = {});

(function () {
  var A = G.audio = { ctx: null, mood: null, step: 0, next: 0 };
  var PREF_KEY = 'lnsk_audio';
  var MUSIC_VOL = 0.8; // âm lượng nhạc nền (trước là 0.32, người chơi thấy nhỏ)
  var pref = { music: true, sfx: true };
  try { var p = JSON.parse(localStorage.getItem(PREF_KEY) || 'null'); if (p) pref = Object.assign(pref, p); } catch (e) {}
  A.pref = pref;
  function savePref() { try { localStorage.setItem(PREF_KEY, JSON.stringify(pref)); } catch (e) {} }
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  // ---------- khởi tạo sau lần bấm đầu tiên (trình duyệt chặn tự phát âm thanh) ----------
  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    var ctx = A.ctx = new C();
    var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(ctx.destination); // nhạc to hơn mà không vỡ tiếng
    A.master = ctx.createGain(); A.master.gain.value = 1; A.master.connect(comp);
    A.music = ctx.createGain(); A.music.gain.value = pref.music ? MUSIC_VOL : 0; A.music.connect(A.master);
    A.fx = ctx.createGain(); A.fx.gain.value = pref.sfx ? 0.6 : 0; A.fx.connect(A.master);
    // tiếng vang nhẹ cho nhạc
    var dl = ctx.createDelay(); dl.delayTime.value = 0.28; var fb = ctx.createGain(); fb.gain.value = 0.28; var wet = ctx.createGain(); wet.gain.value = 0.35;
    A.verb = ctx.createGain(); A.verb.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(A.music);
    var len = ctx.sampleRate * 1.5, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    A.noiseBuf = buf;
    A.next = ctx.currentTime + 0.1;
    setInterval(schedule, 50);
  };
  ['pointerdown', 'keydown'].forEach(function (ev) { window.addEventListener(ev, function () { A.init(); }, { capture: true }); });

  A.setMusic = function (on) {
    pref.music = on; savePref();
    if (A.ctx) A.music.gain.setTargetAtTime(on ? MUSIC_VOL : 0, A.ctx.currentTime, 0.15);
    A.updateButton();
  };
  A.setSfx = function (on) { pref.sfx = on; savePref(); if (A.ctx) A.fx.gain.setTargetAtTime(on ? 0.6 : 0, A.ctx.currentTime, 0.05); };
  A.updateButton = function () {
    document.querySelectorAll('.music-toggle').forEach(function (b) { b.textContent = pref.music ? '♪ Nhạc: Bật' : '♪ Nhạc: Tắt'; b.classList.toggle('off', !pref.music); });
    var b = document.getElementById('btn-music');
    if (b) { b.textContent = pref.music ? '♪' : '♪̸'; b.classList.toggle('off', !pref.music); b.title = pref.music ? 'Tắt nhạc' : 'Bật nhạc'; }
  };

  // ---------- nhạc cụ ----------
  function env(g, t, a, peak, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  // gảy dây, có luyến cao độ kiểu đàn bầu
  function pluck(m, t, dur, vol, glide, type) {
    var c = A.ctx, o = c.createOscillator(), g = c.createGain(), f = mtof(m);
    o.type = type || 'triangle';
    if (glide) { o.frequency.setValueAtTime(f * 0.94, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.12); o.frequency.setValueAtTime(f, t + dur * 0.5); o.frequency.exponentialRampToValueAtTime(f * 1.03, t + dur); }
    else o.frequency.value = f;
    env(g, t, 0.01, vol, dur);
    o.connect(g); g.connect(A.music); g.connect(A.verb);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function pad(ms, t, dur, vol, type, cutoff) {
    var c = A.ctx, lp = c.createBiquadFilter(), g = c.createGain();
    lp.type = 'lowpass'; lp.frequency.value = cutoff || 900;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur * 0.3); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    ms.forEach(function (m, i) {
      var o = c.createOscillator(); o.type = type || 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = (i % 2 ? 6 : -6);
      o.connect(lp); o.start(t); o.stop(t + dur + 0.05);
    });
    lp.connect(g); g.connect(A.music);
  }
  function noise(t, dur, vol, ftype, freq, bus, q) {
    var c = A.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = A.noiseBuf; f.type = ftype || 'lowpass'; f.frequency.value = freq || 1000; if (q) f.Q.value = q;
    env(g, t, 0.005, vol, dur);
    s.connect(f); f.connect(g); g.connect(bus || A.music);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  function thump(t, f0, vol, bus) {
    var c = A.ctx, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 0.5, t + 0.18);
    env(g, t, 0.005, vol, 0.25); o.connect(g); g.connect(bus || A.music); o.start(t); o.stop(t + 0.3);
  }

  // ---------- các đoạn nhạc (16 nhịp một vòng) ----------
  // ngũ cung: C D F G A (điệu Bắc) cho ngày và kết; D F G A C cho đêm và 1996
  var DAY_MEL = [72, 0, 69, 0, 67, 0, 69, 72, 74, 0, 72, 0, 69, 0, 67, 0, 65, 0, 67, 0, 69, 0, 67, 65, 62, 0, 60, 0, 0, 0, 0, 0];
  var END_MEL = [67, 0, 69, 72, 0, 74, 72, 0, 69, 0, 67, 0, 65, 67, 0, 0, 72, 0, 74, 76, 0, 74, 72, 0, 69, 0, 72, 0, 67, 0, 0, 0];
  var PAST_MEL = [74, 0, 0, 77, 0, 0, 79, 0, 77, 0, 74, 0, 0, 72, 0, 69, 0, 0, 0, 70, 0, 0, 69, 0, 67, 0, 0, 0, 62, 0, 0, 0];
  var CLIMAX_MEL = [62, 0, 65, 67, 0, 69, 67, 65, 62, 0, 60, 62, 0, 0, 65, 0, 69, 0, 72, 70, 0, 69, 67, 0, 65, 0, 67, 0, 62, 0, 0, 0];
  var MOODS = {
    title: { bpm: 60, play: function (s, t, b) {
      if (s % 32 === 0) pad([50, 57, 62], t, b * 32, 0.05, 'sine');
      if (s % 4 === 0 && ((s * 7) % 5) < 2) pluck([62, 65, 67, 69, 72][(s / 4) % 5], t, b * 6, 0.07, true);
    } },
    day: { bpm: 76, play: function (s, t, b) {
      var chords = [[48, 55, 60, 64], [53, 57, 60, 65], [50, 57, 62, 65], [55, 59, 62, 67]];
      if (s % 16 === 0) pad(chords[(s / 16) % 4], t, b * 16, 0.035, 'sine', 1200);
      if (s % 4 === 0) pluck(36 + [12, 17, 14, 19][(s / 16 | 0) % 4], t, b * 3, 0.05, false, 'sine');
      var m = DAY_MEL[s % 32]; if (m) pluck(m, t, b * 3, 0.07, true);
    } },
    night: { bpm: 60, play: function (s, t, b) {
      if (s % 32 === 0) { pad([38, 45, 50], t, b * 32, 0.05, 'sine', 600); noise(t, b * 12, 0.025, 'bandpass', 500, A.music, 0.5); }
      if (s % 4 === 2 && ((s * 13) % 7) < 3) pluck([62, 65, 67, 69, 72, 74][(s * 3) % 6], t, b * 5, 0.05, true);
    } },
    past: { bpm: 54, play: function (s, t, b) {
      if (s % 32 === 0) { pad([38, 45, 51], t, b * 32, 0.05, 'triangle', 500); }
      if (s % 16 === 8) thump(t, 55, 0.12);
      var m = PAST_MEL[s % 32]; if (m) pluck(m + 12, t, b * 4, 0.035, false, 'sine');
      if (s % 32 === 20) noise(t, b * 6, 0.02, 'bandpass', 1800, A.music, 3);
    } },
    tense: { bpm: 104, play: function (s, t, b) {
      if (s % 8 === 0) thump(t, 70, 0.2); if (s % 8 === 2) thump(t, 60, 0.13);
      if (s % 2 === 0) pluck([38, 38, 39, 38][(s / 2) % 4], t, b * 1.6, 0.06, false, 'sawtooth');
      if (s % 32 === 0) pad([74, 75], t, b * 32, 0.018, 'sawtooth', 2400);
      if (s % 4 === 3) noise(t, 0.03, 0.03, 'highpass', 6000);
    } },
    climax: { bpm: 124, play: function (s, t, b) {
      if (s % 8 === 0 || s % 8 === 3) thump(t, 80, 0.26);
      if (s % 8 === 4) noise(t, 0.12, 0.12, 'bandpass', 1800, A.music, 1);
      if (s % 2 === 0) pluck([38, 38, 41, 43][(s / 4 | 0) % 4], t, b * 1.8, 0.07, false, 'sawtooth');
      if (s % 16 === 0) pad([50, 53, 57], t, b * 16, 0.03, 'sawtooth', 1500);
      var m = CLIMAX_MEL[s % 32]; if (m) pluck(m + 12, t, b * 2, 0.06, true, 'square');
    } },
    end: { bpm: 70, play: function (s, t, b) {
      var chords = [[48, 55, 64, 67], [53, 60, 65, 69], [55, 62, 67, 71], [48, 55, 60, 64]];
      if (s % 16 === 0) pad(chords[(s / 16) % 4], t, b * 16, 0.04, 'sine', 1400);
      var m = END_MEL[s % 32]; if (m) pluck(m, t, b * 3, 0.07, true);
      if (s % 8 === 0) pluck(36 + [12, 17, 19, 12][(s / 16 | 0) % 4], t, b * 6, 0.05, false, 'sine');
    } }
  };

  // chọn đoạn nhạc theo tình huống hiện tại
  function pickMood() {
    var S = G.S;
    if (!S || !document.getElementById('title').hidden) return 'title';
    if (S.flags.the_end || (S.flags.reunited && !S.era)) return 'end';
    if (S.danger === 'cao' || (S.era && S.pnight === 6)) return 'climax';
    if ((G.danger && G.danger.active) || S.danger === 'le' || S.danger === 'ham' ||
        (S.era && S.pnight === 5 && S.flags.vy_free && !S.flags.n5_cliff)) return 'tense';
    if (S.era) return 'past';
    if (S.min >= 17 * 60) return 'night';
    return 'day';
  }

  function schedule() {
    var c = A.ctx; if (!c) return;
    var mood = pickMood();
    if (mood !== A.mood) { // đổi đoạn: hạ âm lượng rồi chơi đoạn mới từ đầu
      A.mood = mood; A.step = 0;
      if (pref.music) { A.music.gain.setTargetAtTime(0.0001, c.currentTime, 0.2); A.music.gain.setTargetAtTime(MUSIC_VOL, c.currentTime + 0.8, 0.4); }
      A.next = c.currentTime + 0.7;
    }
    var M = MOODS[mood], beat = 60 / M.bpm / 2; // mỗi bước là nửa phách
    while (A.next < c.currentTime + 0.25) {
      if (pref.music) M.play(A.step, A.next, beat);
      A.step++; A.next += beat;
    }
  }

  // ---------- tiếng động ----------
  function tone(type, f0, f1, t, dur, vol) {
    var c = A.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    env(g, t, 0.005, vol, dur); o.connect(g); g.connect(A.fx); o.start(t); o.stop(t + dur + 0.05);
  }
  var SFX = {
    click: function (t) { tone('sine', 900, 600, t, 0.05, 0.12); },
    blip: function (t) { tone('triangle', 520 + Math.random() * 60, 0, t, 0.035, 0.04); },
    step: function (t) { noise(t, 0.05, 0.05, 'bandpass', 380 + Math.random() * 120, A.fx, 1.5); },
    coin: function (t) { tone('sine', 1320, 0, t, 0.09, 0.18); tone('sine', 1760, 0, t + 0.08, 0.16, 0.16); },
    wrong: function (t) { tone('square', 150, 120, t, 0.2, 0.08); },
    clue: function (t) { [880, 1108, 1318, 1760].forEach(function (f, i) { tone('triangle', f, 0, t + i * 0.07, 0.3, 0.09); }); },
    match: function (t) { [523, 659, 784, 1046].forEach(function (f, i) { tone('sine', f, 0, t + i * 0.09, 0.5, 0.11); }); },
    contra: function (t) { tone('sawtooth', 311, 0, t, 0.6, 0.08); tone('sawtooth', 330, 0, t, 0.6, 0.08); thump(t, 70, 0.25, A.fx); },
    miss: function (t) { tone('triangle', 330, 260, t, 0.25, 0.08); },
    page: function (t) { noise(t, 0.12, 0.06, 'highpass', 3000, A.fx); },
    mirror: function (t) {
      var c = A.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      s.buffer = A.noiseBuf; f.type = 'bandpass'; f.Q.value = 4; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(3500, t + 1.4);
      env(g, t, 0.3, 0.25, 1.6); s.connect(f); f.connect(g); g.connect(A.fx); s.start(t); s.stop(t + 1.7);
      [1200, 1500, 1800].forEach(function (fq, i) { tone('sine', fq, fq * 1.5, t + 0.2 + i * 0.15, 1.2, 0.04); });
    },
    gong: function (t) { [110, 153, 220, 281, 330, 412].forEach(function (f, i) { tone('sine', f, f * 0.995, t, 3.2 - i * 0.3, 0.12 / (i + 1) + 0.03); }); },
    chop: function (t) { noise(t, 0.12, 0.35, 'highpass', 1500, A.fx); thump(t + 0.01, 120, 0.35, A.fx); },
    flash: function (t) { noise(t, 0.04, 0.35, 'highpass', 5000, A.fx); tone('sine', 2600, 1800, t + 0.03, 0.25, 0.08); },
    knock: function (t) { [0, 0.28, 0.56].forEach(function (d) { thump(t + d, 190, 0.3, A.fx); noise(t + d, 0.03, 0.1, 'bandpass', 900, A.fx, 2); }); },
    creak: function (t) {
      var c = A.ctx, o = c.createOscillator(), lp = c.createBiquadFilter(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(85, t + 1);
      lfo.frequency.value = 22; lg.gain.value = 18; lfo.connect(lg); lg.connect(o.frequency);
      lp.type = 'lowpass'; lp.frequency.value = 900; env(g, t, 0.05, 0.07, 1.1);
      o.connect(lp); lp.connect(g); g.connect(A.fx); o.start(t); lfo.start(t); o.stop(t + 1.2); lfo.stop(t + 1.2);
    },
    fire: function (t) { noise(t, 1.8, 0.12, 'lowpass', 700, A.fx); for (var i = 0; i < 14; i++) noise(t + Math.random() * 1.6, 0.02, 0.18, 'highpass', 2500, A.fx); },
    splash: function (t) { noise(t, 0.7, 0.35, 'lowpass', 900, A.fx); noise(t + 0.05, 0.3, 0.12, 'highpass', 3000, A.fx); },
    bubble: function (t) { tone('sine', 260 + Math.random() * 120, 700, t, 0.07, 0.05); },
    caught: function (t) { tone('sawtooth', 220, 0, t, 0.8, 0.09); tone('sawtooth', 233, 0, t, 0.8, 0.09); thump(t, 50, 0.4, A.fx); },
    flicker: function (t) { for (var i = 0; i < 6; i++) tone('square', 100, 0, t + i * 0.35, 0.12, 0.05); },
    scare: function (t) { // tiếng hù: hợp âm chói trượt xuống + nhiễu + nện trầm
      tone('sawtooth', 880, 220, t, 0.9, 0.3); tone('sawtooth', 932, 233, t, 0.9, 0.26); tone('square', 1244, 311, t, 0.6, 0.12);
      noise(t, 0.8, 0.5, 'highpass', 1800, A.fx); thump(t, 60, 0.9, A.fx); thump(t + 0.02, 45, 0.7, A.fx);
    },
    whisper: function (t) { noise(t, 1.6, 0.06, 'bandpass', 1400, A.fx, 6); noise(t + 0.4, 1.2, 0.05, 'bandpass', 900, A.fx, 6); }
  };
  A.sfx = function (name) {
    if (!A.ctx || !pref.sfx || !SFX[name]) return;
    SFX[name](A.ctx.currentTime + 0.01);
  };

  // ---------- gắn tiếng động vào game ----------
  // tiếng bấm nút
  document.addEventListener('click', function (e) { if (e.target.closest('button')) A.sfx('click'); }, true);

  // tiếng theo dòng thoại: { mảng thoại: { số dòng: tiếng } }
  function tagLine(key, idx, name) { var L = G.TEXT[key]; if (L && L[idx]) L[idx].sfx = name; }
  [['door9_deliver', 1, 'creak'], ['gong', 0, 'gong'], ['chop', 0, 'chop'], ['fire', 0, 'fire'], ['cut_vy', 1, 'chop'], ['cut_vy', 2, 'flash'],
   ['chop_mom', 0, 'chop'], ['chop_mom', 3, 'splash'], ['knock', 0, 'knock'], ['footprints', 0, 'flicker'], ['stone', 4, 'bubble'],
   ['nen_tho', 3, 'whisper'], ['escape', 1, 'splash'], ['rang_end', 3, 'splash'], ['exit_cong', 0, 'splash'], ['mirror_voice', 0, 'whisper'],
   ['vy_scene', 0, 'knock'], ['ket_stall', 0, 'knock'], ['teaser', 0, 'splash'], ['ham_arrive', 0, 'bubble'], ['overheard', 0, 'whisper'],
   ['find_mirror', 1, 'mirror'], ['pin_back', 0, 'chop'], ['cong_open', 1, 'splash'], ['lever', 0, 'chop'], ['arrive96_6', 0, 'splash'],
   ['gieng', 1, 'whisper'], ['box_open', 0, 'page'], ['ledger', 0, 'page'], ['open_box', 0, 'page'], ['ban_vy', 0, 'page'], ['ban_ve_dinh', 0, 'page']
  ].forEach(function (x) { tagLine(x[0], x[1], x[2]); });
  A.onLine = function (l, lines, i) {
    if (i === 0 && lines.some(function (x) { return x.text && x.text.indexOf('Tải lại từ điểm lưu') >= 0; })) { A.sfx('caught'); return; }
    if (l.sfx) A.sfx(l.sfx); else A.sfx('blip');
  };

  // tiền vào túi / giao sai
  var serve0 = G.sell.serve;
  G.sell.serve = function () {
    var m = G.S.money, tray = G.sell.tray.length;
    serve0.apply(this, arguments);
    if (G.S.money > m) A.sfx('coin'); else if (tray) A.sfx('wrong');
  };
  // manh mối, đối chiếu
  var add0 = G.addClue;
  G.addClue = function (id, ex) { var r = add0(id, ex); if (r) A.sfx('clue'); return r; };
  var ded0 = G.tryDeduce;
  G.tryDeduce = function (t, e) { var r = ded0(t, e); A.sfx(r.ok ? (r.d.type === 'contra' ? 'contra' : 'match') : 'miss'); return r; };
  var nb0 = G.ui.notebook; G.ui.notebook = function () { A.sfx('page'); return nb0.apply(this, arguments); };

  // bước chân, qua gương, nước dâng
  var stepT = 0, lastEra, bubbleT = 0;
  var tick0 = G.tick;
  G.tick = function (dt) {
    if (tick0) tick0(dt);
    var S = G.S;
    if (G.world.player && G.world.player.el.classList.contains('walk')) { stepT -= dt; if (stepT <= 0) { stepT = 0.3; A.sfx('step'); } } else stepT = 0;
    if (S && lastEra !== undefined && (S.era || null) !== lastEra) A.sfx('mirror');
    if (S) lastEra = S.era || null;
    var fl = document.getElementById('flood');
    if (fl && !fl.hidden) { bubbleT -= dt; if (bubbleT <= 0) { bubbleT = 0.4 + Math.random() * 0.6; A.sfx('bubble'); } }
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.music-toggle').forEach(function (t) { t.addEventListener('click', function () { A.init(); A.setMusic(!pref.music); }); });
    var b = document.getElementById('btn-music');
    if (b) b.addEventListener('click', function () { A.init(); A.setMusic(!pref.music); });
    A.updateButton();
  });
})();
