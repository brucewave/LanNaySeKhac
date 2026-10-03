// Tìm đường cho bấm-để-đi: lưới ô 16px dựng từ vùng va chạm, A* 8 hướng, rồi làm mượt bằng kiểm tra tầm nhìn.
var G = window.G || (window.G = {});
G.path = {};

(function () {
  var P = G.path, CELL = 16;

  P.build = function (L) {
    P.cols = Math.ceil(L.width / CELL); P.rows = Math.ceil(L.height / CELL);
    P.grid = new Uint8Array(P.cols * P.rows);
    for (var r = 0; r < P.rows; r++)
      for (var c = 0; c < P.cols; c++)
        P.grid[r * P.cols + c] = G.world.blocked(c * CELL + CELL / 2, r * CELL + CELL / 2 + 6) ? 1 : 0;
  };

  function free(c, r) { return c >= 0 && r >= 0 && c < P.cols && r < P.rows && !P.grid[r * P.cols + c]; }
  function cellOf(x, y) { return [Math.floor(x / CELL), Math.floor((y - 6) / CELL)]; }
  function center(c, r) { return { x: c * CELL + CELL / 2, y: r * CELL + CELL / 2 + 6 }; }

  // ô trống gần nhất quanh điểm đích (nếu đích nằm trong vật cản)
  function nearestFree(c, r) {
    if (free(c, r)) return [c, r];
    for (var rad = 1; rad < 10; rad++)
      for (var dr = -rad; dr <= rad; dr++)
        for (var dc = -rad; dc <= rad; dc++)
          if ((Math.abs(dr) === rad || Math.abs(dc) === rad) && free(c + dc, r + dr)) return [c + dc, r + dr];
    return null;
  }

  // đi thẳng được từ a tới b không
  P.clear = function (a, b) {
    var d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.ceil(d / 8);
    for (var i = 1; i <= n; i++) {
      var t = i / n;
      if (G.world.blocked(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false;
    }
    return true;
  };

  // Trả về danh sách điểm (tọa độ thế giới) từ (sx,sy) tới gần (tx,ty), hoặc null nếu không tới được
  P.find = function (sx, sy, tx, ty) {
    var s = nearestFree.apply(null, cellOf(sx, sy)), t = nearestFree.apply(null, cellOf(tx, ty));
    if (!s || !t) return null;
    var C = P.cols, N = C * P.rows, start = s[1] * C + s[0], goal = t[1] * C + t[0];
    var g = new Float32Array(N).fill(1e9), from = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
    var heap = [[0, start]];
    g[start] = 0;
    function push(f, i) {
      heap.push([f, i]);
      var k = heap.length - 1;
      while (k > 0) { var p = (k - 1) >> 1; if (heap[p][0] <= heap[k][0]) break; var tmp = heap[p]; heap[p] = heap[k]; heap[k] = tmp; k = p; }
    }
    function pop() {
      var top = heap[0], last = heap.pop();
      if (heap.length) {
        heap[0] = last; var k = 0;
        for (;;) {
          var l = k * 2 + 1, r = l + 1, m = k;
          if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
          if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
          if (m === k) break;
          var tmp = heap[m]; heap[m] = heap[k]; heap[k] = tmp; k = m;
        }
      }
      return top;
    }
    var gx = t[0], gy = t[1];
    while (heap.length) {
      var cur = pop()[1];
      if (cur === goal) break;
      if (closed[cur]) continue;
      closed[cur] = 1;
      var cx = cur % C, cy = (cur - cx) / C;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        var nx = cx + dx, ny = cy + dy;
        if (!free(nx, ny)) continue;
        if (dx && dy && (!free(cx + dx, cy) || !free(cx, cy + dy))) continue; // không cắt góc tường
        var ni = ny * C + nx, ng = g[cur] + (dx && dy ? 1.414 : 1);
        if (ng < g[ni]) {
          g[ni] = ng; from[ni] = cur;
          var h = Math.max(Math.abs(nx - gx), Math.abs(ny - gy)) + 0.414 * Math.min(Math.abs(nx - gx), Math.abs(ny - gy));
          push(ng + h, ni);
        }
      }
    }
    if (from[goal] === -1 && goal !== start) return null;
    var cells = [];
    for (var i = goal; i !== -1; i = from[i]) cells.push(center(i % C, (i - i % C) / C));
    cells.reverse();
    // làm mượt: từ mỗi điểm nhảy tới điểm xa nhất còn nhìn thấy
    var out = [], a = { x: sx, y: sy }, k = 0;
    while (k < cells.length) {
      var far = k;
      for (var j = cells.length - 1; j > k; j--) if (P.clear(a, cells[j])) { far = j; break; }
      out.push(cells[far]); a = cells[far]; k = far + 1;
    }
    return out;
  };
})();
