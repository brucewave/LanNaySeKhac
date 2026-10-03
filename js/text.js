// Lời thoại. Khoá theo ID; mỗi phần tử là một chuỗi dòng [{who, text}].
var G = window.G || (window.G = {});

G.TEXT = {
  intro: [
    { text: 'Tháng Mười, 2026. **Em gái tôi mất liên lạc** đã mười hai ngày.' },
    { text: 'Tôi về lại căn nhà cũ ven sông. Hồi nhỏ, sáng nào mẹ cũng đẩy chiếc xe trà đá này ra chợ.' },
    { text: 'Mẹ mất trong [[vụ cháy đình năm 1996]]. Chiếc xe vẫn nằm sau hiên, tôi lau lại và thay bánh.' },
    { who: 'Tôi', text: 'Muốn ở lại đây tìm em thì trước hết phải tự nuôi được mình đã.' }
  ],
  ban_tho: [
    { text: 'Bàn thờ phủ bụi. Ảnh mẹ chụp năm 1995, mẹ đứng cạnh chiếc xe trà đá, tay cầm cái quạt nan.' },
    { text: 'Bát hương còn mấy chân nhang mới. [[Có người đã thắp nhang ở đây trước tôi]], chắc là em.' }
  ],
  ban_vy: [
    { text: 'Bàn học cũ của Vy. Cuốn sổ tay bị xé gần hết, chỉ còn một tấm ảnh in kẹp ở bìa.' },
    { text: 'Ảnh chụp lễ hội đình, góc ảnh in ngày: **Rằm tháng Tám, 1996**.' },
    { text: 'Đứng giữa ảnh là Vy. [[Đúng tuổi bây giờ, mặc chiếc áo khoác em mặc hôm mất liên lạc.]]' },
    { text: 'Sau lưng Vy là [[một người đeo mặt nạ, tay cầm rìu]]. Cổ người đó quấn một chiếc khăn, ảnh cũ nên chỉ thấy màu tối.' },
    { text: 'Mép trái ảnh có mấy người khiêng kiệu. Một người đeo băng đỏ **"Ban tế lễ"**, mặt nhìn rõ: [[nốt ruồi lớn dưới mắt trái]].' },
    { who: 'Tôi', text: 'Ảnh năm 1996... sao lại có Vy của bây giờ?' }
  ],
  table9_copy: [
    { text: 'Trên bàn là một cuộn giấy can: bản vẽ sửa đình, giống hệt bản tôi đang giữ.' },
    { text: 'Ông Rạng cũng giữ một bản. Tôi để nó lại chỗ cũ.' }
  ],
  box_closed: [
    { text: 'Một thùng giấy dán băng keo, ngoài ghi "VE CHAI". Không phải đồ của mình, tôi không tự tiện mở.' }
  ],
  box_open: [
    { text: 'Thùng giấy toàn hồ sơ cũ của **ban quản lý đình**, phần lớn ẩm mốc.' },
    { text: 'Có một tập kẹp: **Biên bản nghiệm thu sửa đình 1995**. Bản vẽ nộp kèm [[không có hầm]]. Người ký duyệt: **Trưởng ban Nguyễn Văn Khải**.' }
  ],
  box_draft: [
    { text: 'Kẹp lẫn bên dưới là một cuộn giấy can: bản vẽ gốc ký tên **Ba Mộc**, có [[ô vuông "hầm" bị tẩy]] và dòng bút chì [["không đưa vào bản nộp"]].' },
    { who: 'Tôi', text: 'Ai lại đem hồ sơ đình đi bán ve chai?' }
  ],
  box_done: [
    { text: 'Thùng giấy cũ. Tôi đã lấy những gì cần.' }
  ],
  door9_locked: [
    { text: 'Nhà số 9. Cửa gỗ đóng chặt, [[then cài từ bên trong]].' },
    { text: 'Trên bậc cửa có nhiều vết tròn, **như ai đó đã đặt ly nước ở đây rất nhiều lần**.' }
  ],
  door9_deliver: [
    { text: 'Tôi đặt ly trà lên bậc cửa, chồng lên những vết tròn cũ.' },
    { text: 'Cạch. Cánh cửa tự hé ra một khe.' },
    { text: '**Bản lề đã mục, then cửa rỉ sét gãy đôi.** Chỉ cần gió sông lùa là bật ra.' },
    { text: 'Bên trong tối, mùi gỗ ẩm. Trên cái bàn sát tường **có một cuộn giấy**.' }
  ],
  ban_ve_dinh: [
    { text: 'Một cuộn giấy can ố vàng: **bản vẽ sửa đình làng năm 1995**, ký tên **Ba Mộc**.' },
    { text: 'Có mặt bằng, kèo cột, gian thờ. Góc dưới có [[một ô vuông bị tẩy mờ]].' },
    { text: 'Cạnh ô vuông ghi bút chì, nét vội: [["hầm — không đưa vào bản nộp"]].' },
    { who: 'Tôi', text: 'Dưới đình có hầm? Sao lại giấu khỏi bản nộp?' }
  ],
  bang_tin: [
    { text: 'Bảng tin phường dán chồng nhiều lớp giấy: lịch tiêm chủng, thông báo cắt điện, giấy tìm người.' },
    { text: 'Dưới cùng là một tờ tìm người đã ố vàng. Chữ in mờ, chỉ còn đọc được dòng: [["...mất tích tháng 8 năm 1996, gần đình làng"]].' },
    { who: 'Tôi', text: 'Năm 1996. **Đúng năm đình cháy.**' }
  ]
};
