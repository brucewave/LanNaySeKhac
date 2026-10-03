// Bản cập nhật lối chơi: hết chương chơi tiếp luôn, xe đẩy phải lấy ở nhà, dấu ! tự ẩn, chế độ Dễ / Thám tử,
// thoại hiện trên đầu nhân vật, người trong xóm nói vu vơ, dáng nhân vật khi xem đồ.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var W = G.world;
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }

  // ======================= HẾT CHƯƠNG: CHƠI TIẾP LUÔN =======================
  // Bảng hết chương hiện như tấm thẻ tóm tắt rồi tự đóng; bảng kết truyện cuối cùng giữ nguyên.
  var endP = $('ending');
  new MutationObserver(function () {
    if (endP.hidden || endP.dataset.auto) return;
    var go = endP.querySelector('[data-e="go"]');
    if (!go || /Tiếp tục sống/.test(go.textContent)) return;
    endP.dataset.auto = '1';
    endP.classList.add('chapter-card');
    var list = go.closest('.list'); if (list) list.style.display = 'none';
    var tip = document.createElement('p'); tip.className = 'sub auto-tip'; tip.textContent = 'Câu chuyện tiếp tục…';
    endP.appendChild(tip);
    var done = false;
    function next() { if (done) return; done = true; delete endP.dataset.auto; endP.classList.remove('chapter-card'); if (!endP.hidden) go.click(); }
    endP.addEventListener('click', next, { once: true });
    setTimeout(next, 4200);
  }).observe(endP, { attributes: true, attributeFilter: ['hidden'] });

  // ======================= XE ĐẨY: LẤY Ở NHÀ MỚI BÁN ĐƯỢC =======================
  G.LOCATIONS.nha.things.push({ id: 'xe_day', x: 700, y: 566, hit: [640, 452, 120, 82], act: 'cart_take',
    label: function (S) { return S.cartOut ? 'Cất xe đẩy vào nhà' : 'Đẩy xe hàng đi'; },
    cond: function (S) { return !S.era && W.mode === 'walk'; } });
  G.acts = G.acts || {};
  G.acts.cart_take = function () {
    var S = G.S;
    if (!S.cartOut) {
      if (S.riding) { S.riding = false; if (G.syncBike) G.syncBike(); }
      S.cartOut = true;
      cartFollow(true);
      G.ui.toast('Đã đẩy xe hàng ra. Tới ô nét đứt ở chợ hoặc bến sông để bày sạp.');
    } else {
      S.cartOut = false;
      W.cart.x = W.PARK.x; W.cart.y = W.PARK.y; W.cart.flip = -1;
      G.ui.toast('Đã cất xe đẩy trước cửa nhà.');
    }
    if (G.audio && G.audio.sfx) G.audio.sfx('creak');
    W.syncPlayer(false);
  };
  var interact0 = W.interact;
  W.interact = function (t) {
    var S = G.S;
    if (t.act === 'sell' && !S.cartOut && W.mode === 'walk') {
      G.ui.dialog([{ who: 'Tôi', text: 'Xe hàng còn để ở nhà. Phải về **Nhà cũ** đẩy xe ra đã.' }]);
      return;
    }
    if (!t.npc && t.act !== 'sell' && t.act !== 'cart_take') inspectStart();
    if (t.npc || t.act === 'shop' || t.act === 'talk') muteLater(t.npc || t.id); else muteLater('thing:' + t.id);
    return interact0.apply(this, arguments);
  };
  var endDay0 = W.endDay;
  W.endDay = function () { if (G.S) G.S.cartOut = false; return endDay0.apply(this, arguments); }; // tối về: xe cất ở nhà

  // Đẩy xe: xe đi trước mặt theo hướng đang quay, tay cầm nằm trong tay người (tay ở ~14px trước ngực, cao 16px;
  // đầu tay cầm cách tâm xe 49px, cao 34px ở tỉ lệ 0,5) → tâm xe = người + hướng × 63, thấp hơn 18px
  function cartPos(S) { var f = S.flip || 1; return { x: S.x + f * 63, y: S.y + 18, flip: f }; }
  function cartFollow(snap) {
    var S = G.S, c = W.cart, p = W.player;
    var on = !!(S && S.cartOut && W.mode === 'walk' && c && !S.era);
    if (p) p.el.classList.toggle('pushing', on);
    if (!on) return;
    var t = cartPos(S);
    if (snap || Math.abs(c.x - t.x) > 160) { c.x = t.x; c.y = t.y; }
    else { c.x += (t.x - c.x) * 0.35; c.y += (t.y - c.y) * 0.35; } // đổi hướng: xe quay vòng sang phía kia, không nhảy cóc
    c.flip = t.flip;
    c.el.classList.toggle('roll', p.el.classList.contains('walk'));
  }
  G.cartFollow = cartFollow;
  // đang đẩy xe thì luôn đứng nghiêng, mặt hướng vào tay cầm
  var sync0 = W.syncPlayer;
  W.syncPlayer = function (walking) {
    var S = G.S;
    if (S && S.cartOut && W.mode === 'walk' && !S.era) S.view = 'side';
    return sync0.apply(this, arguments);
  };

  // ======================= DẤU ! TỰ ẨN + CHẾ ĐỘ CHƠI =======================
  // Sau khi đã tương tác với một người/đồ vật, dấu ! của nó ẩn đi cho tới khi cốt truyện tiến thêm (manh mối, đồ, đối chiếu mới...).
  function sig(S) {
    return [Object.keys(S.clues).length, Object.keys(S.deduce).length, Object.keys(S.items).length,
      JSON.stringify(S.quests), Object.keys(S.flags).filter(function (k) { return S.flags[k] === true; }).length, S.pnight || 0, S.era || ''].join('|');
  }
  var pendingMute = null;
  function muteLater(key) { pendingMute = key; }
  G.showQuest = function (key) {
    var S = G.S;
    if (!S) return true;
    if (S.mode === 'detective') return false;
    return !(S.qmute && S.qmute[key] === sig(S));
  };
  // chế độ thám tử: chữ thường hết, không tô vàng/đỏ
  var fmt0 = G.ui.fmt;
  G.ui.fmt = function (t) {
    if (G.S && G.S.mode === 'detective' && typeof t === 'string') t = t.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[\[(.+?)\]\]/g, '$1');
    return fmt0.call(this, t);
  };
  var newState0 = G.newState;
  G.newState = function () { var S = newState0.apply(this, arguments); S.mode = G.pendingMode || 'easy'; S.qmute = {}; S.cartOut = false; return S; };
  G.MODES = { easy: 'Dễ', detective: 'Thám tử' };
  function applyMode() { document.body.classList.toggle('mode-detective', !!(G.S && G.S.mode === 'detective')); if (G.ui.minimap) G.ui.minimap(); }

  // chọn chế độ khi bấm "Chơi mới"
  var btnNew = $('btn-new');
  function pickMode() {
    var t = $('title');
    if (t.querySelector('.mode-pick')) return;
    var box = document.createElement('div');
    box.className = 'mode-pick';
    box.innerHTML = '<button class="primary" data-m="easy"><b>Chế độ dễ</b><small>Chữ quan trọng tô màu, dấu ! chỉ người và chỗ cần tới</small></button>' +
      '<button data-m="detective"><b>Chế độ thám tử</b><small>Không gợi ý: không dấu !, không tô màu chữ. Tự nghe, tự nhớ</small></button>';
    box.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      G.pendingMode = b.dataset.m; box.remove();
      G.start(null); applyMode();
    };
    btnNew.after(box);
  }
  window.addEventListener('load', function () { btnNew.onclick = pickMode; }); // sau main.js
  // menu: đổi chế độ giữa chừng
  var menu0 = G.ui.menu;
  G.ui.menu = function () {
    menu0.apply(this, arguments);
    var list = document.querySelector('#menu .list'), S = G.S;
    if (!list || !S) return;
    var b = document.createElement('button');
    b.textContent = 'Chế độ: ' + G.MODES[S.mode || 'easy'];
    b.onclick = function (e) { e.stopPropagation(); S.mode = S.mode === 'detective' ? 'easy' : 'detective'; b.textContent = 'Chế độ: ' + G.MODES[S.mode]; applyMode(); };
    list.insertBefore(b, list.querySelector('[data-m="help"]'));
    var tb = document.createElement('button');
    tb.textContent = 'Thử minigame / cảnh phim';
    tb.onclick = function (e) { e.stopPropagation(); G.ui.close('menu'); testPanel(); };
    list.insertBefore(tb, list.querySelector('[data-m="help"]'));
  };
  // Bảng chơi thử: mở thẳng từng minigame và từng cảnh phim (không ảnh hưởng tiến độ truyện)
  var CUT_NAMES = { gong: 'Đánh chiêng', river_fall: 'Rơi xuống sông', nen_tho: 'Nền gian thờ', mirror_vy: 'Chạm tay Vy qua gương', mirror_go: 'Bước vào gương',
    chop: 'Chém then hầm', fire: 'Đèn lồng gây cháy', knock: 'Gõ xi măng', lever: 'Bẩy thanh sắt', tunnel: 'Lội cống', happy: 'Kết có hậu' };
  function testPanel() {
    var p = $('help');
    p.innerHTML = '<h2>Chơi thử</h2><p class="sub">Mở thẳng minigame, cảnh truy đuổi và cảnh phim để xem. Không ảnh hưởng tiến độ truyện.</p>' +
      '<h3>Minigame</h3><div class="test-grid">' + G.mini.LIST.map(function (m) { return '<button data-mg="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      '<h3>Truy đuổi</h3><div class="test-grid">' + Object.keys(G.chase ? G.chase.TESTS : {}).map(function (k) { return '<button data-ch="' + k + '">' + G.chase.TESTS[k] + '</button>'; }).join('') + '</div>' +
      '<h3>Cảnh phim</h3><div class="test-grid">' + Object.keys(CUT_NAMES).map(function (k) { return '<button data-cs="' + k + '">' + CUT_NAMES[k] + '</button>'; }).join('') + '</div>' +
      '<button class="close">Đóng</button>';
    p.hidden = false; G.ui.modal = 'help';
    p.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.classList.contains('close')) { p.hidden = true; G.ui.modal = null; return; }
      p.hidden = true; G.ui.modal = null;
      if (b.dataset.mg) G.mini.test(b.dataset.mg, testPanel);
      else if (b.dataset.cs) G.cutscene(b.dataset.cs, testPanel);
      else if (b.dataset.ch) G.chase.test(b.dataset.ch, testPanel);
    };
  }
  G.ui.testPanel = testPanel;

  // ======================= THOẠI TRÊN ĐẦU NHÂN VẬT =======================
  var NAME_OF = {};
  function entFor(who) {
    if (!who) return null;
    var S = G.S;
    if (who === 'Tôi') return W.player ? { e: W.player, x: S.x, y: S.y } : null;
    for (var id in W.ents) {
      var d = G.NPCS[id], o = W.ents[id];
      if (!d || o.leaving) continue;
      var nm = d.name, short = nm.split(' (')[0];
      if (nm === who || short === who || nm.indexOf(who) === 0 || who.indexOf(short.split(' ').slice(0, 2).join(' ')) === 0) return { e: o.e, x: o.e.x, y: o.e.y };
    }
    return null;
  }
  var dlg = $('dialog');
  function placeBubble() {
    var S = G.S;
    dlg.classList.remove('talk-bubble'); dlg.style.left = dlg.style.top = ''; dlg.style.transform = '';
    if (!S || G.ui.modal !== 'dialog' || dlg.hidden) return;
    if (!$('closeup').hidden) return; // đang xem tranh cận cảnh: giữ khung thoại dưới đáy
    var whoEl = dlg.querySelector('.who'), who = whoEl ? whoEl.textContent : null;
    if (!who || dlg.querySelector('.choices')) return;
    var f = entFor(who);
    if (!f) return;
    var z = W.zoom || 1, sx = (f.x - W.camX) * z, sy = (f.y - W.camY) * z - 100 * z;
    sx = Math.max(170, Math.min(G.VIEW_W - 170, sx)); sy = Math.max(120, sy);
    dlg.classList.add('talk-bubble');
    dlg.style.left = sx + 'px'; dlg.style.top = sy + 'px';
    dlg.style.transform = 'translate(-50%, -100%)';
  }
  new MutationObserver(function () { setTimeout(placeBubble, 0); }).observe(dlg, { childList: true });

  // ======================= NÓI VU VƠ =======================
  var GREET = {
    co_lan: ['Hôm nay trời oi, trà đá bán chạy đấy.', 'Mai ra sớm, cô để phần đá cho.'],
    bac_do: ['Nước lên rồi, đi đứng cẩn thận.', 'Sông hôm nay êm. Hiếm lắm.'],
    bac_ba: ['Gỗ mít này thơm ghê.', 'Cháu ăn sáng chưa?'],
    tung: ['Đơn nhiều quá anh ơi!', 'Bánh mì nhà anh ngon, khách khen đấy.'],
    be_na: ['Anh ơi bóng bay của em đẹp không?', 'Hì hì.'],
    ong_khai: ['Ừ, chào cậu.', 'Đình sắp có lễ, bận lắm.'],
    _: ['Chào cậu!', 'Hôm nay đông nhỉ.', 'Trời nóng ghê.', 'Ăn gì chưa đấy?', 'Đi đâu vội thế?']
  };
  var CHAT = [
    ['Rau hôm nay đắt quá.', 'Mưa mấy hôm, ngập hết bãi rồi.'],
    ['Nghe đồn đình sắp sửa lại.', 'Sửa hoài, tiền đâu ra.'],
    ['Thằng bé nhà ông Tư lại trốn học.', 'Kệ nó, tuổi ăn tuổi chơi.'],
    ['Tối qua mất điện à?', 'Ừ, chập chờn cả đêm.'],
    ['Trà đá cậu kia ngon đấy.', 'Mai ra làm ly.']
  ];
  var BUY = ['Cho một ly mát mát nhé!', 'Nóng muốn chảy mỡ luôn.', 'Nhanh nhanh giúp chị nha.', 'Hôm qua uống thấy ngon nên quay lại.', 'Lấy thêm đá giùm em.'];
  var THANKS = ['Ngon! Mai ghé tiếp.', 'Mát ruột ghê.', 'Cảm ơn nha!', 'Bánh mì giòn thật.'];
  G.BUY_LINES = BUY; G.THANK_LINES = THANKS;
  function say(ent, text, ms) {
    if (!ent || !ent.el) return;
    var old = ent.el.querySelector('.chat'); if (old) old.remove();
    var b = document.createElement('div'); b.className = 'chat'; b.textContent = text;
    ent.el.appendChild(b);
    setTimeout(function () { b.remove(); }, ms || 2600);
  }
  G.chatSay = say;
  var greetCd = {}, chatT = 8;
  function ambient(dt) {
    var S = G.S;
    if (!S || G.ui.modal || W.mode !== 'walk') return;
    var now = Date.now();
    // gặp mình ngoài đường thì chào một câu
    for (var id in W.ents) {
      var o = W.ents[id];
      if (o.leaving || o.busy || o.route.length || G.NPCS[id].vanish && S.era) continue;
      if (Math.hypot(o.e.x - S.x, o.e.y - S.y) < 95 && (!greetCd[id] || now - greetCd[id] > 45000)) {
        greetCd[id] = now;
        say(o.e, rnd(GREET[id] || GREET._));
        break;
      }
    }
    // hai người đứng gần nhau thì nói chuyện với nhau
    chatT -= dt;
    if (chatT > 0) return;
    chatT = 14 + Math.random() * 10;
    var ids = Object.keys(W.ents).filter(function (k) { var o = W.ents[k]; return !o.leaving && !o.busy && !o.route.length; });
    for (var i = 0; i < ids.length; i++) for (var j = i + 1; j < ids.length; j++) {
      var a = W.ents[ids[i]].e, b = W.ents[ids[j]].e;
      if (Math.hypot(a.x - b.x, a.y - b.y) < 220) {
        var c = rnd(CHAT);
        say(a, c[0], 2400);
        setTimeout(function () { say(b, c[1], 2400); }, 1800);
        return;
      }
    }
  }

  // ======================= DÁNG XEM ĐỒ =======================
  var inspecting = false;
  function inspectStart() {
    if (!W.player) return;
    inspecting = true;
    W.player.el.classList.add('inspect');
    var S = G.S;
    if (S.view === 'back') return;
  }
  function inspectTick() {
    if (inspecting && !G.ui.modal) { inspecting = false; if (W.player) W.player.el.classList.remove('inspect'); }
  }

  // ======================= MÓC VÀO VÒNG LẶP =======================
  var tick0 = G.tick;
  G.tick = function (dt) {
    if (tick0) tick0(dt);
    cartFollow();
    ambient(dt);
    inspectTick();
    if (pendingMute && !G.ui.modal && G.S) { G.S.qmute = G.S.qmute || {}; G.S.qmute[pendingMute] = sig(G.S); pendingMute = null; }
  };
  var enter0 = G.onEnter;
  G.onEnter = function (locId) {
    if (enter0) enter0(locId);
    var S = G.S;
    if (S && S.cartOut && W.cart) { cartFollow(true); W.syncPlayer(false); }
    applyMode();
  };
  // kệ gương trong nhà năm 1996
  var nha96 = G.scenes.nha_96;
  if (nha96 && G.mirrorStand) G.scenes.nha_96 = function (Wd, H) { var sc = nha96(Wd, H); G.mirrorStand(sc); return sc; };
})();
