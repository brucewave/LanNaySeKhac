// Đồ đạc trong nhà vẽ chi tiết (dùng chung cho nhà bây giờ và năm 1996). Mỗi hàm trả về chuỗi SVG (đặt trong ink()).
var G = window.G || (window.G = {});

(function () {
  var H = G.scenes.h, INK = H.INK, rect = H.rect, txt = H.txt;
  function R(x, y, w, h, f, ex) { return rect(Math.round(x), Math.round(y), Math.round(w), Math.round(h), f, ex); }
  function grain(x, y, w, h, n, c) { var t = ''; for (var i = 1; i <= n; i++) t += '<path d="M' + (x + 4) + ',' + (y + h * i / (n + 1)) + ' q' + (w / 3) + ',-2 ' + (w - 8) + ',1" fill="none" stroke="' + (c || '#2E2420') + '" stroke-width="1" opacity=".6"/>'; return t; }
  var F = G.furn = {};

  // Bàn thờ: khám thờ phía sau, mặt bàn, tủ chạm panô, khăn đỏ viền vàng, chân tủ
  F.altar = function (x, y, w, h, o) {
    o = o || {};
    var t = '';
    t += R(x + 12, y - 30, w - 24, 34, '#5A3F38') + R(x + 8, y - 36, w - 16, 8, '#4A3532') + '<path d="M' + (x + 8) + ',' + (y - 36) + ' q' + ((w - 16) / 2) + ',-10 ' + (w - 16) + ',0" fill="#4A3532"/>'; // khám thờ
    (o.photos === 2 ? [x + w / 2 - 28, x + w / 2 + 6] : [x + w / 2 - 14]).forEach(function (px) {
      t += R(px - 2, y - 30, 26, 32, '#B89A4A', ' stroke-width="2"') + R(px + 2, y - 26, 18, 24, '#C3CACD', ' stroke-width="1.2"') +
        '<circle cx="' + (px + 11) + '" cy="' + (y - 18) + '" r="4.5" fill="#6F7880" stroke="none"/><path d="M' + (px + 4) + ',' + (y - 3) + ' q7,-9 14,0" fill="#6F7880" stroke="none"/>';
    });
    t += R(x, y, w, 14, '#6A4A40') + grain(x, y, w, 14, 1, '#3A2622');                          // mặt bàn
    t += R(x + 4, y + 14, w - 8, h - 18, '#4A3532');                                             // thân tủ
    t += R(x + 10, y + 18, (w - 30) / 2, h - 28, '#3A2622', ' stroke-width="1.5"') + R(x + 20 + (w - 30) / 2, y + 18, (w - 30) / 2, h - 28, '#3A2622', ' stroke-width="1.5"');
    t += R(x + 14, y + 22, (w - 30) / 2 - 8, h - 36, 'none', ' stroke="#B89A4A" stroke-width="1.2"') + R(x + 24 + (w - 30) / 2, y + 22, (w - 30) / 2 - 8, h - 36, 'none', ' stroke="#B89A4A" stroke-width="1.2"');
    t += '<path d="M' + x + ',' + (y + 14) + ' h' + w + ' v8 q-' + (w / 8) + ',8 -' + (w / 4) + ',0 t-' + (w / 4) + ',0 t-' + (w / 4) + ',0 t-' + (w / 4) + ',0 z" fill="#A32E36" stroke-width="2"/>'; // khăn đỏ
    t += '<path d="M' + (x + 2) + ',' + (y + 22) + ' h' + (w - 4) + '" stroke="#C9A84A" stroke-width="1.5" stroke-dasharray="3 3"/>';
    t += R(x + 2, y + h - 4, 8, 6, '#2E2420', ' stroke-width="1.2"') + R(x + w - 10, y + h - 4, 8, 6, '#2E2420', ' stroke-width="1.2"');
    return t;
  };

  // Giường gỗ: đầu giường chạm, chiếu cói, hai gối, chăn gấp sọc ở cuối
  F.bed = function (x, y, w, h, o) {
    o = o || {};
    var t = R(x, y, w, h, '#4A4038');
    t += R(x - 4, y - 10, w + 8, 16, '#5A4A3C', ' stroke-width="2.5"') + R(x + 10, y - 6, w - 20, 6, '#3A2E26', ' stroke="none"');   // đầu giường
    t += '<path d="M' + (x + w / 2 - 14) + ',' + (y - 4) + ' q14,-8 28,0" fill="none" stroke="#B89A4A" stroke-width="1.5"/>';
    t += R(x + 8, y + 8, w - 16, h - 18, '#8F8A6A');                                             // chiếu cói
    for (var i = x + 14; i < x + w - 10; i += 8) t += '<path d="M' + i + ',' + (y + 8) + ' v' + (h - 18) + '" stroke="#6F6A50" stroke-width="1"/>';
    t += R(x + 8, y + 8, w - 16, h - 18, 'none', ' stroke="#A32E36" stroke-width="2" opacity=".6"');
    if (!o.kids) {
      t += R(x + 14, y + 14, 44, 22, '#D5DCE0', ' rx="8" stroke-width="2"') + R(x + 64, y + 14, 44, 22, '#C3CACD', ' rx="8" stroke-width="2"');
      t += R(x + 12, y + h - 40, w - 24, 26, '#3F6670', ' rx="5" stroke-width="2"');
      for (var k = x + 20; k < x + w - 14; k += 14) t += R(k, y + h - 40, 6, 26, '#D5DCE0', ' opacity=".25" stroke="none"');
    }
    t += R(x - 2, y + h - 4, 8, 8, '#2E2420', ' stroke-width="1.2"') + R(x + w - 6, y + h - 4, 8, 8, '#2E2420', ' stroke-width="1.2"');
    return t;
  };

  // Tủ gỗ hai cánh: gờ đỉnh, panô, tay nắm, chân, va li trên nóc
  F.wardrobe = function (x, y, w, h) {
    var t = R(x - 3, y - 8, w + 6, 10, '#5A3F38', ' stroke-width="2"') + R(x, y, w, h, '#4A3532');
    t += R(x + 6, y + 8, w / 2 - 9, h - 22, '#3A2622', ' stroke-width="1.5"') + R(x + w / 2 + 3, y + 8, w / 2 - 9, h - 22, '#3A2622', ' stroke-width="1.5"');
    t += grain(x + 6, y + 8, w / 2 - 9, h - 22, 3) + grain(x + w / 2 + 3, y + 8, w / 2 - 9, h - 22, 3);
    t += R(x + w / 2 - 5, y + h / 2 - 6, 3, 12, '#C8B080', ' stroke-width="1"') + R(x + w / 2 + 2, y + h / 2 - 6, 3, 12, '#C8B080', ' stroke-width="1"');
    t += R(x + 2, y + h - 12, w - 4, 10, '#5A3F38', ' stroke-width="1.5"') + R(x + 4, y + h - 2, 6, 6, '#2E2420') + R(x + w - 10, y + h - 2, 6, 6, '#2E2420');
    t += R(x + 10, y - 22, 34, 16, '#6A5846', ' rx="3" stroke-width="2"') + R(x + 22, y - 26, 10, 5, 'none', ' stroke-width="1.5"');
    return t;
  };

  // Bàn học hẹp sát tường: mặt bàn, ngăn kéo, ghế đẩu, chồng sách, ba lô
  F.desk = function (x, y, w, h) {
    var t = R(x - 26, y + 28, 22, 22, '#5A4A3C', ' rx="3" stroke-width="2"') + R(x - 24, y + 50, 4, 10, '#3A2E26') + R(x - 10, y + 50, 4, 10, '#3A2E26'); // ghế
    t += R(x, y, w, h, '#5A3F38') + grain(x, y, w, h, 4);
    t += R(x + 4, y + h - 18, w - 8, 12, '#4A3532', ' stroke-width="1.5"') + '<circle cx="' + (x + w / 2) + '" cy="' + (y + h - 12) + '" r="2" fill="#C8B080" stroke="none"/>';
    t += R(x + 6, y + 6, 26, 20, '#C3CACD', ' stroke-width="1.5"') + R(x + 8, y + 32, 22, 16, '#D5DCE0', ' stroke-width="1.5"');
    t += R(x + 22, y + 52, 14, 5, '#A32E36', ' stroke-width="1"') + R(x + 21, y + 57, 15, 5, '#3F6670', ' stroke-width="1"') + R(x + 23, y + 62, 13, 5, '#948C5E', ' stroke-width="1"');
    t += '<path d="M' + (x - 14) + ',' + (y + 70) + ' q-12,10 0,20 h10 q8,-10 0,-20 Z" fill="#3F6670"/><path d="M' + (x - 10) + ',' + (y + 74) + ' h6" stroke-width="1.5"/>';
    return t;
  };

  // Bàn trà thấp giữa nhà: khay, ấm, bốn chén, hai đôn
  F.teaTable = function (x, y, w, h, o) {
    o = o || {};
    var t = '';
    [[x - 18, y + 8], [x + w + 4, y + 8]].forEach(function (p) { t += '<ellipse cx="' + (p[0] + 7) + '" cy="' + (p[1] + 22) + '" rx="10" ry="5" fill="#4A3532" stroke-width="1.5"/>' + R(p[0], p[1] + 6, 14, 16, '#5A3F38', ' stroke-width="1.5"') + '<ellipse cx="' + (p[0] + 7) + '" cy="' + (p[1] + 6) + '" rx="10" ry="5" fill="#6A4A40" stroke-width="1.5"/>'; });
    t += R(x, y, w, h - 10, '#6A4A40') + grain(x, y, w, h - 10, 2) + R(x, y + h - 10, w, 10, '#4A3532');
    t += R(x + 4, y + h - 2, 6, 8, '#2E2420') + R(x + w - 10, y + h - 2, 6, 8, '#2E2420');
    var cx = x + w / 2;
    t += '<ellipse cx="' + cx + '" cy="' + (y + 14) + '" rx="24" ry="9" fill="#857761" stroke-width="1.5"/>';
    t += '<ellipse cx="' + cx + '" cy="' + (y + 10) + '" rx="9" ry="7" fill="' + (o.era ? '#C8B080' : '#D5DCE0') + '" stroke-width="1.5"/><path d="M' + (cx + 8) + ',' + (y + 9) + ' l7,-4" stroke-width="2"/><circle cx="' + cx + '" cy="' + (y + 4) + '" r="2" fill="#8C949B"/>';
    [-18, -10, 10, 18].forEach(function (d) { t += '<ellipse cx="' + (cx + d) + '" cy="' + (y + 17) + '" rx="3.5" ry="2.5" fill="#D5DCE0" stroke-width="1"/>'; });
    return t;
  };

  F.calendar = function (x, y, day) {
    return R(x, y, 34, 40, '#D5DCE0', ' stroke-width="1.5"') + R(x, y, 34, 11, '#A32E36', ' stroke-width="1.5"') + txt(x + 17, y + 34, 15, INK, String(day)) +
      '<path d="M' + (x + 8) + ',' + (y - 3) + ' v6 M' + (x + 26) + ',' + (y - 3) + ' v6" stroke-width="2"/>';
  };
  F.fan = function (x, y) { // quạt cây
    return '<ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="12" ry="5" fill="#2B3138" stroke-width="1.5"/>' + R(x - 2, y - 40, 4, 42, '#8C949B', ' stroke-width="1"') +
      '<circle cx="' + x + '" cy="' + (y - 50) + '" r="15" fill="#3F6670" stroke-width="2"/><circle cx="' + x + '" cy="' + (y - 50) + '" r="11" fill="none" stroke="#C3CACD" stroke-width="1"/>' +
      '<g class="fan-blade" style="transform-origin:' + x + 'px ' + (y - 50) + 'px"><path d="M' + x + ',' + (y - 50) + ' l0,-10 M' + x + ',' + (y - 50) + ' l9,6 M' + x + ',' + (y - 50) + ' l-9,6" stroke="#D5DCE0" stroke-width="3"/></g>' +
      '<circle cx="' + x + '" cy="' + (y - 50) + '" r="3" fill="#D5DCE0" stroke-width="1"/>';
  };
  F.slippers = function (x, y) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="7" ry="3.5" fill="#3F6670" stroke-width="1.2"/><ellipse cx="' + (x + 14) + '" cy="' + (y + 2) + '" rx="7" ry="3.5" fill="#3F6670" stroke-width="1.2"/>' +
      '<path d="M' + (x - 3) + ',' + (y - 1) + ' q3,-3 6,0 M' + (x + 11) + ',' + (y + 1) + ' q3,-3 6,0" fill="none" stroke="#A32E36" stroke-width="1.5"/>';
  };
  F.mat = function (x, y, w, h) { // thảm chùi chân trước giường
    var t = R(x, y, w, h, '#5A2A2A', ' rx="3"') + R(x + 4, y + 4, w - 8, h - 8, 'none', ' stroke="#B89A4A" stroke-width="1.2"');
    return t;
  };
})();
