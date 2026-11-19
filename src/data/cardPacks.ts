import { QUESTION_BANK, pickBankQuestion, type QuestionDifficulty, type QuestionGroup } from './questionBank.js';
import type { BiKipTopic } from '../types/game';

export const QUESTION_CATALOG = QUESTION_BANK;
export interface CardPack { id: string; code: string; topic: BiKipTopic; questionIds: string[]; demo: true; }
// Local sample activation codes only; these do not verify commercial ownership.
export const CARD_PACKS: CardPack[] = (['history','culture','geography'] as const).map(topic => ({
  id:`demo-${topic}`,code:`DEMO-${topic.toUpperCase()}`,topic,demo:true,
  questionIds:QUESTION_BANK.filter(q=>q.topic===topic).map(q=>q.id)
}));
export function selectQuestion(group: QuestionGroup, difficulty: QuestionDifficulty, excluded: string[], ids?: string[], currentId?: string) {
  return pickBankQuestion(group,difficulty,excluded,ids,currentId);
}
export function validateQuestionSelection(ids: string[]): void {
  if(ids.length<2 || new Set(ids).size!==ids.length || ids.some(id=>!QUESTION_BANK.some(q=>q.id===id))) throw new Error('Chọn ít nhất 2 câu hỏi hợp lệ từ bộ mới / Select at least 2 valid questions.');
}
