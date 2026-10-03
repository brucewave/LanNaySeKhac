// Album tem meme: sưu tầm tem (ảnh meme làm thành con tem có răng cưa, dấu bưu điện). Đủ cả album thì đạt "Meme Chúa".
// Tem #01 có được khi lần đầu nhập kẹo dừa ở chỗ cô Lan.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };

  // ---------- món mới: kẹo dừa ----------
  G.ITEMS.keo_dua = { id: 'keo_dua', name: 'Kẹo dừa', cost: 4, price: 8, perish: false, note: 'Đặc sản Bến Tre, để được lâu' };
  if (G.ITEM_ORDER.indexOf('keo_dua') < 0) G.ITEM_ORDER.push('keo_dua');
  var LIKE = { lao_dong: 1, hoc_sinh: 3, nguoi_gia: 2, van_phong: 1, cau_ca: 1 };
  Object.keys(G.CUSTOMER_TYPES).forEach(function (k) { G.CUSTOMER_TYPES[k].likes.keo_dua = LIKE[k] || 1; });
  var icon0 = G.art.icon;
  G.art.icon = function (id, size) {
    if (id !== 'keo_dua') return icon0.apply(this, arguments);
    size = size || 32;
    return '<svg viewBox="0 0 40 40" width="' + size + '" height="' + size + '"><g stroke="#0F141B" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M4,16 l6,4 l-6,4 z M36,16 l-6,4 l6,4 z" fill="#E2E8EA"/>' +            // hai đầu giấy gói xoắn
      '<rect x="9" y="13" width="22" height="14" rx="4" fill="#E2E8EA"/><rect x="12" y="16" width="16" height="8" rx="2" fill="#8A5A2A" stroke-width="1.6"/>' +
      '<path d="M14,18 h12 M14,21 h9" stroke="#C89A5A" stroke-width="1.3"/><path d="M10,27 q10,5 20,0" fill="none" stroke="#58855E" stroke-width="2.4"/></g></svg>';
  };
  function ensureStock(S) { if (S && S.stock && S.stock.keo_dua === undefined) S.stock.keo_dua = 0; if (S && !S.stamps) S.stamps = {}; }
  var sync0 = G.syncClues; // bản lưu cũ chưa có kẹo dừa / album
  G.syncClues = function (S) { ensureStock(S); return sync0.apply(this, arguments); };
  var ns0 = G.newState;
  G.newState = function () { var S = ns0.apply(this, arguments); ensureStock(S); return S; };

  // ---------- danh sách tem ----------
  G.STAMPS = [
    { id: 'keo_dua', name: 'Tin vừa rồi có chính xác không chị', img: 'assets/stamps/keo-dua.jpg', how: 'Lần đầu nhập kẹo dừa ở chỗ cô Lan.', val: '8k' },
    { id: 'co_lam', name: 'Có làm thì mới có ăn', img: 'assets/stamps/co-lam.jpg', how: 'Bán hàng được tổng cộng 500k.', val: '500k' },
    { id: 'dan_choi', name: 'Dân Chơi', img: 'assets/stamps/dan-choi.jpg', how: 'Có xe máy sau việc phụ của Tùng shipper.', val: 'Cub' },
    { id: 'con_cai_nit', name: 'Còn cái nịt!', img: 'assets/stamps/con-cai-nit.jpg', how: 'Lần đầu bị khách ngồi ăn quịt tiền.', val: '0k', pos: '50% 88%' },
    { id: 'gud_dual', name: 'Gud dual shhh', img: 'assets/stamps/gud-dual.jpg', how: 'Mua bán với bác Ba thợ mộc 3 lần.', val: '3x', pos: '50% 30%' },
    { id: 'hoang_hon', name: '😧', img: 'assets/stamps/hoang-hon.jpg', how: 'Lần đầu bị hù.', val: 'Hú!', pos: '50% 45%' },
    { id: 'thumb', name: '👍', img: 'assets/stamps/thumb.jpg', how: 'Phá án, đi tới kết có hậu.', val: 'WIN', pos: '50% 40%' }
  ];
  var TOTAL = G.STAMPS.length; // phần 1: đủ 7 tem là Meme Chúa (phần 2 bổ sung sau)
  function have(S) { return Object.keys(S.stamps || {}).length; }

  function stampHtml(st, no, big) {
    return '<div class="stamp' + (big ? ' big' : '') + '"><div class="stamp-in"><img src="' + st.img + '" alt=""' + (st.fallback ? ' data-fb="' + st.fallback + '"' : '') + (st.pos ? ' style="object-position:' + st.pos + '"' : '') + '><span class="st-no">#' + String(no).padStart(2, '0') + '</span>' +
      '<span class="st-val">' + st.val + '</span><span class="st-mark">BẾN ĐÌNH<br>2026</span></div><div class="st-cap">' + st.name + '</div></div>';
  }
  function reveal(st, no, onDone) {
    var b = $('stamp-pop') || (function () { var d = document.createElement('div'); d.id = 'stamp-pop'; $('stage').appendChild(d); return d; })();
    b.innerHTML = '<div class="sp-title">Sưu tầm được tem mới!</div>' + stampHtml(st, no, true) + '<div class="sp-sub">' + have(G.S) + ' / ' + TOTAL + ' tem · bấm để cất vào album</div>';
    b.hidden = false; G.ui.modal = 'stamp';
    if (G.audio && G.audio.sfx) { G.audio.sfx('knock'); setTimeout(function () { G.audio.sfx('clue'); }, 300); }
    b.onclick = function () { b.hidden = true; if (G.ui.modal === 'stamp') G.ui.modal = null; checkChua(onDone); };
  }
  var close0 = G.ui.close;
  G.ui.close = function (id) { if (id === 'stamp') { var b = $('stamp-pop'); if (b && !b.hidden) b.click(); return; } return close0.apply(this, arguments); };
  G.giveStamp = function (id) {
    var S = G.S; ensureStock(S);
    if (S.stamps[id]) return false;
    var i = G.STAMPS.findIndex(function (x) { return x.id === id; }); if (i < 0) return false;
    S.stamps[id] = S.day;
    reveal(G.STAMPS[i], i + 1, arguments[1]);
    return true;
  };
  // trao tem rồi mới chạy tiếp (dùng ở đoạn kết); đã có tem thì chạy tiếp luôn
  G.giveStampThen = function (id, then) { if (!G.giveStamp(id, then) && then) then(); };
  function checkChua(onDone) {
    var S = G.S;
    if (have(S) >= TOTAL && !S.flags.meme_chua) {
      S.flags.meme_chua = true;
      try { localStorage.setItem('lnsk_meme_chua', '1'); } catch (e) {}
      G.ui.dialog([{ text: 'THÀNH TỰU: **MEME CHÚA**', sfx: 'gong' }, { text: 'Đủ cả album tem meme. Cả xóm phải gọi anh là thầy.' }], onDone);
    } else if (onDone) onDone();
  }

  // tem #01: lần đầu có kẹo dừa trên xe (sau khi nhập hàng ở chỗ cô Lan)
  new MutationObserver(function () {
    var S = G.S;
    if (!S || !$('shop').hidden) return;
    ensureStock(S);
    if (S.stock.keo_dua > 0 && !S.stamps.keo_dua) setTimeout(function () { if (!G.ui.modal) G.giveStamp('keo_dua'); else G.S._pendingStamp = 'keo_dua'; }, 200);
  }).observe($('shop'), { attributes: true, attributeFilter: ['hidden'] });
  var tick0 = G.tick;
  G.tick = function (dt) {
    if (tick0) tick0(dt);
    var S = G.S; if (!S || G.ui.modal) return;
    if (S._pendingStamp) { var id = S._pendingStamp; delete S._pendingStamp; G.giveStamp(id); return; }
    if ((S.stats.earned || 0) >= 500 && S.stamps && !S.stamps.co_lam) { G.giveStamp('co_lam'); return; } // tem #02: bán được tổng 500k
    if (S.flags.xe && S.stamps && !S.stamps.dan_choi) { G.giveStamp('dan_choi'); return; } // tem #03: có xe máy của Tùng
    if (S.flags.bi_quit && S.stamps && !S.stamps.con_cai_nit && G.world.mode === 'walk') { G.giveStamp('con_cai_nit'); return; } // tem #04: lần đầu bị quịt
    if ((S.flags.ba_deals || 0) >= 3 && S.stamps && !S.stamps.gud_dual) { G.giveStamp('gud_dual'); return; } // tem #05: mua bán với bác Ba 3 lần
    if (S.stamps && !S.stamps.hoang_hon && Object.keys(S.seen).some(function (k) { return k.indexOf('scare_') === 0; })) G.giveStamp('hoang_hon'); // tem #06: lần đầu bị hù
  };

  // ---------- album ----------
  G.ui.album = function () {
    var S = G.S, p = $('help'); ensureStock(S);
    var h = '<h2>Album tem meme</h2><p class="sub">' + have(S) + ' / ' + TOTAL + ' tem. Sưu tầm đủ cả album để đạt <b class="hl">Meme Chúa</b>.' + (S.flags.meme_chua ? ' <b class="clue">Đã đạt!</b>' : '') + '</p><div class="album">';
    for (var i = 0; i < TOTAL; i++) {
      var st = G.STAMPS[i];
      if (st && S.stamps[st.id]) h += stampHtml(st, i + 1);
      else h += '<div class="stamp empty"><div class="stamp-in"><span class="st-no">#' + String(i + 1).padStart(2, '0') + '</span><span class="q">?</span></div><div class="st-cap">' + (st ? '???' : 'Chưa phát hành') + '</div></div>';
    }
    h += '</div><button class="close">Đóng</button>';
    p.innerHTML = h; p.hidden = false; G.ui.modal = 'help';
    p.onclick = function (e) { if (e.target.closest('button.close')) { p.hidden = true; G.ui.modal = null; } };
  };
  var bagS = G.ui.bag;
  G.ui.bag = function () {
    bagS.apply(this, arguments);
    var p = $('bag'), S = G.S; if (!p || !S) return; ensureStock(S);
    var b = document.createElement('button');
    b.className = 'tk-open'; b.dataset.album = '1';
    b.innerHTML = '✉ Album tem meme <small>(' + have(S) + '/' + TOTAL + ')</small>';
    var anchor = p.querySelector('.tk-open') || p.querySelector('h2'); if (anchor) anchor.after(b);
  };
  $('bag').addEventListener('click', function (e) { if (e.target.closest('[data-album]')) { e.stopPropagation(); G.ui.close('bag'); G.ui.album(); } }, true);

  // huy hiệu Meme Chúa ở màn hình tiêu đề
  window.addEventListener('load', function () {
    var ok = false; try { ok = localStorage.getItem('lnsk_meme_chua') === '1'; } catch (e) {}
    if (ok && $('title')) { var d = document.createElement('div'); d.className = 'meme-badge'; d.textContent = '★ MEME CHÚA'; $('title').appendChild(d); }
  });
  // đếm số lần mua bán với bác Ba (bán hai ly trà ở xưởng, hoặc bác ra mua ở sạp)
  (function () {
    var list = G.DIALOGUE.bac_ba || [], e = list.filter(function (x) { return x.id === 'ba_buy'; })[0];
    var ch = e && e.lines && e.lines[0] && e.lines[0].choices && e.lines[0].choices[0];
    if (ch) { var run0 = ch.run; ch.run = function (S) { var before = S.stock.tra_da; run0.apply(this, arguments); if (S.stock.tra_da < before) S.flags.ba_deals = (S.flags.ba_deals || 0) + 1; }; }
  })();
  // ảnh tem chưa có file thì dùng ảnh tạm
  document.addEventListener('error', function (e) { var t = e.target; if (t && t.tagName === 'IMG' && t.dataset && t.dataset.fb) { var fb = t.dataset.fb; delete t.dataset.fb; t.src = fb; } }, true);
  var enterS = G.onEnter;
  G.onEnter = function (id) { ensureStock(G.S); if (enterS) enterS(id); };
})();
