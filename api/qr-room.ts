import { createRoomService } from '../server/rooms';
const service = createRoomService();
export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Chỉ hỗ trợ POST.' });
  try { return res.status(200).json(await service(typeof req.body === 'string' ? JSON.parse(req.body) : req.body)); }
  catch (error) { return res.status(400).json({ error: error instanceof Error ? error.message : 'Không thể kết nối phòng.' }); }
}
