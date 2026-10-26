import { useEffect, useRef, useState } from 'react';
import type { ArtifactGoal, ArtifactItem, BiKipCard, BoardSpace, CardResolution, FortuneCard, GameCard, GameMode, GameModeRule, GameState, Player, ResourceCard } from '../types/game';
import type { RuleChoice } from '../components/Modals/RuleChoiceModal';
import { BOARD_SPACES } from '../data/boardData';
import { STARTER_BIKIP_CARDS, drawFortuneCard, drawResourceCard } from '../data/cardDecks';
import { addCard, canWin, copyCard, deposit, failChallenge, finishTurn, pouchCards, isProtected, normalizePlayer, placeMilestone, reclaim, removeCards, spendBiKip, timedRanking, transferCard, uid, useCard } from './rules';
import { drawLocalQuestion, makeArtifact, makeBiKip, provinceAt, randomItem } from './content';
import { soundManager } from '../utils/sound';
import { bankGameCard, pickBankQuestion, QuestionDifficulty } from '../data/questionBank';
import type { PhysicalCardKind } from '../utils/physicalQR';
import { GAME_SESSION_KEY, loadGameSession, saveGameSession } from '../utils/gameSession';

export interface SetupConfig {
  mode: GameMode; gameModeRule: GameModeRule; playerCount: number; artifactGoal: ArtifactGoal;
  players: Player[]; roomCode?: string;
  options: GameState['options']; durationMinutes?: number;
}

export function useGameController(defaultPlayers: Player[], animationMs = 700) {
  const initial: GameState = { mode: 'offline', gameModeRule: 'toc_chien', players: defaultPlayers, activePlayerIndex: 0, firstPlayerIndex: 0, artifactGoal: 3, round: 1, turnStep: 1, diceValue: null, hasRolled: false, gameStatus: 'setup', winner: null, lostAndFound: [], milestones: [], options: { starterBiKip: false, exploreMode: false, timedMode: false }, currentActionModal: null, historyLog: ['Chào mừng đến với Boardgame Lạc Việt!'] };
  const [gameState, render] = useState<GameState>(()=>loadGameSession() || initial);
  const state = useRef(gameState);
  const [activeCardModal, setActiveCardModal] = useState<GameCard | null>(()=>gameState.currentActionModal?.type==='card_drawn' ? gameState.currentActionModal.card || null : null);
  const [activeCornerStation, setActiveCornerStation] = useState<BoardSpace | null>(()=>gameState.currentActionModal?.type==='corner_choice' || gameState.currentActionModal?.type==='quiz_start' ? BOARD_SPACES[gameState.currentActionModal.spaceIndex || 0] : null);
  const [activeStealTarget, setActiveStealTarget] = useState<Player | null>(()=>gameState.currentActionModal?.type==='steal_interaction' ? gameState.currentActionModal.targetPlayer || null : null);
  const [showTokenSkillModal, setShowTokenSkillModal] = useState(gameState.currentActionModal?.type==='token_skill');
  const [isRolling, setIsRolling] = useState(false);
  const [choice, setChoice] = useState<RuleChoice | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const answer = useRef<((ids: string[]) => void) | null>(null);
  const busy = useRef(false);
  const epoch = useRef(0);
  const pendingDestination = useRef<number | null>(gameState.remainingDestination ?? null);
  const afterCard = useRef<(() => Promise<void>) | null>(null);
  const lanternCard = useRef<GameCard | null>(gameState.currentActionModal?.type==='token_skill' ? gameState.currentActionModal.card||null : null);
  const lanternUsed = useRef(gameState.currentActionModal?.previewAccepted===true);
  const movement = useRef<{ roll: number; old: number; isExtra: boolean } | null>(gameState.pendingDiceMovement||null);
  const currentCard = useRef<GameCard | null>(activeCardModal);
  const actor = () => state.current.players[state.current.activePlayerIndex];
  const update = (fn: (prev: GameState) => GameState) => {
    const next=fn(state.current);
    state.current={...next,revision:(state.current.revision||0)+1};
    saveGameSession(state.current); render(state.current);
  };
  const restore = (saved: GameState) => {
    epoch.current++; answer.current?.([]); answer.current=null;setChoice(null);
    state.current=saved; render(saved);
    const modal=saved.currentActionModal;
    const card=modal?.type==='card_drawn' ? modal.card || null : null;
    currentCard.current=card;setActiveCardModal(card);
    setActiveCornerStation(modal?.type==='corner_choice'||modal?.type==='quiz_start' ? BOARD_SPACES[modal.spaceIndex||0] : null);
    setActiveStealTarget(modal?.type==='steal_interaction' ? modal.targetPlayer||null : null);
    pendingDestination.current=saved.remainingDestination??null;
    lanternCard.current=modal?.type==='token_skill'?modal.card||null:null;lanternUsed.current=modal?.previewAccepted===true;movement.current=saved.pendingDiceMovement||null;setShowTokenSkillModal(modal?.type==='token_skill');
  };
  useEffect(()=>{
    if(typeof window==='undefined')return;
    const listener=(event: StorageEvent)=>{
      if(event.key!==GAME_SESSION_KEY)return;
      const saved=loadGameSession();
      if(saved && saved.sessionId===state.current.sessionId && (saved.revision||0)>(state.current.revision||0))restore(saved);
    };
    window.addEventListener('storage',listener);return()=>window.removeEventListener('storage',listener);
  },[]);
  const log = (text: string) => update(s => ({ ...s, historyLog: [...s.historyLog, text] }));
  const updatePlayer = (id: string, fn: (p: Player) => Player) => update(s => ({ ...s, players: s.players.map(p => p.id === id ? normalizePlayer(fn(p)) : p) }));
  const ask = async (title: string, options: RuleChoice['options'], player = actor(), min = 1, max = 1, description?: string): Promise<string[]> => {
    if (!options.length) return [];
    if (player.isAI) return options.slice(0,min).map(o => o.id);
    const version = epoch.current;
    const ids = await new Promise<string[]>(resolve => { answer.current = resolve; setChoice({ id: uid('choice'), title, options, min, max, description }); });
    if (version !== epoch.current) throw new Error('Ván chơi đã thay đổi.');
    return ids;
  };
  const confirmChoice = (ids: string[]) => {
    if (!choice || ids.length < choice.min || ids.length > choice.max || new Set(ids).size !== ids.length || ids.some(id => !choice.options.some(o=>o.id===id))) return;
    const resolve = answer.current; answer.current = null; setChoice(null); resolve?.(ids);
  };
  const run = (fn: () => Promise<void> | void) => async () => {
    if (busy.current) return;
    const latest=loadGameSession();
    if(latest && latest.sessionId===state.current.sessionId && (latest.revision||0)>(state.current.revision||0)) { restore(latest);setNotice('Ván chơi vừa được cập nhật ở tab khác. Hãy tiếp tục từ trạng thái mới.');return; }
    busy.current = true;
    const version=epoch.current;
    try { await fn(); } catch (error) { if(version===epoch.current) setNotice(error instanceof Error ? error.message : 'Không thể thực hiện thao tác.'); }
    finally { busy.current = false; }
  };
  const cardOptions = (p: Player) => pouchCards(p).map(c => ({ id: c.id, label: 'name' in c ? c.name : c.title }));
  const chooseCards = (p: Player, count: number, title: string) => ask(title, cardOptions(p), p, count, count);
  const yesNo = async (title: string, player = actor(), description?: string) => (await ask(title,[{id:'yes',label:'Đồng ý'},{id:'no',label:'Bỏ qua'}],player,1,1,description))[0] === 'yes';
  const chooseDeck = async () => (await ask('Chọn loại thẻ thưởng',[{id:'resource',label:'Thẻ Tài nguyên'},{id:'fortune',label:'Thẻ May mắn'}]))[0] as 'resource' | 'fortune';
  const draw = (deck: 'resource' | 'fortune') => deck === 'resource' ? drawResourceCard(state.current.options.exploreMode) : drawFortuneCard(state.current.options.exploreMode);
  const grantArtifact = (id: string, province: string, chance = 0.1) => {
    const artifact = makeArtifact(province,chance);
    updatePlayer(id,p => ({ ...p, artifactItems: [...p.artifactItems, artifact] }));
    return artifact;
  };
  const defend = async (target: Player, shield: boolean, description: string) => {
    const options: RuleChoice['options'] = [];
    if (shield && target.cards.resource.some(c=>c.category==='shield')) options.push({id:'shield',label:'Dùng Lá chắn'});
    if (target.cards.fortune.some(c=>c.eventType==='negate')) options.push({id:'negate',label:'Dùng Vô hiệu'});
    if (!options.length) return undefined;
    options.push({id:'none',label:'Không dùng thẻ phòng vệ'});
    const result = (await ask(`${target.name}: phòng vệ`,options,target,1,1,description))[0];
    return result === 'none' ? undefined : result as 'shield' | 'negate';
  };
  const consumeDefense = (target: Player, defense: 'shield' | 'negate') => {
    const card = defense === 'shield' ? target.cards.resource.find(c=>c.category==='shield')! : target.cards.fortune.find(c=>c.eventType==='negate')!;
    updatePlayer(target.id,p=>removeCards(p,[card.id]));
  };
  const negateSkill = async (exclude: string[] = []) => {
    for (const opponent of state.current.players.filter(p=>p.id!==actor().id && !exclude.includes(p.id))) {
      if (!opponent.cards.fortune.some(c=>c.eventType==='negate')) continue;
      if (await yesNo(`${opponent.name}: dùng Vô hiệu chặn kỹ năng ${actor().name}?`,opponent)) {
        consumeDefense(opponent,'negate'); return true;
      }
    }
    return false;
  };
  const startWin = () => {
    if (!canWin(actor(),state.current.artifactGoal,state.current.gameModeRule)) return false;
    update(s=>({ ...s, winner:actor(), gameStatus:'game_over' })); soundManager.playVictory(); return true;
  };
  const completeTask = async () => {
    const continuation = afterCard.current; afterCard.current = null;
    if (continuation) await continuation();
    else update(s=>({ ...s,turnStep:5,currentActionModal:null,pendingPhysicalCard:null }));
  };
  const showCard = (card: GameCard) => {
    currentCard.current = card; setActiveCardModal(card);
    update(s=>({...s,currentActionModal:{type:'card_drawn',card}}));
  };
  const seenQuestion = (id: string) => update(s=>({...s,seenBankQuestions:[...(s.seenBankQuestions||[]).filter(old=>old!==id),id]}));
  const openLocalTask = async (space: BoardSpace, difficulty: QuestionDifficulty = state.current.questionDifficulty || 'basic') => {
    update(s=>({...s,pendingPhysicalCard:null,questionDifficulty:difficulty,currentActionModal:null}));
    if(space.type==='knowledge'||space.type==='challenge') {
      const question=pickBankQuestion(space.type,difficulty,state.current.seenBankQuestions||[]);
      seenQuestion(question.id);
      const card=bankGameCard(question,space.province!);
      if(actor().token==='den_long' && actor().tokenSkillAvailable) { lanternCard.current=card;lanternUsed.current=false;update(s=>({...s,currentActionModal:{type:'token_skill',card}}));setShowTokenSkillModal(true); }
      else showCard(card);
    } else if(space.type==='market') {
      const question=pickBankQuestion('market',difficulty,state.current.seenBankQuestions||[]);seenQuestion(question.id);
      const card={...drawResourceCard(state.current.options.exploreMode),province:space.province,marketVisit:true,marketQuestion:question};
      updatePlayer(actor().id,p=>addCard(p,card));showCard(card);
    } else if(space.type==='festival') {
      const card={...drawFortuneCard(state.current.options.exploreMode),province:space.province};
      if(card.eventType==='contest') { const question=pickBankQuestion('festival',difficulty,state.current.seenBankQuestions||[]);seenQuestion(question.id);showCard({...card,contestQuestion:question}); }
      else showCard(card);
    }
  };
  const openPhysicalCard = (kind: PhysicalCardKind, province: string, difficulty: QuestionDifficulty) => run(async()=>{
    const pending=state.current.pendingPhysicalCard;
    if(!pending || pending.kind!==kind || pending.playerId!==actor().id || state.current.gameStatus!=='playing')throw new Error('Thẻ QR không khớp với nhiệm vụ đang chờ trong ván này.');
    const space=BOARD_SPACES[pending.spaceIndex];
    if(space.province!==province)throw new Error('Chọn đúng tỉnh đang đứng trên bàn cờ.');
    await openLocalTask(space,difficulty);
  })();

  const resolveSpace = async (position: number) => {
    update(s=>({ ...s,turnStep:4 }));
    const space=BOARD_SPACES[position];
    if (space.type === 'corner') {
      updatePlayer(actor().id,p=>({ ...p,artifactItems:p.artifactItems.map(a=>({...a,isSealed:false})) }));
      update(s=>({...s,currentActionModal:{type:'corner_choice',spaceIndex:position}}));setActiveCornerStation(space); return;
    }
    if (space.type === 'start') { update(s=>({...s,currentActionModal:{type:'quiz_start',spaceIndex:0}}));setActiveCornerStation(space); return; }
    const milestone = state.current.milestones.find(m=>m.spaceIndex===position && m.playerId!==actor().id);
    if (milestone && pouchCards(actor()).length) {
      const [id] = await chooseCards(actor(),1,'Chọn 1 thẻ lộ phí cho chủ Cột mốc');
      update(s=>({ ...s,players:transferCard(s.players,actor().id,milestone.playerId,id) }));
    }
    if (actor().biKipCards.length >= 3 && await yesNo('Dùng 3 Bí kíp nhận ngay Kỷ vật?',actor(),'Có công mài sắt: bỏ qua nhiệm vụ ô địa phương này.')) {
      updatePlayer(actor().id,p=>spendBiKip(p,p.biKipCards.slice(0,3).map(b=>b.id)));
      grantArtifact(actor().id,space.province!); await completeTask(); return;
    }
    if(state.current.options.physicalQR && state.current.mode==='offline') {
      const kind: PhysicalCardKind=space.type==='market'?'resource':space.type==='festival'?'fortune':space.type as 'knowledge'|'challenge';
      update(s=>({...s,currentActionModal:null,pendingPhysicalCard:{kind,spaceIndex:position,playerId:actor().id}}));
      return;
    }
    await openLocalTask(space);
  };
  const arrive = async (position: number) => {
    updatePlayer(actor().id,p=>({...p,position}));
    if (!state.current.options.exploreMode && position!==0) {
      const targets=state.current.players.filter(p=>p.id!==actor().id && p.position===position);
      if (targets.length) {
        const [id]=targets.length===1 ? [targets[0].id] : await ask('Chọn 1 người để Chạm trán',[...targets.map(p=>({id:p.id,label:p.name})),{id:'skip',label:'Bỏ qua Chạm trán'}]);
        const target=targets.find(p=>p.id===id);
        if (target) { update(s=>({...s,turnStep:3,currentActionModal:{type:'steal_interaction',targetPlayer:target}})); setActiveStealTarget(target); return; }
      }
    }
    await resolveSpace(position);
  };
  const move = async (delta: number) => {
    const old=actor().position;
    const destination=(old+delta+40)%40;
    if (delta>0 && old+delta>=40) {
      pendingDestination.current=destination===0 ? null : destination;
      update(s=>({...s,remainingDestination:pendingDestination.current,currentActionModal:{type:'quiz_start',spaceIndex:0}}));
      updatePlayer(actor().id,p=>({...p,position:0,tokenSkillAvailable:true,lapsCompleted:p.lapsCompleted+1}));
      if (startWin()) return;
      update(s=>({...s,turnStep:4})); setActiveCornerStation(BOARD_SPACES[0]);
    } else await arrive(destination);
  };
  const continueStart = async () => {
    const destination=pendingDestination.current; pendingDestination.current=null;
    update(s=>({...s,remainingDestination:null,currentActionModal:null}));
    if (destination!==null) await arrive(destination); else await completeTask();
  };

  const applyFortune = async (fortune: FortuneCard, finish = true) => {
    const player=actor(); const province=fortune.province || provinceAt(player.position);
    log(`${player.name} rút ${fortune.name}.`);
    if(fortune.group!=='power' && await negateSkill()) { if(finish) await completeTask(); return; }
    if (fortune.group==='power') updatePlayer(player.id,p=>addCard(p,fortune));
    else if (fortune.eventType==='contest') {
      const winners=await ask('Hội thi: chọn người thắng',state.current.players.map(p=>({id:p.id,label:p.name})),player,1,state.current.players.length,fortune.contestQuestion ? 'Cả bàn cùng trả lời câu hỏi Lễ hội vừa mở. Chọn người trả lời đúng nhanh nhất; nếu hòa chọn tất cả người đồng hạng.' : 'Cả bàn cùng chơi Nhanh mắt, Đối đáp ca dao hoặc Kể tiếp sức. Nếu hòa, chọn tất cả người đồng hạng.');
      const tied=state.current.players.filter(p=>winners.includes(p.id));
      const winner=tied.find(p=>p.id===player.id) || [...tied].sort((a,b)=>a.artifactItems.length-b.artifactItems.length)[0];
      if(winner) grantArtifact(winner.id,province);
    } else if (fortune.eventType==='fortune_gift') grantArtifact(player.id,province);
    else if (fortune.eventType==='harvest') {
      update(s=>({...s,hasRolled:false,diceValue:null,turnStep:2}));
      if (finish) return;
    } else if (fortune.eventType==='tailwind') {
      if (finish) { await move(10-player.position%10); return; }
      // A bonus draw also applies movement immediately.
      await move(10-player.position%10); return;
    } else if (fortune.eventType==='bandit') {
      const players=state.current.players,index=state.current.activePlayerIndex;
      const neighbors=[...new Set([(index+1)%players.length,(index+players.length-1)%players.length])].map(i=>players[i]).filter(p=>p.cards.resource.length);
      if(neighbors.length) {
        const [id]=await ask('Đạo tặc: chọn người bên trái hoặc bên phải',neighbors.map(p=>({id:p.id,label:p.name})));
        const target=neighbors.find(p=>p.id===id)!; const card=randomItem(target.cards.resource);
        update(s=>({...s,players:transferCard(s.players,target.id,player.id,card.id)}));
      }
    } else if (fortune.eventType==='mutual_support') {
      const players=state.current.players, max=Math.max(...players.map(p=>p.artifactItems.length)), min=Math.min(...players.map(p=>p.artifactItems.length));
      if(max>min) {
        const rich=players.filter(p=>p.artifactItems.length===max && pouchCards(p).length),poor=players.filter(p=>p.artifactItems.length===min);
        if(rich.length) {
          const [from]=await ask('Lá lành: chọn người chuyển thẻ',rich.map(p=>({id:p.id,label:p.name})));
          const [to]=await ask('Lá lành: chọn người nhận thẻ',poor.map(p=>({id:p.id,label:p.name})));
          const giver=players.find(p=>p.id===from)!; const [id]=await chooseCards(giver,1,`${giver.name}: chọn thẻ tặng`);
          update(s=>({...s,players:transferCard(s.players,from,to,id)}));
        }
      }
    } else if (fortune.group==='bad_event') {
      let protectedByHat=false;
      if(player.token==='non_la' && player.tokenSkillAvailable && await yesNo('Dùng Nón lá miễn phạt sự kiện?')) {
        updatePlayer(player.id,p=>({...p,tokenSkillAvailable:false})); protectedByHat=!(await negateSkill());
      }
      if(!protectedByHat) {
        if(fortune.eventType==='storm') updatePlayer(player.id,p=>({...p,position:(p.position+38)%40}));
        else if(fortune.eventType==='crop_loss' && pouchCards(actor()).length) {
          const ids=await chooseCards(actor(),1,'Mất mùa: chọn 1 thẻ phải bỏ'); updatePlayer(player.id,p=>removeCards(p,ids));
        }
      }
    }
    if(finish) await completeTask();
  };
  const bonusCard = async () => {
    const deck=await chooseDeck(),card=draw(deck);
    updatePlayer(actor().id,p=>addCard(p,card));
  };

  const handleRollDice = run(async () => {
    if(state.current.gameStatus!=='playing' || state.current.hasRolled || currentCard.current || activeCornerStation || activeStealTarget || showTokenSkillModal) return;
    const version=epoch.current;
    let roll=Math.floor(Math.random()*6)+1;
    const old=actor().position,extra=state.current.turnStep===2;
    setIsRolling(true); soundManager.playDiceRoll();
    update(s=>({...s,diceValue:roll,hasRolled:true,turnStep:2}));
    try {
      if(animationMs) await new Promise(resolve=>setTimeout(resolve,animationMs));
      if(version!==epoch.current) return;
      const steed=actor().cards.resource.find(c=>c.category==='steed');
      if(steed && await yesNo('Dùng Ngựa trạm đổ lại xúc xắc?')) {
        updatePlayer(actor().id,p=>removeCards(p,[steed.id]));
        const defense=await negateSkill();
        if(!defense) {
          const reroll=Math.floor(Math.random()*6)+1;
          const [selected]=await ask('Chọn kết quả xúc xắc',[{id:String(roll),label:`Giữ ${roll} bước`},...(reroll===roll ? [] : [{id:String(reroll),label:`Chọn ${reroll} bước`}])]);
          roll=Number(selected); update(s=>({...s,diceValue:roll}));
        }
      }
      movement.current={roll,old,isExtra:extra};
      if(actor().token==='banh_mi' && actor().tokenSkillAvailable) { update(s=>({...s,pendingDiceMovement:movement.current,currentActionModal:{type:'token_skill'}}));setShowTokenSkillModal(true); return; }
      movement.current=null; await move(roll);
    } finally { setIsRolling(false); }
  });

  const handleResolveCard = (result: CardResolution) => run(async () => {
    const card=currentCard.current; if(!card) return;
    if(card.type==='resource' && card.marketQuestion && result.consumeCards?.length && (result.marketAnswer===undefined || result.consumeCards.length!==(result.marketAnswer===card.marketQuestion.correctAnswer?1:2)))throw new Error('Số thẻ thanh toán không khớp kết quả Trả giá.');
    // Close immediately to prevent double resolution, while retaining the authoritative card.
    currentCard.current=null; setActiveCardModal(null);
    update(s=>({...s,currentActionModal:null}));
    if(card.type==='fortune') { await applyFortune(card); return; }
    if(card.type==='knowledge' || card.type==='challenge') {
      updatePlayer(actor().id,p=>({...p,journey:[...(p.journey||[]),{province:card.province,title:card.title,question:card.question,knowledge:card.type==='knowledge' ? card.didYouKnow||card.description : card.didYouKnow||card.explanation||'',source:card.citation}]}));
      if(result.consumeBiKipIds?.length) updatePlayer(actor().id,p=>spendBiKip(p,result.consumeBiKipIds!));
      if(result.consumeBiKipId) updatePlayer(actor().id,p=>spendBiKip(p,[result.consumeBiKipId!]));
      if(result.success) {
        const reward=result.rewardArtifactItem;
        if(reward && reward.province===card.province && reward.region===card.region) updatePlayer(actor().id,p=>({...p,artifactItems:[...p.artifactItems,{...reward,storage:'pouch',isSealed:false}]}));
        else grantArtifact(actor().id,card.province,card.type==='challenge' ? 0.4 : 0.1);
        if(card.type==='challenge' && !result.consumeBiKipIds?.length) await bonusCard();
      } else {
        if(card.type==='challenge') {
          let hat=false;
          if(actor().token==='non_la' && actor().tokenSkillAvailable && await yesNo('Dùng Nón lá miễn phạt Thử thách?')) {
            updatePlayer(actor().id,p=>({...p,tokenSkillAvailable:false})); hat=!(await negateSkill());
          }
          if(!hat) {
            const pouch=actor().artifactItems.filter(a=>a.storage==='pouch');
            const artifactId=pouch.length ? (await ask('Chọn Kỷ vật làm rơi về Kho thất lạc',pouch.map(a=>({id:a.id,label:`${a.isTreasure?'⭐ ':''}${a.name}`}))))[0] : undefined;
            const cardId=!pouch.length && pouchCards(actor()).length ? (await chooseCards(actor(),1,'Tay nải trống: chọn 1 thẻ phải bỏ'))[0] : undefined;
            update(s=>failChallenge(s,artifactId,cardId));
          }
        }
        updatePlayer(actor().id,p=>({...p,biKipCards:[...p.biKipCards,makeBiKip(card)]}));
      }
    } else if(card.type==='resource') {
      if(card.marketVisit) {
        if(result.consumeCards?.length) {
          updatePlayer(actor().id,p=>removeCards(p,result.consumeCards!.map(c=>c.id)));
          grantArtifact(actor().id,card.province!);
        }
      } else updatePlayer(actor().id,p=>addCard(p,card));
    }
    log(result.logMessage);
    await completeTask();
  })();
  const handleConsumeBiKip = (ids: string[]) => {
    if(!currentCard.current || state.current.turnStep!==4) return false;
    try { updatePlayer(actor().id,p=>spendBiKip(p,ids)); return true; } catch { return false; }
  };
  const handleSelectCornerOption = (option: 'fortune' | 'resource' | 'restore_skill' | 'safe_deposit' | 'reclaim_start', extraData?: string[]) => run(async()=>{
    const corner=activeCornerStation; if(!corner) return;
    setActiveCornerStation(null);
    if(option==='restore_skill') updatePlayer(actor().id,p=>({...p,tokenSkillAvailable:true}));
    else if(option==='safe_deposit') updatePlayer(actor().id,p=>deposit(p,extraData||[]));
    else if(option==='reclaim_start') {
      const lost=state.current.lostAndFound;
      if(lost.length) {
        const [id]=await ask('Chọn 1 Kỷ vật thu hồi từ Kho thất lạc',lost.map(a=>({id:a.id,label:`${a.name} · ${a.province}`})));
        const result=reclaim(actor(),lost,id);
        update(s=>({...s,lostAndFound:result.lost,players:s.players.map(p=>p.id===result.player.id ? result.player : p)}));
      } else { await bonusCard(); }
    } else {
      if (corner.index===0) { await bonusCard(); await continueStart(); return; }
      const deck=option;
      const card=draw(deck);
      showCard(card.type==='fortune' ? {...card,province:provinceAt(corner.index)} : card);
      return;
    }
    if(corner.index===0) await continueStart(); else await completeTask();
  })();
  const handleCloseCorner = run(async()=>{
    const corner=activeCornerStation; setActiveCornerStation(null);
    if(corner?.index===0) await continueStart(); else await completeTask();
  });
  const handleExecuteSteal = (type:'artifact'|'card'|'skip', payment?:ResourceCard, selected?:ArtifactItem) => run(async()=>{
    const target=state.current.players.find(p=>p.id===activeStealTarget?.id);
    if(!target || type==='skip') { setActiveStealTarget(null); await resolveSpace(actor().position); return; }
    if(type==='card' && pouchCards(target).length) update(s=>({...s,players:transferCard(s.players,target.id,actor().id,randomItem(pouchCards(target)).id)}));
    else if(type==='artifact') {
      if(isProtected(target,state.current.players) || !payment || !actor().cards.resource.some(c=>c.id===payment.id)) return;
      const artifacts=target.artifactItems.filter(a=>a.storage==='pouch' && !a.isTreasure);
      if(!artifacts.length) return;
      const [id]=await ask('Chọn Kỷ vật thường muốn cướp',artifacts.map(a=>({id:a.id,label:a.name})));
      const artifact=artifacts.find(a=>a.id===id)!;
      updatePlayer(actor().id,p=>removeCards(p,[payment.id]));
      const shield=target.cards.resource.find(c=>c.category==='shield');
      if(shield && await yesNo(`${target.name}: dùng Lá chắn chặn cướp?`,target)) updatePlayer(target.id,p=>removeCards(p,[shield.id]));
      else {
        updatePlayer(target.id,p=>({...p,artifactItems:p.artifactItems.filter(a=>a.id!==id)}));
        updatePlayer(actor().id,p=>({...p,artifactItems:[...p.artifactItems,artifact]}));
      }
    }
    setActiveStealTarget(null); await resolveSpace(actor().position);
  })();

  const handleUseCard = (card:GameCard) => run(async()=>{
    if(state.current.turnStep!==1) { setNotice('Thẻ chủ động được dùng ở bước Chuẩn bị. Lá chắn/Vô hiệu/Ngựa trạm được hỏi vào đúng thời điểm.'); return; }
    if(card.type==='resource' && card.category==='milestone') {
      const owned=state.current.milestones.filter(m=>m.playerId===actor().id);
      const replace=owned.length>=2 ? Number((await ask('Chọn Cột mốc cũ để nhổ',owned.map(m=>({id:String(m.spaceIndex),label:BOARD_SPACES[m.spaceIndex].name}))))[0]) : undefined;
      // Validate before spending or asking defenders.
      placeMilestone(state.current,card.id,replace);
      const blocked=await negateSkill();
      if(blocked) updatePlayer(actor().id,p=>removeCards(p,[card.id])); else update(s=>placeMilestone(s,card.id,replace));
      return;
    }
    const attack=card.type==='resource' && card.category==='crossbow' || card.type==='fortune' && card.eventType==='seal';
    if(card.type==='fortune' && card.group!=='power') {
      updatePlayer(actor().id,p=>removeCards(p,[card.id]));
      await applyFortune(card,false);
      return;
    }
    if(!attack || state.current.options.exploreMode) { setNotice('Thẻ này sẽ được hỏi tự động vào đúng thời điểm sử dụng.'); return; }
    const crossbow=card.type==='resource';
    const targets=state.current.players.filter(p=>p.id!==actor().id && !isProtected(p,state.current.players) && p.artifactItems.some(a=>a.storage==='pouch' && (crossbow ? !a.isTreasure : !a.isSealed)) && (!crossbow || Math.min(Math.abs(p.position-actor().position),40-Math.abs(p.position-actor().position))<=3));
    if(!targets.length) { setNotice('Không có mục tiêu hợp lệ.'); return; }
    const [targetId]=await ask('Chọn mục tiêu',targets.map(p=>({id:p.id,label:p.name})));
    const target=targets.find(p=>p.id===targetId)!;
    const [artifactId]=await ask('Chọn Kỷ vật',target.artifactItems.filter(a=>a.storage==='pouch' && (crossbow ? !a.isTreasure : !a.isSealed)).map(a=>({id:a.id,label:a.name})));
    const blockedBy=await defend(target,true,`${actor().name} dùng ${card.name}.`);
    if(!blockedBy && await negateSkill([target.id])) {
      updatePlayer(actor().id,p=>removeCards(p,[card.id]));
      return;
    }
    update(s=>useCard(s,card.id,{targetId,artifactId,blockedBy}));
  })();
  const handleLotusSwap=(ids:string[],deck:'knowledge'|'resource'|'fortune')=>run(async()=>{
    if(actor().token!=='hoa_sen' || !actor().tokenSkillAvailable || state.current.turnStep!==1 || ids.length!==2 || deck==='knowledge') return;
    const updated=removeCards(actor(),ids);
    const blocked=await negateSkill();
    updatePlayer(actor().id,p=>({...removeCards(p,ids),tokenSkillAvailable:false}));
    setShowTokenSkillModal(false);
    if(!blocked) updatePlayer(updated.id,p=>addCard(p,draw(deck)));
  })();
  const handleBanhMiShift=(delta:-1|1)=>run(async()=>{
    const pending=movement.current;
    if(!pending || actor().token!=='banh_mi' || !actor().tokenSkillAvailable) return;
    updatePlayer(actor().id,p=>({...p,tokenSkillAvailable:false}));
    const blocked=await negateSkill(); movement.current=null; update(s=>({...s,pendingDiceMovement:null,currentActionModal:null}));setShowTokenSkillModal(false);
    await move(pending.roll+(blocked ? 0 : delta));
  })();
  const handleCloseToken=run(async()=>{
    setShowTokenSkillModal(false);
    if(movement.current) { const pending=movement.current; movement.current=null;update(s=>({...s,pendingDiceMovement:null,currentActionModal:null})); await move(pending.roll); }
    else if(lanternCard.current) { const card=lanternCard.current; lanternCard.current=null; showCard(card); }
  });
  const handleLanternRedraw=run(async()=>{
    const card=lanternCard.current;
    if(!card || (card.type!=='knowledge' && card.type!=='challenge') || !lanternUsed.current) return;
    lanternUsed.current=false; lanternCard.current=null; setShowTokenSkillModal(false);
    if(card.bankQuestionId) {
      const question=pickBankQuestion(card.type,card.difficulty||'basic',state.current.seenBankQuestions||[]);seenQuestion(question.id);showCard(bankGameCard(question,card.province));
    } else showCard(drawLocalQuestion(card.province,card.type,card.id));
  });
  const handlePreviewLantern=async()=>{
    const card=lanternCard.current;
    if(busy.current || !card || !actor().tokenSkillAvailable) return null;
    busy.current=true;
    try {
      updatePlayer(actor().id,p=>({...p,tokenSkillAvailable:false}));
      if(await negateSkill()) { lanternCard.current=null; setShowTokenSkillModal(false); showCard(card); return null; }
      lanternUsed.current=true;
      update(s=>({...s,currentActionModal:{type:'token_skill',card,previewAccepted:true}}));
      return card;
    } finally { busy.current=false; }
  };
  const openTokenSkill=()=>{
    if(busy.current || state.current.turnStep!==1 || !actor().tokenSkillAvailable || actor().token!=='hoa_sen') return;
    setShowTokenSkillModal(true);
  };
  const handleEndTurn=run(async()=>{
    if(state.current.turnStep!==5 || currentCard.current || activeCornerStation || activeStealTarget || showTokenSkillModal) return;
    const excess=Math.max(0,pouchCards(actor()).length-5);
    const ids=excess ? await chooseCards(actor(),excess,`Xả ${excess} thẻ thừa để kết thúc lượt`) : [];
    update(s=>finishTurn(s,ids));
  });
  const handleStartGame=(config:SetupConfig)=>{
    epoch.current++; answer.current?.([]); answer.current=null; setChoice(null); setNotice(null);
    currentCard.current=null; lanternCard.current=null; pendingDestination.current=null; afterCard.current=null; movement.current=null;
    setActiveCardModal(null);setActiveCornerStation(null);setActiveStealTarget(null);setShowTokenSkillModal(false);
    const first=Math.floor(Math.random()*config.players.length);
    update(()=>({...initial,sessionId:uid('match'),seenBankQuestions:[],questionDifficulty:'basic',pendingPhysicalCard:null,mode:config.mode,roomCode:config.roomCode,gameStatus:'playing',gameModeRule:config.options.exploreMode?'toc_chien':config.gameModeRule,artifactGoal:config.options.exploreMode?3:config.artifactGoal,players:config.players.map(p=>normalizePlayer(p)),activePlayerIndex:first,firstPlayerIndex:first,options:config.options,endsAt:config.options.timedMode&&!config.options.exploreMode ? Date.now()+(config.durationMinutes||60)*60000 : undefined,historyLog:[`Trận đấu bắt đầu! ${config.players[first].name} đi đầu tiên.`]}));
  };
  const resetSetup=()=>{
    epoch.current++;answer.current?.([]);answer.current=null;setChoice(null);setNotice(null);
    currentCard.current=null;lanternCard.current=null;pendingDestination.current=null;movement.current=null;afterCard.current=null;
    setActiveCardModal(null);setActiveCornerStation(null);setActiveStealTarget(null);setShowTokenSkillModal(false);
    update(s=>({...s,gameStatus:'setup',winner:null,pendingPhysicalCard:null,currentActionModal:null}));
  };
  const handleAskFriend=async()=>{
    const card=currentCard.current;
    if(!card || card.type!=='knowledge' || !actor().biKipCards.length) return;
    const opponents=state.current.players.filter(p=>p.id!==actor().id);
    const [id]=await ask('Hỏi bạn: chọn người trả lời hộ',opponents.map(p=>({id:p.id,label:p.name})));
    updatePlayer(actor().id,p=>spendBiKip(p,[p.biKipCards[0].id]));
    return id;
  };
  const handleFriendReward=(id:string)=>{
    const card=currentCard.current;
    if(card && card.type==='knowledge') updatePlayer(id,p=>({...p,biKipCards:[...p.biKipCards,makeBiKip(card)]}));
  };
  const handleGuideApproval=async()=>{
    const votes=await ask('Hướng dẫn viên: biểu quyết',state.current.players.map(p=>({id:p.id,label:p.name})),actor(),0,state.current.players.length,'Sau phần trình bày tối đa 30 giây, chọn những người đồng ý. Quá nửa bàn đồng ý mới tính là một câu đúng.');
    return votes.length > state.current.players.length / 2;
  };
  const handleGuessReward=async()=>{
    const card=currentCard.current;
    if(!card || card.type!=='challenge') return;
    const [id]=await ask('Ai đoán đúng đầu tiên?',state.current.players.filter(p=>p.id!==actor().id).map(p=>({id:p.id,label:p.name})));
    updatePlayer(id,p=>({...p,biKipCards:[...p.biKipCards,makeBiKip(card)]}));
  };
  // AI resolves its own digital tasks, without leaving quiz modals blocking indefinitely.
  useEffect(()=>{
    if(gameState.gameStatus!=='playing' || !actor().isAI || choice || busy.current) return;
    const timer=setTimeout(()=>{
      if(activeCardModal) handleResolveCard({success:Math.random()<0.65,logMessage:`${actor().name} hoàn thành nhiệm vụ.`});
      else if(activeCornerStation?.index===0) {
        const score=Number(Math.random()<0.65)+Number(Math.random()<0.65);
        if(score===2) handleSelectCornerOption('reclaim_start');
        else if(score===1) handleSelectCornerOption('resource');
        else handleCloseCorner();
      }
      else if(activeCornerStation) handleSelectCornerOption('resource');
      else if(activeStealTarget) handleExecuteSteal('card');
      else if(showTokenSkillModal) handleCloseToken();
      else if(gameState.turnStep===5) handleEndTurn();
      else if(!gameState.hasRolled) handleRollDice();
    },1000);
    return()=>clearTimeout(timer);
  },[gameState,activeCardModal,activeCornerStation,activeStealTarget,showTokenSkillModal,choice]);
  return { gameState,activePlayer:gameState.players[gameState.activePlayerIndex],activeCardModal,activeCornerStation,activeStealTarget,showTokenSkillModal,isRolling,choice,notice,setNotice,confirmChoice,handleStartGame,resetSetup,handleRollDice,handleResolveCard,handleSelectCornerOption,handleCloseCorner,handleExecuteSteal,handleUseCard,handleConsumeBiKip,handleLotusSwap,handleBanhMiShift,handleCloseToken,handleLanternRedraw,handlePreviewLantern,openTokenSkill,handleEndTurn,handleAskFriend,handleFriendReward,handleGuessReward,handleGuideApproval,openPhysicalCard,lanternPreview:lanternCard.current,lanternInitialPreview:gameState.currentActionModal?.previewAccepted?lanternCard.current:null };
}
