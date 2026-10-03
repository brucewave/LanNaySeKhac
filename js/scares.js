// Cảnh hù dọa: mỗi cảnh xảy ra một lần, khi tới đúng chỗ đúng giờ. Tối đa một cảnh mỗi ngày.
// Hình bật to giữa màn hình + rung + tiếng hù, rồi nhân vật nói một câu cho hoàn hồn.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var INK = '#0F141B';

  // ---------- hình ----------
  function eyes(cx, cy, gap, r) {
    return [-1, 1].map(function (s) {
      var x = cx + s * gap;
      return '<ellipse cx="' + x + '" cy="' + cy + '" rx="' + r + '" ry="' + (r * 1.25) + '" fill="' + INK + '"/>' +
        '<circle cx="' + (x + s * 1.5) + '" cy="' + (cy + 2) + '" r="' + (r * 0.18) + '" fill="#E2E8EA"/>';
    }).join('');
  }
  function face(o) { // mặt tái, tóc dài rủ, mắt hốc, miệng há
    var t = '';
    t += '<path d="M60,40 Q160,-30 260,40 L290,330 Q250,300 230,340 L210,250 Q160,280 110,250 L90,340 Q70,300 30,330 Z" fill="' + (o.hair || '#0B0F14') + '"/>';
    t += '<ellipse cx="160" cy="150" rx="' + (o.kid ? 82 : 74) + '" ry="' + (o.kid ? 88 : 100) + '" fill="' + (o.skin || '#B9C2C6') + '" stroke="' + INK + '" stroke-width="6"/>';
    if (o.kid) t += '<path d="M78,120 Q100,60 160,58 Q220,60 242,120 Q200,96 160,104 Q120,96 78,120 Z" fill="#0B0F14"/>';
    else t += '<path d="M92,150 Q100,60 160,52 Q130,90 124,170 Z M228,150 Q220,60 160,52 Q190,90 196,170 Z" fill="#0B0F14"/>';
    var ey = o.kid ? 150 : 140, eg = o.kid ? 30 : 26;
    t += '<ellipse cx="' + (160 - eg) + '" cy="' + (ey + 4) + '" rx="27" ry="31" fill="#3B3F48" opacity=".75"/><ellipse cx="' + (160 + eg) + '" cy="' + (ey + 4) + '" rx="27" ry="31" fill="#3B3F48" opacity=".75"/>';
    t += eyes(160, o.kid ? 150 : 140, o.kid ? 30 : 26, o.kid ? 17 : 15);
    // miệng há dọc, méo
    t += '<path d="M' + (o.kid ? 150 : 146) + ',196 Q' + (o.kid ? 144 : 138) + ',' + (o.kid ? 232 : 248) + ' 160,' + (o.kid ? 240 : 256) + ' Q' + (o.kid ? 178 : 184) + ',' + (o.kid ? 230 : 244) + ' ' + (o.kid ? 170 : 174) + ',196 Q160,190 ' + (o.kid ? 150 : 146) + ',196 Z" fill="' + INK + '"/>';
    t += '<path d="M120,176 q6,30 -4,52 M204,176 q-4,26 6,46" stroke="#5A1E24" stroke-width="3" fill="none" opacity=".8"/>'; // vệt nước mắt sẫm
    if (o.burn) t += '<path d="M90,190 q30,-20 50,10 q20,30 60,0 q20,-20 40,10 L230,240 Q160,260 96,236 Z" fill="#1B1414" opacity=".85"/>' +
      '<circle cx="110" cy="214" r="4" fill="#A32E36"/><circle cx="196" cy="226" r="3" fill="#C9873A"/><circle cx="150" cy="240" r="3" fill="#A32E36"/>';
    if (o.wet) t += '<path d="M120,60 q-4,30 2,50 M200,64 q4,26 -2,44 M150,52 q-2,20 2,30" stroke="#6F86A0" stroke-width="3" fill="none"/>';
    return t;
  }
  var ART = {
    altar: function () { // tấm ảnh thờ quay mặt nhìn ra
      return '<rect x="40" y="10" width="240" height="300" fill="#2B2622" stroke="' + INK + '" stroke-width="8"/>' +
        '<rect x="58" y="28" width="204" height="264" fill="#1B222C"/>' +
        '<g transform="translate(30,20) scale(.82)">' + face({ skin: '#A8A28E' }) + '</g>' +
        '<path d="M40,10 l240,300 M280,10 l-90,110" stroke="#D5DCE0" stroke-width="2" opacity=".5"/>' +
        '<rect x="0" y="300" width="320" height="30" fill="#A32E36" stroke="' + INK + '" stroke-width="5"/>';
    },
    river: function () { // mặt người chồi lên khỏi mặt nước, hai bàn tay bám
      return '<g transform="translate(0,-10)">' + face({ wet: true, skin: '#9FB0B4', hair: '#0A1418' }) + '</g>' +
        '<rect x="-40" y="250" width="400" height="120" fill="#1E3A44"/>' +
        '<path d="M-40,252 q40,-14 80,0 t80,0 t80,0 t80,0 t80,0" fill="none" stroke="#6F86A0" stroke-width="4"/>' +
        ['M40,262 l-6,-60 l10,0 l4,40 l4,-50 l10,0 l2,52 l6,-40 l10,2 l-4,58 Z', 'M280,262 l6,-60 l-10,0 l-4,40 l-4,-50 l-10,0 l-2,52 l-6,-40 l-10,2 l4,58 Z']
          .map(function (d) { return '<path d="' + d + '" fill="#9FB0B4" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>'; }).join('');
    },
    shutter: function () { // khe cửa cuốn, đôi mắt ghé sát
      var t = '<rect x="0" y="0" width="320" height="340" fill="#3A4450"/>';
      for (var y = 0; y < 340; y += 18) t += '<path d="M0,' + y + ' H320" stroke="' + INK + '" stroke-width="4"/>';
      t += '<rect x="0" y="150" width="320" height="56" fill="#05070A"/>';
      t += eyes(160, 178, 46, 18).replace(/fill="#0F141B"/g, 'fill="#D5DCE0"').replace(/fill="#E2E8EA"/g, 'fill="#0F141B"').replace(/r="3.24"/g, 'r="7"');
      t += '<path d="M90,150 q20,-6 40,0 M190,150 q20,-6 40,0" stroke="' + INK + '" stroke-width="4"/>';
      return t;
    },
    poster: function () { // tờ tìm người: khuôn mặt trong ảnh xé giấy lao ra, hai bàn tay bấu mép ảnh
      var t = '<rect x="-40" y="-20" width="400" height="380" fill="#C8B480"/>';
      t += '<text x="160" y="24" text-anchor="middle" font-size="40" font-weight="900" fill="#5A3A1A" stroke="none" font-family="Segoe UI, Arial">TÌM NGƯỜI</text>';
      t += '<rect x="40" y="40" width="240" height="280" fill="#2A221A" stroke="' + INK + '" stroke-width="8"/>';
      t += '<g transform="translate(0,30) scale(1.05) translate(-8,0)">' + face({ skin: '#A8A28E', wet: true }) + '</g>';
      t += '<path d="M40,40 l30,40 l-20,30 l26,40 M280,40 l-24,50 l18,30 l-22,46 M40,320 l40,-30 l30,20 M280,320 l-36,-26 l-20,18" fill="none" stroke="#E8DCB8" stroke-width="6"/>'; // giấy rách
      ['M30,250 l-6,-60 l12,0 l4,40 l4,-50 l12,0 l2,52 l6,-40 l12,2 l-4,58 Z', 'M290,250 l6,-60 l-12,0 l-4,40 l-4,-50 l-12,0 l-2,52 l-6,-40 l-12,2 l4,58 Z']
        .forEach(function (d) { t += '<path d="' + d + '" fill="#A8A28E" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>'; });
      t += '<path d="M60,330 q4,20 -2,30 M150,326 q6,18 0,34 M240,330 q-4,16 2,28" stroke="#5A1E24" stroke-width="5" opacity=".7"/>'; // mực loang chảy
      return t;
    },
    window: function () { // đứa trẻ áp mặt vào cửa sổ
      return '<rect x="0" y="0" width="320" height="340" fill="#1B222C" stroke="' + INK + '" stroke-width="10"/>' +
        '<g transform="translate(0,20)">' + face({ kid: true, skin: '#C3CACD' }) + '</g>' +
        '<path d="M100,250 l-30,90 M220,250 l30,90" stroke="#A32E36" stroke-width="16"/>' +
        '<path d="M160,0 V340 M0,170 H320" stroke="#2B3138" stroke-width="12" opacity=".85"/>' +
        '<path d="M110,190 q10,30 4,60 M130,196 q4,24 -2,46" stroke="#D5DCE0" stroke-width="3" fill="none" opacity=".5"/>'; // vệt tay trên kính
    },
    burn: function () { // bóng người cháy xém trong khói
      return '<rect x="-40" y="-20" width="400" height="380" fill="#1A0E0E"/>' +
        '<circle cx="160" cy="200" r="170" fill="#5A1E24" opacity=".5"/>' +
        face({ burn: true, skin: '#6E6458', hair: '#140C0C' }) +
        '<path d="M20,340 q30,-60 10,-110 q40,30 50,80 M300,340 q-30,-70 -6,-120 q-40,30 -48,90" fill="#C9873A" opacity=".8"/>' +
        '<path d="M40,340 q20,-40 6,-70 q24,20 30,60 M280,340 q-20,-46 -4,-80 q-24,24 -28,70" fill="#A32E36"/>';
    }
  };

  // ---------- danh sách cảnh ----------
  var near = function (S, x, y, r) { return Math.hypot(S.x - x, S.y - y) < r; };
  G.SCARES = [
    { id: 'altar', art: 'altar', when: function (S) { return S.loc === 'nha' && S.day >= 2 && S.min >= 19 * 60 && near(S, 255, 230, 130); },
      lines: [{ who: 'Tôi', text: '…Tấm ảnh trên bàn thờ vừa… [[quay ra nhìn mình]]?' }, { who: 'Tôi', text: 'Không. Là bóng đèn chập chờn thôi. Chắc vậy.' }] },
    { id: 'river', art: 'river', when: function (S) { return S.loc === 'ben_song' && S.day >= 3 && S.min >= 18 * 60 && S.y > 640; },
      lines: [{ who: 'Tôi', text: 'Có cái gì… [[ngoi lên từ dưới nước]].' }, { who: 'Tôi', text: 'Mặt sông lại phẳng lặng như chưa có gì. Mình đứng xa mép nước ra thì hơn.' }] },
    { id: 'shutter', art: 'shutter', when: function (S) { return S.loc === 'cho' && S.day >= 2 && S.min >= 17 * 60 + 30 && S.x > 640; },
      lines: [{ who: 'Tôi', text: 'Cửa cuốn rung bần bật… sau khe có [[đôi mắt]].' }, { who: 'Tôi', text: 'Căn này bỏ hoang từ lâu rồi mà.' }] },
    // bảng tin: chỉ bật ra khi người chơi tò mò bấm vào xem (xem móc W.interact phía dưới)
    { id: 'poster', art: 'poster', click: true, when: function () { return false; },
      lines: [{ who: 'Tôi', text: 'Khuôn mặt trong tờ tìm người… vừa [[xé giấy lao ra]].' }, { who: 'Tôi', text: 'Không. Vẫn là tờ giấy ố vàng. Chỉ có vết rách ở góc là mới.' }] },
    { id: 'burn', art: 'burn', era96: true, when: function (S) { return S.era === '1996' && S.pnight >= 2 && S.pnight <= 4 && (S.loc === 'duong_96' || S.loc === 'nha_96' || S.loc === 'ben_96') && sceneT > 3; },
      lines: [{ who: 'Tôi', text: 'Mùi khói… và gương mặt [[cháy xém]] vụt qua trước mắt.' }, { who: 'Tôi', text: 'Đêm đình cháy còn chưa tới. Sao mình lại thấy nó?' }] }
  ];

  // ---------- màn hù ----------
  var box = document.createElement('div');
  box.id = 'scare'; box.hidden = true;
  $('stage').appendChild(box);
  var running = false;

  G.jumpscare = function (sc, then) {
    var S = G.S, W = G.world;
    if (running) return;
    running = true;
    S.seen['scare_' + sc.id] = 1; S.flags.scare_day = S.day;
    W.route = null; W.pending = null; G.input.jx = G.input.jy = 0;
    box.innerHTML = '<div class="sc-flash"></div><svg viewBox="-40 -20 400 380" class="sc-art">' + ART[sc.art]() + '</svg>';
    box.hidden = false; G.ui.modal = 'scare';
    document.getElementById('stage').classList.add('shake');
    if (G.audio && G.audio.sfx) G.audio.sfx('scare');
    if (G.audio && G.audio.duck) G.audio.duck(2.2);
    setTimeout(function () {
      document.getElementById('stage').classList.remove('shake');
      finish();
    }, 1300);
    function finish() {
      if (!running) return;
      running = false;
      box.hidden = true; box.innerHTML = '';
      if (G.ui.modal === 'scare') G.ui.modal = null;
      G.ui.dialog(sc.lines, then);
    }
    G.ui.closeScare = finish;
  };
  // Bấm xem bảng tin lần đầu: nhìn tờ giấy một lúc rồi khuôn mặt trong ảnh bật ra; xong mới đọc bảng tin như thường
  var interactS = G.world.interact;
  G.world.interact = function (t) {
    var S = G.S, self = this, args = arguments;
    var sc = G.SCARES.filter(function (x) { return x.id === 'poster'; })[0];
    if (t && t.id === 'bang_tin' && sc && !S.era && !S.seen.scare_poster) {
      var fired = false;
      var go = function () { if (fired) return; fired = true; if (G.ui.modal === 'dialog') { G.ui.close('dialog'); if (G.ui.closeup) G.ui.closeup(null); } G.jumpscare(sc, function () { interactS.apply(self, args); }); };
      G.ui.dialog([{ text: 'Một tờ tìm người ố vàng dán dưới cùng. Ảnh nhoè hết… nhưng hình như khuôn mặt đang [[nhìn thẳng vào mình]].', img: 'bang_tin' }], go);
      setTimeout(go, 1700);
      return;
    }
    return interactS.apply(this, arguments);
  };
  // bot (hoặc mã khác) đóng bảng theo id: cho đóng sớm màn hù
  var close0 = G.ui.close;
  G.ui.close = function (id) { if (id === 'scare') { if (G.ui.closeScare) G.ui.closeScare(); return; } return close0.apply(this, arguments); };

  // ---------- kích hoạt ----------
  var sceneT = 0, acc = 0;
  var enter0 = G.onEnter;
  G.onEnter = function (locId) { sceneT = 0; if (enter0) enter0(locId); };
  var tick0 = G.tick;
  G.tick = function (dt) {
    if (tick0) tick0(dt);
    sceneT += dt; acc += dt;
    if (acc < 0.25) return;
    acc = 0;
    var S = G.S, W = G.world;
    if (!S || G.ui.modal || W.mode !== 'walk' || (G.danger && G.danger.active) ) return;
    for (var i = 0; i < G.SCARES.length; i++) {
      var sc = G.SCARES[i];
      if (sc.click) continue;                                 // cảnh chỉ bật khi bấm xem
      if (!sc.era96 && S.flags.scare_day === S.day) continue; // ở 2026 tối đa một cảnh mỗi ngày
      if (!S.seen['scare_' + sc.id] && sc.when(S)) { G.jumpscare(sc); return; }
    }
  };
})();
