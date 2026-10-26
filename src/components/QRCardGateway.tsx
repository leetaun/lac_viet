import React, { useState } from 'react';
import { QrCode, ArrowRight } from 'lucide-react';
import { PHYSICAL_CARDS, PhysicalCardKind } from '../utils/physicalQR';
import { BankQuestion, DIFFICULTY_LABELS, GROUP_LABELS, pickBankQuestion, QUESTION_BANK, QuestionDifficulty, QuestionGroup } from '../data/questionBank';
import { PROVINCES_DATA } from '../data/provinces';
import { BOARD_SPACES } from '../data/boardData';
import type { GameState } from '../types/game';

interface GatewayProps { kind: PhysicalCardKind; gameState: GameState; onOpen: (province: string,difficulty: QuestionDifficulty) => Promise<void>; onBack: () => void; }
export function QRCardGateway({kind,gameState,onOpen,onBack}: GatewayProps) {
  const card=PHYSICAL_CARDS.find(c=>c.kind===kind)!;
  const pending=gameState.pendingPhysicalCard;
  const canResume=gameState.gameStatus==='playing' && pending?.kind===kind && pending.playerId===gameState.players[gameState.activePlayerIndex]?.id;
  const [practice,setPractice]=useState(!canResume);
  const [province,setProvince]=useState(pending ? BOARD_SPACES[pending.spaceIndex]?.province || PROVINCES_DATA[0].name : PROVINCES_DATA[0].name);
  const [difficulty,setDifficulty]=useState<QuestionDifficulty>(gameState.questionDifficulty||'basic');
  const [question,setQuestion]=useState<BankQuestion|null>(null);
  const [selected,setSelected]=useState<number|null>(null);
  const [seen,setSeen]=useState<string[]>([]);
  const [opening,setOpening]=useState(false);
  const count=QUESTION_BANK.filter(q=>q.group===card.group && q.difficulty===difficulty).length;
  const nextQuestion=()=>{const q=pickBankQuestion(card.group as QuestionGroup,difficulty,seen);setSeen(old=>[...old,q.id]);setQuestion(q);setSelected(null);};
  return <main className="min-h-screen bg-[#F8F5EE] flex flex-col font-sans text-gray-900 p-3 sm:p-6">
    <section className="bg-white rounded-3xl max-w-xl w-full mx-auto shadow-2xl border-2 border-[#C5A059] overflow-hidden">
      <header className="crimson-gradient-bg px-5 sm:px-7 py-4 text-white border-b border-[#C5A059]">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#F5E5BE]">BOARDGAME LẠC VIỆT</p>
        <h1 className="font-serif-lacviet text-xl sm:text-2xl font-bold flex items-center gap-2"><QrCode size={20}/>{card.label}</h1>
      </header>
      <div className="p-5 sm:p-7 space-y-4">
        <p className="text-xs text-gray-600">{practice ? 'Luyện tập từ ngân hàng của nhóm. Kết quả ở đây không cộng Kỷ vật vào ván chơi.' : `Tiếp tục lượt ${gameState.players[gameState.activePlayerIndex].name} trên thiết bị chung.`}</p>
        {!canResume && <p className="text-xs text-gray-600 bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/30">Thiết bị này chưa có nhiệm vụ {card.label.toLowerCase()} đang chờ. Khi chơi, hãy quét bằng điện thoại chung đang giữ ván. Quét trên điện thoại khác sẽ mở luyện tập.</p>}
        {!question && <>
          <label className="block text-xs font-bold text-gray-600">Độ khó<select value={difficulty} onChange={e=>setDifficulty(e.target.value as QuestionDifficulty)} className="w-full text-sm font-semibold border border-gray-200 rounded-lg p-2 bg-white focus:ring-[#C5A059] focus:border-[#C5A059]">{Object.entries(DIFFICULTY_LABELS).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
          {!practice && <ProvinceSelector value={province} onChange={setProvince}/>}
          <p className="text-xs text-gray-500">{count} câu {GROUP_LABELS[card.group as QuestionGroup]} · {DIFFICULTY_LABELS[difficulty]} · Liên ngành. Tỉnh được chọn xác định Kỷ vật thưởng, không phải chủ đề của mọi câu hỏi.</p>
          <button type="button" disabled={opening} onClick={async()=>{if(practice){nextQuestion();return;}setOpening(true);try{await onOpen(province,difficulty);}finally{setOpening(false);}}} className="w-full py-2.5 bg-[#7E121D] hover:bg-[#941B26] disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow transition-all">{practice?'Bắt đầu luyện tập':'Mở thẻ trong ván đang chơi'}</button>
          {canResume && <button type="button" onClick={()=>setPractice(p=>!p)} className="text-xs text-[#7E121D] font-bold hover:underline">{practice?'Quay lại ván đang chơi':'Chuyển sang luyện tập'}</button>}
        </>}
        {question && <>
          <p className="text-[10px] font-bold text-gray-500 uppercase">{GROUP_LABELS[question.group]} · {DIFFICULTY_LABELS[question.difficulty]} · Câu {question.number}</p>
          <p className="text-sm font-bold text-gray-900">{question.question}</p>
          <div className="space-y-2">{question.options.map((option,index)=><button type="button" key={index} disabled={selected!==null} onClick={()=>setSelected(index)} className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-2 shadow-sm ${selected===null ? 'bg-white hover:bg-blue-50/50 border-gray-200 text-gray-800' : index===question.correctAnswer ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold' : index===selected ? 'bg-amber-100 border-amber-400 text-amber-950 font-medium' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>{String.fromCharCode(65+index)}. {option}</button>)}</div>
          {selected!==null && <>
            <div className="bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/40 text-xs text-gray-800 leading-relaxed"><strong>{selected===question.correctAnswer?'Chính xác!':'Cùng tìm hiểu đáp án nhé.'}</strong><p>{question.explanation}</p></div>
            <div className="text-[11px] text-gray-500 space-y-1">{question.sources.map(source=><a className="block hover:underline" key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>)}</div>
            <button type="button" onClick={nextQuestion} className="w-full py-2.5 bg-[#7E121D] hover:bg-[#941B26] text-white rounded-xl text-xs font-bold shadow transition-all">Câu tiếp theo</button>
          </>}
        </>}
      </div>
      <footer className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between"><button type="button" onClick={onBack} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold">Về bàn chơi</button>{question && <button type="button" onClick={()=>{setQuestion(null);setSelected(null);}} className="text-xs text-[#7E121D] font-bold hover:underline">Đổi độ khó</button>}</footer>
    </section>
  </main>;
}
export function ProvinceSelector({value,onChange}:{value:string;onChange:(value:string)=>void}) {
  return <label className="block text-xs font-bold text-gray-600">Tỉnh đang đứng — nơi nhận Kỷ vật<select value={value} onChange={e=>onChange(e.target.value)} className="w-full text-sm font-semibold border border-gray-200 rounded-lg p-2 bg-white focus:ring-[#C5A059] focus:border-[#C5A059]">{PROVINCES_DATA.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></label>;
}
export function PhysicalCardPrompt({kind,province,onOpen,connection}:{kind:PhysicalCardKind;province:string;onOpen:(province:string,difficulty:QuestionDifficulty)=>Promise<void>;connection?:React.ReactNode}) {
  const card=PHYSICAL_CARDS.find(c=>c.kind===kind)!;
  const [selected,setSelected]=useState(province);
  const [difficulty,setDifficulty]=useState<QuestionDifficulty>('basic');
  const [opening,setOpening]=useState(false);
  return <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade"><section className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-modal-pop">
    <header className="p-4 crimson-gradient-bg text-white"><h2 className="font-serif-lacviet text-lg sm:text-xl font-bold flex items-center gap-2"><QrCode size={20}/>Quét thẻ {card.label}</h2></header>
    <div className="p-4 sm:p-5 space-y-3"><p className="text-xs text-gray-700 bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/30 leading-relaxed">Dùng điện thoại chung quét mã trên thẻ {card.label}, hoặc mở thẻ ngay bằng nút bên dưới. Nhiệm vụ chỉ được tính một lần cho lượt đang chơi.</p><ProvinceSelector value={selected} onChange={setSelected}/><label className="block text-xs font-bold text-gray-600">Độ khó<select value={difficulty} onChange={e=>setDifficulty(e.target.value as QuestionDifficulty)} className="w-full text-sm font-semibold border border-gray-200 rounded-lg p-2 bg-white focus:ring-[#C5A059] focus:border-[#C5A059]">{Object.entries(DIFFICULTY_LABELS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label></div>
    {connection&&<div className="px-4 pb-3">{connection}</div>}
    <footer className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end"><button type="button" disabled={opening} onClick={async()=>{setOpening(true);try{await onOpen(selected,difficulty);}finally{setOpening(false);}}} className="px-5 py-2.5 crimson-gradient-bg hover:opacity-95 text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059] shadow flex items-center gap-2 disabled:opacity-50">Mở thẻ trên máy<ArrowRight size={15}/></button></footer>
  </section></div>;
}
