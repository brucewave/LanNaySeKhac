// Bối cảnh sống động: ánh sáng ban đêm thật (trời tối, quanh đèn/cửa sổ/nến có quầng sáng), mặt nước gợn + bóng đèn,
// sương trên sông, đom đóm, thiêu thân quanh đèn, vệt nắng trong chợ, lá rơi, mưa phùn vài ngày.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var W = G.world;

  // ---------- ghi lại vị trí cột đèn khi dựng cảnh ----------
  var BP = G.scenes.Builder.prototype, lamp0 = BP.lamp, done0 = BP.done;
  BP.lamp = function (x, y) { (this._lights = this._lights || []).push({ lamp: true, x: x + 28, y: (y || 534) - 40, hx: x + 28, hy: (y || 534) - 154, r: 165, c: 'lamp' }); return lamp0.apply(this, arguments); };
  BP.done = function () { var sc = done0.apply(this, arguments); sc.lights = (this._lights || []).slice(); return sc; };
  var lastLights = [];
  Object.keys(G.scenes).forEach(function (k) {
    var f = G.scenes[k];
    if (typeof f !== 'function' || k === 'Builder' || k === 'rng' || !G.LOCATIONS[k]) return;
    G.scenes[k] = function () { var sc = f.apply(this, arguments); lastLights = sc.lights || []; return sc; };
  });

  // ---------- nguồn sáng đặt tay theo từng nơi (cửa sổ, nến, đèn lồng) ----------
  function L(x, y, r, c, f) { return { x: x, y: y, r: r, c: c || 'warm', f: f }; }
  var MAN = {
    nha: [L(350, 240, 230, 'room'), L(212, 92, 70, 'candle', 1), L(296, 92, 70, 'candle', 1), L(586, 302, 80, 'warm')],
    ben_song: [L(520, 450, 150, 'warm'), L(330, 420, 60, 'warm')],
    duong: [L(750, 450, 140, 'warm'), L(90, 470, 90, 'warm')],
    cho: [130, 200, 270, 340, 410, 480, 550, 620].map(function (x, i) { return L(x, 96 + Math.sin((i + 1) / 9 * Math.PI) * 24, 70, 'bulb'); }).concat([L(470, 420, 100, 'warm')]),
    dinh_nay: [L(480, 640, 90, 'lantern', 1), L(700, 470, 50, 'red', 1)],
    nha_96: [L(213, 95, 80, 'candle', 1), L(297, 95, 80, 'candle', 1), L(350, 250, 170, 'oil', 1)],
    ben_96: [L(668, 800, 100, 'lantern', 1), L(180, 420, 100, 'oil')],
    duong_96: [L(170, 250, 150, 'oil'), L(500, 560, 120, 'lantern', 1)],
    dinh_96: [L(414, 92, 90, 'candle', 1), L(506, 92, 90, 'candle', 1), L(480, 260, 210, 'oil'), L(380, 510, 110, 'lantern', 1), L(580, 510, 110, 'lantern', 1)]
      .concat([0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return L(80 + i * 100, 470, 70, 'red', 1); })),
    ham_96: [L(480, 70, 230, 'hole')]
  };
  var COLOR = { lamp: '245,198,110', warm: '240,180,95', room: '236,190,120', candle: '240,190,100', bulb: '226,226,200', lantern: '230,150,90', red: '200,70,60', oil: '220,170,100', hole: '200,190,150' };
  var WATER = { ben_song: 752, ben_96: 752, dinh_nay: 610, dinh_96: 610 };
  var TREES = { nha: [[650, 260]], ben_song: [[580, 230], [740, 200]], duong: [[60, 420]], dinh_96: [[60, 400]], dinh_nay: [[120, 200]] };

  // ---------- độ tối theo giờ ----------
  function rainy() { return false; } // đã bỏ mưa theo ý người chơi
  function darkness(S) {
    if (S.era) return S.loc === 'ham_96' ? 0.72 : 0.6;
    var m = S.min, d = 0;
    if (m < 7 * 60) d = 0.32 * Math.max(0, 1 - (m - 360) / 60);
    else if (m < 16 * 60 + 30) d = 0;
    else d = Math.min(0.72, (m - 990) / 180 * 0.72);
    if (rainy(S)) d = Math.min(0.7, d + 0.1);
    return d;
  }

  // ---------- lớp hiệu ứng trong thế giới (đi theo camera) ----------
  var amb = document.createElement('div'); amb.id = 'amb';
  var cv = document.createElement('canvas'); cv.className = 'amb-dark';
  var glows = document.createElement('div'); glows.className = 'amb-glow';
  var fx = document.createElement('div'); fx.className = 'amb-fx';
  amb.appendChild(fx); amb.appendChild(cv); amb.appendChild(glows);
  $('world').appendChild(amb);
  var rain = document.createElement('div'); rain.id = 'rain'; rain.hidden = true;
  $('stage').insertBefore(rain, $('tint').nextSibling);

  var lights = [], lastD = -1, loc = null, lastPX = 0, lastPY = 0;
  function draw(d) {
    var ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (d <= 0.005) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(4,8,18,' + d + ')';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.globalCompositeOperation = 'destination-out';
    var S = G.S, me = { x: S.x, y: S.y - 30, r: W.mode === 'sell' ? 300 : 190, k: 0.55 }; // quầng sáng nhẹ quanh mình: luôn thấy rõ chỗ đang đứng, hàng khách
    lights.concat([me]).forEach(function (l) {
      var k = l.k || 1, g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
      g.addColorStop(0, 'rgba(0,0,0,' + (0.95 * k) + ')'); g.addColorStop(0.45, 'rgba(0,0,0,' + (0.7 * k) + ')'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2); ctx.fill();
    });
  }
  function build() {
    var S = G.S, Lc = G.LOCATIONS[S.loc];
    loc = S.loc;
    lights = lastLights.concat(MAN[S.loc] || []);
    cv.width = Lc.width; cv.height = Lc.height;
    amb.style.width = Lc.width + 'px'; amb.style.height = Lc.height + 'px';
    // quầng sáng ấm
    glows.innerHTML = lights.map(function (l) {
      var c = COLOR[l.c] || COLOR.warm, s = 'left:' + (l.x - l.r) + 'px;top:' + (l.y - l.r) + 'px;width:' + (l.r * 2) + 'px;height:' + (l.r * 2) + 'px;' +
        'background:radial-gradient(circle,rgba(' + c + ',.5) 0,rgba(' + c + ',.2) 36%,rgba(' + c + ',0) 70%)';
      var head = l.lamp ? '<i class="g-head" style="left:' + (l.hx - 18) + 'px;top:' + (l.hy - 14) + 'px"></i>' : '';
      return '<i class="g' + (l.f ? ' flick' : '') + '" style="' + s + ';animation-delay:-' + (Math.random() * 3).toFixed(2) + 's"></i>' + head;
    }).join('');
    // nước, sương, đom đóm, thiêu thân, lá, vệt nắng
    var h = '', wy = WATER[S.loc];
    if (wy !== undefined) {
      h += '<div class="wave" style="top:' + wy + 'px;width:' + Lc.width + 'px;height:' + (Lc.height - wy) + 'px"></div>';
      lights.forEach(function (l) { if (l.lamp || l.c === 'lantern') h += '<i class="refl" style="left:' + (l.x - 10) + 'px;top:' + (wy + 8) + 'px;height:' + Math.min(140, Lc.height - wy - 10) + 'px"></i>'; });
      for (var m = 0; m < 4; m++) h += '<i class="mist" style="top:' + (wy - 30 + m * 26) + 'px;left:' + (m * 260 - 200) + 'px;animation-duration:' + (38 + m * 9) + 's;animation-delay:-' + (m * 7) + 's"></i>';
      for (var f = 0; f < 12; f++) h += '<i class="fly" style="left:' + Math.round(Math.random() * Lc.width) + 'px;top:' + Math.round(wy - 80 + Math.random() * 90) + 'px;animation-delay:-' + (Math.random() * 6).toFixed(1) + 's,-' + (Math.random() * 2).toFixed(1) + 's"></i>';
    }
    lights.forEach(function (l) {
      if (!l.lamp) return;
      for (var k = 0; k < 3; k++) h += '<i class="moth" style="left:' + l.hx + 'px;top:' + (l.hy + 4) + 'px;animation-duration:' + (1.6 + k * 0.5) + 's;animation-delay:-' + k + 's"></i>';
    });
    (TREES[S.loc] || []).forEach(function (t) {
      for (var k = 0; k < 3; k++) h += '<i class="leaf" style="left:' + (t[0] + k * 24 - 24) + 'px;top:' + (t[1] - 40) + 'px;animation-duration:' + (7 + k * 2.5) + 's;animation-delay:-' + (k * 3) + 's"></i>';
    });
    if (S.loc === 'cho') for (var r = 0; r < 4; r++) h += '<i class="ray" style="left:' + (110 + r * 150) + 'px;top:40px;animation-delay:-' + r + 's"></i>';
    fx.innerHTML = h;
    lastD = -1;
    update(true);
  }
  function update(force) {
    var S = G.S;
    if (!S || !G.LOCATIONS[S.loc]) return;
    if (S.loc !== loc) { build(); return; }
    var d = darkness(S);
    var moved = Math.abs(S.x - lastPX) + Math.abs(S.y - lastPY) > 3;
    if (force || moved || Math.abs(d - lastD) > 0.008) {
      draw(d); lastD = d; lastPX = S.x; lastPY = S.y;
      var night = Math.min(1, d * 1.6);
      amb.style.setProperty('--night', night.toFixed(3));
      amb.style.setProperty('--day', (1 - Math.min(1, d * 4)).toFixed(3));
    }
    var rn = rainy(S) && !S.era && S.loc !== 'nha';
    if (rain.hidden === rn) rain.hidden = !rn;
    amb.classList.toggle('raining', rn);
  }

  // ---------- móc vào game ----------
  var enter0 = G.onEnter;
  G.onEnter = function (id) { if (enter0) enter0(id); build(); if (rainy(G.S) && !G.S.era && !G.S.flags['rain_' + G.S.day]) { G.S.flags['rain_' + G.S.day] = 1; G.ui.toast('Trời mưa phùn, đường trơn.'); } };
  var acc = 0, tick0 = G.tick;
  G.tick = function (dt) {
    if (tick0) tick0(dt);
    acc += dt;
    var S = G.S;
    if (acc > 0.5 || (S && lastD > 0.005 && Math.abs(S.x - lastPX) + Math.abs(S.y - lastPY) > 3)) { acc = 0; update(); }
  };
  // lớp tối mới lo phần đêm: tông màu cũ chỉ còn ánh xanh nhẹ
  var tint0 = W.tint;
  W.tint = function () {
    tint0.apply(this, arguments);
    var S = G.S;
    if (S && !S.era && S.min >= 16 * 60) $('tint').style.background = 'rgba(20,32,56,' + (darkness(S) * 0.22).toFixed(3) + ')';
  };
  G.ambience = { rebuild: build, darkness: darkness };
})();
