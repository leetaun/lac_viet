import React, { useState, useEffect, useRef } from 'react';
import { GameState, Player, GameMode, ArtifactGoal, GameCard, TokenType, BoardSpace, KnowledgeCard, ResourceCard, FortuneCard } from './types/game';
import { BOARD_SPACES } from './data/boardData';
import { KNOWLEDGE_CARDS, CHALLENGE_CARDS, RESOURCE_CARDS, FORTUNE_CARDS } from './data/cardDecks';
import { TOKENS } from './data/tokens';
import { soundManager } from './utils/sound';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { GameBoard } from './components/GameBoard/GameBoard';
import { InventoryTab } from './components/Inventory/InventoryTab';
import { CulturalMapTab } from './components/CulturalMap/CulturalMapTab';
import { RulebookTab } from './components/Rulebook/RulebookTab';
import { GameSetupModal } from './components/GameSetup/GameSetupModal';
import { CardDrawModal } from './components/Modals/CardDrawModal';
import { CornerStationModal } from './components/Modals/CornerStationModal';
import { StealModal } from './components/Modals/StealModal';
import { TokenSkillModal } from './components/Modals/TokenSkillModal';
import { VictoryModal } from './components/Modals/VictoryModal';

const DEFAULT_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Người chơi 1',
    seat: 1,
    isAI: false,
    token: 'non_la',
    color: '#0284C7',
    position: 0,
    artifacts: 0,
    safeArtifacts: 0,
    score: 0,
    tokenSkillAvailable: true,
    hasShield: false,
    immuneToPenalty: false,
    cards: { knowledge: [], resource: [], fortune: [] },
    lapsCompleted: 0
  },
  {
    id: 'p2',
    name: 'Người chơi 2',
    seat: 2,
    isAI: false,
    token: 'hoa_sen',
    color: '#EC4899',
    position: 0,
    artifacts: 0,
    safeArtifacts: 0,
    score: 0,
    tokenSkillAvailable: true,
    hasShield: false,
    immuneToPenalty: false,
    cards: { knowledge: [], resource: [], fortune: [] },
    lapsCompleted: 0
  },
  {
    id: 'p3',
    name: 'Người chơi 3',
    seat: 3,
    isAI: false,
    token: 'den_long',
    color: '#F59E0B',
    position: 0,
    artifacts: 0,
    safeArtifacts: 0,
    score: 0,
    tokenSkillAvailable: true,
    hasShield: false,
    immuneToPenalty: false,
    cards: { knowledge: [], resource: [], fortune: [] },
    lapsCompleted: 0
  },
  {
    id: 'p4',
    name: 'Người chơi 4',
    seat: 4,
    isAI: false,
    token: 'banh_mi',
    color: '#EA580C',
    position: 0,
    artifacts: 0,
    safeArtifacts: 0,
    score: 0,
    tokenSkillAvailable: true,
    hasShield: false,
    immuneToPenalty: false,
    cards: { knowledge: [], resource: [], fortune: [] },
    lapsCompleted: 0
  }
];

export const App: React.FC = () => {
  // Navigation & Language
  const [activeTab, setActiveTab] = useState<ActiveTab>('board');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showSetup, setShowSetup] = useState<boolean>(true);
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // Active Modals
  const [activeCardModal, setActiveCardModal] = useState<GameCard | null>(null);
  const [activeCornerStation, setActiveCornerStation] = useState<BoardSpace | null>(null);
  const [activeStealTarget, setActiveStealTarget] = useState<Player | null>(null);
  const [showTokenSkillModal, setShowTokenSkillModal] = useState<boolean>(false);

  // Initial Game State
  const [gameState, setGameState] = useState<GameState>({
    mode: 'offline',
    players: DEFAULT_PLAYERS,
    activePlayerIndex: 0,
    artifactGoal: 3,
    round: 1,
    diceValue: null,
    hasRolled: false,
    gameStatus: 'setup',
    winner: null,
    penalizedArtifactsAtStart: 0,
    currentActionModal: null,
    historyLog: ['Chào mừng đến với Boardgame Lạc Việt!']
  });

  const activePlayer = gameState.players[gameState.activePlayerIndex] || gameState.players[0];

  // AI Turn Autoplay Effect
  useEffect(() => {
    if (gameState.gameStatus === 'playing' && activePlayer?.isAI && !gameState.winner) {
      const timer = setTimeout(() => {
        if (!gameState.hasRolled && !isRolling) {
          handleRollDice();
        } else if (gameState.hasRolled && !activeCardModal && !activeCornerStation && !activeStealTarget) {
          handleEndTurn();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.activePlayerIndex, gameState.hasRolled, gameState.gameStatus, activeCardModal, activeCornerStation, activeStealTarget]);

  // Start Match from Setup Modal
  const handleStartGame = (config: {
    mode: GameMode;
    playerCount: number;
    artifactGoal: ArtifactGoal;
    players: Player[];
    roomCode?: string;
  }) => {
    setGameState({
      mode: config.mode,
      players: config.players,
      activePlayerIndex: 0,
      artifactGoal: config.artifactGoal,
      round: 1,
      diceValue: null,
      hasRolled: false,
      gameStatus: 'playing',
      winner: null,
      penalizedArtifactsAtStart: 0,
      currentActionModal: null,
      roomCode: config.roomCode,
      historyLog: [
        `Trận đấu bắt đầu! Chế độ: ${config.mode.toUpperCase()}, Mục tiêu: ${config.artifactGoal} Kỷ vật văn hóa.`
      ]
    });
    setShowSetup(false);
    setActiveTab('board');
  };

  // Roll Dice Action
  const handleRollDice = () => {
    if (gameState.hasRolled || isRolling || !activePlayer) return;

    setIsRolling(true);
    soundManager.playDiceRoll();

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      const oldPos = activePlayer.position;
      const rawNewPos = oldPos + roll;
      const passedStart = rawNewPos >= 40;
      const newPos = rawNewPos % 40;

      setIsRolling(false);

      // Check Victory Condition: Returned to START with enough artifacts!
      const totalArtifacts = activePlayer.artifacts + activePlayer.safeArtifacts;
      if (passedStart && totalArtifacts >= gameState.artifactGoal) {
        // Player wins!
        soundManager.playVictory();
        setGameState(prev => ({
          ...prev,
          diceValue: roll,
          hasRolled: true,
          winner: activePlayer,
          gameStatus: 'game_over',
          historyLog: [
            ...prev.historyLog,
            `🎉 ${activePlayer.name} đã vận chuyển an toàn ${totalArtifacts} Kỷ vật về đích START và CHIẾN THẮNG!`
          ]
        }));
        return;
      }

      // Update Player position
      setGameState(prev => {
        const updatedPlayers = prev.players.map((p, idx) => {
          if (idx === prev.activePlayerIndex) {
            return {
              ...p,
              position: newPos,
              // Passing start resets token cooldown
              tokenSkillAvailable: passedStart ? true : p.tokenSkillAvailable,
              lapsCompleted: passedStart ? p.lapsCompleted + 1 : p.lapsCompleted
            };
          }
          return p;
        });

        const targetSpace = BOARD_SPACES[newPos];
        const logEntry = `${activePlayer.name} gieo được ${roll} bước -> tiến tới ô #${newPos} [${targetSpace.name}].`;

        return {
          ...prev,
          players: updatedPlayers,
          diceValue: roll,
          hasRolled: true,
          historyLog: [...prev.historyLog, logEntry]
        };
      });

      // Handle Landing Event
      const destSpace = BOARD_SPACES[newPos];

      // 1. Check Player Collision (Stealing opportunity!)
      const opponentsHere = gameState.players.filter(
        (p, idx) => idx !== gameState.activePlayerIndex && p.position === newPos
      );

      if (opponentsHere.length > 0 && newPos !== 0) {
        // Collision!
        if (activePlayer.isAI) {
          // AI auto resolves steal
          const opp = opponentsHere[0];
          handleExecuteSteal('card', undefined, opp);
        } else {
          setActiveStealTarget(opponentsHere[0]);
        }
        return;
      }

      // 2. Space specific events
      if (destSpace.type === 'corner' || destSpace.type === 'start') {
        setActiveCornerStation(destSpace);
      } else if (destSpace.type === 'knowledge') {
        const sample = KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)];
        setActiveCardModal(sample);
      } else if (destSpace.type === 'festival') {
        const sample = FORTUNE_CARDS[Math.floor(Math.random() * FORTUNE_CARDS.length)];
        setActiveCardModal(sample);
      } else if (destSpace.type === 'market') {
        const sample = RESOURCE_CARDS[Math.floor(Math.random() * RESOURCE_CARDS.length)];
        setActiveCardModal(sample);
      } else if (destSpace.type === 'challenge') {
        const sample = CHALLENGE_CARDS[Math.floor(Math.random() * CHALLENGE_CARDS.length)];
        setActiveCardModal(sample);
      }

    }, 700);
  };

  // Resolve Card Draw Modal (Reward artifact, Penalize, or Add to hand)
  const handleResolveCard = (result: {
    success: boolean;
    rewardArtifact?: boolean;
    penalizeArtifact?: boolean;
    drawCard?: GameCard;
    extraRoll?: boolean;
    moveDelta?: number;
    logMessage: string;
  }) => {
    setActiveCardModal(null);

    setGameState(prev => {
      let penalizedCount = prev.penalizedArtifactsAtStart;
      const updatedPlayers = prev.players.map((p, idx) => {
        if (idx === prev.activePlayerIndex) {
          let newArtifacts = p.artifacts;
          let newScore = p.score;
          const newCards = { ...p.cards };

          if (result.rewardArtifact) {
            newArtifacts += 1;
            newScore += 100;
          }

          if (result.penalizeArtifact) {
            if (newArtifacts > 0) {
              newArtifacts -= 1;
              penalizedCount += 1; // Sent to START
            }
          }

          if (result.drawCard) {
            if (result.drawCard.type === 'knowledge') {
              newCards.knowledge = [...newCards.knowledge, result.drawCard as KnowledgeCard];
              newScore += 50;
            } else if (result.drawCard.type === 'resource') {
              newCards.resource = [...newCards.resource, result.drawCard as ResourceCard];
            } else if (result.drawCard.type === 'fortune') {
              newCards.fortune = [...newCards.fortune, result.drawCard as FortuneCard];
            }
          }

          let newPos = p.position;
          if (result.moveDelta) {
            newPos = (newPos + result.moveDelta + 40) % 40;
          }

          return {
            ...p,
            artifacts: newArtifacts,
            score: newScore,
            cards: newCards,
            position: newPos
          };
        }
        return p;
      });

      return {
        ...prev,
        players: updatedPlayers,
        penalizedArtifactsAtStart: penalizedCount,
        hasRolled: result.extraRoll ? false : prev.hasRolled, // If extra roll from Harvest Festival, allow rolling again!
        historyLog: [...prev.historyLog, result.logMessage]
      };
    });
  };

  // Resolve Corner Station Option
  const handleSelectCornerOption = (option: 'fortune' | 'resource' | 'restore_skill' | 'safe_deposit' | 'reclaim_start') => {
    setActiveCornerStation(null);

    if (option === 'fortune') {
      const sample = FORTUNE_CARDS[Math.floor(Math.random() * FORTUNE_CARDS.length)];
      setActiveCardModal(sample);
    } else if (option === 'resource') {
      const sample = RESOURCE_CARDS[Math.floor(Math.random() * RESOURCE_CARDS.length)];
      setActiveCardModal(sample);
    } else if (option === 'restore_skill') {
      soundManager.playTokenSkill();
      setGameState(prev => {
        const updatedPlayers = prev.players.map((p, idx) => {
          if (idx === prev.activePlayerIndex) {
            return { ...p, tokenSkillAvailable: true };
          }
          return p;
        });
        return {
          ...prev,
          players: updatedPlayers,
          historyLog: [...prev.historyLog, `${activePlayer.name} đã hồi phục Kỹ Năng Token tại Trạm dừng chân!`]
        };
      });
    } else if (option === 'safe_deposit') {
      soundManager.playSuccess();
      setGameState(prev => {
        const updatedPlayers = prev.players.map((p, idx) => {
          if (idx === prev.activePlayerIndex) {
            const deposited = p.artifacts;
            return {
              ...p,
              artifacts: 0,
              safeArtifacts: p.safeArtifacts + deposited
            };
          }
          return p;
        });
        return {
          ...prev,
          players: updatedPlayers,
          historyLog: [...prev.historyLog, `${activePlayer.name} đã gửi an toàn toàn bộ Kỷ vật tại Trạm dừng chân!`]
        };
      });
    } else if (option === 'reclaim_start') {
      soundManager.playSuccess();
      setGameState(prev => {
        if (prev.penalizedArtifactsAtStart <= 0) return prev;
        const updatedPlayers = prev.players.map((p, idx) => {
          if (idx === prev.activePlayerIndex) {
            return { ...p, artifacts: p.artifacts + 1, score: p.score + 100 };
          }
          return p;
        });
        return {
          ...prev,
          penalizedArtifactsAtStart: prev.penalizedArtifactsAtStart - 1,
          players: updatedPlayers,
          historyLog: [...prev.historyLog, `${activePlayer.name} đã chuộc thành công 1 Kỷ vật phạt tại START!`]
        };
      });
    }
  };

  // Execute Steal PvP Interaction
  const handleExecuteSteal = (type: 'artifact' | 'card', resourceCardUsed?: ResourceCard, targetOverride?: Player) => {
    const target = targetOverride || activeStealTarget;
    if (!target) return;
    setActiveStealTarget(null);

    setGameState(prev => {
      let log = '';
      const updatedPlayers = prev.players.map(p => {
        if (p.id === target.id) {
          if (p.hasShield) {
            log = `${target.name} đã kích hoạt Lá Chắn bảo vệ, chặn đứng đòn cướp của ${activePlayer.name}!`;
            return { ...p, hasShield: false }; // Shield consumed
          }

          if (type === 'artifact' && p.artifacts > 0) {
            log = `${activePlayer.name} đã dùng Thẻ Tài Nguyên cướp 1 Kỷ vật văn hóa từ ${target.name}!`;
            return { ...p, artifacts: p.artifacts - 1 };
          }

          if (type === 'card') {
            log = `${activePlayer.name} đã cướp 1 thẻ bài trên tay của ${target.name}!`;
            // Remove random card
            const newCards = { ...p.cards };
            if (newCards.resource.length > 0) newCards.resource = newCards.resource.slice(0, -1);
            else if (newCards.fortune.length > 0) newCards.fortune = newCards.fortune.slice(0, -1);
            else if (newCards.knowledge.length > 0) newCards.knowledge = newCards.knowledge.slice(0, -1);
            return { ...p, cards: newCards };
          }
        }

        if (p.id === activePlayer.id) {
          const newCards = { ...p.cards };
          if (resourceCardUsed) {
            newCards.resource = newCards.resource.filter(r => r.id !== resourceCardUsed.id);
          }
          return {
            ...p,
            artifacts: type === 'artifact' && !target.hasShield ? p.artifacts + 1 : p.artifacts,
            cards: newCards
          };
        }

        return p;
      });

      return {
        ...prev,
        players: updatedPlayers,
        historyLog: [...prev.historyLog, log || `${activePlayer.name} không thực hiện cướp.`]
      };
    });
  };

  // Lotus Card Swap Skill
  const handleLotusSwap = (discardIds: string[], targetDeck: 'knowledge' | 'resource' | 'fortune') => {
    setShowTokenSkillModal(false);
    let newDrawnCard: GameCard = FORTUNE_CARDS[0];
    if (targetDeck === 'knowledge') newDrawnCard = KNOWLEDGE_CARDS[0];
    else if (targetDeck === 'resource') newDrawnCard = RESOURCE_CARDS[0];

    setGameState(prev => {
      const updatedPlayers = prev.players.map((p, idx) => {
        if (idx === prev.activePlayerIndex) {
          const newCards = {
            knowledge: p.cards.knowledge.filter(c => !discardIds.includes(c.id)),
            resource: p.cards.resource.filter(c => !discardIds.includes(c.id)),
            fortune: p.cards.fortune.filter(c => !discardIds.includes(c.id)),
          };
          if (targetDeck === 'knowledge') newCards.knowledge.push(newDrawnCard as KnowledgeCard);
          else if (targetDeck === 'resource') newCards.resource.push(newDrawnCard as ResourceCard);
          else if (targetDeck === 'fortune') newCards.fortune.push(newDrawnCard as FortuneCard);

          return {
            ...p,
            cards: newCards,
            tokenSkillAvailable: false
          };
        }
        return p;
      });

      return {
        ...prev,
        players: updatedPlayers,
        historyLog: [...prev.historyLog, `${activePlayer.name} đã dùng nội tại HOA SEN hoán đổi 2 lá bài lấy 1 lá [${'title' in newDrawnCard ? newDrawnCard.title : newDrawnCard.name}]!`]
      };
    });
  };

  // Banh Mi Position Shift Skill (+1 or -1 space)
  const handleBanhMiShift = (delta: -1 | 1) => {
    setShowTokenSkillModal(false);
    setGameState(prev => {
      const updatedPlayers = prev.players.map((p, idx) => {
        if (idx === prev.activePlayerIndex) {
          const shiftedPos = (p.position + delta + 40) % 40;
          return {
            ...p,
            position: shiftedPos,
            tokenSkillAvailable: false
          };
        }
        return p;
      });

      const newPos = (activePlayer.position + delta + 40) % 40;
      const targetSpace = BOARD_SPACES[newPos];

      return {
        ...prev,
        players: updatedPlayers,
        historyLog: [...prev.historyLog, `${activePlayer.name} dùng BÁNH MÌ điều chỉnh ${delta > 0 ? '+1' : '-1'} ô né bẫy, tới ô #${newPos} [${targetSpace.name}]!`]
      };
    });
  };

  // End Turn Action
  const handleEndTurn = () => {
    if (!gameState.hasRolled && !activePlayer?.isAI) return;

    setGameState(prev => {
      const nextIdx = (prev.activePlayerIndex + 1) % prev.players.length;
      const nextPlayer = prev.players[nextIdx];
      const nextRound = nextIdx === 0 ? prev.round + 1 : prev.round;

      return {
        ...prev,
        activePlayerIndex: nextIdx,
        round: nextRound,
        diceValue: null,
        hasRolled: false,
        historyLog: [
          ...prev.historyLog,
          `Đã chuyển lượt sang ${nextPlayer.name} (P${nextPlayer.seat}).`
        ]
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col font-sans text-gray-900 select-none">
      
      {/* 1. Header (Slide 6-10 Theme) */}
      <Header
        gameState={gameState}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
        onResetGame={() => setShowSetup(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* 2. Main Content Body according to Active Tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4">
        {activeTab === 'board' && (
          <GameBoard
            gameState={gameState}
            isRolling={isRolling}
            onRollDice={handleRollDice}
            onUseTokenSkill={() => setShowTokenSkillModal(true)}
            onEndTurn={handleEndTurn}
            language={language}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryTab
            player={activePlayer}
            allPlayers={gameState.players}
            artifactGoal={gameState.artifactGoal}
            onUseCard={(card) => {
              alert(`Kích hoạt thẻ ${'title' in card ? card.title : card.name}`);
            }}
            language={language}
          />
        )}

        {activeTab === 'map' && (
          <CulturalMapTab language={language} />
        )}

        {activeTab === 'rules' && (
          <RulebookTab language={language} />
        )}
      </main>

      {/* 3. Bottom Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activePlayer={activePlayer}
        language={language}
      />

      {/* 4. Modals */}
      {showSetup && (
        <GameSetupModal
          onStartGame={handleStartGame}
          language={language}
        />
      )}

      {activeCardModal && (
        <CardDrawModal
          card={activeCardModal}
          player={activePlayer}
          onResolve={handleResolveCard}
          language={language}
        />
      )}

      {activeCornerStation && (
        <CornerStationModal
          station={activeCornerStation}
          player={activePlayer}
          penalizedArtifactsAtStart={gameState.penalizedArtifactsAtStart}
          onSelectOption={handleSelectCornerOption}
          onClose={() => setActiveCornerStation(null)}
          language={language}
        />
      )}

      {activeStealTarget && (
        <StealModal
          attacker={activePlayer}
          target={activeStealTarget}
          onExecuteSteal={handleExecuteSteal}
          onCancel={() => setActiveStealTarget(null)}
          language={language}
        />
      )}

      {showTokenSkillModal && (
        <TokenSkillModal
          player={activePlayer}
          onActivateLotusSwap={handleLotusSwap}
          onActivateBanhMiShift={handleBanhMiShift}
          onClose={() => setShowTokenSkillModal(false)}
          language={language}
        />
      )}

      {gameState.winner && (
        <VictoryModal
          winner={gameState.winner}
          players={gameState.players}
          artifactGoal={gameState.artifactGoal}
          onNewGame={() => setShowSetup(true)}
          language={language}
        />
      )}

    </div>
  );
};

export default App;

