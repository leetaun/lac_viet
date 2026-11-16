# Proposal: Bàn cờ vừa màn hình, giữ tên tỉnh dễ đọc

Trạng thái: **Người dùng đã duyệt triển khai riêng cho laptop. Phần điện thoại hoãn lại.**

Điều chỉnh theo phản hồi mới nhất: bàn cờ phải vuông, cả 40 ô cùng kích thước vuông. Phương án bàn chữ nhật bên dưới đã được thay thế bằng lưới 11×11 có các hàng/cột bằng nhau; thông tin người chơi chuyển sang bên cạnh, thanh điều hướng dưới được giảm padding vừa phải và phần giữa được thu gọn. Giữ nguyên font và bảng màu. Chiều rộng bàn tính theo chiều cao còn lại thực tế sau khi trừ header, thanh điều hướng và padding; không ép kích thước tối thiểu vượt màn hình. Cỡ chữ và khoảng cách điều chỉnh theo kích thước bàn. Các mục bên dưới lưu lại phương án đề xuất ban đầu; phần này ghi nhận các điều chỉnh đã được người dùng yêu cầu trong quá trình triển khai.

## 1. Mục tiêu và giới hạn

Giảm nhu cầu kéo trang để nhìn hết bàn cờ; giữ đủ 40 ô, tên tỉnh dễ đọc, token và cột mốc dễ nhận biết, các thao tác chơi tiếp tục hoạt động.

Giữ font, độ đậm chữ, bảng màu, phong cách viền/bo góc, nền và biểu tượng hiện tại. Không đổi luật, thứ tự di chuyển hoặc dữ liệu tỉnh.

Có một giới hạn cần duyệt rõ: màn hình điện thoại dọc rộng khoảng 360–430px không đủ để đặt 11 cột tên tỉnh với cỡ chữ hiện tại. Vì vậy không thể đồng thời giữ nguyên khung bốn cạnh, giữ cỡ chữ dễ đọc và đưa đủ mọi ô vào một màn hình điện thoại dọc. Proposal đề xuất bố cục gọn riêng cho màn hình hẹp ở mục 4; đây là thay đổi bố trí, không phải đổi phong cách thiết kế.

## 2. Nguyên nhân trong code hiện tại

- `GameBoard.tsx` ép bàn cờ rộng tối thiểu 760px, tăng lên 850px ở breakpoint md; điện thoại phải cuộn ngang.
- `BoardSpaceTile.tsx` đặt chiều cao tối thiểu 64–75px cho từng ô thường. Hai cạnh bên có 9 ô nên riêng phần giữa đã rất cao, chưa kể hai hàng trên/dưới.
- Ô góc dùng `aspect-square`, khiến chiều cao tăng theo chiều rộng bàn cờ trên laptop.
- Vùng trung tâm còn đặt chiều cao tối thiểu 360px và có khoảng trống lớn.
- Thanh người chơi, điều khiển và padding cuối trang cùng chiếm thêm chiều cao; thanh điều hướng dưới cố định có thể che bàn cờ.
- Tên tỉnh hiện dùng `truncate`, nên một số tên dài đã bị rút gọn bằng dấu ba chấm.

## 3. Phương án laptop / màn hình đủ rộng

Giữ bố cục bàn cờ bốn cạnh hiện tại, với đủ 40 ô và vị trí START/các ô góc như cũ.

- Tính không gian sử dụng thực tế theo viewport động, trừ header, thanh điều hướng, lề và các vùng điều khiển đang hiển thị. Đo kích thước vùng chứa bằng `ResizeObserver` khi cần; cập nhật khi đổi kích thước cửa sổ hoặc xoay thiết bị.
- Bỏ các giới hạn kích thước đang ép bàn quá cao; đặt chiều cao các hàng và độ rộng cạnh theo vùng còn lại, tạo bàn chữ nhật thấp hơn.
- Không thu nhỏ toàn bộ giao diện bằng `transform: scale()` hoặc CSS zoom, vì cách đó làm chữ và vùng bấm nhỏ theo.
- Cho tên tỉnh xuống dòng thay vì cắt dấu ba chấm; giữ font, độ đậm và cỡ chữ theo breakpoint hiện tại. Dành đủ bề rộng cho hai cạnh bên và kiểm tra tên dài như “TP. Hồ Chí Minh”.
- Gom cách bố trí số ô, biểu tượng, tên, loại ô và token trong từng ô để tiết kiệm chiều cao. Giữ đầy đủ các thông tin này; cho token dùng chung một vùng gọn, không chồng lên tên.
- Giảm khoảng trống và padding trong vùng giữa; sắp xúc xắc, thông tin lượt và nhật ký gọn hơn. Có thể chuyển thanh điều khiển lượt vào phần giữa khi vùng thấp, với nguyên kiểu nút hiện tại.
- Thanh người chơi tiếp tục ở phía trên trên laptop; ưu tiên tiết kiệm lề/khoảng cách trước khi thay đổi bố trí.
- Bàn cờ và các nút chơi chính không bị thanh điều hướng che. Không dùng `overflow: hidden` để che phần bàn bị tràn.

Mục tiêu ưu tiên: nhìn đủ bàn cờ và sử dụng được các nút chơi chính ở 1366×768, 1440×900 và 1920×1080, tại mức zoom trình duyệt 100%.

## 4. Phương án điện thoại / cửa sổ hẹp — cần duyệt cùng proposal

Đề xuất tự chuyển sang **lưới 4 cột × 10 hàng** cho đủ 40 ô khi khung bốn cạnh không còn đủ chỗ hiển thị tên rõ ràng.

- Mỗi ô giữ màu, viền, font, biểu tượng, số thứ tự và token như hiện tại; tên tỉnh được xuống dòng đầy đủ.
- Hiển thị ô theo thứ tự hành trình 0 → 39, đọc từ trái sang phải rồi xuống hàng; START và ô góc vẫn nổi bật theo kiểu hiện tại. Thứ tự xử lý trong game không đổi.
- Không thêm đường nối hoặc hệ biểu tượng mới. Số ô hiện có giúp theo dõi hành trình.
- Vùng xúc xắc và nút chơi được bố trí thành khối gọn cạnh khu vực thông tin lượt, thay cho khoảng trống trung tâm của khung bốn cạnh.
- Thanh người chơi trên màn hình hẹp có thể cuộn ngang riêng, giữ nguyên nội dung và kiểu chữ, để không chiếm hai hàng lớn. Người chơi đang có lượt được đưa vào vùng nhìn thấy khi đổi lượt.
- Bấm ô vẫn mở cửa sổ thông tin chi tiết hiện có. Tên đầy đủ vẫn xuất hiện ngay trên ô, không phụ thuộc vào việc bấm để biết tên.
- Ưu tiên vừa màn hình ở các kích thước phổ biến 390×844 và 430×932. Với 360×640, bàn phím đang mở, mức zoom lớn hoặc viewport quá thấp, cho phép cuộn dọc tối thiểu để bảo toàn cỡ chữ/vùng bấm; không cam kết ép toàn bộ vào một màn hình bằng mọi giá.

**Duyệt proposal này đồng nghĩa duyệt thay đổi bố cục điện thoại nói trên.** Nếu cần giữ tuyệt đối khung bốn cạnh cả trên điện thoại dọc, phải chấp nhận cuộn hoặc thu nhỏ chữ; cần chốt lại phương án trước khi triển khai.

## 5. Phạm vi file dự kiến

- `src/components/GameBoard/GameBoard.tsx`: vùng bàn theo không gian còn lại, bố cục laptop/điện thoại, sắp phần trung tâm và điều khiển.
- `src/components/GameBoard/BoardSpaceTile.tsx`: bỏ kích thước tối thiểu cố định cho chế độ gọn, xuống dòng tên và bố trí nội dung/token phù hợp.
- `src/components/GameBoard/PlayerBar.tsx`: bố trí ngang riêng khi màn hình hẹp nếu cần.
- `src/components/GameBoard/TurnControls.tsx`, `DiceRoller.tsx`: chỉ điều chỉnh cách bố trí/khoảng cách nếu cần; giữ kiểu chữ và kiểu nút.
- `src/App.tsx`: điều chỉnh vùng chứa riêng cho tab bàn cờ nếu cần để tính đúng chiều cao khả dụng.
- `src/index.css`: chỉ thêm quy tắc giới hạn trong bàn cờ nếu class hiện có không đủ; không sửa font hay theme toàn cục.

Không thêm thư viện. Các tab Túi, Bản đồ, Luật và cửa sổ luật đã sửa không thuộc phạm vi thay đổi.

## 6. Kiểm tra nghiệm thu

1. Kiểm tra desktop 1366×768, 1440×900, 1920×1080; điện thoại 360×640, 390×844, 430×932 và khi xoay màn hình.
2. Đủ 40 ô, không trùng/thiếu ô; hướng di chuyển, START, ô góc và vị trí token khớp dữ liệu game.
3. Tên tỉnh không bị cắt; số ô, loại ô, cột mốc và nhiều token chung một ô không che tên.
4. Ở kích thước mục tiêu, không cần cuộn ngang; bàn cờ không bị header/thanh điều hướng che. Ghi nhận rõ trường hợp màn hình thấp cần cuộn tối thiểu.
5. Thử tung xúc xắc, di chuyển, chọn ô, kỹ năng token, kết lượt, 2–4 người chơi và cả VI/EN. Nút chính vẫn có vùng bấm đủ dùng; các ô trên điện thoại hướng tới chiều cao tối thiểu 44px.
6. So sánh ảnh trước/sau: font, màu, kiểu thẻ/nút được giữ; chỉ kích thước, khoảng cách và bố trí đáp ứng thay đổi đúng phương án duyệt.
7. Chạy TypeScript, build và bộ test hiện có; phân biệt lỗi sẵn có với lỗi mới. Kiểm tra trực quan nếu công cụ trình duyệt khả dụng; nếu bị chặn sẽ ghi rõ phần chưa xác minh.

## 7. Điểm dừng

Người dùng đã duyệt triển khai phần laptop qua bình luận và yêu cầu “oke làm đi”. Phần điện thoại tại mục 4 chưa triển khai; các nội dung dự kiến liên quan điện thoại phía trên được hoãn lại. Phạm vi duyệt không bao gồm commit, push hoặc deploy.
