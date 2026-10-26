# Đối chiếu luật Lạc Việt

> Đây là báo cáo trước khi sửa. Logic đã được cập nhật ở đợt tiếp theo; xem [RULES_IMPLEMENTATION.md](RULES_IMPLEMENTATION.md) để biết trạng thái hiện tại và phần nội dung còn cần nhóm kiểm duyệt.

Ngày kiểm tra: 27/10/2026.

Nguồn chuẩn do nhóm cung cấp: https://docs.google.com/document/d/1dGaBXfQmm5pzAGyFFaN2mm4vjAK46334zKbjnVnfWP4/edit

Đã đọc toàn bộ nội dung tài liệu qua kết nối Google Drive. Phạm vi: kiểm tra tĩnh source hiện tại, gồm văn bản luật, dữ liệu và luồng xử lý; chạy script đọc dữ liệu TypeScript để đếm bàn cờ, thẻ và chủ đề. Chưa kiểm thử thao tác thực tế trong trình duyệt. Không sửa logic game trong đợt kiểm tra này.

## Kết luận

Văn bản trong `src/data/rulebook.ts` là bản tóm tắt tương đối sát tài liệu. Logic ứng dụng CHƯA triển khai đầy đủ luật đó. Một số cơ chế mới có mô tả, trường dữ liệu hoặc nút giao diện, chưa có xử lý tương ứng.

## Các phần đã đối chiếu thấy khớp

- Bàn cờ 40 ô: 1 START, 3 ô góc, 12 Kiến thức, 8 Thử thách, 8 Thị trường, 8 Lễ hội.
- 36 địa phương: Bắc Bộ 15, Trung Bộ 13, Nam Bộ 8. Có cả Hoàng Sa và Trường Sa.
- `App.tsx:161`: hàm xét thắng dùng Tay nải chưa phong ấn + Hòm ký gửi; mục tiêu 3/5/7 và mỗi miền tối thiểu 1/1/2. Luồng tung xúc xắc gọi xét thắng khi qua hoặc dừng START.
- `CardDrawModal.tsx:215`: Kiến thức đúng nhận kỷ vật, sai nhận Bí kíp theo chủ đề và không mất kỷ vật.
- `CardDrawModal.tsx:77` và `:166`: có kiểm tra Bí kíp cùng chủ đề khi vượt Thử thách tự động và gửi thông tin tiêu hao Bí kíp đó.
- `App.tsx:340`: dừng tại 3 ô góc giải phóng phong ấn. Giao diện ô góc có 4 quyền lợi và giới hạn chọn ký gửi 2 kỷ vật.
- Dữ liệu định nghĩa đủ 4 loại Tài nguyên, 10 loại May mắn với tỷ lệ ghi trong Doc. Tuy nhiên luồng bốc thực tế chưa sử dụng đúng tỷ lệ (xem dưới).

## Sai khác ảnh hưởng trực tiếp kết quả chơi

### 1. Kích hoạt thẻ trong túi đồ chưa có hiệu lực

Doc §7 và §9 yêu cầu Lá chắn, Ngựa trạm, Nỏ thần, Cột mốc, Vô hiệu và Phong ấn có tác dụng cụ thể. `App.tsx:766` chỉ gọi `alert` khi dùng thẻ. Chưa có xử lý đặt Cột mốc, đổ lại và chọn xúc xắc, cướp trong phạm vi 3 ô, phong ấn hay vô hiệu tương ứng ở callback này. Trạng thái Lá chắn có được đọc khi chạm trán nhưng thao tác dùng thẻ chưa bật trạng thái đó.

### 2. Bốc thẻ sai xác suất

Doc §9.2–9.3 quy định Tài nguyên 30/30/22/18%, May mắn 24/12/8/8/8/4/12/8/8/8%. `App.tsx:373`, `:376`, `:486`, `:489` lấy ngẫu nhiên đều theo độ dài mảng: thực tế Tài nguyên 25% mỗi loại và May mắn 10% mỗi loại ở các đường gọi này. `cardDecks.ts` có `drawResourceCard` và `drawFortuneCard` đúng trọng số nhưng chưa được gọi tại đây.

### 3. Nhiều sự kiện May mắn chỉ được lưu như thẻ túi đồ

Doc §5.5 và §9.3 yêu cầu Hội thi, Lộc hội, Thuận buồm, Đạo tặc, Lá lành, Mất mùa xử lý ngay. `CardDrawModal.tsx:250` đưa mọi thẻ May mắn vào túi đồ; chỉ chuyển thêm `extraTurn` và `moveDelta`. Chưa có xử lý phần thưởng Lộc hội, chọn người thắng Hội thi, chuyển thẻ Đạo tặc/Lá lành, bỏ thẻ Mất mùa hay đi đến ô góc bằng Thuận buồm trong luồng này. Bão lũ có lùi 2 ô nhưng chưa thấy hỏi Nón lá chặn sự kiện xấu.

### 4. Qua START chưa làm nhiệm vụ nếu không dừng đúng ô 0

Doc §6.2 yêu cầu cả đi qua lẫn dừng START đều xét thắng, hồi kỹ năng và làm 2 câu hỏi trước khi đi tiếp. `App.tsx:225–278` xét thắng/hồi kỹ năng khi qua START, rồi mở nhiệm vụ ô đích. Chỉ ô đích kiểu `start` mới mở giao diện START tại `:340`. Ví dụ từ ô 38 gieo 5 đến ô 3 sẽ bỏ qua phần 2 câu hỏi START.

### 5. Thưởng START và thu hồi chưa đúng lựa chọn

Doc §6.2 cho chọn 1 kỷ vật trong Kho thất lạc; thu hồi Bảo vật phải mất trạng thái Bảo vật (§1.3). `App.tsx:541` luôn lấy phần tử đầu, giữ nguyên `isTreasure`. `CornerStationModal.tsx:49–102` tự chọn loại thưởng theo điểm, chưa cho chọn Tài nguyên/May mắn. Nút Hướng dẫn viên ở câu thứ hai gọi thẳng `reclaim_start`, không xét tổng điểm trước đó và không xử lý kho trống như luật; việc quá nửa bàn đồng ý chưa được xác nhận.

### 6. Trợ giúp Bí kíp chưa tiêu hao đầy đủ

Doc §10.2: Loại 2 đáp án mất 1 Bí kíp; Có công mài sắt mất 3. `CardDrawModal.tsx:142` và `:153` chỉ loại đáp án/trao kỷ vật, không gửi tiêu hao tương ứng. Luồng vượt Thử thách cùng chủ đề có gửi `consumeBiKipId`, nhưng hai trợ giúp trên chưa có. Chưa có thao tác Hỏi bạn và thưởng Bí kíp cho người giúp. Nút đổi 3 Bí kíp hiện nằm ở phần Kiến thức, chưa cung cấp ngay khi chọn mọi ô địa phương như Doc.

### 7. Thị trường chưa đi được vào giao dịch đúng tỉnh

Doc §5.4 yêu cầu nhận 1 Tài nguyên rồi Trả giá và chọn thẻ thanh toán. `App.tsx:373` mở thẻ Tài nguyên chung không mang tỉnh; `CardDrawModal.tsx:56` chỉ lấy tỉnh từ thẻ, vì vậy `provData` không xác định trong luồng này và giao diện chợ phụ thuộc `provData.marketQuiz` không mở. `:205` có hàm mua nhưng không truyền danh sách thẻ cần trừ; `App.tsx:381` cũng chưa áp dụng `consumeCards` để thanh toán.

### 8. Thử thách thiếu thưởng/phạt và lựa chọn

Doc §5.3: đạt nhận kỷ vật + 1 thẻ tự chọn loại; không đạt chọn kỷ vật rơi, tay nải trống thì bỏ 1 thẻ nếu có; nhận Bí kíp đền bù. `CardDrawModal.tsx:260` chỉ trao kỷ vật khi đạt. Khi thất bại `:274` tự lấy kỷ vật đầu tiên chưa phong ấn, không cho chọn và chưa có phạt bỏ thẻ khi tay nải trống. Chưa có chọn người đoán đúng đầu tiên để thưởng Bí kíp ở thử thách Diễn tả/Vẽ.

### 9. Kỹ năng Token còn thiếu hoặc xử lý sai

- Nón lá: `CardDrawModal.tsx:273` tự miễn phạt Thử thách nếu kỹ năng đang sẵn sàng; kết quả không yêu cầu trừ lượt kỹ năng nên có thể tiếp tục miễn phạt. Doc §8 quy định hỏi kích hoạt và chỉ dùng 1 lần đến khi hồi.
- Đèn lồng: `TokenSkillModal.tsx:47` xem 1 thẻ Thử thách ngẫu nhiên toàn kho, không phải đề sắp làm; callback đổi đề không được truyền từ `App.tsx:835`.
- Bánh mì: `App.tsx:683` chỉ đổi vị trí; chưa thực hiện nhiệm vụ ô mới, xét START hay chạm trán tương ứng. Thời điểm dùng chưa khóa ngay sau gieo xúc xắc theo §8.
- Hoa sen: `App.tsx:647` luôn trao thẻ đầu tiên của loại chọn, chưa bốc ngẫu nhiên; thời điểm dùng chưa khóa ở bước Chuẩn bị.
- Hướng dẫn ở `TurnControls.tsx` nói hồi tự động khi dừng ô góc, trong khi Doc yêu cầu phải chọn quyền lợi hồi kỹ năng.

### 10. Trộm thẻ làm mất thẻ thay vì chuyển sang người trộm

Doc §7.1 yêu cầu bốc ngẫu nhiên và chuyển cho người trộm. `App.tsx:607` xóa thẻ cuối của nhóm Tài nguyên, rồi mới đến May mắn/Kiến thức; nhánh người trộm không nhận thẻ đó. Khi nhiều đối thủ chung ô, `:324` chỉ chọn đối thủ đầu tiên thay vì cho chọn 1 người. Bảo vệ người ít kỷ vật nhất có ở giao diện nhưng tính từ `artifacts + safeArtifacts`, trong đó `artifacts` được cập nhật theo số chưa phong ấn; Doc tính toàn bộ Tay nải + Hòm ký gửi.

### 11. Cột mốc và lộ phí chưa hoàn chỉnh

Doc §7.3 cho người nộp chọn 1 thẻ chuyển cho chủ cột; cột thứ ba phải chọn nhổ 1 cột cũ. Chưa có thao tác đặt cột hoạt động (mục 1). Đoạn dự phòng thu phí `App.tsx:280–307` tự bỏ thẻ và nhánh chủ cột chỉ trả về người chơi cũ, chưa nhận thẻ. Trình tự thu phí hiện trước Chạm trán, trong khi Doc xếp Chạm trán trước nhiệm vụ/lộ phí ô.

### 12. Chưa ép giới hạn 5 thẻ khi kết lượt

Doc §4 yêu cầu xả thẻ thừa. Inventory chỉ hiển thị cảnh báo; `App.tsx:710` chuyển lượt mà không kiểm tra/xả bài. Đồng hồ câu hỏi cũng chỉ giảm đến 0; nút trả lời chưa bị khóa theo thời gian tại `CardDrawModal.tsx:100`, `:109`, `:439`.

### 13. Khám phá và Giờ thu quân chưa được thực thi

Doc §10.1: Khám phá dùng Tốc chiến, tắt đếm giờ, bỏ Nỏ thần/Phong ấn và tắt Chạm trán. `exploreMode` hiện chỉ được lưu cấu hình, chưa được dùng để ràng buộc các luồng đó. `timedMode` luôn khởi tạo false, không có điều khiển bật, chưa có đồng hồ hết giờ và xếp hạng theo số kỷ vật hợp lệ, số miền, khoảng cách đến START.

### 14. Thiết lập chưa đúng một số quy định

Doc §3 yêu cầu nhập biệt danh, mặc định 1 Bí kíp/người và ngẫu nhiên người đi đầu. Setup hiện không có ô nhập tên; `starterBiKip` mặc định true nên cấp 3 thẻ cho mọi người; `App.tsx:197` luôn cho ghế 1 đi đầu. Doc mô tả tùy chọn 3 Bí kíp dành cho người mới/người nhỏ tuổi, còn ứng dụng áp dụng đồng loạt.

## Nội dung/dữ liệu chưa đồng bộ

### 15. Kho câu hỏi chưa đủ và chưa cân bằng 25% mỗi chủ đề

Doc §9.1 và §11.2.4 yêu cầu đủ nội dung 4 chủ đề cho từng tỉnh và cân bằng chủ đề. Hiện có 12 Kiến thức (Lịch sử 6, Phong tục 2, Nghệ thuật 3, Ẩm thực 1) và 8 Thử thách (3/1/3/1 theo các chủ đề tương ứng). `App.tsx:366–369` luôn lấy câu đầu tiên khớp tỉnh; không ngẫu nhiên trong kho tỉnh.

Đặc biệt ô Huế có `province: 'Huế'` ở `boardData.ts:298`, trong khi thẻ dùng `'Thừa Thiên Huế'` tại `cardDecks.ts:213`; phép so sánh tuyệt đối thất bại, rơi về câu đầu toàn kho (Hà Nội), dẫn đến câu hỏi và kỷ vật sai tỉnh. Tên trên bàn cờ và dữ liệu địa phương cũng chưa thống nhất với tên Huế trong Doc.

### 16. Thời lượng mô tả khác Doc

Doc §1.2 ghi Tốc chiến 25–35 phút, Cơ bản 45–60, Trường kỳ 75–90 (cho 4 người). Setup và rulebook hiện ghi khoảng ~30, ~45–60, ~60–90. Tốc chiến là số xấp xỉ chấp nhận được nhưng Trường kỳ cần cập nhật thành 75–90.

### 17. Sổ hành trình mới tạo QR đến URL, chưa chứng minh xuất được bản cá nhân hóa

Doc §10.3 yêu cầu lưu toàn bộ kỷ vật và kiến thức đã thu thập, tải về qua QR. `VictoryModal.tsx:60` tạo QR tới `lacviet.edu.vn/so-hanh-trinh/<player-id>?artifacts=<count>`. Source hiện tại không có trang/endpoint xử lý đường dẫn đó và không đưa danh sách kỷ vật/kiến thức vào bản xuất. Chưa xác minh dịch vụ bên ngoài URL đó. Vì vậy chưa thể coi tính năng đã hoàn tất theo Doc.

## Thứ tự xử lý đề xuất

1. Hoàn thiện giao dịch tài sản: dùng thẻ, tiêu hao Bí kíp, mua chợ, chuyển thẻ khi trộm/thu phí; áp dụng đúng trọng số bốc thẻ.
2. Sửa chu trình di chuyển/START, nhiệm vụ và thưởng/phạt; hoàn thiện 4 kỹ năng Token.
3. Thực thi Khám phá, Giờ thu quân, giới hạn tay bài và đồng hồ câu hỏi.
4. Đồng bộ kho nội dung, tên Huế, thời lượng, biệt danh/người đi đầu và Sổ hành trình.

Việc bỏ nhãn phiên bản theo yêu cầu trước không ảnh hưởng đối chiếu luật: không cần đưa nhãn đó trở lại giao diện để cập nhật đúng cơ chế.
