import { createHash, randomBytes, randomInt } from 'node:crypto';
import type { OnlineIdentity, OnlineMember, OnlineRoomView } from '../src/types/online';
import type { TokenType } from '../src/types/game';
import type { RoomStore } from './onlineStore';
import { executeOperation, gradeResolution, operation, type OnlineOperation } from './onlineEngine.js';
import { QUESTION_BANK } from '../src/data/questionBank.js';
import { STARTER_BIKIP_CARDS } from '../src/data/cardDecks.js';
import { hand } from '../src/engine/rules.js';
import type { GameState, Player } from '../src/types/game';

interface PrivateRoom extends OnlineRoomView {
  credentials: Record<string, string>;
  requests: Record<string, { memberId: string; identity?: OnlineIdentity }>;
  operation?: OnlineOperation;
  guideApproved?: boolean;
}
const tokens: TokenType[] = ['non_la', 'hoa_sen', 'den_long', 'banh_mi'];
const digest = (value: string) => createHash('sha256').update(value).digest('hex');
const secret = () => randomBytes(32).toString('hex');
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const code = () => Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join('');
const text = (value: unknown, max: number, label: string) => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max || /[\u0000-\u001f]/.test(value)) throw new Error(`${label} không hợp lệ (1–${max} ký tự).`);
  return value.trim();
};
const view = (room: PrivateRoom): OnlineRoomView => {
  const { credentials, requests, operation: pendingOperation, guideApproved, ...publicRoom } = room;
  return publicRoom;
};

export function createOnlineRoomService(store: RoomStore) {
  return async (body: any) => {
    if (!body || typeof body.action !== 'string') throw new Error('Yêu cầu không hợp lệ.');
    const now = Date.now();
    if (body.action === 'create') {
      const name = text(body.name, 60, 'Tên phòng');
      const playerName = text(body.playerName, 24, 'Tên người chơi');
      for (let attempt = 0; attempt < 5; attempt++) {
        const roomCode = code(), memberId = secret().slice(0, 20), memberToken = secret();
        const identity = { code: roomCode, memberId, token: memberToken };
        const room: PrivateRoom = { code: roomCode, name, hostId: memberId, version: 1, status: 'lobby', members: [{ id: memberId, name: playerName, token: 'non_la', ready: true, lastSeen: now }], settings: { rule: 'toc_chien', goal: 3 }, game: null, expiresAt: now + 6 * 3600000, credentials: { [memberId]: digest(memberToken) }, requests: {} };
        if (await store.compareAndSet(roomCode, null, JSON.stringify(room), room.expiresAt)) return { identity, room: view(room) };
      }
      throw new Error('Chưa tạo được mã phòng. Hãy thử lại.');
    }
    const roomCode = String(body.code || '').trim().toUpperCase();
    if (!/^[A-HJ-NP-Z2-9]{6}$/.test(roomCode)) throw new Error('Mã phòng gồm 6 ký tự.');
    for (let attempt = 0; attempt < 8; attempt++) {
      const raw = await store.read(roomCode);
      if (!raw) throw new Error('Phòng không tồn tại hoặc đã hết hạn.');
      const room: PrivateRoom = JSON.parse(raw);
      if (room.status === 'closed') throw new Error('Chủ phòng đã đóng phòng.');
      const before = room.version;
      const member: OnlineMember | undefined = room.members.find(m => m.id === body.memberId && typeof body.token === 'string' && room.credentials[m.id] === digest(body.token));
      if (body.action !== 'join' && !member) throw new Error('Bạn không có quyền truy cập phòng này.');
      if (body.action === 'read') return { room: view(room) };
      const requestId = text(body.requestId, 80, 'Mã thao tác');
      if (room.requests[requestId]) {
        const previous = room.requests[requestId];
        if (body.action === 'join') {
          if (previous.identity?.token !== body.joinToken) throw new Error('Yêu cầu tham gia không hợp lệ.');
          return { room: view(room), identity: previous.identity };
        }
        if (previous.memberId !== member!.id) throw new Error('Mã thao tác đã được sử dụng.');
        return { room: view(room) };
      }
      let identity: OnlineIdentity | undefined;
      if (body.action === 'join') {
        if (room.status !== 'lobby') throw new Error('Ván đã bắt đầu, không thể thêm người chơi mới.');
        if (room.members.length >= 4) throw new Error('Phòng đã đủ 4 người.');
        // Client-generated join secret makes retries safe without exposing an existing seat.
        if (typeof body.joinToken !== 'string' || !/^[a-f0-9]{64}$/.test(body.joinToken)) throw new Error('Mã tham gia không hợp lệ.');
        const memberId = secret().slice(0, 20);
        identity = { code: roomCode, memberId, token: body.joinToken };
        room.members.push({ id: memberId, name: text(body.playerName, 24, 'Tên người chơi'), token: tokens.find(t => !room.members.some(m => m.token === t))!, ready: false, lastSeen: now });
        room.credentials[memberId] = digest(body.joinToken);
      } else {
        if (body.version !== room.version && body.action !== 'heartbeat') throw new Error('Phòng vừa thay đổi. Hãy thử lại từ trạng thái mới.');
        member!.lastSeen = now;
        if (body.action === 'heartbeat') { /* Refresh only the caller's presence. */ }
        else if (body.action === 'configure') {
          if (member!.id !== room.hostId || room.status !== 'lobby') throw new Error('Chỉ chủ phòng được cấu hình trước khi bắt đầu.');
          if (!['toc_chien', 'co_ban', 'truong_ky'].includes(body.rule)) throw new Error('Chế độ chơi không hợp lệ.');
          room.settings = { rule: body.rule, goal: body.rule === 'toc_chien' ? 3 : body.rule === 'co_ban' ? 5 : 7 };
          room.members.forEach(m => { m.ready = m.id === room.hostId; });
        } else if (body.action === 'profile') {
          if (room.status !== 'lobby') throw new Error('Không đổi quân cờ khi ván đã bắt đầu.');
          if (!tokens.includes(body.playerToken) || room.members.some(m => m.id !== member!.id && m.token === body.playerToken)) throw new Error('Quân cờ này đã có người chọn.');
          member!.name = text(body.playerName, 24, 'Tên người chơi'); member!.token = body.playerToken; member!.ready = member!.id === room.hostId;
        } else if (body.action === 'ready') {
          if (room.status !== 'lobby' || typeof body.ready !== 'boolean') throw new Error('Không thể đổi trạng thái sẵn sàng.');
          member!.ready = body.ready;
        } else if (body.action === 'start') {
          if (member!.id !== room.hostId || room.status !== 'lobby') throw new Error('Chỉ chủ phòng được bắt đầu ván.');
          if (room.members.length < 2 || room.members.some(m => !m.ready)) throw new Error('Cần ít nhất 2 người và mọi người đều sẵn sàng.');
          const players: Player[] = room.members.map((m, i) => ({ id: m.id, name: m.name, token: m.token, seat: i + 1, isAI: false, color: ['#0284C7','#EC4899','#F59E0B','#EA580C'][i], position: 0, artifactItems: [], artifacts: 0, safeArtifacts: 0, biKipCards: [{ ...STARTER_BIKIP_CARDS[i], id: `starter-${m.id}` }], milestones: [], score: 0, tokenSkillAvailable: true, hasShield: false, immuneToPenalty: false, cards: { knowledge: [], resource: [], fortune: [] }, lapsCompleted: 0 }));
          const initial: GameState = { mode: 'online', roomCode, players, activePlayerIndex: 0, firstPlayerIndex: 0, gameModeRule: room.settings.rule, artifactGoal: room.settings.goal, round: 1, turnStep: 1, diceValue: null, hasRolled: false, gameStatus: 'setup', winner: null, lostAndFound: [], milestones: [], options: { physicalDice: false, physicalQR: false, starterBiKip: true, exploreMode: false, timedMode: false }, currentActionModal: null, historyLog: [] };
          const result = await executeOperation(operation(initial, 'start', [{ mode: 'online', roomCode, gameModeRule: room.settings.rule, artifactGoal: room.settings.goal, playerCount: players.length, players, options: initial.options }]));
          room.game = result.game; room.panel = result.panel; room.status = 'playing';
        } else if (body.action === 'answer') {
          const card = room.game?.currentActionModal?.card;
          const activeId = room.game?.players[room.game.activePlayerIndex].id;
          if (!card || card.id !== body.cardId || (!('contestQuestion' in card && card.contestQuestion) && member!.id !== (room.friendId || activeId))) throw new Error('Không có câu hỏi dành cho bạn.');
          if (!Number.isInteger(body.answer) || body.answer < -1 || body.answer > 3) throw new Error('Đáp án không hợp lệ.');
          room.taskSubmissions ||= {};
          if (!room.taskSubmissions[member!.id]) room.taskSubmissions[member!.id] = { answer: now - (room.taskOpenedAt || now) > 20500 ? -1 : body.answer, at: now };
        } else if (body.action === 'command' || body.action === 'decide') {
          if (room.status !== 'playing' || !room.game) throw new Error('Ván chưa bắt đầu.');
          const oldTask = room.game.currentActionModal?.card?.id;
          let op: OnlineOperation;
          if (body.action === 'decide') {
            if (!room.operation || !room.panel?.choice || room.panel.choice.id !== body.choiceId || room.panel.choice.playerId !== member!.id) throw new Error('Lựa chọn này không thuộc bạn hoặc đã hết hiệu lực.');
            if (!Array.isArray(body.ids) || body.ids.some((id: any) => typeof id !== 'string')) throw new Error('Lựa chọn không hợp lệ.');
            op = room.operation; op.answers.push(body.ids);
          } else {
            if (room.operation) throw new Error('Hãy hoàn tất lựa chọn đang chờ.');
            if (room.game.players[room.game.activePlayerIndex].id !== member!.id && !(body.method === 'resolve' && room.friendId === member!.id)) throw new Error('Chưa đến lượt của bạn.');
            if (room.game.gameStatus !== 'playing') throw new Error('Ván đã kết thúc.');
            const allowed = ['roll','endTurn','resolve','corner','closeCorner','steal','useCard','consumeBiKip','lotus','shift','closeToken','lantern','redraw','token','askFriend','guide'];
            if (!allowed.includes(body.method) || !Array.isArray(body.args) || body.args.length > 3) throw new Error('Thao tác không hợp lệ.');
            let method = body.method, args = body.args;
            const actor = room.game.players[room.game.activePlayerIndex];
            let contestWinners: string[] | undefined;
            if (method === 'resolve') {
              const card = room.game.currentActionModal?.card;
              if (card?.type === 'fortune' && card.contestQuestion) {
                const submissions = room.taskSubmissions || {};
                if (Object.keys(submissions).length < room.members.length && now - (room.taskOpenedAt || now) < 20000) throw new Error('Hội thi đang chờ các người chơi trả lời.');
                const correct = QUESTION_BANK.find(q => q.id === card.contestQuestion?.id)!.correctAnswer;
                const winners = Object.entries(submissions).filter(([, s]) => s.answer === correct).sort((a,b) => a[1].at - b[1].at);
                contestWinners = winners.length ? [winners[0][0]] : [];
                args = [{ success:true, logMessage:'Hội thi đã kết thúc.' }];
              } else {
                const submitted = room.taskSubmissions?.[room.friendId || member!.id];
                args = [gradeResolution(room.game, { ...args[0], ...(submitted ? { quizAnswer:submitted.answer } : {}) }, submitted ? now : room.taskOpenedAt || now)];
              }
            }
            if (method === 'useCard') {
              const card = hand(actor).find(c => c.id === args[0]?.id);
              if (!card) throw new Error('Thẻ không thuộc túi đồ của bạn.'); args = [card];
            }
            if (method === 'steal') args = [args[0], actor.cards.resource.find(c => c.id === args[1]?.id)];
            if (room.game.currentActionModal?.type === 'quiz_start' && ['corner','closeCorner'].includes(method)) {
              const answers = args[2];
              if (!Array.isArray(answers) || answers.length !== 2 || answers.some((a: any) => !Number.isInteger(a) || a < -2 || a > 3) || answers.filter((a: number) => a === -2).length > Number(room.guideApproved === true)) throw new Error('Cần hoàn tất hai câu hỏi START.');
              const score = (room.startQuestionIds || []).reduce((sum, id, i) => sum + Number(answers[i] === -2 || QUESTION_BANK.find(q => q.id === id)?.correctAnswer === answers[i]), 0);
              method = score ? 'corner' : 'closeCorner'; args = score ? [score === 2 && room.game.lostAndFound.length ? 'reclaim_start' : score === 2 ? 'fortune' : 'resource'] : [];
            }
            if (method === 'corner' && !['fortune','resource','restore_skill','safe_deposit','reclaim_start'].includes(args[0])) throw new Error('Đặc quyền không hợp lệ.');
            op = operation(room.game, method, args); room.pendingRequest = requestId;
            op.contestWinners = contestWinners;
            if (method === 'resolve' && room.friendId && args[0].success) op.friendReward = room.friendId;
          }
          const result = await executeOperation(op);
          room.game = result.game; room.panel = result.panel;
          if (!result.pending && op.method === 'askFriend') room.friendId = result.panel.result;
          if (!result.pending && op.method === 'guide') room.guideApproved = result.panel.result === true;
          if (result.pending) room.operation = op;
          else { delete room.operation; room.completedRequest = room.pendingRequest || requestId; room.pendingRequest = null; }
          if (oldTask !== room.game.currentActionModal?.card?.id) { room.taskOpenedAt = now; room.taskSubmissions = {}; delete room.friendId; }
          if (room.game.currentActionModal?.type === 'quiz_start' && !room.startQuestionIds?.length) {
            const pool = QUESTION_BANK.filter(q => q.difficulty === 'basic');
            const first = randomInt(pool.length), second = (first + 1 + randomInt(pool.length - 1)) % pool.length;
            room.startQuestionIds = [pool[first].id, pool[second].id];
          } else if (room.game.currentActionModal?.type !== 'quiz_start') { room.startQuestionIds = []; delete room.guideApproved; }
        } else if (body.action === 'restart') {
          if (member!.id !== room.hostId || room.game?.gameStatus !== 'game_over') throw new Error('Chỉ chủ phòng được tạo ván mới sau khi ván kết thúc.');
          room.status = 'lobby'; room.game = null; room.panel = undefined; room.members.forEach(m => { m.ready = m.id === room.hostId; });
        } else if (body.action === 'leave') {
          if (room.status !== 'lobby') throw new Error('Ván đang chơi. Bạn có thể đóng trang rồi kết nối lại.');
          if (member!.id === room.hostId) room.status = 'closed';
          else { room.members = room.members.filter(m => m.id !== member!.id); delete room.credentials[member!.id]; }
        } else throw new Error('Thao tác phòng chưa được hỗ trợ.');
      }
      room.version++;
      room.requests[requestId] = { memberId: identity?.memberId || member!.id, ...(identity ? { identity } : {}) };
      const requestIds = Object.keys(room.requests);
      for (const id of requestIds.slice(0, Math.max(0, requestIds.length - 100))) delete room.requests[id];
      if (await store.compareAndSet(roomCode, before, JSON.stringify(room), room.expiresAt)) return { room: view(room), ...(identity ? { identity } : {}) };
    }
    throw new Error('Phòng đang cập nhật. Hãy thử lại.');
  };
}
