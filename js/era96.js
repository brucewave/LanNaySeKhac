// Bước 5: chiếc gương, đêm mốc 1 (mùng 8 tháng 8 âm lịch 1996, bảy ngày trước vụ cháy) và câu đố giấu vật qua hai thời điểm.
// Luật thời gian: một dòng thời gian cố định. Chỉ vật nhỏ có dấu gương mới qua được. Những gì người chơi làm năm 1996
// vốn đã xảy ra, nên dấu vết ở năm 2026 (hốc cây trát xi măng, ký ức của bác Tư) có sẵn từ đầu game.
var G = window.G || (window.G = {});

(function () {
  var h = G.scenes.h, rect = h.rect, ink = h.ink, txt = h.txt, INK = h.INK, CAP = h.CAP;
  function propSvg(x, y, w, hh, z, inner) {
    return { x: x, y: y, w: w, h: hh, z: z, svg: '<svg class="prop" viewBox="' + x + ' ' + y + ' ' + w + ' ' + hh + '" width="' + w + '" height="' + hh + '" overflow="visible">' + ink(inner) + '</svg>' };
  }
  function insertBefore(list, id, entries) {
    var i = list.findIndex(function (e) { return e.id === id; });
    list.splice(i < 0 ? list.length : i, 0, ...entries);
  }

  // ======================= ĐỒ, MANH MỐI, ĐỐI CHIẾU =======================
  Object.assign(G.KEY_ITEMS, {
    guong: { name: 'Gương đồng cổ', desc: 'Gương của mẹ, mặt sau khắc **mái đình**. [[Chỉ vật nhỏ có dấu của gương mới đi qua được.]]' },
    trang_so: { name: 'Trang sổ thu chi (1996)', desc: 'Xé từ sổ thu chi sửa đình. [[Không có dấu của gương: không mang qua gương được.]]' },
    trang_so_cu: { name: 'Trang sổ thu chi (ố vàng)', desc: 'Chính trang tôi giấu năm 1996, nằm trong hốc cây suốt 30 năm. "Chi riêng hầm: 12 bao xi măng, 3 triệu. K. nhận."' },
    duc: { name: 'Cái đục của bác Ba', desc: 'Mượn để đục lớp xi măng. Nhớ trả bác.' },
    bua: { name: 'Búa nhỏ', desc: 'Mua ở chỗ cô Lan.' }
  });

  Object.assign(G.CLUES, {
    e_tien_cu: { kind: 'ev', title: 'Tờ tiền 1991 và mẩu giấy', loc: 'Bến sông', source: 'Ông lão mũ cối đưa',
      people: ['Ông lão mũ cối'], topics: ['guong', 'rang'], about: 'một ông lão lạ chỉ chỗ giấu thứ gì đó dưới bến',
      text: 'Tờ 5.000 đồng in năm 1991, mới cứng, mép còn ướt nước sông. Mẩu giấy kèm theo: [["Dưới bến, cột thứ ba. Đừng để nó ướt."]] Ông lão đội mũ cối, quần ướt tới gối, rồi biến mất để lại một vệt nước.' },
    e_guong: { kind: 'ev', title: 'Gương đồng dưới bến', loc: 'Bến sông', source: 'Dưới cột thứ ba bến gỗ',
      people: ['Vy', 'Mẹ'], topics: ['guong', 'vy'], about: 'chiếc gương Vy để lại ở bến sông',
      text: 'Gương đồng bọc vải dầu, mặt sau khắc mái đình, quấn [[dây buộc tóc đỏ của Vy]]. Mặt gương [[phản chiếu một bầu trời có trăng]] dù trời không trăng.' },
    e_thu_me: { kind: 'ev', title: 'Lời nhắn của mẹ (1996)', loc: 'Nhà cũ · 1996', source: 'Mảnh giấy dưới đèn dầu',
      people: ['Mẹ'], topics: ['me', 'dinh96'], about: 'mẹ đêm đêm ra đình',
      text: 'Nét chữ mẹ: "Mẹ đi giao trà cho thợ sửa kiệu ở **đình**, khuya về. Con ngủ ngoan."' },
    e_nghe_96: { kind: 'ev', title: 'Nghe lén ở đình (1996)', loc: 'Đình làng · 1996', source: 'Tự tai nghe',
      people: ['Anh Khải (trẻ)', 'Một người thợ'], topics: ['ham', 'khai'], about: 'người ta lén đổ xi măng xuống hầm trước rằm',
      text: 'Người có [[nốt ruồi dưới mắt trái]], được gọi là "anh Khải", dặn thợ: [["Đổ xi măng xong trước rằm. Ai hỏi thì bảo gia cố nền."]] Thợ hỏi về "mấy cái bao dưới hầm" thì bị gạt đi.' },
    e_ham_96: { kind: 'ev', title: 'Nắp hầm dưới gian thờ (1996)', loc: 'Đình làng · 1996', source: 'Tự tay lật chiếu',
      people: [], topics: ['ham'], about: 'dưới gian thờ đình có hầm thật',
      text: 'Dưới tấm chiếu giữa gian thờ là [[nắp gỗ mới đóng]], khe hở bốc mùi xi măng ướt, bên dưới vọng tiếng nước nhỏ giọt.' },
    e_trang_so: { kind: 'ev', title: 'Trang sổ thu chi trong hốc cây', loc: 'Nhà cũ', source: 'Hốc cây bàng trước sân (tôi giấu năm 1996)',
      people: ['Ông Khải'], topics: ['tien', 'ham', 'khai'], about: 'tiền sửa đình bị chi riêng cho cái hầm',
      text: 'Giấy ố vàng nhưng còn đọc được: [["Chi riêng hầm: 12 bao xi măng, 3 triệu đồng. K. nhận. Không đưa vào sổ dân góp."]]' },
    t_vy_guong: { kind: 'tm', who: 'Vy (qua gương)', title: 'Vy: lời nhắn qua gương', loc: 'Nhà cũ', topics: ['vy', 'guong'],
      about: 'Vy đang ở đâu và muốn gì', people: ['Vy', 'Mẹ'],
      text: '"Anh đừng tìm em nữa. Người anh phải cứu là mẹ. Nhưng đừng để mẹ nhìn thấy mặt anh."' },
    t_khai_tien: { kind: 'tm', who: 'Ông Khải', title: 'Ông Khải: chi đúng từng đồng', loc: 'Ông Khải', topics: ['tien', 'khai'],
      about: 'tiền dân góp sửa đình năm 1995–1996', people: ['Ông Khải'],
      text: '"Tiền dân góp sửa đình năm ấy tôi chi đúng từng đồng, sổ sách công khai cả."' },
    t_do_96: { kind: 'tm', who: 'Bác Tư lái đò', title: 'Bác Tư: chàng trai đêm mùng tám', loc: 'Bến sông', topics: ['dinh96'],
      about: 'người bác chở sang đình đêm mùng 8/8/1996', people: ['Bác Tư', 'Tôi?'],
      text: '"Đêm mùng tám năm chín sáu, bác chở một cậu thanh niên sang đình. Giống cháu như đúc. Không có tiền đò, bác cho đi nhờ."' },
    t_ba_rang: { kind: 'tm', who: 'Bác Ba', title: 'Bác Ba: ông lão mũ cối', loc: 'Đường xóm', topics: ['rang'],
      about: 'ông lão mũ cối ở bến sông là ai', people: ['Bác Ba', 'Ông Rạng'],
      text: '"Mũ cối, áo bộ đội cũ... Ông Rạng đội cái mũ ấy suốt. Ông ấy chết đuối ở bến đêm cháy đình, ba mươi năm rồi."' }
  });

  G.DEDUCTIONS.push(
    { id: 'q_guong', t: 't_na_guong', e: 'e_guong', type: 'match', title: 'Vy đã dùng chiếc gương này',
      fact: 'Na thấy Vy nói chuyện với một cái gương ở bến sông; gương giấu dưới bến, quấn dây buộc tóc của Vy.',
      guess: 'Chiếc gương liên quan tới việc Vy biến mất. Phải thử nó, vào ban đêm như Vy đã làm. Đặt gương ở nhà rồi đợi tối.' },
    { id: 'q_vy_96', t: 't_vy_guong', e: 'e_anh_le_hoi', type: 'match', title: 'Vy đang ở năm 1996',
      fact: 'Giọng Vy vọng ra từ gương; ảnh lễ hội năm 1996 có Vy đúng tuổi bây giờ.',
      guess: 'Vy đã đi qua gương về năm 1996 để cứu mẹ. Người đeo mặt nạ cầm rìu trong ảnh là ai?' },
    { id: 'q_ham_96', t: 't_khai_khong_ham', e: 'e_ham_96', type: 'contra', title: 'Tôi đã tận mắt thấy cái hầm',
      fact: 'Ông Khải nói đình không có hầm; năm 1996 dưới chiếu gian thờ có nắp hầm mới đóng.',
      guess: 'Ông Khải biết rõ có hầm, vì chính ông cho đổ xi măng xuống đó trước rằm.' },
    { id: 'q_khai_tien', t: 't_khai_tien', e: 'e_trang_so', type: 'contra', title: 'Tiền sửa đình bị chi riêng',
      fact: 'Ông Khải nói chi đúng từng đồng; trang sổ ghi khoản riêng cho hầm, "K. nhận", không đưa vào sổ dân góp.',
      guess: 'Ông Khải lấy tiền dân góp làm một việc bí mật dưới hầm. Mấy cái bao dưới hầm là gì? Có liên quan tới những người mất tích năm ấy?' }
  );
  Object.assign(G.PAIR_HINTS, {
    't_khai_khong_ham|e_nghe_96': 'Nghe lén cho thấy có hầm và có đổ xi măng. Nhưng mình chỉ nghe, chưa nhìn tận mắt cái hầm năm 1996.',
    't_khai_tien|e_bien_ban': 'Biên bản là bản nộp, đẹp đẽ đúng như lời ông Khải. Cần sổ sách thật của năm ấy.'
  });

  // ======================= NPC MỚI =======================
  Object.assign(G.NPCS, {
    khach_la: { id: 'khach_la', name: 'Ông lão mũ cối', act: 'talk', label: 'Nói chuyện', cls: 'ghost', vanish: true,
      look: { hair: 'helmet', cap: '#58755C', shirt: '#4B5A3F', pants: '#3B4A3A', shoes: '#33363F', eyes: 'narrow' },
      cond: function (S) { return S.quests.ly_tra === 'done' && S.day > (S.flags.tea_day || 0) && !S.flags.got_note; }, // từ hôm sau ngày giao trà
      quest: function () { return true; },
      buyWant: ['tra_da'], buySay: 'Một ly trà đá.',
      onServed: function () { G.acts.stranger(true); },
      onDecline: function () { G.acts.stranger(false); },
      schedule: [{ t: '00:00', loc: null }, { t: '17:00', loc: 'ben_song', x: 600, y: 712, ay: -46, buy: true }, { t: '19:30', loc: null }] },
    tu_96: { id: 'tu_96', name: 'Anh Tư lái đò (1996)', act: 'ferry', label: 'Nhờ đò sang đình',
      look: { hair: 'short', shirt: '#3F6670', pants: '#4B5560', eyes: 'narrow' },
      schedule: [{ t: '00:00', loc: 'ben_96', x: 668, y: 800, ay: -52 }] },
    dan_96: { id: 'dan_96', name: 'Chị treo đèn lồng', act: 'talk', label: 'Nói chuyện',
      look: { hair: 'bun', shirt: '#857761', pants: '#33363F', eyes: 'tired' },
      schedule: [{ t: '00:00', loc: 'dinh_96', x: 250, y: 540 }] },
    khai_96: { id: 'khai_96', name: 'Anh Khải (1996)', act: 'none', label: '',
      look: { hair: 'short', shirt: '#C3CACD', pants: '#33363F', shoes: '#2E2925', eyes: 'flat', mole: true },
      cond: function (S) { return !S.flags.overheard; },
      schedule: [{ t: '00:00', loc: 'dinh_96', x: 580, y: 300 }] },
    tho_96: { id: 'tho_96', name: 'Người thợ (1996)', act: 'none', label: '',
      look: { hair: 'non_la', shirt: '#4B5560', eyes: 'tired' },
      cond: function (S) { return !S.flags.overheard; },
      schedule: [{ t: '00:00', loc: 'dinh_96', x: 640, y: 310 }] }
  });
  ['khach_la', 'tu_96', 'dan_96', 'khai_96', 'tho_96'].forEach(function (id) {
    G.NPCS[id].schedule.forEach(function (e) { e.from = G.parseTime(e.t); });
  });
  G.NPCS.bac_do.schedule[0].x = 668; G.NPCS.bac_do.schedule[0].y = 800;

  // ======================= ĐỊA ĐIỂM =======================
  G.LOCATIONS.ben_song.things.push(
    { id: 'cot_ben', x: 712, y: 866, hit: [696, 850, 34, 50], label: 'Xem dưới cột thứ ba', act: 'find_mirror',
      cond: function (S) { return !!S.flags.got_note && !S.items.guong; }, quest: function () { return true; } }
  );
  G.LOCATIONS.nha.things.push(
    { id: 'guong_nha', x: 375, y: 206, hit: [340, 80, 70, 84], act: 'mirror',
      label: function (S) { return S.flags.mirror_placed ? 'Gương đồng' : 'Đặt gương lên kệ'; },
      cond: function (S) { return !!S.items.guong; },
      quest: function (S) { return !S.flags.mirror_placed || (!!S.deduce.q_guong && !S.flags.night1_done && S.min >= 19 * 60); } },
    { id: 'goc_bang', x: 780, y: 362, hit: [744, 250, 76, 90], act: 'tree',
      label: function (S) { return S.flags.page_hidden && !S.clues.e_trang_so ? 'Đục hốc cây' : 'Xem gốc bàng'; },
      quest: function (S) { return !!S.flags.page_hidden && !S.clues.e_trang_so; } }
  );

  G.LOCATIONS.nha_96 = { id: 'nha_96', name: 'Nhà cũ · 1996', era: '1996', width: 960, height: 790, exits: { left: 'ben_96' }, things: [
    { id: 'guong_96', x: 375, y: 206, hit: [340, 80, 70, 84], label: 'Chạm vào gương để về', act: 'mirror_back',
      quest: function (S) { return !!S.flags.page_hidden; } },
    { id: 'tre_ngu', x: 546, y: 252, hit: [480, 104, 132, 116], label: 'Nhìn hai đứa trẻ', act: 'look', text: 'tre_ngu' },
    { id: 'thu_me', x: 255, y: 344, hit: [210, 262, 90, 50], label: 'Xem mảnh giấy', act: 'look', text: 'thu_me', clue: 'e_thu_me',
      quest: function (S) { return !S.clues.e_thu_me; } },
    { id: 'hoc_cay_96', x: 780, y: 362, hit: [744, 250, 76, 90], act: 'hide', spot: 'tree',
      label: function (S) { return S.items.trang_so ? 'Giấu trang sổ vào hốc cây' : 'Xem gốc bàng'; },
      quest: function (S) { return !!S.items.trang_so; } }
  ] };
  G.LOCATIONS.ben_96 = { id: 'ben_96', name: 'Bến sông · 1996', era: '1996', width: 960, height: 900, exits: { right: 'nha_96' }, things: [
    { id: 'cot_96', x: 712, y: 866, hit: [696, 850, 34, 50], label: 'Giấu trang sổ dưới cột bến', act: 'hide', spot: 'dock',
      cond: function (S) { return !!S.items.trang_so; } }
  ] };
  G.LOCATIONS.dinh_96 = { id: 'dinh_96', name: 'Đình làng · 1996', era: '1996', width: 960, height: 790, exits: {}, things: [
    { id: 'ben_dinh', x: 480, y: 676, label: 'Lên đò về bờ bên kia', act: 'ferry_back' },
    { id: 'chieu_ham', x: 480, y: 262, hit: [446, 196, 68, 52], label: 'Lật tấm chiếu', act: 'look', text: 'chieu_ham', clue: 'e_ham_96',
      quest: function (S) { return !S.clues.e_ham_96; } },
    { id: 'ban_tho_dinh', x: 480, y: 178, hit: [418, 94, 124, 60], act: 'hide', spot: 'dinh',
      label: function (S) { return S.items.trang_so ? 'Giấu trang sổ dưới bàn thờ' : 'Xem bàn thờ đình'; } },
    { id: 'so_thu_chi', x: 890, y: 372, hit: [848, 292, 84, 52], label: 'Xem cuốn sổ', act: 'ledger',
      quest: function (S) { return !S.items.trang_so && !S.flags.page_hidden; } }
  ] };

  // ======================= CẢNH =======================
  var B0 = G.scenes.Builder;
  function dirt(B) { // đường đất năm 1996 phủ lên đường nhựa
    var W = B.W, s = rect(0, 430, W, 230, '#2B2723', ' stroke="none"');
    for (var x = 0; x < W; x += 70) s += '<path class="d" d="M' + x + ',' + (560 + (x % 3) * 22) + ' q20,-4 40,0" stroke="#3B342E"/>';
    s += rect(0, 660, W, 70, '#302B26', ' stroke="none"');
    B.bg += ink(s);
  }
  function warmGlow(B, x, y, rx, ry) { B.glow += '<ellipse class="glow" cx="' + x + '" cy="' + y + '" rx="' + (rx || 90) + '" ry="' + (ry || 50) + '" fill="url(#lampW)"/>'; }
  function lantern(B, x, y) { // đèn dầu treo cột
    warmGlow(B, x, y + 8, 80, 40);
    B.prop(x - 20, y - 130, 40, 136, '<path d="M' + x + ',' + y + ' V' + (y - 110) + '" stroke-width="6"/><path d="M' + x + ',' + y + ' V' + (y - 110) + '" stroke="#4A4038" stroke-width="2.5"/>' +
      rect(x - 9, y - 118, 18, 22, '#E2B060', ' stroke-width="2"'), y + 2);
    B.solid(x - 5, y - 8, 10, 10);
  }

  // Thêm dấu vết vào cảnh hiện tại: gương trên tủ, lớp xi măng ở hốc cây bàng (có từ đầu game)
  // kệ gỗ sát giường, chỗ đặt gương đồng (ở cả nhà bây giờ lẫn năm 1996)
  function mirrorStand(sc) {
    h.addBg(sc, h.rect(342, 136, 66, 12, '#6A4A40') + h.rect(346, 148, 58, 24, '#4A3532') + h.rect(350, 152, 50, 9, '#3A2622', ' stroke-width="1.2"') +
      '<circle cx="375" cy="156" r="2" fill="#C8B080" stroke="none"/>' + h.rect(348, 172, 6, 6, '#2E2420') + h.rect(396, 172, 6, 6, '#2E2420') +
      '<path d="M346,136 q8,6 16,0 t16,0 t16,0 t16,0" fill="#D5DCE0" stroke-width="1.2" opacity=".85"/>'); // kệ gỗ có ngăn kéo, khăn ren
    sc.solids.push([344, 140, 62, 36]);
  }
  G.mirrorStand = mirrorStand;
  var nhaNow = G.scenes.nha;
  G.scenes.nha = function (W, H) {
    var sc = nhaNow(W, H), S = G.S;
    mirrorStand(sc); // kệ gỗ đặt gương (mặt gương do details.js vẽ khi đã có gương)
    var found = S && S.clues.e_trang_so;
    sc.props.push(propSvg(770, 286, 30, 30, 331, found ? '<ellipse cx="786" cy="300" rx="8" ry="10" fill="' + INK + '" stroke-width="2"/>'
      : '<ellipse cx="786" cy="300" rx="9" ry="11" fill="#8C949B" stroke-width="2"/><path class="d" d="M780,296 l10,6M782,306 l6,-4"/>'));
    return sc;
  };

  G.scenes.nha_96 = function (W, H) {
    var B = new B0(W, H), r = G.scenes.rng(23);
    B.streets(true); dirt(B);
    B.closed(0, 120, 50, 310, { roof: 'url(#roof)' });
    B.closed(900, 150, 60, 280, { roof: 'url(#roof)' });
    B.solid(0, 0, W, 62); B.solid(50, 0, 20, 430);
    B.room(70, 60, 560, 370, 'url(#wood)', [[220, 300]]);
    var f = rect(440, 104, 12, 120, CAP); B.solid(440, 104, 12, 120);
    // bàn thờ ông bà (hai ảnh), nến đỏ đang cháy
    f += G.furn.altar(195, 98, 120, 46, { photos: 2 });
    f += rect(210, 88, 6, 14, '#A32E36', ' stroke-width="1.5"') + rect(294, 88, 6, 14, '#A32E36', ' stroke-width="1.5"');
    f += '<circle cx="213" cy="84" r="3" fill="#F2C230" stroke="none"/><circle cx="297" cy="84" r="3" fill="#F2C230" stroke="none"/>';
    B.solid(195, 98, 120, 46);
    // lịch treo tường
    f += G.furn.calendar(158, 64, 8);
    // giường có màn, hai đứa trẻ ngủ
    f += G.furn.bed(480, 104, 132, 116, { kids: true });
    f += '<ellipse cx="525" cy="160" rx="18" ry="12" fill="#C3CACD" stroke-width="2"/><ellipse cx="565" cy="166" rx="14" ry="10" fill="#C3CACD" stroke-width="2"/>';
    f += '<circle cx="520" cy="140" r="8" fill="' + INK + '" stroke="none"/><circle cx="563" cy="148" r="7" fill="' + INK + '" stroke="none"/>';
    f += rect(476, 100, 140, 124, '#D5DCE0', ' fill-opacity=".18" stroke-width="1.5"');
    B.solid(480, 104, 132, 116);
    // tủ gỗ (gương của mẹ để trên kệ cạnh giường)
    f += G.furn.wardrobe(86, 104, 70, 90);
    B.solid(86, 104, 70, 90);
    B.bg += ink(f);
    warmGlow(B, 255, 290, 120, 70);
    B.prop(180, 250, 150, 72, G.furn.teaTable(215, 272, 80, 38, { era: true }) + rect(250, 258, 10, 14, '#E2B060', ' stroke-width="1.5"') + rect(226, 284, 18, 12, '#D5DCE0', ' stroke-width="1.2"'), 312); // đèn dầu + lá thư của mẹ trên bàn
    B.solid(210, 278, 90, 32);
    // sân: xe trà của mẹ còn mới, cây bàng có hốc hở
    var y = rect(630, 120, 270, 310, '#232C2A');
    for (var x = 634; x < 900; x += 22) y += '<path d="M' + x + ',134 V110" stroke-width="5"/>';
    y += '<path d="M630,116 H900M630,128 H900" stroke-width="3"/>';
    y += rect(660, 330, 70, 40, '#A32E36') + rect(660, 312, 70, 18, '#6F86A0', ' fill-opacity=".5"') + '<circle cx="672" cy="374" r="9" fill="#33363F"/><circle cx="718" cy="374" r="9" fill="#33363F"/>';
    B.bg += ink(y);
    B.solid(630, 0, 270, 134); B.solid(660, 312, 70, 60);
    B.tree(780, 330);
    B.props.push(propSvg(770, 286, 30, 30, 331, '<ellipse cx="786" cy="300" rx="8" ry="10" fill="' + INK + '" stroke-width="2"/>'));
    lantern(B, 640, 534);
    B.southRoofs(r);
    return B.done();
  };

  G.scenes.ben_96 = function (W, H) {
    var B = new B0(W, H), r = G.scenes.rng(11);
    B.streets(true); dirt(B);
    B.closed(40, 150, 280, 280, { roof: 'url(#roof)' }); // nhà ông Rạng, còn người ở
    B.bg += ink(rect(150, 380, 40, 26, '#E2B060', ' fill-opacity=".7"') + txt(180, 372, 13, '#C3CACD', '9'));
    B.closed(350, 200, 250, 230, { roof: 'url(#roofG)' });
    B.solid(0, 0, W, 150);
    var b = rect(0, 730, W, 22, '#3A4552') + rect(0, 752, W, H - 752, 'url(#water)') + rect(0, 860, W, H - 860, '#141A20');
    // bờ bên kia: đình còn nguyên, đèn lồng sáng
    b += '<g transform="translate(700,-100)"><path d="M0,1000 L36,960 H204 L240,1000 Z" fill="#3A2E2A"/><path d="M-12,962 Q16,950 36,960M204,960 Q226,950 252,962" fill="none" stroke-width="2.5"/>' +
      '<circle cx="60" cy="975" r="5" fill="#A32E36" stroke-width="1.5"/><circle cx="120" cy="972" r="5" fill="#A32E36" stroke-width="1.5"/><circle cx="180" cy="975" r="5" fill="#A32E36" stroke-width="1.5"/></g>';
    b += rect(640, 726, 100, 164, '#3B2E26');
    for (var p = 650; p < 740; p += 30) b += '<path d="M' + p + ',890 v10" stroke-width="5"/>';
    b += '<g transform="translate(-200,-110)"><path d="M950,872 Q1040,846 1150,872 L1136,920 Q1040,940 964,920 Z" fill="#4A4038"/></g>';
    for (var k = 0; k < 14; k++) { var rx = 30 + k * 46 + r() * 20; if (rx > 610) break; b += '<path class="d" d="M' + rx.toFixed(0) + ',756 q-6,-24 ' + (r() * 12 - 6).toFixed(0) + ',-' + (30 + r() * 20).toFixed(0) + '" stroke="#58755C" stroke-width="3"/>'; }
    B.bg += ink(b);
    warmGlow(B, 820, 870, 160, 40);
    B.solid(0, 740, 640, H - 740); B.solid(740, 740, W - 740, H - 740); B.solid(640, 892, 100, 20);
    B.tree(690, 400); B.tree(880, 340);
    lantern(B, 620, 722);
    return B.done();
  };

  G.scenes.dinh_96 = function (W, H) {
    var B = new B0(W, H), r = G.scenes.rng(77);
    B.bg += rect(0, 0, W, H, '#1B222C');
    B.solid(-50, 0, 50, H); B.solid(W, 0, 50, H); B.solid(0, 0, W, 60);
    B.bg += ink(rect(0, 430, W, 280, 'url(#pave)', ' stroke="none"'));
    // gian đình bỏ mái: gian thờ, kiệu, trống, nắp hầm dưới chiếu
    B.room(160, 60, 600, 370, 'url(#tileF)', [[420, 540]]);
    var g = rect(418, 96, 124, 54, '#5A2A2A') + rect(418, 96, 124, 12, '#948C5E');
    g += rect(440, 74, 16, 26, '#948C5E', ' stroke-width="1.5"') + rect(504, 74, 16, 26, '#948C5E', ' stroke-width="1.5"');
    g += '<circle cx="448" cy="70" r="3" fill="#F2C230" stroke="none"/><circle cx="512" cy="70" r="3" fill="#F2C230" stroke="none"/>';
    g += rect(446, 196, 68, 48, '#857761') + '<path class="d" d="M446,208 h68M446,220 h68M446,232 h68"/>';
    g += rect(200, 170, 110, 70, '#A32E36') + '<path d="M196,170 l14,-16 h90 l14,16" fill="#6A2A2A"/><path class="d" d="M200,200 h110"/>';
    g += '<circle cx="690" cy="190" r="26" fill="#6A5846"/><circle cx="690" cy="190" r="16" fill="#C3CACD" stroke-width="2"/>';
    B.bg += ink(g);
    B.solid(418, 96, 124, 54); B.solid(196, 160, 118, 82); B.solid(664, 164, 52, 52);
    warmGlow(B, 480, 160, 140, 80);
    // kho bên phải: cuốn sổ thu chi trên bàn
    B.room(790, 150, 160, 280, 'url(#wood)', [[840, 900]]);
    var k = rect(806, 210, 30, 120, '#4A3532') + '<path class="d" d="M806,240 h30M806,270 h30M806,300 h30"/>';
    k += rect(848, 296, 84, 44, '#5A4A3C') + rect(870, 304, 34, 24, '#D5DCE0', ' stroke-width="1.5"') + '<path class="d" d="M887,304 v24"/>';
    B.bg += ink(k);
    B.solid(806, 210, 30, 120); B.solid(848, 296, 84, 44);
    B.bg += ink(rect(300, 6, 360, 46, '#5A2A2A') + txt(480, 38, 22, '#E2D2A0', 'ĐÌNH LÀNG'));
    // sông và bến
    B.bg += ink(rect(0, 700, W, H - 700, 'url(#water)') + rect(430, 650, 100, H - 650, '#3B2E26'));
    B.solid(0, 705, 430, H - 705); B.solid(530, 705, W - 530, H - 705);
    B.tree(70, 520);
    // dây đèn lồng đỏ chăng qua sân
    var fg = '<path d="M0,420 Q240,480 480,430 T960,420" fill="none" stroke-width="1.6"/>';
    for (var i = 1; i < 12; i++) {
      var lx = i * 80, ly = 420 + Math.sin(i / 11 * Math.PI * 2) * 18 + 28;
      fg += '<ellipse cx="' + lx + '" cy="' + ly + '" rx="9" ry="12" fill="#A32E36" stroke-width="2"/>';
      warmGlow(B, lx, ly + 90, 60, 30);
    }
    B.fgs += fg;
    lantern(B, 400, 640); lantern(B, 560, 640);
    return B.done();
  };

  // ======================= LỜI THOẠI =======================
  Object.assign(G.TEXT, {
    stranger: [
      { text: 'Một ông lão đội **mũ cối**, áo bộ đội cũ bạc màu. Quần [[ướt sũng tới gối]], như vừa lội sông lên.' },
      { who: 'Ông lão', text: 'Trà của con bé Hạnh... vẫn vị ấy.' },
      { who: 'Ông lão', text: '[[Cảm ơn cháu đã mang trà tới nhà tôi.]]' },
      { text: 'Ông đặt lên xe một tờ **5.000 đồng in năm 1991**, mới cứng, mép còn ướt. Kẹp kèm một mẩu giấy.' },
      { text: 'Mẩu giấy viết: [["Dưới bến, cột thứ ba. Đừng để nó ướt."]]' },
      { text: 'Tôi ngẩng lên. Ông ấy đã không còn ở đó. Trên mặt đất chỉ có [[một vệt nước kéo dài xuống sông]].' }
    ],
    find_mirror: [
      { text: 'Dưới cột thứ ba của bến gỗ có một bọc vải dầu buộc chặt, nhét sát mặt nước.' },
      { text: 'Bên trong là một **chiếc gương đồng** to bằng bàn tay, mặt sau khắc hình [[mái đình]].' },
      { text: 'Quấn quanh cán gương là [[sợi dây buộc tóc màu đỏ của Vy]].' },
      { text: 'Mặt gương không soi rõ mặt tôi. Nó phản chiếu [[một bầu trời có trăng]], dù đêm nay trời tối đen.' },
      { who: 'Tôi', text: 'Cái gương này... hồi nhỏ mẹ hay để trên nóc tủ.' }
    ],
    mirror_place: [{ text: 'Tôi đặt chiếc gương lên cái kệ gỗ cạnh giường, đúng chỗ ngày xưa mẹ vẫn để.' }],
    mirror_idle: [{ text: 'Chiếc gương lặng im. Mình còn chưa hiểu Vy đã làm gì với nó. (Xem lại Sổ điều tra.)' }],
    mirror_day: [{ text: 'Mặt gương chỉ là đồng xỉn. Na kể Vy ngồi với gương lúc trời tối. Phải đợi đêm (sau **19:00**).' }],
    mirror_done: [{ text: 'Mặt gương mờ đục. Đêm mốc tiếp theo chưa tới.' }],
    mirror_voice: [
      { text: 'Mặt gương gợn lên như mặt nước. Từ trong đó vọng ra một giọng nói rất khẽ.' },
      { who: 'Vy', text: '[[Anh đừng tìm em nữa. Người anh phải cứu là mẹ.]]' },
      { who: 'Vy', text: '[[Nhưng đừng để mẹ nhìn thấy mặt anh.]]' },
      { who: 'Tôi', text: 'Vy! Vy, em ở đâu?' },
      { text: 'Không ai trả lời. Mặt gương sáng dần: một dòng sông đêm, [[mái đình còn nguyên]], đèn lồng đỏ.' }
    ],
    arrive96: [
      { text: 'Tôi ngã ra sàn gỗ. Mùi nhang trầm, mùi dầu hoả. Tiếng ve ran ngoài sân.' },
      { text: 'Tờ lịch trên tường: [[Thứ Hai, mùng 8 tháng 8 Âm lịch, 1996]]. Bảy ngày trước đêm rằm.' },
      { text: 'Chiếc gương nằm trên nóc tủ, mới tinh. Xe hàng của tôi thì ở lại năm 2026: [[chỉ vật nhỏ có dấu gương mới qua được]].' }
    ],
    tre_ngu: [
      { text: 'Sau màn tuyn, hai đứa trẻ ngủ say. Thằng anh chừng ba tuổi, ôm khư khư cái quạt nan. Con bé em mút tay.' },
      { text: 'Tôi đứng rất lâu. [[Đứa lớn là tôi.]]' }
    ],
    thu_me: [
      { text: 'Mảnh giấy dưới đèn dầu, nét chữ mẹ:' },
      { text: '"Mẹ đi giao trà cho thợ sửa kiệu ở **đình**, khuya về. Con ngủ ngoan."' }
    ],
    tree96_look: [{ text: 'Gốc bàng còn non, có [[một hốc nhỏ vừa lọt bàn tay]]. Chưa ai trát gì lên cả.' }],
    overheard: [
      { text: 'Trong gian đình có hai người đang nói chuyện. Tôi nép sau cột.' },
      { who: 'Người đàn ông', text: 'Đổ xi măng cho xong [[trước rằm]]. Ai hỏi thì bảo [[gia cố nền]].' },
      { who: 'Người thợ', text: 'Thế còn [[mấy cái bao dưới hầm]], anh Khải?' },
      { who: 'Anh Khải', text: 'Không phải việc của chú. Về đi.' },
      { text: 'Người đàn ông quay ra. Dưới ánh đèn lồng: [[nốt ruồi lớn dưới mắt trái]]. Ông Khải, trẻ hơn ba mươi tuổi.' },
      { text: 'Hai người đi ra cổng sau. Gian đình chỉ còn tiếng nến nổ lách tách.' }
    ],
    chieu_ham: [
      { text: 'Giữa gian thờ, một tấm chiếu cói trải lệch.' },
      { text: 'Tôi lật mép chiếu: [[một nắp gỗ mới đóng]]. Khe hở bốc mùi xi măng ướt.' },
      { text: 'Bên dưới vọng lên tiếng nước nhỏ giọt. Và một thứ gì đó giống tiếng thở.' },
      { text: 'Tôi đặt chiếu lại như cũ. Đêm nay chưa phải lúc.' }
    ],
    dinh_look: [{ text: 'Bàn thờ đình sơn son thếp vàng, nến cháy đều. [[Bảy ngày nữa, chỗ này sẽ thành tro.]]' }],
    ledger: [
      { text: 'Cuốn **sổ thu chi tu sửa đình**, chữ viết tay.' },
      { text: 'Phần lớn là tiền dân góp: gạch, ngói, sơn son, công thợ.' },
      { text: 'Một trang ghi riêng: [["Chi riêng hầm: 12 bao xi măng, 3 triệu đồng. K. nhận. Không đưa vào sổ dân góp."]]', choices: [
        { text: 'Xé trang này mang theo', run: function (S) {
          S.items.trang_so = true;
          G.ui.dialog([{ text: 'Tôi xé trang sổ, gấp làm tư.' },
            { text: 'Nhưng trang giấy [[không có dấu của gương]]. Mang qua gương thì nó sẽ rơi lại đây. Phải giấu nó ở đâu đó, [[chỗ còn nguyên tới năm 2026]].' }]);
        } },
        { text: 'Để nguyên', run: function () {} }
      ] }
    ],
    ledger_torn: [{ text: 'Cuốn sổ thiếu một trang, chỗ tôi đã xé.' }],
    hide_dock: [{ who: 'Tôi', text: 'Bến gỗ ngâm nước quanh năm. Ba mươi năm nữa cột này mục, [[bến đã làm lại]]. Giấu ở đây thì mất.' }],
    hide_dinh: [{ who: 'Tôi', text: '[[Bảy ngày nữa đình cháy.]] Giấu ở đây thì cháy theo.' }],
    hide_tree: [
      { text: 'Tôi gấp trang sổ, bọc kín trong mảnh ni lông, nhét sâu vào hốc cây bàng.' },
      { text: 'Năm 2026, cây bàng này vẫn đứng trước sân. [[Hốc cây đã bị trát xi măng từ lâu]]. Nghĩa là trang sổ đã nằm sau lớp xi măng đó suốt ba mươi năm.' },
      { who: 'Tôi', text: 'Về thôi. Gương ở trên nóc tủ.' }
    ],
    back_page: [{ text: 'Tôi giơ trang sổ lên trước gương. Tay tôi đi qua, trang giấy thì bị đẩy bật lại. [[Trang sổ không mang dấu của gương.]] Phải giấu nó ở chỗ còn nguyên tới năm 2026.' }],
    back_early: [{ text: 'Mặt gương mờ đục, chưa có lối về. Đêm nay mình qua đây hẳn có lý do. Mẹ ở **đình**.' }],
    back_go: [
      { text: 'Tôi đặt tay lên mặt gương. Lạnh buốt.' },
      { text: 'Lần cuối, tôi nhìn hai đứa trẻ trên giường. Thằng bé trở mình, vẫn không buông cái quạt nan.' }
    ],
    tree_look: [{ text: 'Gốc bàng già có một hốc nhỏ [[đã bị trát xi măng từ lâu]], chắc để chống mối.' }],
    tree_tool: [{ who: 'Tôi', text: 'Phải đục lớp xi măng này. Bác Ba làm mộc chắc có **cái đục**; hoặc mua tạm **cái búa** ở chỗ cô Lan.' }],
    tree_open: [
      { text: 'Tôi đục từng chút lớp xi măng cũ. Bên trong, mảnh ni lông đã ngả vàng.' },
      { text: 'Trang sổ vẫn còn, giấy ố, mực phai nhưng đọc được: [["Chi riêng hầm: 12 bao xi măng, 3 triệu đồng. K. nhận."]]' },
      { who: 'Tôi', text: 'Mình giấu nó ba mươi năm trước. Và nó đã nằm đây ngay từ ngày đầu mình về.' }
    ],
    tree_empty: [{ text: 'Hốc cây giờ trống, vụn xi măng rơi đầy gốc.' }]
  });

  insertBefore(G.DIALOGUE.bac_do, 'do_idle', [
    { id: 'do_96', once: true, cond: function (S) { return !!S.flags.night1_done; }, lines: [
      { who: 'Bác Tư lái đò', text: 'Bác nhớ ra rồi. [[Đêm mùng tám năm chín sáu]], bác chở một cậu thanh niên sang đình.' },
      { who: 'Bác Tư lái đò', text: '[[Giống cháu như đúc.]] Cậu ta không có tiền đò, bác cho đi nhờ. Lâu quá bác cứ ngỡ mình nhớ nhầm.' }
    ], after: function () { G.addClue('t_do_96'); } },
    { id: 'do_quen', once: true, cond: function (S) { return !S.flags.night1_done; }, lines: [
      { who: 'Bác Tư lái đò', text: 'Mà lạ, [[mặt cháu nhìn quen quen]]. Như bác gặp ở đâu rồi ấy.' },
      { who: 'Bác Tư lái đò', text: 'À, bến này làm lại năm 2010 đấy. Cột cũ mục hết, vứt cả.' }
    ] }
  ]);
  insertBefore(G.DIALOGUE.bac_ba, 'ba_buy', [
    { id: 'ba_khach', once: true, cond: function (S) { return !!S.flags.got_note; }, lines: [
      { who: 'Tôi', text: 'Bác ơi, chiều nay ở bến có một ông lão đội mũ cối, quần ướt sũng. Ông ấy cảm ơn cháu đã mang trà tới nhà.' },
      { text: 'Bác Ba đánh rơi cái bào.' },
      { who: 'Bác Ba', text: 'Mũ cối, áo bộ đội cũ... [[Ông Rạng đội cái mũ ấy suốt.]]' },
      { who: 'Bác Ba', text: 'Ông ấy [[chết đuối ở bến đêm cháy đình]], ba mươi năm rồi cháu ạ.' }
    ], after: function () { G.addClue('t_ba_rang'); } },
    { id: 'ba_duc', cond: function (S) { return !!S.flags.need_tool && !S.items.duc && !S.items.bua; }, lines: [
      { who: 'Bác Ba', text: 'Đục à? Bác có thừa. Cầm lấy, xong nhớ trả bác. (Đã nhận: **Cái đục**)' }
    ], after: function (S) { S.items.duc = true; } }
  ]);
  insertBefore(G.DIALOGUE.ong_khai, 'khai_ham', [
    { id: 'khai_tien', cond: function (S) { return !!S.flags.night1_done && !S.clues.t_khai_tien; }, lines: [
      { who: 'Tôi', text: 'Bác Khải, tiền dân góp sửa đình năm ấy chi những gì ạ?' },
      { who: 'Ông Khải', text: 'Tiền dân góp sửa đình năm ấy [[tôi chi đúng từng đồng]], sổ sách công khai cả.' },
      { who: 'Ông Khải', text: 'Sao dạo này cậu hỏi chuyện cũ nhiều thế?' }
    ], after: function () { G.addClue('t_khai_tien'); } }
  ]);
  G.DIALOGUE.khach_la = [{ id: 'kl', direct: function () { G.acts.stranger(false); } }];
  G.DIALOGUE.dan_96 = [
    { id: 'dan1', once: true, lines: [
      { who: 'Chị treo đèn', text: 'Cậu ở xóm nào? Lạ mặt thế. Rằm này lễ to lắm, có rước kiệu.' },
      { who: 'Chị treo đèn', text: 'Chị Hạnh bán trà mới qua đây đấy, giao trà cho thợ rồi về rồi.' }
    ] },
    { id: 'dan2', lines: [{ who: 'Chị treo đèn', text: 'Đèn lồng phải treo xong trước rằm. Anh Khải dặn kỹ lắm.' }] }
  ];
  G.DIALOGUE.tu_96 = [{ id: 'tu', direct: function () { G.acts.ferry(); } }];

  // ======================= MỤC TIÊU =======================
  var iUp = G.OBJECTIVES.findIndex(function (o) { return o.id === 'nang_cap'; });
  G.OBJECTIVES.splice(iUp, 0,
    { id: 'khach_la', text: function (S) { return (S.day > (S.flags.tea_day || 0) ? 'Chiều tối nay' : 'Từ ngày mai, chiều tối') + ' (17:00–19:30) ra bến sông. Có người lạ đang đợi'; }, done: function (S) { return !!S.flags.got_note; } },
    { id: 'tim_guong', text: 'Làm theo mẩu giấy: xem dưới cột thứ ba của bến gỗ', done: function (S) { return !!S.items.guong; } },
    { id: 'doi_guong', text: 'Đối chiếu lời bé Na với chiếc gương trong Sổ điều tra', done: function (S) { return !!S.deduce.q_guong; } },
    { id: 'dung_guong', text: 'Mang gương về nhà, đặt lên tủ. Sau 19:00 chạm vào gương', done: function (S) { return !!S.past.n1; } },
    { id: 'dinh96', text: 'Năm 1996: tìm hiểu đình làng (nhờ đò ở bến sông)', done: function (S) { return !!S.items.trang_so || !!S.flags.page_hidden; } },
    { id: 'giau_trang', text: 'Trang sổ không qua được gương. Giấu nó ở chỗ còn nguyên tới năm 2026', done: function (S) { return !!S.flags.page_hidden; } },
    { id: 've_2026', text: 'Về nhà, chạm vào gương trên nóc tủ để trở về', done: function (S) { return !!S.flags.night1_done; } },
    { id: 'lay_trang', text: 'Năm 2026: lấy lại trang sổ đã giấu (cần đồ đục xi măng: bác Ba hoặc cô Lan)', done: function (S) { return !!S.clues.e_trang_so; } },
    { id: 'doi_tien', text: 'Hỏi ông Khải về tiền sửa đình, rồi đối chiếu với trang sổ', done: function (S) { return !!S.deduce.q_khai_tien; } }
  );
  G.OBJECTIVES[G.OBJECTIVES.length - 1].text = 'Hết phần chơi thử bước 5. Bán tiếp, trò chuyện, xem lại Sổ điều tra tùy ý.';

  // ======================= HÀNH ĐỘNG =======================
  function fadeTo(fn) {
    var f = document.getElementById('fade');
    f.classList.add('on'); G.ui.modal = 'fade';
    setTimeout(function () { G.ui.modal = null; fn(); f.classList.remove('on'); }, 900);
  }
  G.acts = {
    stranger: function (served) {
      var lines = served ? G.TEXT.stranger
        : [G.TEXT.stranger[0], { who: 'Ông lão', text: 'Cho tôi ngồi một lát, cháu.' }].concat(G.TEXT.stranger.slice(2));
      G.ui.dialog(lines, function () { G.S.flags.got_note = true; G.addClue('e_tien_cu'); });
    },
    find_mirror: function () {
      G.ui.dialog(G.TEXT.find_mirror, function () {
        G.S.items.guong = true; G.ui.toast('Đã nhận: **Gương đồng cổ**'); G.addClue('e_guong');
      });
    },
    mirror: function () {
      var S = G.S;
      if (!S.flags.mirror_placed) { G.ui.dialog(G.TEXT.mirror_place, function () { S.flags.mirror_placed = true; G.world.enter(S.loc, S.x, S.y); }); return; }
      if (S.flags.night1_done) { G.ui.dialog(G.TEXT.mirror_done); return; }
      if (!S.deduce.q_guong) { G.ui.dialog(G.TEXT.mirror_idle); return; }
      if (S.min < 19 * 60) { G.ui.dialog(G.TEXT.mirror_day); return; }
      var ask = [{ text: 'Mặt gương sáng lên: dòng sông đêm, mái đình còn nguyên, đèn lồng đỏ.', choices: [
        { text: 'Chạm vào mặt gương', run: function () { G.acts.goPast(); } },
        { text: 'Chưa, để chuẩn bị đã', run: function () {} }
      ] }];
      if (!S.clues.t_vy_guong) G.ui.dialog(G.TEXT.mirror_voice, function () { G.addClue('t_vy_guong'); G.ui.dialog(ask); });
      else G.ui.dialog(ask);
    },
    goPast: function () {
      var S = G.S;
      fadeTo(function () {
        S.era = '1996'; S.pnight = 1; S.pmin = 21 * 60 + 30; S.past.n1 = 'active'; S.view = 'front';
        G.world.enter('nha_96', 121, 240);
        G.save();
        G.ui.dialog(G.TEXT.arrive96);
      });
    },
    mirror_back: function () {
      var S = G.S;
      if (S.items.trang_so) { G.ui.dialog(G.TEXT.back_page); return; }
      if (!S.flags.page_hidden) { G.ui.dialog(G.TEXT.back_early); return; }
      G.ui.dialog(G.TEXT.back_go, function () {
        S.era = null; S.past.n1 = 'done'; S.flags.night1_done = true;
        G.world.endDay('Tôi ngã ra khỏi gương, nằm trên sàn nhà cũ tới sáng.');
      });
    },
    ferry: function () {
      G.ui.dialog([
        { who: 'Anh Tư', text: 'Sang đình hả? Đêm lễ chở nhiều người lắm. Hai nghìn.' },
        { who: 'Tôi', text: 'Tôi... không có tiền đò.' },
        { who: 'Anh Tư', text: 'Thôi, mùa lễ, [[cho đi nhờ]]. Lên đi.', choices: [
          { text: 'Lên đò sang đình', run: function () { fadeTo(function () { G.world.enter('dinh_96', 480, 676); G.acts.dinhArrive(); }); } },
          { text: 'Để lát nữa', run: function () {} }
        ] }
      ]);
    },
    dinhArrive: function () {
      var S = G.S;
      if (S.flags.overheard) return;
      G.ui.dialog(G.TEXT.overheard, function () { S.flags.overheard = true; G.addClue('e_nghe_96'); });
    },
    ferry_back: function () { fadeTo(function () { G.world.enter('ben_96', 690, 760); }); },
    ledger: function () {
      var S = G.S;
      if (S.items.trang_so || S.flags.page_hidden) G.ui.dialog(G.TEXT.ledger_torn);
      else G.ui.dialog(G.TEXT.ledger);
    },
    hide: function (t) {
      var S = G.S;
      if (!S.items.trang_so) {
        if (t.spot === 'tree') G.ui.dialog(G.TEXT.tree96_look);
        else if (t.spot === 'dinh') G.ui.dialog(G.TEXT.dinh_look);
        return;
      }
      if (t.spot === 'dock') G.ui.dialog(G.TEXT.hide_dock);
      else if (t.spot === 'dinh') G.ui.dialog(G.TEXT.hide_dinh);
      else G.ui.dialog(G.TEXT.hide_tree, function () { delete S.items.trang_so; S.flags.page_hidden = true; });
    },
    tree: function () {
      var S = G.S;
      if (S.clues.e_trang_so) { G.ui.dialog(G.TEXT.tree_empty); return; }
      if (!S.flags.page_hidden) { G.ui.dialog(G.TEXT.tree_look); return; }
      if (!S.items.duc && !S.items.bua) { G.ui.dialog(G.TEXT.tree_tool, function () { S.flags.need_tool = true; }); return; }
      G.ui.dialog(G.TEXT.tree_open, function () {
        S.items.trang_so_cu = true;
        G.addClue('e_trang_so');
        G.world.enter(S.loc, S.x, S.y);
      });
    }
  };
})();
