import React, { useState } from 'react';
import { Minus, Plus, RotateCcw, MapPin } from 'lucide-react';
import geometry from '../../data/provinceMap.json';
import { PROVINCES_DATA, type ProvinceInfo } from '../../data/provinces';
import { getProvinceData } from '../../data/culturalTranslations';

interface Props {
  language: 'vi' | 'en';
  visibleProvinces: ProvinceInfo[];
  onSelect: (province: ProvinceInfo) => void;
}

// Callouts keep the small Red River/Mekong delta regions readable.
const callouts: Record<string, [number, number, 'start' | 'end']> = {
  bacninh: [540, 187, 'start'], haiphong: [590, 224, 'start'],
  hungyen: [570, 261, 'start'], ninhbinh: [550, 298, 'start'],
  hanoi: [250, 266, 'end'], phutho: [235, 232, 'end'],
  quangninh: [550, 153, 'start'], thainguyen: [470, 115, 'start'],
  dongthap: [287, 850, 'end'], tayninh: [300, 817, 'end'],
  cantho: [285, 918, 'end'], vinhlong: [520, 930, 'start'],
  tphcm: [550, 872, 'start'], angiang: [270, 884, 'end'],
};
const labelPositions: Record<string, [number, number]> = {
  tuyenquang: [350, 90], caobang: [422, 74], laichau: [223, 112],
  dienbien: [209, 166], laocai: [298, 141], sonla: [290, 197],
  langson: [454, 149], lamdong: [533, 803], dongnai: [472, 791],
};
const palettes: Record<string, string[]> = {
  bac_bo: ['#c9ddcd', '#dce8d0', '#b9d3c0', '#d7e5de'],
  trung_bo: ['#ead6ad', '#f3e5c7', '#e4c99b', '#efdab9'],
  nam_bo: ['#c3dfdc', '#d6e9e3', '#afd0cd', '#cce0d4'],
};
const islandDots = [[-25,-10],[-5,-22],[16,-12],[31,8],[8,17],[-16,24],[-35,9],[26,37]];

export function VietnamProvinceMap({ language, visibleProvinces, onSelect }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const visible = new Set(visibleProvinces.map(p => p.id));
  const hovered = PROVINCES_DATA.find(p => p.id === hoveredId && visible.has(p.id));
  const details = hovered ? getProvinceData(hovered, language) : null;
  const interaction = (province: ProvinceInfo) => ({
    role: 'button' as const,
    tabIndex: visible.has(province.id) ? 0 : -1,
    'aria-label': `${getProvinceData(province, language).name} — ${language === 'vi' ? 'Xem chi tiết' : 'View details'}`,
    'aria-disabled': !visible.has(province.id),
    onMouseEnter: () => setHoveredId(province.id),
    onMouseLeave: () => setHoveredId(null),
    onFocus: () => setHoveredId(province.id),
    onBlur: () => setHoveredId(null),
    onClick: () => { if (visible.has(province.id)) onSelect(province); },
    onKeyDown: (event: React.KeyboardEvent<SVGGElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (visible.has(province.id)) onSelect(province);
      }
    },
  });

  return <section className="province-atlas" aria-label={language === 'vi' ? 'Bản đồ Việt Nam tương tác' : 'Interactive Vietnam map'}>
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#C5A059]/25">
      <p className="text-xs text-[#705637] flex items-center gap-2"><MapPin size={15} />
        {language === 'vi' ? 'Di chuột để xem nhanh · Bấm tỉnh để khám phá' : 'Hover to preview · Select a province to explore'}
      </p>
      <div className="flex items-center gap-1">
        <button className="atlas-control" disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, z - .4))} aria-label={language === 'vi' ? 'Thu nhỏ' : 'Zoom out'}><Minus size={16} /></button>
        <button className="atlas-control" onClick={() => setZoom(1)} aria-label={language === 'vi' ? 'Về kích thước ban đầu' : 'Reset zoom'}><RotateCcw size={15} /></button>
        <button className="atlas-control" disabled={zoom >= 2.2} onClick={() => setZoom(z => Math.min(2.2, z + .4))} aria-label={language === 'vi' ? 'Phóng to' : 'Zoom in'}><Plus size={16} /></button>
      </div>
    </div>
    <div className="atlas-canvas">
      <svg viewBox="100 20 770 1020" style={{ width: `${zoom * 100}%` }} className="atlas-svg" aria-label={language === 'vi' ? 'Các tỉnh trên bản đồ Việt Nam' : 'Provinces of Vietnam'}>
        <defs><filter id="atlas-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#725128" floodOpacity=".13" /></filter></defs>
        <text x="700" y="590" className="atlas-sea" transform="rotate(-12 700 590)">{language === 'vi' ? 'BIỂN ĐÔNG' : 'EAST SEA'}</text>
        <g filter="url(#atlas-shadow)">
          {geometry.map((shape, index) => {
            const province = PROVINCES_DATA.find(p => p.id === shape.id)!;
            const active = visible.has(shape.id);
            return <g key={shape.id} {...interaction(province)} className={`atlas-province ${active ? '' : 'is-muted'} ${hoveredId === shape.id ? 'is-hovered' : ''}`}>
              <title>{getProvinceData(province, language).name}</title>
              <path d={shape.d} fill={palettes[province.region][index % 4]} className="atlas-region" />
            </g>;
          })}
        </g>
        {/* Labels sit above every polygon so neighbouring regions never cover them. */}
        {geometry.map(shape => {
          const province = PROVINCES_DATA.find(p => p.id === shape.id)!;
          const callout = callouts[shape.id];
          const [x,y] = callout || labelPositions[shape.id] || shape.center;
          const name = getProvinceData(province, language).name;
          const words = name.split(' ');
          const lines = !callout && words.length > 1 ? [words.slice(0, Math.ceil(words.length/2)).join(' '), words.slice(Math.ceil(words.length/2)).join(' ')] : [name];
          return <g key={shape.id} {...interaction(province)} tabIndex={-1} aria-hidden="true" className={`atlas-label-group ${visible.has(shape.id) ? '' : 'is-muted'} ${hoveredId === shape.id ? 'is-hovered' : ''}`}>
            {callout && <><path className="atlas-leader" d={`M${shape.center.join(',')} L${x + (callout[2] === 'start' ? -12 : 12)},${y-4} L${x},${y-4}`} /><circle cx={shape.center[0]} cy={shape.center[1]} r="2.5" fill="#876137" /></>}
            <text x={x} y={y - (lines.length-1)*7} textAnchor={callout?.[2] || 'middle'} className="atlas-label">
              {lines.map((line,i) => <tspan x={x} dy={i ? 15 : 0} key={i}>{line}</tspan>)}
            </text>
          </g>;
        })}
        {(['hoangsa', 'truongsa'] as const).map((id, i) => {
          const province = PROVINCES_DATA.find(p => p.id === id)!;
          const x = i ? 736 : 695; const y = i ? 780 : 415;
          return <g key={id} {...interaction(province)} className={`atlas-islands ${visible.has(id) ? '' : 'is-muted'} ${hoveredId === id ? 'is-hovered' : ''}`}>
            <title>{province.name}</title>
            <circle cx={x} cy={y} r="57" fill="#efe1bf" fillOpacity=".25" stroke="#bd9d62" strokeDasharray="3 6" />
            {islandDots.map(([dx,dy],j) => <ellipse key={j} cx={x+dx} cy={y+dy} rx={j%2 ? 4 : 6} ry="2.7" transform={`rotate(-25 ${x+dx} ${y+dy})`} fill="#96b3a1" stroke="#6f8b76" strokeWidth=".7" />)}
            <text x={x} y={y+81} textAnchor="middle" className="atlas-label">{language === 'vi' ? `Quần đảo ${i ? 'Trường Sa' : 'Hoàng Sa'}` : `${i ? 'Truong Sa' : 'Hoang Sa'} Islands`}</text>
            <text x={x} y={y+101} textAnchor="middle" className="atlas-island-caption">{language === 'vi' ? '(Việt Nam)' : '(Vietnam)'}</text>
          </g>;
        })}
        <g transform="translate(145 440)">
          <text className="atlas-country font-serif-lacviet">VIỆT NAM</text>
          {(['bac_bo','trung_bo','nam_bo']).map((region,i) => <g key={region} transform={`translate(0 ${35+i*27})`}><circle r="5" fill={palettes[region][0]} stroke="#9a875f" /><text x="15" y="5" className="atlas-legend">{language === 'vi' ? ['Bắc Bộ','Trung Bộ','Nam Bộ'][i] : ['North','Central','South'][i]}</text></g>)}
        </g>
      </svg>
      {details && <div className="atlas-preview" aria-live="polite">
        <p className="font-serif-lacviet font-bold text-[#543310] text-lg">{details.name}</p>
        <p className="text-[11px] text-[#8a704c] mt-1">{details.regionName} · {language === 'vi' ? hovered!.tileType : 'View details'}</p>
        <p className="text-xs text-gray-600 leading-relaxed mt-2">{details.heritage}</p>
      </div>}
    </div>
    <p className="px-4 py-3 text-[11px] text-gray-500 border-t border-[#C5A059]/20">
      {visibleProvinces.length === 0 ? (language === 'vi' ? 'Không tìm thấy địa phương phù hợp. Hãy thử từ khóa khác.' : 'No matching places. Try another search.') : (language === 'vi' ? `${visibleProvinces.length}/36 địa phương đang được làm nổi bật. Phóng to để xem rõ hơn.` : `${visibleProvinces.length}/36 places highlighted. Zoom in for a closer look.`)}
      {' '}{language === 'vi' ? 'Ranh giới giản lược; các cụm đảo được minh họa, không theo tỷ lệ.' : 'Simplified boundaries; island clusters are illustrated, not to scale.'}
    </p>
  </section>;
}
