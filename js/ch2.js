// Chương 2: Em gái không bị bắt cóc.
// Cô Lan giấu một phần sự thật vì sợ (không phải kẻ ác); bà Năm hỏi con mỗi sáng (kinh dị có lời giải);
// đêm mốc 3 (mùng 11/8/1996) Vy gửi hộp thiếc ở tạp hoá cô Lan; thư của Vy: "người được chọn" và người đeo mặt nạ.
var G = window.G || (window.G = {});

(function () {
  var h = G.scenes.h, rect = h.rect, ink = h.ink, txt = h.txt, INK = h.INK, CAP = h.CAP;
  var B0 = G.scenes.Builder;
  function insertBefore(list, id, entries) {
    var i = list.findIndex(function (e) { return e.id === id; });
    list.splice(i < 0 ? list.length : i, 0, ...entries);
  }
  function fadeTo(fn) {
    var f = document.getElementById('fade');
    f.classList.add('on'); G.ui.modal = 'fade';
    setTimeout(function () { G.ui.modal = null; fn(); f.classList.remove('on'); }, 900);
  }
  G.NIGHT_DAY = { 1: 8, 2: 10, 3: 11 };

  // ======================= ĐỒ, MANH MỐI, ĐỐI CHIẾU =======================
  Object.assign(G.KEY_ITEMS, {
    hop_thiec: { name: 'Hộp thiếc của Vy', desc: 'Cô Lan giữ suốt 30 năm. Bên trong: **thư của Vy**, bản chép **danh sách Ban tế lễ**, và chiếc điện thoại của Vy đã hết pin.' }
  });
  Object.assign(G.CLUES, {
    t_lan_dem: { kind: 'tm', who: 'Cô Lan', title: 'Cô Lan: không ai tới nhà', loc: 'Chợ', topics: ['vy', 'lan'],
      about: 'những đêm trước rằm năm 1996 ở nhà cô Lan', people: ['Cô Lan'],
      text: '"Mấy đêm trước rằm cô trông hai đứa nhà con. [[Không ai tới nhà cô cả.]] Sáng rằm ra mới nghe tin cháy."' },
    t_nam_con: { kind: 'tm', who: 'Bà Năm', title: 'Bà Năm: thằng Lộc chưa về', loc: 'Chợ', topics: ['mat_tich', 'ham'],
      about: 'anh Lộc, con bà Năm, mất tích năm 1996', people: ['Bà Năm', 'Anh Lộc'],
      text: '"Thằng Lộc nhà tôi làm **thợ sửa đình**. [[Mùng 9 tháng 8 nó đi làm, rồi không về.]] Cháu có thấy nó không?"' },
    e_vy_lan_96: { kind: 'ev', title: 'Vy gửi hộp ở tạp hoá (1996)', loc: 'Đường xóm · 1996', source: 'Tự mắt thấy',
      people: ['Vy', 'Cô Lan (trẻ)'], topics: ['vy', 'lan'], about: 'Vy tới nhà cô Lan đêm mùng 11',
      text: 'Đêm mùng 11/8/1996, Vy gõ cửa tạp hoá, đưa cô Lan [[một hộp thiếc]], dặn: [["Ba mươi năm nữa, có một anh bán trà đá về đây hỏi... chị đưa anh ấy."]]' },
    t_thu_vy: { kind: 'tm', who: 'Vy (thư)', title: 'Thư của Vy', loc: 'Hộp thiếc', topics: ['vy', 'te', 'mat_na'],
      about: 'điều Vy tin về đêm rằm và người đeo mặt nạ', people: ['Vy', 'Mẹ', 'Người đeo mặt nạ'],
      text: '"Anh, em xin lỗi. Người đeo mặt nạ trong ảnh [[đi theo nhóm ông Khải]]. Họ gọi là [[tế thần sông]]. Mẹ là người bị chọn đêm rằm. [[Em sẽ ngăn người đeo mặt nạ.]]"' },
    e_danh_sach: { kind: 'ev', title: 'Danh sách Ban tế lễ (Vy chép)', loc: 'Hộp thiếc', source: 'Vy chép từ sổ ghi danh',
      people: ['Ông Khải', 'Mẹ', 'Anh Lộc'], topics: ['te', 'khai', 'mat_tich'], about: 'những "người được chọn" qua các năm',
      text: 'Trưởng ban tế lễ: **Nguyễn Văn Khải**. "Người được chọn": 1992 — Nguyễn Thị Mai; 1994 — Phạm Văn Út; 1996 — [[Trần Văn Lộc (bị gạch)]], thay bằng [[Hạnh]].' }
  });
  G.DEDUCTIONS.push(
    { id: 'q_loc', t: 't_nam_con', e: 'e_to_tim_nguoi', type: 'match', title: 'Người trên tờ tìm người là anh Lộc',
      fact: 'Bà Năm nói con trai mất tích từ mùng 9 tháng 8; tờ tìm người ghi mất tích tháng 8/1996, gần đình làng.',
      guess: 'Anh Lộc là một trong những người mất tích quanh đình năm ấy. Bà Năm vẫn đợi con suốt ba mươi năm.' },
    { id: 'q_loc_ham', t: 't_nam_con', e: 'e_nghe_96', type: 'match', title: 'Anh Lộc là người thợ hỏi về cái hầm',
      fact: 'Đêm mùng 8, người thợ tên Lộc hỏi ông Khải về "mấy cái bao dưới hầm"; mùng 9 anh Lộc mất tích.',
      guess: 'Anh Lộc hỏi điều không nên hỏi, rồi biến mất ngay hôm sau. Chưa đủ để nói ai hại anh, nhưng ông Khải là người cuối cùng nói chuyện với anh.' },
    { id: 'q_lan_giau', t: 't_lan_dem', e: 'e_vy_lan_96', type: 'contra', title: 'Cô Lan giấu chuyện Vy tới',
      fact: 'Cô Lan nói không ai tới nhà; đêm mùng 11 tôi tận mắt thấy Vy gõ cửa, gửi cô một hộp thiếc.',
      guess: 'Cô Lan giấu chuyện này suốt ba mươi năm. Cô thương nhà mình thật lòng, vậy cô sợ điều gì? Nên hỏi lại cô, nhẹ nhàng.' },
    { id: 'q_te', t: 't_thu_vy', e: 'e_danh_sach', type: 'match', title: 'Mẹ là "người được chọn" đêm rằm',
      fact: 'Vy viết mẹ là người bị chọn cho "tế thần sông"; danh sách Ban tế lễ năm 1996 gạch tên anh Lộc, thay bằng tên mẹ.',
      guess: 'Nhóm của ông Khải dùng lễ "tế thần sông" để che những vụ mất tích. Đêm rằm, mẹ sẽ là người tiếp theo. Vy đã đi trước để ngăn chuyện đó.' },
    { id: 'q_mat_na', t: 't_thu_vy', e: 'e_anh_le_hoi', type: 'contra', title: 'Người đeo mặt nạ là ai?',
      fact: 'Vy tin người đeo mặt nạ đi theo nhóm ông Khải; trong ảnh, người đó đứng ngay sau lưng Vy, cổ quấn khăn tối màu.',
      guess: 'Vy chắc chắn người đó là kẻ ác. Nhưng người đó đứng chắn sau lưng Vy như đang che cho em... Và chiếc khăn quấn cổ ấy.' }
  );
  Object.assign(G.PAIR_HINTS, {
    't_lan_dem|e_thu_me': 'Mẹ dặn gửi hai đứa sang cô Lan, nên cô Lan trông hai đứa là thật. Cái cần xem là: có ai khác tới nhà cô không.',
    't_thu_vy|e_trang_vy': 'Cùng nét chữ Vy, khớp nhau về thời gian. Nhưng thư nói về người bị chọn: cần thứ ghi danh sách của Ban tế lễ.'
  });

  // ======================= NPC =======================
  Object.assign(G.NPCS, {
    ba_nam: { id: 'ba_nam', name: 'Bà Năm', act: 'talk', label: 'Nói chuyện',
      look: { hair: 'bun', hairColor: '#C3CACD', shirt: '#4B5560', pants: '#33363F', eyes: 'big' },
      cond: function (S) { return !!S.flags.demo_end; },
      quest: function (S) { return !S.clues.t_nam_con; },
      buyWant: ['banh_mi', 'tra_da'], buySay: 'Bánh mì không hành, một trà đá.',
      onServed: function () { G.talk('ba_nam'); },
      onDecline: function () { G.talk('ba_nam'); },
      schedule: [{ t: '00:00', loc: null }, { t: '09:00', loc: 'cho', x: 520, y: 712, ay: -46, buy: true }, { t: '11:00', loc: null }] },
    lan_96: { id: 'lan_96', name: 'Cô Lan (1996)', act: 'none', label: '',
      look: { hair: 'bun', shirt: '#A32E36', pants: '#33363F', eyes: 'tired' },
      schedule: [{ t: '00:00', loc: 'duong_96', x: 130, y: 300 }] }
  });
  ['ba_nam', 'lan_96'].forEach(function (id) { G.NPCS[id].schedule.forEach(function (e) { e.from = G.parseTime(e.t); }); });
  G.NPCS.co_lan.quest = (function (q) {
    return function (S) { return q(S) || (!!S.flags.demo_end && !S.clues.t_lan_dem) || (!!S.deduce.q_lan_giau && !S.items.hop_thiec); };
  })(G.NPCS.co_lan.quest);

  // ======================= ĐỊA ĐIỂM =======================
  G.LOCATIONS.nha_96.exits.right = 'duong_96';
  var n96 = G.LOCATIONS.nha_96.things;
  n96.find(function (t) { return t.id === 'tre_ngu'; }).cond = function (S) { return [3, 5, 6].indexOf(S.pnight) < 0; };
  n96.push(
    { id: 'giuong_trong', x: 546, y: 252, hit: [480, 104, 132, 116], label: 'Nhìn chiếc giường', act: 'look', text: 'giuong_trong',
      cond: function (S) { return [3, 5, 6].indexOf(S.pnight) >= 0; }, quest: function (S) { return S.pnight === 3 && !S.flags.n3_seen; } }
  );
  G.LOCATIONS.duong_96 = { id: 'duong_96', name: 'Đường xóm · 1996', era: '1996', width: 960, height: 790, exits: { left: 'nha_96' }, things: [
    { id: 'tap_hoa_96', x: 190, y: 472, hit: [20, 80, 300, 350], label: 'Nhìn vào tạp hoá', act: 'look', text: 'tap_hoa_96' }
  ] };

  G.scenes.duong_96 = function (W, H) {
    var B = new B0(W, H), r = G.scenes.rng(37);
    B.streets(true);
    B.bg += ink(rect(0, 430, W, 230, '#2B2723', ' stroke="none"') + rect(0, 660, W, 70, '#302B26', ' stroke="none"'));
    B.solid(0, 0, W, 50);
    // tạp hoá cô Lan năm 1996: đèn dầu, chiếu, hai đứa trẻ ngủ
    B.room(20, 80, 300, 350, 'url(#wood)', [[150, 230]]);
    var t = rect(40, 120, 60, 26, '#4A3532') + rect(40, 150, 60, 26, '#4A3532');
    for (var i = 0; i < 4; i++) t += '<circle cx="' + (52 + i * 14) + '" cy="132" r="5" fill="' + ['#948C5E', '#A32E36', '#58755C', '#C3CACD'][i] + '" stroke-width="1.5"/>';
    t += rect(150, 210, 130, 80, '#857761') + '<path class="d" d="M150,230 h130M150,250 h130M150,270 h130"/>';
    if (!(G.S && G.S.flags.n3_done)) t += '<ellipse cx="190" cy="245" rx="16" ry="11" fill="#C3CACD" stroke-width="2"/><ellipse cx="236" cy="252" rx="13" ry="9" fill="#C3CACD" stroke-width="2"/>' +
      '<circle cx="184" cy="228" r="7" fill="' + INK + '" stroke="none"/><circle cx="234" cy="238" r="6" fill="' + INK + '" stroke="none"/>';
    t += rect(250, 120, 22, 30, '#E2B060', ' stroke-width="2"');
    B.bg += ink(t);
    B.glow += '<ellipse class="glow" cx="200" cy="250" rx="160" ry="110" fill="url(#lampW)"/>';
    B.solid(40, 120, 60, 56); B.solid(150, 210, 130, 80);
    B.closed(340, 60, 240, 370, { roof: 'url(#roofG)', sign: 'HTX MUA BÁN', signBg: '#58755C' });
    B.closed(600, 100, 300, 330, { sign: 'MỘC BA', signBg: '#6A5846', shutter: true, roof: 'url(#roof)' });
    B.closed(920, 120, 40, 310, { roof: 'url(#roof)' });
    B.wires([B.pole(330), B.pole(920)]);
    B.southRoofs(r);
    return B.done();
  };

  // nhà 1996: đêm 3 giường trống
  var nha96 = G.scenes.nha_96;
  G.scenes.nha_96 = function (W, H) {
    var sc = nha96(W, H);
    if (G.S && [3, 5, 6].indexOf(G.S.pnight) >= 0) h.addBg(sc, rect(488, 112, 116, 100, '#6F7C88') + rect(476, 100, 140, 124, '#D5DCE0', ' fill-opacity=".18" stroke-width="1.5"'));
    return sc;
  };
  // kho đình: can dầu đèn lồng (dấu hiệu cho đám cháy về sau)
  var dinh = G.scenes.dinh_96;
  G.scenes.dinh_96 = function (W, H) {
    return h.addBg(dinh(W, H), rect(800, 300, 18, 24, '#A32E36', ' stroke-width="2"') + rect(820, 304, 18, 22, '#58755C', ' stroke-width="2"') +
      rect(806, 326, 18, 24, '#A32E36', ' stroke-width="2"') + '<path class="d" d="M805,300 v-5 h8"/>');
  };

  // ======================= LỜI THOẠI =======================
  Object.assign(G.TEXT, {
    giuong_trong: [
      { text: 'Chiếc giường trống trơn, màn tuyn vén gọn. Không có hai đứa trẻ.' },
      { who: 'Tôi', text: 'Mẹ dặn: "Nếu mẹ về muộn, gửi hai đứa sang **cô Lan**." Tạp hoá cô Lan ở **đầu Đường xóm**.' }
    ],
    tap_hoa_96: [{ text: 'Qua khe cửa: cô Lan còn trẻ, ngồi quạt cho hai đứa trẻ ngủ trên chiếu. Đèn dầu vặn nhỏ.' }],
    duong96_arrive: [
      { text: 'Đường xóm năm 1996: đường đất, cột điện gỗ. Tạp hoá đầu ngõ còn le lói đèn.' },
      { text: 'Có tiếng bước chân ngoài đường. Tôi nép vào bóng tối dưới cột điện.' }
    ],
    vy_scene: [
      { text: 'Một cô gái mặc áo khoác, tóc xoã, gõ cửa tạp hoá ba cái. Tôi nín thở. [[Là Vy.]]' },
      { who: 'Cô Lan (trẻ)', text: 'Ai đấy? Khuya rồi.' },
      { who: 'Vy', text: 'Chị cho em gửi cái hộp này. [[Ba mươi năm nữa, có một anh bán trà đá về đây hỏi... chị đưa anh ấy.]]' },
      { who: 'Cô Lan (trẻ)', text: 'Cô là ai? Sao trông giống chị Hạnh thế?' },
      { who: 'Vy', text: 'Em là người quen. Chị giữ giùm em. Đừng cho ai biết, [[nhất là người bên Ban tế lễ]].' },
      { who: 'Cô Lan (trẻ)', text: 'Chị Hạnh dạy hai đứa nhỏ [[gõ ba cái lên nắp xe trà cho may]]. Cô gõ cửa cũng y hệt thế.' },
      { text: 'Vy không trả lời. Em quay đi rất nhanh, về phía đình. Tôi định gọi, nhưng giọng tắc lại trong cổ.' }
    ],
    vy_gone: [{ who: 'Tôi', text: 'Vy biết mình sẽ về đây. Em để lại thứ gì đó, đợi ba mươi năm.' }],
    arrive96_3: [
      { text: 'Tờ lịch: [[mùng 11 tháng 8 Âm lịch, 1996]]. Bốn ngày trước rằm.' },
      { text: 'Trong nhà im ắng lạ thường.' }
    ],
    back_n3_wait: [{ text: 'Chưa. Hai đứa trẻ đâu rồi?' }],
    ferry_n3: [{ who: 'Tôi', text: 'Đêm nay phải tìm hai đứa trẻ trước đã.' }],
    back_n3: [
      { text: 'Tôi đặt tay lên mặt gương. Lần này nó ấm, như vừa có ai chạm vào trước.' }
    ],
    mirror_ch2: [{ text: 'Mặt gương mờ đục. (Hỏi cô Lan về những đêm trước rằm đã.)' }],
    mirror_n3: [{ text: 'Mặt gương sáng lên: Đường xóm năm xưa, tạp hoá đầu ngõ còn le lói đèn.' }],
    mirror_end3: [{ text: 'Mặt gương mờ đục. (Hết phần đã làm của chương 2.)' }],
    open_box: [
      { text: 'Hộp thiếc rỉ sét, nắp dán băng keo đã giòn. Bên trong: một chiếc **điện thoại** hết pin, ốp in hoa. Điện thoại của Vy.' },
      { text: 'Một bức thư gấp tư, nét chữ Vy:' },
      { who: 'Vy (thư)', text: '"Anh, em xin lỗi. Người đeo mặt nạ trong ảnh [[đi theo nhóm ông Khải]]. Họ gọi là [[tế thần sông]]."' },
      { who: 'Vy (thư)', text: '"Mẹ là người bị chọn đêm rằm. [[Em sẽ ngăn người đeo mặt nạ.]] Anh đừng qua gương nữa. Đừng để mẹ thấy mặt anh."' },
      { text: 'Kẹp sau thư là một trang Vy chép tay: **danh sách Ban tế lễ**, "người được chọn" qua các năm. Năm 1996: [[Trần Văn Lộc]] bị gạch, thay bằng [[Hạnh]].' }
    ],
    ch2_end_text: ''
  });
  // tên người thợ trong đêm 1 (đặt từ trước để bà Năm khớp)
  G.TEXT.overheard[3] = { who: 'Anh Khải', text: 'Không phải việc của chú, [[Lộc]]. Về đi.' };
  G.CLUES.e_nghe_96.text = G.CLUES.e_nghe_96.text.replace('Thợ hỏi về', 'Người thợ tên [[Lộc]] hỏi về');
  G.CLUES.e_nghe_96.people = ['Anh Khải (trẻ)', 'Người thợ tên Lộc'];

  G.DIALOGUE.ba_nam = [
    { id: 'nam1', once: true, lines: [
      { who: 'Bà Năm', text: 'Bánh mì [[không hành]], một trà đá. Thằng Lộc nhà tôi chỉ ăn thế.' },
      { who: 'Bà Năm', text: 'Cháu có thấy thằng Lộc không? Nó làm **thợ sửa đình**. [[Mùng 9 tháng 8 nó đi làm, rồi không về.]]' },
      { text: 'Bà nhìn về phía bến sông rất lâu. Rồi bà hỏi lại tôi câu ấy, [[như chưa từng hỏi]].' }
    ], after: function () { G.addClue('t_nam_con'); } },
    { id: 'nam_idle', after: function () { G.addClue('t_nam_con'); }, lines: [{ who: 'Bà Năm', text: 'Cháu có thấy thằng Lộc nhà tôi không? Nó làm **thợ sửa đình**, [[mùng 9 tháng 8 đi làm rồi không về]].' }] }
  ];
  insertBefore(G.DIALOGUE.tung, 'tung_idle', [
    { id: 'tung_nam', once: true, cond: function (S) { return !!S.clues.t_nam_con; }, lines: [
      { who: 'Tùng', text: 'Bà Năm đấy anh. [[Lẫn rồi.]] Sáng nào cũng ra chợ mua bánh mì không hành cho con trai.' },
      { who: 'Tùng', text: 'Con bà mất tích từ năm chín sáu. Cả xóm biết, chẳng ai nỡ nói.' }
    ] }
  ]);
  insertBefore(G.DIALOGUE.co_lan, 'lan_nha9', [
    { id: 'lan_dem', cond: function (S) { return !!S.flags.demo_end && !S.clues.t_lan_dem; }, after: function () { G.addClue('t_lan_dem'); }, lines: [
      { who: 'Tôi', text: 'Cô Lan, mấy đêm trước rằm năm ấy, mẹ cháu gửi hai đứa sang cô phải không ạ?' },
      { who: 'Cô Lan', text: 'Ừ. Mấy đêm trước rằm cô trông hai đứa nhà con. [[Không ai tới nhà cô cả.]] Sáng rằm ra mới nghe tin cháy.' },
      { who: 'Cô Lan', text: 'Mà con giống mẹ thật. [[Gõ ba cái lên nắp xe rồi mới mở hàng]], y như chị Hạnh.' },
      { text: 'Cô nói nhanh, mắt không rời mớ rau đang nhặt.' }
    ] },
    { id: 'lan_thu_nhan', cond: function (S) { return !!S.deduce.q_lan_giau && !S.items.hop_thiec; }, lines: [
      { who: 'Tôi', text: 'Đêm mùng 11, có một cô gái tới gõ cửa nhà cô. Gõ ba cái. Cô ấy gửi cô một cái hộp.' },
      { text: 'Cô Lan buông mớ rau. Rất lâu sau mới nói.' },
      { who: 'Cô Lan', text: '...Con biết rồi à. Con bé ấy giống chị Hạnh như đúc. Nó dặn ba mươi năm nữa đưa cho anh bán trà.' },
      { who: 'Cô Lan', text: 'Sau đám cháy, [[người của ông Khải tới nhà]]. Họ bảo cô nói một câu là [[cháy nốt cái tạp hoá]]. Cô còn hai đứa con nhỏ...' },
      { who: 'Cô Lan', text: 'Ba mươi năm cô không dám mở. Năm sau cô còn sang [[trát cái hốc cây bàng nhà con]] cho đỡ mối, cũng chẳng dám nghĩ gì.' },
      { who: 'Cô Lan', text: 'Cô xin lỗi con. Cầm lấy.' }
    ], after: function (S) {
      S.items.hop_thiec = true; S.rel.co_lan = (S.rel.co_lan || 0) + 2;
      G.ui.toast('Đã nhận: **Hộp thiếc của Vy**');
      G.ui.dialog(G.TEXT.open_box, function () { G.addClue('t_thu_vy'); G.addClue('e_danh_sach'); });
    } }
  ]);
  insertBefore(G.DIALOGUE.bac_do, 'do_idle', [
    { id: 'do_10', once: true, cond: function (S) { return !!S.flags.n2_done; }, lines: [
      { who: 'Bác Tư lái đò', text: 'Mà cái cậu giống cháu ấy, [[đêm mùng mười bác còn vớt cậu ta dưới sông lên]]. Ướt như chuột lột.' },
      { who: 'Bác Tư lái đò', text: 'Bác hỏi "lại là cậu à", cậu ta chỉ cười. Lạ thật.' }
    ] }
  ]);
  insertBefore(G.DIALOGUE.bac_ba, 'ba_buy', [
    { id: 'ba_vai_dau', once: true, cond: function (S) { return !!S.flags.demo_end && !!S.items.guong; }, lines: [
      { who: 'Tôi', text: 'Bác ơi, cái gương cháu tìm được dưới bến, bọc trong vải dầu buộc chặt.' },
      { who: 'Bác Ba', text: 'Vải dầu à? [[Ông Rạng hay bọc đồ quý bằng vải dầu khi đi sông.]] Ông ấy giữ hộ ai đó cái gương ấy rồi.' }
    ] }
  ]);

  // thói quen của nhân vật chính: gõ ba cái lên nắp xe trước khi bày sạp
  var sellStart = G.sell.start;
  G.sell.start = function (locId) {
    sellStart(locId);
    G.ui.toast(G.S.flags.knock_told ? 'Cộc, cộc, cộc.' : 'Tôi gõ ba cái lên nắp xe rồi mới mở hàng. Thói quen từ nhỏ, không nhớ ai dạy.', 2600);
    G.S.flags.knock_told = true;
  };

  // ======================= MỤC TIÊU =======================
  var iEnd = G.OBJECTIVES.findIndex(function (o) { return o.id === 'het'; });
  G.OBJECTIVES.splice(iEnd, 0,
    { id: 'ch2_lan', text: 'Chương 2. Hỏi cô Lan (ở chợ) về những đêm trước rằm năm 1996', done: function (S) { return !!S.clues.t_lan_dem; } },
    { id: 'ch2_nam', text: 'Bày sạp ở chợ buổi sáng (9:00–11:00): có một bà cụ hay ghé', done: function (S) { return !!S.clues.t_nam_con; } },
    { id: 'ch2_loc', text: 'Bà Năm tìm con trai. Đối chiếu lời bà trong Sổ (nghe lén ở đình, tờ tìm người)', done: function (S) { return !!S.deduce.q_loc || !!S.deduce.q_loc_ham; } },
    { id: 'ch2_dem3', text: 'Sau 19:00 chạm vào gương: đêm mùng 11', done: function (S) { return S.pnight === 3 || !!S.flags.n3_done; } },
    { id: 'ch2_theo_vy', era: '1996', text: 'Hai đứa trẻ không ở nhà. Mẹ dặn gửi sang cô Lan: tạp hoá đầu Đường xóm (đi sang phải)', done: function (S) { return !!S.flags.n3_seen; } },
    { id: 'ch2_ve3', era: '1996', text: 'Về nhà, chạm vào gương để trở về', done: function (S) { return !!S.flags.n3_done; } },
    { id: 'ch2_doi_lan', text: 'Đối chiếu lời cô Lan với điều đã thấy đêm mùng 11', done: function (S) { return !!S.deduce.q_lan_giau; } },
    { id: 'ch2_hop', text: 'Gặp lại cô Lan. Nói chuyện nhẹ nhàng', done: function (S) { return !!S.items.hop_thiec; } },
    { id: 'ch2_te', text: 'Đọc thư của Vy, đối chiếu với danh sách Ban tế lễ trong Sổ', done: function (S) { return !!S.deduce.q_te; } }
  );
  G.OBJECTIVES[G.OBJECTIVES.length - 1].text = 'Hết chương 2. Chương 3 đang được viết. Bán tiếp, trò chuyện, đối chiếu nốt trong Sổ tùy ý.';

  // ======================= HÀNH ĐỘNG =======================
  var A = G.acts;
  var mirror2 = A.mirror, back2 = A.mirror_back, ferry2 = A.ferry;
  A.mirror = function (t) {
    var S = G.S;
    if (S.flags.n3_done) { G.ui.dialog(G.TEXT.mirror_end3); return; }
    if (S.flags.demo_end) {
      if (!S.clues.t_lan_dem) { G.ui.dialog(G.TEXT.mirror_ch2); return; }
      if (S.min < 19 * 60) { G.ui.dialog(G.TEXT.mirror_day); return; }
      G.ui.dialog(G.TEXT.mirror_n3.concat([{ text: 'Chạm vào gương?', choices: [
        { text: 'Chạm vào mặt gương', run: function () { A.goPast3(); } },
        { text: 'Chưa, để chuẩn bị đã', run: function () {} }
      ] }]));
      return;
    }
    mirror2(t);
  };
  A.goPast3 = function () {
    var S = G.S;
    fadeTo(function () {
      S.era = '1996'; S.pnight = 3; S.pmin = 23 * 60; S.view = 'front';
      G.world.enter('nha_96', 375, 214);
      G.save();
      G.ui.dialog(G.TEXT.arrive96_3);
    });
  };
  A.mirror_back = function (t) {
    var S = G.S;
    if (S.pnight !== 3) { back2(t); return; }
    if (!S.flags.n3_seen) { G.ui.dialog(G.TEXT.back_n3_wait); return; }
    G.ui.dialog(G.TEXT.back_n3, function () {
      S.era = null; S.flags.n3_done = true; S.past.n3 = 'done';
      G.world.endDay('Tôi ngã ra khỏi gương, nằm trên sàn nhà cũ tới sáng.');
    });
  };
  A.ferry = function (t) { if (G.S.pnight === 3) G.ui.dialog(G.TEXT.ferry_n3); else ferry2(t); };

  // Cảnh Vy gửi hộp: Vy đi từ mép trái tới cửa tạp hoá, nói chuyện, rồi đi khuất bên phải
  var C = { active: false };
  function startVy() {
    var W = G.world;
    C.active = true;
    C.vy = W.makeEnt({ hair: 'long', shirt: '#6F86A0', pants: '#2A3550', shoes: '#D5DCE0', eyes: 'flat' }, ['front', 'side', 'back'], 'npc');
    W.place(C.vy, -30, 600, 'side', 1);
    C.route = [[190, 600], [190, 470]]; C.talked = false;
  }
  function step(e, p, dt) {
    var dx = p[0] - e.x, dy = p[1] - e.y, d = Math.hypot(dx, dy), st = 110 * dt;
    if (d <= st) { G.world.place(e, p[0], p[1], dy < 0 ? 'back' : 'front', 1); return true; }
    G.world.place(e, e.x + dx / d * st, e.y + dy / d * st, Math.abs(dx) > Math.abs(dy) ? 'side' : (dy > 0 ? 'front' : 'back'), dx < 0 ? -1 : 1);
    e.el.classList.add('walk');
    return false;
  }
  var tick0 = G.tick;
  G.tick = function (dt) {
    if (tick0) tick0(dt);
    if (C.active && C.vy && !G.ui.isBusy()) {
      if (C.route.length && step(C.vy, C.route[0], dt)) {
        C.route.shift();
        if (!C.route.length && !C.talked) {
          C.talked = true; C.vy.el.classList.remove('walk');
          G.world.updateCamera(true, 330, 420); // lia khung về cửa tạp hoá trong lúc nói chuyện
          G.ui.dialog(G.TEXT.vy_scene, function () {
            G.S.flags.n3_seen = true; G.addClue('e_vy_lan_96');
            C.route = [[190, 600], [1000, 600]];
            G.ui.dialog(G.TEXT.vy_gone);
          });
        } else if (!C.route.length && C.talked) { C.vy.el.remove(); C.vy = null; C.active = false; }
      }
    }
    // hết chương 2: mở màn kết chương khi người chơi đóng Sổ
    var S = G.S;
    if (S && S.deduce.q_te && !S.flags.ch2_end && !G.ui.isBusy()) { S.flags.ch2_end = true; G.ui.chapterEnd(); }
  };
  var onEnter0 = G.onEnter;
  G.onEnter = function (locId) {
    if (onEnter0) onEnter0(locId);
    var S = G.S;
    if (C.active && locId !== 'duong_96') { C.active = false; C.vy = null; }
    if (locId === 'duong_96' && S.pnight === 3 && !S.flags.n3_seen && !C.active) {
      G.ui.dialog(G.TEXT.duong96_arrive, startVy);
    }
  };

  G.ui.chapterEnd = function () {
    var S = G.S, nd = Object.keys(S.deduce).length;
    var p = document.getElementById('ending');
    p.innerHTML = '<h2>Hết chương 2</h2><p class="sub">Em gái không bị bắt cóc</p><div class="list help-list">' +
      '<div><b class="hl">Vy tự đi về năm 1996</b> để cứu mẹ. Em tin mẹ sẽ bị "tế thần sông" đêm rằm, và tin người đeo mặt nạ là kẻ ác.</div>' +
      '<div>Cô Lan giữ hộp của Vy ba mươi năm, im lặng vì bị dọa. Anh Lộc, con bà Năm, mất tích ngay sau khi hỏi về cái hầm.</div>' +
      '<div>Còn chờ phía trước: <b class="clue">cái hầm dưới gian thờ</b>, <b class="clue">phong ấn</b>, <b class="clue">người đeo mặt nạ cầm rìu</b>.</div>' +
      '<div>Đối chiếu đã làm: <b>' + nd + '/' + G.DEDUCTIONS.length + '</b></div>' +
      '</div><div class="list" style="margin-top:12px"><button class="primary" data-e="go">Chơi tiếp tự do</button><button data-e="title">Về màn hình tiêu đề</button></div>';
    p.hidden = false; G.ui.modal = 'ending';
    G.save();
    p.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      p.hidden = true; G.ui.modal = null;
      if (b.dataset.e === 'title') location.reload();
    };
  };
})();
