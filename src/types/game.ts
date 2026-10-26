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
  timing: string;
}

export type CardType = 'knowledge' | 'challenge' | 'resource' | 'fortune';

export type BiKipTopic = 'history' | 'cuisine' | 'art' | 'custom' | 'general';

export interface BiKipCard {
  id: string;
  title: string;
  topic: BiKipTopic;
  topicName: string;
  sourceProvince?: string;
  questionSnippet?: string;
}

export interface ArtifactItem {
  id: string;
  name: string;
  province: string;
  region: 'bac_bo' | 'trung_bo' | 'nam_bo';
  isTreasure: boolean; // Bảo vật (chống cướp)
  isSealed: boolean;   // Bị phong ấn (không tính vào điều kiện thắng, giải phóng ở ô góc)
  storage: 'pouch' | 'safe'; // Tay nải (lưu động) vs Hòm ký gửi (an toàn tại ô góc)
}

export interface KnowledgeCard {
  bankQuestionId?: string;
  questionScope?: 'general';
  difficulty?: import('../data/questionBank').QuestionDifficulty;
  id: string;
  type: 'knowledge';
  province: string;
  region: 'bac_bo' | 'trung_bo' | 'nam_bo';
  title: string;
  heritageName: string;
  topic: BiKipTopic;
  question: string;
  options: string[];
  correctAnswer: number;
  description: string;
  culturalSignificance: string;
  didYouKnow?: string;
  citation?: string;
  qrContent: string;
  category: string;
  imageUrl?: string;
}

export interface ChallengeCard {
  bankQuestionId?: string;
  questionScope?: 'general';
  difficulty?: import('../data/questionBank').QuestionDifficulty;
  id: string;
  type: 'challenge';
  province: string;
  region: 'bac_bo' | 'trung_bo' | 'nam_bo';
  title: string;
  topic: BiKipTopic;
  challengeType: 'quiz' | 'action' | 'speed_naming';
  question: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  didYouKnow?: string;
  citation?: string;
  actionPrompt?: string;
  timeLimitSeconds?: number;
  rewardArtifact: string;
  isTreasureReward?: boolean; // Tỷ lệ ra bảo vật cao hơn
  relatedKnowledgeKeyword: string;
}

export interface ResourceCard {
  marketQuestion?: import('../data/questionBank').BankQuestion;
  id: string;
  province?: string;
  marketVisit?: boolean;
  type: 'resource';
  name: string;
  category: 'shield' | 'steed' | 'crossbow' | 'milestone'; // Lá chắn (30%), Ngựa trạm (30%), Nỏ thần (22%), Cột mốc (18%)
  description: string;
  effect: string;
  timing: string;
  ratePercent: number;
}

export interface FortuneCard {
  contestQuestion?: import('../data/questionBank').BankQuestion;
  id: string;
  province?: string;
  type: 'fortune';
  name: string;
  group: 'contest' | 'good_event' | 'bad_event' | 'general_event' | 'power';
  eventType: 
    | 'contest'          // Hội thi (24%)
    | 'harvest'          // Lễ hội mùa màng (12%)
    | 'fortune_gift'     // Lộc hội (8%)
    | 'tailwind'         // Thuận buồm xuôi gió (8%)
    | 'bandit'           // Đạo tặc (8%)
    | 'mutual_support'   // Lá lành đùm lá rách (4%)
    | 'storm'            // Bão lũ (12%)
    | 'crop_loss'        // Mất mùa (8%)
    | 'negate'           // Vô hiệu (8%)
    | 'seal';            // Phong ấn (8%)
  description: string;
  effectText: string;
  ratePercent: number;
  moveDelta?: number;
  extraTurn?: boolean;
}

export type GameCard = KnowledgeCard | ChallengeCard | ResourceCard | FortuneCard;

export interface CardResolution {
  marketAnswer?: number;
  success: boolean;
  rewardArtifact?: boolean;
  rewardArtifactItem?: ArtifactItem;
  penalizeArtifact?: boolean;
  droppedArtifactItem?: ArtifactItem;
  rewardBiKip?: BiKipCard;
  consumeBiKipId?: string;
  consumeBiKipIds?: string[];
  consumeCards?: (GameCard | BiKipCard)[];
  drawCard?: GameCard;
  extraRoll?: boolean;
  moveDelta?: number;
  consumeTokenSkill?: boolean;
  logMessage: string;
}

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
  hasMilestone?: boolean;
  milestoneOwnerSeat?: number;
}

export interface Milestone {
  playerId: string;
  playerSeat: number;
  playerColor: string;
  spaceIndex: number;
  provinceName: string;
}

export interface Player {
  journey?: { province: string; title: string; question: string; knowledge: string; source?: string }[];
  id: string;
  name: string;
  seat: number; // 1, 2, 3, 4
  isAI: boolean;
  token: TokenType;
  color: string;
  position: number; // 0 - 39
  artifactItems: ArtifactItem[]; // Toàn bộ kỷ vật số
  artifacts: number; // Kỷ vật hợp lệ trong Tay nải
  safeArtifacts: number; // Kỷ vật an toàn trong Hòm ký gửi
  biKipCards: BiKipCard[]; // Bí kíp tích lũy
  milestones: number[]; // Các ô cắm cờ Cột mốc (tối đa 2)
  score: number;
  tokenSkillAvailable: boolean;
  hasShield: boolean;
  immuneToPenalty: boolean;
  cards: {
    knowledge: KnowledgeCard[];
    resource: ResourceCard[];
    fortune: FortuneCard[];
  };
  lapsCompleted: number;
}

export type GameMode = 'offline' | 'ai' | 'online';

export type GameModeRule = 'toc_chien' | 'co_ban' | 'truong_ky';

export type ArtifactGoal = 3 | 5 | 7;

export interface GameState {
  sessionId?: string;
  revision?: number;
  seenBankQuestions?: string[];
  questionDifficulty?: import('../data/questionBank').QuestionDifficulty;
  pendingPhysicalCard?: {kind: import('../utils/physicalQR').PhysicalCardKind; spaceIndex: number; playerId: string} | null;
  remainingDestination?: number | null;
  pendingDiceMovement?: {roll: number; old: number; isExtra: boolean} | null;
  firstPlayerIndex?: number;
  endsAt?: number;
  mode: GameMode;
  gameModeRule: GameModeRule;
  roomCode?: string;
  players: Player[];
  activePlayerIndex: number;
  artifactGoal: ArtifactGoal;
  round: number;
  turnStep: 1 | 2 | 3 | 4 | 5; // 5 bước trong 1 lượt
  diceValue: number | null;
  hasRolled: boolean;
  gameStatus: 'setup' | 'playing' | 'game_over';
  winner: Player | null;
  lostAndFound: ArtifactItem[]; // Kho thất lạc tại START
  milestones: Milestone[]; // Cột mốc đã cắm
  options: {
    physicalQR?: boolean;
    starterBiKip: boolean; // 3 Bí kíp khởi đầu
    exploreMode: boolean;  // Chế độ Khám phá
    timedMode: boolean;    // Giờ thu quân
  };
  currentActionModal: {
    type: 'card_drawn' | 'corner_choice' | 'steal_interaction' | 'token_skill' | 'quiz_start' | 'market_trade' | 'milestone_relocate' | null;
    spaceIndex?: number;
    card?: GameCard;
    targetPlayer?: Player;
    previewAccepted?: boolean;
  } | null;
  historyLog: string[];
}
