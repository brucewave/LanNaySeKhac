// Tranh cận cảnh khi xem đồ vật: ảnh, bàn thờ, bảng tin, bản vẽ, thư, bia...
// Vẽ cùng nét mực của mẫu v3. Khung 520x300. Hiện phía trên khung thoại và trong Sổ điều tra.
var G = window.G || (window.G = {});

(function () {
  var INK = '#0F141B';
  function wrap(inner, bg) {
    return '<svg viewBox="0 0 520 300" width="520" height="300"><rect width="520" height="300" fill="' + (bg || '#1B222C') + '"/>' +
      '<g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#w)">' + inner + '</g></svg>';
  }
  function R(x, y, w, h, f, ex) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (ex || '') + '/>'; }
  function T(x, y, size, fill, t, anchor, weight) {
    return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + fill + '" stroke="none" text-anchor="' + (anchor || 'start') +
      '" font-weight="' + (weight || 600) + '" font-family="Segoe UI, Arial, sans-serif">' + t + '</text>';
  }
  // nét chữ viết tay giả: các đường lượn
  function scrib(x, y, w, n, gap, col) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var yy = y + i * (gap || 16), ww = w * (0.6 + ((i * 37) % 40) / 100);
      s += '<path d="M' + x + ',' + yy + ' q' + (ww / 8) + ',-5 ' + (ww / 4) + ',0 t' + (ww / 4) + ',0 t' + (ww / 4) + ',0 t' + (ww / 4) + ',0" fill="none" stroke="' + (col || '#4B5560') + '" stroke-width="1.6"/>';
    }
    return s;
  }
  // đặt một nhân vật chibi (khung 160x190, gốc ở chân) vào cảnh
  function chibi(look, x, y, sc, flip) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + ((flip || 1) * sc) + ',' + sc + ')">' +
      G.art.chibi(look).replace('<svg class="chibi', '<svg x="-80" y="-178" class="chibi') + '</g>';
  }

  G.CLOSEUPS = {
    // Ảnh lễ hội đình 1996 (nội dung cố định từ đầu game)
    anh_le_hoi: function () {
      var p = R(40, 18, 440, 264, '#EDE6D6') + '<g filter="url(#sepia)">' + R(56, 30, 408, 220, '#3A3228', ' stroke="none"');
      for (var i = 0; i < 9; i++) p += '<ellipse cx="' + (80 + i * 46) + '" cy="' + (52 + (i % 2) * 8) + '" rx="8" ry="10" fill="#A32E36" stroke-width="2"/>';
      p += '<path d="M56,46 Q260,80 464,46" fill="none" stroke-width="1.6"/>';
      // kiệu và đoàn rước bên trái; trong cửa kiệu có một khuôn mặt mờ
      p += R(70, 120, 90, 70, '#A32E36') + '<path d="M64,120 l14,-16 h74 l14,16" fill="#6A2A2A"/>' + R(98, 140, 34, 30, '#2A2420') +
        '<ellipse cx="115" cy="156" rx="9" ry="10" fill="#8C8070" stroke="none" opacity=".7"/>';
      p += '<path d="M60,196 h160" stroke-width="6"/>';
      p += chibi({ hair: 'non_la', shirt: '#4B5560', mask: true }, 92, 246, 0.42);
      p += chibi({ hair: 'short', shirt: '#C3CACD', mole: true, sash: true }, 186, 246, 0.42);
      // Vy ở giữa, người đeo mặt nạ cầm rìu ngay sau lưng, cổ quấn khăn
      p += chibi({ hair: 'messy', shirt: '#3B4A5E', pants: '#2A3550', scarf: true, mask: true, prop: 'axe_up' }, 306, 236, 0.58, -1);
      p += chibi({ hair: 'long', shirt: '#6F86A0', pants: '#2A3550', eyes: 'big' }, 262, 250, 0.6);
      p += chibi({ hair: 'cap', shirt: '#58755C', mask: true }, 400, 246, 0.44);
      p += '</g>' + R(56, 30, 408, 220, '#FFF6DD', ' opacity=".08" stroke="none"');
      p += T(456, 270, 13, '#8C7A5A', 'Rằm tháng Tám · 1996', 'end');
      return wrap(p, '#141A20');
    },
    ban_tho: function () {
      var p = R(0, 210, 520, 90, '#3B342E') + R(120, 150, 280, 70, '#4A3532') + R(120, 150, 280, 14, '#5A3F38');
      p += R(200, 30, 120, 130, '#C3CACD') + R(212, 42, 96, 106, '#58606A', ' stroke-width="2"');
      p += '<g filter="url(#sepia)">' + chibi({ hair: 'long', shirt: '#A32E36', eyes: 'flat', prop: 'fan' }, 252, 146, 0.48) +
        R(268, 116, 32, 22, '#6A5846', ' stroke-width="2"') + '</g>';
      p += R(236, 168, 48, 32, '#857761') + '<path fill="none" stroke-width="1.6" d="M252,168 v-30M260,168 v-38M268,168 v-32" stroke="#C3CACD"/>';
      p += '<circle cx="252" cy="138" r="2.5" fill="#E05050" stroke="none"/><circle cx="260" cy="130" r="2.5" fill="#E05050" stroke="none"/><circle cx="268" cy="136" r="2.5" fill="#E05050" stroke="none"/>';
      p += R(140, 140, 10, 26, '#A32E36', ' stroke-width="2"') + R(370, 140, 10, 26, '#A32E36', ' stroke-width="2"');
      p += '<path d="M145,134 q-4,-8 0,-12 q4,4 0,12" fill="#F2C230" stroke="none"/><path d="M375,134 q-4,-8 0,-12 q4,4 0,12" fill="#F2C230" stroke="none"/>';
      return wrap(p);
    },
    bang_tin: function () {
      var p = R(60, 20, 400, 260, '#4B5560');
      p += R(80, 40, 110, 80, '#D5DCE0', ' stroke-width="2"') + T(90, 60, 12, INK, 'LỊCH TIÊM CHỦNG') + scrib(90, 78, 90, 3, 12);
      p += R(210, 36, 120, 70, '#C3CACD', ' stroke-width="2"') + T(220, 56, 12, INK, 'CẮT ĐIỆN') + scrib(220, 72, 100, 2, 12);
      p += R(345, 46, 100, 90, '#D5DCE0', ' stroke-width="2"') + T(355, 66, 12, INK, 'TÌM NGƯỜI') + '<circle cx="395" cy="96" r="16" fill="#8C949B" stroke-width="2"/>';
      p += R(150, 140, 200, 130, '#C8B98A', ' stroke-width="2.5" transform="rotate(-3 250 205)"');
      p += '<g transform="rotate(-3 250 205)">' + T(250, 166, 18, '#4A3A20', 'TÌM NGƯỜI', 'middle', 800) +
        R(170, 176, 50, 60, '#A89868', ' stroke-width="2"') + '<circle cx="195" cy="198" r="12" fill="#8A7A50" stroke="none"/>' +
        scrib(232, 190, 100, 3, 14, '#7A6A40') + T(232, 252, 11, '#6A5020', '...mất tích tháng 8 năm 1996,') + T(232, 264, 11, '#6A5020', 'gần đình làng') + '</g>';
      return wrap(p);
    },
    ban_ve: function () {
      var p = R(30, 16, 460, 268, '#B9C6CC');
      for (var x = 50; x < 480; x += 24) p += '<path d="M' + x + ',24 V276" stroke="#A4B3BA" stroke-width="1"/>';
      p += R(110, 50, 300, 180, 'none', ' stroke="#2C4A5A" stroke-width="2.5"') + R(170, 70, 180, 60, 'none', ' stroke="#2C4A5A" stroke-width="2"');
      p += T(260, 105, 13, '#2C4A5A', 'GIAN THỜ', 'middle');
      p += R(225, 150, 70, 50, '#C8D2D6', ' stroke="#8A9AA2" stroke-width="2" stroke-dasharray="5 4"');
      p += '<path d="M232,160 l56,30M288,160 l-56,30" stroke="#9AAAB2" stroke-width="3" opacity=".7"/>' + T(260, 180, 12, '#7A8A92', 'hầm', 'middle');
      [[225, 150], [295, 150], [225, 200], [295, 200]].forEach(function (c) { p += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="4" fill="#2C4A5A" stroke="none"/>'; });
      p += '<path d="M300,212 q30,20 70,24" fill="none" stroke="#4B5560" stroke-width="1.5"/>';
      p += T(300, 254, 14, '#3A3A3A', '"hầm — không đưa vào bản nộp"', 'start', 500);
      p += T(470, 270, 12, '#2C4A5A', 'Sửa đình 1995 · Ba Mộc', 'end');
      return wrap(p);
    },
    bien_ban: function () {
      var p = R(90, 14, 340, 272, '#E6E2D6') + T(260, 44, 15, INK, 'BIÊN BẢN NGHIỆM THU', 'middle', 800) + T(260, 62, 11, '#4B5560', 'Tu sửa đình làng · 1995', 'middle');
      p += scrib(120, 86, 280, 4, 14);
      p += R(170, 146, 180, 70, 'none', ' stroke="#4B5560" stroke-width="2"') + R(210, 158, 100, 30, 'none', ' stroke="#4B5560" stroke-width="1.5"') + T(260, 206, 11, '#4B5560', 'Bản vẽ kèm theo · không có hầm', 'middle');
      p += T(330, 244, 11, '#4B5560', 'Trưởng ban', 'middle') + '<path d="M292,262 q16,-14 30,0 t30,-4" fill="none" stroke="#2A3550" stroke-width="2"/>' + T(330, 278, 11, INK, 'Nguyễn Văn Khải', 'middle', 700);
      return wrap(p);
    },
    guong: function () {
      var p = R(80, 60, 360, 220, '#3B3428') + '<path d="M80,60 l40,-30 h280 l40,30" fill="#4A4038"/>';
      p += '<circle cx="260" cy="150" r="82" fill="#9C7A3C"/><circle cx="260" cy="150" r="66" fill="#1B2A36" stroke-width="2.5"/>';
      p += '<circle cx="290" cy="122" r="16" fill="#E2E8EA" stroke="none"/><path d="M200,190 q30,-10 60,0 t60,0" fill="none" stroke="#3A5060" stroke-width="2"/>';
      p += '<path d="M260,232 v40" stroke-width="12"/><path d="M260,232 v40" stroke="#6A5846" stroke-width="7"/>';
      p += '<path d="M248,244 q12,8 24,0 q-12,10 -24,0M250,256 q10,6 20,0" fill="none" stroke="#A32E36" stroke-width="4"/>';
      return wrap(p);
    },
    trang_so: function () {
      var p = R(110, 14, 300, 272, '#E8E0C8');
      for (var y = 50; y < 270; y += 22) p += '<path d="M120,' + y + ' H400" stroke="#C8B898" stroke-width="1"/>';
      p += T(260, 38, 14, '#4A3A20', 'SỔ THU CHI TU SỬA ĐÌNH', 'middle', 800) + scrib(126, 62, 230, 4, 22, '#6A5A3A');
      p += R(118, 150, 284, 50, '#E05050', ' opacity=".14" stroke="none"');
      p += T(126, 170, 12, '#7A1A20', 'Chi riêng hầm: 12 bao xi măng, 3.000.000 đ', 'start', 700) + T(126, 190, 12, '#7A1A20', 'K. nhận · Không đưa vào sổ dân góp', 'start', 700);
      p += scrib(126, 220, 230, 2, 22, '#6A5A3A');
      return wrap(p);
    },
    trang_so_cu: function () {
      var p = R(120, 26, 280, 250, '#C8B88A', ' transform="rotate(2 260 150)"');
      p += '<g transform="rotate(2 260 150)">' + '<path d="M120,26 l30,30 M400,276 l-26,-20" stroke="#8A7A50" stroke-width="2"/>';
      p += scrib(136, 60, 220, 4, 20, '#8A7A50') + T(136, 160, 12, '#6A2A20', 'Chi riêng hầm: 12 bao xi măng, 3.000.000 đ', 'start', 700) + T(136, 180, 12, '#6A2A20', 'K. nhận', 'start', 700);
      p += '<ellipse cx="330" cy="230" rx="40" ry="20" fill="#8A7A50" opacity=".35" stroke="none"/></g>';
      return wrap(p);
    },
    thu_me: function () {
      var p = R(0, 200, 520, 100, '#3B342E') + R(130, 40, 260, 180, '#E6E2D6', ' transform="rotate(-2 260 130)"');
      p += '<g transform="rotate(-2 260 130)">' + scrib(150, 80, 220, 5, 22, '#2A3550') + T(150, 200, 13, '#2A3550', '— Mẹ', 'start', 600) + '</g>';
      p += R(400, 120, 40, 90, '#6A5846') + '<ellipse cx="420" cy="112" rx="14" ry="18" fill="#E2B060" opacity=".85"/>';
      return wrap(p);
    },
    thu_vy: function () {
      var p = R(100, 14, 320, 272, '#EEF0F2');
      for (var x = 100; x < 420; x += 16) p += '<path d="M' + x + ',14 V286" stroke="#D0D8E0" stroke-width="1"/>';
      for (var y = 14; y < 286; y += 16) p += '<path d="M100,' + y + ' H420" stroke="#D0D8E0" stroke-width="1"/>';
      p += T(120, 50, 14, '#2A3550', 'Anh,', 'start', 700) + scrib(120, 76, 260, 3, 22, '#2A3550');
      p += T(120, 150, 12, '#7A1A20', 'Người đeo mặt nạ trong ảnh...', 'start', 700) + T(120, 170, 12, '#7A1A20', '"tế thần sông" · Mẹ là người bị chọn', 'start', 700);
      p += scrib(120, 200, 240, 2, 22, '#2A3550') + T(400, 268, 13, '#2A3550', '— Vy', 'end', 700);
      return wrap(p);
    },
    danh_sach: function () {
      var p = R(110, 14, 300, 272, '#EEF0F2') + T(260, 44, 14, '#2A3550', 'BAN TẾ LỄ · người được chọn', 'middle', 800);
      p += T(140, 76, 12, '#2A3550', 'Trưởng ban: Nguyễn Văn Khải', 'start', 700);
      p += T(140, 116, 13, '#2A3550', '1992 — Nguyễn Thị Mai') + T(140, 146, 13, '#2A3550', '1994 — Phạm Văn Út');
      p += T(140, 186, 13, '#2A3550', '1996 — Trần Văn Lộc') + '<path d="M138,182 H290" stroke="#A32E36" stroke-width="2.5"/>';
      p += T(300, 210, 18, '#A32E36', 'Hạnh', 'start', 800) + '<path d="M290,186 q12,4 10,18" fill="none" stroke="#A32E36" stroke-width="2"/>';
      return wrap(p);
    },
    trang_vy: function () {
      var p = R(0, 0, 520, 70, '#3A3430') + '<path d="M0,60 H520" stroke-width="14"/><path d="M0,60 H520" stroke="#4A3532" stroke-width="9"/>';
      p += R(130, 80, 240, 200, '#EEF0F2', ' transform="rotate(3 250 180)"') + '<g transform="rotate(3 250 180)">';
      for (var y = 96; y < 280; y += 16) p += '<path d="M130,' + y + ' H370" stroke="#D0D8E0" stroke-width="1"/>';
      p += '<path d="M130,80 l8,6 l-6,8 l8,6 l-6,8 l8,6" fill="none" stroke="#8C949B" stroke-width="1.5"/>';
      p += T(150, 120, 13, '#2A3550', 'Mùng 9/8/1996.', 'start', 700) + T(150, 142, 13, '#2A3550', 'Em đã tới.', 'start', 700) + scrib(150, 170, 190, 4, 22, '#2A3550') + '</g>';
      return wrap(p);
    },
    bia: function () {
      var p = R(0, 240, 520, 60, '#2A323D') + R(110, 16, 300, 236, '#8C949B') + R(126, 30, 268, 146, '#6F7C88', ' stroke-width="2"');
      p += T(260, 52, 11, '#1B222C', 'TƯỞNG NIỆM NẠN NHÂN VỤ CHÁY ĐÌNH 1996', 'middle', 800);
      p += T(260, 84, 13, '#1B222C', 'Hạnh — không tìm thấy thi thể', 'middle') + T(260, 108, 13, '#1B222C', 'Rạng — chết đuối ở bến', 'middle') + scrib(176, 132, 160, 2, 16, '#3A4552');
      p += R(170, 184, 180, 60, '#4B5560', ' stroke-width="2"') + T(260, 202, 11, '#C3CACD', 'Người mất dưới sông', 'middle', 700);
      p += T(260, 220, 12, '#E2D2A0', '1992 — Nguyễn Thị Mai', 'middle') + T(260, 237, 12, '#E2D2A0', '1994 — Phạm Văn Út', 'middle');
      p += '<path d="M96,250 q10,-30 4,-60M424,250 q-10,-30 -4,-60" fill="none" stroke="#58755C" stroke-width="3"/>';
      return wrap(p);
    },
    nen_tho: function () {
      var p = R(0, 0, 520, 300, '#262C35') + R(110, 50, 300, 200, '#8C949B');
      p += '<path fill="none" stroke-width="1.6" d="M150,80 l60,50 l-20,40 l70,30 l40,-20" stroke="#3A4552" stroke-width="2.5"/>';
      [[130, 70], [390, 70], [130, 230]].forEach(function (c) { p += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="14" fill="#4A3532"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="7" fill="#3A2826" stroke="none"/>'; });
      p += '<circle cx="390" cy="230" r="14" fill="#4A3532"/><path d="M378,238 L402,222" stroke="#C8B080" stroke-width="5"/><path d="M380,232 l4,-3 l3,4 l4,-3" fill="none" stroke="#E2D2A0" stroke-width="2"/>';
      p += T(390, 270, 11, '#C3CACD', 'đông nam', 'middle');
      p += '<path d="M240,150 q10,-20 0,-40 q-10,-20 6,-40" fill="none" stroke="#B9C6CC" stroke-width="2" opacity=".5"/>';
      return wrap(p);
    },
    bia_da: function () {
      var p = R(0, 0, 520, 300, '#0F141B') + R(130, 20, 260, 260, '#1B222C') + R(160, 40, 200, 220, '#6F7C88');
      for (var y = 70; y < 240; y += 26) p += '<path d="M180,' + y + ' h' + (120 + (y % 3) * 20) + '" stroke="#2B3138" stroke-width="4"/>';
      p += T(260, 254, 11, '#C3CACD', 'Bốn chốt lim giữ miệng giếng', 'middle', 700);
      p += '<path d="M120,280 q20,-40 10,-90" fill="none" stroke="#B9C6CC" stroke-width="2" opacity=".3"/>';
      return wrap(p);
    },
    riu: function () {
      var p = R(0, 0, 520, 300, '#3A4552') + '<path d="M0,30 H520M0,90 H520M0,150 H520M0,210 H520M0,270 H520" stroke="#2F3642" stroke-width="2"/>';
      p += '<path d="M120,250 L360,80" stroke-width="18"/><path d="M120,250 L360,80" stroke="#2E2925" stroke-width="11"/>';
      p += '<path d="M340,60 q70,-30 90,40 l-60,40 q-6,-50 -30,-80 Z" fill="#8C949B"/>';
      p += '<path d="M380,74 l14,-8 l10,6 l-6,12 Z" fill="#6F7C88" stroke-width="1.5"/><path fill="none" stroke-width="1.6" d="M396,78 h12" stroke="#4B5560"/>';
      p += '<path d="M418,116 l6,-6 l4,6 l6,-6 l4,6" fill="none" stroke="#1B222C" stroke-width="2.5"/>';
      return wrap(p);
    },
    tre_ngu: function () {
      var p = R(60, 40, 400, 240, '#4A4038') + R(80, 60, 360, 200, '#6F7C88');
      p += R(96, 76, 120, 40, '#C3CACD', ' rx="12" stroke-width="2.5"') + R(244, 76, 120, 40, '#C3CACD', ' rx="12" stroke-width="2.5"');
      // hai đứa trẻ nằm ngủ: đầu trên gối, mắt nhắm
      p += chibi({ hair: 'messy', shirt: '#C3CACD', eyes: 'narrow', kid: true }, 156, 196, 0.95);
      p += chibi({ hair: 'long', shirt: '#C3CACD', eyes: 'narrow', kid: true }, 304, 196, 0.85);
      p += R(86, 150, 348, 106, '#58755C', ' rx="14" stroke-width="2.5"') + '<path d="M90,170 q170,-16 340,0" fill="none" stroke="#3F5A44" stroke-width="2"/>';
      p += '<path d="M190,166 l-6,-46 q26,-10 44,10 Z" fill="#C8B080" stroke-width="2.5"/>';
      p += R(60, 40, 400, 240, '#D5DCE0', ' fill-opacity=".14" stroke-width="2"');
      return wrap(p);
    }
  };

  // ảnh nào gắn với dòng thoại nào (dòng có img thì từ đó trở đi hiện tranh, img: null để tắt)
  function tag(key, idx, img) { var L = G.TEXT[key]; if (L && L[idx]) L[idx].img = img; }
  G.applyCloseups = function () {
    tag('ban_tho', 0, 'ban_tho'); tag('bang_tin', 0, 'bang_tin'); tag('ban_vy', 0, 'anh_le_hoi'); tag('ban_ve_dinh', 0, 'ban_ve');
    tag('box_open', 1, 'bien_ban'); tag('box_draft', 0, 'ban_ve'); tag('find_mirror', 1, 'guong'); tag('ledger', 2, 'trang_so');
    tag('tree_open', 1, 'trang_so_cu'); tag('thu_me', 0, 'thu_me'); tag('thu_me2', 0, 'thu_me'); tag('tre_ngu', 0, 'tre_ngu');
    tag('open_box', 1, 'thu_vy'); tag('open_box', 4, 'danh_sach'); tag('vy_pages', 1, 'trang_vy');
    tag('bia', 0, 'bia'); tag('nen_tho', 0, 'nen_tho'); tag('stone', 1, 'bia_da'); tag('riu_look', 0, 'riu');
    var C = { e_anh_le_hoi: 'anh_le_hoi', e_nhang: 'ban_tho', e_to_tim_nguoi: 'bang_tin', e_ban_ve: 'ban_ve', e_bien_ban: 'bien_ban',
      e_guong: 'guong', e_trang_so: 'trang_so_cu', e_thu_me: 'thu_me', e_trang_vy: 'trang_vy', t_thu_vy: 'thu_vy', e_danh_sach: 'danh_sach',
      e_bia: 'bia', e_chot: 'nen_tho', e_bia_da: 'bia_da', e_riu: 'riu', e_flash: 'anh_le_hoi' };
    for (var k in C) if (G.CLUES[k]) G.CLUES[k].img = C[k];
  };

  G.applyCloseups();

  G.ui.closeup = function (img) {
    var el = document.getElementById('closeup');
    if (!img || !G.CLOSEUPS[img]) { el.hidden = true; el._img = null; return; }
    if (el._img !== img) { el.innerHTML = G.CLOSEUPS[img](); el._img = img; }
    el.hidden = false;
  };
})();
