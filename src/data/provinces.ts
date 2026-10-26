export interface ProvinceArtifacts {
  regular: [string, string];
  treasure: string;
}

export interface MarketQuiz {
  item: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marketHint: string;
}

export interface ProvinceInfo {
  id: string;
  name: string;
  region: 'bac_bo' | 'trung_bo' | 'nam_bo';
  regionName: string;
  tileType: 'Kiến thức' | 'Lễ hội' | 'Thị trường' | 'Thử thách';
  heritage: string;
  description: string;
  specialty: string;
  festivals: string[];
  artifacts: ProvinceArtifacts;
  marketQuiz: MarketQuiz;
  lat: number;
  lng: number;
  qrCodeUrl: string;
}

export const PROVINCES_DATA: ProvinceInfo[] = [
  // BẮC BỘ (15 địa phương)
  {
    id: 'hanoi',
    name: 'Hà Nội',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Kiến thức',
    heritage: 'Hoàng thành Thăng Long, Văn Miếu - Quốc Tử Giám, Chùa Một Cột',
    description: 'Thủ đô ngàn năm văn hiến, trung tâm chính trị, văn hóa của Việt Nam với 36 phố phường cổ kính rêu phong và truyền thống hiếu học bất khuất.',
    specialty: 'Phở Hà Nội, Bún chả, Cốm làng Vòng, Trà sen Tây Hồ',
    festivals: ['Lễ hội Gò Đống Đa', 'Hội chùa Hương', 'Lễ hội Cổ Loa'],
    artifacts: {
      regular: ['Bút Lông Văn Miếu', 'Tranh Hàng Trống'],
      treasure: 'Chiếu Dời Đô Bằng Vàng'
    },
    marketQuiz: {
      item: 'Cốm Làng Vòng tiến vua',
      question: 'Cốm Làng Vòng truyền thống được gói bằng loại lá gì để giữ trọn hương thơm?',
      options: ['Lá sen già', 'Lá chuối non', 'Lá dong xanh', 'Lá ổi tươi'],
      correctAnswer: 0,
      marketHint: 'Hương cốm quyện trong hương sen Tây Hồ tạo nên hồn thu Hà Nội.'
    },
    lat: 21.0285,
    lng: 105.8542,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/ha-noi'
  },
  {
    id: 'bacninh',
    name: 'Bắc Ninh',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Lễ hội',
    heritage: 'Dân ca Quan họ Bắc Ninh (UNESCO), Chùa Dâu, Đền Đô',
    description: 'Vùng đất địa linh nhân kiệt xứ Kinh Bắc, cội nguồn phát tích vương triều Lý hào hùng và cái nôi của các làn điệu Quan họ đằm thắm mượt mà.',
    specialty: 'Bánh phu thê Đình Bảng, Nem bùi Ninh Xá, Rượu làng Vân',
    festivals: ['Hội Lim', 'Hội Đền Đô', 'Hội Chùa Dâu'],
    artifacts: {
      regular: ['Nón Quai Thao Liền Chị', 'Tranh Đông Hồ Gà Lợn'],
      treasure: 'Bản Dập Sắc Phong Đền Đô'
    },
    marketQuiz: {
      item: 'Bánh Phu Thê Đình Bảng',
      question: 'Bánh phu thê Đình Bảng truyền thống tượng trưng cho điều gì trong hôn nhân?',
      options: ['Sự gắn kết thủy chung vợ chồng', 'Cầu chúc thi cử đỗ đạt', 'Mùa màng bội thu', 'Khát vọng trường thọ'],
      correctAnswer: 0,
      marketHint: 'Tên gọi "Phu thê" đã nói lên ý nghĩa son sắt của tình nghĩa lứa đôi.'
    },
    lat: 21.1861,
    lng: 106.0763,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/bac-ninh'
  },
  {
    id: 'hungyen',
    name: 'Hưng Yên',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Kiến thức',
    heritage: 'Quần thể di tích Phố Hiến, Đền Chử Đồng Tử, Chùa Chuông',
    description: 'Thương cảng buôn bán quốc tế sầm uất thế kỷ 16-17 với câu thành ngữ "Thứ nhất Kinh kỳ, thứ nhì Phố Hiến", giàu truyền thống văn hóa dân gian.',
    specialty: 'Nhãn lồng tiến vua, Gà Đông Tảo, Bánh dày làng Gàu',
    festivals: ['Lễ hội Chử Đồng Tử - Tiên Dung', 'Lễ hội Đền Mẫu Phố Hiến'],
    artifacts: {
      regular: ['Nhãn Lồng Hưng Yên Thượng Hạng', 'Gốm Men Ngọc Phố Hiến'],
      treasure: 'Thuyền Buôn Gỗ Thương Cảng Phố Hiến'
    },
    marketQuiz: {
      item: 'Nhãn Lồng Hưng Yên',
      question: 'Nhãn lồng Hưng Yên xưa kia thường được dùng để dâng lên đối tượng nào?',
      options: ['Tiến dâng lên Vua', 'Xuất khẩu sang châu Âu', 'Tế lễ thần rừng', 'Ban phát cho thợ rèn'],
      correctAnswer: 0,
      marketHint: 'Quả nhãn dày cùi, róc hạt, vị ngọt thanh tao từng được gọi là "vương giả chi quả".'
    },
    lat: 20.6464,
    lng: 106.0511,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/hung-yen'
  },
  {
    id: 'haiphong',
    name: 'Hải Phòng',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Thị trường',
    heritage: 'Quần đảo Cát Bà (UNESCO), Bến K15 Đường Hồ Chí Minh trên biển, Đền thờ Nữ tướng Lê Chân',
    description: 'Thành phố Cảng hoa phượng đỏ kiên cường bất khuất, đầu mối giao thương hàng hải quốc tế hàng đầu miền Bắc.',
    specialty: 'Bánh đa cua Hải Phòng, Bánh mì que cay, Nem cua bể',
    festivals: ['Lễ hội Chọi trâu Đồ Sơn', 'Lễ hội Nữ tướng Lê Chân'],
    artifacts: {
      regular: ['Mỏ Neo Thuyền Buôn Đất Cảng', 'Hóa Thạch San Hô Cát Bà'],
      treasure: 'Phù Hiệu Tàu Không Số Bến K15'
    },
    marketQuiz: {
      item: 'Bánh Đa Cua Hải Phòng',
      question: 'Màu nâu đỏ đặc trưng của sợi bánh đa đỏ Hải Phòng có được nhờ thành phần tự nhiên nào?',
      options: ['Nước đường mía (mật mía) phơi sấy', 'Bột ớt cay nồng', 'Gấc chín đỏ au', 'Nước cốt dừa'],
      correctAnswer: 0,
      marketHint: 'Mật mía giúp sợi bánh có màu nâu tự nhiên và độ dai giòn khi chan nước dùng sôi.'
    },
    lat: 20.8449,
    lng: 106.6881,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/hai-phong'
  },
  {
    id: 'quangninh',
    name: 'Quảng Ninh',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Thử thách',
    heritage: 'Vịnh Hạ Long (UNESCO thiên nhiên thế giới), Non thiêng Yên Tử, Thương cảng cổ Vân Đồn',
    description: 'Kỳ quan thiên nhiên thế giới với hàng ngàn đảo đá vôi kỳ vĩ và cái nôi của Thiền phái Trúc Lâm Yên Tử do Phật hoàng Trần Nhân Tông sáng lập.',
    specialty: 'Chả mực giã tay Hạ Long, Sá sùng Quan Lạn, Rượu ba kích Ba Chẽ',
    festivals: ['Lễ hội Xuân Yên Tử', 'Carnaval Hạ Long', 'Lễ hội Đền Cửa Ông'],
    artifacts: {
      regular: ['Trầm Tượng Non Thiêng Yên Tử', 'Viên Ngọc Trai Vịnh Hạ Long'],
      treasure: 'Bảo Đao Bạch Đằng Giang Vạn Kiếp'
    },
    marketQuiz: {
      item: 'Chả Mực Giã Tay Hạ Long',
      question: 'Yếu tố quyết định độ giòn sần sật trứ danh của chả mực Hạ Long là gì?',
      options: ['Phải giã bằng tay trong cối đá', 'Phải xay bằng máy công nghiệp', 'Pha nhiều bột nở', 'Ướp đá lạnh 3 ngày'],
      correctAnswer: 0,
      marketHint: 'Giã cối đá truyền thống giúp thớ thịt mực kết dính tự nhiên mà không bị nát nhừ.'
    },
    lat: 20.9502,
    lng: 107.0734,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/quang-ninh'
  },
  {
    id: 'langson',
    name: 'Lạng Sơn',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Kiến thức',
    heritage: 'Ải Chi Lăng, Động Tam Thanh, Nhị Thanh, Nàng Tô Thị',
    description: 'Vùng biên cương phên dậu Đông Bắc hào hùng với Ải Chi Lăng tiêu diệt Liễu Thăng năm 1427 và biểu tượng lòng thủy chung son sắt Nàng Tô Thị.',
    specialty: 'Vịt quay lá mắc mật, Khau nhục, Hồng không hạt Bảo Lâm',
    festivals: ['Lễ hội Chùa Tam Thanh', 'Lễ hội Lồng Tồng Bày Sái'],
    artifacts: {
      regular: ['Búp Lá Mắc Mật Rừng', 'Đàn Tính Tày Nùng'],
      treasure: 'Mảnh Đá Khắc Hịch Ải Chi Lăng'
    },
    marketQuiz: {
      item: 'Vịt Quay Lá Mắc Mật',
      question: 'Tên "Mắc mật" trong tiếng Tày - Nùng có ý nghĩa là gì?',
      options: ['Quả ngọt, lá thơm', 'Quả cay, hạt đắng', 'Lá thuốc giải độc', 'Cây cổ thụ'],
      correctAnswer: 0,
      marketHint: 'Mắc mật là gia vị linh hồn tạo nên mùi thơm nồng nàn khó cưỡng xứ Lạng.'
    },
    lat: 21.8537,
    lng: 106.7615,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/lang-son'
  },
  {
    id: 'caobang',
    name: 'Cao Bằng',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Lễ hội',
    heritage: 'Khu di tích Quốc gia đặc biệt Pác Bó, Thác Bản Giốc (thác tự nhiên lớn nhất ĐNÁ)',
    description: 'Cội nguồn cách mạng nơi Bác Hồ về nước năm 1941, thiên nhiên hùng vĩ với dòng suối Lê Nin trong xanh ngọc bích và thác Bản Giốc cuồn cuộn mây trời.',
    specialty: 'Bánh cuốn canh Cao Bằng, Hạt dẻ Trùng Khánh, Vịt quay 7 vị',
    festivals: ['Lễ hội Du lịch Thác Bản Giốc', 'Lễ hội Đền Kỳ Sầm'],
    artifacts: {
      regular: ['Khăn Chàm Thổ Cẩm Pác Bó', 'Túi Hạt Dẻ Trùng Khánh'],
      treasure: 'Bàn Đá Lịch Sử Bác Hồ Dịch Sử Đảng'
    },
    marketQuiz: {
      item: 'Hạt Dẻ Trùng Khánh',
      question: 'Hạt dẻ Trùng Khánh thơm ngon nhất vào mùa nào trong năm?',
      options: ['Mùa thu hoạch vào mùa Thu (tháng 9-10)', 'Mùa hè nắng gắt', 'Mùa xuân hoa đào', 'Giữa mùa đông buốt giá'],
      correctAnswer: 0,
      marketHint: 'Những cơn gió thu se lạnh cũng là lúc những chùm quả dẻ gai nứt vỏ rơi xuống đất.'
    },
    lat: 22.6667,
    lng: 105.9583,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/cao-bang'
  },
  {
    id: 'tuyenquang',
    name: 'Tuyên Quang',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Thị trường',
    heritage: 'Khu di tích Quốc gia đặc biệt Tân Trào, Lễ hội Thành Tuyên (Đèn lồng khổng lồ)',
    description: 'Thủ đô Khu Giải phóng - Thủ đô Kháng chiến, vùng đất "Chè Thái, Gái Tuyên" cùng Lễ hội Thành Tuyên rực rỡ sắc màu kỷ lục Guinness.',
    specialty: 'Thịt trâu gác bếp, Gỏi cá bỗng sông Lô, Rượu ngô Na Hang',
    festivals: ['Lễ hội Thành Tuyên (Trung thu)', 'Lễ hội Đua thuyền Sông Lô'],
    artifacts: {
      regular: ['Đèn Kéo Quân Thành Tuyên', 'Hũ Rượu Men Lá Na Hang'],
      treasure: 'Cây Đa Tân Trào Khắc Son'
    },
    marketQuiz: {
      item: 'Rượu Ngô Na Hang Men Lá',
      question: 'Rượu ngô Na Hang truyền thống được lên men từ bao nhiêu loại lá thảo dược rừng?',
      options: ['Hơn 20 loại lá thuốc rừng', 'Chỉ dùng 1 loại men công nghiệp', 'Lên men bằng cơm nếp', 'Ngâm với mía đỏ'],
      correctAnswer: 0,
      marketHint: 'Bí quyết men lá của người Dao giúp rượu thơm mát, uống êm say không đau đầu.'
    },
    lat: 21.8233,
    lng: 105.2155,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/tuyen-quang'
  },
  {
    id: 'thainguyen',
    name: 'Thái Nguyên',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Thử thách',
    heritage: 'Vùng chè Tân Cương đệ nhất danh trà, Khu di tích Quốc gia đặc biệt ATK Định Hóa',
    description: 'Thủ phủ gang thép và cái nôi danh trà Việt Nam với hương cốm non ngọt hậu lắng đọng, trung tâm An toàn khu định hướng cách mạng thời kháng Pháp.',
    specialty: 'Chè búp Tân Cương, Trám đen Hà Châu, Bánh chưng Bờ Đậu',
    festivals: ['Lễ hội Trà Thái Nguyên', 'Lễ hội Lồng Tồng ATK Định Hóa'],
    artifacts: {
      regular: ['Hộp Trà Móc Câu Tân Cương', 'Cối Ép Trà Gỗ Nghiến'],
      treasure: 'Ấm Tử Sa Dâng Trà Kháng Chiến ATK'
    },
    marketQuiz: {
      item: 'Chè Đinh Tân Cương Thượng Hạng',
      question: 'Để hái được 1kg chè đinh Tân Cương hảo hạng, người thợ trà phải chọn lọc phần nào của búp trà?',
      options: ['Chỉ hái 1 đọt non nhọn như chiếc đinh', 'Hái 1 búp 2 lá to', 'Hái cả cành bánh tẻ', 'Nhổ cả rễ non'],
      correctAnswer: 0,
      marketHint: 'Búp trà non còn ngậm sương sớm được hái tỉ mỉ như thêu hoa dệt gấm.'
    },
    lat: 21.5942,
    lng: 105.8482,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/thai-nguyen'
  },
  {
    id: 'laocai',
    name: 'Lào Cai',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Kiến thức',
    heritage: 'Ruộng bậc thang Sa Pa, Đỉnh Fansipan 3.143m Nóc nhà Đông Dương, Chợ phiên Bắc Hà',
    description: 'Kỳ vĩ Hoàng Liên Sơn với sắc màu thổ cẩm 25 dân tộc anh em, ruộng bậc thang uốn lượn tầng tầng lớp lớp và chợ phiên rực rỡ ngựa thồ váy hoa.',
    specialty: 'Thắng cố ngựa Bắc Hà, Cá hồi Sa Pa, Mận hậu Bắc Hà',
    festivals: ['Lễ hội Đua ngựa Bắc Hà', 'Lễ hội Khèn Mông Sa Pa'],
    artifacts: {
      regular: ['Chiếc Khèn Mông Bằng Trúc', 'Vải Lanh Nhuộm Chàm Sa Pa'],
      treasure: 'Chóp Inox Cột Mốc Fansipan 3.143m'
    },
    marketQuiz: {
      item: 'Thắng Cố Ngựa Bắc Hà',
      question: 'Thắng cố ngựa truyền thống của đồng bào Mông ở chợ phiên được nấu trong dụng cụ gì?',
      options: ['Chảo gang khổng lồ đun bằng củi gác', 'Nồi áp suất điện', 'Thùng gỗ sồi', 'Niêu đất nhỏ'],
      correctAnswer: 0,
      marketHint: 'Chảo gang sôi sùng sục bên cạnh bếp than hồng là hình ảnh thân thuộc của phiên chợ vùng cao.'
    },
    lat: 22.4856,
    lng: 103.9707,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/lao-cai'
  },
  {
    id: 'laichau',
    name: 'Lai Châu',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Lễ hội',
    heritage: 'Đèo Ô Quy Hồ (Tứ đại đỉnh đèo), Bản du lịch cộng đồng Sin Suối Hồ, Đỉnh Putaleng',
    description: 'Miền sơn cước hùng vĩ với dòng sông Đà hung bạo và trữ tình, con đèo Ô Quy Hồ mây vờn lãng đãng và hoa phong lan rừng bừng nở khắp Sin Suối Hồ.',
    specialty: 'Thịt lợn cắp nách, Pa pỉnh tộp (cá nướng Thái), Rượu ngô Sùng Phài',
    festivals: ['Lễ hội Té nước (Bun Vốc Nặm)', 'Lễ hội Then Kin Pang'],
    artifacts: {
      regular: ['Giỏ Lan Rừng Ô Quy Hồ', 'Vòng Bạc Thái Khắc Nổi'],
      treasure: 'Bia Cổ Vua Lê Thái Tổ Bên Bờ Sông Đà'
    },
    marketQuiz: {
      item: 'Pa Pỉnh Tộp (Cá gập nướng)',
      question: 'Trong tiếng Thái, "Pa pỉnh tộp" có nghĩa là món ăn gì?',
      options: ['Cá suối ướp gia vị gập đôi nướng than', 'Cá hấp lá chuối rừng', 'Cá kho tương chua', 'Canh cá nấu măng'],
      correctAnswer: 0,
      marketHint: 'Cá được mổ lưng, ướp mắc khén hạt dổi rồi gập đôi kẹp thanh tre nướng thơm lừng.'
    },
    lat: 22.3964,
    lng: 103.4582,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/lai-chau'
  },
  {
    id: 'dienbien',
    name: 'Điện Biên',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Kiến thức',
    heritage: 'Quần thể Chiến trường Điện Biên Phủ (Đồi A1, Hầm De Castries), Cánh đồng Mường Thanh',
    description: 'Mảnh đất lịch sử vàng son "Lừng lẫy năm châu, chấn động địa cầu" ngày 7/5/1954, bên vựa lúa Mường Thanh "nhất Thanh, nhì Lò, tam Than, tứ Tấc".',
    specialty: 'Gạo tám Mường Thanh, Thịt trâu hun khói, Sâu chít Điện Biên',
    festivals: ['Lễ hội Hoa Ban Điện Biên', 'Lễ hội Thành Bản Phủ'],
    artifacts: {
      regular: ['Bó Hoa Ban Trắng Mường Phăng', 'Bát Cơm Gạo Tám Mường Thanh'],
      treasure: 'Mảnh Cờ Quyết Chiến Quyết Thắng Đồi A1'
    },
    marketQuiz: {
      item: 'Gạo Tám Điện Biên Mường Thanh',
      question: 'Cánh đồng lúa Mường Thanh nức tiếng là cánh đồng lớn thứ mấy ở miền núi Tây Bắc?',
      options: ['Lớn nhất Tây Bắc ("Nhất Thanh")', 'Lớn thứ nhì ("Nhì Lò")', 'Lớn thứ ba', 'Nhỏ nhất'],
      correctAnswer: 0,
      marketHint: 'Câu phương ngôn xưa khẳng định: "Nhất Thanh, nhì Lò, tam Than, tứ Tấc".'
    },
    lat: 21.3869,
    lng: 103.0232,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/dien-bien'
  },
  {
    id: 'sonla',
    name: 'Sơn La',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Thị trường',
    heritage: 'Cao nguyên Mộc Châu, Di tích Nhà tù Sơn La (Cây đào Tô Hiệu), Thủy điện Sơn La',
    description: 'Vựa nông sản lớn nhất miền Bắc với thảo nguyên Mộc Châu xanh ngát bò sữa, đồi chè trái tim và tinh thần kiên cường của cây đào Tô Hiệu lịch sử.',
    specialty: 'Sữa tươi Mộc Châu, Mận hậu Nà Ka, Bê chao Mộc Châu',
    festivals: ['Lễ hội Hết Chá Mộc Châu', 'Lễ hội Mận hậu Nà Ka'],
    artifacts: {
      regular: ['Hộp Sữa Bò Thảo Nguyên Mộc Châu', 'Cành Đào Tô Hiệu Đỏ Thắm'],
      treasure: 'Tua-bin Thuỷ Điện Sơn La Mô Hình Vàng'
    },
    marketQuiz: {
      item: 'Mận Hậu Mộc Châu',
      question: 'Thung lũng mận nào tại Mộc Châu được mệnh danh là vựa mận lớn và đẹp nhất?',
      options: ['Thung lũng mận Nà Ka', 'Thung lũng Mường Lát', 'Thung lũng Mai Châu', 'Thung lũng hoa Bắc Sơn'],
      correctAnswer: 0,
      marketHint: 'Mỗi độ tháng 5, Nà Ka phủ kín sắc đỏ tím mọng nước của những chùm mận chín.'
    },
    lat: 21.3283,
    lng: 103.9148,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/son-la'
  },
  {
    id: 'phutho',
    name: 'Phú Thọ',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Thử thách',
    heritage: 'Tín ngưỡng thờ cúng Hùng Vương (UNESCO), Hát Xoan Phú Thọ (UNESCO)',
    description: 'Cội nguồn non sông gấm vóc Lạc Việt, nơi các vua Hùng dựng nước Văn Lang, linh hồn của sự gắn kết dân tộc muôn triệu con cháu một nhà.',
    specialty: 'Bánh tai Phú Thọ, Thịt chua Thanh Sơn, Bưởi Đoan Hùng',
    festivals: ['Đại lễ Giỗ Tổ Hùng Vương (10/3 Âm lịch)', 'Hội hát Xoan Kim Đức'],
    artifacts: {
      regular: ['Cành Bưởi Đoan Hùng Ngát Hương', 'Ống Nứa Thịt Chua Thanh Sơn'],
      treasure: 'Trống Đồng Đền Hùng Hùng Vương Thánh Tích'
    },
    marketQuiz: {
      item: 'Thịt Chua Thanh Sơn',
      question: 'Nguyên liệu đặc biệt nào của núi rừng giúp lên men chín thịt chua Thanh Sơn?',
      options: ['Thính ngô và thính gạo rang thơm', 'Nước mắm cá cơm', 'Men rượu trắng', 'Nước cốt chanh'],
      correctAnswer: 0,
      marketHint: 'Bột thính rang vàng rộm ủ chặt trong ống nứa làm thịt chín thơm tự nhiên.'
    },
    lat: 21.3228,
    lng: 105.2280,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/phu-tho'
  },
  {
    id: 'ninhbinh',
    name: 'Ninh Bình',
    region: 'bac_bo',
    regionName: 'Bắc Bộ',
    tileType: 'Kiến thức',
    heritage: 'Quần thể danh thắng Tràng An (UNESCO kép), Cố đô Hoa Lư, Tam Cốc',
    description: 'Nơi địa linh phong thủy đặt kinh đô đầu tiên của Đại Cồ Việt thế kỷ X dưới triều Đinh - Tiền Lê, với vách đá karst ngập nước kỳ vĩ như vịnh Hạ Long trên cạn.',
    specialty: 'Cơm cháy Ninh Bình, Thịt dê núi đá, Rượu cần Nho Quan',
    festivals: ['Lễ hội Cố đô Hoa Lư', 'Lễ hội Tràng An rước nước'],
    artifacts: {
      regular: ['Tấm Cơm Cháy Vàng Giòn Ruộm', 'Thuyền Nan Lướt Hang Tràng An'],
      treasure: 'Áo Bào Long Côn Cố Đô Hoa Lư'
    },
    marketQuiz: {
      item: 'Cơm Cháy Chà Bông Ninh Bình',
      question: 'Nước sốt truyền thống hảo hạng dùng kèm với cơm cháy Ninh Bình được chế biến từ gì?',
      options: ['Nước sốt tim cật dê núi đậm đà', 'Nước cốt dừa ngọt béo', 'Sốt mayonnaise', 'Nước chấm mù tạt'],
      correctAnswer: 0,
      marketHint: 'Sốt tim cật sóng sánh nóng hổi chan lên miếng cơm cháy giòn tan tạo nên mỹ vị cố đô.'
    },
    lat: 20.2506,
    lng: 105.9745,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/ninh-binh'
  },

  // TRUNG BỘ (13 địa phương)
  {
    id: 'thanhhoa',
    name: 'Thanh Hóa',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Thị trường',
    heritage: 'Di sản Thành nhà Hồ (UNESCO), Khu di tích lịch sử Lam Kinh',
    description: 'Vùng đất "địa linh sinh hào kiệt", quê hương anh hùng dân tộc Lê Lợi và công trình Thành đá vôi kỳ vĩ xây dựng dưới triều Hồ Quý Ly năm 1397.',
    specialty: 'Nem chua Thanh Hóa, Chè lam Phủ Quảng, Bánh gai Tứ Trụ',
    festivals: ['Lễ hội Lam Kinh', 'Lễ hội Bà Triệu'],
    artifacts: {
      regular: ['Bó Nem Chua Lá Chuối Xanh', 'Viên Đá Xây Thành Nhà Hồ'],
      treasure: 'Thanh Thuận Thiên Kiếm Khởi Nghĩa Lam Sơn'
    },
    marketQuiz: {
      item: 'Nem Chua Thanh Hóa',
      question: 'Lá cây nào thường được gài kèm bên trong cuộn nem chua để tạo vị chát bùi và diệt khuẩn?',
      options: ['Lá đinh lăng hoặc lá ổi', 'Lá tía tô', 'Lá trà xanh', 'Lá lốt'],
      correctAnswer: 0,
      marketHint: 'Vài nhánh lá đinh lăng kèm lát tỏi ớt làm dậy vị chua thanh giòn sần sật.'
    },
    lat: 19.8067,
    lng: 105.7852,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/thanh-hoa'
  },
  {
    id: 'nghean',
    name: 'Nghệ An',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Thử thách',
    heritage: 'Khu di tích Kim Liên Làng Sen, Dân ca Ví Giặm Nghệ Tĩnh (UNESCO)',
    description: 'Quê hương Chủ tịch Hồ Chí Minh vĩ đại, vùng đất giàu truyền thống hiếu học, khí phách kiên cường cùng câu hò Ví Giặm ân tình sâu nặng bên dòng Lam.',
    specialty: 'Cháo lươn xứ Nghệ, Nhút Thanh Chương, Tương Nam Đàn',
    festivals: ['Lễ hội Làng Sen', 'Lễ hội Đền Cuông'],
    artifacts: {
      regular: ['Đóa Sen Hồng Kim Liên', 'Hũ Nhút Thanh Chương Mặn Mòi'],
      treasure: 'Khung Cửi Gỗ Mẹ Hoàng Thị Loan'
    },
    marketQuiz: {
      item: 'Nhút Thanh Chương',
      question: 'Món "Nhút" dân dã nổi tiếng xứ Nghệ được làm từ nguyên liệu chính nào?',
      options: ['Quả mít non muối mặn', 'Củ cải trắng phơi khô', 'Măng le rừng', 'Dưa chuột non'],
      correctAnswer: 0,
      marketHint: '"Nhút Thanh Chương, tương Nam Đàn" - quả mít non thái sợi muối chua cay đượm tình quê.'
    },
    lat: 18.6734,
    lng: 105.6813,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/nghe-an'
  },
  {
    id: 'hatinh',
    name: 'Hà Tĩnh',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Kiến thức',
    heritage: 'Khu lưu niệm Nguyễn Du, Ngã ba Đồng Lộc linh thiêng, Chùa Hương Tích',
    description: 'Vùng đất non xanh nước biếc bên dãy Hồng Lĩnh và sông La, nơi sản sinh ra Đại thi hào Nguyễn Du với kiệt tác Truyện Kiều chấn động văn đàn.',
    specialty: 'Kẹo cu đơ Hà Tĩnh, Bánh bèo Đài sen, Cam bù Hương Sơn',
    festivals: ['Lễ hội Chùa Hương Tích', 'Lễ hội Đền Chiêu Trưng Lê Khôi'],
    artifacts: {
      regular: ['Miếng Kẹo Cu Đơ Giòn Rụm', 'Bản Chép Nôm Đoạn Trường Tân Thanh'],
      treasure: 'Chiếc Chuông Đồng Cổ Ngã Ba Đồng Lộc'
    },
    marketQuiz: {
      item: 'Kẹo Cu Đơ Hà Tĩnh',
      question: 'Thành phần tạo nên độ giòn bùi ngọt cay đặc trưng của kẹo cu đơ gồm những gì?',
      options: ['Mật mía, lạc (đậu phộng), gừng tươi và bánh đa nướng', 'Đường hóa học và mè trắng', 'Bột nếp và mật ong', 'Đường phèn và dừa sấy'],
      correctAnswer: 0,
      marketHint: 'Mật mía nấu dẻo quyện lạc rang kẹp giữa hai miếng bánh đa nướng giòn rụm.'
    },
    lat: 18.3560,
    lng: 105.9059,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/ha-tinh'
  },
  {
    id: 'quangtri',
    name: 'Quảng Trị',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Lễ hội',
    heritage: 'Thành cổ Quảng Trị, Sông Bến Hải - Cầu Hiền Lương, Địa đạo Vịnh Mốc',
    description: 'Vùng đất lửa anh hùng gắn liền với cuộc chiến đấu 81 ngày đêm bảo vệ Thành cổ và khát vọng hòa bình thống nhất non sông của toàn dân tộc.',
    specialty: 'Thịt trâu lá trơơng, Cháo bột Hải Lăng, Rượu Kim Long',
    festivals: ['Lễ hội Vì Hòa bình', 'Lễ hội Thống nhất Non sông bên bờ Hiền Lương'],
    artifacts: {
      regular: ['Cành Lá Trơơng Rừng Trường Sơn', 'Mảnh Đất Lửa Thành Cổ'],
      treasure: 'Cột Cờ Giới Tuyến Vĩ Tuyến 17 Bến Hải'
    },
    marketQuiz: {
      item: 'Thịt Trâu Nướng Lá Trơơng',
      question: 'Lá "trơơng" - gia vị độc nhất vô nhị xứ Quảng Trị có hương vị như thế nào?',
      options: ['Cay nồng, thơm ngát đặc trưng', 'Chua gắt như chanh', 'Ngọt lịm như cỏ ngọt', 'Đắng nghét như mướp đắng'],
      correctAnswer: 0,
      marketHint: 'Mùi thơm cay nồng của lá trơơng rừng khử tanh và tôn vị ngọt mềm của thịt trâu.'
    },
    lat: 16.7499,
    lng: 107.1854,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/quang-tri'
  },
  {
    id: 'hue',
    name: 'Huế',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Kiến thức',
    heritage: 'Quần thể Di tích Cố đô Huế (UNESCO), Nhã nhạc Cung đình Huế (UNESCO)',
    description: 'Kinh đô triều Nguyễn từ 1802-1945, bảo tồn nguyên vẹn kiến trúc cung đình, lăng tẩm uy nghiêm cùng nếp sống tao nhã và ẩm thực cung đình tinh hoa.',
    specialty: 'Bún bò Huế, Cơm hến, Bánh bèo nậm lọc, Chè bột lọc heo quay',
    festivals: ['Festival Huế', 'Lễ hội Điện Hòn Chén'],
    artifacts: {
      regular: ['Bộ Đàn Tỳ Bà Nhã Nhạc', 'Bát Cơm Hến Sông Hương'],
      treasure: 'Ấn Vàng Sắc Mệnh Chi Bảo Triều Nguyễn'
    },
    marketQuiz: {
      item: 'Cơm Hến Cồn Hến Xứ Huế',
      question: 'Cơm hến truyền thống Huế thường được ăn ở trạng thái nhiệt độ nào?',
      options: ['Cơm nguội ăn kèm nước dùng hến nóng hổi', 'Cơm nóng sốt và nước lạnh', 'Tất cả đều đun sôi bốc khói', 'Ướp lạnh cùng đá'],
      correctAnswer: 0,
      marketHint: 'Sự tương phản giữa cơm nguội giòn rau bắp chuối và nước hến ngọt cay nghi ngút khói tạo nên nét duyên ẩm thực Huế.'
    },
    lat: 16.4637,
    lng: 107.5909,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/hue'
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Thị trường',
    heritage: 'Bảo tàng Điêu khắc Chăm, Ngũ Hành Sơn linh ứng, Cầu Rồng phun lửa',
    description: 'Đô thị biển đáng sống và trung tâm động lực kinh tế miền Trung, giao hòa giữa vẻ đẹp hiện đại và trầm tích văn hóa Champa cổ ngàn năm.',
    specialty: 'Mì Quảng ếch, Bánh tráng cuốn thịt heo hai đầu da, Tré Bà Đệ',
    festivals: ['Lễ hội Pháo hoa Quốc tế Đà Nẵng (DIFF)', 'Lễ hội Quán Thế Âm Ngũ Hành Sơn'],
    artifacts: {
      regular: ['Bức Tượng Vũ Nữ Apsara Bằng Đá', 'Mô Hình Cầu Rồng Thép'],
      treasure: 'Đài Thờ Trà Kiệu Bằng Đá Sa Thạch'
    },
    marketQuiz: {
      item: 'Bánh Tráng Thịt Heo Hai Đầu Da',
      question: 'Miếng thịt heo "hai đầu da" đòi hỏi kỹ thuật luộc và pha thịt khéo léo như thế nào?',
      options: ['Miếng thịt luộc có lớp da ở cả hai đầu lát cắt', 'Thịt chỉ toàn mỡ không nạc', 'Da chiên giòn rụm bọc thịt xông khói', 'Thịt xay nhuyễn nướng vỉ'],
      correctAnswer: 0,
      marketHint: 'Khối thịt ba chỉ chọn lọc khéo léo để khi xắt lát mỏng có dải da ở hai đầu viền.'
    },
    lat: 16.0544,
    lng: 108.2022,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/da-nang'
  },
  {
    id: 'quangngai',
    name: 'Quảng Ngãi',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Thử thách',
    heritage: 'Đảo Lý Sơn tiền tiêu, Quần thể Văn hóa Sa Huỳnh (Di tích quốc gia đặc biệt)',
    description: 'Vương quốc tỏi Lý Sơn sừng sững giữa ngàn trùng sóng vỗ, nơi xuất phát của Đội hùng binh Hoàng Sa kiêm quản Trường Sa từ thế kỷ 17.',
    specialty: 'Tỏi cô đơn Lý Sơn, Cá bống sông Trà, Don Quảng Ngãi',
    festivals: ['Lễ khao lề thế lính Hoàng Sa (UNESCO)', 'Lễ hội Cầu ngư Sa Huỳnh'],
    artifacts: {
      regular: ['Bó Tỏi Cô Đơn Núi Lửa Lý Sơn', 'Chiếc Thuyền Câu Hoàng Sa Bằng Gỗ'],
      treasure: 'Mô Hình Thuyền Nan Thế Lính Hoàng Sa Tâm Linh'
    },
    marketQuiz: {
      item: 'Tỏi Cô Đơn Lý Sơn',
      question: 'Tỏi Lý Sơn có hương thơm thanh dịu và hàm lượng tinh dầu cao vượt trội nhờ thổ nhưỡng nào?',
      options: ['Trầm tích đất đỏ bazan núi lửa pha cát biển san hô', 'Đất sét bãi bồi ven sông', 'Đất phù sa đen màu mỡ', 'Đất than bùn đầm lầy'],
      correctAnswer: 0,
      marketHint: 'Sự kết hợp giữa tro bụi núi lửa triệu năm và cát biển san hô tạo nên chất đất thần kỳ.'
    },
    lat: 15.1205,
    lng: 108.7922,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/quang-ngai'
  },
  {
    id: 'gialai',
    name: 'Gia Lai',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Kiến thức',
    heritage: 'Không gian Văn hóa Cồng chiêng Tây Nguyên (UNESCO), Biển Hồ T’nưng',
    description: 'Vùng cao nguyên bạt ngàn đất đỏ Pleiku với Biển Hồ trong veo như viên ngọc bích, tiếng cồng chiêng ngân vang bên mái nhà Rông đại ngàn.',
    specialty: 'Phở hai tô Pleiku (Phở khô), Bò một nắng muối kiến vàng, Cà phê Robusta',
    festivals: ['Festival Cồng chiêng Gia Lai', 'Lễ hội Hoa dã quỳ Núi lửa Chư Đang Ya'],
    artifacts: {
      regular: ['Bộ Cồng Chiêng Đồng Cổ', 'Hũ Muối Kiến Vàng Rừng Krông Pa'],
      treasure: 'Cột Nhà Rông Gỗ Trắc Chạm Khắc Thần Mặt Trời'
    },
    marketQuiz: {
      item: 'Phở Khô Hai Tô Pleiku',
      question: 'Vì sao món phở nổi tiếng Pleiku lại được gọi là "Phở hai tô"?',
      options: ['Một tô đựng bánh phở trộn gia vị, một tô đựng nước dùng thơm phức', 'Phải ăn liền hai tô mới tính tiền', 'Tô dành cho người lớn và tô cho trẻ em', 'Đựng trong tô có hai ngăn đôi'],
      correctAnswer: 0,
      marketHint: 'Khách vừa nhai sợi phở ngấm tương đen đậm đà, vừa xì xụp húp thìa nước súp béo ngậy.'
    },
    lat: 13.9833,
    lng: 108.0000,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/gia-lai'
  },
  {
    id: 'daklak',
    name: 'Đắk Lắk',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Lễ hội',
    heritage: 'Thủ phủ Cà phê Buôn Ma Thuột, Làng Đôn thuần dưỡng voi huyền thoại, Thác Dray Nur',
    description: 'Thủ phủ cà phê thế giới với đất đỏ bazan màu mỡ, tiếng thác nước Dray Nur - Dray Sáp gầm vang và sử thi Đăm Săn hùng tráng trường tồn.',
    specialty: 'Cà phê Buôn Ma Thuột, Cơm lam gà nướng Bản Đôn, Gỏi cà đắng cá cơm',
    festivals: ['Lễ hội Cà phê Buôn Ma Thuột', 'Lễ hội Đua voi Buôn Đôn'],
    artifacts: {
      regular: ['Gùi Mây Dệt Thổ Cẩm Ê Đê', 'Túi Hạt Cà Phê Moka Thượng Hạng'],
      treasure: 'Chiếc Ngà Voi Hóa Thạch Vua Voi Ama Kông'
    },
    marketQuiz: {
      item: 'Cà Phê Buôn Ma Thuột',
      question: 'Đắk Lắk là thủ phủ trồng loài cây cà phê nào chiếm sản lượng xuất khẩu lớn nhất Việt Nam?',
      options: ['Cà phê Robusta (Cà phê vối)', 'Cà phê Chè (Arabica)', 'Cà phê Mít', 'Cà phê Culi'],
      correctAnswer: 0,
      marketHint: 'Khí hậu và đất đỏ bazan Buôn Ma Thuột sinh ra hạt Robusta đậm đà sánh mịn nổi danh năm châu.'
    },
    lat: 12.6667,
    lng: 108.0500,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/dak-lak'
  },
  {
    id: 'khanhhoa',
    name: 'Khánh Hòa',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Thị trường',
    heritage: 'Tháp Bà Ponagar nghìn năm, Vịnh Nha Trang, Đảo Yến Hòn Nội',
    description: 'Xứ trầm hương biển yến non xanh nước biếc, quần thể tháp Chăm Ponagar cổ kính linh thiêng tọa lạc trên đồi Cù Lao nhìn ra cửa biển.',
    specialty: 'Yến sào Khánh Hòa, Nem nướng Ninh Hòa, Bún sứa Nha Trang',
    festivals: ['Lễ hội Tháp Bà Ponagar', 'Festival Biển Nha Trang'],
    artifacts: {
      regular: ['Mẩu Trầm Hương Kỳ Nam', 'Bát Yến Sào Đảo Hòn Nội'],
      treasure: 'Tượng Nữ Thần Thiên Y A Na Bằng Vàng'
    },
    marketQuiz: {
      item: 'Yến Sào Đảo Yến Hòn Nội',
      question: 'Loài chim yến nào làm nên những tổ yến tự nhiên có giá trị dinh dưỡng cao nhất trên vách đá vịnh Nha Trang?',
      options: ['Chim yến Hàng (Aerodramus fuciphagus)', 'Chim yến nhà nuôi', 'Chim bồ câu biển', 'Chim én lưng xanh'],
      correctAnswer: 0,
      marketHint: 'Yến đảo thiên nhiên làm tổ trên vách đá cheo leo hấp thụ khoáng chất của biển trời.'
    },
    lat: 12.2388,
    lng: 109.1967,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/khanh-hoa'
  },
  {
    id: 'lamdong',
    name: 'Lâm Đồng',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Thử thách',
    heritage: 'Cao nguyên Langbiang, Thành phố Đà Lạt sương mù, Thác Datanla',
    description: 'Xứ sở sương mù ngàn hoa thơ mộng trên cao nguyên Lâm Viên, gắn liền với bản tình ca Langbiang và kiến trúc biệt thự Pháp cổ kính.',
    specialty: 'Dâu tây Đà Lạt, Atiso, Rượu vang Đà Lạt, Hồng treo gió',
    festivals: ['Festival Hoa Đà Lạt', 'Lễ hội Cồng chiêng Lạc Dương'],
    artifacts: {
      regular: ['Bình Rượu Vang Đà Lạt Hảo Hạng', 'Chậu Hoa Phong Lan Rừng Langbiang'],
      treasure: 'Vương Miện Tình Yêu Chàng K’Lang Nàng H’Biang'
    },
    marketQuiz: {
      item: 'Hồng Treo Gió Công Nghệ Nhật',
      question: 'Quy trình làm hồng treo gió Đà Lạt tận dụng yếu tố tự nhiên nào của xứ sở sương mù?',
      options: ['Gió trời hanh hao và nắng nhẹ vùng cao nguyên', 'Sấy lò than củi nhiệt độ cao', 'Ủ men rượu vang', 'Ngâm nước tro bếp'],
      correctAnswer: 0,
      marketHint: 'Quả hồng được mát-xa và phơi dưới nắng gió tự nhiên trong nhà màng suốt cả tháng trời.'
    },
    lat: 11.9404,
    lng: 108.4583,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/lam-dong'
  },
  {
    id: 'hoangsa',
    name: 'Đặc khu Hoàng Sa',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Kiến thức',
    heritage: 'Quần đảo Hoàng Sa thiêng liêng, Bia chủ quyền Triều Nguyễn, Cột mốc lãnh hải',
    description: 'Quần đảo tiền tiêu thiêng liêng ở Biển Đông gắn liền với những chuyến giong buồm đo đạc cắm mốc chủ quyền của Đội hùng binh Hoàng Sa triều Nguyễn.',
    specialty: 'Cá bò hòm nướng than, Hải sâm Hoàng Sa, Tảo xoắn đảo san hô',
    festivals: ['Lễ khao lề thế lính Hoàng Sa tri ân tiền nhân', 'Hội hoa đăng cầu an biển đảo'],
    artifacts: {
      regular: ['Mảnh San Hô Đỏ Biển Đông', 'Hải Bàn Đồng Hùng Binh Hoàng Sa'],
      treasure: 'Mộc Bản Khắc Chiếu Dụ Xác Lập Chủ Quyền Hoàng Sa Vua Minh Mạng'
    },
    marketQuiz: {
      item: 'Hải Sâm Biển Đảo Hoàng Sa',
      question: 'Hải sâm quý hiếm vùng biển san hô Hoàng Sa còn được mệnh danh là sản vật gì của biển cả?',
      options: ['"Nhân sâm của biển cả" (Đại bổ)', 'Thảo dược chữa sâu răng', 'Bột tạo màu thực phẩm', 'Gia vị nấu canh chua'],
      correctAnswer: 0,
      marketHint: 'Hải sâm giàu đạm và vi khoáng từng là cống vật thượng hạng dâng lên triều đình.'
    },
    lat: 16.5333,
    lng: 111.6667,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/hoang-sa'
  },
  {
    id: 'truongsa',
    name: 'Đặc khu Trường Sa',
    region: 'trung_bo',
    regionName: 'Trung Bộ',
    tileType: 'Lễ hội',
    heritage: 'Quần đảo Trường Sa kiên cường, Cột mốc chủ quyền thiêng liêng, Cây Phong ba & Bàng vuông',
    description: 'Tuyến đảo phên dậu kiên cường của Tổ quốc Việt Nam, biểu tượng ý chí sắt đá của quân và dân giữ vững từng tấc đất sải biển thiêng liêng.',
    specialty: 'Ốc nón đảo chìm, Quả bàng vuông khô làm kỷ niệm, Mực một nắng Trường Sa',
    festivals: ['Lễ đón Giao thừa trên đảo tiền tiêu', 'Lễ hội Thả hoa đăng tưởng niệm liệt sĩ Gạc Ma'],
    artifacts: {
      regular: ['Quả Bàng Vuông Trường Sa', 'Vỏ Ốc Nón Biển Đảo Tiền Tiêu'],
      treasure: 'Lá Cờ Tổ Quốc Thấm Đẫm Gió Mặn Trường Sa'
    },
    marketQuiz: {
      item: 'Quả Bàng Vuông Khắc Chữ Kỷ Niệm',
      question: 'Cây Bàng vuông và cây Phong ba trên quần đảo Trường Sa là biểu tượng cho phẩm chất gì của người lính đảo?',
      options: ['Ý chí kiên trung, bất khuất đương đầu sóng gió', 'Sự nhẹ nhàng uốn lượn', 'Tính cách trầm lặng', 'Tình yêu thi ca lãng mạn'],
      correctAnswer: 0,
      marketHint: 'Bão giông chỉ làm rễ cây bám chặt thêm vào đá san hô, đơm hoa nở giữa đêm mặn mòi.'
    },
    lat: 8.6444,
    lng: 111.9194,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/truong-sa'
  },

  // NAM BỘ (8 địa phương)
  {
    id: 'tphcm',
    name: 'TP. Hồ Chí Minh',
    region: 'nam_bo',
    regionName: 'Nam Bộ',
    tileType: 'Thị trường',
    heritage: 'Bến Nhà Rồng, Địa đạo Củ Chi huyền thoại, Chợ Bến Thành hoa lệ',
    description: 'Trung tâm kinh tế năng động và hào sảng nhất cả nước, nơi chàng thanh niên Nguyễn Tất Thành ra đi tìm đường cứu nước năm 1911 mở ra trang sử mới.',
    specialty: 'Cơm tấm Sài Gòn, Hủ tiếu Nam Vang, Bánh mì kẹp thịt Sài Gòn',
    festivals: ['Lễ hội Sông nước TP.HCM', 'Đường hoa Nguyễn Huệ Tết'],
    artifacts: {
      regular: ['Chiếc Bánh Mì Kẹp Giòn Rụm', 'Mô Hình Tháp Đồng Hồ Chợ Bến Thành'],
      treasure: 'Bản Đồ Cảng Sài Gòn 1911 Nơi Bác Ra Đi Cứu Nước'
    },
    marketQuiz: {
      item: 'Cơm Tấm Sườn Bì Chả Sài Gòn',
      question: 'Hạt gạo "Tấm" dùng nấu cơm tấm nức tiếng Sài Gòn vốn có nguồn gốc từ đâu?',
      options: ['Hạt gạo gãy trong quá trình xay xát lúa', 'Một giống lúa nếp đặc biệt', 'Gạo nhập khẩu châu Âu', 'Hạt ngô xay nhỏ'],
      correctAnswer: 0,
      marketHint: 'Từ hạt gạo vỡ mộc mạc của người lao động xưa đã trở thành quốc hồn quốc túy ẩm thực đô thành.'
    },
    lat: 10.8231,
    lng: 106.6297,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/tp-hcm'
  },
  {
    id: 'dongnai',
    name: 'Đồng Nai',
    region: 'nam_bo',
    regionName: 'Nam Bộ',
    tileType: 'Lễ hội',
    heritage: 'Văn miếu Trấn Biên (Văn miếu đầu tiên Nam Bộ), Vườn Quốc gia Cát Tiên',
    description: 'Vùng đất mở cõi hào hùng của danh tướng Nguyễn Hữu Cảnh thời chúa Nguyễn, nơi lưu giữ tinh hoa Nho học xứ Đàng Trong qua Văn miếu Trấn Biên.',
    specialty: 'Bưởi Tân Triều, Gỏi cá Biên Hòa, Mít tố nữ Long Khánh',
    festivals: ['Lễ hội Chùa Ông Biên Hòa', 'Lễ hội Sayangva người Chơro'],
    artifacts: {
      regular: ['Trái Bưởi Đường Da Cam Tân Triều', 'Bút Lông Văn Miếu Trấn Biên'],
      treasure: 'Bản Đồ Hành Quân Mở Cõi Danh Tướng Nguyễn Hữu Cảnh'
    },
    marketQuiz: {
      item: 'Bưởi Tân Triều Đồng Nai',
      question: 'Làng bưởi cổ Tân Triều được bồi đắp phù sa trù phú bởi dòng sông nào?',
      options: ['Sông Đồng Nai uốn lượn', 'Sông Tiền Giang', 'Sông Sài Gòn', 'Sông Vàm Cỏ Đông'],
      correctAnswer: 0,
      marketHint: 'Dòng phù sa sông Đồng Nai bồi đắp cù lao tạo nên tép bưởi mọng nước ngọt thanh.'
    },
    lat: 10.9575,
    lng: 106.8427,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/dong-nai'
  },
  {
    id: 'tayninh',
    name: 'Tây Ninh',
    region: 'nam_bo',
    regionName: 'Nam Bộ',
    tileType: 'Kiến thức',
    heritage: 'Tòa Thánh Cao Đài Tây Ninh, Quần thể Di tích Núi Bà Đen 986m Nóc nhà Nam Bộ',
    description: 'Nóc nhà Nam Bộ kỳ vĩ với ngôi chùa Bà linh thiêng và Tòa thánh Cao Đài biểu tượng cho sự giao thoa dung hòa tinh hoa tư tưởng Đông Tây kim cổ.',
    specialty: 'Bánh tráng phơi sương Trảng Bàng, Muối tôm Tây Ninh, Bò tơ',
    festivals: ['Lễ hội Vía Bà Linh Sơn Thánh Mẫu', 'Đại lễ Hội Yến Diêu Trì Cung'],
    artifacts: {
      regular: ['Hũ Muối Tôm Cay Nồng', 'Tấm Bánh Tráng Phơi Sương Trảng Bàng'],
      treasure: 'Tượng Phật Bà Bằng Đồng Đỉnh Núi Bà Đen'
    },
    marketQuiz: {
      item: 'Bánh Tráng Phơi Sương Trảng Bàng',
      question: 'Bánh tráng Trảng Bàng sau khi nướng phồng phải được đem phơi lúc nào để đạt độ mềm dẻo?',
      options: ['Phơi trong đêm ngậm sương sớm ban mai', 'Phơi giữa trưa nắng gắt 40 độ', 'Sấy trong lò nướng bánh mì', 'Ủ dưới cát nóng'],
      correctAnswer: 0,
      marketHint: 'Những giọt sương đêm đất trời phương Nam thấm sâu vào từng thớ bột tạo nên độ dẻo thơm trứ danh.'
    },
    lat: 11.3101,
    lng: 106.0984,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/tay-ninh'
  },
  {
    id: 'cantho',
    name: 'Cần Thơ',
    region: 'nam_bo',
    regionName: 'Nam Bộ',
    tileType: 'Lễ hội',
    heritage: 'Văn hóa Chợ nổi Cái Răng (Di sản quốc gia), Bến Ninh Kiều, Nhà cổ Bình Thủy',
    description: 'Thủ phủ Tây Đô "gạo trắng nước trong", nét văn minh sông nước miệt vườn giao thương sầm uất trên bến dưới thuyền từ lúc bình minh ló rạng.',
    specialty: 'Bánh xèo miền Tây, Lẩu mắm Cần Thơ, Bánh tét lá cẩm',
    festivals: ['Lễ hội Bánh Dân gian Nam Bộ', 'Ngày hội Du lịch Chợ nổi Cái Răng'],
    artifacts: {
      regular: ['Cây Bẹo Bán Hàng Chợ Nổi', 'Đòn Bánh Tét Lá Cẩm Tím'],
      treasure: 'Đèn Cổ Nhà Cổ Bình Thủy Thế Kỷ 19'
    },
    marketQuiz: {
      item: 'Cây Bẹo Chợ Nổi Cái Răng',
      question: 'Ý nghĩa của "Cây Bẹo" dựng đứng trên mũi thuyền chợ nổi Cái Răng là gì?',
      options: ['Treo sản vật gì thì bán sản vật đó cho người mua từ xa nhận biết', 'Dùng làm cột buồm', 'Trang trí đón Tết', 'Xua đuổi cá sấu'],
      correctAnswer: 0,
      marketHint: '"Treo bắp bán bắp, treo khóm bán khóm" - ngôn ngữ giao thương không lời kỳ thú của người miền Tây.'
    },
    lat: 10.0452,
    lng: 105.7469,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/can-tho'
  },
  {
    id: 'vinhlong',
    name: 'Vĩnh Long',
    region: 'nam_bo',
    regionName: 'Nam Bộ',
    tileType: 'Thử thách',
    heritage: 'Di sản đương đại Vương quốc gốm đỏ Mang Thít, Cù lao An Bình',
    description: 'Vùng đất cù lao trù phú giữa sông Tiền và sông Cổ Chiên, với làng nghề lò gạch nung cổ Mang Thít độc nhất vô nhị phản chiếu sắc đỏ rực rỡ.',
    specialty: 'Khoai lang Bình Tân, Bưởi năm roi Bình Minh, Cá tai tượng chiên xù',
    festivals: ['Lễ hội Văn hóa Du lịch Gốm đỏ Mang Thít', 'Hội Chùa Tiên Châu'],
    artifacts: {
      regular: ['Bình Gốm Đỏ Đương Đại Mang Thít', 'Bó Khoai Lang Mật Bình Tân'],
      treasure: 'Mô Hình Lò Gạch Cổ Nung Đỏ Rực Mang Thít'
    },
    marketQuiz: {
      item: 'Bưởi Năm Roi Bình Minh',
      question: 'Bưởi Năm Roi trồng tại đất cù lao Vĩnh Long có đặc điểm gì đặc biệt khi chín?',
      options: ['Tép bưởi róc múi, hầu như không có hạt', 'Vỏ màu đỏ tươi như gấc', 'Có vị cay nồng', 'Hạt to như hạt mít'],
      correctAnswer: 0,
      marketHint: 'Múi bưởi vàng mọng, giòn ngọt dịu và róc múi không dính hạt.'
    },
    lat: 10.2537,
    lng: 105.9722,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/vinh-long'
  },
  {
    id: 'dongthap',
    name: 'Đồng Tháp',
    region: 'nam_bo',
    regionName: 'Nam Bộ',
    tileType: 'Kiến thức',
    heritage: 'Làng hoa kiểng Sa Đéc, Vườn Quốc gia Tràm Chim (Ramsar), Lăng Cụ Phó bảng',
    description: '"Tháp Mười đẹp nhất bông sen", vùng đất bình yên rợp bóng sen hồng, làng hoa Sa Đéc trăm năm tuổi và đàn sếu đầu đỏ quý hiếm bay lượn.',
    specialty: 'Nem Lai Vung, Hủ tiếu Sa Đéc, Bánh phồng tôm Sa Giang',
    festivals: ['Festival Hoa - Kiểng Sa Đéc', 'Lễ hội Sen Đồng Tháp'],
    artifacts: {
      regular: ['Hộp Nem Lai Vung Thơm Bùi', 'Gói Hủ Tiếu Bột Sa Đéc'],
      treasure: 'Cặp Lục Bình Gỗ Khắc Sếu Đầu Đỏ Tràm Chim'
    },
    marketQuiz: {
      item: 'Nem Lai Vung Đồng Tháp',
      question: 'Vị chua ngọt thơm lừng của chiếc nem Lai Vung Đồng Tháp được gói bằng lá gì?',
      options: ['Bọc bên trong bằng lá chùm ruột hoặc lá vông, ngoài gói lá chuối', 'Gói hoàn toàn bằng giấy bạc', 'Gói bằng lá sen khô', 'Gói bằng lá bưởi'],
      correctAnswer: 0,
      marketHint: 'Lá chùm ruột giúp nem lên men chua dịu và giữ màu hồng tươi thắm.'
    },
    lat: 10.4578,
    lng: 105.6322,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/dong-thap'
  },
  {
    id: 'angiang',
    name: 'An Giang',
    region: 'nam_bo',
    regionName: 'Nam Bộ',
    tileType: 'Thị trường',
    heritage: 'Miếu Bà Chúa Xứ Núi Sam (UNESCO di sản quốc gia), Rừng tràm Trà Sư',
    description: 'Vùng đất Thất Sơn huyền bí với dãy Bảy Núi điệp trùng, giao thoa văn hóa đặc sắc Kinh, Hoa, Chăm, Khmer cùng mùa nước nổi bồng bềnh hoa điên điển.',
    specialty: 'Mắm Châu Đốc, Bò bảy món Núi Sam, Thốt nốt An Giang',
    festivals: ['Lễ hội Vía Bà Chúa Xứ Núi Sam', 'Lễ hội Đua bò Bảy Núi An Giang'],
    artifacts: {
      regular: ['Hũ Mắm Thái Châu Đốc', 'Hũ Đường Thốt Nốt Thơm Lừng'],
      treasure: 'Đôi Sừng Bò Chiến Thắng Lễ Hội Đua Bò Bảy Núi'
    },
    marketQuiz: {
      item: 'Đường Thốt Nốt Bảy Núi An Giang',
      question: 'Đường thốt nốt nguyên chất được nấu từ bộ phận nào của cây thốt nốt?',
      options: ['Nước tiết ra từ cuống cụm hoa thốt nốt', 'Nước ép từ cùi quả thốt nốt chín', 'Nhựa cây chảy từ vỏ thân', 'Nấu từ rễ cây'],
      correctAnswer: 0,
      marketHint: 'Người thợ thoăn thoắt trèo lên ngọn cây cao vắt lấy từng giọt nước hoa thơm ngọt vào ống tre.'
    },
    lat: 10.3891,
    lng: 105.4218,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/an-giang'
  },
  {
    id: 'camau',
    name: 'Cà Mau',
    region: 'nam_bo',
    regionName: 'Nam Bộ',
    tileType: 'Thử thách',
    heritage: 'Mốc tọa độ quốc gia GPS 0001 Đất Mũi, Vườn Quốc gia Mũi Cà Mau & U Minh Hạ',
    description: 'Mảnh đất cuối cùng của Tổ quốc nơi đất nở ra và rừng biết đi, nơi ngắm mặt trời mọc ở biển Đông và lặn ở biển Tây, biểu tượng sức sống kiên cường.',
    specialty: 'Cua Cà Mau gạch son, Tôm khô Rạch Gốc, Mật ong rừng U Minh',
    festivals: ['Ngày hội Cua Cà Mau', 'Lễ hội Nghinh Ông Sông Đốc'],
    artifacts: {
      regular: ['Hũ Mật Ong Rừng Tràm U Minh Hạ', 'Dây Tôm Khô Rạch Gốc'],
      treasure: 'Biểu Tượng Con Thuyền No Gió Cột Mốc Mũi Cà Mau GPS 0001'
    },
    marketQuiz: {
      item: 'Cua Biển Cà Mau Gạch Son',
      question: 'Cua biển Cà Mau chắc nịch, thịt ngọt đậm đà nhất là nhờ môi trường sống nào?',
      options: ['Vùng nước lợ phù sa rừng ngập mặn trù phú thức ăn', 'Nuôi trong hồ nước ngọt', 'Được cho ăn cám công nghiệp', 'Sống ở vách đá ngầm đáy sâu'],
      correctAnswer: 0,
      marketHint: 'Nguồn khoáng chất và thức ăn tự nhiên dưới tán rừng đước tạo nên chất lượng cua trứ danh.'
    },
    lat: 9.1769,
    lng: 105.1524,
    qrCodeUrl: 'https://lacviet.edu.vn/tinh-thanh/ca-mau'
  }
];

export function getProvinceByName(name: string): ProvinceInfo | undefined {
  if (!name) return undefined;
  const aliases: Record<string, string> = { 'tp.hcm': 'tp. hồ chí minh', 'thừa thiên huế': 'huế' };
  const lower = aliases[name.toLowerCase().trim()] || name.toLowerCase().trim();
  return PROVINCES_DATA.find(p => 
    p.name.toLowerCase() === lower || 
    p.name.toLowerCase().includes(lower) ||
    lower.includes(p.name.toLowerCase())
  );
}

export function getProvinceById(id: string): ProvinceInfo | undefined {
  return PROVINCES_DATA.find(p => p.id === id);
}
