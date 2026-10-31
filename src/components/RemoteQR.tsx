import React, { useEffect, useRef, useState } from 'react';
import { roomRequest, readRoomIdentity, saveRoomIdentity } from '../utils/roomClient';
import { PHYSICAL_CARDS, PhysicalCardKind } from '../utils/physicalQR';
import { ProvinceSelector } from './QRCardGateway';
import { DIFFICULTY_LABELS, QuestionDifficulty } from '../data/questionBank';
import { BOARD_SPACES } from '../data/boardData';
import type { GameState } from '../types/game';

const button='px-5 py-2.5 bg-[#543310] hover:bg-[#6F441E] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition-all';
const input='w-full text-sm font-semibold border border-gray-200 rounded-lg p-2 bg-white focus:ring-[#C5A059] focus:border-[#C5A059]';
export function useHostQR(controller: any, enabled: boolean) {
  const [identity,setIdentity]=useState<any>(()=>readRoomIdentity('host'));
  const [error,setError]=useState(''); const [creating,setCreating]=useState(false);
  const current=useRef(controller); current.current=controller;
  const lastPublished=useRef(''); const processing=useRef(false);
  const [remoteAnswer,setRemoteAnswer]=useState<any>(null);
  const create=async()=>{setCreating(true);setError('');try{const result=await roomRequest({action:'create'});const next={...result,sessionId:current.current.gameState.sessionId};saveRoomIdentity('host',next);lastPublished.current='';setIdentity(next);}catch(e){setError((e as Error).message);}finally{setCreating(false);}};
  useEffect(()=>{
    if(!enabled||!identity||identity.sessionId!==controller.gameState.sessionId)return;
    let stopped=false; let timer: ReturnType<typeof setTimeout>;
    const tick=async()=>{
      try {
        const c=current.current;const g:GameState=c.gameState;const pending=g.pendingPhysicalCard;const card=c.activeCardModal;
        let snapshot:any=null;
        if(g.gameStatus==='playing') {
          if(pending) snapshot={key:`pending:${g.sessionId}:${g.round}:${g.activePlayerIndex}:${pending.spaceIndex}:${g.revision}`,kind:pending.kind,province:BOARD_SPACES[pending.spaceIndex].province,player:c.activePlayer.name};
          else if(card) {
            const q=card.bankQuestionId||card.marketQuestion?.id||card.contestQuestion?.id;
            snapshot={key:card.id,kind:card.type==='resource'?'resource':card.type==='fortune'?'fortune':card.type,province:card.province||'',player:c.activePlayer.name,questionId:q,title:card.title||card.name,description:q?undefined:card.description,seconds:!g.options.exploreMode&&(card.type==='knowledge'||card.type==='challenge')?card.timeLimitSeconds||20:undefined};
          }
        }
        const serialized=JSON.stringify(snapshot);
        if(serialized!==lastPublished.current){await roomRequest({...identity,action:'publish',snapshot});if(stopped)return;lastPublished.current=serialized;setRemoteAnswer(null);}
        const response=await roomRequest({...identity,action:'host'});if(stopped)return;
        if(response.result?.key===current.current.activeCardModal?.id)setRemoteAnswer(response.result);
        const command=response.command;
        if(command&&!processing.current){
          processing.current=true;
          try {
            if(command.type==='open'&&command.key===snapshot?.key&&current.current.gameState.revision===g.revision) await current.current.openPhysicalCard(command.kind,command.province,command.difficulty);
            if(command.type==='answer'&&command.key===current.current.activeCardModal?.id){
              setRemoteAnswer(command);
              if(card.type==='knowledge'||card.type==='challenge') await c.handleResolveCard({success:command.success,logMessage:`${c.activePlayer.name} trả lời trên điện thoại: ${command.success?'đúng':'chưa đúng'}.`});
            }
            await roomRequest({...identity,action:'ack',id:command.id});
          } finally{processing.current=false;}
        }
        setError('');
      }catch(e){if(!stopped)setError((e as Error).message);}
      if(!stopped)timer=setTimeout(tick,1000);
    };
    void tick();return()=>{stopped=true;clearTimeout(timer);};
  },[enabled,identity,controller.gameState.sessionId]);
  const active=enabled&&!!identity&&identity.sessionId===controller.gameState.sessionId;
  return { code:active?identity.code:null,create,creating,error,remoteAnswer,active };
}
export function HostQRPanel({host}:{host:ReturnType<typeof useHostQR>}) {
  return <div className="p-3 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-xs space-y-2">
    {host.code?<><p className="font-bold text-[#543310]">Mã phòng: <span className="text-base select-text">{host.code}</span></p><p>Điện thoại quét thẻ QR, nhập mã này để gửi kết quả về máy.</p></>:<button type="button" className={button} disabled={host.creating} onClick={host.create}>{host.creating?'Đang tạo phòng…':'Kết nối điện thoại'}</button>}
    {host.error&&<><p role="alert" className="text-amber-800">{host.error}</p>{host.code&&<button className={button} onClick={host.create} disabled={host.creating}>Tạo lại phòng</button>}</>}
  </div>;
}
export function RemoteQRPhone({kind,onPractice}:{kind:PhysicalCardKind;onPractice:()=>void}) {
  const [identity,setIdentity]=useState<any>(()=>readRoomIdentity('guest'));
  const [code,setCode]=useState(identity?.code||'');const [data,setData]=useState<any>(null);
  const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  const [province,setProvince]=useState('Hà Nội');const [difficulty,setDifficulty]=useState<QuestionDifficulty>('basic');
  const [result,setResult]=useState<any>(null);const [receipt,setReceipt]=useState<any>(null);const [remaining,setRemaining]=useState<number|null>(null);
  const deadline=useRef(0);const offset=useRef(0);const sending=useRef(false);
  const card=PHYSICAL_CARDS.find(c=>c.kind===kind)!;
  const join=async()=>{setBusy(true);setError('');try{const joined=await roomRequest({action:'join',code});const next={code:code.trim().toUpperCase(),...joined};saveRoomIdentity('guest',next);setIdentity(next);setData(null);setResult(null);}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  useEffect(()=>{
    if(!identity)return;let stopped=false;let timer:ReturnType<typeof setTimeout>;
    const poll=async()=>{try{const next=await roomRequest({...identity,action:'read'});if(stopped)return;setData(next);setResult(next.result);if(next.result)setReceipt(next.result);deadline.current=next.deadline;offset.current=next.serverTime-Date.now();setError('');}catch(e){if(!stopped)setError((e as Error).message);}if(!stopped)timer=setTimeout(poll,1000);};
    void poll();return()=>{stopped=true;clearTimeout(timer);};
  },[identity]);
  const snapshot=data?.snapshot;const key=snapshot?.key;
  useEffect(()=>{setResult(null);},[key]);
  const send=async(answer:number)=>{if(sending.current||!snapshot?.question||result)return;sending.current=true;setBusy(true);try{const response=await roomRequest({...identity,action:'answer',key,answer});setResult(response.result);setReceipt(response.result);setError('');}catch(e){setError((e as Error).message);}finally{setBusy(false);sending.current=false;}};
  useEffect(()=>{const timer=setInterval(()=>{if(!deadline.current){setRemaining(null);return;}const left=Math.max(0,Math.ceil((deadline.current-Date.now()-offset.current)/1000));setRemaining(left);if(left===0&&snapshot?.question&&snapshot.kind===kind&&!result)void send(-1);},250);return()=>clearInterval(timer);},[key,result,kind,identity]);
  const open=async()=>{setBusy(true);try{await roomRequest({...identity,action:'open',key,kind,province,difficulty});setError('');}catch(e){setError((e as Error).message);}finally{setBusy(false);}};
  return <main className="min-h-screen bg-[#F8F5EE] font-sans text-gray-900 p-3 sm:p-6"><section className="bg-white rounded-3xl max-w-xl mx-auto shadow-2xl border-2 border-[#C5A059] overflow-hidden">
    <header className="brown-gradient-bg px-5 py-4 text-white border-b border-[#C5A059]"><p className="text-[10px] font-bold text-[#F5E5BE]">BOARDGAME LẠC VIỆT</p><h1 className="font-serif-lacviet text-xl font-bold">{card.label}</h1></header>
    <div className="p-5 space-y-4">
      {!identity?<><p className="text-xs text-gray-600">Nhập mã phòng hiển thị trên laptop để gửi kết quả về đúng ván chơi.</p><label className="block text-xs font-bold">Mã phòng<input className={input} value={code} maxLength={10} autoCapitalize="characters" onChange={e=>setCode(e.target.value.toUpperCase())}/></label><button className={button} disabled={busy} onClick={join}>Kết nối với laptop</button></>:<>
        <p className="text-xs font-bold text-[#543310]">Phòng {identity.code}{snapshot?` · Lượt ${snapshot.player}`:''}</p>
        {!snapshot?<><p className="text-sm">Đang chờ nhiệm vụ trên laptop…</p>{receipt&&<p className="text-xs text-gray-600">Kết quả vừa gửi: {receipt.success?'chính xác':'chưa đúng'}. {receipt.explanation}</p>}</>:snapshot.kind!==kind?<p className="text-sm">Laptop đang chờ thẻ {PHYSICAL_CARDS.find(c=>c.kind===snapshot.kind)?.label}. Hãy quét đúng thẻ.</p>:<>
          <p className="text-xs text-gray-600">Tỉnh trên bàn cờ: {snapshot.province}.</p>
          {!snapshot.question&&!snapshot.title?<><ProvinceSelector value={province} onChange={setProvince}/><label className="block text-xs font-bold">Độ khó<select className={input} value={difficulty} onChange={e=>setDifficulty(e.target.value as QuestionDifficulty)}>{Object.entries(DIFFICULTY_LABELS).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><button className={button} disabled={busy} onClick={open}>Mở câu hỏi</button></>:snapshot.question?<>
            {remaining!==null&&!result&&<p className="text-xs font-bold">Thời gian: {remaining} giây</p>}
            <p className="text-sm font-bold">{snapshot.question.question}</p>
            {snapshot.question.options.map((option:string,index:number)=><button key={index} className="w-full p-3 rounded-xl border border-gray-200 text-left text-xs sm:text-sm bg-white hover:bg-blue-50/50 disabled:opacity-60 shadow-sm" disabled={busy||!!result} onClick={()=>send(index)}>{String.fromCharCode(65+index)}. {option}</button>)}
          </>:<><p className="font-bold text-sm">{snapshot.title}</p><p className="text-sm">{snapshot.description}</p><p className="text-xs text-gray-600">Tiếp tục xử lý sự kiện trên laptop.</p></>}
          {result&&<div className={`p-3 rounded-xl border text-xs ${result.success?'bg-emerald-100 border-emerald-500':'bg-amber-100 border-amber-400'}`}><strong>{result.success?'Chính xác!':'Cùng tìm hiểu đáp án nhé.'}</strong><p>{result.explanation}</p><p className="mt-2">Kết quả đã gửi về phòng.</p></div>}
        </>}
        <button className="text-xs text-[#543310] font-bold hover:underline" onClick={()=>{localStorage.removeItem('lacviet.qr.guest');setIdentity(null);setData(null);}}>Đổi phòng</button>
      </>}
      {error&&<p role="alert" className="text-xs text-amber-800">{error}</p>}
    </div><footer className="p-4 bg-gray-50 border-t border-gray-200"><button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold" onClick={onPractice}>Luyện tập</button></footer>
  </section></main>;
}
