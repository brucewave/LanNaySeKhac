// Sổ điều tra: xem manh mối (sự thật quan sát / lời khai), tự chọn một lời khai và một vật chứng để đối chiếu, xem các câu hỏi đã mở.
var G = window.G || (window.G = {});

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var tab = 'clues', selT = null, selE = null, focus = null, result = null;

  function when(r) { return r.era ? 'Đêm mùng ' + ((G.NIGHT_DAY || {})[r.night] || 8) + '/8/1996, ' + G.fmtTime(r.min % 1440) : 'Ngày ' + r.day + ', ' + G.fmtTime(r.min); }
  function chip(id) {
    var st = G.clueStatus(id), r = G.S.clues[id];
    if (st === 'contra') return '<i class="chip contra">mâu thuẫn</i>';
    if (st === 'match') return '<i class="chip match">khớp</i>';
    if (r.isNew) return '<i class="chip new">mới</i>';
    return '';
  }
  function list(kind) {
    var S = G.S, ids = Object.keys(S.clues).filter(function (k) { return G.CLUES[k] && G.CLUES[k].kind === kind; });
    ids.sort(function (a, b) { return (S.clues[a].day * 1440 + S.clues[a].min) - (S.clues[b].day * 1440 + S.clues[b].min); });
    if (!ids.length) return '<p class="empty">' + (kind === 'tm' ? 'Chưa ghi được lời khai nào. Trò chuyện với mọi người.' : 'Chưa có vật chứng. Quan sát quanh xóm.') + '</p>';
    var sel = kind === 'tm' ? selT : selE;
    return ids.map(function (k) {
      var c = G.CLUES[k];
      return '<button class="cl-item' + (k === sel ? ' sel' : '') + '" data-k="' + k + '">' +
        (c.who ? '<small>' + c.who + '</small>' : '') + '<span>' + c.title + '</span>' + chip(k) + '</button>';
    }).join('');
  }
  function detail(id) {
    if (!id) return '<p class="empty">Bấm một mục để xem chi tiết. Chọn <b class="hl">1 lời khai</b> và <b class="hl">1 vật chứng</b> rồi bấm Đối chiếu.</p>';
    var c = G.CLUES[id], r = G.S.clues[id];
    return (c.img && G.CLOSEUPS && G.CLOSEUPS[c.img] ? '<div class="nb-img">' + G.CLOSEUPS[c.img]() + '</div>' : '') + '<h4>' + c.title + '</h4><p class="ctext">' + G.ui.fmt(c.text) + '</p>' +
      '<dl><dt>' + (c.kind === 'tm' ? 'Người nói' : 'Nguồn') + '</dt><dd>' + (c.kind === 'tm' ? c.who : (r.source || c.source)) + '</dd>' +
      '<dt>Nơi</dt><dd>' + (r.loc || c.loc) + '</dd><dt>Lúc ghi</dt><dd>' + when(r) + '</dd>' +
      '<dt>Liên quan</dt><dd>' + c.people.join(', ') + '</dd>' +
      '<dt>Trạng thái</dt><dd>' + ({ contra: 'Đã đối chiếu: mâu thuẫn', match: 'Đã đối chiếu: khớp' }[G.clueStatus(id)] || 'Chưa đối chiếu') + '</dd></dl>' +
      (c.kind === 'tm' ? '<p class="note">Lời khai là điều người khác nói, có thể đúng hoặc sai.</p>' : '<p class="note">Vật chứng là điều tôi tự thấy.</p>');
  }

  function render() {
    var S = G.S;
    var nq = Object.keys(S.deduce).length;
    var h = '<h2>Sổ điều tra</h2><div class="tabs"><button data-tab="clues" class="' + (tab === 'clues' ? 'on' : '') + '">Manh mối</button>' +
      '<button data-tab="qs" class="' + (tab === 'qs' ? 'on' : '') + '">Câu hỏi & suy đoán (' + nq + ')</button></div>';
    if (tab === 'clues') {
      h += '<div class="nb-cols"><div><h3>Lời khai</h3>' + list('tm') + '</div><div><h3>Vật chứng & quan sát</h3>' + list('ev') + '</div></div>';
      h += '<div class="nb-detail">' + detail(focus) + '</div>';
      h += '<div class="nb-match"><span>' + (selT ? G.CLUES[selT].title : '— chọn lời khai —') + ' <b>×</b> ' + (selE ? G.CLUES[selE].title : '— chọn vật chứng —') + '</span>' +
        '<button class="primary" data-a="match"' + (selT && selE ? '' : ' disabled') + '>Đối chiếu</button></div>';
      if (result) h += '<div class="nb-result ' + result.cls + '">' + result.html + '</div>';
    } else {
      var done = G.DEDUCTIONS.filter(function (d) { return S.deduce[d.id]; });
      h += done.length ? done.map(function (d) {
        return '<div class="nb-q"><h4 class="' + d.type + '">' + (d.type === 'contra' ? 'Mâu thuẫn: ' : 'Khớp: ') + d.title + '</h4>' +
          '<p><b>Sự thật:</b> ' + d.fact + '</p><p class="guess"><b>Suy đoán của tôi:</b> ' + d.guess + '</p>' +
          '<small>' + G.CLUES[d.t].title + ' × ' + G.CLUES[d.e].title + ' · ' + when(S.deduce[d.id]) + '</small></div>';
      }).join('') : '<p class="empty">Chưa có câu hỏi nào. Đối chiếu một lời khai với một vật chứng để mở câu hỏi.</p>';
    }
    h += '<button class="close" data-a="close">Đóng</button>';
    $('notebook').innerHTML = h;
  }

  G.ui.notebook = function () {
    result = null;
    $('notebook').hidden = false;
    G.ui.modal = 'notebook';
    render();
    $('notebook').onclick = function (e) {
      var b = e.target.closest('button');
      if (!b || b.disabled) return;
      var S = G.S;
      if (b.dataset.tab) { tab = b.dataset.tab; result = null; }
      else if (b.dataset.k) {
        var k = b.dataset.k, c = G.CLUES[k];
        if (c.kind === 'tm') selT = selT === k ? null : k; else selE = selE === k ? null : k;
        focus = k; S.clues[k].isNew = false; result = null;
      } else if (b.dataset.a === 'match') {
        var r = G.tryDeduce(selT, selE);
        if (r.ok) {
          result = { cls: r.d.type, html: '<b>' + (r.d.type === 'contra' ? 'Mâu thuẫn!' : 'Khớp!') + '</b> ' + r.d.title + (r.fresh ? ' <i>(câu hỏi mới)</i>' : ' <i>(đã ghi từ trước)</i>') +
            '<p class="guess">Suy đoán: ' + r.d.guess + '</p>' };
          if (r.fresh) G.ui.toast('Mở câu hỏi mới: **' + r.d.title + '**', 3500);
        } else result = { cls: 'miss', html: '<b>Chưa ra gì.</b> ' + G.ui.fmt(r.msg) };
      } else if (b.dataset.a === 'close') {
        $('notebook').hidden = true; G.ui.modal = null; G.ui.hud();
        return;
      }
      render();
      G.ui.hud();
    };
  };

  G.ui.newClues = function () {
    var S = G.S, n = 0;
    for (var k in S.clues) if (S.clues[k].isNew) n++;
    return n;
  };
})();
