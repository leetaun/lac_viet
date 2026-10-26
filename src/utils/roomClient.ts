export async function roomRequest(body: Record<string, unknown>) {
  const response = await fetch('/api/qr-room', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(12000) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Không thể kết nối phòng.');
  return data;
}
export function readRoomIdentity(role: 'host' | 'guest'): any {
  try { return JSON.parse(localStorage.getItem(`lacviet.qr.${role}`) || 'null'); } catch { return null; }
}
export function saveRoomIdentity(role: 'host' | 'guest', value: any) { localStorage.setItem(`lacviet.qr.${role}`, JSON.stringify(value)); }
