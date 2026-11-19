import type { OnlineIdentity, OnlineRoomView } from '../types/online';
import { gameSessionDay } from './gameSession';

const key = 'lacviet.online.identity.v1';
export function readOnlineIdentity(): OnlineIdentity | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    if (value?.day !== gameSessionDay() || !/^[A-HJ-NP-Z2-9]{6}$/.test(value.code) || typeof value.memberId !== 'string' || typeof value.token !== 'string') return null;
    return { code: value.code, memberId: value.memberId, token: value.token };
  } catch { return null; }
}
export function saveOnlineIdentity(identity: OnlineIdentity | null) {
  if (identity) localStorage.setItem(key, JSON.stringify({ ...identity, day: gameSessionDay() }));
  else localStorage.removeItem(key);
}
export const newJoinToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), n => n.toString(16).padStart(2, '0')).join('');
export async function onlineRequest(body: Record<string, unknown>): Promise<{ room: OnlineRoomView; identity?: OnlineIdentity }> {
  const response = await fetch('/api/online-room', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
  let data;
  try { data = await response.json(); } catch { throw new Error('Không kết nối được máy chủ phòng online.'); }
  if (!response.ok || data.error) throw new Error(data.error || 'Kết nối phòng bị gián đoạn.');
  return data;
}
