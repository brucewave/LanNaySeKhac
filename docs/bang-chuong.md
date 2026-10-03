# Lần Này Sẽ Khác — Bước 7: chơi thử, nghiệm thu, bảng chương

Tài liệu này chốt bản chơi thử (bước 1–6) và làm khung cho việc mở rộng truyện, theo mục 7, 13 và 14 của đặc tả.
Ghi chú: **[đã làm]** = có trong bản chơi thử; **[đề xuất]** = thiết kế cho phần mở rộng, chưa code.

---

## 1. Kết quả chơi thử toàn vòng

Chơi bằng bot `tools/playtest.js`. Bot dùng đúng cơ chế game (bấm để đi, nói chuyện, bày sạp với độ trễ phản xạ 1,4 giây/khách, ngủ, lẻn qua người gác) và đi từ "Chơi mới" tới màn kết.

| Lượt | Kết quả | Ngày trong game | Thời lượng ước tính* | Vấn đề |
|---|---|---|---|---|
| 1 | Kẹt ở bày sạp | 1 | – | Lỗi của bot (bày sạp không mở bảng) |
| 2 | Kẹt ở đình 1996 | 2 | – | **Lỗi game:** nhân vật kẹt mép tường trước cửa đình, không tới được sổ thu chi |
| 3 | Tới kết | 4 | 25 phút | Nhịp dồn: ngày 1 làm từ giao trà tới tìm ra gương; bến sông quá ít khách |
| 4 | Tới kết | 5 | **30 phút** | Không còn lỗi |

\* Thời gian mô phỏng + 2,5 giây mỗi dòng thoại + 12 giây mỗi lần thao tác bảng. Bot luôn biết phải làm gì, nên người chơi thật sẽ lâu hơn. Mục tiêu 30–45 phút nhiều khả năng đạt; cần người thật chơi để xác nhận.

**Đã sửa sau khi chơi thử**
- Đi theo đường bấm: nhân vật trượt dọc khi bị cạ mép tường, không còn dừng giữa đường. Kiểm tra "đi thật" giữa mọi cặp chỗ tương tác trong cả 7 khu: 0 lỗi.
- Cửa kho đình rộng hơn, khung va chạm ở chân gọn hơn.
- Ông lão mũ cối chỉ hiện từ hôm sau ngày giao trà. Mục tiêu ghi rõ "từ ngày mai".
- Bến sông: khách đến dày hơn (8,5 giây → 6,5 giây), 45% khách gọi hai món, boa gấp đôi chợ.
- Thêm số phiên bản vào đường dẫn file JS/CSS, để người chơi không bị kẹt bản cũ trong bộ nhớ đệm sau mỗi lần cập nhật.
- Ảnh lễ hội có thêm chi tiết "người đeo mặt nạ quấn khăn tối màu ở cổ", là dấu hiệu cho twist chương 4 (ảnh không được đổi về sau).

**Bán hàng (lượt 4)**: chợ 63 khách / 27,7 giờ bày sạp (≈ 27k/giờ); bến sông 8 khách / 6,2 giờ (≈ 15k/giờ + gặp bác Ba, ông lão). Hai nơi khác nhau rõ: chợ đông và đều, bến ít khách nhưng mua nhiều món và hay boa.

---

## 2. Nghiệm thu theo mục 13

| # | Tiêu chí | Trạng thái | Kiểm chứng |
|---|---|---|---|
| 1 | Nhập hàng → doanh thu → dùng tiền nâng cấp | Đạt | Bot mua Ô che / Thùng đá từ tiền bán |
| 2 | Chọn điểm bán / mặt hàng tạo khác biệt | Đạt | Chợ ≈ 27k/giờ, bến ≈ 15k/giờ nhưng boa ×2, sáng bánh mì chạy, chiều đồ uống |
| 3 | Khách quen mở tương tác có ý nghĩa, không cày | Đạt | Bác Ba nhờ giao trà sau 3 lần thân quen (làm được trong ngày 1) |
| 4 | Đơn giao nối tự nhiên tới điều tra | Đạt | Ly trà → nhà số 9 → bản vẽ có hầm |
| 5 | Người chơi tự đối chiếu bằng chứng với lời khai | Đạt | 11 phép đối chiếu, ghép sai có gợi ý |
| 6 | Câu đố hai thời điểm theo lịch sử cố định, không nhân bản | Đạt | Trang sổ không qua gương; xi măng trên hốc cây có từ đầu game |
| 7 | Hết tiền / lỡ lịch / phục vụ sai không khoá truyện | Đạt | Gói khởi động khi hết vốn; lịch NPC lặp hằng ngày; giao sai không mất hàng; đêm 1 không thể về khi chưa giấu trang sổ |
| 8 | Nguy hiểm có checkpoint, không bắt bán lại | Đạt | Bị thấy / để người gác vào kho → tải lại lúc vừa tới đình, giữ tiền và ngày |
| 9 | Lưu/tải giữ đúng tiền, hàng, thời gian, quan hệ, manh mối, mốc | Đạt | So khớp 12 trường sau lưu → tải |
| 10 | Hình ảnh đúng phong cách; hình tạm ghi rõ | Đạt | Nhân vật theo mẫu v3; nền/đồ vật là bản vẽ đầu, ghi trong README |

---

## 3. Bảng chương

| Chương | Mục tiêu người chơi | Hoạt động bán hàng | Chứng cứ | Suy luận người chơi làm | Sự kiện kinh dị | Twist | Điều kiện hoàn thành |
|---|---|---|---|---|---|---|---|
| **Mở đầu** [đã làm] | Về nhà, sửa xe trà, sống được để tìm em | Nhập hàng cô Lan, bày sạp chợ, học giao món | Ảnh lễ hội 1996 có Vy đúng tuổi bây giờ; nhang mới trên bàn thờ | – | Ảnh "người không nên có trong ảnh" | – | Xem ảnh, bán vài món |
| **Chương 1: Khách quen và lời khai sai** [đã làm] | Làm quen xóm, giao ly trà thứ hai, tìm hồ sơ | Bán ở chợ/bến theo lịch bác Ba; nâng cấp xe | Bản vẽ đình có hầm bị giấu; biên bản ông Khải ký; tờ tìm người 1996 | Bác Ba "không nhớ" × bản vẽ; ông Khải "không đi lễ" × ảnh; "đình không hầm" × bản vẽ; ai duyệt × biên bản | Ly trà cho người đã mất; ông lão mũ cối ướt sũng biến mất | Ly trà thứ hai là cho ông Rạng đã chết | Có gương, hiểu Vy đã dùng gương |
| **Chương 1b: Qua gương** [đã làm] | Đêm 1 và 2 ở 1996; cứu mẹ khỏi bị bắt gặp; biết Vy ở đâu | Ban ngày vẫn bán (cần tiền mua búa nếu không mượn đục) | Nghe lén Khải trẻ; nắp hầm; sổ thu chi; trang sổ trong hốc cây; trang sổ tay của Vy | Tiền sửa đình × trang sổ; dấu chân × ông Rạng; lời nhắn Vy × trang sổ tay | Dấu chân ướt dẫn tới gương; cảnh người gác đi tuần | Đứa trẻ ôm quạt nan là chính mình; **Vy tới 1996 trước anh một đêm** | Đọc trang sổ tay Vy → màn kết bản chơi thử |
| **Chương 2: Em gái không bị bắt cóc** [đã làm] | Hỏi cô Lan; gặp bà Năm; đêm mốc 3 (mùng 11) lần theo hai đứa trẻ sang tạp hoá cô Lan, thấy Vy gửi hộp | Bày sạp chợ 9:00–11:00 để gặp bà Năm (khách gọi đúng món của con trai mất tích) | Lời khai cô Lan; lời bà Năm; Vy gửi hộp (1996); thư của Vy; danh sách Ban tế lễ | Bà Năm × nghe lén/tờ tìm người; cô Lan "không ai tới" × Vy gửi hộp; thư Vy × danh sách; thư Vy × ảnh (người đeo mặt nạ là ai?) | Bà cụ ngày nào cũng gọi "bánh mì không hành" cho đứa con đã mất (giải thích: bà lẫn, con mất tích từ mùng 9/1996) | Cô Lan giấu chuyện vì bị nhóm ông Khải dọa đốt tạp hoá; chính cô trát xi măng hốc cây năm 1997 | Biết Vy tự đi cứu mẹ, đang theo dấu "tế thần sông" và người đeo mặt nạ → màn "Hết chương 2" |
| **Chương 3: Tội ác và tâm linh** [đã làm] | Hiểu cái hầm: tội ác của nhóm Khải + phong ấn có thật; có rìu, biết chốt đông nam | **Giỗ chung ở đình cũ** (điểm bán thứ 3, bác Tư chở sang, khách rất đông, chỉ ngày giỗ) | Rìu treo ở xưởng MỘC BA (có từ đầu game); bia tưởng niệm (Mai 1992, Út 1994); 4 lỗ chốt, chốt đông nam bị chém; dép tổ ong xanh dưới hầm; bia đá nghi lễ | Khải "có ai mất đâu" × bia; bác Ba "rìu tìm trong tro" × chốt bị chém; bà Năm (dép xanh) × dép dưới hầm; thư Vy × bia đá (phong ấn là thật) | Tiếng thở và tiếng gọi "Hạnh" dưới nền xi măng; bóng ma đội nón lá chỉ đường; nước giếng dâng (nguy hiểm, điểm lưu cảnh) | Phong ấn là thật, nhóm Khải chỉ lợi dụng; anh Lộc bị giết dưới hầm | Đọc bia đá, thoát nước dâng, trả rìu ông Rạng, đối chiếu thư Vy × bia đá → "Hết chương 3" |
| **Chương 4: Người trong ảnh** [đã làm] | Đêm rằm: đeo mặt nạ lẫn vào đoàn rước, cứu Vy, xuống hầm cởi trói mẹ | – (cô Lan kể về đám cháy trước khi qua gương) | Lời cô Lan "kẻ đeo mặt nạ chém dây đèn"; ánh chớp đêm rằm; dây đèn rơi vào can dầu | Thư Vy × ánh chớp (**người đeo mặt nạ là tôi**); cô Lan × dây đèn (**đám cháy bắt đầu từ tay tôi**) | Mặt giếng vỡ, nước đen, thứ dưới đáy trở mình; người gác chắn cửa (vùng nhìn, điểm lưu cảnh) | Người đeo mặt nạ cầm rìu là anh: chém chốt dây trói Vy, góc chụp trông như tấn công; anh gây ra đám cháy | Chém chốt đông nam cởi trói mẹ → phong ấn mở → tỉnh dậy năm 2026 (tạm, chờ cao trào) → hai phép đối chiếu → "Hết chương 4" |
| **Cao trào** [đã làm] | Quay lại đúng khoảnh khắc dưới hầm, cứu Vy, mở đường phụ, đưa mẹ và Vy về gương | – | Mặt sau bia đá (cắm lại chốt, mở cống cổ); bản vẽ gốc (ký hiệu cống góc tây nam); khúc chốt gãy | Ghép bia + bản vẽ + vị trí chốt: cắm lại chốt đông nam, mở cống tây nam (chọn sai góc → tường đá liền) | Nước dâng 120 giây; thủy khí trôi quanh giếng (chạm → cuốn ngã, nước dâng nhanh); ông Rạng hy sinh ở bến đình | Mẹ nhận ra con qua "gõ ba cái"; Vy thú nhận hiểu sai người trong ảnh, kẹt khi định phá chốt tây bắc | Bước vào gương cùng mẹ và Vy (gương chỉ đủ hai người cho tới khi chốt được cắm lại) |
| **Kết** [đã làm] | Ở bên mẹ; trình bày vụ án; bày sạp cùng cả nhà | Bày sạp ở chợ cùng mẹ và Vy (bác Ba mua hai ly, lần này uống cả hai) | Chỉ chứng cứ có thật ở 2026: trang sổ ố vàng, bản vẽ, biên bản, danh sách, bia, nền chốt, bác Ba và bà Năm làm chứng | Trình bày 4 ý, mỗi ý chọn chứng cứ; lời kể "thấy năm 1996" bị từ chối | Bọc vải dầu mới dưới bến: "Năm 1975" (mở cho truyện sau) | Mẹ vẫn mang tuổi 1996 | Khai quật nền đình, tìm thấy anh Lộc, ông Khải bị mời làm việc (không tự kết án) → "Hết truyện", chơi tiếp tự do |

---

## 4. Twist và dấu hiệu báo trước (mỗi twist ≥ 2 dấu hiệu)

| Twist | Dấu hiệu 1 | Dấu hiệu 2 | Dấu hiệu 3 | Trạng thái |
|---|---|---|---|---|
| Ly trà thứ hai là cho người đã chết | Bác Ba mua hai ly, chỉ uống một [đã làm] | Vết ly cũ chồng chất trước nhà số 9 [đã làm] | Cô Lan: "mỗi ông một ly" [đã làm] | Đã làm |
| Ông lão mũ cối là hồn ông Rạng | Quần ướt sũng, biến mất để lại vệt nước [đã làm] | "Cảm ơn cháu đã mang trà tới nhà tôi" [đã làm] | Bác Tư: "nước sông lên nhanh lắm" [đã làm] | Đã làm |
| Vy tới 1996 trước anh | Ảnh có Vy đúng tuổi bây giờ [đã làm] | Bé Na: Vy nói chuyện với gương [đã làm] | Sổ tay của Vy bị xé gần hết [đã làm] | Đã làm |
| Đứa trẻ ôm quạt nan là chính mình | Ảnh mẹ trên bàn thờ cầm quạt nan [đã làm] | Mẹ năm 1996 phe phẩy quạt nan [đã làm] | – | Đã làm |
| Người đeo mặt nạ cầm rìu là anh | Vy: "đừng để mẹ nhìn thấy mặt anh" [đã làm] | Ảnh: người đeo mặt nạ quấn khăn ở cổ; anh luôn quàng khăn đỏ, kéo khăn che mặt đêm 2 [đã làm] | Chốt đông nam năm 2026 bị chém bằng đúng lưỡi rìu mẻ răng cưa; ông Rạng hẹn "đêm rằm đưa rìu cho cậu" [đã làm] | **Đã làm (chương 4)** |
| Anh gây ra một phần đám cháy | Kho đình chất can dầu đèn lồng [đã làm] | Ông Khải dặn treo đèn lồng xong trước rằm [đã làm] | Cô Lan: "kẻ đeo mặt nạ chém đứt dây đèn" [đã làm] | **Đã làm (chương 4)** |
| Mẹ nhận ra con qua thói quen | Mỗi lần bày sạp: "gõ ba cái lên nắp xe, thói quen từ nhỏ" [đã làm] | Cô Lan 2026: "gõ ba cái lên nắp xe y như chị Hạnh" [đã làm] | Cô Lan 1996: "chị Hạnh dạy hai đứa gõ ba cái cho may"; Vy gõ cửa ba cái [đã làm] | **Đã làm (cao trào)** |
| Cô Lan giấu một phần sự thật | Mẹ nhắn "gửi hai đứa sang cô Lan" [đã làm] | Cô Lan nhận ra xe trà ngay, nhắc Vy "hỏi chuyện cũ suốt" [đã làm] | Cô nói nhanh, mắt không rời mớ rau [đã làm] | Đã làm (chương 2) |
| Người đeo mặt nạ không phải kẻ ác | Ảnh: đứng chắn sau lưng Vy, quấn khăn [đã làm] | Thư Vy tin ngược lại, phép đối chiếu "Người đeo mặt nạ là ai?" [đã làm] | – | Dấu hiệu đã gài cho chương 4 |

---

## 5. Bảng nhân quả 1996 ↔ 2026

Một dòng thời gian cố định: mọi việc người chơi làm ở 1996 đã luôn xảy ra.

| Việc xảy ra năm 1996 | Dấu vết năm 2026 | Có từ khi nào trong game | Người chơi hiểu đúng lúc nào |
|---|---|---|---|
| Đêm 8/8: anh Tư chở một thanh niên sang đình không lấy tiền | Bác Tư thấy "mặt cháu quen quen"; sau đó nhớ ra | Từ đầu (câu "quen quen" có trước chuyến đi) | Sau đêm 1, khi bác Tư kể lại |
| Đêm 8/8: anh xé trang "chi riêng hầm" khỏi sổ thu chi | Sổ thu chi thiếu trang (mẹ phát hiện đêm 10) | – | Đêm 2, cảnh mẹ lục sổ |
| Đêm 8/8: anh giấu trang sổ trong hốc cây bàng | Hốc cây bị trát xi măng, trang sổ nằm bên trong | **Từ đầu game** (xem gốc bàng là thấy lớp xi măng) | Khi đục hốc cây năm 2026 |
| Đêm 8/8: Khải dặn đổ xi măng xuống hầm trước rằm | Hầm bị tẩy khỏi bản nộp; bác Ba bị ép im | Từ đầu (bản vẽ, biên bản) | Các phép đối chiếu chương 1 |
| Đêm 9/8: Vy tới 1996, giấu mấy trang sổ tay trên xà kho đình | Cuốn sổ của Vy ở nhà bị xé gần hết; ảnh có Vy | Từ đầu | Đêm 2, khi đọc trang sổ tay |
| Vy dùng gương ở bến sông rồi qua gương | Gương nằm dưới cột bến, quấn dây buộc tóc của Vy | Từ đầu (dưới bến) | Khi ông lão chỉ chỗ; đối chiếu với lời bé Na |
| Đêm 10/8: anh đánh chiêng, mẹ thoát khỏi người gác | Không cần dấu vết: mẹ vẫn sống tới rằm như lịch sử | – | Đêm 2 |
| Đêm 10/8: anh rơi xuống sông, anh Tư kéo lên ("Lại là cậu à?") | Bác Tư 2026 nhớ đã vớt "cậu giống cháu" đêm mùng 10 | Có thoại sau đêm 2 | Chương 2 |
| Đêm 11/8: Vy gửi cô Lan hộp thiếc | Hộp nằm ở nhà cô Lan 30 năm; cô nói dối vì bị dọa | Từ đầu game (cô Lan giữ hộp) | Đêm 3 + đối chiếu + cô Lan thú nhận |
| Mùng 9/8: anh Lộc (người thợ hỏi về hầm) mất tích | Bà Năm ngày nào cũng mua bánh mì cho con; tờ tìm người | Từ đầu game (tờ tìm người); bà Năm hiện từ chương 2 | Đối chiếu bà Năm × nghe lén |
| Mẹ nhắn gửi hai đứa sang cô Lan | Cô Lan nhận ra con chị Hạnh, coi như người nhà | Từ đầu | Chương 2 (đêm 3 giường trống, hai đứa ở tạp hoá) |
| Rằm: ông Rạng chết đuối ở bến | Hồn ông Rạng ở bến; dấu chân giày bộ đội | Từ khi giao trà | Đối chiếu dấu chân × lời bác Ba |
| 1995: bác Ba và ông Rạng đào được rìu cổ cạnh giếng; ông Rạng giữ | Bác Ba kể lại | – | Chương 3 |
| Mùng 13/8/1996: ông Rạng trao rìu, anh chém then nắp hầm rồi trả rìu (rìu không qua gương) | Không có vết then (nắp hầm cháy cùng đình) | – | Chương 3 |
| Rằm: anh chém chốt đông nam bằng rìu, rìu tuột tay trong nước/lửa [đã làm] | Chốt đông nam bị chém, vết mẻ răng cưa; rìu bác Ba nhặt trong tro, treo trước xưởng | **Từ đầu game** (rìu đã treo trước xưởng; chốt đã bị chém) | Chương 3 nghi ngờ, chương 4 hiểu |
| Mùng 9/8/1996: anh Lộc bị đưa xuống hầm, đổ xi măng | Chiếc dép tổ ong xanh (thấy ở 1996); bà Năm vẫn đợi con | – | Chương 3 |
| Nhóm Khải dựng chuyện "tế thần sông" (1992, 1994, 1996) | Bia "người mất dưới sông": Mai 1992, Út 1994 | Có từ đầu (đình cũ) | Chương 3 |
| Rằm: người đeo mặt nạ (anh) chém chốt dây trói Vy cạnh kiệu (mẹ trong kiệu), đèn chớp | Ảnh lễ hội trên bàn của Vy | **Từ đầu game, nội dung ảnh không đổi** (tranh cận cảnh vẽ đúng những gì lời mô tả đã nói, thêm khuôn mặt mờ trong cửa kiệu) | Chương 4 |
| Rằm: anh chém dây đèn lồng, đèn rơi vào can dầu | Cô Lan kể "kẻ đeo mặt nạ chém dây đèn" | Có từ chương 4 (lời kể) | Chương 4 |
| Rằm: mẹ biến mất khỏi 1996 (đi qua gương) | Bia: "Hạnh — không tìm thấy thi thể" | Có từ chương 3 (bia ở đình cũ) | Kết |
| Rằm: ông Rạng đẩy anh lên đò rồi bị nước cuốn | Bia "Rạng — chết đuối ở bến"; hồn ông ở bến, mũ cối | Có từ chương 1 | Cao trào |
| Rằm: anh cắm lại khúc chốt gãy vào lỗ đông nam | Nền 2026 vẫn thấy chốt đông nam bị chém cụt (khúc cắm lại không liền, xi măng đổ lên sau) | Có từ đầu | Cao trào |
| Rằm: rìu tuột khỏi tay dưới nước | Bác Ba nhặt trong tro, treo trước xưởng | Có từ đầu | Chương 3 / cao trào |

**Đã giải thích ở chương 2:** gương bọc vải dầu là thói quen của ông Rạng (bác Ba kể); cô Lan trát xi măng hốc cây năm 1997 (cô Lan thú nhận).

**Kết quả chơi thử trọn truyện:** bot chơi từ "Chơi mới" tới "Hết truyện" ba lần liên tiếp đều qua: 10 ngày, khoảng 74 phút (người chơi thật nhiều khả năng 90 phút trở lên). Kiểm tra đi thật 10 khu: 0 lỗi. Nước ngập ở cao trào → tải lại đầu cao trào; lưu/tải giữa cảnh về đúng điểm lưu.

**Kết quả chơi thử sau chương 4:** bot chạy trọn tới hết chương 4 hai lần liên tiếp đều qua: 9 ngày, khoảng 57 phút (chương 4 khoảng 8 phút, phần lớn là đợi tới tối). Kiểm tra đi thật 10 khu: 0 lỗi. Bị người gác đêm rằm bắt → tải lại ngay sau khi cứu Vy, giữ tiền. **Cao trào chưa làm:** sau khi cởi trói mẹ, game tạm đưa người chơi về năm 2026 và ghi rõ "phần cao trào đang được viết".

**Tranh cận cảnh (js/closeups.js):** 17 tranh vẽ cùng nét mực, hiện phía trên khung thoại khi xem đồ vật và trong Sổ điều tra: ảnh lễ hội (dùng chính nhân vật chibi của game, lọc màu ảnh cũ), bàn thờ, bảng tin, bản vẽ, biên bản, gương, sổ thu chi (1996 và ố vàng), lời nhắn của mẹ, thư Vy, danh sách Ban tế lễ, trang sổ tay Vy, bia tưởng niệm, nền gian thờ, bia đá, rìu, hai đứa trẻ ngủ.

**Kết quả chơi thử sau chương 3:** bot chạy trọn tới hết chương 3 ba lần liên tiếp đều qua: 8 ngày, khoảng 49 phút (chương 3 khoảng 10 phút). Kiểm tra đi thật trên 10 khu: 0 lỗi (đã sửa một chỗ kẹt chốt gỗ dưới hầm, nguy hiểm vì đang nước dâng). Nước dâng 22 giây → ngất → tải lại lúc vừa xuống hầm, giữ tiền và rìu.

**Kết quả chơi thử sau chương 2:** bot chạy trọn mở đầu + chương 1 + chương 2 ba lần liên tiếp đều qua: 6 ngày, khoảng 39 phút (chương 2 khoảng 9–11 phút). Đã sửa 2 lỗi khoá truyện do bot tìm ra: thoại "một lần" bị đánh dấu đã nghe khi bị ngắt giữa chừng; cảnh lẻn đêm 2 không đặt lại trạng thái khi tải điểm lưu.

---

## 6. Việc nên làm tiếp
1. Cho vài người thật chơi, đo thời lượng thật, ghi chỗ họ bị lạc (bot không phát hiện được chỗ "khó hiểu").
2. Gài nốt dấu hiệu còn thiếu trước khi viết chương 2–4: thói quen của nhân vật chính, can dầu trong kho đình, lời bác Tư về đêm 10.
3. Chạy lại `PT.run()` và `PT.reach()` sau mỗi lần thêm nội dung để bắt lỗi kẹt.
