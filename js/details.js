// Chi tiết cho đồ vật tương tác: vẽ chồng lên đúng khung của từng chỗ (hit), có hiệu ứng động (khói nhang, lửa nến, gương lóe, nước gợn).
// Chỉ vẽ khi chỗ tương tác đang có mặt trong cảnh (cond đúng lúc dựng cảnh).
var G = window.G || (window.G = {});

(function () {
  var INK = '#0F141B';
  function R(x, y, w, h, f, ex) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (ex || '') + '/>'; }
  function flame(x, y) { return '<g class="dt-flame" style="transform-origin:' + x + 'px ' + (y + 4) + 'px"><path d="M' + x + ',' + (y - 8) + ' q5,6 0,12 q-5,-6 0,-12 z" fill="#E2C46A" stroke="#A32E36" stroke-width="1.2"/></g>' +
    '<circle cx="' + x + '" cy="' + (y - 2) + '" r="10" fill="#E2C46A" opacity=".18" stroke="none" class="dt-halo"/>'; }
  function smoke(x, y, n) {
    var t = '';
    for (var i = 0; i < (n || 3); i++) t += '<path class="dt-smoke" style="animation-delay:-' + (i * 1.1) + 's" d="M' + x + ',' + y + ' q-6,-10 0,-20 q6,-10 0,-20" fill="none" stroke="#B9C2C6" stroke-width="2" opacity="0"/>';
    return t;
  }
  function incense(x, y) { // bát nhang + 3 nén đang cháy
    return '<path d="M' + (x - 10) + ',' + y + ' q10,10 20,0 z" fill="#857761" stroke-width="2"/>' + R(x - 11, y - 3, 22, 4, '#948C5E', ' stroke-width="1.5"') +
      [-4, 0, 4].map(function (d) { return '<path d="M' + (x + d) + ',' + (y - 3) + ' l' + (d / 2) + ',-16" stroke="#A32E36" stroke-width="1.6"/><circle cx="' + (x + d * 1.5) + '" cy="' + (y - 19) + '" r="1.6" fill="#E2C46A" stroke="none" class="dt-ember"/>'; }).join('') +
      smoke(x, y - 20, 3);
  }
  function glint(x, y, w, h) { // vệt sáng quét qua mặt kính
    return '<clipPath id="cg' + x + '_' + y + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/></clipPath><g clip-path="url(#cg' + x + '_' + y + ')">' +
      '<path class="dt-glint" d="M' + (x - 20) + ',' + (y + h) + ' l16,0 l' + (h * 0.6) + ',-' + h + ' l-16,0 z" fill="#E2E8EA" opacity=".55" stroke="none"/></g>';
  }
  function paper(x, y, w, h, rot) { return '<g transform="rotate(' + (rot || 0) + ' ' + (x + w / 2) + ' ' + (y + h / 2) + ')">' + R(x, y, w, h, '#D5DCE0', ' stroke-width="1.5"') +
    '<path d="M' + (x + 3) + ',' + (y + 4) + ' h' + (w - 6) + ' M' + (x + 3) + ',' + (y + 8) + ' h' + (w - 8) + ' M' + (x + 3) + ',' + (y + 12) + ' h' + (w - 10) + '" stroke="#8C949B" stroke-width="1"/></g>'; }

  // Mỗi hàm nhận khung hit [x, y, w, h] và trả về SVG (toạ độ thế giới)
  var D = {
    ban_tho: function (x, y, w, h) {
      var cx = x + w / 2;
      return '<path d="M' + (cx - 8) + ',' + (y + 22) + ' q8,-10 16,0 v8 h-16 z" fill="#8C949B" stroke-width="1.2"/>' + // bóng người trong ảnh thờ
        flame(x + 17, y + 24) + flame(x + w - 18, y + 24) +
        incense(cx, y + 52) +
        '<ellipse cx="' + (x + 30) + '" cy="' + (y + 54) + '" rx="12" ry="4" fill="#D5DCE0" stroke-width="1.5"/><circle cx="' + (x + 26) + '" cy="' + (y + 49) + '" r="4" fill="#C98A4A" stroke-width="1.2"/><circle cx="' + (x + 33) + '" cy="' + (y + 50) + '" r="4" fill="#A32E36" stroke-width="1.2"/>' +
        '<ellipse cx="' + (x + w - 30) + '" cy="' + (y + 54) + '" rx="12" ry="4" fill="#D5DCE0" stroke-width="1.5"/><path d="M' + (x + w - 40) + ',' + (y + 50) + ' q10,-12 18,-2 q-8,0 -18,2 z" fill="#B8A65A" stroke-width="1.2"/>' +
        '<path d="M' + (x + 6) + ',' + (y + h - 14) + ' h' + (w - 12) + '" stroke="#B89A4A" stroke-width="2" stroke-dasharray="6 4"/>';
    },
    ban_tho_dinh: function (x, y, w, h) {
      var cx = x + w / 2;
      return flame(x + 16, y + 20) + flame(x + w - 16, y + 20) + incense(cx, y + 40) +
        '<path d="M' + (cx - 26) + ',' + (y + 12) + ' h52" stroke="#B89A4A" stroke-width="3"/>' +
        '<ellipse cx="' + (x + 34) + '" cy="' + (y + 42) + '" rx="10" ry="3.5" fill="#D5DCE0" stroke-width="1.4"/><circle cx="' + (x + 34) + '" cy="' + (y + 38) + '" r="4" fill="#A32E36" stroke-width="1.2"/>' +
        '<ellipse cx="' + (x + w - 34) + '" cy="' + (y + 42) + '" rx="10" ry="3.5" fill="#D5DCE0" stroke-width="1.4"/><rect x="' + (x + w - 40) + '" y="' + (y + 32) + '" width="12" height="8" fill="#B89A4A" stroke-width="1.2"/>';
    },
    giuong: function (x, y, w, h) { // màn gấp trên thành giường, chăn có nếp, điện thoại và cuốn sách
      return R(x + 6, y + 2, w - 12, 9, '#D5DCE0', ' rx="4" stroke-width="2"') + '<path d="M' + (x + 14) + ',' + (y + 4) + ' v5 M' + (x + 34) + ',' + (y + 4) + ' v5 M' + (x + w - 34) + ',' + (y + 4) + ' v5 M' + (x + w - 14) + ',' + (y + 4) + ' v5" stroke="#8C949B" stroke-width="1.2"/>' +
        '<path d="M' + (x + 14) + ',' + (y + 66) + ' q20,-6 40,2 t40,0 M' + (x + 18) + ',' + (y + 82) + ' q22,-6 44,2 t36,-2" fill="none" stroke="#6F86A0" stroke-width="2"/>' +
        R(x + w - 34, y + 70, 12, 20, '#1B222C', ' rx="2" stroke-width="1.5"') + R(x + w - 32, y + 72, 8, 14, '#4B6E7A', ' stroke="none"') +
        '<path d="M' + (x + 24) + ',' + (y + 92) + ' l20,-4 l2,8 l-20,4 z" fill="#A32E36" stroke-width="1.5"/>';
    },
    ban_vy: function (x, y, w, h) { // đèn bàn hắt sáng, ống bút, ảnh nhỏ, vở mở
      return '<circle cx="' + (x + 14) + '" cy="' + (y + 16) + '" r="30" fill="#E2D9A8" opacity=".14" stroke="none" class="dt-halo"/>' +
        '<path d="M' + (x + 8) + ',' + (y + 24) + ' l6,-12 l10,-4" fill="none" stroke-width="2"/><path d="M' + (x + 20) + ',' + (y + 4) + ' l10,2 l-4,8 z" fill="#3F6670" stroke-width="1.5"/>' +
        R(x + w - 14, y + 8, 9, 12, '#857761', ' stroke-width="1.5"') + '<path d="M' + (x + w - 12) + ',' + (y + 8) + ' l-2,-7 M' + (x + w - 8) + ',' + (y + 8) + ' l1,-8" stroke="#A32E36" stroke-width="1.5"/>' +
        R(x + w - 16, y + 58, 12, 15, '#D5DCE0', ' stroke-width="1.5"') + '<circle cx="' + (x + w - 10) + '" cy="' + (y + 64) + '" r="3" fill="#A32E36" stroke="none"/>' +
        R(x + 8, y + 76, 9, 9, '#E2C46A', ' stroke-width="1" transform="rotate(-8 ' + (x + 12) + ' ' + (y + 80) + ')"');
    },
    guong: function (x, y, w, h) { // gương đồng trên kệ: mặt kính lạnh, viền chạm, vết nứt, vệt sáng quét
      if (!G.S.era && !G.S.flags.mirror_placed) return ''; // chưa đặt gương lên kệ
      var cx = x + w / 2, cy = y + h / 2 - 4, rx = w / 2 - 12, ry = h / 2 - 16;
      return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + (rx + 5) + '" ry="' + (ry + 5) + '" fill="#6A5846" stroke-width="2.5"/>' +
        '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="#4B6E7A" stroke-width="2"/>' +
        '<ellipse cx="' + (cx - 4) + '" cy="' + (cy - 6) + '" rx="' + (rx - 6) + '" ry="' + (ry - 8) + '" fill="#6F86A0" opacity=".45" stroke="none"/>' +
        '<path d="M' + (cx + 4) + ',' + (cy - ry + 6) + ' l-6,14 l8,10 l-4,12" fill="none" stroke="#D5DCE0" stroke-width="1.2" opacity=".8"/>' +
        '<path d="M' + (cx - 10) + ',' + (y + 6) + ' q10,-10 20,0" fill="none" stroke="#B89A4A" stroke-width="2.5"/>' +
        '<clipPath id="cgm' + x + '"><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/></clipPath>' +
        '<g clip-path="url(#cgm' + x + ')"><path class="dt-glint" d="M' + (cx - rx - 20) + ',' + (cy + ry) + ' l12,0 l' + (ry * 1.2) + ',-' + (ry * 2) + ' l-12,0 z" fill="#E2E8EA" opacity=".6" stroke="none"/></g>';
    },
    goc_bang: function (x, y, w, h) { // hốc cây + dải vải đỏ buộc quanh thân
      var cx = x + w / 2;
      return '<ellipse cx="' + (cx + 4) + '" cy="' + (y + 40) + '" rx="7" ry="10" fill="#05070A" stroke-width="2"/>' +
        '<path d="M' + (cx - 14) + ',' + (y + 58) + ' q14,6 28,0" fill="none" stroke="#A32E36" stroke-width="4"/><path d="M' + (cx + 12) + ',' + (y + 60) + ' l6,12 M' + (cx + 12) + ',' + (y + 60) + ' l-2,13" stroke="#A32E36" stroke-width="2.5"/>' +
        '<path d="M' + (cx - 8) + ',' + (y + 22) + ' l4,8 l4,-8" fill="none" stroke="#B9C2C6" stroke-width="1.5" opacity=".7"/>';
    },
    thung_giay: function (x, y, w, h) { // nắp hở, băng dính, giấy chìa ra, chữ VE CHAI
      return '<path d="M' + (x + 4) + ',' + (y + 8) + ' l-8,-12 l20,2 z M' + (x + w - 4) + ',' + (y + 8) + ' l10,-10 l-20,0 z" fill="#857761" stroke-width="1.5"/>' +
        paper(x + 12, y - 6, 16, 14, -12) + paper(x + 28, y - 4, 14, 12, 10) +
        R(x + w / 2 - 3, y + 8, 6, h - 12, '#B9A27A', ' stroke="none" opacity=".8"') +
        '<text x="' + (x + w / 2) + '" y="' + (y + h - 8) + '" text-anchor="middle" font-size="8" font-weight="800" fill="#2B2622" stroke="none">VE CHAI</text>';
    },
    cua_nha9: function (x, y, w, h) { // biển số nhà 9 và ổ khóa gỉ (khi cửa còn đóng)
      var t = R(x - 12, y - 2, 16, 14, '#3F6670', ' rx="2" stroke-width="1.5"') + '<text x="' + (x - 4) + '" y="' + (y + 9) + '" text-anchor="middle" font-size="10" font-weight="900" fill="#D5DCE0" stroke="none">9</text>';
      if (!G.S.flags.door9_open) t += '<path d="M' + (x + w / 2 + 6) + ',' + (y + 22) + ' q0,-8 6,-8 q6,0 6,8" fill="none" stroke-width="2"/>' + R(x + w / 2 + 4, y + 22, 16, 14, '#6A5846', ' rx="2" stroke-width="1.5"') +
        '<circle cx="' + (x + w / 2 + 12) + '" cy="' + (y + 29) + '" r="2" fill="' + INK + '"/>';
      return t;
    },
    ban_go: function (x, y, w, h) { // giấy tờ bừa bộn, lọ mực, vệt cốc
      return paper(x + 8, y + 10, 20, 16, -8) + paper(x + w - 30, y + 12, 18, 14, 12) +
        '<ellipse cx="' + (x + w - 18) + '" cy="' + (y + h - 16) + '" rx="7" ry="4" fill="none" stroke="#5A4A3C" stroke-width="1.5"/>' +
        R(x + 10, y + h - 24, 8, 10, '#1B222C', ' rx="2" stroke-width="1.4"') + '<path d="M' + (x + 22) + ',' + (y + h - 16) + ' l14,-6" stroke="#2B2622" stroke-width="1.6"/>';
    },
    cot_ben: function (x, y, w, h) { // cuộn dây thừng quanh cọc, mảnh gương lóe
      var cx = x + w / 2;
      return '<path d="M' + (cx - 12) + ',' + (y + 26) + ' q12,6 24,0 M' + (cx - 12) + ',' + (y + 32) + ' q12,6 24,0" fill="none" stroke="#948C5E" stroke-width="3"/>' +
        '<path d="M' + (cx + 12) + ',' + (y + 32) + ' q16,10 6,22" fill="none" stroke="#948C5E" stroke-width="3"/>' +
        (G.S.items && G.S.clues && !G.S.clues.e_guong ? '<path d="M' + (cx - 16) + ',' + (y + h - 4) + ' l6,-8 l6,6 z" fill="#8FA4AE" stroke-width="1.2"/><circle cx="' + (cx - 10) + '" cy="' + (y + h - 8) + '" r="6" fill="#E2E8EA" stroke="none" class="dt-spark"/>' : '');
    },
    bang_tin: function () { return ''; }, // bảng tin đã vẽ đủ ở scenes.js
    riu_xuong: function (x, y, w, h) { // phoi bào dưới chân tường
      var t = '';
      for (var i = 0; i < 6; i++) t += '<path d="M' + (x + 8 + i * 8) + ',' + (y + h - 4) + ' q4,-6 8,0" fill="none" stroke="#B9A27A" stroke-width="2"/>';
      return t;
    },
    bia: function (x, y, w, h) { // rêu chân bia, bát nhang nhỏ đã nguội
      return '<path d="M' + x + ',' + (y + h - 6) + ' q8,-8 14,-2 q8,-6 14,0 q8,-6 20,2" fill="#3F6B4A" stroke-width="1.5"/>' +
        '<path d="M' + (x + w / 2 - 8) + ',' + (y + h + 2) + ' q8,8 16,0 z" fill="#857761" stroke-width="1.5"/><path d="M' + (x + w / 2) + ',' + (y + h + 2) + ' v-10" stroke="#5A4A3C" stroke-width="1.5"/>';
    },
    nen_tho: function (x, y, w, h) { // gạch nứt, vết cháy xém, tàn tro
      return '<path d="M' + (x + 14) + ',' + (y + 20) + ' l14,10 l-6,14 l16,8 M' + (x + w - 20) + ',' + (y + 14) + ' l-10,16 l8,12" fill="none" stroke="#05070A" stroke-width="2"/>' +
        '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" rx="' + (w / 3) + '" ry="' + (h / 4) + '" fill="#05070A" opacity=".35" stroke="none"/>' +
        '<circle cx="' + (x + w / 2 - 8) + '" cy="' + (y + h / 2 + 2) + '" r="2" fill="#8C949B" stroke="none"/><circle cx="' + (x + w / 2 + 10) + '" cy="' + (y + h / 2 - 4) + '" r="1.6" fill="#8C949B" stroke="none"/>';
    },
    thu_me: function (x, y, w, h) { // phong bì và lá thư viết tay
      return '<path d="M' + (x + 10) + ',' + (y + 10) + ' h30 v20 h-30 z M' + (x + 10) + ',' + (y + 10) + ' l15,11 l15,-11" fill="#D5DCE0" stroke-width="1.5"/>' + R(x + 34, y + 12, 5, 6, '#A32E36', ' stroke="none"') +
        paper(x + 46, y + 8, 26, 22, 8);
    },
    so_thu_chi: function (x, y, w, h) { // sổ mở, dòng chữ, con dấu đỏ
      return '<path d="M' + (x + w / 2) + ',' + (y + 10) + ' v28" stroke="#5A4A3C" stroke-width="1.5"/>' +
        [0, 1, 2, 3].map(function (i) { return '<path d="M' + (x + 10) + ',' + (y + 16 + i * 5) + ' h' + (w / 2 - 14) + ' M' + (x + w / 2 + 4) + ',' + (y + 16 + i * 5) + ' h' + (w / 2 - 16) + '" stroke="#8C949B" stroke-width="1"/>'; }).join('') +
        '<circle cx="' + (x + w - 16) + '" cy="' + (y + 34) + '" r="5" fill="none" stroke="#A32E36" stroke-width="2"/>';
    },
    chieng: function (x, y, w, h) { // vòng sáng trên mặt chiêng + dùi treo
      var cx = x + w / 2, cy = y + h / 2 - 4;
      return '<circle cx="' + cx + '" cy="' + cy + '" r="10" fill="none" stroke="#E2C46A" stroke-width="1.5" opacity=".8"/><circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#B89A4A" stroke-width="1.2"/>' +
        '<path class="dt-glint2" d="M' + (cx - 12) + ',' + (cy - 6) + ' q6,-8 14,-8" fill="none" stroke="#E2E8EA" stroke-width="2"/>' +
        '<path d="M' + (x + w - 4) + ',' + (y + 6) + ' v20" stroke-width="1.5"/><rect x="' + (x + w - 8) + '" y="' + (y + 26) + '" width="8" height="12" rx="3" fill="#A32E36" stroke-width="1.5"/>';
    },
    xa_nha: function (x, y, w, h) { // mép giấy thò ra khỏi kẽ xà
      return paper(x + 20, y + 14, 16, 12, -14) + paper(x + 38, y + 16, 14, 10, 8);
    },
    cot_den: function (x, y, w, h) { // đèn lồng chập chờn
      var cx = x + w / 2;
      return '<circle cx="' + cx + '" cy="' + (y + 8) + '" r="26" fill="#E2C46A" opacity=".16" stroke="none" class="dt-halo"/>' + flame(cx, y + 10);
    },
    gieng: function (x, y, w, h) { // gạch thành giếng, dây gàu, mặt nước gợn
      var cx = x + w / 2, cy = y + h / 2, t = '';
      for (var a = 0; a < 12; a++) { var an = a / 12 * Math.PI * 2; t += '<path d="M' + (cx + Math.cos(an) * 62) + ',' + (cy + Math.sin(an) * 48) + ' l' + (Math.cos(an) * 8) + ',' + (Math.sin(an) * 6) + '" stroke="#2B2622" stroke-width="2"/>'; }
      t += '<ellipse class="dt-ripple" cx="' + cx + '" cy="' + (cy + 4) + '" rx="20" ry="8" fill="none" stroke="#6F86A0" stroke-width="1.5"/>';
      t += '<ellipse class="dt-ripple" style="animation-delay:-1.4s" cx="' + cx + '" cy="' + (cy + 4) + '" rx="20" ry="8" fill="none" stroke="#6F86A0" stroke-width="1.5"/>';
      t += '<path d="M' + (cx + 50) + ',' + (y + 6) + ' v26" stroke="#948C5E" stroke-width="2"/><path d="M' + (cx + 42) + ',' + (y + 32) + ' h16 l-3,12 h-10 z" fill="#5A4A3C" stroke-width="1.5"/>';
      return t;
    },
    bao: function (x, y, w, h) { // nút buộc miệng bao, chữ in, gạo vương
      var t = '';
      [[x + 22, y + 10], [x + 70, y + 24], [x + 40, y + 46]].forEach(function (p) { t += '<path d="M' + p[0] + ',' + p[1] + ' l-4,-6 M' + p[0] + ',' + p[1] + ' l5,-6" stroke="#948C5E" stroke-width="2"/>'; });
      t += '<text x="' + (x + 60) + '" y="' + (y + 64) + '" text-anchor="middle" font-size="9" font-weight="900" fill="#5A4A3C" stroke="none" opacity=".8">GẠO · HTX</text>';
      for (var i = 0; i < 9; i++) t += '<circle cx="' + (x + 100 + (i * 7) % 30) + '" cy="' + (y + h - 4 + (i % 3) * 3) + '" r="1.4" fill="#D5DCE0" stroke="none"/>';
      return t;
    },
    bia_da: function (x, y, w, h) { // rêu và vết nứt trên bia đá
      return '<path d="M' + (x + 10) + ',' + (y + h - 10) + ' q10,-10 20,0 q10,-8 20,2" fill="#3F6B4A" stroke-width="1.5" opacity=".9"/>' +
        '<path d="M' + (x + w - 18) + ',' + (y + 12) + ' l-6,14 l6,8 l-4,12" fill="none" stroke="#05070A" stroke-width="1.8"/>';
    },
    thang: function (x, y, w, h) { // dây buộc chéo ở các bậc
      var t = '';
      for (var i = 0; i < 4; i++) t += '<path d="M' + (x + 14) + ',' + (y + 20 + i * 20) + ' l6,6 M' + (x + w - 14) + ',' + (y + 20 + i * 20) + ' l-6,6" stroke="#948C5E" stroke-width="2"/>';
      return t;
    }
  };
  var ALIAS = { guong_nha: 'guong', guong_96: 'guong', bia_sau: 'bia_da', thang6: 'thang', thu_me2: 'thu_me', cot_ben2: 'cot_ben' };

  function prop(sc, x, y, w, h, inner, z) {
    var px = x - 40, py = y - 70, pw = w + 80, ph = h + 110;
    sc.props.push({ x: px, y: py, w: pw, h: ph, z: z, svg: '<svg class="prop dt" viewBox="' + px + ' ' + py + ' ' + pw + ' ' + ph + '" width="' + pw + '" height="' + ph + '" overflow="visible">' +
      '<g stroke="' + INK + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g></svg>' });
  }

  Object.keys(G.LOCATIONS).forEach(function (loc) {
    var make = G.scenes[loc];
    if (!make) return;
    G.scenes[loc] = function (W, H) {
      var sc = make(W, H), S = G.S, done = {};
      if (!S) return sc;
      G.LOCATIONS[loc].things.forEach(function (t) {
        var fn = D[ALIAS[t.id] || t.id];
        if (!fn || !t.hit) return;
        if (t.cond && !t.cond(S)) return;
        var key = t.hit.join(',');
        if (done[key]) return;
        done[key] = 1;
        var h = t.hit;
        prop(sc, h[0], h[1], h[2], h[3], fn(h[0], h[1], h[2], h[3]), h[1] + h[3] + 2);
      });
      return sc;
    };
  });
})();
