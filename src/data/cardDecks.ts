import { copyCard, weightedDraw } from '../engine/rules.js';
import type { ResourceCard, FortuneCard, BiKipCard } from '../types/game';
import { QUESTION_BANK } from './questionBank.js';

export const STARTER_BIKIP_CARDS: BiKipCard[] = [QUESTION_BANK[0],QUESTION_BANK[30],QUESTION_BANK[60],QUESTION_BANK[1]].map(q=>({
  id:`starter_${q.id}`,title:`Bí kíp: ${q.topic==='history'?'Lịch sử':q.topic==='culture'?'Văn hóa':'Địa lý'}`,
  enTitle:`Bi Kip: ${q.topic==='history'?'History':q.topic==='culture'?'Culture':'Geography'}`,topic:q.topic,
  topicName:q.topic==='history'?'Lịch sử':q.topic==='culture'?'Văn hóa':'Địa lý',enTopicName:q.topic==='history'?'History':q.topic==='culture'?'Culture':'Geography',questionSnippet:q.question
}));
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
