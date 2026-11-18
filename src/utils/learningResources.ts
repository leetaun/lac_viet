import { QUESTION_BANK } from '../data/questionBank';
import type { GameCard, LearningResource } from '../types/game';

/** Resolve from the current registry, including cards restored before links were added. */
export function getCardLearningResource(card: GameCard): LearningResource | undefined {
  const id = card.type === 'knowledge' || card.type === 'challenge' ? card.bankQuestionId
    : card.type === 'resource' ? card.marketQuestion?.id : card.contestQuestion?.id;
  const resource = QUESTION_BANK.find(q=>q.id===id)?.learningResource;
  if (!resource) return undefined;
  try {
    const url = new URL(resource.url);
    return url.protocol==='https:' && !url.username && !url.password ? resource : undefined;
  } catch { return undefined; }
}
