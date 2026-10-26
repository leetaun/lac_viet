import { BOARD_SPACES } from '../data/boardData';
import { CHALLENGE_CARDS, KNOWLEDGE_CARDS } from '../data/cardDecks';
import { getProvinceByName, PROVINCES_DATA } from '../data/provinces';
import type { ArtifactItem, BiKipCard, BiKipTopic, ChallengeCard, KnowledgeCard } from '../types/game';
import { copyCard, uid } from './rules';

export const randomItem = <T,>(items: T[]): T => {
  if (!items.length) throw new Error('Không có nội dung phù hợp.');
  return items[Math.floor(Math.random() * items.length)];
};
export const topicName = (topic: BiKipTopic) => ({ history: 'Lịch sử', cuisine: 'Ẩm thực', art: 'Nghệ thuật', custom: 'Phong tục', general: 'Liên ngành' }[topic]);
export function makeArtifact(province: string, treasureChance = 0.1): ArtifactItem {
  const info = getProvinceByName(province);
  if (!info) throw new Error(`Chưa có kho Kỷ vật cho ${province}.`);
  const isTreasure = Math.random() < treasureChance;
  return { id: uid('art'), name: isTreasure ? info.artifacts.treasure : randomItem([...info.artifacts.regular]), province: info.name, region: info.region, isTreasure, isSealed: false, storage: 'pouch' };
}
export function makeBiKip(card: KnowledgeCard | ChallengeCard): BiKipCard {
  return { id: uid('bk'), title: `Bí Kíp: ${card.title}`, topic: card.topic, topicName: topicName(card.topic), sourceProvince: card.province, questionSnippet: card.question };
}

/** Existing reviewed facts are reused verbatim. No new cultural fact or citation is invented. */
function localQuestion(province: string, topic: BiKipTopic): KnowledgeCard {
  const info = getProvinceByName(province)!;
  const others = PROVINCES_DATA.filter(p => p.id !== info.id);
  const options = [info.name, ...[...others].sort(() => Math.random() - 0.5).slice(0,3).map(p => p.name)].sort(() => Math.random() - 0.5);
  const fact = topic === 'cuisine' ? info.specialty : topic === 'custom' ? info.festivals.join('; ') : info.heritage;
  return {
    id: `local_${info.id}_${topic}`, type: 'knowledge', province: info.name, region: info.region,
    topic, title: `${topicName(topic)} · ${info.name}`, heritageName: info.heritage,
    question: `Tư liệu sau gắn với địa phương nào? “${fact}”`, options, correctAnswer: options.indexOf(info.name),
    description: info.description, culturalSignificance: info.heritage, didYouKnow: info.description,
    // The existing local reference is provided as a link, not misrepresented as a reviewed citation.
    qrContent: info.qrCodeUrl, category: topicName(topic),
  };
}

export function drawLocalQuestion(province: string, type: 'knowledge' | 'challenge', excludeId?: string): KnowledgeCard | ChallengeCard {
  const info = getProvinceByName(province);
  if (!info) throw new Error('Chưa xác định được địa phương.');
  const topics: BiKipTopic[] = ['history','cuisine','art','custom'];
  const excludedTopic = topics.find(t => excludeId?.startsWith(`local_${info.id}_${t}_`));
  const topic = randomItem(topics.filter(t => t !== excludedTopic));
  const pool = (type === 'knowledge' ? KNOWLEDGE_CARDS : CHALLENGE_CARDS).filter(c => getProvinceByName(c.province)?.id === info.id && c.topic === topic && !excludeId?.startsWith(`${c.id}_`));
  if (pool.length) return copyCard(randomItem(pool));
  const base = localQuestion(info.name, topic);
  if (type === 'knowledge') return copyCard(base);
  return { ...copyCard(base), type: 'challenge', challengeType: 'quiz', explanation: base.didYouKnow, rewardArtifact: info.artifacts.regular[0], relatedKnowledgeKeyword: info.heritage, timeLimitSeconds: 20 };
}

export function provinceAt(position: number): string {
  const space = BOARD_SPACES[position];
  if (space.province) return space.province;
  const region = position === 10 ? 'bac_bo' : position === 20 ? 'trung_bo' : position === 30 ? 'nam_bo' : null;
  return randomItem(PROVINCES_DATA.filter(p => !region || p.region === region)).name;
}
