import { BoardSpace } from '../types/game';

export const BOARD_SPACES: BoardSpace[] = [
  // 0: START
  {
    index: 0,
    name: 'START',
    enName: 'START',
    type: 'start',
    region: 'special',
    subtitle: 'Khởi Hành Di Sản',
    description: 'Điểm xuất phát và trạm thu hồi Kỷ vật văn hóa bị phạt. Vượt qua đây, trả lời 2 câu hỏi để nhận Thẻ May Mắn và chiếm lại tối đa 1 kỷ vật phạt!',
    heritageHighlight: 'Cột mốc số 0 - Hành trình mở cõi văn hóa Việt Nam',
    iconName: 'flag'
  },
  // 1: Hà Nội - Kiến thức
  {
    index: 1,
    name: 'Hà Nội',
    enName: 'Hanoi',
    type: 'knowledge',
    region: 'bac_bo',
    province: 'Hà Nội',
    subtitle: 'Thăng Long Ngàn Năm',
    description: 'Thủ đô ngàn năm văn hiến, trung tâm chính trị, văn hóa với 36 phố phường và Hoàng thành Thăng Long di sản thế giới.',
    heritageHighlight: 'Hoàng thành Thăng Long & Văn Miếu Quốc Tử Giám',
    iconName: 'book-open'
  },
  // 2: Bắc Ninh - Lễ hội
  {
    index: 2,
    name: 'Bắc Ninh',
    enName: 'Bac Ninh',
    type: 'festival',
    region: 'bac_bo',
    province: 'Bắc Ninh',
    subtitle: 'Kinh Bắc Quan Họ',
    description: 'Vùng đất của những làn điệu Dân ca Quan họ mượt mà, đậm đà nghĩa tình cùng Hội Lim tưng bừng đầu xuân.',
    heritageHighlight: 'Dân ca Quan họ Bắc Ninh (Di sản UNESCO)',
    iconName: 'sparkles'
  },
  // 3: Hưng Yên - Kiến thức
  {
    index: 3,
    name: 'Hưng Yên',
    enName: 'Hung Yen',
    type: 'knowledge',
    region: 'bac_bo',
    province: 'Hưng Yên',
    subtitle: 'Phố Hiến Phồn Hoa',
    description: 'Thương cảng cổ nổi tiếng thời Lê - Trịnh: "Thứ nhất Kinh kỳ, thứ nhì Phố Hiến", nơi giao lưu quốc tế sầm uất xưa.',
    heritageHighlight: 'Quần thể di tích Phố Hiến & Đặc sản Nhãn lồng',
    iconName: 'book-open'
  },
  // 4: Hải Phòng - Thị trường
  {
    index: 4,
    name: 'Hải Phòng',
    enName: 'Hai Phong',
    type: 'market',
    region: 'bac_bo',
    province: 'Hải Phòng',
    subtitle: 'Đất Cảng Hoa Phượng Đỏ',
    description: 'Thành phố cảng cửa ngõ miền Bắc, nơi tụ hội thương thuyền và các sản vật biển trù phú.',
    heritageHighlight: 'Bến Nghiêng - Bến K15 đường Hồ Chí Minh trên biển',
    iconName: 'shopping-bag'
  },
  // 5: Quảng Ninh - Thử thách
  {
    index: 5,
    name: 'Quảng Ninh',
    enName: 'Quang Ninh',
    type: 'challenge',
    region: 'bac_bo',
    province: 'Quảng Ninh',
    subtitle: 'Kỳ Quan Thiên Nhiên',
    description: 'Kỳ quan thiên nhiên thế giới Vịnh Hạ Long với hàng ngàn đảo đá vôi kỳ vĩ và di tích Yên Tử linh thiêng.',
    heritageHighlight: 'Vịnh Hạ Long & Non thiêng Yên Tử',
    iconName: 'swords'
  },
  // 6: Lạng Sơn - Kiến thức
  {
    index: 6,
    name: 'Lạng Sơn',
    enName: 'Lang Son',
    type: 'knowledge',
    region: 'bac_bo',
    province: 'Lạng Sơn',
    subtitle: 'Ải Bắc Trấn Ải',
    description: 'Vùng biên cương hào hùng với Ải Chi Lăng, Động Tam Thanh, Nàng Tô Thị biểu tượng lòng thủy chung son sắt.',
    heritageHighlight: 'Ải Chi Lăng & Chùa Tam Thanh',
    iconName: 'book-open'
  },
  // 7: Cao Bằng - Lễ hội
  {
    index: 7,
    name: 'Cao Bằng',
    enName: 'Cao Bang',
    type: 'festival',
    region: 'bac_bo',
    province: 'Cao Bằng',
    subtitle: 'Cội Nguồn Cách Mạng',
    description: 'Khu di tích Pác Bó - Suối Lê Nin và Thác Bản Giốc - thác nước tự nhiên lớn nhất Đông Nam Á cùng Lễ hội Lồng Tồng rộn rã.',
    heritageHighlight: 'Thác Bản Giốc & Hang Pác Bó',
    iconName: 'sparkles'
  },
  // 8: Tuyên Quang - Thị trường
  {
    index: 8,
    name: 'Tuyên Quang',
    enName: 'Tuyen Quang',
    type: 'market',
    region: 'bac_bo',
    province: 'Tuyên Quang',
    subtitle: 'Thủ Đô Kháng Chiến',
    description: 'Thủ đô Khu giải phóng Tân Trào và Lễ hội Trung thu Tuyên Quang với những mô hình đèn lồng khổng lồ kỷ lục.',
    heritageHighlight: 'Khu di tích Quốc gia đặc biệt Tân Trào',
    iconName: 'shopping-bag'
  },
  // 9: Thái Nguyên - Thử thách
  {
    index: 9,
    name: 'Thái Nguyên',
    enName: 'Thai Nguyen',
    type: 'challenge',
    region: 'bac_bo',
    province: 'Thái Nguyên',
    subtitle: 'Đệ Nhất Danh Trà',
    description: 'Cái nôi trà Việt với đồi chè Tân Cương xanh ngút ngàn và văn hóa thưởng trà tinh tế của người Việt cổ.',
    heritageHighlight: 'Đồi chè Tân Cương & Không gian văn hóa Trà',
    iconName: 'swords'
  },

  // 10: TRẠM DỪNG CHÂN BẮC BỘ (Corner)
  {
    index: 10,
    name: 'BẮC BỘ',
    enName: 'Northern Station',
    type: 'corner',
    region: 'bac_bo',
    subtitle: 'Trạm Dừng Chân Miền Bắc',
    description: 'Trạm dừng chân chiến lược Bắc Bộ. Tại đây người chơi được chọn: Rút Thẻ May Mắn, Rút Thẻ Tài Nguyên, hoặc Hồi phục kỹ năng Token; gửi Kỷ vật an toàn.',
    heritageHighlight: 'Cái nôi văn minh sông Hồng & Văn hóa Đông Sơn',
    iconName: 'landmark'
  },

  // 11: Lào Cai - Kiến thức
  {
    index: 11,
    name: 'Lào Cai',
    enName: 'Lao Cai',
    type: 'knowledge',
    region: 'bac_bo',
    province: 'Lào Cai',
    subtitle: 'Nóc Nhà Đông Dương',
    description: 'Đỉnh thiêng Fansipan 3.143m và ruộng bậc thang Sa Pa lọt top đẹp nhất hành tinh, mang đậm sắc màu Tây Bắc.',
    heritageHighlight: 'Ruộng bậc thang Sa Pa & Đỉnh Fansipan',
    iconName: 'book-open'
  },
  // 12: Lai Châu - Lễ hội
  {
    index: 12,
    name: 'Lai Châu',
    enName: 'Lai Chau',
    type: 'festival',
    region: 'bac_bo',
    province: 'Lai Châu',
    subtitle: 'Hùng Vĩ Ô Quy Hồ',
    description: 'Tứ đại đỉnh đèo Ô Quy Hồ quanh năm mây phủ, Lễ hội Té nước của người Thái trắng và Lễ hội Hoa Ban rực rỡ sắc xuân.',
    heritageHighlight: 'Đèo Ô Quy Hồ & Bản Sin Suối Hồ',
    iconName: 'sparkles'
  },
  // 13: Điện Biên - Kiến thức
  {
    index: 13,
    name: 'Điện Biên',
    enName: 'Dien Bien',
    type: 'knowledge',
    region: 'bac_bo',
    province: 'Điện Biên',
    subtitle: 'Lừng Lẫy Năm Châu',
    description: 'Chiến trường Điện Biên Phủ "Lừng lẫy năm châu, chấn động địa cầu", gắn liền với Đồi A1 và hầm tướng De Castries.',
    heritageHighlight: 'Quần thể Chiến trường Điện Biên Phủ',
    iconName: 'book-open'
  },
  // 14: Sơn La - Thị trường
  {
    index: 14,
    name: 'Sơn La',
    enName: 'Son La',
    type: 'market',
    region: 'bac_bo',
    province: 'Sơn La',
    subtitle: 'Thảo Nguyên Mộc Châu',
    description: 'Vựa nông sản Tây Bắc trù phú với thung lũng mận Nà Ka, Thủy điện Sơn La lớn nhất Đông Nam Á và chợ phiên thảo nguyên.',
    heritageHighlight: 'Cao nguyên Mộc Châu & Thủy điện Sơn La',
    iconName: 'shopping-bag'
  },
  // 15: Phú Thọ - Thử thách
  {
    index: 15,
    name: 'Phú Thọ',
    enName: 'Phu Tho',
    type: 'challenge',
    region: 'bac_bo',
    province: 'Phú Thọ',
    subtitle: 'Đất Tổ Hùng Vương',
    description: '"Dù ai đi ngược về xuôi - Nhớ ngày Giỗ Tổ mùng mười tháng ba". Nơi khai sinh bờ cõi non sông Lạc Long Quân - Âu Cơ.',
    heritageHighlight: 'Tín ngưỡng thờ cúng Hùng Vương & Hát Xoan Phú Thọ',
    iconName: 'swords'
  },
  // 16: Ninh Bình - Kiến thức
  {
    index: 16,
    name: 'Ninh Bình',
    enName: 'Ninh Binh',
    type: 'knowledge',
    region: 'bac_bo',
    province: 'Ninh Bình',
    subtitle: 'Cố Đô Hoa Lư',
    description: 'Kinh đô đầu tiên của nhà nước phong kiến Đại Cồ Việt, Di sản hỗn hợp Văn hóa & Thiên nhiên thế giới Tràng An.',
    heritageHighlight: 'Quần thể danh thắng Tràng An & Cố đô Hoa Lư',
    iconName: 'book-open'
  },
  // 17: Phiên Chợ Quê - Thị trường
  {
    index: 17,
    name: 'Chợ Quê Việt',
    enName: 'Rural Market',
    type: 'market',
    region: 'bac_bo',
    subtitle: 'Giao Thương Văn Hóa',
    description: 'Ô thị trường đặc biệt tái hiện cảnh chợ phiên dân gian Việt Nam. Người chơi được bốc thẻ Tài Nguyên và có thể giao thương thẻ.',
    heritageHighlight: 'Không gian Văn hóa Chợ phiên truyền thống Việt',
    iconName: 'shopping-bag'
  },
  // 18: Thanh Hóa - Thị trường
  {
    index: 18,
    name: 'Thanh Hóa',
    enName: 'Thanh Hoa',
    type: 'market',
    region: 'trung_bo',
    province: 'Thanh Hóa',
    subtitle: 'Đất Vua Đất Chúa',
    description: 'Thành nhà Hồ xây dựng bằng đá độc nhất vô nhị, khu di tích Lam Kinh quê hương người anh hùng Lê Lợi.',
    heritageHighlight: 'Di sản thế giới Di tích Thành nhà Hồ & Lam Kinh',
    iconName: 'shopping-bag'
  },
  // 19: Nghệ An - Thử thách
  {
    index: 19,
    name: 'Nghệ An',
    enName: 'Nghe An',
    type: 'challenge',
    region: 'trung_bo',
    province: 'Nghệ An',
    subtitle: 'Quê Bác Sen Hồng',
    description: 'Làng Sen quê Bác, dòng sông Lam thơ mộng với câu Dân ca Ví Giặm ngọt ngào sâu lắng làm lay động lòng người.',
    heritageHighlight: 'Khu di tích Kim Liên & Dân ca Ví, Giặm Nghệ Tĩnh',
    iconName: 'swords'
  },

  // 20: TRẠM DỪNG CHÂN TRUNG BỘ (Corner)
  {
    index: 20,
    name: 'TRUNG BỘ',
    enName: 'Central Station',
    type: 'corner',
    region: 'trung_bo',
    subtitle: 'Trạm Dừng Chân Miền Trung',
    description: 'Trạm dừng chân miền Trung nắng gió kiên cường. Người chơi chọn: Rút May Mắn, Rút Tài Nguyên, hồi phục Token, gửi Kỷ vật an toàn.',
    heritageHighlight: 'Con đường Di sản Miền Trung kết nối ngàn năm',
    iconName: 'landmark'
  },

  // 21: Hà Tĩnh - Kiến thức
  {
    index: 21,
    name: 'Hà Tĩnh',
    enName: 'Ha Tinh',
    type: 'knowledge',
    region: 'trung_bo',
    province: 'Hà Tĩnh',
    subtitle: 'Non Nước Hồng Lam',
    description: 'Núi Hồng sông La linh thiêng, quê hương Đại thi hào Nguyễn Du tác giả Truyện Kiều và địa danh huyền thoại Ngã ba Đồng Lộc.',
    heritageHighlight: 'Khu lưu niệm Đại thi hào Nguyễn Du & Ngã ba Đồng Lộc',
    iconName: 'book-open'
  },
  // 22: Quảng Trị - Lễ hội
  {
    index: 22,
    name: 'Quảng Trị',
    enName: 'Quang Tri',
    type: 'festival',
    region: 'trung_bo',
    province: 'Quảng Trị',
    subtitle: 'Đất Lửa Anh Hùng',
    description: 'Dòng sông Bến Hải, Cầu Hiền Lương lịch sử phân định hai miền một thời, và Lễ hội Vì Hòa bình lan tỏa thông điệp thiêng liêng.',
    heritageHighlight: 'Thành cổ Quảng Trị & Cụm di tích Đôi bờ Hiền Lương',
    iconName: 'sparkles'
  },
  // 23: Thừa Thiên Huế - Kiến thức
  {
    index: 23,
    name: 'Thừa Thiên Huế',
    enName: 'Hue City',
    type: 'knowledge',
    region: 'trung_bo',
    province: 'Huế',
    subtitle: 'Cố Đô Thơ Mộng',
    description: 'Cố đô của triều Nguyễn với Đại Nội nguy nga, dòng Hương giang lững lờ cùng Nhã nhạc Cung đình di sản kiệt tác nhân loại.',
    heritageHighlight: 'Quần thể Di tích Cố đô Huế & Nhã nhạc Cung đình',
    iconName: 'book-open'
  },
  // 24: Đà Nẵng - Thị trường
  {
    index: 24,
    name: 'Đà Nẵng',
    enName: 'Da Nang',
    type: 'market',
    region: 'trung_bo',
    province: 'Đà Nẵng',
    subtitle: 'Thành Phố Đáng Sống',
    description: 'Trung tâm kinh tế năng động miền Trung, nổi danh với Cầu Rồng phun lửa, danh thắng Ngũ Hành Sơn và Cầu Vàng Bà Nà Hills.',
    heritageHighlight: 'Cầu Rồng, Ngũ Hành Sơn & Bảo tàng Điêu khắc Chăm',
    iconName: 'shopping-bag'
  },
  // 25: Quảng Ngãi - Thử thách
  {
    index: 25,
    name: 'Quảng Ngãi',
    enName: 'Quang Ngai',
    type: 'challenge',
    region: 'trung_bo',
    province: 'Quảng Ngãi',
    subtitle: 'Vương Quốc Tỏi Lý Sơn',
    description: 'Đảo tiền tiêu Lý Sơn với trầm tích núi lửa hàng triệu năm, quê hương của Đội hùng binh Hoàng Sa kiên cường giữ biển trời tổ quốc.',
    heritageHighlight: 'Đảo Lý Sơn & Lễ khao lề thế lính Hoàng Sa',
    iconName: 'swords'
  },
  // 26: Gia Lai - Kiến thức
  {
    index: 26,
    name: 'Gia Lai',
    enName: 'Gia Lai',
    type: 'knowledge',
    region: 'trung_bo',
    province: 'Gia Lai',
    subtitle: 'Đôi Mắt Pleiku',
    description: 'Biển Hồ T’nưng thơ mộng "Đôi mắt Pleiku biển Hồ đầy", Không gian văn hóa Cồng chiêng Tây Nguyên rộn rã bên nhà Rông đại ngàn.',
    heritageHighlight: 'Biển Hồ T’nưng & Văn hóa Cồng chiêng Tây Nguyên',
    iconName: 'book-open'
  },
  // 27: Đắk Lắk - Lễ hội
  {
    index: 27,
    name: 'Đắk Lắk',
    enName: 'Dak Lak',
    type: 'festival',
    region: 'trung_bo',
    province: 'Đắk Lắk',
    subtitle: 'Thủ Phủ Cà Phê',
    description: 'Thủ phủ cà phê Buôn Ma Thuột nổi danh toàn cầu, Lễ hội đua voi Bản Đôn và những dòng thác Dray Nur, Dray Sáp huyền thoại.',
    heritageHighlight: 'Lễ hội Cà phê Buôn Ma Thuột & Làng Đôn',
    iconName: 'sparkles'
  },
  // 28: Khánh Hòa - Thị trường
  {
    index: 28,
    name: 'Khánh Hòa',
    enName: 'Khanh Hoa',
    type: 'market',
    region: 'trung_bo',
    province: 'Khánh Hòa',
    subtitle: 'Xứ Trầm Biển Yến',
    description: 'Thành phố biển Nha Trang vịnh đẹp thế giới, Tháp Bà Ponagar nghìn năm tuổi của nền văn minh Champa cổ kính.',
    heritageHighlight: 'Tháp Bà Ponagar & Nghề khai thác Yến sào',
    iconName: 'shopping-bag'
  },
  // 29: Lâm Đồng - Thử thách
  {
    index: 29,
    name: 'Lâm Đồng',
    enName: 'Lam Dong',
    type: 'challenge',
    region: 'trung_bo',
    province: 'Lâm Đồng',
    subtitle: 'Xứ Sở Sương Mù',
    description: 'Thành phố Đà Lạt mộng mơ, đỉnh núi huyền thoại Langbiang biểu tượng tình yêu chung thủy của chàng K’lang và nàng H’biang.',
    heritageHighlight: 'Cao nguyên Langbiang & Festival Hoa Đà Lạt',
    iconName: 'swords'
  },

  // 30: TRẠM DỪNG CHÂN NAM BỘ (Corner)
  {
    index: 30,
    name: 'NAM BỘ',
    enName: 'Southern Station',
    type: 'corner',
    region: 'nam_bo',
    subtitle: 'Trạm Dừng Chân Phương Nam',
    description: 'Trạm dừng chân phương Nam trù phú, sông nước mênh mông, con người hào sảng bao dung. Chọn rút May Mắn, Tài Nguyên hoặc hồi chiêu.',
    heritageHighlight: 'Văn minh sông nước Cửu Long & Hào khí Đồng Nai',
    iconName: 'landmark'
  },

  // 31: Đêm Lễ Hội - Lễ hội
  {
    index: 31,
    name: 'Đêm Hội Nam Bộ',
    enName: 'Southern Fest',
    type: 'festival',
    region: 'nam_bo',
    subtitle: 'Đờn Ca Tài Tử',
    description: 'Đêm hội ngân vang tiếng đàn kìm, đàn tranh của Đờn ca tài tử Nam Bộ di sản UNESCO, rộn ràng điệu múa lân sư rồng phương Nam.',
    heritageHighlight: 'Nghệ thuật Đờn ca tài tử Nam Bộ (UNESCO)',
    iconName: 'sparkles'
  },
  // 32: Đồng Nai - Lễ hội
  {
    index: 32,
    name: 'Đồng Nai',
    enName: 'Dong Nai',
    type: 'festival',
    region: 'nam_bo',
    province: 'Đồng Nai',
    subtitle: 'Rừng Xanh Cát Tiên',
    description: 'Vườn quốc gia Cát Tiên khu dự trữ sinh quyển thế giới, Văn miếu Trấn Biên - Văn miếu đầu tiên được xây dựng tại xứ Đàng Trong.',
    heritageHighlight: 'Văn miếu Trấn Biên & Vườn quốc gia Cát Tiên',
    iconName: 'sparkles'
  },
  // 33: Tây Ninh - Kiến thức
  {
    index: 33,
    name: 'Tây Ninh',
    enName: 'Tay Ninh',
    type: 'knowledge',
    region: 'nam_bo',
    province: 'Tây Ninh',
    subtitle: 'Nóc Nhà Nam Bộ',
    description: 'Đỉnh núi Bà Đen 986m cao nhất Nam Bộ, Tòa thánh Tây Ninh kiến trúc tôn giáo độc đáo giao thoa Đông Tây.',
    heritageHighlight: 'Quần thể Núi Bà Đen & Tòa thánh Cao Đài Tây Ninh',
    iconName: 'book-open'
  },
  // 34: TP. Hồ Chí Minh - Thị trường
  {
    index: 34,
    name: 'TP. Hồ Chí Minh',
    enName: 'Ho Chi Minh City',
    type: 'market',
    region: 'nam_bo',
    province: 'TP.HCM',
    subtitle: 'Hòn Ngọc Viễn Đông',
    description: 'Đầu tàu kinh tế sôi động bậc nhất cả nước, Bến Nhà Rồng nơi Bác Hồ ra đi tìm đường cứu nước, Chợ Bến Thành hoa lệ.',
    heritageHighlight: 'Bến Nhà Rồng, Chợ Bến Thành & Địa đạo Củ Chi',
    iconName: 'shopping-bag'
  },
  // 35: Vĩnh Long - Thử thách
  {
    index: 35,
    name: 'Vĩnh Long',
    enName: 'Vinh Long',
    type: 'challenge',
    region: 'nam_bo',
    province: 'Vĩnh Long',
    subtitle: 'Vương Quốc Gốm Đỏ',
    description: 'Làng gốm nung cổ Mang Thít di sản đương đại ngàn lò gạch soi bóng dòng kênh Thầy Cai, vùng đất địa linh nhân kiệt.',
    heritageHighlight: 'Di sản Làng gốm đỏ Mang Thít & Cù lao An Bình',
    iconName: 'swords'
  },
  // 36: Đồng Tháp - Kiến thức
  {
    index: 36,
    name: 'Đồng Tháp',
    enName: 'Dong Thap',
    type: 'knowledge',
    region: 'nam_bo',
    province: 'Đồng Tháp',
    subtitle: 'Đất Sen Hồng Mười',
    description: '"Tháp Mười đẹp nhất bông sen - Việt Nam đẹp nhất có tên Bác Hồ", Làng hoa Sa Đéc trăm năm rực rỡ và Vườn quốc gia Tràm Chim.',
    heritageHighlight: 'Làng hoa kiểng Sa Đéc & Vườn quốc gia Tràm Chim',
    iconName: 'book-open'
  },
  // 37: Cần Thơ - Lễ hội
  {
    index: 37,
    name: 'Cần Thơ',
    enName: 'Can Tho',
    type: 'festival',
    region: 'nam_bo',
    province: 'Cần Thơ',
    subtitle: 'Tây Đô Sông Nước',
    description: '"Cần Thơ gạo trắng nước trong - Ai đi đến đó lòng không muốn về", Chợ nổi Cái Răng tấp nập thuyền bè lúc rạng đông.',
    heritageHighlight: 'Văn hóa Chợ nổi Cái Răng & Bến Ninh Kiều',
    iconName: 'sparkles'
  },
  // 38: An Giang - Thị trường
  {
    index: 38,
    name: 'An Giang',
    enName: 'An Giang',
    type: 'market',
    region: 'nam_bo',
    province: 'An Giang',
    subtitle: 'Thất Sơn Bảy Núi',
    description: 'Lễ hội Vía Bà Chúa Xứ Núi Sam di sản văn hóa phi vật thể quốc gia, Rừng tràm Trà Sư xanh ngát cánh bèo bồng bềnh.',
    heritageHighlight: 'Miếu Bà Chúa Xứ Núi Sam & Rừng tràm Trà Sư',
    iconName: 'shopping-bag'
  },
  // 39: Cà Mau - Thử thách
  {
    index: 39,
    name: 'Cà Mau',
    enName: 'Ca Mau',
    type: 'challenge',
    region: 'nam_bo',
    province: 'Cà Mau',
    subtitle: 'Đất Mũi Cực Nam',
    description: 'Mốc tọa độ quốc gia GPS 0001 tại Đất Mũi, nơi ngắm mặt trời mọc ở biển Đông và lặn ở biển Tây, rừng đước ngập mặn U Minh Hạ.',
    heritageHighlight: 'Mũi Cà Mau & Khu dự trữ sinh quyển Rừng ngập mặn',
    iconName: 'swords'
  }
];

