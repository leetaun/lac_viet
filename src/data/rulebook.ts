export interface RuleSection {
  id: string;
  title: string;
  enTitle: string;
  icon: string;
  content: string;
  enContent: string;
  highlights?: string[];
  enHighlights?: string[];
}

export const RULEBOOK_SECTIONS: RuleSection[] = [
  {
    id: 'overview',
    title: '1. Bản Chất Trò Chơi & Điều Kiện Chiến Thắng',
    enTitle: '1. Game Essence & Victory Conditions',
    icon: 'compass',
    content: `Lạc Việt là boardgame văn hóa - giáo dục kết hợp hài hòa giữa linh kiện vật lý (bàn cờ, xúc xắc, token, cờ cột mốc) và nền tảng số hóa (Web Lạc Việt).

1.1. Triết lý thiết kế & Giá trị giáo dục:
- Kết nối cảm xúc gia đình và thế hệ: Không gian quây quần ấm cúng, tương tác trực tiếp.
- Giáo dục qua trải nghiệm tích cực: Mọi câu hỏi đều kèm lời giải và tri thức thú vị. "Học từ cái sai" giúp người chơi không bao giờ rời lượt trắng tay.
- Tinh thần "Không ai bị bỏ lại": Người chơi ít kỷ vật nhất được bảo vệ miễn cướp và phong ấn.

1.2. Ba Chế độ chơi:
- Tốc chiến (3 Kỷ vật): Mỗi miền Bắc - Trung - Nam tối thiểu 1 kỷ vật. Thời lượng 25–35 phút.
- Cơ bản (5 Kỷ vật): Mỗi miền Bắc - Trung - Nam tối thiểu 1 kỷ vật. Thời lượng ~45-60 phút.
- Trường kỳ (7 Kỷ vật): Mỗi miền Bắc - Trung - Nam tối thiểu 2 kỷ vật. Thời lượng 75–90 phút.

1.3. Điều kiện chiến thắng ("Vinh quy bái tổ"):
Người chơi chiến thắng khi hội tụ đủ 3 điều kiện:
1. Đủ tổng số lượng kỷ vật hợp lệ theo chế độ chơi đã chọn.
   Công thức: Kỷ vật Hợp lệ = Kỷ vật trong Tay nải (chưa bị phong ấn) + Kỷ vật trong Hòm ký gửi.
2. Thỏa mãn cơ cấu phân bổ vùng miền theo quy định của chế độ đó.
3. Di chuyển Token vật lý cán đích hoặc đi qua trạm START.`,
    enContent: `Lac Viet is a Phygital boardgame seamlessly marrying physical play with a web engine.
- 3 Play Modes: Blitz (3 artifacts, each region >= 1), Standard (5 artifacts, each region >= 1), Long March (7 artifacts, each region >= 2).
- Victory ("Return Home in Glory"): Accumulate required artifacts (Pouch - Sealed + Safe Deposit), meet regional balance, and pass or land on START.`,
    highlights: [
      'Chiến thắng phải thỏa mãn cả Số lượng VÀ Phân bổ đủ 3 Miền (Bắc, Trung, Nam)',
      'Kỷ vật hợp lệ = Tay nải (không phong ấn) + Hòm ký gửi',
      'Phải đưa Token vật lý về qua trạm START để kích hoạt Vinh quy bái tổ'
    ],
    enHighlights: [
      'Victory requires both artifact count AND regional distribution across all 3 regions',
      'Valid Artifacts = Unsealed Pouch + Safe Deposit',
      'Must guide physical Token to or past START to claim victory'
    ]
  },
  {
    id: 'phygital_architecture',
    title: '2. Kiến Trúc Phygital & Quản Trị Tài Sản Số',
    enTitle: '2. Phygital Architecture & Digital Asset Management',
    icon: 'layers',
    content: `QUY TẮC CỐT LÕI: Trò chơi hoàn toàn KHÔNG sử dụng thẻ bài giấy hay đồng tiền vật lý. 100% tài sản số (Kỷ vật, Túi đồ, Hòm ký gửi, Kho thất lạc) được lưu trữ và tính toán tự động trên Web Lạc Việt.

Cấu trúc chuẩn 4 phần của mọi nội dung trên Web:
1. Nhiệm vụ (Task): Câu hỏi trắc nghiệm, thử thách hành động. Người đến lượt đọc to cho cả bàn.
2. Bạn có biết (Did You Know): Tri thức văn hóa cô đọng 1–2 câu giải thích đáp án chuẩn.
3. Dẫn chứng (Citation): Tên nguồn văn bản, cơ quan xuất bản, năm, link đối chiếu minh bạch.
4. Tìm hiểu mở rộng (Deep Dive): Mã QR để người chơi quét xem sâu trên điện thoại cá nhân mà không làm dừng ván chơi chung.`,
    enContent: `Core rule: 100% of cards and artifacts are digitally managed on Web Lac Viet.
4-part content standard: Task (read aloud) -> Did You Know (cultural trivia) -> Citation (official source) -> Deep Dive (personal QR reading).`,
    highlights: [
      'Không lo thất lạc thẻ giấy hay thẻ kỷ vật vật lý',
      'Mỗi câu hỏi có trích dẫn văn bản và cơ quan xuất bản chính thống',
      'Mã QR xem sâu trên điện thoại cá nhân không làm chậm nhịp độ ván chơi'
    ]
  },
  {
    id: 'setup',
    title: '3. Quy Trình Chuẩn Bị (Setup Bàn Chơi)',
    enTitle: '3. Game Setup (6 Standardized Steps)',
    icon: 'settings',
    content: `Sáu bước chuẩn bị ván đấu chuẩn hóa:
1. Bố trí bàn cờ: Đặt bàn cờ 40 ô tại trung tâm bàn, kèm 4 thẻ QR loại thẻ.
2. Khởi tạo Web: Mở Web Lạc Việt trên Máy chung, bấm chọn "Tạo phòng mới".
3. Đăng ký biệt danh & Token: Lần lượt nhập biệt danh và chọn Token đại diện theo chiều kim đồng hồ.
4. Cấu hình ván chơi: Chọn 1 trong 3 chế độ (Tốc chiến, Cơ bản, Trường kỳ), tùy chọn Bật/Tắt Giờ thu quân, Khám phá hoặc 3 Bí kíp cho người mới.
5. Cấp phát tài nguyên đầu ván: Web tự động cấp 01 thẻ Bí kíp khởi đầu và chỉ định ngẫu nhiên người đi đầu tiên.
6. An vị linh kiện: Đặt 4 Token vật lý tại ô START. Phát cho mỗi người chơi 2 cờ Cột mốc vật lý tương ứng.`,
    enContent: `6 Standard steps: 1. Place 40-tile board -> 2. Open Web on shared screen -> 3. Register players & Tokens -> 4. Select Game Mode & Options -> 5. Auto-grant 1 starter Bi Kip -> 6. Place physical tokens at START and hand out 2 milestone flags.`
  },
  {
    id: 'turn_steps',
    title: '4. Tiến Trình Một Lượt Chơi (5 Bước Chuẩn)',
    enTitle: '4. Turn Sequence (5 Sequential Steps)',
    icon: 'play-circle',
    content: `Mỗi lượt chơi tuân thủ chính xác tiến trình 5 bước logic:

Bước 1: CHUẨN BỊ
- Kích hoạt Thẻ bài trong túi đồ (Nỏ thần, Cột mốc) hoặc Kỹ năng Token (Hoa sen: Thanh lọc).

Bước 2: DI CHUYỂN
- Đổ xúc xắc 6 mặt -> Di chuyển Token vật lý theo chiều kim đồng hồ. (Nếu qua START -> Bấm nút START trên Web).
- Nếu sở hữu token Bánh mì: Được quyền tiến hoặc lùi 1 ô sau khi đổ xúc xắc.

Bước 3: CHẠM TRÁN (Khi dừng chung ô với đối thủ)
- Bấm "Chạm trán" trên Web: Chọn bỏ 1 thẻ Tài nguyên để cướp 1 kỷ vật thường HOẶC trộm 1 thẻ túi đồ miễn phí (hoặc Bỏ qua).
- Áp dụng quy tắc "Không đánh người ngã": Không thể tấn công người đang có ít kỷ vật nhất bàn.

Bước 4: BÁO Ô VÀ LÀM NHIỆM VỤ
- Ô Địa phương: Chọn tỉnh đang đứng -> Thực hiện Kiến thức, Thử thách, Thị trường hoặc Lễ hội.
- Ô Góc: Chọn 1 trong 4 quyền lợi và tự động giải phóng phong ấn kỷ vật.
- Ô có Cột mốc: Nộp 1 thẻ bài lộ phí cho chủ cột trước khi làm nhiệm vụ.

Bước 5: KẾT THÚC LƯỢT
- Kiểm tra giới hạn tay bài: Nếu túi đồ > 5 thẻ, chọn xả thẻ thừa. Bấm "Kết thúc lượt".`,
    enContent: `5-Step Turn Flow: Step 1 (Prepare: use cards/skills) -> Step 2 (Move: roll die, advance token) -> Step 3 (Encounter: steal artifact/card if co-located) -> Step 4 (Resolve Tile task) -> Step 5 (End turn & discard if >5 cards).`,
    highlights: [
      'Bước 1: Chuẩn bị kích hoạt thẻ và kỹ năng chủ động',
      'Bước 3: Chạm trán xảy ra trước khi làm nhiệm vụ của ô',
      'Bước 5: Giới hạn tối đa 5 thẻ bài trong túi đồ số'
    ]
  },
  {
    id: 'local_spaces',
    title: '5. Cơ Chế 4 Loại Ô Địa Phương',
    enTitle: '5. Mechanics of the 4 Local Tile Types',
    icon: 'map-pin',
    content: `Bàn cờ có 36 ô địa phương chia làm 4 loại cân bằng:

1. Ô KIẾN THỨC (12 ô) — Cơ chế "Học từ cái sai":
- Trả lời trắc nghiệm 20 giây. Có quyền dùng 1 Bí kíp để Loại 2 đáp án hoặc Hỏi bạn.
- Trả lời Đúng: Nhận 01 kỷ vật của tỉnh vào Tay nải.
- Trả lời Sai: KHÔNG PHẠT. Web tự động cấp thẻ câu hỏi đó làm BÍ KÍP (theo chủ đề) vào túi đồ số!

2. Ô THỬ THÁCH (8 ô) — Vượt ải mạo hiểm:
- Đề bài: Trắc nghiệm khó (20s), Hành động (Hát/Diễn tả/Vẽ 30-60s), hoặc Kể nhanh (20s).
- Vượt ải tự động: Bấm dùng 1 thẻ Bí kíp CÙNG CHỦ ĐỀ để vượt qua ngay lập tức.
- ĐẠT: Nhận 01 kỷ vật (tỷ lệ Bảo vật cao hơn) + 01 thẻ tự chọn (Tài nguyên hoặc May mắn).
- KHÔNG ĐẠT: Rơi 1 kỷ vật trong Tay nải về Kho thất lạc (START) + nhận 1 Bí kíp đền bù.

3. Ô THỊ TRƯỜNG (8 ô) — Phiên chợ đặc sản:
- Web phát ngẫu nhiên 01 thẻ Tài nguyên vào túi đồ.
- Trả giá đặc sản: Đúng -> Kỷ vật giá 1 thẻ bài; Sai -> Kỷ vật giá 2 thẻ bài.
- Người chơi quyết định mua (thanh toán bằng thẻ trong túi đồ) hoặc không mua (giữ nguyên thẻ).

4. Ô LỄ HỘI (8 ô) — Trẩy hội văn hóa:
- Phát 01 thẻ May mắn thuộc 3 nhóm: Hội thi (cả bàn cùng chơi mini-game giành kỷ vật), Sự kiện (tác dụng ngay như Lộc hội, Bão lũ), hoặc Quyền năng (Vô hiệu, Phong ấn lưu túi đồ).`,
    enContent: `1. Knowledge (12 tiles): Answer in 20s. Correct -> Get artifact. Incorrect -> No penalty, earn card as Bi Kip!
2. Challenge (8 tiles): Hard quiz, Action or Speed naming. Pass -> Artifact (higher treasure rate) + 1 bonus card. Fail -> Drop 1 artifact to Lost & Found + earn 1 Bi Kip compensation.
3. Market (8 tiles): Free 1 Resource card + Bargain quiz (Correct -> 1 card price; Wrong -> 2 cards price).
4. Festival (8 tiles): Fortune card (Contest mini-game, Event, or Power card).`,
    highlights: [
      'Kiến thức: Trả lời sai được nhận thẻ Bí kíp (Học từ cái sai)',
      'Thử thách: Dùng Bí kíp cùng chủ đề để Vượt ải tự động',
      'Thị trường: Tự do chọn mua hoặc không mua, luôn được nhận 1 thẻ Tài nguyên'
    ]
  },
  {
    id: 'corners_and_start',
    title: '6. Trạm START, Kho Thất Lạc & Trạm Dừng Chân 3 Miền',
    enTitle: '6. START Station, Lost & Found & 3 Corner Stations',
    icon: 'landmark',
    content: `6.1. Trạm Dừng Chân 3 Miền (Bắc Bộ #10, Trung Bộ #20, Nam Bộ #30):
Khi Token dừng chính xác tại Ô góc, Web tự động:
1. Giải phóng phong ấn toàn bộ kỷ vật đang bị khóa trong Tay nải.
2. Cho phép người chơi chọn 1 trong 4 quyền lợi:
   - (1) Nhận 01 thẻ May mắn ngẫu nhiên (áp dụng ngay).
   - (2) Nhận 01 thẻ Tài nguyên ngẫu nhiên vào túi đồ.
   - (3) Hồi phục ngay lập tức Kỹ năng Token.
   - (4) Ký gửi kỷ vật: Chọn chuyển tối đa 02 kỷ vật từ Tay nải sang HÒM KÝ GỬI (miễn nhiễm tuyệt đối với cướp, phong ấn và làm rơi).

6.2. Trạm START (#0) và Kho Thất Lạc:
Kho thất lạc là kho số trung tâm đặt tại trạm START, chứa kỷ vật bị rơi do người chơi thua Thử thách.
Mỗi khi Token đi qua hoặc dừng tại START (trừ lượt xuất phát ban đầu):
1. Web tự động kiểm tra điều kiện chiến thắng Vinh quy bái tổ.
2. Web tự động hồi phục Kỹ năng Token cho người chơi.
3. Trả lời 2 câu hỏi nhanh của Trạm Khởi hành (có thể đổi 1 câu bằng vai trò "Hướng dẫn viên"):
   - Đúng 2/2: Lấy 01 kỷ vật tùy chọn từ Kho thất lạc về Tay nải (Nếu kho trống: Nhận 1 thẻ đền bù).
   - Đúng 1/2: Nhận 01 thẻ May mắn hoặc 01 thẻ Tài nguyên.
   - Đúng 0/2: Không nhận thưởng, không chịu phạt.`,
    enContent: `Corner Stations: Auto-unseal all sealed artifacts, choose 1 of 4 bonuses (Fortune, Resource, Reset Token Skill, or Safe-deposit up to 2 artifacts).
START Station: Auto-check victory, auto-reset Token skill. Answer 2 questions: 2/2 -> Reclaim 1 artifact from Lost & Found (or bonus card if empty); 1/2 -> 1 card; 0/2 -> nothing.`,
    highlights: [
      'Tại Ô góc: Tự động giải phóng phong ấn kỷ vật',
      'Hòm ký gửi: Bảo vệ an toàn tuyệt đối kỷ vật đến cuối ván',
      'Tại START: Đúng 2/2 câu hỏi được thu hồi 1 kỷ vật trong Kho thất lạc'
    ]
  },
  {
    id: 'interaction',
    title: '7. Tương Tác: Chạm Trán, Cột Mốc & Bảo Vệ Kỷ Vật',
    enTitle: '7. Player Interaction: Encounters, Milestones & Protection',
    icon: 'swords',
    content: `7.1. Chạm trán khi dừng cùng ô đối thủ:
- Bỏ 1 thẻ Tài nguyên: Cướp 1 kỷ vật thường trong Tay nải đối thủ.
- Trộm thẻ bài (Miễn phí): Web bốc ngẫu nhiên 1 thẻ từ túi đồ đối thủ chuyển sang cho bạn.

7.2. Các cơ chế Bảo vệ kỷ vật:
- "Không đánh người ngã": Người chơi có ít kỷ vật nhất bàn (Tay nải + Hòm ký gửi) ĐƯỢC HỆ THỐNG BẢO VỆ TỰ ĐỘNG — Miễn nhiễm hoàn toàn cướp và phong ấn!
- Trạng thái Bảo vật: Kỷ vật mang mác Bảo vật chống cướp (nhưng vẫn có thể rơi nếu thua Thử thách).
- Hòm ký gửi: Miễn nhiễm tuyệt đối mọi tác động.
- Thẻ Lá chắn: Chặn 1 lần bị cướp hoặc phong ấn.
- Thẻ Vô hiệu: Hủy thẻ bài hoặc Kỹ năng Token đối thủ vừa dùng.

7.3. Cột mốc chủ quyền:
- Dùng thẻ "Cột mốc" để cắm cờ chiếm đóng ô tỉnh đang đứng. Mỗi người tối đa 2 cột mốc.
- Khi đối thủ dừng tại ô có Cột mốc: Bắt buộc nộp 01 thẻ bài tự chọn cho chủ cột mốc trước khi làm nhiệm vụ.`,
    enContent: `Encounter: Pay 1 Resource card to steal 1 regular artifact, or Steal 1 hand card for free.
Immunity: Player with least artifacts is protected from all steals and seals ("Leave no one behind").
Milestones: Max 2 per player; opponents stopping on your milestone tile must pay 1 card toll.`
  },
  {
    id: 'tokens',
    title: '8. Kỹ Năng 4 Token Vật Lý',
    enTitle: '8. The 4 Physical Token Abilities',
    icon: 'award',
    content: `Mỗi Token đại diện cho 1 kỹ năng chiến thuật, mặc định dùng 1 lần và tự hồi phục khi qua START hoặc chọn hồi phục tại Ô góc:

1. NÓN LÁ — "Che mưa":
- Hiệu lực: Miễn phạt 01 lần khi thua Thử thách hoặc chịu tác động từ 1 thẻ Sự kiện xấu (như Bão lũ).
- Thời điểm kích hoạt: Web tự động hỏi kích hoạt ngay thời điểm chịu hình phạt.

2. HOA SEN — "Thanh lọc":
- Hiệu lực: Bỏ 2 thẻ bài bất kỳ trong túi đồ để nhận 1 thẻ ngẫu nhiên thuộc loại tự chọn (Tài nguyên hoặc May mắn).
- Thời điểm kích hoạt: Bước 1 (Chuẩn bị) trong lượt của mình.

3. ĐÈN LỒNG — "Soi đường":
- Hiệu lực: Xem trước đề bài Kiến thức hoặc Thử thách, được quyền đổi đề 01 lần (bắt buộc làm đề mới).
- Thời điểm kích hoạt: Sau khi chọn ô nhưng trước khi bấm bắt đầu trả lời.

4. BÁNH MÌ — "Tiện đường":
- Hiệu lực: Cho phép Token tiến hoặc lùi thêm 01 ô trên bàn cờ, sau đó làm nhiệm vụ tại ô mới.
- Thời điểm kích hoạt: Ngay sau khi gieo xúc xắc ở Bước 2.`,
    enContent: `1. Non La (Rain Shield): Negate 1 penalty from failed Challenge or bad Event.
2. Hoa Sen (Purification): Discard 2 cards to draw 1 card of your choice in Step 1.
3. Den Long (Guidance): Preview question and optionally redraw once.
4. Banh Mi (Detour): Move +1 or -1 space after rolling the die in Step 2.`,
    highlights: [
      'Nón lá cứu kỷ vật không bị rơi về Kho thất lạc khi thua Thử thách',
      'Đèn lồng đổi đề khi gặp câu hỏi quá khó',
      'Bánh mì giúp né ô Cột mốc đối thủ hoặc tiến vào Trạm góc/Thử thách'
    ]
  },
  {
    id: 'deck_rates',
    title: '9. Hệ Thống Kho Thẻ & Tỷ Lệ Xuất Hiện Chuẩn',
    enTitle: '9. Card Decks & Exact Distribution Rates',
    icon: 'shuffle',
    content: `9.1. Thẻ Kiến thức và Thử thách:
Phân bổ cân bằng 100% theo 4 chủ đề: Lịch sử (25%), Ẩm thực (25%), Nghệ thuật (25%), và Phong tục (25%).

9.2. Thẻ Tài nguyên:
- Lá chắn (30%): Chặn 1 lần bị đối thủ cướp kỷ vật hoặc phong ấn.
- Ngựa trạm (30%): Đổ lại xúc xắc 1 lần và chọn 1 trong 2 kết quả.
- Nỏ thần (22%): Lấy 1 kỷ vật thường trong Tay nải đối thủ trong phạm vi <= 3 ô (Bước 1).
- Cột mốc (18%): Chiếm đóng ô tỉnh đang đứng và đặt cờ Cột mốc vật lý.

9.3. Thẻ May mắn (10 loại = 100%):
- Hội thi (24%): Kích hoạt mini-game tập thể; người thắng nhận kỷ vật của tỉnh.
- Lễ hội mùa màng (12%): Đổ xúc xắc thêm 1 lần, di chuyển và làm nhiệm vụ tại ô mới.
- Lộc hội (8%): Nhận ngay 01 kỷ vật của ô tỉnh đang đứng mà không cần làm nhiệm vụ.
- Thuận buồm xuôi gió (8%): Di chuyển thẳng Token đến Ô góc kế tiếp và nhận quyền lợi.
- Đạo tặc (8%): Lấy ngẫu nhiên 01 thẻ Tài nguyên từ túi đồ người ngồi bên trái/phải.
- Lá lành đùm lá rách (4%): Người nhiều kỷ vật nhất chuyển 1 thẻ cho người ít kỷ vật nhất.
- Bão lũ (12%): Lùi Token 2 ô và không làm nhiệm vụ tại ô mới.
- Mất mùa (8%): Bắt buộc bỏ 01 thẻ bài bất kỳ trong túi đồ số.
- Vô hiệu (8%): Cho vào túi đồ; Hủy 1 thẻ bài hoặc Kỹ năng Token đối thủ vừa dùng.
- Phong ấn (8%): Cho vào túi đồ; Khóa 1 kỷ vật trong Tay nải đối thủ.`,
    enContent: `Balanced 4 topics: History, Cuisine, Art, Custom (25% each).
Resource deck: Shield (30%), Steed (30%), Crossbow (22%), Milestone (18%).
Fortune deck: Contest (24%), Harvest (12%), Festival Gift (8%), Tailwind (8%), Bandit (8%), Mutual Support (4%), Storm (12%), Crop Loss (8%), Negate (8%), Seal (8%).`
  },
  {
    id: 'bikip_and_inclusion',
    title: '10. Triết Lý "Không Ai Bị Bỏ Lại" & Hệ Thống Bí Kíp',
    enTitle: '10. "Leave No One Behind" & Bi Kip Mechanics',
    icon: 'book-open',
    content: `10.1. Cơ chế "Không đánh người ngã":
Người chơi có ít kỷ vật nhất bàn chơi (Tay nải + Hòm ký gửi) được Web bảo vệ tự động: Không thể bị đối thủ cướp kỷ vật hoặc phong ấn. Tên người chơi sẽ bị làm mờ khi đối thủ chọn mục tiêu tấn công.

10.2. Bảng quy đổi Quyền trợ giúp từ Bí kíp:
- 1 Bí kíp: "Loại 2 đáp án" — Hệ thống loại bỏ 2 phương án sai ở câu hỏi Kiến thức.
- 1 Bí kíp: "Hỏi bạn" — Chọn 1 người chơi khác đáp hộ. Nếu đúng: Bạn nhận kỷ vật, người giúp nhận 1 Bí kíp.
- 3 Bí kíp: "Có công mài sắt" — Nhận ngay kỷ vật của ô đang đứng mà không cần làm nhiệm vụ.
- VƯỢT ẢI THỬ THÁCH: Bắt buộc dùng 1 Bí kíp CÙNG CHỦ ĐỀ để vượt qua tự động!

10.3. Các tính năng kết nối văn hóa:
- QR "Xem trên máy bạn": Quét mã xem riêng tư liệu ảnh/video chuyên sâu mà không làm dừng ván chơi.
- Sổ hành trình: Cuối ván, Web xuất bản infographic Sổ hành trình lưu giữ toàn bộ kỷ vật đã sưu tầm kèm mã QR tải về máy.
- Hướng dẫn viên: Tại START, có thể thay thế 1 câu hỏi bằng việc thuyết trình 30s về điều mình đã đọc.
- Phút kể chuyện: 3 phút cuối ván mỗi người chia sẻ 1 điều tâm đắc, người thắng kể câu chuyện về 1 kỷ vật mang về đích.`,
    enContent: `Least-artifacts player cannot be stolen from or sealed.
Spend Bi Kip: 1 Bi Kip for 50:50 or Ask Friend; 3 Bi Kip for Auto-pass any local tile; 1 Matching Topic Bi Kip for Auto-pass Challenge.
End of match personalized Journey Journal with downloadable QR code.`
  },
  {
    id: 'appendix',
    title: '11. Phụ Lục Địa Phương & Nâng Cấp',
    enTitle: '11. Appendix: 36 Spaces Allocation & Notes',
    icon: 'file-text',
    content: `11.1. Phụ lục A: Phân bố 36 ô địa phương theo 3 miền:
Căn cứ Nghị quyết 202/2025/QH15 (áp dụng từ 01/07/2025 cả nước có 34 tỉnh, thành phố):
- Bắc Bộ (15 ô): Hà Nội, Hải Phòng, Quảng Ninh, Bắc Ninh, Hưng Yên, Ninh Bình, Phú Thọ, Thái Nguyên, Tuyên Quang, Lào Cai, Cao Bằng, Lạng Sơn, Lai Châu, Điện Biên, Sơn La.
- Trung Bộ (13 ô): Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Trị, Huế, Đà Nẵng, Quảng Ngãi, Gia Lai, Đắk Lắk, Khánh Hòa, Lâm Đồng, Đặc khu Hoàng Sa, Đặc khu Trường Sa.
- Nam Bộ (8 ô): TP. Hồ Chí Minh, Đồng Nai, Tây Ninh, Cần Thơ, Vĩnh Long, Đồng Tháp, An Giang, Cà Mau.

11.2. Phụ lục B: Các đặc điểm cốt lõi:
- Thẻ bài & Kỷ vật: 100% số hóa trên Web, tránh thất lạc vật tư, tạo tính bất ngờ.
- Điều kiện thắng: Đủ số lượng VÀ đủ phân bổ cả 3 miền Bắc - Trung - Nam.
- Ô Kiến thức: Trả lời sai được cấp thẻ Bí kíp (Học từ cái sai), không lo nản chí.
- Trạm START: Gộp còn 2 câu hỏi, tích hợp thu hồi kỷ vật từ Kho thất lạc.
- Bổ sung Cột mốc chiếm đất, Thẻ Phong ấn, Thẻ Nỏ thần, Thẻ Ngựa trạm, và cơ chế "Không đánh người ngã".`,
    enContent: `Appendix A: 15 Northern, 13 Central (including Special Zones Hoang Sa & Truong Sa), 8 Southern spaces.
Appendix B: Core upgrades (100% digital assets, regional victory check, pedagogical safety net, milestone claiming, seal & crossbow cards, and anti-frustration mechanics).`
  }
];
