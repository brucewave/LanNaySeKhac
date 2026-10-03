// Tiện ích chơi: nút ✕ trên các bảng, bản đồ nhỏ + đi nhanh, người bán ở chợ, việc phụ của Tùng và xe máy.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };

  // ======================= NÚT ✕ ĐÓNG BẢNG =======================
  // Bấm ✕ = bấm nút đóng sẵn có của bảng, nên mọi việc sau khi đóng vẫn chạy như cũ.
  var CLOSERS = '[data-a="close"], button.close, [data-to=""], [data-m="resume"]';
  ['shop', 'rest', 'menu', 'help', 'bag', 'notebook'].forEach(function (id) {
    var p = $(id);
    if (!p) return;
    function ensure() {
      if (p.querySelector('.xclose')) return;
      if (!p.querySelector(CLOSERS)) return;
      var x = document.createElement('button');
      x.className = 'xclose'; x.textContent = '✕'; x.setAttribute('aria-label', 'Đóng');
      x.onclick = function (e) {
        e.stopPropagation();
        var b = p.querySelector(CLOSERS);
        if (b) b.click();
      };
      p.insertBefore(x, p.firstChild);
    }
    new MutationObserver(ensure).observe(p, { childList: true });
  });

  // ======================= BẢN ĐỒ NHỎ + ĐI NHANH =======================
  // Bản đồ phố có ghim, góc trên trái. Nơi chưa tới thì bị sương che; có xe máy mới bấm ghim để đi nhanh.
  var CHAIN = ['ben_song', 'nha', 'duong', 'cho'];
  var PINS = { // chỗ ghim trên bản đồ (mũi ghim), biểu tượng
    ben_song: { x: 34, y: 84, icon: 'boat', name: 'Bến sông' },
    nha:      { x: 88, y: 62, icon: 'house', name: 'Nhà cũ' },
    duong:    { x: 146, y: 62, icon: 'tree', name: 'Đường xóm' },
    cho:      { x: 204, y: 62, icon: 'stall', name: 'Chợ' },
    dinh_nay: { x: 70, y: 138, icon: 'temple', name: 'Đình cũ' }
  };
  var ERA96 = { ben_96: 'ben_song', nha_96: 'nha', duong_96: 'duong', dinh_96: 'dinh_nay', ham_96: 'dinh_nay' };
  var ICON = {
    boat: '<path d="M-7,0 h14 l-3,5 h-8 z M0,0 v-8 l5,6 h-5" fill="none"/>',
    house: '<path d="M-7,1 l7,-7 l7,7 M-5,0 v6 h10 v-6 M-1,6 v-3 h2 v3" fill="none"/>',
    tree: '<circle cx="0" cy="-2" r="5" fill="none"/><path d="M0,3 v4" fill="none"/>',
    stall: '<path d="M-7,-2 h14 l-2,-4 h-10 z M-6,-2 v8 M6,-2 v8 M-6,3 h12" fill="none"/>',
    temple: '<path d="M-8,-1 q8,-8 16,0 M-6,-1 v7 h12 v-7 M-1,6 v-4 h2 v4" fill="none"/>'
  };
  var MW = 240, MH = 158;

  var mm = document.createElement('div');
  mm.id = 'minimap';
  $('stage').insertBefore(mm, $('dialog')); // nằm dưới các bảng
  var lastKey = '';

  function questAt(loc) { // có người/việc đang cần gặp ở nơi này không
    var S = G.S;
    for (var id in G.NPCS) {
      var d = G.NPCS[id];
      if (!d.quest) continue;
      var en = G.npc.entry(id, S.era ? S.pmin % 1440 : S.min);
      if (en && en.loc === loc && d.quest(S)) return true;
    }
    var L = G.LOCATIONS[loc];
    return !!(L && L.things.some(function (t) { return t.quest && (!t.cond || t.cond(S)) && t.quest(S); }));
  }
  function visited(S) { S.visited = S.visited || {}; S.visited[S.loc] = 1; return S.visited; }

  // nền bản đồ: khối nhà, đường, công viên, sông (vẽ một lần)
  var BASE = (function () {
    var t = '<rect width="' + MW + '" height="' + MH + '" fill="#1A2029"/>';
    [[6, 8, 40, 40], [52, 8, 70, 22], [128, 8, 50, 40], [184, 8, 50, 22], [52, 36, 70, 14], [184, 36, 50, 14],
     [6, 76, 18, 18], [44, 76, 70, 20], [122, 76, 50, 26], [178, 76, 56, 26]].forEach(function (b) {
      t += '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" rx="3" fill="#252D38"/>';
    });
    t += '<rect x="128" y="80" width="40" height="18" rx="3" fill="#2C3A33"/><rect x="10" y="12" width="30" height="20" rx="3" fill="#2C3A33"/>' +
      '<rect x="186" y="80" width="22" height="14" rx="3" fill="#2C3A33"/>';
    var road = ' fill="none" stroke="#3A4450" stroke-linecap="round"';
    t += '<path d="M48,4 V104 M124,4 V104 M180,4 V104 M2,52 H238 M2,32 H124" stroke-width="5"' + road + '/>';
    t += '<path d="M2,66 H238" stroke-width="9"' + road + '/><path d="M6,66 H234" stroke="#4B5560" stroke-width="1" stroke-dasharray="5 5"/>';
    t += '<path d="M-4,112 C40,104 80,122 130,116 S210,104 244,114" fill="none" stroke="#2F4F5C" stroke-width="14"/>' +
      '<path d="M10,111 c8,-2 14,0 20,0 M150,113 c8,-2 14,0 20,-1" fill="none" stroke="#4B6E7A" stroke-width="1.2"/>';
    t += '<path d="M34,84 L52,140" stroke="#8C949B" stroke-width="1.3" stroke-dasharray="3 3" fill="none"/>'; // đường đò
    t += '<rect x="30" y="126" width="80" height="28" rx="4" fill="#252D38"/><rect x="118" y="128" width="60" height="22" rx="4" fill="#2C3A33"/>';
    return t;
  })();

  function pin(p, cls, inner, label) {
    var x = p.x, y = p.y;
    return '<g class="' + cls + '"><path d="M' + x + ',' + y + ' c-3,-6 -11,-10 -11,-19 a11,11 0 1 1 22,0 c0,9 -8,13 -11,19 z" class="pin-body"/>' +
      '<circle cx="' + x + '" cy="' + (y - 19) + '" r="8" class="pin-face"/>' +
      '<g transform="translate(' + x + ',' + (y - 19) + ')" class="pin-icon">' + inner + '</g>' +
      (label ? '<text x="' + x + '" y="' + (y + 9) + '" text-anchor="middle" class="pin-label">' + label + '</text>' : '') + '</g>';
  }

  function render() {
    var S = G.S;
    if (!S) return;
    var vis = visited(S);
    var here = S.era ? ERA96[S.loc] : S.loc;
    var ids = Object.keys(PINS).filter(function (id) { return !(S.era && id === 'cho'); });
    var eraId = function (id) { if (!S.era) return id; for (var k in ERA96) if (ERA96[k] === id && vis[k]) return k; for (var k2 in ERA96) if (ERA96[k2] === id) return k2; return id; };
    var qs = ids.map(function (id) { return vis[eraId(id)] && questAt(eraId(id)) ? 1 : 0; }).join('');
    var key = S.loc + '|' + qs + '|' + Object.keys(vis).length + '|' + (S.flags.xe ? 1 : 0) + '|' + (S.riding ? 1 : 0);
    if (key === lastKey) return;
    lastKey = key;
    mm.classList.toggle('past', !!S.era);
    var s = '<div class="mm-head">Bản đồ' + (S.era ? ' · 1996' : '') + '<button class="mm-min" aria-label="Thu nhỏ bản đồ">−</button></div><svg viewBox="0 0 ' + MW + ' ' + MH + '" width="' + MW + '" height="' + MH + '">' + BASE;
    ids.forEach(function (id) {
      var p = PINS[id], v = !!vis[eraId(id)];
      if (!v) s += '<g class="fog"><ellipse cx="' + p.x + '" cy="' + (p.y - 12) + '" rx="30" ry="20"/><ellipse cx="' + (p.x - 16) + '" cy="' + (p.y - 4) + '" rx="18" ry="12"/><ellipse cx="' + (p.x + 16) + '" cy="' + (p.y - 2) + '" rx="18" ry="12"/></g>';
    });
    ids.forEach(function (id) {
      var p = PINS[id], eid = eraId(id), v = !!vis[eid], cur = id === here;
      var go = v && !cur && !S.era && S.flags.xe && CHAIN.indexOf(id) >= 0 && CHAIN.indexOf(here) >= 0;
      if (cur) s += '<circle cx="' + p.x + '" cy="' + p.y + '" r="5" class="pulse"/>';
      s += '<g class="mm-node' + (go ? ' go' : '') + '" data-loc="' + id + '">' +
        pin(p, 'pin' + (cur ? ' cur' : v ? '' : ' locked'), v ? ICON[p.icon] : '<text y="4" text-anchor="middle" class="q">?</text>', v ? (S.era && id === 'dinh_nay' ? 'Đình làng' : p.name) : '');
      if (v && !cur && questAt(eid)) s += '<circle cx="' + (p.x + 9) + '" cy="' + (p.y - 28) + '" r="5.5" fill="#E2C46A" stroke="#0F141B"/><text x="' + (p.x + 9) + '" y="' + (p.y - 24.5) + '" text-anchor="middle" font-size="8.5" font-weight="900" fill="#0F141B">!</text>';
      s += '</g>';
    });
    s += '</svg>';
    s += '<div class="mm-foot">' + (S.era ? 'Ký ức năm 1996' : S.flags.xe ? '🛵 Bấm ghim để chạy xe tới' : 'Đi tới nơi mới để mở bản đồ') + '</div>';
    mm.innerHTML = s;
  }
  G.ui.minimap = function () { lastKey = ''; render(); };

  function fade(fn) {
    var f = $('fade');
    if (!f) { fn(); return; }
    f.classList.add('on'); G.ui.modal = 'fade';
    setTimeout(function () { G.ui.modal = null; fn(); f.classList.remove('on'); }, 450);
  }

  G.travel = function (to) {
    var S = G.S, W = G.world;
    if (!S || S.era || G.ui.modal) return;
    var a = CHAIN.indexOf(S.loc), b = CHAIN.indexOf(to);
    if (to === S.loc) return;
    if (!visited(S)[to]) { G.ui.toast('Chưa tới đó lần nào.'); return; }
    if (!S.flags.xe) { G.ui.toast('Có xe máy mới đi nhanh được. Giờ cứ đi bộ theo đường nhé.'); return; }
    if (S.cartOut) { G.ui.toast('Đang đẩy xe hàng thì phải đi bộ. Cất xe đẩy ở nhà rồi mới chạy xe máy được.'); return; }
    if (b < 0) { G.ui.toast('Sang đình phải nhờ bác Tư chở đò.'); return; }
    if (a < 0) { G.ui.toast('Ở đây phải đi đò về bến trước đã.'); return; }
    if (W.mode !== 'walk') { G.ui.toast('Đang bày sạp. Dọn sạp rồi hãy đi.'); return; }
    if (G.danger && G.danger.active) return;
    var mins = Math.abs(b - a) * 4;
    if (S.min + mins >= G.DAY_END) { G.ui.toast('Muộn rồi, về nhà nghỉ thôi.'); if (to !== 'nha') return; }
    W.route = null; W.pending = null; W.exitAfter = null;
    fade(function () {
      S.min = Math.min(S.min + mins, G.DAY_END - 1);
      S.riding = true;
      var L = G.LOCATIONS[to];
      S.flip = b > a ? 1 : -1; S.view = 'side';
      W.enter(to, b > a ? 60 : L.width - 60, 600);
      G.ui.toast('Chạy xe tới ' + L.name + ' (' + mins + ' phút).');
    });
  };

  // Mặc định thu nhỏ cho đỡ che cảnh; bấm vào thì mở to, nút − để thu lại
  var big = false;
  try { big = localStorage.getItem('lnsk_map_big') === '1'; } catch (e) {}
  function setBig(v) {
    big = v;
    mm.classList.toggle('big', big);
    document.body.classList.toggle('mm-big', big);
    try { localStorage.setItem('lnsk_map_big', big ? '1' : '0'); } catch (e) {}
  }
  setBig(big);
  mm.addEventListener('click', function (e) {
    if (!big) { setBig(true); return; }
    if (e.target.closest('.mm-min')) { setBig(false); return; }
    var n = e.target.closest('.mm-node');
    if (n && n.classList.contains('go')) { setBig(false); G.travel(n.dataset.loc); }
    else if (n) G.travel(n.dataset.loc);
  });

  // ======================= NGƯỜI BÁN Ở CHỢ =======================
  var SELLERS = {
    ban_rau:    { name: 'Chị Hoa bán rau', x: 80, y: 212, look: { hair: 'long', hairColor: '#2B2622', shirt: '#58755C', pants: '#33363F', eyes: 'flat' },
                  lines: ['Rau sáng nay cắt ngoài bãi bồi, còn đẫm sương đây.', 'Bán ở chợ này mười mấy năm, mặt ai trong xóm chị cũng nhớ.', 'Mua bó rau muống không em? Chị bớt cho.'] },
    ban_qua:    { name: 'Cô Mai hoa quả', x: 280, y: 212, look: { hair: 'non_la', shirt: '#948C5E', pants: '#4B5560', eyes: 'tired', body: 'wide' },
                  lines: ['Chuối treo cho chín cây, không ủ thuốc đâu.', 'Rằm sắp tới, nhà nào cũng sắm mâm ngũ quả.', 'Hồi trước bến này đông lắm. Giờ người trẻ đi hết.'] },
    ban_ca:     { name: 'Anh Tâm bán cá', x: 484, y: 212, look: { hair: 'short', shirt: '#3F6670', pants: '#2A3550', eyes: 'narrow' },
                  lines: ['Cá dưới sông này nuôi cả xóm đấy.', 'Đêm qua lưới mắc toàn rác. Sông dạo này lạ lắm.', 'Mua cá thì sớm sớm, trưa là hết.'] },
    ban_thit:   { name: 'Chú Hải hàng thịt', x: 80, y: 362, look: { hair: 'short', hairColor: '#4A4F57', shirt: '#D5DCE0', pants: '#33363F', eyes: 'flat', body: 'wide' },
                  lines: ['Thịt mới mổ sáng nay. Đứng xa ra kẻo dính dao.', 'Xe trà đá của cậu đông khách đấy. Chiều chú ghé.', 'Chợ này ngày xưa còn có cả lò rèn.'] },
    ban_vangma: { name: 'Bà Sáu vàng mã', x: 484, y: 362, look: { hair: 'old', shirt: '#4B5560', pants: '#33363F', eyes: 'narrow' },
                  lines: ['Rằm tháng này đông lắm. Ai cũng sắm chút vàng mã gửi người đã khuất.', 'Nhà giấy này bà dán cả tuần. Đốt đi rồi mới tới tay người bên kia.', 'Cậu nhìn gì mà kỹ thế? Có ai cần gửi đồ xuống à?'] }
  };
  for (var sid in SELLERS) {
    var sd = SELLERS[sid];
    G.NPCS[sid] = { id: sid, name: sd.name, act: 'stall_talk', label: 'Hỏi chuyện', look: sd.look, vanish: true,
      cond: function (S) { return !S.era; },
      schedule: [{ t: '00:00', loc: 'cho', x: sd.x, y: sd.y, ay: 26, view: 'side' }, { t: '19:00', loc: null }] }; // đứng cạnh bàn sạp, quay vào hàng
    G.NPCS[sid].schedule.forEach(function (e) { e.from = G.parseTime(e.t); });
  }
  G.acts = G.acts || {};
  G.acts.stall_talk = function (t) {
    var sd = SELLERS[t.npc], S = G.S;
    S.flags['sl_' + t.npc] = ((S.flags['sl_' + t.npc] || 0) + 1) % sd.lines.length;
    G.ui.dialog([{ who: sd.name, text: sd.lines[S.flags['sl_' + t.npc]] }]);
  };

  // ======================= VIỆC PHỤ CỦA TÙNG: CON CUB CŨ =======================
  var GIVE = { bac_do: 'Bác Tư', bac_ba: 'Bác Ba', co_lan: 'Cô Lan' };
  function left(S) { return S.flags.xe_left || []; }
  var D = G.DIALOGUE.tung, idle = D.findIndex(function (e) { return e.id === 'tung_idle'; });
  D.splice(idle < 0 ? D.length : idle, 0,
    { id: 'xe_offer', once: true, cond: function (S) { return !S.era && !S.quests.xe && S.stats.sold >= 5; }, lines: [
      { who: 'Tùng', text: 'Ê, anh bán trà! Nhờ anh việc này. Em có **3 ly trà đá** khách đặt mà chạy đơn không kịp.' },
      { who: 'Tùng', text: 'Giao giúp em cho **bác Tư** ở bến, **bác Ba** thợ mộc với **cô Lan** ngoài chợ nhé.' },
      { who: 'Tùng', text: 'Xong em cho anh mượn hẳn **con Cub cũ**. Em mới đổi xe, để không cũng phí. Đi cho nhanh!' }
    ], after: function (S) { S.quests.xe = 'on'; S.flags.xe_left = Object.keys(GIVE); G.ui.toast('Việc phụ: giao 3 ly trà của Tùng'); } },
    { id: 'xe_done', once: true, cond: function (S) { return S.quests.xe === 'on' && !left(S).length; }, lines: [
      { who: 'Tùng', text: 'Giao hết rồi à? Nhanh thật. Đây, chìa khóa con Cub. Xăng em đổ đầy rồi.' },
      { who: 'Tùng', text: 'Bấm nút **🛵** (hoặc phím **M**) để lên xuống xe. Vào nhà thì dắt xe để ngoài nhé.' }
    ], after: function (S) { S.quests.xe = 'done'; S.flags.xe = true; G.ui.toast('Đã nhận: **Xe Cub cũ của Tùng**'); syncBike(); } },
    { id: 'xe_wait', cond: function (S) { return S.quests.xe === 'on'; }, lines: function (S) {
      return [{ who: 'Tùng', text: 'Còn ly của ' + left(S).map(function (k) { return '**' + GIVE[k] + '**'; }).join(', ') + ' nữa anh ơi.' }];
    } }
  );
  var talk0 = G.talk;
  G.talk = function (id) {
    var S = G.S, l = left(S);
    if (!S.era && S.quests.xe === 'on' && l.indexOf(id) >= 0) {
      S.flags.xe_left = l.filter(function (k) { return k !== id; });
      G.ui.dialog([{ who: 'Tôi', text: 'Trà đá Tùng gửi ạ.' }, { who: GIVE[id], text: 'À, thằng Tùng nhanh nhảu thật. Cảm ơn cháu.' }], function () {
        G.ui.toast(S.flags.xe_left.length ? 'Còn ' + S.flags.xe_left.length + ' ly nữa.' : 'Giao xong! Quay lại gặp Tùng.');
      });
      return;
    }
    return talk0.apply(this, arguments);
  };
  function wrapQuest(id, fn) {
    var q0 = G.NPCS[id].quest;
    G.NPCS[id].quest = function (S) { return (q0 ? q0(S) : false) || fn(S); };
  }
  wrapQuest('tung', function (S) { return !S.era && ((!S.quests.xe && S.stats.sold >= 5 && !!S.seen.tung_intro) || (S.quests.xe === 'on' && !left(S).length)); });
  Object.keys(GIVE).forEach(function (k) { wrapQuest(k, function (S) { return !S.era && S.quests.xe === 'on' && left(S).indexOf(k) >= 0; }); });

  // ======================= ĐI XE MÁY =======================
  var W = G.world;
  W.speed = function () { var S = G.S; return S && S.riding && W.mode === 'walk' ? 450 : (S && S.cartOut ? 205 : 250); }; // đẩy xe thì chậm hơn

  // Cub nhìn từ ba phía; nằm trong lớp .fl nên lật theo người chơi
  // Xe Cub cũ của Tùng (shipper): thân mận chín, yếm trắng, bánh nan hoa, lốc máy, pô xi, thùng giao hàng đỏ trên baga.
  // BIKE_B vẽ sau lưng người lái, BIKE_F vẽ trước (yếm che chân). Mỗi lớp có đủ 3 góc nhìn.
  var INK = ' stroke="#0F141B" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
  var THIN = ' stroke="#0F141B" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
  var BODY = '#5E2E48', BODY2 = '#4A2238', CHROME = '#B9C2C6', BOX = '#A32E36';
  function wheel(cx) { // lốp, vành xi, nan hoa, moay-ơ
    var t = '<circle cx="' + cx + '" cy="-22" r="24" fill="#1B222C"' + INK + '/><circle cx="' + cx + '" cy="-22" r="17" fill="none" stroke="' + CHROME + '" stroke-width="3"/>';
    for (var a = 0; a < 6; a++) { var an = a * Math.PI / 6; t += '<path d="M' + (cx - Math.cos(an) * 16).toFixed(1) + ',' + (-22 - Math.sin(an) * 16).toFixed(1) + ' L' + (cx + Math.cos(an) * 16).toFixed(1) + ',' + (-22 + Math.sin(an) * 16).toFixed(1) + '" stroke="#8C949B" stroke-width="1.2"/>'; }
    return t + '<circle cx="' + cx + '" cy="-22" r="5" fill="' + CHROME + '"' + THIN + '/>';
  }
  var SIDE_B = '<svg class="bk bk-side" viewBox="-130 -140 260 150" width="260" height="150" style="left:-92px;top:-140px" overflow="visible">' +
    wheel(-72) + wheel(74) +
    '<path d="M-100,-30 A30,30 0 0 1 -46,-44" fill="none"' + INK + '/><path d="M-100,-30 A30,30 0 0 1 -46,-44" fill="none" stroke="' + BODY + '" stroke-width="5"/>' +   // chắn bùn sau
    '<path d="M-24,-20 h40 v-22 h-40 z" fill="#6F7880"' + INK + '/><path d="M-18,-38 v14 M-10,-38 v14 M-2,-38 v14 M6,-38 v14" stroke="#4B5560" stroke-width="2"/>' + // lốc máy
    '<path d="M-6,-22 Q-40,-10 -104,-20" fill="none" stroke="#0F141B" stroke-width="10" stroke-linecap="round"/><path d="M-6,-22 Q-40,-10 -104,-20" fill="none" stroke="' + CHROME + '" stroke-width="6" stroke-linecap="round"/>' + // ống pô
    '<path d="M-98,-52 Q-88,-74 -40,-72 L-4,-62 L20,-44 L30,-56 L-20,-44 Q-70,-36 -98,-52 Z" fill="' + BODY + '"' + INK + '/>' +            // ốp thân sau
    '<path d="M-90,-56 Q-60,-50 -30,-56" fill="none" stroke="#E2E8EA" stroke-width="2" opacity=".45"/>' +
    '<path d="M-72,-46 L-60,-24" stroke="' + CHROME + '" stroke-width="4"/>' +                                                                 // phuộc sau
    '<rect x="-80" y="-86" width="70" height="16" rx="8" fill="#1B1E22"' + INK + '/>' +                                                         // yên
    '<path d="M-118,-84 H-52 M-112,-84 V-72 M-60,-84 V-72" stroke="#4B5560" stroke-width="3"/>' +                                               // baga
    '<rect x="-122" y="-136" width="74" height="54" rx="6" fill="' + BOX + '"' + INK + '/>' +                                                   // thùng giao hàng
    '<rect x="-122" y="-136" width="74" height="12" rx="5" fill="#B83A44"' + THIN + '/><path d="M-116,-118 h56" stroke="#7A1E26" stroke-width="2"/>' +
    '<rect x="-100" y="-108" width="30" height="10" rx="2" fill="#E2E8EA" opacity=".85" stroke="none"/>' +
    '<path d="M-124,-90 l-8,0 v8 h8 z" fill="#E07A80"' + THIN + '/></svg>';                                                                     // đèn hậu
  var SIDE_F = '<svg class="bk bk-side" viewBox="-130 -140 260 150" width="260" height="150" style="left:-92px;top:-140px" overflow="visible">' +
    '<path d="M50,-36 A30,30 0 0 1 98,-30" fill="none"' + INK + '/><path d="M50,-36 A30,30 0 0 1 98,-30" fill="none" stroke="' + BODY + '" stroke-width="5"/>' + // chắn bùn trước
    '<path d="M62,-104 L74,-22" stroke="#0F141B" stroke-width="9" stroke-linecap="round"/><path d="M62,-104 L74,-22" stroke="' + CHROME + '" stroke-width="5" stroke-linecap="round"/>' + // phuộc trước
    '<path d="M24,-34 Q18,-80 44,-100 L60,-98 Q48,-74 56,-40 Z" fill="#D5DCE0"' + INK + '/>' +                                                   // yếm trắng
    '<path d="M30,-44 Q28,-74 46,-92" fill="none" stroke="#8C949B" stroke-width="2"/>' +
    '<path d="M44,-104 Q62,-112 76,-104 L72,-96 L48,-96 Z" fill="' + BODY + '"' + INK + '/>' +                                                    // đầu xe
    '<circle cx="80" cy="-102" r="8" fill="#E2D9A8"' + INK + '/><circle cx="82" cy="-103" r="3" fill="#fff" stroke="none"/>' +                   // đèn pha
    '<path d="M50,-108 L44,-116 M44,-116 h-10" fill="none"' + INK + '/>' +                                                                        // ghi đông
    '<path d="M56,-110 L60,-130" stroke="#0F141B" stroke-width="2.5"/><ellipse cx="61" cy="-134" rx="6" ry="4" fill="' + CHROME + '"' + THIN + '/></svg>'; // gương
  var FRONT_B = '<svg class="bk bk-front" viewBox="-80 -150 160 160" width="160" height="160" style="left:-80px;top:-150px" overflow="visible">' +
    '<rect x="-34" y="-142" width="68" height="48" rx="6" fill="' + BOX + '"' + INK + '/><rect x="-34" y="-142" width="68" height="10" rx="5" fill="#B83A44"' + THIN + '/></svg>'; // thùng sau lưng
  var FRONT_F = '<svg class="bk bk-front" viewBox="-80 -150 160 160" width="160" height="160" style="left:-80px;top:-150px" overflow="visible">' +
    '<rect x="-10" y="-46" width="20" height="48" rx="9" fill="#1B222C"' + INK + '/><path d="M-12,-40 q12,-10 24,0" fill="' + BODY + '"' + INK + '/>' +
    '<path d="M-30,-42 Q-28,-96 0,-100 Q28,-96 30,-42 Q0,-34 -30,-42 Z" fill="#D5DCE0"' + INK + '/>' +
    '<path d="M-14,-104 Q0,-116 14,-104 L12,-92 H-12 Z" fill="' + BODY + '"' + INK + '/><circle cx="0" cy="-96" r="9" fill="#E2D9A8"' + INK + '/>' +
    '<path d="M-48,-110 H48" fill="none"' + INK + '/><path d="M-40,-110 L-46,-130 M40,-110 L46,-130" stroke="#0F141B" stroke-width="2.5"/>' +
    '<ellipse cx="-47" cy="-134" rx="6" ry="4" fill="' + CHROME + '"' + THIN + '/><ellipse cx="47" cy="-134" rx="6" ry="4" fill="' + CHROME + '"' + THIN + '/></svg>';
  var BACK_F = '<svg class="bk bk-back" viewBox="-80 -150 160 160" width="160" height="160" style="left:-80px;top:-150px" overflow="visible">' +
    '<rect x="-10" y="-44" width="20" height="46" rx="9" fill="#1B222C"' + INK + '/><path d="M-26,-40 Q-26,-62 0,-64 Q26,-62 26,-40 Z" fill="' + BODY + '"' + INK + '/>' +
    '<path d="M20,-30 h14" stroke="' + CHROME + '" stroke-width="7" stroke-linecap="round"/>' +
    '<rect x="-36" y="-118" width="72" height="52" rx="6" fill="' + BOX + '"' + INK + '/><rect x="-36" y="-118" width="72" height="11" rx="5" fill="#B83A44"' + THIN + '/>' +
    '<rect x="-14" y="-92" width="28" height="9" rx="2" fill="#E2E8EA" opacity=".85" stroke="none"/>' +
    '<rect x="-8" y="-64" width="16" height="7" rx="2" fill="#E07A80"' + THIN + '/>' +
    '<path d="M-48,-110 H-38 M38,-110 H48" fill="none"' + INK + '/></svg>';
  var BIKE_B = SIDE_B + FRONT_B, BIKE_F = SIDE_F + FRONT_F + BACK_F;

  var btn = document.createElement('button');
  btn.id = 'btn-bike'; btn.textContent = '🛵'; btn.setAttribute('aria-label', 'Lên xuống xe máy'); btn.hidden = true;
  $('hud').insertBefore(btn, $('btn-music'));
  btn.addEventListener('click', function () { toggleBike(); });
  window.addEventListener('keydown', function (e) { if (e.code === 'KeyM' && !G.ui.modal && G.S && W.mode === 'walk') toggleBike(); });

  function toggleBike() {
    var S = G.S;
    if (!S || !S.flags.xe || S.era) return;
    if (!S.riding && S.cartOut) { G.ui.toast('Đang đẩy xe hàng, không chạy xe máy được. Cất xe đẩy ở nhà trước.'); return; }
    S.riding = !S.riding;
    if (G.audio && G.audio.sfx) try { G.audio.sfx('step'); } catch (e) {}
    syncBike();
    G.ui.minimap();
  }
  function syncBike() {
    var S = G.S;
    if (!S) return;
    if (S.era) S.riding = false;
    btn.hidden = !S.flags.xe || !!S.era;
    btn.classList.toggle('on', !!S.riding);
    var p = W.player;
    if (!p) return;
    if (!p.bike) {
      var b = document.createElement('div'); b.className = 'bike-b'; b.innerHTML = BIKE_B;
      var f = document.createElement('div'); f.className = 'bike-f'; f.innerHTML = BIKE_F;
      p.fl.insertBefore(b, p.fl.firstChild); p.fl.appendChild(f);
      p.bike = true;
    }
    p.el.classList.toggle('riding', !!S.riding);
  }
  G.syncBike = syncBike;

  // Trong nhà thì dắt xe để ngoài: ra khỏi đường lớn (vào phòng) là tự xuống xe
  var enter0 = G.onEnter;
  G.onEnter = function (locId) {
    if (enter0) enter0(locId);
    syncBike();
    G.ui.minimap();
  };
  var tick0 = G.tick, acc = 0, dustT = 0;
  // bụi chân khi đi bộ, khói ống xả khi chạy xe
  function puff(x, y, exh, flip) {
    var d = document.createElement('div');
    d.className = 'dust' + (exh ? ' exh' : '');
    d.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    d.style.left = '0'; d.style.zIndex = Math.round(y) - 1;
    d.style.setProperty('--dx', (-flip * (exh ? 18 : 6)) + 'px');
    var inner = document.createElement('div'); // để transform của hiệu ứng không đè vị trí
    inner.className = d.className; d.className = ''; d.style.position = 'absolute';
    d.appendChild(inner);
    $('ents').appendChild(d);
    setTimeout(function () { d.remove(); }, 850);
  }
  G.tick = function (dt) {
    if (tick0) tick0(dt);
    var S0 = G.S, p = W.player;
    if (S0 && p && W.mode === 'walk' && p.el.classList.contains('walk')) {
      dustT -= dt;
      if (dustT <= 0) {
        var fl = S0.flip || 1, side = S0.view === 'side';
        if (S0.riding) { dustT = 0.1; puff(S0.x - (side ? fl * 36 : 0), S0.y - (side ? 10 : 4), true, side ? fl : 0); }
        else { dustT = 0.25; puff(S0.x + (side ? -fl * 8 : (Math.random() * 16 - 8)), S0.y, false, side ? fl : 0); }
      }
    }
    acc += dt;
    if (acc > 0.3) {
      acc = 0;
      var S = G.S;
      if (S.riding && S.loc === 'nha' && S.y < 470) { S.riding = false; syncBike(); G.ui.toast('Dắt xe để ngoài, đi bộ vào nhà.'); }
      render();
    }
  };
  var hud0 = G.ui.hud;
  G.ui.hud = function () { hud0.apply(this, arguments); render(); };
})();

// Bấm nhãn "◀ nơi bên trái" / "nơi bên phải ▶" ở mép màn hình: tự đi ra mép đó và sang cảnh bên
(function () {
  function go(dir) {
    var S = G.S, W = G.world;
    if (!S || G.ui.isBusy() || W.mode !== 'walk') return;
    var L = G.LOCATIONS[S.loc];
    if (!L.exits[dir]) return;
    var x = dir === 'left' ? 30 : L.width - 30, y = W.blocked(x, S.y) ? 600 : S.y;
    var c = W.toClient(x, y);
    W.clickAt(c[0], c[1]);
  }
  ['left', 'right'].forEach(function (dir) {
    var el = document.getElementById(dir === 'left' ? 'edge-l' : 'edge-r');
    if (!el) return;
    el.addEventListener('click', function (e) { e.stopPropagation(); go(dir); });
    el.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
  });
  G.goExit = go;
})();
