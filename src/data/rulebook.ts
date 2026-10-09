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
    title: '1. Tổng Quan Trò Chơi & Cấu Trúc Bàn Cờ',
    enTitle: '1. Game Overview & Board Architecture',
    icon: 'compass',
    content: `Lạc Việt là boardgame văn hóa - giáo dục kết hợp giữa trải nghiệm thực tế và công nghệ số (Phygital). Bàn cờ gồm 40 ô chạy quanh bản đồ dải đất hình chữ S của Việt Nam:
- 4 ô góc lớn: START (Điểm xuất phát) và 3 Trạm Dừng Chân (Bắc Bộ, Trung Bộ, Nam Bộ).
- 36 ô nhỏ đại diện cho các địa phương và ô tương tác, bao gồm:
  • 12 ô Kiến thức: Khám phá di sản, tích lũy kiến thức văn hóa để bỏ qua thử thách.
  • 8 ô Lễ hội: Rút Thẻ May Mắn (Thời vận và biến cố).
  • 8 ô Thị trường: Rút Thẻ Tài Nguyên (Lá chắn, đất đai, chiếm đoạt, trao đổi).
  • 8 ô Thử thách địa phương: Trả lời câu hỏi hoặc thử thách hành động để thu thập Kỷ vật văn hóa.`,
    enContent: `Lac Viet is a cultural-educational boardgame merging physical play with digital technology (Phygital). The board consists of 40 tiles framing Vietnam's S-shaped map:
- 4 large corner tiles: START and 3 Rest Stations (Northern, Central, Southern).
- 36 local tiles comprising:
  • 12 Knowledge tiles: Explore heritage, collect knowledge to bypass questions.
  • 8 Festival tiles: Draw Fortune cards (Windfalls and events).
  • 8 Market tiles: Draw Resource cards (Shields, land claims, trade).
  • 8 Local Challenge tiles: Answer quizzes or perform action challenges to claim Cultural Artifacts.`,
    highlights: [
      'Bàn cờ 40 ô chuẩn tỷ lệ hình vuông bao bọc bản đồ Việt Nam',
      'Hỗ trợ 2 đến 4 người chơi (hoặc chơi với AI)',
      'Tích hợp mã QR trên từng ô và thẻ bài để kết nối dữ liệu số'
    ],
    enHighlights: [
      '40-tile square board framing Vietnam map',
      '2 to 4 players or Play vs Smart AI',
      'QR Code integration on every card and space'
    ]
  },
  {
    id: 'turn_steps',
    title: '2. Hướng Dẫn Trình Tự Một Lượt Chơi',
    enTitle: '2. Turn Sequence Guide',
    icon: 'play-circle',
    content: `Trong mỗi lượt đi, người chơi thực hiện theo các bước sau:
1. Gieo xúc xắc (1 xúc xắc 6 mặt): Số điểm xúc xắc quyết định số bước tiến theo chiều kim đồng hồ.
2. (Tùy chọn) Kích hoạt kỹ năng Token: Nếu sở hữu token Bánh Mì, người chơi có thể tiến hoặc lùi 1 ô để né bẫy hoặc chọn ô mong muốn trước khi chốt vị trí.
3. Di chuyển token trên bàn cờ đến ô tương ứng.
4. Xử lý sự kiện tại ô dừng chân:
   - Rơi vào ô Kiến thức: Đọc kiến thức di sản, nhận Thẻ Kiến Thức vào tay thẻ.
   - Rơi vào ô Lễ hội: Bốc 1 Thẻ May Mắn và kích hoạt hiệu ứng (Bão lũ, Lễ hội mùa màng...).
   - Rơi vào ô Thị trường: Bốc 1 Thẻ Tài Nguyên (Lá chắn, Địa bạ...).
   - Rơi vào ô Thử thách: Trả lời câu hỏi trắc nghiệm hoặc thực hiện thử thách hành động. Nếu đúng -> Nhận 1 Kỷ vật văn hóa! Nếu sai -> Bị phạt mất 1 kỷ vật đặt lại tại ô START.
5. Kiểm tra tương tác người chơi: Nếu đỗ cùng ô với người chơi khác, bạn có quyền kích hoạt cơ chế Cướp kỷ vật hoặc cướp thẻ!
6. Bấm "Kết lượt" để chuyển sang người tiếp theo.`,
    enContent: `During their turn, a player executes these steps:
1. Roll 1 6-sided die: The result determines how many spaces to advance clockwise.
2. (Optional) Activate Token skill: e.g. Banh Mi token can shift +/- 1 space to dodge hazards.
3. Advance player token to the destination tile.
4. Resolve space event (Knowledge, Festival, Market, Challenge, or Corner).
5. Resolve player collision interactions if landing on the same space as opponents.
6. End turn to pass to the next player.`,
    highlights: [
      'Mỗi lượt tung 1 xúc xắc 6 mặt',
      'Có quyền dùng Thẻ Kiến Thức để bỏ qua câu hỏi Thử Thách cùng chủ đề',
      'Kỹ năng Token hồi chiêu khi đi qua START hoặc dừng tại 3 ô Góc'
    ]
  },
  {
    id: 'corners',
    title: '3. Quy Định 3 Trạm Dừng Chân & Ô START',
    enTitle: '3. The 3 Corner Stations & START',
    icon: 'landmark',
    content: `Các ô góc lớn có vai trò chiến lược sống còn trong game:
- Ô START (Điểm xuất phát & Trạm Thu hồi):
  • Mỗi khi đi qua hoặc dừng tại START, người chơi phải trả lời 2 câu hỏi để nhận 1 Thẻ May Mắn.
  • Nếu tại START đang có Kỷ vật bị phạt (do người chơi khác trả lời sai trước đó), người đầu tiên đi qua có quyền chiếm lấy tối đa 1 kỷ vật này nếu trả lời đúng thêm 2 câu hỏi thử thách!
- 3 Ô Góc Lớn (Bắc Bộ, Trung Bộ, Nam Bộ - Trạm Dừng Chân):
  • Khi dừng tại trạm góc, người chơi được chọn 1 trong 3 quyền lợi:
    (A) Rút 1 Thẻ May Mắn
    (B) Rút 1 Thẻ Tài Nguyên
    (C) Hồi phục ngay 1 lần sử dụng Kỹ năng Token đã dùng.
  • Ngoài ra, người chơi có thể gửi Kỷ vật an toàn tại các ô Góc này để bảo vệ khỏi các lá bài công kích khi đang trên đường quay về START.`,
    enContent: `Corner stations play vital strategic roles:
- START Tile:
  • Passing/landing on START allows answering 2 questions to draw 1 Fortune card.
  • Reclaim up to 1 penalized artifact resting at START by answering 2 challenge questions correctly.
- 3 Corner Rest Stations (North, Central, South):
  • Choose 1 of 3: Draw Fortune card, Draw Resource card, or Restore Token ability cooldown.
  • Safe-deposit cultural artifacts at corner stations to protect them from player attacks!`,
    highlights: [
      'START hồi phục lượt chơi và là nơi chuộc kỷ vật bị phạt',
      'Trạm góc cho phép hồi phục kỹ năng Token hoặc gửi kỷ vật an toàn',
      'Chiến thuật gửi kỷ vật giúp chống bị cướp trắng trên đường về đích'
    ]
  },
  {
    id: 'decks',
    title: '4. Chi Tiết 4 Hệ Thống Thẻ Bài',
    enTitle: '4. The 4 Card Decks Breakdown',
    icon: 'layers',
    content: `1. Thẻ Kiến Thức (12 thẻ):
   Cung cấp tri thức sâu sắc về văn hóa, lịch sử và địa danh Việt Nam. Người chơi tích lũy thẻ trên tay; khi gặp thẻ Thử Thách có nội dung liên quan, được quyền kích hoạt thẻ này để vượt qua câu hỏi ngay lập tức mà không cần trả lời!
2. Thẻ Thử Thách (8+ thẻ):
   Gồm câu hỏi trắc nghiệm văn hóa và các "Thử thách hành động" tương tác vui nhộn (hát 1 câu dân ca, diễn tả địa danh không dùng lời trong 30s...). Vượt qua nhận 1 Kỷ vật văn hóa.
3. Thẻ Tài Nguyên:
   Gồm "Lá chắn Văn hóa" (bảo vệ kỷ vật khỏi bị cướp), "Địa bạ Chiếm đất" (dùng để cướp kỷ vật khi đỗ cùng ô), "Tiếp tế lương thảo" (di chuyển thêm ô hoặc hồi chiêu).
4. Thẻ May Mắn:
   Mang đến các Thời vận và Biến cố kịch tính: "Bão lũ" (lùi 2 bước), "Lễ hội mùa màng" (được tung thêm 1 lần xúc xắc), "Đạo tặc" (cướp 1 thẻ của đối thủ), "Gió thuận buồm xuôi"...`,
    enContent: `1. Knowledge Cards: Cultural trivia and heritage stories. Can be consumed to instantly bypass related challenges.
2. Challenge Cards: Quizzes and action challenges (sing folk songs, charades). Rewards cultural artifacts.
3. Resource Cards: Shields, land claims, rations, and trade instruments.
4. Fortune Cards: Events like storms (retreat 2 spaces), harvest festivals (extra turn), and bandit raids (steal card).`
  },
  {
    id: 'steal_penalty',
    title: '5. Cơ Chế Cướp, Phạt & Tương Tác Đối Thủ',
    enTitle: '5. Stealing, Penalties & Player Interaction',
    icon: 'swords',
    content: `Luật chơi khuyến khích sự tương tác cạnh tranh kịch tính nhưng đậm tinh thần văn hóa:
- Đỗ cùng ô với đối thủ:
  • Nếu người chơi bỏ ra 1 Thẻ Tài Nguyên "Địa bạ/Chiếm đất": Có quyền cướp lấy 1 Kỷ vật văn hóa của đối phương!
  • Nếu không có thẻ tài nguyên tương ứng: Người chơi chỉ được quyền cướp 1 lá bài ngẫu nhiên trên tay đối phương.
  • Nếu đối thủ có "Lá chắn Văn hóa" hoặc đã gửi kỷ vật an toàn tại trạm góc: Kỷ vật được bảo vệ tuyệt đối!
- Cơ chế phạt khi thất bại Thử thách:
  • Trả lời sai thử thách -> 1 Kỷ vật đang mang theo bị phạt đặt lại tại ô START (trả về ngân hàng chung).
  • Nếu người chơi sở hữu Token Nón Lá (và nội tại chưa dùng trong vòng) -> Miễn nhiễm hình phạt!
- Chuộc kỷ vật phạt tại START:
  • Người chơi tiếp theo đi qua START có quyền giải cứu 1 kỷ vật phạt nếu trả lời đúng 2 câu hỏi thử thách liên tiếp.`,
    enContent: `Interactions create exhilarating twists:
- Landing on the same space as an opponent:
  • Play a Land/Resource card to steal 1 Cultural Artifact!
  • Without resource card, steal 1 random hand card from opponent instead.
  • Shields and Safe-deposited artifacts are completely immune!
- Penalty for failing a challenge:
  • Lose 1 carried artifact, returned to START tile.
  • Non La token ability negates 1 penalty per round.
- Reclaiming artifacts:
  • Passing START allows rescuing 1 penalized artifact by answering 2 challenge questions.`
  },
  {
    id: 'tokens',
    title: '6. Năng Lực 4 Token Văn Hóa',
    enTitle: '6. The 4 Cultural Token Passives',
    icon: 'award',
    content: `Mỗi người chơi chọn 1 Token đại diện mang 1 Nội tại đặc trưng:
- Nón Lá: Miễn nhiễm 1 lần phạt (khi trả lời sai thử thách không bị mất kỷ vật).
- Hoa Sen: Đổi 2 thẻ trên tay lấy 1 thẻ mới bất kỳ từ các bộ thẻ.
- Đèn Lồng (Gốm Sứ): Được xem trước 1 thẻ thử thách sắp tới để lên kế hoạch.
- Bánh Mì (Thuyền Rồng): Được 1 lần di chuyển tiến lên hoặc lùi xuống 1 ô để né bẫy hoặc chọn ô mong muốn.
* Quy ước hồi chiêu: Kỹ năng Token chỉ dùng 1 lần / vòng chơi; được hồi phục (reset) khi đi qua ô START hoặc dừng tại 3 ô Góc lớn.`,
    enContent: `Each token possesses unique cultural passives:
- Conical Hat (Nón Lá): Immune to 1 penalty per lap.
- Lotus Blossom (Hoa Sen): Trade 2 hand cards for 1 card of your choice.
- Lantern (Đèn Lồng): Preview upcoming challenge card.
- Banh Mi: Step +1 or -1 space to evade hazard or choose target space.
* Cooldown resets upon passing START or landing at 3 Corner Stations.`
  },
  {
    id: 'victory',
    title: '7. Quy Ước Số Kỷ Vật & Điều Kiện Chiến Thắng',
    enTitle: '7. Artifact Thresholds & Victory Conditions',
    icon: 'trophy',
    content: `Trước khi bắt đầu trận đấu, người chơi thỏa thuận chế độ chơi:
- Tốc chiến: 3 Kỷ vật văn hóa
- Cơ bản: 5 Kỷ vật văn hóa
- Trường kỳ: 7 Kỷ vật văn hóa

ĐIỀU KIỆN THẮNG CUỘC:
Người chiến thắng là người đầu tiên tích lũy đủ số lượng Kỷ vật văn hóa quy ước VÀ vận chuyển an toàn toàn bộ số kỷ vật đó trở về ô START mà không bị đối thủ cướp mất hay vô hiệu hóa!`,
    enContent: `Match modes:
- Blitz: 3 Artifacts
- Standard: 5 Artifacts
- Long March: 7 Artifacts

VICTORY CONDITION:
First player to collect the required number of Cultural Artifacts AND transport them safely back to START without losing them wins the game!`
  },
  {
    id: 'phygital',
    title: '8. Tích Hợp Số Hóa & QR Code (Phygital)',
    enTitle: '8. Phygital & QR Code Integration',
    icon: 'qr-code',
    content: `Lạc Việt là mô hình kết hợp vật lý và số hóa (Phygital):
- Trên bàn cờ vật lý và 4 bộ thẻ bài đều được in mã QR sắc nét.
- Người chơi có thể sử dụng ứng dụng Lạc Việt này để:
  • Quét QR trên thẻ để mở nội dung câu hỏi ngẫu nhiên và giải thích chi tiết.
  • Quét QR từng tỉnh thành để xem bản đồ văn hóa, hình ảnh 3D và di sản UNESCO.
  • Cập nhật ngân hàng câu hỏi mới mà không cần in lại bộ cờ vật lý.`,
    enContent: `QR Codes printed on cards and tiles connect physical boardgame with digital content, expanding questions, audio, and cultural multimedia without reprinting physical sets.`
  }
];

