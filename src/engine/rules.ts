import type { ArtifactGoal, ArtifactItem, BiKipCard, GameCard, GameModeRule, GameState, Player } from '../types/game';

export const uid = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
export const copyCard = <T extends GameCard | BiKipCard>(card: T): T => ({ ...card, id: uid(card.id) });
export const hand = (player: Player): GameCard[] => [...player.cards.knowledge, ...player.cards.resource, ...player.cards.fortune];
export const pouchCards = (player: Player): (GameCard | BiKipCard)[] => [...hand(player), ...player.biKipCards];
export const validArtifacts = (player: Player) => player.artifactItems.filter(a => a.storage === 'safe' || !a.isSealed);
export const totalArtifacts = (player: Player) => player.artifactItems.length;
export const isProtected = (player: Player, players: Player[]) => players.length > 1 && totalArtifacts(player) === Math.min(...players.map(totalArtifacts));
export const normalizePlayer = (player: Player): Player => ({
  ...player,
  artifacts: player.artifactItems.filter(a => a.storage === 'pouch' && !a.isSealed).length,
  safeArtifacts: player.artifactItems.filter(a => a.storage === 'safe').length,
  score: validArtifacts(player).length,
});
export function removeCards(player: Player, ids: string[]): Player {
  const selected = new Set(ids);
  if (selected.size !== ids.length || ids.some(id => !pouchCards(player).some(c => c.id === id))) throw new Error('Thẻ đã dùng hoặc không thuộc túi đồ.');
  return { ...player, biKipCards: player.biKipCards.filter(c=>!selected.has(c.id)), cards: {
    knowledge: player.cards.knowledge.filter(c => !selected.has(c.id)),
    resource: player.cards.resource.filter(c => !selected.has(c.id)),
    fortune: player.cards.fortune.filter(c => !selected.has(c.id)),
  } };
}
export function addCard(player: Player, card: GameCard | BiKipCard): Player {
  if (!('type' in card)) return { ...player, biKipCards: [...player.biKipCards,card] };
  if (card.type === 'challenge') throw new Error('Thử thách không được lưu vào túi đồ.');
  return { ...player, cards: { ...player.cards, [card.type]: [...player.cards[card.type], card] } };
}
export function spendBiKip(player: Player, ids: string[]): Player {
  const selected = new Set(ids);
  if (selected.size !== ids.length || ids.some(id => !player.biKipCards.some(c => c.id === id))) throw new Error('Không đủ Bí kíp hợp lệ.');
  return { ...player, biKipCards: player.biKipCards.filter(c => !selected.has(c.id)) };
}
export function transferCard(players: Player[], fromId: string, toId: string, cardId: string): Player[] {
  if (fromId === toId) throw new Error('Không thể tự chuyển thẻ.');
  const source = players.find(p => p.id === fromId);
  const target = players.find(p => p.id === toId);
  const card = source && pouchCards(source).find(c => c.id === cardId);
  if (!source || !target || !card) throw new Error('Giao dịch không hợp lệ.');
  return players.map(p => p.id === fromId ? removeCards(p, [cardId]) : p.id === toId ? addCard(p, card) : p);
}
export function canWin(player: Player, goal: ArtifactGoal, rule: GameModeRule): boolean {
  const artifacts = validArtifacts(player);
  const minimum = rule === 'truong_ky' ? 2 : 1;
  return artifacts.length >= goal && ['bac_bo', 'trung_bo', 'nam_bo'].every(region => artifacts.filter(a => a.region === region).length >= minimum);
}
export function deposit(player: Player, ids: string[]): Player {
  if (!ids.length || ids.length > 2 || new Set(ids).size !== ids.length || ids.some(id => !player.artifactItems.some(a => a.id === id && a.storage === 'pouch' && !a.isSealed))) throw new Error('Chỉ ký gửi tối đa 2 Kỷ vật chưa phong ấn trong Tay nải.');
  return normalizePlayer({ ...player, artifactItems: player.artifactItems.map(a => ids.includes(a.id) ? { ...a, storage: 'safe' } : a) });
}
export function reclaim(player: Player, lost: ArtifactItem[], id: string): { player: Player; lost: ArtifactItem[] } {
  const artifact = lost.find(a => a.id === id);
  if (!artifact) throw new Error('Kỷ vật không còn trong Kho thất lạc.');
  return { player: normalizePlayer({ ...player, artifactItems: [...player.artifactItems, { ...artifact, storage: 'pouch', isSealed: false, isTreasure: false }] }), lost: lost.filter(a => a.id !== id) };
}
export function stealArtifact(players: Player[], attackerId: string, targetId: string, artifactId: string, paymentId: string): Player[] {
  const attacker = players.find(p => p.id === attackerId);
  const target = players.find(p => p.id === targetId);
  const artifact = target?.artifactItems.find(a => a.id === artifactId && a.storage === 'pouch' && !a.isTreasure);
  if (!attacker || !target || attackerId === targetId || !artifact || isProtected(target, players) || !attacker.cards.resource.some(c => c.id === paymentId)) throw new Error('Không thể cướp Kỷ vật này.');
  return players.map(p => p.id === attackerId
    ? normalizePlayer({ ...removeCards(p, [paymentId]), artifactItems: [...p.artifactItems, { ...artifact, storage: 'pouch' }] })
    : p.id === targetId ? normalizePlayer({ ...p, artifactItems: p.artifactItems.filter(a => a.id !== artifactId) }) : p);
}
export function sealArtifact(players: Player[], targetId: string, artifactId: string): Player[] {
  const target = players.find(p => p.id === targetId);
  if (!target || isProtected(target, players) || !target.artifactItems.some(a => a.id === artifactId && a.storage === 'pouch' && !a.isSealed)) throw new Error('Mục tiêu được bảo vệ hoặc Kỷ vật không hợp lệ.');
  return players.map(p => p.id === targetId ? normalizePlayer({ ...p, artifactItems: p.artifactItems.map(a => a.id === artifactId ? { ...a, isSealed: true } : a) }) : p);
}
export function placeMilestone(state: GameState, cardId: string, replaceIndex?: number): GameState {
  const player = state.players[state.activePlayerIndex];
  if (state.turnStep !== 1 || !player.cards.resource.some(c => c.id === cardId && c.category === 'milestone') || player.position % 10 === 0 || state.milestones.some(m => m.spaceIndex === player.position)) throw new Error('Chỉ đặt Cột mốc ở ô địa phương chưa có cờ, trong bước Chuẩn bị.');
  const owned = state.milestones.filter(m => m.playerId === player.id);
  if (owned.length >= 2 && !owned.some(m => m.spaceIndex === replaceIndex)) throw new Error('Chọn Cột mốc cũ để nhổ.');
  const milestones = [...state.milestones.filter(m => !(m.playerId === player.id && m.spaceIndex === replaceIndex)), { playerId: player.id, playerSeat: player.seat, playerColor: player.color, spaceIndex: player.position, provinceName: '' }];
  return { ...state, milestones, players: state.players.map(p => p.id === player.id ? { ...removeCards(p, [cardId]), milestones: milestones.filter(m => m.playerId === p.id).map(m => m.spaceIndex) } : p) };
}
export function timedRanking(players: Player[]): Player[] {
  const regions = (p: Player) => new Set(validArtifacts(p).map(a => a.region)).size;
  const distance = (p: Player) => (40 - p.position) % 40;
  return [...players].sort((a, b) => validArtifacts(b).length - validArtifacts(a).length || regions(b) - regions(a) || distance(a) - distance(b));
}
export function weightedDraw<T extends { ratePercent: number }>(cards: T[], random: () => number = Math.random): T {
  const total = cards.reduce((sum, c) => sum + c.ratePercent, 0);
  if (total <= 0) throw new Error('Kho thẻ trống.');
  let value = random() * total;
  for (const card of cards) { value -= card.ratePercent; if (value < 0) return card; }
  return cards[cards.length - 1];
}

export function failChallenge(state: GameState, artifactId?: string, discardId?: string, useNonLa = false): GameState {
  const player = state.players[state.activePlayerIndex];
  let updated = player;
  let lostAndFound = state.lostAndFound;
  if (useNonLa) {
    if (player.token !== 'non_la' || !player.tokenSkillAvailable) throw new Error('Nón lá chưa sẵn sàng.');
    updated = { ...player, tokenSkillAvailable: false };
  } else if (player.artifactItems.some(a => a.storage === 'pouch')) {
    const artifact = player.artifactItems.find(a => a.id === artifactId && a.storage === 'pouch');
    if (!artifact) throw new Error('Chọn 1 Kỷ vật trong Tay nải để làm rơi.');
    lostAndFound = [...lostAndFound, artifact];
    updated = normalizePlayer({ ...player, artifactItems: player.artifactItems.filter(a => a.id !== artifact.id) });
  } else if (pouchCards(player).length) {
    if (!discardId) throw new Error('Chọn 1 thẻ để bỏ khi Tay nải trống.');
    updated = removeCards(player, [discardId]);
  }
  return { ...state, lostAndFound, players: state.players.map(p => p.id === updated.id ? updated : p) };
}

export interface CardUse {
  targetId?: string;
  artifactId?: string;
  replaceMilestone?: number;
  blockedBy?: 'shield' | 'negate';
}

/** Apply a card only after its choices and any defensive response have been collected. */
export function useCard(state: GameState, cardId: string, choice: CardUse = {}): GameState {
  const actor = state.players[state.activePlayerIndex];
  const card = hand(actor).find(c => c.id === cardId);
  if (!card || state.gameStatus !== 'playing') throw new Error('Không có thẻ để sử dụng.');
  if (card.type === 'resource' && card.category === 'milestone') return placeMilestone(state, cardId, choice.replaceMilestone);
  const isAttack = (card.type === 'resource' && card.category === 'crossbow') || (card.type === 'fortune' && card.eventType === 'seal');
  if (!isAttack) throw new Error('Thẻ này chỉ được dùng ở thời điểm phản ứng tương ứng.');
  if (state.turnStep !== 1 || state.options.exploreMode) throw new Error('Chỉ tấn công trong bước Chuẩn bị, ngoài chế độ Khám phá.');
  const target = state.players.find(p => p.id === choice.targetId && p.id !== actor.id);
  const artifact = target?.artifactItems.find(a => a.id === choice.artifactId && a.storage === 'pouch');
  if (!target || !artifact || isProtected(target, state.players)) throw new Error('Mục tiêu được bảo vệ.');
  if (card.type === 'resource') {
    const distance = Math.abs(actor.position - target.position);
    if (Math.min(distance, 40 - distance) > 3 || artifact.isTreasure) throw new Error('Nỏ thần chỉ lấy Kỷ vật thường trong phạm vi 3 ô.');
  } else if (artifact.isSealed) throw new Error('Kỷ vật đã bị phong ấn.');
  let players = state.players.map(p => p.id === actor.id ? removeCards(p, [cardId]) : p);
  if (choice.blockedBy) {
    const defense = choice.blockedBy === 'shield' ? target.cards.resource.find(c => c.category === 'shield') : target.cards.fortune.find(c => c.eventType === 'negate');
    if (!defense) throw new Error('Không có thẻ phòng vệ này.');
    players = players.map(p => p.id === target.id ? removeCards(p, [defense.id]) : p);
  } else if (card.type === 'fortune') {
    players = sealArtifact(players, target.id, artifact.id);
  } else {
    players = players.map(p => p.id === actor.id ? normalizePlayer({ ...p, artifactItems: [...p.artifactItems, artifact] }) : p.id === target.id ? normalizePlayer({ ...p, artifactItems: p.artifactItems.filter(a => a.id !== artifact.id) }) : p);
  }
  return { ...state, players };
}

export function finishTurn(state: GameState, discardIds: string[] = [], now = Date.now()): GameState {
  if (!state.hasRolled || state.turnStep !== 5) throw new Error('Chưa hoàn tất nhiệm vụ của lượt.');
  const actor = state.players[state.activePlayerIndex];
  if (discardIds.length !== Math.max(0, pouchCards(actor).length - 5)) throw new Error('Cần chọn đủ số thẻ thừa để xả.');
  const players = state.players.map(p => p.id === actor.id ? removeCards(p, discardIds) : p);
  if (state.options.timedMode && state.endsAt && now >= state.endsAt) {
    return { ...state, players, gameStatus: 'game_over', winner: timedRanking(players)[0] };
  }
  const index = (state.activePlayerIndex + 1) % players.length;
  return { ...state, players, activePlayerIndex: index, round: state.round + (index === state.firstPlayerIndex ? 1 : 0), diceValue: null, hasRolled: false, turnStep: 1 };
}
