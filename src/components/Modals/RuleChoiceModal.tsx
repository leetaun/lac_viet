import React, { useEffect, useRef, useState } from 'react';

export interface RuleChoice {
  id?: string;
  title: string;
  description?: string;
  options: { id: string; label: string }[];
  min: number;
  max: number;
}

// Uses the same modal, option and footer button classes as CornerStationModal.
export function RuleChoiceModal({ choice, onConfirm }: { choice: RuleChoice; onConfirm: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    return () => previous?.focus();
  }, []);
  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
      <div ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="rule-choice-title" className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-modal-pop" onKeyDown={event => {
        if (event.key !== 'Tab') return;
        const buttons = Array.from(dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || []);
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
        <div className="p-4 brown-gradient-bg text-white flex items-center justify-between">
          <h2 id="rule-choice-title" className="font-serif-lacviet text-lg sm:text-xl font-bold flex items-center gap-2">{choice.title}</h2>
        </div>
        <div className="p-4 sm:p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {choice.description && <p className="text-xs text-gray-700 bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/30 leading-relaxed">{choice.description}</p>}
          {choice.options.map(option => <button key={option.id} type="button" aria-pressed={selected.includes(option.id)} onClick={() => setSelected(previous => previous.includes(option.id) ? previous.filter(id => id !== option.id) : choice.max === 1 ? [option.id] : previous.length < choice.max ? [...previous, option.id] : previous)} className={`w-full p-2 rounded-xl text-xs text-left border flex items-center justify-between transition-all ${selected.includes(option.id) ? 'bg-[#543310] text-white font-bold border-[#543310]' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'}`}>
            {option.label}
          </button>)}
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Đã chọn {selected.length}/{choice.max}</span>
          <button type="button" disabled={selected.length < choice.min || selected.length > choice.max} onClick={() => onConfirm(selected)} className="px-5 py-2.5 brown-gradient-bg hover:opacity-95 text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059] shadow flex items-center gap-2 disabled:opacity-50">Xác nhận</button>
        </div>
      </div>
    </div>
  );
}
