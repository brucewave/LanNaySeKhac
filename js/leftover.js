// Đồ ăn thừa có ích: cho chó mèo bên đường ăn (được "lộc", nuôi được mèo), hoặc tự ăn trong Túi đồ để có hiệu ứng đến hết ngày.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var W = G.world;

  // ---------- chó mèo bên đường (mèo vẽ sẵn ở decor.js, thêm chó vàng ở chợ) ----------
  var PETS = {
    nha: { id: 'meo_nha', x: 160, y: 556, hit: [136, 504, 50, 32], name: 'con mèo xám' },
    duong: { id: 'meo_duong', x: 360, y: 700, hit: [336, 696, 50, 30], name: 'con mèo mướp' },
    ben_song: { id: 'meo_ben', x: 600, y: 570, hit: [576, 518, 50, 30], name: 'con mèo đen' },
    cho: { id: 'cho_vang', x: 760, y: 662, hit: [732, 610, 58, 36], name: 'con chó vàng' }
  };
  Object.keys(PETS).forEach(function (loc) {
    var p = PETS[loc];
    G.LOCATIONS[loc].things.push({ id: p.id, x: p.x, y: p.y, hit: p.hit, act: 'feed', pet: p.name,
      label: function (S) { return S.stock.banh_mi > 0 ? 'Cho ' + p.name + ' ăn' : 'Vuốt ' + p.name; },
      cond: function (S) { return !S.era && W.mode === 'walk'; } });
  });
  // chó vàng nằm ở góc chợ
  var cho0 = G.scenes.cho;
  G.scenes.cho = function (Wd, Hh) {
    var sc = cho0(Wd, Hh);
    sc.props.push({ x: 720, y: 610, w: 80, h: 60, z: 640, svg: '<svg class="prop" viewBox="720 610 80 60" width="80" height="60" overflow="visible"><g stroke="#0F141B" stroke-width="2.5" stroke-linejoin="round">' +
      '<ellipse cx="760" cy="644" rx="26" ry="8" fill="#000" opacity=".3" stroke="none"/><ellipse cx="756" cy="636" rx="22" ry="10" fill="#B8904A"/>' +
      '<circle cx="778" cy="628" r="9" fill="#B8904A"/><path d="M772,622 l-3,-8 l6,4 M782,620 l4,-7 l1,8" fill="#8A6A34"/><circle cx="781" cy="627" r="1.5" fill="#0F141B" stroke="none"/>' +
      '<path d="M786,631 h4" stroke-width="2"/><path d="M734,634 q-10,-6 -8,-14" fill="none" stroke-width="3"/></g></svg>' });
    return sc;
  };
  // mèo theo về nhà: nằm cuộn tròn cạnh chỗ đỗ xe hàng
  var nha0 = G.scenes.nha;
  G.scenes.nha = function (Wd, Hh) {
    var sc = nha0(Wd, Hh), S = G.S;
    if (S && S.flags.cat_home) sc.props.push({ x: 740, y: 500, w: 50, h: 40, z: 530, svg: '<svg class="prop" viewBox="740 500 50 40" width="50" height="40" overflow="visible"><g stroke="#0F141B" stroke-width="2.5">' +
      '<ellipse cx="764" cy="524" rx="18" ry="9" fill="#857761"/><circle cx="778" cy="518" r="7" fill="#857761"/><path d="M774,513 l1,-6 l4,4 M780,512 l4,-5 l0,7" fill="#857761"/><path d="M748,526 q-4,-8 6,-10" fill="none" stroke-width="3"/>' +
      '<path d="M776,519 q2,1 4,0" fill="none" stroke-width="1.5"/></g></svg>' });
    return sc;
  };

  function heart(x, y) {
    var d = document.createElement('div');
    d.className = 'pet-heart'; d.textContent = '♥';
    d.style.transform = 'translate3d(' + x + 'px,' + (y - 40) + 'px,0)';
    $('ents').appendChild(d);
    setTimeout(function () { d.remove(); }, 1400);
  }
  G.acts = G.acts || {};
  G.acts.feed = function (t) {
    var S = G.S;
    heart(t.x, t.hit[1] + 6);
    if (S.stock.banh_mi <= 0) { G.ui.toast('Anh vuốt ' + t.pet + '. Nó kêu meo một tiếng. (Có bánh mì thừa thì cho nó ăn.)'); return; }
    S.stock.banh_mi--; S.kind = (S.kind || 0) + 1;
    if (G.audio && G.audio.sfx) G.audio.sfx('coin');
    var msg = 'Anh bẻ nửa ổ bánh mì cho ' + t.pet + '.';
    if (!S.daily.lucky) { S.daily.lucky = true; msg += ' Nó dụi vào chân anh. **Hôm nay chắc đắt hàng** (tiền boa ×1,5).'; }
    G.ui.toast(msg, 4200);
    if (S.kind >= 5 && !S.flags.cat_home) {
      S.flags.cat_home = true;
      setTimeout(function () { G.ui.dialog([{ text: 'Từ hôm nay có một con mèo cứ lẽo đẽo theo anh về tận nhà.' }, { who: 'Tôi', text: 'Thôi được. Ở lại thì nằm canh xe hàng giúp tao.' }, { text: '(Mèo nằm cạnh xe hàng: **khách chịu chờ lâu hơn** mỗi lần bày sạp.)' }]); }, 600);
    }
    if (G.world.refreshCart) G.world.refreshCart();
    G.ui.hud();
  };

  // ---------- hiệu ứng ----------
  G.patMul = function () { var S = G.S; return (S.daily.fresh ? 1.25 : 1) * (S.flags.cat_home ? 1.2 : 1); };
  G.tipAdj = function (tip) { var S = G.S; if (S.daily.lucky) tip = Math.round(tip * 1.5) + (tip ? 0 : 1); if (S.daily.sugar) tip += 1; return tip; };
  var speed0 = W.speed;
  W.speed = function () { var v = speed0.apply(this, arguments), S = G.S; return S && S.daily.full && !S.riding ? v * 1.15 : v; };

  // ---------- tự ăn trong Túi đồ ----------
  var EAT = {
    banh_mi: ['Ăn một ổ bánh mì', 'full', 'No bụng: đi nhanh hơn đến hết ngày.'],
    tra_da: ['Uống một ly trà đá', 'fresh', 'Mát người, tỉnh táo: khách chờ lâu hơn khi bán, đến hết ngày.'],
    nuoc_ngot: ['Uống một chai nước ngọt', 'sugar', 'Ngọt giọng mời khách: mỗi khách boa thêm 1k, đến hết ngày.']
  };
  var bag0 = G.ui.bag;
  G.ui.bag = function () {
    bag0.apply(this, arguments);
    var S = G.S, p = $('bag'); if (!S || !p) return;
    var on = [];
    if (S.daily.full) on.push('No bụng'); if (S.daily.fresh) on.push('Tỉnh táo'); if (S.daily.sugar) on.push('Ngọt giọng'); if (S.daily.lucky) on.push('Có lộc (boa ×1,5)'); if (S.flags.cat_home) on.push('Mèo canh xe');
    var h = '<h3>Ăn uống</h3><p class="sub">Đồ ăn thừa: tự dùng để có lợi trong ngày, hoặc đem cho chó mèo bên đường.' + (on.length ? ' Đang có: <b>' + on.join(', ') + '</b>.' : '') + '</p><div class="rows eat-rows">';
    Object.keys(EAT).forEach(function (id) {
      var e = EAT[id], n = S.stock[id] || 0, used = S.daily[e[1]];
      h += '<div class="row">' + G.art.icon(id) + '<div class="info"><b>' + e[0] + '</b><small>' + e[2] + '</small></div><button data-eat="' + id + '"' + (n > 0 && !used ? '' : ' disabled') + '>' + (used ? 'Đã dùng' : 'Dùng (' + n + ')') + '</button></div>';
    });
    h += '</div>';
    var close = p.querySelector('button.close');
    var box = document.createElement('div'); box.innerHTML = h;
    if (close) p.insertBefore(box, close); else p.appendChild(box);
  };
  // bắt nút "Dùng" trước khi bảng túi đóng
  $('bag').addEventListener('click', function (e) {
    var b = e.target.closest('[data-eat]'); if (!b || b.disabled) return;
    e.stopPropagation();
    var S = G.S, id = b.dataset.eat, ef = EAT[id];
    if (!(S.stock[id] > 0) || S.daily[ef[1]]) return;
    S.stock[id]--; S.daily[ef[1]] = true;
    if (G.audio && G.audio.sfx) G.audio.sfx('coin');
    G.ui.close('bag'); G.ui.toast(ef[0] + '. ' + ef[2], 4200);
    if (G.world.refreshCart) G.world.refreshCart();
    G.ui.hud();
  }, true);

  // ---------- nhắc khi sắp hết ngày còn đồ dễ hỏng ----------
  var tick0 = G.tick, acc = 0;
  G.tick = function (dt) {
    if (tick0) tick0(dt);
    acc += dt; if (acc < 1) return; acc = 0;
    var S = G.S;
    if (!S || S.era || S.daily.leftRemind || S.min < 19 * 60 + 30) return;
    var n = (S.stock.tra_da || 0) + (S.stock.banh_mi || 0);
    if (n > 0) { S.daily.leftRemind = true; G.ui.toast('Còn ' + n + ' món trà đá / bánh mì sẽ hỏng khi hết ngày. Cho chó mèo ăn hoặc mở **Túi** để tự dùng.', 5200); }
  };
})();
