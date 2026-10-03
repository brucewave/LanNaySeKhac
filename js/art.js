// Hình vẽ SVG theo mẫu nhan-vat-chibi-v3.svg: viền mực dày, chi tiết mảnh, bóng mờ, nét run tay (filter #w).
var G = window.G || (window.G = {});
G.art = {};

var INK = '#0F141B';
var SKIN = '#C3CACD';

G.art.hair = function (o) {
  var c = o.hairColor || INK;
  switch (o.hair) {
    case 'non_la':
      return '<path d="M42,72 Q39,94 48,102 Q48,84 56,72 Z" fill="' + c + '"/><path d="M118,72 Q121,94 112,102 Q112,84 104,72 Z" fill="' + c + '"/>' +
        '<path class="s" d="M44,66 Q80,80 116,66 L117,76 Q80,90 43,76 Z"/>' +
        '<path d="M80,14 L140,60 Q80,76 20,60 Z" fill="#A4A98C"/><path class="s" d="M80,14 L140,60 Q112,67 88,68 Z"/>' +
        '<path class="d" d="M54,36 Q80,43 106,36M37,50 Q80,62 123,50"/>';
    case 'helmet':
      return '<path d="M44,64 A36,36 0 0 1 116,64 L121,71 H39 Z" fill="' + (o.cap || '#3F7566') + '"/>' +
        '<path d="M80,29 V68" fill="none" stroke="#D5DCE0" stroke-width="6"/>' +
        '<path class="s" d="M100,34 A36,36 0 0 1 116,64 L121,71 H102 Q106,52 100,34 Z"/>';
    case 'cap':
      return '<path d="M43,74 Q40,46 80,44 Q120,46 117,74 Q100,62 80,62 Q60,62 43,74 Z" fill="' + c + '"/>' +
        '<path d="M46,60 Q48,34 80,34 Q112,34 114,60 Z" fill="' + (o.cap || '#2C5449') + '"/>' +
        '<path d="M108,58 L140,63 Q128,68 106,66 Z" fill="' + (o.cap || '#2C5449') + '"/>' +
        '<path class="s" d="M96,36 Q112,40 114,60 H98 Q102,46 96,36 Z"/>';
    case 'long':
      return '<path d="M42,80 Q38,40 80,40 Q122,40 118,80 Q106,60 80,62 Q54,60 42,80 Z" fill="' + c + '"/>';
    case 'bun':
      return '<circle cx="80" cy="36" r="13" fill="' + c + '"/>' +
        '<path d="M43,76 Q40,44 80,44 Q120,44 117,76 Q104,60 80,60 Q56,60 43,76 Z" fill="' + c + '"/>';
    case 'old':
      return '<path d="M43,82 Q42,64 50,58 Q50,72 54,80 Z" fill="#8C949B"/><path d="M117,82 Q118,64 110,58 Q110,72 106,80 Z" fill="#8C949B"/>' +
        '<path class="d" d="M66,58 q14,-4 28,0M70,64 q10,-3 20,0"/>';
    case 'messy':
      return '<path d="M42,78 Q36,40 66,38 L72,30 L80,38 L90,30 L94,40 Q124,42 118,78 Q112,60 96,58 L90,64 L84,57 Q66,62 56,58 Q46,66 42,78 Z" fill="' + c + '"/>';
    default: // short
      return '<path d="M43,74 Q40,40 80,40 Q120,40 117,74 Q110,58 92,56 Q86,62 70,57 Q54,60 43,74 Z" fill="' + c + '"/>';
  }
};

G.art.eyes = function (o) {
  var e;
  if (o.smile && !o.mask) { // mặt cười (chỉ dùng ở cảnh kết có hậu): mắt cong hình cầu vồng, miệng cười há
    e = '<path class="e" d="M59,89 q7,-9 14,0M87,89 q7,-9 14,0" fill="none" stroke-width="2.8"/>' +
      (o.eyes === 'tired' || o.eyes === 'narrow' ? '<path class="d" d="M60,80 q6,-3 12,0M88,80 q6,-3 12,0"/>' : '');
    if (o.mole) e += '<circle cx="62" cy="96" r="2.6" fill="' + INK + '" stroke="none"/>';
    return e + '<path d="M71,97 q9,11 18,0 z" fill="' + INK + '" stroke-width="2"/><path d="M76,102 q4,3 8,0" fill="#A32E36" stroke="none"/>';
  }
  switch (o.eyes) {
    case 'tired':
      e = '<g class="e" stroke="none" fill="' + INK + '"><circle cx="66" cy="88" r="3"/><circle cx="94" cy="88" r="3"/></g>' +
        '<path class="d" d="M59,83 h13M88,83 h13M61,94 q5,2 9,0M90,94 q5,2 9,0"/>';
      break;
    case 'big':
      e = '<g class="e" stroke="none" fill="' + INK + '"><circle cx="65" cy="87" r="4.4"/><circle cx="95" cy="87" r="4.4"/></g>';
      break;
    case 'narrow':
      e = '<path class="e" d="M61,88 h10M89,88 h10" fill="none" stroke-width="2.4"/><path class="d" d="M60,81 h12M88,81 h12"/>';
      break;
    default:
      e = '<g class="e" stroke="none" fill="' + INK + '"><circle cx="67" cy="87" r="3"/><circle cx="93" cy="87" r="3"/></g>' +
        '<path d="M60,79 h13M87,79 h13" fill="none" stroke-width="2.2"/>';
  }
  if (o.mole) e += '<circle cx="62" cy="96" r="2.6" fill="' + INK + '" stroke="none"/>';
  if (o.mask) { // mặt nạ giấy của đoàn rước
    e += '<path d="M46,72 Q80,54 114,72 Q116,98 80,104 Q44,98 46,72 Z" fill="#E2D2A0" stroke-width="2.5"/>' +
      '<ellipse cx="65" cy="83" rx="6" ry="4" fill="' + INK + '" stroke="none"/><ellipse cx="95" cy="83" rx="6" ry="4" fill="' + INK + '" stroke="none"/>' +
      '<path d="M56,94 q6,4 10,0M94,94 q6,4 10,0" fill="none" stroke="#A32E36" stroke-width="2.5"/><path d="M80,62 v10" stroke="#A32E36" stroke-width="2.5"/>';
  }
  return e + '<path d="M75,100 h10" fill="none" stroke-width="2.2"/>';
};

G.art.prop = function (o) {
  if (o.prop === 'axe_up') { // rìu giơ cao (dáng trong tấm ảnh)
    return '<path d="M106,146 L118,26" stroke-width="7"/><path d="M106,146 L118,26" stroke="#2E2925" stroke-width="3.5"/>' +
      '<path d="M116,10 q-34,-6 -40,26 l20,10 q4,-20 20,-26 Z" fill="#8C949B" stroke-width="3"/>';
  }
  if (o.prop === 'axe') {
    return '<path d="M106,148 L140,92" stroke-width="7"/><path d="M106,148 L140,92" stroke="#2E2925" stroke-width="3.5"/>' +
      '<path d="M134,86 q16,-6 20,12 l-14,8 q-2,-12 -6,-20 Z" fill="#8C949B" stroke-width="2.5"/>';
  }
  if (o.prop === 'lantern') {
    return '<path class="d" d="M108,146 v8"/><rect x="100" y="152" width="16" height="20" rx="3" fill="#E2B060" stroke-width="2.5"/>';
  }
  if (o.prop === 'fan') {
    return '<path d="M108,144 l-4,-26 q14,-6 24,6 Z" fill="#C8B080" stroke-width="2.5"/><path class="d" d="M108,144 l2,-24M108,144 l10,-20"/>';
  }
  if (o.prop === 'balloon') {
    return '<path class="d" d="M108,142 Q118,110 112,62"/><ellipse cx="114" cy="40" rx="15" ry="18" fill="#A32E36"/>' +
      '<path class="s" d="M120,24 A15,18 0 0 1 120,56 Q126,40 120,24 Z"/><path d="M110,62 l4,-5 l4,5 z" fill="#A32E36" stroke-width="2"/>';
  }
  if (o.prop === 'rod') {
    return '<path class="d" d="M108,144 L146,20" stroke-width="2.4"/><path class="d" d="M146,20 Q152,60 150,96" stroke="#8C949B"/>';
  }
  return '';
};

// Tóc nhìn từ sau lưng: phủ kín đầu, mũ/nón vẽ đè lên
G.art.hairBack = function (o) {
  var c = o.hairColor || INK;
  if (o.hair === 'old') return '<path d="M43,80 Q44,104 80,108 Q116,104 117,80 Q100,90 80,90 Q60,90 43,80 Z" fill="#8C949B"/>';
  var s = '<ellipse cx="80" cy="76" rx="38" ry="33" fill="' + c + '"/>';
  if (o.hair === 'long') s += '<path d="M46,90 Q48,118 80,120 Q112,118 114,90 Z" fill="' + c + '"/>';
  if (o.hair === 'bun') s += '<circle cx="80" cy="40" r="13" fill="' + c + '"/>';
  if (o.hair === 'non_la' || o.hair === 'helmet' || o.hair === 'cap') s += G.art.hair(o);
  s += '<path class="s" d="M102,50 Q119,64 118,80 Q113,100 96,108 Q110,82 102,50 Z"/>';
  return s;
};

// Trả về chuỗi SVG của một nhân vật chibi trong khung 160x190, bàn chân ở y≈176.
// o.view: 'front' (quay mặt xuống), 'side' (quay ngang, mặc định nhìn sang phải), 'back' (quay lưng)
G.art.chibi = function (o) {
  var view = o.view || 'front';
  var shirt = o.shirt || '#3F6670', pants = o.pants || '#33363F', shoes = o.shoes || '#4A4038';
  var wide = o.body === 'wide' ? 6 : 0;
  var s = '';
  s += '<ellipse cx="80" cy="179" rx="44" ry="6" fill="' + INK + '" opacity=".6" stroke="none"/>';
  // chân: nhìn ngang thì hai chân sát nhau, mũi giày hướng về trước (để sải bước); chân sau tối hơn
  if (view === 'side') {
    s += '<g class="lg lg2"><rect x="76" y="148" width="13" height="25" fill="' + pants + '"/><rect x="76" y="148" width="13" height="25" fill="' + INK + '" opacity=".25" stroke="none"/><ellipse cx="86" cy="175" rx="11" ry="5.5" fill="' + shoes + '"/></g>';
    s += '<g class="lg lg1"><rect x="70" y="148" width="13" height="25" fill="' + pants + '"/><ellipse cx="80" cy="175" rx="11" ry="5.5" fill="' + shoes + '"/></g>';
  } else {
    s += '<g class="lg lg1"><rect x="63" y="150" width="13" height="23" fill="' + pants + '"/><ellipse cx="67" cy="175" rx="10.5" ry="5.5" fill="' + shoes + '"/></g>';
    s += '<g class="lg lg2"><rect x="84" y="150" width="13" height="23" fill="' + pants + '"/><ellipse cx="93" cy="175" rx="10.5" ry="5.5" fill="' + shoes + '"/></g>';
  }
  s += '<g class="bd">';
  s += G.art.prop(o);
  if (G.art.accBack) s += G.art.accBack(o, view, wide);
  s += '<path d="M' + (58 - wide) + ',108 Q80,101 ' + (102 + wide) + ',108 L' + (110 + wide) + ',153 Q80,161 ' + (50 - wide) + ',153 Z" fill="' + shirt + '"/>';
  s += '<path class="s" d="M' + (92 + wide) + ',105 L' + (102 + wide) + ',108 L' + (110 + wide) + ',153 Q' + (100 + wide) + ',157 ' + (90 + wide) + ',158 Q' + (97 + wide) + ',132 ' + (92 + wide) + ',105 Z"/>';
  s += '<path class="d" d="M80,106 V158"/>';
  if (o.sash) s += '<path d="M62,110 L104,152" stroke="#A32E36" stroke-width="8"/>';
  if (o.scarf) s += '<path d="M60,108 Q80,118 100,108 L98,116 Q80,124 62,116 Z" fill="#A32E36"/>' + (view === 'back' ? '' : '<path d="M90,116 l6,20 l-9,-2 z" fill="#A32E36"/>');
  if (G.art.accFront) s += G.art.accFront(o, view, wide);
  // tay tách riêng để đánh tay khi đi (xoay quanh vai)
  [[61 - wide, 48 - wide, 52 - wide, 'ar1'], [99 + wide, 112 + wide, 108 + wide, 'ar2']].forEach(function (a) {
    var d = 'M' + a[0] + ',116 Q' + a[1] + ',128 ' + a[2] + ',142';
    s += '<g class="ar ' + a[3] + '"><path d="' + d + '" fill="none" stroke-width="12"/><path d="' + d + '" fill="none" stroke="' + shirt + '" stroke-width="6"/>' +
      '<circle cx="' + a[2] + '" cy="145" r="5.5" fill="' + SKIN + '"/></g>';
  });
  if (o.hair === 'long') s += '<ellipse cx="44" cy="92" rx="12" ry="22" fill="' + (o.hairColor || INK) + '"/><ellipse cx="116" cy="92" rx="12" ry="22" fill="' + (o.hairColor || INK) + '"/>';
  s += '<ellipse cx="80" cy="76" rx="38" ry="33" fill="' + SKIN + '"/>';
  if (view === 'back') s += G.art.hairBack(o);
  else {
    s += '<path class="s" d="M102,50 Q119,64 118,80 Q113,100 96,108 Q110,82 102,50 Z"/>';
    s += (view === 'side' ? '<g transform="translate(9,1)">' + G.art.eyes(o) + '</g>' : G.art.eyes(o)) + G.art.hair(o);
  }
  if (G.art.accHead) s += G.art.accHead(o, view);
  s += '</g>';
  var inner = o.kid ? '<g transform="translate(80,178) scale(.84) translate(-80,-178)">' + s + '</g>' : s;
  return '<svg class="chibi v-' + view + '" viewBox="0 0 160 190" width="160" height="190" overflow="visible">' +
    '<g stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" filter="url(#w)">' + inner + '</g></svg>';
};

// Biểu tượng món hàng, khung 28x28
G.art.icon = function (id) {
  var g = '<svg viewBox="0 0 28 28" width="28" height="28"><g stroke="' + INK + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">';
  if (id === 'tra_da') g += '<path d="M6,5 H22 L20,25 H8 Z" fill="#948C5E"/><rect x="9" y="9" width="5" height="5" fill="#D5DCE0" stroke-width="1.2"/><rect x="14" y="13" width="5" height="5" fill="#D5DCE0" stroke-width="1.2"/>';
  else if (id === 'nuoc_ngot') g += '<path d="M11,3 H17 V8 Q21,11 21,15 V25 H7 V15 Q7,11 11,8 Z" fill="#A32E36"/><path d="M7,16 H21" stroke="#D5DCE0" stroke-width="2.5"/>';
  else if (id === 'banh_mi') g += '<path d="M3,17 Q4,9 14,8 Q24,8 25,15 Q24,21 14,21 Q4,22 3,17 Z" fill="#857761"/><path d="M9,12 l3,5M14,11 l3,5M19,11 l2,4" stroke-width="1.5"/>';
  return g + '</g></svg>';
};

// Xe hàng của mẹ nhìn chéo từ trên xuống, khung 180x150, bánh chạm đất ở y≈140, tay đẩy bên trái.
G.art.cart = function (S) {
  var up = S.upgrades || {};
  var s = '<svg class="cart" viewBox="0 0 180 150" width="180" height="150" overflow="visible">' +
    '<g stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" filter="url(#w)">';
  s += '<ellipse cx="90" cy="140" rx="80" ry="10" fill="' + INK + '" opacity=".55" stroke="none"/>';
  s += '<path d="M22,88 L-8,72" stroke-width="7"/><path d="M22,88 L-8,72" stroke="#6A5846" stroke-width="3"/>';
  if (up.thung_da) {
    s += '<rect x="148" y="62" width="32" height="20" rx="3" fill="#3F7566"/><rect x="148" y="82" width="32" height="42" rx="3" fill="#2C5449"/>';
    s += '<rect x="154" y="96" width="20" height="9" rx="2" fill="#D5DCE0" stroke-width="2"/>';
  }
  // mặt trên: tủ kính nhìn từ trên
  s += '<rect x="20" y="40" width="130" height="44" rx="3" fill="#5A6E80"/>';
  s += '<rect x="30" y="48" width="12" height="12" fill="#948C5E" stroke-width="2"/><rect x="46" y="50" width="12" height="12" fill="#948C5E" stroke-width="2"/>';
  s += '<rect x="66" y="52" width="8" height="22" rx="3" fill="#A32E36" stroke-width="2"/><rect x="78" y="52" width="8" height="22" rx="3" fill="#A32E36" stroke-width="2"/>';
  s += '<path d="M96,64 Q97,54 116,54 Q136,54 138,62 Q136,72 116,72 Q97,73 96,64 Z" fill="#857761" stroke-width="2"/>';
  s += '<path d="M24,44 L60,80" stroke="#D5DCE0" stroke-width="2" opacity=".35"/>';
  // mặt trước: thân gỗ
  s += '<rect x="20" y="84" width="130" height="40" rx="3" fill="#6A5846"/>';
  s += '<path class="d" d="M20,98 H150M20,111 H150M63,84 V124M107,84 V124"/>';
  s += '<path class="s" d="M124,84 H150 V124 H128 Q132,104 124,84 Z"/>';
  s += '<circle cx="42" cy="128" r="13" fill="#33363F"/><circle cx="42" cy="128" r="3.5" fill="#8C949B" stroke-width="2"/>';
  s += '<circle cx="128" cy="128" r="13" fill="#33363F"/><circle cx="128" cy="128" r="3.5" fill="#8C949B" stroke-width="2"/>';
  if (up.o_che) {
    s += '<path d="M140,62 V-6" stroke-width="3"/>';
    s += '<ellipse cx="128" cy="-14" rx="62" ry="22" fill="#58755C"/><path class="s" d="M128,-36 A62,22 0 0 1 190,-14 Q160,0 136,6 Q150,-12 128,-36 Z"/>';
    s += '<path d="M66,-14 Q128,16 190,-14" fill="none" stroke="#A32E36" stroke-width="4"/>';
  }
  return s + '</g></svg>';
};
