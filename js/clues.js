// Manh mối, lời khai và phép đối chiếu cho Sổ điều tra.
// Vật chứng/quan sát (kind 'ev') là sự thật nhìn thấy được; lời khai (kind 'tm') là điều người khác nói, có thể sai.
// Suy đoán chỉ xuất hiện sau khi người chơi tự đối chiếu, và luôn ghi rõ là suy đoán.
var G = window.G || (window.G = {});

G.CLUES = {
  // ----- vật chứng & quan sát -----
  e_anh_le_hoi: { kind: 'ev', title: 'Ảnh lễ hội đình 1996', loc: 'Nhà cũ', source: 'Bàn học của Vy',
    people: ['Vy', 'Người đeo mặt nạ', 'Người đeo băng "Ban tế lễ"'], topics: ['le_hoi', 'vy'],
    about: 'những ai có mặt ở lễ hội đêm rằm 1996',
    text: 'Ảnh in ngày **Rằm tháng Tám 1996**. Vy đứng giữa ảnh, [[đúng tuổi bây giờ]]. Sau lưng Vy: [[người đeo mặt nạ cầm rìu]], cổ quấn một chiếc khăn tối màu. Mép trái: người khiêng kiệu đeo băng đỏ "Ban tế lễ", [[nốt ruồi lớn dưới mắt trái]].' },
  e_nhang: { kind: 'ev', title: 'Nhang mới trên bàn thờ', loc: 'Nhà cũ', source: 'Bàn thờ mẹ',
    people: ['Vy?'], topics: ['vy'], about: 'có người về nhà thắp nhang gần đây',
    text: 'Bát hương có mấy chân nhang còn mới, tàn chưa bám bụi. Có người đã về thắp nhang trước tôi.' },
  e_to_tim_nguoi: { kind: 'ev', title: 'Tờ tìm người năm 1996', loc: 'Đường xóm', source: 'Bảng tin phường',
    people: ['Người mất tích (chưa rõ tên)'], topics: ['mat_tich'], about: 'một vụ mất tích gần đình năm 1996',
    text: 'Giấy tìm người ố vàng, chỉ còn đọc được: [["...mất tích tháng 8 năm 1996, gần đình làng"]].' },
  e_vet_ly: { kind: 'ev', title: 'Vết ly trước cửa nhà số 9', loc: 'Bến sông', source: 'Quan sát bậc cửa',
    people: ['Bác Ba', 'Ông Rạng'], topics: ['tra_ba'], about: 'có người đặt ly nước trước nhà số 9 suốt nhiều năm',
    text: 'Bậc cửa nhà số 9 có rất nhiều vết tròn của ly nước, chồng lên nhau, cũ mới lẫn lộn.' },
  e_ban_ve: { kind: 'ev', title: 'Bản vẽ sửa đình 1995 (bản gốc)', loc: 'Bến sông', source: 'Nhà số 9 / thùng giấy cũ',
    people: ['Bác Ba (Ba Mộc)'], topics: ['ham', 'sua_dinh'], about: 'dưới đình có hầm, và nó bị bỏ khỏi bản nộp',
    text: 'Bản vẽ ký tên **Ba Mộc**. Dưới gian thờ có [[một ô vuông ghi "hầm" bị tẩy mờ]], cạnh đó bút chì cùng nét chữ: [["không đưa vào bản nộp"]].' },
  e_bien_ban: { kind: 'ev', title: 'Biên bản nghiệm thu sửa đình 1995', loc: 'Bến sông', source: 'Thùng giấy ông Khải đem bán ve chai',
    people: ['Ông Khải'], topics: ['ham', 'sua_dinh', 'khai'], about: 'ai đã duyệt bản vẽ nộp lên',
    text: 'Bản vẽ nộp kèm biên bản [[không có hầm]]. Người ký duyệt: **Trưởng ban Nguyễn Văn Khải**.' },

  // ----- lời khai -----
  t_ba_ly_rang: { kind: 'tm', who: 'Bác Ba', title: 'Bác Ba: ly trà thứ hai', loc: 'Đường xóm', topics: ['tra_ba'],
    about: 'ly trà thứ hai là cho ông Rạng đã mất', people: ['Bác Ba', 'Ông Rạng'],
    text: '"Ngày trước sáng nào hai thằng cũng ngồi xe trà mẹ cháu. Giờ bác vẫn mua hai ly. Một ly cho ông Rạng."' },
  t_ba_khong_nho: { kind: 'tm', who: 'Bác Ba', title: 'Bác Ba: không nhớ cái hầm', loc: 'Đường xóm', topics: ['ham', 'sua_dinh'],
    about: 'chữ "hầm" trên bản vẽ', people: ['Bác Ba'],
    text: '"Cái ô bị tẩy ấy hả? Bác không nhớ. Bác già rồi."' },
  t_ba_bi_dan: { kind: 'tm', who: 'Bác Ba', title: 'Bác Ba: bị dặn bỏ cái hầm', loc: 'Đường xóm', topics: ['ham', 'khai'],
    about: 'ai bảo bỏ cái hầm khỏi bản nộp', people: ['Bác Ba', 'Người duyệt hồ sơ'],
    text: '"Lúc nộp, người duyệt hồ sơ bảo bỏ cái hầm ra. Ai duyệt thì giấy tờ còn đó. Người đó vẫn còn trong làng."' },
  t_khai_khong_le: { kind: 'tm', who: 'Ông Khải', title: 'Ông Khải: không đi lễ đêm cháy', loc: 'Ông Khải', topics: ['le_hoi', 'khai'],
    about: 'ông Khải ở đâu đêm lễ hội 1996', people: ['Ông Khải'],
    text: '"Đêm rằm năm ấy tôi sốt nặng, nằm nhà, không ra lễ. Nghe tiếng kẻng mới biết đình cháy."' },
  t_khai_khong_ham: { kind: 'tm', who: 'Ông Khải', title: 'Ông Khải: đình không có hầm', loc: 'Ông Khải', topics: ['ham'],
    about: 'đình có hầm hay không', people: ['Ông Khải'],
    text: '"Hồ sơ năm 95 tôi giữ cả. Đình làm gì có hầm, đất ven sông đào xuống là gặp nước."' },
  t_na_guong: { kind: 'tm', who: 'Bé Na', title: 'Bé Na: Vy nói chuyện với gương', loc: 'Đường xóm', topics: ['vy'],
    about: 'Vy làm gì trước khi mất liên lạc', people: ['Bé Na', 'Vy'],
    text: '"Chị Vy ngồi ở bến sông nói chuyện một mình. Chị bảo đang nói chuyện với cái gương. Mà cháu có thấy cái gương nào đâu."' }
};

// Phép đối chiếu đúng: một lời khai × một vật chứng. type 'contra' = mâu thuẫn, 'match' = khớp.
G.DEDUCTIONS = [
  { id: 'q_ly_rang', t: 't_ba_ly_rang', e: 'e_vet_ly', type: 'match', title: 'Ly trà thứ hai là thật',
    fact: 'Bác Ba nói mua ly thứ hai cho ông Rạng; bậc cửa nhà ông Rạng có vết ly đặt suốt nhiều năm.',
    guess: 'Bác Ba nói thật về ly trà. Nhưng sao bác không tự mang ra mà phải nhờ người khác?' },
  { id: 'q_ba_giau', t: 't_ba_khong_nho', e: 'e_ban_ve', type: 'contra', title: 'Bác Ba nói không nhớ cái hầm',
    fact: 'Bản vẽ ký tên Ba Mộc, chữ "hầm" và dòng "không đưa vào bản nộp" cùng một nét bút chì.',
    guess: 'Bác Ba nhớ rõ cái hầm. Có thể bác bị ai đó buộc phải im lặng. Nên hỏi lại bác về chữ "hầm".' },
  { id: 'q_ham', t: 't_khai_khong_ham', e: 'e_ban_ve', type: 'contra', title: 'Dưới đình có hầm hay không?',
    fact: 'Ông Khải nói đình không có hầm; bản vẽ gốc có ô "hầm" dưới gian thờ, bị tẩy khỏi bản nộp.',
    guess: 'Ông Khải giữ hồ sơ đình mà lại nói không có hầm. Ông không biết thật, hay không muốn ai biết?' },
  { id: 'q_khai_le', t: 't_khai_khong_le', e: 'e_anh_le_hoi', type: 'contra', title: 'Ông Khải có mặt ở lễ đêm cháy',
    fact: 'Ông Khải nói ốm nằm nhà; ảnh lễ hội có người đeo băng "Ban tế lễ" với nốt ruồi lớn dưới mắt trái giống ông.',
    guess: 'Ông Khải nói dối về chỗ mình ở đêm cháy đình. Nói dối chưa đủ để kết luận ông là thủ phạm, nhưng ông đang giấu điều gì đó.' },
  { id: 'q_khai_duyet', t: 't_ba_bi_dan', e: 'e_bien_ban', type: 'match', title: 'Người cho bỏ cái hầm là người duyệt hồ sơ',
    fact: 'Bác Ba nói người duyệt hồ sơ bảo bỏ cái hầm; biên bản nghiệm thu do Trưởng ban Nguyễn Văn Khải ký.',
    guess: 'Chính ông Khải cho bỏ cái hầm khỏi bản nộp. Cái hầm dưới gian thờ liên quan gì tới đêm cháy và những người mất tích?' }
];

// Cặp không phải phép đúng nhưng đáng có phản hồi riêng
G.PAIR_HINTS = {
  't_khai_khong_ham|e_bien_ban': 'Biên bản đúng là không có hầm, khớp lời ông Khải. Nhưng đây là bản nộp, và chính ông ký duyệt. Có bản nào khác không?',
  't_ba_khong_nho|e_bien_ban': 'Biên bản không có hầm nên không nói được gì về trí nhớ của bác Ba. Thứ có nét chữ của bác mới đáng xem.',
  't_na_guong|e_anh_le_hoi': 'Ảnh có Vy ở năm 1996, Na kể Vy nói chuyện với một cái gương. Lạ, nhưng chưa có gì để đối chiếu thẳng. Cần biết thêm về cái gương.'
};

G.addClue = function (id, extra) {
  var S = G.S;
  if (S.clues[id]) return false;
  S.clues[id] = Object.assign({ day: S.day, min: Math.floor(S.era ? S.pmin : S.min), isNew: true }, S.era ? { era: S.era, night: S.pnight || 1 } : {}, extra || {});
  G.ui.toast('Sổ điều tra +1: **' + G.CLUES[id].title + '**', 3200);
  G.ui.hud();
  return true;
};

// Trạng thái của một manh mối sau đối chiếu: null | 'contra' | 'match'
G.clueStatus = function (id) {
  var st = null;
  G.DEDUCTIONS.forEach(function (d) {
    if (G.S.deduce[d.id] && (d.t === id || d.e === id)) st = st === 'contra' ? 'contra' : d.type;
  });
  return st;
};

// Đối chiếu một lời khai với một vật chứng. Trả về {ok, d, msg}
G.tryDeduce = function (tId, eId) {
  var S = G.S, t = G.CLUES[tId], e = G.CLUES[eId];
  var d = G.DEDUCTIONS.filter(function (x) { return x.t === tId && x.e === eId; })[0];
  if (d) {
    var fresh = !S.deduce[d.id];
    if (fresh) S.deduce[d.id] = { day: S.day, min: Math.floor(S.min) };
    return { ok: true, d: d, fresh: fresh };
  }
  var hint = G.PAIR_HINTS[tId + '|' + eId];
  if (hint) return { ok: false, msg: hint };
  var shared = t.topics.filter(function (x) { return e.topics.indexOf(x) >= 0; });
  var msg = shared.length
    ? 'Hai thứ này cùng liên quan, nhưng không trái nhau mà cũng chưa xác nhận được gì. Lời khai nói về **' + t.about + '**; vật chứng cho thấy **' + e.about + '**.'
    : 'Không ăn nhập: lời khai nói về **' + t.about + '**, còn vật chứng cho thấy **' + e.about + '**.';
  var need = G.DEDUCTIONS.filter(function (x) { return x.t === tId && !S.deduce[x.id]; })[0];
  if (need && !S.clues[need.e]) msg += ' Có vẻ cần tìm thêm vật chứng về chuyện này.';
  return { ok: false, msg: msg };
};

// Đồng bộ bản lưu cũ: ai đã có bản vẽ thì có luôn vật chứng tương ứng
G.syncClues = function (S) {
  if (S.items.ban_ve_dinh && !S.clues.e_ban_ve) S.clues.e_ban_ve = { day: S.day, min: Math.floor(S.min), isNew: true };
  if (S.quests.ly_tra === 'done' && !S.clues.t_ba_ly_rang) S.clues.t_ba_ly_rang = { day: S.day, min: Math.floor(S.min), isNew: true };
  if (S.seen.na_guong && !S.clues.t_na_guong) S.clues.t_na_guong = { day: S.day, min: Math.floor(S.min), isNew: true };
};
