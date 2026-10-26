import data from './questionBank.json';
import type { ChallengeCard, KnowledgeCard, BiKipTopic } from '../types/game';
import { getProvinceByName } from './provinces';
import { copyCard } from '../engine/rules';

export type QuestionGroup = 'knowledge' | 'challenge' | 'market' | 'festival';
export type QuestionDifficulty = 'basic' | 'intermediate' | 'advanced';
export interface BankQuestion {
  id: string; group: QuestionGroup; difficulty: QuestionDifficulty; number: number;
  question: string; options: string[]; correctAnswer: number; explanation: string;
  sources: {id: string; label: string; url: string}[]; scope: 'general';
}
export const QUESTION_BANK = data.questions as BankQuestion[];
export const BANK_SOURCE = {file: data.sourceFile,sha256:data.sourceSha256};
export const GROUP_LABELS: Record<QuestionGroup,string> = {knowledge:'Kiến thức',challenge:'Thử thách',market:'Thị trường',festival:'Lễ hội'};
export const DIFFICULTY_LABELS: Record<QuestionDifficulty,string> = {basic:'Cơ bản',intermediate:'Trung bình',advanced:'Cao cấp'};
export function pickBankQuestion(group: QuestionGroup, difficulty: QuestionDifficulty = 'basic', excludedIds: string[] = []): BankQuestion {
  const all=QUESTION_BANK.filter(q=>q.group===group && q.difficulty===difficulty);
  const fresh=all.filter(q=>!excludedIds.includes(q.id));
  const pool=fresh.length ? fresh : all;
  if(!pool.length) throw new Error('Chưa có câu hỏi phù hợp trong ngân hàng.');
  return pool[Math.floor(Math.random()*pool.length)];
}
export function bankGameCard(question: BankQuestion, rewardProvince: string): KnowledgeCard | ChallengeCard {
  const province=getProvinceByName(rewardProvince);
  if(!province)throw new Error('Chưa xác định được địa phương nhận Kỷ vật.');
  const common={id:question.id,bankQuestionId:question.id,questionScope:'general' as const,difficulty:question.difficulty,province:province.name,region:province.region,title:`${GROUP_LABELS[question.group]} · ${DIFFICULTY_LABELS[question.difficulty]} · Câu ${question.number}`,topic:'general' as BiKipTopic,question:question.question,options:question.options,correctAnswer:question.correctAnswer,didYouKnow:question.explanation,citation:question.sources.map(s=>`${s.label} — ${s.url}`).join('\n')};
  if(question.group==='challenge')return copyCard({...common,type:'challenge',challengeType:'quiz',timeLimitSeconds:20,explanation:question.explanation,rewardArtifact:province.artifacts.regular[0],relatedKnowledgeKeyword:question.id});
  return copyCard({...common,type:'knowledge',heritageName:'Kiến thức liên ngành',description:question.explanation,culturalSignificance:'Câu hỏi chung theo ngân hàng do nhóm cung cấp; tỉnh xác định Kỷ vật thưởng.',qrContent:question.sources[0].url,category:'Liên ngành'});
}
