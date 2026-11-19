import { AsyncLocalStorage } from 'node:async_hooks';
import { randomBytes } from 'node:crypto';
import { useGameController } from '../src/engine/useGameController';
import { setEngineSourcesResolver, type EngineSources } from '../src/engine/random';
import { QUESTION_BANK } from '../src/data/questionBank';
import { pouchCards } from '../src/engine/rules';
import type { GameState } from '../src/types/game';
import type { RuleChoice } from '../src/components/Modals/RuleChoiceModal';

const context = new AsyncLocalStorage<EngineSources>();
setEngineSourcesResolver(() => context.getStore());

export interface OnlineOperation {
  base: GameState;
  method: string;
  args: any[];
  answers: string[][];
  seed: string;
  time: number;
  contestWinners?: string[];
  friendReward?: string;
}
export interface EnginePanel { choice: RuleChoice | null; notice: string | null; result?: any; }
export function operation(base: GameState, method: string, args: any[] = []): OnlineOperation {
  return { base: structuredClone(base), method, args, answers: [], seed: randomBytes(16).toString('hex'), time: Date.now() };
}
function sources(op: OnlineOperation): EngineSources {
  let n = parseInt(op.seed.slice(0, 8), 16) || 1;
  const random = () => { n ^= n << 13; n ^= n >>> 17; n ^= n << 5; return (n >>> 0) / 4294967296; };
  return { random, now: () => op.time, uuid: () => Array.from({ length: 32 }, () => Math.floor(random() * 16).toString(16)).join('') };
}

// Replays only the current server command, with persisted decisions and entropy.
// No in-process promise is required to survive a serverless restart.
export async function executeOperation(op: OnlineOperation) {
  return context.run(sources(op), async () => {
    const slots: any[] = []; let cursor = 0;
    const hooks = {
      useEffect() {},
      useState(value: any) { const i = cursor++; if (!(i in slots)) slots[i] = typeof value === 'function' ? value() : value; return [slots[i], (v: any) => { slots[i] = typeof v === 'function' ? v(slots[i]) : v; }]; },
      useRef(value: any) { const i = cursor++; if (!(i in slots)) slots[i] = { current: value }; return slots[i]; },
    };
    const render = () => { cursor = 0; return useGameController(op.base.players, 0, { hooks: hooks as any, initialState: structuredClone(op.base), persist: false, contestWinners:op.contestWinners }); };
    let controller = render();
    if (op.friendReward) { controller.handleFriendReward(op.friendReward); controller = render(); }
    const methods: Record<string, (...args: any[]) => any> = {
      start: controller.handleStartGame, roll: controller.handleRollDice, endTurn: controller.handleEndTurn,
      resolve: controller.handleResolveCard, corner: controller.handleSelectCornerOption, closeCorner: controller.handleCloseCorner,
      steal: controller.handleExecuteSteal, useCard: controller.handleUseCard, consumeBiKip: controller.handleConsumeBiKip,
      lotus: controller.handleLotusSwap, shift: controller.handleBanhMiShift, closeToken: controller.handleCloseToken,
      lantern: controller.handlePreviewLantern, redraw: controller.handleLanternRedraw, token: controller.openTokenSkill,
      askFriend: controller.handleAskFriend, friendReward: controller.handleFriendReward, guide: controller.handleGuideApproval,
    };
    if (!methods[op.method]) throw new Error('Thao tác trong ván không hợp lệ.');
    let done = false, error: unknown, result: any, answered = 0;
    Promise.resolve().then(() => methods[op.method](...op.args)).then(value => { result = value; done = true; }, e => { error = e; done = true; });
    for (let step = 0; step < 600; step++) {
      await Promise.resolve(); await Promise.resolve();
      controller = render();
      if (controller.choice) {
        if (answered >= op.answers.length) return { game: controller.gameState, panel: { choice: controller.choice, notice: controller.notice } as EnginePanel, pending: true };
        const ids = op.answers[answered++];
        const choiceId = controller.choice.id;
        if (!ids.length && controller.choice.layout === 'dice') controller.cancelDiceChoice();
        else controller.confirmChoice(ids);
        if (render().choice?.id === choiceId) throw new Error('Lựa chọn không hợp lệ.');
      }
      if (done) {
        if (error) throw error;
        return { game: controller.gameState, panel: { choice: null, notice: controller.notice, result } as EnginePanel, pending: false };
      }
    }
    throw new Error('Thao tác chưa hoàn tất. Hãy thử lại.');
  });
}

// Never accept client-supplied success flags, rewards, cards or score changes.
export function gradeResolution(game: GameState, input: any, taskOpenedAt: number) {
  const card = game.currentActionModal?.card;
  if (!card) throw new Error('Không có nhiệm vụ đang chờ.');
  const player = game.players[game.activePlayerIndex];
  const ids = input?.consumeBiKipIds;
  const id = input?.consumeBiKipId;
  const questionId = card.type === 'knowledge' || card.type === 'challenge' ? card.bankQuestionId : card.type === 'resource' ? card.marketQuestion?.id : card.contestQuestion?.id;
  const question = QUESTION_BANK.find(q => q.id === questionId);
  const answer = input?.quizAnswer;
  if (question && !ids?.length && !id && (!Number.isInteger(answer) || answer < -1 || answer > 3)) throw new Error('Cần gửi phương án trả lời hợp lệ.');
  const success = question ? answer === question.correctAnswer && Date.now() - taskOpenedAt <= 20500 : true;
  const consumeCards = Array.isArray(input?.consumeCards) ? input.consumeCards.map((c: any) => {
    const found = pouchCards(player).find(p => p.id === c?.id);
    if (!found) throw new Error('Thẻ thanh toán không hợp lệ.');
    return found;
  }) : undefined;
  return { success: ids?.length || id ? true : success, consumeBiKipIds: ids, consumeBiKipId: id, consumeCards, marketAnswer: answer,
    logMessage: `${player.name} ${success ? 'hoàn thành' : 'chưa hoàn thành'} nhiệm vụ tại ${'province' in card ? card.province || 'ô đang đứng' : 'ô đang đứng'}.` };
}
