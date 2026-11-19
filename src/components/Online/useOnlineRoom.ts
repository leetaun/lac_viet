import { useCallback, useEffect, useRef, useState } from 'react';
import { onlineRequest, readOnlineIdentity, saveOnlineIdentity } from '../../utils/onlineClient';
import type { OnlineIdentity, OnlineRoomView } from '../../types/online';

export function useOnlineRoom() {
  const [identity, setIdentity] = useState(readOnlineIdentity);
  const [room, setRoom] = useState<OnlineRoomView | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const live = useRef(room); live.current = room;
  const accept = useCallback((next: OnlineRoomView) => {
    if (!live.current || live.current.code !== next.code || live.current.version <= next.version) { live.current = next; setRoom(next); }
  }, []);
  const connect = (who: OnlineIdentity, next: OnlineRoomView) => { saveOnlineIdentity(who); setIdentity(who); live.current = next; setRoom(next); setError(''); };
  const forget = () => { saveOnlineIdentity(null); setIdentity(null); live.current = null; setRoom(null); setError(''); };
  useEffect(() => {
    if (!identity) return;
    let stopped = false, timer: ReturnType<typeof setTimeout>, lastHeartbeat = 0;
    const poll = async () => {
      try {
        const heartbeat = Date.now() - lastHeartbeat > 20000;
        const response = await onlineRequest({ ...identity, action: heartbeat ? 'heartbeat' : 'read', ...(heartbeat ? { requestId: crypto.randomUUID() } : {}) });
        if (heartbeat) lastHeartbeat = Date.now();
        if (!stopped) { accept(response.room); setError(''); }
      } catch (e) { if (!stopped) setError((e as Error).message); }
      if (!stopped) timer = setTimeout(poll, document.hidden ? 4000 : 1000);
    };
    void poll(); return () => { stopped = true; clearTimeout(timer); };
  }, [identity?.code, identity?.memberId, accept]);
  const mutate = async (body: Record<string, unknown>) => {
    if (!identity || !live.current) throw new Error('Chưa kết nối phòng.');
    const requestId = crypto.randomUUID();
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await onlineRequest({ ...identity, version: live.current.version, requestId, ...body });
        accept(response.room); setError(''); return response.room;
      } catch (e) {
        if (attempt < 2 && (e as Error).message.includes('vừa thay đổi')) {
          const fresh = await onlineRequest({ ...identity, action: 'read' }); accept(fresh.room); continue;
        }
        setError((e as Error).message); throw e;
      }
    }
    throw new Error('Phòng đang cập nhật.');
  };
  const command = async (method: string, args: any[] = []) => {
    setBusy(true);
    try {
      const response = await mutate({ action: 'command', method, args });
      const id = response.pendingRequest;
      if (!id) return response.panel?.result;
      // Decisions may belong to a different player. Polling keeps them actionable.
      const started = Date.now();
      while (live.current?.pendingRequest === id && Date.now() - started < 180000) await new Promise(resolve => setTimeout(resolve, 100));
      if (live.current?.completedRequest === id) return live.current.panel?.result;
      throw new Error('Lựa chọn vẫn đang chờ. Bạn có thể tiếp tục trong phòng.');
    } finally { setBusy(false); }
  };
  return { identity, room, error, setError, busy, connect, forget, mutate, command };
}
