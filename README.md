# 🏛️ LẠC VIỆT - ỨNG DỤNG BOARDGAME DI SẢN VĂN HÓA VIỆT NAM
> **Dự án dự thi Olympic Khởi nghiệp 2026** — *Trường Đại học Kinh tế Quốc dân*  
> **Người hướng dẫn chuyên môn:** TS. Võ Thị Hồng Hạnh  
> **Nhóm thực hiện:** Lạc Việt (NEU, FTU, HUST)

---

## 📖 Giới Thiệu Tổng Quan
**Lạc Việt** là bộ boardgame giáo dục - trải nghiệm văn hóa kết hợp vật liệu bền vững (bìa cứng, giấy tái chế, token in 3D) và công nghệ số hóa (QR Code, Web & Referee App). Ứng dụng này đóng vai trò là **Trợ lý số & Trọng tài điện tử** cho bàn cờ 40 ô, quản lý toàn diện luật chơi, thẻ bài, điểm số, kỹ năng token, và hệ thống tra cứu di sản 34 tỉnh/thành phố ba miền Bắc - Trung - Nam.

---

## 🎨 Theme & Giao Diện
Giao diện ứng dụng được thiết kế bám sát **Hồ sơ dự án & Slide dự thi**:
- **Đỏ đô truyền thống Lạc Việt** (`#7E121D` / `#941B26`): Màu sắc của hoàng thành, cờ lễ hội và hào khí dân tộc.
- **Vàng hoàng kim Đông Sơn** (`#C5A059` / `#D4AF37`): Viền hoa văn, ánh sáng tri thức và cúp kỷ vật.
- **Nền Giấy Dó / Beige cổ truyền** (`#FAF6EE` / `#F8F5EE`): Sang trọng, tao nhã và dễ đọc.
- **4 Màu đại diện cho 4 hệ thống thẻ bài**:
  - 📘 **Thẻ Kiến thức** (Xanh dương tri thức `#2563EB`)
  - 🌾 **Thẻ Lễ hội / May mắn** (Vàng cam hội hè `#D97706`)
  - 🌿 **Thẻ Thị trường / Tài nguyên** (Xanh ngọc lục bảo `#059669`)
  - ⚔️ **Thẻ Thử thách** (Đỏ son can trường `#DC2626`)

---

## 🕹️ Các Tính Năng Cốt Lõi

### 1. Màn Hình Khởi Động & Chọn Chế Độ (Setup Match)
- **Hình thức chơi**:
  - `Chơi Offline`: 1 máy làm trọng tài số truyền tay quanh bàn, kết hợp với bàn cờ thật ngoài đời.
  - `Chơi với AI`: Bạn giữ ghế 1, các ghế còn lại (P2, P3, P4) do máy AI thông minh điều khiển tự động.
  - `Chơi Online`: Chia sẻ mã phòng kết nối.
- **Số người chơi**: 2, 3, hoặc 4 người chơi.
- **Quy ước số Kỷ vật**:
  - *Tốc chiến*: 3 kỷ vật
  - *Cơ bản*: 5 kỷ vật
  - *Trường kỳ*: 7 kỷ vật
- **Chọn 4 Token Văn Hóa**:
  - 👒 **Nón Lá**: Miễn nhiễm 1 lần phạt (không mất kỷ vật khi sai thử thách).
  - 🪷 **Hoa Sen**: Đổi 2 thẻ trên tay lấy 1 thẻ bài mới bất kỳ.
  - 🏮 **Đèn Lồng**: Soi trước 1 thẻ thử thách tiếp theo để chuẩn bị.
  - 🥖 **Bánh Mì**: Di chuyển tiến hoặc lùi 1 ô để né ô bẫy hoặc chọn ô mong muốn.

### 2. Tab 1: Bàn Chơi 40 Ô (Boardgame View)
- Bàn cờ 40 ô tỷ lệ chuẩn hình vuông bao quanh Bản đồ Việt Nam hình chữ S 3D.
- 4 ô góc lớn: `START` và 3 Trạm Dừng Chân (`Bắc Bộ`, `Trung Bộ`, `Nam Bộ`).
- 36 ô nhỏ địa phương gồm:
  - 12 ô Kiến thức
  - 8 ô Lễ hội
  - 8 ô Thị trường
  - 8 ô Thử thách
- Token người chơi di chuyển từng bước sinh động kèm hoạt ảnh xúc xắc 3D và âm thanh xúc xắc chân thực.
- Tự động mở hộp thoại khi dừng tại các ô:
  - Trả lời câu hỏi trắc nghiệm hoặc thử thách hành động (hát dân ca, diễn tả không lời trong 25 giây).
  - Quyền năng Thẻ Kiến Thức: Bỏ qua câu hỏi nếu trên tay có thẻ cùng chủ đề để nhận ngay Kỷ vật!
  - Cướp Kỷ vật khi đỗ cùng ô với đối phương (nếu có Thẻ Tài Nguyên).

### 3. Tab 2: Túi Đồ & Quản Lý Thẻ (Inventory)
- Quản lý số lượng Kỷ vật văn hóa đang mang theo & Kỷ vật đã gửi an toàn tại trạm góc.
- Xem chi tiết tất cả các thẻ trên tay (Kiến thức, Tài nguyên, May mắn).
- Bảng công kích đối thủ (PvP Attack & Defense).

### 4. Tab 3: Bản Đồ Hành Trình Văn Hóa (Cultural Map)
- Tra cứu 34 tỉnh/thành qua 3 miền Bắc (15), Trung (11), Nam (8).
- Bộ lọc theo vùng miền và phân loại loại ô.
- Xem di sản UNESCO, văn hóa, ẩm thực đặc sản và mã QR mở rộng cho từng địa phương.

### 5. Tab 4: Cẩm Nang Luật & In Mã QR (Rules & QR Center)
- 8 chương luật chơi chi tiết, mạch lạc.
- Công cụ **Tạo & In mã QR hàng loạt** để dán lên bộ cờ vật lý và hệ thống thẻ bài ngoài đời thực.
- Thông tin đội ngũ sáng lập và định hướng kinh tế tuần hoàn bền vững của dự án Lạc Việt.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Bước 1: Mở Terminal tại thư mục `lac_viet`
Thư mục dự án: `c:\Users\Say Gex\Desktop\lac_viet`

### Bước 2: Khởi động ứng dụng
Bạn có thể nhấp đúp vào tệp:
```bat
start_app.bat
```
Hoặc chạy lệnh trong terminal:
```bash
npm run dev
```

### Bước 3: Trải nghiệm
Mở trình duyệt web tại địa chỉ:
```
http://localhost:5173
```
Ứng dụng tương thích tối ưu trên cả máy tính để bàn (Desktop) và điện thoại di động (Mobile/Tablet).

