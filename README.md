# Lần Này Sẽ Khác — bản chơi thử

Game HTML + JS thuần, góc nhìn chéo từ trên xuống, hình vẽ SVG theo mẫu `nhan-vat-chibi-v3.svg`. Không cần cài thư viện.

## Chạy
Mở bằng một server tĩnh (trình duyệt chặn lưu game khi mở file trực tiếp ở một số chế độ):

    python -m http.server 8123

rồi vào http://localhost:8123

## Điều khiển
- Bấm / chạm vào cảnh: nhân vật tự tìm đường tới đó. Bấm vào người hoặc đồ vật thì đi lại rồi tương tác. Bấm sát mép để sang cảnh bên.
- Máy tính: WASD hoặc phím mũi tên đi 8 hướng · E/Space tương tác · Esc menu · J sổ điều tra · I túi đồ · 1/2 chọn trong hội thoại. Khi bán: 1/2/3 chọn món, Space giao, Backspace bỏ khay, X từ chối, Q đóng sạp.
- Điện thoại xoay ngang: chạm và kéo nửa trái màn hình để đi (cần điều khiển ảo), nút tương tác bên phải, ☰ menu, bấm trực tiếp khi bán.
- Điện thoại cầm dọc (`body.portrait`, tự bật khi màn cao hơn rộng): sân khấu ngang 540, cao theo máy (760–1240). Cảnh ở trên (zoom `G.world.baseZoom()`), bàn điều khiển cao `G.DECK` = 290 ở dưới: dòng ngày / giờ / tiền, cần điều khiển, nút tương tác; hội thoại và thanh bán hàng (2 tầng) nằm trong bàn điều khiển. Cảnh phim hiện khung ngang ở giữa. Đang mở bảng thì ẩn cần điều khiển (`body.busy`).
- Đồ hoạ Mượt (`js/perf.js`, `body.lite`, mặc định bật trên máy cảm ứng, đổi trong menu > Đồ hoạ): tắt nét run tay (feTurbulence) trên nhân vật, đứng yên hiệu ứng trong ảnh nền / đồ vật, bỏ sương / lá / thiêu thân, lớp tối ban đêm vẽ nửa độ phân giải và 8 lần/giây khi đi, bỏ bụi chân. Mọi máy: HUD ghi 5 lần/giây và chỉ khi chữ đổi, lớp màu trời chỉ ghi khi đổi.

## Đã có (bước 1–2 của đặc tả)
- 4 địa điểm hiện tại: Bến sông – Nhà cũ – Đường xóm – Chợ, nối bằng con đường chạy ngang. Nhà cũ, tạp hoá, nhà chợ bỏ mái để thấy bên trong; có va chạm tường và đồ vật, nhân vật và vật đứng sắp lớp theo chiều sâu.
- Đồng hồ ngày sáng/chiều/tối, dừng khi mở bảng; chờ/ngủ ở nhà; 21:00 tự hết ngày.
- Nhập 3 món ở cô Lan, sức chứa xe, hàng dùng trong ngày ghi rõ và bỏ cuối ngày.
- Phiên bán ở chợ / bến sông: khách theo nhóm, món theo giờ, xếp hàng, kiên nhẫn, giao sai, tiền boa, đóng sạp chủ động, tóm tắt.
- 2 nâng cấp có tác dụng thật (Thùng đá lớn, Ô che sạp), hiện lên trên xe.
- Gói hàng khởi động khi hết vốn; lưu tay và tự lưu mỗi sáng.

## Bước 3 (đã có)
- 5 NPC có lịch theo giờ: cô Lan (chợ), bác Tư lái đò (bến), bác Ba thợ mộc (sáng xưởng → 8:00 chợ → 10:30 xưởng → 15:00 bến → 17:30 xưởng), Tùng shipper, bé Na (chiều tối).
- Hội thoại có điều kiện theo tiến độ, đồ đang giữ, mức thân quen; có lựa chọn.
- Khách quen: bác Ba tự ra sạp gọi hai ly trà khi người chơi bán đúng chỗ đúng giờ, hoặc mua trực tiếp khi nói chuyện.
- Đơn giao "Ly trà thứ hai": thân với bác Ba → mang ly trà tới nhà số 9 cuối bến sông → cửa mở → bản vẽ đình có hầm bị giấu → quay lại hỏi bác Ba.
- Túi đồ: hàng, đồ quan trọng (không bán được), người quen.

## Bước 4 (đã có)
- Sổ điều tra (nút Sổ / phím J): vật chứng & quan sát tách khỏi lời khai; mỗi mục có nội dung, nguồn, nơi, lúc ghi, người liên quan, trạng thái đối chiếu.
- Chọn 1 lời khai × 1 vật chứng → Đối chiếu: mâu thuẫn hoặc khớp mở câu hỏi mới kèm "suy đoán của tôi"; ghép sai có gợi ý, không mất gì.
- 6 vật chứng, 6 lời khai, 5 phép đối chiếu đúng. NPC thứ 6: ông Khải (trưởng ban quản lý đình).
- Bản vẽ đình có 2 đường lấy: nhà số 9 (qua bác Ba) hoặc thùng giấy ông Khải đem bỏ (qua Tùng).
- Ảnh lễ hội 1996 trên bàn học của Vy (mở đầu điều tra).

## Bước 5 (đã có) — js/era96.js
- Ông lão mũ cối (hồn ông Rạng) xuất hiện chiều tối ở bến sông sau khi giao trà, chỉ chỗ giấu gương dưới bến.
- Đối chiếu lời bé Na × chiếc gương mới dùng được gương; đặt gương lên tủ, sau 19:00 nghe lời nhắn của Vy rồi qua gương.
- Đêm mốc 1 (mùng 8/8/1996): 3 khu quá khứ (nhà cũ, bến sông, đình làng), đồng hồ riêng, xe hàng ở lại 2026.
- Câu đố hai thời điểm: xé trang sổ thu chi (không có dấu gương nên không mang về được) → giấu ở chỗ còn tới 2026 (cột bến sẽ thay, đình sẽ cháy, hốc cây bàng thì còn) → năm 2026 đục lớp xi măng có sẵn từ đầu game để lấy lại.
- Dấu vết khớp hai thời điểm: hốc cây trát xi măng, bác Tư nhớ "cậu thanh niên giống cháu", lời nhắn của mẹ, nắp hầm, ông Khải trẻ.
- Thêm 4 phép đối chiếu (gương, Vy ở 1996, hầm tận mắt, tiền sửa đình).

## Bước 6 (đã có) — js/era96b.js
- Sự kiện kinh dị có lời giải: đèn chập chờn, dấu chân ướt giày bộ đội + rong sông dẫn tới gương; tự đối chiếu với lời bác Ba → hồn ông Rạng.
- Đêm mốc 2 (mùng 10/8/1996): cảnh nguy hiểm ở đình. Người gác đi tuần có vùng nhìn hiện trên đất (tín hiệu trước), dấu ?/! khi sắp bị phát hiện, vùng tối để nấp, đánh chiêng để dụ đi.
- Thất bại (bị thấy, hoặc để người gác vào kho khi mẹ còn đó) → tải lại điểm lưu cảnh lúc vừa tới đình; không mất tiền/ngày, không phải bán hàng lại. Tải game giữa cảnh cũng về điểm lưu cảnh.
- Kết bản chơi thử: mẹ thoát ra, đi ngang qua (che mặt bằng khăn đỏ); trang sổ tay của Vy trên xà kho: "Em đã tới" → màn hình Hết bản chơi thử, rồi chơi tiếp tự do.
- Mục tiêu tách riêng cho năm 1996 và năm 2026.

## Chương 2 — js/ch2.js
- Cô Lan khai "không ai tới nhà" mấy đêm trước rằm; bà Năm (khách chợ 9:00–11:00) hỏi con trai Lộc mất tích từ mùng 9/1996.
- Đêm mốc 3 (mùng 11/8/1996): giường trống, khu Đường xóm 1996, nấp xem Vy gửi hộp thiếc cho cô Lan trẻ.
- Đối chiếu → cô Lan thú nhận (bị nhóm ông Khải dọa), trao hộp: thư của Vy + danh sách Ban tế lễ → màn "Hết chương 2".
- Gài dấu hiệu: gõ ba cái lên nắp xe khi bày sạp, can dầu trong kho đình, bác Tư nhớ đêm mùng 10, vải dầu của ông Rạng.
- Bot: `await PT.run({chapter2: true, maxSteps: 600})`.

## Chương 3 — js/ch3.js
- Bác Ba kể về giếng phong ấn và chiếc rìu cổ (treo trước xưởng MỘC BA từ đầu game, nhặt trong tro sau vụ cháy).
- Giỗ chung ở đình cũ bên kia sông (bác Tư chở, cả xe): điểm bày sạp thứ 3, chỉ ngày giỗ; bia tưởng niệm; nền gian thờ có 4 lỗ chốt, chốt đông nam bị chém.
- Đêm mốc 4 (mùng 13/8/1996): ông Rạng (còn sống) trao rìu → chém then nắp hầm → hầm: giếng, chốt đông nam quấn dây thừng, dép của anh Lộc, bia đá nghi lễ (bóng ma chỉ đường) → nước dâng 22 giây, leo ra hoặc tải lại điểm lưu → trả rìu ông Rạng (rìu không qua gương).
- Đối chiếu thư Vy × bia đá → phong ấn là thật → "Hết chương 3". Bot: `await PT.run({until: 'ch3_end', maxSteps: 800})`.

## Chương 4 — js/ch4.js
- Cô Lan kể đám cháy bắt đầu từ kho dầu, "kẻ đeo mặt nạ chém dây đèn".
- Đêm mốc 5 = đêm rằm: ông Rạng trao rìu + mặt nạ đoàn rước (nhân vật đeo mặt nạ, cầm rìu); sang đình bằng đò ông Rạng.
- Chém chốt dây trói Vy cạnh kiệu → đèn chớp: chính là tấm ảnh. Vy hoảng sợ chạy vào đình.
- Người gác chắn cửa gian đình (vùng nhìn, bị bắt → tải lại ngay sau khi cứu Vy); chém dây đèn để dụ → đèn rơi vào can dầu → đám cháy.
- Xuống hầm chém chốt đông nam cởi trói mẹ → phong ấn mở → tạm về năm 2026 (cao trào chưa làm) → đối chiếu → "Hết chương 4".
- Bot: `await PT.run({until: 'ch4_end', maxSteps: 1000})`.

## Cao trào và Kết — js/final.js
- Cao trào: qua gương nứt quay lại đúng khoảnh khắc dưới hầm. Nước dâng 120 giây, thủy khí trôi quanh giếng (chạm → cuốn ngã). Gõ ba cái gọi Vy → mẹ nhận ra con; bẩy xi măng cứu Vy (Vy thú nhận hiểu sai); đọc mặt sau bia đá, xem bản vẽ (cống góc tây nam), cắm lại chốt gãy, mở cống → bến đình, ông Rạng hy sinh → hộ tống mẹ và Vy về gương.
- Kết: mẹ vẫn mang tuổi 1996; trình bày vụ án với cán bộ công an xã bằng chứng cứ có thật ở 2026 (lời kể năm 1996 bị từ chối); khai quật, tìm thấy anh Lộc; cả nhà bày sạp ở chợ; chiều tối ra bến thấy bọc vải dầu "Năm 1975" → Hết truyện, chơi tiếp tự do.
- Bot: `await PT.run({until: 'the_end', maxSteps: 1400})`.

## Chi tiết cảnh — js/decor.js
- Bọc lên bộ dựng cảnh: mặt nhựa lấm tấm, ổ gà vá, rãnh thoát nước, nắp cống, vũng nước, nứt gạch, cỏ kẽ, lá rụng.
- Nhà mặt phố: bồn nước inox, ăng-ten, chậu cây, dây phơi trên mái; đồng hồ điện, cục nóng, tờ "khoan cắt bê tông" trên cửa cuốn. Năm 1996: đống rơm thay bồn nước.
- Đồ đường phố: xe máy (1996 là xe đạp), bàn trà đá ghế nhựa, chậu cây, thùng rác, mèo, chim trên dây điện, gà (1996).
- Riêng từng khu: chiếu, đồng hồ, dép, chum nước, dây phơi (nhà); sọt, thau cá, chuối treo, dây bóng đèn (chợ); lục bình, lờ, lưới, đom đóm đêm (bến); xà cháy, ngói vỡ, cỏ dại (đình cũ); câu đối, lư hương (đình 1996); rễ cây, nước nhỏ giọt (hầm).
- Chuyển động nhẹ: tán cây đung đưa, lục bình trôi, mèo thở, khói hương/đèn dầu, đom đóm (chỉ ban đêm), nước nhỏ giọt.
- Đồ vật lớn có vùng va chạm nhỏ; chạy `PT.reach()` sau khi thêm đồ để chắc không chắn đường.

## Nhân vật phụ, khách, đồ ăn — js/looks.js
- Phụ kiện qua 3 móc trong G.art.chibi: `o.pattern` (stripe/dots/plaid/floral), `o.acc` (apron, tie, redscarf, towel, strap, backpack, pen, badge, collar, shipbox, glasses, pencil, khan, earring, pigtails), prop thêm cane/bucket/bag/phone.
- Khách ghép ngẫu nhiên theo nhóm (`G.genLook`): học sinh khăn quàng đỏ + ba lô, văn phòng kính/cà vạt, người già áo bà ba + gậy, dân câu xô/cần.
- Đồ ăn vẽ lại (trà đá, bánh mì, nước ngọt), biểu tượng to hơn; tủ kính trên xe hiện đúng số hàng; món bay sang khách khi giao; tranh mâm đồ ăn ở sạp cô Lan.

## Bộ sưu tập meme — js/memes.js (đang tạm tắt)
- Đang bỏ khỏi index.html (dòng script để trong chú thích). Bật lại: bỏ chú thích dòng `js/memes.js`.
- 10 thẻ meme lấp lánh giấu ở 2026 (nhà, đường xóm, chợ, bến sông, đình cũ). Nhặt đủ → thành tựu **Meme Chúa** (huy hiệu ở màn tiêu đề). Xem trong Túi đồ.
- Thẻ về người thật chỉ dùng đồ vật/câu đặc trưng, không vẽ mặt, không ghi họ tên thật. Sửa câu/hình ở `G.MEMES` và `ICON` trong memes.js.

## Âm thanh — js/audio.js
- Tự sinh bằng Web Audio (không file, chạy offline). Nhạc nền đổi theo tình huống: tiêu đề, ngày (ngũ cung kiểu đàn bầu), chiều tối, năm 1996, kịch tính (lẻn/người gác/nước dâng), cao trào, kết.
- Tiếng động: bước chân, nút, chữ thoại, tiền, giao sai, manh mối, đối chiếu khớp/mâu thuẫn, qua gương, chiêng, chém, flash, gõ cửa, cửa kẽo kẹt, lửa, nước, bị phát hiện, đèn chập chờn, tiếng thì thầm.
- Bật/tắt: nút ♪ trên thanh trên cùng và ở màn tiêu đề; Menu có bật/tắt nhạc và tiếng động riêng (lưu trong máy).
- Gắn tiếng vào dòng thoại: thêm `sfx: 'ten'` cho dòng (xem danh sách ở cuối audio.js).

## Tranh cận cảnh — js/closeups.js
- Xem ảnh, bàn thờ, bảng tin, bản vẽ, thư, bia... hiện tranh vẽ phía trên khung thoại; Sổ điều tra hiện tranh của manh mối.
- Thêm tranh: viết hàm vào `G.CLOSEUPS`, gắn bằng `img: 'ten_tranh'` trên dòng thoại (hoặc trong `G.applyCloseups`).

## Bước 7 — chơi thử & bảng chương
- Bot chơi thử toàn vòng: mở game ở màn tiêu đề, trong console chạy
  `await (await fetch('tools/playtest.js')).text().then(eval); await PT.run()` → báo cáo thời lượng, bán hàng, chỗ kẹt.
  `PT.reach()` kiểm tra đi thật giữa mọi cặp chỗ tương tác trong mọi khu.
- Kết quả, nghiệm thu, bảng chương, twist và bảng nhân quả: `docs/bang-chuong.md`.
- Sau mỗi lần sửa JS/CSS, tăng số `?v=` trong index.html để trình duyệt không dùng bản cũ.

## Hình tạm / bản đầu
- Nhân vật, xe hàng, biểu tượng món: vẽ theo đúng mẫu v3 (thêm dáng quay ngang và quay lưng).
- Nền 4 địa điểm và khung giao diện: bản vẽ đầu cùng bảng màu và nét mực của v3, sẽ thay khi có asset chính thức.

## Cấu trúc
`js/data.js` dữ liệu (ID ổn định) · `text.js` lời thoại · `state.js` trạng thái, lưu/tải · `art.js` nhân vật/xe/icon · `scenes.js` nền · `ui.js` bảng giao diện · `world.js` di chuyển, tương tác, ngày · `sell.js` bán hàng · `main.js` vòng lặp, phím, cảm ứng.

## Tiện ích chơi — js/qol.js
- Nút ✕ góc trên các bảng (nhập hàng, túi, sổ, menu, nghỉ, hướng dẫn): bấm = bấm nút đóng sẵn có của bảng.
- Bản đồ góc trên trái (`#minimap`, kiểu bản đồ phố có ghim): nơi chưa tới bị sương che (`S.visited`), ghim đỏ = đang đứng, ! = có việc; năm 1996 nhuộm nâu. Mục tiêu nằm ngay dưới bản đồ. Có xe máy (`S.flags.xe`) mới bấm ghim để đi nhanh (`G.travel`, 4 phút/khu); không đi khi đang bày sạp, cảnh nguy hiểm, ở đình hay năm 1996.
- Xe hàng cất trước cửa nhà (`G.world.PARK`), chỉ hiện ở nơi bày sạp khi đang bán.
- Chợ: sạp theo loại (`stall(..., kind, sign)` trong scenes.js: rau, qua, ca, thit, vangma) và 5 người bán (`ban_*`, hỏi chuyện bằng `G.acts.stall_talk`).
- Việc phụ xe máy: bán ≥5 món rồi gặp Tùng → giao 3 ly trà (bác Tư, bác Ba, cô Lan) → nhận Cub. Nút 🛵 / phím M lên xuống xe (nhạc nền: `MUSIC_VOL` trong audio.js), tốc độ 450 (đi bộ 250). Vào nhà tự dắt xe để ngoài; không dùng ở năm 1996.


## Cảnh hù dọa — js/scares.js
- 5 cảnh, mỗi cảnh một lần (`S.seen.scare_*`), ở 2026 tối đa một cảnh mỗi ngày. Hình bật to + rung + tiếng `scare` (audio.js) ~1,3 giây, rồi một câu thoại.
  - `altar`: Nhà cũ, từ ngày 2, sau 19:00, đứng gần bàn thờ.
  - `river`: Bến sông, từ ngày 3, sau 18:00, đứng gần mép nước (y > 640).
  - `shutter`: Chợ, từ ngày 2, sau 17:30, đi về phía căn nhà đóng cửa cuốn (x > 640).
  - `poster`: bấm xem bảng tin ở Đường xóm lần đầu → nhìn tờ tìm người ~1,7 giây rồi khuôn mặt trong ảnh xé giấy lao ra; xong mới đọc bảng tin và nhận manh mối (thay cho cảnh `window` cũ).
  - `burn`: năm 1996, đêm thứ 2–4, ở bến/nhà/đường xóm sau 3 giây.
- Không bật khi đang bày sạp, đang hội thoại/mở bảng hay đang ở cảnh nguy hiểm. Sửa điều kiện ở `G.SCARES`.

## Bot chơi thử
- `PT.run` giờ tự làm việc phụ xe máy (bán đủ 5 món → gặp Tùng → giao 3 ly → lấy xe), có xe thì bấm ghim bản đồ để đi nhanh. Kết quả có thêm `xeMay`, `diNhanh`, `canhHu`.

## Chuyển động nhân vật, ảnh bìa, chi tiết đồ vật
- Nhân vật (art.js + style.css): tay chân tách nhóm `.lg1/.lg2/.ar1/.ar2`. Chu kỳ bước 0,5 giây: nhìn ngang thì sải chân và đánh tay ngược nhau, thân nghiêng tới; nhìn trước/sau thì nhấc chân luân phiên. Bụi chân khi đi, khói ống xả khi chạy xe (qol.js).
- Ảnh bìa (`js/cover.js`): đêm bên bến sông, đình đỏ bên kia sông, đò, cột đèn, nhân vật chính cạnh xe hàng, bóng đứa bé chập chờn, giấy vàng mã bay.
- Chi tiết đồ vật tương tác (`js/details.js`): vẽ chồng theo khung `hit` của từng chỗ (bàn thờ, giường, bàn Vy, gương, gốc bàng, thùng giấy, cửa nhà 9, bàn gỗ, cọc bến, bảng tin, xưởng mộc, bia, nền thờ, thư, sổ thu chi, chiêng, xà nhà, đèn lồng, giếng, bao gạo, bia đá, thang). Thêm/sửa ở bảng `D`; tên trùng hình dùng `ALIAS`.

## Cập nhật lối chơi — js/v3.js, js/cutscenes.js, js/minigames.js
- Hết chương: hiện thẻ tóm tắt ~4 giây rồi tự chơi tiếp (kết truyện cuối giữ nguyên).
- Xe đẩy: để trước cửa Nhà cũ (`xe_day`), phải "Đẩy xe hàng đi" mới bày sạp được; đang đẩy xe thì không chạy xe máy / không đi nhanh; tối về xe tự cất (`S.cartOut`).
- Dấu !: sau khi tương tác, ẩn tới khi cốt truyện tiến thêm (`S.qmute`, `G.showQuest`).
- Chế độ (`S.mode`): chọn khi Chơi mới, đổi trong menu. Dễ: tô màu chữ + dấu !. Thám tử: chữ thường, không dấu !.
- Thoại của người đang đứng trong cảnh hiện như bong bóng trên đầu (trừ khi có tranh cận cảnh hoặc lựa chọn). Người trong xóm chào khi gặp, nói chuyện với nhau; khách nói vu vơ khi mua.
- Dáng xem đồ: cúi người, tay lên cằm, dấu "…" (`.ent.inspect`).
- Camera: phóng 1,25 lần (`G.world.zoom`), đổi toạ độ bằng `G.world.toClient`.
- Cảnh phim (`G.cutscene`): gong, river_fall, nen_tho, mirror_vy, mirror_go, chop, fire, knock, lever, tunnel — gắn với thoại qua `G.CUT_BY_TEXT`.
- Minigame (`G.mini.play`): lock (hộp thiếc, mã 1508), gong (nhịp), chop (canh lực), pages (ghép thư), lever (bấm liên tục). Thua 2 lần (dễ) / 4 lần (thám tử) có nút bỏ qua. Bot đặt `G.mini.auto = true`.
- Sửa: ông Khải không nói chuyện tế lễ (câu "đêm cháy" lặp che mất); bấm đồ vật khi đứng gần bị mở hai lần; bác Ba giờ ở xưởng cả ngày; người bán ở chợ đứng cạnh sạp; đơn nhiều món bán được một phần; gương dời sang kệ cạnh giường; chỗ lên đò ở đình dời xa điểm đến.

## Bối cảnh sống động — js/ambience.js
- Ánh sáng: lớp tối (canvas trong #amb) đậm dần từ 16:30 tới 19:30 (tối đa 0,72), đục lỗ sáng ở cột đèn (tự lấy từ `Builder.lamp`), cửa sổ, nến, đèn lồng (`MAN` theo từng nơi) và quanh người chơi; quầng sáng ấm vẽ đè (screen), nến/đèn lồng chập chờn. Năm 1996 luôn là đêm, hầm tối hơn.
- Nước (`WATER`): sóng gợn, bóng đèn in trên mặt sông, sương trôi, đom đóm ven nước ban đêm. Thiêu thân quanh đèn, lá rơi quanh cây (`TREES`), vệt nắng trong chợ ban ngày.
- Mưa: đã tắt (`rainy()` trả về false).

## Nhà cửa — js/houses.js
- `G.drawHouse` (gọi từ `Builder.closed`): mái hai mái có nóc + bóng, rêu, ngói vá, ống thông hơi, mép mái + máng nước; nhà ống cao có sân thượng (sàn kẻ ô, lan can, tum cầu thang, chậu cây, ghế nhựa); mặt tiền có vết ố, gạch chân tường, cạnh khuất sáng; cửa cuốn (hộp cuốn, tay nắm, gỉ) hoặc cửa gỗ / cửa xếp sắt có ô thoáng gió, bậc thềm; cửa sổ song sắt + cánh gỗ; mái hiên bạt sọc; biển số nhà; bàn thờ ông Địa trước cửa hàng; biển hiệu có khung, đinh vít, bóng. Năm 1996: tường vôi, cửa ván, không cửa cuốn.
- `G.drawSouthRoofs`: dãy mái phía nam có nóc, bóng, rêu. `G.drawRoomExtra` (từ `Builder.room`): cửa sổ tường bắc, nẹp và bóng chân tường, cột góc, ngạch cửa.

## Đồ đạc và sạp — js/furniture.js, scenes.js
- `G.furn`: altar (khám thờ, ảnh viền vàng, tủ chạm panô, khăn đỏ), bed (đầu giường, chiếu cói, gối, chăn sọc; kids cho năm 1996), wardrobe (gờ, panô, va li), desk (ngăn kéo, ghế, sách, ba lô), teaTable (khay, ấm, chén, đôn), calendar, fan (cánh quay), mat. Dùng ở `nha` và `nha_96`; kệ gương có ngăn kéo và khăn ren.
- Sạp chợ (`Builder.stall`): cột tre, nếp bạt, dây buộc, bóng đèn treo, bạt ca rô mặt trước, két nhựa + rổ dưới gầm, hàng thêm theo loại (`EXTRA`), thẻ giá (`PRICE`); sạp cô Lan vẽ bình trà đá, bánh mì, nước ngọt, chồng ly.

## Giao diện nút — js/ui2.js
- Thanh trên cùng: các thông tin gom vào một dải (`.hud-info` > `.hchip`), mỗi ô có biểu tượng nét (lịch, đồng hồ / trăng khi tối, ghim, xe, tiền). Nút xe máy, nhạc, Sổ, Túi, menu dùng biểu tượng (`G.ICONS`); nút màn hình tiêu đề có biểu tượng. Kiểu nút chung: nền chuyển sắc, viền mực, nhấn lún, viền sáng khi chọn bằng bàn phím.
- Đường xóm: nhà cao có tầng hai + ban công (`upper`); nhà CHO THUÊ kiểu `abandoned`; xưởng Mộc Ba kiểu `workshop` + mái tôn (`roofKind: tin`); tạp hoá thêm kệ hàng, hũ kẹo, dây bim bim.

## Lúc bày sạp — js/sell.js
- Camera phóng 1,6 lần vào khu sạp (`zoomTo`), dọn sạp thì về 1,25.
- Hai bàn nhựa thấp + bốn ghế đẩu bên trái sạp (`buildSeats`, `P.seats`). Khách mua xong (không phải khách cốt truyện) có 55% ra ngồi ăn 6–11 giây (trạng thái `toSeat` → `eat` → `out2`), bong bóng hiện món đang ăn, đôi khi khen một câu. Hàng chờ thật lấy qua `G.sell.queue()`.

## Tranh cận cảnh v2 — js/closeups2.js
- Lớp chung cho mọi tranh khổ 520x300: hạt phim, tối viền, ánh sáng hắt. Vẽ lại tất cả: anh_le_hoi (ảnh màu cũ phai: cổng chào, cờ đuôi nheo, đèn lồng, đèn ông sao, đầu lân, trống, kiệu dưới lọng; manh mối giữ nguyên), bien_ban, trang_so (sổ mở đôi), trang_so_cu, thu_vy (vở lò xo), danh_sach, trang_vy, bia_da (ánh đuốc, nước rỉ), ban_tho, guong, bang_tin, ban_ve, bia, nen_tho, riu, tre_ngu, thu_me. Biên bản và sổ thu chi có con dấu đỏ.
- Menu > "Thử minigame / cảnh phim": mở thẳng 5 minigame và 10 cảnh phim (`G.ui.testPanel`, `G.mini.test`), không ghi tiến độ.

## Kết có hậu & đồ ăn thừa — cutscenes.js, js/leftover.js
- Cảnh `happy` (8,6 giây) chiếu trước bảng "Hết truyện": bình minh trên sông, dây cờ, cả nhà quanh xe trà đá cùng cả xóm (cô Lan, bác Tư, bác Ba, Tùng với con Cub, bà Năm, anh Lộc, bé Na, người bán ở chợ, chó mèo; ông lão mũ cối hiện mờ ở mép nước), mọi người nhún nhảy, vẫy tay, đèn ông sao và hoa giấy bay; câu "Lần này, đã khác.". Xem thử trong menu > Thử minigame / cảnh phim.
- Chó mèo bên đường (`feed`): mèo ở Nhà cũ, Đường xóm, Bến sông, chó vàng ở chợ. Cho 1 bánh mì: lần đầu trong ngày được "lộc" (boa ×1,5); mèo đủ 5 lần (`S.kind`) thì mèo mướp theo về (`S.flags.cat_home`, khách chờ lâu hơn ×1,2); chó vàng đếm riêng (`S.kindDog`), đủ 5 lần thì theo về (`S.flags.dog_home`, kẻ đuổi chậm 15%). Không có bánh mì thì chỉ vuốt.
- Túi đồ > Ăn uống: bánh mì = đi nhanh hơn 15%; trà đá = khách chờ lâu hơn 25%; nước ngọt = mỗi khách boa thêm 1k (đều đến hết ngày, mỗi loại 1 lần/ngày). 19:30 còn đồ dễ hỏng thì nhắc.

## Máu, tinh thần, truy đuổi, chiếc rìu, Thiên Khí — js/rpg.js
- Đã bỏ thanh máu / tinh thần. Cảnh truy đuổi tính số lần bị chạm: 3 lần (cảnh tự do), 5 lần (cảnh năm 1996 trong truyện); hiện bằng trái tim trên banner CHẠY!. Đồ ăn thừa chỉ còn cho chó mèo ăn hoặc tự ăn lấy hiệu ứng trong ngày.
- Truy đuổi (`G.chase.start`, `lives`): kẻ đuổi tự tìm đường, chạm thì mất một tim + bị hất ra; tới đích / sang cảnh khác / quá 45 giây là thoát; hết tim là gục (về nhà, mất 20k, sang ngày mới). Ba cảnh: bóng đeo mặt nạ ở Đường xóm (ngày ≥3, sau 19:00, chạy về Nhà cũ); bóng ướt sũng ở Bến sông (ngày ≥5, sau 19:30 gần mép nước, chạy vào vùng đèn); người gác năm 1996 đuổi ra bến đò trước đoạn rơi xuống sông. Bot: `G.chase.auto`.
- Chiếc rìu (`S.axe` 1→3): tìm thấy (rìu cũ) → thức tỉnh khi chém dây đèn lồng bện chỉ đỏ quấn bùa (dao không cắt nổi) → lộ bí mật ở hòm gỗ đình cũ: trang thần phả (`e_than_pha`) mâu thuẫn lời bác Ba (`q_riu_goc`). Câu cuối chương: “Ngươi đã tìm được chiếc rìu. Nhưng ai nói nó bị thất lạc?”.
- Kho Thiên Khí Đại Việt (Túi đồ > nút ✦): trang rìu cập nhật theo bằng chứng (nguồn gốc → năng lực → cái giá); các thiên khí khác chỉ là dấu vết "???".

- Thanh bán hàng (sell.js `render`): thẻ món có giá, số còn, phím tắt, "HẾT"; món khách đang gọi sáng viền vàng; dòng "Khách gọi"; khay 4 ô; nút Giao sáng xanh khi khay đúng món; doanh thu + số khách bên phải.
- Bảng Chơi thử có thêm mục Truy đuổi (`G.chase.test`): dựng đúng nơi/giờ, chạy xong trả lại nguyên trạng thái game.

- Nút "Thử minigame / cảnh phim" đang tắt hẳn (`G.TEST_PANEL = false` trong v3.js). Bật lại: đặt `G.TEST_PANEL = true` rồi mở bằng đường dẫn có `?dev`.

- Khung game giãn ngang theo cửa sổ (`G.VIEW_W` 960–1200, cao 540) để màn hình rộng không còn dải đen. Tên game dùng font Grenze Gotisch (Google Fonts, có dấu tiếng Việt) + hiệu ứng lượn sóng, chập chờn, bóng ma đỏ. Xe hàng có dấu ! tới lần đầu đẩy xe. Bảng kết có credit "Một trò chơi của @aquaman793".

## Album tem meme — js/stamps.js
- Món mới **Kẹo dừa** (nhập 4k, bán 8k, để được lâu; học sinh và người già thích). Phím 4 khi bán.
- Tem meme (`G.STAMPS`, `S.stamps`): ảnh làm thành con tem răng cưa, số thứ tự, dấu bưu điện, mệnh giá. Tem #01 "Tin vừa rồi có chính xác không chị" (ảnh `assets/stamps/keo-dua.jpg`): lần đầu nhập kẹo dừa. Tem #02 "Có làm thì mới có ăn" (`assets/stamps/co-lam.jpg`): bán hàng được tổng 500k (`S.stats.earned`), trao khi không đang bán. Tem #03 "Dân Chơi" (`assets/stamps/dan-choi.jpg`): có xe máy sau việc phụ của Tùng (`S.flags.xe`). Tem #04 "Còn cái nịt!" (`assets/stamps/con-cai-nit.jpg`): lần đầu bị quịt tiền. Tem #05 "Gud dual shhh" (`assets/stamps/gud-dual.jpg`): mua bán trà với bác Ba 3 lần (`S.flags.ba_deals`). Tem #06 "😧" (`assets/stamps/hoang-hon.jpg`): lần đầu bị hù (sau câu hoàn hồn). Tem #07 "👍" (`assets/stamps/thumb.jpg`): phá án xong, trao giữa cảnh kết và bảng "Hết truyện". Phần 1 album có 7 tem, đủ 7 là Meme Chúa (phần 2 thêm tem vào `G.STAMPS`).
- Khách ngồi ăn trả tiền sau: nút "Thu …k" trên đầu khách hoặc nút Thu tiền (phím C) trên thanh bán; ăn xong chưa thu hoặc đóng sạp khi khách chưa trả là bị quịt (`P.r.quit`, `S.flags.bi_quit`). Album ở Túi đồ > ✉ Album tem meme; đủ cả album đạt **Meme Chúa** (huy hiệu ở màn hình tiêu đề). Thêm tem: thêm phần tử vào `G.STAMPS` rồi gọi `G.giveStamp(id)` ở chỗ muốn trao.

- Mèo vẽ lại (`G.art.cat`, dùng cho mèo hoang ở decor.js, mèo theo người, cảnh kết). Mèo mướp đã thuần phục (`S.flags.cat_home`) đi theo người, có dáng ngồi (`G.art.cat`) và dáng đi bước chân chéo (`G.art.catWalk`), tự đổi khi đi/dừng, ở năm 2026 (năm 1996 ở lại), con mướp hoang ở Đường xóm biến mất. Chó vàng vẽ lại (`G.art.dog`), vẫy đuôi. Chó vàng đã thuần phục (`S.flags.dog_home`) cũng đi theo, xa hơn mèo một chút, dáng đi riêng (`G.art.dogWalk`: chân chéo, đuôi vẫy, lưỡi thè); con chó ở chợ biến mất. Follower chung trong leftover.js (`PET_DEF`).
