import React, { useEffect, useState } from 'react';
import { CARD_PACKS, QUESTION_CATALOG } from '../data/cardPacks';
import { topicName } from '../engine/content';
import { activatePack, integrateCard, packCardUrl, readCardLibrary, saveCardLibrary, type CardLibrary } from '../utils/cardLibrary';
import { generateQRCode } from '../utils/qrcode';

const button = 'px-3 py-2 rounded-xl border border-[#C5A059] bg-[#543310] text-[#F5E5BE] text-xs font-bold disabled:opacity-50';
const input = 'w-full p-2 rounded-xl border border-gray-200 bg-white text-sm';
export function CardLibraryPanel({language, initialHash = '', onChange}: {language:'vi'|'en';initialHash?:string;onChange?:(library:CardLibrary)=>void}) {
  const vi = language === 'vi';
  const [library,setLibrary] = useState(readCardLibrary);
  const [code,setCode] = useState(''); const [link,setLink] = useState(initialHash);
  const [message,setMessage] = useState(''); const [cardId,setCardId] = useState('');
  const [qr,setQR] = useState(''); const [qrURL,setQRURL] = useState('');
  const commit = (next:CardLibrary) => { saveCardLibrary(next);setLibrary(next);onChange?.(next); };
  const perform = (fn:()=>CardLibrary) => {try{commit(fn());setMessage(vi?'Đã lưu trên trình duyệt này.':'Saved in this browser.');}catch(e){setMessage((e as Error).message);}};
  useEffect(()=>{
    const reload=()=>{const next=readCardLibrary();setLibrary(next);onChange?.(next);};
    window.addEventListener('storage',reload);return()=>window.removeEventListener('storage',reload);
  },[onChange]);
  useEffect(()=>{
    let active = true; setQR('');setQRURL('');
    const pack = CARD_PACKS.find(p=>library.packs.includes(p.id)&&p.questionIds.includes(cardId));
    if(pack) {const url=packCardUrl(pack,cardId,location.href);setQRURL(url);generateQRCode(url).then(value=>{if(active)setQR(value);}).catch(()=>{if(active)setMessage('Không tạo được QR / QR unavailable.');});}
    return()=>{active=false;};
  },[cardId,library.packs.join(',')]);
  const available = QUESTION_CATALOG.filter(q=>CARD_PACKS.some(p=>library.packs.includes(p.id)&&p.questionIds.includes(q.id)));
  return <section className="bg-white rounded-2xl p-4 border border-[#C5A059]/40 space-y-3 shadow-sm">
    <h3 className="font-serif-lacviet font-bold text-[#543310]">{vi?'Bộ thẻ chủ đề':'Topic card library'}</h3>
    <p className="text-xs text-gray-600">{vi?'Mã DEMO chỉ để thử, không xác nhận quyền mua. Thư viện lưu riêng trên trình duyệt; tích hợp và chọn bộ trên máy chủ phòng trước khi tạo ván.':'DEMO codes are samples, not purchase verification. Libraries are browser-local; integrate and select cards on the host before starting.'}</p>
    <label className="block text-xs font-semibold">{vi?'Mã bộ':'Pack code'}<input className={input} value={code} onChange={e=>setCode(e.target.value)} placeholder="DEMO-HISTORY"/></label>
    <button type="button" className={button} onClick={()=>perform(()=>activatePack(readCardLibrary(),code))}>{vi?'Kích hoạt bộ':'Activate pack'}</button>
    <p className="text-[11px] text-gray-500">{CARD_PACKS.map(p=>p.code).join(' · ')}</p>
    <ul className="text-xs space-y-2">{CARD_PACKS.filter(p=>library.packs.includes(p.id)).map(p=><li key={p.id} className="p-2 rounded-lg bg-[#FAF6EE]">
      <strong>DEMO · {topicName(p.topic,language)}</strong> · {library.questions.filter(id=>p.questionIds.includes(id)).length}/{p.questionIds.length}
      <button type="button" className="ml-2 underline text-[#543310]" onClick={()=>perform(()=>{let next=readCardLibrary();for(const id of p.questionIds)next=integrateCard(next,new URLSearchParams({pack:p.id,item:id}).toString());return next;})}>{vi?'Thêm toàn bộ thẻ mẫu':'Add all sample cards'}</button>
    </li>)}</ul>
    <label className="block text-xs font-semibold">{vi?'Liên kết trên QR của thẻ':'Card QR link'}<input className={input} value={link} onChange={e=>setLink(e.target.value)}/></label>
    <button type="button" className={button} onClick={()=>perform(()=>{const hash=link.startsWith('#')?link:new URL(link).hash;return integrateCard(readCardLibrary(),hash);})}>{vi?'Tích hợp thẻ':'Integrate card'}</button>
    {available.length>0&&<details className="text-xs"><summary className="cursor-pointer font-semibold text-[#543310]">{vi?'Xem QR thẻ mẫu':'Sample card QR'}</summary>
      <select className={input} value={cardId} onChange={e=>setCardId(e.target.value)}><option value="">{vi?'Chọn thẻ':'Choose card'}</option>{available.map(q=><option key={q.id} value={q.id}>{q.question}</option>)}</select>
      {qr&&<div className="mt-2 flex flex-col items-center gap-2"><img src={qr} alt="QR" className="w-40 h-40"/><a href={qrURL} className="break-all underline">{qrURL}</a></div>}
    </details>}
    <p className="text-xs text-gray-600">{vi?'Đã tích hợp':'Integrated'}: {library.questions.length}</p>
    {message&&<p role="status" className="text-xs text-[#543310]">{message}</p>}
  </section>;
}
