// Lịch sinh hoạt NPC: theo giờ trong ngày, NPC đi tới chỗ của mình, rời cảnh khi tới giờ đi nơi khác.
// Đường đi đơn giản: xuống lòng đường (y=600) rồi đi ngang, nên không xuyên tường.
var G = window.G || (window.G = {});
G.npc = {};

(function () {
  var N = G.npc;
  var WALK = 115, ROAD_Y = 600;

  N.entry = function (id, min) {
    if (G.NPCS[id].cond && !G.NPCS[id].cond(G.S)) return null;
    var sc = G.NPCS[id].schedule, cur = null;
    for (var i = 0; i < sc.length; i++) if (sc[i].from <= min) cur = sc[i];
    return cur && cur.loc ? cur : null;
  };

  function spawn(id, en, instant) {
    var W = G.world, L = G.LOCATIONS[G.S.loc];
    var e = W.makeEnt(G.NPCS[id].look, ['front', 'side', 'back'], 'npc ' + (G.NPCS[id].cls || ''));
    var o = { id: id, e: e, en: en, route: [], leaving: false };
    if (instant) W.place(e, en.x, en.y, en.view || 'front', 1);
    else {
      var fromLeft = en.x < L.width / 2;
      W.place(e, fromLeft ? -30 : L.width + 30, ROAD_Y, 'side', fromLeft ? 1 : -1);
      o.route = [{ x: en.x, y: ROAD_Y }, { x: en.x, y: en.y }];
    }
    W.ents[id] = o;
    return o;
  }

  // Gọi khi vào cảnh: đặt sẵn NPC đang ở cảnh này
  N.enterScene = function () {
    for (var id in G.NPCS) {
      var en = N.entry(id, G.S.min);
      if (en && en.loc === G.S.loc) spawn(id, en, true);
    }
  };

  N.update = function (dt) {
    var S = G.S, W = G.world, L = G.LOCATIONS[S.loc];
    for (var id in G.NPCS) {
      var en = N.entry(id, S.min), o = W.ents[id];
      var here = en && en.loc === S.loc;
      if (here && !o) o = spawn(id, en, false);
      if (!o) continue;
      // dấu chấm than vàng: người này đang cần gặp trong nhiệm vụ
      var q = !!(G.NPCS[id].quest && G.NPCS[id].quest(S)) && !o.leaving && (!G.showQuest || G.showQuest(id));
      if (q !== o.q) {
        o.q = q;
        if (!o.qm) { o.qm = document.createElement('div'); o.qm.className = 'qmark'; o.qm.textContent = '!'; o.e.el.appendChild(o.qm); }
        o.qm.hidden = !q;
      }
      if (o.busy) continue; // busy: đang xếp hàng mua ở sạp
      if (here && o.en !== en && !o.leaving) { // đổi chỗ trong cùng cảnh
        o.en = en; o.route = [{ x: o.e.x, y: ROAD_Y }, { x: en.x, y: ROAD_Y }, { x: en.x, y: en.y }];
      }
      if (!here && !o.leaving && G.NPCS[id].vanish) { o.e.el.remove(); delete W.ents[id]; continue; } // hồn ma: biến mất tại chỗ
      if (!here && !o.leaving) {
        o.leaving = true;
        var ex = o.e.x < L.width / 2 ? -40 : L.width + 40;
        o.route = [{ x: o.e.x, y: ROAD_Y }, { x: ex, y: ROAD_Y }];
      }
      if (o.route.length) {
        var p = o.route[0], dx = p.x - o.e.x, dy = p.y - o.e.y, d = Math.hypot(dx, dy), st = WALK * dt;
        if (d <= st) { o.e.x = p.x; o.e.y = p.y; o.route.shift(); }
        else { o.e.x += dx / d * st; o.e.y += dy / d * st; }
        var view = Math.abs(dx) > Math.abs(dy) ? 'side' : (dy > 0 ? 'front' : 'back');
        W.place(o.e, o.e.x, o.e.y, view, dx < 0 ? -1 : 1);
        o.e.el.classList.add('walk');
        if (!o.route.length) {
          if (o.leaving) { o.e.el.remove(); delete W.ents[id]; continue; }
          o.e.el.classList.remove('walk');
          W.place(o.e, o.e.x, o.e.y, o.en.view || 'front', 1);
        }
      }
    }
  };

  // NPC đang đứng yên ở chỗ của mình thì nói chuyện được; trả về điểm người chơi cần đứng
  N.things = function () {
    var out = [], W = G.world;
    for (var id in W.ents) {
      var o = W.ents[id];
      var d = G.NPCS[id];
      if (o.leaving || o.route.length || o.busy || d.act === 'none') continue;
      out.push({ id: id, npc: id, x: o.e.x + (o.en.ax || 0), y: o.e.y + (o.en.ay === undefined ? 40 : o.en.ay),
        nx: o.e.x, ny: o.e.y, label: d.label, act: d.act });
    }
    return out;
  };
})();
