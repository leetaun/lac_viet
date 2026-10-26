import { TokenDef, TokenType } from '../types/game';

export const TOKENS: Record<TokenType, TokenDef> = {
  non_la: {
    id: 'non_la',
    name: 'Nón Lá',
    enName: 'Conical Hat',
    icon: '👒',
    passive: 'Che mưa (Miễn phạt 01 lần)',
    enPassive: 'Rain Shelter (Immune to 1 penalty)',
    color: '#0284C7',
    description: 'Miễn phạt 01 lần: khi thua Thử thách (không bị rơi Kỷ vật về Kho thất lạc) hoặc khi chịu tác động từ 1 thẻ Sự kiện xấu. Hệ thống tự động hỏi ngay khi chịu phạt.',
    timing: 'Tự động kích hoạt khi chịu hình phạt hoặc thẻ Sự kiện xấu'
  },
  hoa_sen: {
    id: 'hoa_sen',
    name: 'Hoa Sen',
    enName: 'Lotus Blossom',
    icon: '🪷',
    passive: 'Thanh lọc (Bỏ 2 thẻ đổi 1 thẻ tùy chọn)',
    enPassive: 'Purification (Discard 2 cards for 1 chosen)',
    color: '#EC4899',
    description: 'Bỏ 2 thẻ bài bất kỳ trong túi đồ số để nhận 1 thẻ ngẫu nhiên thuộc loại tự chọn (Kiến thức, Tài nguyên hoặc May mắn).',
    timing: 'Kích hoạt tại Bước 1 (Chuẩn bị) trong lượt của mình'
  },
  den_long: {
    id: 'den_long',
    name: 'Đèn Lồng',
    enName: 'Lantern',
    icon: '🏮',
    passive: 'Soi đường (Xem trước & Đổi đề 1 lần)',
    enPassive: 'Wayfinder (Preview & Reroll challenge)',
    color: '#F59E0B',
    description: 'Xem trước đề bài Kiến thức hoặc Thử thách, đồng thời được quyền đổi đề 01 lần nếu đề bài quá khó (bắt buộc làm đề mới).',
    timing: 'Kích hoạt sau khi chọn ô nhưng trước khi bấm trả lời'
  },
  banh_mi: {
    id: 'banh_mi',
    name: 'Bánh Mì',
    enName: 'Vietnamese Banh Mi',
    icon: '🥖',
    passive: 'Tiện đường (Tiến hoặc Lùi 1 ô)',
    enPassive: 'On the Way (Shift +/- 1 space)',
    color: '#EA580C',
    description: 'Cho phép Token tiến hoặc lùi thêm 01 ô trên bàn cờ vật lý và Web, sau đó thực hiện toàn bộ nhiệm vụ tại ô mới dừng.',
    timing: 'Kích hoạt ngay sau khi gieo xúc xắc ở Bước 2'
  }
};
