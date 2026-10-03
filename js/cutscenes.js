// Cảnh phim ngắn (~3 giây) cho những chỗ có hành động: khung điện ảnh, hình động SVG, chú thích; bấm để bỏ qua.
// Tự chạy trước đoạn thoại tương ứng (G.TEXT[key]) — xem CUT_BY_TEXT ở cuối.
var G = window.G || (window.G = {});

(function () {
  var INK = '#0F141B';
  var g = function (inner, a) { return '<g ' + (a || '') + '>' + inner + '</g>'; };
  function chibi(look, view, x, y, s, extra) { return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')"' + (extra || '') + '>' + G.art.chibi(Object.assign({}, look, { view: view })) + '</g>'; }
  function anim(attr, from, to, begin, dur, extra) { return '<animate attributeName="' + attr + '" from="' + from + '" to="' + to + '" begin="' + begin + 's" dur="' + dur + 's" fill="freeze"' + (extra || '') + '/>'; }
  function animT(type, values, begin, dur, extra) { return '<animateTransform attributeName="transform" type="' + type + '" values="' + values + '" begin="' + begin + 's" dur="' + dur + 's" fill="freeze"' + (extra || '') + ' additive="sum"/>'; }
  function ring(cx, cy, r0, r1, begin, color) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r0 + '" fill="none" stroke="' + (color || '#E2C46A') + '" stroke-width="4" opacity="0">' +
    anim('r', r0, r1, begin, 1.1) + '<animate attributeName="opacity" values="0;.9;0" begin="' + begin + 's" dur="1.1s" fill="freeze"/></circle>'; }
  var ME = function () { return G.PLAYER_LOOK; };
  var VY = { hair: 'long', shirt: '#3F6670', pants: '#2A3550', shoes: '#A32E36', eyes: 'big', scarf: true };

  var SCENES = {
    gong: { cap: 'BOONG — tiếng chiêng vang khắp sân đình', sfx: [[0.9, 'gong']], make: function () {
      var t = '<rect width="960" height="540" fill="#1A1414"/><circle cx="600" cy="260" r="260" fill="#5A1E24" opacity=".35"/>';
      t += '<path d="M40,70 Q480,130 920,70" fill="none" stroke="' + INK + '" stroke-width="3"/>';
      for (var i = 0; i < 9; i++) t += '<ellipse cx="' + (90 + i * 100) + '" cy="' + (88 + Math.sin(i / 8 * Math.PI) * 30) + '" rx="16" ry="20" fill="#A32E36" stroke="' + INK + '" stroke-width="3">' + animT('rotate', '0;6;-6;3;0', 0.9, 1.4) + '</ellipse>';
      t += '<path d="M480,140 V460 M720,140 V460 M470,150 H730" stroke="#4A3532" stroke-width="16"/>';
      t += g('<circle cx="600" cy="300" r="95" fill="#9C7A3C" stroke="' + INK + '" stroke-width="6"/><circle cx="600" cy="300" r="60" fill="none" stroke="#C8B080" stroke-width="4"/><circle cx="600" cy="300" r="26" fill="#C8B080" stroke="' + INK + '" stroke-width="4"/>' +
        animT('translate', '0,0;7,0;-6,0;5,0;-3,0;0,0', 0.9, 1.2));
      t += ring(600, 300, 95, 300, 0.9) + ring(600, 300, 95, 300, 1.2) + ring(600, 300, 95, 300, 1.5);
      t += chibi(ME(), 'side', 160, 150, 1.9);
      // dùi chiêng: cầm ở tay, vung từ sau ra trước, đầu dùi chạm vành chiêng đúng lúc tiếng BOONG
      t += g('<rect x="-8" y="-200" width="16" height="200" rx="6" fill="#6A5846" stroke="' + INK + '" stroke-width="4"/><rect x="-24" y="-238" width="48" height="44" rx="16" fill="#A32E36" stroke="' + INK + '" stroke-width="4"/>' +
        animT('rotate', '-40;-55;82;74', 0.2, 0.75), 'transform="translate(305,330)"');
      return t; } },
    river_fall: { cap: 'Ván bến ướt — tôi trượt chân', sfx: [[0.2, 'creak'], [1.35, 'splash']], make: function () {
      var t = '<rect width="960" height="540" fill="#0E1A22"/><rect y="300" width="960" height="240" fill="#1C3440"/>';
      for (var i = 0; i < 6; i++) t += '<rect x="' + (60 + i * 64) + '" y="220" width="58" height="26" fill="#5A4A3C" stroke="' + INK + '" stroke-width="3"/>';
      t += '<rect x="60" y="246" width="380" height="16" fill="#3A2E26"/>';
      // người trượt khỏi ván, lộn xuống nước rồi chìm
      t += '<g><animateTransform attributeName="transform" type="translate" values="330,230;380,240;470,330;520,430" begin="0.1s" dur="1.3s" fill="freeze"/>' +
        '<g>' + animT('rotate', '0;-25;-80;-150', 0.1, 1.3) + '<animate attributeName="opacity" values="1;1;0" keyTimes="0;.85;1" begin="0.1s" dur="1.4s" fill="freeze"/>' +
        chibi(ME(), 'side', -112, -249, 1.4) + '</g></g>';
      for (var d = 0; d < 9; d++) { var dx = (d - 4) * 22; t += '<circle cx="520" cy="420" r="7" fill="#8FA4AE" opacity="0">' + '<animate attributeName="opacity" values="0;1;0" begin="1.35s" dur="0.9s" fill="freeze"/>' + animT('translate', '0,0;' + dx + ',' + (-90 - Math.abs(dx)) + ';' + (dx * 1.4) + ',20', 1.35, 0.9) + '</circle>'; }
      t += ring(520, 430, 20, 220, 1.4, '#8FA4AE') + ring(520, 430, 20, 220, 1.8, '#8FA4AE');
      for (var b = 0; b < 5; b++) t += '<circle cx="' + (505 + b * 8) + '" cy="480" r="5" fill="none" stroke="#8FA4AE" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;1;0" begin="' + (1.8 + b * 0.15) + 's" dur="1s" fill="freeze"/>' + animT('translate', '0,0;0,-60', 1.8 + b * 0.15, 1) + '</circle>';
      t += g('<path d="M620,-40 V140" stroke="#5A4A3C" stroke-width="30"/><path d="M600,140 q20,30 40,0 l-6,30 h-28 z" fill="#C3CACD" stroke="' + INK + '" stroke-width="4"/>' + animT('translate', '0,-200;0,-200;0,120', 0, 2.6), '');
      return t; } },
    nen_tho: { cap: 'Dưới khe nứt, hơi lạnh phả lên', sfx: [[0.9, 'whisper']], make: function () {
      var t = '<rect width="960" height="540" fill="#232A33"/>';
      for (var x = 0; x < 960; x += 80) for (var y = 0; y < 540; y += 80) t += '<rect x="' + x + '" y="' + y + '" width="80" height="80" fill="none" stroke="#1A2029" stroke-width="3"/>';
      t += '<path d="M200,400 l120,-40 l60,30 l140,-50 l90,40 l150,-30" fill="none" stroke="#05070A" stroke-width="10"/>';
      t += '<path d="M200,400 l120,-40 l60,30 l140,-50 l90,40 l150,-30" fill="none" stroke="#6F86A0" stroke-width="3" opacity="0">' + '<animate attributeName="opacity" values="0;.9;.4;.8" begin="0.6s" dur="2s" fill="freeze"/></path>';
      for (var i = 0; i < 6; i++) t += '<path d="M' + (300 + i * 70) + ',380 q-14,-40 0,-80 q14,-40 0,-80" fill="none" stroke="#D5DCE0" stroke-width="5" opacity="0" stroke-linecap="round"><animate attributeName="opacity" values="0;.5;0" begin="' + (0.7 + i * 0.25) + 's" dur="1.6s" fill="freeze"/>' + animT('translate', '0,0;8,-70', 0.7 + i * 0.25, 1.6) + '</path>';
      t += '<g opacity="0"><ellipse cx="530" cy="372" rx="9" ry="4" fill="#E2E8EA"/><ellipse cx="566" cy="370" rx="9" ry="4" fill="#E2E8EA"/><animate attributeName="opacity" values="0;0;1;0;1;0" begin="1.6s" dur="1.4s" fill="freeze"/></g>';
      t += chibi(ME(), 'front', 400, 20, 1.7, ' opacity=".95"');
      return t; } },
    mirror_vy: { cap: 'Mặt gương gợn lên như mặt nước…', sfx: [[0.2, 'mirror'], [1.3, 'whisper']], make: function () {
      var t = '<rect width="960" height="540" fill="#0B1018"/><circle cx="560" cy="250" r="230" fill="#2F4F5C" opacity=".35"/>';
      t += '<circle cx="560" cy="250" r="170" fill="#9C7A3C" stroke="' + INK + '" stroke-width="8"/><circle cx="560" cy="250" r="150" fill="#1C3440" stroke="' + INK + '" stroke-width="5"/>';
      t += '<clipPath id="cmv"><circle cx="560" cy="250" r="150"/></clipPath><g clip-path="url(#cmv)">' +
        ring(560, 250, 10, 200, 0.2, '#6F86A0') + ring(560, 250, 10, 200, 0.6, '#6F86A0') +
        '<g opacity="0">' + chibi(VY, 'front', 440, 120, 1.5) + '<animate attributeName="opacity" values="0;.85" begin="0.9s" dur="0.9s" fill="freeze"/></g>' +
        '<circle cx="560" cy="250" r="150" fill="#6F86A0" opacity=".18"/></g>';
      // hai bàn tay chạm nhau qua mặt kính
      t += '<g opacity="0"><circle cx="472" cy="298" r="10" fill="#E2E2DC" stroke="#0F141B" stroke-width="3" opacity=".8"/><animate attributeName="opacity" values="0;.8" begin="1.4s" dur="0.6s" fill="freeze"/></g>'; // bàn tay Vy áp lên mặt kính từ phía trong
      t += '<g opacity="0"><circle cx="470" cy="298" r="18" fill="#E2E8EA"/><animate attributeName="opacity" values="0;0;1;0" keyTimes="0;.5;.7;1" begin="0.8s" dur="2.2s" fill="freeze"/></g>';
      t += chibi(ME(), 'back', 170, 110, 2.1);
      t += g('<path d="M0,0 Q40,-40 88,-54" fill="none" stroke="' + INK + '" stroke-width="22" stroke-linecap="round"/><path d="M0,0 Q40,-40 88,-54" fill="none" stroke="#3B4A5E" stroke-width="14" stroke-linecap="round"/><circle cx="92" cy="-56" r="13" fill="#E2E2DC" stroke="' + INK + '" stroke-width="4"/>' +
        '<animate attributeName="opacity" values="0;1" begin="0.6s" dur="0.4s" fill="freeze"/>', 'transform="translate(378,354)" opacity="0"');
      t += ring(470, 298, 16, 160, 2.05, '#E2E8EA');
      return t; } },
    mirror_go: { cap: 'Tôi bước vào mặt gương', sfx: [[0.1, 'mirror']], make: function () {
      var t = '<rect width="960" height="540" fill="#0B1018"/>';
      t += '<circle cx="480" cy="240" r="170" fill="#9C7A3C" stroke="' + INK + '" stroke-width="8"/><circle cx="480" cy="240" r="150" fill="#1C3440"/>';
      t += ring(480, 240, 10, 160, 0.1, '#6F86A0') + ring(480, 240, 10, 160, 0.5, '#6F86A0') + ring(480, 240, 10, 160, 0.9, '#6F86A0');
      // bước lại gần, nhỏ dần rồi tan vào gương
      t += '<g><animateTransform attributeName="transform" type="translate" values="480,470;480,330" begin="0.3s" dur="1.8s" fill="freeze"/>' +
        '<g>' + animT('scale', '1;0.4', 0.3, 1.8) + '<animate attributeName="opacity" values="1;1;0" begin="0.3s" dur="1.8s" fill="freeze"/>' +
        chibi(ME(), 'back', -176, -392, 2.2) + '</g></g>';
      t += '<rect width="960" height="540" fill="#E2E8EA" opacity="0"><animate attributeName="opacity" values="0;0;1" keyTimes="0;.6;1" begin="0.6s" dur="2.2s" fill="freeze"/></rect>';
      return t; } },
    chop: { cap: 'Rìu bổ xuống — then lim gãy đôi', sfx: [[0.75, 'chop']], make: function () {
      var t = '<rect width="960" height="540" fill="#1E1A16"/>';
      for (var i = 0; i < 6; i++) t += '<rect x="' + (240 + i * 80) + '" y="140" width="76" height="300" fill="#5A4A3C" stroke="' + INK + '" stroke-width="4"/>';
      t += '<rect x="400" y="200" width="160" height="180" fill="#05070A" opacity="0"><animate attributeName="opacity" values="0;.9" begin="0.8s" dur="0.4s" fill="freeze"/></rect>';
      t += g('<rect x="200" y="270" width="280" height="40" rx="8" fill="#6A5846" stroke="' + INK + '" stroke-width="5"/>' + animT('translate', '0,0;-120,-30', 0.78, 0.6) + animT('rotate', '0;-14', 0.78, 0.6));
      t += g('<rect x="480" y="270" width="280" height="40" rx="8" fill="#6A5846" stroke="' + INK + '" stroke-width="5"/>' + animT('translate', '0,0;120,40', 0.78, 0.6) + animT('rotate', '0;12', 0.78, 0.6));
      for (var s = 0; s < 8; s++) t += '<rect x="476" y="282" width="10" height="4" fill="#B9A27A" opacity="0"><animate attributeName="opacity" values="0;1;0" begin="0.78s" dur="0.8s" fill="freeze"/>' + animT('translate', '0,0;' + ((s - 4) * 40) + ',' + (-60 - s * 8), 0.78, 0.8) + '</rect>';
      t += g('<rect x="-10" y="-260" width="20" height="260" rx="8" fill="#6A5846" stroke="' + INK + '" stroke-width="5"/><path d="M-10,-260 q-70,10 -80,60 q40,-10 90,-20 z" fill="#C3CACD" stroke="' + INK + '" stroke-width="5"/>' +
        animT('rotate', '60;70;-30', 0.1, 0.7), 'transform="translate(560,560)"');
      return t; } },
    fire: { cap: 'Chuỗi đèn lồng đổ ập xuống mấy can dầu', sfx: [[1.0, 'fire']], make: function () {
      var t = '<rect width="960" height="540" fill="#140C0C"/>';
      t += '<rect width="960" height="540" fill="#C9873A" opacity="0"><animate attributeName="opacity" values="0;.35;.2;.4" begin="1.0s" dur="1.6s" fill="freeze"/></rect>';
      t += g('<path d="M60,90 Q480,150 900,90" fill="none" stroke="' + INK + '" stroke-width="3"/>' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<ellipse cx="' + (120 + i * 120) + '" cy="' + (104 + Math.sin(i / 6 * Math.PI) * 26) + '" rx="18" ry="22" fill="#A32E36" stroke="' + INK + '" stroke-width="3"/>'; }).join('') +
        animT('translate', '0,0;0,320', 0.3, 0.75) + animT('rotate', '0;8', 0.3, 0.75));
      [[260, 440], [420, 450], [580, 440], [740, 450]].forEach(function (c, i) {
        t += '<rect x="' + (c[0] - 30) + '" y="' + (c[1] - 50) + '" width="60" height="70" rx="6" fill="#3F6670" stroke="' + INK + '" stroke-width="4"/>';
        t += '<path d="M' + (c[0] - 40) + ',' + (c[1] - 40) + ' q20,-90 40,-130 q20,40 40,130 z" fill="#C9873A" stroke="#A32E36" stroke-width="4" opacity="0" style="transform-origin:' + c[0] + 'px ' + (c[1] - 40) + 'px">' +
          '<animate attributeName="opacity" values="0;1" begin="' + (1.0 + i * 0.12) + 's" dur="0.2s" fill="freeze"/>' + animT('scale', '0.2;1.2;0.9;1.15;1', 1.0 + i * 0.12, 1.4) + '</path>';
      });
      return t; } },
    knock: { cap: 'Cộc — cộc — cộc. "Vy! Anh đây!"', sfx: [[0.3, 'knock']], make: function () {
      var t = '<rect width="960" height="540" fill="#1B1F24"/><rect x="200" y="160" width="560" height="260" fill="#6F7378" stroke="' + INK + '" stroke-width="6"/>';
      t += '<path d="M280,200 l60,40 l-20,50 M620,180 l-30,70 l40,40" fill="none" stroke="#3A3E44" stroke-width="4"/>';
      [0.3, 0.58, 0.86].forEach(function (b, i) {
        t += '<circle cx="' + (440 + i * 40) + '" cy="300" r="10" fill="#B9C2C6" opacity="0"><animate attributeName="opacity" values="0;.8;0" begin="' + (b + 0.08) + 's" dur="0.6s" fill="freeze"/>' + animT('scale', '1;4', b + 0.08, 0.6) + '</circle>';
        t += '<text x="' + (420 + i * 60) + '" y="150" font-size="34" font-weight="900" fill="#E2D9A8" opacity="0" text-anchor="middle">cộc<animate attributeName="opacity" values="0;1;1" begin="' + (b + 0.08) + 's" dur="0.3s" fill="freeze"/></text>';
      });
      t += g('<rect x="-50" y="-30" width="100" height="70" rx="26" fill="#E2E2DC" stroke="' + INK + '" stroke-width="6"/><path d="M-30,-30 v30 M-5,-30 v30 M20,-30 v30" stroke="' + INK + '" stroke-width="4"/><rect x="-36" y="40" width="70" height="200" fill="#3B4A5E" stroke="' + INK + '" stroke-width="6"/>' +
        animT('translate', '0,0;0,-40;0,0;0,-40;0,0;0,-40;0,0', 0.1, 0.9), 'transform="translate(480,340)"');
      return t; } },
    lever: { cap: 'Dồn hết sức bẩy thanh sắt', sfx: [[0.2, 'creak'], [1.4, 'chop']], make: function () {
      var t = '<rect width="960" height="540" fill="#1B1F24"/><rect y="420" width="960" height="120" fill="#2F4F5C"/>';
      t += g('<rect x="300" y="190" width="380" height="230" fill="#6F7378" stroke="' + INK + '" stroke-width="6"/>' + animT('translate', '0,0;0,-6;0,-14;0,-60', 0.4, 1.4) + animT('rotate', '0;0;-4', 0.4, 1.4));
      t += g('<rect x="-20" y="-6" width="440" height="14" rx="6" fill="#4B5560" stroke="' + INK + '" stroke-width="5"/>' + animT('rotate', '0;-8;-14;-22', 0.3, 1.5), 'transform="translate(220,430)"');
      t += chibi(ME(), 'side', 640, 250, 1.6);
      return t; } },
    tunnel: { cap: 'Ba người lội cống, nước ngập tới ngực', sfx: [[0.2, 'splash']], make: function () {
      var t = '<rect width="960" height="540" fill="#05070A"/>';
      for (var i = 6; i >= 0; i--) { var s = 1 - i * 0.13; t += '<path d="M' + (480 - 420 * s) + ',' + (520 * s + 260 * (1 - s)) + ' V' + (260 - 200 * s) + ' Q480,' + (260 - 330 * s) + ' ' + (480 + 420 * s) + ',' + (260 - 200 * s) + ' V' + (520 * s + 260 * (1 - s)) + '" fill="none" stroke="#2B3138" stroke-width="' + (10 * s + 2) + '"/>'; }
      t += '<circle cx="480" cy="240" r="30" fill="#E2E8EA" opacity=".6"><animate attributeName="r" values="30;120" begin="0s" dur="3s" fill="freeze"/></circle>';
      t += '<rect y="330" width="960" height="210" fill="#1C3440" opacity=".92"/>';
      [[360, 1.0, VY], [480, 1.15, { hair: 'bun', shirt: '#857761', pants: '#33363F', eyes: 'tired' }], [600, 1.3, ME()]].forEach(function (p, k) {
        t += g(chibi(p[2], 'back', -80, -178, p[1]) + animT('translate', '0,0;0,-40', 0, 3), 'transform="translate(' + p[0] + ',' + (420 + k * 26) + ')"');
      });
      t += '<rect y="372" width="960" height="168" fill="#1C3440" opacity=".7"/>';
      return t; } }
  };

  // ---------- kết có hậu: bình minh trên sông, cả nhà và cả xóm quây quần quanh xe trà đá ----------
  SCENES.happy = { dur: 8.6, cap: 'Lần này, đã khác.', sfx: [[0.3, 'match'], [2.4, 'coin'], [3.6, 'clue']], make: function () {
    function L(id, fb) { return Object.assign({}, (G.NPCS[id] && G.NPCS[id].look) || fb, { smile: true }); } // ai cũng cười
    var me = L('me_15', { hair: 'bun', shirt: '#A32E36' }), vy = L('vy_ham', VY), meSelf = Object.assign({}, ME(), { smile: true });
    var t = '<defs><linearGradient id="hpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2C3A50"/><stop offset=".55" stop-color="#8A6A70"/><stop offset="1" stop-color="#D89A6A"/></linearGradient>' +
      '<radialGradient id="hpSun"><stop offset="0" stop-color="#FFE2A8" stop-opacity=".95"/><stop offset=".35" stop-color="#F2B878" stop-opacity=".5"/><stop offset="1" stop-color="#F2B878" stop-opacity="0"/></radialGradient></defs>';
    t += '<rect width="960" height="300" fill="url(#hpSky)"/>';
    t += '<g><circle cx="700" cy="300" r="220" fill="url(#hpSun)"/><circle cx="700" cy="300" r="46" fill="#FFE8B8" stroke="none"/>' + animT('translate', '0,40;0,-30', 0, 8.6) + '</g>';
    t += '<path d="M0,268 q60,-24 120,-6 q50,-22 110,0 q60,-20 120,2 L960,270 V300 H0 Z" fill="#4A4048"/>';
    t += '<g fill="#3A3038" stroke="' + INK + '" stroke-width="2"><rect x="300" y="236" width="130" height="44"/><path d="M272,240 q20,-6 30,-20 h126 q10,14 30,20 q-20,0 -26,-6 h-134 q-6,6 -26,6 z"/><rect x="356" y="252" width="18" height="28" fill="#A32E36"/></g>';
    t += '<rect y="290" width="960" height="90" fill="#5A6A7A"/>';
    for (var r = 0; r < 5; r++) t += '<rect x="' + (680 - r * 4) + '" y="' + (298 + r * 14) + '" width="' + (40 + r * 8) + '" height="4" rx="2" fill="#FFE2A8" opacity="' + (0.7 - r * 0.1) + '"/>';
    for (var m = 0; m < 3; m++) t += '<ellipse cx="' + (200 + m * 300) + '" cy="' + (300 + m * 10) + '" rx="220" ry="14" fill="#E8DCD0" opacity=".22">' + animT('translate', '0,0;80,0', 0, 8.6) + '</ellipse>';
    t += '<rect y="330" width="960" height="210" fill="#6A5A50"/><rect y="330" width="960" height="8" fill="#8A7A6A" stroke="' + INK + '" stroke-width="2"/>';
    // dây cờ và đèn lồng giăng ngang bến
    t += '<path d="M0,40 Q480,96 960,40" fill="none" stroke="' + INK + '" stroke-width="1.5"/>';
    for (var f = 0; f < 22; f++) { var fx = 20 + f * 44, fy = 40 + Math.sin(f / 21 * Math.PI) * 52; t += '<path d="M' + (fx - 7) + ',' + fy.toFixed(1) + ' h14 l-7,13 z" fill="' + ['#C04040', '#E2C040', '#3F7FA0', '#58955C', '#E07A30'][f % 5] + '" stroke="' + INK + '" stroke-width="1"/>'; }
    for (var b = 0; b < 4; b++) t += '<path d="M0,0 q6,-6 12,0 q6,-6 12,0" fill="none" stroke="#2B3138" stroke-width="2.5" transform="translate(' + (-60 - b * 40) + ',' + (110 + (b % 2) * 22) + ')">' + animT('translate', '0,0;1100,-40', 0.5 + b * 0.2, 7) + '</path>';
    // ông lão mũ cối đứng mờ ở mép nước, xa xa
    t += '<g opacity="0">' + chibi(L('khach_la', { hair: 'cap', shirt: '#857761' }), 'front', 830, 196, 0.62) + '<animate attributeName="opacity" values="0;0;.35;.35" keyTimes="0;.6;.75;1" begin="0s" dur="8.6s" fill="freeze"/></g>';
    function person(look, x, y, s, begin, cheer, flip) {
      return '<g opacity="0"><g class="' + (cheer ? 'cheer' : '') + '">' + animT('translate', '0,0;0,-7;0,0', begin + 0.8, 0.55, ' repeatCount="indefinite"') +
        chibi(look, 'front', x - 80 * s, y, s) + '</g><animate attributeName="opacity" values="0;1" begin="' + begin + 's" dur="0.6s" fill="freeze"/></g>';
    }
    // hàng sau: hàng xóm
    t += person(L('ban_rau', { hair: 'long', shirt: '#58755C' }), 60, 198, 0.82, 2.0, true);
    t += person(L('bac_do', { hair: 'old', shirt: '#3F6670' }), 140, 184, 0.9, 1.8, false);
    t += person(L('bac_ba', { hair: 'short', shirt: '#6A5846', body: 'wide' }), 226, 180, 0.92, 2.2, true);
    t += person(L('co_lan', { hair: 'non_la', shirt: '#A32E36' }), 520, 180, 0.92, 1.9, true);
    t += person(L('ba_nam', { hair: 'old', shirt: '#4B5560' }), 760, 184, 0.9, 2.4, false);
    t += person({ hair: 'short', hairColor: '#6F7880', shirt: '#58755C', pants: '#33363F', shoes: '#3F7FA0', eyes: 'tired', smile: true }, 830, 180, 0.92, 2.6, true);  // anh Lộc về nhà, vẫn đi dép tổ ong xanh
    t += person(L('ban_qua', { hair: 'non_la', shirt: '#948C5E' }), 905, 198, 0.82, 2.8, false);
    // Tùng dắt con Cub chở thùng đỏ
    t += '<g opacity="0"><g transform="translate(676,342)"><circle cx="-34" cy="-14" r="14" fill="#1B222C" stroke="' + INK + '" stroke-width="3"/><circle cx="38" cy="-14" r="14" fill="#1B222C" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M-48,-30 q10,-14 40,-12 l30,6 l10,-10 l8,16 l-60,8 z" fill="#5E2E48" stroke="' + INK + '" stroke-width="3"/><rect x="-64" y="-66" width="40" height="30" rx="4" fill="#A32E36" stroke="' + INK + '" stroke-width="3"/></g>' +
      person(L('tung', { hair: 'helmet', shirt: '#3F7566' }), 640, 184, 0.9, 0, true).replace('<g opacity="0">', '<g>').replace(/<animate attributeName="opacity"[^>]*\/><\/g>$/, '</g>') +
      '<animate attributeName="opacity" values="0;1" begin="2.1s" dur="0.6s" fill="freeze"/></g>';
    // hàng trước: cả nhà quanh xe trà đá, bé Na, chó mèo
    t += person(me, 404, 193, 1.15, 0.5, false);
    t += '<g transform="translate(386,246) scale(1.05)">' + G.art.cart({ upgrades: {}, stock: { tra_da: 8, banh_mi: 4, nuoc_ngot: 3 } }) + '</g>';
    t += person(meSelf, 270, 198, 1.12, 1.3, true);
    t += person(vy, 590, 205, 1.08, 0.9, true);
    t += person(L('be_na', { hair: 'long', shirt: '#948C5E', kid: true, prop: 'balloon' }), 160, 228, 0.95, 2.5, true);
    t += '<g opacity="0"><g transform="translate(220,424) scale(1.6)">' + G.art.cat({ coat: '#857761', stripes: true, light: '#D8C8A8' }) + '</g><animate attributeName="opacity" values="0;1" begin="3s" dur="0.6s" fill="freeze"/></g>'; // mèo mướp
    t += '<g opacity="0"><g transform="translate(730,430) scale(1.5,1.5) scale(-1,1)">' + G.art.dog() + '</g><animate attributeName="opacity" values="0;1" begin="3.1s" dur="0.6s" fill="freeze"/></g>'; // chó vàng vẫy đuôi
    // đèn ông sao + hoa giấy bay lên
    for (var s = 0; s < 6; s++) { var sx = 90 + s * 160, star = ''; for (var k = 0; k < 10; k++) { var a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 5 : 12; star += (k ? 'L' : 'M') + (sx + Math.cos(a) * rr).toFixed(1) + ',' + (470 + Math.sin(a) * rr).toFixed(1); }
      t += '<path d="' + star + 'z" fill="' + (s % 2 ? '#E2C040' : '#C83A3A') + '" stroke="' + INK + '" stroke-width="1.5" opacity="0">' + animT('translate', '0,0;' + (s % 2 ? 30 : -30) + ',-460', 3.4 + s * 0.3, 5) + '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.8;1" begin="' + (3.4 + s * 0.3) + 's" dur="5s" fill="freeze"/></path>'; }
    for (var c = 0; c < 24; c++) t += '<rect x="' + (40 + (c * 41) % 900) + '" y="-10" width="6" height="9" fill="' + ['#C04040', '#E2C040', '#3F7FA0', '#58955C', '#F2F0E0'][c % 5] + '" opacity="0">' + animT('translate', '0,0;' + ((c % 3) * 20 - 20) + ',560', 3.0 + (c % 8) * 0.25, 4.5) + animT('rotate', '0;540', 3.0 + (c % 8) * 0.25, 4.5) + '<animate attributeName="opacity" values="0;1;1" begin="' + (3.0 + (c % 8) * 0.25) + 's" dur="4.5s" fill="freeze"/></rect>';
    t += '<text x="480" y="112" text-anchor="middle" font-size="28" font-weight="800" fill="#FFF4DC" stroke="' + INK + '" stroke-width="1" opacity="0" font-family="Segoe UI, Arial">Sáng hôm sau, cả xóm ra bến uống trà.<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" begin="3.8s" dur="4.6s" fill="freeze"/></text>';
    return t; } };

  // ---------- trình phát ----------
  var box = document.createElement('div');
  box.id = 'cut'; box.hidden = true;
  document.getElementById('stage').appendChild(box);
  var cur = null;
  G.cutscene = function (id, then) {
    var sc = SCENES[id];
    if (!sc || (G.S && G.S.flags && G.S.flags.noCut)) { if (then) then(); return; }
    var dur = sc.dur || 3.2, timers = [];
    box.innerHTML = '<div class="cut-bar top"></div><svg viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice"><g stroke-linejoin="round" stroke-linecap="round">' + sc.make() + '</g></svg>' +
      '<div class="cut-bar bot"><span>' + sc.cap + '</span></div><div class="cut-skip">Bấm để bỏ qua ▸</div>';
    box.hidden = false; G.ui.modal = 'cut';
    (sc.sfx || []).forEach(function (s) { timers.push(setTimeout(function () { if (G.audio && G.audio.sfx) G.audio.sfx(s[1]); }, s[0] * 1000)); });
    cur = function () {
      if (!cur) return;
      cur = null;
      timers.forEach(clearTimeout);
      box.hidden = true; box.innerHTML = '';
      if (G.ui.modal === 'cut') G.ui.modal = null;
      if (then) then();
    };
    timers.push(setTimeout(function () { if (cur) cur(); }, dur * 1000));
  };
  box.addEventListener('click', function () { if (cur) cur(); });
  var close0 = G.ui.close;
  G.ui.close = function (id) { if (id === 'cut') { if (cur) cur(); return; } return close0.apply(this, arguments); };
  window.addEventListener('keydown', function (e) { if (cur && (e.code === 'Space' || e.code === 'Enter' || e.code === 'Escape' || e.code === 'KeyE')) { e.stopPropagation(); cur(); } }, true);

  // ---------- móc vào thoại ----------
  var CUT_BY_TEXT = { gong: 'gong', escape: 'river_fall', nen_tho: 'nen_tho', mirror_voice: 'mirror_vy',
    mirror_n2: 'mirror_go', mirror_n3: 'mirror_go', mirror_n4: 'mirror_go', mirror_n5: 'mirror_go', mirror_n6: 'mirror_go',
    chop: 'chop', chop_mom: 'chop', fire: 'fire', knock: 'knock', lever: 'lever', exit_cong: 'tunnel' };
  G.CUT_BY_TEXT = CUT_BY_TEXT;
  var dialog0 = G.ui.dialog;
  G.ui.dialog = function (lines, onEnd) {
    var self = this, args = arguments;
    for (var k in CUT_BY_TEXT) if (G.TEXT[k] && G.TEXT[k] === lines) {
      var id = CUT_BY_TEXT[k];
      G.cutscene(id, function () { dialog0.apply(self, args); });
      return;
    }
    return dialog0.apply(this, arguments);
  };
  G.CUT_SCENES = SCENES;
  // kết truyện: chiếu cảnh có hậu trước bảng "Hết truyện"
  var theEnd0 = G.ui.theEnd;
  if (theEnd0) G.ui.theEnd = function () {
    var self = this, args = arguments;
    G.cutscene('happy', function () { if (G.giveStampThen) G.giveStampThen('thumb', showEnd); else showEnd(); }); // tem cuối "👍" rồi mới hiện bảng kết
    function showEnd() {
      theEnd0.apply(self, args);
      var p = document.getElementById('ending'); // after-credit: tên tác giả
      if (p && !p.querySelector('.credits')) {
        var c = document.createElement('div'); c.className = 'credits';
        c.innerHTML = '<span>Một trò chơi của</span><b>@aquamann793</b><small>Cảm ơn bạn đã chơi đến cuối.</small>';
        var list = p.querySelector('.list:last-child'); if (list) p.insertBefore(c, list); else p.appendChild(c);
      }
    }
  };
})();
