// Bộ sưu tập meme: 10 thẻ giấu khắp xóm (chỉ ở năm 2026). Nhặt đủ thì đạt thành tựu "Meme Chúa".
// Với người thật, thẻ chỉ dùng đồ vật/câu nói đặc trưng, không vẽ chân dung, không ghi họ tên thật.
var G = window.G || (window.G = {});

(function () {
  var INK = '#0F141B';
  G.MEMES = [
    { id: 'meo_ngo', name: 'Mèo ngơ ngác', cap: '"...?"', loc: 'nha', x: 720, y: 300, col: '#6F86A0' },
    { id: 'hoa_hong', name: 'Bông hồng của anh Hoa Hồng', cap: '"Có làm thì mới có ăn."', loc: 'duong', x: 900, y: 470, col: '#A32E36' },
    { id: 'nui', name: 'Hòn núi của a Núi', cap: 'A Núi đã ở đây.', loc: 'ben_song', x: 40, y: 480, col: '#58755C' },
    { id: 'truong_con', name: 'Chiếc mũ của chú Trường Con', cap: 'Chú Trường Con đã ghé qua.', loc: 'cho', x: 900, y: 600, col: '#948C5E' },
    { id: 'toang', name: 'Toang', cap: '"Toang rồi!"', loc: 'dinh_nay', x: 880, y: 480, col: '#8C949B' },
    { id: 'dinh_chop', name: 'Đỉnh của chóp', cap: '"Đỉnh của chóp!"', loc: 'duong', x: 820, y: 712, col: '#E2B060' },
    { id: 'cai_nit', name: 'Còn cái nịt', cap: '"Còn cái nịt."', loc: 'cho', x: 60, y: 712, col: '#6A4A3A' },
    { id: 'et_o_et', name: 'Ét ô ét', cap: '"Ét ô ét!"', loc: 'ben_song', x: 930, y: 700, col: '#3F6670' },
    { id: 'get_go', name: 'Gét gô', cap: '"Gét gô!"', loc: 'nha', x: 60, y: 712, col: '#C0303A' },
    { id: 'oi_doi_oi', name: 'Ối dồi ôi', cap: '"Ối dồi ôi!"', loc: 'ben_song', x: 620, y: 560, col: '#F2D27A' }
  ];
  var BY = {}; G.MEMES.forEach(function (m) { BY[m.id] = m; });

  // trạng thái: S.memes = { id: 1 }
  var ns0 = G.newState;
  G.newState = function () { var S = ns0(); S.memes = {}; return S; };
  function count(S) { return Object.keys(S.memes || {}).length; }

  // ---------- hình vẽ từng meme (toạ độ thẻ 520x300, tâm ~260,130) ----------
  var ICON = {
    meo_ngo: '<ellipse cx="260" cy="140" rx="70" ry="62" fill="#8C949B"/><path d="M200,104 l10,-46 l34,30 Z M320,104 l-10,-46 l-34,30 Z" fill="#8C949B"/>' +
      '<circle cx="232" cy="134" r="20" fill="#F2F4F5"/><circle cx="288" cy="134" r="20" fill="#F2F4F5"/><circle cx="232" cy="134" r="5" fill="' + INK + '"/><circle cx="288" cy="134" r="5" fill="' + INK + '"/>' +
      '<path d="M254,164 l6,6 l6,-6" fill="none" stroke-width="3"/><path d="M196,160 h-30M196,170 h-28M324,160 h30M324,170 h28" stroke-width="2"/>',
    hoa_hong: '<path d="M260,230 Q256,180 262,130" fill="none" stroke="#3F6A50" stroke-width="7"/><path d="M258,196 l-12,-4M262,170 l12,-6" stroke="#3F6A50" stroke-width="3"/>' +
      '<ellipse cx="236" cy="190" rx="20" ry="9" fill="#58855E" transform="rotate(-25 236 190)"/><ellipse cx="286" cy="164" rx="20" ry="9" fill="#58855E" transform="rotate(20 286 164)"/>' +
      '<circle cx="262" cy="104" r="40" fill="#A32E36"/><path d="M262,104 m-18,0 a18,18 0 1,1 36,0 a12,12 0 1,1 -24,0 a6,6 0 1,1 12,0" fill="none" stroke="#6A1A20" stroke-width="3"/>' +
      '<path d="M226,90 q20,-30 36,-26 q20,-6 36,26" fill="none" stroke="#6A1A20" stroke-width="3"/>',
    nui: '<path d="M120,220 L220,70 L300,190 L340,140 L420,220 Z" fill="#58755C"/><path d="M196,106 L220,70 L246,108 L232,100 L220,112 Z" fill="#E6EEF2"/>' +
      '<path d="M220,70 V30" stroke-width="3"/><path d="M220,30 l30,8 l-30,8 Z" fill="#C0303A"/>',
    truong_con: '<ellipse cx="260" cy="180" rx="130" ry="30" fill="#948C5E"/><path d="M180,176 Q186,96 260,92 Q334,96 340,176 Z" fill="#A4A98C"/>' +
      '<path d="M184,160 Q260,176 336,160" fill="none" stroke="#6A6040" stroke-width="5"/><path class="d" d="M200,186 q60,10 120,0" stroke="#6A6040"/>',
    toang: '<path d="M200,220 Q170,150 210,100 H310 Q350,150 320,220 Z" fill="#6A5846"/><path d="M230,100 l20,50 l-14,30 l26,40" fill="none" stroke="' + INK + '" stroke-width="4"/>' +
      '<path d="M330,90 l26,-20 l10,16 Z M180,92 l-24,-16 l-6,18 Z" fill="#6A5846"/>' +
      '<text x="260" y="70" text-anchor="middle" font-size="40" font-weight="900" fill="#E2D2A0" stroke="none" font-family="Segoe UI, Arial">TOANG</text>',
    dinh_chop: '<path d="M260,40 L330,220 H190 Z" fill="#E2B060"/><path d="M260,40 L290,220 H260 Z" fill="#C8924C"/>' +
      '<path d="M200,70 l6,14 l14,6 l-14,6 l-6,14 l-6,-14 l-14,-6 l14,-6 Z M330,90 l4,10 l10,4 l-10,4 l-4,10 l-4,-10 l-10,-4 l10,-4 Z" fill="#F2F4F5" stroke-width="2"/>',
    cai_nit: '<path d="M150,150 Q150,100 260,100 Q370,100 370,150 Q370,200 260,200 Q150,200 150,150 Z" fill="none" stroke="#6A4A3A" stroke-width="26"/>' +
      '<path d="M150,150 Q150,100 260,100 Q370,100 370,150 Q370,200 260,200 Q150,200 150,150 Z" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      '<rect x="236" y="182" width="48" height="36" rx="4" fill="#C8B080" stroke-width="3"/><path d="M246,200 h28" stroke-width="3"/>',
    et_o_et: '<path d="M170,190 Q160,150 200,140 L300,120 Q340,112 352,150 L360,170 Q366,200 330,206 L220,226 Q180,232 170,190 Z" fill="#B9C6CC" fill-opacity=".55"/>' +
      '<path d="M352,150 l30,-8 l6,22 l-30,8 Z" fill="#6A5846"/><rect x="214" y="160" width="90" height="34" rx="6" fill="#E6E2D6" transform="rotate(-10 259 177)"/>' +
      '<text x="258" y="186" text-anchor="middle" font-size="22" font-weight="900" fill="#C0303A" stroke="none" transform="rotate(-10 259 177)" font-family="Segoe UI, Arial">SOS</text>',
    get_go: '<path d="M150,180 Q160,140 200,146 L250,150 Q280,160 300,184 L300,200 H150 Z" fill="#C0303A"/><path d="M150,200 H300" stroke-width="8"/>' +
      '<path d="M270,180 Q280,140 320,146 L370,150 Q400,160 420,184 L420,200 H270 Z" fill="#E6E2D6"/><path d="M270,200 H420" stroke-width="8"/>' +
      '<path d="M100,150 h40M90,170 h50M110,190 h30" stroke-width="4"/>',
    oi_doi_oi: '<circle cx="260" cy="134" r="78" fill="#F2D27A"/><ellipse cx="232" cy="116" rx="9" ry="13" fill="' + INK + '"/><ellipse cx="288" cy="116" rx="9" ry="13" fill="' + INK + '"/>' +
      '<ellipse cx="260" cy="166" rx="18" ry="22" fill="' + INK + '"/><path d="M186,150 q-18,10 -10,40 q16,-6 22,-26 M334,150 q18,10 10,40 q-16,-6 -22,-26" fill="#F2D27A" stroke-width="3"/>'
  };
  function card(m) {
    return '<svg viewBox="0 0 520 300" width="520" height="300"><rect width="520" height="300" fill="#141A20"/>' +
      '<g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#w)">' +
      '<rect x="40" y="10" width="440" height="280" rx="18" fill="#E6E2D6"/><rect x="56" y="26" width="408" height="216" rx="10" fill="' + m.col + '" fill-opacity=".35"/>' +
      (ICON[m.id] || '') +
      '<text x="260" y="272" text-anchor="middle" font-size="20" font-weight="800" fill="#2A2420" stroke="none" font-family="Segoe UI, Arial">' + m.cap.replace(/"/g, '&quot;') + '</text>' +
      '<text x="70" y="48" font-size="13" font-weight="800" fill="#2A2420" stroke="none" font-family="Segoe UI, Arial">MEME · ' + (G.MEMES.indexOf(m) + 1) + '/' + G.MEMES.length + '</text></g></svg>';
  }
  G.MEMES.forEach(function (m) { G.CLOSEUPS['meme_' + m.id] = function () { return card(m); }; });
  G.CLOSEUPS.meme_chua = function () {
    return '<svg viewBox="0 0 520 300" width="520" height="300"><rect width="520" height="300" fill="#141A20"/>' +
      '<g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" filter="url(#w)">' +
      '<ellipse cx="260" cy="150" rx="230" ry="130" fill="#E2B060" opacity=".15" stroke="none"/>' +
      '<path d="M150,190 L170,90 L215,140 L260,70 L305,140 L350,90 L370,190 Z" fill="#E2B060"/><rect x="150" y="190" width="220" height="30" fill="#C8924C"/>' +
      '<circle cx="260" cy="110" r="10" fill="#A32E36"/><circle cx="200" cy="160" r="8" fill="#3F6670"/><circle cx="320" cy="160" r="8" fill="#3F6670"/>' +
      '<text x="260" y="268" text-anchor="middle" font-size="34" font-weight="900" fill="#F2D27A" stroke="none" font-family="Segoe UI, Arial">MEME CHÚA</text></g></svg>';
  };

  // ---------- đặt thẻ vào các cảnh (chỉ năm 2026, chưa nhặt) ----------
  G.MEMES.forEach(function (m) {
    G.LOCATIONS[m.loc].things.push({ id: 'meme_' + m.id, x: m.x, y: m.y, label: 'Nhặt thẻ meme', act: 'meme', meme: m.id,
      cond: function (S) { return !S.era && !(S.memes || {})[m.id]; } });
  });
  var locs = {}; G.MEMES.forEach(function (m) { (locs[m.loc] = locs[m.loc] || []).push(m); });
  Object.keys(locs).forEach(function (loc) {
    var f0 = G.scenes[loc];
    G.scenes[loc] = function (W, H) {
      var sc = f0(W, H), S = G.S;
      if (!S || S.era) return sc;
      locs[loc].forEach(function (m) {
        if ((S.memes || {})[m.id]) return;
        var x = m.x, y = m.y;
        sc.props.push({ x: x - 30, y: y - 50, w: 60, h: 60, z: y,
          svg: '<svg class="prop fx" viewBox="' + (x - 30) + ' ' + (y - 50) + ' 60 60" width="60" height="60" overflow="visible">' +
            '<g transform="rotate(-12 ' + x + ' ' + (y - 6) + ')"><rect x="' + (x - 11) + '" y="' + (y - 15) + '" width="22" height="15" rx="2" fill="#E6E2D6" stroke="' + INK + '" stroke-width="2"/>' +
            '<rect x="' + (x - 7) + '" y="' + (y - 12) + '" width="14" height="9" fill="' + m.col + '"/></g>' +
            '<path class="glint" d="M' + x + ',' + (y - 36) + ' l3,8 l8,3 l-8,3 l-3,8 l-3,-8 l-8,-3 l8,-3 Z" fill="#F2E28A"/></svg>' });
      });
      return sc;
    };
  });

  // ---------- nhặt thẻ ----------
  G.acts.meme = function (t) {
    var S = G.S, m = BY[t.meme];
    S.memes = S.memes || {};
    G.ui.dialog([
      { text: 'Bạn nhặt được một thẻ meme: **' + m.name + '**', img: 'meme_' + m.id, sfx: 'match' },
      { text: m.cap }
    ], function () {
      S.memes[m.id] = 1;
      var n = count(S);
      G.ui.toast('Bộ sưu tập meme: **' + n + '/' + G.MEMES.length + '**', 2600);
      G.world.enter(S.loc, S.x, S.y);
      if (n === G.MEMES.length && !S.flags.meme_chua) {
        S.flags.meme_chua = true;
        try { localStorage.setItem('lnsk_meme_chua', '1'); } catch (e) {}
        G.ui.dialog([
          { text: 'THÀNH TỰU: **MEME CHÚA**', img: 'meme_chua', sfx: 'gong' },
          { text: 'Bạn đã sưu tầm đủ ' + G.MEMES.length + ' thẻ meme của xóm. Cả xóm cúi đầu.' }
        ]);
      }
    });
  };

  // ---------- túi đồ: mục bộ sưu tập ----------
  var bag0 = G.ui.bag;
  G.ui.bag = function () {
    bag0.apply(this, arguments);
    var S = G.S, p = document.getElementById('bag'), close = p.querySelector('.close');
    var h = '<h3>Bộ sưu tập meme (' + count(S) + '/' + G.MEMES.length + ')' + (S.flags.meme_chua ? ' · <b class="hl">Meme Chúa</b>' : '') + '</h3><div class="meme-grid">';
    G.MEMES.forEach(function (m) {
      var got = (S.memes || {})[m.id];
      h += '<div class="meme-cell' + (got ? '' : ' locked') + '" title="' + (got ? m.name : '???') + '">' + (got ? card(m) : '<span>?</span>') + '<small>' + (got ? m.name : '???') + '</small></div>';
    });
    h += '</div>';
    var d = document.createElement('div'); d.innerHTML = h;
    while (d.firstChild) p.insertBefore(d.firstChild, close);
  };

  // ---------- huy hiệu ở màn tiêu đề ----------
  document.addEventListener('DOMContentLoaded', function () {
    var ok = false; try { ok = localStorage.getItem('lnsk_meme_chua') === '1'; } catch (e) {}
    if (ok) { var t = document.getElementById('title'), b = document.createElement('p'); b.className = 'meme-badge'; b.textContent = '👑 Meme Chúa'; t.insertBefore(b, t.querySelector('h1').nextSibling); }
  });
})();
