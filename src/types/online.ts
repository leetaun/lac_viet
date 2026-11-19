import type { ArtifactGoal, GameModeRule, GameState, TokenType } from './game';
import type { RuleChoice } from '../components/Modals/RuleChoiceModal';

export interface OnlineMember {
  id: string;
  name: string;
  token: TokenType;
  ready: boolean;
  lastSeen: number;
}
export interface OnlineRoomView {
  code: string;
  name: string;
  hostId: string;
  version: number;
  status: 'lobby' | 'playing' | 'closed';
  members: OnlineMember[];
  settings: { rule: GameModeRule; goal: ArtifactGoal };
  game: GameState | null;
  expiresAt: number;
  panel?: { choice: RuleChoice | null; notice: string | null; result?: any };
  pendingRequest?: string | null;
  completedRequest?: string;
  startQuestionIds?: string[];
  taskOpenedAt?: number;
  friendId?: string;
  taskSubmissions?: Record<string, { answer: number; at: number }>;
}
export interface OnlineIdentity { code: string; memberId: string; token: string; }
