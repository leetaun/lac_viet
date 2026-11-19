export interface RoomStore {
  read(code: string): Promise<string | null>;
  compareAndSet(code: string, before: number | null, payload: string, expiresAt: number): Promise<boolean>;
}

// Explicit test/local backend. Never used as a production fallback.
export function memoryRoomStore(): RoomStore {
  const rooms = new Map<string, { payload: string; expiresAt: number }>();
  return {
    async read(code) {
      const item = rooms.get(code);
      if (!item || item.expiresAt <= Date.now()) { rooms.delete(code); return null; }
      return item.payload;
    },
    async compareAndSet(code, before, payload, expiresAt) {
      const item = rooms.get(code);
      const current = item && item.expiresAt > Date.now() ? JSON.parse(item.payload).version : null;
      if (current !== before) return false;
      rooms.set(code, { payload, expiresAt }); return true;
    },
  };
}

export function supabaseRoomStore(): RoomStore {
  const endpoint = () => {
    const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
    const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Máy chủ chưa được cấu hình Supabase cho phòng online.');
    if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)) throw new Error('SUPABASE_URL không hợp lệ.');
    return { url, key };
  };
  const request = async (path: string, init: RequestInit = {}) => {
    const { url, key } = endpoint();
    const response = await fetch(`${url}/rest/v1/${path}`, { ...init, headers: { apikey: key, ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}), 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Không truy cập được dữ liệu phòng online. Kiểm tra cấu hình máy chủ và SQL Supabase.');
    return response.json();
  };
  return {
    async read(code) {
      const rows = await request(`lacviet_online_rooms?code=eq.${encodeURIComponent(code)}&select=payload,expires_at`);
      const row = rows[0];
      return row && new Date(row.expires_at).getTime() > Date.now() ? JSON.stringify(row.payload) : null;
    },
    async compareAndSet(code, before, payload, expiresAt) {
      return await request('rpc/lacviet_online_cas', { method: 'POST', body: JSON.stringify({ p_code: code, p_before: before, p_payload: JSON.parse(payload), p_expires_at: new Date(expiresAt).toISOString() }) }) === true;
    },
  };
}
