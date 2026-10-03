// Trạng thái game và lưu/tải. Chỉ lưu dữ liệu thuần, không lưu phần tử DOM.
var G = window.G || (window.G = {});

G.SAVE_KEY = 'lnsk_save_v1';
G.SAVE_VERSION = 4;
G.HOME = { x: 260, y: 380 }; // chỗ thức dậy trong nhà cũ

G.newState = function () {
  var stock = {};
  G.ITEM_ORDER.forEach(function (id) { stock[id] = 0; });
  return {
    v: G.SAVE_VERSION,
    day: 1,
    min: 7 * 60,
    loc: 'nha',
    x: G.HOME.x,
    y: G.HOME.y,
    view: 'front',
    flip: 1,
    money: 60,
    stock: stock,
    upgrades: {},
    flags: {},          // cờ cốt truyện / hướng dẫn
    met: {},            // NPC đã nói chuyện (số lần)
    rel: {},            // mức thân quen với NPC
    items: {},          // đồ quan trọng
    quests: {},         // tiến độ việc nhờ: ly_tra = accepted | delivered | done
    seen: {},           // đoạn hội thoại một lần đã xem
    daily: {},          // cờ trong ngày, xoá khi sang ngày
    clues: {},          // manh mối đã ghi: id -> {day, min, isNew, source?}
    deduce: {},         // phép đối chiếu đã làm: id -> {day, min}
    era: null,          // '1996' khi đang ở quá khứ qua gương
    pmin: 0,            // đồng hồ ở quá khứ
    past: {},           // tiến độ các đêm mốc: n1 = active | done
    starterDay: 0,      // ngày cuối nhận gói hàng khởi động
    stats: { sold: 0, earned: 0, days: 1 }
  };
};

G.stockTotal = function (S) {
  var n = 0;
  for (var k in S.stock) n += S.stock[k];
  return n;
};
G.cartCap = function (S) { return S.upgrades.thung_da ? 35 : G.CART_CAP; };

G.slotOf = function (min) {
  var s = G.SLOTS[0];
  G.SLOTS.forEach(function (x) { if (min >= x.from) s = x; });
  return s;
};
G.fmtTime = function (min) {
  var h = Math.floor(min / 60), m = Math.floor(min % 60);
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
};
G.fmtMoney = function (k) { return k + 'k'; };

G.save = function () {
  try {
    localStorage.setItem(G.SAVE_KEY, JSON.stringify(G.S));
    return true;
  } catch (e) { return false; }
};
G.hasSave = function () {
  try { return !!localStorage.getItem(G.SAVE_KEY); } catch (e) { return false; }
};
G.loadSave = function () {
  try {
    var raw = localStorage.getItem(G.SAVE_KEY);
    if (!raw) return null;
    var S = JSON.parse(raw);
    if (!S) return null;
    if (S.v === 1) { // bản lưu góc nhìn ngang cũ: giữ tiền, hàng, tiến độ; đưa về nhà
      S.v = 2; S.loc = 'nha'; S.x = G.HOME.x; S.y = G.HOME.y; S.view = 'front'; S.flip = 1; delete S.face;
    }
    if (S.v === 2 || S.v === 3) { S.v = 4; S.loc = 'nha'; S.x = G.HOME.x; S.y = G.HOME.y; } // bản đồ đã thu nhỏ: đưa về nhà
    if (S.v !== G.SAVE_VERSION) return null;
    // bổ sung trường mới nếu bản lưu cũ thiếu
    var base = G.newState();
    for (var k in base) if (S[k] === undefined) S[k] = base[k];
    G.ITEM_ORDER.forEach(function (id) { if (S.stock[id] === undefined) S.stock[id] = 0; });
    return S;
  } catch (e) { return null; }
};
