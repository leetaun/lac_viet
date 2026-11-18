export interface RuleSection {
  id: string; title: string; enTitle: string; icon: string;
  content: string; enContent: string; highlights?: string[]; enHighlights?: string[];
}

// Group rules supplied in Google Docs, with deposit capacity and crossbow range
// intentionally preserved pending the group's clarification.
export const RULEBOOK_SECTIONS: RuleSection[] = [
  {
    id:'overview', title:'1. Tổng Quan & Mục Tiêu Trò Chơi', enTitle:'1. Overview & Victory', icon:'compass',
    content:`Lạc Việt là boardgame khám phá văn hóa, lịch sử và địa lý Việt Nam. Bàn cờ vật lý quản lý không gian, Token và cờ Cột mốc; Web quản lý nhiệm vụ, thẻ bài, Kỷ vật, kỹ năng và túi đồ. Có thể chơi trên Web hoặc dùng bàn cờ vật lý với máy chung.

Điều kiện thắng: người đầu tiên về hoặc đi qua START, có đủ Kỷ vật hợp lệ và đủ phân bổ ba miền.
• Tốc chiến: 3 Kỷ vật, mỗi miền ít nhất 1; khoảng 25–35 phút.
• Cơ bản: 5 Kỷ vật, mỗi miền ít nhất 1; khoảng 45–60 phút.
• Trường kỳ: 7 Kỷ vật, mỗi miền ít nhất 2; khoảng 75–90 phút.
Kỷ vật hợp lệ = Kỷ vật Tay nải chưa phong ấn + Kỷ vật Hòm ký gửi. Khi nhận thưởng tại một tỉnh, Kỷ vật được chọn ngẫu nhiên từ kho của tỉnh đó.`,
    enContent:`Lac Viet explores Vietnamese culture, history and geography. The physical board tracks movement, Tokens and Milestone flags; the Web manages tasks, cards, artifacts, skills and inventory. Play digitally or use a shared device with the physical board.

Win by reaching or passing START with enough valid artifacts and regional coverage:
• Blitz: 3 artifacts, at least 1 per region; about 25–35 minutes.
• Standard: 5 artifacts, at least 1 per region; about 45–60 minutes.
• Long March: 7 artifacts, at least 2 per region; about 75–90 minutes.
Valid artifacts = unsealed Pouch artifacts + Safe Deposit artifacts. Rewards are drawn from the current province's artifact pool.`
  },
  {
    id:'setup', title:'2. Linh Kiện & Thiết Lập Bàn Chơi', enTitle:'2. Components & Setup', icon:'settings',
    content:`Linh kiện: bàn cờ 40 ô (4 ô góc và 36 ô địa phương); bộ thẻ chủ đề có QR và mã bộ; 4 Token Nón lá, Hoa sen, Đèn lồng, Bánh mì; 8 cờ Cột mốc (mỗi người 2); xúc xắc 6 mặt; bản đồ mini, sách luật và thiết bị chung kết nối Internet.

6 bước chuẩn bị:
1. Bố trí bàn cờ, bản đồ mini và thẻ QR loại ô.
2. Mở Web trên máy chung, tạo ván/phòng.
3. Nhập biệt danh và chọn Token theo chiều kim đồng hồ.
4. Chọn Tốc chiến, Cơ bản hoặc Trường kỳ; chọn bộ thẻ và cách dùng xúc xắc.
5. Mỗi người nhận 1 Bí kíp khởi đầu; hệ thống chọn ngẫu nhiên người đi đầu.
6. Đặt Token tại START và phát mỗi người 2 cờ Cột mốc.

Bộ thẻ: nhập mã bộ rồi mở liên kết QR của từng thẻ để tích hợp câu hỏi vào thư viện. Một bộ có một chủ đề; muốn thêm chủ đề cần thêm bộ tương ứng. Chọn các bộ dùng cho ván trên máy chung. Mã DEMO trong bản local chỉ là dữ liệu thử, thư viện lưu trên trình duyệt này; chưa xác minh quyền mua hoặc đồng bộ tài khoản.

Bàn cờ vật lý: tung xúc xắc ngoài đời, bấm Nhập xúc xắc, chọn số 1–6 và xác nhận. Chơi hoàn toàn trên Web có thể dùng xúc xắc tự động. Ngựa trạm cho tung lại một lần và chọn một trong hai kết quả.

Tùy chọn mở rộng của ứng dụng: 3 Bí kíp cho người mới, Khám phá và Giờ thu quân; đây không phải điều bắt buộc của luật chuẩn.`,
    enContent:`Components: a 40-space board (4 corners, 36 local spaces), one topic card pack with QR and pack code, 4 Tokens, 8 Milestone flags (2 each), a six-sided die, mini map, rulebook and an internet-connected shared device.

Setup: 1. Lay out board and QR cards. 2. Create a game/room on the shared device. 3. Enter names and choose Tokens clockwise. 4. Select mode, packs and dice input. 5. Give each player 1 Bi Kip; randomly choose the first player. 6. Place Tokens at START and distribute 2 flags each.

Activate a pack code, then open each card's QR link to integrate its questions. Packs have one topic; additional topics require additional packs. Select the match's packs on the host. Local DEMO codes are samples; the browser library does not verify purchases or sync accounts.

Physical play: roll the real die, click Enter Die, select 1–6 and confirm. Digital play may use automatic rolls. Steed allows one reroll and a choice between both results.

Optional app variants: 3 starter Bi Kip, Exploration and Timed Match; these are separate from the standard rules.`
  },
  {
    id:'local_spaces', title:'3. Cơ Chế 4 Loại Ô Địa Phương', enTitle:'3. Four Local Space Types', icon:'map-pin',
    content:`Kiến thức (12 ô): trả lời trong 20 giây. Đúng nhận 1 Kỷ vật của tỉnh; sai không phạt, câu hỏi chuyển thành 1 Bí kíp mang chủ đề của câu hỏi.

Thử thách (8 ô): trắc nghiệm khó, Hành động (diễn tả, vẽ, ca dao) hoặc Kể nhanh. Thời gian theo nhiệm vụ. Có thể dùng 1 Bí kíp cùng chủ đề để vượt tự động. Đạt: 1 Kỷ vật (cơ hội Bảo vật cao hơn) + 1 thẻ ngẫu nhiên thuộc loại Tài nguyên/May mắn do bạn chọn. Không đạt: chọn 1 Kỷ vật Tay nải rơi về Kho thất lạc, nhận 1 Bí kíp đền bù. Nếu Tay nải trống thì không mất thêm thẻ bài. Bàn chơi xác nhận kết quả Hành động/Kể nhanh.

Thị trường (8 ô): nhận 1 thẻ Tài nguyên, trả lời câu hỏi Trả giá. Đúng: mua Kỷ vật bằng 1 thẻ bất kỳ; sai: bằng 2 thẻ bất kỳ. Có thể không mua và giữ thẻ vừa nhận.

Lễ hội (8 ô): rút May mắn. Hội thi là mini-game cả bàn, người thắng nhận Kỷ vật của tỉnh. Sự kiện tốt/xấu có hiệu lực ngay. Vô hiệu/Phong ấn lưu vào túi đồ.

Luồng lượt: Chuẩn bị dùng thẻ/kỹ năng → Di chuyển → Chạm trán nếu chung ô → Trả lộ phí Cột mốc và làm nhiệm vụ → Kết lượt. Giới hạn 5 thẻ cuối lượt là quy tắc mở rộng hiện có của ứng dụng.`,
    enContent:`Knowledge (12): answer within 20 seconds. Correct: 1 local artifact. Incorrect: no penalty; keep the question as a Bi Kip with its topic.

Challenge (8): hard quiz, Action or Speed Naming, with the task's time limit. Spend 1 matching-topic Bi Kip to auto-pass. Pass: 1 artifact (higher treasure chance) + a random Resource/Fortune card from the type you choose. Fail: drop 1 Pouch artifact into Lost & Found and receive 1 Bi Kip. An empty Pouch incurs no additional card penalty. The group confirms Action/Speed results.

Market (8): draw a Resource card and answer a bargain question. Buy the local artifact for 1 card if correct, 2 if incorrect; or decline and keep the newly drawn card.

Festival (8): draw Fortune. Contest winners earn the local artifact; events take effect immediately; Negate and Seal are stored.

Turn: Prepare → Move → Encounter → Pay Milestone toll and resolve the space → End. The existing app additionally limits the end-of-turn hand to 5 cards.`
  },
  {
    id:'assets', title:'4. Kỷ Vật & Quản Lý Tài Sản', enTitle:'4. Artifacts & Storage', icon:'layers',
    content:`Tay nải chứa Kỷ vật lưu động: có thể bị cướp, phong ấn hoặc rơi khi thua Thử thách.
Hòm ký gửi bảo vệ tuyệt đối Kỷ vật khỏi cướp, phong ấn và làm rơi; luôn tính điều kiện thắng. Bản hiện tại giữ cách ký gửi tối đa 2 Kỷ vật mỗi lần, chưa đổi giới hạn tổng sức chứa trong lúc nhóm làm rõ luật.

Bảo vật do Web chọn ngẫu nhiên, có cơ hội cao hơn ở Thử thách. Không thể bị cướp nhưng vẫn có thể phong ấn hoặc làm rơi. Thu hồi từ Kho thất lạc sẽ trở thành Kỷ vật thường.
Kỷ vật phong ấn không tính điều kiện thắng, không ký gửi được. Tự động mở khóa khi chủ sở hữu dừng tại ô góc.`,
    enContent:`Pouch artifacts may be stolen, sealed or dropped on a failed Challenge. Safe Deposit artifacts are immune to all three and always count toward victory. The current app retains a maximum of 2 deposits per visit; total capacity awaits group clarification.

Treasures are randomly awarded, more often in Challenges. They resist theft but may be sealed or dropped. Reclaiming one from Lost & Found turns it into a regular artifact.
Sealed Pouch artifacts do not count toward victory and cannot be deposited. Landing on a corner unseals them.`
  },
  {
    id:'corners_and_start', title:'5. Ô Góc, START & Kho Thất Lạc', enTitle:'5. Corners, START & Lost & Found', icon:'landmark',
    content:`Dừng chính xác tại Bắc Bộ, Trung Bộ hoặc Nam Bộ: tự động mở khóa Kỷ vật phong ấn, rồi chọn 1 quyền lợi:
• Nhận 1 thẻ May mắn ngẫu nhiên.
• Nhận 1 thẻ Tài nguyên ngẫu nhiên.
• Hồi phục Kỹ năng Token.
• Ký gửi tối đa 2 Kỷ vật Tay nải chưa phong ấn theo cách xử lý hiện tại.

Qua hoặc dừng START: kiểm tra chiến thắng, hồi phục kỹ năng, trả lời 2 câu hỏi nhanh. Có thể thay 1 câu bằng phần trình bày Hướng dẫn viên 30 giây.
• Đúng 2/2: lấy 1 Kỷ vật tùy chọn từ Kho thất lạc; kho trống thì nhận 1 thẻ Tài nguyên/May mắn.
• Đúng 1/2: nhận 1 thẻ Tài nguyên hoặc May mắn.
• Đúng 0/2: không thưởng, không phạt.
Kho thất lạc lưu Kỷ vật bị rơi vì Thử thách.`,
    enContent:`Land exactly on a North, Central or South corner: unseal artifacts, then choose one benefit: random Fortune; random Resource; restore Token skill; or deposit up to 2 unsealed Pouch artifacts under current behavior.

Pass or land on START: check victory, restore skill, answer 2 quick questions. Replace one question with a 30-second Guide presentation if desired.
• 2/2: reclaim 1 chosen Lost & Found artifact; if empty, draw a Resource/Fortune card.
• 1/2: draw a Resource or Fortune card.
• 0/2: no reward or penalty.
Lost & Found stores artifacts dropped during Challenges.`
  },
  {
    id:'interactions', title:'6. Tương Tác & Bảo Vệ Tài Sản', enTitle:'6. Interactions & Protection', icon:'shield',
    content:`Chạm trán khi dừng chung ô: bỏ 1 thẻ Tài nguyên để cướp 1 Kỷ vật thường trong Tay nải đối thủ, hoặc miễn phí lấy ngẫu nhiên 1 thẻ trong túi đồ đối thủ. Có thể bỏ qua.
Lá chắn chặn 1 lần cướp Kỷ vật hoặc phong ấn. Vô hiệu hủy 1 thẻ bài hoặc kỹ năng đối thủ vừa dùng. Hòm ký gửi miễn nhiễm tuyệt đối; Bảo vật chống cướp.
Không đánh người ngã: người có ít Kỷ vật nhất bàn (kể cả đồng hạng) không thể bị cướp Kỷ vật hoặc phong ấn.

Cột mốc: dùng thẻ để chiếm ô địa phương đang đứng, tối đa 2 Cột mốc mỗi người. Đặt cái thứ 3 phải nhổ 1 cái cũ. Đối thủ dừng tại ô chuyển 1 thẻ tự chọn cho chủ trước khi làm nhiệm vụ.`,
    enContent:`Encounter on a shared space: pay 1 Resource to steal 1 regular Pouch artifact, or take 1 random inventory card for free. You may skip.
Shield blocks one artifact theft or seal; Negate cancels an opponent's newly used card or skill. Safe artifacts are immune; Treasures resist theft. Players tied for the fewest total artifacts cannot have artifacts stolen or sealed.

Use Milestone to claim the current local space. Maximum 2 per player; replace an old one when placing a third. Visitors transfer 1 chosen card to the owner before resolving the space.`
  },
  {
    id:'tokens', title:'7. Kỹ Năng 4 Token', enTitle:'7. Four Token Skills', icon:'sparkles',
    content:`Mỗi kỹ năng dùng 1 lần, hồi tại START hoặc chọn quyền lợi hồi kỹ năng ở ô góc.
• Nón lá — Che mưa: miễn phạt 1 lần Thử thách thất bại hoặc Sự kiện xấu.
• Hoa sen — Thanh lọc: ở bước Chuẩn bị, bỏ 2 thẻ bất kỳ để nhận 1 thẻ ngẫu nhiên thuộc loại thưởng bạn chọn.
• Đèn lồng — Soi đường: xem trước đề Kiến thức/Thử thách sau khi chọn ô; được đổi đề 1 lần.
• Bánh mì — Tiện đường: sau khi gieo xúc xắc, tiến/lùi thêm 1 ô rồi làm nhiệm vụ tại ô mới.`,
    enContent:`Use each skill once; restore at START or choose skill restoration at a corner.
• Non La: avoid one failed-Challenge or bad-event penalty.
• Hoa Sen: during Preparation, discard any 2 cards for 1 random card of your chosen reward type.
• Den Long: preview a Knowledge/Challenge task after choosing the space and redraw once.
• Banh Mi: after rolling, move an additional +1 or −1, then resolve the new space.`
  },
  {
    id:'deck_rates', title:'8. Kho Thẻ & Tỷ Lệ Xuất Hiện', enTitle:'8. Decks & Draw Rates', icon:'shuffle',
    content:`Tài nguyên: Lá chắn 30%; Ngựa trạm 30%; Nỏ thần 22%; Cột mốc 18%.
Nỏ thần: lấy Kỷ vật thường trong Tay nải đối thủ; phạm vi 3 ô theo code hiện tại, giữ nguyên trong lúc nhóm bổ sung con số thiếu trong tài liệu.

May mắn: Hội thi 24%; nhóm Sự kiện tốt gồm Lễ hội mùa màng, Lộc hội, Thuận buồm xuôi gió, Đạo tặc, Lá lành đùm lá rách; nhóm Sự kiện xấu gồm Bão lũ, Mất mùa; Quyền năng gồm Vô hiệu, Phong ấn.
Tỷ lệ chi tiết các sự kiện giữ theo cấu hình hiện có khi tài liệu mới không thay đổi chúng.

Câu hỏi lấy từ bộ được chọn, không mặc định chia đều 25% cho bốn chủ đề. Bộ hiện tại gồm 100 câu trắc nghiệm: 50 Lịch sử và 50 Địa lý, mức dễ–trung bình theo tài liệu của nhóm. Cả bốn loại ô và START dùng chung bộ mới; chưa có Hành động/Kể nhanh trong bộ này.`,
    enContent:`Resources: Shield 30%, Steed 30%, Crossbow 22%, Milestone 18%. Crossbow takes a regular Pouch artifact; its current range remains 3 spaces pending the group's missing-number clarification.

Fortune: Contest 24%; good events include Harvest, Festival Gift, Tailwind, Bandit and Mutual Support; bad events include Storm and Crop Loss; powers include Negate and Seal. Other existing event rates remain where the new document gives no replacement.

Questions follow the selected packs, not a mandatory 25% split among four topics. The current set has 100 easy-to-intermediate quizzes: 50 History and 50 Geography. All quiz spaces and START use this new set; it includes no Action or Speed Naming tasks.`
  },
  {
    id:'bikip', title:'9. Bí Kíp & Quyền Trợ Giúp', enTitle:'9. Bi Kip & Assistance', icon:'book-open',
    content:`Tại ô Kiến thức, không cần cùng chủ đề:
• 1 Bí kíp: loại 2 phương án sai.
• 1 Bí kíp: Hỏi bạn, chọn người trả lời hộ. Đúng thì bạn nhận Kỷ vật, người giúp nhận 1 Bí kíp.
• 3 Bí kíp: Có công mài sắt, nhận ngay Kỷ vật của ô mà không làm nhiệm vụ.

Tại ô Thử thách: bắt buộc 1 Bí kíp CÙNG CHỦ ĐỀ với thử thách để vượt tự động. Vẫn nhận Kỷ vật và 1 thẻ thưởng theo kết quả Đạt. Không dùng 3 Bí kíp khác chủ đề để bỏ qua Thử thách.
Bí kíp từ câu trả lời sai/thử thách thất bại giữ đúng chủ đề của nhiệm vụ.`,
    enContent:`At Knowledge spaces, topics need not match:
• 1 Bi Kip: remove 2 incorrect answers.
• 1 Bi Kip: Ask Friend. Correct: you gain the artifact and your helper gains 1 Bi Kip.
• 3 Bi Kip: receive the local artifact without completing the task.

At Challenge spaces, auto-pass requires 1 Bi Kip with the SAME TOPIC. Gain the artifact and bonus card for passing. Three unrelated scrolls cannot bypass a Challenge. Scrolls earned from failed tasks retain the task's topic.`
  },
  {
    id:'appendix', title:'10. Phân Bố 36 Ô Địa Phương', enTitle:'10. Distribution of 36 Local Spaces', icon:'file-text',
    content:`Bắc Bộ (15): Hà Nội, Hải Phòng, Quảng Ninh, Bắc Ninh, Hưng Yên, Ninh Bình, Phú Thọ, Thái Nguyên, Tuyên Quang, Lào Cai, Cao Bằng, Lạng Sơn, Lai Châu, Điện Biên, Sơn La.
Trung Bộ (13): Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Trị, Huế, Đà Nẵng, Quảng Ngãi, Gia Lai, Đắk Lắk, Khánh Hòa, Lâm Đồng, Đặc khu Hoàng Sa, Đặc khu Trường Sa. Các tỉnh Tây Nguyên được xếp vào Trung Bộ.
Nam Bộ (8): TP. Hồ Chí Minh, Đồng Nai, Tây Ninh, Cần Thơ, Vĩnh Long, Đồng Tháp, An Giang, Cà Mau.`,
    enContent:`North (15): Hanoi, Hai Phong, Quang Ninh, Bac Ninh, Hung Yen, Ninh Binh, Phu Tho, Thai Nguyen, Tuyen Quang, Lao Cai, Cao Bang, Lang Son, Lai Chau, Dien Bien, Son La.
Central (13): Thanh Hoa, Nghe An, Ha Tinh, Quang Tri, Hue, Da Nang, Quang Ngai, Gia Lai, Dak Lak, Khanh Hoa, Lam Dong, Hoang Sa Special Zone, Truong Sa Special Zone. Central Highlands provinces belong to Central.
South (8): Ho Chi Minh City, Dong Nai, Tay Ninh, Can Tho, Vinh Long, Dong Thap, An Giang, Ca Mau.`
  }
];
