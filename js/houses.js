// Nhà phố vẽ chi tiết: mái hai mái có nóc, mép mái đổ bóng, rêu và ngói vá; mặt tiền có gạch chân tường, vết ố,
// cửa cuốn (hộp cuốn, gỉ) hoặc cửa gỗ / cửa xếp sắt có ô thoáng gió, cửa sổ song sắt + cánh gỗ, mái hiên bạt,
// biển số nhà, bậc thềm, bàn thờ ông Địa. Năm 1996: tường vôi, cửa ván gỗ.
var G = window.G || (window.G = {});

(function () {
  var H = G.scenes.h, INK = H.INK, rect = H.rect, txt = H.txt;
  function R(x, y, w, h, f, ex) { return rect(Math.round(x), Math.round(y), Math.round(w), Math.round(h), f, ex); }
  var WALLS = ['#4B5560', '#55606B', '#5B5850', '#4E5C58', '#5A5560', '#4A5866'];
  var WALLS96 = ['#6E6650', '#625C4A', '#6A6455', '#5E6458'];
  function past() { return !!(G.S && G.S.era); }

  function roof(x, y, w, rh, o, r) {
    var t = R(x, y, w, rh, o.roof || 'url(#roof)'), ry = y + rh * 0.42;
    t += R(x, y, w, ry - y, '#E2E8EA', ' opacity=".06" stroke="none"');                       // mái hứng sáng
    t += R(x, ry, w, y + rh - ry, '#000', ' opacity=".2" stroke="none"');                     // mái khuất sáng
    t += R(x, ry - 6, w, 12, '#2B3138', ' stroke-width="2"');                                 // nóc
    for (var k = x + 9; k < x + w - 4; k += 18) t += '<circle cx="' + k + '" cy="' + ry + '" r="4" fill="#3A4450" stroke-width="1.2"/>';
    t += R(x, y, 6, rh, '#000', ' opacity=".22" stroke="none"') + R(x + w - 6, y, 6, rh, '#000', ' opacity=".3" stroke="none"');
    // rêu, ngói vá, ống thông hơi
    for (var m = 0; m < Math.floor(w / 110); m++) t += '<ellipse cx="' + Math.round(x + 20 + r() * (w - 40)) + '" cy="' + Math.round(y + 12 + r() * (rh - 30)) + '" rx="' + Math.round(10 + r() * 14) + '" ry="5" fill="#3F5A44" opacity=".45" stroke="none"/>';
    if (w > 120 && r() < 0.7) { var px = x + 20 + r() * (w - 60), py = ry + 10 + r() * Math.max(4, rh * 0.4); t += R(px, py, 22, 14, past() ? '#6A5846' : '#5E6B78', ' stroke-width="1.5"'); }
    if (!past() && w > 160 && r() < 0.5) { var vx = x + w * 0.2; t += R(vx, ry - 30, 8, 22, '#8C949B', ' stroke-width="1.5"') + R(vx - 3, ry - 34, 14, 6, '#4B5560', ' stroke-width="1.2"'); }
    // mép mái chìa ra + máng nước
    t += R(x - 4, y + rh - 10, w + 8, 10, '#2B3138', ' stroke-width="2"');
    t += '<path d="M' + (x - 4) + ',' + (y + rh - 2) + ' H' + (x + w + 4) + '" stroke="#5E6B78" stroke-width="2"/>';
    return t;
  }

  // sân thượng nhà ống: sàn bê tông kẻ ô, lan can, tum cầu thang, chậu cây, ghế nhựa
  function terrace(x, y, w, th, r) {
    var t = R(x, y, w, th, '#5E6670');
    for (var gx = x + 24; gx < x + w; gx += 24) t += '<path d="M' + gx + ',' + y + ' v' + th + '" stroke="#4B5560" stroke-width="1"/>';
    for (var gy = y + 24; gy < y + th; gy += 24) t += '<path d="M' + x + ',' + gy + ' h' + w + '" stroke="#4B5560" stroke-width="1"/>';
    t += R(x, y, w, 8, '#7A848E', ' stroke-width="2"') + R(x, y, 8, th, '#6F7880', ' stroke-width="2"') + R(x + w - 8, y, 8, th, '#5E6670', ' stroke-width="2"');
    t += R(x, y + th - 8, w, 8, '#7A848E', ' stroke-width="2"');                                  // lan can phía đường
    var left = r() < 0.5, tx = left ? x + 12 : x + w - 74;
    t += R(tx, y + 10, 62, 44, '#55606B', ' stroke-width="2"') + R(tx - 4, y + 6, 70, 10, '#3A4450', ' stroke-width="2"') + R(tx + 20, y + 26, 20, 28, '#3F4E5A', ' stroke-width="1.5"'); // tum thang
    t += R(tx + 2, y + 54, 58, 6, '#000', ' opacity=".2" stroke="none"');
    for (var p = 0; p < Math.floor(w / 70); p++) { var px = x + 20 + p * 60 + r() * 20; if (Math.abs(px - tx - 31) < 46) continue; t += R(px, y + th - 24, 14, 12, '#857761', ' stroke-width="1.5"') + '<ellipse cx="' + (px + 7) + '" cy="' + (y + th - 27) + '" rx="11" ry="7" fill="' + (r() < 0.5 ? '#58755C' : '#3F6B4A') + '" stroke-width="1.5"/>'; }
    if (r() < 0.6) { var cx = left ? x + w - 50 : x + 90; t += R(cx, y + 30, 18, 14, ['#A32E36', '#3F6670', '#58755C'][Math.floor(r() * 3)], ' rx="3" stroke-width="1.5"') + R(cx + 2, y + 22, 14, 8, '#000', ' opacity=".2" stroke="none"'); }
    return t;
  }

  function breeze(x, y, w) { // ô thoáng gió (gạch hoa)
    var t = R(x, y, w, 12, '#6F7880', ' stroke-width="1.5"');
    for (var k = x + 2; k < x + w - 8; k += 11) t += '<path d="M' + (k + 5) + ',' + (y + 2) + ' l4,4 l-4,4 l-4,-4 z" fill="#2B3138" stroke-width="1"/>';
    return t;
  }
  function window1(x, y, ww, hh, r) { // cửa sổ: song sắt, cánh gỗ, bậu
    var t = R(x - 3, y - 3, ww + 6, hh + 6, '#2B3138', ' stroke-width="2"') + R(x, y, ww, hh, '#141A22', ' stroke-width="1.5"');
    t += R(x + 2, y + 2, ww * 0.45, hh - 4, '#2C3A48', ' opacity=".7" stroke="none"');      // rèm / phản chiếu
    for (var k = x + 6; k < x + ww; k += 7) t += '<path d="M' + k + ',' + y + ' V' + (y + hh) + '" stroke="#6F7880" stroke-width="1.6"/>';
    t += '<path d="M' + x + ',' + (y + 8) + ' Q' + (x + ww / 2) + ',' + (y - 2) + ' ' + (x + ww) + ',' + (y + 8) + '" fill="none" stroke="#6F7880" stroke-width="1.6"/>';
    if (r() < 0.6) t += R(x - 12, y - 2, 10, hh + 4, past() ? '#6A5846' : '#3F6670', ' stroke-width="1.5"') + R(x + ww + 2, y - 2, 10, hh + 4, past() ? '#6A5846' : '#3F6670', ' stroke-width="1.5"');
    t += R(x - 5, y + hh + 2, ww + 10, 4, '#6F7880', ' stroke-width="1.2"');
    return t;
  }
  function door(x, y, dw, dh, r, kind) {
    var t = '';
    if (kind === 'gate') { // cửa xếp sắt
      t += R(x, y, dw, dh, '#141A22', ' stroke-width="2"');
      for (var k = x + 3; k < x + dw; k += 6) t += '<path d="M' + k + ',' + y + ' V' + (y + dh) + '" stroke="#6F7880" stroke-width="1.5"/>';
      for (var j = x; j < x + dw - 6; j += 12) t += '<path d="M' + j + ',' + (y + 6) + ' l12,10 M' + (j + 12) + ',' + (y + 6) + ' l-12,10" stroke="#6F7880" stroke-width="1"/>';
    } else { // cửa gỗ hai cánh, có ô panô
      var c = kind === 'plank' ? '#5A4A3C' : (r() < 0.5 ? '#4A3532' : '#3F4E5A');
      t += R(x, y, dw / 2, dh, c, ' stroke-width="2"') + R(x + dw / 2, y, dw / 2, dh, c, ' stroke-width="2"');
      if (kind === 'plank') for (var p = x + 6; p < x + dw; p += 7) t += '<path d="M' + p + ',' + y + ' V' + (y + dh) + '" stroke="#3A2E26" stroke-width="1.2"/>';
      else [x + 4, x + dw / 2 + 4].forEach(function (px) { t += R(px, y + 5, dw / 2 - 8, dh / 2 - 8, '#000', ' opacity=".18" stroke-width="1.2"') + R(px, y + dh / 2, dw / 2 - 8, dh / 2 - 6, '#000', ' opacity=".18" stroke-width="1.2"'); });
      t += '<circle cx="' + (x + dw / 2 - 4) + '" cy="' + (y + dh / 2) + '" r="2" fill="#C8B080" stroke="none"/><circle cx="' + (x + dw / 2 + 4) + '" cy="' + (y + dh / 2) + '" r="2" fill="#C8B080" stroke="none"/>';
    }
    return t;
  }
  function shutter(x, y, sw, sh, r) {
    var t = R(x - 4, y - 10, sw + 8, 12, '#3A4450', ' stroke-width="2"');                      // hộp cuốn
    t += R(x, y, sw, sh, 'url(#shutter)', ' stroke-width="2"');
    t += R(x - 4, y, 4, sh, '#2B3138', ' stroke="none"') + R(x + sw, y, 4, sh, '#2B3138', ' stroke="none"');
    t += R(x, y + sh - 6, sw, 6, '#3A4450', ' stroke-width="1.5"');
    t += R(x + sw / 2 - 10, y + sh - 12, 20, 4, '#8C949B', ' stroke-width="1"');                // tay nắm
    for (var k = 0; k < 3; k++) { var rx = x + 10 + r() * (sw - 20); t += '<path d="M' + Math.round(rx) + ',' + (y + 4) + ' v' + Math.round(10 + r() * 20) + '" stroke="#7A5A44" stroke-width="2" opacity=".5"/>'; } // vệt gỉ
    return t;
  }


  // Tầng hai nhìn từ trên xuống: dải tường tầng trên ngay trên mép mái, cửa chớp, ban công lan can, chậu cây
  function upper(x, y, w, r, o) {
    var hh = 40, t = R(x, y, w, hh, o.upWall || '#55606B');
    t += R(x, y, w, 6, '#000', ' opacity=".25" stroke="none"');
    var n = Math.max(1, Math.floor(w / 90));
    for (var i = 0; i < n; i++) {
      var dx = x + (w / n) * (i + 0.5) - 14;
      if (o.style === 'abandoned') t += R(dx, y + 8, 28, 26, '#141A22', ' stroke-width="1.5"') + '<path d="M' + dx + ',' + (y + 8) + ' l28,26 M' + (dx + 28) + ',' + (y + 8) + ' l-28,26" stroke="#6A5846" stroke-width="4"/>';
      else {
        t += R(dx, y + 8, 28, 26, '#3F6670', ' stroke-width="1.5"');
        for (var s = y + 12; s < y + 32; s += 4) t += '<path d="M' + (dx + 2) + ',' + s + ' h24" stroke="#2C4850" stroke-width="1"/>';
        t += '<path d="M' + (dx + 14) + ',' + (y + 8) + ' v26" stroke="#2C4850" stroke-width="1.5"/>';
      }
    }
    // ban công: sàn đua ra + lan can song sắt
    t += R(x + 6, y + hh - 6, w - 12, 8, '#7A848E', ' stroke-width="1.5"');
    t += '<path d="M' + (x + 8) + ',' + (y + hh - 18) + ' H' + (x + w - 8) + '" stroke="#2B3138" stroke-width="2.5"/>';
    for (var k = x + 12; k < x + w - 8; k += 8) t += '<path d="M' + k + ',' + (y + hh - 18) + ' v12" stroke="#2B3138" stroke-width="1.5"/>';
    if (o.style !== 'abandoned') for (var p = x + 30; p < x + w - 20; p += 70 + r() * 30) t += R(p, y + hh - 16, 10, 9, '#857761', ' stroke-width="1"') + '<ellipse cx="' + (p + 5) + '" cy="' + (y + hh - 18) + '" rx="8" ry="5" fill="#58755C" stroke-width="1.2"/>';
    else t += '<path d="M' + (x + w * 0.3) + ',' + (y + hh - 18) + ' v10" stroke="#2B3138" stroke-width="3" transform="rotate(25 ' + (x + w * 0.3) + ' ' + (y + hh - 18) + ')"/>';
    t += R(x, y + hh + 2, w, 6, '#000', ' opacity=".3" stroke="none"');
    return t;
  }

  // mái tôn: gân dọc + vệt gỉ
  function tin(x, y, w, rh, r) {
    var t = R(x, y, w, rh, '#6F7880');
    for (var k = x + 6; k < x + w; k += 12) t += '<path d="M' + k + ',' + y + ' v' + rh + '" stroke="#4B5560" stroke-width="2"/>';
    for (var i = 0; i < Math.floor(w / 50); i++) { var rx = x + r() * (w - 20); t += R(rx, y + r() * rh * 0.6, 12 + r() * 16, 20 + r() * 30, '#7A5A44', ' opacity=".45" stroke="none"'); }
    t += '<path d="M' + x + ',' + (y + rh * 0.5) + ' H' + (x + w) + '" stroke="#3A4450" stroke-width="3"/>';
    return t;
  }

  // nhà bỏ hoang: cỏ dại, mạng nhện, ván đóng chéo, cửa cuốn kéo nửa, hộp thư nhét đầy, giấy cho thuê
  function abandonedFront(x, fy, w, fh, r) {
    var t = '', sx = x + 16, sw = w - 32, sh = fh - 30, open = Math.round(sh * 0.45);
    t += R(sx - 4, fy + 6, sw + 8, 12, '#3A4450', ' stroke-width="2"');
    t += R(sx, fy + 18, sw, sh, '#07090C', ' stroke-width="2"');                                   // bên trong tối om
    t += R(sx + 20, fy + 18 + sh - 10, 24, 8, '#4A4038', ' stroke="none"') + '<path d="M' + (sx + 60) + ',' + (fy + 16 + sh) + ' l14,-8 l8,8" fill="#3A3430" stroke="none"/>';
    t += R(sx, fy + 18, sw, sh - open, 'url(#shutter)', ' stroke-width="2"') + R(sx, fy + 18 + sh - open - 5, sw, 5, '#3A4450', ' stroke-width="1.5"');
    for (var k = 0; k < 6; k++) { var rx = sx + 6 + r() * (sw - 12); t += '<path d="M' + Math.round(rx) + ',' + (fy + 20) + ' v' + Math.round(8 + r() * 24) + '" stroke="#7A5A44" stroke-width="2.5" opacity=".6"/>'; }
    t += '<path d="M' + x + ',' + fy + ' q14,4 18,18 M' + x + ',' + (fy + 8) + ' q8,0 12,10 M' + (x + 4) + ',' + fy + ' l10,14" fill="none" stroke="#C3CACD" stroke-width=".8" opacity=".7"/>'; // mạng nhện
    t += '<path d="M' + (x + w) + ',' + fy + ' q-14,4 -18,18 M' + (x + w - 4) + ',' + fy + ' l-10,14" fill="none" stroke="#C3CACD" stroke-width=".8" opacity=".7"/>';
    for (var g = x + 4; g < x + w; g += 14 + r() * 18) t += '<path d="M' + Math.round(g) + ',' + (fy + fh) + ' l-3,-10 M' + Math.round(g + 3) + ',' + (fy + fh) + ' l2,-13 M' + Math.round(g + 6) + ',' + (fy + fh) + ' l5,-8" stroke="#4E6B44" stroke-width="2"/>'; // cỏ dại
    t += R(x + w - 30, fy + 34, 16, 14, '#6A5846', ' stroke-width="1.5"') + R(x + w - 28, fy + 30, 12, 6, '#D5DCE0', ' stroke-width="1"') + R(x + w - 26, fy + 28, 9, 5, '#E2C46A', ' stroke-width="1"'); // hộp thư nhét đầy
    t += R(x + 22, fy + 26, 30, 20, '#D5DCE0', ' stroke-width="1" transform="rotate(-6 ' + (x + 37) + ' ' + (fy + 36) + ')"') + txt(x + 37, fy + 35, 6, '#A32E36', 'CHO THUÊ') + txt(x + 37, fy + 42, 5, '#2B3138', 'LH 0905…');
    return t;
  }

  // xưởng mộc mở cửa: thấy bàn mộc, cưa, bảng treo dụng cụ, mùn cưa, ghế đóng dở, bóng đèn
  function workshopFront(x, fy, w, fh, r) {
    var t = '', sx = x + 16, sw = w - 32, sh = fh - 26;
    t += R(sx - 4, fy + 6, sw + 8, 14, '#3A4450', ' stroke-width="2"') + R(sx, fy + 20, sw, 3, 'url(#shutter)', ' stroke="none"');
    t += R(sx, fy + 20, sw, sh, '#2B2622', ' stroke-width="2"');
    t += R(sx + 6, fy + 24, sw - 12, 16, '#3A3028', ' stroke="none"');                             // tường sau
    t += R(sx + 14, fy + 25, 60, 14, '#5A4A3C', ' stroke-width="1.2"');                          // bảng treo dụng cụ
    t += '<path d="M' + (sx + 20) + ',' + (fy + 28) + ' l14,0 l-2,6 l-12,0 z" fill="#C3CACD" stroke-width="1"/><path d="M' + (sx + 44) + ',' + (fy + 27) + ' v10 M' + (sx + 40) + ',' + (fy + 28) + ' h8" stroke="#C3CACD" stroke-width="2"/><path d="M' + (sx + 56) + ',' + (fy + 27) + ' l8,10" stroke="#B89A4A" stroke-width="2"/>';
    var bx = sx + 90;
    t += R(bx, fy + 36, 110, 12, '#857761', ' stroke-width="1.5"') + R(bx + 4, fy + 48, 4, 10, '#4A3532', ' stroke="none"') + R(bx + 102, fy + 48, 4, 10, '#4A3532', ' stroke="none"'); // bàn mộc
    t += R(bx + 20, fy + 32, 60, 5, '#B9A27A', ' stroke-width="1"') + '<path d="M' + (bx + 84) + ',' + (fy + 34) + ' l18,-6 l2,4 l-18,6 z" fill="#C3CACD" stroke-width="1"/>';
    t += '<path d="M' + (sx + sw - 50) + ',' + (fy + 56) + ' v-14 h16 v14 M' + (sx + sw - 50) + ',' + (fy + 48) + ' h16 M' + (sx + sw - 50) + ',' + (fy + 42) + ' v-10" fill="none" stroke="#857761" stroke-width="2.5"/>'; // ghế đóng dở
    t += '<ellipse cx="' + (bx + 40) + '" cy="' + (fy + 60) + '" rx="22" ry="4" fill="#B9A27A" opacity=".7" stroke="none"/><ellipse cx="' + (sx + 30) + '" cy="' + (fy + 61) + '" rx="14" ry="3" fill="#B9A27A" opacity=".6" stroke="none"/>';
    t += '<path d="M' + (x + w / 2) + ',' + (fy + 20) + ' v6" stroke-width="1"/><circle cx="' + (x + w / 2) + '" cy="' + (fy + 29) + '" r="3.5" fill="#E2D9A8" stroke-width="1"/>';
    return t;
  }

  G.drawHouse = function (x, y, w, h, o) {
    var r = G.scenes.rng(Math.round(x * 13 + y * 7 + w)), old = past();
    var fh = 72, fy = y + h - fh, rh = h - fh, t = '';
    if (rh > 6) t += o.roofKind === 'tin' ? tin(x, y, w, rh, r) + R(x - 4, y + rh - 10, w + 8, 10, '#2B3138', ' stroke-width="2"') : roof(x, y, w, rh, o, r);
    if (!old && rh >= 150 && w >= 120 && o.roofKind !== 'tin' && (o.style === 'abandoned' || r() < 0.9)) { // nửa trước là sân thượng
      var th = Math.round(rh * 0.5); t += terrace(x, y + rh - th, w, th, r);
      if (o.style === 'abandoned') for (var wd = 0; wd < 9; wd++) { var wx = x + 14 + r() * (w - 28), wy = y + rh - th + 14 + r() * (th - 30); t += '<path d="M' + Math.round(wx) + ',' + Math.round(wy) + ' l-4,-9 M' + Math.round(wx + 3) + ',' + Math.round(wy) + ' l1,-12 M' + Math.round(wx + 6) + ',' + Math.round(wy) + ' l5,-8" stroke="#4E6B44" stroke-width="2"/>'; }
    }
    if (!old && rh >= 150 && w >= 120) { t += upper(x, y + rh - 52, w, r, o); t += R(x - 3, y + rh - 6, w + 6, 6, '#7A848E', ' stroke-width="1.5"'); } // tầng hai + sàn đua
    var wall = o.wall || (old ? WALLS96 : WALLS)[Math.floor(r() * (old ? WALLS96 : WALLS).length)];
    t += R(x, fy, w, fh, wall);
    // vết ố, vữa bong, vết nứt
    for (var s = 0; s < Math.max(1, Math.floor(w / 90)); s++) t += '<path d="M' + Math.round(x + 8 + r() * (w - 30)) + ',' + (fy + 10) + ' q6,' + Math.round(20 + r() * 20) + ' -2,' + Math.round(40 + r() * 10) + '" fill="none" stroke="#000" stroke-width="' + Math.round(4 + r() * 6) + '" opacity=".1"/>';
    if (w > 100 && r() < 0.6) t += R(x + 10 + r() * (w - 60), fy + 14 + r() * 20, 22, 12, old ? '#857761' : '#6F7880', ' opacity=".5" stroke-width="1"');
    t += R(x, fy, w, 10, INK, ' opacity=".45" stroke="none"');                                   // bóng mái
    t += R(x, y + h - 14, w, 14, '#2B3138', ' stroke-width="1.5"');                              // gạch chân tường
    for (var g = x + 14; g < x + w; g += 16) t += '<path d="M' + g + ',' + (y + h - 14) + ' v14" stroke="#1A2029" stroke-width="1"/>';
    t += R(x + w - 8, fy, 8, fh, INK, ' opacity=".28" stroke="none"');                           // cạnh nhà khuất sáng
    if (w < 70) return t;                                                                        // nhà bị cắt ở mép cảnh: chỉ cần mái + tường
    var useShutter = o.shutter && !old;
    if (o.style === 'abandoned' && !old) t += abandonedFront(x, fy, w, fh, r);
    else if (o.style === 'workshop' && !old) t += workshopFront(x, fy, w, fh, r);
    else if (useShutter) t += shutter(x + 16, fy + 16, w - 32, fh - 30, r);
    else {
      var dw = Math.min(60, w * 0.3), dx = x + w / 2 - dw / 2, kind = old || o.shutter ? 'plank' : (r() < 0.45 ? 'gate' : 'wood');
      t += breeze(dx - 4, fy + 12, dw + 8);
      t += door(dx, fy + 26, dw, fh - 40, r, kind);
      t += R(dx - 6, y + h - 16, dw + 12, 5, '#6F7880', ' stroke-width="1.2"');                   // bậc thềm
      for (var i = x + 22; i < x + w - 50; i += 92) if (Math.abs(i + 18 - (x + w / 2)) > dw / 2 + 30) t += window1(i, fy + 20, 36, 26, r);
      if (!o.sign && !old && w > 150 && r() < 0.55) { // mái hiên bạt sọc
        var aw = w - 30, ax = x + 15, ac = ['#3F6670', '#A32E36', '#58755C'][Math.floor(r() * 3)];
        t += R(ax, fy + 2, aw, 12, ac, ' stroke-width="2"');
        for (var a = ax; a < ax + aw; a += 20) t += R(a, fy + 2, 10, 12, '#D5DCE0', ' opacity=".25" stroke="none"');
        t += '<path d="M' + ax + ',' + (fy + 14) + ' q' + (aw / 16) + ',7 ' + (aw / 8) + ',0 t' + (aw / 8) + ',0 t' + (aw / 8) + ',0 t' + (aw / 8) + ',0 t' + (aw / 8) + ',0 t' + (aw / 8) + ',0 t' + (aw / 8) + ',0 t' + (aw / 8) + ',0" fill="' + ac + '" stroke-width="1.5"/>';
        t += R(ax, fy + 22, aw, 8, '#000', ' opacity=".2" stroke="none"');
      }
    }
    // biển số nhà
    if (!old) t += R(x + w - 34, fy + 16, 18, 12, '#3F6670', ' rx="2" stroke-width="1.2"') + txt(x + w - 25, fy + 26, 9, '#D5DCE0', String(3 + Math.floor(r() * 40)));
    // bàn thờ ông Địa trước cửa hàng
    if (o.sign && !old) t += R(x + 20, y + h - 30, 16, 14, '#A32E36', ' stroke-width="1.5"') + '<path d="M' + (x + 26) + ',' + (y + h - 30) + ' v-8 M' + (x + 30) + ',' + (y + h - 30) + ' v-9" stroke="#C9873A" stroke-width="1.2"/>';
    // biển hiệu có khung, đinh vít, bóng đổ
    if (o.sign) {
      var sw = Math.min(w - 40, o.sign.length * 15 + 40), sx = x + (w - sw) / 2;
      t += R(sx + 3, fy - 1, sw, 30, '#000', ' opacity=".35" stroke="none"');
      t += R(sx, fy - 4, sw, 30, o.signBg || '#A32E36', ' stroke-width="2.5"') + R(sx + 4, fy, sw - 8, 22, 'none', ' stroke="#000" stroke-opacity=".25" stroke-width="1.5"');
      t += '<circle cx="' + (sx + 6) + '" cy="' + (fy + 1) + '" r="1.8" fill="#8C949B" stroke="none"/><circle cx="' + (sx + sw - 6) + '" cy="' + (fy + 1) + '" r="1.8" fill="#8C949B" stroke="none"/>';
      t += txt(x + w / 2, fy + 17, 16, o.signFg || '#D5DCE0', o.sign);
    }
    return t;
  };

  // Phòng không mái (nhìn vào trong): tường bắc có cửa sổ + vết ố, nẹp chân tường, bóng tối dọc chân tường, ngạch cửa, cột góc
  G.drawRoomExtra = function (x, y, w, h, doors) {
    var r = G.scenes.rng(Math.round(x * 3 + y * 11 + w)), t = '';
    for (var s = 0; s < Math.floor(w / 120); s++) t += '<path d="M' + Math.round(x + 30 + r() * (w - 60)) + ',' + (y + 12) + ' q4,14 -1,28" fill="none" stroke="#000" stroke-width="' + Math.round(5 + r() * 5) + '" opacity=".1"/>';
    // cửa sổ trên tường bắc (chừa chỗ, đồ đạc vẽ sau sẽ đè lên nếu trùng)
    for (var wx = x + 60; wx < x + w - 90; wx += 230) {
      var ww = 46;
      t += R(wx - 3, y + 11, ww + 6, 30, '#2B3138', ' stroke-width="2"') + R(wx, y + 14, ww, 24, '#2C3A48', ' stroke-width="1.5"');
      t += R(wx + 2, y + 16, ww / 2 - 3, 20, '#4B6E7A', ' opacity=".5" stroke="none"');
      for (var k = wx + 7; k < wx + ww; k += 8) t += '<path d="M' + k + ',' + (y + 14) + ' v24" stroke="#6F7880" stroke-width="1.4"/>';
      t += '<path d="M' + (wx + ww / 2) + ',' + (y + 14) + ' v24" stroke="#2B3138" stroke-width="2"/>';
    }
    t += R(x + 14, y + 44, w - 28, 5, '#2B3138', ' opacity=".8" stroke="none"');                // nẹp chân tường bắc
    t += R(x + 14, y + 49, w - 28, 12, '#000', ' opacity=".14" stroke="none"');
    t += R(x + 14, y + 44, 10, h - 58, '#000', ' opacity=".14" stroke="none"') + R(x + w - 24, y + 44, 10, h - 58, '#000', ' opacity=".18" stroke="none"');
    [[x, y], [x + w - 14, y], [x, y + h - 14], [x + w - 14, y + h - 14]].forEach(function (c) { t += R(c[0], c[1], 14, 14, '#3A4450', ' stroke-width="2"'); }); // cột góc
    doors.forEach(function (d) { t += R(d[0], y + h - 10, d[1] - d[0], 8, '#6A5846', ' stroke-width="1.5"'); });              // ngạch cửa gỗ
    for (var tx = x + 20; tx < x + w - 10; tx += 22) t += '<path d="M' + tx + ',' + (y + 2) + ' v6" stroke="#1A2029" stroke-width="1"/>'; // gờ đỉnh tường
    return t;
  };

  // Dãy nhà phía nam đường: thấy mái + đỉnh tường sau, mỗi nóc một kiểu
  G.drawSouthRoofs = function (W, Hh, r) {
    var t = '';
    for (var x = -10; x < W;) {
      var w = 160 + Math.floor(r() * 140), roofP = r() < 0.5 ? 'url(#roof)' : 'url(#roofG)', rh = Hh - 742;
      t += R(x, 730, w, 14, '#2B3138');
      t += R(x, 742, w, rh, roofP);
      var ry = 742 + Math.min(rh * 0.5, 40);
      t += R(x, 742, w, ry - 742, '#000', ' opacity=".22" stroke="none"') + R(x, ry, w, rh, '#E2E8EA', ' opacity=".05" stroke="none"');
      t += R(x, ry - 5, w, 10, '#2B3138', ' stroke-width="2"');
      for (var k = x + 9; k < x + w - 4; k += 18) t += '<circle cx="' + k + '" cy="' + ry + '" r="3.5" fill="#3A4450" stroke-width="1.2"/>';
      t += R(x + w - 6, 742, 6, rh, '#000', ' opacity=".3" stroke="none"');
      if (r() < 0.5) t += '<ellipse cx="' + Math.round(x + w * 0.3 + r() * w * 0.4) + '" cy="' + Math.round(ry + 16) + '" rx="16" ry="5" fill="#3F5A44" opacity=".4" stroke="none"/>';
      x += w + 4;
    }
    return t;
  };
})();
