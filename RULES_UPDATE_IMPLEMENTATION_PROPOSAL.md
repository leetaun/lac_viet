# Proposal implementation: Đồng bộ luật chơi Lạc Việt mới

Trạng thái: **Người dùng đã accept và cho triển khai. Đã cập nhật code local theo phạm vi dưới đây.**

Nguồn đối chiếu: https://docs.google.com/document/d/1DPk6IuGjNTM_gsNTXcG35gV_HdRExjlamzw14tLbcV8/edit?tab=t.0

Source được rà soát: commit `bd42e9f` trên nhánh `main`.

## 1. Mục tiêu

Đồng bộ nội dung hướng dẫn và cách xử lý ván chơi với luật mới của nhóm: bộ thẻ theo chủ đề, nhập xúc xắc vật lý, Bí kíp cùng chủ đề, các dạng Thử thách và hình phạt khi Tay nải trống.

Giữ font, bảng màu, phong cách thẻ/nút, nền của bốn tab và bố cục bàn cờ vuông hiện tại. Các điều khiển mới dùng cùng phong cách giao diện, có nội dung VI/EN. Không thêm thư viện nếu các công cụ hiện có đáp ứng được.

## 2. Hai phần giữ nguyên theo yêu cầu người dùng

- **Hòm ký gửi:** giữ xử lý hiện tại là mỗi lần ký gửi tối đa 2 kỷ vật; chưa thêm giới hạn tổng sức chứa 2. Không sửa lời hướng dẫn thành giới hạn tổng khi nhóm chưa chốt.
- **Nỏ thần:** giữ phạm vi 3 ô theo đường đi vòng của bàn cờ như code hiện tại. Không suy diễn con số bị thiếu trong tài liệu thành một luật mới.

Hai mục này không thuộc phạm vi thay đổi của proposal.

## 3. Nội dung triển khai

### 3.1. Cập nhật tab Luật

- Viết lại nội dung VI/EN theo tài liệu mới; dùng cấu trúc 10 mục tương ứng để nhóm dễ kiểm tra. Tiếp tục bấm từng mục để mở cửa sổ luật chi tiết.
- Bỏ khẳng định không sử dụng thẻ giấy; phân biệt bộ thẻ chủ đề vật lý với việc quản lý kỷ vật và túi đồ trên Web.
- Bổ sung hướng dẫn nhập mã bộ, dùng QR tích hợp câu hỏi và nhập kết quả xúc xắc vật lý.
- Làm rõ ba Bí kíp đổi kỷ vật tại ô Kiến thức; một Bí kíp cùng chủ đề để tự động vượt Thử thách.
- Bỏ khẳng định mọi bộ câu hỏi luôn chia đều bốn chủ đề 25%, vì luật mới cho phép bộ thẻ chỉ thuộc một chủ đề.
- Các tùy chọn mở rộng đang có chỉ mô tả là tùy chọn riêng, không trình bày thành điều bắt buộc trong luật chuẩn.
- Giữ nguyên hai nội dung chưa chốt ở mục 2 của proposal.

### 3.2. Bộ thẻ chủ đề và QR

- Bổ sung cấu trúc bộ thẻ gồm mã định danh bộ, chủ đề, danh sách câu hỏi và định danh từng thẻ/QR. Mỗi câu hỏi có chủ đề thực tế, loại nhiệm vụ và độ khó.
- Thêm khu vực quản lý bộ thẻ: nhập mã bộ hợp lệ, xem bộ đã kích hoạt và tích hợp câu hỏi bằng QR tương ứng. Tận dụng cơ chế mở liên kết QR hiện có; quét bằng camera điện thoại để mở Web, không mặc định thêm trình quét camera trong ứng dụng.
- Kiểm tra quan hệ mã bộ–thẻ: từ chối mã không tồn tại, thẻ không thuộc bộ đã kích hoạt, hoặc nội dung QR không hợp lệ. Quét lại cùng thẻ không tạo câu hỏi trùng.
- Với bản local trước mắt, lưu bộ đã kích hoạt và câu hỏi đã tích hợp trên trình duyệt; cho người chơi chọn bộ dùng trong ván. Trong phòng chơi, máy chủ phòng xác định bộ câu hỏi để các thiết bị cùng xử lý nhất quán.
- Cơ chế này chỉ là tích hợp bộ thẻ vào bản local. Chưa bao gồm thanh toán, tài khoản, xác minh quyền mua, mã dùng một lần hoặc đồng bộ thư viện cá nhân giữa thiết bị; không coi dữ liệu trình duyệt là bằng chứng sở hữu bộ thẻ thương mại.
- Chưa có danh mục mã bộ/QR thật trong tài liệu. Khi triển khai sẽ tạo cấu trúc tiếp nhận dữ liệu và dùng dữ liệu thử được ghi rõ để kiểm tra; không tự đặt mã thương mại hoặc khẳng định đã tích hợp bộ thẻ thật khi nhóm chưa cung cấp dữ liệu.

### 3.3. Nhập xúc xắc vật lý

- Ở chế độ chơi với bàn cờ vật lý, thay thao tác tự tung bằng bảng chọn 1–6 và nút xác nhận kết quả.
- Xác nhận một lần mới di chuyển; chặn gửi lặp, nhập ngoài lượt hoặc khi nhiệm vụ trước chưa hoàn thành.
- Ngựa trạm: cho nhập kết quả tung lại, sau đó chọn một trong hai kết quả. Bánh mì: tiếp tục chọn tiến/lùi một ô sau khi đã xác nhận kết quả.
- Qua START, di chuyển và các sự kiện phát sinh tiếp tục đi qua cùng bộ xử lý luật hiện có.
- Chế độ chơi hoàn toàn trên Web và lượt AI tiếp tục có xúc xắc tự động; phân biệt rõ lựa chọn này với chế độ nhập xúc xắc vật lý.

### 3.4. Câu hỏi, chủ đề và Bí kíp

- Chọn câu hỏi từ bộ đang dùng, đúng loại ô và độ khó; giữ chủ đề của câu hỏi khi cấp Bí kíp do trả lời sai hoặc thất bại Thử thách.
- Không gắn toàn bộ câu hỏi mới thành `general`. Phân loại dữ liệu hiện có theo nội dung có thể xác định; câu nào chưa đủ căn cứ thì đánh dấu cần nhóm xác nhận, không đoán để làm sai cơ chế cùng chủ đề.
- Dữ liệu chủ đề mở rộng được thiết kế để có thể thêm Địa lý hoặc bộ khác sau này; không ép các bộ tương lai vào bốn nhãn cũ.
- Loại hai đáp án, Hỏi bạn và đổi ba Bí kíp tại ô Kiến thức không yêu cầu cùng chủ đề.
- Tự động vượt Thử thách yêu cầu đúng một Bí kíp cùng chủ đề. Kiểm tra ở bộ xử lý trạng thái ván chơi, không chỉ ẩn/hiện nút trên giao diện.
- Ván cũ có Bí kíp `general` được giữ dữ liệu; không tự đổi chúng sang một chủ đề cụ thể. Chúng vẫn dùng được cho trợ giúp không yêu cầu chủ đề, nhưng không được coi là khớp một chủ đề cụ thể.

### 3.5. Đủ các dạng Thử thách

- Đưa Trắc nghiệm khó, Hành động và Kể nhanh vào luồng chọn nhiệm vụ thực tế khi bộ đang dùng có dữ liệu tương ứng.
- Trắc nghiệm chấm theo đáp án; Hành động/Kể nhanh có thời gian và thao tác xác nhận đạt/không đạt của bàn chơi. Không tự coi các nhiệm vụ này là trắc nghiệm hoặc tự động chấm đúng.
- Giữ cơ chế xem trước/đổi đề của Đèn lồng; đề thay thế vẫn thuộc bộ được chọn và loại nhiệm vụ phù hợp.
- Thành công, kể cả vượt bằng một Bí kíp cùng chủ đề: nhận kỷ vật của tỉnh và một thẻ ngẫu nhiên thuộc loại thưởng người chơi chọn, theo bảng luật mới.
- Không tự bổ sung tỷ lệ xuất hiện các dạng Thử thách khi tài liệu chưa quy định; việc chọn ngẫu nhiên dựa trên danh sách nhiệm vụ hợp lệ có trong bộ.

### 3.6. Đổi ba Bí kíp và thất bại Thử thách

- Giới hạn đổi ba Bí kíp lấy ngay kỷ vật tại ô Kiến thức. Chặn cùng thao tác tại Thử thách, Thị trường, Lễ hội và ô góc, cả trong giao diện lẫn bộ xử lý.
- Khi thua Thử thách: nếu có kỷ vật trong Tay nải, cho chọn một kỷ vật làm rơi; cấp một Bí kíp đền bù. Hòm ký gửi tiếp tục được bảo vệ.
- Nếu Tay nải không có kỷ vật: không ép bỏ thêm thẻ bài, vẫn nhận Bí kíp đền bù theo luật mới. Giữ tương tác miễn phạt của Nón lá.

## 4. File dự kiến thay đổi

- `src/data/rulebook.ts`: nội dung luật VI/EN.
- `src/data/questionBank.ts`, `questionBank.json`, `cardDecks.ts`: chủ đề, dạng nhiệm vụ và ánh xạ bộ thẻ; chỉ sửa nội dung khi có căn cứ.
- Thêm module dữ liệu bộ thẻ và module lưu thư viện trên trình duyệt nếu cần, tách khỏi trạng thái lượt chơi.
- `src/types/game.ts`: dữ liệu bộ thẻ, câu hỏi, chủ đề và tùy chọn nhập xúc xắc.
- `src/engine/useGameController.ts`, `rules.ts`, `content.ts`: lựa chọn câu hỏi, xác nhận xúc xắc, xác thực Bí kíp và xử lý hình phạt.
- `src/components/GameSetup/GameSetupModal.tsx`: chọn cách dùng xúc xắc và bộ thẻ của ván.
- `src/components/GameBoard/DiceRoller.tsx`, `GameBoard.tsx`: điều khiển nhập xúc xắc.
- `src/components/Modals/CardDrawModal.tsx`, `TokenSkillModal.tsx`: trợ giúp, Thử thách và kỹ năng liên quan.
- `src/components/QRCardGateway.tsx`, `RemoteQR.tsx`, `src/App.tsx` và phần lưu/truyền trạng thái liên quan: tích hợp QR và bộ câu hỏi trong ván.
- Thêm giao diện quản lý bộ thẻ theo phong cách hiện có; chỉ chỉnh CSS cục bộ cần thiết.

Danh sách có thể điều chỉnh theo phụ thuộc thực tế; không mở rộng sang thiết kế lại bàn cờ hoặc backend thương mại.

## 5. Thứ tự triển khai sau khi accept

1. Chuẩn hóa mô hình dữ liệu bộ thẻ/chủ đề và cách đọc trạng thái đã lưu.
2. Sửa logic Bí kíp, hình phạt và các dạng Thử thách.
3. Thêm nhập xúc xắc vật lý, bảo toàn kỹ năng và luồng START.
4. Tích hợp quản lý bộ thẻ, QR và lựa chọn câu hỏi cho ván.
5. Cập nhật tab Luật VI/EN theo hành vi đã triển khai.
6. Kiểm tra, báo rõ phần hoạt động được và phần chờ dữ liệu bộ thẻ thật.

## 6. Kiểm tra nghiệm thu

- TypeScript và build thành công; chạy bộ test hiện có, ghi rõ lỗi sẵn có nếu gặp.
- Kiểm tra nhập xúc xắc 1–6, xác nhận lặp, Ngựa trạm, Bánh mì, qua START và lượt chơi từ xa.
- Bộ thẻ: mã sai, QR sai bộ, quét trùng, tải lại trang và lựa chọn câu hỏi đúng bộ đã chọn. Dữ liệu thử phải được nhận biết rõ.
- Bí kíp: đúng/sai chủ đề khi vượt Thử thách; trợ giúp tại Kiến thức dùng chủ đề bất kỳ; ba Bí kíp không thể bỏ qua loại ô khác.
- Thử đủ ba dạng Thử thách; thắng nhận đúng thưởng, thua có/không có kỷ vật Tay nải, Nón lá và Bí kíp đền bù.
- Giữ hành vi hiện tại của ký gửi tối đa hai mỗi lần và phạm vi ba ô của Nỏ thần.
- Đối chiếu luật VI/EN với hành vi thực tế; kiểm tra giao diện laptop, tính dễ đọc, font/màu và bốn tab. Nếu không truy cập được trình duyệt kiểm tra trực quan sẽ ghi rõ giới hạn xác minh.
- Kiểm tra trạng thái lưu cũ không làm ứng dụng lỗi; không tự xóa ván hoặc thư viện người chơi.

## 7. Điểm dừng

Proposal đã được accept. Phạm vi không bao gồm commit, push, deploy hoặc chỉnh tài liệu Google Docs của nhóm. Bộ thẻ thật còn chờ nhóm cung cấp mã, ánh xạ QR và nội dung; bản local dùng các bộ DEMO ghi rõ trong giao diện.
