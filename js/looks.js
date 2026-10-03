// Chau chuốt nhân vật phụ, khách hàng và đồ ăn.
// Phụ kiện vẽ qua 3 móc trong G.art.chibi: accBack (sau lưng), accFront (trước ngực), accHead (trên đầu).
// o.pattern: 'stripe' | 'dots' | 'plaid' | 'floral';  o.acc: mảng tên phụ kiện.
var G = window.G || (window.G = {});

(function () {
  var INK = '#0F141B';
  function has(o, k) { return o.acc && o.acc.indexOf(k) >= 0; }
  function R(x, y, w, h, f, ex) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (ex || '') + '/>'; }

  // ======================= PHỤ KIỆN NHÂN VẬT =======================
  G.art.accBack = function (o, view, wide) {
    var s = '';
    if (has(o, 'backpack')) s += R(view === 'back' ? 58 : 56, view === 'back' ? 106 : 102, 48, view === 'back' ? 44 : 30, o.packColor || '#2A3550', ' rx="8"') +
      (view === 'back' ? R(66, 122, 28, 16, o.packColor || '#2A3550', ' rx="4" stroke-width="2"') : '');
    if (has(o, 'shipbox')) s += R(view === 'back' ? 54 : 96, 90, view === 'back' ? 52 : 44, 50, '#2C5449', ' rx="5"') + '<path class="d" d="M' + (view === 'back' ? 54 : 96) + ',104 h' + (view === 'back' ? 52 : 44) + '"/>';
    return s;
  };
  G.art.accFront = function (o, view, wide) {
    var s = '', back = view === 'back', c = o.patColor || '#D5DCE0';
    // hoa văn áo
    if (o.pattern === 'stripe') s += '<path d="M' + (62 - wide) + ',118 h' + (36 + wide * 2) + 'M' + (58 - wide) + ',128 h' + (44 + wide * 2) + 'M' + (56 - wide) + ',138 h' + (48 + wide * 2) + 'M' + (54 - wide) + ',147 h' + (52 + wide * 2) + '" stroke="' + c + '" stroke-width="2.4" opacity=".55"/>';
    if (o.pattern === 'dots') [[68, 118], [88, 116], [62, 132], [78, 128], [96, 132], [70, 145], [90, 146]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.4" fill="' + c + '" stroke="none" opacity=".7"/>'; });
    if (o.pattern === 'plaid') s += '<path d="M60,122 h40M57,136 h46M68,110 v44M88,110 v44" stroke="' + c + '" stroke-width="3" opacity=".35"/><path d="M58,129 h44M78,110 v44" stroke="' + INK + '" stroke-width="1" opacity=".35"/>';
    if (o.pattern === 'floral') [[68, 120], [90, 124], [74, 140], [96, 144], [60, 146]].forEach(function (p) {
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="' + c + '" stroke="none" opacity=".75"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.6" fill="#E2B060" stroke="none"/>';
    });
    if (back) return s;
    if (has(o, 'apron')) s += '<path d="M64,112 h32 l5,42 h-42 Z" fill="' + (o.apronColor || '#C3CACD') + '"/>' + R(72, 132, 16, 10, 'none', ' stroke-width="1.5"') + '<path class="d" d="M64,112 L58,104M96,112 L102,104"/>';
    if (has(o, 'tie')) s += '<path d="M80,108 l-4,5 l4,24 l4,-24 Z" fill="' + (o.tieColor || '#A32E36') + '" stroke-width="2"/>';
    if (has(o, 'redscarf')) s += '<path d="M62,108 Q80,119 98,108 L94,115 Q80,123 66,115 Z" fill="#C0303A"/><path d="M80,116 l-7,15 l7,-3 l7,3 Z" fill="#C0303A" stroke-width="2.5"/>';
    if (has(o, 'towel')) s += '<path d="M60,106 q-7,12 -4,30 l9,0 q-3,-16 4,-27 Z" fill="' + (o.towelColor || '#D5DCE0') + '"/><path class="d" d="M57,128 h8M58,132 h8" stroke="#8C949B"/>';
    if (has(o, 'strap')) s += '<path d="M99,109 L60,146" stroke="#4A4038" stroke-width="4.5"/>' + R(44, 138, 20, 16, o.bagColor || '#6A4A3A', ' rx="3" stroke-width="2.5"');
    if (has(o, 'backpack')) s += '<path d="M67,109 v26 M93,109 v26" stroke="' + (o.packColor || '#2A3550') + '" stroke-width="4.5"/>';
    if (has(o, 'pen')) s += R(88, 116, 8, 6, 'none', ' stroke-width="1.5"') + '<path d="M91,112 v8" stroke="#2A3550" stroke-width="2"/>';
    if (has(o, 'badge')) s += '<path d="M70,114 l2,4 l4,0 l-3,3 l1,4 l-4,-2 l-4,2 l1,-4 l-3,-3 l4,0 Z" fill="#E2B060" stroke-width="1.2"/><path d="M58,108 h10M92,108 h10" stroke="#E2B060" stroke-width="3"/>';
    if (has(o, 'collar')) s += '<path d="M70,107 l10,8 l10,-8" fill="#E6E2D6" stroke-width="2"/>';
    return s;
  };
  G.art.accHead = function (o, view) {
    var s = '', dx = view === 'side' ? 9 : 0;
    if (view === 'back') {
      if (has(o, 'khan')) s += '<path d="M42,80 Q40,36 80,36 Q120,36 118,80 Q100,70 80,70 Q60,70 42,80 Z" fill="' + (o.khanColor || '#8C6A5A') + '"/>';
      return s;
    }
    if (has(o, 'glasses')) s += '<g transform="translate(' + dx + ',0)"><circle cx="66" cy="87" r="7.5" fill="#B9C6CC" fill-opacity=".25" stroke-width="2"/><circle cx="94" cy="87" r="7.5" fill="#B9C6CC" fill-opacity=".25" stroke-width="2"/><path d="M73.5,87 h13" stroke-width="2"/></g>';
    if (has(o, 'pencil')) s += '<path d="M110,64 l14,-9" stroke="#E2B060" stroke-width="3.5"/><path d="M124,55 l3,-2" stroke="' + INK + '" stroke-width="2"/>';
    if (has(o, 'khan')) s += '<path d="M40,80 Q38,34 80,34 Q122,34 120,80 Q110,58 80,58 Q50,58 40,80 Z" fill="' + (o.khanColor || '#8C6A5A') + '"/><path d="M42,78 l-6,14 l11,-5 Z" fill="' + (o.khanColor || '#8C6A5A') + '"/>';
    if (has(o, 'earring')) s += '<circle cx="' + (44 + dx) + '" cy="96" r="2.5" fill="#E2B060" stroke-width="1"/>';
    if (has(o, 'pigtails')) s += '<ellipse cx="36" cy="66" rx="9" ry="12" fill="' + (o.hairColor || INK) + '"/><ellipse cx="124" cy="66" rx="9" ry="12" fill="' + (o.hairColor || INK) + '"/>' +
      '<circle cx="42" cy="60" r="3.5" fill="#A32E36" stroke-width="1.5"/><circle cx="118" cy="60" r="3.5" fill="#A32E36" stroke-width="1.5"/>';
    return s;
  };
  var prop0 = G.art.prop;
  G.art.prop = function (o) {
    if (o.prop === 'cane') return '<path d="M108,146 L116,178" stroke="#6A5846" stroke-width="5"/><path d="M106,146 q2,-8 10,-4" fill="none" stroke="#6A5846" stroke-width="5"/>';
    if (o.prop === 'bucket') return '<path d="M98,152 h22 l-3,18 h-16 Z" fill="#3F6670"/><path d="M98,152 q11,-14 22,0" fill="none" stroke-width="2"/><path class="d" d="M102,158 h14" stroke="#8C949B"/>';
    if (o.prop === 'bag') return R(100, 146, 20, 22, o.bagColor || '#A32E36', ' rx="3"') + '<path d="M104,146 q6,-10 12,0" fill="none" stroke-width="2"/>';
    if (o.prop === 'phone') return R(102, 132, 10, 16, '#1B222C', ' rx="2" stroke-width="2"') + R(104, 134, 6, 10, '#6F86A0', ' stroke="none"');
    return prop0(o);
  };

  // ======================= KHÁCH HÀNG GHÉP NGẪU NHIÊN =======================
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  var PANTS = ['#33363F', '#2A3550', '#4B5560', '#3B3430'], SHOES = ['#4A4038', '#22262C', '#D5DCE0', '#6A4A3A'];
  var HAIRC = ['#0F141B', '#0F141B', '#2E2420', '#3A3028'];
  var GEN = {
    lao_dong: function () {
      return { hair: pick(['non_la', 'cap', 'helmet', 'short']), cap: pick(['#2C5449', '#A32E36', '#3F7566', '#948C5E']), shirt: pick(['#3F6670', '#4B5560', '#58755C', '#857761', '#6A5846']),
        pattern: pick([null, null, 'stripe', 'plaid']), eyes: pick(['tired', 'flat', 'narrow']), body: pick([null, 'wide']),
        acc: [pick(['towel', null, 'strap'])], prop: pick([null, null, 'phone']) };
    },
    hoc_sinh: function () {
      return { kid: true, hair: pick(['short', 'long', 'bun', 'messy']), hairColor: pick(HAIRC), shirt: '#D5DCE0', pants: '#2A3550', shoes: pick(SHOES), eyes: 'big',
        acc: ['redscarf', 'backpack', 'collar', pick([null, 'pigtails'])], packColor: pick(['#2A3550', '#A32E36', '#3F6670', '#948C5E']) };
    },
    van_phong: function () {
      var f = Math.random() < 0.5;
      return { hair: f ? pick(['long', 'bun']) : pick(['short', 'messy']), hairColor: pick(HAIRC), shirt: pick(['#6F86A0', '#C3CACD', '#A4A98C', '#B9C6CC', '#8C7A9A']),
        pattern: pick([null, null, 'stripe']), patColor: '#4B5560', eyes: 'flat', pants: pick(PANTS),
        acc: f ? [pick(['strap', null]), pick(['glasses', null]), 'earring'] : ['tie', pick(['glasses', null])], tieColor: pick(['#A32E36', '#2A3550', '#3F6670']),
        prop: pick([null, 'phone', 'bag']), bagColor: pick(['#A32E36', '#4A4038', '#2A3550']) };
    },
    nguoi_gia: function () {
      var f = Math.random() < 0.5;
      return { hair: f ? 'bun' : 'old', hairColor: '#8C949B', shirt: pick(['#857761', '#58755C', '#4B5560', '#6A4A3A']), pattern: pick(['dots', 'floral', null]),
        eyes: pick(['tired', 'narrow']), acc: f ? [pick(['khan', null])] : [pick(['towel', null])], khanColor: pick(['#8C6A5A', '#4B5560', '#6A5846']),
        prop: pick(['cane', 'fan', null]) };
    },
    cau_ca: function () {
      return { hair: pick(['cap', 'non_la']), cap: pick(['#948C5E', '#58755C', '#3F6670']), shirt: pick(['#58755C', '#4B5560', '#857761']), pattern: pick(['plaid', 'stripe', null]),
        eyes: pick(['tired', 'narrow', 'flat']), prop: pick(['rod', 'rod', 'bucket']), acc: [pick(['towel', null])] };
    }
  };
  G.genLook = function (type) {
    var o = (GEN[type] || GEN.lao_dong)();
    o.pants = o.pants || pick(PANTS); o.shoes = o.shoes || pick(SHOES);
    o.acc = (o.acc || []).filter(Boolean);
    return o;
  };

  // ======================= NHÂN VẬT PHỤ CÓ TÊN =======================
  function look(id, extra) { if (G.NPCS[id]) G.NPCS[id].look = Object.assign({}, G.NPCS[id].look, extra); }
  look('co_lan', { pattern: 'floral', patColor: '#E6E2D6', acc: ['apron'], apronColor: '#C3CACD' });
  look('bac_ba', { acc: ['apron', 'pencil', 'glasses'], apronColor: '#857761', pattern: 'plaid', patColor: '#857761' });
  look('bac_do', { acc: ['towel'], pattern: 'stripe', patColor: '#B9C6CC' });
  look('tung', { acc: ['shipbox', 'strap'], pattern: 'stripe', patColor: '#3F7566', prop: 'phone' });
  look('ong_khai', { acc: ['glasses', 'pen', 'collar'] });
  look('be_na', { acc: ['redscarf', 'pigtails', 'collar'], shirt: '#D5DCE0', pants: '#2A3550' });
  look('ba_nam', { acc: ['khan'], khanColor: '#6A5846', pattern: 'dots', prop: 'cane' });
  look('can_bo', { acc: ['badge'] });
  look('vy_nay', { acc: ['strap'], bagColor: '#3F6670' });
  look('rang_96', { acc: ['towel'] });
  look('tu_96', { acc: ['towel'], towelColor: '#C8B080' });
  look('lan_96', { acc: ['apron'], apronColor: '#D5DCE0', pattern: 'floral', patColor: '#E6E2D6' });
  look('khai_96', { acc: ['collar'] }); look('khai_15', { acc: ['collar'] });
  look('me_15', { pattern: 'floral', patColor: '#E6E2D6' }); look('me_cao', { pattern: 'floral', patColor: '#E6E2D6' }); look('me_nay', { pattern: 'floral', patColor: '#E6E2D6' });
  look('dan_96', { pattern: 'dots', acc: ['khan'], khanColor: '#4B5560' });

  // ======================= ĐỒ ĂN =======================
  // biểu tượng món: vẽ ở khung 40x40, hiển thị theo kích thước yêu cầu
  var FOOD = {
    tra_da: '<path d="M10,7 H30 L27,36 H13 Z" fill="#D5DCE0" fill-opacity=".35"/>' +
      '<path d="M11.5,15 H28.5 L26.6,34 H13.4 Z" fill="#B07A3A" stroke="none"/><path d="M11.5,15 H28.5 L28,20 H12 Z" fill="#C8924C" stroke="none" opacity=".8"/>' +
      '<rect x="14" y="12" width="7" height="7" rx="1.5" fill="#E6EEF2" stroke-width="1.4" transform="rotate(-10 17 15)"/><rect x="20" y="16" width="7" height="7" rx="1.5" fill="#E6EEF2" stroke-width="1.4" transform="rotate(12 23 19)"/>' +
      '<rect x="15" y="22" width="6" height="6" rx="1.5" fill="#DCE6EA" fill-opacity=".8" stroke-width="1.2"/>' +
      '<path d="M10,7 H30 L27,36 H13 Z" fill="none" stroke-width="2.4"/><path d="M13,10 l2,22" stroke="#FFFFFF" stroke-width="1.5" opacity=".55"/>' +
      '<circle cx="26" cy="27" r="1" fill="#FFFFFF" stroke="none" opacity=".8"/><circle cx="25" cy="31" r=".8" fill="#FFFFFF" stroke="none" opacity=".7"/>' +
      '<path d="M24,2 L19,30" stroke="#A32E36" stroke-width="2.6"/>',
    nuoc_ngot: '<path d="M16,3 H24 V9 Q30,13 30,19 V35 Q30,37 28,37 H12 Q10,37 10,35 V19 Q10,13 16,9 Z" fill="#3A1E1A"/>' +
      '<rect x="15" y="1" width="10" height="4" rx="1" fill="#A32E36" stroke-width="1.8"/>' +
      '<path d="M10,20 H30 V29 H10 Z" fill="#A32E36" stroke-width="1.8"/><path d="M13,24.5 q7,-4 14,0" fill="none" stroke="#E6E2D6" stroke-width="1.8"/>' +
      '<path d="M13,11 q-1,6 0,8 M13,31 v3" stroke="#FFFFFF" stroke-width="1.6" opacity=".55"/>' +
      '<path d="M16,3 H24 V9 Q30,13 30,19 V35 Q30,37 28,37 H12 Q10,37 10,35 V19 Q10,13 16,9 Z" fill="none" stroke-width="2.4"/>',
    banh_mi: '<path d="M3,24 Q4,13 20,11 Q36,11 37,21 Q36,30 20,30 Q4,31 3,24 Z" fill="#C8924C"/>' +
      '<path d="M6,21 Q20,15 34,19 Q33,25 20,25 Q8,26 6,21 Z" fill="#E6D2A0" stroke-width="1.6"/>' +
      '<path d="M9,21 q4,-3 8,0 q4,-3 8,0 q4,-3 8,0" fill="none" stroke="#3F6A50" stroke-width="2.6"/>' +
      '<path d="M10,22 h7" stroke="#C47A7A" stroke-width="3"/><path d="M19,22 h6" stroke="#8A5A3A" stroke-width="3"/>' +
      '<path d="M27,19 l3,-4 l1,3" fill="#C0303A" stroke-width="1.4"/><path d="M14,18 l2,-3 l1,3" fill="#58855E" stroke-width="1.2"/>' +
      '<path d="M9,15 l4,4 M16,13 l4,4 M24,12 l4,4" stroke="#8A5A2A" stroke-width="1.6"/>' +
      '<path d="M3,24 Q4,13 20,11 Q36,11 37,21 Q36,30 20,30 Q4,31 3,24 Z" fill="none" stroke-width="2.4"/>'
  };
  G.art.icon = function (id, size) {
    size = size || 32;
    return '<svg viewBox="0 0 40 40" width="' + size + '" height="' + size + '"><g stroke="' + INK + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' + (FOOD[id] || '') + '</g></svg>';
  };

  // xe hàng: tủ kính hiện đúng hàng đang có
  var cart0 = G.art.cart;
  G.art.cart = function (S) {
    var svg = cart0(S), st = (S && S.stock) || {}, g = '';
    var tra = Math.min(4, st.tra_da || 0), nn = Math.min(3, st.nuoc_ngot || 0), bm = Math.min(3, st.banh_mi || 0);
    // che hàng mẫu cũ, vẽ lại theo số lượng
    g += '<rect x="24" y="44" width="122" height="36" rx="2" fill="#5A6E80" stroke="none"/>';
    for (var i = 0; i < tra; i++) g += '<g transform="translate(' + (24 + i * 10) + ',46) scale(.42)">' + FOOD.tra_da + '</g>';
    for (var j = 0; j < nn; j++) g += '<g transform="translate(' + (66 + j * 9) + ',46) scale(.42)">' + FOOD.nuoc_ngot + '</g>';
    for (var k = 0; k < bm; k++) g += '<g transform="translate(' + (92 + (k % 2) * 18) + ',' + (50 + (k >> 1) * 12) + ') scale(.5)">' + FOOD.banh_mi + '</g>';
    if (!tra && !nn && !bm) g += '<path d="M40,62 h90" stroke="#8C949B" stroke-width="1.5" stroke-dasharray="4 4"/>';
    g += '<path d="M24,44 L60,80" stroke="#D5DCE0" stroke-width="2" opacity=".35"/>';
    return svg.replace('<rect x="20" y="84"', '<g stroke-width="2">' + g + '</g><rect x="20" y="84"');
  };

  // ======================= BÁN HÀNG: XE CẬP NHẬT, MÓN BAY SANG KHÁCH =======================
  function refresh() { if (G.world && G.world.refreshCart) G.world.refreshCart(); }
  ['add', 'clearTray'].forEach(function (k) { var f = G.sell[k]; G.sell[k] = function () { var r = f.apply(this, arguments); refresh(); return r; }; });
  var serve0 = G.sell.serve;
  G.sell.serve = function () {
    var front = G.sell.queue()[0];
    var tray = G.sell.tray.slice(), m = G.S.money;
    var r = serve0.apply(this, arguments);
    if (G.S.money > m && front) { // món bay từ xe sang tay khách
      var cart = G.world.cart, el = document.createElement('div');
      el.className = 'fly-food';
      el.innerHTML = tray.map(function (id) { return G.art.icon(id, 30); }).join('');
      el.style.setProperty('--x0', (cart.x) + 'px'); el.style.setProperty('--y0', (cart.y - 60) + 'px');
      el.style.setProperty('--x1', (front.e.x) + 'px'); el.style.setProperty('--y1', (front.e.y - 70) + 'px');
      document.getElementById('ents').appendChild(el);
      setTimeout(function () { el.remove(); }, 700);
    }
    refresh();
    return r;
  };

  // ======================= TRANH MÂM ĐỒ ĂN (sạp cô Lan) =======================
  if (G.CLOSEUPS) G.CLOSEUPS.mon_an = function () {
    var p = '<rect width="520" height="300" fill="#2A323D"/><rect x="0" y="190" width="520" height="110" fill="#4A3532"/>' +
      '<ellipse cx="260" cy="210" rx="220" ry="40" fill="#5A4A3C"/><ellipse cx="260" cy="206" rx="200" ry="32" fill="#6A5846"/>';
    p += '<g transform="translate(70,70) scale(3.2)">' + FOOD.tra_da + '</g>';
    p += '<g transform="translate(180,96) scale(4.4)">' + FOOD.banh_mi + '</g>';
    p += '<g transform="translate(360,62) scale(3.4)">' + FOOD.nuoc_ngot + '</g>';
    p += '<path d="M120,60 q-8,-16 2,-30 M132,58 q-6,-12 2,-24" fill="none" stroke="#B9C6CC" stroke-width="2.5" opacity=".5"/>';
    p += '<text x="260" y="290" text-anchor="middle" font-size="16" font-weight="700" fill="#E2D2A0" stroke="none" font-family="Segoe UI, Arial">Trà đá · Bánh mì · Nước ngọt</text>';
    return '<svg viewBox="0 0 520 300" width="520" height="300"><g stroke="' + INK + '" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" filter="url(#w)">' + p + '</g></svg>';
  };
})();
