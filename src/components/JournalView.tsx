import React, { useEffect, useState } from 'react';
import { JourneyJournal, readJournal } from '../utils/journal';

export function JournalView() {
  const [journal,setJournal]=useState<JourneyJournal|null>(null);
  const [error,setError]=useState('');
  useEffect(()=>{readJournal(location.hash).then(setJournal).catch(()=>setError('Không đọc được Sổ hành trình. Hãy quét lại mã hoặc mở bản đã tải.'));},[]);
  return <main className="min-h-screen bg-[#F8F5EE] font-sans text-gray-900 p-3 sm:p-6">
    <div className="max-w-3xl mx-auto bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#C5A059]/40 shadow-card space-y-4">
      <h1 className="font-serif-lacviet text-2xl font-bold text-[#7E121D]">Sổ hành trình Lạc Việt</h1>
      {error && <p className="text-xs text-gray-600">{error}</p>}
      {journal && <>
        <p className="font-bold text-sm text-gray-900">{journal.name} · {journal.artifacts.length} Kỷ vật</p>
        <div className="flex flex-wrap gap-2">{journal.artifacts.map((a,i)=><span key={i} className="px-2 py-1 rounded-lg bg-white border border-[#C5A059]/40 text-xs font-medium text-gray-800 shadow-sm">{a.treasure?'⭐ ':''}{a.name} · {a.province}</span>)}</div>
        {journal.knowledge.map((entry,i)=><div key={i} className="bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/40 text-xs text-gray-800 leading-relaxed"><p className="font-bold text-[#7E121D]">{entry.title} · {entry.province}</p><p>{entry.question}</p><p>{entry.knowledge}</p>{entry.source && <p className="text-xs text-gray-500">{entry.source}</p>}</div>)}
        <button onClick={()=>{const link=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify(journal,null,2)],{type:'application/json'}));link.href=url;link.download='so-hanh-trinh-lac-viet.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}} className="px-5 py-2.5 crimson-gradient-bg hover:opacity-95 text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059] shadow flex items-center gap-2">Tải Sổ hành trình</button>
      </>}
    </div>
  </main>;
}
