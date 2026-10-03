// Dữ liệu tĩnh của game. Mọi thứ tra cứu bằng ID ổn định, không dựa vào tên hiển thị.
var G = window.G || (window.G = {});

G.VIEW_W = 960;
G.VIEW_H = 540;
G.GROUND_Y = 478; // vị trí bàn chân nhân vật

G.SLOTS = [
  { id: 'sang', name: 'Sáng', from: 6 * 60 },
  { id: 'chieu', name: 'Chiều', from: 11 * 60 },
  { id: 'toi', name: 'Tối', from: 17 * 60 }
];
G.DAY_START = 6 * 60;
G.DAY_END = 21 * 60;

// Giá tính bằng nghìn đồng
G.ITEMS = {
  tra_da:    { id: 'tra_da',    name: 'Trà đá',    cost: 2, price: 5,  perish: true,  note: 'Pha trong ngày, tối đổ bỏ' },
  nuoc_ngot: { id: 'nuoc_ngot', name: 'Nước ngọt', cost: 6, price: 12, perish: false, note: 'Chai, để được lâu' },
  banh_mi:   { id: 'banh_mi',   name: 'Bánh mì',   cost: 8, price: 15, perish: true,  note: 'Bán trong ngày, sáng bán chạy' }
};
G.ITEM_ORDER = ['tra_da', 'nuoc_ngot', 'banh_mi'];

G.CART_CAP = 20;
G.UPGRADES = {
  thung_da: { id: 'thung_da', name: 'Thùng đá lớn', cost: 80, desc: 'Sức chứa xe từ 20 lên 35 món.' },
  o_che:    { id: 'o_che',    name: 'Ô che sạp',    cost: 60, desc: 'Khách chịu chờ lâu hơn một nửa, khách ghé thường hơn.' }
};

// Nhóm khách: likes là trọng số chọn món, look là ngoại hình chibi
G.CUSTOMER_TYPES = {
  lao_dong:  { name: 'Người lao động', likes: { tra_da: 6, nuoc_ngot: 2, banh_mi: 2 },
               looks: [{ hair: 'non_la', shirt: '#3F6670', eyes: 'tired' }, { hair: 'cap', shirt: '#4B5560', cap: '#2C5449', eyes: 'flat' }] },
  hoc_sinh:  { name: 'Học sinh', likes: { nuoc_ngot: 5, banh_mi: 3, tra_da: 1 }, kid: true,
               looks: [{ hair: 'short', shirt: '#D5DCE0', pants: '#2A3550', eyes: 'big' }, { hair: 'long', shirt: '#D5DCE0', pants: '#2A3550', eyes: 'big' }] },
  nguoi_gia: { name: 'Người già', likes: { tra_da: 6, banh_mi: 1 },
               looks: [{ hair: 'old', shirt: '#857761', eyes: 'narrow' }, { hair: 'bun', hairColor: '#8C949B', shirt: '#58755C', eyes: 'tired' }] },
  van_phong: { name: 'Dân văn phòng', likes: { banh_mi: 5, nuoc_ngot: 2, tra_da: 2 },
               looks: [{ hair: 'short', shirt: '#C3CACD', pants: '#33363F', eyes: 'flat' }, { hair: 'long', shirt: '#6F86A0', eyes: 'flat' }] },
  cau_ca:    { name: 'Người câu cá', likes: { tra_da: 4, nuoc_ngot: 4, banh_mi: 2 },
               looks: [{ hair: 'cap', shirt: '#58755C', cap: '#948C5E', eyes: 'tired', prop: 'rod' }, { hair: 'non_la', shirt: '#4B5560', eyes: 'narrow', prop: 'rod' }] }
};

// Địa điểm hiện tại, nhìn từ trên xuống. exits: đi ra mép trái/phải sẽ sang nơi khác (đường chạy ngang xuyên các cảnh).
// Vị trí (x, y) là chỗ bàn chân đứng.
G.LOCATIONS = {
  ben_song: {
    id: 'ben_song', name: 'Bến sông', width: 960, height: 900,
    exits: { right: 'nha' },
    sell: { spot: { x: 480, y: 700 }, interval: 6.5, tipMul: 2, multi: 0.45, types: { cau_ca: 5, lao_dong: 3, nguoi_gia: 1 },
            blurb: 'Ít khách hơn chợ, chủ yếu người câu cá và dân chài: hay mua hai món một lần và hay boa.' },
    things: [
      { id: 'ben_sap', x: 480, y: 700, label: 'Bày sạp bán', act: 'sell' },
      { id: 'thung_giay', x: 635, y: 494, hit: [606, 432, 58, 46], act: 'box',
        label: function (S) { return S.flags.tung_box ? 'Lục thùng giấy cũ' : 'Thùng giấy'; },
        quest: function (S) { return !!S.flags.tung_box && !S.flags.box_done; } },
      { id: 'cua_nha9', x: 180, y: 468, hit: [140, 380, 80, 60], act: 'door9',
        label: function (S) { return S.items.ly_tra_ba ? 'Đặt ly trà trước cửa' : 'Cửa nhà số 9'; },
        cond: function (S) { return !S.flags.door9_open; }, quest: function (S) { return !!S.items.ly_tra_ba; } },
      { id: 'ban_go', x: 236, y: 330, hit: [196, 250, 90, 60], label: 'Xem cái bàn', act: 'table9',
        cond: function (S) { return S.flags.door9_open && !S.flags.took9; }, quest: function (S) { return !S.items.ban_ve_dinh; } }
    ]
  },
  nha: {
    id: 'nha', name: 'Nhà cũ', width: 960, height: 790,
    exits: { left: 'ben_song', right: 'duong' },
    things: [
      { id: 'giuong', x: 546, y: 252, hit: [480, 104, 132, 116], label: 'Nghỉ / chờ', act: 'rest' },
      { id: 'ban_vy', x: 548, y: 340, hit: [572, 286, 46, 88], label: 'Xem bàn của Vy', act: 'look', text: 'ban_vy', clue: 'e_anh_le_hoi',
        quest: function (S) { return !S.clues.e_anh_le_hoi; } },
      { id: 'ban_tho', x: 255, y: 180, hit: [195, 66, 120, 80], label: 'Xem bàn thờ', act: 'look', text: 'ban_tho', clue: 'e_nhang' }
    ]
  },
  duong: {
    id: 'duong', name: 'Đường xóm', width: 960, height: 790,
    exits: { left: 'nha', right: 'cho' },
    things: [
      { id: 'bang_tin', x: 440, y: 520, hit: [402, 440, 76, 60], label: 'Xem bảng tin', act: 'look', text: 'bang_tin', clue: 'e_to_tim_nguoi' }
    ]
  },
  cho: {
    id: 'cho', name: 'Chợ', width: 960, height: 790,
    exits: { left: 'duong' },
    sell: { spot: { x: 640, y: 496 }, interval: 4.6, tipMul: 1, multi: 0.25, types: { lao_dong: 3, hoc_sinh: 3, van_phong: 3, nguoi_gia: 2 },
            blurb: 'Đông khách, đủ loại người. Sáng chuộng bánh mì, trưa chiều chuộng đồ uống.' },
    things: [
      { id: 'cho_sap', x: 640, y: 496, label: 'Bày sạp bán', act: 'sell' }
    ]
  }
};

// NPC có lịch sinh hoạt: mỗi mốc giờ đứng ở một chỗ (loc: null là đi vắng).
// ax/ay: chỗ người chơi đứng để nói chuyện, tính từ chân NPC (mặc định đứng phía dưới 40). buy: ghé mua trà nếu người chơi đang bán ở đó.
G.NPCS = {
  co_lan: { id: 'co_lan', name: 'Cô Lan', act: 'shop', label: 'Nhập hàng',
            quest: function (S) { return !S.seen.lan_first; },
            look: { hair: 'non_la', shirt: '#A32E36', pants: '#33363F', eyes: 'tired', body: 'wide' },
            schedule: [{ t: '06:00', loc: 'cho', x: 470, y: 446 }, { t: '19:30', loc: null }] },
  bac_do: { id: 'bac_do', name: 'Bác Tư lái đò', act: 'talk', label: 'Nói chuyện',
            look: { hair: 'old', shirt: '#3F6670', pants: '#4B5560', eyes: 'narrow' },
            schedule: [{ t: '06:00', loc: 'ben_song', x: 690, y: 860, ay: -52 }, { t: '19:00', loc: null }] },
  bac_ba: { id: 'bac_ba', name: 'Bác Ba thợ mộc', act: 'talk', label: 'Nói chuyện',
            quest: function (S) {
              return !S.seen.ba_intro || S.quests.ly_tra === 'delivered' || (!S.quests.ly_tra && (S.rel.bac_ba || 0) >= 3) ||
                (S.deduce.q_ba_giau && !S.clues.t_ba_bi_dan) || (S.items.ban_ve_dinh && S.quests.ly_tra === 'done' && !S.clues.t_ba_khong_nho);
            },
            look: { hair: 'short', hairColor: '#8C949B', shirt: '#6A5846', pants: '#33363F', eyes: 'tired', body: 'wide' },
            schedule: [
              { t: '06:00', loc: 'duong', x: 730, y: 500 }, // nhân vật cốt truyện: ở xưởng MỘC BA cả ngày, mua trà ngay tại xưởng
              { t: '20:00', loc: null }
            ] },
  ong_khai: { id: 'ong_khai', name: 'Ông Khải (ban quản lý đình)', act: 'talk', label: 'Nói chuyện',
            look: { hair: 'short', hairColor: '#4A4F57', shirt: '#D5DCE0', pants: '#33363F', shoes: '#2E2925', eyes: 'flat', body: 'wide', mole: true },
            quest: function (S) { return (!S.seen.khai_intro && !!S.items.ban_ve_dinh) || (!!S.seen.khai_intro && !S.clues.t_khai_khong_ham); },
            schedule: [
              { t: '06:00', loc: null },
              { t: '07:00', loc: 'ben_song', x: 430, y: 476 },
              { t: '12:00', loc: null },
              { t: '14:00', loc: 'duong', x: 520, y: 500 },
              { t: '18:30', loc: null }
            ] },
  tung:   { id: 'tung', name: 'Tùng shipper', act: 'talk', label: 'Nói chuyện',
            quest: function (S) { return !!S.seen.khai_intro && !S.flags.tung_box; },
            look: { hair: 'helmet', shirt: '#3F7566', pants: '#2A3550', shoes: '#D5DCE0', eyes: 'flat' },
            schedule: [
              { t: '06:00', loc: 'cho', x: 860, y: 712, ay: -46 },
              { t: '11:00', loc: 'duong', x: 520, y: 712, ay: -46 },
              { t: '16:00', loc: 'ben_song', x: 470, y: 476 },
              { t: '20:00', loc: null }
            ] },
  be_na:  { id: 'be_na', name: 'Bé Na', act: 'talk', label: 'Nói chuyện',
            look: { hair: 'long', shirt: '#948C5E', pants: '#C3CACD', shoes: '#A32E36', eyes: 'big', kid: true, prop: 'balloon' },
            schedule: [
              { t: '06:00', loc: null },
              { t: '13:30', loc: 'duong', x: 290, y: 476 },
              { t: '17:00', loc: 'nha', x: 780, y: 480 },
              { t: '19:00', loc: null }
            ] }
};

// Đồ quan trọng: không bán được, không mất khi hết ngày
G.KEY_ITEMS = {
  ly_tra_ba:   { name: 'Ly trà của bác Ba', desc: 'Ly trà đá thứ hai bác Ba nhờ mang tới **nhà số 9 cuối bến sông**.' },
  ban_ve_dinh: { name: 'Bản vẽ sửa đình 1995', desc: 'Bản vẽ kết cấu đình làng, ký tên **Ba Mộc**. Góc dưới có một ô vuông bị tẩy, cạnh đó ghi bút chì: [["hầm — không đưa vào bản nộp"]].' }
};

G.PLAYER_LOOK = { hair: 'messy', shirt: '#3B4A5E', pants: '#2A3550', shoes: '#4A4038', eyes: 'flat', scarf: true };

// Chuỗi mục tiêu hướng dẫn. Mục nào đã đạt (kể cả làm trước) sẽ tự bỏ qua.
G.OBJECTIVES = [
  { id: 'phong_vy', text: 'Xem bàn học của Vy trong phòng ngủ (cạnh giường)', done: function (S) { return !!S.clues.e_anh_le_hoi; } },
  { id: 'nhap_hang', text: 'Ra khỏi nhà, theo đường sang phải tới chợ gặp cô Lan nhập hàng', done: function (S) { return G.stockTotal(S) > 0 || S.stats.sold > 0; } },
  { id: 'ban_hang', text: 'Bày sạp ở chợ hoặc bến sông và bán vài món', done: function (S) { return S.stats.sold >= 3; } },
  { id: 'quen_ba', text: 'Làm quen bác Ba thợ mộc ở xưởng MỘC BA (Đường xóm): trò chuyện, mời bác trà đá mỗi ngày', done: function (S) { return !!S.quests.ly_tra; } },
  { id: 'giao_tra', text: 'Mang ly trà của bác Ba tới nhà số 9 cuối bến sông', done: function (S) { return S.quests.ly_tra === 'delivered' || S.quests.ly_tra === 'done'; } },
  { id: 'nha9', text: 'Cửa nhà số 9 đã mở. Vào xem bên trong', done: function (S) { return !!S.items.ban_ve_dinh || S.quests.ly_tra === 'done'; } },
  { id: 'hoi_ba', text: 'Quay lại gặp bác Ba', done: function (S) { return S.quests.ly_tra === 'done'; } },
  { id: 'doi_chieu', text: 'Mở Sổ điều tra (nút Sổ / phím J): đối chiếu lời bác Ba "không nhớ" với bản vẽ', done: function (S) { return !!S.deduce.q_ba_giau; } },
  { id: 'hoi_ham', text: 'Hỏi lại bác Ba về chữ "hầm" trên bản vẽ', done: function (S) { return !!S.clues.t_ba_bi_dan; } },
  { id: 'gap_khai', text: 'Gặp ông Khải, trưởng ban quản lý đình: sáng ở quán nước bến sông, chiều trước nhà CHO THUÊ', done: function (S) { return !!S.clues.t_khai_khong_le; } },
  { id: 'khai_le', text: 'Ông Khải nói đêm cháy ở nhà. Đối chiếu lời ông với vật chứng trong Sổ', done: function (S) { return !!S.deduce.q_khai_le; } },
  { id: 'ai_duyet', text: 'Ai duyệt bản nộp thiếu hầm? Tìm giấy tờ cũ của ban quản lý (hỏi Tùng) rồi đối chiếu với lời bác Ba', done: function (S) { return !!S.deduce.q_khai_duyet; } },
  { id: 'nang_cap', text: 'Dành tiền mua một món đồ nghề ở chỗ cô Lan', done: function (S) { return Object.keys(S.upgrades).length > 0; } },
  { id: 'het', text: 'Hết phần chơi thử bước 4. Bán tiếp, trò chuyện, xem lại Sổ điều tra tùy ý.', done: function () { return false; } }
];

G.parseTime = function (t) { var p = t.split(':'); return +p[0] * 60 + +p[1]; };
for (var nid in G.NPCS) G.NPCS[nid].schedule.forEach(function (e) { e.from = G.parseTime(e.t); });
