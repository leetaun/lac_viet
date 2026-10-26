import { copyCard, weightedDraw } from '../engine/rules';
import { KnowledgeCard, ChallengeCard, ResourceCard, FortuneCard, BiKipCard } from '../types/game';

// THẺ BÍ KÍP KHỞI ĐẦU & TÍCH LŨY
export const STARTER_BIKIP_CARDS: BiKipCard[] = [
  {
    id: 'bk_hist_start',
    title: 'Bí Kíp Lịch Sử: Khởi Nguồn Âu Lạc',
    topic: 'history',
    topicName: 'Lịch sử',
    sourceProvince: 'Hà Nội',
    questionSnippet: 'Dời đô Thăng Long 1010 và chiến lũy Cổ Loa thời An Dương Vương'
  },
  {
    id: 'bk_cuis_start',
    title: 'Bí Kíp Ẩm Thực: Hương Vị Ba Miền',
    topic: 'cuisine',
    topicName: 'Ẩm thực',
    sourceProvince: 'Hải Phòng',
    questionSnippet: 'Tinh hoa gia vị thảo mộc và nghệ thuật nấu nước dùng truyền thống'
  },
  {
    id: 'bk_art_start',
    title: 'Bí Kíp Nghệ Thuật: Thanh Âm Di Sản',
    topic: 'art',
    topicName: 'Nghệ thuật',
    sourceProvince: 'Huế',
    questionSnippet: 'Nhã nhạc cung đình và các làn điệu dân ca truyền thống Việt'
  },
  {
    id: 'bk_cust_start',
    title: 'Bí Kíp Phong Tục: Hội Làng & Tín Ngưỡng',
    topic: 'custom',
    topicName: 'Phong tục',
    sourceProvince: 'Phú Thọ',
    questionSnippet: 'Tín ngưỡng thờ cúng Hùng Vương và phong tục hội làng đầu xuân'
  }
];

// THẺ KIẾN THỨC (12 Ô Kiến thức trên bàn cờ - Cấu trúc 4 phần chuẩn Lạc Việt)
export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  // 1: Hà Nội - Lịch sử
  {
    id: 'kn_hanoi',
    type: 'knowledge',
    province: 'Hà Nội',
    region: 'bac_bo',
    title: 'Hoàng Thành Thăng Long & Chiếu Dời Đô',
    heritageName: 'Di sản Văn hóa Thế giới Thăng Long',
    topic: 'history',
    category: 'Lịch sử & Cố đô',
    question: 'Năm 1010, vị vua nào đã ban "Chiếu dời đô" dời kinh đô từ Hoa Lư về thành Đại La và đổi tên thành Thăng Long?',
    options: [
      'Vua Lý Thái Tổ (Lý Công Uẩn)',
      'Vua Đinh Tiên Hoàng',
      'Vua Lê Đại Hành',
      'Vua Trần Thái Tông'
    ],
    correctAnswer: 0,
    didYouKnow: 'Vua Lý Thái Tổ thấy rồng vàng bay lên bên bờ sông Nhị Hà nên đổi tên thành Thăng Long, biểu trưng cho thế nước bay cao.',
    citation: 'Đại Việt Sử Ký Toàn Thư (NXB Khoa Học Xã Hội, 1993, Bản kỷ Toàn thư quyển 2)',
    description: 'Năm 1010, vua Lý Thái Tổ ban Chiếu dời đô từ Hoa Lư về Đại La và đổi tên thành Thăng Long khi thấy hình tượng rồng vàng bay lên.',
    culturalSignificance: 'Trung tâm quyền lực chính trị và văn hóa liên tục suốt 13 thế kỷ của các triều đại Lý, Trần, Lê, Mạc, Nguyễn.',
    qrContent: 'https://lacviet.edu.vn/di-san/hoang-thanh-thang-long'
  },
  // 2: Hưng Yên - Phong tục & Lịch sử
  {
    id: 'kn_hungyen',
    type: 'knowledge',
    province: 'Hưng Yên',
    region: 'bac_bo',
    title: 'Phố Hiến - Đệ Nhị Kinh Kỳ',
    heritageName: 'Quần thể Di tích Lịch sử Phố Hiến',
    topic: 'history',
    category: 'Lịch sử & Thương cảng',
    question: 'Câu ca dao dân gian nào miêu tả sự sầm uất giao thương bậc nhất của Phố Hiến vào thế kỷ 16-17?',
    options: [
      '"Thứ nhất Kinh kỳ, thứ nhì Phố Hiến"',
      '"Đồng Đăng có phố Kỳ Lừa, có nàng Tô Thị"',
      '"Ai về Hà Tĩnh quê mình, ngắm dòng Lam biếc"',
      '"Nhà Bè nước chảy chia hai, ai về Gia Định"'
    ],
    correctAnswer: 0,
    didYouKnow: 'Phố Hiến từng có thương điếm Hà Lan, Anh, Nhật Bản với 20 phường sầm uất ven sông Hồng cổ.',
    citation: 'Hưng Yên Địa Chí (Sở VHTT&DL Hưng Yên, 2012, Tr. 145)',
    description: 'Thương cảng sầm uất bậc nhất thế kỷ 16-17, nơi giao lưu văn hóa phương Đông và phương Tây sớm nhất miền Bắc.',
    culturalSignificance: 'Minh chứng cho truyền thống mở cửa giao thương và hội nhập kinh tế quốc tế sớm của dân tộc ta.',
    qrContent: 'https://lacviet.edu.vn/di-san/pho-hien'
  },
  // 3: Lạng Sơn - Lịch sử
  {
    id: 'kn_langson',
    type: 'knowledge',
    province: 'Lạng Sơn',
    region: 'bac_bo',
    title: 'Ải Chi Lăng & Hào Khí Biên Cương',
    heritageName: 'Di tích Lịch sử Quốc gia Ải Chi Lăng',
    topic: 'history',
    category: 'Lịch sử & Biên ải',
    question: 'Năm 1427, tướng giặc Liễu Thăng nhà Minh bị quân nghĩa quân Lam Sơn chém đầu tại địa danh hiểm trở nào ở Lạng Sơn?',
    options: [
      'Ải Chi Lăng',
      'Đèo Hải Vân',
      'Cổng Trời Mèo Vạc',
      'Đèo Pha Đin'
    ],
    correctAnswer: 0,
    didYouKnow: 'Ải Chi Lăng là thung lũng hẹp kẹp giữa hai dãy núi đá vôi dựng đứng, địa thế "một người giữ ải, vạn người khó qua".',
    citation: 'Lịch sử Khởi nghĩa Lam Sơn (Viện Lịch sử Quân sự Việt Nam, 2005)',
    description: 'Hẻm núi hiểm trở nơi ghi dấu chiến công hiển hách của cha ông đánh bại đạo quân cứu viện 10 vạn quân Minh.',
    culturalSignificance: 'Biểu tượng của lòng yêu nước nồng nàn và nghệ thuật quân sự tài tình chống giặc ngoại xâm phương Bắc.',
    qrContent: 'https://lacviet.edu.vn/di-san/ai-chi-lang'
  },
  // 4: Lào Cai - Phong tục
  {
    id: 'kn_laocai',
    type: 'knowledge',
    province: 'Lào Cai',
    region: 'bac_bo',
    title: 'Ruộng Bậc Thang Sa Pa',
    heritageName: 'Di sản Văn hóa Nông nghiệp Vùng cao',
    topic: 'custom',
    category: 'Phong tục & Nông nghiệp',
    question: 'Các đồng bào dân tộc nào là tác giả chính kiến tạo nên những thung lũng ruộng bậc thang kỳ vĩ hàng trăm năm ở Sa Pa?',
    options: [
      'Đồng bào H’Mông, Dao, Giáy',
      'Đồng bào Chăm và Raglai',
      'Đồng bào Ba Na và Ê Đê',
      'Đồng bào Khmer Nam Bộ'
    ],
    correctAnswer: 0,
    didYouKnow: 'Hệ thống dẫn nước bằng ống nứa từ khe núi cao tưới đều cho từng bậc ruộng là kỹ thuật thủy nông truyền thống độc đáo bậc nhất thế giới.',
    citation: 'Bảo tồn Di sản Canh tác Nông nghiệp Sa Pa (Bộ Nông nghiệp & PTNT, 2018)',
    description: 'Những kiệt tác ruộng bậc thang uốn lượn bên sườn núi Hoàng Liên Sơn do các tộc người vùng cao vun đắp qua nhiều thế hệ.',
    culturalSignificance: 'Minh chứng cho sự thích ứng tài tình của con người với địa hình đồi núi dốc hiểm trở.',
    qrContent: 'https://lacviet.edu.vn/di-san/sa-pa'
  },
  // 5: Điện Biên - Lịch sử
  {
    id: 'kn_dienbien',
    type: 'knowledge',
    province: 'Điện Biên',
    region: 'bac_bo',
    title: 'Chiến Thắng Lịch Sử Điện Biên Phủ',
    heritageName: 'Khu Di tích Quốc gia Đặc biệt Điện Biên Phủ',
    topic: 'history',
    category: 'Lịch sử Dân tộc',
    question: 'Chiến dịch Điện Biên Phủ "Lừng lẫy năm châu, chấn động địa cầu" toàn thắng vào ngày tháng năm nào?',
    options: [
      'Ngày 07 tháng 05 năm 1954',
      'Ngày 02 tháng 09 năm 1945',
      'Ngày 30 tháng 04 năm 1975',
      'Ngày 19 tháng 12 năm 1946'
    ],
    correctAnswer: 0,
    didYouKnow: 'Lá cờ "Quyết chiến Quyết thắng" tung bay trên nóc hầm De Castries lúc 17h30 chiều ngày 07/05/1954.',
    citation: 'Tổng kết Chiến cuộc Đông Xuân 1953-1954 và Chiến dịch Điện Biên Phủ (Bộ Quốc phòng, 2004)',
    description: 'Chiến dịch kéo dài 56 ngày đêm khoét núi ngủ hầm mưa dầm cơm vắt làm nên mốc son chói lọi.',
    culturalSignificance: 'Chấm dứt ách thống trị của thực dân Pháp, mở đường cho phong trào giải phóng dân tộc trên thế giới.',
    qrContent: 'https://lacviet.edu.vn/di-san/dien-bien-phu'
  },
  // 6: Ninh Bình - Lịch sử & Nghệ thuật
  {
    id: 'kn_ninhbinh',
    type: 'knowledge',
    province: 'Ninh Bình',
    region: 'bac_bo',
    title: 'Cố Đô Hoa Lư & Quần Thể Tràng An',
    heritageName: 'Di sản Văn hóa & Thiên nhiên Thế giới Tràng An',
    topic: 'history',
    category: 'Cố đô & Di sản Thế giới',
    question: 'Quần thể danh thắng Tràng An (Ninh Bình) vinh dự được UNESCO công nhận là loại hình di sản nào?',
    options: [
      'Di sản Thế giới Hỗn hợp đầu tiên tại Đông Nam Á (cả Văn hóa & Thiên nhiên)',
      'Chỉ là Di sản Thiên nhiên đơn thuần',
      'Chỉ là Di sản Văn hóa Phi vật thể',
      'Khu dự trữ sinh quyển thế giới đơn thuần'
    ],
    correctAnswer: 0,
    didYouKnow: 'Cố đô Hoa Lư được bao bọc bởi các dãy núi đá vôi tự nhiên như bức tường thành kiên cố bảo vệ kinh đô nước Đại Cồ Việt.',
    citation: 'Hồ sơ Di sản Thế giới Tràng An (UNESCO World Heritage Centre, 2014, Ref. 1438)',
    description: 'Tràng An hội tụ cảnh quan karst nhiệt đới kỳ vĩ, trầm tích khảo cổ học người tiền sử và kinh đô Hoa Lư thế kỷ 10.',
    culturalSignificance: 'Biểu tượng của sự hòa quyện tuyệt mỹ giữa thiên nhiên hùng tráng và bề dày văn hóa tiền nhân.',
    qrContent: 'https://lacviet.edu.vn/di-san/trang-an'
  },
  // 7: Hà Tĩnh - Nghệ thuật
  {
    id: 'kn_hatinh',
    type: 'knowledge',
    province: 'Hà Tĩnh',
    region: 'trung_bo',
    title: 'Đại Thi Hào Nguyễn Du & Truyện Kiều',
    heritageName: 'Danh nhân Văn hóa Thế giới Nguyễn Du',
    topic: 'art',
    category: 'Văn học & Nghệ thuật',
    question: 'Kiệt tác Truyện Kiều bất hủ của Đại thi hào Nguyễn Du được sáng tác theo thể thơ dân tộc truyền thống nào?',
    options: [
      'Thể thơ Lục bát (6 - 8 chữ)',
      'Thể thơ Song thất lục bát',
      'Thể thơ Đường luật thất ngôn bát cú',
      'Thể thơ Tự do'
    ],
    correctAnswer: 0,
    didYouKnow: 'Truyện Kiều có đúng 3.254 câu thơ lục bát, đã được dịch ra hơn 20 ngôn ngữ trên thế giới.',
    citation: 'Từ điển Tác phẩm Văn học Việt Nam (NXB Giáo Dục, 2008, Tr. 312)',
    description: 'Đỉnh cao chói lọi của văn học chữ Nôm và ngôn ngữ tiếng Việt với tinh thần nhân văn cao cả.',
    culturalSignificance: 'Được UNESCO tôn vinh Đại thi hào Nguyễn Du là Danh nhân văn hóa thế giới năm 2015.',
    qrContent: 'https://lacviet.edu.vn/di-san/nguyen-du'
  },
  // 8: Huế - Nghệ thuật
  {
    id: 'kn_hue',
    type: 'knowledge',
    province: 'Huế',
    region: 'trung_bo',
    title: 'Nhã Nhạc Cung Đình Huế',
    heritageName: 'Di sản Văn hóa Phi vật thể Nhân loại (UNESCO)',
    topic: 'art',
    category: 'Âm nhạc Cung đình',
    question: 'Nhã nhạc Cung đình Huế là loại hình âm nhạc chính thống biểu diễn phục vụ các dịp nào dưới triều Nguyễn?',
    options: [
      'Các đại lễ tế Trời Đất (Nam Giao), tế Miếu và các dịp triều hội trọng đại',
      'Chỉ hát trong đám cưới dân gian',
      'Chỉ biểu diễn trong phòng ngủ hoàng hậu',
      'Chỉ hát mừng chiến thắng ngoài chiến trận'
    ],
    correctAnswer: 0,
    didYouKnow: 'Nhã nhạc sử dụng hệ thống nhạc cụ bát âm cung đình trang trọng: kim, thạch, ty, trúc, bào, thổ, cách, mộc.',
    citation: 'Nhã nhạc Cung đình Việt Nam (Trung tâm Bảo tồn Di tích Cố đô Huế, 2004)',
    description: 'Âm nhạc tao nhã đạt đến độ hoàn mỹ và chuẩn mực cao nhất của nền âm nhạc truyền thống Việt Nam.',
    culturalSignificance: 'Di sản phi vật thể đầu tiên của Việt Nam được UNESCO vinh danh năm 2003.',
    qrContent: 'https://lacviet.edu.vn/di-san/nha-nhac-hue'
  },
  // 9: Gia Lai - Nghệ thuật
  {
    id: 'kn_gialai',
    type: 'knowledge',
    province: 'Gia Lai',
    region: 'trung_bo',
    title: 'Không Gian Văn Hóa Cồng Chiêng Tây Nguyên',
    heritageName: 'Kiệt tác Truyền khẩu và Phi vật thể Nhân loại',
    topic: 'art',
    category: 'Âm nhạc Dân tộc',
    question: 'Trong quan niệm tâm linh của các dân tộc Tây Nguyên (Ba Na, Gia Rai), tiếng cồng chiêng đóng vai trò gì?',
    options: [
      'Là tiếng nói thiêng kết nối tâm tư con người với thần linh (Yàng)',
      'Chỉ để gọi trâu bò về chuồng lúc hoàng hôn',
      'Chỉ dùng để tập thể dục buổi sáng',
      'Không mang ý nghĩa tâm linh nào'
    ],
    correctAnswer: 0,
    didYouKnow: 'Mỗi bộ cồng chiêng được coi như một tài sản vô giá của gia đình và dòng họ, có thần chiêng trú ngụ.',
    citation: 'Không gian Văn hóa Cồng chiêng Tây Nguyên (Hồ sơ Di sản UNESCO, 2005)',
    description: 'Bản hòa âm đại ngàn ngân vang trong lễ đâm trâu, mừng lúa mới, lễ bỏ mả quanh mái nhà Rông.',
    culturalSignificance: 'Biểu tượng cố kết cộng đồng và bản sắc thiêng liêng trường tồn của 5 tỉnh Tây Nguyên.',
    qrContent: 'https://lacviet.edu.vn/di-san/cong-chieng-tay-nguyen'
  },
  // 10: Hoàng Sa - Lịch sử & Phong tục
  {
    id: 'kn_hoangsa',
    type: 'knowledge',
    province: 'Đặc khu Hoàng Sa',
    region: 'trung_bo',
    title: 'Đội Hùng Binh Hoàng Sa Triều Nguyễn',
    heritageName: 'Bia Chủ Quyền & Hải Đội Hoàng Sa Kiêm Quản Bắc Hải',
    topic: 'history',
    category: 'Lịch sử & Chủ quyền Biển đảo',
    question: 'Dưới thời các chúa Nguyễn và triều Nguyễn, "Đội Hoàng Sa" hàng năm dong thuyền ra quần đảo Hoàng Sa vào tháng mấy âm lịch?',
    options: [
      'Tháng 2 âm lịch dong buồm đi, tháng 8 âm lịch về kinh đô nộp hải vật',
      'Đi vào tháng 12 giữa bão gió mùa đông',
      'Chỉ đi khi nào trời có nguyệt thực',
      'Đi vào ban đêm tháng 6 rồi về ngay trong ngày'
    ],
    correctAnswer: 0,
    didYouKnow: 'Mỗi người lính Hoàng Sa khi xuất hành đều chuẩn bị 1 đôi chiếu, 7 đòn tre và 7 sợi dây mây để nếu chẳng may ngã xuống giữa biển khơi thì đồng đội bó xác thả về biển mẹ.',
    citation: 'Phủ Biên Tạp Lục của Lê Quý Đôn (1776) & Đại Nam Thực Lục (Quốc Sử Quán Triều Nguyễn)',
    description: 'Những bằng chứng lịch sử pháp lý đanh thép khẳng định chủ quyền lãnh thổ lâu đời và liên tục của Việt Nam trên Biển Đông.',
    culturalSignificance: 'Biểu tượng thiêng liêng của ý chí quật cường và sự hy sinh cao cả bảo vệ biên cương bờ cõi biển đảo.',
    qrContent: 'https://lacviet.edu.vn/di-san/chu-quyen-hoang-sa'
  },
  // 11: Tây Ninh - Phong tục & Lịch sử
  {
    id: 'kn_tayninh',
    type: 'knowledge',
    province: 'Tây Ninh',
    region: 'nam_bo',
    title: 'Đỉnh Núi Bà Đen & Tòa Thánh Tây Ninh',
    heritageName: 'Thắng Cảnh & Kiến Trúc Tôn Giáo Nam Bộ',
    topic: 'custom',
    category: 'Phong tục & Tín ngưỡng',
    question: 'Ngọn núi Bà Đen tại Tây Ninh được mệnh danh là danh xưng địa lý nào của miền Nam nước ta?',
    options: [
      '"Nóc nhà Nam Bộ" (với độ cao 986m)',
      '"Nóc nhà Đông Dương"',
      '"Núi thiêng Yên Tử Phương Nam"',
      '"Đệ nhất hùng quan đèo mây"'
    ],
    correctAnswer: 0,
    didYouKnow: 'Hội xuân núi Bà Đen diễn ra suốt tháng Giêng âm lịch thu hút hàng triệu lữ khách hành hương cầu an đầu năm.',
    citation: 'Địa chí Văn hóa Tỉnh Tây Ninh (NXB Chính Trị Quốc Gia, 2017)',
    description: 'Vùng đất linh thiêng kết tinh giữa thắng cảnh non ngàn và kiến trúc tôn giáo dung hòa Đông Tây độc đáo.',
    culturalSignificance: 'Minh chứng cho tinh thần tự do tín ngưỡng, lòng bao dung và cởi mở của người dân phương Nam.',
    qrContent: 'https://lacviet.edu.vn/di-san/nui-ba-den'
  },
  // 12: Đồng Tháp - Ẩm thực & Phong tục
  {
    id: 'kn_dongthap',
    type: 'knowledge',
    province: 'Đồng Tháp',
    region: 'nam_bo',
    title: 'Xứ Sở Sen Hồng Tháp Mười',
    heritageName: 'Văn Hóa Sông Nước & Hệ Sinh Thái Tràm Chim',
    topic: 'cuisine',
    category: 'Ẩm thực & Văn hóa Sen',
    question: 'Câu ca dao truyền cảm hứng bất hủ nào gắn liền hình ảnh hoa sen thanh tao với mảnh đất Tháp Mười?',
    options: [
      '"Tháp Mười đẹp nhất bông sen - Việt Nam đẹp nhất có tên Bác Hồ"',
      '"Gió đưa cành trúc la đà - Tiếng chuông Trấn Vũ canh gà Thọ Xương"',
      '"Thấy dừa thì nhớ Bến Tre - Thấy bông sen nở nhớ về Tháp Mười"',
      '"Cần Thơ gạo trắng nước trong - Ai đi đến đó lòng không muốn về"'
    ],
    correctAnswer: 0,
    didYouKnow: 'Đồng Tháp đã xác lập kỷ lục thế giới về 200 món ăn truyền thống được chế biến từ mọi bộ phận của cây sen.',
    citation: 'Văn hóa Ẩm thực Nam Bộ (Viện Văn hóa Nghệ thuật Quốc gia, 2019, Tr. 88)',
    description: 'Cánh đồng sen bạt ngàn ngát hương cùng làng hoa Sa Đéc bên dòng sông Tiền trù phú.',
    culturalSignificance: 'Hoa sen tượng trưng cho khí chất thanh cao, kiên cường vượt khó vươn lên của tâm hồn người Việt.',
    qrContent: 'https://lacviet.edu.vn/di-san/dong-thap-sen'
  }
];

// THẺ THỬ THÁCH (8 Ô Thử thách: Trắc nghiệm khó, Hành động, Kể nhanh - Có topic để đối chiếu Bí kíp)
export const CHALLENGE_CARDS: ChallengeCard[] = [
  // 1: Quảng Ninh - Lịch sử (Quiz khó)
  {
    id: 'ch_quangninh',
    type: 'challenge',
    province: 'Quảng Ninh',
    region: 'bac_bo',
    title: 'Kỳ Quan Thiên Nhiên & Chiến Thắng Bạch Đằng',
    topic: 'history',
    challengeType: 'quiz',
    question: 'Bãi cọc Bạch Đằng lịch sử trên sông Bạch Đằng (Quảng Ninh) đã 3 lần nhấn chìm chiến thuyền quân xâm lược phương Bắc vào những năm nào?',
    options: [
      'Năm 938 (Ngô Quyền), 981 (Lê Hoàn), và 1288 (Trần Hưng Đạo)',
      'Năm 1010, 1075, và 1427',
      'Năm 40 (Hai Bà Trưng), 542 (Lý Bí), 1789 (Quang Trung)',
      'Năm 1258, 1285, và 1288'
    ],
    correctAnswer: 0,
    explanation: 'Chiến thuật cắm cọc gỗ bịt sắt vát nhọn dưới lòng sông lợi dụng quy luật thủy triều là đỉnh cao nghệ thuật quân sự thủy chiến Đại Việt.',
    didYouKnow: 'Các di tích bãi cọc Yên Giang và Đồng Má Ngựa tại thị xã Quảng Yên vẫn còn giữ nguyên vẹn các thân cọc gỗ lim nghìn năm tuổi dưới bùn.',
    citation: 'Bảo tàng Lịch sử Quốc gia Việt Nam (Chuyên khảo Chiến thắng Bạch Đằng, 2018)',
    rewardArtifact: 'Ngọc Rồng Hạ Long',
    isTreasureReward: true,
    relatedKnowledgeKeyword: 'Bạch Đằng',
    timeLimitSeconds: 20
  },
  // 2: Thái Nguyên - Ẩm thực (Kể nhanh)
  {
    id: 'ch_thainguyen',
    type: 'challenge',
    province: 'Thái Nguyên',
    region: 'bac_bo',
    title: 'Đệ Nhất Danh Trà Tân Cương',
    topic: 'cuisine',
    challengeType: 'speed_naming',
    question: 'Kể đúng tên 3 đặc sản hoặc phẩm trà nổi tiếng của xứ chè Thái Nguyên trong vòng 20 giây!',
    options: [
      'Trà Đinh, Trà Móc Câu, Trà Nõn Tôm (hoặc Bánh chưng Bờ Đậu, Cơm lam Định Hóa)',
      'Trà Sữa Trân Châu, Trà Đào Cam Sả, Trà Tắc',
      'Cà phê Culi, Trà Ô Long Đà Lạt, Rượu Cần',
      'Chè Lam Thạch Thất, Bánh Cáy Thái Bình, Kẹo Cu Đơ'
    ],
    correctAnswer: 0,
    actionPrompt: 'Người chơi đọc to 3 tên đặc sản Thái Nguyên trước sự chứng kiến và biểu quyết của cả bàn chơi!',
    explanation: 'Trà Tân Cương Thái Nguyên nức tiếng với búp trà Đinh thượng hạng, hương cốm non tự nhiên quyến rũ, vị tiền chát hậu ngọt đượm đà.',
    didYouKnow: 'Để sao được một mẻ chè móc câu đạt chuẩn, nghệ nhân trà phải dùng tay trần cảm nhận nhiệt độ chảo gang suốt hàng giờ.',
    citation: 'Không Gian Văn Hóa Trà Thái Nguyên (Sở KH&CN Thái Nguyên, 2021)',
    rewardArtifact: 'Hộp Trà Móc Câu Tân Cương',
    isTreasureReward: false,
    relatedKnowledgeKeyword: 'Trà Thái Nguyên',
    timeLimitSeconds: 20
  },
  // 3: Phú Thọ - Phong tục (Hành động)
  {
    id: 'ch_phutho',
    type: 'challenge',
    province: 'Phú Thọ',
    region: 'bac_bo',
    title: 'Hát Xoan Đất Tổ & Lời Dặn Tiền Nhân',
    topic: 'custom',
    challengeType: 'action',
    actionPrompt: 'Hãy đứng lên đọc to dõng dạc câu ca dao Giỗ Tổ Hùng Vương hoặc làm động tác múa Hát Xoan chào bàn chơi!',
    question: 'Câu ca dao ngàn đời nhắc nhở người con đất Việt hướng về ngày Giỗ Tổ mùng 10 tháng 3 là gì?',
    options: [
      '"Dù ai đi ngược về xuôi - Nhớ ngày Giỗ Tổ mùng mười tháng ba"',
      '"Bầu ơi thương lấy bí cùng - Tuy rằng khác giống nhưng chung một giàn"',
      '"Nhiễu điều phủ lấy giá gương - Người trong một nước phải thương nhau cùng"',
      '"Con người có tổ có tông - Như cây có cội như sông có nguồn"'
    ],
    correctAnswer: 0,
    explanation: 'Giỗ Tổ Hùng Vương mùng 10 tháng 3 âm lịch đã trở thành Quốc lễ thiêng liêng và Tín ngưỡng thờ cúng Hùng Vương được UNESCO công nhận là di sản văn hóa phi vật thể của nhân loại.',
    didYouKnow: 'Hát Xoan là hình thức dân ca nghi lễ thờ thần có từ thời các vua Hùng, từng là di sản cần bảo vệ khẩn cấp trước khi được hồi sinh ngoạn mục.',
    citation: 'Hồ sơ Di sản UNESCO: Tín ngưỡng Thờ cúng Hùng Vương (2012)',
    rewardArtifact: 'Trống Đồng Hùng Vương',
    isTreasureReward: true,
    relatedKnowledgeKeyword: 'Hùng Vương',
    timeLimitSeconds: 30
  },
  // 4: Nghệ An - Nghệ thuật (Hành động / Ca dao)
  {
    id: 'ch_nghean',
    type: 'challenge',
    province: 'Nghệ An',
    region: 'trung_bo',
    title: 'Dân Ca Ví Giặm Nghệ Tĩnh',
    topic: 'art',
    challengeType: 'action',
    actionPrompt: 'Hãy hát thử 1 câu Ví Giặm hoặc diễn tả bằng cử chỉ hình thể câu dân ca "Đi mô cũng nhớ về Hà Tĩnh / Nhớ núi Hồng Lĩnh nhớ dòng sông Lam"!',
    question: 'Dân ca Ví, Giặm Nghệ Tĩnh được UNESCO vinh danh là Di sản văn hóa phi vật thể đại diện của nhân loại vào năm nào?',
    options: [
      'Năm 2014',
      'Năm 2005',
      'Năm 2018',
      'Năm 2023'
    ],
    correctAnswer: 0,
    explanation: 'Ví, Giặm là hai lối hát dân ca gắn liền với sinh hoạt lao động dệt vải, chèo đò, cấy lúa của nhân dân đôi bờ sông Lam núi Hồng.',
    didYouKnow: 'Các nghệ nhân dân ca ví giặm không cần nhạc cụ đệm mà dùng chính thanh âm trầm bổng của chất giọng xứ Nghệ mộc mạc.',
    citation: 'Viện Âm nhạc Quốc gia Việt Nam (Tư liệu Dân ca Ví Giặm Xứ Nghệ, 2014)',
    rewardArtifact: 'Đàn Đáy Xứ Nghệ',
    isTreasureReward: false,
    relatedKnowledgeKeyword: 'Ví Giặm',
    timeLimitSeconds: 35
  },
  // 5: Quảng Ngãi - Lịch sử (Quiz khó)
  {
    id: 'ch_quangngai',
    type: 'challenge',
    province: 'Quảng Ngãi',
    region: 'trung_bo',
    title: 'Lễ Khao Lề Thế Lính Hoàng Sa Đảo Lý Sơn',
    topic: 'history',
    challengeType: 'quiz',
    question: 'Trong Lễ Khao lề thế lính Hoàng Sa trên đảo Lý Sơn, vật phẩm nào tượng trưng cho linh hồn người lính biển được thả trôi ra đại dương?',
    options: [
      'Những chiếc thuyền câu bằng gỗ dâu chở hình nhân người lính bằng bột gạo',
      'Những chiếc bè chuối cắm nến thơm',
      'Một bọc hạt giống cây bàng vuông',
      'Một chiếc trống đồng thu nhỏ'
    ],
    correctAnswer: 0,
    explanation: 'Hình nhân giả thế mạng thả trôi trên thuyền câu gỗ dâu nhằm cầu mong sóng gió đại dương buông tha và đưa linh hồn những người lính bình an trở về.',
    didYouKnow: 'Nghi lễ này được các dòng họ trên đảo Lý Sơn tổ chức liên tục từ thế kỷ 17 cho tới tận ngày nay vào tiết thanh minh.',
    citation: 'Di sản Văn hóa Phi vật thể Quốc gia: Lễ Khao lề thế lính Hoàng Sa (Quyết định số 776/QĐ-BVHTTDL)',
    rewardArtifact: 'Hải Thuyền Hoàng Sa',
    isTreasureReward: true,
    relatedKnowledgeKeyword: 'Lý Sơn Hoàng Sa',
    timeLimitSeconds: 20
  },
  // 6: Lâm Đồng - Nghệ thuật (Hành động)
  {
    id: 'ch_lamdong',
    type: 'challenge',
    province: 'Lâm Đồng',
    region: 'trung_bo',
    title: 'Huyền Thoại Chàng K’lang & Nàng H’biang',
    topic: 'art',
    challengeType: 'action',
    actionPrompt: 'Dùng cử chỉ hình thể (không nói thành lời) diễn tả khí hậu se lạnh sương mù Đà Lạt hoặc đóa hoa dã quỳ trong 25 giây cho bàn chơi đoán!',
    question: 'Hai đỉnh núi kề nhau cao sừng sững trên cao nguyên Lâm Viên biểu tượng cho thiên tình sử thiêng liêng mang tên gì?',
    options: [
      'Núi Langbiang (Núi Ông và Núi Bà)',
      'Núi Bà Đen',
      'Đỉnh Fansipan',
      'Núi Bạch Mã'
    ],
    correctAnswer: 0,
    explanation: 'Chàng K’lang tộc Lát và nàng H’biang tộc Chil đã lấy cái chết để hóa giải mối thù truyền kiếp giữa hai bộ tộc Tây Nguyên.',
    didYouKnow: 'Tên gọi Langbiang chính là sự ghép nối thiêng liêng giữa tên chàng K’lang và nàng H’biang.',
    citation: 'Kho tàng Sử thi và Truyền thuyết Tây Nguyên (Viện Nghiên cứu Văn hóa, 2010)',
    rewardArtifact: 'Hoa Dã Quỳ Cao Nguyên',
    isTreasureReward: false,
    relatedKnowledgeKeyword: 'Langbiang',
    timeLimitSeconds: 25
  },
  // 7: Vĩnh Long - Nghệ thuật & Lịch sử (Quiz khó)
  {
    id: 'ch_vinhlong',
    type: 'challenge',
    province: 'Vĩnh Long',
    region: 'nam_bo',
    title: 'Vương Quốc Gốm Đỏ Mang Thít',
    topic: 'art',
    challengeType: 'quiz',
    question: 'Di sản đương đại nổi tiếng của Vĩnh Long với hàng ngàn lò gạch nung hình vòm cung soi bóng kênh rạch được mệnh danh là gì?',
    options: [
      '"Vương quốc Đỏ Mang Thít"',
      '"Gốm Bát Tràng Miền Tây"',
      '"Làng Gốm Chu Đậu Phương Nam"',
      '"Thủ phủ Đất Nung Sài Gòn"'
    ],
    correctAnswer: 0,
    explanation: 'Quần thể lò nung Mang Thít trải dài hơn 30km dọc sông Cổ Chiên và rạch Thầy Cai là di sản kiến trúc sản xuất gốm đỏ độc nhất vô nhị ở Đông Nam Á.',
    didYouKnow: 'Đất sét phù sa trầm tích mịn màng của dòng sông Tiền khi nung ở nhiệt độ cao sẽ cho ra màu đỏ cam hồng rực đặc trưng.',
    citation: 'Đề án Di sản Đương đại Mang Thít (UBND Tỉnh Vĩnh Long, 2020)',
    rewardArtifact: 'Bình Gốm Đỏ Mang Thít',
    isTreasureReward: true,
    relatedKnowledgeKeyword: 'Gốm Mang Thít',
    timeLimitSeconds: 20
  },
  // 8: Cà Mau - Lịch sử (Quiz khó)
  {
    id: 'ch_camau',
    type: 'challenge',
    province: 'Cà Mau',
    region: 'nam_bo',
    title: 'Mốc Tọa Độ Quốc Gia Đất Mũi',
    topic: 'history',
    challengeType: 'quiz',
    question: 'Cột mốc tọa độ quốc gia đặt tại Mũi Cà Mau - điểm cực Nam thiêng liêng trên đất liền của Tổ quốc Việt Nam mang số hiệu nào?',
    options: [
      'GPS 0001',
      'VN 2026',
      'KM 0',
      'CỘT MỐC 92'
    ],
    correctAnswer: 0,
    explanation: 'Cột mốc GPS 0001 tại Đất Mũi Cà Mau là niềm tự hào của mỗi người dân Việt Nam, nơi "đất nở ra và rừng biết đi" nhờ cây đước phù sa.',
    didYouKnow: 'Cà Mau là nơi duy nhất trên đất liền Việt Nam có thể ngắm mặt trời mọc ở bờ biển phía Đông và lặn ở bờ biển phía Tây.',
    citation: 'Cục Đo đạc, Bản đồ và Thông tin địa lý Việt Nam (Bộ TN&MT, 2016)',
    rewardArtifact: 'Tượng Đài Con Thuyền Đất Mũi',
    isTreasureReward: true,
    relatedKnowledgeKeyword: 'Cà Mau GPS 0001',
    timeLimitSeconds: 20
  }
];

// THẺ TÀI NGUYÊN (Chuẩn 4 loại & Tỷ lệ ra: Lá chắn 30%, Ngựa trạm 30%, Nỏ thần 22%, Cột mốc 18%)
export const RESOURCE_CARDS: ResourceCard[] = [
  {
    id: 'res_shield_1',
    type: 'resource',
    name: 'Lá Chắn',
    category: 'shield',
    ratePercent: 30,
    timing: 'Kích hoạt khi bị đối thủ chỉ định làm mục tiêu',
    description: 'Tấm lá chắn bảo hộ được rèn đúc từ sức mạnh đoàn kết cộng đồng.',
    effect: 'Chặn 1 lần bị đối thủ cướp kỷ vật hoặc bị phong ấn.'
  },
  {
    id: 'res_steed_1',
    type: 'resource',
    name: 'Ngựa Trạm',
    category: 'steed',
    ratePercent: 30,
    timing: 'Kích hoạt ngay sau khi gieo xúc xắc ở Bước 2',
    description: 'Chiến mã trạm thư dũng mãnh trên đường thiên lý Bắc Nam.',
    effect: 'Đổ lại xúc xắc 1 lần và chọn 1 trong 2 kết quả đổ.'
  },
  {
    id: 'res_crossbow_1',
    type: 'resource',
    name: 'Nỏ Thần',
    category: 'crossbow',
    ratePercent: 22,
    timing: 'Kích hoạt ở Bước 1 (Chuẩn bị) trong lượt của mình',
    description: 'Bảo khí nỏ thần An Dương Vương bắn trăm phát trúng trăm.',
    effect: 'Lấy 1 kỷ vật thường trong Tay nải đối thủ trong phạm vi ≤ 3 ô.'
  },
  {
    id: 'res_milestone_1',
    type: 'resource',
    name: 'Cột Mốc',
    category: 'milestone',
    ratePercent: 18,
    timing: 'Kích hoạt ở Bước 1 (Chuẩn bị) trong lượt của mình',
    description: 'Cờ cột mốc chủ quyền cắm ranh giới địa bàn giao thương.',
    effect: 'Chiếm đóng ô tỉnh đang đứng và đặt cờ Cột mốc vật lý (thu phí 1 thẻ bài khi đối thủ dừng chân).'
  }
];

// THẺ MAY MẮN (10 Loại chuẩn xác theo Bảng 9.3 Lạc Việt - Tổng tỷ lệ = 100%)
export const FORTUNE_CARDS: FortuneCard[] = [
  // 1. Hội thi (24%) - Nhóm Hội thi
  {
    id: 'for_contest',
    type: 'fortune',
    name: 'Hội Thi Tranh Tài',
    group: 'contest',
    eventType: 'contest',
    ratePercent: 24,
    description: 'Trống hội giòn giã vang lên, cả bàn chơi cùng bước vào màn tranh tài sôi nổi!',
    effectText: 'Tự động kích hoạt trò chơi tập thể; người thắng cuộc nhận ngay 01 kỷ vật của ô tỉnh đang đứng.'
  },
  // 2. Lễ hội mùa màng (12%) - Sự kiện tốt
  {
    id: 'for_harvest',
    type: 'fortune',
    name: 'Lễ Hội Mùa Màng',
    group: 'good_event',
    eventType: 'harvest',
    ratePercent: 12,
    description: 'Mưa thuận gió hòa, mùa màng bội thu tiếp thêm nguồn sinh khí dồi dào trên đường đi.',
    effectText: 'Đổ xúc xắc thêm 1 lần, di chuyển và làm nhiệm vụ tại ô mới.',
    extraTurn: true
  },
  // 3. Lộc hội (8%) - Sự kiện tốt
  {
    id: 'for_gift',
    type: 'fortune',
    name: 'Lộc Hội Đầu Xuân',
    group: 'good_event',
    eventType: 'fortune_gift',
    ratePercent: 8,
    description: 'Lộc biếc mùa xuân trao tay lữ khách may mắn.',
    effectText: 'Nhận ngay 01 kỷ vật của ô tỉnh đang đứng mà không cần làm nhiệm vụ.'
  },
  // 4. Thuận buồm xuôi gió (8%) - Sự kiện tốt
  {
    id: 'for_tailwind',
    type: 'fortune',
    name: 'Thuận Buồm Xuôi Gió',
    group: 'good_event',
    eventType: 'tailwind',
    ratePercent: 8,
    description: 'Ngọn gió đông nam thổi căng cánh buồm đưa Token lướt nhanh về trạm dừng chân kế tiếp.',
    effectText: 'Di chuyển thẳng Token đến Ô góc kế tiếp và nhận trọn vẹn đặc quyền tại Ô góc đó.'
  },
  // 5. Đạo tặc (8%) - Sự kiện tốt
  {
    id: 'for_bandit',
    type: 'fortune',
    name: 'Đạo Tặc Rình Rập',
    group: 'good_event',
    eventType: 'bandit',
    ratePercent: 8,
    description: 'Thừa lúc đối thủ sơ hở trên bến chợ sầm uất.',
    effectText: 'Lấy ngẫu nhiên 01 thẻ Tài nguyên từ túi đồ người ngồi bên trái hoặc bên phải.'
  },
  // 6. Lá lành đùm lá rách (4%) - Sự kiện chung
  {
    id: 'for_mutual_support',
    type: 'fortune',
    name: 'Lá Lành Đùm Lá Rách',
    group: 'general_event',
    eventType: 'mutual_support',
    ratePercent: 4,
    description: 'Truyền thống tương thân tương ái, chia ngọt sẻ bùi cùng nhau vững bước trên hành trình di sản.',
    effectText: 'Người có nhiều kỷ vật nhất bàn phải chuyển 01 thẻ bài cho người ít kỷ vật nhất.'
  },
  // 7. Bão lũ (12%) - Sự kiện xấu
  {
    id: 'for_storm',
    type: 'fortune',
    name: 'Bão Lũ Thiên Tai',
    group: 'bad_event',
    eventType: 'storm',
    ratePercent: 12,
    description: 'Nước dâng lũ lớn cản trở bước chân lữ hành.',
    effectText: 'Lùi Token 2 ô và không làm nhiệm vụ tại ô mới.',
    moveDelta: -2
  },
  // 8. Mất mùa (8%) - Sự kiện xấu
  {
    id: 'for_crop_loss',
    type: 'fortune',
    name: 'Mất Mùa Giáp Hạt',
    group: 'bad_event',
    eventType: 'crop_loss',
    ratePercent: 8,
    description: 'Thời tiết thất thường khiến vụ mùa giáp hạt hao tổn dự trữ.',
    effectText: 'Bắt buộc bỏ 01 thẻ bài bất kỳ trong túi đồ số.'
  },
  // 9. Vô hiệu (8%) - Quyền năng
  {
    id: 'for_negate',
    type: 'fortune',
    name: 'Thẻ Vô Hiệu',
    group: 'power',
    eventType: 'negate',
    ratePercent: 8,
    description: 'Trí thông minh và sự tỉnh táo giúp hóa giải mọi mưu toan.',
    effectText: 'Lưu vào túi đồ; Hủy 1 thẻ bài hoặc Kỹ năng Token đối thủ vừa dùng.'
  },
  // 10. Phong ấn (8%) - Quyền năng
  {
    id: 'for_seal',
    type: 'fortune',
    name: 'Thẻ Phong Ấn',
    group: 'power',
    eventType: 'seal',
    ratePercent: 8,
    description: 'Bùa chú cổ xưa khóa chặt sức mạnh kỷ vật trong tay nải.',
    effectText: 'Lưu vào túi đồ; Khóa 1 kỷ vật trong Tay nải của đối thủ (chỉ mở khi người đó đến Ô góc).'
  }
];

// Hàm bốc ngẫu nhiên thẻ Tài nguyên theo tỷ lệ chuẩn
export function drawResourceCard(exploreMode = false): ResourceCard {
  return copyCard(weightedDraw(RESOURCE_CARDS.filter(card => !exploreMode || card.category !== 'crossbow')));
}
export function drawFortuneCard(exploreMode = false): FortuneCard {
  return copyCard(weightedDraw(FORTUNE_CARDS.filter(card => !exploreMode || card.eventType !== 'seal')));
}
