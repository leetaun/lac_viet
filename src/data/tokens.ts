import { TokenDef, TokenType } from '../types/game';

export const TOKENS: Record<TokenType, TokenDef> = {
  non_la: {
    id: 'non_la',
    name: 'Nón Lá',
    enName: 'Conical Hat',
    icon: '👒',
    passive: 'Miễn nhiễm 1 lần phạt',
    enPassive: 'Immune to 1 penalty',
    color: '#0284C7', // Xanh lam thanh bình
    description: 'Biểu tượng của sự che chở, chịu thương chịu khó. Khi trả lời sai thử thách, miễn phạt rớt kỷ vật về ô START 1 lần mỗi vòng chơi.'
  },
  hoa_sen: {
    id: 'hoa_sen',
    name: 'Hoa Sen',
    enName: 'Lotus Blossom',
    icon: '🪷',
    passive: 'Đổi 2 thẻ trên tay lấy 1 thẻ mới',
    enPassive: 'Exchange 2 cards for 1 new card',
    color: '#EC4899', // Hồng sen tao nhã
    description: 'Quốc hoa tượng trưng cho sự thuần khiết và linh hoạt. Cho phép người chơi hoán đổi 2 lá bài không cần thiết trên tay để bốc 1 lá bài mới từ bất kỳ bộ thẻ nào.'
  },
  den_long: {
    id: 'den_long',
    name: 'Đèn Lồng',
    enName: 'Lantern',
    icon: '🏮',
    passive: 'Xem trước 1 thẻ thử thách',
    enPassive: 'Preview next challenge card',
    color: '#F59E0B', // Vàng đèn rực rỡ
    description: 'Ánh sáng tri thức soi đường của phố cổ Hội An. Cho phép người chơi soi trước nội dung câu hỏi/thử thách sắp tới để chuẩn bị thẻ kiến thức đối ứng.'
  },
  banh_mi: {
    id: 'banh_mi',
    name: 'Bánh Mì',
    enName: 'Vietnamese Banh Mi',
    icon: '🥖',
    passive: 'Tiến hoặc lùi 1 ô để né bẫy/chọn ô',
    enPassive: 'Step +1 or -1 space to evade trap',
    color: '#EA580C', // Cam giòn ấm áp
    description: 'Ẩm thực đường phố nổi tiếng thế giới, mang tinh thần năng động. Cho phép điều chỉnh vị trí vừa gieo xúc xắc tiến hoặc lùi 1 ô để chọn ô lợi thế.'
  }
};

