# Chơi online trên Vercel

## Cấu hình một lần

1. Trong Supabase SQL Editor, chạy `supabase/migrations/202611190001_online_rooms.sql` (không cần chạy lại nếu đã thành công).
2. Trong Vercel, mở đúng dự án liên kết repository này → Settings → Environment Variables.
3. Thêm `SUPABASE_URL` và `SUPABASE_SECRET_KEY` giống cấu hình local, chọn Production. Nếu muốn thử deployment nhánh phụ, chọn thêm Preview.
4. Không thêm tiền tố `VITE_`, không commit `.env.local`, không đưa secret key vào trình duyệt.
5. Push nhánh production của dự án để tạo deployment mới. Nếu điền biến sau khi deployment đã bắt đầu, mở Deployments → deployment mới nhất → Redeploy.

Vercel cần dùng thư mục chứa `package.json`, `src` và `api` làm Root Directory; framework Vite, build `npm run build`, output `dist`. API phòng là Vercel Function `api/online-room.ts`, không phải một máy chủ Vite chạy lâu dài.

## Thử sau khi deploy

- Mở link production bằng hai trình duyệt hoặc hai thiết bị khác nhau.
- Người thứ nhất đặt tên và tạo phòng; người thứ hai nhập mã phòng.
- Mỗi người chọn token, người tham gia bấm sẵn sàng, chủ phòng bắt đầu.
- Thử tung xúc xắc, trả lời câu hỏi, kết lượt; cả hai máy phải thấy cùng lượt và vị trí.
- Tải lại một máy để kiểm tra kết nối lại cùng người chơi.

Danh sách và trạng thái được cập nhật bằng polling khoảng 1 giây khi tab đang mở (4 giây khi ở nền). Phòng hiện có thời hạn 6 giờ. API kiểm tra người chơi và lượt ở máy chủ; dữ liệu phòng được lưu ở Supabase.

Nếu frontend mở được nhưng không tạo/vào phòng: xem Functions logs trên Vercel, kiểm tra hai biến ở Production, SQL đã chạy và deployment mới đã dùng cấu hình đó. Các mã QR chuyển kết quả từ điện thoại thuộc API riêng và vẫn dùng cấu hình Upstash hiện có, không thay thế bằng hai biến Supabase này.
