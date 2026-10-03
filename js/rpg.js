// Máu & tinh thần, cảnh truy đuổi, ba bước khám phá chiếc rìu, kho sưu tầm Thiên Khí Đại Việt.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var W = G.world;
  function S() { return G.S; }
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }

  // (Đã bỏ thanh máu / tinh thần theo ý người chơi: cảnh truy đuổi tính bằng số lần bị chạm.)
  var V = G.vitals = { draw: function () {}, change: function () {}, ensure: function () {} };
  V.eat = function (id) { var s = S(); if (!(s.stock[id] > 0)) return false; s.stock[id]--; if (G.world.refreshCart) G.world.refreshCart(); return true; };

  // ======================= CẢNH TRUY ĐUỔI =======================
  var C = G.chase = { active: false, auto: false };
  var ch = null, banner = document.createElement('div');
  banner.id = 'chasebar'; banner.hidden = true;
  $('stage').insertBefore(banner, $('dialog'));
  // cfg: { id, look, cls, x, y, speed, dmg, target: {x, y, r} | {loc}, label, onWin, onFail }
  C.start = function (cfg) {
    var s = S();
    if (!cfg.test) s.seen['chase_' + cfg.id] = 1;
    if (C.auto && !cfg.test) { cfg.onWin(); return; } // bot chơi thử
    var e = W.makeEnt(cfg.look, ['front', 'side', 'back'], 'npc chaser ' + (cfg.cls || ''));
    W.place(e, cfg.x, cfg.y, 'front', 1);
    var mark = null;
    if (cfg.target.x !== undefined) {
      mark = document.createElement('div'); mark.className = 'chase-target';
      mark.style.transform = 'translate3d(' + cfg.target.x + 'px,' + cfg.target.y + 'px,0)';
      mark.style.setProperty('--r', cfg.target.r + 'px');
      $('ents').appendChild(mark);
    }
    ch = { cfg: cfg, e: e, mark: mark, path: null, repath: 0, inv: 0.8, t: 0, loc: s.loc, lives: cfg.lives || 3 };
    C.active = true;
    drawBanner(); banner.hidden = false;
    document.body.classList.add('chasing');
    if (G.audio && G.audio.sfx) G.audio.sfx('caught');
  };
  function drawBanner() { if (ch) banner.innerHTML = '<b>CHẠY!</b> <span>' + ch.cfg.label + '</span><i class="lives">' + '♥'.repeat(ch.lives) + '<s>' + '♥'.repeat(Math.max(0, (ch.cfg.lives || 3) - ch.lives)) + '</s></i>'; }
  function end(win) {
    if (!ch) return;
    var c = ch; ch = null; C.active = false;
    if (c.e.el.parentNode) c.e.el.remove();
    if (c.mark) c.mark.remove();
    banner.hidden = true; document.body.classList.remove('chasing');
    if (win) c.cfg.onWin(); else c.cfg.onFail();
  }
  C.update = function (dt) {
    if (!ch) return;
    var s = S(), c = ch, cfg = c.cfg;
    if (s.loc !== c.loc) { end(true); return; }                                       // chạy thoát sang cảnh khác
    c.t += dt; c.inv -= dt;
    if (cfg.target.x !== undefined && Math.hypot(s.x - cfg.target.x, (s.y - cfg.target.y) * 1.2) < cfg.target.r) { end(true); return; }
    if (c.t > 45) { end(true); return; }                                              // nó bỏ cuộc
    // đuổi theo: tìm đường mỗi 0,35 giây
    c.repath -= dt;
    if (c.repath <= 0) { c.repath = 0.35; c.path = G.path.find(c.e.x, c.e.y, s.x, s.y); if (c.path) c.path.shift(); }
    var tx = s.x, ty = s.y;
    if (c.path && c.path.length) { tx = c.path[0].x; ty = c.path[0].y; if (Math.hypot(tx - c.e.x, ty - c.e.y) < 6) c.path.shift(); }
    var dx = tx - c.e.x, dy = ty - c.e.y, d = Math.hypot(dx, dy), st = (cfg.speed || 185) * dt;
    if (d > 1) { c.e.x += dx / d * Math.min(st, d); c.e.y += dy / d * Math.min(st, d); }
    var view = Math.abs(dx) > Math.abs(dy) ? 'side' : (dy > 0 ? 'front' : 'back');
    W.place(c.e, c.e.x, c.e.y, view, dx < 0 ? -1 : 1);
    c.e.el.classList.add('walk');
    // bị chạm: mất máu, bị hất ra
    var pd = Math.hypot(s.x - c.e.x, (s.y - c.e.y) * 1.3);
    if (pd < 30 && c.inv <= 0) {
      c.inv = 1.2;
      c.lives--; drawBanner();
      var kx = (s.x - c.e.x) / (pd || 1), ky = (s.y - c.e.y) / (pd || 1);
      for (var k = 50; k > 0; k -= 10) { if (!W.blocked(s.x + kx * k, s.y + ky * k)) { s.x += kx * k; s.y += ky * k; break; } }
      W.route = null; W.pending = null;
      document.body.classList.add('hitflash'); setTimeout(function () { document.body.classList.remove('hitflash'); }, 260);
      if (G.audio && G.audio.sfx) G.audio.sfx('chop');
      if (c.lives <= 0) { end(false); return; }
    }
  };
  var tickC = G.tick;
  G.tick = function (dt) { if (tickC) tickC(dt); C.update(dt); chaseTriggers(); axeTick(); };

  var MASK = { hair: 'messy', hairColor: '#0B0F14', shirt: '#141A22', pants: '#0B0F14', shoes: '#0B0F14', mask: true, eyes: 'flat' };
  var WET = { hair: 'long', hairColor: '#0A1418', shirt: '#13242C', pants: '#0E1A20', shoes: '#0A1418', eyes: 'big' };
  function faint(text) { // gục ngã: về nhà, mất chút tiền, sang ngày mới
    var s = S();
    G.ui.dialog([{ text: text }, { text: 'Không biết bao lâu sau, tôi tỉnh dậy trên giường. Túi áo nhẹ đi mất ít tiền.' }], function () {
      s.money = Math.max(0, s.money - 20); W.endDay('Một đêm dài.');
    });
  }
  function chaseTriggers() {
    var s = S();
    if (!s || C.active || G.ui.modal || W.mode !== 'walk' || s.era || (G.danger && G.danger.active)) return;
    // 1. Đường xóm buổi tối: bóng người đeo mặt nạ trước nhà CHO THUÊ
    if (s.loc === 'duong' && s.day >= 3 && s.min >= 19 * 60 && s.min < G.DAY_END - 20 && !s.seen.chase_mat_na) {
      G.ui.dialog([{ text: 'Đèn đường chập chờn. Trước cửa nhà **CHO THUÊ** có một bóng người [[đeo mặt nạ]], đứng im.' }, { who: 'Tôi', text: '…Nó đang đi về phía mình.' }], function () {
        C.start({ id: 'mat_na', look: MASK, cls: 'shade', x: 460, y: 560, speed: 190, dmg: 22, target: { loc: 'nha' }, label: '◀ Chạy về Nhà cũ!',
          onWin: function () { G.ui.dialog([{ text: 'Tôi đóng sập cửa, thở dốc. Ngoài kia chỉ còn tiếng lá khô.' }, { text: 'Trên bậc cửa có [[một dấu chân trần, ướt sũng]], như của người vừa lội sông lên.' }]); },
          onFail: function () { faint('Nó chụp lấy vai tôi. Cái mặt nạ ghé sát… rồi tất cả tối sầm.'); } });
      });
      return;
    }
    // 2. Bến sông đêm muộn: cái bóng ướt sũng bò lên từ nước — chạy vào chỗ có đèn
    if (s.loc === 'ben_song' && s.day >= 5 && s.min >= 19 * 60 + 30 && s.y > 640 && !s.seen.chase_bong_nuoc) {
      G.ui.dialog([{ text: 'Mặt sông sủi bọt. Một cái bóng đen [[ướt sũng]] bám mép bến, bò lên.' }, { who: 'Tôi', text: 'Chỗ có đèn! Chạy vào chỗ sáng!' }], function () {
        C.start({ id: 'bong_nuoc', look: WET, cls: 'wet', x: Math.min(900, s.x + 140), y: 742, speed: 175, dmg: 20, target: { x: 358, y: 500, r: 70 }, label: 'Chạy vào vùng đèn sáng!',
          onWin: function () { G.ui.dialog([{ text: 'Cái bóng khựng lại ngay mép vùng sáng. Nó đứng đó rất lâu, nước nhỏ tong tong.' }, { text: 'Rồi nó lùi xuống, tan vào mặt sông.' }]); },
          onFail: function () { faint('Bàn tay lạnh ngắt túm cổ chân tôi, kéo về phía mép nước…'); } });
      });
    }
  }
  // 3. Năm 1996: người gác đuổi từ đình ra bến (trước đoạn trượt chân rơi xuống sông)
  var dialogC = G.ui.dialog;
  G.ui.dialog = function (lines, onEnd) {
    var self = this, args = arguments, s = S();
    if (G.TEXT.escape && lines === G.TEXT.escape && s && !s.seen.chase_gac96) {
      var go = function () { dialogC.apply(self, args); };
      C.start({ id: 'gac96', look: { hair: 'short', shirt: '#4B5560', pants: '#2A3550', eyes: 'narrow', sash: true }, x: Math.min(900, s.x + 30), y: Math.min(560, s.y + 150), speed: 180, dmg: 20,
        target: { x: 480, y: 590, r: 55 }, label: 'Chạy ra bến đò!', lives: 5, onWin: go, onFail: go });
      return;
    }
    return dialogC.apply(this, arguments);
  };

  // ---------- chơi thử từ menu: dựng đúng nơi/giờ, chạy xong trả lại nguyên trạng thái ----------
  C.TESTS = { mat_na: 'Bóng đeo mặt nạ (Đường xóm)', bong_nuoc: 'Bóng ướt sũng (Bến sông)', gac96: 'Người gác năm 1996 (Đình làng)' };
  C.test = function (id, then) {
    var snap = JSON.stringify(S()), s = S();
    function back(msg) { G.S = JSON.parse(snap); G.world.mode = 'walk'; W.enter(G.S.loc, G.S.x, G.S.y); V.draw(); G.ui.toast(msg); if (then) setTimeout(then, 300); }
    var win = function () { back('Thoát được! (chơi thử)'); }, fail = function () { back('Bị bắt… (chơi thử)'); };
    if (id === 'mat_na') { s.era = null; s.min = 19 * 60 + 10; W.enter('duong', 700, 600);
      C.start({ test: true, id: id, look: MASK, cls: 'shade', x: 460, y: 560, speed: 190, dmg: 22, target: { loc: 'nha' }, label: '◀ Chạy về Nhà cũ!', onWin: win, onFail: fail }); }
    else if (id === 'bong_nuoc') { s.era = null; s.min = 19 * 60 + 40; W.enter('ben_song', 520, 700);
      C.start({ test: true, id: id, look: WET, cls: 'wet', x: 660, y: 742, speed: 175, dmg: 20, target: { x: 358, y: 500, r: 70 }, label: 'Chạy vào vùng đèn sáng!', onWin: win, onFail: fail }); }
    else if (id === 'gac96') { s.era = '1996'; s.pnight = 2; W.enter('dinh_96', 820, 330);
      C.start({ test: true, id: id, look: { hair: 'short', shirt: '#4B5560', pants: '#2A3550', eyes: 'narrow', sash: true }, x: 880, y: 420, speed: 180, lives: 5, target: { x: 480, y: 590, r: 55 }, label: 'Chạy ra bến đò!', onWin: win, onFail: fail }); }
    V.draw();
  };

  // ======================= CHIẾC RÌU: BA BƯỚC KHÁM PHÁ =======================
  // 1. Tìm thấy (rìu cũ, phá chốt gỗ) → 2. Thức tỉnh (chém đứt dây bùa mà dao không cắt nổi) → 3. Lộ bí mật (vết khắc trùng trang thần phả, nhưng nguồn gốc trái lời dân làng)
  function axeTick() {
    var s = S(); if (!s) return;
    if (!s.axe && (s.items.riu_96 || s.clues.e_riu)) { s.axe = 1; G.ui.toast('Kho **Thiên Khí Đại Việt**: thêm một mục mới (xem trong Túi đồ).', 4500); }
  }
  G.TEXT.axe_awaken = [
    { text: 'Tôi rút con dao gọt hoa quả cứa thử. Dây không xước một vết. Sợi dây bện [[chỉ đỏ]], quấn từng lớp [[bùa giấy vàng]].' },
    { text: 'Tôi vung rìu. Lưỡi rìu chạm vào, dây đứt như một sợi tóc.' },
    { text: 'Trong chớp mắt, hoa văn trên lưỡi rìu [[sáng lên màu xanh nước biển]]. Tay tôi lạnh buốt tới tận vai, tai ù đi như có sóng vỗ.' },
    { who: 'Tôi', text: '…Đây không phải cái rìu bổ củi.' }
  ];
  if (G.acts && G.acts.fire) {
    var fire0 = G.acts.fire;
    G.acts.fire = function () {
      var s = S(), args = arguments, self = this;
      if ((s.axe || 0) < 2) {
        G.ui.dialog(G.TEXT.axe_awaken, function () {
          s.axe = 2;
          G.ui.toast('Rìu đã **thức tỉnh**. Hoa văn trên lưỡi… hình như từng thấy ở **đình cũ**.', 5200);
          fire0.apply(self, args);
        });
        return;
      }
      return fire0.apply(this, args);
    };
  }
  // trang thần phả mục trong hòm gỗ ở đình cũ
  G.LOCATIONS.dinh_nay.things.push({ id: 'than_pha', x: 590, y: 240, hit: [596, 178, 58, 42], label: 'Xem hòm gỗ mục', act: 'look', text: 'than_pha', clue: 'e_than_pha',
    cond: function (s) { return (s.axe || 0) >= 2 && !s.era; }, quest: function (s) { return !s.clues.e_than_pha; } });
  var dn0 = G.scenes.dinh_nay;
  G.scenes.dinh_nay = function (Wd, Hh) {
    var sc = dn0(Wd, Hh), s = S();
    if (s && (s.axe || 0) >= 2) sc.props.push({ x: 590, y: 170, w: 70, h: 56, z: 222, svg: '<svg class="prop" viewBox="590 170 70 56" width="70" height="56" overflow="visible"><g stroke="#0F141B" stroke-width="2.5" stroke-linejoin="round">' +
      '<rect x="598" y="186" width="54" height="32" fill="#4A3532"/><rect x="596" y="180" width="58" height="10" fill="#5A3F38"/><path d="M600,190 h50 M600,204 h50" stroke="#2E2420" stroke-width="1.2"/>' +
      '<rect x="618" y="174" width="22" height="10" fill="#C8B88A" stroke-width="1.5" transform="rotate(-8 629 179)"/><circle cx="625" cy="198" r="2.5" fill="#9C7A3C" stroke="none"/></g></svg>' });
    return sc;
  };
  G.TEXT.than_pha = [
    { text: 'Trong hòm là một cuốn [[thần phả]] mục nát, chữ Hán Nôm nhoè nước. Một trang còn nguyên hình vẽ.', img: 'than_pha' },
    { text: 'Hình vẽ một chiếc rìu. Hoa văn trên lưỡi — mái đình, sóng nước, cánh chim — [[trùng khít với chiếc rìu ông Rạng đưa tôi]].' },
    { text: 'Dòng chữ bên dưới có ai đó dịch bút chì: [["Có người lạ từ biển lên, gửi đình giữ hộ. Dặn: trao cho kẻ trở về từ ba mươi năm sau."]]' },
    { who: 'Tôi', text: 'Bác Ba bảo cái rìu [[đào được cạnh giếng]]. Thần phả lại nói [[có người gửi]].' }
  ];
  Object.assign(G.CLUES, {
    e_than_pha: { kind: 'ev', title: 'Trang thần phả về chiếc rìu', loc: 'Đình cũ', source: 'Hòm gỗ mục trong nền đình', topics: ['riu'], people: ['Người lạ từ biển'], about: 'nguồn gốc chiếc rìu', img: 'than_pha',
      text: 'Hình vẽ chiếc rìu, hoa văn trùng khít. Lời dịch bút chì: [["Có người lạ từ biển lên, gửi đình giữ hộ. Dặn: trao cho kẻ trở về từ ba mươi năm sau."]]' }
  });
  G.DEDUCTIONS.push({ id: 'q_riu_goc', t: 't_ba_riu', e: 'e_than_pha', type: 'contra', title: 'Chiếc rìu không phải "đào được"',
    fact: 'Bác Ba nói đào được rìu cạnh giếng năm 1995; thần phả ghi rìu do người lạ từ biển gửi đình, dặn trao cho kẻ trở về từ ba mươi năm sau.' });
  var addClue0 = G.addClue;
  G.addClue = function (id) { var r = addClue0.apply(this, arguments); var s = S(); if (id === 'e_than_pha' && s && (s.axe || 0) < 3) { s.axe = 3; G.ui.toast('Kho **Thiên Khí Đại Việt**: chiếc rìu có trang mới.', 4200); } return r; };
  // tranh cận cảnh trang thần phả
  if (G.CLOSEUPS) G.CLOSEUPS.than_pha = function () {
    var INK = '#0F141B';
    var p = '<rect width="520" height="300" fill="#1E1A16"/><rect x="70" y="16" width="380" height="270" fill="#C8B88A" stroke="' + INK + '" stroke-width="3"/><path d="M260,16 V286" stroke="#8A7A50" stroke-width="3"/>';
    for (var c = 0; c < 9; c++) for (var r = 0; r < 12; r++) if ((c * 7 + r * 3) % 5) p += '<path d="M' + (90 + c * 18) + ',' + (34 + r * 20) + ' h8 M' + (94 + c * 18) + ',' + (30 + r * 20) + ' v9" stroke="#5A4A30" stroke-width="1.6"/>';  // chữ Hán Nôm mờ
    p += '<g transform="translate(355,150) rotate(-35)"><rect x="-6" y="-10" width="12" height="130" rx="4" fill="#6A5846" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M-6,-10 q-60,-6 -70,-50 q40,10 76,6 z" fill="#8C949B" stroke="' + INK + '" stroke-width="3"/>' +
      '<path d="M-58,-46 l10,-8 l10,8 l10,-8 l10,8" fill="none" stroke="#3A4552" stroke-width="2"/><path d="M-60,-34 q8,-6 16,0 t16,0 t16,0" fill="none" stroke="#3A4552" stroke-width="2"/>' +
      '<path d="M-40,-24 l8,-4 l8,4 l-8,-1 z" fill="#3A4552" stroke="none"/></g>';
    p += '<text x="355" y="270" text-anchor="middle" font-size="12" font-style="italic" fill="#4A3A20" font-family="Segoe UI, Arial">"…trao cho kẻ trở về từ ba mươi năm sau."</text>';
    p += '<ellipse cx="140" cy="250" rx="40" ry="18" fill="#7A6A40" opacity=".3"/><path d="M450,16 l-30,0 l30,30 z" fill="#1E1A16"/>';
    return '<svg viewBox="0 0 520 300" width="520" height="300">' + p + '</svg>';
  };

  // ======================= KHO SƯU TẦM THIÊN KHÍ ĐẠI VIỆT =======================
  var TRACES = [
    'Tiếng đàn văng vẳng rất khẽ dưới đáy giếng, chỉ nghe được lúc nửa đêm.',
    'Một mảnh vỏ cứng như móng rùa, khắc chữ cổ, kẹt trong khe gạch nền đình.',
    'Cái niêu đất nhỏ trong bếp nhà số 9. Cơm trong niêu chẳng bao giờ nguội.',
    'Dấu chân rất lớn in trên phiến đá cạnh bến, sâu như có người cưỡi ngựa sắt đi qua.'
  ];
  function axeCard(s) {
    var st = s.axe || 0;
    if (!st) return '<div class="tk-card locked"><div class="tk-art">?</div><div><b>???</b><small>Chưa tìm thấy.</small></div></div>';
    var name = st === 1 ? 'Rìu cổ cán lim' : st === 2 ? 'Rìu cổ (đã thức tỉnh)' : 'Rìu · thiên khí thứ nhất';
    var origin = st < 3 ? 'Chưa rõ.' + (s.clues.t_ba_riu ? ' Bác Ba nói đào được cạnh giếng dưới gian thờ năm 1995.' : '')
      : 'Thần phả ghi: người lạ từ biển lên gửi đình giữ hộ, dặn trao cho kẻ trở về từ ba mươi năm sau. Bác Ba lại nói đào được cạnh giếng. <b class="clue">Một trong hai đang sai.</b>';
    var power = st >= 2 ? 'Chém đứt thứ dao thường không cắt nổi: dây bện chỉ đỏ, bùa giấy.' : '???';
    var cost = st >= 2 ? 'Mỗi lần đánh thức: tay lạnh buốt tới tận vai, tai ù tiếng sóng biển rất lâu mới dứt.' : '???';
    var desc = st === 1 ? 'Cán lim đen bóng, lưỡi khắc mái đình, mẻ một miếng răng cưa. Có lẽ chỉ để phá chốt gỗ.'
      : st === 2 ? 'Lưỡi rìu từng sáng lên màu xanh nước biển. Hoa văn: mái đình, sóng nước, cánh chim.'
      : 'Ở chuôi có vết khắc rất nhỏ, phải nghiêng ra ánh sáng mới thấy: <i>một gốc đa cổ, và con chim rất lớn sải cánh</i>.';
    return '<div class="tk-card"><div class="tk-art">' + axeIcon(st) + '</div><div><b>' + name + '</b><small>' + desc + '</small>' +
      '<dl><dt>Nguồn gốc</dt><dd>' + origin + '</dd><dt>Năng lực</dt><dd>' + power + '</dd><dt>Cái giá</dt><dd>' + cost + '</dd></dl></div></div>';
  }
  function axeIcon(st) {
    return '<svg viewBox="0 0 60 60" width="56" height="56"><g stroke="#0F141B" stroke-width="2.5" stroke-linejoin="round"><path d="M14,52 L42,14" stroke-width="6"/><path d="M14,52 L42,14" stroke="#6A5846" stroke-width="3.5"/>' +
      '<path d="M38,8 q18,-4 18,14 l-12,6 q-2,-12 -6,-20 z" fill="' + (st >= 2 ? '#6FA8B8' : '#8C949B') + '"/>' + (st >= 2 ? '<circle cx="48" cy="16" r="12" fill="#6FA8B8" opacity=".25" stroke="none"/>' : '') + '</g></svg>';
  }
  G.ui.thienKhi = function () {
    var s = S(), p = $('help');
    var h = '<h2>Thiên Khí Đại Việt</h2><p class="sub">Những vật lẽ ra chỉ có trong chuyện cổ tích. Mỗi trang chỉ ghi điều đã có bằng chứng.</p><div class="tk-list">' + axeCard(s);
    TRACES.forEach(function (t) { h += '<div class="tk-card locked"><div class="tk-art">?</div><div><b>??? · dấu vết</b><small>' + t + '</small></div></div>'; });
    h += '</div><button class="close">Đóng</button>';
    p.innerHTML = h; p.hidden = false; G.ui.modal = 'help';
    p.onclick = function (e) { if (e.target.closest('button.close')) { p.hidden = true; G.ui.modal = null; } };
  };
  var bagT = G.ui.bag;
  G.ui.bag = function () {
    bagT.apply(this, arguments);
    var p = $('bag'), s = S(); if (!p || !s) return;
    var b = document.createElement('button');
    b.className = 'tk-open'; b.innerHTML = '✦ Kho Thiên Khí Đại Việt' + ((s.axe || 0) ? '' : ' <small>(trống)</small>');
    b.dataset.tk = '1';
    var h2 = p.querySelector('h2'); if (h2) h2.after(b);
  };
  $('bag').addEventListener('click', function (e) { if (e.target.closest('[data-tk]')) { e.stopPropagation(); G.ui.close('bag'); G.ui.thienKhi(); } }, true);

  // câu gợi ý cuối chương khi đã lộ bí mật chiếc rìu
  var endP = $('ending');
  new MutationObserver(function () {
    var s = S();
    if (endP.hidden || !s || (s.axe || 0) < 3 || endP.querySelector('.axe-hint')) return;
    var d = document.createElement('p'); d.className = 'axe-hint';
    d.textContent = '“Ngươi đã tìm được chiếc rìu. Nhưng ai nói nó bị thất lạc?”';
    var list = endP.querySelector('.help-list'); if (list) list.after(d); else endP.appendChild(d);
  }).observe(endP, { attributes: true, attributeFilter: ['hidden'], childList: true });

  var enterR = G.onEnter;
  G.onEnter = function (id) { if (enterR) enterR(id); V.ensure(); V.draw(); };
})();
