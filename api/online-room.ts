import { createOnlineRoomService } from '../server/onlineRooms.js';
import { supabaseRoomStore } from '../server/onlineStore.js';

const service = createOnlineRoomService(supabaseRoomStore());
export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ hỗ trợ POST.' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (JSON.stringify(body).length > 32000) return res.status(413).json({ error: 'Yêu cầu quá lớn.' });
    return res.status(200).json(await service(body));
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Không thể kết nối phòng online.' });
  }
}
