// Chương 3: Tội ác và tâm linh cùng tồn tại.
// Giỗ chung ở đình cũ (điểm bán thứ 3), bia tưởng niệm, chốt phong ấn bị chém; đêm mốc 4 (mùng 13/8/1996): ông Rạng trao rìu,
// phá then nắp hầm, xuống hầm thấy giếng phong ấn, nước dâng (nguy hiểm có điểm lưu cảnh).
// Vòng đời chiếc rìu (một dòng thời gian, không nhân bản): 1995 bác Ba và ông Rạng nhặt được khi sửa đình, ông Rạng giữ →
// mùng 13/1996 ông Rạng trao cho anh rồi nhận lại → rằm (chương 4) anh dùng và đánh rơi trong đám cháy → bác Ba tìm thấy trong tro → treo ở xưởng tới 2026.
// Rìu không qua gương (to, không có dấu gương). Các năng lực bảo vật là hư cấu cho game.
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
  G.NIGHT_DAY[4] = 13;
  function isGio(S) { return !!S.flags.gio_day && S.day === S.flags.gio_day; }

  // ======================= ĐỒ, MANH MỐI, ĐỐI CHIẾU =======================
  Object.assign(G.KEY_ITEMS, {
    riu_96: { name: 'Rìu cổ (ông Rạng đưa)', desc: 'Cán lim, lưỡi khắc mái đình. [[Không có dấu gương: không mang qua gương được.]] Phải trả ông Rạng trước khi về.' }
  });
  G.CLUES.t_nam_con.text = '"Thằng Lộc nhà tôi làm **thợ sửa đình**, đi đôi [[dép tổ ong xanh]] tôi mua. [[Mùng 9 tháng 8 nó đi làm, rồi không về.]]"';
  Object.assign(G.CLUES, {
    t_ba_riu: { kind: 'tm', who: 'Bác Ba', title: 'Bác Ba: chiếc rìu trong tro', loc: 'Đường xóm', topics: ['riu', 'ham'],
      about: 'chiếc rìu treo ở xưởng và cái hầm', people: ['Bác Ba', 'Ông Rạng'],
      text: '"Sửa đình năm 95, bác với ông Rạng đào được cái rìu cổ cạnh giếng dưới gian thờ. Ông Rạng giữ. [[Sau đám cháy bác tìm thấy nó trong tro đình]], lưỡi mẻ một miếng."' },
    e_riu: { kind: 'ev', title: 'Chiếc rìu ở xưởng MỘC BA', loc: 'Đường xóm', source: 'Treo trước xưởng từ trước khi tôi về',
      people: ['Bác Ba'], topics: ['riu'], about: 'chiếc rìu cổ có vết mẻ',
      text: 'Rìu cán lim đen bóng, [[lưỡi khắc mái đình giống hệt mặt sau chiếc gương]]. Lưỡi [[mẻ một miếng hình răng cưa]].' },
    t_khai_yen: { kind: 'tm', who: 'Ông Khải', title: 'Ông Khải: lễ để giữ làng yên', loc: 'Đình cũ', topics: ['te', 'khai'],
      about: 'lễ "tế thần sông" có hại ai không', people: ['Ông Khải'],
      text: '"Lễ tế thần sông là để giữ làng yên. [[Chỉ là lễ, có ai mất đâu.]] Đừng tin mấy chuyện ma quỷ."' },
    e_bia: { kind: 'ev', title: 'Bia tưởng niệm ở đình cũ', loc: 'Đình cũ', source: 'Đọc tận mắt',
      people: ['Nguyễn Thị Mai', 'Phạm Văn Út', 'Mẹ', 'Ông Rạng'], topics: ['te', 'mat_tich'], about: 'những người mất dưới sông đúng các năm có lễ',
      text: 'Bia ghi nạn nhân vụ cháy 1996: **Hạnh** (không tìm thấy thi thể), **Rạng** (chết đuối). Một tấm nhỏ bên dưới, "Người mất dưới sông": [[1992 Nguyễn Thị Mai, 1994 Phạm Văn Út]].' },
    e_chot: { kind: 'ev', title: 'Bốn lỗ chốt trên nền gian thờ', loc: 'Đình cũ', source: 'Nền gian thờ đình cũ',
      people: [], topics: ['phong_an', 'riu'], about: 'chốt phong ấn dưới gian thờ, một chốt bị chém',
      text: 'Bốn góc nền xi măng có bốn lỗ chốt gỗ lim. Ba chốt còn nguyên. [[Chốt góc đông nam bị chém cụt, vết chém xiên, mẻ hình răng cưa.]] Từ khe nứt phả lên hơi lạnh và tiếng thở rất chậm.' },
    e_dep_loc: { kind: 'ev', title: 'Chiếc dép dưới hầm (1996)', loc: 'Hầm đình · 1996', source: 'Kẹt dưới đống bao xi măng',
      people: ['Anh Lộc?'], topics: ['mat_tich', 'ham'], about: 'dấu vết một người dưới hầm',
      text: 'Một chiếc [[dép tổ ong xanh]] cỡ người lớn, kẹt dưới lớp xi măng mới đổ cạnh mấy cái bao.' },
    e_bia_da: { kind: 'ev', title: 'Bia đá nghi lễ dưới hầm (1996)', loc: 'Hầm đình · 1996', source: 'Hốc tường, bóng ma chỉ đường',
      people: ['Ông tổ làng'], topics: ['phong_an', 'te'], about: 'phong ấn dưới đình là thật',
      text: 'Chữ khắc cổ: [["Bốn chốt lim giữ miệng giếng. Thủy khí bị giam, không ăn người."]] [["Chặt chốt đông nam thì cửa mở, nước dâng, khí thoát."]] Không có chữ nào nói phải dâng người.' }
  });
  G.DEDUCTIONS.push(
    { id: 'q_khai_te', t: 't_khai_yen', e: 'e_bia', type: 'contra', title: '"Có ai mất đâu"?',
      fact: 'Ông Khải nói lễ tế không hại ai; bia ghi người mất dưới sông đúng năm 1992, 1994, trùng tên "người được chọn" trong danh sách.',
      guess: 'Năm nào có "người được chọn", năm ấy có người mất dưới sông. Lễ tế là tấm màn che những vụ mất tích. Nhưng ai đã làm, và vì sao?' },
    { id: 'q_riu_chot', t: 't_ba_riu', e: 'e_chot', type: 'match', title: 'Chiếc rìu này đã chém cái chốt',
      fact: 'Bác Ba tìm thấy rìu trong tro, lưỡi mẻ răng cưa; chốt đông nam bị chém cụt, vết chém mẻ răng cưa.',
      guess: 'Đêm rằm năm ấy, có người dùng chính chiếc rìu này chém chốt phong ấn. Là ai? Người đeo mặt nạ cầm rìu trong ảnh?' },
    { id: 'q_loc_ham2', t: 't_nam_con', e: 'e_dep_loc', type: 'match', title: 'Anh Lộc đã ở dưới hầm',
      fact: 'Bà Năm nói Lộc đi dép tổ ong xanh; dưới hầm có chiếc dép tổ ong xanh kẹt dưới xi măng mới đổ.',
      guess: 'Anh Lộc không trôi sông. Anh bị đưa xuống hầm, rồi xi măng được đổ lên "trước rằm". Ông Khải nói "gia cố nền".' },
    { id: 'q_phong_an', t: 't_thu_vy', e: 'e_bia_da', type: 'contra', title: 'Phong ấn là thật',
      fact: 'Vy tin "tế thần sông" chỉ là trò của nhóm ông Khải; bia đá cổ dưới hầm ghi bốn chốt lim giam một thứ dưới giếng, và thứ đó không đòi người.',
      guess: 'Có hai chuyện chồng lên nhau: nhóm ông Khải giết người rồi đổ cho "thần sông"; còn dưới giếng thì thật sự có thứ bị giam. Chém chốt đông nam sẽ mở cửa và thả nó ra.' }
  );

  // ======================= NPC =======================
  Object.assign(G.NPCS, {
    khai_gio: { id: 'khai_gio', name: 'Ông Khải (giỗ chung)', act: 'talk', label: 'Nghe ông Khải',
      look: G.NPCS.ong_khai.look, cond: function (S) { return isGio(S); },
      quest: function (S) { return !S.clues.t_khai_yen; },
      schedule: [{ t: '00:00', loc: null }, { t: '06:00', loc: 'dinh_nay', x: 760, y: 470 }, { t: '12:00', loc: null }] },
    rang_96: { id: 'rang_96', name: 'Ông Rạng (1996)', act: 'talk', label: 'Nói chuyện',
      look: { hair: 'helmet', cap: '#58755C', shirt: '#4B5A3F', pants: '#3B4A3A', shoes: '#33363F', eyes: 'narrow' },
      cond: function (S) { return S.pnight === 4; },
      quest: function (S) { return !S.items.riu_96 && !S.flags.riu_tra || (S.flags.n4_out && !S.flags.riu_tra); },
      schedule: [{ t: '00:00', loc: 'ben_96', x: 180, y: 478 }] }
  });
  ['khai_gio', 'rang_96'].forEach(function (id) { G.NPCS[id].schedule.forEach(function (e) { e.from = G.parseTime(e.t); }); });
  G.NPCS.dan_96.cond = function (S) { return !S.pnight || S.pnight === 1; };
  G.NPCS.bac_ba.quest = (function (q) { return function (S) { return q(S) || (!!S.flags.ch2_end && !S.clues.t_ba_riu); }; })(G.NPCS.bac_ba.quest);
  G.NPCS.bac_do.quest = function (S) { return !!S.clues.e_riu && !S.clues.e_chot; };

  // ======================= ĐỊA ĐIỂM =======================
  G.LOCATIONS.duong.things.push(
    { id: 'riu_xuong', x: 640, y: 470, hit: [606, 400, 60, 50], label: 'Xem chiếc rìu treo', act: 'look', text: 'riu_look', clue: 'e_riu',
      quest: function (S) { return !!S.flags.ch2_end && !S.clues.e_riu; } }
  );
  G.LOCATIONS.dinh_nay = { id: 'dinh_nay', name: 'Đình cũ', width: 960, height: 680, camBias: 200, exits: {},
    sell: { spot: { x: 300, y: 520 }, interval: 3.2, tipMul: 1, multi: 0.3, types: { nguoi_gia: 5, lao_dong: 2, van_phong: 1, hoc_sinh: 1 },
            blurb: 'Ngày giỗ chung: người làng sang thắp hương rất đông.' },
    things: [
      { id: 'ben_nay', x: 480, y: 650, label: 'Lên đò về bến', act: 'ferry_home' },
      { id: 'gio_sap', x: 300, y: 520, label: 'Bày sạp bán', act: 'sell', cond: function (S) { return isGio(S) && S.min < 13 * 60; } },
      { id: 'bia', x: 700, y: 488, hit: [676, 408, 48, 60], label: 'Đọc bia tưởng niệm', act: 'look', text: 'bia', clue: 'e_bia',
        quest: function (S) { return !S.clues.e_bia; } },
      { id: 'nen_tho', x: 460, y: 250, hit: [410, 156, 100, 72], label: 'Xem nền gian thờ', act: 'look', text: 'nen_tho', clue: 'e_chot',
        quest: function (S) { return !S.clues.e_chot; } }
    ] };
  // đêm mốc 4 ở đình 1996: nắp hầm; và cảnh dưới hầm
  G.LOCATIONS.dinh_96.things.push(
    { id: 'nap_ham', x: 460, y: 250, hit: [416, 160, 90, 64], act: 'chop',
      label: function (S) { return S.flags.ham_open ? 'Xuống hầm' : (S.items.riu_96 ? 'Dùng rìu phá then nắp hầm' : 'Xem nắp hầm'); },
      cond: function (S) { return S.pnight === 4 && !S.flags.n4_out; }, quest: function (S) { return !!S.items.riu_96; } }
  );
  G.LOCATIONS.dinh_96.things.find(function (t) { return t.id === 'chieu_ham'; }).cond = function (S) { return S.pnight !== 4; };
  G.LOCATIONS.ham_96 = { id: 'ham_96', name: 'Hầm dưới đình · 1996', era: '1996', width: 960, height: 540, exits: {}, things: [
    { id: 'thang', x: 480, y: 150, hit: [446, 40, 68, 100], label: 'Leo lên', act: 'ham_exit', quest: function (S) { return !!S.flags.water; } },
    { id: 'gieng', x: 480, y: 410, hit: [400, 250, 160, 130], label: 'Nhìn xuống giếng', act: 'look', text: 'gieng' },
    { id: 'chot_dn', x: 590, y: 420, hit: [570, 360, 40, 40], label: 'Xem chốt góc đông nam', act: 'look', text: 'chot_dn' },
    { id: 'bao', x: 170, y: 400, hit: [100, 280, 140, 90], label: 'Xem mấy cái bao', act: 'look', text: 'bao', clue: 'e_dep_loc' },
    { id: 'bia_da', x: 820, y: 360, hit: [800, 240, 80, 90], label: 'Đọc bia đá', act: 'stone', quest: function (S) { return !S.clues.e_bia_da; } }
  ] };

  // ======================= CẢNH =======================
  // rìu treo trước xưởng MỘC BA: có từ đầu game
  var duongNow = G.scenes.duong;
  G.scenes.duong = function (W, H) {
    var sc = duongNow(W, H);
    sc.props.push({ x: 600, y: 388, w: 80, h: 70, z: 431, svg: '<svg class="prop" viewBox="600 388 80 70" width="80" height="70" overflow="visible">' +
      ink('<path d="M612,404 L664,446" stroke-width="7"/><path d="M612,404 L664,446" stroke="#2E2925" stroke-width="3.5"/>' +
        '<path d="M606,396 q-4,16 10,22 l10,-14 q-6,-10 -20,-8 Z" fill="#8C949B"/><path class="d" d="M610,402 l3,3 l-2,3 l3,3"/>') + '</svg>' });
    return sc;
  };

  G.scenes.dinh_nay = function (W, H) {
    var B = new B0(W, H), r = G.scenes.rng(91), S = G.S, gio = S && isGio(S);
    B.bg += rect(0, 0, W, H, '#1B222C');
    B.solid(-50, 0, 50, H); B.solid(W, 0, 50, H); B.solid(0, 0, W, 40);
    var g = rect(0, 370, W, 250, 'url(#pave)', ' stroke="none"');
    g += rect(160, 40, 560, 330, '#262C35') + rect(160, 40, 560, 330, 'url(#tileF)', ' opacity=".35"');
    for (var k = 0; k < 9; k++) g += '<ellipse cx="' + (200 + r() * 480).toFixed(0) + '" cy="' + (80 + r() * 260).toFixed(0) + '" rx="' + (20 + r() * 40).toFixed(0) + '" ry="' + (10 + r() * 20).toFixed(0) + '" fill="#141A20" opacity=".7" stroke="none"/>';
    [[160, 40], [700, 40], [160, 352], [700, 352], [400, 352], [500, 352]].forEach(function (p) { g += rect(p[0], p[1], 20, 18, '#3A3430'); });
    // nền gian thờ: miếng xi măng nứt, bốn lỗ chốt, chốt đông nam bị chém
    g += rect(416, 160, 90, 64, '#8C949B') + '<path class="d" d="M430,170 l20,18 l-6,14 l24,10" stroke="#3A4552"/>';
    g += '<circle cx="420" cy="164" r="6" fill="#4A3532"/><circle cx="502" cy="164" r="6" fill="#4A3532"/><circle cx="420" cy="220" r="6" fill="#4A3532"/>';
    g += '<circle cx="502" cy="220" r="6" fill="#4A3532"/><path d="M497,215 l10,10" stroke="#C8B080" stroke-width="2"/>';
    // miếu tạm mái tôn
    g += rect(540, 70, 120, 70, '#3A4250') + rect(560, 110, 80, 26, '#5A2A2A') + '<circle cx="600" cy="104" r="3" fill="#F2C230" stroke="none"/>';
    // bia tưởng niệm
    g += rect(676, 410, 48, 56, '#8C949B') + rect(680, 414, 40, 30, '#6F7C88', ' stroke-width="1.5"') + rect(684, 448, 32, 14, '#4B5560', ' stroke-width="1.5"');
    g += rect(0, 610, W, H - 610, 'url(#water)') + rect(430, 560, 100, H - 560, '#4A4038');
    B.bg += ink(g);
    B.solid(676, 440, 48, 26); B.solid(540, 70, 120, 70);
    [[160, 40], [700, 40], [160, 352], [700, 352], [400, 352], [500, 352]].forEach(function (p) { B.solid(p[0], p[1], 20, 18); });
    B.solid(0, 615, 430, H - 615); B.solid(530, 615, W - 530, H - 615);
    B.tree(70, 470);
    if (gio) { // ngày giỗ: khói hương, cờ phướn
      var f = '';
      for (var i = 0; i < 6; i++) f += '<path d="M' + (570 + i * 12) + ',100 q-6,-20 4,-40 q8,-16 -2,-30" fill="none" stroke="#8C949B" stroke-width="1.5" opacity=".6"/>';
      f += '<path d="M250,380 V300 l40,14 l-40,14" fill="#A32E36" stroke-width="2"/><path d="M820,380 V300 l40,14 l-40,14" fill="#A32E36" stroke-width="2"/>';
      B.bg += ink(f);
    }
    return B.done();
  };

  G.scenes.ham_96 = function (W, H) {
    var B = new B0(W, H), S = G.S;
    B.bg += rect(0, 0, W, H, '#0F141B');
    B.solid(-50, 0, 50, H); B.solid(W, 0, 50, H); B.solid(0, 0, W, 60); B.solid(0, H - 20, W, 20);
    var g = rect(40, 60, 880, 460, '#262C35') + rect(40, 60, 880, 460, 'url(#tileF)', ' opacity=".4"');
    g += rect(40, 60, 880, 40, '#3A3430');
    // giếng phong ấn và bốn chốt lim
    g += '<ellipse cx="480" cy="320" rx="80" ry="60" fill="#3A3430"/><ellipse cx="480" cy="316" rx="62" ry="44" fill="#0E1A22"/>';
    g += '<path d="M440,316 q20,-8 40,0 t40,0" fill="none" stroke="#273746" stroke-width="2"/>';
    [[380, 240], [580, 240], [380, 400], [580, 400]].forEach(function (p, i) {
      g += rect(p[0] - 9, p[1] - 30, 18, 40, '#4A3532') + '<path d="M' + (p[0] - 9) + ',' + (p[1] - 20) + ' h18" stroke-width="2"/>';
      if (i === 3) g += '<path d="M' + (p[0] - 12) + ',' + (p[1] - 6) + ' q12,8 24,0" fill="none" stroke="#C8B080" stroke-width="3"/>';
    });
    // bao xi măng, dép
    g += rect(100, 280, 60, 40, '#8C949B') + rect(150, 296, 60, 40, '#8C949B') + rect(120, 320, 70, 40, '#8C949B') + rect(96, 340, 140, 30, '#6F7C88', ' opacity=".8"');
    g += '<ellipse cx="214" cy="364" rx="12" ry="6" fill="#3F7566" stroke-width="2"/>';
    // hốc tường có bia đá
    g += rect(800, 240, 80, 90, '#1B222C') + rect(812, 252, 56, 70, '#6F7C88') + '<path class="d" d="M820,266 h40M820,280 h40M820,294 h34M820,308 h40" stroke="#2B3138"/>';
    // thang lên nắp hầm
    g += rect(456, 40, 6, 100, '#6A5846') + rect(498, 40, 6, 100, '#6A5846');
    for (var y = 52; y < 140; y += 18) g += '<path d="M459,' + y + ' h42" stroke-width="3"/>';
    B.bg += ink(g);
    B.glow += '<ellipse class="glow" cx="480" cy="80" rx="120" ry="60" fill="url(#lampW)"/>';
    B.solid(400, 262, 160, 110); B.solid(96, 280, 140, 90); B.solid(800, 240, 80, 70);
    [[380, 240], [580, 240], [380, 400], [580, 400]].forEach(function (p) { B.solid(p[0] - 9, p[1] - 10, 18, 14); });
    return B.done();
  };

  // ======================= LỜI THOẠI =======================
  Object.assign(G.TEXT, {
    riu_look: [
      { text: 'Chiếc rìu treo trước xưởng, cán lim đen bóng. [[Lưỡi rìu khắc mái đình, giống hệt mặt sau chiếc gương.]]' },
      { text: 'Lưỡi rìu [[mẻ một miếng hình răng cưa]], như từng chém vào thứ gì rất cứng.' }
    ],
    bia: [
      { text: 'Bia tưởng niệm nạn nhân vụ cháy đình 1996. Dòng thứ ba: **Hạnh, không tìm thấy thi thể.** Dòng cuối: **Rạng, chết đuối ở bến.**' },
      { text: 'Bên dưới có một tấm nhỏ hơn: "Người mất dưới sông". [[1992 — Nguyễn Thị Mai. 1994 — Phạm Văn Út.]]' },
      { who: 'Tôi', text: 'Mai, Út... đúng tên trong danh sách "người được chọn" Vy chép.' }
    ],
    nen_tho: [
      { text: 'Nền gian thờ cũ đã bị đổ xi măng, nứt chân chim. Bốn góc có [[bốn lỗ chốt gỗ lim]].' },
      { text: 'Ba chốt còn nguyên. [[Chốt góc đông nam bị chém cụt, vết chém xiên, mẻ răng cưa.]]' },
      { text: 'Tôi cúi sát khe nứt. Hơi lạnh phả lên. Bên dưới có [[tiếng thở rất chậm]], và tiếng nước.' },
      { text: 'Rồi một tiếng gọi, rất xa, như qua nhiều lớp nước: "...Hạnh..."' },
      { text: 'Tôi giật lùi lại. Mặt xi măng khô ráo như chưa từng có gì.' }
    ],
    gio_khai: [
      { text: 'Ông Khải đứng trước miếu tạm, đọc văn tế. Dân làng cúi đầu.' },
      { who: 'Ông Khải', text: 'Lễ tế thần sông xưa là để [[giữ làng yên]]. Chỉ là lễ thôi, [[có ai mất đâu]]. Bà con đừng tin mấy chuyện ma quỷ.' },
      { text: 'Bà Năm đứng cuối hàng, miệng mấp máy: "...thằng Lộc..."' }
    ],
    do_qua_text: 'Sang đình cũ không cháu? Bác chở, cả xe cũng được.',
    gieng: [
      { text: 'Miệng giếng đen kịt. Mặt nước phẳng lặng không gợn, [[dù không có gió]].' },
      { text: 'Tôi nhìn lâu một chút. Mặt nước... nhìn lại tôi.' }
    ],
    chot_dn: [
      { text: 'Chốt lim góc đông nam. Quanh chốt [[quấn một vòng dây thừng mới]], còn thơm mùi đay.' },
      { who: 'Tôi', text: 'Người ta chuẩn bị trói ai đó ở đây. Vào đêm rằm.' }
    ],
    bao: [
      { text: 'Mấy chục bao xi măng, có bao đã đổ, đông cứng thành một khối lổn nhổn.' },
      { text: 'Dưới lớp xi măng mới đổ, kẹt [[một chiếc dép tổ ong xanh]], cỡ người lớn.' }
    ],
    ham_arrive: [
      { text: 'Tôi trèo xuống. Hầm rộng hơn tưởng tượng, lạnh như trong tủ đá.' },
      { text: 'Giữa hầm là [[miệng giếng đá]], bốn góc cắm bốn chốt gỗ lim.' },
      { text: 'Cạnh hốc tường bên phải có [[một bóng người đội nón lá]], mờ như hơi nước. Bóng ấy giơ tay chỉ vào hốc tường, rồi tan đi.' }
    ],
    stone: [
      { text: 'Trong hốc tường là một tấm bia đá cổ, chữ khắc mòn.' },
      { text: '[["Bốn chốt lim giữ miệng giếng. Thủy khí bị giam, không ăn người."]]' },
      { text: '[["Chặt chốt đông nam thì cửa mở, nước dâng, khí thoát."]]' },
      { who: 'Tôi', text: 'Không có chữ nào nói phải dâng người. Nhóm ông Khải bịa ra chuyện tế. Nhưng [[cái thứ dưới giếng thì có thật]].' },
      { text: 'Mặt giếng sủi bọt. Một tiếng thở dài rất sâu. [[Nước bắt đầu tràn qua miệng giếng.]]' },
      { text: '(Nước đang dâng. Leo thang ra khỏi hầm trước khi nước ngập.)' }
    ],
    chop_locked: [{ text: 'Nắp hầm cài một then gỗ lim to bằng cổ tay, khóa trái từ bên trên. Tay không thì không mở nổi.' }],
    chop: [
      { text: 'Tôi vung rìu. Then lim gãy đôi, tiếng vang dội khắp gian đình.' },
      { text: 'Từ dưới hầm, có thứ gì đó [[trở mình]].' }
    ],
    ham_out: [
      { text: 'Tôi trèo ra, đóng sập nắp hầm. Nước dưới kia vỗ lên ván, rồi lặng dần.' },
      { who: 'Tôi', text: 'Phải trả rìu cho ông Rạng. Rằm này nó sẽ cần.' }
    ],
    ham_fail: 'Nước ngập tới ngực, lạnh buốt. Tôi trượt chân, chìm xuống.',
    rang1: [
      { text: 'Trước cửa nhà số 9, một người đàn ông đội mũ cối ngồi vót nan. Đèn dầu trong nhà còn sáng.' },
      { who: 'Ông Rạng', text: 'Cậu là cái cậu hay lội sông mà thằng Tư kể đấy hả?' },
      { who: 'Tôi', text: 'Cháu cần xuống hầm dưới gian thờ. Mẹ cháu... chị Hạnh bán trà, đang gặp nguy.' },
      { who: 'Ông Rạng', text: 'Chị Hạnh... Sáng nào tôi với thằng Ba cũng uống trà chị ấy.' },
      { who: 'Ông Rạng', text: 'Dưới gian thờ có [[giếng phong]]. Năm 95 sửa đình, tôi với thằng Ba đào được [[cái rìu của ông tổ]] cạnh giếng. Tôi giữ nó.' },
      { who: 'Ông Rạng', text: 'Thằng Khải bảo đổ xi măng để "giữ yên". [[Nó đang đổ xi măng lên người ta đấy.]]' },
      { who: 'Ông Rạng', text: 'Cầm lấy. Nắp hầm cài then lim, chỉ rìu này chặt được. Xong việc mang trả tôi. [[Đêm rằm tôi sẽ đợi ở bến.]] (Đã nhận: **Rìu cổ**)' }
    ],
    rang_tra: [
      { who: 'Ông Rạng', text: 'Xuống được rồi hả? Mặt cậu trắng bệch.' },
      { who: 'Tôi', text: 'Dưới đó có thứ thật, bác ạ. Và có cả người.' },
      { who: 'Ông Rạng', text: 'Tôi biết. Đưa rìu đây, tôi cất. Rằm này ra bến, tôi đưa lại cậu.' },
      { text: 'Ông bọc cái rìu trong mảnh [[vải dầu]], buộc chặt như bọc thứ gì quý lắm.' }
    ],
    rang_idle: [{ who: 'Ông Rạng', text: 'Về đi, khuya rồi. Sông đêm nay nước lên nhanh.' }],
    back_n4_axe: [{ text: 'Chiếc rìu không có dấu gương. Phải trả ông Rạng trước đã.' }],
    back_n4_wait: [{ text: 'Chưa. Đêm nay phải xuống được cái hầm.' }],
    arrive96_4: [
      { text: 'Tờ lịch: [[mùng 13 tháng 8 Âm lịch, 1996]]. Hai ngày nữa là rằm.' },
      { text: 'Bên bến sông, nhà số 9 còn sáng đèn.' }
    ],
    mirror_n4: [{ text: 'Mặt gương sáng lên: bến sông, nhà số 9 còn sáng đèn, một người đội mũ cối ngồi trước cửa.' }],
    mirror_ch3: [{ text: 'Mặt gương mờ đục. (Sang đình cũ xem nền gian thờ đã.)' }],
    mirror_end4: [{ text: 'Mặt gương mờ đục. Hai đêm nữa là rằm. (Hết phần đã làm của chương 3.)' }]
  });

  // lời thoại thêm
  G.DIALOGUE.khai_gio = [
    { id: 'kg1', lines: function () { return G.TEXT.gio_khai; }, after: function () { G.addClue('t_khai_yen'); } }
  ];
  insertBefore(G.DIALOGUE.ong_khai, 'khai_after_le', [ // đứng trước câu "đêm cháy" để không bị che
    { id: 'khai_yen', cond: function (S) { return !!S.flags.ch2_end && !S.clues.t_khai_yen; }, after: function () { G.addClue('t_khai_yen'); }, lines: [
      { who: 'Tôi', text: 'Bác Khải, lễ "tế thần sông" ngày xưa là thế nào ạ?' },
      { who: 'Ông Khải', text: 'Lễ ấy để [[giữ làng yên]]. Chỉ là lễ thôi, [[có ai mất đâu]]. Cậu đừng nghe người ta đồn.' }
    ] }
  ]);
  G.DIALOGUE.rang_96 = [
    { id: 'r_tra', cond: function (S) { return !!S.flags.n4_out && !!S.items.riu_96; }, lines: function () { return G.TEXT.rang_tra; },
      after: function (S) { delete S.items.riu_96; S.flags.riu_tra = true; } },
    { id: 'r1', cond: function (S) { return !S.items.riu_96 && !S.flags.riu_tra; }, lines: function () { return G.TEXT.rang1; },
      after: function (S) { S.items.riu_96 = true; G.ui.toast('Đã nhận: **Rìu cổ**'); } },
    { id: 'r_idle', lines: function () { return G.TEXT.rang_idle; } }
  ];
  insertBefore(G.DIALOGUE.bac_ba, 'ba_buy', [
    { id: 'ba_riu', cond: function (S) { return !!S.flags.ch2_end && !S.clues.t_ba_riu; }, lines: [
      { who: 'Tôi', text: 'Bác Ba, dưới gian thờ ngoài cái hầm còn có gì nữa ạ? Cháu đọc thư Vy rồi.' },
      { who: 'Bác Ba', text: 'Có [[cái giếng]], bốn góc đóng bốn chốt lim. Các cụ bảo giam thứ gì dưới đó từ đời ông tổ.' },
      { who: 'Bác Ba', text: 'Sửa đình năm 95, bác với ông Rạng đào được [[cái rìu cổ]] cạnh giếng. Ông Rạng giữ.' },
      { who: 'Bác Ba', text: '[[Sau đám cháy bác tìm thấy nó trong tro đình]], lưỡi mẻ một miếng. Bác treo trước xưởng đến giờ.' },
      { who: 'Bác Ba', text: 'Mai là [[giỗ chung ở đình cũ]]. Cả làng sang thắp hương, đông lắm. Cháu mang xe sang mà bán, nhờ ông Tư chở.' }
    ], after: function (S) { G.addClue('t_ba_riu'); if (!S.flags.gio_day) S.flags.gio_day = S.day + 1; } }
  ]);
  insertBefore(G.DIALOGUE.bac_do, 'do_idle', [
    { id: 'do_qua', cond: function (S) { return !!S.flags.ch2_end; }, lines: function (S) {
      return [{ who: 'Bác Tư lái đò', text: (isGio(S) ? 'Hôm nay giỗ chung, cả làng sang đình cũ. ' : '') + G.TEXT.do_qua_text, choices: [
        { text: 'Sang đình cũ', run: function () { fadeTo(function () { G.world.enter('dinh_nay', 480, 540); G.acts.dinhNayArrive(); }); } },
        { text: 'Thôi ạ', run: function () {} }
      ] }];
    } }
  ]);

  // ======================= MỤC TIÊU =======================
  var iEnd = G.OBJECTIVES.findIndex(function (o) { return o.id === 'het'; });
  G.OBJECTIVES.splice(iEnd, 0,
    { id: 'ch3_ba', text: 'Chương 3. Hỏi bác Ba (xưởng MỘC BA) về cái hầm dưới gian thờ', done: function (S) { return !!S.clues.t_ba_riu; } },
    { id: 'ch3_riu', text: 'Xem chiếc rìu treo trước xưởng MỘC BA', done: function (S) { return !!S.clues.e_riu; } },
    { id: 'ch3_dinh', text: function (S) { return (isGio(S) ? 'Hôm nay giỗ chung! ' : '') + 'Nhờ bác Tư (bến sông) chở sang đình cũ: đọc bia, xem nền gian thờ'; },
      done: function (S) { return !!S.clues.e_bia && !!S.clues.e_chot; } },
    { id: 'ch3_khai', text: 'Nghe ông Khải nói về lễ tế (giỗ chung, hoặc gặp ông ở xóm), rồi đối chiếu với tấm bia', done: function (S) { return !!S.deduce.q_khai_te; } },
    { id: 'ch3_doi_riu', text: 'Đối chiếu lời bác Ba về chiếc rìu với cái chốt bị chém', done: function (S) { return !!S.deduce.q_riu_chot; } },
    { id: 'ch3_dem4', text: 'Sau 19:00 chạm vào gương: đêm mùng 13', done: function (S) { return S.pnight === 4 || !!S.flags.n4_done; } },
    { id: 'ch3_rang', era: '1996', text: 'Nhà số 9 (bến sông) còn sáng đèn. Tìm ông Rạng', done: function (S) { return !!S.items.riu_96 || !!S.flags.riu_tra; } },
    { id: 'ch3_ham', era: '1996', text: 'Sang đình (nhờ đò). Dùng rìu phá then nắp hầm giữa gian thờ', done: function (S) { return !!S.flags.ham_open; } },
    { id: 'ch3_bia', era: '1996', text: 'Dưới hầm: tìm hiểu cái giếng. Bóng ma chỉ về hốc tường bên phải', done: function (S) { return !!S.clues.e_bia_da; } },
    { id: 'ch3_thoat', era: '1996', text: 'Nước đang dâng! Leo thang ra khỏi hầm', done: function (S) { return !!S.flags.n4_out; } },
    { id: 'ch3_tra', era: '1996', text: 'Trả rìu cho ông Rạng (bến sông), rồi về nhà chạm gương', done: function (S) { return !!S.flags.n4_done; } },
    { id: 'ch3_phong', text: 'Đối chiếu thư của Vy với tấm bia đá dưới hầm', done: function (S) { return !!S.deduce.q_phong_an; } }
  );
  G.OBJECTIVES[G.OBJECTIVES.length - 1].text = 'Hết chương 3. Chương 4 đang được viết. Bán tiếp, trò chuyện, đối chiếu nốt trong Sổ tùy ý.';

  // ======================= HÀNH ĐỘNG =======================
  var A = G.acts;
  var mirror3 = A.mirror, back3 = A.mirror_back;
  A.mirror = function (t) {
    var S = G.S;
    if (S.flags.n4_done) { G.ui.dialog(G.TEXT.mirror_end4); return; }
    if (S.flags.ch2_end && S.flags.n3_done) {
      if (!S.clues.e_chot) { G.ui.dialog(G.TEXT.mirror_ch3); return; }
      if (S.min < 19 * 60) { G.ui.dialog(G.TEXT.mirror_day); return; }
      G.ui.dialog(G.TEXT.mirror_n4.concat([{ text: 'Chạm vào gương?', choices: [
        { text: 'Chạm vào mặt gương', run: function () { A.goPast4(); } },
        { text: 'Chưa, để chuẩn bị đã', run: function () {} }
      ] }]));
      return;
    }
    mirror3(t);
  };
  A.goPast4 = function () {
    var S = G.S;
    fadeTo(function () {
      S.era = '1996'; S.pnight = 4; S.pmin = 22 * 60 + 30; S.view = 'front';
      G.world.enter('nha_96', 375, 214);
      G.save();
      G.ui.dialog(G.TEXT.arrive96_4);
    });
  };
  A.mirror_back = function (t) {
    var S = G.S;
    if (S.pnight !== 4) { back3(t); return; }
    if (S.items.riu_96) { G.ui.dialog(G.TEXT.back_n4_axe); return; }
    if (!S.flags.n4_out) { G.ui.dialog(G.TEXT.back_n4_wait); return; }
    G.ui.dialog(G.TEXT.back_n3, function () {
      S.era = null; S.flags.n4_done = true; S.past.n4 = 'done';
      G.world.endDay('Tôi ngã ra khỏi gương. Áo quần còn mùi nước giếng lạnh.');
    });
  };
  A.dinhNayArrive = function () {
    var S = G.S;
    if (isGio(S) && !S.flags.gio_seen) { S.flags.gio_seen = true; G.ui.toast('Giỗ chung: đình cũ đông người. Bày sạp ở ô nét đứt.', 3500); }
  };
  A.ferry_home = function () { fadeTo(function () { G.world.enter('ben_song', 690, 760); }); };
  A.chop = function () {
    var S = G.S;
    if (S.flags.ham_open) { A.enterHam(); return; }
    if (!S.items.riu_96) { G.ui.dialog(G.TEXT.chop_locked); return; }
    G.ui.dialog(G.TEXT.chop, function () { S.flags.ham_open = true; A.enterHam(); });
  };
  A.enterHam = function () {
    fadeTo(function () {
      var S = G.S;
      S.danger = 'ham'; S.checkpoint = null; S.x = 480; S.y = 170;
      S.checkpoint = JSON.stringify(Object.assign({}, S, { loc: 'ham_96', x: 480, y: 170 }));
      G.world.enter('ham_96', 480, 170);
      if (!S.flags.ham_seen) { S.flags.ham_seen = true; G.ui.dialog(G.TEXT.ham_arrive); }
    });
  };
  A.stone = function () {
    var S = G.S;
    G.ui.dialog(G.TEXT.stone, function () { G.addClue('e_bia_da'); S.flags.water = true; W.start(); });
  };
  A.ham_exit = function () {
    var S = G.S;
    W.stop();
    if (!S.clues.e_bia_da) { // ra sớm, chưa đọc bia: cho lên, có thể xuống lại
      fadeTo(function () { S.danger = null; S.checkpoint = null; G.world.enter('dinh_96', 460, 290); });
      return;
    }
    fadeTo(function () {
      S.danger = null; S.checkpoint = null; S.flags.n4_out = true; S.flags.water = false;
      G.world.enter('dinh_96', 460, 290);
      G.ui.dialog(G.TEXT.ham_out);
    });
  };

  // ======================= NƯỚC DÂNG DƯỚI HẦM =======================
  var W = { active: false, t: 0, LIMIT: 22 };
  W.start = function () {
    W.active = true; W.t = 0;
    var o = document.getElementById('flood');
    if (!o) { o = document.createElement('div'); o.id = 'flood'; document.getElementById('stage').insertBefore(o, document.getElementById('hud')); }
    o.hidden = false; o.style.height = '0%';
  };
  W.stop = function () { W.active = false; var o = document.getElementById('flood'); if (o) o.hidden = true; };
  W.fail = function () {
    W.stop();
    G.ui.dialog([{ text: '[[' + G.TEXT.ham_fail + ']]' }, { text: 'Tải lại từ điểm lưu cảnh (lúc vừa xuống hầm).' }], function () {
      fadeTo(function () {
        var cp = G.S.checkpoint;
        G.S = JSON.parse(cp); G.S.checkpoint = cp;
        G.world.enter('ham_96', 480, 170);
      });
    });
  };
  var tick2 = G.tick;
  G.tick = function (dt) {
    if (tick2) tick2(dt);
    var S = G.S;
    if (W.active && S.loc === 'ham_96' && !G.ui.isBusy()) {
      W.t += dt;
      var o = document.getElementById('flood'); if (o) o.style.height = Math.min(100, W.t / W.LIMIT * 100) + '%';
      if (W.t >= W.LIMIT) W.fail();
    }
    if (S && S.deduce.q_phong_an && !S.flags.ch3_end && !G.ui.isBusy()) { S.flags.ch3_end = true; G.ui.chapterEnd3(); }
  };
  var onEnter2 = G.onEnter;
  G.onEnter = function (locId) {
    if (onEnter2) onEnter2(locId);
    if (locId !== 'ham_96') W.stop();
    // tải lại điểm lưu khi nước đang dâng: dâng lại từ đầu sau khi đọc bia lần nữa
    if (locId === 'ham_96' && G.S.flags.water && !W.active) { G.S.flags.water = false; }
  };

  G.ui.chapterEnd3 = function () {
    var S = G.S, nd = Object.keys(S.deduce).length;
    var p = document.getElementById('ending');
    p.innerHTML = '<h2>Hết chương 3</h2><p class="sub">Tội ác và tâm linh cùng tồn tại</p><div class="list help-list">' +
      '<div>Nhóm ông Khải dùng lễ "tế thần sông" để che những vụ mất tích. <b class="clue">Anh Lộc</b> đã ở dưới hầm.</div>' +
      '<div>Nhưng <b class="hl">phong ấn là thật</b>: bốn chốt lim giam một thứ dưới giếng. Chặt chốt đông nam thì cửa mở, nước dâng.</div>' +
      '<div>Ông Rạng giữ chiếc rìu, hẹn đêm rằm đợi ở bến. Chốt đông nam ở năm 2026 đã bị chém, bằng chính lưỡi rìu ấy.</div>' +
      '<div>Còn chờ phía trước: <b class="clue">đêm rằm</b>, người đeo mặt nạ cầm rìu, và đám cháy.</div>' +
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
