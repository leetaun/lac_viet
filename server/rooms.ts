import { randomBytes, createHash } from 'node:crypto';
import bank from '../src/data/questionBank.json' with { type: 'json' };

type Snapshot = { key: string; kind: string; province: string; player: string; questionId?: string; title?: string; description?: string; seconds?: number };
type Room = { host: string; guest: string; snapshot: Snapshot | null; command: any; result: any; deadline: number; version: number };
const memory = new Map<string, string>();
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const token = () => randomBytes(24).toString('hex');
const questions = (bank as any).questions as any[];
async function redis(args: unknown[]) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const auth = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !auth) throw new Error('Chưa kết nối Redis cho phòng QR trên Vercel.');
  const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' }, body: JSON.stringify(args) });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error('Không kết nối được kho phòng QR.');
  return data.result;
}
export function createRoomService(local = false) {
  const read = async (key: string) => local ? memory.get(key) || null : await redis(['GET', key]);
  const write = async (key: string, before: string | null, after: string) => {
    if (local) { if ((memory.get(key) || null) !== before) return false; memory.set(key, after); return true; }
    return !!await redis(['EVAL', "local old=redis.call('GET',KEYS[1]); if (old or '')~=ARGV[1] then return 0 end; redis.call('SET',KEYS[1],ARGV[2],'EX',21600); return 1", 1, key, before || '', after]);
  };
  return async (body: any) => {
    if (!body || typeof body.action !== 'string') throw new Error('Yêu cầu không hợp lệ.');
    if (body.action === 'create') {
      for (let i = 0; i < 5; i++) {
        const code = randomBytes(5).toString('hex').toUpperCase(); const hostToken = token();
        const room: Room = { host: hash(hostToken), guest: token(), snapshot: null, command: null, result: null, deadline: 0, version: 0 };
        if (await write(`lacviet:qr:${code}`, null, JSON.stringify(room))) return { code, hostToken };
      }
      throw new Error('Không tạo được phòng. Hãy thử lại.');
    }
    const code = String(body.code || '').trim().toUpperCase();
    if (!/^[A-F0-9]{10}$/.test(code)) throw new Error('Mã phòng gồm 10 ký tự.');
    const key = `lacviet:qr:${code}`;
    for (let attempt = 0; attempt < 8; attempt++) {
      const raw = await read(key); if (!raw) throw new Error('Phòng không tồn tại hoặc đã hết hạn.');
      const room: Room = JSON.parse(raw);
      const host = typeof body.hostToken === 'string' && hash(body.hostToken) === room.host;
      const guest = typeof body.guestToken === 'string' && body.guestToken === room.guest;
      if (body.action === 'join') return { guestToken: room.guest };
      if (['publish','host','ack'].includes(body.action) ? !host : !guest) throw new Error('Không có quyền truy cập phòng.');
      let response: any = { ok: true }; let changed = false;
      if (body.action === 'publish') {
        const s = body.snapshot as Snapshot | null;
        if (s && (typeof s.key !== 'string' || typeof s.province !== 'string' || !['knowledge','challenge','resource','fortune'].includes(s.kind))) throw new Error('Nhiệm vụ không hợp lệ.');
        if (s?.questionId && !questions.some(q => q.id === s.questionId)) throw new Error('Không tìm thấy câu hỏi.');
        if (room.snapshot?.key !== s?.key) { room.command = null; room.result = null; room.deadline = s?.seconds ? Date.now() + s.seconds * 1000 : 0; }
        room.snapshot = s; changed = true;
      } else if (body.action === 'host') {
        const q=questions.find(q=>q.id===room.snapshot?.questionId);
        if(q&&room.deadline&&Date.now()>room.deadline&&!room.result){
          room.result={key:room.snapshot!.key,answer:-1,success:false,correctAnswer:q.correctAnswer,explanation:q.explanation};
          room.command={id:token(),type:'answer',...room.result};changed=true;
          response={command:room.command,result:room.result};
        }else return { command: room.command, result: room.result };
      }
      else if (body.action === 'ack') { if (room.command?.id === body.id) { room.command = null; changed = true; } }
      else if (body.action === 'read') {
        const s = room.snapshot; const q = questions.find(q => q.id === s?.questionId);
        return { snapshot: s ? { ...s, question: q ? { question: q.question, options: q.options } : null } : null, deadline: room.deadline, serverTime: Date.now(), result: room.result };
      } else if (body.action === 'open') {
        const s = room.snapshot;
        if (!s || s.questionId || s.key !== body.key || s.kind !== body.kind || s.province !== body.province) throw new Error('Chọn đúng loại thẻ và tỉnh đang chờ trên laptop.');
        if (!['basic','intermediate','advanced'].includes(body.difficulty)) throw new Error('Độ khó không hợp lệ.');
        if (!room.command) { room.command = { id: token(), type: 'open', key: s.key, kind: s.kind, province: s.province, difficulty: body.difficulty }; changed = true; }
      } else if (body.action === 'answer') {
        const s = room.snapshot; const q = questions.find(q => q.id === s?.questionId);
        if (!s || !q || s.key !== body.key) throw new Error('Câu hỏi đã thay đổi.');
        if (room.result) return { result: room.result };
        const index = body.answer;
        if (!Number.isInteger(index) || index < -1 || index > 3) throw new Error('Đáp án không hợp lệ.');
        const timedOut = !!room.deadline && Date.now() > room.deadline;
        room.result = { key: s.key, answer: timedOut ? -1 : index, success: !timedOut && index === q.correctAnswer, correctAnswer: q.correctAnswer, explanation: q.explanation };
        room.command = { id: token(), type: 'answer', ...room.result }; changed = true; response = { result: room.result };
      } else throw new Error('Thao tác không hợp lệ.');
      if (!changed) return response;
      room.version++;
      if (await write(key, raw, JSON.stringify(room))) return response;
    }
    throw new Error('Phòng đang cập nhật, hãy thử lại.');
  };
}
