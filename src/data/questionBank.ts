import { engineRandom } from '../engine/random.js';
﻿import data from './questionBank.json' with { type: 'json' };
import resources from './questionResources.json' with { type: 'json' };
import type { ChallengeCard, KnowledgeCard, BiKipTopic, LearningResource } from '../types/game';
import { getProvinceByName } from './provinces.js';
import { copyCard } from '../engine/rules.js';

export type QuestionGroup = 'knowledge' | 'challenge' | 'market' | 'festival';
export type QuestionDifficulty = 'basic' | 'intermediate' | 'advanced';
export interface BankQuestion {
  learningResource?: LearningResource;
  id: string; group: QuestionGroup; difficulty: QuestionDifficulty; number: number;
  question: string; options: string[]; correctAnswer: number; explanation: string;
  sources: {id: string; label: string; url: string}[]; scope: 'general'; topic: BiKipTopic;
  challengeType?: ChallengeCard['challengeType']; actionPrompt?: string; timeLimitSeconds?: number;
}
const resourceIndex = resources.resources as Record<string, LearningResource>;
export const QUESTION_BANK: BankQuestion[] = (data.questions as BankQuestion[]).map(q=>{
  const resource = resources.questionSetId === data.questionSetId ? resourceIndex[q.id] : undefined;
  return {...q, learningResource:resource, sources:[...q.sources,...(resource ? [{id:`reading_${q.id}`,label:resource.title,url:resource.url}] : [])]};
});
export const QUESTION_SET_ID = data.questionSetId;
export const BANK_SOURCE = {file: data.sourceFile,sha256:data.sourceSha256};
export const GROUP_LABELS: Record<QuestionGroup,string> = {knowledge:'Kiến thức',challenge:'Thử thách',market:'Thị trường',festival:'Lễ hội'};
export const DIFFICULTY_LABELS: Record<QuestionDifficulty,string> = {basic:'Dễ',intermediate:'Trung bình',advanced:'Khó'};
export const AVAILABLE_DIFFICULTIES = ['basic','intermediate','advanced'] as const;

// Reuse the supplied 90 quizzes across space types, preserving the source difficulty.
export function questionPool(ids?: string[]): BankQuestion[] {
  return ids ? QUESTION_BANK.filter(q=>ids.includes(q.id)) : QUESTION_BANK;
}
export function pickBankQuestion(group: QuestionGroup, difficulty: QuestionDifficulty = 'basic', excludedIds: string[] = [], ids?: string[], currentId?: string): BankQuestion {
  const allowed=questionPool(ids).filter(q=>q.id!==currentId);
  const matching=allowed.filter(q=>q.difficulty===difficulty);
  const all=matching.length ? matching : allowed;
  const fresh=all.filter(q=>!excludedIds.includes(q.id));
  const pool=fresh.length ? fresh : all;
  if(!pool.length) throw new Error('Không còn câu hỏi phù hợp trong bộ đã chọn / No question available in this pack.');
  return {...pool[Math.floor(engineRandom()*pool.length)],group};
}
export function bankGameCard(question: BankQuestion, rewardProvince: string): KnowledgeCard | ChallengeCard {
  const province=getProvinceByName(rewardProvince);
  if(!province)throw new Error('Chưa xác định được địa phương nhận Kỷ vật.');
  const topic=question.topic==='history'?'Lịch sử':question.topic==='culture'?'Văn hóa':'Địa lý';
  const common={id:question.id,bankQuestionId:question.id,qrContent:question.learningResource?.url || '',questionScope:'general' as const,difficulty:question.difficulty,province:province.name,region:province.region,title:`${topic} · Câu ${question.number}`,topic:question.topic,question:question.question,options:question.options,correctAnswer:question.correctAnswer,didYouKnow:question.explanation,citation:question.sources.map(s=>s.url?`${s.label} — ${s.url}`:s.label).join('\n')};
  if(question.group==='challenge')return copyCard({...common,type:'challenge',challengeType:'quiz',timeLimitSeconds:20,explanation:question.explanation,rewardArtifact:province.artifacts.regular[0],relatedKnowledgeKeyword:question.id});
  return copyCard({...common,type:'knowledge',heritageName:topic,description:question.explanation,culturalSignificance:'Tỉnh đang đứng xác định Kỷ vật thưởng.',category:topic});
}
