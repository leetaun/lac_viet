import { KnowledgeCard, ChallengeCard, ResourceCard, FortuneCard } from '../types/game';

// THẺ KIẾN THỨC (Knowledge Cards)
export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: 'kn_hanoi',
    type: 'knowledge',
    province: 'Hà Nội',
    title: 'Hoàng Thành Thăng Long & Văn Miếu',
    heritageName: 'Di sản Văn hóa Thế giới Thăng Long',
    description: 'Năm 1010, vua Lý Thái Tổ ban Chiếu dời đô từ Hoa Lư về Đại La và đổi tên thành Thăng Long khi thấy hình tượng rồng vàng bay lên.',
    culturalSignificance: 'Trung tâm quyền lực chính trị và văn hóa liên tục suốt 13 thế kỷ của các triều đại Lý, Trần, Lê, Mạc, Nguyễn.',
    qrContent: 'https://lacviet.edu.vn/di-san/hoang-thanh-thang-long',
    category: 'Lịch sử & Cố đô'
  },
  {
    id: 'kn_bacninh',
    type: 'knowledge',
    province: 'Bắc Ninh',
    title: 'Dân Ca Quan Họ Bắc Ninh',
    heritageName: 'Di sản Văn hóa Phi vật thể UNESCO',
    description: 'Lối hát giao duyên truyền thống giữa liền anh và liền chị với các làn điệu lề lối, giọng vặt và giọng giã bạn nồng ấm ân tình.',
    culturalSignificance: 'Thể hiện ứng xử thanh lịch, hiếu khách và triết lý sống nhân văn sâu sắc của người Kinh Bắc.',
    qrContent: 'https://lacviet.edu.vn/di-san/quan-ho-bac-ninh',
    category: 'Âm nhạc & Di sản phi vật thể'
  },
  {
    id: 'kn_hungyen',
    type: 'knowledge',
    province: 'Hưng Yên',
    title: 'Phố Hiến - Đệ Nhị Kinh Kỳ',
    heritageName: 'Quần thể Di tích Lịch sử Phố Hiến',
    description: 'Thương cảng sầm uất bậc nhất thế kỷ 16-17 với câu ca: "Thứ nhất Kinh kỳ, thứ nhì Phố Hiến", nơi giao lưu văn hóa Bồ Đào Nha, Nhật Bản, Hà Lan.',
    culturalSignificance: 'Minh chứng cho truyền thống mở cửa giao thương và hội nhập kinh tế quốc tế sớm của dân tộc ta.',
    qrContent: 'https://lacviet.edu.vn/di-san/pho-hien',
    category: 'Lịch sử & Thương cảng'
  },
  {
    id: 'kn_langson',
    type: 'knowledge',
    province: 'Lạng Sơn',
    title: 'Ải Chi Lăng & Hào Khí Biên Cương',
    heritageName: 'Di tích Lịch sử Quốc gia Ải Chi Lăng',
    description: 'Hẻm núi hiểm trở nơi ghi dấu chiến công hiển hách của cha ông tiêu diệt tướng Liễu Thăng trong cuộc khởi nghĩa Lam Sơn năm 1427.',
    culturalSignificance: 'Biểu tượng của lòng yêu nước nồng nàn và nghệ thuật quân sự tài tình chống giặc ngoại xâm phương Bắc.',
    qrContent: 'https://lacviet.edu.vn/di-san/ai-chi-lang',
    category: 'Lịch sử & Quân sự'
  },
  {
    id: 'kn_laocai',
    type: 'knowledge',
    province: 'Lào Cai',
    title: 'Ruộng Bậc Thang Sa Pa & Đỉnh Fansipan',
    heritageName: 'Di sản Văn hóa Nông nghiệp Vùng cao',
    description: 'Những kiệt tác ruộng bậc thang uốn lượn bên sườn núi Hoàng Liên Sơn do đồng bào dân tộc H’Mông, Dao, Tày kiến tạo hàng trăm năm.',
    culturalSignificance: 'Minh chứng cho sự thích ứng tài tình của con người với địa hình tự nhiên núi cao hiểm trở.',
    qrContent: 'https://lacviet.edu.vn/di-san/sa-pa',
    category: 'Địa lý & Nông nghiệp truyền thống'
  },
  {
    id: 'kn_dienbien',
    type: 'knowledge',
    province: 'Điện Biên',
    title: 'Chiến Thắng Điện Biên Phủ Lịch Sử',
    heritageName: 'Khu Di tích Quốc gia Đặc biệt Điện Biên Phủ',
    description: 'Chiến thắng chấn động địa cầu ngày 07/05/1954 gắn liền với sự lãnh đạo của Đại tướng Võ Nguyên Giáp và tấm gương anh hùng Tô Vĩnh Diện, Bế Văn Đàn.',
    culturalSignificance: 'Chấm dứt ách đô hộ của thực dân Pháp, mở đầu sự sụp đổ của chủ nghĩa thực dân cũ trên toàn thế giới.',
    qrContent: 'https://lacviet.edu.vn/di-san/dien-bien-phu',
    category: 'Lịch sử Hiện đại'
  },
  {
    id: 'kn_ninhbinh',
    type: 'knowledge',
    province: 'Ninh Bình',
    title: 'Quần Thể Danh Thắng Tràng An',
    heritageName: 'Di sản Thế giới Hỗn hợp (Văn hóa & Thiên nhiên)',
    description: 'Vùng non nước hữu tình với hệ thống hang động xuyên thủy kỳ vĩ và Cố đô Hoa Lư ngàn năm - kinh đô nhà Đinh và Tiền Lê.',
    culturalSignificance: 'Di sản thế giới kép đầu tiên và duy nhất tại Đông Nam Á tính đến nay.',
    qrContent: 'https://lacviet.edu.vn/di-san/trang-an',
    category: 'Di sản Thế giới kép'
  },
  {
    id: 'kn_hatinh',
    type: 'knowledge',
    province: 'Hà Tĩnh',
    title: 'Đại Thi Hào Nguyễn Du & Truyện Kiều',
    heritageName: 'Danh nhân Văn hóa Thế giới Nguyễn Du',
    description: 'Tác giả kiệt tác "Đoạn trường tân thanh" (Truyện Kiều) - đỉnh cao ngôn ngữ thơ ca bác học và tâm hồn nhân đạo Việt Nam.',
    culturalSignificance: 'Được UNESCO vinh danh danh nhân văn hóa thế giới năm 2015.',
    qrContent: 'https://lacviet.edu.vn/di-san/nguyen-du',
    category: 'Văn học & Danh nhân'
  },
  {
    id: 'kn_hue',
    type: 'knowledge',
    province: 'Huế',
    title: 'Nhã Nhạc Cung Đình Huế',
    heritageName: 'Di sản Văn hóa Phi vật thể Nhân loại (UNESCO)',
    description: 'Âm nhạc tao nhã của triều đình phong kiến Việt Nam, phát triển rực rỡ dưới thời các chúa Nguyễn và vương triều Nguyễn.',
    culturalSignificance: 'Âm nhạc cung đình duy nhất còn bảo tồn trọn vẹn tại Việt Nam đến ngày nay.',
    qrContent: 'https://lacviet.edu.vn/di-san/nha-nhac-hue',
    category: 'Âm nhạc & Cung đình'
  },
  {
    id: 'kn_gialai',
    type: 'knowledge',
    province: 'Gia Lai',
    title: 'Không Gian Văn Hóa Cồng Chiêng Tây Nguyên',
    heritageName: 'Kiệt tác Truyền khẩu và Phi vật thể Nhân loại',
    description: 'Tiếng chiêng tiếng cồng vang vọng núi rừng Tây Nguyên trong lễ đâm trâu, lễ bỏ mả, kết nối con người với thần linh (Yàng).',
    culturalSignificance: 'Biểu tượng sức mạnh cộng đồng và bản sắc ngàn đời của đồng bào các dân tộc Ba Na, Gia Rai, Ê Đê.',
    qrContent: 'https://lacviet.edu.vn/di-san/cong-chieng-tay-nguyen',
    category: 'Văn hóa Dân tộc'
  },
  {
    id: 'kn_tayninh',
    type: 'knowledge',
    province: 'Tây Ninh',
    title: 'Tòa Thánh Cao Đài & Đỉnh Núi Bà Đen',
    heritageName: 'Trung tâm Tôn giáo & Thắng cảnh Nam Bộ',
    description: 'Tòa thánh Tây Ninh với kiến trúc hòa quyện phong cách Phật, Đạo, Nho và Công giáo, cùng đỉnh Núi Bà Đen cao 986m nóc nhà Nam Bộ.',
    culturalSignificance: 'Minh chứng cho tinh thần dung hợp văn hóa và tự do tín ngưỡng độc đáo của người phương Nam.',
    qrContent: 'https://lacviet.edu.vn/di-san/nui-ba-den',
    category: 'Tôn giáo & Thắng cảnh'
  },
  {
    id: 'kn_dongthap',
    type: 'knowledge',
    province: 'Đồng Tháp',
    title: 'Làng Hoa Sa Đéc & Vùng Đồng Sen',
    heritageName: 'Làng nghề Truyền thống Nam Bộ',
    description: 'Thủ phủ hoa kiểng trăm năm của miền Tây Nam Bộ, với những giàn hoa trên mặt nước độc nhất vô nhị và đầm sen ngút ngàn.',
    culturalSignificance: 'Nét văn minh miệt vườn sông nước Cửu Long tươi mát và trù phú.',
    qrContent: 'https://lacviet.edu.vn/di-san/dong-thap-sen',
    category: 'Làng nghề & Sinh thái'
  }
];

// THẺ THỬ THÁCH (Challenge Cards: Quiz & Action)
export const CHALLENGE_CARDS: ChallengeCard[] = [
  // 1: Thử thách Quảng Ninh
  {
    id: 'ch_quangninh',
    type: 'challenge',
    province: 'Quảng Ninh',
    title: 'Kỳ Quan Vịnh Hạ Long',
    challengeType: 'quiz',
    question: 'Tên gọi "Hạ Long" gắn liền với truyền thuyết dân gian nào của dân tộc ta?',
    options: [
      'Đàn Rồng mẹ và Rồng con hạ trần phun ngọc châu giúp dân chống giặc ngoại xâm',
      'Thần Kim Quy giáng thế hóa đá để ngăn những đợt sóng thần từ đại dương',
      'Vua Hùng dẹp tan thủy quái và phong núi rừng làm lá chắn biên ải',
      'Lạc Long Quân cùng 50 người con xuống biển xây dựng bờ cõi'
    ],
    correctAnswer: 0,
    explanation: 'Theo truyền thuyết, Ngọc Hoàng sai Rồng mẹ mang theo một đàn Rồng con xuống trần gian giúp người Việt đánh giặc. Khi thuyền giặc vào bờ, đàn Rồng phun ngọc châu hóa thành hàng nghìn đảo đá chặn đánh thuyền giặc.',
    rewardArtifact: 'Ngọc Rồng Hạ Long',
    relatedKnowledgeKeyword: 'Hạ Long'
  },
  // 2: Thử thách Thái Nguyên
  {
    id: 'ch_thainguyen',
    type: 'challenge',
    province: 'Thái Nguyên',
    title: 'Hương Vị Trà Tân Cương',
    challengeType: 'quiz',
    question: 'Loại trà đặc sản trứ danh bậc nhất của vùng chè Tân Cương Thái Nguyên có hình dạng uốn cong như móc câu được gọi là gì?',
    options: [
      'Trà Móc Câu (hoặc Trà Đinh)',
      'Trà Ô Long Hoàng Đế',
      'Trà Shan Tuyết Cổ Thụ',
      'Trà Sen Cung Đình'
    ],
    correctAnswer: 0,
    explanation: 'Trà Tân Cương Thái Nguyên nổi tiếng với búp trà cuộn chặt hình móc câu, hương cốm non tự nhiên, vị tiền chát hậu ngọt đượm đà sâu lắng.',
    rewardArtifact: 'Tách Trà Tân Cương',
    relatedKnowledgeKeyword: 'Trà'
  },
  // 3: Thử thách Phú Thọ
  {
    id: 'ch_phutho',
    type: 'challenge',
    province: 'Phú Thọ',
    title: 'Cội Nguồn Đất Tổ',
    challengeType: 'action',
    actionPrompt: 'Hãy đọc thuộc lòng hoặc ngâm to câu ca dao bất hủ nhắc nhở người Việt nhớ về ngày Giỗ Tổ Hùng Vương!',
    question: 'Câu ca dao truyền đời về ngày Giỗ Tổ Hùng Vương mùng 10 tháng 3 âm lịch là gì?',
    options: [
      '"Dù ai đi ngược về xuôi - Nhớ ngày Giỗ Tổ mùng mười tháng ba"',
      '"Bầu ơi thương lấy bí cùng - Tuy rằng khác giống nhưng chung một giàn"',
      '"Nhiễu điều phủ lấy giá gương - Người trong một nước phải thương nhau cùng"',
      '"Con người có tổ có tông - Như cây có cội như sông có nguồn"'
    ],
    correctAnswer: 0,
    explanation: '"Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ mùng mười tháng ba" là lời dặn dò thiêng liêng in sâu vào tâm khảm mỗi người con đất Việt.',
    timeLimitSeconds: 25,
    rewardArtifact: 'Trống Đồng Hùng Vương',
    relatedKnowledgeKeyword: 'Hùng Vương'
  },
  // 4: Thử thách Nghệ An
  {
    id: 'ch_nghean',
    type: 'challenge',
    province: 'Nghệ An',
    title: 'Dân Ca Ví Giặm Nghệ Tĩnh',
    challengeType: 'quiz',
    question: 'Nghệ thuật Dân ca Ví, Giặm Nghệ Tĩnh được UNESCO vinh danh là Di sản văn hóa phi vật thể đại diện của nhân loại vào năm nào?',
    options: [
      'Năm 2014',
      'Năm 2008',
      'Năm 2018',
      'Năm 2021'
    ],
    correctAnswer: 0,
    explanation: 'Dân ca Ví, Giặm Nghệ Tĩnh được UNESCO ghi danh vào ngày 27/11/2014, là loại hình nghệ thuật dân gian gắn bó chặt chẽ với lao động sinh hoạt của người dân xứ Nghệ.',
    rewardArtifact: 'Đàn Đáy Xứ Nghệ',
    relatedKnowledgeKeyword: 'Ví Giặm'
  },
  // 5: Thử thách Quảng Ngãi
  {
    id: 'ch_quangngai',
    type: 'challenge',
    province: 'Quảng Ngãi',
    title: 'Hải Đội Hoàng Sa',
    challengeType: 'quiz',
    question: 'Nghi lễ dân gian thiêng liêng nào được tổ chức hàng năm tại đảo Lý Sơn (Quảng Ngãi) để tri ân những người lính đi làm nhiệm vụ bảo vệ biển đảo?',
    options: [
      'Lễ Khao lề thế lính Hoàng Sa',
      'Lễ Nghinh Ông Nam Hải',
      'Lễ Rước thần Cá Voi',
      'Lễ Cầu ngư biển Đông'
    ],
    correctAnswer: 0,
    explanation: 'Lễ khao lề thế lính Hoàng Sa là nghi lễ độc đáo của cư dân đảo Lý Sơn, thể hiện ý chí quật cường và chủ quyền biển đảo bất khả xâm phạm của Việt Nam từ nhiều thế kỷ trước.',
    rewardArtifact: 'Hải Thuyền Hoàng Sa',
    relatedKnowledgeKeyword: 'Lý Sơn'
  },
  // 6: Thử thách Lâm Đồng
  {
    id: 'ch_lamdong',
    type: 'challenge',
    province: 'Lâm Đồng',
    title: 'Huyền Thoại Chàng K’lang & Nàng H’biang',
    challengeType: 'action',
    actionPrompt: 'Hãy dùng cử chỉ (không nói lời nào) trong vòng 20 giây để diễn tả một đóa hoa hoặc khí hậu sương mù của thành phố Đà Lạt!',
    question: 'Đỉnh núi cao nhất gắn liền với thiên tình sử thiêng liêng của chàng K’lang và nàng H’biang tại Lâm Đồng mang tên là gì?',
    options: [
      'Núi Langbiang',
      'Núi Bà Đen',
      'Núi Hàm Lợn',
      'Núi Bạch Mộc Lương Tử'
    ],
    correctAnswer: 0,
    explanation: 'Núi Langbiang gồm Núi Ông và Núi Bà tượng trưng cho tình yêu chung thủy son sắt vượt qua định kiến bộ tộc của chàng K’lang và nàng H’biang.',
    timeLimitSeconds: 20,
    rewardArtifact: 'Hoa Dã Quỳ Cao Nguyên',
    relatedKnowledgeKeyword: 'Langbiang'
  },
  // 7: Thử thách Vĩnh Long
  {
    id: 'ch_vinhlong',
    type: 'challenge',
    province: 'Vĩnh Long',
    title: 'Vương Quốc Lò Gạch Mang Thít',
    challengeType: 'quiz',
    question: 'Di sản đương đại nổi tiếng của huyện Mang Thít (tỉnh Vĩnh Long) với hàng nghìn lò gạch nung cổ nằm dọc sông Cổ Chiên được gọi là gì?',
    options: [
      'Vương quốc Đỏ Mang Thít',
      'Làng Gốm Bát Tràng Phương Nam',
      'Cố Đô Gạch Đất Nung',
      'Thủ Phủ Đồ Đất Sét'
    ],
    correctAnswer: 0,
    explanation: 'Vương quốc Đỏ Mang Thít là di sản kiến trúc lò nung gốm truyền thống có một không hai ở miền Tây, tạo nên cảnh quan độc đáo lung linh phản chiếu dưới bóng dừa nước.',
    rewardArtifact: 'Bình Gốm Đỏ Mang Thít',
    relatedKnowledgeKeyword: 'Mang Thít'
  },
  // 8: Thử thách Cà Mau
  {
    id: 'ch_camau',
    type: 'challenge',
    province: 'Cà Mau',
    title: 'Cột Mốc Tọa Độ Đất Mũi',
    challengeType: 'quiz',
    question: 'Cột mốc tọa độ quốc gia đặt tại mũi Cà Mau - điểm cực Nam thiêng liêng của dải đất hình chữ S mang số hiệu nào?',
    options: [
      'GPS 0001',
      'VN 1000',
      'KM 2026',
      'CỘT MỐC 92'
    ],
    correctAnswer: 0,
    explanation: 'Cột mốc tọa độ Quốc gia GPS 0001 tại Đất Mũi Cà Mau là niềm tự hào của mỗi người dân Việt Nam, nơi đất nở ra và rừng biết đi.',
    rewardArtifact: 'Tượng Đài Con Thuyền Đất Mũi',
    relatedKnowledgeKeyword: 'Cà Mau'
  }
];

// THẺ TÀI NGUYÊN (Resource Cards)
export const RESOURCE_CARDS: ResourceCard[] = [
  {
    id: 'res_shield_1',
    type: 'resource',
    name: 'Lá Chắn Văn Hóa',
    category: 'shield',
    description: 'Tấm lá chắn hộ mệnh được rèn luyện từ sức mạnh đoàn kết dân tộc.',
    effect: 'Bảo vệ Kỷ vật văn hóa đang mang theo khỏi 1 lần bị đối thủ cướp bóc hoặc công kích.'
  },
  {
    id: 'res_shield_2',
    type: 'resource',
    name: 'Bùa Hộ Thân Sơn Thần',
    category: 'shield',
    description: 'Sự che chở của thần núi Tản Viên giúp bạn vững bước trên hành trình.',
    effect: 'Miễn nhiễm với hiệu ứng thời vận xấu (Bão lũ, Biến cố) trong 1 vòng chơi.'
  },
  {
    id: 'res_land_1',
    type: 'resource',
    name: 'Địa Bạ Chiếm Đất',
    category: 'land',
    description: 'Văn tự sở hữu vùng đất giao thương màu mỡ.',
    effect: 'Cho phép chiếm 1 Kỷ vật của đối thủ khi hai người chơi cùng đỗ vào một ô trên bàn cờ.'
  },
  {
    id: 'res_land_2',
    type: 'resource',
    name: 'Khế Ước Phường Hội',
    category: 'land',
    description: 'Liên minh phường hội buôn bán trên bến dưới thuyền.',
    effect: 'Được quyền thu phí 1 thẻ bài ngẫu nhiên từ bất kỳ người chơi nào đi ngang qua ô bạn đang đứng.'
  },
  {
    id: 'res_supplies_1',
    type: 'resource',
    name: 'Tiếp Tế Lương Thảo',
    category: 'supplies',
    description: 'Kho lương đầy ắp bánh chưng, bánh giầy tiếp thêm sinh lực dồi dào.',
    effect: 'Được di chuyển thêm 3 ô ngay lập tức hoặc hồi phục ngay lập tức Kỹ năng Token.'
  },
  {
    id: 'res_steal_1',
    type: 'resource',
    name: 'Bảo Vật Gia Truyền',
    category: 'steal',
    description: 'Vật gia bảo quý hiếm dùng để đổi chác tại các thương cảng lớn.',
    effect: 'Có thể đổi lấy 1 Kỷ vật đang bị phạt tại ô START mà không cần trả lời câu hỏi.'
  }
];

// THẺ MAY MẮN (Fortune Cards)
export const FORTUNE_CARDS: FortuneCard[] = [
  {
    id: 'for_harvest',
    type: 'fortune',
    name: 'Lễ Hội Mùa Màng Bội Thu',
    eventType: 'harvest',
    description: 'Mưa thuận gió hòa, lúa vàng trĩu hạt trên khắp các cánh đồng châu thổ.',
    effectText: 'Người chơi được quyền gieo xúc xắc thêm một lần nữa ngay trong lượt này!',
    extraTurn: true
  },
  {
    id: 'for_storm',
    type: 'fortune',
    name: 'Bão Lũ Miền Trung',
    eventType: 'storm',
    description: 'Thời tiết khắc nghiệt gió mưa thử thách lòng kiên trì của người lữ khách phương xa.',
    effectText: 'Nước dâng cao cản trở hành trình. Người chơi phải lùi lại 2 bước!',
    moveDelta: -2
  },
  {
    id: 'for_bandit',
    type: 'fortune',
    name: 'Đạo Tặc Rình Rập',
    eventType: 'bandit',
    description: 'Cơn biến cố bất ngờ trên đường giao thương vắng vẻ.',
    effectText: 'Người chơi được quyền chọn và cướp lấy 1 thẻ bài bất kỳ từ tay của người chơi bên cạnh!'
  },
  {
    id: 'for_tailwind',
    type: 'fortune',
    name: 'Gió Thuận Buồm Xuôi',
    eventType: 'tailwind',
    description: 'Cánh buồm đỏ thắm đón ngọn gió lành lướt nhanh về phía trước.',
    effectText: 'Tiến thẳng 3 bước về phía trạm dừng chân gần nhất.'
  },
  {
    id: 'for_blessing',
    type: 'fortune',
    name: 'Phúc Lộc Đầu Xuân',
    eventType: 'blessing',
    description: 'Lộc biếc hoa mai nở rộ đón chào năm mới may mắn an khang thịnh vượng.',
    effectText: 'Nhận ngay 1 Thẻ Tài Nguyên và hồi phục 1 lần sử dụng Kỹ năng Token!'
  },
  {
    id: 'for_negate',
    type: 'fortune',
    name: 'Hóa Giải Biến Cố',
    eventType: 'negate',
    description: 'Trí thông minh và sự bình tĩnh biến nguy thành an.',
    effectText: 'Vô hiệu hóa một hiệu ứng bất lợi từ đối thủ hoặc né tránh 1 hình phạt.'
  }
];

