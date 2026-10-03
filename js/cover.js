// Ảnh bìa màn hình tiêu đề: đêm bên bến sông, đình bên kia sông, người bán trà đá cạnh xe, bóng đứa bé ở mép nước.
var G = window.G || (window.G = {});

(function () {
  var INK = '#0F141B';
  function cover() {
    var s = '<svg id="cover" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice">';
    s += '<defs><linearGradient id="cvSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1018"/><stop offset="1" stop-color="#1E2A38"/></linearGradient>' +
      '<linearGradient id="cvWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C3440"/><stop offset="1" stop-color="#0E1A22"/></linearGradient>' +
      '<radialGradient id="cvMoon"><stop offset="0" stop-color="#D5DCE0" stop-opacity=".35"/><stop offset="1" stop-color="#D5DCE0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="cvLamp" cx=".5" cy="0"><stop offset="0" stop-color="#E2D9A8" stop-opacity=".42"/><stop offset="1" stop-color="#E2D9A8" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="cvRed"><stop offset="0" stop-color="#A32E36" stop-opacity=".55"/><stop offset="1" stop-color="#A32E36" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="cvLeft" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0B1018" stop-opacity=".92"/><stop offset=".42" stop-color="#0B1018" stop-opacity=".55"/><stop offset=".6" stop-color="#0B1018" stop-opacity="0"/></linearGradient>' +
      '</defs>';
    // trời, trăng, mây
    s += '<rect width="960" height="300" fill="url(#cvSky)"/>';
    for (var i = 0; i < 40; i++) s += '<circle cx="' + ((i * 197) % 960) + '' + '" cy="' + ((i * 71) % 230) + '" r="' + (i % 3 ? 0.8 : 1.4) + '" fill="#8C949B" opacity="' + (0.3 + (i % 5) / 10) + '"/>';
    s += '<circle cx="820" cy="92" r="120" fill="url(#cvMoon)"/><circle cx="820" cy="92" r="36" fill="#D5DCE0"/><circle cx="808" cy="84" r="7" fill="#B9C2C6"/><circle cx="830" cy="104" r="5" fill="#B9C2C6"/>';
    s += '<path class="cv-cloud" d="M690,120 q20,-18 50,-6 q20,-16 46,0 q30,-4 34,14 q-60,10 -130,-8 z" fill="#2B3138" opacity=".85"/>';
    // bờ bên kia: rặng cây, đình làng
    s += '<path d="M0,282 q40,-30 80,-8 q30,-26 70,-4 q40,-30 90,0 q40,-20 80,2 q50,-28 110,0 L960,286 V306 H0 Z" fill="#121820"/>';
    s += '<circle cx="700" cy="250" r="90" fill="url(#cvRed)" class="cv-glow"/>';
    s += '<g fill="#0B1018" stroke="' + INK + '" stroke-width="2">' +
      '<rect x="630" y="236" width="140" height="56"/>' +
      '<path d="M600,240 q20,-6 30,-22 h140 q10,16 30,22 q-20,0 -26,-6 h-148 q-6,6 -26,6 z"/>' +
      '<path d="M640,218 q10,-4 16,-18 h88 q6,14 16,18 z"/><path d="M700,198 v-14"/>' +
      '<rect x="690" y="258" width="20" height="34" fill="#3A1418"/></g>';
    s += '<rect x="694" y="262" width="12" height="14" fill="#A32E36" class="cv-flick"/>';
    // sông
    s += '<rect y="296" width="960" height="140" fill="url(#cvWater)"/>';
    for (var r = 0; r < 7; r++) s += '<rect x="' + (806 - r * 3) + '" y="' + (306 + r * 18) + '" width="' + (30 + r * 6) + '" height="3" rx="1.5" fill="#D5DCE0" opacity="' + (0.5 - r * 0.05) + '" class="cv-shim" style="animation-delay:-' + (r * 0.4) + 's"/>';
    s += '<path d="M700,272 v26" stroke="#A32E36" stroke-width="10" opacity=".25"/>';
    for (var w = 0; w < 9; w++) s += '<path d="M' + (60 + w * 105) + ',' + (330 + (w % 3) * 30) + ' q14,-5 28,0 t28,0" fill="none" stroke="#4B6E7A" stroke-width="2" opacity=".6" class="cv-rip"/>';
    // con đò không người
    s += '<g stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"><path d="M480,356 q60,16 130,0 l-12,16 q-50,10 -106,0 z" fill="#2B2622"/><path d="M548,356 v-40" fill="none"/></g>';
    s += '<path d="M500,378 q50,8 96,0" stroke="#2F4F5C" stroke-width="3" fill="none" opacity=".7"/>';
    // bờ bên này: kè đá, vỉa hè
    s += '<rect y="430" width="960" height="110" fill="#232A33"/><rect y="430" width="960" height="12" fill="#3A4450" stroke="' + INK + '" stroke-width="2"/>';
    for (var t = 0; t < 960; t += 48) s += '<path d="M' + t + ',442 v98 M' + (t + 24) + ',490 h48" stroke="#1A2029" stroke-width="2"/>';
    // cột đèn và quầng sáng
    s += '<path d="M560,250 L410,540 H760 Z" fill="url(#cvLamp)" class="cv-lamp"/>';
    s += '<g stroke="' + INK + '" stroke-width="4" stroke-linecap="round"><path d="M640,520 V252 q0,-14 -16,-14 h-56" fill="none" stroke="#2B3138" stroke-width="8"/>' +
      '<path d="M640,520 V252 q0,-14 -16,-14 h-56" fill="none" stroke-width="2" opacity=".6"/>' +
      '<path d="M548,238 h40 l-6,12 h-28 z" fill="#3A4450"/></g><ellipse cx="568" cy="252" rx="12" ry="4" fill="#E2D9A8" class="cv-lamp"/>';
    // đứa bé mờ ở mép nước
    s += '<g class="cv-ghost" transform="translate(408,302) scale(.92)">' +
      G.art.chibi({ view: 'front', hair: 'long', shirt: '#B9C2C6', pants: '#8C949B', shoes: '#4B5560', eyes: 'big', kid: true, scarf: true }) + '</g>';
    // xe hàng + nhân vật chính
    s += '<g transform="translate(560,388) scale(1.02)">' + G.art.cart({ upgrades: { o_che: true }, stock: { tra_da: 6, banh_mi: 3, nuoc_ngot: 3 } }) + '</g>';
    s += '<g transform="translate(700,330) scale(1.08)">' + G.art.chibi(Object.assign({}, G.PLAYER_LOOK, { view: 'front' })) + '</g>';
    // giấy vàng mã bay lên
    for (var e = 0; e < 8; e++) s += '<rect x="' + (300 + e * 70) + '" y="' + (440 + (e % 3) * 20) + '" width="6" height="8" fill="' + (e % 2 ? '#B89A4A' : '#A32E36') + '" class="cv-ember" style="animation-delay:-' + (e * 0.9) + 's"/>';
    // cỏ phía trước, lớp tối bên trái cho chữ
    s += '<path d="M900,540 q6,-40 14,-50 q-2,30 6,50 q8,-44 18,-56 q-6,40 0,56 Z M20,540 q8,-30 16,-40 q-4,24 4,40 Z" fill="#1B222C"/>';
    s += '<rect width="960" height="540" fill="url(#cvLeft)"/>';
    return s + '</svg>';
  }
  function mount() {
    var t = document.getElementById('title');
    if (!t || document.getElementById('cover')) return;
    t.insertAdjacentHTML('afterbegin', cover());
  }
  G.cover = mount;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
