// Tranh cận cảnh vẽ lại chi tiết hơn + lớp chung cho mọi tranh (hạt phim, tối viền, ánh sáng hắt).
// Ghi đè G.CLOSEUPS (closeups.js) theo từng tên; tranh nào không ghi đè vẫn được thêm lớp chung.
var G = window.G || (window.G = {});

(function () {
  var INK = '#0F141B';
  var DEFS = '<defs>' +
    '<radialGradient id="cuVig" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>' +
    '<linearGradient id="cuLight" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4D6" stop-opacity=".14"/><stop offset=".5" stop-color="#FFF4D6" stop-opacity="0"/></linearGradient>' +
    '<pattern id="cuGrain" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#fff" opacity=".08"/><circle cx="4" cy="3.5" r=".5" fill="#000" opacity=".18"/><circle cx="2.5" cy="5" r=".4" fill="#fff" opacity=".05"/></pattern>' +
    '<pattern id="cuWood" width="60" height="18" patternUnits="userSpaceOnUse"><rect width="60" height="18" fill="#3B2E26"/><path d="M0,6 q15,-3 30,0 t30,0 M0,13 q20,3 40,0 t20,0" fill="none" stroke="#2E2420" stroke-width="1.2"/></pattern>' +
    '<radialGradient id="cuGlow"><stop offset="0" stop-color="#F2C26A" stop-opacity=".55"/><stop offset="1" stop-color="#F2C26A" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="cuSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E1A16"/><stop offset="1" stop-color="#3A3228"/></linearGradient>' +
    '<linearGradient id="cuMirror" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5A7A88"/><stop offset=".5" stop-color="#1B2A36"/><stop offset="1" stop-color="#2F4F5C"/></linearGradient>' +
    '</defs>';
  var OVER = '<rect width="520" height="300" fill="url(#cuLight)" stroke="none"/><rect width="520" height="300" fill="url(#cuGrain)" stroke="none"/><rect width="520" height="300" fill="url(#cuVig)" stroke="none"/>';
  function wrap(inner, bg) {
    return '<svg viewBox="0 0 520 300" width="520" height="300">' + DEFS + '<rect width="520" height="300" fill="' + (bg || '#1B222C') + '"/>' +
      '<g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#w)">' + inner + '</g>' + OVER + '</svg>';
  }
  function R(x, y, w, h, f, ex) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (ex || '') + '/>'; }
  function T(x, y, size, fill, t, anchor, weight, extra) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '" stroke="none" text-anchor="' + (anchor || 'start') + '" font-weight="' + (weight || 600) +
      '" font-family="Segoe UI, Arial, sans-serif"' + (extra || '') + '>' + t + '</text>';
  }
  function scrib(x, y, w, n, gap, col) {
    var s = '';
    for (var i = 0; i < n; i++) { var yy = y + i * (gap || 16), ww = w * (0.6 + ((i * 37) % 40) / 100); s += '<path d="M' + x + ',' + yy + ' q' + (ww / 8) + ',-5 ' + (ww / 4) + ',0 t' + (ww / 4) + ',0 t' + (ww / 4) + ',0 t' + (ww / 4) + ',0" fill="none" stroke="' + (col || '#4B5560') + '" stroke-width="1.6"/>'; }
    return s;
  }
  function chibi(look, x, y, sc, flip) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + ((flip || 1) * sc) + ',' + sc + ')">' + G.art.chibi(look).replace('<svg class="chibi', '<svg x="-80" y="-178" class="chibi') + '</g>';
  }
  function shadow(x, y, w, h, rot) { return R(x + 8, y + 10, w, h, '#000', ' opacity=".45" stroke="none"' + (rot ? ' transform="rotate(' + rot + ' ' + (x + w / 2) + ' ' + (y + h / 2) + ')"' : '')); }
  function flame(x, y, s) { s = s || 1; return '<circle cx="' + x + '" cy="' + (y - 6 * s) + '" r="' + (26 * s) + '" fill="url(#cuGlow)" stroke="none"/><path d="M' + x + ',' + (y - 16 * s) + ' q' + (7 * s) + ',' + (9 * s) + ' 0,' + (16 * s) + ' q-' + (7 * s) + ',-' + (7 * s) + ' 0,-' + (16 * s) + ' z" fill="#F2C230" stroke="#A32E36" stroke-width="1.5"/>'; }
  function stamp(x, y, r, t) { return '<g transform="rotate(-12 ' + x + ' ' + y + ')" opacity=".75"><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="#B0303A" stroke-width="3"/><circle cx="' + x + '" cy="' + y + '" r="' + (r - 6) + '" fill="none" stroke="#B0303A" stroke-width="1.5"/>' + T(x, y + 4, 9, '#B0303A', t, 'middle', 800) + '</g>'; }

  var C = G.CLOSEUPS, base = {};
  Object.keys(C).forEach(function (k) { base[k] = C[k]; });

  // ---------- Bàn thờ: câu đối đỏ, khám thờ, ảnh mẹ, nến sáng, khói nhang, hoa cúc, mâm quả ----------
  C.ban_tho = function () {
    var p = R(0, 0, 520, 300, '#2A2420') + R(0, 206, 520, 94, 'url(#cuWood)');
    p += R(60, 24, 30, 170, '#8A1E26', ' stroke-width="2"') + R(430, 24, 30, 170, '#8A1E26', ' stroke-width="2"') + scrib(66, 44, 18, 8, 18, '#C9A84A'); // câu đối
    p += R(150, 10, 220, 20, '#5A3F38', ' stroke-width="2"') + '<path d="M150,10 q110,-18 220,0" fill="#4A3532" stroke-width="2"/>';
    p += R(160, 28, 200, 140, '#4A3532');
    p += R(200, 38, 120, 120, '#B89A4A', ' stroke-width="2.5"') + R(210, 48, 100, 100, '#C3CACD', ' stroke-width="2"');
    p += '<g filter="url(#sepia)">' + R(214, 52, 92, 92, '#6F7880', ' stroke="none"') + chibi({ hair: 'long', shirt: '#A32E36', eyes: 'flat', prop: 'fan' }, 250, 142, 0.46) +
      R(268, 112, 34, 24, '#6A5846', ' stroke-width="2"') + '</g>';
    p += R(110, 160, 300, 18, '#6A4A40', ' stroke-width="2.5"') + '<path d="M110,178 h300 v14 q-37,12 -75,0 t-75,0 t-75,0 t-75,0 z" fill="#A32E36" stroke-width="2.5"/><path d="M112,190 h296" stroke="#C9A84A" stroke-width="2" stroke-dasharray="4 4"/>';
    p += '<path d="M236,160 q24,16 48,0 l-4,-14 h-40 z" fill="#857761" stroke-width="2"/>' + R(234, 140, 52, 8, '#9C7A3C', ' stroke-width="2"');   // bát nhang
    [252, 260, 268].forEach(function (x, i) { p += '<path d="M' + x + ',146 l' + (i - 1) * 3 + ',-34" stroke="#A32E36" stroke-width="2.5"/><circle cx="' + (x + (i - 1) * 3) + '" cy="111" r="2.5" fill="#F2A040" stroke="none"/>'; });
    for (var s = 0; s < 3; s++) p += '<path class="cu-smoke" style="animation-delay:-' + s * 1.3 + 's" d="M260,108 q-10,-16 0,-32 q10,-16 -2,-34" fill="none" stroke="#C3CACD" stroke-width="3" opacity="0"/>';
    p += R(140, 128, 12, 32, '#A32E36', ' stroke-width="2"') + R(368, 128, 12, 32, '#A32E36', ' stroke-width="2"') + flame(146, 126) + flame(374, 126);
    p += R(172, 120, 16, 40, '#3F6670', ' rx="5" stroke-width="2"');
    for (var f = 0; f < 5; f++) p += '<circle cx="' + (168 + (f % 3) * 10) + '" cy="' + (112 - Math.floor(f / 3) * 10) + '" r="7" fill="#E2B030" stroke-width="1.5"/>';  // lọ hoa cúc
    p += '<ellipse cx="342" cy="158" rx="26" ry="7" fill="#D5DCE0" stroke-width="2"/><circle cx="332" cy="148" r="8" fill="#C98A4A" stroke-width="1.5"/><circle cx="348" cy="146" r="8" fill="#A32E36" stroke-width="1.5"/><path d="M326,142 q14,-18 32,-4 q-14,0 -32,4 z" fill="#B8A65A" stroke-width="1.5"/>';
    return wrap(p);
  };

  // ---------- Gương đồng: vành chạm hoa văn, mặt gương loang sáng, vết nứt, quai dây đỏ, kệ gỗ ----------
  C.guong = function () {
    var p = R(0, 0, 520, 300, '#1E1A16') + R(0, 236, 520, 64, 'url(#cuWood)') + '<path d="M120,240 q140,-14 280,0 v10 h-280 z" fill="#D5DCE0" opacity=".8" stroke-width="2"/>';
    p += '<ellipse cx="260" cy="250" rx="110" ry="12" fill="#000" opacity=".4" stroke="none"/>';
    p += '<circle cx="260" cy="136" r="104" fill="#7A5A2A"/><circle cx="260" cy="136" r="96" fill="#9C7A3C" stroke-width="2"/>';
    for (var a = 0; a < 24; a++) { var an = a / 24 * Math.PI * 2; p += '<circle cx="' + (260 + Math.cos(an) * 88).toFixed(1) + '" cy="' + (136 + Math.sin(an) * 88).toFixed(1) + '" r="3.5" fill="#C8A860" stroke-width="1.2"/>'; }
    p += '<circle cx="260" cy="136" r="78" fill="url(#cuMirror)" stroke-width="3"/>';
    p += '<path d="M206,92 q30,-24 70,-20" fill="none" stroke="#E2E8EA" stroke-width="10" opacity=".35"/><circle cx="300" cy="108" r="12" fill="#E2E8EA" opacity=".7" stroke="none"/>';
    p += '<path d="M232,160 q28,-12 56,0 t50,2" fill="none" stroke="#6F86A0" stroke-width="2" opacity=".6"/>';
    p += '<path d="M286,72 l-14,30 l18,18 l-10,26 l12,20" fill="none" stroke="#D5DCE0" stroke-width="2"/>';
    p += '<path d="M260,32 v-14" stroke="#9C7A3C" stroke-width="8"/><path d="M252,20 q8,-14 16,0" fill="none" stroke="#A32E36" stroke-width="4"/><path d="M256,22 l-8,26 M264,22 l8,26" stroke="#A32E36" stroke-width="3"/>';
    p += '<path d="M244,232 h32 l-6,-20 h-20 z" fill="#5A3F38" stroke-width="2.5"/>';
    return wrap(p);
  };

  // ---------- Bảng tin phường: khung nhôm, bảng bần, giấy nhiều lớp; tờ tìm người cũ nằm dưới cùng, bị tờ mới dán đè ----------
  C.bang_tin = function () {
    var p = R(0, 0, 520, 300, '#232A33') + shadow(40, 14, 440, 272) + R(40, 14, 440, 272, '#9AA0A6', ' stroke-width="3"') + R(50, 24, 420, 252, '#8A6E50');
    for (var k = 0; k < 160; k++) p += '<circle cx="' + (54 + (k * 53) % 412) + '" cy="' + (28 + (k * 37) % 244) + '" r="' + (0.8 + (k % 3) * 0.5) + '" fill="' + (k % 2 ? '#6E5640' : '#A48A6A') + '" stroke="none"/>'; // hạt bần
    // tờ tìm người cũ: ố vàng, mép quăn, ảnh phai, tên nhoè
    p += shadow(70, 70, 230, 190, -2) + '<g transform="rotate(-2 185 165)">' + R(70, 70, 230, 190, '#D2BE88') + R(70, 70, 230, 190, '#8A7040', ' opacity=".18" stroke="none"');
    p += T(185, 100, 22, '#5A3A1A', 'TÌM NGƯỜI', 'middle', 900);
    p += R(86, 112, 70, 86, '#A8925E', ' stroke-width="2"') + '<g opacity=".75"><circle cx="121" cy="146" r="17" fill="#6A5432" stroke="none"/><path d="M98,198 q23,-34 46,0 z" fill="#6A5432" stroke="none"/><path d="M106,138 q15,-18 30,0" fill="#4A3A22" stroke="none"/></g>';
    p += '<ellipse cx="121" cy="150" rx="22" ry="12" fill="#D2BE88" opacity=".55" stroke="none"/>';                                   // vết phai che mặt
    p += T(166, 128, 11, '#5A3A1A', 'Họ tên: Tr', 'start', 700) + '<path d="M222,124 q20,-6 44,2" stroke="#8A7040" stroke-width="7" opacity=".6"/>';
    p += T(166, 146, 10, '#5A3A1A', 'Năm sinh: 19', 'start', 600) + '<path d="M232,142 h30" stroke="#8A7040" stroke-width="6" opacity=".55"/>';
    p += scrib(166, 164, 110, 2, 14, '#8A7040');
    p += T(86, 222, 11, '#5A3A1A', '...mất tích tháng 8 năm 1996,', 'start', 700) + T(86, 238, 11, '#5A3A1A', 'gần đình làng. Ai biết xin báo...', 'start', 700);
    p += '<path d="M70,260 q10,-4 14,-14 M300,70 q-12,4 -18,-6" fill="none" stroke="#8A7040" stroke-width="2"/></g>';
    // tờ mới dán đè: họp tổ dân phố
    p += shadow(250, 40, 130, 96, 5) + '<g transform="rotate(5 315 88)">' + R(250, 40, 130, 96, '#EEF0F2') + T(315, 62, 11, INK, 'HỌP TỔ DÂN PHỐ', 'middle', 800) + scrib(262, 80, 100, 3, 13) + T(315, 126, 9, '#A32E36', '19h · Thứ Bảy', 'middle', 700) + '</g>';
    // lịch tiêm chủng
    p += shadow(390, 40, 66, 84, -4) + '<g transform="rotate(-4 423 82)">' + R(390, 40, 66, 84, '#D5DCE0') + T(423, 58, 8, INK, 'LỊCH TIÊM', 'middle', 800) + '<path d="M398,64 h50 M398,76 h50 M398,88 h50 M398,100 h50 M414,64 v44 M432,64 v44" stroke="#8C949B" stroke-width="1"/></g>';
    // cho thuê phòng có tai xé số điện thoại
    p += shadow(320, 158, 120, 96) + R(320, 158, 120, 96, '#E8E4D8') + T(380, 178, 11, INK, 'CHO THUÊ PHÒNG', 'middle', 800) + scrib(330, 194, 96, 2, 12);
    for (var t = 0; t < 7; t++) { if (t === 2 || t === 5) continue; p += R(322 + t * 17, 222, 14, 32, '#E8E4D8', ' stroke-width="1.2"') + T(329 + t * 17, 250, 6, '#4B5560', '090', 'middle', 600, ' transform="rotate(-90 ' + (329 + t * 17) + ' 238)"'); }
    // giấy nhớ vàng
    p += R(64, 30, 54, 40, '#E2C46A', ' stroke-width="1.5" transform="rotate(-8 91 50)"') + scrib(70, 44, 36, 2, 10, '#6A5A3A');
    [[185, 74], [315, 44], [423, 44], [380, 162], [91, 34]].forEach(function (c) { p += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="5" fill="#C0303A" stroke-width="1.5"/><circle cx="' + (c[0] - 1.5) + '" cy="' + (c[1] - 1.5) + '" r="1.5" fill="#fff" opacity=".6" stroke="none"/>'; });
    return wrap(p);
  };

  // ---------- Bản vẽ sửa đình: giấy can xanh, lưới, khung tên, đường kích thước, ô bị tẩy, ghi chú bút chì, vết cà phê ----------
  C.ban_ve = function () {
    var p = R(0, 0, 520, 300, 'url(#cuWood)') + shadow(30, 16, 460, 268) + R(30, 16, 460, 268, '#B9C6CC');
    for (var x = 50; x < 480; x += 24) p += '<path d="M' + x + ',24 V276" stroke="#A4B3BA" stroke-width="1"/>';
    for (var y = 36; y < 276; y += 24) p += '<path d="M38,' + y + ' H482" stroke="#A4B3BA" stroke-width="1"/>';
    p += R(110, 50, 300, 180, 'none', ' stroke="#2C4A5A" stroke-width="2.5"') + R(170, 70, 180, 60, 'none', ' stroke="#2C4A5A" stroke-width="2"') + T(260, 105, 13, '#2C4A5A', 'GIAN THỜ', 'middle');
    p += '<path d="M110,40 H410 M110,36 v8 M410,36 v8" stroke="#2C4A5A" stroke-width="1.5"/>' + T(260, 36, 10, '#2C4A5A', '12.400', 'middle');
    p += '<path d="M96,50 V230 M92,50 h8 M92,230 h8" stroke="#2C4A5A" stroke-width="1.5"/>' + T(90, 144, 10, '#2C4A5A', '7.800', 'middle', 600, ' transform="rotate(-90 90 144)"');
    p += R(222, 146, 76, 58, '#C8D2D6', ' stroke="none"') + '<path d="M222,150 q20,-6 40,2 t36,-4 M224,170 q30,6 70,-2 M226,192 q24,-8 70,4" fill="none" stroke="#9AAAB2" stroke-width="6" opacity=".55"/>';
    p += R(225, 150, 70, 50, 'none', ' stroke="#8A9AA2" stroke-width="2" stroke-dasharray="5 4"') + T(260, 180, 12, '#7A8A92', 'hầm', 'middle');
    [[225, 150], [295, 150], [225, 200], [295, 200]].forEach(function (c) { p += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="4" fill="#2C4A5A" stroke="none"/>'; });
    p += '<path d="M300,212 q30,20 70,24" fill="none" stroke="#4B5560" stroke-width="1.5"/>' + T(300, 254, 14, '#3A3A3A', '"hầm — không đưa vào bản nộp"', 'start', 500, ' font-style="italic"');
    p += R(380, 236, 100, 40, 'none', ' stroke="#2C4A5A" stroke-width="1.5"') + T(470, 252, 10, '#2C4A5A', 'SỬA ĐÌNH 1995', 'end', 700) + T(470, 268, 11, '#2C4A5A', 'Ba Mộc', 'end', 600);
    p += '<circle cx="90" cy="250" r="22" fill="none" stroke="#7A5A3A" stroke-width="4" opacity=".35"/>';
    p += '<path d="M30,16 q6,10 0,20 M490,284 q-8,-8 -2,-18" fill="none" stroke="#8A9AA2" stroke-width="2"/>';
    p += '<path d="M440,60 l50,-30" stroke="#C9A84A" stroke-width="7"/><path d="M490,30 l6,-4" stroke="#2B3138" stroke-width="4"/>'; // bút chì
    return wrap(p);
  };

  // ---------- Bia tưởng niệm: viền chạm, đá phong hoá, rêu, bát nhang nguội ----------
  C.bia = function () {
    var p = R(0, 0, 520, 300, '#1B222C') + R(0, 240, 520, 60, '#2A323D') + shadow(110, 16, 300, 236);
    p += '<path d="M104,30 q156,-30 312,0 v222 h-312 z" fill="#8C949B"/>';
    for (var k = 0; k < 30; k++) p += '<circle cx="' + (120 + (k * 47) % 280) + '" cy="' + (30 + (k * 31) % 210) + '" r="' + (1 + k % 3) + '" fill="#6F7C88" stroke="none" opacity=".6"/>';
    p += R(126, 34, 268, 146, '#6F7C88', ' stroke-width="2"') + R(132, 40, 256, 134, 'none', ' stroke="#58606A" stroke-width="1.5"');
    p += T(260, 58, 11, '#1B222C', 'TƯỞNG NIỆM NẠN NHÂN VỤ CHÁY ĐÌNH 1996', 'middle', 800);
    p += T(260, 88, 13, '#1B222C', 'Hạnh — không tìm thấy thi thể', 'middle') + T(260, 112, 13, '#1B222C', 'Rạng — chết đuối ở bến', 'middle') + scrib(176, 136, 160, 2, 16, '#3A4552');
    p += R(170, 186, 180, 58, '#4B5560', ' stroke-width="2"') + T(260, 204, 11, '#C3CACD', 'Người mất dưới sông', 'middle', 700);
    p += T(260, 222, 12, '#E2D2A0', '1992 — Nguyễn Thị Mai', 'middle') + T(260, 238, 12, '#E2D2A0', '1994 — Phạm Văn Út', 'middle');
    p += '<path d="M104,252 q20,-12 40,-2 q20,-12 44,0 M370,252 q20,-14 46,-4" fill="#3F6B4A" stroke-width="2"/><path d="M396,60 q10,40 -2,80" fill="none" stroke="#3F6B4A" stroke-width="5" opacity=".6"/>';
    p += '<path d="M240,272 q20,12 40,0 l-4,-10 h-32 z" fill="#857761" stroke-width="2"/>';
    [252, 260, 268].forEach(function (x) { p += '<path d="M' + x + ',264 v-14" stroke="#5A4A3C" stroke-width="2"/>'; });
    p += '<path d="M96,250 q10,-30 4,-60M424,250 q-10,-30 -4,-60" fill="none" stroke="#58755C" stroke-width="3"/>';
    return wrap(p);
  };

  // ---------- Nền gian thờ: xi măng nứt chân chim, bốn lỗ chốt, chốt đông nam bị chém, hơi lạnh ----------
  C.nen_tho = function () {
    var p = R(0, 0, 520, 300, '#262C35') + R(100, 40, 320, 220, '#8C949B', ' stroke-width="3"');
    for (var k = 0; k < 60; k++) p += '<circle cx="' + (108 + (k * 37) % 304) + '" cy="' + (48 + (k * 23) % 204) + '" r="' + (1 + k % 2) + '" fill="#6F7C88" stroke="none" opacity=".7"/>';
    p += '<path d="M150,80 l60,50 l-20,40 l70,30 l40,-20 M210,130 l30,-10 l20,-30 M190,170 l-30,30 M260,200 l10,40" fill="none" stroke="#3A4552" stroke-width="2.5"/>';
    p += '<path d="M150,80 l60,50 l-20,40 l70,30 l40,-20" fill="none" stroke="#05070A" stroke-width="6" opacity=".5"/>';
    [[130, 70], [390, 70], [130, 230]].forEach(function (c) { p += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="16" fill="#4A3532"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="9" fill="#3A2826" stroke="none"/><path d="M' + (c[0] - 6) + ',' + (c[1] - 4) + ' q6,-4 12,0" fill="none" stroke="#6A4A40" stroke-width="2"/>'; });
    p += '<circle cx="390" cy="230" r="16" fill="#4A3532"/><path d="M376,240 L404,220" stroke="#C8B080" stroke-width="6"/><path d="M378,234 l4,-3 l3,4 l4,-3 l3,4 l4,-3" fill="none" stroke="#E2D2A0" stroke-width="2"/>';
    p += T(390, 274, 11, '#C3CACD', 'đông nam', 'middle');
    for (var s = 0; s < 3; s++) p += '<path class="cu-smoke" style="animation-delay:-' + s * 1.4 + 's" d="M' + (220 + s * 30) + ',160 q10,-20 0,-40 q-10,-20 6,-40" fill="none" stroke="#B9C6CC" stroke-width="3" opacity="0"/>';
    p += '<circle cx="290" cy="110" r="3" fill="#2B3138" stroke="none"/><circle cx="300" cy="118" r="2" fill="#2B3138" stroke="none"/><circle cx="170" cy="210" r="2.5" fill="#2B3138" stroke="none"/>';
    return wrap(p);
  };

  // ---------- Cái rìu: cán gỗ có vân, lưỡi gỉ có vết mẻ răng cưa, dây buộc ----------
  C.riu = function () {
    var p = R(0, 0, 520, 300, '#3A4552');
    for (var y = 30; y < 300; y += 60) p += '<path d="M0,' + y + ' H520" stroke="#2F3642" stroke-width="2"/>';
    p += '<path d="M120,256 L360,86" stroke="#000" stroke-width="22" opacity=".3" transform="translate(8,8)"/>';
    p += '<path d="M120,250 L360,80" stroke-width="20"/><path d="M120,250 L360,80" stroke="#6A5846" stroke-width="13"/><path d="M140,232 L340,92" stroke="#857761" stroke-width="2"/><path d="M170,212 l20,-14 M250,154 l18,-12" stroke="#4A3A2C" stroke-width="2"/>';
    p += '<path d="M150,228 l16,-10 M160,236 l16,-10" stroke="#A32E36" stroke-width="5"/>';
    p += '<path d="M338,58 q74,-34 96,42 l-62,42 q-6,-52 -34,-84 Z" fill="#8C949B"/><path d="M350,64 q54,-20 74,34" fill="none" stroke="#C3CACD" stroke-width="3" opacity=".7"/>';
    p += R(352, 70, 26, 22, '#7A5A44', ' opacity=".5" stroke="none" transform="rotate(30 365 81)"');
    p += '<path d="M380,74 l14,-8 l10,6 l-6,12 Z" fill="#6F7C88" stroke-width="1.5"/>';
    p += '<path d="M416,118 l6,-7 l4,7 l6,-7 l4,7 l6,-7" fill="none" stroke="#1B222C" stroke-width="3"/>'; // mẻ răng cưa
    p += T(470, 280, 12, '#C3CACD', 'vết mẻ răng cưa', 'end', 700) + '<path d="M440,262 q-10,-60 -12,-130" fill="none" stroke="#C3CACD" stroke-width="1.5" stroke-dasharray="4 4"/>';
    return wrap(p);
  };

  // ---------- Hai đứa trẻ ngủ dưới màn, ánh trăng qua cửa sổ ----------
  C.tre_ngu = function () {
    var p = R(0, 0, 520, 300, '#1E2430') + '<path d="M420,0 l100,0 l-60,300 l-140,0 z" fill="#B9C6CC" opacity=".08" stroke="none"/>';
    p += R(60, 40, 400, 240, '#4A4038') + R(80, 60, 360, 200, '#8F8A6A');
    for (var i = 84; i < 440; i += 10) p += '<path d="M' + i + ',60 v200" stroke="#6F6A50" stroke-width="1"/>';
    p += R(96, 76, 120, 40, '#C3CACD', ' rx="12" stroke-width="2.5"') + R(244, 76, 120, 40, '#C3CACD', ' rx="12" stroke-width="2.5"');
    p += chibi({ hair: 'messy', shirt: '#C3CACD', eyes: 'narrow', kid: true }, 156, 196, 0.95);
    p += chibi({ hair: 'long', shirt: '#C3CACD', eyes: 'narrow', kid: true }, 304, 196, 0.85);
    p += R(86, 150, 348, 106, '#58755C', ' rx="14" stroke-width="2.5"');
    for (var f = 0; f < 12; f++) p += '<circle cx="' + (110 + (f * 29) % 310) + '" cy="' + (170 + (f * 17) % 70) + '" r="5" fill="#A32E36" opacity=".6" stroke="none"/>';   // chăn hoa
    p += '<path d="M90,170 q170,-16 340,0" fill="none" stroke="#3F5A44" stroke-width="2"/>';
    p += '<path d="M190,166 l-6,-46 q26,-10 44,10 Z" fill="#C8B080" stroke-width="2.5"/>';
    p += R(52, 30, 416, 256, '#D5DCE0', ' fill-opacity=".12" stroke-width="2"');
    for (var n = 60; n < 470; n += 12) p += '<path d="M' + n + ',30 v256" stroke="#D5DCE0" stroke-width=".8" opacity=".25"/>';     // lưới màn
    for (var m = 40; m < 290; m += 12) p += '<path d="M52,' + m + ' h416" stroke="#D5DCE0" stroke-width=".8" opacity=".2"/>';
    return wrap(p);
  };

  // ---------- Thư của mẹ: giấy pơ-luya, nét mực, phong bì, đèn dầu hắt sáng, mặt bàn gỗ ----------
  C.thu_me = function () {
    var p = R(0, 0, 520, 300, 'url(#cuWood)') + '<circle cx="430" cy="110" r="180" fill="url(#cuGlow)" stroke="none"/>';
    p += shadow(60, 150, 120, 80, 8) + '<g transform="rotate(8 120 190)">' + R(60, 150, 120, 80, '#D8D0B8', ' stroke-width="2"') + '<path d="M60,150 l60,44 l60,-44" fill="none" stroke-width="2"/>' + R(150, 158, 20, 24, '#A32E36', ' stroke-width="1.5"') + '</g>';
    p += shadow(140, 34, 250, 190, -2) + R(140, 34, 250, 190, '#E6E2D6', ' transform="rotate(-2 265 129)"');
    p += '<g transform="rotate(-2 265 129)">' + '<path d="M140,96 H390 M140,160 H390" stroke="#C8C0A8" stroke-width="1.5"/>' + scrib(160, 70, 210, 6, 22, '#2A3550') + T(170, 206, 14, '#2A3550', '— Mẹ', 'start', 600, ' font-style="italic"') + '</g>';
    p += R(398, 140, 44, 80, '#6A5846', ' stroke-width="2.5"') + R(392, 214, 56, 12, '#4A3532', ' stroke-width="2"');
    p += '<ellipse cx="420" cy="122" rx="18" ry="22" fill="#E8E0C8" opacity=".35" stroke-width="2"/>' + flame(420, 130, 1.1);
    return wrap(p);
  };

  // ---------- Ảnh lễ hội Rằm tháng Tám 1996: ảnh màu cũ phai, cổng chào, cờ đuôi nheo, đèn lồng, đèn ông sao, lân, trống, lọng che kiệu ----------
  C.anh_le_hoi = function () {
    var p = shadow(40, 18, 440, 264, -1.5) + '<g transform="rotate(-1.5 260 150)">' + R(40, 18, 440, 264, '#E8DFC8') + R(40, 18, 440, 264, '#C8B890', ' opacity=".25" stroke="none"');
    p += '<svg x="56" y="30" width="408" height="220" viewBox="56 30 408 220" overflow="hidden">';
    p += R(56, 30, 408, 220, '#1E2430', ' stroke="none"') + R(56, 150, 408, 100, '#3A3028', ' stroke="none"');
    // đình sáng đèn phía sau
    p += '<path d="M170,132 q40,-10 60,-32 h100 q20,22 60,32 q-20,-2 -26,-8 h-168 q-6,6 -26,8 z" fill="#2A1E1A" stroke-width="2"/><path d="M200,104 q10,-6 14,-16 h92 q4,10 14,16 z" fill="#2A1E1A" stroke-width="2"/>';
    p += R(194, 126, 132, 54, '#3A2A22', ' stroke-width="2"') + R(222, 140, 22, 40, '#C04838', ' stroke-width="1.5"') + R(276, 140, 22, 40, '#C04838', ' stroke-width="1.5"') + '<circle cx="260" cy="150" r="70" fill="url(#cuGlow)" stroke="none"/>';
    // cổng chào + băng rôn
    p += R(66, 60, 12, 140, '#8A2A2A', ' stroke-width="2"') + R(442, 60, 12, 140, '#8A2A2A', ' stroke-width="2"');
    p += R(60, 56, 400, 26, '#B0303A', ' stroke-width="2.5"') + T(260, 74, 13, '#F2D060', 'LỄ HỘI ĐÌNH LÀNG · RẰM THÁNG TÁM', 'middle', 800);
    // dây cờ đuôi nheo hai hàng
    var cols = ['#C04040', '#E2C040', '#3F7FA0', '#58955C', '#E07A30'];
    [[90, 96, 430, 112], [80, 116, 440, 128]].forEach(function (ln, j) {
      p += '<path d="M' + ln[0] + ',' + ln[1] + ' Q260,' + (ln[3] + 22) + ' ' + ln[2] + ',' + ln[3] + '" fill="none" stroke-width="1.2"/>';
      for (var i = 0; i < 16; i++) { var t = i / 15, x = ln[0] + (ln[2] - ln[0]) * t, y = (1 - t) * (1 - t) * ln[1] + 2 * (1 - t) * t * (ln[3] + 22) + t * t * ln[3]; p += '<path d="M' + (x - 6).toFixed(1) + ',' + y.toFixed(1) + ' h12 l-6,12 z" fill="' + cols[(i + j * 2) % 5] + '" stroke-width="1"/>'; }
    });
    // đèn lồng tròn đỏ
    for (var l = 0; l < 7; l++) { var lx = 104 + l * 52, ly = 140 + (l % 2) * 6; p += '<circle cx="' + lx + '" cy="' + ly + '" r="18" fill="url(#cuGlow)" stroke="none"/><ellipse cx="' + lx + '" cy="' + ly + '" rx="8" ry="10" fill="#C83A3A" stroke-width="1.8"/><path d="M' + lx + ',' + (ly + 10) + ' v6" stroke="#E2C040" stroke-width="1.5"/>'; }
    // đám đông, trẻ con giơ đèn ông sao
    for (var c = 0; c < 20; c++) { var cx = 70 + c * 20 + (c % 2) * 6, cy = 188 + (c % 3) * 3; p += '<path d="M' + (cx - 9) + ',' + (cy + 18) + ' q9,-12 18,0 z" fill="#2A221C" stroke="none"/><circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#2A221C" stroke="none"/>'; }
    [[150, 166, '#E2C040'], [212, 160, '#C83A3A'], [356, 164, '#E2C040'], [430, 168, '#C83A3A']].forEach(function (s) {
      var star = ''; for (var k = 0; k < 10; k++) { var a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 4 : 10; star += (k ? 'L' : 'M') + (s[0] + Math.cos(a) * r).toFixed(1) + ',' + (s[1] + Math.sin(a) * r).toFixed(1); }
      p += '<path d="M' + s[0] + ',' + (s[1] + 10) + ' v26" stroke="#5A4A3C" stroke-width="2"/><circle cx="' + s[0] + '" cy="' + s[1] + '" r="16" fill="url(#cuGlow)" stroke="none"/><path d="' + star + 'z" fill="' + s[2] + '" stroke-width="1.5"/>';
    });
    // kiệu sơn son dưới lọng vàng, khuôn mặt mờ trong kiệu
    p += '<path d="M40,182 H250" stroke-width="8"/><path d="M40,182 H250" stroke="#8A6A3A" stroke-width="4"/>';
    p += '<path d="M114,98 v40" stroke="#5A4A3C" stroke-width="2.5"/><path d="M84,104 q30,-26 60,0 z" fill="#E2B030" stroke-width="2"/><path d="M84,104 q4,6 8,0 t8,0 t8,0 t8,0 t8,0 t8,0 t8,0 t4,0" fill="none" stroke="#C04040" stroke-width="1.5"/>';
    p += R(76, 130, 76, 52, '#C0303A', ' stroke-width="2.5"') + R(82, 136, 64, 40, 'none', ' stroke="#E2C040" stroke-width="1.5"');
    p += '<path d="M64,132 q10,-4 16,-18 h68 q6,14 16,18 z" fill="#8A2A2A" stroke-width="2.5"/>' + R(98, 142, 32, 30, '#2A2420', ' stroke-width="2"') + '<ellipse cx="114" cy="156" rx="8" ry="9" fill="#8C8070" stroke="none" opacity=".7"/>';
    // đầu lân + trống hội bên phải
    p += '<g transform="translate(408,150)"><path d="M-26,10 q-4,-30 26,-34 q30,4 26,34 q-26,14 -52,0 z" fill="#D04030" stroke-width="2.5"/><path d="M-22,-10 q22,-20 44,0" fill="none" stroke="#E2C040" stroke-width="4"/>' +
      '<circle cx="-10" cy="-2" r="6" fill="#F2F0E0" stroke-width="1.5"/><circle cx="10" cy="-2" r="6" fill="#F2F0E0" stroke-width="1.5"/><circle cx="-9" cy="-2" r="2.5" fill="#0F141B" stroke="none"/><circle cx="11" cy="-2" r="2.5" fill="#0F141B" stroke="none"/>' +
      '<path d="M-14,12 q14,8 28,0" fill="#F2F0E0" stroke-width="1.5"/><path d="M-28,10 l-6,8 M-24,14 l-4,9 M24,14 l4,9 M28,10 l6,8" stroke="#F2F0E0" stroke-width="3"/><path d="M0,-24 v-8" stroke="#E2C040" stroke-width="3"/></g>';
    p += '<ellipse cx="452" cy="200" rx="16" ry="7" fill="#C0303A" stroke-width="2"/>' + R(436, 200, 32, 20, '#8A2A2A', ' stroke-width="2"') + '<path d="M440,190 l-10,-14 M466,190 l8,-16" stroke="#5A4A3C" stroke-width="2.5"/>';
    // nhân vật trong ảnh (manh mối giữ nguyên)
    p += chibi({ hair: 'non_la', shirt: '#4B5560', mask: true }, 92, 250, 0.42);
    p += chibi({ hair: 'short', shirt: '#C3CACD', mole: true, sash: true }, 186, 250, 0.42);
    p += chibi({ hair: 'messy', shirt: '#3B4A5E', pants: '#2A3550', scarf: true, mask: true, prop: 'axe_up' }, 306, 240, 0.58, -1);
    p += chibi({ hair: 'long', shirt: '#6F86A0', pants: '#2A3550', eyes: 'big' }, 262, 254, 0.6);
    p += chibi({ hair: 'cap', shirt: '#58755C', mask: true }, 372, 250, 0.44);
    // phai màu ảnh cũ: phủ vàng ấm, giảm tương phản
    p += R(56, 30, 408, 220, '#D8B070', ' opacity=".28" stroke="none" style="mix-blend-mode:multiply"') + R(56, 30, 408, 220, '#FFF0D0', ' opacity=".12" stroke="none"');
    p += '<path d="M420,30 q30,40 44,120" fill="none" stroke="#FFD08A" stroke-width="30" opacity=".1"/></svg>';
    p += '<path d="M260,18 v264" stroke="#B8A880" stroke-width="1.5" opacity=".6"/><path d="M90,60 l30,4 M360,220 l40,-6" stroke="#fff" stroke-width="1" opacity=".35"/>';
    p += T(456, 272, 13, '#8C7A5A', 'Rằm tháng Tám · 1996', 'end');
    p += '</g>' + R(30, 8, 60, 20, '#D8D0A8', ' opacity=".7" stroke="none" transform="rotate(-24 60 18)"') + R(432, 266, 60, 20, '#D8D0A8', ' opacity=".7" stroke="none" transform="rotate(-20 462 276)"');
    return wrap(p, '#141A20');
  };

  // ---------- giấy tờ: nền bàn gỗ, bóng giấy, kẹp giấy ----------
  function desk(inner) { return R(0, 0, 520, 300, 'url(#cuWood)') + inner; }
  function clip(x, y) { return '<path d="M' + x + ',' + (y + 30) + ' v-24 a6,6 0 0 1 12,0 v28 a4,4 0 0 1 -8,0 v-22" fill="none" stroke="#B9C2C6" stroke-width="2.5"/>'; }

  C.bien_ban = function () {
    var p = shadow(96, 12, 330, 278) + R(96, 12, 330, 278, '#ECE6D6') + clip(118, 2);
    p += T(261, 32, 8, '#3A3A3A', 'ỦY BAN NHÂN DÂN XÃ · BAN QUẢN LÝ ĐÌNH', 'middle', 700) + '<path d="M210,38 H312" stroke="#3A3A3A" stroke-width="1"/>';
    p += T(261, 60, 15, INK, 'BIÊN BẢN NGHIỆM THU', 'middle', 800) + T(261, 76, 10, '#4B5560', 'Công trình: Tu sửa đình làng · năm 1995', 'middle');
    for (var i = 0; i < 4; i++) p += R(122, 92 + i * 13, 270 - (i % 2) * 40, 4, '#9AA0A6', ' stroke="none"');
    p += R(170, 150, 182, 64, '#F6F2E8', ' stroke="#4B5560" stroke-width="1.5"') + R(206, 160, 110, 30, 'none', ' stroke="#4B5560" stroke-width="1.2"') + '<path d="M206,175 h110 M261,160 v30" stroke="#4B5560" stroke-width="1"/>';
    p += T(261, 206, 10, '#4B5560', 'Bản vẽ kèm theo · không có hầm', 'middle', 600);
    p += T(160, 238, 10, '#4B5560', 'Đơn vị thi công', 'middle') + '<path d="M130,256 q14,-10 26,0 t26,-2" fill="none" stroke="#2A3550" stroke-width="1.8"/>' + T(160, 274, 10, INK, 'Ba Mộc', 'middle', 700);
    p += T(360, 238, 10, '#4B5560', 'Trưởng ban', 'middle') + '<path d="M326,258 q16,-14 30,0 t30,-4" fill="none" stroke="#2A3550" stroke-width="2"/>' + T(360, 276, 11, INK, 'Nguyễn Văn Khải', 'middle', 700);
    p += stamp(372, 252, 26, 'BAN Q.LÝ');
    return wrap(desk(p));
  };

  C.trang_so = function () { // sổ thu chi mở đôi: gáy, cột, dòng mực đỏ
    var p = shadow(60, 18, 400, 268) + R(60, 18, 200, 268, '#E8E0C8') + R(260, 18, 200, 268, '#EDE6D0') + '<path d="M260,18 V286" stroke="#8A7A50" stroke-width="3"/>';
    p += R(254, 18, 12, 268, '#000', ' opacity=".12" stroke="none"');
    for (var y = 54; y < 280; y += 20) p += '<path d="M66,' + y + ' H254 M266,' + y + ' H454" stroke="#C8B898" stroke-width="1"/>';
    p += '<path d="M96,40 V282 M200,40 V282 M296,40 V282 M400,40 V282" stroke="#C87070" stroke-width="1"/>';
    p += T(160, 34, 11, '#4A3A20', 'SỔ THU CHI TU SỬA ĐÌNH', 'middle', 800) + T(360, 34, 10, '#4A3A20', 'Tháng 7 · 1995', 'middle', 700);
    p += scrib(102, 70, 90, 6, 20, '#6A5A3A') + scrib(302, 70, 90, 3, 20, '#6A5A3A');
    p += R(268, 130, 186, 44, '#E05050', ' opacity=".14" stroke="none"');
    p += T(302, 146, 10, '#7A1A20', 'Chi riêng hầm: 12 bao xi măng', 'start', 700) + T(302, 160, 10, '#7A1A20', '3.000.000 đ · K. nhận', 'start', 700) + T(302, 172, 9, '#7A1A20', 'Không đưa vào sổ dân góp', 'start', 700);
    p += scrib(302, 210, 90, 3, 20, '#6A5A3A') + stamp(410, 250, 22, 'ĐÃ CHI');
    p += '<circle cx="140" cy="250" r="20" fill="none" stroke="#7A5A3A" stroke-width="4" opacity=".3"/>';
    return wrap(desk(p));
  };

  C.trang_so_cu = function () { // trang sổ cũ moi từ hốc cây: ố vàng, rách góc, vết nước, mốc
    var p = R(0, 0, 520, 300, '#1E1A16') + R(0, 220, 520, 80, '#3A3028') + shadow(120, 26, 280, 250, 2);
    p += '<g transform="rotate(2 260 150)"><path d="M120,26 H372 l28,28 V276 H150 l-30,-26 z" fill="#C8B88A"/><path d="M372,26 v28 h28" fill="#A89868" stroke-width="2"/>';
    for (var y = 60; y < 270; y += 20) p += '<path d="M130,' + y + ' H392" stroke="#A89868" stroke-width="1"/>';
    p += scrib(136, 66, 220, 4, 20, '#8A7A50') + T(136, 160, 12, '#6A2A20', 'Chi riêng hầm: 12 bao xi măng, 3.000.000 đ', 'start', 700) + T(136, 180, 12, '#6A2A20', 'K. nhận', 'start', 700);
    p += '<ellipse cx="330" cy="230" rx="46" ry="24" fill="#8A7A50" opacity=".35" stroke="none"/><ellipse cx="180" cy="110" rx="26" ry="14" fill="#8A7A50" opacity=".25" stroke="none"/>';
    for (var m = 0; m < 14; m++) p += '<circle cx="' + (140 + (m * 37) % 240) + '" cy="' + (210 + (m * 13) % 56) + '" r="' + (1 + m % 3) + '" fill="#5A6A4A" opacity=".5" stroke="none"/>';
    p += '<path d="M150,276 l-30,-26 l8,-2 l-4,-8 l10,0" fill="#B8A87A" stroke-width="1.5"/></g>';
    p += '<path d="M60,240 q10,-20 30,-14 q10,-14 26,-4" fill="#6A6A6A" opacity=".5" stroke="none"/>';
    return wrap(p);
  };

  C.thu_vy = function () { // vở ô li gáy lò xo, nét bút bi, gạch chân đỏ, giọt nước mắt nhoè
    var p = shadow(100, 14, 320, 272) + R(100, 14, 320, 272, '#F0F2F4');
    for (var x = 100; x < 420; x += 16) p += '<path d="M' + x + ',14 V286" stroke="#D0D8E0" stroke-width="1"/>';
    for (var y = 14; y < 286; y += 16) p += '<path d="M100,' + y + ' H420" stroke="#D0D8E0" stroke-width="1"/>';
    p += '<path d="M130,14 V286" stroke="#E09090" stroke-width="1.5"/>';
    for (var r = 30; r < 280; r += 24) p += '<circle cx="110" cy="' + r + '" r="4" fill="#1B222C" stroke="none"/><path d="M96,' + (r - 4) + ' q-6,4 0,8" fill="none" stroke="#8C949B" stroke-width="2"/>';
    p += T(140, 50, 14, '#2A3550', 'Anh,', 'start', 700, ' font-style="italic"') + scrib(140, 76, 250, 3, 22, '#2A3550');
    p += T(140, 150, 12, '#7A1A20', 'Người đeo mặt nạ trong ảnh...', 'start', 700) + T(140, 170, 12, '#7A1A20', '"tế thần sông" · Mẹ là người bị chọn', 'start', 700) + '<path d="M140,176 q110,5 220,0" fill="none" stroke="#C03030" stroke-width="2"/>';
    p += scrib(140, 200, 230, 2, 22, '#2A3550') + T(400, 268, 13, '#2A3550', '— Vy', 'end', 700, ' font-style="italic"');
    p += '<ellipse cx="300" cy="96" rx="9" ry="6" fill="#8AA0C0" opacity=".3" stroke="none"/><ellipse cx="250" cy="214" rx="7" ry="5" fill="#8AA0C0" opacity=".3" stroke="none"/>';
    p += '<path d="M420,286 l-24,0 l24,-24 z" fill="#D8DCE0" stroke-width="1.5"/>';
    return wrap(desk(p));
  };

  C.danh_sach = function () { // trang Vy chép tay danh sách Ban tế lễ
    var p = shadow(110, 14, 300, 272, -1) + '<g transform="rotate(-1 260 150)">' + R(110, 14, 300, 272, '#EEF0F2');
    for (var y = 60; y < 286; y += 22) p += '<path d="M118,' + y + ' H402" stroke="#C8D4E0" stroke-width="1"/>';
    p += T(260, 44, 14, '#2A3550', 'BAN TẾ LỄ · người được chọn', 'middle', 800);
    p += T(140, 80, 12, '#2A3550', 'Trưởng ban: Nguyễn Văn Khải', 'start', 700);
    p += T(140, 122, 13, '#2A3550', '1992 — Nguyễn Thị Mai', 'start', 600, ' font-style="italic"') + T(140, 150, 13, '#2A3550', '1994 — Phạm Văn Út', 'start', 600, ' font-style="italic"');
    p += T(140, 190, 13, '#2A3550', '1996 — Trần Văn Lộc', 'start', 600, ' font-style="italic"') + '<path d="M138,186 H290 M138,190 H286" stroke="#A32E36" stroke-width="2.5"/>';
    p += T(300, 216, 20, '#A32E36', 'Hạnh', 'start', 800, ' font-style="italic"') + '<path d="M290,190 q14,4 10,20" fill="none" stroke="#A32E36" stroke-width="2"/><path d="M296,222 q30,6 60,-2" fill="none" stroke="#A32E36" stroke-width="2"/>';
    p += T(390, 270, 10, '#6F7880', '(chép lại từ sổ ghi danh)', 'end', 500, ' font-style="italic"') + '</g>' + clip(370, 4);
    return wrap(desk(p));
  };

  C.trang_vy = function () { // trang giấy kẹt trong kẽ xà: xà gỗ, bụi, mép xé
    var p = R(0, 0, 520, 300, '#1E1A16') + R(0, 0, 520, 76, '#3A3028') + '<path d="M0,60 H520" stroke-width="16"/><path d="M0,60 H520" stroke="#5A4232" stroke-width="10"/><path d="M0,56 q130,-4 260,0 t260,0" fill="none" stroke="#3A2A20" stroke-width="2"/>';
    for (var d = 0; d < 20; d++) p += '<circle cx="' + ((d * 61) % 520) + '" cy="' + (90 + (d * 37) % 200) + '" r="1.5" fill="#C8B898" opacity=".35" stroke="none"/>';
    p += shadow(130, 80, 240, 200, 3) + '<g transform="rotate(3 250 180)">' + '<path d="M130,80 l8,6 l-6,8 l8,6 l-6,8 l8,6 l-6,8 V280 H370 V80 z" fill="#EEF0F2"/>';
    for (var y = 96; y < 280; y += 16) p += '<path d="M138,' + y + ' H370" stroke="#D0D8E0" stroke-width="1"/>';
    p += R(130, 80, 240, 30, '#8A7A60', ' opacity=".25" stroke="none"');
    p += T(160, 124, 13, '#2A3550', 'Mùng 9/8/1996.', 'start', 700, ' font-style="italic"') + T(160, 146, 13, '#2A3550', 'Em đã tới.', 'start', 700, ' font-style="italic"') + T(160, 168, 12, '#2A3550', 'Mẹ bị nghi rồi.', 'start', 600, ' font-style="italic"') + scrib(160, 194, 180, 3, 22, '#2A3550') + '</g>';
    return wrap(p);
  };

  C.bia_da = function () { // bia đá dưới hầm: ánh đuốc một bên, rêu, nước rỉ, chữ khắc
    var p = R(0, 0, 520, 300, '#0F141B') + '<circle cx="60" cy="150" r="260" fill="url(#cuGlow)" stroke="none" opacity=".8"/>';
    p += R(140, 20, 240, 260, '#2A323D') + '<path d="M150,30 q110,-18 220,0 V270 H150 z" fill="#6F7C88"/>';
    for (var k = 0; k < 40; k++) p += '<circle cx="' + (160 + (k * 41) % 200) + '" cy="' + (36 + (k * 29) % 228) + '" r="' + (1 + k % 3) + '" fill="#58606A" opacity=".6" stroke="none"/>';
    p += R(168, 46, 184, 190, 'none', ' stroke="#4B5560" stroke-width="2"');
    for (var y = 72; y < 226; y += 22) p += '<path d="M184,' + y + ' h' + (130 + (y % 3) * 12) + '" stroke="#2B3138" stroke-width="4"/>';
    p += T(260, 256, 11, '#C3CACD', 'Bốn chốt lim giữ miệng giếng', 'middle', 700);
    p += '<path d="M150,290 q20,-16 50,-8 q20,-12 40,0 v8 h-90 z" fill="#3F6B4A" stroke-width="2"/><path d="M366,40 q8,30 -2,70" fill="none" stroke="#3F6B4A" stroke-width="5" opacity=".6"/>';
    for (var w = 0; w < 4; w++) p += '<path class="cu-drip" style="animation-delay:-' + w * 0.7 + 's" d="M' + (200 + w * 40) + ',30 v14" stroke="#8FA4AE" stroke-width="2.5" opacity=".7"/>';
    p += '<path d="M330,90 l-10,26 l12,14 l-8,24" fill="none" stroke="#1B222C" stroke-width="2"/>';
    return wrap(p);
  };

  // ---------- Giấy tờ còn lại: bóng giấy + con dấu đỏ trên biên bản, sổ thu chi ----------
  var STAMP = { bien_ban: stamp(380, 230, 30, 'BAN Q.LÝ'), trang_so: stamp(380, 250, 26, 'ĐÃ CHI') };
  Object.keys(base).forEach(function (k) {
    if (C[k] !== base[k]) return; // đã vẽ lại ở trên
    var f = base[k];
    C[k] = function () {
      var s = f.apply(this, arguments);
      if (s.indexOf('<svg viewBox="0 0 520 300" width="520" height="300">') !== 0) return s; // tranh khác khổ (món ăn...) để nguyên
      return s.replace('<svg viewBox="0 0 520 300" width="520" height="300">', '<svg viewBox="0 0 520 300" width="520" height="300">' + DEFS)
        .replace(/<\/svg>$/, (STAMP[k] ? '<g filter="url(#w)">' + STAMP[k] + '</g>' : '') + OVER + '</svg>');
    };
  });
})();
