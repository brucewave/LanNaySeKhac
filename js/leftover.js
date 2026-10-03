// Đồ ăn thừa có ích: cho chó mèo bên đường ăn (được "lộc", nuôi được mèo), hoặc tự ăn trong Túi đồ để có hiệu ứng đến hết ngày.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var W = G.world;


  // Chó vàng ngồi (nét mực như nhân vật): gốc toạ độ ở chân, mặt quay sang trái. Dùng ở chợ và cảnh kết.
  G.art.dog = function (o) {
    o = o || {};
    var C = o.coat || '#C8964E', L = o.light || '#EAD6A8', D = o.dark || '#8A6232', INK = '#0F141B';
    var t = '<ellipse cx="2" cy="1" rx="28" ry="6" fill="' + INK + '" opacity=".35" stroke="none"/>';
    t += '<g class="dog-tail"><path d="M18,-10 q16,-4 16,-20 q0,-8 -6,-10 q2,10 -4,18 q-4,4 -8,4 z" fill="' + C + '"/><path d="M30,-38 q4,4 2,10" fill="none" stroke="' + L + '" stroke-width="2"/></g>';
    t += '<ellipse cx="10" cy="-11" rx="15" ry="12" fill="' + C + '"/><path d="M14,-4 q8,2 10,4 h-14 z" fill="' + L + '" stroke-width="2"/>';   // đùi sau + bàn chân sau
    t += '<path d="M-16,-2 q-4,-26 10,-34 q18,-6 22,12 q2,14 -6,24 z" fill="' + C + '"/>';                                              // thân
    t += '<path d="M-12,-4 q-4,-20 6,-28 q6,8 4,28 z" fill="' + L + '" stroke="none"/>';                                                  // ngực trắng
    t += '<path d="M-14,-18 v16 M-5,-18 v16" stroke="' + D + '" stroke-width="7" stroke-linecap="round"/><path d="M-14,-18 v16 M-5,-18 v16" stroke="' + C + '" stroke-width="4" stroke-linecap="round"/>';
    t += '<ellipse cx="-15" cy="-1" rx="5" ry="3" fill="' + L + '" stroke-width="1.8"/><ellipse cx="-6" cy="-1" rx="5" ry="3" fill="' + L + '" stroke-width="1.8"/>';
    t += '<g class="dog-head">';
    t += '<path d="M-9,-50 L-3,-64 L3,-47 z" fill="' + D + '"/><path d="M-6,-51 L-3,-59 L0,-49 z" fill="#C88A7A" stroke="none"/>';         // tai dựng, gắn trên đỉnh đầu
    t += '<circle cx="-12" cy="-40" r="13" fill="' + C + '"/>';
    t += '<path d="M-20,-50 q-6,-4 -4,8 q4,-2 6,-6 z" fill="' + D + '"/>';                                                                // tai trước cụp
    t += '<ellipse cx="-24" cy="-35" rx="9" ry="6.5" fill="' + L + '"/><path d="M-28,-31 q4,4 8,0" fill="none" stroke-width="1.6"/>';    // mõm
    t += '<ellipse cx="-31" cy="-37" rx="3.2" ry="2.6" fill="' + INK + '" stroke="none"/><circle cx="-32" cy="-38" r=".9" fill="#fff" stroke="none"/>'; // mũi bóng
    t += '<circle cx="-15" cy="-43" r="2.4" fill="' + INK + '" stroke="none"/><circle cx="-15.8" cy="-43.8" r=".8" fill="#fff" stroke="none"/>';
    t += '<path d="M-19,-48 q3,-2 6,0" fill="none" stroke="' + D + '" stroke-width="1.6"/></g>';
    t += '<path d="M-20,-27 q8,5 16,-1" fill="none" stroke="#A32E36" stroke-width="4"/><circle cx="-12" cy="-24" r="2.6" fill="#E2C46A" stroke-width="1.2"/>'; // vòng cổ + chuông
    return '<g class="dog" stroke="' + INK + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">' + t + '</g>';
  };


  // Mèo ngồi (nét mực): gốc ở chân, mặt quay sang phải. o.coat màu lông, o.stripes vằn mướp, o.light ngực sáng.
  G.art.cat = function (o) {
    if (typeof o === 'string') o = { coat: o };
    o = o || {};
    var C = o.coat || '#6F7C88', D = o.dark || 'rgba(15,20,27,.35)', L = o.light, INK = '#0F141B';
    var t = '<ellipse cx="2" cy="1" rx="17" ry="4" fill="' + INK + '" opacity=".35" stroke="none"/>';
    t += '<g class="cat-tail"><path d="M-9,-3 q-12,0 -13,-10 q0,-8 6,-10 q-3,8 2,12 q4,3 6,2 z" fill="' + C + '"/></g>';
    t += '<path d="M-11,0 q-5,-17 5,-24 q12,-6 15,8 q3,9 -1,16 z" fill="' + C + '"/>';                                      // thân ngồi
    if (L) t += '<path d="M2,-2 q-2,-12 4,-17 q4,8 3,17 z" fill="' + L + '" stroke="none"/>';                                 // ngực sáng
    if (o.stripes) t += '<path d="M-8,-14 q4,-3 8,0 M-9,-8 q4,-3 9,0 M-4,-20 q3,-2 6,0" fill="none" stroke="' + D + '" stroke-width="2"/>';
    t += '<path d="M5,-11 v10 M10,-11 v10" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/><path d="M5,-11 v10 M10,-11 v10" stroke="' + C + '" stroke-width="2.6" stroke-linecap="round"/>';
    t += '<g class="cat-head"><path d="M1,-31 L2,-41 L8,-34 z M11,-34 L16,-41 L16,-30 z" fill="' + C + '"/><path d="M3,-33 L3.5,-38 L6.5,-34 z M12.5,-34 L15,-38 L15,-32 z" fill="#C88A90" stroke="none"/>';
    t += '<ellipse cx="9" cy="-27" rx="9" ry="8" fill="' + C + '"/>';
    if (o.stripes) t += '<path d="M6,-34 l1,4 M9,-35 v4 M12,-34 l-1,4" stroke="' + D + '" stroke-width="1.6"/>';
    t += '<ellipse cx="6" cy="-28" rx="2.2" ry="2.6" fill="#C9C060" stroke-width="1"/><ellipse cx="12.5" cy="-28" rx="2.2" ry="2.6" fill="#C9C060" stroke-width="1"/>';
    t += '<path d="M6,-30 v4 M12.5,-30 v4" stroke="' + INK + '" stroke-width="1.3"/><path d="M8.3,-24.5 l1,1 l1,-1 z" fill="#C88A90" stroke-width=".8"/>';
    t += '<path d="M3,-24 h-6 M3,-23 l-5,2 M15,-24 h6 M15,-23 l5,2" stroke="#D5DCE0" stroke-width=".8" opacity=".8"/></g>';
    return '<g class="cat" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' + t + '</g>';
  };

  // Mèo đang đi (nhìn ngang, mặt sang phải): thân ngang, đuôi dựng, bốn chân bước chéo (lg-a / lg-b đánh ngược nhau)
  G.art.catWalk = function (o) {
    o = o || {};
    var C = o.coat || '#6F7C88', D = o.dark || 'rgba(15,20,27,.35)', L = o.light, INK = '#0F141B';
    function leg(x, cls) { return '<g class="' + cls + '"><path d="M' + x + ',-9 v9" stroke="' + INK + '" stroke-width="4.6" stroke-linecap="round"/><path d="M' + x + ',-9 v9" stroke="' + C + '" stroke-width="2.4" stroke-linecap="round"/></g>'; }
    var t = '<ellipse cx="0" cy="1" rx="18" ry="3.5" fill="' + INK + '" opacity=".35" stroke="none"/>';
    t += leg(-6, 'lg-b') + leg(9, 'lg-a');                                                        // chân phía xa (tối hơn nhờ nằm sau thân)
    t += '<g class="cat-tail"><path d="M-14,-13 q-8,-4 -8,-14 q0,-6 4,-8 q-1,8 3,13 q3,4 4,5 z" fill="' + C + '"/></g>';
    t += '<path d="M-15,-12 q0,-8 10,-9 h12 q8,1 9,8 q-1,6 -9,7 h-14 q-8,0 -8,-6 z" fill="' + C + '"/>';     // thân ngang
    if (L) t += '<path d="M2,-7 q6,1 12,-1 q-2,4 -12,4 z" fill="' + L + '" stroke="none"/>';
    if (o.stripes) t += '<path d="M-8,-20 l2,6 M-2,-21 l1,6 M4,-21 l0,6" stroke="' + D + '" stroke-width="2"/>';
    t += leg(-9, 'lg-a') + leg(6, 'lg-b');                                                        // chân phía gần
    t += '<g class="cat-head"><path d="M12,-24 L13,-33 L18,-27 z M20,-27 L25,-33 L25,-23 z" fill="' + C + '"/><path d="M13.6,-26 L14,-30.5 L16.6,-27 z M21.5,-27 L24,-30.5 L24,-25 z" fill="#C88A90" stroke="none"/>';
    t += '<ellipse cx="19" cy="-20" rx="8" ry="7" fill="' + C + '"/>';
    if (o.stripes) t += '<path d="M17,-27 v3 M20,-27.5 v3" stroke="' + D + '" stroke-width="1.5"/>';
    t += '<ellipse cx="17" cy="-21" rx="1.9" ry="2.3" fill="#C9C060" stroke-width="1"/><ellipse cx="22.5" cy="-21" rx="1.9" ry="2.3" fill="#C9C060" stroke-width="1"/>';
    t += '<path d="M17,-23 v3.4 M22.5,-23 v3.4" stroke="' + INK + '" stroke-width="1.2"/><path d="M25,-18.5 l1.5,1 l-1.5,1 z" fill="#C88A90" stroke-width=".8"/>';
    t += '<path d="M25,-17 h6 M25,-16 l5,2" stroke="#D5DCE0" stroke-width=".8" opacity=".8"/></g>';
    return '<g class="cat walking" stroke="' + INK + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' + t + '</g>';
  };


  // Chó vàng đang đi (nhìn ngang, mặt quay sang phải): chân trong nhóm lg-a / lg-b để CSS đánh nhịp chéo.
  G.art.dogWalk = function (o) {
    o = o || {};
    var C = o.coat || '#C8964E', L = o.light || '#EAD6A8', D = o.dark || '#8A6232', INK = '#0F141B';
    function leg(x, cls, col) { return '<g class="' + cls + '"><path d="M' + x + ',-14 v13" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/><path d="M' + x + ',-14 v13" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/><ellipse cx="' + (x + 1.5) + '" cy="0" rx="4" ry="2.4" fill="' + L + '" stroke-width="1.5"/></g>'; }
    var t = '<ellipse cx="0" cy="1" rx="26" ry="4.5" fill="' + INK + '" opacity=".35" stroke="none"/>';
    t += leg(-10, 'lg-b', D) + leg(12, 'lg-a', D);                                                   // chân phía xa
    t += '<g class="dog-tail"><path d="M-20,-22 q-10,-6 -10,-18 q0,-5 4,-6 q0,10 6,15 q4,3 4,5 z" fill="' + C + '"/></g>';
    t += '<path d="M-22,-20 q0,-11 12,-12 h20 q10,1 11,10 q-1,9 -11,10 h-22 q-10,0 -10,-8 z" fill="' + C + '"/>'; // thân ngang
    t += '<path d="M4,-12 q8,2 16,-2 q-2,5 -16,6 z" fill="' + L + '" stroke="none"/>';                      // bụng sáng
    t += leg(-14, 'lg-a', C) + leg(8, 'lg-b', C);                                                     // chân phía gần
    t += '<path d="M14,-29 q6,5 12,0" fill="none" stroke="#A32E36" stroke-width="4"/><circle cx="20" cy="-25" r="2.4" fill="#E2C46A" stroke-width="1.1"/>'; // vòng cổ + chuông
    t += '<g class="dog-head">';
    t += '<path d="M16,-44 l3,-11 l6,10 z" fill="' + D + '"/><path d="M18,-46 l1.5,-6 l3,5 z" fill="#C88A7A" stroke="none"/>'; // tai dựng
    t += '<circle cx="22" cy="-36" r="10" fill="' + C + '"/>';
    t += '<path d="M26,-45 q7,-2 5,8 q-4,-2 -6,-5 z" fill="' + D + '"/>';                               // tai cụp
    t += '<ellipse cx="32" cy="-32" rx="7.5" ry="5.5" fill="' + L + '"/><path d="M29,-28 q4,3 7,0" fill="none" stroke-width="1.4"/>'; // mõm
    t += '<ellipse cx="38.5" cy="-34" rx="2.8" ry="2.3" fill="' + INK + '" stroke="none"/><circle cx="39.2" cy="-34.8" r=".8" fill="#fff" stroke="none"/>';
    t += '<circle cx="24" cy="-39" r="2.1" fill="' + INK + '" stroke="none"/><circle cx="24.7" cy="-39.7" r=".7" fill="#fff" stroke="none"/>';
    t += '<path d="M32,-27 q1,5 3,5 q2,0 1,-5" fill="#D97A80" stroke-width="1.2"/></g>';                 // lưỡi thè
    return '<g class="dog walking" stroke="' + INK + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' + t + '</g>';
  };

  // ---------- chó mèo bên đường (mèo vẽ sẵn ở decor.js, thêm chó vàng ở chợ) ----------
  var PETS = {
    nha: { id: 'meo_nha', x: 160, y: 556, hit: [136, 504, 50, 32], name: 'con mèo xám' },
    duong: { id: 'meo_duong', x: 360, y: 700, hit: [336, 696, 50, 30], name: 'con mèo mướp', gone: true }, // mèo mướp: con sẽ theo mình về
    ben_song: { id: 'meo_ben', x: 600, y: 570, hit: [576, 518, 50, 30], name: 'con mèo đen' },
    cho: { id: 'cho_vang', x: 760, y: 662, hit: [732, 610, 58, 36], name: 'con chó vàng', dog: true }
  };
  Object.keys(PETS).forEach(function (loc) {
    var p = PETS[loc];
    G.LOCATIONS[loc].things.push({ id: p.id, x: p.x, y: p.y, hit: p.hit, act: 'feed', pet: p.name,
      label: function (S) { return S.stock.banh_mi > 0 ? 'Cho ' + p.name + ' ăn' : 'Vuốt ' + p.name; },
      cond: function (S) { return !S.era && W.mode === 'walk' && !(p.gone && S.flags.cat_home) && !(p.dog && S.flags.dog_home); } });
  });
  // chó vàng nằm ở góc chợ
  var cho0 = G.scenes.cho;
  G.scenes.cho = function (Wd, Hh) {
    var sc = cho0(Wd, Hh);
    if (!(G.S && G.S.flags.dog_home && !G.S.era)) sc.props.push({ x: 700, y: 580, w: 100, h: 80, z: 640, svg: '<svg class="prop" viewBox="700 580 100 80" width="100" height="80" overflow="visible"><g transform="translate(760,640) scale(1.05)">' + G.art.dog() + '</g></svg>' });
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
    var isDog = t.id === 'cho_vang';
    if (S.stock.banh_mi <= 0) { G.ui.toast('Anh vuốt ' + t.pet + '. Nó ' + (isDog ? 'vẫy đuôi rối rít' : 'kêu meo một tiếng') + '. (Có bánh mì thừa thì cho nó ăn.)'); return; }
    S.stock.banh_mi--;
    if (isDog) S.kindDog = (S.kindDog || 0) + 1; else S.kind = (S.kind || 0) + 1;
    if (G.audio && G.audio.sfx) G.audio.sfx('coin');
    var msg = 'Anh bẻ nửa ổ bánh mì cho ' + t.pet + '.';
    if (!S.daily.lucky) { S.daily.lucky = true; msg += ' Nó dụi vào chân anh. **Hôm nay chắc đắt hàng** (tiền boa ×1,5).'; }
    G.ui.toast(msg, 4200);
    if (isDog && S.kindDog >= 5 && !S.flags.dog_home) {
      S.flags.dog_home = true;
      setTimeout(function () { G.ui.dialog([{ text: 'Con chó vàng ở chợ đứng dậy, ngoe nguẩy đuôi rồi lon ton đi theo anh.' }, { who: 'Tôi', text: 'Mày cũng muốn theo à? Được, có mày sủa thì đêm đỡ sợ.' }, { text: '(Chó **đi theo anh** khắp xóm. Lúc bị đuổi, nó sủa làm **kẻ đuổi chậm lại**. Về năm 1996 thì nó ở lại.)' }]); if (G.world.enter) G.world.enter(G.S.loc, G.S.x, G.S.y); }, 600);
    }
    if (!isDog && S.kind >= 5 && !S.flags.cat_home) {
      S.flags.cat_home = true;
      setTimeout(function () { G.ui.dialog([{ text: 'Từ hôm nay có một con mèo cứ lẽo đẽo theo anh về tận nhà.' }, { who: 'Tôi', text: 'Thôi được. Theo thì theo, nhưng canh xe hàng giúp tao.' }, { text: '(Mèo **đi theo anh** khắp xóm, lúc bày sạp thì ngồi canh xe: **khách chịu chờ lâu hơn**. Về năm 1996 thì nó ở lại.)' }]); }, 600);
    }
    if (G.world.refreshCart) G.world.refreshCart();
    G.ui.hud();
  };


  // ---------- chó mèo đã thuần phục: đi theo người (năm 1996 thì ở lại) ----------
  var CAT_LOOK = { coat: '#857761', stripes: true, light: '#D8C8A8' };
  var PET_DEF = {
    cat: { flag: 'cat_home', gap: 34, dy: 6, scale: 0.8,
      sit: function () { return '<svg class="pet-sit" viewBox="-30 -50 60 56" width="60" height="56" style="position:absolute;left:-30px;top:-50px" overflow="visible">' + G.art.cat(CAT_LOOK) + '</svg>'; },
      walk: function () { return '<svg class="pet-walk" viewBox="-34 -50 70 56" width="70" height="56" style="position:absolute;left:-34px;top:-50px" overflow="visible">' + G.art.catWalk(CAT_LOOK) + '</svg>'; } },
    dog: { flag: 'dog_home', gap: 62, dy: -4, scale: 0.72,
      sit: function () { return '<svg class="pet-sit" viewBox="-40 -66 80 72" width="80" height="72" style="position:absolute;left:-40px;top:-66px" overflow="visible"><g transform="scale(-1,1)">' + G.art.dog() + '</g></svg>'; }, // chó ngồi vẽ quay trái: lật cho quay phải như mèo
      walk: function () { return '<svg class="pet-walk" viewBox="-40 -60 84 66" width="84" height="66" style="position:absolute;left:-40px;top:-60px" overflow="visible">' + G.art.dogWalk() + '</svg>'; } }
  };
  var pets = {};
  function petEnter() {
    Object.keys(pets).forEach(function (k) { pets[k].el.remove(); });
    pets = {};
    var S = G.S; if (!S || S.era) return;
    Object.keys(PET_DEF).forEach(function (k) {
      var D = PET_DEF[k]; if (!S.flags[D.flag]) return;
      var el = document.createElement('div'); el.className = 'ent pet pet-' + k;
      el.innerHTML = '<div class="fl">' + D.sit() + D.walk() + '</div>'; // dáng ngồi / dáng đi
      $('ents').appendChild(el);
      var p = { el: el, fl: el.firstChild, def: D, x: S.x - (S.flip || 1) * D.gap, y: S.y + D.dy, flip: S.flip || 1, scale: D.scale };
      pets[k] = p; W.place(p, p.x, p.y, null, p.flip);
    });
  }
  function petTick(dt) {
    var S = G.S; if (!S) return;
    Object.keys(pets).forEach(function (k) {
      var p = pets[k], D = p.def;
      var tx = S.x - (S.flip || 1) * D.gap, ty = S.y + D.dy, dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
      var moving = d > 8;
      if (d > 260) { p.x = tx; p.y = ty; }
      else if (moving) { var st = Math.min(d * 4, 340) * dt; p.x += dx / d * st; p.y += dy / d * st; if (Math.abs(dx) > 3) p.flip = dx > 0 ? 1 : -1; }
      p.el.classList.toggle('walk', moving);
      W.place(p, p.x, p.y, null, p.flip);
    });
  }
  function petMissing() {
    var S = G.S; if (!S || S.era) return false;
    return Object.keys(PET_DEF).some(function (k) { return S.flags[PET_DEF[k].flag] && !pets[k]; });
  }
  var petEnter0 = G.onEnter;
  G.onEnter = function (id) { if (petEnter0) petEnter0(id); petEnter(); };
  var petTick0 = G.tick;
  G.tick = function (dt) { if (petTick0) petTick0(dt); if (petMissing()) petEnter(); petTick(dt); };

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
