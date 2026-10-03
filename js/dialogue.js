// Hội thoại có điều kiện. Mỗi NPC có danh sách đoạn theo thứ tự ưu tiên; chọn đoạn đầu tiên thoả điều kiện.
// Một đoạn: { id, once, cond(S), lines (mảng hoặc hàm S→mảng), after(S) }. Dòng cuối có thể có choices: [{text, run}].
var G = window.G || (window.G = {});

(function () {
  function rel(S, id, n) { S.rel[id] = (S.rel[id] || 0) + n; }
  function slot(S) { return G.slotOf(S.min).id; }

  // Bán trực tiếp hai ly trà cho bác Ba (ngoài phiên bán). Mỗi chỗ một lần mỗi ngày.
  function sellToBa(S) {
    if (S.stock.tra_da < 2) { G.ui.dialog([{ who: 'Bác Ba', text: 'Hết trà rồi à? Thôi, lúc khác.' }]); return; }
    S.stock.tra_da -= 2;
    var pay = G.ITEMS.tra_da.price * 2 + 2;
    S.money += pay; S.stats.sold += 2; S.stats.earned += pay;
    S.daily['ba_buy_' + S.loc] = 1;
    rel(S, 'bac_ba', 1);
    G.world.refreshCart();
    G.ui.dialog([
      { who: 'Bác Ba', text: 'Đây, ' + pay + 'k. Khỏi thối.' },
      { text: 'Bác uống cạn một ly. **Ly còn lại bác đặt cạnh chân, không đụng tới.**' }
    ]);
  }

  G.DIALOGUE = {
    co_lan: [
      { id: 'lan_first', once: true, after: function () { G.ui.shop(); }, lines: [
        { who: 'Cô Lan', text: 'Ơ, cái xe này... Con trai chị Hạnh đấy à? Lớn quá, cô nhận không ra.' },
        { who: 'Cô Lan', text: 'Định bán lại hàng của mẹ hả? Lấy ở cô, cô để giá gốc.' },
        { who: 'Cô Lan', text: '**Sáng** thì **bánh mì** chạy, **trưa chiều** người ta khát. Ra **bến sông** thì ít khách, nhưng dân câu **hay boa**.' },
        { who: 'Cô Lan', text: '**Con bé Vy** em con dạo trước cũng ra đây **hỏi chuyện cũ** suốt. Mà thôi, lấy hàng đi đã.' }
      ] },
      { id: 'lan_nha9', once: true, cond: function (S) { return !!S.quests.ly_tra; }, after: function () { G.ui.shop(); }, lines: [
        { who: 'Cô Lan', text: 'Ông Ba nhờ con mang trà ra nhà số 9 à? **Nhà ông Rạng** đấy, bỏ hoang từ hồi **cháy đình**.' },
        { who: 'Cô Lan', text: 'Hai ông ấy thân nhau lắm. Ngày trước sáng nào cũng ngồi xe trà của mẹ con, mỗi ông một ly.' }
      ] },
      { id: 'lan_ban_ve', once: true, cond: function (S) { return !!S.items.ban_ve_dinh; }, after: function () { G.ui.shop(); }, lines: [
        { who: 'Cô Lan', text: 'Bản vẽ đình à? [[Hồi sửa đình năm chín lăm]] có **ông Ba** với **ông Rạng** làm chính.' },
        { who: 'Cô Lan', text: 'Giấy tờ thì nộp hết cho [[ông Khải]] bên **ban quản lý đình**. Ông ấy giờ vẫn lo việc đình đấy.' }
      ] },
      { id: 'lan_shop', direct: function () { G.ui.shop(); } }
    ],

    bac_ba: [
      { id: 'ba_intro', once: true, lines: [
        { who: 'Bác Ba', text: 'Cái xe này... Cháu là con Hạnh hả? Trông cái dáng đẩy xe là biết.' },
        { who: 'Bác Ba', text: 'Bác là Ba, làm mộc ở xưởng đầu ngõ. Hồi trước sáng nào bác cũng uống trà của mẹ cháu.' },
        { who: 'Bác Ba', text: '**Sáng** bác ra **chợ**, **chiều** ra **bến** ngồi. Thấy xe cháu ở đâu thì bác ghé, nhớ để bác **hai ly**.' }
      ] },
      { id: 'ba_report', cond: function (S) { return S.quests.ly_tra === 'delivered'; },
        lines: function (S) {
          var L = [
            { who: 'Tôi', text: 'Cháu để ly trà trước cửa nhà số 9 rồi bác ạ. Cửa tự hé ra.' },
            { who: 'Bác Ba', text: 'Ừ. Bản lề mục cả rồi.' },
            { who: 'Bác Ba', text: '**Nhà ông Rạng** đấy. [[Hồi sửa đình năm chín lăm]], bác với ông ấy làm cùng nhau. Ông ấy [[mất trong vụ cháy]].' },
            { who: 'Bác Ba', text: 'Ngày trước sáng nào hai thằng cũng ngồi xe trà mẹ cháu, mỗi đứa một ly. Giờ bác vẫn mua hai ly. **Một ly cho ông ấy.**' }
          ];
          if (S.items.ban_ve_dinh) L.push(
            { who: 'Tôi', text: 'Trong nhà có cái này. Bản vẽ đình, có chữ ký của bác.' },
            { who: 'Bác Ba', text: '...Cháu cất đi. Đừng mang ra đường. [[Có những người không muốn ai thấy nó.]]' },
            { who: 'Tôi', text: 'Còn cái ô bị tẩy ở góc, chỗ ghi "hầm"?' },
            { who: 'Bác Ba', text: '[[Bác không nhớ.]] Bác già rồi.' },
            { text: 'Bác nói nhanh quá, **không nhìn vào mắt tôi**.' }
          );
          else L.push({ who: 'Bác Ba', text: 'Đừng vào trong đấy. Sàn mục, sập lúc nào không biết.' });
          L.push({ who: 'Bác Ba', text: 'Cầm lấy tiền công, cháu. (+15k)' });
          return L;
        },
        after: function (S) {
          S.quests.ly_tra = 'done'; S.flags.tea_day = S.day; S.money += 15; rel(S, 'bac_ba', 2); G.ui.hud();
          G.addClue('t_ba_ly_rang');
          if (S.items.ban_ve_dinh) G.addClue('t_ba_khong_nho');
        } },
      { id: 'ba_ham', cond: function (S) { return !!S.deduce.q_ba_giau && !S.clues.t_ba_bi_dan; }, lines: [
        { who: 'Tôi', text: 'Chữ "hầm" trên bản vẽ là [[nét chữ của bác]]. Bác nhớ mà.' },
        { text: 'Bác Ba im một lúc lâu.' },
        { who: 'Bác Ba', text: '...Ừ. Bác vẽ cái hầm. **Dưới gian thờ**, có lối xuống từ thời trước.' },
        { who: 'Bác Ba', text: 'Lúc nộp, [[người duyệt hồ sơ bảo bỏ nó ra]]. Bảo là "để yên cho đình yên".' },
        { who: 'Bác Ba', text: 'Ai duyệt thì giấy tờ còn đó. Bác không nói tên đâu. [[Người đó vẫn còn trong làng.]]' }
      ], after: function (S) { G.addClue('t_ba_bi_dan'); rel(S, 'bac_ba', 1); } },
      { id: 'ba_ban_ve', cond: function (S) { return S.items.ban_ve_dinh && S.quests.ly_tra === 'done' && !S.clues.t_ba_khong_nho; }, lines: [
        { who: 'Tôi', text: 'Bác ơi, cháu tìm được cái này. Bản vẽ đình, có chữ ký của bác.' },
        { who: 'Bác Ba', text: '...Cháu cất đi. [[Có những người không muốn ai thấy nó.]]' },
        { who: 'Tôi', text: 'Còn cái ô bị tẩy ở góc, chỗ ghi "hầm"?' },
        { who: 'Bác Ba', text: '[[Bác không nhớ.]] Bác già rồi.' }
      ], after: function () { G.addClue('t_ba_khong_nho'); } },
      { id: 'ba_offer', cond: function (S) { return !S.quests.ly_tra && (S.rel.bac_ba || 0) >= 3; }, lines: [
        { who: 'Bác Ba', text: 'Cháu này. Bác nhờ một việc được không?' },
        { who: 'Bác Ba', text: 'Lấy một ly trà đá của cháu, mang ra **nhà số 9 cuối bến sông**, **đặt trước cửa** giúp bác. Đừng vào trong.' },
        { who: 'Bác Ba', text: 'Bác... không ra đấy được. Cháu đừng hỏi. Bác trả công đàng hoàng.', choices: [
          { text: 'Nhận giao (dùng 1 ly trà đá trên xe)', run: function (S) {
            if (S.stock.tra_da < 1) { G.ui.dialog([{ who: 'Bác Ba', text: 'Cháu hết trà rồi à? Lúc nào có thì quay lại bác.' }]); return; }
            S.stock.tra_da--; S.items.ly_tra_ba = true; S.quests.ly_tra = 'accepted';
            G.world.refreshCart();
            G.ui.dialog([{ who: 'Bác Ba', text: '**Nhà số 9, cuối bến, cạnh bụi lau.** Đặt trước cửa là được.' },
              { text: '(Đã nhận: Ly trà của bác Ba)' }]);
          } },
          { text: 'Để lúc khác ạ', run: function () { G.ui.dialog([{ who: 'Bác Ba', text: 'Ừ, không vội.' }]); } }
        ] }
      ] },
      { id: 'ba_wait', cond: function (S) { return S.quests.ly_tra === 'accepted'; }, lines: [
        { who: 'Bác Ba', text: '**Nhà số 9, cuối bến sông, phía tay trái.** Đặt ly trà trước cửa là được.' }
      ] },
      { id: 'ba_buy', cond: function (S) { return S.stock.tra_da >= 2 && !S.daily['ba_buy_' + S.loc]; }, lines: [
        { who: 'Bác Ba', text: 'Có trà không cháu? Bác lấy hai ly.', choices: [
          { text: 'Bán hai ly trà đá', run: sellToBa },
          { text: 'Để sau ạ', run: function () {} }
        ] }
      ] },
      { id: 'ba_why', once: true, cond: function (S) { return (S.rel.bac_ba || 0) >= 2 && S.quests.ly_tra !== 'done'; }, lines: [
        { who: 'Tôi', text: 'Bác mua hai ly mà sao chỉ uống có một?' },
        { who: 'Bác Ba', text: '...Thói quen thôi cháu.' },
        { text: 'Bác quay đi, lấy cái bào gỗ ra lau dù nó đã sạch.' }
      ] },
      { id: 'ba_idle', lines: function (S) {
        var t = { sang: 'Sáng nào bác cũng ngồi đây đục đẽo cho đỡ buồn tay.', chieu: 'Chiều ra bến ngồi cho mát. Gió sông dễ chịu.', toi: 'Tối rồi, cháu dọn hàng về sớm đi.' };
        return [{ who: 'Bác Ba', text: S.quests.ly_tra === 'done' ? 'Mai lại để bác hai ly nhé.' : t[slot(S)] }];
      } }
    ],

    bac_do: [
      { id: 'do_nha9', once: true, cond: function (S) { return S.quests.ly_tra === 'accepted'; }, lines: [
        { who: 'Bác Tư lái đò', text: 'Ra nhà số 9 à? Ban ngày thì được. **Tối đừng vào**, sàn mục hết rồi.' },
        { who: 'Bác Tư lái đò', text: '[[Sáng nào cũng có ly trà đặt trước cửa nhà ấy.]] Ông Ba nhờ người mang ra, mấy năm nay rồi.' }
      ] },
      { id: 'do_1', once: true, lines: [
        { who: 'Bác Tư lái đò', text: 'Bến này giờ vắng. **Chiều chiều** mới có mấy ông ra câu, ngồi nắng khát khô cổ.' },
        { who: 'Bác Tư lái đò', text: 'Cháu bán trà đá à? Mai ra đây, bác giới thiệu cho.' }
      ] },
      { id: 'do_2', once: true, lines: [
        { who: 'Bác Tư lái đò', text: 'Cái mái bên kia sông ấy hả? **Đình cũ**. [[Cháy từ năm chín sáu]], giờ chẳng ai sang.' },
        { who: 'Bác Tư lái đò', text: 'Tối đừng đứng lâu ngoài bến. Không phải ma quỷ gì đâu, nước sông lên nhanh lắm.' }
      ] },
      { id: 'do_idle', lines: [{ who: 'Bác Tư lái đò', text: 'Hôm nay nước êm. Bán được không cháu?' }] }
    ],

    ong_khai: [
      { id: 'khai_intro', once: true, lines: [
        { text: 'Một người đàn ông sơ mi trắng, tóc chải gọn, nói năng từ tốn. [[Nốt ruồi lớn dưới mắt trái.]]' },
        { who: 'Ông Khải', text: 'Cậu là con chị Hạnh? Tôi là Khải, **trưởng ban quản lý đình**. Chuyện nhà cậu... tôi rất tiếc.' },
        { who: 'Tôi', text: 'Đêm cháy đình năm ấy, bác có ở đó không?' },
        { who: 'Ông Khải', text: 'Đêm rằm năm ấy tôi sốt nặng, [[nằm nhà, không ra lễ]]. Nghe tiếng kẻng mới biết đình cháy.' },
        { who: 'Ông Khải', text: 'Em gái cậu cũng hỏi tôi y như thế. Con bé bướng lắm.' }
      ], after: function () { G.addClue('t_khai_khong_le'); } },
      { id: 'khai_ham', cond: function (S) { return !S.clues.t_khai_khong_ham; }, lines: [
        { who: 'Ông Khải', text: 'Còn chuyện gì nữa không cậu?', choices: [
          { text: 'Hỏi về hồ sơ sửa đình năm 1995', run: function () {
            G.ui.dialog([
              { who: 'Ông Khải', text: 'Hồ sơ năm 95 tôi giữ cả. [[Đình làm gì có hầm]], đất ven sông đào xuống là gặp nước.' },
              { who: 'Ông Khải', text: 'Ai nói với cậu chuyện hầm hố thế? Người già hay nhớ nhầm lắm.' }
            ], function () { G.addClue('t_khai_khong_ham'); });
          } },
          { text: 'Không có gì ạ', run: function () {} }
        ] }
      ] },
      { id: 'khai_after_le', once: true, cond: function (S) { return !!S.deduce.q_khai_le; }, lines: [
        { who: 'Ông Khải', text: 'Cậu nhìn tôi lạ thế? Có chuyện gì à?' },
        { text: 'Ông cười, nhưng tay vô thức sờ lên [[nốt ruồi dưới mắt]].' }
      ] },
      { id: 'khai_idle', lines: [{ who: 'Ông Khải', text: 'Việc đình bận lắm, cậu thông cảm. Có gì cứ hỏi.' }] }
    ],

    tung: [
      { id: 'tung_intro', once: true, lines: [
        { who: 'Tùng', text: 'Anh mới về à? Em là Tùng, chạy giao hàng quanh đây. Cần gửi gì cứ gọi em.' },
        { who: 'Tùng', text: '**Sáng** em ở **chợ**, **trưa** chạy **trong xóm**, **chiều** ra **bến** lấy cá cho mấy quán.' }
      ] },
      { id: 'tung_box', once: true, cond: function (S) { return !!S.seen.khai_intro; }, lines: [
        { who: 'Tùng', text: 'Ông Khải hả? Tuần trước ông ấy bảo em mang [[một thùng giấy cũ]] đi bán ve chai.' },
        { who: 'Tùng', text: 'Em chưa kịp bán, để **cạnh quán nước ở bến sông**. Anh cần giấy gói hàng thì cứ lấy.' }
      ], after: function (S) { S.flags.tung_box = true; } },
      { id: 'tung_tip', once: true, lines: [
        { who: 'Tùng', text: 'Mách anh: **ông Ba thợ mộc** sáng nào cũng ra **chợ tầm tám giờ**, **chiều ba giờ ra bến**. Ông ấy uống trà khiếp lắm.' }
      ] },
      { id: 'tung_sold', once: true, cond: function (S) { return S.stats.sold >= 10; }, lines: [
        { who: 'Tùng', text: 'Mấy bà trong chợ khen trà anh pha **giống vị bà Hạnh** ngày xưa đấy.' }
      ] },
      { id: 'tung_ban_ve', once: true, cond: function (S) { return !!S.items.ban_ve_dinh; }, lines: [
        { who: 'Tùng', text: 'Giấy tờ về đình hả? [[Ông Khải]] ban quản lý **gom hết về nhà**. Tuần trước em giao cho ông ấy [[cả thùng sơn đỏ]], chẳng biết để làm gì.' }
      ] },
      { id: 'tung_idle', lines: function (S) {
        return [{ who: 'Tùng', text: slot(S) === 'toi' ? 'Tối rồi, em chạy nốt đơn này là về.' : 'Hôm nay đơn nhiều, chạy muốn rụng chân.' }];
      } }
    ],

    be_na: [
      { id: 'na_intro', once: true, lines: [
        { who: 'Bé Na', text: 'Chú là anh của chị Vy hả? **Chị Vy** hay mua kẹo cho cháu.' },
        { who: 'Bé Na', text: 'Lâu rồi chị Vy không ra đây chơi nữa.' }
      ] },
      { id: 'na_guong', once: true, after: function () { G.addClue('t_na_guong'); }, lines: [
        { who: 'Bé Na', text: 'Hôm trước cháu thấy **chị Vy** ngồi ở **bến sông** nói chuyện một mình.' },
        { who: 'Bé Na', text: 'Cháu hỏi thì chị bảo đang nói chuyện với [[cái gương]]. Mà cháu có thấy cái gương nào đâu.' }
      ] },
      { id: 'na_idle', lines: [{ who: 'Bé Na', text: 'Chú bán trà đá hả? Mẹ cháu không cho uống đá, sợ viêm họng.' }] }
    ]
  };

  G.talk = function (id) {
    var S = G.S, list = G.DIALOGUE[id];
    S.met[id] = (S.met[id] || 0) + 1;
    if (!S.daily['talk_' + id]) { S.daily['talk_' + id] = 1; rel(S, id, 1); } // trò chuyện mỗi ngày tăng thân quen một chút
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e.once && S.seen[e.id]) continue;
      if (e.cond && !e.cond(S)) continue;
      if (e.direct) { if (e.once) S.seen[e.id] = 1; e.direct(S); return; }
      var lines = typeof e.lines === 'function' ? e.lines(S) : e.lines;
      // chỉ đánh dấu "đã nghe" khi đọc xong, để đoạn thoại bị ngắt giữa chừng vẫn nghe lại được
      var ent = e;
      G.ui.dialog(lines, function () { if (ent.once) S.seen[ent.id] = 1; if (ent.after) ent.after(S); });
      return;
    }
  };
})();
