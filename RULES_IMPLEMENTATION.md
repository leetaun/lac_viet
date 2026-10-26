# Cập nhật xử lý luật — 27/10/2026

Nguồn đối chiếu: tài liệu luật Google Docs mà nhóm cung cấp, ID `1dGaBXfQmm5pzAGyFFaN2mm4vjAK46334zKbjnVnfWP4`.

## Phạm vi giao diện đã được duyệt

Giữ CSS, font và bố cục tổng thể. Các thao tác bổ sung dùng lại các lớp định dạng nút, ô chọn và cửa sổ hiện có. Người dùng đã đồng ý thêm thao tác phục vụ luật, và đồng ý đổi riêng vùng kết quả sai của Thử thách sang vàng nhạt. Không đưa nhãn phiên bản trở lại.

## Đã cập nhật

- Tách quy tắc tài sản vào `src/engine/rules.ts`, điều phối lượt vào `useGameController.ts`; các thành phần giao diện tiếp tục dùng các cửa sổ cũ.
- Bốc thẻ theo trọng số chuẩn. Mỗi lá rút có mã riêng; dùng hoặc chuyển một lá không làm mất các lá trùng loại khác. Khám phá loại Nỏ thần/Phong ấn khỏi kho và chuẩn hóa lại trọng số các lá còn lại.
- Khởi tạo một Bí kíp mặc định; chọn riêng người nhận ba Bí kíp hỗ trợ. Nhập biệt danh, Token không trùng, ngẫu nhiên người đi đầu.
- Trình tự di chuyển → START nếu đi qua → số bước còn lại → Chạm trán → lộ phí → nhiệm vụ → xả bài và kết lượt. Bão lũ không làm nhiệm vụ ở ô bị lùi tới.
- Thị trường nhận một Tài nguyên trước khi Trả giá, cho dùng ngay lá vừa nhận; thanh toán đúng các lá được chọn, có thể dùng Bí kíp. Không mua giữ nguyên bài.
- Bí kíp trợ giúp tiêu hao đúng số lá. Có Hỏi bạn và thưởng người giúp khi đúng; vượt Thử thách tự động kiểm tra cùng chủ đề.
- Thử thách có thẻ thưởng tự chọn loại; khi thua chọn Kỷ vật trong Tay nải để rơi, Tay nải trống chọn thẻ bỏ. Có Bí kíp đền bù và thưởng người đoán đúng đầu tiên cho Diễn tả/Vẽ.
- Kỷ vật hợp lệ và bảo vệ người ít Kỷ vật dùng đúng các tập dữ liệu khác nhau: xét thắng loại phần phong ấn trong Tay nải; bảo vệ tính toàn bộ Tay nải + Hòm ký gửi, kể cả đồng hạng ít nhất.
- Cướp/trộm và lộ phí chuyển tài sản thật, bảo toàn mã lá. Nỏ thần kiểm tra khoảng cách vòng bàn và Bảo vật. Phong ấn không tác động Hòm ký gửi. Lá chắn và Vô hiệu được hỏi vào thời điểm phản ứng.
- Cột mốc tối đa hai cờ/người, một cờ/ô; cột thứ ba phải chọn nhổ cột cũ. Có hiển thị chủ cờ trên bàn cờ.
- START kiểm tra thắng, hồi kỹ năng, làm hai câu hỏi; chọn loại thẻ thưởng hoặc Kỷ vật thu hồi. Kỷ vật thu hồi mất trạng thái Bảo vật. Hướng dẫn viên phải được quá nửa bàn đồng ý.
- Ký gửi tối đa hai Kỷ vật hợp lệ. Ba trạm góc giải phong ấn; hồi kỹ năng là một quyền lợi phải chọn.
- Nón lá hỏi trước khi dùng và tiêu hao một lần; Hoa sen đổi đúng hai lá, bốc ngẫu nhiên; Đèn lồng xem đúng đề sắp làm, tiêu hao và đổi đề một lần; Bánh mì thay đổi hành trình ngay sau gieo xúc xắc.
- Khám phá dùng Tốc chiến, không đếm ngược câu hỏi/không Chạm trán. Giờ thu quân có thời lượng chọn được, hoàn tất lượt đang chơi rồi xếp hạng theo số Kỷ vật hợp lệ, số miền, khoảng cách tiến đến START.
- Giới hạn năm thẻ túi đồ áp dụng cả Bí kíp; người chơi chọn bài thừa để bỏ khi kết lượt. Đồng hồ câu hỏi hết giờ khóa kết quả; không tự lấy lại thời gian khi Hỏi bạn.
- Sổ hành trình lưu Kỷ vật và nội dung đã gặp, xuất file JSON. QR chứa dữ liệu nén trong đường dẫn chính ứng dụng, không phụ thuộc endpoint giả định `lacviet.edu.vn`. Có thể chọn Sổ của từng người chơi. Nếu Sổ vượt dung lượng QR, vẫn tải được toàn bộ file.
- Chuẩn hóa tên Huế và TP. Hồ Chí Minh để truy xuất đúng địa phương; thời lượng Trường kỳ hiển thị 75–90 phút.

## Nội dung và phạm vi xác minh

Đợt QR tiếp theo đã nhập ngân hàng 375 câu do nhóm cung cấp; xem [QR_IMPLEMENTATION.md](QR_IMPLEMENTATION.md). Đoạn mô tả kho gốc dưới đây ghi nhận trạng thái trước đợt nhập đó.

Kho biên soạn gốc vẫn có 12 câu Kiến thức và 8 Thử thách. Bộ chọn hiện phân bổ đều bốn chủ đề, dùng đúng tỉnh; nếu tỉnh/chủ đề chưa có câu biên soạn, ứng dụng tạo câu nhận diện địa phương từ thông tin có sẵn trong `provinces.ts`, không lấy câu của tỉnh khác. Những câu tái sử dụng này chưa thay thế được kho câu chuyên sâu và dẫn chứng đủ bốn chủ đề cho mỗi tỉnh.

Yêu cầu trong Doc về hai nhân sự kiểm duyệt nguồn văn hóa/lịch sử là công việc của nhóm nội dung; chưa thể coi đã hoàn tất chỉ bằng sửa mã. Không tự bịa văn bản, năm xuất bản hoặc tên cơ quan để lấp thiếu dẫn chứng. Các trò vận động, biểu quyết và Hội thi vẫn do người chơi thực hiện/chấm ở bàn; web ghi nhận kết quả và tính tài sản.

QR Sổ hành trình mở trên chính địa chỉ đang chạy ứng dụng; điện thoại quét mã cần truy cập được địa chỉ đó. Không thêm máy chủ lưu tài khoản hoặc công khai dữ liệu người chơi. Mã phòng ở chế độ online vẫn là thiết lập cục bộ như trước; lần sửa này không xây thêm dịch vụ đồng bộ nhiều thiết bị.

## Kiểm tra

Kết quả cuối đợt: 36/36 kiểm thử qua; typecheck và build production thành công.

- `npm run typecheck`: kiểm tra kiểu toàn bộ source.
- `npm test`: kiểm tra quy tắc tài sản, xác suất, điều phối lượt, sự kiện, Token, QR và dựng giao diện React.
- `npm run build`: tạo bản production.
- So sánh các thuộc tính `className` với bản trước khi sửa: giữ lại toàn bộ định dạng cũ, ngoại trừ vùng kết quả sai đã được duyệt. `src/index.css`, `tailwind.config.js` và `index.html` không thay đổi trong đợt sửa logic này.
- Các kiểm tra giao diện tự động là render React và đối chiếu source; không thay thế kiểm tra bằng mắt/thao tác trong trình duyệt.
