// Lớp chi tiết cho mọi cảnh: mặt đường, đồ vật đường phố Việt Nam, mái nhà, sông nước, và chuyển động nhẹ.
// Cùng nét mực và bảng màu lạnh của mẫu v3. Đồ vật đặt tránh lối đi và chỗ tương tác (kiểm bằng PT.reach()).
var G = window.G || (window.G = {});

(function () {
  var h = G.scenes.h, INK = h.INK, ink = h.ink;
  var B = G.scenes.Builder.prototype;
  function R(x, y, w, hh, f, ex) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" fill="' + f + '"' + (ex || '') + '/>'; }
  function at(x, y, inner, sx) { return '<g transform="translate(' + x + ',' + y + ')' + (sx ? ' scale(' + sx + ',1)' : '') + '">' + inner + '</g>'; }
  function era() { return G.S && G.S.era; }
  function rnd(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }

  // ---------- họa cụ (vẽ quanh gốc 0,0 = chân đồ vật) ----------
  var P = {
    moto: function (col) {
      return '<ellipse cx="0" cy="2" rx="28" ry="5" fill="' + INK + '" opacity=".35" stroke="none"/>' +
        '<circle cx="-17" cy="-8" r="8" fill="#22262C"/><circle cx="18" cy="-8" r="8" fill="#22262C"/>' +
        '<circle cx="-17" cy="-8" r="2.5" fill="#8C949B" stroke-width="1.5"/><circle cx="18" cy="-8" r="2.5" fill="#8C949B" stroke-width="1.5"/>' +
        '<path d="M-22,-12 Q-10,-26 8,-22 L22,-16 L16,-10 H-14 Z" fill="' + (col || '#A32E36') + '"/>' +
        '<path d="M-14,-24 h18 v5 h-18 Z" fill="#22262C"/><path d="M14,-24 l5,-9 M15,-33 h9" fill="none" stroke-width="2.5"/>' +
        '<circle cx="22" cy="-18" r="2.5" fill="#E2D2A0" stroke-width="1.5"/>';
    },
    bike: function () {
      return '<ellipse cx="0" cy="2" rx="26" ry="4" fill="' + INK + '" opacity=".3" stroke="none"/>' +
        '<circle cx="-15" cy="-10" r="10" fill="none" stroke-width="2.5"/><circle cx="15" cy="-10" r="10" fill="none" stroke-width="2.5"/>' +
        '<path d="M-15,-10 L-4,-26 H10 L15,-10 M-4,-26 L2,-10 L10,-26 M10,-26 l3,-6 h6 M-8,-28 h8" fill="none" stroke="#3B4A5E" stroke-width="2.5"/>';
    },
    stool: function (col) {
      return '<path d="M-8,-12 h16 l-2,12 h-12 Z" fill="' + col + '"/>' + R(-9, -16, 18, 5, col, ' rx="2"') + '<path d="M-5,-4 h10" stroke-width="1.2"/>';
    },
    teaTable: function () {
      return R(-22, -20, 44, 10, '#3F6670', ' rx="2"') + '<path d="M-18,-10 v10 M18,-10 v10" stroke-width="3"/>' +
        R(-12, -28, 7, 9, '#948C5E', ' stroke-width="1.5"') + R(4, -28, 7, 9, '#948C5E', ' stroke-width="1.5"') +
        '<ellipse cx="0" cy="-22" rx="5" ry="3" fill="#C3CACD" stroke-width="1.5"/>';
    },
    plant: function (s) {
      s = s || 1;
      return '<path d="M-8,-12 h16 l-3,12 h-10 Z" fill="#6A4A3A"/>' +
        '<ellipse cx="-6" cy="-20" rx="8" ry="6" fill="#3F5A44"/><ellipse cx="6" cy="-22" rx="8" ry="7" fill="#4A6A50"/><ellipse cx="0" cy="-28" rx="7" ry="6" fill="#58755C"/>';
    },
    chum: function () {
      return '<ellipse cx="0" cy="2" rx="18" ry="4" fill="' + INK + '" opacity=".35" stroke="none"/>' +
        '<path d="M-14,0 Q-20,-18 -10,-30 H10 Q20,-18 14,0 Z" fill="#6A4A3A"/><ellipse cx="0" cy="-30" rx="11" ry="4" fill="#4A3532"/>' +
        '<path class="s" d="M6,-28 Q18,-16 12,0 H6 Q12,-14 6,-28 Z"/><path d="M4,-31 l12,-8" stroke="#857761" stroke-width="3"/>';
    },
    bin: function () {
      return R(-10, -24, 20, 24, '#3F6650', ' rx="3"') + R(-12, -28, 24, 6, '#2C5449', ' rx="2"') + '<path d="M-4,-18 v12M4,-18 v12" stroke-width="1.2"/>';
    },
    cat: function (col) {
      if (col === '#857761' && G.S && G.S.flags.cat_home) return ''; // mèo mướp đã theo mình về, không còn nằm ở đây
      if (G.art.cat) return G.art.cat({ coat: col || '#4B5560', stripes: col === '#857761' }); // mèo vẽ chi tiết (leftover.js)
      return '<g class="breathe"><ellipse cx="0" cy="-6" rx="13" ry="7" fill="' + (col || '#4B5560') + '"/><circle cx="10" cy="-10" r="6" fill="' + (col || '#4B5560') + '"/>' +
        '<path d="M7,-15 l2,-5 l3,4 M12,-15 l2,-5 l2,5" fill="' + (col || '#4B5560') + '" stroke-width="1.5"/>' +
        '<path d="M9,-10 h3" stroke-width="1.2"/><path d="M-12,-4 q-6,4 2,6" fill="none" stroke-width="2"/></g>';
    },
    chicken: function (col) {
      return '<ellipse cx="0" cy="-7" rx="8" ry="6" fill="' + (col || '#D5DCE0') + '"/><circle cx="7" cy="-12" r="4" fill="' + (col || '#D5DCE0') + '"/>' +
        '<path d="M6,-17 q2,-3 3,0" fill="#A32E36" stroke-width="1.2"/><path d="M11,-12 l3,1 l-3,1" fill="#E2B060" stroke-width="1"/><path d="M-2,-1 v3M2,-1 v3" stroke-width="1.5"/>';
    },
    straw: function () {
      return '<ellipse cx="0" cy="-16" rx="30" ry="20" fill="#948C5E"/><path d="M-22,-14 q10,-6 20,0 M-6,-26 q10,-6 20,0 M0,-8 q10,-6 20,0" fill="none" stroke="#6A6040" stroke-width="1.5"/>';
    },
    tank: function () { // bồn nước inox trên mái
      return '<path d="M-14,2 v-6 M14,2 v-6" stroke-width="3"/>' + R(-18, -30, 36, 26, '#C3CACD', ' rx="4"') +
        '<ellipse cx="0" cy="-30" rx="18" ry="5" fill="#D5DCE0"/><path d="M-18,-20 h36" stroke="#8C949B" stroke-width="1.5"/><path class="s" d="M8,-30 h10 v26 h-10 Z"/>';
    },
    antenna: function () { return '<path d="M0,0 V-34 M-12,-28 h24 M-9,-20 h18 M-6,-12 h12" fill="none" stroke-width="2"/>'; },
    laundry: function (w) {
      var s = '<path d="M0,0 Q' + w / 2 + ',10 ' + w + ',0" fill="none" stroke-width="1.5"/>', cols = ['#A32E36', '#C3CACD', '#3F6670', '#948C5E', '#6F86A0'];
      for (var i = 1; i < 5; i++) { var x = w * i / 5, y = 8 * Math.sin(i / 5 * Math.PI); s += R(x - 7, y, 14, 14 + (i % 2) * 6, cols[i], ' stroke-width="1.5"'); }
      return s;
    },
    ac: function () { return R(-14, -14, 28, 18, '#C3CACD', ' stroke-width="2"') + '<circle cx="-4" cy="-5" r="6" fill="#8C949B" stroke-width="1.5"/><path d="M6,-10 h6M6,-6 h6M6,-2 h6" stroke-width="1"/>'; },
    meter: function () { return R(-7, -10, 14, 16, '#4B5560', ' stroke-width="1.5"') + '<circle cx="0" cy="-3" r="4" fill="#D5DCE0" stroke-width="1"/>'; },
    sticker: function () { // tờ quảng cáo "khoan cắt bê tông" dán cửa cuốn
      return R(-16, -9, 32, 18, '#E6E2D6', ' stroke-width="1"') + '<path d="M-12,-4 h24M-12,1 h18" stroke="#A32E36" stroke-width="2"/><path d="M-12,5 h14" stroke="#4B5560" stroke-width="1"/>';
    },
    crate: function (col) { return R(-14, -20, 28, 20, col || '#3F6670', ' stroke-width="2"') + '<path d="M-14,-10 h28M-5,-20 v20M5,-20 v20" stroke-width="1.2"/>'; },
    puddle: function (w) { return '<ellipse cx="0" cy="0" rx="' + w + '" ry="' + (w / 3.2) + '" fill="#26384A" opacity=".75" stroke="none"/><path d="M' + (-w * 0.5) + ',-2 h' + (w * 0.4) + '" stroke="#6F86A0" stroke-width="1.5" opacity=".8"/>'; },
    manhole: function () { return '<ellipse cx="0" cy="0" rx="16" ry="9" fill="#262C35"/><path d="M-10,-3 h20M-12,1 h24M-9,5 h18" stroke="#3A4552" stroke-width="1.5"/>'; },
    grate: function () { return R(-14, -4, 28, 8, '#1B222C', ' stroke-width="1.5"') + '<path d="M-9,-4 v8M-3,-4 v8M3,-4 v8M9,-4 v8" stroke="#3A4552" stroke-width="1.5"/>'; },
    crack: function () { return '<path d="M-18,0 l8,-3 l5,4 l9,-5 l6,3 l8,-2" fill="none" stroke="#1B222C" stroke-width="1.5"/>'; },
    tuft: function () { return '<path d="M-4,0 q-2,-8 -5,-11 M0,0 q0,-9 1,-13 M4,0 q2,-7 6,-9" fill="none" stroke="#58755C" stroke-width="2"/>'; },
    leaf: function (r, c) { return '<ellipse cx="0" cy="0" rx="4" ry="2" fill="' + c + '" stroke-width="1" transform="rotate(' + (r * 180 | 0) + ')"/>'; },
    bag: function () { return '<path d="M-6,0 l-2,-10 q8,-4 16,0 l-2,10 Z" fill="#D5DCE0" stroke-width="1.5" opacity=".85"/>'; },
    lucbinh: function () { // cụm lục bình trôi
      return '<g class="bob"><ellipse cx="0" cy="0" rx="22" ry="7" fill="#2C4A3A" opacity=".8" stroke="none"/>' +
        '<ellipse cx="-8" cy="-3" rx="8" ry="5" fill="#3F6A50"/><ellipse cx="6" cy="-4" rx="9" ry="5" fill="#4A7A58"/><ellipse cx="0" cy="-8" rx="6" ry="4" fill="#58855E"/>' +
        '<circle cx="2" cy="-12" r="3" fill="#A08CB4" stroke-width="1.2"/><circle cx="-3" cy="-11" r="2.5" fill="#B49CC4" stroke-width="1"/></g>';
    },
    lo: function () { // lờ bắt cá bằng tre
      return '<path d="M-16,0 L16,-6 L16,6 Z" fill="#857761"/><path d="M-8,-2 L8,-5 M-8,2 L8,5 M0,-4 v8 M8,-5 v10" fill="none" stroke="#6A5846" stroke-width="1.2"/>';
    },
    net: function (w) {
      var s = '<path d="M0,0 V-46 M' + w + ',0 V-46" stroke-width="3"/><path d="M0,-44 Q' + w / 2 + ',-30 ' + w + ',-44 V-14 Q' + w / 2 + ',-2 0,-14 Z" fill="#8C949B" fill-opacity=".25" stroke-width="1.5"/>';
      for (var i = 1; i < 6; i++) s += '<path d="M' + (w * i / 6) + ',-40 v26" stroke="#8C949B" stroke-width=".8"/>';
      return s;
    },
    beam: function (len, rot) { return '<g transform="rotate(' + rot + ')">' + R(0, -6, len, 12, '#1E1A18') + '<path d="M6,-2 h' + (len * 0.6) + '" stroke="#3A2826" stroke-width="2"/></g>'; },
    tiles: function () { return '<path d="M-10,0 l8,-6 l10,4 l-6,6 Z" fill="#4A3532" stroke-width="1.2"/><path d="M6,-2 l8,-4 l6,4 l-8,4 Z" fill="#5A3F38" stroke-width="1.2"/>'; },
    couplet: function () { return R(-7, -60, 14, 60, '#A32E36', ' stroke-width="1.5"') + '<path d="M-3,-52 h6M-3,-42 h6M-3,-32 h6M-3,-22 h6M-3,-12 h6" stroke="#E2B060" stroke-width="2"/>'; },
    urn: function () { return '<path d="M-14,0 h28 l-4,-14 h-20 Z" fill="#6A5846"/><ellipse cx="0" cy="-14" rx="12" ry="4" fill="#4A4038"/><path d="M-3,-14 v-16M2,-14 v-18M6,-14 v-14" stroke="#C3CACD" stroke-width="1.2"/>'; },
    bananas: function () { return '<path d="M0,-30 v8" stroke-width="2"/><path d="M-8,-22 q-4,12 4,18 M-2,-22 q-2,14 6,18 M4,-22 q2,12 8,14" fill="none" stroke="#C8B060" stroke-width="5"/>'; },
    fishTub: function () { return '<ellipse cx="0" cy="-6" rx="18" ry="8" fill="#3F6670"/><ellipse cx="0" cy="-8" rx="14" ry="5" fill="#26384A"/><path d="M-6,-9 l6,2 l-6,2 M2,-9 l6,2 l-6,2" fill="#8C949B" stroke-width="1"/>'; },
    scale: function () { return R(-10, -6, 20, 6, '#8C949B', ' stroke-width="1.5"') + '<ellipse cx="0" cy="-10" rx="10" ry="3" fill="#C3CACD" stroke-width="1.5"/><circle cx="0" cy="-2" r="2" fill="#A32E36" stroke="none"/>'; },
    roots: function () { return '<path d="M0,0 q4,16 -2,30 q-3,10 2,18 M6,0 q-2,10 4,20" fill="none" stroke="#3A3430" stroke-width="2.5"/>'; }
  };

  // ---------- gắn đồ vào cảnh đã dựng ----------
  function prop(sc, x, y, inner, z, solid, noInk) {
    var w = 120, hh = 110, x0 = x - 60, y0 = y - 100;
    sc.props.push({ x: x0, y: y0, w: w, h: hh, z: z === undefined ? y : z,
      svg: '<svg class="prop" viewBox="' + x0 + ' ' + y0 + ' ' + w + ' ' + hh + '" width="' + w + '" height="' + hh + '" overflow="visible">' +
        (noInk ? inner : ink(inner)) + '</svg>' });
    if (solid) sc.solids.push(solid);
  }
  function put(sc, name, x, y, arg, solidW, solidH, flip) {
    prop(sc, x, y, at(x, y, P[name](arg), flip), y, solidW ? [x - solidW / 2, y - (solidH || 10), solidW, solidH || 10] : null);
  }
  function bg(sc, inner) { h.addBg(sc, inner); }
  function fx(sc, x, y, w, hh, inner, z, cls) { // chuyển động không qua bộ lọc nét run (nhẹ máy)
    sc.props.push({ x: x, y: y, w: w, h: hh, z: z || 4000,
      svg: '<svg class="prop fx ' + (cls || '') + '" viewBox="' + x + ' ' + y + ' ' + w + ' ' + hh + '" width="' + w + '" height="' + hh + '" overflow="visible">' + inner + '</svg>' });
  }
  function smoke(sc, x, y, z) {
    var s = '';
    for (var i = 0; i < 3; i++) s += '<path class="smk" style="animation-delay:' + (-i * 1.3) + 's" d="M' + x + ',' + y + ' q-6,-14 2,-26 q8,-12 0,-26" fill="none" stroke="#B9C6CC" stroke-width="2" stroke-linecap="round"/>';
    fx(sc, x - 20, y - 80, 40, 90, s, z || y + 1);
  }
  function fireflies(sc, x, y, w, hh, n) {
    var s = '', r = rnd(x + y);
    for (var i = 0; i < n; i++) s += '<circle class="ff" style="animation-delay:' + (-r() * 3).toFixed(2) + 's;animation-duration:' + (2 + r() * 2).toFixed(2) + 's" cx="' + (x + r() * w).toFixed(0) + '" cy="' + (y + r() * hh).toFixed(0) + '" r="2.2" fill="#F2E28A"/>';
    fx(sc, x, y, w, hh, s, 4500, 'nightonly');
  }
  function drips(sc, xs) {
    var s = '';
    xs.forEach(function (p, i) { s += '<circle class="drip" style="animation-delay:' + (-i * 0.7) + 's" cx="' + p[0] + '" cy="' + p[1] + '" r="2.5" fill="#6F86A0"/>'; });
    fx(sc, 0, 40, 960, 500, s, 4500);
  }
  function scatter(sc, W, y0, y1, n, seed, painters) {
    var r = rnd(seed), s = '';
    for (var i = 0; i < n; i++) {
      var x = (r() * W) | 0, y = (y0 + r() * (y1 - y0)) | 0, k = painters[(r() * painters.length) | 0];
      s += at(x, y, k(r));
    }
    bg(sc, s);
  }
  var LEAF = function (r) { return P.leaf(r(), ['#58755C', '#857761', '#948C5E', '#6A5846'][(r() * 4) | 0]); };

  // ---------- nâng chung: mặt đường, mái nhà, cây, đèn ----------
  var streets0 = B.streets;
  B.streets = function (south) {
    streets0.call(this, south);
    var W = this.W, r = rnd(W + (south ? 7 : 3)), s = R(0, 540, W, 120, 'url(#asph)', ' stroke="none"');
    s += R((r() * 600) | 0, 560, 120, 34, '#1E242C', ' stroke="none"') + R((r() * 600) | 0, 610, 90, 28, '#1C2129', ' stroke="none"');
    for (var x = 90; x < W; x += 210) s += at(x, 538, P.grate());
    for (var i = 0; i < 6; i++) s += at((r() * W) | 0, (440 + r() * 90) | 0, P.crack());
    for (var j = 0; j < 9; j++) s += at((r() * W) | 0, 534 + (r() < 0.5 ? 0 : 128), P.tuft());
    this.bg += ink(s);
  };
  var closed0 = B.closed;
  B.closed = function (x, y, w, hh, o) {
    closed0.call(this, x, y, w, hh, o);
    var roofH = hh - 72, s = '', past = era(), fy = y + hh - 72, r = rnd(x * 7 + y);
    if (w > 70 && roofH > 80) {
      if (!past) {
        s += at(x + w * 0.7, y + 46, P.tank());
        if (w > 160) s += at(x + w * 0.28, y + 40, P.antenna());
        if (w > 200 && r() < 0.6) s += at(x + 20, y + roofH * 0.6, P.laundry(Math.min(110, w * 0.4)));
        if (r() < 0.7) s += at(x + w * 0.45, y + roofH - 14, P.plant());
      } else if (r() < 0.6) s += at(x + w * 0.6, y + roofH * 0.5, P.straw());
    }
    if (!past && w > 70) {
      s += at(x + 12, fy + 30, P.meter());
      if (o && o.shutter) { s += at(x + w * 0.3, fy + 40, P.sticker()); if (w > 200) s += at(x + w * 0.72, fy + 52, P.sticker()); }
      else if (w > 100) s += at(x + w - 30, fy - 10, P.ac());
    }
    this.bg += ink(s);
  };
  var south0 = B.southRoofs;
  B.southRoofs = function (r0) {
    south0.call(this, r0);
    var r = rnd(this.W + 11), s = '', past = era();
    for (var x = 60; x < this.W; x += 150 + ((r() * 120) | 0)) {
      if (past) { if (r() < 0.4) s += at(x, 790, P.straw()); }
      else s += at(x, 786, r() < 0.5 ? P.tank() : (r() < 0.5 ? P.antenna() : P.plant()));
    }
    this.bg += ink(s);
  };
  // cây: tán đung đưa, lá rụng quanh gốc
  B.tree = function (x, y) {
    this.bg += '<ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="70" ry="22" fill="' + INK + '" opacity=".35"/>';
    var r = rnd(x + y), lv = '';
    for (var i = 0; i < 10; i++) lv += at(x - 60 + r() * 120, y - 10 + r() * 24, LEAF(r));
    this.bg += ink(lv);
    this.prop(x - 90, y - 200, 180, 206,
      '<path d="M' + x + ',' + y + ' Q' + (x - 6) + ',' + (y - 50) + ' ' + x + ',' + (y - 90) + '" fill="none" stroke-width="20"/>' +
      '<path d="M' + x + ',' + y + ' Q' + (x - 6) + ',' + (y - 50) + ' ' + x + ',' + (y - 90) + '" fill="none" stroke="#4A4038" stroke-width="13"/>' +
      '<path d="M' + (x + 2) + ',' + (y - 40) + ' q6,-4 8,-12" fill="none" stroke="#3A3430" stroke-width="2"/>' +
      '<g class="sway">' +
      '<ellipse cx="' + x + '" cy="' + (y - 120) + '" rx="74" ry="52" fill="#2C3A33"/>' +
      '<ellipse cx="' + (x - 34) + '" cy="' + (y - 96) + '" rx="40" ry="26" fill="#2C3A33"/>' +
      '<ellipse cx="' + (x + 30) + '" cy="' + (y - 150) + '" rx="34" ry="22" fill="#34463C"/>' +
      '<path d="M' + (x - 40) + ',' + (y - 130) + ' q10,-8 20,0 M' + (x + 4) + ',' + (y - 108) + ' q10,-8 20,0 M' + (x - 10) + ',' + (y - 156) + ' q10,-8 20,0" fill="none" stroke="#3F5A44" stroke-width="2"/>' +
      '<path class="s" d="M' + (x + 30) + ',' + (y - 168) + ' Q' + (x + 84) + ',' + (y - 130) + ' ' + (x + 60) + ',' + (y - 88) + ' Q' + (x + 40) + ',' + (y - 76) + ' ' + (x + 20) + ',' + (y - 80) + ' Q' + (x + 60) + ',' + (y - 120) + ' ' + (x + 30) + ',' + (y - 168) + ' Z"/></g>', y);
    this.solid(x - 12, y - 10, 24, 14);
  };

  // ---------- chi tiết riêng từng cảnh ----------
  function wrap(id, fn) { var f0 = G.scenes[id]; G.scenes[id] = function (W, H) { var sc = f0(W, H); fn(sc, W, H); return sc; }; }

  function roadLife(sc, W, seed) {
    var r = rnd(seed);
    bg(sc, at(200 + r() * 200, 600, P.puddle(30)) + at(640 + r() * 200, 628, P.puddle(22)) + at(120 + r() * 700, 586, P.manhole()) +
      at(300 + r() * 400, 650, P.bag()));
    scatter(sc, W, 440, 720, 18, seed, [LEAF]);
  }

  wrap('nha', function (sc, W) {
    bg(sc, R(190, 256, 130, 76, '#5A2A2A', ' rx="4"') + R(198, 262, 114, 64, 'none', ' stroke="#948C5E" stroke-width="1.5"') +
      '<circle cx="390" cy="78" r="12" fill="#D5DCE0" stroke-width="2"/><path d="M390,78 v-7 M390,78 h5" stroke-width="1.5"/>' +
      at(244, 414, '<ellipse cx="0" cy="0" rx="6" ry="3" fill="#4A4038" stroke-width="1"/><ellipse cx="12" cy="1" rx="6" ry="3" fill="#4A4038" stroke-width="1"/>') +
      R(470, 96, 80, 8, '#4A3532'));
    put(sc, 'chum', 878, 404, null, 30, 12);
    put(sc, 'plant', 206, 452, null, 16, 8); put(sc, 'plant', 314, 452, null, 16, 8);
    put(sc, 'moto', 470, 470, '#3F6670', 46, 10);
    put(sc, 'bin', 120, 470, null, 18, 8);
    put(sc, 'cat', 160, 528, '#6F7C88');
    prop(sc, 640, 200, at(640, 186, P.laundry(130)), 1000);
    roadLife(sc, W, 11);
  });
  wrap('nha_96', function (sc, W) {
    bg(sc, R(190, 256, 130, 76, '#4A4038', ' rx="4"') + R(198, 262, 114, 64, 'none', ' stroke="#857761" stroke-width="1.5"'));
    put(sc, 'chum', 878, 404, null, 30, 12);
    put(sc, 'straw', 720, 210, null, 50, 16);
    put(sc, 'chicken', 760, 410); put(sc, 'chicken', 800, 425, '#857761');
    put(sc, 'bike', 470, 470, null, 40, 8);
    prop(sc, 640, 200, at(640, 186, P.laundry(130)), 1000);
    smoke(sc, 255, 262, 330);
  });
  wrap('duong', function (sc, W) {
    bg(sc, R(40, 300, 26, 40, '#A32E36') + R(70, 306, 26, 34, '#3F6670') + R(40, 280, 56, 22, '#948C5E') +
      R(110, 150, 120, 10, '#4A3532') + at(250, 130, P.bananas()));
    put(sc, 'teaTable', 74, 462, null, 40, 8); put(sc, 'stool', 44, 470, '#A32E36', 16, 6); put(sc, 'stool', 104, 472, '#3F6670', 16, 6);
    put(sc, 'moto', 214, 524, '#A32E36', 46, 10); put(sc, 'moto', 862, 524, '#6F86A0', 46, 10, -1);
    put(sc, 'bin', 700, 710, null, 18, 8); put(sc, 'plant', 900, 714);
    put(sc, 'cat', 360, 718, '#857761');
    var birds = '';
    [[500, 436], [528, 442], [560, 446], [700, 442], [736, 438]].forEach(function (b) { birds += '<path d="M' + (b[0] - 5) + ',' + b[1] + ' q5,-6 5,0 q0,-6 5,0" fill="#1B222C" stroke="none"/>'; });
    fx(sc, 400, 400, 400, 80, birds, 4600);
    roadLife(sc, W, 23);
  });
  wrap('duong_96', function (sc, W) {
    put(sc, 'bike', 214, 524, null, 40, 8);
    put(sc, 'chicken', 520, 600); put(sc, 'chicken', 548, 612, '#857761');
    put(sc, 'straw', 860, 712, null, 50, 16);
    smoke(sc, 260, 140, 300);
  });
  wrap('cho', function (sc, W) {
    put(sc, 'fishTub', 590, 404, null, 34, 10);
    put(sc, 'crate', 160, 410, '#3F6670', 28, 10); put(sc, 'crate', 190, 404, '#A32E36', 28, 10);
    put(sc, 'crate', 736, 448, '#58755C', 28, 10);
    put(sc, 'moto', 150, 702, '#3F6670', 46, 10); put(sc, 'moto', 236, 702, '#A32E36', 46, 10);
    put(sc, 'bin', 410, 708, null, 18, 8);
    var bulbs = '<path d="M60,90 Q380,120 690,90" fill="none" stroke="#0F141B" stroke-width="1.5"/>';
    for (var i = 1; i < 9; i++) bulbs += '<circle cx="' + (60 + i * 70) + '" cy="' + (90 + Math.sin(i / 9 * Math.PI) * 24) + '" r="4" fill="#E2E8EA" class="bulb"/>';
    fx(sc, 40, 70, 680, 60, bulbs, 3000);
    smoke(sc, 600, 360, 380);
    roadLife(sc, W, 37);
  });
  function riverLife(sc, past) {
    [[180, 806], [420, 852], [560, 790], [900, 810], [820, 870]].forEach(function (p, i) { put(sc, 'lucbinh', p[0], p[1]); });
    put(sc, 'lo', 726, 742); put(sc, 'lo', 650, 880);
    prop(sc, 60, 696, at(60, 696, P.net(110)), 696, [56, 688, 8, 10]);
    sc.solids.push([166, 688, 8, 10]);
    var reeds = '', r = rnd(5);
    for (var i = 0; i < 18; i++) { var x = 20 + r() * 600; reeds += at(x, 756 + r() * 10, P.tuft()); }
    bg(sc, reeds);
    fireflies(sc, 40, 720, 600, 90, 14);
  }
  wrap('ben_song', function (sc, W) {
    put(sc, 'teaTable', 556, 456, null, 40, 8); put(sc, 'stool', 528, 466, '#A32E36', 14, 6); put(sc, 'stool', 584, 466, '#3F6670', 14, 6);
    put(sc, 'moto', 300, 470, '#58755C', 46, 10);
    put(sc, 'cat', 600, 540, '#4B5560');
    riverLife(sc, false);
    roadLife(sc, W, 51);
  });
  wrap('ben_96', function (sc, W) { riverLife(sc, true); put(sc, 'chicken', 520, 470); put(sc, 'straw', 880, 470, null, 50, 14); });
  wrap('dinh_nay', function (sc, W) {
    bg(sc, at(200, 150, P.beam(170, 12)) + at(300, 260, P.beam(130, -18)) + at(620, 250, P.beam(90, 30)) +
      at(240, 330, P.tiles()) + at(560, 320, P.tiles()) + at(360, 120, P.tiles()) + at(650, 200, P.tiles()));
    scatter(sc, W, 380, 600, 24, 61, [function () { return P.tuft(); }, LEAF]);
    scatter(sc, 700, 60, 350, 12, 62, [function () { return P.tuft(); }]);
    smoke(sc, 600, 104, 200);
    fireflies(sc, 40, 600, 800, 60, 10);
  });
  wrap('dinh_96', function (sc, W) {
    var S = G.S;
    put(sc, 'couplet', 392, 340); put(sc, 'couplet', 528, 340);
    put(sc, 'urn', 460, 156);
    smoke(sc, 460, 136, 160);
    if (!S || S.pnight !== 2) put(sc, 'stool', 720, 470, '#A32E36', 14, 6);
    fireflies(sc, 40, 600, 880, 50, 8);
  });
  wrap('ham_96', function (sc, W) {
    var rt = '';
    [[120, 100], [300, 100], [640, 100], [760, 100], [880, 100]].forEach(function (p) { rt += at(p[0], p[1], P.roots()); });
    bg(sc, rt + at(300, 470, P.puddle(26)) + at(700, 200, P.puddle(20)) + at(820, 470, P.puddle(30)));
    drips(sc, [[300, 110], [650, 120], [760, 108], [180, 130]]);
  });
})();
