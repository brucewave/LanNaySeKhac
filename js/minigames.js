// 5 trò mở khoá chen vào chỗ hành động (không chỉ suy luận): ổ khoá số, đánh chiêng theo nhịp, canh lực chém, ghép trang thư, bẩy thanh sắt.
// Chạy trước đoạn thoại tương ứng (G.TEXT[key]); thắng mới đi tiếp. Thua nhiều lần thì có nút bỏ qua.
var G = window.G || (window.G = {});
G.mini = { auto: false };

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var panel = document.createElement('div');
  panel.id = 'mini'; panel.className = 'panel big'; panel.hidden = true;
  $('stage').appendChild(panel);
  var raf = null, keyFn = null, fails = 0;

  function sfx(n) { if (G.audio && G.audio.sfx) G.audio.sfx(n); }
  function easy() { return !G.S || G.S.mode !== 'detective'; }
  function open(title, sub, body, cancel) {
    panel.innerHTML = '<h2>' + title + '</h2><p class="sub">' + sub + '</p><div class="mini-body">' + body + '</div>' +
      '<div class="mini-foot"><span class="mini-msg"></span>' + (cancel ? '<button data-x="cancel">Để sau</button>' : '') + '<button data-x="skip" hidden>Bỏ qua</button></div>';
    panel.hidden = false; G.ui.modal = 'mini';
  }
  function msg(t, bad) { var m = panel.querySelector('.mini-msg'); if (m) { m.textContent = t; m.classList.toggle('bad', !!bad); } }
  function fail(t) {
    fails++; msg(t, true); sfx('wrong');
    if (fails >= (easy() ? 2 : 4)) { var s = panel.querySelector('[data-x="skip"]'); if (s) s.hidden = false; }
  }
  function close() { if (raf) cancelAnimationFrame(raf); raf = null; keyFn = null; panel.hidden = true; panel.innerHTML = ''; if (G.ui.modal === 'mini') G.ui.modal = null; }
  window.addEventListener('keydown', function (e) { if (keyFn && !panel.hidden && (e.code === 'Space' || e.code === 'Enter')) { e.preventDefault(); e.stopPropagation(); keyFn(); } }, true);

  // ---------- 1. Ổ khoá số ----------
  function lock(win, cancel) {
    var code = '1508', cur = [0, 0, 0, 0];
    open('Ổ khoá số trên hộp thiếc', 'Bốn vòng số. Vy hay lấy một ngày quan trọng làm mã.',
      '<div class="dials">' + cur.map(function (v, i) { return '<div class="dial"><button data-d="' + i + '" data-v="1">▲</button><b data-n="' + i + '">0</b><button data-d="' + i + '" data-v="-1">▼</button></div>'; }).join('') +
      '</div><button class="primary" data-x="try">Mở thử</button>', !!G.mini._test); // trong truyện bắt buộc giải; chơi thử thì thoát được
    panel.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.d !== undefined) { var i = +b.dataset.d; cur[i] = (cur[i] + +b.dataset.v + 10) % 10; panel.querySelector('[data-n="' + i + '"]').textContent = cur[i]; sfx('click'); }
      else if (b.dataset.x === 'try') { if (cur.join('') === code) { win(); } else fail('Khoá không nhúc nhích.'); }
      else if (b.dataset.x === 'skip') win();
      else if (b.dataset.x === 'cancel') cancel();
    };
  }

  // ---------- 2. Đánh chiêng theo nhịp: bấm khi vòng sáng trùng vành chiêng, 3 lần liền ----------
  function gong(win, cancel) {
    open('Đánh chiêng', 'Bấm (hoặc Space) đúng lúc vòng sáng khít vành chiêng. Cần 3 nhịp liền.',
      '<svg class="gong-svg" viewBox="0 0 300 220"><circle cx="150" cy="110" r="60" fill="#9C7A3C" stroke="#0F141B" stroke-width="5"/><circle cx="150" cy="110" r="22" fill="#C8B080" stroke="#0F141B" stroke-width="3"/>' +
      '<circle class="gring" cx="150" cy="110" r="120" fill="none" stroke="#E2C46A" stroke-width="5"/></svg><div class="beats"><i></i><i></i><i></i></div><button class="primary" data-x="hit">ĐÁNH</button>', true);
    var r = 120, hits = 0, ring = panel.querySelector('.gring');
    function frame() { r -= 1.6; if (r < 30) r = 120; ring.setAttribute('r', r); raf = requestAnimationFrame(frame); }
    raf = requestAnimationFrame(frame);
    function hit() {
      if (Math.abs(r - 62) < 9) { hits++; sfx('gong'); panel.querySelectorAll('.beats i')[hits - 1].classList.add('on'); r = 120; if (hits >= 3) win(); }
      else { hits = 0; panel.querySelectorAll('.beats i').forEach(function (i) { i.classList.remove('on'); }); r = 120; fail('Lệch nhịp. Đánh lại từ đầu.'); }
    }
    keyFn = hit;
    panel.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.x === 'hit') hit(); else if (b.dataset.x === 'cancel') cancel(); else if (b.dataset.x === 'skip') win(); };
  }

  // ---------- 3. Canh lực chém: kim chạy qua lại, bấm khi kim nằm trong vùng đỏ, 3 nhát ----------
  function chop(win, cancel) {
    open('Chém then nắp hầm', 'Bấm (hoặc Space) khi kim nằm trong vùng đỏ. Ba nhát trúng là then gãy.',
      '<div class="meter"><span class="zone"></span><span class="needle"></span></div><div class="beats"><i></i><i></i><i></i></div><button class="primary" data-x="hit">CHÉM</button>', true);
    var x = 0, dir = 1, hits = 0, zone = 38 + Math.random() * 40, nd = panel.querySelector('.needle');
    panel.querySelector('.zone').style.left = zone + '%';
    function frame() { x += dir * (1.3 + hits * 0.35); if (x > 100 || x < 0) dir = -dir; nd.style.left = x + '%'; raf = requestAnimationFrame(frame); }
    raf = requestAnimationFrame(frame);
    function hit() {
      if (x >= zone && x <= zone + 14) {
        hits++; sfx('chop'); panel.querySelectorAll('.beats i')[hits - 1].classList.add('on');
        zone = 10 + Math.random() * 76; panel.querySelector('.zone').style.left = zone + '%';
        if (hits >= 3) win();
      } else fail('Trượt. Lưỡi rìu bật ra.');
    }
    keyFn = hit;
    panel.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.x === 'hit') hit(); else if (b.dataset.x === 'cancel') cancel(); else if (b.dataset.x === 'skip') win(); };
  }

  // ---------- 4. Ghép trang thư: bấm hai mảnh để đổi chỗ, xếp đúng thứ tự ----------
  function pages(win, cancel) {
    var right = ['Mùng 9/8/1996.', 'Em đã tới.', 'Mẹ bị nghi rồi.', 'Người đeo mặt nạ trong ảnh…', '…em phải tìm ra trước rằm.'];
    var cur = right.map(function (t, i) { return i; });
    do { cur.sort(function () { return Math.random() - 0.5; }); } while (cur.every(function (v, i) { return v === i; }));
    var pick = null;
    open('Mấy mảnh giấy kẹt trong kẽ xà', 'Trang nhật ký của Vy bị xé vụn. Bấm hai mảnh để đổi chỗ, xếp lại cho đúng.', '<div class="strips"></div>', true);
    function draw() {
      panel.querySelector('.strips').innerHTML = cur.map(function (v, i) { return '<button class="strip' + (pick === i ? ' sel' : '') + '" data-i="' + i + '" style="--r:' + ((v * 7) % 5 - 2) + 'deg">' + right[v] + '</button>'; }).join('');
    }
    draw();
    panel.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.i !== undefined) {
        var i = +b.dataset.i;
        if (pick === null) pick = i;
        else { var t = cur[pick]; cur[pick] = cur[i]; cur[i] = t; pick = null; sfx('page'); }
        draw();
        if (cur.every(function (v, k) { return v === k; })) setTimeout(win, 350);
      } else if (b.dataset.x === 'cancel') cancel(); else if (b.dataset.x === 'skip') win();
    };
  }

  // ---------- 5. Bẩy thanh sắt: bấm liên tục cho thanh lực đầy trước khi tụt ----------
  function lever(win, cancel) {
    open('Bẩy khối xi măng', 'Bấm liên tục (hoặc gõ Space) để dồn lực. Thanh lực tụt dần nếu dừng tay.',
      '<div class="force"><i></i></div><button class="primary big-btn" data-x="hit">BẨY!</button>', true);
    var p = 0, bar = panel.querySelector('.force i'), done = false;
    function frame() { p = Math.max(0, p - 0.2); bar.style.width = p + '%'; raf = requestAnimationFrame(frame); } // tụt chậm hơn
    raf = requestAnimationFrame(frame);
    function hit() { if (done) return; p += 10; sfx('creak'); if (p >= 100) { done = true; win(); } }
    keyFn = hit;
    panel.onclick = function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.x === 'hit') hit(); else if (b.dataset.x === 'cancel') cancel(); else if (b.dataset.x === 'skip') win(); };
  }

  var GAMES = { lock: lock, gong: gong, chop: chop, pages: pages, lever: lever };
  G.mini.LIST = [['lock', 'Ổ khoá số (hộp thiếc)'], ['gong', 'Đánh chiêng theo nhịp'], ['chop', 'Canh lực chém then'], ['pages', 'Ghép trang nhật ký'], ['lever', 'Bẩy khối xi măng']];
  // chơi thử (từ menu): không ghi là đã giải, không ảnh hưởng cốt truyện
  G.mini.test = function (id, then) { G.mini.play(id, function () { G.ui.toast('Thắng minigame!'); if (then) then(); }, function () { if (then) then(); }, true); };
  G.mini.play = function (id, onWin, onCancel, test) {
    fails = 0;
    var finished = false;
    function win() { if (finished) return; finished = true; close(); sfx('match'); if (!test) G.S.flags['mini_' + id] = true; onWin(); }
    function cancel() { if (finished) return; finished = true; close(); if (onCancel) onCancel(); }
    if (!test && (G.mini.auto || G.S.flags['mini_' + id])) { onWin(); return; } // bot chơi thử, hoặc đã giải rồi
    G.mini._test = !!test;
    GAMES[id](win, cancel);
  };
  var close0 = G.ui.close;
  G.ui.close = function (id) { if (id === 'mini') { var c = panel.querySelector('[data-x="cancel"]'); if (c) c.click(); return; } return close0.apply(this, arguments); };

  // ---------- móc vào thoại ----------
  var MINI_BY_TEXT = { open_box: 'lock', gong: 'gong', chop: 'chop', vy_pages: 'pages', lever: 'lever' };
  var dialog0 = G.ui.dialog;
  G.ui.dialog = function (lines, onEnd) {
    var self = this, args = arguments;
    for (var k in MINI_BY_TEXT) if (G.TEXT[k] && G.TEXT[k] === lines) {
      G.mini.play(MINI_BY_TEXT[k], function () { dialog0.apply(self, args); }, function () { G.ui.toast('Để lúc khác thử lại.'); });
      return;
    }
    return dialog0.apply(this, arguments);
  };
})();
