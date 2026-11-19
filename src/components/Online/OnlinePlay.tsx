import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Copy, Globe, Plus, Users } from 'lucide-react';
import { useOnlineRoom } from './useOnlineRoom';
import { newJoinToken, onlineRequest } from '../../utils/onlineClient';
import { TOKENS } from '../../data/tokens';
import { BOARD_SPACES } from '../../data/boardData';
import { QUESTION_BANK } from '../../data/questionBank';
import { GameBoard } from '../GameBoard/GameBoard';
import { Header } from '../Header';
import { Navigation } from '../Navigation';
import { InventoryTab } from '../Inventory/InventoryTab';
import { CulturalMapTab } from '../CulturalMap/CulturalMapTab';
import { RulebookTab } from '../Rulebook/RulebookTab';
import { CardDrawModal } from '../Modals/CardDrawModal';
import { CornerStationModal } from '../Modals/CornerStationModal';
import { TokenSkillModal } from '../Modals/TokenSkillModal';
import { StealModal } from '../Modals/StealModal';
import { VictoryModal } from '../Modals/VictoryModal';
import { RuleChoiceModal } from '../Modals/RuleChoiceModal';
import { soundManager } from '../../utils/sound';
type ActiveTab = 'board' | 'inventory' | 'map' | 'rules';

const button = 'px-4 py-2.5 rounded-xl bg-[#543310] text-[#F5E5BE] font-bold text-sm border border-[#C5A059] disabled:opacity-40';
const input = 'w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]';

export function OnlinePlay({ onExit, language: initialLanguage }: { onExit: () => void; language: 'vi' | 'en' }) {
  const online = useOnlineRoom();
  const { room, identity, busy, error } = online;
  const [language, setLanguage] = useState(initialLanguage);
  const vi = language === 'vi';
  const [tab, setTab] = useState<ActiveTab>('board');
  const [form, setForm] = useState<'create' | 'join'>('create');
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('Phòng Lạc Việt');
  const [code, setCode] = useState('');
  const [working, setWorking] = useState(false);
  const [sound, setSound] = useState(true);
  const [volume, setVolume] = useState(() => soundManager.getVolume());
  const [copied, setCopied] = useState(false);
  const [contestAnswer, setContestAnswer] = useState<number | null>(null);
  const [clock, setClock] = useState(Date.now());
  const game = room?.game;
  const modal = game?.currentActionModal;
  const card = useMemo(() => modal?.card || null, [JSON.stringify(modal?.card)]);
  const myMember = room?.members.find(m => m.id === identity?.memberId);
  const active = game?.players[game.activePlayerIndex];
  const me = game?.players.find(p => p.id === identity?.memberId);
  const myTurn = active?.id === me?.id;
  const myTask = (room?.friendId || active?.id) === me?.id;
  const host = room?.hostId === identity?.memberId;
  const choice = room?.panel?.choice;
  const action = (method: string, ...args: any[]) => online.command(method, args);
  const safe = (fn: () => Promise<any>) => { void fn().catch(e => online.setError((e as Error).message)); };
  useEffect(() => { soundManager.setSoundEnabled(sound); }, [sound]);
  useEffect(() => { const timer = setInterval(() => setClock(Date.now()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { setContestAnswer(null); }, [card?.id]);
  const enter = async () => {
    setWorking(true); online.setError('');
    try {
      const response = await onlineRequest(form === 'create'
        ? { action:'create', name:roomName, playerName:name }
        : { action:'join', code:code.trim().toUpperCase(), playerName:name, joinToken:newJoinToken(), requestId:crypto.randomUUID() });
      online.connect(response.identity!, response.room);
    } catch (e) { online.setError((e as Error).message); }
    finally { setWorking(false); }
  };
  const leave = async () => {
    if (room?.status === 'lobby') await online.mutate({ action:'leave' });
    online.forget(); onExit();
  };
  const errorBox = error && <div role="alert" className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3 text-xs flex flex-wrap gap-2 justify-between"><span>{error}</span><button className="underline" onClick={() => { online.forget(); }}>Về kết nối phòng</button></div>;

  if (!game) return <main className="lac-viet-app min-h-screen font-sans text-gray-900 px-4 py-8">
    <section className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-[#C5A059] p-5 sm:p-7 shadow-xl space-y-5">
      <div className="flex items-center justify-between gap-3"><h1 className="font-serif-lacviet text-2xl font-bold text-[#543310] flex items-center gap-2"><Globe size={24}/>{vi?'Phòng chơi online':'Online room'}</h1><button onClick={() => safe(leave)} aria-label="Về menu" className="p-2 rounded-xl bg-[#FAF6EE]"><ArrowLeft size={20}/></button></div>
      {errorBox}
      {!identity ? <>
        <div className="grid grid-cols-2 gap-2">{(['create','join'] as const).map(mode => <button key={mode} onClick={() => setForm(mode)} className={`${button} ${form!==mode?'!bg-[#FAF6EE] !text-[#543310]':''}`}>{mode==='create'?(vi?'Tạo phòng':'Create room'):(vi?'Vào phòng':'Join room')}</button>)}</div>
        <label className="block text-xs font-bold text-gray-600">{vi?'Tên của bạn':'Your name'}<input className={input} value={name} maxLength={24} autoComplete="nickname" onChange={e=>setName(e.target.value)}/></label>
        {form==='create'?<label className="block text-xs font-bold text-gray-600">{vi?'Tên phòng':'Room name'}<input className={input} maxLength={60} value={roomName} onChange={e=>setRoomName(e.target.value)}/></label>:<label className="block text-xs font-bold text-gray-600">{vi?'Mã phòng':'Room code'}<input className={`${input} uppercase tracking-widest`} value={code} maxLength={6} autoCapitalize="characters" onChange={e=>setCode(e.target.value.toUpperCase())}/></label>}
        <button className={`${button} w-full`} disabled={working||!name.trim()||(form==='create'?!roomName.trim():code.trim().length!==6)} onClick={()=>safe(enter)}>{working?(vi?'Đang kết nối…':'Connecting…'):form==='create'?(vi?'Tạo phòng mới':'Create room'):(vi?'Tham gia phòng':'Join room')}</button>
      </>:!room?<p className="text-sm text-gray-500">{vi?'Đang kết nối lại phòng…':'Reconnecting…'}</p>:<>
        <div className="rounded-2xl bg-[#FAF6EE] p-4 border border-[#C5A059]/40"><h2 className="font-serif-lacviet text-xl font-bold text-[#543310]">{room.name}</h2><div className="flex items-center gap-3 mt-2"><span className="font-bold text-lg tracking-[.2em] text-[#543310]">{room.code}</span><button aria-label="Sao chép mã phòng" className="p-2 rounded-lg bg-white border" onClick={()=>{navigator.clipboard.writeText(room.code).then(()=>setCopied(true)).catch(()=>online.setError('Hãy chọn và sao chép mã phòng.'));}}>{copied?<Check size={16}/>:<Copy size={16}/>}</button></div><p className="text-xs text-gray-500 mt-1">{vi?'Gửi mã này cho bạn bè · 2–4 người chơi':'Share this code · 2–4 players'}</p></div>
        <div className="space-y-2">{room.members.map(m=><div key={m.id} className="flex gap-3 items-center justify-between p-3 rounded-xl border border-gray-200 bg-white"><span>{TOKENS[m.token].icon} <strong className="text-sm">{m.name}</strong>{m.id===room.hostId&&<span className="text-[10px] ml-2 text-[#8c6b34]">{vi?'Chủ phòng':'Host'}</span>}</span><span className={`text-xs ${m.ready?'text-emerald-700':'text-gray-400'}`}>{Date.now()-m.lastSeen>45000?(vi?'Mất kết nối':'Disconnected'):m.ready?(vi?'Sẵn sàng':'Ready'):(vi?'Đang chuẩn bị':'Preparing')}</span></div>)}</div>
        {myMember&&<div><p className="text-xs font-bold text-gray-600 mb-2">{vi?'Quân cờ của bạn':'Your token'}</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{Object.values(TOKENS).map(token=><button key={token.id} disabled={room.members.some(m=>m.id!==myMember.id&&m.token===token.id)} onClick={()=>safe(()=>online.mutate({action:'profile',playerName:myMember.name,playerToken:token.id}))} className={`p-2.5 rounded-xl text-xs border disabled:opacity-30 ${myMember.token===token.id?'bg-[#F4E8CF] border-[#C5A059] text-[#543310] font-bold':'border-gray-200'}`}>{token.icon} {vi?token.name:token.enName}</button>)}</div></div>}
        <label className="block text-xs font-bold text-gray-600">{vi?'Chế độ chơi':'Game mode'}<select disabled={!host} className={input} value={room.settings.rule} onChange={e=>safe(()=>online.mutate({action:'configure',rule:e.target.value}))}><option value="toc_chien">Tốc chiến · 3 kỷ vật</option><option value="co_ban">Cơ bản · 5 kỷ vật</option><option value="truong_ky">Trường kỳ · 7 kỷ vật</option></select></label>
        {host?<button className={`${button} w-full`} disabled={working||room.members.length<2||room.members.some(m=>!m.ready||clock-m.lastSeen>45000)} onClick={()=>safe(async()=>{setWorking(true);try{await online.mutate({action:'start'});}finally{setWorking(false);}})}>{vi?'Bắt đầu ván chơi':'Start game'}</button>:<button className={`${button} w-full`} onClick={()=>safe(()=>online.mutate({action:'ready',ready:!myMember?.ready}))}>{myMember?.ready?(vi?'Hủy sẵn sàng':'Not ready'):(vi?'Sẵn sàng':'Ready')}</button>}
        <p className="text-xs text-gray-500">{vi?'Chủ phòng bắt đầu khi có ít nhất 2 người và mọi người đều sẵn sàng.':'The host starts once at least two players are ready.'}</p>
      </>}
    </section>
  </main>;

  const contest = card?.type==='fortune' ? card.contestQuestion : undefined;
  const station = modal?.type==='quiz_start'?BOARD_SPACES[0]:modal?.type==='corner_choice'?BOARD_SPACES[modal.spaceIndex || 0]:null;
  const seconds = Math.max(0,20-Math.floor((clock-(room?.taskOpenedAt||clock))/1000));
  return <div className="lac-viet-app min-h-screen flex flex-col font-sans text-gray-900">
    <Header gameState={game} language={language} onToggleLanguage={()=>setLanguage(l=>l==='vi'?'en':'vi')} onResetGame={onExit} soundEnabled={sound} onToggleSound={()=>setSound(s=>!s)} volume={volume} onVolumeChange={v=>{setVolume(v);soundManager.setVolume(v);}}/>
    <div className="max-w-7xl w-full mx-auto px-4 pt-2 text-xs text-[#543310] flex flex-wrap justify-between gap-2"><span><strong>{room!.name}</strong> · {room!.code} · {vi?'Bạn:':'You:'} {myMember?.name}</span><span>{busy?(vi?'Đang xử lý…':'Processing…'):myTurn?(vi?'Đến lượt của bạn':'Your turn'):`${vi?'Đang chờ':'Waiting for'} ${active!.name}`}</span></div>
    {errorBox&&<div className="max-w-7xl w-full mx-auto px-4 py-2">{errorBox}</div>}
    <main className={`flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 ${tab==='board'?'board-main-content':''}`}>
      {tab==='board'&&<GameBoard gameState={game} isRolling={busy} onRollDice={()=>{if(myTurn&&!busy)safe(()=>action('roll'));}} onUseTokenSkill={()=>{if(myTurn&&!busy)safe(()=>action('token'));}} onEndTurn={()=>{if(myTurn&&!busy)safe(()=>action('endTurn'));}} language={language}/>}
      {tab==='inventory'&&me&&<InventoryTab player={me} allPlayers={game.players} artifactGoal={game.artifactGoal} gameModeRule={game.gameModeRule} onUseCard={c=>{if(myTurn&&!busy)safe(()=>action('useCard',c));else online.setError(vi?'Chỉ dùng thẻ trong lượt của bạn.':'Wait for your turn.');}} language={language}/>}
      {tab==='map'&&<CulturalMapTab language={language}/>}{tab==='rules'&&<RulebookTab language={language}/>}
    </main>
    <Navigation activeTab={tab} onSelectTab={setTab} activePlayer={me||active!} language={language}/>
    {choice && choice.playerId===identity?.memberId&&<RuleChoiceModal key={choice.id} choice={choice} onConfirm={ids=>safe(()=>online.mutate({action:'decide',choiceId:choice.id,ids}))} language={language}/>}
    {card&&modal?.type==='card_drawn'&&!contest&&myTask&&!choice&&<CardDrawModal key={card.id} card={card} player={active!} language={language} initialSeconds={seconds} onQuizAnswer={answer=>safe(()=>online.mutate({action:'answer',cardId:card.id,answer}))} onResolve={result=>safe(()=>action('resolve',result))} onConsumeBiKip={async ids=>!!await action('consumeBiKip',ids)} onAskFriend={async()=>await action('askFriend')}/ >}
    {contest&&!choice&&<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"><section className="bg-white rounded-3xl border-4 border-[#C5A059] max-w-lg w-full p-5 space-y-4"><h2 className="font-serif-lacviet font-bold text-xl text-[#543310]">Hội thi · {seconds}s</h2><p className="text-sm font-semibold">{contest.question}</p><div className="space-y-2">{contest.options.map((opt,i)=><button key={i} disabled={contestAnswer!==null||!!room!.taskSubmissions?.[identity!.memberId]||seconds===0} className={`${input} !mt-0 text-left disabled:opacity-50 ${contestAnswer===i?'!border-[#C5A059] !bg-[#FAF6EE]':''}`} onClick={()=>{setContestAnswer(i);safe(()=>online.mutate({action:'answer',cardId:card!.id,answer:i}));}}>{String.fromCharCode(65+i)}. {opt}</button>)}</div><p className="text-xs text-gray-500">{Object.keys(room!.taskSubmissions||{}).length}/{room!.members.length} người đã trả lời</p>{myTurn&&<button disabled={seconds>0&&Object.keys(room!.taskSubmissions||{}).length<room!.members.length} className={button} onClick={()=>safe(()=>action('resolve',{}))}>Kết thúc hội thi</button>}</section></div>}
    {station&&myTurn&&!choice&&<CornerStationModal key={`${station.index}-${game.round}-${game.remainingDestination}`} station={station} player={active!} questionIds={game.options.questionIds} serverStartQuestions={room!.startQuestionIds?.map(id=>QUESTION_BANK.find(q=>q.id===id)!)} onSubmitStart={answers=>safe(()=>action('corner','resource',undefined,answers))} penalizedArtifactsAtStart={game.lostAndFound.length} lostAndFoundList={game.lostAndFound} onSelectOption={(option,extra)=>safe(()=>action('corner',option,extra))} onClose={()=>safe(()=>action('closeCorner'))} onGuideApproval={async()=>!!await action('guide')} language={language}/>}
    {modal?.type==='steal_interaction'&&modal.targetPlayer&&myTurn&&!choice&&<StealModal attacker={active!} target={modal.targetPlayer} allPlayers={game.players} onExecuteSteal={(type,payment,selected)=>safe(()=>action('steal',type,payment,selected))} onCancel={()=>safe(()=>action('steal','skip'))} language={language}/>}
    {modal?.type==='token_skill'&&myTurn&&!choice&&<TokenSkillModal key={`${active!.id}-${game.diceValue}`} player={active!} previewQuestion={card} initialPreview={modal.previewAccepted?card:null} onActivateLotusSwap={(ids,deck)=>safe(()=>action('lotus',ids,deck))} onActivateBanhMiShift={delta=>safe(()=>action('shift',delta))} onPreviewLantern={async()=>await action('lantern')||null} onActivateLanternRedraw={()=>safe(()=>action('redraw'))} onClose={()=>safe(()=>action('closeToken'))} language={language}/>}
    {game.winner&&<VictoryModal winner={game.winner} players={game.players} artifactGoal={game.artifactGoal} gameModeRule={game.gameModeRule} onNewGame={()=>{if(host)safe(()=>online.mutate({action:'restart'}));else online.setError(vi?'Chờ chủ phòng tạo ván mới.':'Wait for the host to start a new match.');}} language={language}/>}
  </div>;
}
