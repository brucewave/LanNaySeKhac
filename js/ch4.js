// Chương 4: Người trong ảnh. Đêm mốc 5 = đêm rằm (15/8/1996).
// Đeo mặt nạ lẫn vào đoàn rước; chém chốt dây trói Vy → đèn chớp: chính là tấm ảnh (cứu người nhưng nhìn như tấn công);
// chém dây đèn lồng để dụ người gác → đèn rơi vào can dầu → đám cháy; xuống hầm chém chốt đông nam cởi trói mẹ → phong ấn mở.
// Ảnh không đổi nội dung: mọi chi tiết của ảnh đã có từ đầu game, chương này chỉ cho người chơi hiểu đúng.
var G = window.G || (window.G = {});

(function () {
  var h = G.scenes.h, rect = h.rect, ink = h.ink, INK = h.INK;
  function insertBefore(list, id, entries) {
    var i = list.findIndex(function (e) { return e.id === id; });
    list.splice(i < 0 ? list.length : i, 0, ...entries);
  }
  function fadeTo(fn) {
    var f = document.getElementById('fade');
    f.classList.add('on'); G.ui.modal = 'fade';
    setTimeout(function () { G.ui.modal = null; fn(); f.classList.remove('on'); }, 900);
  }
  G.NIGHT_DAY[5] = 15;
  function isRam(S) { return S.era && S.pnight === 5; }

  // nhân vật chính: đeo mặt nạ, cầm rìu khi ở đêm rằm
  G.playerLook = function () {
    var S = G.S, o = Object.assign({}, G.PLAYER_LOOK);
    if (S && S.era && S.flags.masked_now) o.mask = true;
    if (S && S.era && S.items.riu_96) o.prop = 'axe';
    return o;
  };

  // ======================= MANH MỐI, ĐỐI CHIẾU =======================
  Object.assign(G.KEY_ITEMS, { mat_na: { name: 'Mặt nạ giấy của đoàn rước', desc: 'Ông Rạng đưa. Đeo vào mới lẫn được vào đoàn rước đêm rằm.' } });
  Object.assign(G.CLUES, {
    t_lan_chay: { kind: 'tm', who: 'Cô Lan', title: 'Cô Lan: đám cháy bắt đầu từ đâu', loc: 'Chợ', topics: ['chay'],
      about: 'nguyên nhân vụ cháy đình 1996', people: ['Cô Lan'],
      text: '"Đêm ấy cháy từ [[kho chứa dầu đèn lồng]]. Người ta bảo thấy [[một kẻ đeo mặt nạ chém đứt dây đèn]], cả chuỗi đèn đổ xuống."' },
    e_flash: { kind: 'ev', title: 'Ánh chớp đêm rằm (1996)', loc: 'Đình làng · 1996', source: 'Chính tôi',
      people: ['Tôi', 'Vy', 'Mẹ (trong kiệu)'], topics: ['mat_na', 'vy'], about: 'người đeo mặt nạ cầm rìu sau lưng Vy là ai',
      text: 'Tôi đeo mặt nạ, quàng khăn, [[cầm rìu chém chốt dây trói sau lưng Vy]], cách lưng em một gang tay. Đèn chớp nháy. [[Đúng góc, đúng khoảnh khắc của tấm ảnh.]]' },
    e_lua: { kind: 'ev', title: 'Dây đèn tôi chém (1996)', loc: 'Đình làng · 1996', source: 'Chính tôi',
      people: ['Tôi'], topics: ['chay'], about: 'đám cháy bắt đầu từ việc tôi làm',
      text: 'Tôi chém đứt dây đèn lồng để dụ người gác. Cả chuỗi đèn rơi đúng vào [[mấy can dầu trước kho]]. Lửa bùng lên, lan sang gian đình.' }
  });
  G.DEDUCTIONS.push(
    { id: 'q_toi_mat_na', t: 't_thu_vy', e: 'e_flash', type: 'contra', title: 'Người đeo mặt nạ trong ảnh là tôi',
      fact: 'Vy tin người đeo mặt nạ cầm rìu là kẻ ác; đêm rằm, chính tôi đeo mặt nạ, quàng khăn, cầm rìu chém chốt dây trói sau lưng Vy khi đèn chớp nháy.',
      guess: 'Tấm ảnh không nói dối, chỉ bị hiểu sai: góc chụp khiến việc cắt dây trông như vung rìu vào em. Vy sợ chính anh trai mình.' },
    { id: 'q_toi_chay', t: 't_lan_chay', e: 'e_lua', type: 'match', title: 'Đám cháy bắt đầu từ tay tôi',
      fact: 'Cô Lan kể đám cháy bắt đầu từ kho dầu, có kẻ đeo mặt nạ chém dây đèn; đêm rằm, tôi chém dây đèn và đèn rơi vào can dầu.',
      guess: 'Mình đã về để điều tra vụ cháy, và chính mình gây ra một phần của nó. Lịch sử không đổi: mọi việc mình làm vốn đã xảy ra.' }
  );

  // ======================= NPC =======================
  G.NPCS.rang_96.cond = function (S) { return S.pnight === 4 || S.pnight === 5; };
  G.NPCS.rang_96.quest = (function (q) { return function (S) { return S.pnight === 5 ? !S.items.riu_96 : q(S); }; })(G.NPCS.rang_96.quest);
  Object.assign(G.NPCS, {
    vy_15: { id: 'vy_15', name: 'Vy', act: 'none', label: '',
      look: { hair: 'long', shirt: '#6F86A0', pants: '#2A3550', shoes: '#D5DCE0', eyes: 'big' },
      cond: function (S) { return isRam(S) && !S.flags.vy_free; },
      schedule: [{ t: '00:00', loc: 'dinh_96', x: 352, y: 470 }] },
    dan_le1: { id: 'dan_le1', name: 'Người trong đoàn rước', act: 'none', label: '',
      look: { hair: 'non_la', shirt: '#4B5560', mask: true }, cond: function (S) { return isRam(S) && !S.flags.fire; },
      schedule: [{ t: '00:00', loc: 'dinh_96', x: 620, y: 520 }] },
    dan_le2: { id: 'dan_le2', name: 'Người trong đoàn rước', act: 'none', label: '',
      look: { hair: 'cap', shirt: '#58755C', mask: true }, cond: function (S) { return isRam(S) && !S.flags.fire; },
      schedule: [{ t: '00:00', loc: 'dinh_96', x: 840, y: 500 }] },
    khai_15: { id: 'khai_15', name: 'Khải (đeo mặt nạ)', act: 'none', label: '',
      look: { hair: 'short', shirt: '#C3CACD', mole: true, sash: true, mask: true }, cond: function (S) { return isRam(S) && !S.flags.vy_free; },
      schedule: [{ t: '00:00', loc: 'dinh_96', x: 200, y: 520 }] },
    me_15: { id: 'me_15', name: 'Mẹ', act: 'none', label: '',
      look: { hair: 'long', shirt: '#A32E36', pants: '#33363F', eyes: 'tired' }, cond: function (S) { return isRam(S) && !S.flags.n5_cliff; },
      schedule: [{ t: '00:00', loc: 'ham_96', x: 612, y: 430 }] },
    vy_ham: { id: 'vy_ham', name: 'Vy', act: 'none', label: '',
      look: { hair: 'long', shirt: '#6F86A0', pants: '#2A3550', shoes: '#D5DCE0', eyes: 'big' }, cond: function (S) { return isRam(S) && !S.flags.n5_cliff; },
      schedule: [{ t: '00:00', loc: 'ham_96', x: 250, y: 470 }] }
  });
  ['vy_15', 'dan_le1', 'dan_le2', 'khai_15', 'me_15', 'vy_ham'].forEach(function (id) { G.NPCS[id].schedule.forEach(function (e) { e.from = G.parseTime(e.t); }); });

  // ======================= ĐỊA ĐIỂM =======================
  var D96 = G.LOCATIONS.dinh_96.things;
  D96.find(function (t) { return t.id === 'so_thu_chi'; }).cond = function (S) { return S.pnight !== 5; };
  D96.find(function (t) { return t.id === 'ban_tho_dinh'; }).cond = function (S) { return S.pnight !== 5; };
  D96.push(
    { id: 'day_vy', x: 352, y: 512, hit: [320, 420, 70, 70], label: 'Chém chốt dây trói Vy', act: 'cut_vy',
      cond: function (S) { return isRam(S) && !S.flags.vy_free; }, quest: function () { return true; } },
    { id: 'cot_den', x: 742, y: 452, hit: [728, 380, 30, 70], label: 'Chém dây đèn lồng', act: 'cut_lantern',
      cond: function (S) { return isRam(S) && !!S.flags.vy_free && !S.flags.fire; }, quest: function () { return true; } },
    { id: 'xuong_ham15', x: 460, y: 250, hit: [416, 160, 90, 64], label: 'Xuống hầm', act: 'down15',
      cond: function (S) { return isRam(S) && !!S.flags.fire; }, quest: function () { return true; } }
  );
  G.LOCATIONS.ham_96.things.push(
    { id: 'chot_me', x: 586, y: 452, hit: [570, 380, 60, 60], label: 'Chém chốt đông nam', act: 'free_mom',
      cond: function (S) { return isRam(S) && !S.flags.n5_cliff; }, quest: function () { return true; } }
  );
  G.LOCATIONS.ham_96.things.forEach(function (t) {
    if (['bia_da', 'bao', 'chot_dn', 'thang', 'gieng'].indexOf(t.id) >= 0) { var c0 = t.cond; t.cond = function (S) { return S.pnight !== 5 && (!c0 || c0(S)); }; }
  });

  // ======================= CẢNH =======================
  var dinhPrev = G.scenes.dinh_96;
  G.scenes.dinh_96 = function (W, H) {
    var sc = dinhPrev(W, H), S = G.S;
    if (!S || S.pnight !== 5) return sc;
    // kiệu giữa sân, cột buộc dây đèn cạnh kho
    var k = rect(250, 420, 90, 64, '#A32E36') + '<path d="M244,420 l14,-18 h74 l14,18" fill="#6A2A2A"/>' + rect(276, 436, 36, 32, '#2A2420');
    k += '<path d="M230,490 h150" stroke-width="7"/><path d="M230,490 h150" stroke="#6A5846" stroke-width="3"/>';
    k += rect(736, 380, 12, 70, '#4A4038') + '<path d="M742,384 L960,388" fill="none" stroke-width="1.6"/>';
    if (S.flags.fire) {
      k += '<path d="M770,330 q20,-60 40,-20 q10,-50 40,-10 q20,-40 40,10 q10,-30 30,0 L920,370 H770 Z" fill="#E07030" opacity=".9"/>';
      k += '<path d="M800,330 q14,-30 30,-6 q14,-26 30,4 Z" fill="#F2C230" opacity=".9"/>';
      k += '<path d="M600,60 q20,-40 50,-10 q20,-30 50,0" fill="#E07030" opacity=".7"/>';
      sc.svg = sc.svg.replace(/<\/svg>$/, '<g><ellipse class="glow" cx="850" cy="300" rx="260" ry="200" fill="url(#lampW)"/><ellipse class="glow" cx="650" cy="120" rx="200" ry="120" fill="url(#lampW)"/></g></svg>');
    }
    h.addBg(sc, k);
    sc.solids.push([244, 420, 102, 60]);
    return sc;
  };

  // ======================= LỜI THOẠI =======================
  Object.assign(G.TEXT, {
    mirror_n5: [{ text: 'Mặt gương đỏ rực: sân đình đầy đèn lồng, đoàn rước đeo mặt nạ, tiếng trống dồn. [[Đêm rằm.]]' }],
    mirror_ch4: [{ text: 'Mặt gương mờ đục. (Hỏi cô Lan về đêm cháy đã.)' }],
    mirror_end5: [{ text: 'Mặt gương nứt một đường mảnh. Nó vẫn còn giữ khoảnh khắc ấy. (Phần cao trào đang được viết.)' }],
    arrive96_5: [
      { text: 'Tờ lịch: [[Rằm tháng Tám, 1996]]. Ngoài kia trống rước dồn dập.' },
      { text: 'Giường trống. Bàn thờ ông bà nguội lạnh. Mẹ không về nữa rồi.' },
      { who: 'Tôi', text: 'Ông Rạng hẹn đợi ở **bến sông**.' }
    ],
    rang15: [
      { text: 'Ông Rạng đứng dưới bến, chiếc đò buộc sẵn. Ông đưa tôi cái bọc vải dầu.' },
      { who: 'Ông Rạng', text: 'Rìu đây. Thêm cái này nữa: [[mặt nạ của đoàn rước]]. Đêm nay ai cũng đeo, cậu đeo vào mới lẫn được.' },
      { who: 'Ông Rạng', text: 'Thằng Khải bắt được con bé lạ mặt hôm qua, cái con bé giống chị Hạnh ấy. [[Nó trói con bé cạnh kiệu.]] Chị Hạnh thì ở trong kiệu.' },
      { text: 'Tôi đeo mặt nạ. Chiếc khăn đỏ quàng cổ, tôi để nguyên.' }
    ],
    rang15_again: [{ who: 'Ông Rạng', text: 'Lên đò. Tôi chở cậu sang, rồi tôi đợi dưới bến đình.', choices: [
      { text: 'Lên đò sang đình', run: function () { G.acts.toLe(); } }, { text: 'Chờ chút', run: function () {} }
    ] }],
    le_arrive: [
      { text: 'Sân đình sáng rực. Đoàn rước ai cũng đeo mặt nạ giấy, trống dồn từng hồi.' },
      { text: 'Giữa sân đặt chiếc kiệu sơn đỏ. Trong kiệu có tiếng rên rất khẽ. [[Mẹ.]]' },
      { text: 'Cạnh kiệu, [[Vy bị trói vào đòn kiệu]], miệng bịt khăn. Một người đàn ông cầm máy ảnh đang chụp đoàn rước.' },
      { text: '(Đeo mặt nạ thì đoàn rước không để ý tới tôi.)' }
    ],
    cut_vy: [
      { text: 'Tôi lách qua đám đông, tới sau lưng Vy. Dây trói quấn quanh đòn kiệu, khóa bằng [[một chốt gỗ]].' },
      { text: 'Tôi giơ rìu, chém vào chốt gỗ, cách lưng em một gang tay.' },
      { text: 'ĐÈN CHỚP. Người thợ ảnh vừa bấm máy.', img: 'anh_le_hoi' },
      { text: 'Tôi chết lặng. Góc này, ánh chớp này, chiếc khăn quàng cổ... [[Chính là tấm ảnh trên bàn học của Vy.]]' },
      { text: 'Vy quay lại, thấy một kẻ đeo mặt nạ cầm rìu ngay sau lưng mình. Em giật đứt dây, [[chạy thục mạng vào gian đình]].', img: null },
      { who: 'Khải', text: 'Bắt lấy thằng cầm rìu!' },
      { text: '(Người gác chắn cửa gian đình, vùng sáng vàng là chỗ hắn nhìn. Phải dụ hắn đi. Cột buộc dây đèn ở cạnh kho.)' }
    ],
    cut_lantern: [
      { text: 'Dây đèn lồng buộc vào cột gỗ cạnh kho. Chém đứt thì cả chuỗi đèn rơi xuống, đám đông sẽ nhốn nháo.', choices: [
        { text: 'Chém dây đèn', run: function () { G.acts.fire(); } },
        { text: 'Khoan đã', run: function () {} }
      ] }
    ],
    fire: [
      { text: 'Dây đứt. Cả chuỗi đèn lồng đổ ập xuống, rơi đúng vào [[mấy can dầu trước cửa kho]].' },
      { text: 'Lửa bùng lên, liếm lên mái kho, rồi lan sang gian đình.' },
      { text: 'Tôi đứng sững. [[Đám cháy năm ấy... bắt đầu từ tay mình.]]' },
      { text: 'Người gác bỏ cửa, chạy về phía kho. Lối vào gian đình trống trơn.' }
    ],
    down15: [{ text: 'Khói tràn vào gian đình. Nắp hầm mở toang. Từ dưới vọng lên tiếng Vy gọi "Mẹ!".' }],
    ham15: [
      { text: 'Dưới hầm, [[mẹ bị trói vào chốt đông nam]], dây thừng siết chặt.' },
      { text: 'Vy ngồi ở góc, chân kẹt dưới khối xi măng vỡ, tay còn cầm thanh sắt định cạy chốt. Em nhìn tôi, kinh hãi.' }
    ],
    free_mom: [
      { text: 'Nút dây ngâm nước cứng như đá, quấn chết vào chốt lim. [[Chỉ còn cách chém chốt.]]', choices: [
        { text: 'Chém chốt đông nam', run: function () { G.acts.chopMom(); } },
        { text: 'Khoan đã', run: function () {} }
      ] }
    ],
    chop_mom: [
      { text: 'Tôi vung rìu vào chốt lim, không phải vào dây, cách mẹ một sải tay.' },
      { text: 'Chốt gãy cụt. [[Vết chém xiên, lưỡi rìu mẻ một miếng.]]', img: 'nen_tho' },
      { text: 'Dây trói tuột ra. Mẹ ngã vào tay tôi.', img: null },
      { text: 'Rồi mặt giếng vỡ tung. [[Nước đen ập lên]], và dưới đáy, một thứ gì đó rất lớn trở mình.' },
      { who: 'Mẹ', text: 'Ai... ai vậy?' },
      { text: 'Mẹ nhìn tôi qua hai lỗ mắt của chiếc mặt nạ. Nước cuốn tất cả. Chiếc rìu tuột khỏi tay tôi. Tôi chỉ kịp nắm chặt tay mẹ.' }
    ],
    cliff: [
      { text: 'Tôi bừng tỉnh trên sàn nhà năm 2026, ướt sũng, tay còn nắm một mẩu dây thừng.' },
      { text: 'Chiếc gương trên tủ có thêm [[một vết nứt mảnh]]. Trong vết nứt, nước vẫn còn chảy.' },
      { text: '(Phần cao trào đang được viết. Lần qua gương sau, bạn sẽ quay lại đúng khoảnh khắc này.)' }
    ],
    caught15: 'Người gác túm được cổ áo tôi. Mặt nạ rơi xuống.',
    ferry_n5: [{ text: 'Mẹ và Vy còn ở đây. Không thể bỏ đi.' }]
  });
  insertBefore(G.DIALOGUE.co_lan, 'lan_nha9', [
    { id: 'lan_chay', cond: function (S) { return !!S.flags.ch3_end && !S.clues.t_lan_chay; }, after: function () { G.addClue('t_lan_chay'); }, lines: [
      { who: 'Tôi', text: 'Cô Lan, đêm cháy đình năm ấy, lửa bắt đầu từ đâu ạ?' },
      { who: 'Cô Lan', text: 'Từ [[kho chứa dầu đèn lồng]]. Người ta bảo thấy [[một kẻ đeo mặt nạ chém đứt dây đèn]], cả chuỗi đèn đổ xuống can dầu.' },
      { who: 'Cô Lan', text: 'Ông Khải bảo đó là kẻ phá lễ. Nhưng đêm ấy ai mà chẳng đeo mặt nạ, con.' }
    ] }
  ]);
  G.DIALOGUE.rang_96.unshift(
    { id: 'r15', cond: function (S) { return S.pnight === 5 && !S.items.riu_96; }, lines: function () { return G.TEXT.rang15; },
      after: function (S) { S.items.riu_96 = true; S.items.mat_na = true; S.flags.masked_now = true; G.world.enter(S.loc, S.x, S.y); G.ui.dialog(G.TEXT.rang15_again); } },
    { id: 'r15b', cond: function (S) { return S.pnight === 5 && !!S.items.riu_96 && !S.flags.le_arrived; }, lines: function () { return G.TEXT.rang15_again; } }
  );

  // ======================= MỤC TIÊU =======================
  var iEnd = G.OBJECTIVES.findIndex(function (o) { return o.id === 'het'; });
  G.OBJECTIVES.splice(iEnd, 0,
    { id: 'ch4_lan', text: 'Chương 4. Hỏi cô Lan (ở chợ) về đêm cháy đình', done: function (S) { return !!S.clues.t_lan_chay; } },
    { id: 'ch4_dem5', text: 'Đêm nay là đêm rằm năm ấy. Sau 19:00 chạm vào gương', done: function (S) { return S.pnight === 5 || !!S.flags.n5_cliff; } },
    { id: 'ch4_rang', era: '1996', text: 'Ông Rạng hẹn đợi ở bến sông', done: function (S) { return !!S.items.riu_96 || !!S.flags.n5_cliff; } },
    { id: 'ch4_le', era: '1996', text: 'Lên đò ông Rạng sang đình. Đeo mặt nạ để lẫn vào đoàn rước', done: function (S) { return !!S.flags.le_arrived; } },
    { id: 'ch4_vy', era: '1996', text: 'Vy bị trói cạnh kiệu. Dùng rìu chém chốt dây trói em', done: function (S) { return !!S.flags.vy_free; } },
    { id: 'ch4_lua', era: '1996', text: 'Người gác chắn cửa gian đình. Tránh vùng hắn nhìn, tìm cách dụ hắn đi (cột dây đèn cạnh kho)', done: function (S) { return !!S.flags.fire; } },
    { id: 'ch4_ham', era: '1996', text: 'Vào gian đình, xuống hầm', done: function (S) { return !!S.flags.ham15; } },
    { id: 'ch4_me', era: '1996', text: 'Mẹ bị trói vào chốt đông nam. Cứu mẹ', done: function (S) { return !!S.flags.n5_cliff; } },
    { id: 'ch4_doi', text: 'Mở Sổ: người đeo mặt nạ trong ảnh là ai? Đám cháy bắt đầu từ đâu?', done: function (S) { return !!S.deduce.q_toi_mat_na && !!S.deduce.q_toi_chay; } }
  );
  G.OBJECTIVES[G.OBJECTIVES.length - 1].text = 'Hết chương 4. Phần cao trào đang được viết. Bán tiếp, trò chuyện tùy ý.';

  // ======================= HÀNH ĐỘNG =======================
  var A = G.acts;
  var mirror4 = A.mirror, back4 = A.mirror_back, ferry4 = A.ferry, ferryBack4 = A.ferry_back, arrive4 = A.dinhArrive;
  A.mirror = function (t) {
    var S = G.S;
    if (S.flags.n5_cliff) { G.ui.dialog(G.TEXT.mirror_end5); return; }
    if (S.flags.ch3_end && S.flags.n4_done) {
      if (!S.clues.t_lan_chay) { G.ui.dialog(G.TEXT.mirror_ch4); return; }
      if (S.min < 19 * 60) { G.ui.dialog(G.TEXT.mirror_day); return; }
      G.ui.dialog(G.TEXT.mirror_n5.concat([{ text: 'Chạm vào gương?', choices: [
        { text: 'Chạm vào mặt gương', run: function () { A.goPast5(); } },
        { text: 'Chưa, để chuẩn bị đã', run: function () {} }
      ] }]));
      return;
    }
    mirror4(t);
  };
  A.goPast5 = function () {
    var S = G.S;
    fadeTo(function () {
      S.era = '1996'; S.pnight = 5; S.pmin = 21 * 60; S.view = 'front';
      G.world.enter('nha_96', 375, 214);
      G.save();
      G.ui.dialog(G.TEXT.arrive96_5);
    });
  };
  A.mirror_back = function (t) { if (G.S.pnight === 5) G.ui.dialog([{ text: 'Không. Mẹ và Vy đang ở đình.' }]); else back4(t); };
  A.ferry = function (t) { if (G.S.pnight === 5) G.ui.dialog([{ who: 'Anh Tư', text: 'Đêm nay tôi chở đoàn rước. Cậu đi đò ông Rạng kia kìa.' }]); else ferry4(t); };
  A.ferry_back = function (t) { if (G.S.pnight === 5) G.ui.dialog(G.TEXT.ferry_n5); else ferryBack4(t); };
  A.dinhArrive = function () { if (G.S.pnight === 5) return; arrive4(); };
  A.toLe = function () {
    fadeTo(function () {
      var S = G.S;
      G.world.enter('dinh_96', 480, 600);
      if (!S.flags.le_arrived) G.ui.dialog(G.TEXT.le_arrive, function () { S.flags.le_arrived = true; });
    });
  };
  A.cut_vy = function () {
    var S = G.S;
    G.ui.dialog(G.TEXT.cut_vy, function () {
      S.flags.vy_free = true; G.addClue('e_flash');
      S.danger = 'le'; S.checkpoint = null; S.checkpoint = JSON.stringify(S); // điểm lưu cảnh: ngay sau khi cứu Vy
      G.world.enter(S.loc, S.x, S.y);
    });
  };
  A.cut_lantern = function () { G.ui.dialog(G.TEXT.cut_lantern); };
  A.fire = function () {
    var S = G.S;
    G.ui.dialog(G.TEXT.fire, function () {
      S.flags.fire = true; S.danger = null; S.checkpoint = null; G.addClue('e_lua');
      G.world.enter(S.loc, S.x, S.y);
    });
  };
  A.down15 = function () {
    G.ui.dialog(G.TEXT.down15, function () {
      fadeTo(function () {
        var S = G.S; S.flags.ham15 = true;
        G.world.enter('ham_96', 480, 170);
        G.ui.dialog(G.TEXT.ham15);
      });
    });
  };
  A.free_mom = function () { G.ui.dialog(G.TEXT.free_mom); };
  A.chopMom = function () {
    var S = G.S;
    G.ui.dialog(G.TEXT.chop_mom, function () {
      fadeTo(function () {
        delete S.items.riu_96; delete S.items.mat_na; S.flags.masked_now = false;
        S.era = null; S.flags.n5_cliff = true; S.past.n5 = 'cliff';
        G.world.endDay(G.TEXT.cliff[0].text, function () { G.ui.dialog(G.TEXT.cliff.slice(1)); });
      });
    });
  };

  // ======================= NGƯỜI GÁC CHẮN CỬA GIAN ĐÌNH =======================
  var GD = { on: false };
  var DOOR = [460, 396];
  function guardOn() {
    var W = G.world;
    GD.on = true; GD.sus = 0;
    GD.e = W.makeEnt({ hair: 'cap', cap: '#33363F', shirt: '#2E3238', pants: '#22262C', eyes: 'narrow', body: 'wide', prop: 'lantern', mask: true }, ['front', 'side', 'back'], 'npc guard');
    W.place(GD.e, DOOR[0], DOOR[1], 'front', 1);
    GD.cone = document.createElement('div'); GD.cone.className = 'cone';
    GD.cone.style.transform = 'translate3d(' + DOOR[0] + 'px,' + (DOOR[1] - 4) + 'px,0) rotate(' + (Math.PI / 2) + 'rad)';
    document.getElementById('ents').appendChild(GD.cone);
    GD.mark = document.createElement('div'); GD.mark.className = 'qmark sus'; GD.mark.hidden = true; GD.e.el.appendChild(GD.mark);
  }
  var onEnter4 = G.onEnter;
  G.onEnter = function (locId) {
    if (onEnter4) onEnter4(locId);
    var S = G.S;
    GD.on = false;
    if (locId === 'dinh_96' && isRam(S) && !S.flags.fire) guardOn();
  };
  var tick4 = G.tick;
  G.tick = function (dt) {
    if (tick4) tick4(dt);
    var S = G.S;
    if (GD.on && S.loc === 'dinh_96' && S.flags.vy_free && !S.flags.fire && !G.ui.isBusy()) {
      var dx = S.x - DOOR[0], dy = S.y - DOOR[1], d = Math.hypot(dx, dy);
      var seen = d < 175 && (d < 34 || Math.acos(Math.max(-1, Math.min(1, dy / (d || 1)))) < 0.6);
      GD.sus = Math.max(0, Math.min(1, GD.sus + (seen ? dt * 1.6 : -dt * 0.8)));
      GD.mark.hidden = GD.sus <= 0; GD.mark.textContent = GD.sus > 0.7 ? '!' : '?'; GD.mark.classList.toggle('alert', GD.sus > 0.7);
      if (GD.sus >= 1) {
        GD.sus = 0;
        G.ui.dialog([{ text: '[[' + G.TEXT.caught15 + ']]' }, { text: 'Tải lại từ điểm lưu cảnh (ngay sau khi cứu Vy).' }], function () {
          fadeTo(function () { var cp = G.S.checkpoint; G.S = JSON.parse(cp); G.S.checkpoint = cp; G.world.enter('dinh_96', 352, 540); });
        });
      }
    }
    if (S && S.deduce.q_toi_mat_na && S.deduce.q_toi_chay && !S.flags.ch4_end && !G.ui.isBusy()) { S.flags.ch4_end = true; G.ui.chapterEnd4(); }
  };

  G.ui.chapterEnd4 = function () {
    var S = G.S, nd = Object.keys(S.deduce).length;
    var p = document.getElementById('ending');
    p.innerHTML = '<h2>Hết chương 4</h2><p class="sub">Người trong ảnh</p><div class="list help-list">' +
      '<div><b class="hl">Người đeo mặt nạ cầm rìu là anh.</b> Tấm ảnh không nói dối: anh đang chém chốt dây trói Vy, góc chụp khiến nó trông như vung rìu vào em.</div>' +
      '<div>Đám cháy bắt đầu từ chuỗi đèn anh chém rơi vào can dầu. Chốt đông nam bị chém bằng chính chiếc rìu ấy. <b class="clue">Phong ấn đã mở.</b></div>' +
      '<div>Còn chờ phía trước: nước đen dưới hầm, thứ dưới đáy giếng, và chiếc gương chỉ đủ cho hai người.</div>' +
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
