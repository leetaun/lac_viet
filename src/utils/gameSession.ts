import type { GameState, GameCard } from '../types/game';
import { QUESTION_BANK, QUESTION_SET_ID, bankGameCard } from '../data/questionBank';
import { uid } from '../engine/rules';

export function migrateQuestionSet(state: GameState): GameState {
  if(state.questionSetId===QUESTION_SET_ID)return state;
  const ids=state.options.questionIds?.filter(id=>QUESTION_BANK.some(q=>q.id===id));
  const allowed=ids && ids.length>=2 ? ids : undefined;
  const pool=allowed?QUESTION_BANK.filter(q=>allowed.includes(q.id)):QUESTION_BANK;
  const question=(group: 'knowledge'|'challenge'|'market'|'festival',topic?:string)=>({...((pool.find(q=>q.topic===topic))||pool[0]),group});
  const card=(old:GameCard):GameCard=>{
    if(old.type==='knowledge'||old.type==='challenge')return {...bankGameCard(question(old.type,old.topic),old.province),id:old.id};
    if(old.type==='resource'&&old.marketQuestion)return {...old,marketQuestion:question('market',old.marketQuestion.topic)};
    if(old.type==='fortune'&&old.contestQuestion)return {...old,contestQuestion:question('festival',old.contestQuestion.topic)};
    return old;
  };
  return {...state,questionSetId:QUESTION_SET_ID,revision:(state.revision||0)+1,seenBankQuestions:[],questionDifficulty:'basic',
    options:{...state.options,questionIds:allowed},
    players:state.players.map(p=>({...p,cards:{knowledge:p.cards.knowledge.map(c=>card(c) as typeof c),resource:p.cards.resource.map(c=>card(c) as typeof c),fortune:p.cards.fortune.map(c=>card(c) as typeof c)},
      biKipCards:p.biKipCards.map(b=>{const {questionSnippet,enQuestionSnippet,...rest}=b;return {...rest,title:'Bí kíp đã lưu',enTitle:'Saved Bi Kip'};})})),
    currentActionModal:state.currentActionModal?{...state.currentActionModal,card:state.currentActionModal.card?{...card(state.currentActionModal.card),id:uid('updated_task')}:undefined}:null
  };
}
export const GAME_SESSION_KEY='lacviet.game.v1';
// A saved match is resumed only on the same calendar day in Vietnam.
export function gameSessionDay(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function loadGameSession(now = new Date()): GameState | null {
  try {
    if(typeof localStorage==='undefined')return null;
    const record=JSON.parse(localStorage.getItem(GAME_SESSION_KEY)||'null');
    if(record?.schema!==1)return null;
    // Older saves without a date also expire on the first visit after this update.
    if(record.savedDay!==gameSessionDay(now)) {
      localStorage.removeItem(GAME_SESSION_KEY);
      return null;
    }
    const state=record.state;
    if(!state || typeof state.sessionId!=='string'||!Number.isSafeInteger(state.revision)||!Array.isArray(state.players)||state.players.length<2||state.players.length>4||!Number.isInteger(state.activePlayerIndex)||state.activePlayerIndex<0||state.activePlayerIndex>=state.players.length)return null;
    if(!['setup','playing','game_over'].includes(state.gameStatus)||!state.options||!Array.isArray(state.lostAndFound)||!Array.isArray(state.milestones)||!Array.isArray(state.historyLog))return null;
    for(const p of state.players)if(typeof p.id!=='string'||typeof p.name!=='string'||!Number.isInteger(p.position)||p.position<0||p.position>39||!Array.isArray(p.artifactItems)||!Array.isArray(p.biKipCards)||!Array.isArray(p.cards?.resource)||!Array.isArray(p.cards?.fortune)||!Array.isArray(p.cards?.knowledge))return null;
    const migrated=migrateQuestionSet(state);
    if(migrated!==state)saveGameSession(migrated,now);
    return migrated;
  }catch{return null;}
}
export function saveGameSession(state: GameState, now = new Date()): boolean {
  try { if(typeof localStorage==='undefined')return false;localStorage.setItem(GAME_SESSION_KEY,JSON.stringify({schema:1,savedDay:gameSessionDay(now),state}));return true; }catch{return false;}
}
