import React from 'react';
import type { BankQuestion } from '../data/questionBank';

export function QuestionSources({sources}:{sources:BankQuestion['sources']}) {
  return <div className="text-[11px] text-gray-500 space-y-1">{sources.map(source=>source.url
    ? <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="block hover:underline">{source.label}</a>
    : <span key={source.id} className="block">{source.label}</span>)}</div>;
}
