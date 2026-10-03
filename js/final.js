// Cao trào và Kết.
// Cao trào (đêm rằm, tiếp): dưới hầm nước dâng, thủy khí trôi quanh giếng. Gõ ba cái gọi Vy → mẹ nhận ra con; bẩy xi măng cứu Vy (Vy thú nhận hiểu sai);
// ghép mặt sau bia đá + bản vẽ (cống ở góc tây nam) + vị trí chốt: cắm lại chốt gãy, mở cống → ra bến đình, ông Rạng hy sinh → hộ tống mẹ và Vy về gương.
// Kết: về 2026, mẹ vẫn mang tuổi 1996; trình bày vụ án bằng chứng cứ có thật ở 2026 (lời kể xuyên thời gian không được tính);
// các gia đình biết sự thật; cả nhà bày sạp lại; một bọc vải dầu mới dưới bến sông.
var G = window.G || (window.G = {});

(function () {
  var h = G.scenes.h, rect = h.rect, ink = h.ink;
  function insertBefore(list, id, entries) {
    var i = list.findIndex(function (e) { return e.id === id; });
    list.splice(i < 0 ? list.length : i, 0, ...entries);
  }
  function fadeTo(fn) {
    var f = document.getElementById('fade');
    f.classList.add('on'); G.ui.modal = 'fade';
    setTimeout(function () { G.ui.modal = null; fn(); f.classList.remove('on'); }, 900);
  }
  G.NIGHT_DAY[6] = 15;
  function cao(S) { return S.era && S.pnight === 6; }
  var ket = function (S) { return !!S.flags.reunited; };

  // ======================= ĐỒ, MANH MỐI =======================
  Object.assign(G.KEY_ITEMS, {
    thanh_sat: { name: 'Thanh sắt của Vy', desc: 'Vy định dùng để cạy chốt. Dùng làm đòn bẩy.' },
    chot_gay: { name: 'Khúc chốt lim gãy', desc: 'Phần chốt đông nam tôi chém đứt. Mặt sau bia đá dặn: cắm lại chốt đã chặt.' }
  });
  Object.assign(G.CLUES, {
    e_bia_sau: { kind: 'ev', title: 'Mặt sau bia đá (1996)', loc: 'Hầm đình · 1996', source: 'Chữ khắc mặt sau bia', img: 'bia_sau',
      people: ['Ông tổ làng'], topics: ['phong_an'], about: 'cách đưa thủy khí về lại giếng',
      text: '[["Chốt đông nam mở cửa. Muốn khí về giếng: cắm lại chốt đã chặt, rồi mở cống cổ. Cửa gương sẽ yên."]] Không ghi cống ở đâu.' }
  });
  G.CLUES.e_ban_ve.text += ' Góc dưới bên trái ô "hầm" có ký hiệu lưới nhỏ ghi "cống".';

  // ======================= NPC =======================
  function npc(id, d) { G.NPCS[id] = Object.assign({ id: id }, d); G.NPCS[id].schedule.forEach(function (e) { e.from = G.parseTime(e.t); }); }
  npc('me_cao', { name: 'Mẹ', act: 'none', label: '', look: G.NPCS.me_15.look,
    cond: function (S) { return cao(S) && !S.flags.escort; }, schedule: [{ t: '00:00', loc: 'ham_96', x: 680, y: 450 }] });
  npc('vy_cao', { name: 'Vy', act: 'none', label: '', look: G.NPCS.vy_ham.look,
    cond: function (S) { return cao(S) && !S.flags.vy_free2; }, schedule: [{ t: '00:00', loc: 'ham_96', x: 250, y: 470 }] });
  npc('vy_cao2', { name: 'Vy', act: 'none', label: '', look: G.NPCS.vy_ham.look,
    cond: function (S) { return cao(S) && !!S.flags.vy_free2 && !S.flags.escort; }, schedule: [{ t: '00:00', loc: 'ham_96', x: 720, y: 470 }] });
  npc('me_nay', { name: 'Mẹ', act: 'talk', label: 'Nói chuyện với mẹ', look: { hair: 'long', shirt: '#A32E36', pants: '#33363F', eyes: 'flat', prop: 'fan' },
    cond: ket, quest: function (S) { return !S.flags.ket_talk; }, schedule: [{ t: '00:00', loc: 'nha', x: 690, y: 470 }] });
  npc('vy_nay', { name: 'Vy', act: 'talk', label: 'Nói chuyện với Vy', look: G.NPCS.vy_ham.look,
    cond: ket, schedule: [{ t: '00:00', loc: 'nha', x: 560, y: 478 }] });
  npc('can_bo', { name: 'Cán bộ công an xã', act: 'case', label: 'Trình bày vụ án', look: { hair: 'cap', cap: '#3F5A44', shirt: '#58755C', pants: '#3B4A3A', eyes: 'flat' },
    cond: function (S) { return ket(S) && !S.flags.case_done; }, quest: function () { return true; },
    schedule: [{ t: '00:00', loc: null }, { t: '06:30', loc: 'duong', x: 120, y: 500 }, { t: '19:30', loc: null }] });
  G.NPCS.ong_khai.cond = function (S) { return !S.flags.case_done; };
  G.NPCS.me_15.cond = (function (c) { return function (S) { return S.pnight !== 6 && c(S); }; })(G.NPCS.me_15.cond);
  G.NPCS.vy_ham.cond = (function (c) { return function (S) { return S.pnight !== 6 && c(S); }; })(G.NPCS.vy_ham.cond);

  // ======================= ĐỊA ĐIỂM =======================
  G.LOCATIONS.ham_96.things.forEach(function (t) {
    if (['bia_da', 'bao', 'chot_dn', 'thang', 'gieng'].indexOf(t.id) >= 0) { var c0 = t.cond; t.cond = function (S) { return S.pnight !== 6 && (!c0 || c0(S)); }; }
  });
  function C6(f) { return function (S) { return cao(S) && f(S); }; }
  G.LOCATIONS.ham_96.things.push(
    { id: 'thang6', x: 480, y: 150, hit: [446, 40, 68, 100], label: 'Nhìn lên nắp hầm', act: 'look', text: 'thang6', cond: C6(function () { return true; }) },
    { id: 'goi_vy', x: 300, y: 474, hit: [222, 390, 60, 90], label: 'Gọi Vy', act: 'knock', cond: C6(function (S) { return !S.flags.c_knock; }), quest: function () { return true; } },
    { id: 'khe', x: 170, y: 424, hit: [126, 360, 90, 50], label: 'Bẩy khối xi măng', act: 'lever', cond: C6(function (S) { return !!S.flags.c_knock && !S.flags.vy_free2; }), quest: function () { return true; } },
    { id: 'bia_sau', x: 820, y: 360, hit: [800, 240, 80, 90], label: 'Đọc mặt sau bia đá', act: 'look', text: 'bia_sau', clue: 'e_bia_sau',
      cond: C6(function () { return true; }), quest: function (S) { return !S.clues.e_bia_sau; } },
    { id: 'chot_gay', x: 548, y: 446, hit: [528, 416, 40, 30], label: 'Nhặt khúc chốt gãy', act: 'take_pin',
      cond: C6(function (S) { return !S.items.chot_gay && !S.flags.pin_back; }), quest: function (S) { return !!S.clues.e_bia_sau; } },
    { id: 'lo_dn', x: 586, y: 422, hit: [566, 380, 40, 36], label: 'Cắm khúc chốt vào lỗ đông nam', act: 'pin_back',
      cond: C6(function (S) { return !!S.items.chot_gay && !S.flags.pin_back; }), quest: function () { return true; } }
  );
  [['goc_tb', 110, 140, 'tây bắc'], ['goc_db', 850, 140, 'đông bắc'], ['goc_tn', 110, 480, 'tây nam'], ['goc_dn', 860, 486, 'đông nam']].forEach(function (g) {
    G.LOCATIONS.ham_96.things.push({ id: g[0], x: g[1], y: g[2], hit: [g[1] - 40, g[2] - 50, 80, 60], label: 'Xem góc ' + g[3], act: 'try_cong', spot: g[0],
      cond: C6(function (S) { return !S.flags.cong_open; }) });
  });
  G.LOCATIONS.ham_96.things.push(
    { id: 'cong_ra', x: 110, y: 480, hit: [70, 430, 80, 60], label: 'Chui ra cống (đưa mẹ và Vy theo)', act: 'exit_cong',
      cond: C6(function (S) { return !!S.flags.cong_open; }), quest: function () { return true; } }
  );
  G.LOCATIONS.nha.things.push(
    { id: 'quay_le', x: 640, y: 520, hit: [600, 470, 80, 60], label: 'Bày sạp cùng mẹ và Vy (ra chợ)', act: 'look', text: 'ket_hint',
      cond: function (S) { return !!S.flags.case_done && !S.flags.ket_stall; } }
  );
  G.LOCATIONS.ben_song.things.push(
    { id: 'cot_ben2', x: 712, y: 866, hit: [696, 850, 34, 50], label: 'Xem dưới cột thứ ba', act: 'teaser',
      cond: function (S) { return !!S.flags.ket_stall && !S.flags.the_end && S.min >= 17 * 60; }, quest: function () { return true; } }
  );

  // ======================= CẢNH =======================
  var hamPrev = G.scenes.ham_96;
  G.scenes.ham_96 = function (W, H) {
    var sc = hamPrev(W, H), S = G.S;
    if (!S || S.pnight !== 6) return sc;
    var f = rect(96, 360, 140, 40, '#6F7C88') + '<path d="M120,400 l10,-8 l10,8" fill="none" stroke-width="2"/>'; // khối xi măng đè chân Vy
    f += '<path d="M440,40 l20,40 l30,-30 l20,46" fill="none" stroke="#E07030" stroke-width="4"/>';          // lửa trên nắp hầm
    if (!S.flags.pin_back) f += rect(530, 430, 36, 12, '#4A3532', ' transform="rotate(-20 548 436)"');      // khúc chốt gãy
    if (S.flags.cong_open) f += rect(70, 450, 80, 50, '#0F141B') + '<path d="M70,450 l80,50M150,450 l-80,50" stroke="#4B5560" stroke-width="3"/>';
    else f += rect(70, 450, 80, 50, '#3A3430') + '<path d="M80,460 v30M95,460 v30M110,460 v30M125,460 v30M140,460 v30" stroke="#4B5560" stroke-width="3"/>';
    h.addBg(sc, f);
    sc.solids.push([96, 360, 140, 40]);
    return sc;
  };
  var dinhPrev = G.scenes.dinh_96;
  G.scenes.dinh_96 = function (W, H) {
    var sc = dinhPrev(W, H), S = G.S;
    if (!S || S.pnight !== 6) return sc;
    h.addBg(sc, '<path d="M170,330 q30,-80 60,-30 q20,-60 60,-10 q30,-60 70,0 q20,-40 60,0 q30,-70 70,-10 q30,-50 60,10 q20,-30 50,20 L720,370 H160 Z" fill="#E07030" opacity=".85"/>' +
      '<path d="M770,330 q20,-60 40,-20 q10,-50 40,-10 q20,-40 40,10 L920,370 H770 Z" fill="#E07030" opacity=".9"/>');
    return sc;
  };

  // ======================= LỜI THOẠI =======================
  Object.assign(G.TEXT, {
    mirror_n6: [{ text: 'Vết nứt trên mặt gương ứa nước. Trong đó vẫn là khoảnh khắc ấy: hầm tối, nước đen, mẹ, Vy.' }],
    arrive96_6: [
      { text: 'Tôi rơi xuống nước, lạnh buốt. Vẫn là cái hầm, vẫn là đêm rằm. Gương đã trả tôi về đúng lúc ấy.' },
      { text: 'Mẹ dựa vào chốt lim gãy, thở dốc. Ở góc kia, Vy vẫn kẹt dưới khối xi măng. Phía trên, [[nắp hầm đã sập, lửa trùm kín]].' },
      { text: 'Quanh miệng giếng có những [[vệt nước đen trôi lừ đừ]], như có thứ gì bơi bên dưới. Nước đang dâng.' },
      { text: '(Tránh các vệt thủy khí quanh giếng: chạm vào sẽ bị cuốn ngã, nước dâng nhanh hơn.)' }
    ],
    thang6: [{ text: 'Nắp hầm đã sập, than hồng rơi lả tả. [[Không lên lối này được.]] Phải tìm đường khác.' }],
    knock: [
      { text: 'Tôi gõ ba cái lên khối xi măng: cộc, cộc, cộc. "Vy! Anh đây!"' },
      { text: 'Mẹ khựng lại.' },
      { who: 'Mẹ', text: 'Gõ ba cái... [[Ba cái lên nắp xe trà, mẹ dạy con cho may.]] Chỉ có thằng Tí nhà tôi...' },
      { who: 'Mẹ', text: 'Con... là con phải không? Sao con lớn thế này?' },
      { text: 'Tôi tháo mặt nạ. Mẹ nhìn tôi rất lâu, như nhìn một người lạ mà mình đã biết cả đời.' },
      { who: 'Mẹ', text: '[[Đi! Con đi ngay!]] Ở đây chết hết. Mẹ ở lại, con đưa con bé kia đi!' },
      { who: 'Tôi', text: 'Lần này sẽ khác, mẹ.' },
      { who: 'Vy', text: 'Anh...? Cầm lấy thanh sắt, khe dưới khối xi măng ấy! (Đã nhận: **Thanh sắt**)' }
    ],
    lever: [
      { text: 'Tôi thọc thanh sắt vào đúng khe hở dưới khối xi măng, dồn hết sức bẩy lên.' },
      { text: 'Khối xi măng nhích lên một gang tay. Vy rút được chân ra.' },
      { who: 'Vy', text: 'Người trong ảnh... [[là anh]]? Em tưởng người đeo mặt nạ là kẻ giết mẹ.' },
      { who: 'Vy', text: 'Em lẻn xuống đây [[định phá chốt tây bắc]] cho nước cuốn trôi xi măng, cứu mẹ. Trần sập, em kẹt luôn.' },
      { who: 'Vy', text: 'Em dặn anh đừng để mẹ thấy mặt... em sợ mọi thứ đổi đi. [[Em hiểu sai hết.]] Em xin lỗi.' },
      { who: 'Tôi', text: 'Không sao. Giờ tìm đường ra đã.' }
    ],
    bia_sau: [
      { text: 'Tôi lách ra sau tấm bia. Mặt sau có thêm mấy dòng, chữ nhỏ hơn.', img: 'bia_sau' },
      { text: '[["Chốt đông nam mở cửa. Muốn khí về giếng: cắm lại chốt đã chặt, rồi mở cống cổ. Cửa gương sẽ yên."]]' },
      { who: 'Tôi', text: 'Cống cổ ở đâu? Bia không ghi. [[Bản vẽ gốc của bác Ba]] có đánh dấu gì không nhỉ? (Mở Sổ, xem lại bản vẽ.)' }
    ],
    take_pin: [{ text: 'Tôi nhặt khúc chốt lim gãy, nặng trịch, đầu còn vết chém mẻ răng cưa. (Đã nhận: **Khúc chốt gãy**)' }],
    pin_back: [
      { text: 'Tôi cắm khúc chốt vào lỗ đông nam, dùng thanh sắt nện cho chặt.' },
      { text: 'Nước trong giếng [[xoáy chậm lại]]. Những vệt thủy khí trôi về phía miệng giếng.' }
    ],
    cong_no: [{ text: 'Tường đá liền khối. [[Không có cống ở góc này.]]' }],
    cong_strong: [{ text: 'Có một tấm lưới sắt cũ. Nhưng nước đang xiết quá, chưa bẩy nổi. [[Phải cắm lại chốt trước đã.]]' }],
    cong_bar: [{ text: 'Có một tấm lưới sắt cũ, rỉ sét. Tay không thì không cạy nổi.' }],
    cong_open: [
      { text: 'Góc tây nam, đúng chỗ bản vẽ đánh dấu, có một tấm lưới sắt cũ. Tôi bẩy bằng thanh sắt.' },
      { text: 'Lưới bật ra. Phía sau là [[một đường cống đá dốc xuống]], nước rút ào ào theo đó ra sông.' }
    ],
    exit_cong: [
      { text: 'Tôi đi trước, mẹ giữa, Vy sau cùng. Cống tối và hẹp, nước ngập tới ngực.' },
      { text: 'Rồi có ánh lửa. Chúng tôi trồi lên ở bến đình, sau lưng là cả ngôi đình đang cháy rực.' }
    ],
    rang_end: [
      { text: 'Dưới bến, ông Rạng đứng trên đò, như đã hứa.' },
      { who: 'Ông Rạng', text: 'Lên đây! Nhanh!' },
      { text: 'Ông kéo mẹ lên, rồi Vy. Đến lượt tôi thì dòng nước từ cống trào ra, xô chiếc đò lệch hẳn.' },
      { text: 'Ông Rạng nhảy xuống, đẩy tôi lên mạn đò. Rồi dòng nước cuốn ông đi.' },
      { who: 'Tôi', text: 'Bác Rạng!' },
      { text: 'Chỉ còn chiếc mũ cối nổi trên mặt nước, trôi xa dần. [[Bia ghi: Rạng, chết đuối ở bến.]] Lịch sử không đổi.' },
      { text: 'Chiếc đò trôi về bến bên kia. Tôi cầm sào, đưa mẹ và Vy về.' }
    ],
    escort: [{ text: '(Đưa mẹ và Vy về nhà, tới chiếc gương trên nóc tủ. Mẹ và Vy đi theo sau.)' }],
    mirror_final: [
      { text: 'Mặt gương sáng lên. Nhưng chỉ đủ in [[hai bóng người]].' },
      { who: 'Mẹ', text: 'Hai đứa đi đi. Mẹ ở lại.' },
      { who: 'Vy', text: 'Không!' },
      { text: 'Bên kia sông, nước dưới đình đang rút về giếng. [[Chốt tôi cắm lại đang giữ.]] Vết nứt trên mặt gương khép lại từng chút một.' },
      { text: 'Mặt gương rộng ra, đủ cho ba người.', choices: [
        { text: 'Nắm tay mẹ và Vy, bước vào gương', run: function () { G.acts.goHome(); } },
        { text: 'Đợi thêm chút', run: function () {} }
      ] }
    ],
    ket_ve: [
      { text: 'Ba người ngã ra sàn nhà cũ. Nắng sớm năm 2026 rọi qua song cửa.' },
      { text: 'Mẹ nhìn quanh: cái tủ, cái giường, bàn thờ... rồi dừng lại ở tấm ảnh thờ của chính mình.', img: 'ban_tho' },
      { who: 'Mẹ', text: 'Ảnh thờ mẹ à?' },
      { text: 'Vy bật khóc.', img: null },
      { who: 'Mẹ', text: 'Con lớn hơn mẹ rồi.' },
      { text: 'Mẹ vẫn [[ba mươi tuổi]]. Chúng tôi thì đã sống ba mươi năm không có mẹ. Không gì trả lại được ba mươi năm ấy.' },
      { who: 'Mẹ', text: 'Ba mươi năm... Mẹ bỏ lỡ hết rồi.' },
      { who: 'Tôi', text: 'Không hết đâu mẹ. Từ giờ, lần này sẽ khác.' }
    ],
    ket_hint: [{ text: 'Mẹ đã lau lại chiếc xe trà. "Mai cả nhà ra chợ nhé." (Bày sạp ở chợ.)' }],
    case_intro: [
      { who: 'Cán bộ', text: 'Cậu bảo có chứng cứ về vụ cháy đình năm 96? Tôi nghe. Nhưng tôi chỉ ghi những gì có giấy tờ, có vật, có người làm chứng.' }
    ],
    case_done: [
      { who: 'Cán bộ', text: 'Trang sổ này, bản vẽ này, danh sách này... đủ để mở lại hồ sơ.' },
      { text: 'Ông Khải bị mời lên làm việc. Ông chối. Nhưng [[nền gian thờ cũ được khai quật]].' },
      { text: 'Dưới lớp xi măng, người ta tìm thấy hài cốt. Và [[một chiếc dép tổ ong xanh]].' },
      { who: 'Cán bộ', text: 'Còn chuyện cậu kể "thấy tận mắt năm 1996", tôi không ghi vào biên bản. [[Cái gì có chứng cứ thì tòa xử.]]' },
      { text: 'Một tuần sau.' },
      { who: 'Bà Năm', text: 'Thằng Lộc về rồi... Nó về rồi.' },
      { text: 'Bà ôm chiếc dép, không hỏi ai câu ấy nữa.' },
      { who: 'Bác Ba', text: 'Bác giữ cái rìu ba mươi năm. Giờ bác đem nó trả về đình. Ông Rạng chắc cũng yên rồi.' },
      { who: 'Cô Lan', text: 'Chị Hạnh... chị vẫn y như hôm ấy.' },
      { who: 'Mẹ', text: 'Lan. Cảm ơn em đã trông hai đứa, đã giữ cái hộp, đã trát cái hốc cây.' }
    ],
    ket_stall: [
      { text: 'Mẹ đứng bên xe, gõ ba cái lên nắp: cộc, cộc, cộc. Vy rót trà. Tôi xếp ly.', img: 'gia_dinh' },
      { text: 'Khách đầu tiên là bác Ba. Hai ly trà đá.' },
      { text: 'Lần này, [[bác uống cả hai]].' },
      { who: 'Mẹ', text: 'Bán thôi các con.', img: null }
    ],
    teaser: [
      { text: 'Chiều tối. Dưới cột thứ ba của bến gỗ, lại có [[một bọc vải dầu mới]], còn ướt.', img: 'ben_cuoi' },
      { text: 'Bên trong là một chiếc lược sừng, sống lược khắc mái đình. Và một mẩu giấy, nét chữ lạ:' },
      { text: '[["Năm 1975. Đừng để nó ướt."]]' },
      { text: 'Trên mặt sông, có ai vừa vớt chiếc mũ cối lên khỏi nước, rồi biến mất.', img: null }
    ],
    me_talk: [
      { who: 'Mẹ', text: 'Cái điện thoại này bấm vào đâu hả con? Ba mươi năm, cái gì cũng lạ.' },
      { who: 'Mẹ', text: 'Nhưng cái xe trà thì vẫn thế. Con giữ nó tốt lắm.' },
      { who: 'Mẹ', text: 'Đi hỏi cán bộ công an xã đi con. Mấy gia đình kia cũng đợi ba mươi năm rồi.' }
    ],
    vy_talk: [
      { who: 'Vy', text: 'Em xin lỗi vì đã bảo anh đừng tìm em.' },
      { who: 'Vy', text: 'Mà công nhận, đeo mặt nạ cầm rìu trông anh đáng sợ thật.' }
    ]
  });
  G.DIALOGUE.me_nay = [
    { id: 'me1', once: true, lines: function () { return G.TEXT.me_talk; }, after: function (S) { S.flags.ket_talk = true; } },
    { id: 'me_idle', lines: [{ who: 'Mẹ', text: 'Mẹ đi chợ với cô Lan một lát. Ba mươi năm, giá cái gì cũng đắt lên.' }] }
  ];
  G.DIALOGUE.vy_nay = [{ id: 'vy1', once: true, lines: function () { return G.TEXT.vy_talk; } }, { id: 'vy_idle', lines: [{ who: 'Vy', text: 'Anh bày sạp đi, em phụ.' }] }];

  // ======================= TRÌNH BÀY VỤ ÁN =======================
  // Mỗi ý cần ít nhất một chứng cứ có thật ở năm 2026 (vật, giấy tờ, người làm chứng còn sống). Lời kể năm 1996 không được tính.
  var CLAIMS = [
    { id: 'c1', text: 'Tiền sửa đình bị chi riêng cho cái hầm', ok: ['e_trang_so'] },
    { id: 'c2', text: 'Cái hầm bị giấu khỏi hồ sơ nộp lên', ok: ['e_ban_ve', 'e_bien_ban', 't_ba_bi_dan'] },
    { id: 'c3', text: 'Những "người được chọn" mất tích đúng năm có lễ', ok: ['e_danh_sach', 'e_bia', 't_nam_con'] },
    { id: 'c4', text: 'Cần khai quật nền gian thờ cũ', ok: ['e_chot', 'e_ban_ve'] }
  ];
  var PAST_ONLY = 'Cậu bảo cậu thấy chuyện đó năm 1996? Không ai làm chứng được cho chuyện ấy. Tôi cần thứ có thật hôm nay.';
  G.ui.casePanel = function () {
    var S = G.S, sel = null, msg = '';
    S.case = S.case || {};
    function render() {
      var h2 = '<h2>Trình bày vụ án</h2><p class="sub">Chọn một ý, rồi chọn chứng cứ chứng minh ý đó. Cán bộ chỉ nhận vật, giấy tờ, hoặc người làm chứng còn sống.</p><div class="rows">';
      CLAIMS.forEach(function (c) {
        h2 += '<button class="cl-item' + (sel === c.id ? ' sel' : '') + '" data-c="' + c.id + '"><span>' + c.text + '</span>' +
          (S.case[c.id] ? '<i class="chip match">đã chứng minh</i>' : '') + '</button>';
      });
      h2 += '</div>';
      if (sel && !S.case[sel]) {
        h2 += '<h3>Chọn chứng cứ</h3><div class="case-ev">';
        Object.keys(S.clues).forEach(function (k) { h2 += '<button data-e="' + k + '">' + G.CLUES[k].title + '</button>'; });
        h2 += '</div>';
      }
      if (msg) h2 += '<div class="nb-result ' + (msg.ok ? 'match' : 'miss') + '">' + G.ui.fmt(msg.t) + '</div>';
      var done = CLAIMS.every(function (c) { return S.case[c.id]; });
      h2 += '<button class="close ' + (done ? 'primary' : '') + '" data-a="close">' + (done ? 'Kết thúc trình bày' : 'Đóng') + '</button>';
      document.getElementById('case').innerHTML = h2;
    }
    var p = document.getElementById('case');
    p.hidden = false; G.ui.modal = 'case';
    p.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.c) { sel = b.dataset.c; msg = ''; }
      else if (b.dataset.e) {
        var c = CLAIMS.find(function (x) { return x.id === sel; }), k = b.dataset.e, cl = G.CLUES[k], rec = S.clues[k];
        if (c.ok.indexOf(k) >= 0) { S.case[sel] = k; msg = { ok: true, t: 'Cán bộ ghi lại: **' + cl.title + '**.' }; }
        else if (rec.era) msg = { ok: false, t: PAST_ONLY };
        else msg = { ok: false, t: 'Thứ này không chứng minh được ý ấy. (' + cl.about + ')' };
      } else if (b.dataset.a === 'close') {
        p.hidden = true; G.ui.modal = null;
        if (CLAIMS.every(function (c) { return S.case[c.id]; })) G.ui.dialog(G.TEXT.case_done, function () { S.flags.case_done = true; G.world.enter(S.loc, S.x, S.y); });
        return;
      }
      render();
    };
    render();
  };
  G.CASE_CLAIMS = CLAIMS;

  // ======================= MỤC TIÊU =======================
  var iEnd = G.OBJECTIVES.findIndex(function (o) { return o.id === 'het'; });
  G.OBJECTIVES.splice(iEnd, 0,
    { id: 'ct_guong', text: 'Cao trào. Vết nứt trên gương vẫn giữ khoảnh khắc ấy. Sau 19:00 chạm vào gương', done: function (S) { return S.pnight === 6 || ket(S); } },
    { id: 'ct_go', era: '1996', text: 'Nước đang dâng! Vy kẹt dưới khối xi măng. Gọi em', done: function (S) { return !!S.flags.c_knock; } },
    { id: 'ct_vy', era: '1996', text: 'Dùng thanh sắt bẩy khối xi măng ở khe hở', done: function (S) { return !!S.flags.vy_free2; } },
    { id: 'ct_bia', era: '1996', text: 'Nắp hầm đã sập. Đọc mặt sau bia đá tìm đường khác', done: function (S) { return !!S.clues.e_bia_sau; } },
    { id: 'ct_chot', era: '1996', text: 'Nhặt khúc chốt gãy, cắm lại vào lỗ chốt đông nam', done: function (S) { return !!S.flags.pin_back; } },
    { id: 'ct_cong', era: '1996', text: 'Mở cống cổ. Bản vẽ gốc đánh dấu cống ở góc nào? (Mở Sổ, xem bản vẽ)', done: function (S) { return !!S.flags.cong_open; } },
    { id: 'ct_ra', era: '1996', text: 'Đưa mẹ và Vy ra theo cống', done: function (S) { return !!S.flags.escort; } },
    { id: 'ct_ve', era: '1996', text: 'Đưa mẹ và Vy về nhà, tới chiếc gương', done: ket },
    { id: 'ket_nha', text: 'Kết. Ở bên mẹ một lát (nói chuyện với mẹ trước nhà)', done: function (S) { return !!S.flags.ket_talk; } },
    { id: 'ket_an', text: 'Mang chứng cứ tới cán bộ công an xã (Đường xóm, đầu ngõ)', done: function (S) { return !!S.flags.case_done; } },
    { id: 'ket_sap', text: 'Cùng mẹ và Vy bày sạp ở chợ', done: function (S) { return !!S.flags.ket_stall; } },
    { id: 'ket_ben', text: 'Chiều tối ra bến sông', done: function (S) { return !!S.flags.the_end; } }
  );
  G.OBJECTIVES[G.OBJECTIVES.length - 1].text = 'Hết truyện. Cảm ơn bạn đã chơi. Cả nhà vẫn bán trà ở chợ mỗi sáng.';

  // ======================= HÀNH ĐỘNG =======================
  var A = G.acts;
  var mirror5 = A.mirror, back5 = A.mirror_back, sell0 = G.sell.start;
  A.mirror = function (t) {
    var S = G.S;
    if (ket(S)) { G.ui.dialog([{ text: 'Chiếc gương nứt một đường mảnh, giờ chỉ còn là một chiếc gương. Mẹ đặt nó lại trên nóc tủ.' }]); return; }
    if (S.flags.ch4_end || S.flags.n5_cliff) {
      if (S.min < 19 * 60) { G.ui.dialog(G.TEXT.mirror_day); return; }
      G.ui.dialog(G.TEXT.mirror_n6.concat([{ text: 'Chạm vào gương?', choices: [
        { text: 'Chạm vào mặt gương', run: function () { A.goPast6(); } },
        { text: 'Chưa, để chuẩn bị đã', run: function () {} }
      ] }]));
      return;
    }
    mirror5(t);
  };
  A.goPast6 = function () {
    var S = G.S;
    fadeTo(function () {
      S.era = '1996'; S.pnight = 6; S.pmin = 22 * 60 + 40; S.view = 'front'; S.flags.masked_now = true;
      G.world.enter('ham_96', 380, 470);
      G.ui.dialog(G.TEXT.arrive96_6, function () {
        S.danger = 'cao'; S.checkpoint = null; S.checkpoint = JSON.stringify(S); // điểm lưu cảnh: đầu cao trào
        F.start();
      });
    });
  };
  A.knock = function () {
    var S = G.S;
    G.ui.dialog(G.TEXT.knock, function () { S.flags.c_knock = true; S.flags.masked_now = false; S.items.thanh_sat = true; G.world.enter(S.loc, S.x, S.y); });
  };
  A.lever = function () {
    var S = G.S;
    G.ui.dialog(G.TEXT.lever, function () { S.flags.vy_free2 = true; G.world.enter(S.loc, S.x, S.y); });
  };
  A.take_pin = function () { var S = G.S; G.ui.dialog(G.TEXT.take_pin, function () { S.items.chot_gay = true; G.world.enter(S.loc, S.x, S.y); }); };
  A.pin_back = function () {
    var S = G.S;
    G.ui.dialog(G.TEXT.pin_back, function () { S.flags.pin_back = true; delete S.items.chot_gay; F.calm(); G.world.enter(S.loc, S.x, S.y); });
  };
  A.try_cong = function (t) {
    var S = G.S;
    if (t.spot !== 'goc_tn') { G.ui.dialog(G.TEXT.cong_no); return; }
    if (!S.items.thanh_sat) { G.ui.dialog(G.TEXT.cong_bar); return; }
    if (!S.flags.pin_back) { G.ui.dialog(G.TEXT.cong_strong); return; }
    G.ui.dialog(G.TEXT.cong_open, function () { S.flags.cong_open = true; G.world.enter(S.loc, S.x, S.y); });
  };
  A.exit_cong = function () {
    var S = G.S;
    if (!S.flags.vy_free2) { G.ui.dialog([{ text: 'Vy còn kẹt. Không thể đi.' }]); return; }
    G.ui.dialog(G.TEXT.exit_cong, function () {
      F.stop(); S.danger = null; S.checkpoint = null; S.flags.escort = true; delete S.items.thanh_sat;
      fadeTo(function () {
        G.world.enter('dinh_96', 480, 600);
        G.ui.dialog(G.TEXT.rang_end, function () {
          fadeTo(function () { G.world.enter('ben_96', 690, 760); G.ui.dialog(G.TEXT.escort); });
        });
      });
    });
  };
  A.mirror_back = function (t) {
    var S = G.S;
    if (S.pnight === 6) {
      if (!S.flags.escort) { G.ui.dialog([{ text: 'Không. Mẹ và Vy còn dưới hầm.' }]); return; }
      G.ui.dialog(G.TEXT.mirror_final);
      return;
    }
    back5(t);
  };
  A.goHome = function () {
    var S = G.S;
    fadeTo(function () {
      S.era = null; S.flags.reunited = true; S.flags.escort = false; S.past.n6 = 'done';
      S.day++; S.stats.days++; S.daily = {}; S.min = 6 * 60 + 30;
      G.world.enter('nha', G.HOME.x, G.HOME.y);
      G.save();
      G.ui.dialog(G.TEXT.ket_ve);
    });
  };
  A['case'] = function () { G.ui.dialog(G.TEXT.case_intro, function () { G.ui.casePanel(); }); };
  G.sell.start = function (locId) {
    sell0(locId);
    var S = G.S;
    if (S.flags.case_done && !S.flags.ket_stall && locId === 'cho') { G.ui.dialog(G.TEXT.ket_stall, function () { S.flags.ket_stall = true; }); }
  };
  A.teaser = function () { G.ui.dialog(G.TEXT.teaser, function () { G.S.flags.the_end = true; G.ui.theEnd(); }); };

  // ======================= NƯỚC DÂNG, THỦY KHÍ, NGƯỜI ĐI THEO =======================
  var F = { on: false, t: 0, LIMIT: 120, inv: 0 };
  F.start = function () {
    if (F.on) return;
    F.on = true; F.t = 0; F.inv = 0;
    var o = document.getElementById('flood');
    if (!o) { o = document.createElement('div'); o.id = 'flood'; document.getElementById('stage').insertBefore(o, document.getElementById('hud')); }
    o.hidden = false;
    F.blobs();
  };
  F.blobs = function () {
    F.b = [0, Math.PI].map(function (ph) {
      var d = document.createElement('div'); d.className = 'blob'; document.getElementById('ents').appendChild(d);
      return { el: d, ph: ph, x: 0, y: 0 };
    });
  };
  F.calm = function () { F.slow = true; };
  F.stop = function () { F.on = false; var o = document.getElementById('flood'); if (o) o.hidden = true; (F.b || []).forEach(function (b) { b.el.remove(); }); F.b = []; };
  F.fail = function () {
    F.on = false;
    G.ui.dialog([{ text: '[[Nước ngập qua đầu. Tôi chìm xuống, tay vẫn tìm tay mẹ.]]' }, { text: 'Tải lại từ điểm lưu cảnh (đầu cao trào).' }], function () {
      fadeTo(function () {
        var cp = G.S.checkpoint; G.S = JSON.parse(cp); G.S.checkpoint = cp; F.stop();
        G.world.enter('ham_96', 380, 470);
      });
    });
  };
  // người đi theo khi hộ tống
  var FL = [];
  function makeFollowers() {
    FL = [G.NPCS.me_cao.look, G.NPCS.vy_cao.look].map(function (lk, i) {
      var e = G.world.makeEnt(lk, ['front', 'side', 'back'], 'npc');
      G.world.place(e, G.S.x - 40 - i * 40, G.S.y + 10, 'front', 1);
      return e;
    });
  }
  var tick5 = G.tick;
  G.tick = function (dt) {
    if (tick5) tick5(dt);
    var S = G.S;
    if (F.on && S.loc === 'ham_96' && !G.ui.isBusy()) {
      F.t += dt * (F.slow ? 0.5 : 1);
      var o = document.getElementById('flood'); if (o) o.style.height = Math.min(100, F.t / F.LIMIT * 100) + '%';
      if (F.t >= F.LIMIT) { F.fail(); return; }
      F.inv = Math.max(0, F.inv - dt);
      var now = performance.now() / 1000;
      (F.b || []).forEach(function (b) {
        var a = b.ph + now * (F.slow ? 0.25 : 0.6);
        b.x = 480 + Math.cos(a) * 200; b.y = 300 + Math.sin(a) * 90; // quỹ đạo không đè lên khúc chốt gãy và lỗ chốt
        b.el.style.transform = 'translate3d(' + b.x + 'px,' + b.y + 'px,0)';
        if (F.inv <= 0 && Math.hypot(S.x - b.x, S.y - b.y) < 40) {
          F.inv = 2.5; F.t += 15;
          G.ui.toast('[[Thủy khí cuốn ngã!]] Nước dâng nhanh hơn.', 2000);
          var dx = S.x - b.x, dy = S.y - b.y, d = Math.hypot(dx, dy) || 1;
          var nx = S.x + dx / d * 60, ny = S.y + dy / d * 60;
          if (!G.world.blocked(nx, ny)) { S.x = nx; S.y = ny; }
          G.world.route = null; G.world.pending = null;
        }
      });
    }
    if (S && S.flags.escort && S.era && FL.length && !G.ui.isBusy()) {
      FL.forEach(function (e, i) {
        var tx = S.x - (S.flip || 1) * (46 + i * 40), ty = S.y + 8 + i * 6;
        var dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy);
        if (d > 4) { var st = Math.min(d, 230 * dt); G.world.place(e, e.x + dx / d * st, e.y + dy / d * st, Math.abs(dx) > Math.abs(dy) ? 'side' : (dy > 0 ? 'front' : 'back'), dx < 0 ? -1 : 1); e.el.classList.add('walk'); }
        else e.el.classList.remove('walk');
      });
    }
  };
  var onEnter5 = G.onEnter;
  G.onEnter = function (locId) {
    if (onEnter5) onEnter5(locId);
    var S = G.S;
    FL = [];
    if (S.flags.escort && S.era) makeFollowers();
    if (locId === 'ham_96' && F.on) F.blobs();
    else if (locId === 'ham_96' && S.danger === 'cao') F.start(); // tải lại / tải game giữa cao trào
    if (locId !== 'ham_96' && F.on) F.stop();
  };

  G.ui.theEnd = function () {
    var S = G.S, nd = Object.keys(S.deduce).length;
    var p = document.getElementById('ending');
    p.innerHTML = '<h2>Lần Này Sẽ Khác</h2><p class="sub">Hết truyện</p><div class="list help-list">' +
      '<div>Mẹ trở về năm 2026, vẫn mang tuổi của năm 1996. Ba mươi năm đã mất không quay lại, nhưng cả nhà có lại nhau.</div>' +
      '<div>Vụ cháy đình được điều tra lại bằng chứng cứ. Anh Lộc được tìm thấy. Những gia đình bị che giấu sự thật đã biết sự thật.</div>' +
      '<div>Ông Rạng chết đuối ở bến, như bia vẫn ghi. Lịch sử không đổi: mọi việc bạn làm vốn đã xảy ra.</div>' +
      '<div>Dưới bến sông, một bọc vải dầu mới. <b class="clue">Năm 1975.</b></div>' +
      '<div>Ngày chơi: <b>' + S.day + '</b> · Đã bán: <b>' + S.stats.sold + '</b> món · Đối chiếu: <b>' + nd + '/' + G.DEDUCTIONS.length + '</b></div>' +
      '</div><div class="list" style="margin-top:12px"><button class="primary" data-e="go">Tiếp tục sống ở khu phố</button><button data-e="title">Về màn hình tiêu đề</button></div>';
    p.hidden = false; G.ui.modal = 'ending';
    G.save();
    p.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      p.hidden = true; G.ui.modal = null;
      if (b.dataset.e === 'title') location.reload();
    };
  };

  // ======================= TRANH CẬN CẢNH MỚI =======================
  var cu = G.CLOSEUPS;
  function W2(inner, bg) {
    return '<svg viewBox="0 0 520 300" width="520" height="300"><rect width="520" height="300" fill="' + (bg || '#1B222C') + '"/>' +
      '<g stroke="#0F141B" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#w)">' + inner + '</g></svg>';
  }
  function chibi(look, x, y, sc, flip) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + ((flip || 1) * sc) + ',' + sc + ')">' + G.art.chibi(look).replace('<svg class="chibi', '<svg x="-80" y="-178" class="chibi') + '</g>';
  }
  cu.bia_sau = function () {
    var p = '<rect x="130" y="20" width="260" height="260" fill="#1B222C"/><rect x="160" y="40" width="200" height="220" fill="#5A6672"/>';
    for (var y = 70; y < 210; y += 22) p += '<path d="M180,' + y + ' h' + (100 + (y % 4) * 15) + '" stroke="#2B3138" stroke-width="3"/>';
    p += '<text x="260" y="236" font-size="11" fill="#E2D2A0" stroke="none" text-anchor="middle" font-weight="700" font-family="Segoe UI, Arial">cắm lại chốt · mở cống cổ</text>';
    return W2(p, '#0F141B');
  };
  cu.gia_dinh = function () {
    var p = '<rect x="0" y="210" width="520" height="90" fill="#2A323D"/><rect x="0" y="0" width="520" height="210" fill="#3A4552"/>';
    p += '<ellipse cx="260" cy="120" rx="240" ry="120" fill="#F2D27A" opacity=".12" stroke="none"/>';
    p += '<g transform="translate(200,270) scale(.95)">' + G.art.cart({ upgrades: { o_che: true } }).replace('<svg class="cart"', '<svg x="-90" y="-140" class="cart"') + '</g>';
    p += chibi({ hair: 'long', shirt: '#A32E36', eyes: 'flat', prop: 'fan' }, 110, 268, 0.62);
    p += chibi(G.PLAYER_LOOK, 330, 270, 0.66);
    p += chibi({ hair: 'long', shirt: '#6F86A0', pants: '#2A3550', eyes: 'big' }, 420, 268, 0.6);
    return W2(p, '#3A4552');
  };
  cu.ben_cuoi = function () {
    var p = '<rect x="0" y="0" width="520" height="300" fill="url(#water)"/><rect x="200" y="0" width="120" height="300" fill="#4A4038"/>';
    p += '<path d="M220,0 V300M260,0 V300M300,0 V300" stroke="#3B2E26" stroke-width="2"/><rect x="236" y="190" width="18" height="110" fill="#3B2E26"/>';
    p += '<path d="M250,220 q30,-16 50,4 q6,22 -20,28 q-30,2 -30,-32 Z" fill="#6A5846"/><path d="M262,226 l26,14" stroke="#4A4038" stroke-width="2"/>';
    p += '<ellipse cx="420" cy="80" rx="26" ry="10" fill="#58755C" opacity=".7"/>';
    return W2(p, '#16202A');
  };
  // bản vẽ gốc: ký hiệu cống ở góc tây nam (có từ khi tranh bản vẽ được thêm)
  var banVe0 = cu.ban_ve;
  cu.ban_ve = function () {
    return banVe0().replace('</g></svg>', '<rect x="196" y="204" width="24" height="16" fill="none" stroke="#2C4A5A" stroke-width="2"/>' +
      '<path d="M201,204 v16M206,204 v16M211,204 v16M216,204 v16" stroke="#2C4A5A" stroke-width="1.2"/>' +
      '<text x="190" y="236" font-size="11" fill="#2C4A5A" stroke="none" font-family="Segoe UI, Arial" font-weight="600">cống</text></g></svg>');
  };
})();
