// Giao diện HTML phủ trên sân khấu: HUD, hội thoại, bảng nhập hàng, nghỉ, menu, thông báo.
var G = window.G || (window.G = {});
G.ui = {};

(function () {
  var $ = function (id) { return document.getElementById(id); };
  G.$ = $;

  // Có panel đang mở thì đồng hồ dừng và nhân vật không đi được
  G.ui.modal = null;
  G.ui.isBusy = function () { return !!G.ui.modal; };

  function openPanel(id, html) {
    var p = $(id);
    if (html !== undefined) p.innerHTML = html;
    p.hidden = false;
    G.ui.modal = id;
  }
  function closePanel(id) {
    $(id).hidden = true;
    if (G.ui.modal === id) G.ui.modal = null;
  }
  G.ui.close = closePanel;

  // Định dạng chữ: **chữ** = vàng đậm (nơi chốn, giờ giấc, người cần nhớ), [[chữ]] = đỏ đậm (manh mối, điều đáng ngờ)
  G.ui.fmt = function (s) {
    return String(s).replace(/\[\[(.+?)\]\]/g, '<b class="clue">$1</b>').replace(/\*\*(.+?)\*\*/g, '<b class="hl">$1</b>');
  };

  G.ui.toast = function (msg, ms) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = G.ui.fmt(msg);
    $('toasts').appendChild(t);
    setTimeout(function () { t.classList.add('out'); }, ms || 2600);
    setTimeout(function () { t.remove(); }, (ms || 2600) + 400);
  };

  G.ui.hud = function () {
    var S = G.S;
    if (S.era) {
      $('hud-day').textContent = 'Năm 1996';
      $('hud-time').textContent = 'Đêm mùng ' + ((G.NIGHT_DAY || {})[S.pnight] || 8) + '/8 · ' + G.fmtTime(S.pmin % 1440);
    } else {
      $('hud-day').textContent = 'Ngày ' + S.day;
      $('hud-time').textContent = G.fmtTime(S.min) + ' · ' + G.slotOf(S.min).name;
    }
    $('hud-money').textContent = G.fmtMoney(S.money);
    $('hud-loc').textContent = G.LOCATIONS[S.loc].name;
    $('hud-cart').textContent = 'Xe: ' + G.stockTotal(S) + '/' + G.cartCap(S);
    $('hud-cart').hidden = !!S.era;
    var obj = null;
    for (var i = 0; i < G.OBJECTIVES.length; i++) {
      var o = G.OBJECTIVES[i];
      if ((o.era || null) !== (S.era || null) && o.id !== 'het') continue; // mục tiêu của đúng thời điểm đang đứng
      if (o.id === 'het' && S.era) continue;
      if (!o.done(S)) { obj = o; break; }
    }
    if (obj && obj.id !== S.flags.lastObj) {
      if (S.flags.lastObj) G.ui.toast('Xong mục tiêu. Mục tiêu mới!');
      S.flags.lastObj = obj.id;
    }
    $('objective').textContent = obj ? (typeof obj.text === 'function' ? obj.text(S) : obj.text) : '';
    var nn = G.ui.newClues ? G.ui.newClues() : 0;
    $('note-badge').hidden = !nn; $('note-badge').textContent = nn;
  };

  // ---------- Hội thoại ----------
  // lines: [{who, text}] ; onEnd gọi sau dòng cuối
  G.ui.dialog = function (lines, onEnd) {
    var i = 0, img = null;
    var box = $('dialog');
    function show() {
      var l = lines[i];
      if (l.img !== undefined) img = l.img; // tranh cận cảnh: giữ tới khi có dòng đổi tranh
      if (G.ui.closeup) G.ui.closeup(img);
      if (G.audio && G.audio.onLine) G.audio.onLine(l, lines, i);
      var ch = l.choices ? '<div class="choices">' + l.choices.map(function (c, k) {
        return '<button data-c="' + k + '">' + (k + 1) + '. ' + G.ui.fmt(c.text) + '</button>'; }).join('') + '</div>' : '';
      box.innerHTML = (l.who ? '<div class="who">' + l.who + '</div>' : '') + '<div class="txt">' + G.ui.fmt(l.text) + '</div>' + ch +
        (ch ? '' : '<div class="next">' + (i < lines.length - 1 ? 'Tiếp ▸' : 'Đóng ▸') + '</div>');
    }
    function choose(k) {
      var c = lines[i].choices[k];
      closePanel('dialog'); G.ui.advance = null; G.ui.choose = null; if (G.ui.closeup) G.ui.closeup(null);
      c.run(G.S);
      G.ui.hud();
    }
    box.onclick = function (e) {
      var b = e.target.closest('button[data-c]');
      if (b) { choose(+b.dataset.c); return; }
      if (!lines[i].choices) advance();
    };
    G.ui.choose = function (k) { if (lines[i] && lines[i].choices && lines[i].choices[k]) choose(k); };
    function advance() {
      if (lines[i].choices) return;
      i++;
      if (i >= lines.length) { closePanel('dialog'); G.ui.advance = null; if (G.ui.closeup) G.ui.closeup(null); if (onEnd) onEnd(); return; }
      show();
    }
    G.ui.advance = advance;
    openPanel('dialog');
    show();
  };

  // ---------- Nhập hàng + đồ nghề (cô Lan) ----------
  G.ui.shop = function () {
    var S = G.S;
    var cart = {};
    G.ITEM_ORDER.forEach(function (id) { cart[id] = 0; });

    function total() { var t = 0; for (var k in cart) t += cart[k] * G.ITEMS[k].cost; return t; }
    function count() { var t = 0; for (var k in cart) t += cart[k]; return t; }

    function render() {
      var room = G.cartCap(S) - G.stockTotal(S) - count();
      var h = '<h2>Sạp cô Lan</h2>' + (G.CLOSEUPS && G.CLOSEUPS.mon_an ? '<div class="shop-art">' + G.CLOSEUPS.mon_an() + '</div>' : '');
      h += '<p class="sub">Tiền: <b>' + G.fmtMoney(S.money) + '</b> · Chỗ trống trên xe: <b>' + room + '</b></p>';
      h += '<div class="rows">';
      G.ITEM_ORDER.forEach(function (id) {
        var it = G.ITEMS[id];
        h += '<div class="row">' + G.art.icon(id) +
          '<div class="info"><b>' + it.name + '</b><small>Nhập ' + it.cost + 'k · bán ' + it.price + 'k · đang có ' + S.stock[id] + '</small>' +
          '<small class="' + (it.perish ? 'warn' : '') + '">' + it.note + '</small></div>' +
          '<button data-a="-" data-id="' + id + '">−</button><span class="qty">' + cart[id] + '</span>' +
          '<button data-a="+" data-id="' + id + '">+</button><button data-a="5" data-id="' + id + '">+5</button></div>';
      });
      h += '</div>';
      h += '<div class="actions"><span>Tổng: <b>' + total() + 'k</b></span>' +
        '<button class="primary" data-a="buy"' + (count() ? '' : ' disabled') + '>Mua</button></div>';

      h += '<h3>Đồ nghề cho xe</h3><div class="rows">';
      for (var uid in G.UPGRADES) {
        var u = G.UPGRADES[uid], owned = !!S.upgrades[uid];
        h += '<div class="row"><div class="info"><b>' + u.name + '</b><small>' + u.desc + '</small></div>' +
          (owned ? '<span class="owned">Đã có</span>' :
            '<button data-a="up" data-id="' + uid + '"' + (S.money >= u.cost ? '' : ' disabled') + '>' + u.cost + 'k</button>') + '</div>';
      }
      h += '</div>';
      if (S.flags.need_tool && !S.items.bua && !S.items.duc) {
        h += '<div class="help"><p>Cô Lan: "Cần búa à? Cô có cái búa nhỏ, 10k."</p><button data-a="bua"' + (S.money >= 10 ? '' : ' disabled') + '>Mua búa nhỏ (10k)</button></div>';
      }
      // gói khởi động khi hết vốn
      var cheapest = Math.min.apply(null, G.ITEM_ORDER.map(function (id) { return G.ITEMS[id].cost; }));
      if (S.money < cheapest * 3 && G.stockTotal(S) === 0 && S.starterDay !== S.day) {
        h += '<div class="help"><p>Cô Lan: "Hết vốn hả con? Cầm tạm 8 ly trà đá bán đi, mai trả cô cũng được."</p>' +
          '<button class="primary" data-a="starter">Nhận gói hàng khởi động</button></div>';
      }
      h += '<button class="close" data-a="close">Đóng</button>';
      $('shop').innerHTML = h;
    }

    $('shop').onclick = function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled) return;
      var a = b.dataset.a, id = b.dataset.id;
      var room = G.cartCap(S) - G.stockTotal(S) - count();
      if (a === '+' || a === '5') {
        var want = a === '5' ? 5 : 1;
        var afford = Math.floor((S.money - total()) / G.ITEMS[id].cost);
        var n = Math.min(want, room, afford);
        if (n <= 0) G.ui.toast(room <= 0 ? 'Xe đầy rồi.' : 'Không đủ tiền.');
        else cart[id] += n;
      } else if (a === '-') {
        if (cart[id] > 0) cart[id]--;
      } else if (a === 'buy') {
        S.money -= total();
        for (var k in cart) { S.stock[k] += cart[k]; cart[k] = 0; }
        G.ui.toast('Đã chất hàng lên xe.');
        G.world.refreshCart();
      } else if (a === 'up') {
        var u = G.UPGRADES[id];
        if (S.money >= u.cost) {
          S.money -= u.cost; S.upgrades[id] = true;
          G.ui.toast('Đã lắp ' + u.name + ' lên xe.');
          G.world.refreshCart();
        }
      } else if (a === 'bua') {
        if (S.money >= 10) { S.money -= 10; S.items.bua = true; G.ui.toast('Đã mua: **Búa nhỏ**'); }
      } else if (a === 'starter') {
        S.stock.tra_da += 8; S.starterDay = S.day;
        G.ui.toast('Nhận 8 ly trà đá.');
        G.world.refreshCart();
      } else if (a === 'close') {
        closePanel('shop');
        return;
      }
      render();
      G.ui.hud();
    };
    openPanel('shop');
    render();
  };

  // ---------- Nghỉ / chờ ở nhà ----------
  G.ui.rest = function () {
    var S = G.S;
    var h = '<h2>Nhà cũ</h2><p class="sub">Bây giờ ' + G.fmtTime(S.min) + '. Thời gian ngoài trời chỉ trôi khi anh không mở bảng.</p><div class="list">';
    G.SLOTS.forEach(function (s) {
      if (s.from > S.min) h += '<button data-to="' + s.from + '">Chờ tới ' + s.name.toLowerCase() + ' (' + G.fmtTime(s.from) + ')</button>';
    });
    h += '<button class="primary" data-to="sleep">Ngủ sang ngày mới</button><button data-to="">Thôi</button></div>';
    openPanel('rest', h);
    $('rest').onclick = function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      closePanel('rest');
      var to = b.dataset.to;
      if (to === 'sleep') G.world.endDay('Anh tắt đèn, nằm nghe tiếng sông.');
      else if (to) { S.min = +to; G.ui.toast('Đã tới ' + G.fmtTime(S.min) + '.'); G.ui.hud(); }
    };
  };

  // ---------- Tóm tắt phiên bán ----------
  G.ui.summary = function (r, onClose) {
    var h = '<h2>Đóng sạp</h2><div class="list stats">' +
      '<div>Phục vụ đúng: <b>' + r.served + '</b> khách</div>' +
      '<div>Món đã bán: <b>' + r.items + '</b></div>' +
      '<div>Doanh thu: <b>' + r.earned + 'k</b> (tiền boa ' + r.tips + 'k)</div>' +
      '<div>Khách bỏ đi: <b>' + r.missed + '</b>' + (r.asked.length ? ' · Khách hỏi món không có: ' + r.asked.join(', ') : '') + '</div>' +
      '</div><button class="primary close">Tiếp tục</button>';
    openPanel('summary', h);
    $('summary').onclick = function (e) {
      if (!e.target.closest('button')) return;
      closePanel('summary');
      if (onClose) onClose();
    };
  };

  // ---------- Menu ----------
  G.ui.menu = function () {
    var h = '<h2>Tạm dừng</h2><div class="list">' +
      '<button data-m="resume" class="primary">Chơi tiếp</button>' +
      '<button data-m="save">Lưu game</button>' +
      '<button data-m="load"' + (G.hasSave() ? '' : ' disabled') + '>Tải bản lưu</button>' +
      '<button data-m="music">Nhạc nền: ' + (G.audio && G.audio.pref.music ? 'Bật' : 'Tắt') + '</button>' +
      '<button data-m="sfx">Tiếng động: ' + (G.audio && G.audio.pref.sfx ? 'Bật' : 'Tắt') + '</button>' +
      '<button data-m="help">Hướng dẫn</button>' +
      '<button data-m="new">Chơi lại từ đầu</button></div>';
    openPanel('menu', h);
    $('menu').onclick = function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled) return;
      var m = b.dataset.m;
      if (m === 'music' || m === 'sfx') {
        if (G.audio) { G.audio.init(); if (m === 'music') G.audio.setMusic(!G.audio.pref.music); else G.audio.setSfx(!G.audio.pref.sfx); }
        b.textContent = (m === 'music' ? 'Nhạc nền: ' : 'Tiếng động: ') + (G.audio.pref[m] ? 'Bật' : 'Tắt');
        return;
      }
      if (m === 'resume') closePanel('menu');
      else if (m === 'save') {
        if (G.world.mode === 'sell') { G.ui.toast('Đóng sạp rồi hãy lưu.'); return; }
        G.ui.toast(G.save() ? 'Đã lưu.' : 'Không lưu được (trình duyệt chặn bộ nhớ).');
      } else if (m === 'load') {
        var S = G.loadSave();
        if (!S) { G.ui.toast('Bản lưu hỏng hoặc khác phiên bản.'); return; }
        closePanel('menu'); G.start(S); G.ui.toast('Đã tải bản lưu.');
      } else if (m === 'help') { closePanel('menu'); G.ui.help(); }
      else if (m === 'new') {
        if (b.dataset.sure) { closePanel('menu'); G.start(null); }
        else { b.dataset.sure = 1; b.textContent = 'Bấm lần nữa để xác nhận'; }
      }
    };
  };

  // ---------- Túi đồ ----------
  G.ui.bag = function () {
    var S = G.S;
    var h = '<h2>Túi đồ</h2><p class="sub">Tiền: <b>' + G.fmtMoney(S.money) + '</b> · Xe: ' + G.stockTotal(S) + '/' + G.cartCap(S) + '</p>';
    h += '<h3>Hàng trên xe</h3><div class="rows">';
    G.ITEM_ORDER.forEach(function (id) {
      h += '<div class="row">' + G.art.icon(id) + '<div class="info"><b>' + G.ITEMS[id].name + ' × ' + S.stock[id] + '</b><small>' + G.ITEMS[id].note + '</small></div></div>';
    });
    h += '</div><h3>Đồ quan trọng</h3><div class="rows">';
    var keys = Object.keys(S.items).filter(function (k) { return S.items[k]; });
    h += keys.length ? keys.map(function (k) { return '<div class="row"><div class="info"><b>' + G.KEY_ITEMS[k].name + '</b><small>' + G.ui.fmt(G.KEY_ITEMS[k].desc) + '</small></div></div>'; }).join('')
      : '<div class="row"><small>Chưa có gì.</small></div>';
    h += '</div><h3>Người quen</h3><div class="rows">';
    var met = Object.keys(G.NPCS).filter(function (k) { return S.met[k]; });
    h += met.length ? met.map(function (k) {
      var r = Math.min(5, S.rel[k] || 0);
      return '<div class="row"><div class="info"><b>' + G.NPCS[k].name + '</b></div><span class="rel">' + '●'.repeat(r) + '<i>' + '●'.repeat(5 - r) + '</i></span></div>';
    }).join('') : '<div class="row"><small>Chưa quen ai.</small></div>';
    h += '</div><button class="close">Đóng</button>';
    openPanel('bag', h);
    $('bag').onclick = function (e) { if (e.target.closest('button')) closePanel('bag'); };
  };

  G.ui.help = function (onClose) {
    var h = '<h2>Cách chơi</h2><div class="list help-list">' +
      '<div>Bấm / chạm vào đâu thì đi tới đó; bấm vào người hay đồ vật để tương tác. Máy tính: WASD + E.</div>' +
      '<div>Nhập hàng ở chỗ cô Lan (chợ), ra ô nét đứt để bày sạp bán kiếm tiền.</div>' +
      '<div>Bản đồ góc trái mở dần theo nơi đã tới; có xe máy thì bấm ghim để đi nhanh.</div>' +
      '<div>Nghe ngóng, ghi vào Sổ, đối chiếu lời khai với vật chứng. Phần còn lại, tự tìm hiểu nhé.</div>' +
      '</div><button class="primary close">Đã hiểu</button>';
    openPanel('help', h);
    $('help').onclick = function (e) {
      if (!e.target.closest('button')) return;
      closePanel('help');
      if (onClose) onClose();
    };
  };
})();
