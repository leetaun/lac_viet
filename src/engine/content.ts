import { engineRandom } from './random.js';
﻿import { BOARD_SPACES } from '../data/boardData.js';
import { QUESTION_BANK, pickBankQuestion, bankGameCard } from '../data/questionBank.js';
import { getProvinceByName, PROVINCES_DATA } from '../data/provinces.js';
import { getProvinceName } from '../data/culturalTranslations.js';
import type { ArtifactItem, BiKipCard, BiKipTopic, ChallengeCard, KnowledgeCard } from '../types/game';
import { copyCard, uid } from './rules.js';

export const randomItem = <T,>(items: T[]): T => {
  if (!items.length) throw new Error('Không có nội dung phù hợp.');
  return items[Math.floor(engineRandom() * items.length)];
};
export const topicName = (topic: BiKipTopic, lang: 'vi' | 'en' = 'vi') => ({
  geography: lang === 'vi' ? 'Địa lý' : 'Geography',
  history: lang === 'vi' ? 'Lịch sử' : 'History',
  culture: lang === 'vi' ? 'Văn hóa' : 'Culture',
  cuisine: lang === 'vi' ? 'Ẩm thực' : 'Cuisine',
  art: lang === 'vi' ? 'Nghệ thuật' : 'Art',
  custom: lang === 'vi' ? 'Phong tục' : 'Customs',
  general: lang === 'vi' ? 'Liên ngành' : 'Interdisciplinary'
}[topic]);
export function makeArtifact(province: string, treasureChance = 0.1): ArtifactItem {
  const info = getProvinceByName(province);
  if (!info) throw new Error(`Chưa có kho Kỷ vật cho ${province}.`);
  const isTreasure = engineRandom() < treasureChance;
  return { id: uid('art'), name: isTreasure ? info.artifacts.treasure : randomItem([...info.artifacts.regular]), province: info.name, region: info.region, isTreasure, isSealed: false, storage: 'pouch' };
}
export function makeBiKip(card: KnowledgeCard | ChallengeCard): BiKipCard {
  return {
    id: uid('bk'),
    title: `Bí Kíp: ${card.title}`,
    enTitle: `Bi Kip Scroll: ${card.title}`,
    topic: card.topic,
    topicName: topicName(card.topic, 'vi'),
    enTopicName: topicName(card.topic, 'en'),
    sourceProvince: card.province,
    enSourceProvince: getProvinceName(card.province, 'en'),
    questionSnippet: card.question
  };
}

export function drawLocalQuestion(province: string, type: 'knowledge' | 'challenge', excludeId?: string): KnowledgeCard | ChallengeCard {
  const previous = QUESTION_BANK.find(q=>excludeId===q.id || excludeId?.startsWith(`${q.id}_`));
  const question = pickBankQuestion(type,'basic',previous?[previous.id]:[]);
  return bankGameCard(question,province);
}
export function provinceAt(position: number): string {
  const space = BOARD_SPACES[position];
  if (space.province) return space.province;
  const region = position === 10 ? 'bac_bo' : position === 20 ? 'trung_bo' : position === 30 ? 'nam_bo' : null;
  return randomItem(PROVINCES_DATA.filter(p => !region || p.region === region)).name;
}
