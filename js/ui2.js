// Giao diện nút: biểu tượng vẽ nét cho thanh trên cùng (ngày, giờ, nơi, xe, tiền, xe máy, nhạc, sổ, túi, menu) và nút màn hình tiêu đề.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };
  function svg(p) { return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var IC = G.ICONS = {
    day: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    time: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    moon: svg('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
    loc: svg('<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
    cart: svg('<path d="M3 4h2l2 11h11l2-8H7"/><circle cx="9" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>'),
    coin: svg('<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>'),
    bike: svg('<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17h5l3-6h3M14 11l-2-4h-3M17 11l1 6M9 11h4"/>'),
    music: svg('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'),
    musicOff: svg('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/><path d="M3 3l18 18"/>'),
    note: svg('<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6M9 11h4"/>'),
    bag: svg('<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
    menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    play: svg('<path d="M7 5l12 7-12 7z"/>'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>')
  };

  // ---------- thanh trên cùng: gói mỗi thông tin vào một "chip" có biểu tượng ----------
  var hud = $('hud');
  var info = document.createElement('div'); info.className = 'hud-info';
  hud.insertBefore(info, hud.firstChild);
  [['hud-day', 'day', 'Ngày'], ['hud-time', 'time', 'Giờ'], ['hud-loc', 'loc', 'Nơi đang đứng'], ['hud-cart', 'cart', 'Hàng trên xe'], ['hud-money', 'coin', 'Tiền']].forEach(function (c) {
    var el = $(c[0]); if (!el) return;
    var chip = document.createElement('div'); chip.className = 'hchip hchip-' + c[1]; chip.title = c[2];
    chip.innerHTML = '<span class="ci">' + IC[c[1]] + '</span>';
    info.appendChild(chip); chip.appendChild(el);
  });
  function iconBtn(id, icon, label) {
    var b = $(id); if (!b) return;
    var badge = b.querySelector('i'); // giữ huy hiệu số (sổ)
    b.innerHTML = '<span class="ci">' + IC[icon] + '</span>' + (label ? '<span class="bl">' + label + '</span>' : '');
    if (badge) b.appendChild(badge);
    b.classList.add('hbtn');
  }
  iconBtn('btn-note', 'note', 'Sổ'); iconBtn('btn-bag', 'bag', 'Túi'); iconBtn('btn-menu', 'menu', '');
  function syncExtra() {
    var bike = $('btn-bike');
    if (bike && !bike.classList.contains('hbtn')) { bike.innerHTML = '<span class="ci">' + IC.bike + '</span>'; bike.classList.add('hbtn'); bike.title = 'Lên / xuống xe máy (M)'; }
    var S = G.S, cart = $('hud-cart');
    if (cart) cart.parentNode.hidden = cart.hidden;
    var tc = document.querySelector('.hchip-time .ci');
    if (tc && S) { var night = S.era || S.min >= 18 * 60; if (tc.dataset.n !== String(!!night)) { tc.innerHTML = night ? IC.moon : IC.time; tc.dataset.n = String(!!night); } }
  }
  var hud0 = G.ui.hud;
  G.ui.hud = function () { hud0.apply(this, arguments); syncExtra(); };
  $('btn-menu').title = 'Menu (Esc)'; $('btn-note').title = 'Sổ điều tra (J)'; $('btn-bag').title = 'Túi đồ (I)';

  // ---------- nút nhạc: biểu tượng nốt nhạc / gạch chéo ----------
  function musicIcon() {
    var on = !G.audio || G.audio.pref.music, b = $('btn-music');
    if (b) { b.innerHTML = '<span class="ci">' + (on ? IC.music : IC.musicOff) + '</span>'; b.classList.add('hbtn'); b.classList.toggle('off', !on); b.title = on ? 'Tắt nhạc' : 'Bật nhạc'; }
    document.querySelectorAll('.music-toggle').forEach(function (t) { t.innerHTML = '<span class="ci">' + (on ? IC.music : IC.musicOff) + '</span><span>Nhạc: ' + (on ? 'Bật' : 'Tắt') + '</span>'; t.classList.toggle('off', !on); });
  }
  window.addEventListener('load', function () {
    if (G.audio) { var u0 = G.audio.updateButton; G.audio.updateButton = function () { u0.apply(this, arguments); musicIcon(); }; }
    musicIcon();
    // nút màn hình tiêu đề
    var c = $('btn-continue'), n = $('btn-new');
    if (c) c.innerHTML = '<span class="ci">' + IC.play + '</span><span>Chơi tiếp</span>';
    if (n) n.innerHTML = '<span class="ci">' + IC.plus + '</span><span>Chơi mới</span>';
    syncExtra();
  });
})();
