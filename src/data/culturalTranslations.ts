import type { BoardSpace } from '../types/game';
import type { ProvinceInfo } from './provinces';

// 1. PROVINCE NAME TRANSLATIONS
export const PROVINCE_EN_NAMES: Record<string, string> = {
  'Hà Nội': 'Hanoi',
  'Bắc Ninh': 'Bac Ninh',
  'Hưng Yên': 'Hung Yen',
  'Hải Phòng': 'Hai Phong',
  'Quảng Ninh': 'Quang Ninh',
  'Lạng Sơn': 'Lang Son',
  'Cao Bằng': 'Cao Bang',
  'Tuyên Quang': 'Tuyen Quang',
  'Thái Nguyên': 'Thai Nguyen',
  'Lào Cai': 'Lao Cai',
  'Lai Châu': 'Lai Chau',
  'Điện Biên': 'Dien Bien',
  'Sơn La': 'Son La',
  'Phú Thọ': 'Phu Tho',
  'Ninh Bình': 'Ninh Binh',
  'Thanh Hóa': 'Thanh Hoa',
  'Nghệ An': 'Nghe An',
  'Hà Tĩnh': 'Ha Tinh',
  'Quảng Trị': 'Quang Tri',
  'Huế': 'Hue',
  'Đà Nẵng': 'Da Nang',
  'Quảng Ngãi': 'Quang Ngai',
  'Gia Lai': 'Gia Lai',
  'Đắk Lắk': 'Dak Lak',
  'Khánh Hòa': 'Khanh Hoa',
  'Lâm Đồng': 'Lam Dong',
  'Đặc khu Hoàng Sa': 'Hoang Sa Islands',
  'Hoàng Sa': 'Hoang Sa Islands',
  'Đặc khu Trường Sa': 'Truong Sa Islands',
  'Trường Sa': 'Truong Sa Islands',
  'TP. Hồ Chí Minh': 'Ho Chi Minh City',
  'Đồng Nai': 'Dong Nai',
  'Tây Ninh': 'Tay Ninh',
  'Cần Thơ': 'Can Tho',
  'Vĩnh Long': 'Vinh Long',
  'Đồng Tháp': 'Dong Thap',
  'An Giang': 'An Giang',
  'Cà Mau': 'Ca Mau'
};

export function getProvinceName(name: string, lang: 'vi' | 'en' = 'vi'): string {
  if (lang === 'vi') return name;
  return PROVINCE_EN_NAMES[name] || name;
}

// 2. ALL 108 ARTIFACTS TRANSLATION
export const ARTIFACT_EN_NAMES: Record<string, string> = {
  // Hanoi
  'Bút Lông Văn Miếu': 'Temple of Literature Calligraphy Brush',
  'Tranh Hàng Trống': 'Hang Trong Folk Painting',
  'Chiếu Dời Đô Bằng Vàng': 'Golden Edict on Capital Relocation',

  // Bac Ninh
  'Nón Quai Thao Liền Chị': 'Quan Ho Broad-Brimmed Hat',
  'Tranh Đông Hồ Gà Lợn': 'Dong Ho Rooster & Pig Woodcut',
  'Bản Dập Sắc Phong Đền Đô': 'Do Temple Royal Decree Rubbing',

  // Hung Yen
  'Nhãn Lồng Hưng Yên Thượng Hạng': 'Premium Hung Yen Longan',
  'Gốm Men Ngọc Phố Hiến': 'Pho Hien Celadon Glaze Ceramic',
  'Thuyền Buôn Gỗ Thương Cảng Phố Hiến': 'Pho Hien Ancient Merchant Vessel',

  // Hai Phong
  'Mỏ Neo Thuyền Buôn Đất Cảng': 'Port City Ancient Merchant Anchor',
  'Hóa Thạch San Hô Cát Bà': 'Cat Ba Fossilized Coral',
  'Phù Hiệu Tàu Không Số Bến K15': 'K15 Wharf Unnumbered Vessel Insignia',

  // Quang Ninh
  'Trầm Tượng Non Thiêng Yên Tử': 'Yen Tu Sacred Mountain Agarwood Statue',
  'Viên Ngọc Trai Vịnh Hạ Long': 'Ha Long Bay Pearl',
  'Bảo Đao Bạch Đằng Giang Vạn Kiếp': 'Historic Bach Dang River Sacred Saber',

  // Lang Son
  'Búp Lá Mắc Mật Rừng': 'Wild Mac Mat Fragrant Leaves',
  'Đàn Tính Tày Nùng': 'Tay-Nung Tinh Gourd Lute',
  'Mảnh Đá Khắc Hịch Ải Chi Lăng': 'Chi Lang Pass Proclamation Engraved Stone',

  // Cao Bang
  'Khăn Chàm Thổ Cẩm Pác Bó': 'Pac Bo Indigo Brocade Scarf',
  'Túi Hạt Dẻ Trùng Khánh': 'Trung Khanh Roasted Chestnuts',
  'Bàn Đá Lịch Sử Bác Hồ Dịch Sử Đảng': 'Uncle Ho Historic Pac Bo Translation Stone Table',

  // Tuyen Quang
  'Đèn Kéo Quân Thành Tuyên': 'Thanh Tuyen Giant Shadow Lantern',
  'Hũ Rượu Men Lá Na Hang': 'Na Hang Leaf-Fermented Herbal Wine',
  'Cây Đa Tân Trào Khắc Son': 'Cinnabar-Carved Tan Trao Banyan Tree',

  // Thai Nguyen
  'Hộp Trà Móc Câu Tân Cương': 'Tan Cuong Special Hook-Shaped Tea',
  'Cối Ép Trà Gỗ Nghiến': 'Ironwood Hand Tea Press',
  'Ấm Tử Sa Dâng Trà Kháng Chiến ATK': 'ATK Resistance Zone Yixing Teapot',

  // Lao Cai
  'Chiếc Khèn Mông Bằng Trúc': 'Hmong Bamboo Khene',
  'Vải Lanh Nhuộm Chàm Sa Pa': 'Sa Pa Indigo-Dyed Hemp Fabric',
  'Chóp Inox Cột Mốc Fansipan 3.143m': 'Fansipan 3,143m Summit Pyramid Marker',

  // Lai Chau
  'Giỏ Lan Rừng Ô Quy Hồ': 'O Quy Ho Wild Mountain Orchid',
  'Vòng Bạc Thái Khắc Nổi': 'Embossed Thai Ethnic Silver Bangle',
  'Bia Cổ Vua Lê Thái Tổ Bên Bờ Sông Đà': 'King Le Thai To Historic Stele by Da River',

  // Dien Bien
  'Bó Hoa Ban Trắng Mường Phăng': 'Muong Phang White Bauhinia Blossoms',
  'Bát Cơm Gạo Tám Mường Thanh': 'Muong Thanh Fragrant Tam Rice Bowl',
  'Mảnh Cờ Quyết Chiến Quyết Thắng Đồi A1': 'Hill A1 Victory Flag Remnant',

  // Son La
  'Hộp Sữa Bò Thảo Nguyên Mộc Châu': 'Moc Chau Highland Pure Milk',
  'Cành Đào Tô Hiệu Đỏ Thắm': 'To Hieu Red Peach Blossom Branch',
  'Tua-bin Thuỷ Điện Sơn La Mô Hình Vàng': 'Golden Model Turbine of Son La Hydroelectric Dam',

  // Phu Tho
  'Cành Bưởi Đoan Hùng Ngát Hương': 'Doan Hung Aromatic Pomelo Branch',
  'Ống Nứa Thịt Chua Thanh Sơn': 'Thanh Son Sour Fermented Pork Bamboo Tube',
  'Trống Đồng Đền Hùng Hùng Vương Thánh Tích': 'Hung Temple Sacred Bronze Drum',

  // Ninh Binh
  'Tấm Cơm Cháy Vàng Giòn Ruộm': 'Crispy Golden Ninh Binh Scorched Rice',
  'Thuyền Nan Lướt Hang Tràng An': 'Trang An Cave Rowing Sampan',
  'Áo Bào Long Côn Cố Đô Hoa Lư': 'Hoa Lu Ancient Capital Royal Dragon Robe',

  // Thanh Hoa
  'Bó Nem Chua Lá Chuối Xanh': 'Fermented Pork Rolls in Fresh Banana Leaves',
  'Viên Đá Xây Thành Nhà Hồ': 'Ho Dynasty Citadel Architectural Megalith',
  'Thanh Thuận Thiên Kiếm Khởi Nghĩa Lam Sơn': 'Lam Son Uprising Thuan Thien Divine Sword',

  // Nghe An
  'Đóa Sen Hồng Kim Liên': 'Kim Lien Village Pink Lotus',
  'Hũ Nhút Thanh Chương Mặn Mòi': 'Thanh Chuong Traditional Salted Nhut Jackfruit',
  'Khung Cửi Gỗ Mẹ Hoàng Thị Loan': 'Mother Hoang Thi Loan Handloom Shuttles',

  // Ha Tinh
  'Miếng Kẹo Cu Đơ Giòn Rụm': 'Crispy Cu Do Peanut Molasses Candy',
  'Bản Chép Nôm Đoạn Trường Tân Thanh': 'Tale of Kieu Ancient Nom Script Manuscript',
  'Chiếc Chuông Đồng Cổ Ngã Ba Đồng Lộc': 'Dong Loc T-Junction Commemorative Bronze Bell',

  // Quang Tri
  'Cành Lá Trơơng Rừng Trường Sơn': 'Truong Son Range Wild Pepper Leaves',
  'Mảnh Đất Lửa Thành Cổ': 'Quang Tri Ancient Citadel Sacred Earth',
  'Cột Cờ Giới Tuyến Vĩ Tuyến 17 Bến Hải': '17th Parallel Ben Hai River Boundary Flagpole',

  // Hue
  'Bộ Đàn Tỳ Bà Nhã Nhạc': 'Royal Court Ty Ba Pipha',
  'Bát Cơm Hến Sông Hương': 'Perfume River Baby Basket Clam Rice',
  'Ấn Vàng Sắc Mệnh Chi Bảo Triều Nguyễn': 'Nguyen Dynasty Imperial Golden Seal',

  // Da Nang
  'Bức Tượng Vũ Nữ Apsara Bằng Đá': 'Sandstone Apsara Dancer Sculpture',
  'Mô Hình Cầu Rồng Thép': 'Steel Dragon Bridge Miniature',
  'Đài Thờ Trà Kiệu Bằng Đá Sa Thạch': 'Tra Kieu Sandstone Sacred Altar',

  // Quang Ngai
  'Bó Tỏi Cô Đơn Núi Lửa Lý Sơn': 'Ly Son Volcanic Solo Garlic',
  'Chiếc Thuyền Câu Hoàng Sa Bằng Gỗ': 'Traditional Hoang Sa Wooden Fishing Canoe',
  'Mô Hình Thuyền Nan Thế Lính Hoàng Sa Tâm Linh': 'Spiritual Paracel Fleet Soul Boat Model',

  // Gia Lai
  'Bộ Cồng Chiêng Đồng Cổ': 'Ancient Highland Bronze Gong Set',
  'Hũ Muối Kiến Vàng Rừng Krông Pa': 'Krong Pa Forest Yellow Weaver Ant Salt',
  'Cột Nhà Rông Gỗ Trắc Chạm Khắc Thần Mặt Trời': 'Rosewood Rong House Pillar with Sun God Carvings',

  // Dak Lak
  'Gùi Mây Dệt Thổ Cẩm Ê Đê': 'Ede Handwoven Rattan Brocade Backpack',
  'Túi Hạt Cà Phê Moka Thượng Hạng': 'Buon Ma Thuot Premium Moka Coffee Beans',
  'Chiếc Ngà Voi Hóa Thạch Vua Voi Ama Kông': 'King of Elephants Ama Kong Fossilized Tusk',

  // Khanh Hoa
  'Mẩu Trầm Hương Kỳ Nam': 'Sacred Ky Nam Calambac Agarwood',
  'Bát Yến Sào Đảo Hòn Nội': 'Hon Noi Island Swiftlet Bird Nest Bowl',
  'Tượng Nữ Thần Thiên Y A Na Bằng Vàng': 'Golden Statue of Goddess Thien Y A Na',

  // Lam Dong
  'Bình Rượu Vang Đà Lạt Hảo Hạng': 'Da Lat Vintage Red Wine',
  'Chậu Hoa Phong Lan Rừng Langbiang': 'Langbiang Wild Forest Orchid',
  'Vương Miện Tình Yêu Chàng K’Lang Nàng H’Biang': 'Legendary K’Lang & H’Biang Love Crown',

  // Hoang Sa
  'Mảnh San Hô Đỏ Biển Đông': 'East Sea Rare Red Coral Specimen',
  'Hải Bàn Đồng Hùng Binh Hoàng Sa': 'Hoang Sa Brave Guard Ancient Bronze Compass',
  'Mộc Bản Khắc Chiếu Dụ Xác Lập Chủ Quyền Hoàng Sa Vua Minh Mạng': 'King Minh Mang Imperial Woodblock on Paracel Sovereignty',

  // Truong Sa
  'Quả Bàng Vuông Trường Sa': 'Truong Sa Square-Fruit Barringtonia',
  'Vỏ Ốc Nón Biển Đảo Tiền Tiêu': 'Frontier Island Giant Cone Shell',
  'Lá Cờ Tổ Quốc Thấm Đẫm Gió Mặn Trường Sa': 'Truong Sa Salt-Breeze Weathered National Flag',

  // Ho Chi Minh City
  'Chiếc Bánh Mì Kẹp Giòn Rụm': 'Iconic Saigon Crispy Banh Mi',
  'Mô Hình Tháp Đồng Hồ Chợ Bến Thành': 'Ben Thanh Market Clock Tower Miniature',
  'Bản Đồ Cảng Sài Gòn 1911 Nơi Bác Ra Đi Cứu Nước': '1911 Saigon Port Historic Chart',

  // Dong Nai
  'Trái Bưởi Đường Da Cam Tân Triều': 'Tan Trieu Sweet Orange-Skin Pomelo',
  'Bút Lông Văn Miếu Trấn Biên': 'Tran Bien Temple of Literature Scholarly Brush',
  'Bản Đồ Hành Quân Mở Cõi Danh Tướng Nguyễn Hữu Cảnh': 'General Nguyen Huu Canh Frontier Expedition Map',

  // Tay Ninh
  'Hũ Muối Tôm Cay Nồng': 'Tay Ninh Spicy Shrimp Chili Salt',
  'Tấm Bánh Tráng Phơi Sương Trảng Bàng': 'Trang Bang Dew-Soaked Rice Paper',
  'Tượng Phật Bà Bằng Đồng Đỉnh Núi Bà Đen': 'Mount Ba Den Bronze Goddess of Mercy Statue',

  // Can Tho
  'Cây Bẹo Bán Hàng Chợ Nổi': 'Floating Market Advertising Bamboo Pole (Cay Beo)',
  'Đòn Bánh Tét Lá Cẩm Tím': 'Purple Magenta Leaf Cylindrical Sticky Rice Cake',
  'Đèn Cổ Nhà Cổ Bình Thủy Thế Kỷ 19': '19th-Century Binh Thuy Heritage House Antique Lamp',

  // Vinh Long
  'Bình Gốm Đỏ Đương Đại Mang Thít': 'Mang Thit Contemporary Red Terracotta Vase',
  'Bó Khoai Lang Mật Bình Tân': 'Binh Tan Sweet Honey Potatoes',
  'Mô Hình Lò Gạch Cổ Nung Đỏ Rực Mang Thít': 'Mang Thit Ancient Heritage Brick Kiln Miniature',

  // Dong Thap
  'Hộp Nem Lai Vung Thơm Bùi': 'Lai Vung Fermented Meat Bites',
  'Gói Hủ Tiếu Bột Sa Đéc': 'Sa Dec Rice Flour Tapioca Noodles',
  'Cặp Lục Bình Gỗ Khắc Sếu Đầu Đỏ Tràm Chim': 'Tram Chim Red-Crowned Crane Carved Wood Vases',

  // An Giang
  'Hũ Mắm Thái Châu Đốc': 'Chau Doc Shredded Papaya Fish Sauce (Mam Thai)',
  'Hũ Đường Thốt Nốt Thơm Lừng': 'That Son Aromatic Palmyra Palm Sugar',
  'Đôi Sừng Bò Chiến Thắng Lễ Hội Đua Bò Bảy Núi': 'Seven Mountains Bull Race Champion Horns',

  // Ca Mau
  'Hũ Mật Ong Rừng Tràm U Minh Hạ': 'U Minh Ha Wild Mangrove Honey',
  'Dây Tôm Khô Rạch Gốc': 'Rach Goc Sun-Dried Tiger Prawns',
  'Biểu Tượng Con Thuyền No Gió Cột Mốc Mũi Cà Mau GPS 0001': 'Cape Ca Mau GPS 0001 Wind-Filled Boat Landmark'
};

export function getArtifactName(name: string, lang: 'vi' | 'en' = 'vi'): string {
  if (lang === 'vi') return name;
  return ARTIFACT_EN_NAMES[name] || name;
}

// 3. 40 BOARD SPACES TRANSLATIONS (For GameBoard space inspection drawer)
export const BOARD_SPACES_EN: Record<number, { enSubtitle: string; enHeritageHighlight: string; enDescription: string }> = {
  0: {
    enSubtitle: 'Departure & Central Lost and Found',
    enHeritageHighlight: 'Milestone 0 - Departure on Vietnam Cultural Journey & Lost and Found',
    enDescription: 'Departure Station and central Lost & Found. Automatically verifies Victory condition and restores Token Skill. Answer 2 trivia questions (or serve as Tour Guide): 2/2 correct reclaims 1 artifact from Lost & Found; 1/2 gains 1 card.'
  },
  1: {
    enSubtitle: 'Thousand-Year Thang Long',
    enHeritageHighlight: 'Imperial Citadel of Thang Long & Temple of Literature',
    enDescription: 'Thousand-year-old capital of culture, political and cultural heart of Vietnam with 36 ancient guild streets and the UNESCO-listed Thang Long Citadel.'
  },
  2: {
    enSubtitle: 'Kinh Bac Folk Harmony',
    enHeritageHighlight: 'Bac Ninh Quan Ho Folk Songs (UNESCO Heritage)',
    enDescription: 'Cradle of lyrical Quan Ho folk songs, steeped in affection and celebrated at the vibrant Lim Festival every spring.'
  },
  3: {
    enSubtitle: 'Bustling Pho Hien Port',
    enHeritageHighlight: 'Pho Hien Relic Complex & Chu Dong Tu Temple',
    enDescription: 'Flourishing 17th-century international trading port celebrated by the historical saying "First Kinh Ky, Second Pho Hien".'
  },
  4: {
    enSubtitle: 'Red Flamboyant Port City',
    enHeritageHighlight: 'Cat Ba Archipelago (UNESCO World Heritage) & K15 Pier',
    enDescription: 'Dynamic seaport city renowned for scarlet flamboyant blossoms, Lan Ha Bay, and historic unnumbered vessels of the Sea Ho Chi Minh Trail.'
  },
  5: {
    enSubtitle: 'Natural World Wonder',
    enHeritageHighlight: 'Ha Long Bay (UNESCO World Heritage) & Sacred Mount Yen Tu',
    enDescription: 'World natural heritage Ha Long Bay, cradle of Truc Lam Zen Buddhism on sacred Mount Yen Tu, and legendary Bach Dang naval battlegrounds.'
  },
  6: {
    enSubtitle: 'Northern Frontier Stronghold',
    enHeritageHighlight: 'Chi Lang Historic Pass & Tam Thanh Grotto',
    enDescription: 'Strategic northern gateway holding epic historical victories at Chi Lang Pass, Tam Thanh sacred caves, and the steadfast Mother To Thi rock.'
  },
  7: {
    enSubtitle: 'Cradle of the Revolution',
    enHeritageHighlight: 'Pac Bo Special National Relic & Ban Gioc Waterfall',
    enDescription: 'Revolutionary sanctuary Pac Bo where Uncle Ho worked upon returning home, and majestic Ban Gioc - Southeast Asia\'s largest natural waterfall.'
  },
  8: {
    enSubtitle: 'Resistance Capital',
    enHeritageHighlight: 'Tan Trao Special National Relic & Giant Tuyen Quang Lanterns',
    enDescription: 'Capital of the liberated resistance zone, historic Tan Trao banyan tree, and the country\'s largest Mid-Autumn giant lantern festival.'
  },
  9: {
    enSubtitle: 'Premier Tea Region',
    enHeritageHighlight: 'Tan Cuong Tea Region & ATK Dinh Hoa Relic Complex',
    enDescription: 'Vietnam\'s finest tea capital with emerald rolling hills of Tan Cuong and the ATK Dinh Hoa national historical complex.'
  },
  10: {
    enSubtitle: 'Northern Vietnam Rest Stop',
    enHeritageHighlight: 'Northern Cultural Junction & Red River Delta Heritage',
    enDescription: 'Regional Rest Stop #1. Automatically unseals all artifacts in your pouch. Choose 1 of 4 privileges: draw Fortune card, draw Resource card, reset Token skill, or safely deposit up to 2 artifacts.'
  },
  11: {
    enSubtitle: 'Roof of Indochina',
    enHeritageHighlight: 'Fansipan Peak 3,143m & Sa Pa Terraced Rice Fields',
    enDescription: 'Magnificent Sa Pa terraced rice fields, Fansipan peak at 3,143m, colorful highland ethnic markets, and rich northern mountain cultures.'
  },
  12: {
    enSubtitle: 'Majestic O Quy Ho Pass',
    enHeritageHighlight: 'O Quy Ho Pass & Sin Suoi Ho Cultural Village',
    enDescription: 'Home to O Quy Ho - greatest of Vietnam\'s four grand passes, Putaleng peak, and idyllic highland ethnic community tourism villages.'
  },
  13: {
    enSubtitle: 'Epoch-Making Dien Bien',
    enHeritageHighlight: 'Dien Bien Phu Battlefield Complex (Hill A1, De Castries Bunker)',
    enDescription: 'World-renowned Dien Bien Phu battlefield, golden Muong Thanh rice valley, and fragrant white bauhinia blossoms.'
  },
  14: {
    enSubtitle: 'Moc Chau Green Plateau',
    enHeritageHighlight: 'Moc Chau Tea Hills & Son La Prison National Monument',
    enDescription: 'Vast Moc Chau dairy plateau, historic red peach tree of To Hieu, and Son La Hydroelectric Power Plant - giant of Southeast Asia.'
  },
  15: {
    enSubtitle: 'Ancestral Land of Hung Kings',
    enHeritageHighlight: 'Hung King Worship (UNESCO Heritage) & Xoan Singing',
    enDescription: 'Sacred ancestral land of the Vietnamese nation, birthplace of the Hung Kings dynasty and UNESCO-recognized Xoan singing.'
  },
  16: {
    enSubtitle: 'Hoa Lu Ancient Citadel',
    enHeritageHighlight: 'Trang An Scenic Landscape Complex (UNESCO Mixed Heritage)',
    enDescription: 'Trang An dual UNESCO heritage with karst towers, ancient Hoa Lu royal capital, and Tam Coc emerald waterways.'
  },
  17: {
    enSubtitle: 'Land of Kings and Rulers',
    enHeritageHighlight: 'Citadel of the Ho Dynasty (UNESCO) & Lam Kinh Relic Complex',
    enDescription: 'Magnificent Ho Dynasty stone citadel, cradle of the heroic Lam Son uprising, and legendary Sam Son coastline.'
  },
  18: {
    enSubtitle: 'Lotus Homeland of Uncle Ho',
    enHeritageHighlight: 'Kim Lien Sen Village & Nghe Tinh Vi Giam Folk Songs',
    enDescription: 'Birthplace of President Ho Chi Minh in Sen Village, soul of UNESCO Vi Giam folk chants, and resilient Nghe land.'
  },
  19: {
    enSubtitle: 'Land of Mount Hong and La River',
    enHeritageHighlight: 'Nguyen Du Memorial & Dong Loc T-Junction Monument',
    enDescription: 'Land of scholarly distinction, home of Great Poet Nguyen Du, sacred Huong Tich Pagoda, and the heroic Dong Loc T-junction monument.'
  },
  20: {
    enSubtitle: 'Central Vietnam Rest Stop',
    enHeritageHighlight: 'Central Heritage Road Junction',
    enDescription: 'Regional Rest Stop #2. Automatically unseals all artifacts in your pouch. Choose 1 of 4 privileges: draw Fortune card, draw Resource card, reset Token skill, or safely deposit up to 2 artifacts.'
  },
  21: {
    enSubtitle: 'Heroic Land of Fire',
    enHeritageHighlight: 'Quang Tri Ancient Citadel & Vinh Moc Tunnels',
    enDescription: 'Sacred historic land along Hien Luong Bridge on Ben Hai River, the 81-day Citadel defense, and Vinh Moc underground shelter system.'
  },
  22: {
    enSubtitle: 'Poetic Imperial City',
    enHeritageHighlight: 'Complex of Hue Monuments (UNESCO) & Royal Court Music',
    enDescription: 'Imperial capital of the Nguyen Dynasty, Perfume River, Ngu Binh mountain, and royal court cuisine and music.'
  },
  23: {
    enSubtitle: 'Most Livable Coastal City',
    enHeritageHighlight: 'Cham Sculpture Museum & Fire-Breathing Dragon Bridge',
    enDescription: 'Dynamic tourist metropolis with My Khe beach, Marble Mountains, Ba Na Hills, and the iconic Dragon Bridge.'
  },
  24: {
    enSubtitle: 'Kingdom of Ly Son Garlic',
    enHeritageHighlight: 'Ly Son Outpost Island & Sa Huynh Archaeological Culture',
    enDescription: 'Volcanic island of Ly Son, spiritual home of the historic Paracel Sovereignty Fleet, and ancient Sa Huynh civilization.'
  },
  25: {
    enSubtitle: 'The Eyes of Pleiku',
    enHeritageHighlight: 'Highland Gong Cultural Space (UNESCO) & Sea Lake T’Nung',
    enDescription: 'Legendary volcanic lake T’Nung, expansive rubber and coffee plantations, and echoing bronze gong ensembles.'
  },
  26: {
    enSubtitle: 'Coffee Capital of Vietnam',
    enHeritageHighlight: 'Buon Ma Thuot Coffee Capital & Don Village Heritage',
    enDescription: 'Global coffee hub Buon Ma Thuot, legendary elephant-taming Don Village, and thunderous Dray Nur and Dray Sap waterfalls.'
  },
  27: {
    enSubtitle: 'Land of Agarwood & Swiftlet Islets',
    enHeritageHighlight: 'Ponagar Cham Tower & Swiftlet Nest Harvesting',
    enDescription: 'Coastal city of Nha Trang with world-renowned bays, thousand-year-old Ponagar Cham Tower of ancient Champa civilization, and precious bird\'s nest harvesting.'
  },
  28: {
    enSubtitle: 'City of Eternal Spring & Mists',
    enHeritageHighlight: 'Langbiang Plateau & Da Lat French Colonial Heritage',
    enDescription: 'Romantic Da Lat highlands, pine forests, Datanla waterfall, and the legendary love story of K’Lang and H’Biang.'
  },
  29: {
    enSubtitle: 'Brave Guard Paracel Fleet',
    enHeritageHighlight: 'Sacred Hoang Sa Islands & Imperial Sovereignty Stele',
    enDescription: 'Sacred northern island territory, honoring brave seafaring patrols who planted sovereignty markers centuries ago.'
  },
  30: {
    enSubtitle: 'Southern Vietnam Rest Stop',
    enHeritageHighlight: 'Mekong & Southern Cultural Junction',
    enDescription: 'Regional Rest Stop #3. Automatically unseals all artifacts in your pouch. Choose 1 of 4 privileges: draw Fortune card, draw Resource card, reset Token skill, or safely deposit up to 2 artifacts.'
  },
  31: {
    enSubtitle: 'Maritime Frontier of the Motherland',
    enHeritageHighlight: 'Sacred Truong Sa Boundary Marker & Resilient Storm Trees',
    enDescription: 'Heroic archipelago defending national maritime sovereignty, symbol of steadfast courage amidst deep ocean storms.'
  },
  32: {
    enSubtitle: 'Pearl of the Far East',
    enHeritageHighlight: 'Nha Rong Wharf, Ben Thanh Market & Cu Chi Tunnels',
    enDescription: 'Vibrant economic locomotive of Vietnam, historic Nha Rong Wharf where Uncle Ho embarked on his journey, and bustling Ben Thanh Market.'
  },
  33: {
    enSubtitle: 'Cat Tien Forest Biosphere',
    enHeritageHighlight: 'Cat Tien National Park & Tran Bien Temple of Literature',
    enDescription: 'UNESCO Biosphere Reserve Cat Tien, Dong Nai River, ancient pottery kilns, and Tran Bien Temple of Literature.'
  },
  34: {
    enSubtitle: 'Roof of Southern Vietnam',
    enHeritageHighlight: 'Mount Ba Den 986m & Cao Dai Holy See',
    enDescription: 'Highest mountain in southern Vietnam with sacred Lady Buddha bronze statue, architectural Cao Dai Holy See, and Trang Bang dew-soaked rice paper.'
  },
  35: {
    enSubtitle: 'Red Pottery Kingdom',
    enHeritageHighlight: 'Mang Thit Red Ceramic Heritage & Tra On Floating Market',
    enDescription: 'Fabled kingdom of red brick and pottery kilns along Mang Thit River, lush orchards, and warm southern hospitality.'
  },
  36: {
    enSubtitle: 'Land of Pink Lotuses',
    enHeritageHighlight: 'Tram Chim National Park & Sa Dec Flower Village',
    enDescription: 'Mekong Delta lotus kingdom, winter sanctuary of red-crowned cranes in Tram Chim, and century-old Sa Dec flower village.'
  },
  37: {
    enSubtitle: 'Western Capital on the Mekong',
    enHeritageHighlight: 'Cai Rang Floating Market & Binh Thuy Antique House',
    enDescription: 'Vibrant heart of the Mekong Delta, famous Cai Rang floating market, lush fruit orchards, and poetic Ninh Kieu wharf.'
  },
  38: {
    enSubtitle: 'Seven Mountains Mystery',
    enHeritageHighlight: 'Lady Chua Xu Temple on Sam Mountain & Tra Su Cajuput Forest',
    enDescription: 'Mystical Seven Mountains region, sacred Lady Chua Xu Temple, emerald Tra Su flooded cajuput forest, and annual bull-racing festival.'
  },
  39: {
    enSubtitle: 'Southernmost Cape of Vietnam',
    enHeritageHighlight: 'Ca Mau Cape GPS 0001 & U Minh Ha Mangrove Forest',
    enDescription: 'Southern tip of Vietnam where waves kiss both the East and West Seas, home to the vast U Minh Ha biosphere reserve.'
  }
};

export function getBoardSpaceData(space: BoardSpace, lang: 'vi' | 'en' = 'vi') {
  if (lang === 'vi') {
    return {
      name: space.name,
      subtitle: space.subtitle,
      heritageHighlight: space.heritageHighlight,
      description: space.description
    };
  }
  const en = BOARD_SPACES_EN[space.index];
  return {
    name: space.enName || space.name,
    subtitle: en?.enSubtitle || space.subtitle,
    heritageHighlight: en?.enHeritageHighlight || space.heritageHighlight,
    description: en?.enDescription || space.description
  };
}

// 4. 36 PROVINCES CULTURAL DATA TRANSLATIONS (For CulturalMapTab)
export interface ProvinceEnDetails {
  enName: string;
  enHeritage: string;
  enDescription: string;
  enSpecialty: string;
  enFestivals: string[];
  enMarketItem: string;
  enMarketHint: string;
}

export const PROVINCES_EN_DATA: Record<string, ProvinceEnDetails> = {
  hanoi: {
    enName: 'Hanoi',
    enHeritage: 'Imperial Citadel of Thang Long, Temple of Literature, One Pillar Pagoda',
    enDescription: 'Thousand-year-old capital of culture, political and cultural heart of Vietnam with 36 ancient guild streets and an enduring scholarly heritage.',
    enSpecialty: 'Hanoi Pho, Bun Cha, Vong Village Green Flakes, West Lake Lotus Tea',
    enFestivals: ['Dong Da Mound Festival', 'Huong Pagoda Festival', 'Co Loa Citadel Festival'],
    enMarketItem: 'Royal Tribute Vong Village Green Flakes',
    enMarketHint: 'The aroma of fresh green flakes wrapped in West Lake lotus leaves embodies Hanoi\'s autumn soul.'
  },
  bacninh: {
    enName: 'Bac Ninh',
    enHeritage: 'Bac Ninh Quan Ho Folk Songs (UNESCO), Dau Pagoda, Do Temple',
    enDescription: 'Land of outstanding scholars and emperors in Kinh Bac, ancestral cradle of the heroic Ly Dynasty and lyrical Quan Ho duets.',
    enSpecialty: 'Dinh Bang Husband-and-Wife Cake (Phu The), Ninh Xa Nem, Van Village Wine',
    enFestivals: ['Lim Festival', 'Do Temple Festival', 'Dau Pagoda Festival'],
    enMarketItem: 'Dinh Bang Phu The Cake',
    enMarketHint: 'The name "Phu The" signifies the steadfast loyalty and harmony of married couples.'
  },
  hungyen: {
    enName: 'Hung Yen',
    enHeritage: 'Pho Hien Historical Complex, Chu Dong Tu Temple, Bell Pagoda',
    enDescription: 'Flourishing 16th-17th century international trading port celebrated as "First Kinh Ky, Second Pho Hien", rich in folklore and commerce.',
    enSpecialty: 'Hung Yen Sweet Longans, Dong Tao Dragon Chicken, Lotus Seed Longan Sweet Soup',
    enFestivals: ['Chu Dong Tu Festival', 'Pho Hien Folk Festival', 'An Xa Temple Festival'],
    enMarketItem: 'First-Grade Hung Yen Longan Fruit',
    enMarketHint: 'A royal tribute fruit renowned across East Asia for its thick, crisp pulp and exquisite sweetness.'
  },
  haiphong: {
    enName: 'Hai Phong',
    enHeritage: 'Cat Ba Archipelago (UNESCO World Heritage), K15 Pier, Le Chan Temple',
    enDescription: 'Dynamic seaport city known as the Red Flamboyant City, gateway to the Gulf of Tonkin, and starting point of the Sea Ho Chi Minh Trail.',
    enSpecialty: 'Hai Phong Crab Red Noodles (Banh Da Cua), Spicy Bread Sticks, Dried Squid',
    enFestivals: ['Do Son Water Buffalo Fighting Festival', 'Cat Ba Tourism Festival', 'Nu Tuong Le Chan Festival'],
    enMarketItem: 'Hai Phong Crab Rice Noodle Soup',
    enMarketHint: 'Traditional sun-dried brown rice noodles combined with sweet sea field crab broth.'
  },
  quangninh: {
    enName: 'Quang Ninh',
    enHeritage: 'Ha Long Bay (UNESCO Natural World Heritage), Mount Yen Tu, Van Don Ancient Port',
    enDescription: 'Home to the magnificent Ha Long Bay, sacred Yen Tu Truc Lam Zen Buddhist mountain, and heroic Bach Dang River naval battlegrounds.',
    enSpecialty: 'Hand-Pounded Ha Long Squid Patties, Tien Yen Hill Chicken, Sa Sung Worms',
    enFestivals: ['Yen Tu Spring Festival', 'Ha Long Carnival', 'Cua Ong Temple Festival'],
    enMarketItem: 'Ha Long Hand-Pounded Squid Patties',
    enMarketHint: 'Squid caught in Ha Long waters, hand-pounded in stone mortars to achieve ideal chewiness and sweetness.'
  },
  langson: {
    enName: 'Lang Son',
    enHeritage: 'Chi Lang Historic Pass, Tam Thanh Cave, Nhi Thanh Cave, Mother To Thi Rock',
    enDescription: 'Northern frontier stronghold with legendary military victories, limestone karst grottos, and vibrant Ky Lua border trade.',
    enSpecialty: 'Mac Mat Leaf Roast Duck, Khau Nhuc Steamed Pork, Cooc Mo Rice Cakes',
    enFestivals: ['Ky Cung - Ta Phu Festival', 'Dong Dang Mother Goddess Festival', 'Long Tong Spring Festival'],
    enMarketItem: 'Wild Mac Mat Roast Duck',
    enMarketHint: 'Crispy golden roasted duck infused with wild Mac Mat tree leaves and forest berries.'
  },
  caobang: {
    enName: 'Cao Bang',
    enHeritage: 'Pac Bo Special National Relic, Ban Gioc Waterfall, Non Nuoc Cao Bang Geopark',
    enDescription: 'Cradle of Vietnam\'s modern revolution, home to majestic Ban Gioc waterfall and UNESCO Non Nuoc Cao Bang Global Geopark.',
    enSpecialty: 'Cao Bang Steamed Rice Rolls in Broth, Trung Khanh Chestnuts, Seven-Flavor Roast Duck',
    enFestivals: ['Ban Gioc Waterfall Festival', 'Ky Sam Temple Festival', 'Nang Hai Folk Festival'],
    enMarketItem: 'Cao Bang Hot Soup Rice Rolls',
    enMarketHint: 'Steamed rice rolls eaten with warm bone broth and minced pork instead of dipping fish sauce.'
  },
  tuyenquang: {
    enName: 'Tuyen Quang',
    enHeritage: 'Tan Trao Special National Relic, Na Hang - Lam Binh Eco-Reserve',
    enDescription: 'Capital of the liberated revolutionary resistance zone and host of Vietnam\'s grandest Mid-Autumn festival with giant lanterns.',
    enSpecialty: 'Smoked Kitchen Buffalo Meat, Na Hang Wild Leaf Wine, Song Lo River Fish',
    enFestivals: ['Thanh Tuyen Mid-Autumn Festival', 'Ha Temple Festival', 'Na Hang Forest Festival'],
    enMarketItem: 'Smoked Kitchen Dried Buffalo Meat',
    enMarketHint: 'Marinated with wild Mac Khen pepper and slow-smoked over mountain wood fires.'
  },
  thainguyen: {
    enName: 'Thai Nguyen',
    enHeritage: 'Tan Cuong Premier Tea Region, ATK Dinh Hoa Relic, Museum of Vietnam Cultures',
    enDescription: 'Renowned capital of Vietnamese tea with scenic rolling hills, steel manufacturing history, and central resistance zone headquarters.',
    enSpecialty: 'Tan Cuong Special Hook Tea, Bo Dau Sticky Rice Cakes, Dinh Hoa Lam Rice',
    enFestivals: ['Tan Cuong Tea Cultural Festival', 'Bo Dau Banh Chung Festival', 'Long Tong Highland Festival'],
    enMarketItem: 'Tan Cuong Premium Spring Tea Buds',
    enMarketHint: 'Hand-picked "one bud, two leaves" harvested early in morning mists, releasing an aroma like roasted green rice.'
  },
  laocai: {
    enName: 'Lao Cai',
    enHeritage: 'Sa Pa Terraced Rice Fields, Fansipan Peak 3,143m, Bac Ha Highland Market',
    enDescription: 'Spectacular alpine landscapes, the highest peak in Indochina, and culturally rich highland ethnic communities.',
    enSpecialty: 'Bac Ha Horse Meat Stew (Thang Co), Sa Pa Salmon, Armpit Pork',
    enFestivals: ['Bac Ha Horse Racing Festival', 'Sa Pa Cloud Festival', 'Gau Tao Spring Festival'],
    enMarketItem: 'Bac Ha Horse Meat Thang Co Stew',
    enMarketHint: 'Simmered in giant iron pans with 12 traditional cardamom and herbal spices.'
  },
  laichau: {
    enName: 'Lai Chau',
    enHeritage: 'O Quy Ho Pass, Sin Suoi Ho Eco-Village, Putaleng Peak 3,049m',
    enDescription: 'Breathtaking high mountain ridges, pristine cloud-covered peaks, and award-winning community-based ecotourism villages.',
    enSpecialty: 'Mountain Armpit Pig, Pa Pinh Top Grilled River Fish, Dried Wild Buffalo',
    enFestivals: ['Kin Pang Then Folk Festival', 'Gau Tao Hmong Festival', 'Muong Te Forest Festival'],
    enMarketItem: 'Highland Free-Range Armpit Pig',
    enMarketHint: 'Naturally grazed on mountain slopes, yielding firm, lean meat and crispy skin.'
  },
  dienbien: {
    enName: 'Dien Bien',
    enHeritage: 'Dien Bien Phu Historic Battlefield (Hill A1, Bunker), Muong Phang Command',
    enDescription: 'Historic battlefield that shook the world in 1954, lush Muong Thanh rice fields, and blossoming white bauhinia hills.',
    enSpecialty: 'Muong Thanh Fragrant Tam Rice, Pa Pinh Top Fish, Dried Buffalo',
    enFestivals: ['Bauhinia Flower Festival (Le Hoi Hoa Ban)', 'En Grotto Festival', 'Then Kin Pang Festival'],
    enMarketItem: 'Muong Thanh Fragrant Tam Rice',
    enMarketHint: 'Grown on fertile alluvial plains nourished by the Nam Rom River.'
  },
  sonla: {
    enName: 'Son La',
    enHeritage: 'Moc Chau Highland Plateau, Son La Prison Monument, Son La Hydroelectric Dam',
    enDescription: 'Verdant green tea hills and dairy pastures of Moc Chau plateau, historic To Hieu peach tree, and immense hydroelectric energy.',
    enSpecialty: 'Moc Chau Fresh Milk, Northwest Dried Buffalo, Forest Bamboo Shoots',
    enFestivals: ['Moc Chau Tea Harvesting Festival', 'Thai Ethnic Xip Xi Festival', 'Pang A Festival'],
    enMarketItem: 'Moc Chau Highland Pure Milk',
    enMarketHint: 'Produced on cool misty plateaus over 1,000 meters above sea level.'
  },
  phutho: {
    enName: 'Phu Tho',
    enHeritage: 'Hung King Temple & Worship (UNESCO Heritage), Xoan Singing (UNESCO)',
    enDescription: 'Ancestral land of the Vietnamese nation, venerated at the Hung Kings temple and enriched by ancient ritual Xoan songs.',
    enSpecialty: 'Phu Tho Ear Cakes (Banh Tai), Thanh Son Sour Pork, Doan Hung Sweet Pomelo',
    enFestivals: ['Hung Kings Ancestral Anniversary (10th of 3rd Lunar Month)', 'Bach Hac Boat Race', 'Xoan An Thai Singing Festival'],
    enMarketItem: 'Phu Tho Traditional Banh Tai Cake',
    enMarketHint: 'Shaped like a curved ear, made from non-glutinous rice flour and fragrant pork filling.'
  },
  ninhbinh: {
    enName: 'Ninh Binh',
    enHeritage: 'Trang An Scenic Landscape Complex (UNESCO Mixed Heritage), Hoa Lu Ancient Capital',
    enDescription: 'Vietnam\'s first UNESCO mixed natural and cultural world heritage site, ancient capital of Dinh and Early Le dynasties.',
    enSpecialty: 'Ninh Binh Scorched Rice with Goat Sauce, Mountain Goat Meat, Kim Son Sticky Rice Wine',
    enFestivals: ['Hoa Lu Ancient Capital Festival', 'Trang An Festival', 'Bai Dinh Pagoda Spring Festival'],
    enMarketItem: 'Crispy Ninh Binh Scorched Rice',
    enMarketHint: 'Crisp golden sun-dried rice served with rich, fragrant mountain goat dipping sauce.'
  },
  thanhhoa: {
    enName: 'Thanh Hoa',
    enHeritage: 'Citadel of the Ho Dynasty (UNESCO World Heritage), Lam Kinh Historic Complex',
    enDescription: 'Land of outstanding dynastic founders, home to the unique megalithic Ho Dynasty stone citadel and Lam Son uprising relics.',
    enSpecialty: 'Thanh Hoa Fermented Pork Rolls (Nem Chua), Rang Bua Rice Cakes, Tu Tru Spiky Cake',
    enFestivals: ['Lam Kinh Victory Festival', 'Ba Trieu Temple Festival', 'Sam Son Sea Festival'],
    enMarketItem: 'Thanh Hoa Banana-Leaf Nem Chua',
    enMarketHint: 'Naturally fermented pork roll wrapped tightly in green banana leaves with chili and garlic.'
  },
  nghean: {
    enName: 'Nghe An',
    enHeritage: 'Kim Lien Sen Village (Uncle Ho Relic), Nghe Tinh Vi Giam Folk Songs (UNESCO)',
    enDescription: 'Homeland of President Ho Chi Minh, cradle of heroic scholar-patriots and soulful UNESCO-recognized Vi Giam river singing.',
    enSpecialty: 'Nghe Country Eel Soup & Congee, Thanh Chuong Salted Jackfruit (Nhut), Nam Dan Soybean Paste',
    enFestivals: ['Sen Village Cultural Festival', 'Cuong Temple Sea Festival', 'Con Pagoda Festival'],
    enMarketItem: 'Nghe Country Spicy River Eel Soup',
    enMarketHint: 'Prepared with fresh paddy eels, fragrant turmeric, mountain shallots, and spicy herbs.'
  },
  hatinh: {
    enName: 'Ha Tinh',
    enHeritage: 'Great Poet Nguyen Du Memorial, Dong Loc T-Junction Monument, Huong Tich Pagoda',
    enDescription: 'Land of scholarly heritage, cradle of author of The Tale of Kieu, and sacred Huong Tich Buddhist retreat on Hong Linh mountain.',
    enSpecialty: 'Ha Tinh Cu Do Peanut Molasses Candy, Phuc Trach Pomelo, Duc Tho Clam Noodles',
    enFestivals: ['Huong Tich Pagoda Spring Festival', 'Hai Thuong Lan Ong Festival', 'Chieu Trung Temple Festival'],
    enMarketItem: 'Crispy Ha Tinh Cu Do Candy',
    enMarketHint: 'Sweet sugarcane molasses, fresh ginger, and roasted peanuts sandwiched between crispy rice crackers.'
  },
  quangtri: {
    enName: 'Quang Tri',
    enHeritage: 'Quang Tri Ancient Citadel, Hien Luong Bridge on 17th Parallel, Vinh Moc Tunnels',
    enDescription: 'Historic land of heroic sacrifice and resilience, iconic 17th parallel demilitarized zone, and peaceful rebirth.',
    enSpecialty: 'Buffalo Meat with Wild Tro-ong Leaves, Mai Xa Mussel Noodles, Bedside Porridge',
    enFestivals: ['Peace Festival at Hien Luong Bridge', 'La Vang Basilica Pilgrimage', 'Ancient Citadel Memorial Festival'],
    enMarketItem: 'Buffalo Meat with Wild Tro-ong Leaves',
    enMarketHint: 'Tender buffalo meat stir-fried with fragrant wild pepper leaves native to Truong Son forests.'
  },
  hue: {
    enName: 'Hue',
    enHeritage: 'Complex of Hue Monuments (UNESCO), Royal Court Music (Nha Nhac UNESCO)',
    enDescription: 'Ancient imperial capital of the Nguyen Dynasty, royal citadel, Perfume River, and sophisticated aristocratic cuisine.',
    enSpecialty: 'Hue Spicy Beef Noodle Soup (Bun Bo Hue), River Baby Clam Rice, Royal Sweet Soups',
    enFestivals: ['Hue Festival', 'Hon Chen Temple Festival', 'Thuan An Marine Festival'],
    enMarketItem: 'Traditional Hue Spicy Beef Noodle Soup',
    enMarketHint: 'Simmered beef shank and pork knuckle broth fragrant with lemongrass, shrimp paste, and annatto.'
  },
  danang: {
    enName: 'Da Nang',
    enHeritage: 'Cham Sculpture Museum, Marble Mountains (Ngu Hanh Son), Fire-Breathing Dragon Bridge',
    enDescription: 'Dynamic coastal tourism metropolis bridging Central Vietnam, world-famous beaches, and ancient Champa sculpture collections.',
    enSpecialty: 'Da Nang Frog Quang Noodles (Mi Quang), Pork Rolled in Dew-Soaked Rice Paper',
    enFestivals: ['Da Nang International Fireworks Festival', 'Quan The Am Festival at Marble Mountains', 'Cau Ngu Whale Festival'],
    enMarketItem: 'Da Nang Frog Quang Noodles',
    enMarketHint: 'Flat turmeric rice noodles served with braised mountain frog meat, roasted peanuts, and crispy rice crackers.'
  },
  quangngai: {
    enName: 'Quang Ngai',
    enHeritage: 'Ly Son Outpost Island, Sa Huynh Archaeological Culture, Thien An Mountain Pagoda',
    enDescription: 'Volcanic island home of the historic royal Paracel fleet, ancient Sa Huynh maritime culture, and poetic Tra Khuc river.',
    enSpecialty: 'Ly Son Volcanic Solo Garlic, Don Clam Soup from Tra Khuc River, Malt Candy',
    enFestivals: ['Khao Le The Linh Hoang Sa Festival', 'An Hai Village Whale Festival', 'Ba Thien Y A Na Festival'],
    enMarketItem: 'Ly Son Volcanic Mineral Solo Garlic',
    enMarketHint: 'Nutrient-rich garlic grown on volcanic soil and coral sand, producing a single potent round clove.'
  },
  gialai: {
    enName: 'Gia Lai',
    enHeritage: 'Central Highland Gong Cultural Space (UNESCO), Sea Lake T’Nung (Volcanic Crater)',
    enDescription: 'Majestic basalt plateau, poetic Sea Lake in an extinct crater, and vibrant Jarai and Bahnar gong music and Rong houses.',
    enSpecialty: 'Pleiku Two-Bowl Pho (Dry Pho), Krong Pa Yellow Ant Salt, Sun-Dried One-Sun Beef',
    enFestivals: ['Gia Lai Gong Cultural Festival', 'Chu Dang Ya Wild Sunflower Festival', 'Water God Pơtao Festival'],
    enMarketItem: 'Pleiku Two-Bowl Dry Pho',
    enMarketHint: 'Served in two distinct bowls: one with tossed dry noodles and minced pork, one with hot fragrant beef broth.'
  },
  daklak: {
    enName: 'Dak Lak',
    enHeritage: 'Buon Ma Thuot Coffee Capital, Don Village Elephant Taming Heritage, Dray Nur Falls',
    enDescription: 'Global coffee capital, cradle of Ede and M’nong cultures, legendary elephant kings, and thunderous highland waterfalls.',
    enSpecialty: 'Buon Ma Thuot Heritage Coffee, Red Noodle Soup, Ban Don Grilled Chicken',
    enFestivals: ['Buon Ma Thuot Coffee Festival', 'Ban Don Elephant Race Festival', 'Ede New Rice Harvest Festival'],
    enMarketItem: 'Buon Ma Thuot Heritage Roasted Coffee',
    enMarketHint: 'Rich, bold Robusta and fragrant Arabica roasted to perfection on red basalt highlands.'
  },
  khanhhoa: {
    enName: 'Khanh Hoa',
    enHeritage: 'Ponagar Cham Towers, Hon Noi Swiftlet Islets, World-Renowned Nha Trang Bay',
    enDescription: 'Celebrated coastal paradise with world-class bays, thousand-year-old Champa towers, and prized agarwood and swiftlet nests.',
    enSpecialty: 'Nha Trang Grilled Pork Rolls (Nem Nuong), Hon Noi Bird\'s Nest, Jellyfish Vermicelli',
    enFestivals: ['Ponagar Tower Festival', 'Nha Trang Sea Festival', 'Hon Noi Swiftlet Nest Festival'],
    enMarketItem: 'Hon Noi Island Swiftlet Bird\'s Nest',
    enMarketHint: 'Nutrient-rich cave swiftlet nests harvested from sheer granite sea cliffs.'
  },
  lamdong: {
    enName: 'Lam Dong',
    enHeritage: 'Langbiang Biosphere Reserve, Da Lat French Heritage Architecture, Datanla Waterfall',
    enDescription: 'Misty plateau of Da Lat, pine forests, lakes, romantic waterfalls, high-tech floral agriculture, and Central Highland epic legends.',
    enSpecialty: 'Da Lat Artichoke Soup, Grilled Rice Paper (Vietnamese Pizza), Da Lat Red Wine',
    enFestivals: ['Da Lat Flower Festival', 'Langbiang Gong Cultural Festival', 'Tea and Silk Cultural Festival'],
    enMarketItem: 'Da Lat Whole Artichoke Stewed with Pork',
    enMarketHint: 'Refreshing, nutritious artichoke bulb slowly braised to extract gentle herbal sweetness.'
  },
  hoangsa: {
    enName: 'Hoang Sa Special Zone',
    enHeritage: 'Sacred Hoang Sa Islands, Imperial Sovereignty Marker, Navy Martyrs Memorial',
    enDescription: 'Sacred maritime territory of Vietnam in the East Sea, guarded by generations of brave naval and fishing patrols.',
    enSpecialty: 'Fresh Deep-Sea Tuna, Sun-Dried Flying Fish, Giant King Crabs',
    enFestivals: ['Khao Le The Linh Hoang Sa Memorial Ceremony', 'Cau Ngu Whale Festival', 'Traditional Boat Racing Festival'],
    enMarketItem: 'East Sea Fresh Flying Fish',
    enMarketHint: 'Harvested from pristine oceanic waters surrounding the sacred coral atolls.'
  },
  truongsa: {
    enName: 'Truong Sa Special Zone',
    enHeritage: 'Sacred National Boundary Markers, Resilient Storm Trees, Island Pagodas',
    enDescription: 'Strategic maritime frontier of the Motherland, where resilient soldiers and fishermen protect sovereign seas and skies.',
    enSpecialty: 'Truong Sa Square-Fruit Barringtonia Tea, Sea Cucumber, Flying Fish',
    enFestivals: ['Truong Sa Ocean Festival', 'Whale Worship Ceremony', 'Island Lantern Festival'],
    enMarketItem: 'Truong Sa Square-Fruit Barringtonia Souvenir',
    enMarketHint: 'Symbol of resilient strength thriving through harsh ocean winds and salty spray.'
  },
  tphcm: {
    enName: 'Ho Chi Minh City',
    enHeritage: 'Nha Rong Wharf, Ben Thanh Market, Cu Chi Tunnels, Central Post Office',
    enDescription: 'Dynamic economic and financial locomotive of Vietnam, historic port where Uncle Ho began his search for national liberation.',
    enSpecialty: 'Saigon Crispy Banh Mi, Broken Rice with Grilled Pork (Com Tam), Saigon Iced Coffee',
    enFestivals: ['Saigon River Water Festival', 'Southern Fruit Festival', 'Nguyen Hue Flower Street Festival'],
    enMarketItem: 'Iconic Saigon Crispy Banh Mi',
    enMarketHint: 'Warm, crispy baguette filled with paté, roasted meats, pickles, cilantro, and chili.'
  },
  dongnai: {
    enName: 'Dong Nai',
    enHeritage: 'Cat Tien National Park (UNESCO Biosphere Reserve), Tran Bien Temple of Literature',
    enDescription: 'Prime ecological haven, Dong Nai river basin, Tran Bien Temple of Literature, and industrial development hub.',
    enSpecialty: 'Tan Trieu Sweet Pomelo, Cat Tien Fresh River Fish, Long Khanh Durian',
    enFestivals: ['Tan Trieu Pomelo Festival', 'Sayangva Choro Festival', 'Tran Bien Temple Festival'],
    enMarketItem: 'Tan Trieu Sweet Pomelo Salad',
    enMarketHint: 'Tender sweet pomelo segments tossed with shredded river shrimp and aromatic herbs.'
  },
  tayninh: {
    enName: 'Tay Ninh',
    enHeritage: 'Mount Ba Den 986m, Cao Dai Holy See, Dau Tieng Lake',
    enDescription: 'Highest mountain in Southern Vietnam with monumental Lady Buddha bronze statue, sacred Cao Dai architecture, and sun-dried specialties.',
    enSpecialty: 'Trang Bang Dew-Soaked Rice Paper, Tay Ninh Shrimp Chili Salt, Vegetarian Delicacies',
    enFestivals: ['Ba Den Mountain Spring Festival', 'Great Festival of Duc Chi Ton', 'Yen Thao Mother Goddess Banquet'],
    enMarketItem: 'Trang Bang Dew-Soaked Rice Paper with Boiled Pork',
    enMarketHint: 'Handmade rice paper baked over embers and exposed to midnight dew to achieve signature softness.'
  },
  cantho: {
    enName: 'Can Tho',
    enHeritage: 'Cai Rang Floating Market, Binh Thuy 19th-Century Heritage House, Ninh Kieu Wharf',
    enDescription: 'Heart and soul of the Mekong Delta, famous floating markets, winding waterways, and fertile orchards.',
    enSpecialty: 'Purple Leaf Cylindrical Sticky Rice Cake (Banh Tet), Cai Rang Grilled Pork Skewers',
    enFestivals: ['Southern Traditional Cake Festival', 'Cai Rang Floating Market Tourism Festival', 'Ninh Kieu Lantern Festival'],
    enMarketItem: 'Can Tho Purple Magenta Banh Tet',
    enMarketHint: 'Sticky rice naturally tinted purple with magenta leaves, filled with savory mung bean and salted egg.'
  },
  vinhlong: {
    enName: 'Vinh Long',
    enHeritage: 'Mang Thit Red Ceramic Kiln Complex, Tra On Floating Market, An Binh Ecotourism Islet',
    enDescription: 'Fabled "Kingdom of Red Ceramics" with thousands of brick kilns along the river, lush fruit gardens, and folk arts.',
    enSpecialty: 'Tra On Water Clam Pancakes, Mang Thit Elephant Ear Fish, Nam Roi Pomelo',
    enFestivals: ['Mang Thit Red Heritage Festival', 'Tra On Temple Festival', 'An Binh Fruit Festival'],
    enMarketItem: 'Deep-Fried Elephant Ear Fish on An Binh Islet',
    enMarketHint: 'Crispy scale-on fish rolled with fresh herbs in rice paper and dipped in tamarind sauce.'
  },
  dongthap: {
    enName: 'Dong Thap',
    enHeritage: 'Tram Chim National Park (Ramsar Site), Sa Dec Flower Village, Xeo Quyt Relic',
    enDescription: 'Land of pink lotuses, winter haven for rare red-crowned cranes, and century-old Sa Dec flower village.',
    enSpecialty: 'Lai Vung Fermented Pork (Nem Lai Vung), Sa Dec Tapioca Rice Noodles, Lotus Root Salad',
    enFestivals: ['Dong Thap Lotus Festival', 'Sa Dec Flower Festival', 'Go Thap Archaeological Festival'],
    enMarketItem: 'Lai Vung Authentic Nem Bites',
    enMarketHint: 'Sweet, sour, and garlicky pork bites wrapped in fragrant guava leaves and banana skins.'
  },
  angiang: {
    enName: 'An Giang',
    enHeritage: 'Lady Chua Xu Temple on Sam Mountain, Tra Su Cajuput Forest, Oc Eo Archaeological Culture',
    enDescription: 'Mystic Seven Mountains region, sacred Sam Mountain pilgrimage, ancient Oc Eo kingdom artifacts, and lively bull races.',
    enSpecialty: 'Chau Doc Fermented Fish (Mam Chau Doc), That Son Palmyra Palm Sugar Cake, Chau Doc Fish Noodle Soup',
    enFestivals: ['Lady Chua Xu Sam Mountain Festival', 'Bay Nui Bull Racing Festival', 'Chau Doc Ramadan Festival'],
    enMarketItem: 'That Son Honeyed Palmyra Palm Sugar Cake',
    enMarketHint: 'Steamed rice cake infused with sweet nectar harvested from tall palmyra palm trees.'
  },
  camau: {
    enName: 'Ca Mau',
    enHeritage: 'Ca Mau Cape GPS 0001 Landmark, U Minh Ha Mangrove Forest (UNESCO Biosphere)',
    enDescription: 'Southernmost tip of Vietnam where mangrove forests meet ocean waves, home to world-renowned mud crabs and wild honey.',
    enSpecialty: 'Nam Can Mud Crab, Rach Goc Sun-Dried Tiger Prawns, U Minh Ha Grilled Mudfish in Straw',
    enFestivals: ['Ca Mau Crab Festival', 'Nghinh Ong Song Doc Festival', 'U Minh Forest Honey Festival'],
    enMarketItem: 'Steamed Nam Can Giant Sea Mud Crab',
    enMarketHint: 'Firm, sweet sea crabs caught in mangrove estuaries where tidal waters mix.'
  }
};

export function getProvinceData(p: ProvinceInfo, lang: 'vi' | 'en' = 'vi') {
  if (lang === 'vi') {
    return {
      name: p.name,
      regionName: p.regionName,
      heritage: p.heritage,
      description: p.description,
      specialty: p.specialty,
      festivals: p.festivals,
      marketItem: p.marketInfo.item,
      marketHint: p.marketInfo.marketHint
    };
  }
  const en = PROVINCES_EN_DATA[p.id];
  return {
    name: en?.enName || getProvinceName(p.name, 'en'),
    regionName: p.region === 'bac_bo' ? 'North' : p.region === 'trung_bo' ? 'Central' : 'South',
    heritage: en?.enHeritage || p.heritage,
    description: en?.enDescription || p.description,
    specialty: en?.enSpecialty || p.specialty,
    festivals: en?.enFestivals || p.festivals,
    marketItem: en?.enMarketItem || p.marketInfo.item,
    marketHint: en?.enMarketHint || p.marketInfo.marketHint
  };
}

// 5. BI KIP SCROLL SNIPPET TRANSLATIONS
export const BIKIP_SNIPPET_EN: Record<string, string> = {};

export function getBiKipSnippet(bk: { id?: string; questionSnippet?: string; enQuestionSnippet?: string }, lang: 'vi' | 'en' = 'vi'): string {
  if (lang === 'vi') return bk.questionSnippet || '';
  if (bk.enQuestionSnippet) return bk.enQuestionSnippet;
  if (bk.id && BIKIP_SNIPPET_EN[bk.id]) return BIKIP_SNIPPET_EN[bk.id];
  if (bk.questionSnippet && BIKIP_SNIPPET_EN[bk.questionSnippet]) return BIKIP_SNIPPET_EN[bk.questionSnippet];
  return bk.questionSnippet || '';
}
