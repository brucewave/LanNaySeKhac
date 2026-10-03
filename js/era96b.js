// Bước 6: sự kiện kinh dị có lời giải (dấu chân ướt), đêm mốc 2 có cảnh nguy hiểm + điểm lưu cảnh, đoạn kết bản chơi thử.
var G = window.G || (window.G = {});

(function () {
  var h = G.scenes.h, rect = h.rect, ink = h.ink, txt = h.txt, INK = h.INK;
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

  // ======================= ĐÌNH 1996 (dựng lại gọn để thấy cả sân khi lẻn) =======================
  // Vùng tối để nấp: người gác không thấy người đứng trong đây
  var SHADOWS = [[10, 390, 215, 170], [180, 130, 150, 110], [610, 130, 100, 100], [774, 172, 152, 184]];
  G.scenes.dinh_96 = function (W, H) {
    var B = new B0(W, H), r = G.scenes.rng(77), S = G.S;
    B.bg += rect(0, 0, W, H, '#1B222C');
    B.solid(-50, 0, 50, H); B.solid(W, 0, 50, H); B.solid(0, 0, W, 40);
    B.bg += ink(rect(0, 370, W, 250, 'url(#pave)', ' stroke="none"'));
    // gian đình bỏ mái
    B.room(160, 40, 560, 330, 'url(#tileF)', [[400, 520]]);
    var g = rect(300, 46, 320, 30, '#5A2A2A') + txt(460, 68, 18, '#E2D2A0', 'ĐÌNH LÀNG');
    g += rect(398, 78, 124, 50, '#5A2A2A') + rect(398, 78, 124, 12, '#948C5E');
    g += '<circle cx="428" cy="74" r="3" fill="#F2C230" stroke="none"/><circle cx="492" cy="74" r="3" fill="#F2C230" stroke="none"/>';
    g += rect(426, 170, 68, 44, '#857761') + '<path class="d" d="M426,182 h68M426,194 h68M426,206 h68"/>';
    g += rect(196, 150, 110, 70, '#A32E36') + '<path d="M192,150 l14,-16 h90 l14,16" fill="#6A2A2A"/><path class="d" d="M196,180 h110"/>';
    g += '<circle cx="660" cy="176" r="26" fill="#6A5846"/><circle cx="660" cy="176" r="16" fill="#C3CACD" stroke-width="2"/>';
    B.bg += ink(g);
    B.solid(398, 78, 124, 50); B.solid(192, 140, 118, 82); B.solid(634, 150, 52, 52);
    B.glow += '<ellipse class="glow" cx="460" cy="140" rx="140" ry="70" fill="url(#lampW)"/>';
    // kho: kệ, bàn để sổ, xà nhà góc trong
    B.room(760, 120, 180, 250, 'url(#wood)', [[804, 878]]);
    var k = rect(774, 176, 22, 110, '#4A3532') + '<path class="d" d="M774,206 h22M774,236 h22M774,266 h22"/>';
    k += rect(846, 270, 60, 40, '#5A4A3C') + rect(860, 276, 32, 22, '#D5DCE0', ' stroke-width="1.5"') + '<path class="d" d="M876,276 v22"/>';
    k += '<path d="M860,140 h70" stroke="#4A3532" stroke-width="10"/><path d="M860,140 h70" stroke-width="2"/>';
    if (!(S && S.flags.vy_pages) && S && S.pnight === 2) k += rect(900, 146, 16, 12, '#D5DCE0', ' stroke-width="1.5"');
    B.bg += ink(k);
    B.solid(774, 176, 22, 110); B.solid(846, 270, 60, 40);
    // chiêng treo dưới gốc cây
    B.prop(166, 410, 54, 64, '<path d="M172,470 V416 H214 V470" fill="none" stroke-width="5"/><path d="M172,470 V416 H214 V470" fill="none" stroke="#6A5846" stroke-width="2"/>' +
      '<circle cx="193" cy="440" r="13" fill="#9C7A3C" stroke-width="2.5"/><circle cx="193" cy="440" r="5" fill="#C8B080" stroke-width="1.5"/>', 470);
    B.solid(170, 462, 46, 10);
    // sông và bến
    B.bg += ink(rect(0, 610, W, H - 610, 'url(#water)') + rect(430, 560, 100, H - 560, '#3B2E26'));
    B.solid(0, 615, 430, H - 615); B.solid(530, 615, W - 530, H - 615);
    B.tree(70, 470);
    // vùng tối (gợi ý chỗ nấp) trong đêm nguy hiểm
    if (S && S.pnight === 2) SHADOWS.forEach(function (z) { B.bg += rect(z[0], z[1], z[2], z[3], INK, ' opacity=".22" rx="16"'); });
    // dây đèn lồng
    var fg = '<path d="M0,380 Q240,440 480,390 T960,380" fill="none" stroke-width="1.6"/>';
    for (var i = 1; i < 12; i++) {
      var lx = i * 80, ly = 380 + Math.sin(i / 11 * Math.PI * 2) * 18 + 28;
      fg += '<ellipse cx="' + lx + '" cy="' + ly + '" rx="9" ry="12" fill="#A32E36" stroke-width="2"/>';
      B.glow += '<ellipse class="glow" cx="' + lx + '" cy="' + (ly + 80) + '" rx="60" ry="30" fill="url(#lampW)"/>';
    }
    B.fgs += fg;
    [380, 580].forEach(function (x) {
      B.glow += '<ellipse class="glow" cx="' + x + '" cy="568" rx="80" ry="40" fill="url(#lampW)"/>';
      B.prop(x - 20, 430, 40, 136, '<path d="M' + x + ',560 V450" stroke-width="6"/><path d="M' + x + ',560 V450" stroke="#4A4038" stroke-width="2.5"/>' +
        rect(x - 9, 442, 18, 22, '#E2B060', ' stroke-width="2"'), 562);
      B.solid(x - 5, 552, 10, 10);
    });
    return B.done();
  };

  var L = G.LOCATIONS.dinh_96;
  L.height = 680; L.camBias = 200;
  L.things = [
    { id: 'ben_dinh', x: 480, y: 600, label: 'Lên đò về bờ bên kia', act: 'ferry_back' },
    { id: 'chieu_ham', x: 460, y: 234, hit: [426, 170, 68, 44], label: 'Lật tấm chiếu', act: 'look', text: 'chieu_ham', clue: 'e_ham_96',
      quest: function (S) { return !S.clues.e_ham_96; } },
    { id: 'ban_tho_dinh', x: 460, y: 154, hit: [398, 72, 124, 58], act: 'hide', spot: 'dinh',
      label: function (S) { return S.items.trang_so ? 'Giấu trang sổ dưới bàn thờ' : 'Xem bàn thờ đình'; } },
    { id: 'so_thu_chi', x: 876, y: 336, hit: [846, 262, 60, 50], label: 'Xem cuốn sổ', act: 'ledger',
      quest: function (S) { return S.pnight !== 2 && !S.items.trang_so && !S.flags.page_hidden; } },
    { id: 'chieng', x: 193, y: 492, hit: [166, 410, 54, 64], label: 'Đánh chiêng', act: 'gong',
      cond: function (S) { return S.pnight === 2; }, quest: function (S) { return !S.flags.mom_escaped; } },
    { id: 'xa_nha', x: 880, y: 204, hit: [856, 124, 80, 44], label: 'Xem trên xà nhà', act: 'vy_pages',
      cond: function (S) { return S.pnight === 2 && !!S.flags.mom_escaped && !S.flags.vy_pages; }, quest: function () { return true; } }
  ];
  G.NPCS.dan_96.schedule[0].x = 300; G.NPCS.dan_96.schedule[0].y = 470;
  G.NPCS.dan_96.cond = function (S) { return S.pnight !== 2; };
  G.NPCS.khai_96.cond = G.NPCS.tho_96.cond = function (S) { return !S.flags.overheard && S.pnight !== 2; };
  G.NPCS.khai_96.schedule[0].x = 540; G.NPCS.khai_96.schedule[0].y = 250;
  G.NPCS.tho_96.schedule[0].x = 590; G.NPCS.tho_96.schedule[0].y = 262;

  // gương ở nhà có dấu ! khi đêm mốc 2 đã sẵn sàng
  var gThing = G.LOCATIONS.nha.things.find(function (t) { return t.id === 'guong_nha'; }), gq = gThing.quest;
  gThing.quest = function (S) { return gq(S) || (!!S.flags.footprints_seen && !S.flags.n2_done && S.min >= 19 * 60); };

  // Nhà 1996 đêm 2: lời nhắn khác
  var n96 = G.LOCATIONS.nha_96.things;
  n96.find(function (t) { return t.id === 'thu_me'; }).cond = function (S) { return S.pnight !== 2; };
  n96.push({ id: 'thu_me2', x: 255, y: 344, hit: [210, 262, 90, 50], label: 'Xem mảnh giấy', act: 'look', text: 'thu_me2',
    cond: function (S) { return S.pnight === 2; } });

  // ======================= DẤU CHÂN ƯỚT TRONG NHÀ (năm 2026) =======================
  var nhaPrev = G.scenes.nha;
  G.scenes.nha = function (W, H) {
    var sc = nhaPrev(W, H), S = G.S;
    if (S && S.flags.footprints_seen && !S.flags.n2_done) {
      var f = '';
      var pts = [[262, 470], [248, 438], [236, 402], [220, 366], [204, 330], [188, 296], [170, 262], [150, 236], [132, 216]];
      pts.forEach(function (p, i) {
        var dx = i % 2 ? 8 : -8;
        f += '<ellipse cx="' + (p[0] + dx) + '" cy="' + p[1] + '" rx="6" ry="10" fill="#3F5A6A" fill-opacity=".8" stroke="none"/>';
        f += '<path d="M' + (p[0] + dx - 4) + ',' + (p[1] - 4) + ' h8M' + (p[0] + dx - 4) + ',' + (p[1] + 2) + ' h8" stroke="#22303A" stroke-width="1.4"/>';
      });
      f += '<path d="M110,198 q8,-10 16,0 q8,10 16,0" fill="none" stroke="#58755C" stroke-width="3"/>';
      h.addBg(sc, f);
    }
    return sc;
  };

  // ======================= ĐỒ, MANH MỐI, ĐỐI CHIẾU =======================
  Object.assign(G.CLUES, {
    e_dau_chan: { kind: 'ev', title: 'Dấu chân ướt dẫn tới gương', loc: 'Nhà cũ', source: 'Tự mắt thấy',
      people: [], topics: ['rang', 'guong'], about: 'có ai đó từ dưới sông lên, vào nhà, tới chỗ chiếc gương',
      text: 'Từ cửa vào tới nóc tủ có [[dấu chân ướt đế giày bộ đội]], nước còn đọng. Trên tủ vương [[rong sông]]. Cửa vẫn cài từ bên trong.' },
    e_me_96: { kind: 'ev', title: 'Mẹ lục sổ thu chi (1996)', loc: 'Đình làng · 1996', source: 'Tự mắt thấy',
      people: ['Mẹ'], topics: ['me', 'tien'], about: 'mẹ đang tìm bằng chứng trong sổ thu chi',
      text: 'Đêm mùng 10, mẹ lẻn vào kho đình lật cuốn sổ thu chi, khựng lại ở [[chỗ trang bị xé]]: "Ai lấy mất rồi..."' },
    e_trang_vy: { kind: 'ev', title: 'Trang sổ tay của Vy (1996)', loc: 'Đình làng · 1996', source: 'Giấu trên xà nhà kho đình',
      people: ['Vy', 'Mẹ'], topics: ['vy'], about: 'Vy đã tới năm 1996 trước tôi',
      text: 'Giấy kẻ ô mới tinh, xé từ cuốn sổ trên bàn học của Vy. Nét chữ Vy: [["Mùng 9/8/1996. Em đã tới. Mẹ bị nghi rồi. Người đeo mặt nạ trong ảnh... em phải tìm ra trước rằm."]]' }
  });
  G.DEDUCTIONS.push(
    { id: 'q_rang_guong', t: 't_ba_rang', e: 'e_dau_chan', type: 'match', title: 'Người để lại dấu chân là ông Rạng',
      fact: 'Bác Ba nói ông Rạng chết đuối ở bến, hay đội mũ cối áo bộ đội; dấu chân ướt là giày bộ đội, có rong sông, dẫn tới chiếc gương.',
      guess: 'Hồn ông Rạng từ dưới sông lên, tới chỗ chiếc gương. Ông không hại ai. Hình như ông muốn tôi qua gương lần nữa.' },
    { id: 'q_vy_truoc', t: 't_vy_guong', e: 'e_trang_vy', type: 'match', title: 'Vy tới năm 1996 trước tôi một đêm',
      fact: 'Vy nhắn qua gương "đừng tìm em nữa"; trang sổ tay của Vy ghi "Mùng 9/8/1996. Em đã tới."',
      guess: 'Vy đang ở đâu đó trong năm 1996, đi trước tôi một bước. Em sợ mẹ thấy mặt tôi. Người đeo mặt nạ trong ảnh là ai?' }
  );

  Object.assign(G.TEXT, {
    footprints: [
      { text: 'Đèn trong nhà chập chờn. Tắt. Sáng. Tắt.' },
      { text: 'Trên sàn gỗ, từ cửa vào, có [[một hàng dấu chân ướt]]. Nước còn đọng, mùi bùn sông.' },
      { text: 'Dấu chân đi thẳng tới nóc tủ, nơi đặt chiếc gương, rồi dừng lại. Trên tủ vương [[một nắm rong sông]].' },
      { text: 'Cửa vẫn cài từ bên trong. Dấu giày đế to, khía ngang, [[như giày bộ đội]].' },
      { who: 'Tôi', text: 'Ai... đã vào đây?' },
      { text: 'Mặt gương lấp lánh như có trăng. Đêm nay nó sẽ mở lần nữa.' }
    ],
    mirror_n2: [{ text: 'Mặt gương sáng lên: sân đình, đèn lồng đỏ, và một bóng người đi tuần cầm đèn.' }],
    mirror_end: [{ text: 'Mặt gương mờ đục. Còn năm đêm nữa là rằm. (Hết phần đã làm của bản chơi thử.)' }],
    arrive96_2: [
      { text: 'Lại mùi nhang trầm, mùi dầu hoả. Tờ lịch: [[mùng 10 tháng 8 Âm lịch, 1996]]. Năm ngày trước rằm.' },
      { text: 'Hai đứa trẻ vẫn ngủ. Mẹ lại không có nhà.' }
    ],
    thu_me2: [
      { text: 'Mẩu giấy hôm trước đã bị gạch. Mẹ viết thêm, nét vội:' },
      { text: '"Nếu mẹ về muộn, [[sáng mai gửi hai đứa sang cô Lan]]."' }
    ],
    back_n2: [{ text: 'Chưa. Mẹ đang ở đình.' }],
    arrive_dinh2: [
      { text: 'Đình tối hơn hôm trước. Trong kho le lói ánh đèn: [[mẹ đang lục cuốn sổ thu chi]].' },
      { text: 'Ngoài sân, [[một người gác cầm đèn]] đi tuần. Hắn đi một vòng sân rồi sẽ ghé qua kho.' },
      { who: 'Tôi', text: 'Không được để hắn vào kho. Cũng không được để hắn thấy mình.' },
      { text: '(Vùng sáng vàng trước mặt người gác là chỗ hắn nhìn thấy. Đứng trong các vùng tối để nấp. Cái chiêng dưới gốc cây có thể dụ hắn đi.)' }
    ],
    ferry_n2: [{ text: 'Mẹ còn ở trong kho. Tôi không thể bỏ đi lúc này.' }],
    gong: [{ text: 'BOONG... Tiếng chiêng vang khắp sân đình.' }],
    gong_after: [{ text: 'Không nên gây động thêm nữa.' }],
    mom_pass: [
      { text: 'Cửa kho hé mở. Mẹ ôm cuốn sổ mỏng, đi vội ra bến.' },
      { text: 'Ngang qua chỗ tôi, mẹ khựng lại. Tôi kéo vội [[chiếc khăn đỏ lên che nửa mặt]].' },
      { who: 'Mẹ', text: 'Ai đánh chiêng... là cậu à?' },
      { text: 'Mẹ trẻ hơn tôi bây giờ. Tay vẫn cầm cái quạt nan, phe phẩy theo thói quen.' },
      { who: 'Mẹ', text: 'Cảm ơn cậu. Đừng ở đây lâu.' },
      { text: 'Mẹ xuống đò. Tôi đứng im cho tới khi chiếc đò khuất vào bóng tối.' }
    ],
    mom_note: [{ text: '(Lúc lục sổ, mẹ khựng lại ở [[chỗ trang bị xé]]. Chính là trang tôi xé đêm mùng 8.)' }],
    ledger_n2: [{ text: 'Cuốn sổ mở đúng chỗ trang bị xé. Mẹ đã xem tới đây.' }],
    vy_pages: [
      { text: 'Trên xà nhà, kẹp sau một thanh gỗ, có mấy tờ giấy gấp đôi.' },
      { text: 'Giấy kẻ ô mới tinh, mép xé răng cưa. [[Là những trang bị xé khỏi cuốn sổ trên bàn học của Vy.]]' },
      { text: 'Nét chữ Vy: [["Mùng 9/8/1996. Em đã tới. Mẹ bị nghi rồi."]]' },
      { text: '[["Người đeo mặt nạ trong ảnh... em phải tìm ra trước rằm."]]' },
      { who: 'Tôi', text: 'Vy đã ở đây. [[Trước mình một đêm.]]' }
    ],
    escape: [
      { text: 'Tiếng bước chân người gác quay lại. Tôi lao ra bến.' },
      { text: 'Ván bến ướt. Tôi trượt chân, rơi tõm xuống sông.' },
      { text: 'Nước lạnh buốt, đen đặc. Có một bàn tay túm lấy cổ áo tôi, kéo lên đò.' },
      { who: 'Anh Tư', text: 'Lại là cậu à? Đêm nào cũng lội sông thế thì chết có ngày.' }
    ],
    return2: [
      { text: 'Tôi ngã ra khỏi gương, ướt sũng nước sông, nằm trên sàn nhà cũ tới sáng.' },
      { text: 'Dấu chân ướt tối qua đã khô. Trên tủ, nắm rong sông cũng biến mất.' },
      { who: 'Tôi', text: 'Mẹ còn sống tới đêm rằm. Vy đang ở đâu đó trong năm 1996. Và người đeo mặt nạ cầm rìu...' }
    ]
  });

  insertBefore(G.DIALOGUE.bac_ba, 'ba_buy', [
    { id: 'ba_chan', once: true, cond: function (S) { return !!S.flags.footprints_seen && !!S.seen.ba_khach; }, lines: [
      { who: 'Tôi', text: 'Bác ơi, tối qua trong nhà cháu có dấu chân ướt, giày bộ đội, dẫn thẳng tới chỗ cái gương.' },
      { who: 'Bác Ba', text: '...Ông Rạng không hại ai đâu cháu. Ông ấy chỉ còn vướng một việc chưa xong ở đêm rằm năm ấy.' }
    ] }
  ]);

  // ======================= MỤC TIÊU (tách riêng năm 1996) =======================
  ['dinh96', 'giau_trang', 've_2026'].forEach(function (id) { G.OBJECTIVES.find(function (o) { return o.id === id; }).era = '1996'; });
  var iUp = G.OBJECTIVES.findIndex(function (o) { return o.id === 'nang_cap'; });
  G.OBJECTIVES.splice(iUp, 0,
    { id: 'dem2', text: 'Tối về nhà (sau 17:00). Có chuyện lạ ở chỗ chiếc gương', done: function (S) { return !!S.flags.footprints_seen; } },
    { id: 'dung_guong2', text: 'Sau 19:00 chạm vào gương lần nữa (có thể đối chiếu dấu chân trong Sổ trước)', done: function (S) { return S.pnight === 2 || !!S.flags.n2_done; } },
    { id: 'n2_dinh', era: '1996', text: 'Đêm mùng 10: mẹ đang ở đình. Nhờ đò sang đình', done: function (S) { return !!S.flags.n2_arrived; } },
    { id: 'n2_chieng', era: '1996', text: 'Đừng để người gác thấy. Đánh chiêng dưới gốc cây để dụ hắn khỏi kho trước khi hắn tới', done: function (S) { return !!S.flags.mom_escaped; } },
    { id: 'n2_kho', era: '1996', text: 'Lẻn vào kho xem còn gì ở đó', done: function (S) { return !!S.flags.vy_pages; } }
  );
  G.OBJECTIVES[G.OBJECTIVES.length - 1].text = 'Hết bản chơi thử. Bán tiếp, trò chuyện, đối chiếu nốt trong Sổ tùy ý.';

  // ======================= CẢNH NGUY HIỂM: NGƯỜI GÁC ĐI TUẦN =======================
  var PATROL = [[900, 470], [300, 470], [300, 410], [480, 410], [840, 410]];
  var KHO_DOOR = [840, 410], GONG = [215, 476], MOM_ROUTE = [[815, 262], [815, 336], [840, 390], [840, 500], [480, 560], [480, 700]];
  var D = G.danger = { active: false };

  function inShadow(x, y) { return SHADOWS.some(function (z) { return x >= z[0] && x <= z[0] + z[2] && y >= z[1] && y <= z[1] + z[3]; }); }

  D.begin = function () {
    var S = G.S, W = G.world;
    S.danger = 'n2';
    var keep = S.checkpoint; S.checkpoint = null;
    S.checkpoint = keep || JSON.stringify(S); // điểm lưu cảnh: trạng thái lúc vừa tới đình
    D.active = true; D.sus = 0; D.wp = 0; D.mode = 'patrol'; D.waitT = 0; D.momT = 0;
    D.momTalked = false; D.momRoute = null; // đặt lại hết trạng thái cảnh mỗi lần tải lại điểm lưu
    D.guard = W.makeEnt({ hair: 'cap', cap: '#33363F', shirt: '#2E3238', pants: '#22262C', eyes: 'narrow', body: 'wide', prop: 'lantern' }, ['front', 'side', 'back'], 'npc guard');
    W.place(D.guard, PATROL[0][0], PATROL[0][1], 'side', -1);
    D.fx = -1; D.fy = 0;
    D.cone = document.createElement('div'); D.cone.className = 'cone';
    document.getElementById('ents').appendChild(D.cone);
    D.mark = document.createElement('div'); D.mark.className = 'qmark sus'; D.mark.hidden = true; D.guard.el.appendChild(D.mark);
    D.mom = null;
    if (!S.flags.mom_escaped) {
      D.mom = W.makeEnt({ hair: 'long', shirt: '#A32E36', pants: '#33363F', eyes: 'flat', prop: 'fan' }, ['front', 'side', 'back'], 'npc');
      W.place(D.mom, 865, 262, 'back', 1);
      D.momRoute = null;
    }
  };
  D.stop = function () {
    D.active = false;
    if (D.cone) D.cone.remove();
    G.S.danger = null; G.S.checkpoint = null;
  };

  function moveTo(e, p, sp, dt) {
    var dx = p[0] - e.x, dy = p[1] - e.y, d = Math.hypot(dx, dy);
    if (d < 2) return true;
    var st = Math.min(d, sp * dt);
    var view = Math.abs(dx) > Math.abs(dy) ? 'side' : (dy > 0 ? 'front' : 'back');
    G.world.place(e, e.x + dx / d * st, e.y + dy / d * st, view, dx < 0 ? -1 : 1);
    e.el.classList.add('walk');
    return false;
  }

  D.fail = function (msg) {
    D.active = false;
    G.ui.dialog([{ text: '[[' + msg + ']]' }, { text: 'Tải lại từ điểm lưu cảnh (lúc vừa tới đình). Tiền, hàng và ngày chơi giữ nguyên.' }], function () {
      fadeTo(function () {
        var cp = G.S.checkpoint;
        G.S = JSON.parse(cp); G.S.checkpoint = cp;
        G.world.enter('dinh_96', 480, 600);
      });
    });
  };

  // trả về true nếu đã xử lý xong khung hình (vd. vừa thất bại)
  D.update = function (dt) {
    var S = G.S, g = D.guard, P = G.world.player;
    var prevX = g.x, prevY = g.y;
    if (D.mode === 'patrol') {
      if (moveTo(g, PATROL[D.wp], 58, dt)) {
        if (D.wp === PATROL.length - 1 && !S.flags.mom_escaped) { D.fail('Người gác bước vào kho. Mẹ bị bắt gặp.'); return true; }
        D.wp = (D.wp + 1) % PATROL.length;
      }
    } else if (D.mode === 'gong') {
      if (moveTo(g, GONG, 75, dt)) { D.mode = 'look'; D.waitT = 5; g.el.classList.remove('walk'); D.fx = -1; D.fy = 0; }
    } else if (D.mode === 'look') {
      D.waitT -= dt;
      if (D.waitT <= 0) { D.mode = 'patrol'; D.wp = 1; }
    }
    var mx = g.x - prevX, my = g.y - prevY, ml = Math.hypot(mx, my);
    if (ml > 0.01) { D.fx = mx / ml; D.fy = my / ml; }
    // vùng nhìn
    var ang = Math.atan2(D.fy, D.fx);
    D.cone.style.transform = 'translate3d(' + g.x + 'px,' + (g.y - 4) + 'px,0) rotate(' + ang + 'rad)';
    var dx = S.x - g.x, dy = S.y - g.y, dist = Math.hypot(dx, dy);
    var seen = false;
    if (!inShadow(S.x, S.y) && dist < 175 && D.mode !== 'gong') {
      var a = Math.acos(Math.max(-1, Math.min(1, (dx * D.fx + dy * D.fy) / (dist || 1))));
      seen = a < 0.6 || dist < 34;
    }
    D.sus = Math.max(0, Math.min(1, D.sus + (seen ? dt * 1.6 : -dt * 0.8)));
    D.mark.hidden = D.sus <= 0;
    D.mark.textContent = D.sus > 0.7 ? '!' : '?';
    D.mark.classList.toggle('alert', D.sus > 0.7);
    if (D.sus >= 1) { D.fail('Người gác thấy tôi rồi!'); return true; }
    // mẹ rời kho sau khi có tiếng chiêng
    if (D.mom && D.momRoute) {
      if (moveTo(D.mom, D.momRoute[0], 105, dt)) {
        D.momRoute.shift();
        if (D.momRoute.length === 2 && !D.momTalked) {
          D.momTalked = true;
          G.ui.dialog(G.TEXT.mom_pass, function () {
            S.flags.mom_escaped = true;
            G.addClue('e_me_96');
            G.ui.dialog(G.TEXT.mom_note);
          });
        }
        if (!D.momRoute.length) { D.mom.el.remove(); D.mom = null; }
      }
    }
    return false;
  };

  // ======================= HÀNH ĐỘNG =======================
  var A = G.acts;
  var mirror1 = A.mirror, back1 = A.mirror_back, ferryBack1 = A.ferry_back, arrive1 = A.dinhArrive, ledger1 = A.ledger;
  A.mirror = function (t) {
    var S = G.S;
    if (S.flags.n2_done) { G.ui.dialog(G.TEXT.mirror_end); return; }
    if (S.flags.night1_done && S.flags.footprints_seen) {
      if (S.min < 19 * 60) { G.ui.dialog(G.TEXT.mirror_day); return; }
      G.ui.dialog(G.TEXT.mirror_n2.concat([{ text: 'Chạm vào gương?', choices: [
        { text: 'Chạm vào mặt gương', run: function () { A.goPast2(); } },
        { text: 'Chưa, để chuẩn bị đã', run: function () {} }
      ] }]));
      return;
    }
    mirror1(t);
  };
  A.goPast2 = function () {
    var S = G.S;
    fadeTo(function () {
      S.era = '1996'; S.pnight = 2; S.pmin = 22 * 60; S.view = 'front';
      G.world.enter('nha_96', 375, 214);
      G.save();
      G.ui.dialog(G.TEXT.arrive96_2);
    });
  };
  A.mirror_back = function (t) { if (G.S.pnight === 2) G.ui.dialog(G.TEXT.back_n2); else back1(t); };
  A.ferry_back = function (t) { if (G.S.pnight === 2 && !G.S.flags.vy_pages) G.ui.dialog(G.TEXT.ferry_n2); else ferryBack1(t); };
  A.ledger = function (t) { if (G.S.pnight === 2) G.ui.dialog(G.TEXT.ledger_n2); else ledger1(t); };
  A.dinhArrive = function () {
    var S = G.S;
    if (S.pnight !== 2) { arrive1(); return; }
    if (S.flags.vy_pages) return;
    if (!S.flags.n2_arrived) G.ui.dialog(G.TEXT.arrive_dinh2, function () { S.flags.n2_arrived = true; D.begin(); });
    else if (!D.active) D.begin();
  };
  A.gong = function () {
    var S = G.S;
    if (S.flags.mom_escaped || !D.active) { G.ui.dialog(G.TEXT.gong_after); return; }
    G.ui.dialog(G.TEXT.gong, function () {
      D.mode = 'gong'; D.sus = 0;
      if (D.mom && !D.momRoute) D.momRoute = MOM_ROUTE.map(function (p) { return p.slice(); });
    });
  };
  A.vy_pages = function () {
    var S = G.S;
    G.ui.dialog(G.TEXT.vy_pages, function () {
      S.flags.vy_pages = true;
      G.addClue('e_trang_vy');
      D.stop();
      G.ui.dialog(G.TEXT.escape, function () {
        fadeTo(function () {
          S.era = null; S.flags.n2_done = true; S.flags.demo_end = true; S.past.n2 = 'done';
          G.world.endDay(G.TEXT.return2[0].text, function () { G.ui.dialog(G.TEXT.return2.slice(1), function () { G.ui.ending(); }); });
        });
      });
    });
  };

  // khi vào cảnh: sự kiện dấu chân ướt; vào đình đêm 2 thì bật lại cảnh nguy hiểm
  G.onEnter = function (locId) {
    var S = G.S;
    if (D.active && locId !== 'dinh_96') D.stop();
    if (locId === 'nha' && !S.era && S.flags.night1_done && S.clues.e_trang_so && !S.flags.footprints_seen && S.min >= 17 * 60) {
      S.flags.footprints_seen = true;
      var st = document.getElementById('stage');
      st.classList.add('flicker');
      setTimeout(function () { st.classList.remove('flicker'); }, 2600);
      G.world.enter('nha', S.x, S.y);
      G.ui.dialog(G.TEXT.footprints, function () { G.addClue('e_dau_chan'); });
    }
    if (locId === 'dinh_96' && S.pnight === 2 && S.flags.n2_arrived && !S.flags.vy_pages && !D.active) D.begin();
  };

  // ======================= MÀN KẾT BẢN CHƠI THỬ =======================
  G.ui.ending = function () {
    var S = G.S, nc = Object.keys(S.clues).length, nd = Object.keys(S.deduce).length;
    var h2 = '<h2>Hết bản chơi thử</h2><p class="sub">Lần Này Sẽ Khác · đoạn mở đầu</p><div class="list help-list">' +
      '<div>Mẹ còn sống tới đêm rằm. <b class="hl">Vy đã ở năm 1996</b>, đi trước bạn một đêm.</div>' +
      '<div>Còn chờ phía trước: <b class="clue">cái hầm dưới gian thờ</b>, <b class="clue">mấy cái bao</b>, <b class="clue">người đeo mặt nạ cầm rìu</b>, và đêm rằm.</div>' +
      '<div>Ngày chơi: <b>' + S.day + '</b> · Tiền: <b>' + S.money + 'k</b> · Đã bán: <b>' + S.stats.sold + '</b> món</div>' +
      '<div>Manh mối: <b>' + nc + '</b> · Đối chiếu đã làm: <b>' + nd + '/' + G.DEDUCTIONS.length + '</b>' + (nd < G.DEDUCTIONS.length ? ' (mở Sổ để đối chiếu nốt)' : '') + '</div>' +
      '</div><div class="list" style="margin-top:12px"><button class="primary" data-e="go">Chơi tiếp tự do</button><button data-e="title">Về màn hình tiêu đề</button></div>';
    var p = document.getElementById('ending');
    p.innerHTML = h2; p.hidden = false; G.ui.modal = 'ending';
    G.save();
    p.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      p.hidden = true; G.ui.modal = null;
      if (b.dataset.e === 'title') location.reload();
    };
  };
})();
