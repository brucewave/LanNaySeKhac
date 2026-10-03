// Phiên bán hàng: khách đến, xếp hàng, gọi món; người chơi cho món vào khay rồi giao. Có thể đóng sạp bất cứ lúc nào.
var G = window.G || (window.G = {});
G.sell = { active: false };

(function () {
  var P = G.sell;
  var $ = function (id) { return document.getElementById(id); };
  var WALK = 150, BASE_PATIENCE = 26, MAX_QUEUE = 3;

  function pickWeighted(map) {
    var sum = 0, k;
    for (k in map) sum += map[k];
    var r = Math.random() * sum;
    for (k in map) { r -= map[k]; if (r <= 0) return k; }
    return k;
  }
  function timeMod(id, min) {
    var h = min / 60;
    if (id === 'banh_mi') return h < 10 ? 2.5 : (h >= 14 ? 0.4 : 1);
    return h >= 11 ? 1.5 : 1;
  }
  function slotX(i) { return P.spot.x + 150 + i * 62; }

  // Bàn nhựa thấp + ghế đẩu bên trái sạp; khách mua xong có thể ra ngồi ăn
  function svgEl(x, y, w, h, inner, z) {
    var d = document.createElement('div');
    d.className = 'prop sellset';
    d.style.cssText = 'left:' + (x - w / 2) + 'px;top:' + (y - h) + 'px;z-index:' + Math.round(z);
    d.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" overflow="visible"><g stroke="#0F141B" stroke-width="2.5" stroke-linejoin="round">' + inner + '</g></svg>';
    document.getElementById('ents').appendChild(d);
    P.seatEls.push(d);
  }
  function stool(x, y, c) { svgEl(x, y, 26, 24, '<path d="M5,8 L3,23 M21,8 L23,23 M13,10 V23" stroke-width="2.5"/><ellipse cx="13" cy="7" rx="11" ry="5" fill="' + c + '"/><ellipse cx="13" cy="6" rx="6" ry="2.5" fill="#000" opacity=".15" stroke="none"/>', y - 2); }
  function table(x, y, c) {
    svgEl(x, y, 56, 34, '<path d="M8,14 L6,33 M48,14 L50,33 M16,16 L15,31 M40,16 L41,31" stroke-width="2.5"/><rect x="2" y="4" width="52" height="12" rx="4" fill="' + c + '"/><rect x="6" y="6" width="44" height="4" rx="2" fill="#fff" opacity=".18" stroke="none"/>' +
      '<rect x="12" y="-2" width="8" height="8" rx="1" fill="#D5DCE0" stroke-width="1.5"/><rect x="32" y="-1" width="9" height="7" rx="1" fill="#948C5E" stroke-width="1.5"/>', y);
  }
  function buildSeats() {
    P.seatEls = []; P.seats = [];
    var sx = P.spot.x, sy = P.spot.y;
    [[sx - 160, sy + 24, '#3F6670', '#A32E36'], [sx - 250, sy - 6, '#A32E36', '#3F6670']].forEach(function (t) {
      table(t[0], t[1], t[2]);
      stool(t[0] - 34, t[1] + 6, t[3]); stool(t[0] + 34, t[1] + 6, t[3]);
      P.seats.push({ x: t[0] - 34, y: t[1] + 8, flip: 1, used: null }, { x: t[0] + 34, y: t[1] + 8, flip: -1, used: null });
    });
  }
  function zoomTo(z, tx, ty) {
    var W = G.world, z0 = W.zoom, t0 = performance.now();
    function step(now) {
      var k = Math.min(1, (now - t0) / 450), e = 1 - Math.pow(1 - k, 3);
      W.zoom = z0 + (z - z0) * e;
      W.updateCamera(true, tx, ty);
      if (k < 1 && P.active) requestAnimationFrame(step);
    }
    W.zoom = z; W.updateCamera(true, tx, ty); W.zoom = z0; // tính trước cho các phép đặt vị trí ngay sau đó
    requestAnimationFrame(step);
    W.zoom = z;
    W.updateCamera(true, tx, ty);
  }

  P.start = function (locId) {
    var S = G.S, L = G.LOCATIONS[locId];
    P.active = true; G.world.mode = 'sell';
    P.L = L; P.spot = L.sell.spot;
    P.customers = []; P.tray = [];
    P.spawnT = 1.2; P.stockWarned = false;
    P.r = { served: 0, items: 0, earned: 0, tips: 0, missed: 0, asked: [] };
    S.x = P.spot.x - 40; S.y = P.spot.y; S.view = 'side'; S.flip = 1;
    G.world.syncPlayer(false);
    buildSeats();
    zoomTo(1.6, P.spot.x + 30, P.spot.y - 24); // camera sát vào sạp: thấy rõ người bán, hàng khách, bàn ghế
    G.world.prompt.hidden = true;
    $('edge-l').hidden = $('edge-r').hidden = true;
    document.body.classList.add('selling');
    $('sellpanel').hidden = false;
    if (!S.flags['sell_tip_' + locId]) {
      S.flags['sell_tip_' + locId] = 1;
      G.ui.toast(L.name + ': ' + L.sell.blurb, 5000);
    }
    render();
  };

  P.stop = function (silent) {
    var S = G.S;
    P.customers.forEach(function (c) { if (c.npc) releaseNpc(c); if (c.owe) quit(c); });
    (P.seatEls || []).forEach(function (el) { el.remove(); }); P.seatEls = []; P.seats = [];
    G.world.zoom = 1.25;
    P.tray.forEach(function (id) { S.stock[id]++; });
    P.tray = [];
    P.customers.forEach(function (c) { c.e.el.remove(); });
    P.customers = [];
    P.active = false; G.world.mode = 'walk';
    document.body.classList.remove('selling');
    $('sellpanel').hidden = true;
    G.world.refreshCart();
    S.y += 30; // bước ra khỏi quầy
    if (G.world.blocked(S.x, S.y)) S.y -= 30;
    if (G.cartFollow) G.cartFollow(true); // dọn sạp: cầm tay xe đẩy đi tiếp
    G.world.syncPlayer(false);
    G.world.updateCamera(true);
    if (!silent) G.ui.summary(P.r);
  };

  // NPC đang ở gần sạp, tới giờ uống trà (mốc lịch có buy): tự ra xếp hàng gọi món
  function buyKey(id) { return id === 'bac_ba' ? 'ba_buy_' + G.S.loc : 'buy_' + id; }
  P.buyKey = buyKey;
  function regular() {
    var S = G.S, ids = ['khach_la', 'ba_nam', 'bac_ba'];
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i], o = G.world.ents[id], d = G.NPCS[id];
      if (!o || o.busy || o.leaving || o.route.length || !o.en.buy || S.daily[buyKey(id)]) continue;
      o.busy = true; o.e.el.style.display = 'none';
      var e = G.world.makeEnt(d.look, ['side'], 'cust ' + (d.cls || ''));
      var bub = document.createElement('div'); bub.className = 'bubble'; e.el.appendChild(bub);
      var max = BASE_PATIENCE * 1.6;
      G.world.place(e, o.e.x, P.spot.y, 'side', -1);
      P.customers.push({ e: e, bub: bub, type: 'quen', npc: id, want: (d.buyWant || ['tra_da', 'tra_da']).slice(), max: max, pat: max, state: 'in', say: d.buySay || 'Như mọi khi nhé.', sayT: 1.6 });
      return true;
    }
    return false;
  }
  function releaseNpc(c) {
    var o = G.world.ents[c.npc];
    if (o) { o.busy = false; o.e.el.style.display = ''; }
  }

  function spawn() {
    var S = G.S, L = P.L;
    var typeId = pickWeighted(L.sell.types), T = G.CUSTOMER_TYPES[typeId];
    var look = G.genLook ? G.genLook(typeId) : Object.assign({}, T.looks[Math.floor(Math.random() * T.looks.length)]);
    if (T.kid) look.kid = true;
    var weights = {};
    G.ITEM_ORDER.forEach(function (id) { weights[id] = (T.likes[id] || 0) * timeMod(id, S.min); });
    var want = [pickWeighted(weights)];
    if (Math.random() < (L.sell.multi || 0.25)) want.push(pickWeighted(weights));
    var e = G.world.makeEnt(look, ['side'], 'cust');
    var bub = document.createElement('div');
    bub.className = 'bubble';
    e.el.appendChild(bub);
    var max = BASE_PATIENCE * (S.upgrades.o_che ? 1.5 : 1) * (G.patMul ? G.patMul() : 1); // trà đá tự uống, mèo canh xe
    var c = { e: e, bub: bub, type: typeId, want: want, max: max, pat: max, state: 'in', say: '', sayT: 0 };
    if (G.BUY_LINES && Math.random() < 0.45) { c.say = G.BUY_LINES[Math.floor(Math.random() * G.BUY_LINES.length)]; c.sayT = 1.8; } // nói vu vơ khi tới
    G.world.place(e, G.world.camX + G.world.viewW() + 60, P.spot.y, 'side', -1);
    P.customers.push(c);
  }

  var QUIT = ['Quên ví ở nhà… chạy!', 'Ghi sổ nhé!', 'Mai trả!', 'Chuồn thôi!'];
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  P.cidN = 0;
  function waitingList() { return P.customers.filter(function (c) { return c.state === 'in' || c.state === 'wait'; }); }
  P.queue = waitingList;
  function front() { var w = waitingList(); return w[0] && w[0].state === 'wait' ? w[0] : null; }

  function leave(c, say) {
    c.state = 'out'; c.say = say || ''; c.sayT = 1.6;
  }

  P.update = function (dt) {
    var S = G.S;
    S.min += dt * 4; // phiên bán trôi nhanh hơn: 1 giờ ≈ 15 giây
    G.npc.update(dt);
    if (S.min >= G.DAY_END) { G.world.endDay('21:00. Chợ vãn. Anh dọn sạp, đẩy xe về nhà.'); return; }

    // khách mới
    P.spawnT -= dt;
    if (P.spawnT <= 0) {
      var h = S.min / 60;
      var mod = h < 9 ? 0.8 : (h >= 14 && h < 16 ? 1.25 : (h >= 17 ? 0.9 : 1));
      if (S.upgrades.o_che) mod *= 0.85;
      P.spawnT = P.L.sell.interval * mod * (0.7 + Math.random() * 0.6);
      if (waitingList().length < MAX_QUEUE && !regular()) spawn();
    }

    var w = waitingList();
    P.customers.slice().forEach(function (c) {
      var idx = w.indexOf(c);
      if (c.state === 'in' || c.state === 'wait') {
        var tx = slotX(idx);
        if (Math.abs(c.e.x - tx) > 2) {
          c.e.x += Math.sign(tx - c.e.x) * Math.min(WALK * dt, Math.abs(tx - c.e.x));
          c.e.el.classList.add('walk');
        } else {
          c.e.el.classList.remove('walk');
          c.state = 'wait';
        }
        G.world.place(c.e, c.e.x, P.spot.y, 'side', -1);
        if (c.state === 'wait' || idx > 0) {
          c.pat -= dt * (idx === 0 ? 1 : 0.5);
          if (c.pat <= 0) { leave(c, 'Lâu quá...'); P.r.missed++; }
        }
      } else if (c.state === 'toSeat') { // đi vòng phía trước sạp tới ghế
        var st = c.seat, dx = st.x - c.e.x, dy = st.y - c.e.y, dd = Math.hypot(dx, dy), step = WALK * dt;
        var via = c.e.x > P.spot.x - 90 ? { x: c.e.x - step, y: P.spot.y + 34 } : null;
        if (via) { c.e.x -= step; c.e.y += Math.sign(P.spot.y + 34 - c.e.y) * Math.min(step, Math.abs(P.spot.y + 34 - c.e.y)); }
        else if (dd <= step) { c.e.x = st.x; c.e.y = st.y; c.state = 'eat'; c.eatT = 6 + Math.random() * 5; c.e.el.classList.remove('walk'); c.e.el.classList.add('sitting'); }
        else { c.e.x += dx / dd * step; c.e.y += dy / dd * step; }
        if (c.state === 'toSeat') { c.e.el.classList.add('walk'); G.world.place(c.e, c.e.x, c.e.y, 'side', -1); }
        else G.world.place(c.e, c.e.x, c.e.y, 'side', st.flip);
      } else if (c.state === 'eat') {
        c.eatT -= dt;
        if (!c.chatted && c.eatT < 3 && G.THANK_LINES && Math.random() < 0.02) { c.chatted = true; c.say = G.THANK_LINES[Math.floor(Math.random() * G.THANK_LINES.length)]; c.sayT = 1.8; }
        if (c.eatT <= 0) { if (c.owe) quit(c, rnd(QUIT)); c.state = 'out2'; c.seat.used = null; c.e.el.classList.remove('sitting'); render(); }
      } else if (c.state === 'out2') { // ăn xong, đi về phía trái
        c.e.x -= WALK * (c.run ? 1.9 : 1) * dt; // kẻ quịt thì chạy biến
        c.e.el.classList.add('walk');
        G.world.place(c.e, c.e.x, c.e.y, 'side', -1);
        if (c.e.x < G.world.camX - 80) { c.e.el.remove(); P.customers.splice(P.customers.indexOf(c), 1); }
      } else { // ra về
        c.e.x += WALK * 1.2 * dt;
        c.e.el.classList.add('walk');
        G.world.place(c.e, c.e.x, P.spot.y, 'side', 1);
        if (c.e.x > G.world.camX + G.world.viewW() + 80) {
          if (c.npc) releaseNpc(c);
          c.e.el.remove();
          P.customers.splice(P.customers.indexOf(c), 1);
        }
      }
      if (c.sayT > 0) { c.sayT -= dt; if (c.sayT <= 0 && c.state !== 'out') c.say = ''; }
      drawBubble(c, idx === 0 && c.state === 'wait');
    });

    var fw = frontWant(), uk = P.unpaid().map(function (c) { return c.cid + ':' + c.owe; }).join(',');
    if ((fw ? fw.join(',') : '') !== P._wantKey || uk !== P._oweKey) { P._oweKey = uk; render(); }
    if (!P.stockWarned && G.stockTotal(S) === 0 && P.tray.length === 0) {
      P.stockWarned = true;
      G.ui.toast('Hết sạch hàng. Bấm "Đóng sạp" để dọn về.');
    }
    renderStats();
  };

  function drawBubble(c, isFront) {
    var h;
    if (c.say) h = '<div class="say">' + c.say + '</div>';
    else if (c.state === 'eat') h = '<div class="want eating">' + (c.ate || []).map(function (id) { return G.art.icon(id); }).join('') + '</div>' +
      (c.owe ? '<button class="paybtn" data-cid="' + c.cid + '">Thu ' + c.owe + 'k</button>' : '');
    else if (c.state === 'out' || c.state === 'out2' || c.state === 'toSeat') h = '';
    else {
      h = '<div class="want">' + c.want.map(function (id) { return G.art.icon(id); }).join('') + '</div>' +
        '<div class="pbar"><i style="width:' + Math.max(0, c.pat / c.max * 100).toFixed(0) + '%"></i></div>';
    }
    if (c._h !== h) { c.bub.innerHTML = h; c._h = h; }
    c.bub.classList.toggle('front', !!isFront);
    c.bub.hidden = !h;
  }

  function sameItems(a, b) {
    if (a.length !== b.length) return false;
    var x = a.slice().sort().join(','), y = b.slice().sort().join(',');
    return x === y;
  }

  P.add = function (id) {
    var S = G.S;
    if (S.stock[id] <= 0) { G.ui.toast('Hết ' + G.ITEMS[id].name.toLowerCase() + '.'); return; }
    if (P.tray.length >= 4) return;
    S.stock[id]--; P.tray.push(id);
    render();
  };
  P.clearTray = function () {
    P.tray.forEach(function (id) { G.S.stock[id]++; });
    P.tray = [];
    render();
  };
  P.serve = function () {
    var S = G.S, c = front();
    if (!c) { G.ui.toast('Chưa có khách ở quầy.'); return; }
    if (!P.tray.length) { G.ui.toast('Khay đang trống.'); return; }
    var partial = false;
    if (!sameItems(P.tray, c.want)) {
      // đơn nhiều món: khay đúng một phần (không có món lạ) thì khách lấy phần đó, không boa
      var rest = c.want.slice(), ok = c.want.length > 1 && P.tray.length < c.want.length && P.tray.every(function (id) { var k = rest.indexOf(id); if (k < 0) return false; rest.splice(k, 1); return true; });
      if (!ok) {
        c.say = 'Không phải món tôi gọi.'; c.sayT = 1.4;
        c.pat = Math.max(1, c.pat - c.max * 0.25);
        return;
      }
      partial = true;
    }
    var got = partial ? P.tray.slice() : c.want, pay = 0;
    got.forEach(function (id) { pay += G.ITEMS[id].price; });
    var tip = !partial && c.pat / c.max > 0.5 ? Math.round(c.want.length * P.L.sell.tipMul) : 0;
    if (G.tipAdj && !partial) tip = G.tipAdj(tip); // có lộc (cho chó mèo ăn), ngọt giọng (nước ngọt)
    var free = (P.seats || []).filter(function (st) { return !st.used; });
    var sit = !c.npc && free.length && Math.random() < 0.55; // ra ghế ngồi ăn: ăn xong mới trả tiền
    S.stats.sold += got.length; P.r.served++; P.r.items += got.length;
    if (sit) { c.owe = pay + tip; c.tip = tip; }
    else { S.money += pay + tip; S.stats.earned += pay + tip; P.r.earned += pay + tip; P.r.tips += tip; }
    P.tray = [];
    if (c.npc === 'bac_ba') {
      S.daily['ba_buy_' + S.loc] = 1;
      S.rel.bac_ba = (S.rel.bac_ba || 0) + 1;
      G.ui.toast('Bác Ba uống một ly, ly kia đặt cạnh chân không đụng tới.', 3500);
    }
    var thank = !partial && G.THANK_LINES && Math.random() < 0.5 ? G.THANK_LINES[Math.floor(Math.random() * G.THANK_LINES.length)] + ' ' : '';
    if (sit) {
      leave(c, (partial ? 'Thiếu món thì lấy chừng này. ' : '') + 'Ăn xong trả tiền nhé!');
      var seat = free[Math.floor(Math.random() * free.length)];
      seat.used = c; c.seat = seat; c.state = 'toSeat'; c.ate = got.slice(); c.cid = ++P.cidN;
    } else leave(c, thank + (partial ? 'Thiếu món thì lấy chừng này. ' : '') + '+' + (pay + tip) + 'k' + (tip ? ' (boa ' + tip + 'k)' : ''));
    if (c.npc) { S.daily[buyKey(c.npc)] = 1; if (G.NPCS[c.npc].onServed) G.NPCS[c.npc].onServed(S); }
    render();
    G.ui.hud();
  };
  P.collect = function (c) {
    var S = G.S;
    if (!c || !c.owe) return 0;
    var v = c.owe; c.owe = 0;
    S.money += v; S.stats.earned += v; P.r.earned += v; P.r.tips += c.tip || 0;
    c.say = '+' + v + 'k' + (c.tip ? ' (boa ' + c.tip + 'k)' : ''); c.sayT = 1.6;
    if (G.audio && G.audio.sfx) G.audio.sfx('coin');
    render(); G.ui.hud();
    return v;
  };
  P.unpaid = function () { return P.customers.filter(function (c) { return c.owe > 0 && (c.state === 'toSeat' || c.state === 'eat'); }); };
  P.collectAll = function () { var n = 0; P.unpaid().forEach(function (c) { n += P.collect(c); }); return n; };
  function quit(c, why) { // khách chuồn không trả tiền
    var S = G.S, v = c.owe || 0;
    if (!v) return;
    c.owe = 0; c.run = true; P.r.quit = (P.r.quit || 0) + 1; P.r.quitK = (P.r.quitK || 0) + v;
    S.stats.quit = (S.stats.quit || 0) + 1; S.flags.bi_quit = true;
    c.say = why || 'Chuồn thôi!'; c.sayT = 1.8;
  }
  P.decline = function () {
    var c = front();
    if (!c) return;
    if (c.npc) G.S.daily[buyKey(c.npc)] = 1;
    var npcDef = c.npc && G.NPCS[c.npc];
    if (npcDef && npcDef.onDecline) npcDef.onDecline(G.S); // khách mang cốt truyện: hết món vẫn nói chuyện
    c.want.forEach(function (id) {
      var n = G.ITEMS[id].name.toLowerCase();
      if (G.S.stock[id] === 0 && P.r.asked.indexOf(n) < 0) P.r.asked.push(n);
    });
    leave(c, 'Thôi để lần sau.');
  };

  // Thanh bán hàng: thẻ món (món khách đang gọi sáng lên), dòng "khách gọi", khay 4 ô, nút Giao sáng khi khay đúng món
  function frontWant() { var f = front(); return f ? f.want.slice() : null; }
  function trayOk() { var f = front(); if (!f || !P.tray.length) return false; if (sameItems(P.tray, f.want)) return true; var rest = f.want.slice(); return P.tray.every(function (id) { var k = rest.indexOf(id); if (k < 0) return false; rest.splice(k, 1); return true; }); }
  function render() {
    var S = G.S, want = frontWant() || [];
    var h = '<div class="sp-items">';
    G.ITEM_ORDER.forEach(function (id, i) {
      var it = G.ITEMS[id], n = S.stock[id], need = n > 0 && want.indexOf(id) >= 0 && P.tray.filter(function (x) { return x === id; }).length < want.filter(function (x) { return x === id; }).length;
      h += '<button class="sp-item' + (need ? ' need' : '') + (n ? '' : ' empty') + '" data-a="add" data-id="' + id + '"' + (n ? '' : ' disabled') + '>' +
        '<kbd class="key">' + (i + 1) + '</kbd><span class="ico">' + G.art.icon(id) + '</span><span class="nm">' + it.name + '</span>' +
        '<span class="meta"><b class="price">' + it.price + 'k</b><i class="stock">' + (n ? 'còn ' + n : 'HẾT') + '</i></span></button>';
    });
    h += '</div><div class="sp-mid"><div class="sp-order">' + (want.length ? '<span>Khách gọi</span>' + want.map(function (id) { return G.art.icon(id); }).join('') : '<span class="wait">Đang chờ khách…</span>') + '</div>';
    h += '<div class="sp-tray"><span class="lbl">Khay</span><div class="slots">';
    for (var k = 0; k < 4; k++) h += '<span class="slot' + (P.tray[k] ? ' full' : '') + '">' + (P.tray[k] ? G.art.icon(P.tray[k]) : '') + '</span>';
    h += '</div><button class="sp-clear" data-a="clear"' + (P.tray.length ? '' : ' disabled') + '>Bỏ khay</button>' +
      '<button class="primary sp-serve' + (trayOk() ? ' ready' : '') + '" data-a="serve">Giao <kbd>Space</kbd></button></div></div>';
    var up = P.unpaid ? P.unpaid() : [], owe = up.reduce(function (a, c) { return a + c.owe; }, 0);
    h += '<div class="sp-side"><div id="sellstats"></div>' + (up.length ? '<button class="sp-pay" data-a="collect">Thu tiền ' + owe + 'k <kbd>C</kbd></button>' : '') + '<button data-a="decline">Hết món <kbd>X</kbd></button><button class="danger" data-a="close">Đóng sạp <kbd>Q</kbd></button></div>';
    $('sellpanel').innerHTML = h;
    P._wantKey = want.join(',');
    renderStats();
  }
  P.render = render;
  function renderStats() {
    var el = $('sellstats');
    if (el) {
      var t = '<span class="coin">' + P.r.earned + 'k</span><small>' + P.r.items + ' món · ' + P.r.served + ' khách</small>';
      if (el._t !== t) { el.innerHTML = t; el._t = t; }
    }
  }
  P.render = render;

  document.addEventListener('DOMContentLoaded', function () {
    $('sellpanel').addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled || G.ui.isBusy()) return;
      var a = b.dataset.a;
      if (a === 'add') P.add(b.dataset.id);
      else if (a === 'clear') P.clearTray();
      else if (a === 'serve') P.serve();
      else if (a === 'decline') P.decline();
      else if (a === 'close') P.stop(false);
      else if (a === 'collect') P.collectAll();
    });
    // bấm nút "Thu …k" trên đầu khách đang ngồi ăn
    $('ents').addEventListener('click', function (e) {
      var b = e.target.closest('.paybtn'); if (!b || !P.active) return;
      e.stopPropagation();
      var c = P.customers.filter(function (x) { return x.cid === +b.dataset.cid; })[0];
      P.collect(c);
    });
  });
})();
