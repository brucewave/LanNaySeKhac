// Bot chơi thử toàn vòng: chạy bằng chính cơ chế game (bấm để đi, nói chuyện, bán hàng, ngủ, lẻn).
// Cách dùng (trong trình duyệt, ở màn tiêu đề):  await (await fetch('tools/playtest.js')).text().then(eval); const r = await PT.run(); r
// Mô phỏng khung hình 1/60 giây nên chạy nhanh hơn thời gian thật; thời lượng ước tính = thời gian mô phỏng + thời gian đọc thoại/thao tác bảng.
(function () {
  var PT = window.PT = {};
  var W = G.world;
  var READ_SEC = 2.5, PANEL_SEC = 12, REACT_SEC = 1.4;
  var st;
  function S() { return G.S; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function note(msg) { st.log.push('[N' + S().day + ' ' + (S().era ? '1996 ' + G.fmtTime(S().pmin % 1440) : G.fmtTime(S().min)) + '] ' + msg); }
  function issue(msg) { st.issues.push(msg); note('!! ' + msg); }

  function frame() {
    if (G.ui.isBusy()) return false;
    if (W.mode === 'sell') G.sell.update(1 / 60); else W.update(1 / 60);
    st.sim += 1 / 60;
    return true;
  }
  async function settle() { // đọc hết thoại, đóng bảng, chờ chuyển cảnh
    for (var g = 0; g < 400; g++) {
      var m = G.ui.modal;
      if (!m) return;
      if (m === 'fade') { await sleep(950); continue; }
      if (m === 'dialog') {
        st.lines++;
        if (document.querySelector('#dialog .choices')) G.ui.choose(st.choice || 0); else G.ui.advance();
        continue;
      }
      if (m === 'ending') { if (st.until && !S().flags[st.until]) { document.querySelector('#ending [data-e="go"]').click(); continue; } return; }
      st.panelT += PANEL_SEC; G.ui.close(m);
    }
  }
  async function idle(sec) { for (var i = 0; i < sec * 60; i++) { if (!frame()) await settle(); } }
  function clientOf(x, y) {
    return W.toClient(x, y);
  }
  async function walkClick(x, y) {
    var c = clientOf(x, y);
    W.clickAt(c[0], c[1]);
    for (var i = 0; i < 60 * 30 && (W.route || W.pending); i++) if (!frame()) break;
    for (var j = 0; j < 4; j++) frame();
    await settle();
  }
  var PRESENT = ['ben_song', 'nha', 'duong', 'cho'], PAST = ['ben_96', 'nha_96', 'duong_96'];
  async function travel(to) {
    for (var n = 0; n < 12 && S().loc !== to; n++) {
      var loc = S().loc, L = G.LOCATIONS[loc];
      // có xe máy: bấm ghim trên bản đồ để đi nhanh giữa các nơi đã tới
      if (S().flags.xe && !S().era && !S().cartOut && PRESENT.indexOf(loc) >= 0 && PRESENT.indexOf(to) >= 0 && (S().visited || {})[to] && W.mode === 'walk' && !G.ui.modal) {
        var pin = document.querySelector('#minimap .mm-node.go[data-loc="' + to + '"]');
        if (!document.getElementById('minimap').classList.contains('big')) document.getElementById('minimap').click();
        G.ui.minimap();
        pin = document.querySelector('#minimap .mm-node.go[data-loc="' + to + '"]');
        if (pin) {
          pin.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          await settle();
          if (S().loc === to) { st.fast++; continue; }
          issue('Bấm ghim ' + to + ' trên bản đồ mà không tới nơi');
        }
      }
      if (to === 'dinh_96') { if (loc === 'ham_96') { await act('thang'); continue; } if (loc !== 'ben_96') { await travel('ben_96'); continue; } await act('tu_96'); continue; }
      if (to === 'ham_96') { if (loc !== 'dinh_96') { await travel('dinh_96'); continue; } await act('nap_ham'); continue; }
      if (to === 'dinh_nay') { if (loc !== 'ben_song') { await travel('ben_song'); continue; } st.choice = 0; await meet('bac_do'); continue; }
      if (loc === 'ham_96') { await act('thang'); continue; }
      if (loc === 'dinh_96') { await act('ben_dinh'); continue; }
      if (loc === 'dinh_nay') { await act('ben_nay'); continue; }
      var chain = L.era ? PAST : PRESENT, i = chain.indexOf(loc), j = chain.indexOf(to);
      await walkClick(j > i ? L.width - 20 : 20, 600);
    }
    if (S().loc !== to) issue('Không tới được ' + to + ' (đang ở ' + S().loc + ')');
  }
  function findThing(id) { return W.things().filter(function (t) { return t.id === id; })[0]; }
  async function act(id, choice) {
    var t = findThing(id);
    if (!t) { issue('Không thấy chỗ tương tác: ' + id + ' ở ' + S().loc); return false; }
    st.choice = choice || 0;
    var px, py;
    if (t.npc) { px = t.nx; py = t.ny - 40; } else if (t.hit) { px = t.hit[0] + t.hit[2] / 2; py = t.hit[1] + t.hit[3] / 2; } else { px = t.x; py = t.y; }
    var c = clientOf(px, py);
    W.clickAt(c[0], c[1]);
    for (var i = 0; i < 60 * 30 && (W.route || W.pending) && !G.ui.isBusy(); i++) frame();
    var opened = G.ui.isBusy() || W.mode === 'sell';
    await settle();
    st.choice = 0;
    if (!opened) issue('Bấm vào ' + id + ' mà không mở tương tác');
    return opened;
  }
  async function waitUntil(min) { while (!S().era && S().min < min) { if (!frame()) await settle(); } }
  async function sleepNight() {
    var d = S().day;
    await travel('nha'); await act('giuong');
    if (G.ui.modal === 'rest' || document.getElementById('rest').hidden === false) {}
    // act đã đóng bảng nghỉ; mở lại và chọn ngủ
    G.ui.rest(); document.querySelector('#rest [data-to="sleep"]').click();
    await sleep(950); await settle();
    if (S().day === d) issue('Ngủ không sang ngày mới');
  }
  async function meet(id) {
    var en = G.npc.entry(id, S().min);
    if (!en) return false;
    await travel(en.loc);
    for (var i = 0; i < 60 * 20 && !(W.ents[id] && !W.ents[id].route.length); i++) if (!frame()) await settle();
    return await act(id);
  }
  async function buyStock() {
    await travel('cho');
    if (!(await act('co_lan'))) return;
    G.ui.shop();
    var sh = document.getElementById('shop');
    var plan = [['tra_da', 12], ['banh_mi', 3], ['nuoc_ngot', 4]];
    plan.forEach(function (p) { for (var k = 0; k < p[1]; k++) { var b = sh.querySelector('[data-a="+"][data-id="' + p[0] + '"]'); if (b) b.click(); } });
    var buy = sh.querySelector('[data-a="buy"]'); if (buy && !buy.disabled) buy.click();
    var cheap = Object.keys(G.UPGRADES).filter(function (u) { return !S().upgrades[u] && S().money >= G.UPGRADES[u].cost + 30; })[0];
    if (cheap) { sh.querySelector('[data-a="up"][data-id="' + cheap + '"]').click(); note('Mua nâng cấp ' + cheap); }
    st.panelT += PANEL_SEC; G.ui.close('shop');
  }
  async function takeCart() { // xe đẩy để ở nhà: phải về lấy mới bày sạp được
    if (S().cartOut || S().era) return;
    await travel('nha');
    var t = findThing('xe_day');
    if (!t) { issue('Không thấy chỗ lấy xe đẩy'); return; }
    var c = clientOf(t.hit[0] + t.hit[2] / 2, t.hit[1] + t.hit[3] / 2);
    W.clickAt(c[0], c[1]);
    for (var i = 0; i < 60 * 30 && (W.route || W.pending); i++) if (!frame()) break;
    await settle();
    if (!S().cartOut) issue('Bấm xe đẩy mà không lấy được xe');
  }
  async function sell(loc, untilMin) {
    if (G.stockTotal(S()) < 3) await buyStock();
    await takeCart();
    await travel(loc);
    if (!(await act({ cho: 'cho_sap', ben_song: 'ben_sap', dinh_nay: 'gio_sap' }[loc]))) return;
    var stats = { served: 0, earn0: S().money, start: S().min }, waitT = 0;
    while (W.mode === 'sell' && S().min < untilMin && G.stockTotal(S()) + G.sell.tray.length > 0) {
      if (!frame()) { await settle(); continue; }
      var f = G.sell.queue()[0];
      if (f && f.state === 'wait') {
        waitT += 1 / 60;
        if (waitT > REACT_SEC) {
          waitT = 0;
          var ok = f.want.every(function (id) { return S().stock[id] >= f.want.filter(function (x) { return x === id; }).length; });
          if (ok) { f.want.forEach(function (id) { G.sell.add(id); }); G.sell.serve(); stats.served++; } else G.sell.decline();
          await settle();
        }
      } else waitT = 0;
    }
    if (W.mode === 'sell') { G.sell.stop(false); await settle(); }
    var rec = st.sales[loc] || (st.sales[loc] = { sessions: 0, served: 0, earned: 0, hours: 0 });
    rec.sessions++; rec.served += stats.served; rec.earned += S().money - stats.earn0; rec.hours += (S().min - stats.start) / 60;
  }
  // Việc phụ của Tùng: bán đủ 5 món thì nhận việc, giao 3 ly trà, quay lại lấy xe máy
  async function sideXe() {
    var s = S();
    if (s.era || s.quests.xe === 'done' || s.stats.sold < 5 || st.xeTries > 40 || s.min > 19 * 60 || W.mode !== 'walk') return;
    st.xeTries++;
    if (!s.quests.xe) {
      if (G.npc.entry('tung', s.min)) { await meet('tung'); await settle(); if (S().quests.xe) note('Nhận việc phụ xe máy của Tùng'); }
      return;
    }
    var left = (s.flags.xe_left || []).slice();
    for (var i = 0; i < left.length; i++) if (G.npc.entry(left[i], S().min)) { await meet(left[i]); await settle(); note('Giao trà cho ' + left[i]); }
    if (!(S().flags.xe_left || []).length && G.npc.entry('tung', S().min)) {
      await meet('tung'); await settle();
      if (S().flags.xe) { note('Nhận xe máy'); st.xeDay = S().day; }
    }
  }
  function deduce(t, e) {
    if (!S().clues[t] || !S().clues[e]) return false;
    var r = G.tryDeduce(t, e); st.panelT += PANEL_SEC;
    if (!r.ok) issue('Đối chiếu ' + t + ' × ' + e + ' không ra'); return r.ok;
  }

  // ---------- xử lý từng mục tiêu ----------
  var H = {
    phong_vy: function () { return act('ban_vy'); },
    nhap_hang: buyStock,
    ban_hang: function () { return sell('cho', Math.max(S().min + 120, 10 * 60 + 30)); },
    quen_ba: async function () {
      var s = S(), r = s.rel.bac_ba || 0, m = s.min;
      if (r >= 3) { if (s.stock.tra_da < 1) await buyStock(); return meet('bac_ba'); }
      if (!s.daily.talk_bac_ba && G.npc.entry('bac_ba', m)) return meet('bac_ba');
      if (m >= 8 * 60 && m < 10 * 60 + 15 && !s.daily.ba_buy_cho) return sell('cho', 10 * 60 + 30);
      if (m >= 15 * 60 && m < 17 * 60 + 15 && !s.daily.ba_buy_ben_song) return sell('ben_song', 17 * 60 + 30);
      if (m < 15 * 60) return sell('ben_song', 15 * 60 + 20);
      if (m < 20 * 60 && !s.daily.ba_buy_duong && s.stock.tra_da >= 2 && G.npc.entry('bac_ba', m)) { st.choice = 0; return meet('bac_ba'); }
      return sleepNight();
    },
    giao_tra: async function () { await travel('ben_song'); return act('cua_nha9'); },
    nha9: function () { return act('ban_go'); },
    hoi_ba: async function () { if (!G.npc.entry('bac_ba', S().min)) return sleepNight(); return meet('bac_ba'); },
    doi_chieu: async function () { if (!S().clues.t_ba_khong_nho) return H.hoi_ba(); deduce('t_ba_khong_nho', 'e_ban_ve'); },
    hoi_ham: function () { return H.hoi_ba(); },
    gap_khai: async function () { if (!G.npc.entry('ong_khai', S().min)) { if (S().min < 7 * 60) return idle(30); if (S().min < 14 * 60) return sell('cho', 14 * 60); return sleepNight(); } return meet('ong_khai'); },
    khai_le: function () { deduce('t_khai_khong_le', 'e_anh_le_hoi'); },
    ai_duyet: async function () {
      var s = S();
      if (!s.clues.t_khai_khong_ham && G.npc.entry('ong_khai', s.min)) { await meet('ong_khai'); }
      if (s.clues.e_bien_ban) { deduce('t_ba_bi_dan', 'e_bien_ban'); deduce('t_khai_khong_ham', 'e_ban_ve'); return; }
      if (s.flags.tung_box) { await travel('ben_song'); return act('thung_giay'); }
      if (G.npc.entry('tung', s.min)) return meet('tung');
      return sleepNight();
    },
    khach_la: async function () {
      if (S().min > 19 * 60 + 15 || S().day <= (S().flags.tea_day || 0)) return sleepNight();
      if (S().min < 16 * 60) return sell('cho', 16 * 60);
      await waitUntil(17 * 60 + 5);
      return sell('ben_song', 19 * 60);
    },
    tim_guong: async function () { await travel('ben_song'); return act('cot_ben'); },
    doi_guong: async function () {
      if (S().clues.t_na_guong) { deduce('t_na_guong', 'e_guong'); return; }
      if (G.npc.entry('be_na', S().min)) return meet('be_na');
      if (S().min < 13 * 60 + 30) return sell('cho', 13 * 60 + 40);
      return sleepNight();
    },
    dung_guong: async function () {
      await travel('nha');
      if (!S().flags.mirror_placed) return act('guong_nha');
      if (S().min < 19 * 60) { await waitUntil(19 * 60 + 2); }
      if (S().min > 20 * 60 + 40) return sleepNight();
      return act('guong_nha');
    },
    dinh96: async function () { if (S().loc === 'nha_96' && !S().clues.e_thu_me) await act('thu_me'); await travel('dinh_96'); if (!S().clues.e_ham_96) await act('chieu_ham'); return act('so_thu_chi'); },
    giau_trang: async function () { await travel('nha_96'); return act('hoc_cay_96'); },
    ve_2026: async function () { await travel('nha_96'); return act('guong_96'); },
    lay_trang: async function () {
      var s = S();
      if (!s.flags.need_tool || s.items.duc || s.items.bua) { await travel('nha'); return act('goc_bang'); }
      if (G.npc.entry('bac_ba', s.min)) return meet('bac_ba');
      return sleepNight();
    },
    doi_tien: async function () {
      if (S().clues.t_khai_tien) { deduce('t_khai_tien', 'e_trang_so'); return; }
      return H.gap_khai();
    },
    dem2: async function () {
      if (S().min < 17 * 60) return sell('cho', 17 * 60 + 5);
      await travel('duong'); return travel('nha');
    },
    dung_guong2: async function () {
      if (S().clues.t_ba_rang && S().clues.e_dau_chan && !S().deduce.q_rang_guong) deduce('t_ba_rang', 'e_dau_chan');
      await travel('nha');
      if (S().min < 19 * 60) await waitUntil(19 * 60 + 2);
      if (S().min > 20 * 60 + 40) return sleepNight();
      return act('guong_nha');
    },
    n2_dinh: function () { return travel('dinh_96'); },
    n2_chieng: async function () {
      var t0 = st.fails;
      await act('chieng');
      for (var i = 0; i < 60 * 25 && !S().flags.mom_escaped; i++) if (!frame()) await settle();
    },
    n2_kho: function () { return act('xa_nha'); },
    ch2_lan: async function () { if (!G.npc.entry('co_lan', S().min)) return sleepNight(); return meet('co_lan'); },
    ch2_nam: async function () {
      var m = S().min;
      if (m >= 9 * 60 && m < 10 * 60 + 45 && G.npc.entry('ba_nam', m) && Math.random() < 0.5) return meet('ba_nam');
      if (m < 10 * 60 + 30) return sell('cho', 11 * 60);
      return sleepNight();
    },
    ch2_loc: function () { if (!deduce('t_nam_con', 'e_nghe_96')) issue('Thiếu nghe lén đêm 1 để đối chiếu với bà Năm'); },
    ch2_dem3: async function () {
      await travel('nha');
      if (S().min < 19 * 60) await waitUntil(19 * 60 + 2);
      if (S().min > 20 * 60 + 40) return sleepNight();
      return act('guong_nha');
    },
    ch2_theo_vy: async function () {
      await travel('duong_96');
      for (var i = 0; i < 60 * 30 && !S().flags.n3_seen; i++) if (!frame()) await settle();
    },
    ch2_ve3: async function () { await travel('nha_96'); return act('guong_96'); },
    ch2_doi_lan: function () { deduce('t_lan_dem', 'e_vy_lan_96'); },
    ch2_hop: async function () { if (!G.npc.entry('co_lan', S().min)) return sleepNight(); return meet('co_lan'); },
    ch2_te: async function () { deduce('t_thu_vy', 'e_danh_sach'); deduce('t_thu_vy', 'e_anh_le_hoi'); },
    ch3_ba: async function () { if (!G.npc.entry('bac_ba', S().min)) return sleepNight(); return meet('bac_ba'); },
    ch3_riu: async function () { await travel('duong'); return act('riu_xuong'); },
    ch3_dinh: async function () {
      var s = S(), gio = s.day === s.flags.gio_day;
      if (s.min > 18 * 60 || s.min < 6 * 60 + 5) return sleepNight();
      if (!gio && s.day < s.flags.gio_day) return sleepNight(); // đợi tới ngày giỗ để bán ở đình cũ
      if (gio && s.min < 11 * 60 && !st.gioSold) { st.gioSold = true; await sell('dinh_nay', 11 * 60 + 30); }
      await travel('dinh_nay'); if (!s.clues.e_bia) await act('bia'); if (!s.clues.e_chot) await act('nen_tho');
      if (!s.clues.t_khai_yen && G.world.ents.khai_gio) await act('khai_gio');
    },
    ch3_khai: async function () {
      if (S().clues.t_khai_yen) { deduce('t_khai_yen', 'e_bia'); return; }
      return H.gap_khai();
    },
    ch3_doi_riu: function () { deduce('t_ba_riu', 'e_chot'); },
    ch3_dem4: function () { return H.ch2_dem3(); },
    ch3_rang: async function () { await travel('ben_96'); return act('rang_96'); },
    ch3_ham: async function () { await travel('dinh_96'); return act('nap_ham'); },
    ch3_bia: async function () { if (!S().clues.e_dep_loc) await act('bao'); return act('bia_da'); },
    ch3_thoat: function () { return act('thang'); },
    ch3_tra: async function () { if (S().items.riu_96) { await travel('ben_96'); await act('rang_96'); } await travel('nha_96'); return act('guong_96'); },
    ch3_phong: function () { deduce('t_thu_vy', 'e_bia_da'); deduce('t_nam_con', 'e_dep_loc'); },
    ch4_lan: async function () { if (!G.npc.entry('co_lan', S().min)) return sleepNight(); return meet('co_lan'); },
    ch4_dem5: function () { return H.ch2_dem3(); },
    ch4_rang: async function () { await travel('ben_96'); return act('rang_96'); },
    ch4_le: async function () { await travel('ben_96'); return act('rang_96'); },
    ch4_vy: function () { return act('day_vy'); },
    ch4_lua: async function () { await walkClick(352, 600); await walkClick(760, 600); return act('cot_den'); }, // đi vòng sát bờ sông, tránh vùng nhìn
    ch4_ham: function () { return act('xuong_ham15'); },
    ch4_me: function () { return act('chot_me'); },
    ch4_doi: function () { deduce('t_thu_vy', 'e_flash'); deduce('t_lan_chay', 'e_lua'); },
    ct_guong: function () { return H.ch2_dem3(); },
    ct_go: async function () { await walkClick(300, 520); return act('goi_vy'); },
    ct_vy: function () { return act('khe'); },
    ct_bia: async function () { await walkClick(820, 420); return act('bia_sau'); },
    ct_chot: async function () { if (!S().items.chot_gay) await act('chot_gay'); return act('lo_dn'); },
    ct_cong: async function () { st.panelT += 20; await walkClick(300, 520); return act('goc_tn'); }, // xem bản vẽ trong Sổ rồi chọn góc tây nam
    ct_ra: function () { return act('cong_ra'); },
    ct_ve: async function () { await travel('nha_96'); return act('guong_96'); },
    ket_nha: async function () { await travel('nha'); return act('me_nay'); },
    ket_an: async function () {
      if (!G.npc.entry('can_bo', S().min)) return sleepNight();
      await meet('can_bo'); await settle();
      if (G.ui.modal !== 'case') { G.acts['case'](); await settle(); }
      var p = document.getElementById('case');
      G.CASE_CLAIMS.forEach(function (c) {
        p.querySelector('[data-c="' + c.id + '"]').click();
        var k = c.ok.filter(function (x) { return S().clues[x]; })[0];
        if (!k) { issue('Thiếu chứng cứ cho ý ' + c.id); return; }
        var b = p.querySelector('[data-e="' + k + '"]'); if (b) b.click();
      });
      st.panelT += 40;
      p.querySelector('[data-a="close"]').click(); await settle();
    },
    ket_sap: function () { return sell('cho', Math.min(S().min + 60, 20 * 60)); },
    ket_ben: async function () { if (S().min < 17 * 60) await waitUntil(17 * 60 + 2); if (S().min > 20 * 60) return sleepNight(); await travel('ben_song'); return act('cot_ben2'); },
    nang_cap: async function () {
      var need = Math.min.apply(null, Object.keys(G.UPGRADES).map(function (u) { return G.UPGRADES[u].cost; }));
      if (S().money < need) return sell(S().min < 12 * 60 ? 'cho' : 'ben_song', Math.min(S().min + 180, 20 * 60));
      await travel('cho'); await act('co_lan'); G.ui.shop();
      var b = document.querySelector('#shop [data-a="up"]:not([disabled])'); if (b) b.click(); G.ui.close('shop');
    }
  };

  function currentObj() {
    var s = S();
    for (var i = 0; i < G.OBJECTIVES.length; i++) {
      var o = G.OBJECTIVES[i];
      if ((o.era || null) !== (s.era || null) && o.id !== 'het') continue;
      if (o.id === 'het' && s.era) continue;
      if (!o.done(s)) return o;
    }
  }

  PT.run = async function (opts) {
    opts = opts || {};
    st = { sim: 0, lines: 0, panelT: 0, log: [], issues: [], sales: {}, per: {}, fails: 0, fast: 0, xeTries: 0 };
    try { localStorage.removeItem(G.SAVE_KEY); } catch (e) {}
    G.mini.auto = true; // minigame: bot coi như thắng
    if (G.chase) G.chase.auto = true; // cảnh truy đuổi: bot coi như chạy thoát
    G.start(null);
    await settle();
    var origFail = G.danger.fail;
    G.danger.fail = function (m) { st.fails++; issue('Thất bại cảnh nguy hiểm: ' + m); origFail(m); };
    var last = null, same = 0, steps = 0;
    while (steps++ < (opts.maxSteps || 400)) {
      var until = st.until = opts.until || (opts.chapter2 ? 'ch2_end' : 'demo_end');
      if (S().flags[until]) break;
      if (G.ui.modal === 'ending') document.querySelector('#ending [data-e="go"]').click();
      var o = currentObj();
      if (!o || o.id === 'het') break;
      if (o.id !== last) {
        if (last) { var p = st.per[last]; p.end = st.sim + st.lines * READ_SEC + st.panelT; }
        st.per[o.id] = { start: st.sim + st.lines * READ_SEC + st.panelT, day: S().day };
        note('Mục tiêu: ' + o.id); last = o.id; same = 0;
      }
      if (++same > 25) { issue('Kẹt ở mục tiêu ' + o.id + ' quá 25 lượt'); break; }
      if (!H[o.id]) { issue('Bot chưa biết làm mục tiêu ' + o.id); break; }
      await sideXe();
      await settle();
      if (currentObj() !== o) continue;
      await H[o.id]();
      await settle();
    }
    if (last && st.per[last]) st.per[last].end = st.sim + st.lines * READ_SEC + st.panelT;
    G.danger.fail = origFail;
    var total = st.sim + st.lines * READ_SEC + st.panelT;
    var per = {};
    Object.keys(st.per).forEach(function (k) { per[k] = Math.round(((st.per[k].end || total) - st.per[k].start) / 6) / 10 + ' phút (ngày ' + st.per[k].day + ')'; });
    return {
      ketThuc: !!S().flags.demo_end, ngay: S().day, tien: S().money, daBan: S().stats.sold,
      phutMoPhong: Math.round(st.sim / 6) / 10, dongThoai: st.lines, phutUocTinh: Math.round(total / 6) / 10,
      theoMucTieu: per, banHang: st.sales, thatBaiNguyHiem: st.fails,
      xeMay: S().flags.xe ? 'có xe từ ngày ' + st.xeDay : 'chưa có (việc phụ: ' + (S().quests.xe || 'chưa nhận') + ')', diNhanh: st.fast,
      canhHu: Object.keys(S().seen).filter(function (k) { return k.indexOf('scare_') === 0; }).map(function (k) { return k.slice(6); }),
      manhMoi: Object.keys(S().clues).length, doiChieu: Object.keys(S().deduce).length + '/' + G.DEDUCTIONS.length,
      vanDe: st.issues, nhatKy: st.log
    };
  };
})();

// Kiểm tra đi thật: từ nhiều điểm xuất phát, bấm vào từng chỗ tương tác, mô phỏng bước đi, xem có tới nơi không.
PT.reach = function () {
  var W = G.world, S = G.S, out = [], saved = JSON.stringify(S);
  var starts = [[60, 600], [480, 600], [900, 600], [480, 470], [300, 700], [700, 500]];
  Object.keys(G.LOCATIONS).forEach(function (id) {
    var L = G.LOCATIONS[id];
    S.era = L.era || null; S.pnight = 1;
    S.flags.door9_open = true;
    W.enter(id, 480, 600);
    var things = L.things.filter(function (t) { return t.act !== 'sell' || true; });
    var from = starts.concat(things.map(function (t) { return [t.x, t.y]; })); // thêm: đi từ chỗ tương tác này sang chỗ khác
    from.forEach(function (sp) {
      if (W.blocked(sp[0], sp[1]) || sp[1] > L.height - 10) return;
      things.forEach(function (t) {
        S.x = sp[0]; S.y = sp[1]; W.route = G.path.find(S.x, S.y, t.x, t.y); W.pending = null; W.exitAfter = null; W.stuckT = 0;
        if (!W.route) { out.push(id + ':' + t.id + ' không có đường từ ' + sp); return; }
        for (var i = 0; i < 60 * 20 && W.route; i++) {
          if (G.ui.isBusy()) { G.ui.close(G.ui.modal); }
          W.update(1 / 60);
          if (S.loc !== id) break;
        }
        if (S.loc !== id) { W.enter(id, 480, 600); out.push(id + ':' + t.id + ' lỡ đi ra khỏi cảnh từ ' + sp); return; }
        var d = Math.hypot(t.x - S.x, (t.y - S.y) * 1.3);
        if (d > 62) out.push(id + ':' + t.id + ' kẹt cách ' + Math.round(d) + 'px, từ ' + sp + ' (dừng ở ' + Math.round(S.x) + ',' + Math.round(S.y) + ')');
      });
    });
  });
  G.S = JSON.parse(saved); W.enter(G.S.loc, G.S.x, G.S.y);
  return out;
};
