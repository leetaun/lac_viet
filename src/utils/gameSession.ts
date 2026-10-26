import type { GameState } from '../types/game';
export const GAME_SESSION_KEY='lacviet.game.v1';
export function loadGameSession(): GameState | null {
  try {
    if(typeof localStorage==='undefined')return null;
    const record=JSON.parse(localStorage.getItem(GAME_SESSION_KEY)||'null');
    if(record?.schema!==1)return null;
    const state=record.state;
    if(!state || typeof state.sessionId!=='string'||!Number.isSafeInteger(state.revision)||!Array.isArray(state.players)||state.players.length<2||state.players.length>4||!Number.isInteger(state.activePlayerIndex)||state.activePlayerIndex<0||state.activePlayerIndex>=state.players.length)return null;
    if(!['setup','playing','game_over'].includes(state.gameStatus)||!state.options||!Array.isArray(state.lostAndFound)||!Array.isArray(state.milestones)||!Array.isArray(state.historyLog))return null;
    for(const p of state.players)if(typeof p.id!=='string'||typeof p.name!=='string'||!Number.isInteger(p.position)||p.position<0||p.position>39||!Array.isArray(p.artifactItems)||!Array.isArray(p.biKipCards)||!Array.isArray(p.cards?.resource)||!Array.isArray(p.cards?.fortune)||!Array.isArray(p.cards?.knowledge))return null;
    return state;
  }catch{return null;}
}
export function saveGameSession(state: GameState): boolean {
  try { if(typeof localStorage==='undefined')return false;localStorage.setItem(GAME_SESSION_KEY,JSON.stringify({schema:1,state}));return true; }catch{return false;}
}
