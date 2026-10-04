// Thế giới nhìn từ trên xuống: dựng địa điểm, đi 8 hướng có va chạm, camera hai chiều, tương tác, đồng hồ, hết ngày.
var G = window.G || (window.G = {});
G.world = { mode: 'walk', camX: 0, camY: 0, ents: {}, near: null, solids: [] };

(function () {
  var W = G.world;
  var $ = function (id) { return document.getElementById(id); };
  var SPEED = 250;   // đơn vị/giây (đi xe máy nhanh hơn, xem W.speed)
  W.PARK = { loc: 'nha', x: 700, y: 520 }; // xe hàng cất trước cửa nhà, chỉ đẩy ra khi bày sạp
  function spd() { return W.speed ? W.speed() : SPEED; }
  var SCALE = 0.5;   // tỉ lệ nhân vật trong cảnh
  var CART_SCALE = 0.5;
  var REACH = 62;
  var FOOT_W = 22, FOOT_H = 12;

  // input: phím hướng + cần điều khiển ảo (jx, jy trong khoảng -1..1)
  G.input = { left: false, right: false, up: false, down: false, jx: 0, jy: 0, act: false };

  // Thực thể có thể có nhiều góc nhìn (front/side/back); data-view chọn góc đang hiện
  W.makeEnt = function (look, views, cls) {
    var el = document.createElement('div');
    el.className = 'ent ' + (cls || '');
    var h = '<div class="fl">';
    views.forEach(function (v) { h += G.art.chibi(Object.assign({}, look, { view: v })); });
    el.innerHTML = h + '</div>';
    $('ents').appendChild(el);
    return { el: el, fl: el.firstChild, x: 0, y: 0, view: views[0], flip: 1, scale: SCALE };
  };
  W.place = function (e, x, y, view, flip) {
    e.x = x; e.y = y;
    if (view) e.view = view;
    if (flip) e.flip = flip;
    e.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    e.el.style.zIndex = Math.round(y);
    e.fl.style.transform = 'scale(' + (e.flip * e.scale) + ',' + e.scale + ')';
    if (e.view && e._v !== e.view) { e.el.dataset.view = e.view; e._v = e.view; }
  };

  W.enter = function (locId, x, y) {
    var S = G.S, L = G.LOCATIONS[locId];
    var sc = G.scenes[locId](L.width, L.height);
    S.loc = locId; S.x = x; S.y = y;
    W.solids = sc.solids;
    $('world').style.width = L.width + 'px';
    $('world').style.height = L.height + 'px';
    $('bg').innerHTML = sc.svg;
    $('fg').innerHTML = sc.fg;
    $('ents').innerHTML = '';
    sc.props.forEach(function (p) {
      var d = document.createElement('div');
      d.className = 'propw';
      d.style.cssText = 'left:' + p.x + 'px;top:' + p.y + 'px;z-index:' + Math.round(p.z);
      d.innerHTML = p.svg;
      $('ents').appendChild(d);
    });
    // ô đánh dấu chỗ bày sạp và dấu chấm than trên đồ vật trong nhiệm vụ
    W.marks = [];
    L.things.forEach(function (t) {
      if (t.act === 'sell' && (!t.cond || t.cond(S))) {
        var m = document.createElement('div');
        m.className = 'sellmark';
        m.style.transform = 'translate3d(' + t.x + 'px,' + t.y + 'px,0)';
        $('ents').appendChild(m);
      }
      if (t.quest) {
        var q = document.createElement('div');
        q.className = 'qmark thing';
        q.textContent = '!';
        q.style.transform = 'translate3d(' + t.x + 'px,' + ((t.hit ? t.hit[1] : t.y - 60) - 6) + 'px,0)';
        $('ents').appendChild(q);
        W.marks.push({ t: t, el: q });
      }
    });
    W.ents = {};
    W.route = null; W.pending = null; W.exitAfter = null;
    G.npc.enterScene();
    W.cart = { el: document.createElement('div'), x: 0, y: 0, flip: 1, scale: CART_SCALE };
    W.cart.el.className = 'ent cartent';
    W.cart.el.innerHTML = '<div class="fl">' + G.art.cart(S) + '</div>';
    W.cart.fl = W.cart.el.firstChild;
    $('ents').appendChild(W.cart.el);
    W.player = W.makeEnt(G.playerLook ? G.playerLook() : G.PLAYER_LOOK, ['front', 'side', 'back'], 'player');
    W.prompt = document.createElement('div');
    W.prompt.className = 'prompt'; W.prompt.hidden = true;
    $('ents').appendChild(W.prompt);
    // vào cảnh mà đứng trong vật cản thì đặt xuống giữa đường
    if (blocked(S.x, S.y)) S.y = 600;
    G.path.build(L);
    W.cart.x = W.PARK.x; W.cart.y = W.PARK.y; W.cart.flip = -1;
    W.syncPlayer(false);
    W.updateCamera(true);
    G.ui.hud();
    if (G.onEnter) G.onEnter(locId);
  };

  W.refreshCart = function () {
    if (!W.cart) return;
    W.cart.fl.innerHTML = G.art.cart(G.S);
    G.ui.hud();
  };

  function blocked(x, y) {
    var ax = x - FOOT_W / 2, ay = y - FOOT_H, s = W.solids;
    for (var i = 0; i < s.length; i++) {
      var r = s[i];
      if (ax < r[0] + r[2] && ax + FOOT_W > r[0] && ay < r[1] + r[3] && ay + FOOT_H > r[1]) return true;
    }
    return false;
  }
  W.blocked = blocked;

  // Xe hàng cất trước cửa nhà; bày sạp ở đâu thì xe dựng bên phải người chơi làm quầy ở đó.
  W.syncPlayer = function (walking) {
    var S = G.S;
    W.place(W.player, S.x, S.y, S.view || 'front', S.flip || 1);
    var sell = W.mode === 'sell';
    if (sell) W.place(W.cart, S.x + 70, S.y + 4, null, 1);
    else W.place(W.cart, W.cart.x, W.cart.y, null, W.cart.flip);
    W.player.el.classList.toggle('walk', !!walking);
    W.cart.el.style.display = !S.era && (sell || S.cartOut || S.loc === W.PARK.loc) ? '' : 'none'; // xe hàng không qua được gương
  };

  // Camera bám sát nhân vật: phóng cảnh lên W.zoom lần, camX/camY là toạ độ thế giới ở góc trên trái khung nhìn
  // màn dọc: phóng cảnh cho phủ kín chiều cao màn hình (không còn dải đen), cần điều khiển nổi trên cảnh
  G.DECK = 0;
  W.baseZoom = function () {
    if (!G.portrait) return 1.25;
    var L = G.S && G.LOCATIONS[G.S.loc];
    return Math.max(1, G.VIEW_H / ((L && L.height) || 790));
  };
  W.zoom = 1.25;
  W.viewW = function () { return G.VIEW_W / W.zoom; };
  W.viewH = function () { return (G.VIEW_H - (G.portrait ? G.DECK : 0)) / W.zoom; };
  W.updateCamera = function (snap, tx, ty) {
    var L = G.LOCATIONS[G.S.loc], vw = W.viewW(), vh = W.viewH();
    var cx = (tx !== undefined ? tx : G.S.x) - vw / 2;
    var cy = (ty !== undefined ? ty : G.S.y - (L.camBias !== undefined ? L.camBias * 0.6 : 18)) - vh / 2;
    cx = Math.max(0, Math.min(L.width - vw, cx));
    cy = Math.max(0, Math.min(L.height - vh, cy));
    W.camX = snap ? cx : W.camX + (cx - W.camX) * 0.14;
    W.camY = snap ? cy : W.camY + (cy - W.camY) * 0.14;
    $('world').style.transform = 'translate3d(' + (-W.camX * W.zoom).toFixed(1) + 'px,' + (-W.camY * W.zoom).toFixed(1) + 'px,0) scale(' + W.zoom + ')';
  };
  // đổi toạ độ thế giới <-> toạ độ màn hình (client)
  W.toClient = function (x, y) {
    var r = $('stage').getBoundingClientRect(), k = r.width / G.VIEW_W * W.zoom;
    return [r.left + (x - W.camX) * k, r.top + (y - W.camY) * k];
  };

  // Những chỗ tương tác được lúc này: đồ vật thoả điều kiện + NPC đang đứng yên
  W.things = function () {
    var S = G.S, L = G.LOCATIONS[S.loc];
    return L.things.filter(function (t) { return !t.cond || t.cond(S); }).concat(G.npc.things());
  };
  function labelOf(t) { return typeof t.label === 'function' ? t.label(G.S) : t.label; }

  function nearest() {
    var S = G.S, best = null, bd = REACH;
    W.things().forEach(function (t) {
      var d = Math.hypot(t.x - S.x, (t.y - S.y) * 1.3);
      if (d < bd) { bd = d; best = t; }
    });
    return best;
  }

  W.update = function (dt) {
    var S = G.S, L = G.LOCATIONS[S.loc], I = G.input;
    var vx = (I.right ? 1 : 0) - (I.left ? 1 : 0) + I.jx;
    var vy = (I.down ? 1 : 0) - (I.up ? 1 : 0) + I.jy;
    if (vx || vy) { W.route = null; W.pending = null; W.exitAfter = null; } // điều khiển tay thì huỷ đường bấm
    else if (W.route) {
      var p = W.route[0], ddx = p.x - S.x, ddy = p.y - S.y, dd = Math.hypot(ddx, ddy);
      if (dd < 2) {
        if (!blocked(p.x, p.y)) { S.x = p.x; S.y = p.y; } // đặt đúng vào điểm trung gian để đoạn sau không cạ tường
        W.route.shift();
        if (!W.route.length) {
          W.route = null;
          if (W.exitAfter) {
            var dir = W.exitAfter; W.exitAfter = null;
            if (dir === 'left') { var to2 = G.LOCATIONS[L.exits.left]; S.flip = -1; W.enter(to2.id, to2.width - 50, S.y); }
            else { S.flip = 1; W.enter(L.exits.right, 50, S.y); }
            return;
          }
        }
      } else {
        var sp = Math.min(1, dd / (spd() * dt));
        vx = ddx / dd * sp; vy = ddy / dd * sp;
        // kẹt (bị chặn) quá lâu thì thôi
        W.stuckT = (Math.abs(S.x - (W.lastX || 0)) + Math.abs(S.y - (W.lastY || 0)) < 0.5) ? (W.stuckT || 0) + dt : 0;
        W.lastX = S.x; W.lastY = S.y;
        if (W.stuckT > 0.4) { W.route = null; W.pending = null; W.stuckT = 0; }
      }
    }
    var len = Math.hypot(vx, vy);
    var moving = len > 0.05;
    if (moving) {
      if (len > 1) { vx /= len; vy /= len; }
      var nx = S.x + vx * spd() * dt, ny = S.y + vy * spd() * dt;
      // ra mép thì sang địa điểm kế bên
      if (nx < 24 && L.exits.left) { var to = G.LOCATIONS[L.exits.left]; S.flip = -1; W.enter(to.id, to.width - 50, S.y); return; }
      if (nx > L.width - 24 && L.exits.right) { S.flip = 1; W.enter(L.exits.right, 50, S.y); return; }
      var slid = false;
      if (!blocked(nx, S.y)) S.x = nx;
      else if (W.route && Math.abs(vy) < 0.3) { // bị tường cạ khi đi theo đường bấm: trượt dọc ra khỏi mép
        var off = W.route[0].y - S.y, sy = off >= 0 ? 1 : -1, step = Math.max(1, Math.min(Math.abs(off), spd() * dt));
        if (!blocked(S.x, S.y + sy * step)) { S.y += sy * step; slid = true; }
      }
      if (!slid && !blocked(S.x, ny)) S.y = ny;
      else if (!slid && W.route && Math.abs(vx) < 0.3 && blocked(S.x, ny)) { // bị chặn khi đi dọc: trượt ngang ra khỏi mép
        var offx = W.route[0].x - S.x, sx = offx >= 0 ? 1 : -1, stepx = Math.max(1, Math.min(Math.abs(offx), spd() * dt));
        if (!blocked(S.x + sx * stepx, S.y)) S.x += sx * stepx;
      }
      S.y = Math.max(20, Math.min(L.height - 4, S.y));
      if (Math.abs(vx) > Math.abs(vy) * 0.8) { S.view = 'side'; S.flip = vx > 0 ? 1 : -1; }
      else S.view = vy > 0 ? 'front' : 'back';
    }
    W.syncPlayer(moving);
    W.updateCamera(false);

    G.npc.update(dt);
    if (G.danger && G.danger.active && G.danger.update(dt)) return;
    if (G.tick) G.tick(dt);
    W.marks.forEach(function (m) { m.el.hidden = !((!m.t.cond || m.t.cond(S)) && m.t.quest(S) && (!G.showQuest || G.showQuest('thing:' + m.t.id))); });

    // đồng hồ: 1 phút trò chơi mỗi 0,5 giây khi đang đi lại. Ở năm 1996 dùng đồng hồ riêng, không hết ngày.
    if (S.era) S.pmin += dt * 2;
    else {
      S.min += dt * 2;
      if (S.min >= G.DAY_END) { W.endDay('21:00. Phố tắt đèn. Anh đẩy xe về nhà.'); return; }
    }

    // tới nơi đã bấm thì tương tác
    if (W.pending && !W.route) {
      var pt = W.pending; W.pending = null;
      var live = W.things().filter(function (x) { return x.id === pt.id; })[0];
      if (live && Math.hypot(live.x - S.x, (live.y - S.y) * 1.3) < REACH + 10) {
        if (live.npc) { S.view = live.ny < S.y ? 'back' : 'front'; }
        W.interact(live); return;
      }
    }

    var t = nearest();
    W.near = t;
    if (t) {
      W.prompt.hidden = false;
      W.prompt.textContent = (G.isTouch ? '' : 'E · ') + labelOf(t);
      var py = Math.min(t.y, t.npc ? t.ny : t.y) - 122;
      W.prompt.style.transform = 'translate3d(' + t.x + 'px,' + py + 'px,0) translateX(-50%)';
    } else W.prompt.hidden = true;
    if (G.ui.actBtn) G.ui.actBtn(t, t ? labelOf(t) : '');

    if (I.act) { I.act = false; if (t) W.interact(t); }
    edgeHints(L);
  };

  // Bấm/chạm vào cảnh: đi tới đó; bấm vào người hoặc đồ vật thì đi lại rồi tương tác; bấm sát mép có lối ra thì sang cảnh bên
  W.clickAt = function (clientX, clientY) {
    if (!G.S || G.ui.isBusy() || W.mode !== 'walk') return;
    var S = G.S, L = G.LOCATIONS[S.loc];
    var r = $('stage').getBoundingClientRect(), k = r.width / G.VIEW_W * W.zoom;
    var x = (clientX - r.left) / k + W.camX, y = (clientY - r.top) / k + W.camY;
    var hit = null;
    W.things().forEach(function (t) {
      var on;
      if (t.npc) on = Math.abs(x - t.nx) < 28 && y > t.ny - 100 && y < t.ny + 10;
      else if (t.hit) on = x >= t.hit[0] && x <= t.hit[0] + t.hit[2] && y >= t.hit[1] && y <= t.hit[1] + t.hit[3];
      else on = Math.hypot(x - t.x, y - t.y) < 50;
      if (on) hit = t;
    });
    var tx = x, ty = y;
    W.exitAfter = null; W.pending = null;
    if (hit) { tx = hit.x; ty = hit.y; W.pending = hit; }
    else if (x < 60 && L.exits.left) { tx = 34; W.exitAfter = 'left'; }
    else if (x > L.width - 60 && L.exits.right) { tx = L.width - 34; W.exitAfter = 'right'; }
    if (hit && Math.hypot(hit.x - S.x, (hit.y - S.y) * 1.3) < REACH) { W.route = null; W.pending = null; W.interact(hit); return; } // đã đứng gần: tương tác ngay, không để lệnh chờ chạy lại lần nữa
    var path = G.path.find(S.x, S.y, tx, ty);
    if (!path) { W.pending = null; W.exitAfter = null; G.ui.toast('Không đi tới đó được.', 1200); return; }
    W.route = path; W.stuckT = 0;
    var m = document.createElement('div');
    m.className = 'marker' + (hit ? ' hit' : '');
    m.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    $('ents').appendChild(m);
    setTimeout(function () { m.remove(); }, 700);
  };

  function edgeHints(L) {
    var S = G.S;
    $('edge-l').hidden = !(L.exits.left && S.x < 240);
    $('edge-r').hidden = !(L.exits.right && S.x > L.width - 240);
    if (L.exits.left) $('edge-l').textContent = '◀ ' + G.LOCATIONS[L.exits.left].name;
    if (L.exits.right) $('edge-r').textContent = G.LOCATIONS[L.exits.right].name + ' ▶';
  }

  W.interact = function (t) {
    var S = G.S;
    W.syncPlayer(false);
    if (G.acts && G.acts[t.act]) { G.acts[t.act](t); return; }
    if (t.act === 'shop' || t.act === 'talk') {
      G.talk(t.npc);
    } else if (t.act === 'door9') {
      if (S.items.ly_tra_ba) {
        G.ui.dialog(G.TEXT.door9_deliver, function () {
          G.addClue('e_vet_ly');
          delete S.items.ly_tra_ba; S.flags.door9_open = true; S.quests.ly_tra = 'delivered';
          W.enter(S.loc, S.x, S.y); // dựng lại cảnh: cửa đã mở
        });
      } else G.ui.dialog(G.TEXT.door9_locked, function () { G.addClue('e_vet_ly'); });
    } else if (t.act === 'table9') {
      if (S.items.ban_ve_dinh) G.ui.dialog(G.TEXT.table9_copy, function () { S.flags.took9 = true; W.enter(S.loc, S.x, S.y); });
      else G.ui.dialog(G.TEXT.ban_ve_dinh, function () {
        S.items.ban_ve_dinh = true; S.flags.took9 = true;
        G.ui.toast('Đã nhận: **' + G.KEY_ITEMS.ban_ve_dinh.name + '**');
        G.addClue('e_ban_ve', { source: 'Bàn trong nhà số 9 (nhà ông Rạng)' });
        W.enter(S.loc, S.x, S.y);
      });
    } else if (t.act === 'box') {
      if (!S.flags.tung_box) G.ui.dialog(G.TEXT.box_closed);
      else if (S.flags.box_done) G.ui.dialog(G.TEXT.box_done);
      else {
        var draft = !S.items.ban_ve_dinh;
        G.ui.dialog(G.TEXT.box_open.concat(draft ? G.TEXT.box_draft : []), function () {
          S.flags.box_done = true;
          G.addClue('e_bien_ban');
          if (draft) {
            S.items.ban_ve_dinh = true;
            G.addClue('e_ban_ve', { source: 'Thùng giấy ông Khải đem bán ve chai' });
          }
        });
      }
    } else if (t.act === 'sell') {
      if (S.min >= G.DAY_END - 30) { G.ui.toast('Muộn quá rồi, không ai ra mua nữa.'); return; }
      if (G.stockTotal(S) === 0) {
        G.ui.dialog([{ text: 'Xe trống trơn. Phải ra chợ nhập hàng ở chỗ cô Lan trước đã.' }]);
        return;
      }
      G.sell.start(S.loc);
    } else if (t.act === 'rest') {
      G.ui.rest();
    } else if (t.act === 'look') {
      G.ui.dialog(G.TEXT[t.text], t.clue ? function () { G.addClue(t.clue); } : null);
    }
  };

  // Hết ngày: bỏ hàng hết hạn, sang sáng hôm sau ở nhà, tự lưu
  W.endDay = function (msg, then) {
    var S = G.S;
    if (G.sell.active) G.sell.stop(true);
    var lost = [];
    G.ITEM_ORDER.forEach(function (id) {
      if (G.ITEMS[id].perish && S.stock[id] > 0) { lost.push(S.stock[id] + ' ' + G.ITEMS[id].name.toLowerCase()); S.stock[id] = 0; }
    });
    if (Object.keys(S.upgrades).length) S.flags.slept_after_upgrade = true;
    S.day++; S.stats.days++;
    S.daily = {};
    S.min = 6 * 60 + 30;
    S.view = 'front';
    var fade = $('fade');
    fade.classList.add('on');
    G.ui.modal = 'fade';
    setTimeout(function () {
      W.enter('nha', G.HOME.x, G.HOME.y);
      G.save();
      var lines = msg ? [{ text: msg }] : [];
      if (lost.length) lines.push({ text: 'Hàng không để qua đêm được phải bỏ: ' + lost.join(', ') + '.' });
      lines.push({ text: 'Ngày ' + S.day + '. 6:30 sáng. (Đã tự lưu)' });
      fade.classList.remove('on');
      G.ui.modal = null;
      G.ui.dialog(lines, then);
    }, 900);
  };

  // Màu trời theo giờ: sáng hơi sáng, tối tối dần, đèn đường bật sau 17:00
  W.tint = function () {
    var m = G.S.min, a, c;
    $('stage').classList.toggle('past', !!G.S.era);
    if (G.S.era) { if ($('tint')._bg !== 'era') { $('tint')._bg = 'era'; $('tint').style.background = 'rgba(40,22,8,.32)'; } $('stage').classList.add('night'); return; }
    if (m < 9 * 60) { c = '111,134,160'; a = 0.10 * (1 - (m - 360) / 180); }
    else if (m < 16 * 60) { c = '0,0,0'; a = 0; }
    else { c = '4,7,12'; a = Math.min(0.5, (m - 960) / 300 * 0.5); }
    var bg = 'rgba(' + c + ',' + Math.max(0, a).toFixed(3) + ')', tn = $('tint');
    if (tn._bg !== bg) { tn._bg = bg; tn.style.background = bg; }
    $('stage').classList.toggle('night', m >= 17 * 60);
  };
})();
