// Cảnh nhìn chéo từ trên xuống (top-down 3/4), cùng bảng màu lạnh và nét mực của mẫu v3. Nền vẽ bản đầu, có thể thay sau.
// Mỗi cảnh trả về: svg (nền đất, sàn, tường), props (vật đứng, sắp lớp theo y), fg (dây điện phủ trên cùng), solids (vùng va chạm).
// Dải chung: khối nhà phía bắc 0–430, vỉa hè 430–540, đường 540–660, vỉa hè nam 660–730, phía nam 730–H. Mỗi cảnh rộng đúng một màn hình (960).
var G = window.G || (window.G = {});
G.scenes = {};

(function () {
  var INK = '#0F141B';
  var CAP = '#2B3138', FACE = '#4B5560';

  function rng(seed) { return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; }
  function rect(x, y, w, h, fill, extra) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"' + (extra || '') + '/>';
  }
  function txt(x, y, size, fill, t) {
    return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + size + '" font-weight="800" fill="' + fill +
      '" stroke="none" font-family="Segoe UI, Arial, sans-serif">' + t + '</text>';
  }
  function ink(inner) {
    return '<g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#w)">' + inner + '</g>';
  }

  function Builder(W, H) {
    this.W = W; this.H = H;
    this.bg = ''; this.glow = ''; this.fgs = ''; this.props = []; this.solids = [];
  }
  Builder.prototype.solid = function (x, y, w, h) { this.solids.push([x, y, w, h]); };
  // vật đứng: vẽ bằng tọa độ thế giới, sắp lớp theo z (mặc định đáy vật)
  Builder.prototype.prop = function (x, y, w, h, inner, z) {
    this.props.push({ x: x, y: y, w: w, h: h, z: z === undefined ? y + h : z,
      svg: '<svg class="prop" viewBox="' + x + ' ' + y + ' ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" overflow="visible">' + ink(inner) + '</svg>' });
  };

  Builder.prototype.streets = function (southSidewalk) {
    var W = this.W, b = '';
    b += rect(0, 0, W, this.H, '#1B222C');
    b += rect(0, 430, W, 110, 'url(#pave)');
    b += rect(0, 540, W, 120, '#1A2028');
    for (var x = 20; x < W; x += 110) b += rect(x, 597, 56, 6, '#8C949B', ' opacity=".45"');
    b += rect(0, 532, W, 10, '#3A4552');
    if (southSidewalk) { b += rect(0, 660, W, 70, 'url(#pave)'); b += rect(0, 660, W, 8, '#3A4552'); }
    this.bg += b;
    this.solid(-50, 0, 50, this.H); this.solid(W, 0, 50, this.H); // biên trái phải chỉ chặn khi không có lối ra (world xử lý lối ra trước)
  };

  // Phòng bỏ mái: thấy sàn và tường. doors: các khoảng hở trên tường nam [x0, x1]
  Builder.prototype.room = function (x, y, w, h, floor, doors) {
    var b = '';
    b += rect(x, y, w, h, floor);
    b += rect(x + 14, y + 44, w - 28, 16, INK, ' opacity=".3"');
    b += rect(x, y, w, 44, FACE) + rect(x, y, w, 10, CAP);
    b += rect(x, y, 14, h, CAP) + rect(x + w - 14, y, 14, h, CAP);
    var cur = x;
    (doors || []).concat([[x + w, x + w]]).forEach(function (d) {
      if (d[0] > cur) { b += rect(cur, y + h - 14, d[0] - cur, 14, CAP); this.solid(cur, y + h - 14, d[0] - cur, 14); }
      cur = d[1];
    }, this);
    this.bg += ink(b);
    if (G.drawRoomExtra) this.bg += ink(G.drawRoomExtra(x, y, w, h, doors || [])); // houses.js: cửa sổ, nẹp tường, bóng chân tường
    this.solid(x, y, w, 52); this.solid(x, y, 14, h); this.solid(x + w - 14, y, 14, h);
  };

  // Nhà đóng: mái nhìn từ trên + mặt tiền phía đường
  Builder.prototype.closed = function (x, y, w, h, o) {
    o = o || {};
    var b = '', fh = 72, fy = y + h - fh;
    if (G.drawHouse) { this.bg += ink(G.drawHouse(x, y, w, h, o)); this.solid(x, y, w, h); return; } // houses.js vẽ chi tiết
    b += rect(x, y, w, h - fh, o.roof || 'url(#roof)');
    b += '<path d="M' + x + ',' + (y + (h - fh) / 2) + ' H' + (x + w) + '" stroke-width="2" opacity=".6"/>';
    b += rect(x, fy, w, fh, o.wall || '#3A4552');
    b += rect(x, fy, w, 8, INK, ' opacity=".35"');
    if (o.shutter) b += rect(x + 16, fy + 14, w - 32, fh - 14, 'url(#shutter)');
    else {
      b += rect(x + w / 2 - 26, fy + 14, 52, fh - 14, '#2E2925');
      for (var i = x + 24; i < x + w - 60; i += 90) if (Math.abs(i + 20 - (x + w / 2)) > 50) b += rect(i, fy + 18, 40, 30, '#141A22');
    }
    if (o.sign) {
      var sw = Math.min(w - 40, o.sign.length * 15 + 40);
      b += rect(x + (w - sw) / 2, fy - 4, sw, 30, o.signBg || '#A32E36');
      b += txt(x + w / 2, fy + 17, 16, o.signFg || '#D5DCE0', o.sign);
    }
    this.bg += ink(b);
    this.solid(x, y, w, h);
  };

  // Dãy mái nhà phía nam (nhìn thấy mái và lưng tường)
  Builder.prototype.southRoofs = function (r) {
    if (G.drawSouthRoofs) { this.bg += ink(G.drawSouthRoofs(this.W, this.H, r)); this.solid(0, 730, this.W, this.H - 730); return; }
    var b = '';
    for (var x = -10; x < this.W; ) {
      var w = 160 + Math.floor(r() * 140);
      b += rect(x, 742, w, this.H - 742, r() < .5 ? 'url(#roof)' : 'url(#roofG)');
      b += rect(x, 730, w, 14, CAP);
      x += w + 4;
    }
    this.bg += ink(b);
    this.solid(0, 730, this.W, this.H - 730);
  };

  Builder.prototype.pole = function (x) {
    var y = 536;
    this.prop(x - 40, y - 150, 80, 160,
      rect(x - 5, y - 130, 10, 130, '#4B5560') +
      '<path d="M' + (x - 30) + ',' + (y - 118) + ' h60M' + (x - 24) + ',' + (y - 104) + ' h48" stroke-width="5"/>' +
      '<path d="M' + (x - 26) + ',' + (y - 112) + ' q10,18 26,4 q16,-12 26,6 q-14,16 -30,2 q-14,-10 -22,-12" fill="none" stroke-width="2"/>' +
      '<path d="M' + (x - 30) + ',' + (y - 96) + ' q20,14 60,-4" fill="none" stroke-width="2"/>', y + 4);
    this.solid(x - 7, y - 8, 14, 12);
    return x;
  };
  Builder.prototype.wires = function (xs) {
    var f = '';
    for (var i = 0; i < xs.length - 1; i++) {
      var a = xs[i], c = xs[i + 1], m = (a + c) / 2;
      f += '<path d="M' + a + ',418 Q' + m + ',452 ' + c + ',418M' + a + ',432 Q' + m + ',470 ' + c + ',432M' + (a - 20) + ',420 Q' + m + ',466 ' + (c + 20) + ',434" fill="none" stroke-width="1.6"/>';
    }
    this.fgs += f;
  };
  Builder.prototype.lamp = function (x, y) {
    y = y || 534;
    this.glow += '<ellipse class="glow" cx="' + (x + 22) + '" cy="' + (y + 10) + '" rx="120" ry="60" fill="url(#lamp)"/>';
    this.prop(x - 10, y - 170, 60, 180,
      '<path d="M' + x + ',' + y + ' V' + (y - 140) + ' Q' + x + ',' + (y - 160) + ' ' + (x + 26) + ',' + (y - 160) + '" fill="none" stroke-width="7"/>' +
      '<path d="M' + x + ',' + y + ' V' + (y - 140) + ' Q' + x + ',' + (y - 160) + ' ' + (x + 26) + ',' + (y - 160) + '" fill="none" stroke="#4B5560" stroke-width="3"/>' +
      '<path d="M' + (x + 16) + ',' + (y - 160) + ' h24 l-4,9 h-16 Z" fill="#C3CACD"/>', y + 2);
    this.solid(x - 6, y - 8, 12, 12);
  };
  Builder.prototype.tree = function (x, y) {
    this.bg += '<ellipse cx="' + x + '" cy="' + (y + 2) + '" rx="70" ry="22" fill="' + INK + '" opacity=".35"/>';
    this.prop(x - 80, y - 190, 160, 196,
      '<path d="M' + x + ',' + y + ' Q' + (x - 6) + ',' + (y - 50) + ' ' + x + ',' + (y - 90) + '" fill="none" stroke-width="20"/>' +
      '<path d="M' + x + ',' + y + ' Q' + (x - 6) + ',' + (y - 50) + ' ' + x + ',' + (y - 90) + '" fill="none" stroke="#4A4038" stroke-width="13"/>' +
      '<ellipse cx="' + x + '" cy="' + (y - 120) + '" rx="74" ry="52" fill="#2C3A33"/>' +
      '<ellipse cx="' + (x - 34) + '" cy="' + (y - 96) + '" rx="40" ry="26" fill="#2C3A33"/>' +
      '<path class="s" d="M' + (x + 30) + ',' + (y - 168) + ' Q' + (x + 84) + ',' + (y - 130) + ' ' + (x + 60) + ',' + (y - 88) + ' Q' + (x + 40) + ',' + (y - 76) + ' ' + (x + 20) + ',' + (y - 80) + ' Q' + (x + 60) + ',' + (y - 120) + ' ' + (x + 30) + ',' + (y - 168) + ' Z"/>', y);
    this.solid(x - 12, y - 10, 24, 14);
  };
  // Hàng bày trên mặt bàn sạp (x: mép trái bàn, y: mặt bàn), theo từng loại sạp
  var GOODS = {
    rau: function (x, y, w) {
      var t = '';
      for (var i = 0; i < w - 20; i += 26) {
        var c = ['#58755C', '#3F6B4A', '#6F8A5A'][i / 26 % 3];
        t += '<path d="M' + (x + 12 + i) + ',' + (y + 12) + ' q-8,-16 4,-20 q12,4 6,20 z" fill="' + c + '" stroke-width="2"/>';
        t += '<path d="M' + (x + 22 + i) + ',' + (y + 12) + ' q-2,-14 8,-14 q6,8 -2,14 z" fill="' + c + '" stroke-width="2"/>';
      }
      for (var k = 0; k < 3; k++) t += '<ellipse cx="' + (x + 30 + k * 46) + '" cy="' + (y + 24) + '" rx="9" ry="5" fill="#D5DCE0" stroke-width="1.6"/>';
      return t;
    },
    qua: function (x, y, w) {
      var t = '', cols = ['#B8A65A', '#A32E36', '#7C8A4A', '#C98A4A'];
      for (var i = 0; i < Math.floor(w / 40); i++) {
        var bx = x + 22 + i * 40, fc = cols[i % 4];
        t += '<ellipse cx="' + bx + '" cy="' + (y + 12) + '" rx="17" ry="8" fill="#857761" stroke-width="2"/>';
        for (var k = -1; k <= 1; k++) t += '<circle cx="' + (bx + k * 8) + '" cy="' + (y + 6) + '" r="5.5" fill="' + fc + '" stroke-width="1.6"/>';
        t += '<circle cx="' + bx + '" cy="' + (y + 1) + '" r="5.5" fill="' + fc + '" stroke-width="1.6"/>';
      }
      return t;
    },
    ca: function (x, y, w) {
      var t = '';
      for (var i = 0; i < 2; i++) {
        var bx = x + 10 + i * (w / 2);
        t += '<rect x="' + bx + '" y="' + (y - 2) + '" width="' + (w / 2 - 20) + '" height="18" rx="4" fill="#8FA4AE" stroke-width="2"/>';
        for (var k = 0; k < 3; k++) {
          var fx = bx + 4 + k * 16, fy = y + 6 + (k % 2) * 3;
          t += '<path d="M' + fx + ',' + fy + ' q7,-6 14,0 q-7,6 -14,0 z M' + (fx + 14) + ',' + fy + ' l4,-4 v8 z" fill="#C3CACD" stroke-width="1.5"/>';
        }
      }
      return t;
    },
    thit: function (x, y, w) {
      var t = '<rect x="' + (x + 10) + '" y="' + (y - 2) + '" width="' + (w - 60) + '" height="18" rx="5" fill="#857761" stroke-width="2"/>';
      for (var i = 0; i < 3; i++) t += '<path d="M' + (x + 20 + i * 26) + ',' + (y + 10) + ' q4,-12 16,-8 q6,8 -2,12 q-8,4 -14,-4 z" fill="#8E4A4A" stroke-width="1.8"/>';
      t += '<path d="M' + (x + w - 40) + ',' + (y + 12) + ' l26,-6 l-4,-8 l-26,6 z" fill="#C3CACD" stroke-width="1.8"/>';
      return t;
    },
    vangma: function (x, y, w) {
      var t = '';
      // thếp vàng, tiền đỏ chồng cao
      [['#B89A4A', 0], ['#A32E36', 22], ['#B89A4A', 44]].forEach(function (c) {
        for (var k = 0; k < 3; k++) t += '<rect x="' + (x + 8 + c[1]) + '" y="' + (y + 8 - k * 5) + '" width="20" height="6" fill="' + c[0] + '" stroke-width="1.5"/>';
      });
      // nhà giấy
      var hx = x + 82;
      t += '<rect x="' + hx + '" y="' + (y - 14) + '" width="30" height="26" fill="#D5DCE0" stroke-width="2"/>' +
        '<path d="M' + (hx - 5) + ',' + (y - 14) + ' l20,-14 l20,14 z" fill="#A32E36" stroke-width="2"/>' +
        '<rect x="' + (hx + 11) + '" y="' + (y - 2) + '" width="8" height="14" fill="#B89A4A" stroke-width="1.5"/>';
      // bó nhang đỏ
      t += '<rect x="' + (x + w - 34) + '" y="' + (y - 6) + '" width="16" height="20" fill="#A32E36" stroke-width="1.8"/>';
      for (var j = 0; j < 4; j++) t += '<path d="M' + (x + w - 32 + j * 4) + ',' + (y - 6) + ' v-10" stroke-width="1.5"/>';
      return t;
    }
  };
  // Đồ treo hai bên mép bạt (không che mặt người bán)
  var HANG = {
    qua: function (x) { // nải chuối treo
      var t = '<path d="M' + x + ',0 v14" stroke-width="2"/>';
      for (var k = 0; k < 4; k++) t += '<path d="M' + (x - 2) + ',' + (14 + k * 6) + ' q-12,2 -12,12 q8,-2 14,-8 z" fill="#B8A65A" stroke-width="1.6"/><path d="M' + (x + 2) + ',' + (14 + k * 6) + ' q12,2 12,12 q-8,-2 -14,-8 z" fill="#A89A4E" stroke-width="1.6"/>';
      return t;
    },
    thit: function (x) { return '<path d="M' + x + ',0 v10 q6,0 6,6" fill="none" stroke-width="2"/><path d="M' + (x - 4) + ',18 q12,-4 14,10 q0,14 -10,16 q-10,-6 -4,-26 z" fill="#8E4A4A" stroke-width="2"/>'; },
    vangma: function (x) { // áo giấy đốt cho người khuất
      return '<path d="M' + x + ',0 v8" stroke-width="2"/><path d="M' + (x - 12) + ',8 h24 l6,10 l-6,3 v20 h-24 v-20 l-6,-3 z" fill="#3F6670" stroke-width="2"/><path d="M' + x + ',8 v33" stroke="#B89A4A" stroke-width="2"/>';
    },
    rau: function (x) { return '<path d="M' + x + ',0 v8" stroke-width="2"/><path d="M' + (x - 9) + ',8 h18 l-3,22 h-12 z" fill="#857761" stroke-width="2"/><path d="M' + (x - 6) + ',10 q6,-12 12,0" fill="#58755C" stroke-width="1.6"/>'; },
    ca: function (x) { return '<path d="M' + x + ',0 v12" stroke-width="2"/><path d="M' + (x - 3) + ',12 q3,-4 6,0 v18 q-3,6 -6,0 z" fill="#8C949B" stroke-width="1.6"/><path d="M' + (x - 3) + ',38 l3,4 l3,-4" fill="#8C949B" stroke-width="1.4"/>'; }
  };
  // thêm hàng cho từng loại sạp (vẽ sau GOODS, trên mặt bàn)
  var EXTRA = {
    rau: function (x, y, w) { // bắp cải, ớt, tỏi
      var t = '';
      [[x + w - 34, y + 4], [x + w - 18, y + 8]].forEach(function (p) { t += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="8" fill="#7C9A62" stroke-width="1.6"/><path d="M' + (p[0] - 5) + ',' + p[1] + ' q5,-6 10,0" fill="none" stroke="#4E6B44" stroke-width="1.2"/>'; });
      for (var i = 0; i < 6; i++) t += '<path d="M' + (x + 16 + i * 4) + ',' + (y + 20) + ' q2,-6 5,-8" fill="none" stroke="#A32E36" stroke-width="2.5"/>';
      t += '<circle cx="' + (x + 48) + '" cy="' + (y + 18) + '" r="4" fill="#E2E2DC" stroke-width="1.2"/><circle cx="' + (x + 55) + '" cy="' + (y + 20) + '" r="4" fill="#E2E2DC" stroke-width="1.2"/>';
      return t;
    },
    qua: function (x, y, w) { // thanh long, dưa hấu bổ
      var t = '<ellipse cx="' + (x + w - 26) + '" cy="' + (y + 16) + '" rx="9" ry="7" fill="#B8406A" stroke-width="1.6"/><path d="M' + (x + w - 32) + ',' + (y + 12) + ' l-4,-3 M' + (x + w - 22) + ',' + (y + 10) + ' l3,-4 M' + (x + w - 18) + ',' + (y + 17) + ' l5,0" stroke="#58755C" stroke-width="2"/>';
      t += '<path d="M' + (x + 10) + ',' + (y + 22) + ' a14,10 0 0 1 28,0 z" fill="#C04848" stroke-width="1.6"/><path d="M' + (x + 10) + ',' + (y + 22) + ' h28" stroke="#3F6B4A" stroke-width="3"/>';
      return t;
    },
    ca: function (x, y, w) { // thùng xốp đá, rổ tôm
      var t = R2(x + 4, y + 16, 30, 14, '#E2E8EA', ' stroke-width="1.5"') + R2(x + 8, y + 18, 8, 6, '#B9D4DC', ' stroke="none"') + R2(x + 20, y + 19, 9, 6, '#B9D4DC', ' stroke="none"');
      t += '<ellipse cx="' + (x + w - 24) + '" cy="' + (y + 22) + '" rx="13" ry="6" fill="#857761" stroke-width="1.5"/>';
      for (var i = 0; i < 4; i++) t += '<path d="M' + (x + w - 32 + i * 5) + ',' + (y + 20) + ' q3,-4 5,0" fill="none" stroke="#C98A4A" stroke-width="2.2"/>';
      return t;
    },
    thit: function (x, y, w) { // dao phay cắm thớt
      return '<path d="M' + (x + w - 52) + ',' + (y - 2) + ' l18,-4 l2,9 l-18,4 z" fill="#C3CACD" stroke-width="1.5"/><path d="M' + (x + w - 34) + ',' + (y - 6) + ' l8,-2" stroke="#3A2E26" stroke-width="4"/>';
    },
    vangma: function (x, y, w) { // thỏi vàng giấy, đèn lồng giấy
      var t = '';
      for (var i = 0; i < 3; i++) t += '<path d="M' + (x + 10 + i * 12) + ',' + (y + 26) + ' l3,-6 h6 l3,6 z" fill="#E2C46A" stroke-width="1.2"/>';
      t += '<ellipse cx="' + (x + w - 54) + '" cy="' + (y + 18) + '" rx="7" ry="9" fill="#A32E36" stroke-width="1.5"/><path d="M' + (x + w - 54) + ',' + (y + 9) + ' v-4 M' + (x + w - 54) + ',' + (y + 27) + ' v4" stroke="#E2C46A" stroke-width="1.5"/>';
      return t;
    }
  };
  function R2(x, y, w, h, f, ex) { return rect(Math.round(x), Math.round(y), Math.round(w), Math.round(h), f, ex); }
  function tag(x, y, s) { return '<path d="M' + x + ',' + (y + 12) + ' v10" stroke="#5A4A3C" stroke-width="1.5"/>' + R2(x - 10, y, 20, 12, '#E2E8EA', ' stroke-width="1.2"') + txt(x, y + 9, 7, '#A32E36', s); }
  var PRICE = { rau: ['5k', '8k'], qua: ['20k', '15k'], ca: ['60k', '45k'], thit: ['120k', '90k'], vangma: ['10k', '35k'] };

  // Sạp chợ: cột tre, bạt có nếp + dây buộc (vẽ ở nền để không che mặt người bán), bóng đèn treo,
  // bàn phủ bạt ca rô, két nhựa và rổ dưới gầm, hàng theo loại, thẻ giá. kind/sign như cũ.
  Builder.prototype.stall = function (x, y, w, tarp, r, kind, sign) {
    var t = '', tw = w + 16;
    t += '<path d="M' + (x - 6) + ',' + (y + 2) + ' V' + (y + 122) + ' M' + (x + w + 6) + ',' + (y + 2) + ' V' + (y + 122) + '" stroke="#857761" stroke-width="5"/>';
    t += rect(x - 8, y, tw, 70, tarp);
    for (var i = 0; i < tw; i += 28) t += rect(x - 8 + i, y, 14, 70, '#D5DCE0', ' opacity=".12" stroke="none"');
    t += '<path d="M' + (x + tw * 0.3) + ',' + y + ' q-4,35 2,70 M' + (x + tw * 0.65) + ',' + y + ' q5,35 -2,70" fill="none" stroke="#000" stroke-width="2" opacity=".2"/>';
    t += rect(x - 8, y + 50, tw, 20, '#000', ' opacity=".18" stroke="none"');
    t += '<path d="M' + (x - 8) + ',' + (y + 70) + ' q' + (tw / 8) + ',10 ' + (tw / 4) + ',0 t' + (tw / 4) + ',0 t' + (tw / 4) + ',0 t' + (tw / 4) + ',0" fill="' + tarp + '"/>';
    t += '<path d="M' + (x - 8) + ',' + (y + 4) + ' l-10,-10 M' + (x + w + 8) + ',' + (y + 4) + ' l10,-10" stroke="#5A4A3C" stroke-width="1.5"/>';
    t += '<path d="M' + (x + w / 2) + ',' + (y + 30) + ' v14" stroke-width="1.5"/><circle cx="' + (x + w / 2) + '" cy="' + (y + 48) + '" r="5" fill="#E2E2C8" stroke-width="1.5"/>';
    if (kind && HANG[kind]) t += '<g transform="translate(0,' + (y + 72) + ')">' + HANG[kind](x + 2) + HANG[kind](x + w - 2) + '</g>';
    this.bg += ink(t);
    t = rect(x, y + 78, w, 18, '#5A4A3C');
    t += rect(x, y + 96, w, 26, kind === 'vangma' ? '#7A2A2E' : (kind === 'ca' ? '#3F6670' : '#4A4038'));
    for (var c = x + 8; c < x + w; c += 16) t += '<path d="M' + c + ',' + (y + 96) + ' v26" stroke="#000" stroke-width="1" opacity=".22"/>';
    t += '<path d="M' + x + ',' + (y + 109) + ' h' + w + '" stroke="#000" stroke-width="1" opacity=".22"/>';
    t += rect(x + 10, y + 112, 26, 12, ['#3F6670', '#A32E36', '#58755C'][Math.floor(r() * 3)], ' stroke-width="1.5"') + rect(x + w - 40, y + 114, 30, 10, '#857761', ' rx="4" stroke-width="1.5"');
    if (kind && GOODS[kind]) t += GOODS[kind](x, y + 80, w) + (EXTRA[kind] ? EXTRA[kind](x, y + 80, w) : '');
    else { // sạp cô Lan: bình trà đá, rổ bánh mì, chai nước ngọt, chồng ly
      var ty = y + 80;
      t += R2(x + 10, ty - 22, 26, 32, '#948C5E', ' rx="6" stroke-width="2"') + R2(x + 13, ty - 26, 20, 6, '#C3CACD', ' rx="2" stroke-width="1.5"');
      t += R2(x + 14, ty - 14, 7, 7, '#D5DCE0', ' opacity=".8" stroke-width="1"') + R2(x + 23, ty - 8, 7, 7, '#D5DCE0', ' opacity=".8" stroke-width="1"');
      t += '<ellipse cx="' + (x + 66) + '" cy="' + (ty + 10) + '" rx="22" ry="8" fill="#857761" stroke-width="1.8"/>';
      for (var bb = 0; bb < 3; bb++) t += '<path d="M' + (x + 50 + bb * 10) + ',' + (ty + 8) + ' q6,-12 14,-2 q-6,6 -14,2 z" fill="#C8A060" stroke-width="1.4"/>';
      for (var sb = 0; sb < 4; sb++) t += R2(x + 96 + sb * 9, ty - 8, 7, 18, '#A32E36', ' rx="2" stroke-width="1.2"') + R2(x + 96 + sb * 9, ty, 7, 3, '#D5DCE0', ' stroke="none"');
      for (var cu = 0; cu < 3; cu++) t += '<path d="M' + (x + w - 18) + ',' + (ty + 8 - cu * 5) + ' l3,-6 h8 l3,6 z" fill="#E2E8EA" stroke-width="1.2"/>';
    }
    if (kind && PRICE[kind]) t += tag(x + 40, y + 62, PRICE[kind][0]) + tag(x + w - 44, y + 62, PRICE[kind][1]);
    if (sign) t += rect(x + w / 2 - 42, y + 100, 84, 18, kind === 'vangma' ? '#A32E36' : '#2B3138', ' stroke-width="2"') + txt(x + w / 2, y + 114, 12, kind === 'vangma' ? '#E2C46A' : '#D5DCE0', sign);
    this.prop(x - 10, y + 50, w + 20, 80, t, y + 122);
    this.solid(x, y + 76, w, 46);
  };
  Builder.prototype.done = function () {
    var W = this.W, H = this.H;
    return {
      svg: '<svg class="bg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '">' + this.bg + '<g>' + this.glow + '</g></svg>',
      fg: this.fgs ? '<svg class="fg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '"><g stroke="' + INK + '" filter="url(#w)">' + this.fgs + '</g></svg>' : '',
      props: this.props, solids: this.solids
    };
  };

  G.scenes.Builder = Builder;
  G.scenes.rng = rng;

  // ---------------- Các cảnh: mỗi cảnh rộng một màn hình để đi lại nhanh ----------------
  G.scenes.ben_song = function (W, H) {
    var B = new Builder(W, H), r = rng(11);
    B.streets(true);
    // nhà số 9 bỏ hoang: bỏ mái thấy bên trong, cửa khoá cho tới khi giao ly trà
    var open9 = G.S && G.S.flags.door9_open;
    B.room(40, 150, 280, 280, 'url(#wood)', [[150, 210]]);
    var n9 = rect(52, 196, 256, 220, INK, ' opacity=".35" stroke="none"');
    n9 += rect(200, 262, 74, 40, '#4A4038') + '<path class="d" d="M204,302 v12M270,302 v12"/>';
    if (!(G.S && G.S.flags.took9)) n9 += '<rect x="214" y="268" width="40" height="12" rx="5" fill="#A4A98C" stroke-width="2"/>';
    n9 += '<path d="M60,240 l40,30 M250,170 l30,40" stroke="#3B342E" stroke-width="6"/>';
    n9 += rect(70, 330, 40, 60, '#3A2E26') + '<path d="M70,330 l40,60" stroke-width="2"/>';
    n9 += rect(230, 350, 60, 30, '#2E2925');
    n9 += rect(160, 160, 40, 22, '#2B3138') + txt(180, 177, 15, '#8C949B', '9');
    if (!open9) n9 += rect(150, 412, 60, 18, '#4A4038') + '<path class="d" d="M180,412 v18"/>';
    else n9 += '<path d="M150,416 l-26,24" stroke="#4A4038" stroke-width="10"/><path d="M150,416 l-26,24" stroke-width="2"/>';
    if (G.S && (G.S.quests.ly_tra === 'delivered' || G.S.quests.ly_tra === 'done')) n9 += '<path d="M174,446 h12 l-2,14 h-8 Z" fill="#948C5E" stroke-width="2"/>';
    B.bg += ink(n9);
    B.solid(200, 262, 74, 40);
    if (!open9) B.solid(150, 412, 60, 18);
    B.closed(350, 170, 250, 260, { sign: 'QUÁN NƯỚC', signBg: '#2C5449', shutter: true });
    // thùng giấy ve chai ông Khải bỏ, cạnh quán nước
    var bx = rect(608, 446, 54, 32, '#857761') + '<path d="M608,446 l10,-10 h34 l10,10" fill="#6A5846"/><path class="d" d="M635,436 v42"/>';
    bx += rect(614, 456, 20, 10, '#D5DCE0', ' stroke-width="1.2"');
    B.bg += ink(bx);
    B.solid(608, 446, 54, 32);
    B.solid(0, 0, W, 150);
    // bờ sông, nước, bến gỗ, đò, bờ bên kia có mái đình cũ
    var b = rect(0, 730, W, 22, '#3A4552');
    b += rect(0, 752, W, H - 752, 'url(#water)');
    b += rect(0, 860, W, H - 860, '#141A20');
    b += '<g transform="translate(700,-100)"><path d="M0,1000 L36,960 H204 L240,1000 Z" fill="#202730"/><path d="M-12,962 Q16,950 36,960M204,960 Q226,950 252,962" fill="none" stroke-width="2.5"/></g>';
    b += rect(640, 726, 100, 164, 'url(#wood)');
    for (var p = 650; p < 740; p += 30) b += '<path d="M' + p + ',890 v10" stroke-width="5"/>';
    b += '<g transform="translate(-200,-110)"><path d="M950,872 Q1040,846 1150,872 L1136,920 Q1040,940 964,920 Z" fill="#4A4038"/><path d="M990,880 Q1050,862 1110,880 L1104,904 Q1050,914 996,904 Z" fill="#2E2925"/>';
    b += '<path class="s" d="M1080,868 L1150,872 L1136,920 Q1110,928 1090,930 Z"/></g>';
    for (var k = 0; k < 14; k++) { var rx = 30 + k * 46 + r() * 20; if (rx > 610) break; b += '<path class="d" d="M' + rx.toFixed(0) + ',756 q-6,-24 ' + (r() * 12 - 6).toFixed(0) + ',-' + (30 + r() * 20).toFixed(0) + '" stroke="#58755C" stroke-width="3"/>'; }
    B.bg += ink(b);
    B.solid(0, 740, 640, H - 740); B.solid(740, 740, W - 740, H - 740); B.solid(640, 892, 100, 20);
    B.tree(690, 400); B.tree(880, 340);
    B.lamp(330); B.lamp(880, 722);
    return B.done();
  };

  G.scenes.nha = function (W, H) {
    var B = new Builder(W, H), r = rng(23);
    B.streets(true);
    B.closed(0, 120, 50, 310, { roof: 'url(#roof)' });
    B.closed(900, 150, 60, 280, { roof: 'url(#roofG)' });
    B.solid(0, 0, W, 62); B.solid(50, 0, 20, 430);
    // nhà cũ bỏ mái
    B.room(70, 60, 560, 370, 'url(#wood)', [[220, 300]]);
    var f = '';
    f += rect(440, 104, 12, 120, CAP); B.solid(440, 104, 12, 120);
    // đồ đạc (furniture.js): bàn thờ, giường, tủ, bàn học của Vy, lịch, thảm
    f += G.furn.altar(195, 98, 120, 46, { photos: 1 }); B.solid(195, 98, 120, 46);
    f += G.furn.bed(480, 104, 132, 116); B.solid(480, 104, 132, 116);
    f += G.furn.mat(500, 228, 92, 16);
    f += G.furn.wardrobe(86, 104, 70, 90); B.solid(86, 104, 70, 90);
    f += G.furn.desk(574, 290, 40, 82); B.solid(574, 290, 40, 82);
    f += G.furn.calendar(158, 64, 3);
    B.bg += ink(f);
    // bàn trà thấp giữa nhà (thay chỗ cái xe cũ), quạt cây góc phòng
    B.prop(180, 262, 150, 60, G.furn.teaTable(215, 272, 80, 38), 312);
    B.solid(210, 278, 90, 32);
    B.prop(440, 190, 50, 80, G.furn.fan(466, 262), 264); B.solid(458, 254, 16, 10);
    // sân, hàng rào, cây
    var y = '';
    y += rect(630, 120, 270, 310, '#232C2A');
    for (var x = 634; x < 900; x += 22) y += '<path d="M' + x + ',134 V110" stroke-width="5"/>';
    y += '<path d="M630,116 H900M630,128 H900" stroke-width="3"/>';
    B.bg += ink(y);
    B.solid(630, 0, 270, 134);
    B.tree(780, 330);
    B.pole(40); B.lamp(680);
    B.southRoofs(r);
    return B.done();
  };

  G.scenes.duong = function (W, H) {
    var B = new Builder(W, H), r = rng(37);
    B.streets(true);
    B.solid(0, 0, W, 50);
    // tạp hoá bỏ mái, thấy bên trong (giống ảnh tham chiếu)
    B.room(20, 80, 300, 350, 'url(#tileF)', [[150, 230]]);
    var t = '';
    t += rect(40, 128, 46, 80, '#C3CACD') + rect(46, 134, 34, 66, '#6F86A0') + rect(40, 118, 46, 14, '#A32E36');
    t += txt(63, 129, 10, '#D5DCE0', 'NƯỚC');
    for (var s = 0; s < 4; s++) t += '<path class="d" d="M46,' + (148 + s * 14) + ' h34"/>';
    t += rect(110, 112, 120, 36, '#4A3532') + '<path class="d" d="M110,128 h120"/>';
    for (var i = 0; i < 6; i++) t += rect(116 + i * 18, 114, 12, 12, ['#948C5E', '#A32E36', '#58755C'][i % 3], ' stroke-width="1.5"');
    t += rect(250, 150, 50, 200, '#6A5846') + rect(256, 230, 22, 16, '#2C5449', ' stroke-width="2"');
    // kệ hàng nhiều tầng, hũ kẹo trên quầy, dây bim bim treo
    var col = ['#A32E36', '#3F6670', '#948C5E', '#58755C', '#C98A4A', '#D5DCE0'];
    for (var sh = 0; sh < 3; sh++) for (var it = 0; it < 7; it++) t += rect(114 + it * 16, 116 + sh * 10, 10, 8, col[(it + sh * 2) % 6], ' stroke-width="1"');
    for (var j = 0; j < 4; j++) t += '<ellipse cx="' + (260 + (j % 2) * 18) + '" cy="' + (166 + Math.floor(j / 2) * 22) + '" rx="7" ry="9" fill="#C3CACD" fill-opacity=".55" stroke-width="1.5"/><circle cx="' + (260 + (j % 2) * 18) + '" cy="' + (168 + Math.floor(j / 2) * 22) + '" r="3" fill="' + col[j] + '" stroke="none"/>';
    t += '<path d="M100,96 Q170,108 240,96" fill="none" stroke-width="1.5"/>';
    for (var k = 0; k < 7; k++) t += rect(108 + k * 19, 98 + Math.sin(k / 6 * Math.PI) * 8, 10, 14, col[k % 6], ' stroke-width="1.2"');
    B.bg += ink(t);
    B.solid(40, 118, 46, 90); B.solid(110, 112, 120, 36); B.solid(250, 150, 50, 200);
    B.closed(340, 60, 240, 370, { shutter: true, style: 'abandoned', upWall: '#4A4E54', wall: '#474C52', sign: 'CHO THUÊ', signBg: '#D5DCE0', signFg: '#A32E36', roof: 'url(#roofG)' });
    B.closed(600, 100, 300, 330, { sign: 'MỘC BA', signBg: '#6A5846', shutter: true, style: 'workshop', roofKind: 'tin', wall: '#5B5850' });
    B.closed(920, 120, 40, 310, { roof: 'url(#roof)' });
    // đống gỗ trước xưởng mộc
    B.prop(790, 440, 90, 50, rect(796, 452, 70, 10, '#857761') + rect(800, 462, 66, 10, '#6A5846') + rect(792, 472, 74, 10, '#857761'), 484);
    B.solid(792, 470, 76, 14);
    // bảng tin phường
    B.prop(396, 420, 88, 80,
      '<path d="M414,486 v12 M466,486 v12" stroke-width="5"/><path d="M414,486 v12 M466,486 v12" stroke="#6A5846" stroke-width="2.5"/>' +
      rect(402, 432, 76, 8, '#8C949B') + '<path d="M402,432 l4,-6 h68 l4,6" fill="#6F7880"/>' +                    // mái tôn che mưa
      rect(406, 440, 68, 48, '#5A4A3C') + rect(410, 444, 60, 40, '#8A6E50', ' stroke-width="1.5"') +
      rect(413, 450, 26, 30, '#D2BE88', ' stroke-width="1.2" transform="rotate(-3 426 465)"') + rect(416, 456, 10, 12, '#8A7040', ' stroke="none"') +
      '<path d="M428,458 h8 M428,463 h7 M416,472 h18 M416,476 h14" stroke="#5A3A1A" stroke-width="1"/>' +
      rect(436, 447, 20, 16, '#EEF0F2', ' stroke-width="1.2" transform="rotate(5 446 455)"') + rect(452, 460, 16, 20, '#E8E4D8', ' stroke-width="1.2"') +
      '<path d="M453,476 v4 M457,476 v4 M461,476 v4 M465,476 v4" stroke="#4B5560" stroke-width="1"/>' + rect(440, 468, 10, 9, '#E2C46A', ' stroke-width="1"') +
      '<circle cx="426" cy="451" r="1.8" fill="#C0303A" stroke="none"/><circle cx="446" cy="448" r="1.8" fill="#C0303A" stroke="none"/><circle cx="460" cy="461" r="1.8" fill="#C0303A" stroke="none"/>', 496);
    B.solid(408, 484, 64, 14);
    B.wires([B.pole(330), B.pole(920)]);
    B.lamp(560);
    B.southRoofs(r);
    return B.done();
  };

  G.scenes.cho = function (W, H) {
    var B = new Builder(W, H), r = rng(51);
    B.streets(true);
    B.solid(0, 0, W, 40);
    B.closed(0, 140, 40, 290, {});
    // nhà chợ bỏ mái, mặt trước mở, chỉ có cột
    var x0 = 50, x1 = 700;
    var m = rect(x0, 40, x1 - x0, 390, 'url(#tileF)');
    m += rect(x0 + 14, 84, x1 - x0 - 28, 16, INK, ' opacity=".3"');
    m += rect(x0, 40, x1 - x0, 44, FACE) + rect(x0, 40, x1 - x0, 10, CAP);
    m += rect(x0, 40, 14, 390, CAP) + rect(x1 - 14, 40, 14, 390, CAP);
    m += rect(225, 46, 300, 32, '#2C5449') + txt(375, 70, 20, '#D5DCE0', 'CHỢ BẾN ĐÌNH');
    function col(c) { return !(c > 250 && c < 530); } // chừa chỗ cho sạp cô Lan
    for (var c = x0; c <= x1 - 20; c += 210) if (col(c)) m += rect(c, 410, 20, 20, CAP);
    B.bg += ink(m);
    B.solid(x0, 40, x1 - x0, 52); B.solid(x0, 40, 14, 390); B.solid(x1 - 14, 40, 14, 390);
    for (var c2 = x0; c2 <= x1 - 20; c2 += 210) if (col(c2)) B.solid(c2, 410, 20, 20);
    var tarps = ['#3F6670', '#58755C', '#857761', '#4B5560'];
    var kinds = [['rau', 'RAU CỦ'], ['qua', 'HOA QUẢ'], ['ca', 'CÁ TƯƠI'], ['thit', 'THỊT'], null, ['vangma', 'VÀNG MÃ']];
    for (var k = 0; k < 6; k++) if (k !== 4) B.stall(95 + (k % 3) * 205, k < 3 ? 100 : 250, 160, tarps[k % 4], r, kinds[k][0], kinds[k][1]);
    // sạp cô Lan sát mặt đường; cô đứng bên phải sạp
    B.stall(290, 330, 150, '#A32E36', r);
    B.closed(720, 120, 240, 310, { roof: 'url(#roofG)', shutter: true });
    B.lamp(200); B.lamp(930);
    B.southRoofs(r);
    return B.done();
  };
})();

// Cho các file khác (cảnh năm 1996) dùng lại bộ dựng cảnh
(function () {
  var INK = '#0F141B';
  G.scenes.h = {
    INK: INK, CAP: '#2B3138', FACE: '#4B5560',
    rect: function (x, y, w, h, fill, extra) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + fill + '"' + (extra || '') + '/>'; },
    txt: function (x, y, size, fill, t) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" font-size="' + size + '" font-weight="800" fill="' + fill + '" stroke="none" font-family="Segoe UI, Arial, sans-serif">' + t + '</text>'; },
    ink: function (inner) { return '<g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#w)">' + inner + '</g>'; },
    // chèn thêm hình vào nền một cảnh đã dựng
    addBg: function (sc, inner) { sc.svg = sc.svg.replace(/<\/svg>$/, G.scenes.h.ink(inner) + '</svg>'); return sc; }
  };
})();
