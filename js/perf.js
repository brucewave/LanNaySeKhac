// Đồ hoạ "Mượt" cho điện thoại: tắt nét run tay (feTurbulence) trên nhân vật, đứng yên hiệu ứng trong ảnh nền,
// bớt sương / lá / thiêu thân, lớp tối ban đêm vẽ nửa độ phân giải và thưa hơn, bớt bụi chân.
// Mặc định bật trên máy cảm ứng; đổi trong menu (lưu localStorage lnsk_gfx = lite | full).
var G = window.G || (window.G = {});

(function () {
  var touch = ('ontouchstart' in window) || window.matchMedia('(pointer:coarse)').matches;
  var pref = null;
  try { pref = localStorage.getItem('lnsk_gfx'); } catch (e) {}
  G.lite = pref ? pref === 'lite' : touch;
  function apply() { document.body.classList.toggle('lite', !!G.lite); if (G.ambience && G.S && G.LOCATIONS[G.S.loc]) G.ambience.rebuild(); }
  if (document.body) apply(); else document.addEventListener('DOMContentLoaded', apply);
  G.setLite = function (on) {
    G.lite = !!on;
    try { localStorage.setItem('lnsk_gfx', G.lite ? 'lite' : 'full'); } catch (e) {}
    apply();
  };

  // nút trong menu; màn dọc: vào cảnh nào thì zoom theo chiều cao cảnh đó
  window.addEventListener('load', function () {
    var enter0 = G.onEnter;
    G.onEnter = function (id) {
      if (enter0) enter0(id);
      if (G.portrait && G.world.mode !== 'sell') { G.world.zoom = G.world.baseZoom(); G.world.updateCamera(true); }
    };
    var menu0 = G.ui.menu;
    G.ui.menu = function () {
      menu0.apply(this, arguments);
      var list = document.querySelector('#menu .list');
      if (!list) return;
      var b = document.createElement('button');
      var label = function () { b.textContent = 'Đồ hoạ: ' + (G.lite ? 'Mượt (điện thoại)' : 'Đẹp'); };
      label();
      b.onclick = function (e) { e.stopPropagation(); G.setLite(!G.lite); label(); };
      list.insertBefore(b, list.querySelector('[data-m="help"]'));
    };
  });
})();
