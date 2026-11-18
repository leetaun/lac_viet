import { CARD_PACKS, type CardPack } from '../data/cardPacks';
export const CARD_LIBRARY_KEY = 'lacviet.library.v1';
export interface CardLibrary { version: 1; packs: string[]; questions: string[]; }
const empty = (): CardLibrary => ({version:1, packs:[], questions:[]});
export function readCardLibrary(): CardLibrary {
  try {
    const value = JSON.parse(localStorage.getItem(CARD_LIBRARY_KEY) || 'null');
    if (value?.version !== 1 || !Array.isArray(value.packs) || !Array.isArray(value.questions)) return empty();
    const packs = CARD_PACKS.filter(p => value.packs.includes(p.id));
    return {version:1,packs:packs.map(p=>p.id),questions:[...new Set<string>(value.questions.filter((id: unknown) => typeof id === 'string' && packs.some(p=>p.questionIds.includes(id))))]};
  } catch { return empty(); }
}
export function saveCardLibrary(library: CardLibrary): void {
  localStorage.setItem(CARD_LIBRARY_KEY, JSON.stringify(library));
}
export function activatePack(library: CardLibrary, code: string): CardLibrary {
  const pack = CARD_PACKS.find(p => p.code === code.trim().toUpperCase());
  if (!pack) throw new Error('Mã bộ không tồn tại / Unknown pack code.');
  return {...library,packs:[...new Set([...library.packs,pack.id])]};
}
export function integrateCard(library: CardLibrary, hash: string): CardLibrary {
  const params = new URLSearchParams(hash.replace(/^#/,''));
  const pack = CARD_PACKS.find(p => p.id === params.get('pack'));
  const id = params.get('item');
  if (!pack || !id || !pack.questionIds.includes(id)) throw new Error('QR không hợp lệ hoặc sai bộ / Invalid card QR.');
  if (!library.packs.includes(pack.id)) throw new Error('Hãy kích hoạt bộ trước / Activate this pack first.');
  return {...library,questions:[...new Set([...library.questions,id])]};
}
export function packCardUrl(pack: CardPack, id: string, base: string): string {
  if (!pack.questionIds.includes(id)) throw new Error('Thẻ không thuộc bộ.');
  const url = new URL(base); url.hash = new URLSearchParams({pack:pack.id,item:id}).toString(); return url.toString();
}
