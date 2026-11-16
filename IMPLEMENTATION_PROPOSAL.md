# Proposal: Mở chi tiết 11 mục luật trong cửa sổ nổi

Trạng thái: **Người dùng đã accept và đã triển khai.** Sau đó người dùng yêu cầu bỏ biểu tượng mũi tên trên các mục luật; thay đổi này cũng đã thực hiện.

## 1. Yêu cầu

Trong tab Luật, bấm vào một trong 11 mục sẽ mở một cửa sổ nổi (modal) ngay trong trang, hiển thị đầy đủ luật của mục đó. Nội dung không còn bung xuống dưới từng thẻ.

Giữ nguyên giao diện danh sách hiện tại: font, cỡ chữ, độ đậm, màu sắc, kích thước thẻ, bo góc, đường viền, khoảng cách, biểu tượng và hiệu ứng xuất hiện. Header, thanh điều hướng dưới, nút QR và phần thông tin dự án giữ nguyên.

“Cửa sổ khác” được hiểu là modal phủ trên trang hiện tại; không mở tab hoặc cửa sổ trình duyệt mới.

## 2. Hành vi sau khi triển khai

1. Vào tab Luật: hiển thị 11 thẻ tiêu đề ở trạng thái thu gọn; không tự mở mục đầu tiên.
2. Bấm một thẻ: mở một modal chứa đúng tiêu đề, nội dung chi tiết và phần “Điểm cốt lõi cần nhớ” của mục đó nếu có.
3. Nội dung dài được cuộn bên trong modal. Tiêu đề và nút đóng luôn dễ truy cập; modal vừa màn hình máy tính và điện thoại.
4. Đóng bằng nút X, phím Escape hoặc bấm vùng nền bên ngoài modal.
5. Khi modal mở, khóa cuộn nền và giữ focus trong modal. Khi đóng, khôi phục cuộn và trả focus về thẻ đã chọn; giữ vị trí cuộn của danh sách.
6. Bấm mục khác sau khi đóng: hiển thị đúng nội dung của mục mới, bắt đầu từ đầu nội dung.
7. Tiêu đề và nội dung tiếp tục dùng lựa chọn ngôn ngữ hiện có của ứng dụng; không sửa hoặc biên soạn lại dữ liệu luật.

## 3. Thiết kế cửa sổ chi tiết

- Dùng phong cách modal đã có trong ứng dụng: nền trắng, bo góc, viền vàng/nâu và lớp nền phủ tối.
- Tiêu đề giữ `font-serif-lacviet` và kiểu chữ hiện tại của tiêu đề luật.
- Nội dung và khối ghi nhớ tái sử dụng các class định dạng hiện tại: font, màu nền, màu chữ, cỡ chữ, khoảng cách dòng và đường viền.
- Chiều rộng tối đa theo vùng danh sách hiện tại; có lề ở hai bên trên điện thoại, giới hạn chiều cao theo màn hình.
- Giữ nguyên biểu tượng bên phải các thẻ để đáp ứng yêu cầu không đổi giao diện danh sách. Thẻ không còn trạng thái mở rộng hoặc xoay biểu tượng khi bấm.

## 4. Phạm vi sửa code dự kiến

Tệp chính: `src/components/Rulebook/RulebookTab.tsx`.

- Thay trạng thái accordion `openSectionId` bằng trạng thái mục đang được xem, mặc định không chọn mục nào.
- Đổi thao tác bấm tiêu đề thành chọn mục để mở modal.
- Bỏ phần render nội dung bên dưới từng thẻ; chuyển nguyên cấu trúc nội dung sang modal.
- Thêm xử lý đóng, focus, phím Escape và khóa/khôi phục cuộn nền, có cleanup khi component unmount.
- Đặt modal trên header và thanh điều hướng để nội dung không bị che; dùng React portal vào `document.body` nếu cần để tránh ảnh hưởng của animation/stacking context trên danh sách.
- Bổ sung `role="dialog"`, `aria-modal`, liên kết tiêu đề và nhãn nút đóng.

Không cần thêm thư viện. Dữ liệu `src/data/rulebook.ts`, CSS toàn cục và cấu hình font không cần thay đổi. Nếu phát hiện cần mở rộng phạm vi để hoàn thành yêu cầu, sẽ nêu rõ trước khi sửa thêm.

## 5. Kiểm tra và tiêu chí nghiệm thu

- Kiểm tra đủ 11 mục: bấm đúng mục, hiển thị đủ nội dung và phần ghi nhớ tương ứng.
- Danh sách không giãn chiều cao sau khi bấm; không có nội dung chi tiết xuất hiện dưới thẻ.
- So sánh giao diện danh sách trước/sau ở cùng kích thước màn hình: font, màu, khoảng cách và kích thước thẻ giữ nguyên.
- Kiểm tra nội dung dài, cuộn modal, vị trí nút đóng và việc không bị header/thanh điều hướng che trên máy tính và điện thoại.
- Kiểm tra X, Escape, bấm nền ngoài, điều hướng Tab/Shift+Tab, trả focus và giữ vị trí cuộn danh sách.
- Kiểm tra lựa chọn VI/EN theo dữ liệu sẵn có; nút QR vẫn hoạt động.
- Chạy `npm run typecheck`, `npm run build` và các kiểm tra hiện có liên quan đến giao diện nếu có.

## 6. Điểm dừng phê duyệt

Proposal này là thay đổi duy nhất ở bước hiện tại. Chỉ bắt đầu sửa code sau khi người dùng accept. Việc triển khai được duyệt không bao gồm commit, push hoặc deploy.
