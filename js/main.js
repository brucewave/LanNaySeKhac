// Khởi động, vòng lặp, bàn phím và nút cảm ứng.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };
  G.isTouch = ('ontouchstart' in window) || window.matchMedia('(pointer:coarse)').matches;

  // Sân khấu cao 540, bề ngang giãn theo tỉ lệ cửa sổ (960–1200) để màn hình rộng không còn dải đen hai bên
  function fit() {
    var ar = window.innerWidth / window.innerHeight;
    G.VIEW_W = Math.round(Math.max(960, Math.min(1200, G.VIEW_H * ar)));
    var s = Math.min(window.innerWidth / G.VIEW_W, window.innerHeight / G.VIEW_H);
    var st = $('stage');
    st.style.width = G.VIEW_W + 'px';
    st.style.transform = 'translate(-50%,-50%) scale(' + s + ')';
    if (G.S && G.world && G.world.updateCamera && G.LOCATIONS[G.S.loc]) G.world.updateCamera(true);
  }

  G.start = function (S) {
    if (G.sell.active) G.sell.stop(true);
    var fresh = !S;
    document.querySelectorAll('.panel').forEach(function (p) { p.hidden = true; }); // đóng mọi bảng còn mở từ ván trước
    G.ui.modal = null;
    G.S = S || G.newState();
    G.syncClues(G.S);
    if (G.S.danger && G.S.checkpoint) { var cp = G.S.checkpoint; G.S = JSON.parse(cp); G.S.checkpoint = cp; } // tải game giữa cảnh nguy hiểm: về điểm lưu cảnh
    if (G.danger) G.danger.active = false;
    $('title').hidden = true;
    G.world.mode = 'walk';
    G.world.enter(G.S.loc, G.S.x, G.S.y);
    if (fresh) {
      G.ui.dialog(G.TEXT.intro, function () { G.ui.help(function () { G.save(); }); });
    }
  };

  var last = 0;
  function loop(t) {
    var dt = Math.min(0.05, (t - last) / 1000 || 0);
    last = t;
    if (G.S && !G.ui.isBusy()) {
      if (G.world.mode === 'sell') G.sell.update(dt);
      else G.world.update(dt);
      G.world.tint();
      G.ui.hud();
    } else {
      G.input.act = false;
      if (G.world.prompt) G.world.prompt.hidden = true;
    }
    requestAnimationFrame(loop);
  }

  var KEYS = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down' };
  function onKey(e, down) {
    if (KEYS[e.code]) { G.input[KEYS[e.code]] = down; e.preventDefault(); return; }
    if (!down || e.repeat || !G.S) return;
    var m = G.ui.modal;
    if (e.code === 'Escape') {
      if (m === 'menu') G.ui.close('menu');
      else if (!m) G.ui.menu();
      return;
    }
    if (m === 'dialog') {
      var ck = { Digit1: 0, Digit2: 1, Digit3: 2, Numpad1: 0, Numpad2: 1 }[e.code];
      if (ck !== undefined && G.ui.choose) { G.ui.choose(ck); e.preventDefault(); return; }
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') { if (G.ui.advance) G.ui.advance(); e.preventDefault(); return; }
    }
    if (m === 'bag' && (e.code === 'KeyI' || e.code === 'Escape')) { G.ui.close('bag'); return; }
    if (m === 'notebook' && (e.code === 'KeyJ' || e.code === 'Escape')) { G.ui.close('notebook'); G.ui.hud(); return; }
    if (m) return;
    if (G.world.mode === 'sell') {
      var n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3 }[e.code];
      if (n !== undefined) G.sell.add(G.ITEM_ORDER[n]);
      else if (e.code === 'Space' || e.code === 'Enter') G.sell.serve();
      else if (e.code === 'Backspace') G.sell.clearTray();
      else if (e.code === 'KeyX') G.sell.decline();
      else if (e.code === 'KeyQ') G.sell.stop(false);
      else if (e.code === 'KeyC') G.sell.collectAll();
      e.preventDefault();
      return;
    }
    if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') { G.input.act = true; e.preventDefault(); }
    if (e.code === 'KeyI') G.ui.bag();
    if (e.code === 'KeyJ') G.ui.notebook();
  }

  // Cần điều khiển ảo: chạm vào nửa trái màn hình rồi kéo
  function joystick() {
    var zone = $('joyzone'), base = $('joy'), knob = $('joyknob'), id = null, ox = 0, oy = 0, R = 46, t0 = 0, moved = 0;
    function scale() { return $('stage').getBoundingClientRect().width / G.VIEW_W; }
    zone.addEventListener('pointerdown', function (e) {
      if (id !== null) return;
      id = e.pointerId; try { zone.setPointerCapture(id); } catch (err) {}
      var r = $('stage').getBoundingClientRect(), k = scale();
      ox = (e.clientX - r.left) / k; oy = (e.clientY - r.top) / k;
      base.style.left = ox + 'px'; base.style.top = oy + 'px';
      base.classList.add('on'); knob.style.transform = '';
      t0 = Date.now(); moved = 0;
    });
    zone.addEventListener('pointermove', function (e) {
      if (e.pointerId !== id) return;
      var r = $('stage').getBoundingClientRect(), k = scale();
      var dx = (e.clientX - r.left) / k - ox, dy = (e.clientY - r.top) / k - oy, d = Math.hypot(dx, dy);
      moved = Math.max(moved, d);
      if (moved < 10) return;
      if (d > R) { dx = dx / d * R; dy = dy / d * R; }
      knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      G.input.jx = dx / R; G.input.jy = dy / R;
    });
    function end(e) {
      if (e.pointerId !== id) return;
      id = null; G.input.jx = G.input.jy = 0; base.classList.remove('on');
      if (e.type === 'pointerup' && moved < 10 && Date.now() - t0 < 350) G.world.clickAt(e.clientX, e.clientY); // chạm nhẹ = bấm để đi
    }
    zone.addEventListener('pointerup', end);
    zone.addEventListener('pointercancel', end);
  }

  document.addEventListener('DOMContentLoaded', function () {
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('keydown', function (e) { onKey(e, true); });
    window.addEventListener('keyup', function (e) { onKey(e, false); });
    window.addEventListener('blur', function () { G.input.left = G.input.right = G.input.up = G.input.down = false; G.input.jx = G.input.jy = 0; });
    if (G.isTouch) document.body.classList.add('touch');
    joystick();
    $('btn-act').addEventListener('pointerdown', function (e) { e.preventDefault(); G.input.act = true; });
    $('btn-menu').addEventListener('click', function () { if (G.S && !G.ui.modal) G.ui.menu(); });
    $('btn-note').addEventListener('click', function () { if (G.S && !G.ui.modal) G.ui.notebook(); });
    $('btn-bag').addEventListener('click', function () { if (G.S && !G.ui.modal) G.ui.bag(); });
    $('world').addEventListener('click', function (e) { G.world.clickAt(e.clientX, e.clientY); });

    // màn hình tiêu đề: nhân vật mẫu đứng thở
    $('title-art').innerHTML = G.art.chibi(G.PLAYER_LOOK);
    $('btn-continue').hidden = !G.hasSave();
    $('btn-new').onclick = function () { G.start(null); };
    $('btn-continue').onclick = function () {
      var S = G.loadSave();
      if (S) G.start(S); else { G.ui.toast('Bản lưu hỏng hoặc khác phiên bản.'); $('btn-continue').hidden = true; }
    };
    requestAnimationFrame(loop);
  });
})();
