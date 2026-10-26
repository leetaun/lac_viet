# Bộ câu hỏi và bốn thẻ QR Lạc Việt

Địa chỉ cố định: `https://lac-viet.vercel.app/`. Chưa tự push GitHub hoặc triển khai Vercel trong đợt chuẩn bị này.

Người dùng chọn xem trước và chưa cho phép push. Bản sửa sau bổ sung phòng QR giữa laptop và điện thoại; không còn mặc định quét trên thiết bị khác là luyện tập. Các mã in vẫn trỏ đến website chính thức và chỉ dùng chức năng mới sau khi website được cập nhật, kết nối Redis.

## Dữ liệu đã nhập

Nguồn do nhóm cung cấp: `Ngan_hang_cau_hoi_kien_thuc_xa_hoi_375_cau.docx`. Mã SHA-256 được lưu trong `src/data/questionBank.json` và báo cáo nhập để truy vết bản gốc.

Đã nhập đủ 375 câu, mỗi câu bốn phương án, một đáp án đúng, giải thích và danh mục nguồn đúng theo file. Ba độ khó Cơ bản, Trung bình, Cao cấp có cùng cấu trúc: 50 Kiến thức, 25 Thử thách, 25 Thị trường, 25 Lễ hội. Không tự xác nhận lại độ chính xác của 375 đáp án chỉ từ việc nhập dữ liệu.

Theo ý kiến người dùng đã xác nhận, giữ nguyên nhóm và độ khó; đánh dấu Liên ngành cho bộ này. Không giả vờ câu vật lý, kinh tế hoặc lịch sử thế giới là câu riêng của một tỉnh. Khi chơi, tỉnh đang đứng xác định Kỷ vật thưởng. Bí kíp sinh ra từ câu liên ngành được ghi đúng chủ đề Liên ngành.

- Kiến thức và Thử thách lấy câu trong đúng nhóm, độ khó đã chọn; tránh lặp tới khi dùng hết kho phù hợp.
- Thị trường dùng câu kinh tế trong nhóm Thị trường để Trả giá; vẫn nhận Tài nguyên trước và dùng đúng cơ chế giá 1/2 thẻ.
- Lễ hội giữ nguyên tỷ lệ các thẻ May mắn. Chỉ thẻ Hội thi dùng câu hỏi Lễ hội để cả bàn thi; không biến mọi ô Lễ hội thành câu trắc nghiệm có thưởng ngoài luật.

## Đường dẫn trên thẻ

| Thẻ vật lý | Đường dẫn | Dùng ở ô |
|---|---|---|
| Kiến thức | `https://lac-viet.vercel.app/#card=knowledge` | Kiến thức |
| Thử thách | `https://lac-viet.vercel.app/#card=challenge` | Thử thách |
| Tài nguyên | `https://lac-viet.vercel.app/#card=resource` | Thị trường |
| May mắn | `https://lac-viet.vercel.app/#card=fortune` | Lễ hội |

Dùng hash để mọi mã mở ngay trang gốc Vercel, không cần tạo bốn máy chủ hoặc bốn trang Google Docs. Cập nhật kho câu hỏi không làm thay đổi bốn mã này.

## Cách chơi và giữ ván khi quét

1. Laptop tạo ván Offline, bật Dùng 4 thẻ QR vật lý. Khi đến ô nhiệm vụ, bấm **Kết nối điện thoại** để tạo mã phòng 10 ký tự.
2. Điện thoại bất kỳ quét thẻ tương ứng, nhập mã phòng một lần. Trình duyệt nhớ phòng cho các lần quét sau; có nút Đổi phòng.
3. Điện thoại chọn tỉnh đang đứng và độ khó. Máy chủ kiểm tra đúng loại thẻ, tỉnh, nhiệm vụ rồi chuyển yêu cầu mở thẻ về laptop.
4. Laptop rút câu hỏi theo nhóm/độ khó và gửi mã câu hỏi lên phòng. Điện thoại hiển thị câu hỏi và gửi chỉ số đáp án. Máy chủ chấm từ ngân hàng, kiểm tra hạn trả lời; gửi lại boolean kết quả và mã nhiệm vụ cho laptop.
5. Kiến thức/Thử thách được laptop xử lý qua engine thưởng/phạt hiện có. Lựa chọn thẻ thưởng, kỹ năng, Kỷ vật làm rơi vẫn ở laptop. Trả giá ở Thị trường nhận đáp án điện thoại rồi chọn thẻ thanh toán trên laptop. Hội thi vẫn do bàn chơi xác định người thắng trên laptop; các sự kiện May mắn khác giữ nguyên luật, điện thoại hiển thị nội dung sự kiện.
6. Mỗi nhiệm vụ chỉ nhận một đáp án, cập nhật phòng dùng so sánh phiên bản nguyên tử; đáp án cũ không áp dụng vào thẻ mới. Khi hết giờ, máy chủ báo thất bại cho laptop kể cả điện thoại ngắt kết nối. Các thiết bị trong phòng chỉ dùng chung nhiệm vụ hiện tại; không cần tài khoản.

Laptop giữ toàn bộ ván trong localStorage. Phòng chỉ lưu tên người đang lượt, loại thẻ, tỉnh, mã câu hỏi, hạn trả lời và kết quả. Máy chủ không nhận dữ liệu túi đồ hay toàn bộ ván. Mã chủ phòng tách khỏi mã điện thoại, điện thoại không được tự xuất bản nhiệm vụ hay xác nhận đã xử lý kết quả. Đây là cơ chế demo cho một bàn, không phải chế độ nhiều người chơi điều khiển toàn bộ ván từ xa. Không chia sẻ mã phòng với người ngoài bàn.

### Thử ngay trong mạng Wi-Fi

Chạy `npm run dev -- --host 0.0.0.0 --port 3014`. Laptop mở `http://localhost:3014/`. Điện thoại cùng Wi-Fi mở `http://<IP-laptop>:3014/#card=knowledge` (đổi loại thẻ khi cần). Bản local dùng bộ nhớ tiến trình trên laptop, không cần Redis. Khởi động lại dev server sẽ mất phòng; bấm Tạo lại phòng. QR in chính thức vẫn mở Vercel, không mở máy local. Dùng đường dẫn mạng nội bộ để thử trước khi triển khai; Windows có thể cần cho phép Node truy cập mạng riêng.

### Bật phòng trên Vercel

Vercel Functions không chia sẻ bộ nhớ giữa các lần chạy. Tạo Redis trong Vercel Marketplace/Upstash và nối với project. Cần biến môi trường `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (hoặc `KV_REST_API_URL`, `KV_REST_API_TOKEN` do tích hợp tạo). Không đưa token vào source hay biến `VITE_*`. Các tên biến mẫu có trong `.env.example`. Sau khi cấu hình cần deploy bản mới; đợt này chưa push/deploy hay tự tạo dịch vụ bên ngoài.

API `api/qr-room.ts` dùng Redis REST với cập nhật CAS nguyên tử và TTL 6 giờ. Bản local dùng middleware trong `vite.config.ts` cùng nghiệp vụ `server/rooms.ts`. Client thăm dò mỗi giây, tự thử lại khi mất mạng; giao diện hiển thị lỗi. `node scripts/check-room-demo.cjs` kiểm tra HTTP bằng hai kết nối độc lập với dev server đang chạy. QR Sổ hành trình sau trận vẫn là cơ chế riêng.

Kiểm tra bản sửa: 51/51 kiểm thử qua, TypeScript và build thành công. Đã chạy kiểm tra HTTP bằng hai kết nối độc lập qua localhost và địa chỉ Wi-Fi `192.168.100.130:3014`, gồm ghép phòng, mở nhiệm vụ, đáp án đúng và xác nhận kết quả một lần. Chưa thử camera/điện thoại vật lý. Bốn ảnh QR thử `public/qr/demo-{knowledge,challenge,resource,fortune}.png` mở địa chỉ Wi-Fi trên, được bỏ qua bởi Git; chỉ dùng trong buổi xem trước, không in làm thẻ chính thức. Mã in chính thức không thay đổi.

## File để in

- `output/pdf/lac-viet-qr-cards-a4.pdf`: một trang A4, bốn thẻ 63 × 88 mm, dấu cắt, font Be Vietnam Pro và Playfair Display giống website.
- `output/qr/{knowledge,challenge,resource,fortune}.svg`: QR vector để đưa vào bản thiết kế thẻ riêng.
- `output/qr/{knowledge,challenge,resource,fortune}.png`: QR 1200 × 1200 pixel, nền trắng, vùng trống bốn module, mức sửa lỗi Q.
- Bản PDF và các mã có bản sao tại `public/qr/` để tải trực tiếp từ mục Luật chơi sau khi triển khai.

In PDF ở tỷ lệ 100% / Actual size. Không chọn Fit to page. Dùng nguyên vùng trắng quanh QR; không đè hình, chữ hoặc logo lên mã.

PDF đã được render để kiểm tra bố cục, và một thư viện giải mã độc lập đã đọc đủ bốn mã trên trang PDF cũng như bốn PNG ra đúng các đường dẫn trong bảng. Kết quả lưu tại `output/qr/verification.json`.

## Đưa bản mới lên website

PDF có thể giữ nguyên mã khi triển khai. Tuy nhiên website hiện đang chạy bản cũ sẽ chưa hiểu chức năng mới chỉ nhờ mã QR: cần push code đã kiểm tra lên nhánh mà dự án Vercel đang theo dõi, đợi deploy thành công, rồi thử bốn đường dẫn trên điện thoại trước khi phát hành bộ thẻ.

Không tự đoán nhánh triển khai hoặc push toàn bộ thay đổi có sẵn khi chưa xác nhận với người dùng. Đợt này cũng không tự sửa cấu hình tên miền hay chuyển tài khoản Vercel.

## Kiểm tra và tái tạo

- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run qr:assets` tạo lại SVG, PNG và manifest từ bốn đường dẫn trong source.
- `scripts/extract-question-bank.py <file.docx>` trích đoạn văn OOXML; `scripts/import-question-bank.mjs --paragraphs <json> --source <tên-file> --sha256 <hash>` kiểm tra cấu trúc rồi nhập lại. Không sửa file Word gốc.
- `scripts/create-qr-cards.py` tạo PDF từ manifest với reportlab và bốn tệp font đã tải vào `.qr-work/fonts`; `scripts/validate-qr-pdf.py` xác minh PDF/PNG với zxing-cpp.

Các thông số kiểm duyệt văn hóa và dẫn chứng vẫn cần nhóm nội dung rà soát; nhập đủ dữ liệu không thay cho kiểm duyệt chuyên môn.
