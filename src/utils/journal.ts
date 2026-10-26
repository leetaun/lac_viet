import type { Player } from '../types/game';

export interface JourneyJournal {
  name: string;
  artifacts: { name: string; province: string; region: string; safe: boolean; sealed: boolean; treasure: boolean }[];
  knowledge: NonNullable<Player['journey']>;
}
export const buildJournal = (player: Player): JourneyJournal => ({
  name: player.name,
  artifacts: player.artifactItems.map(a=>({name:a.name,province:a.province,region:a.region,safe:a.storage==='safe',sealed:a.isSealed,treasure:a.isTreasure})),
  knowledge: player.journey || [],
});
export async function journalUrl(player: Player): Promise<string> {
  const bytes=new TextEncoder().encode(JSON.stringify(buildJournal(player)));
  const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate'));
  const compressed=new Uint8Array(await new Response(stream).arrayBuffer());
  let binary='';for(const byte of compressed)binary+=String.fromCharCode(byte);
  return `${location.origin}${location.pathname}#journal=${encodeURIComponent(btoa(binary))}`;
}
export async function readJournal(hash: string): Promise<JourneyJournal> {
  const binary=atob(decodeURIComponent(hash.replace(/^#journal=/,'')));
  const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
  const parsed=JSON.parse(await new Response(stream).text());
  if(typeof parsed.name!=='string' || !Array.isArray(parsed.artifacts) || !Array.isArray(parsed.knowledge))throw Error('Sổ hành trình không hợp lệ.');
  return parsed;
}
export function downloadJournal(player: Player) {
  const url=URL.createObjectURL(new Blob([JSON.stringify(buildJournal(player),null,2)],{type:'application/json;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='so-hanh-trinh-lac-viet.json';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
