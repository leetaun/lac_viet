export type Region = 'bac_bo' | 'trung_bo' | 'nam_bo' | 'special';

export type SpaceType = 
  | 'start' 
  | 'corner' 
  | 'knowledge'    // 12 ô Kiến thức
  | 'festival'     // 8 ô Lễ hội (Rút May mắn)
  | 'market'       // 8 ô Thị trường (Rút Tài nguyên)
  | 'challenge';   // 8 ô Thử thách địa phương (Rút Thử thách)

export type TokenType = 'non_la' | 'hoa_sen' | 'den_long' | 'banh_mi';

export interface TokenDef {
  id: TokenType;
  name: string;
  enName: string;
  icon: string;
  passive: string;
  enPassive: string;
  color: string;
  description: string;
}

export type CardType = 'knowledge' | 'challenge' | 'resource' | 'fortune';

export interface KnowledgeCard {
  id: string;
  type: 'knowledge';
  province: string;
  title: string;
  heritageName: string;
  description: string;
  culturalSignificance: string;
  qrContent: string;
  category: string;
  imageUrl?: string;
}

export interface ChallengeCard {
  id: string;
  type: 'challenge';
  province: string;
  title: string;
  challengeType: 'quiz' | 'action';
  question: string;
  options?: string[];
  correctAnswer?: number; // 0-indexed
  explanation?: string;
  actionPrompt?: string;
  timeLimitSeconds?: number;
  rewardArtifact: string;
  relatedKnowledgeKeyword: string; // If player holds this knowledge card, they can skip!
}

export interface ResourceCard {
  id: string;
  type: 'resource';
  name: string;
  category: 'shield' | 'land' | 'supplies' | 'steal';
  description: string;
  effect: string;
}

export interface FortuneCard {
  id: string;
  type: 'fortune';
  name: string;
  eventType: 'storm' | 'harvest' | 'bandit' | 'tailwind' | 'blessing' | 'negate';
  description: string;
  effectText: string;
  moveDelta?: number;
  extraTurn?: boolean;
}

export type GameCard = KnowledgeCard | ChallengeCard | ResourceCard | FortuneCard;

export interface BoardSpace {
  index: number; // 0 - 39
  name: string;
  enName: string;
  type: SpaceType;
  region: Region;
  province?: string;
  subtitle?: string;
  description?: string;
  heritageHighlight?: string;
  iconName?: string;
}

export interface Player {
  id: string;
  name: string;
  seat: number; // 1, 2, 3, 4
  isAI: boolean;
  token: TokenType;
  color: string;
  position: number; // 0 - 39
  artifacts: number; // Kỷ vật đang mang theo
  safeArtifacts: number; // Kỷ vật đã gửi an toàn tại 3 ô góc
  score: number; // Điểm thành tích
  tokenSkillAvailable: boolean; // 1 lần / vòng, reset khi qua START hoặc dừng tại 3 ô góc
  hasShield: boolean; // Bảo vệ khỏi 1 lần cướp
  immuneToPenalty: boolean; // Nón lá passive
  cards: {
    knowledge: KnowledgeCard[];
    resource: ResourceCard[];
    fortune: FortuneCard[];
  };
  lapsCompleted: number;
}

export type GameMode = 'offline' | 'ai' | 'online';

export type ArtifactGoal = 3 | 5 | 7; // Tốc chiến (3), Cơ bản (5), Trường kỳ (7)

export interface GameState {
  mode: GameMode;
  roomCode?: string;
  players: Player[];
  activePlayerIndex: number;
  artifactGoal: ArtifactGoal;
  round: number;
  diceValue: number | null;
  hasRolled: boolean;
  gameStatus: 'setup' | 'playing' | 'game_over';
  winner: Player | null;
  penalizedArtifactsAtStart: number; // Kỷ vật bị phạt đặt tại START
  currentActionModal: {
    type: 'card_drawn' | 'corner_choice' | 'steal_interaction' | 'token_skill' | 'quiz_start' | null;
    spaceIndex?: number;
    card?: GameCard;
    targetPlayer?: Player;
  } | null;
  historyLog: string[];
}

