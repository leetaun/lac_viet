import { JournalView } from './components/JournalView';
import { QRCardGateway, PhysicalCardPrompt } from './components/QRCardGateway';
import { HostQRPanel, RemoteQRPhone, useHostQR } from './components/RemoteQR';
import { readPhysicalCard } from './utils/physicalQR';
import { BOARD_SPACES } from './data/boardData';
import { useGameController, SetupConfig } from './engine/useGameController';
import { RuleChoiceModal } from './components/Modals/RuleChoiceModal';
import React, { useState, useEffect } from 'react';
import type { Player } from './types/game';
import { STARTER_BIKIP_CARDS } from './data/cardDecks';
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
    artifactItems: [],
    artifacts: 0,
    safeArtifacts: 0,
    biKipCards: [STARTER_BIKIP_CARDS[0]],
    milestones: [],
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
    artifactItems: [],
    artifacts: 0,
    safeArtifacts: 0,
    biKipCards: [STARTER_BIKIP_CARDS[1]],
    milestones: [],
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
    artifactItems: [],
    artifacts: 0,
    safeArtifacts: 0,
    biKipCards: [STARTER_BIKIP_CARDS[2]],
    milestones: [],
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
    artifactItems: [],
    artifacts: 0,
    safeArtifacts: 0,
    biKipCards: [STARTER_BIKIP_CARDS[3]],
    milestones: [],
    score: 0,
    tokenSkillAvailable: true,
    hasShield: false,
    immuneToPenalty: false,
    cards: { knowledge: [], resource: [], fortune: [] },
    lapsCompleted: 0
  }
];

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('board');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const controller = useGameController(DEFAULT_PLAYERS);
  const [showSetup, setShowSetup] = useState(controller.gameState.gameStatus==='setup');
  const [qrKind,setQrKind]=useState(()=>readPhysicalCard(location.hash));
  const [localQR,setLocalQR]=useState(false);
  const hostQR=useHostQR(controller,!qrKind);
  const { gameState, activePlayer, activeCardModal, activeCornerStation, activeStealTarget, showTokenSkillModal, isRolling, handleRollDice, handleResolveCard, handleSelectCornerOption, handleCloseCorner, handleExecuteSteal, handleConsumeBiKip, handleLotusSwap, handleBanhMiShift, handleEndTurn } = controller;
  const handleStartGame = (config: SetupConfig) => { controller.handleStartGame(config); setShowSetup(false); setActiveTab('board'); };
  useEffect(() => { soundManager.enabled = soundEnabled; }, [soundEnabled]);
  useEffect(()=>{const listener=()=>setQrKind(readPhysicalCard(location.hash));window.addEventListener('hashchange',listener);return()=>window.removeEventListener('hashchange',listener);},[]);
  const leaveQR=()=>{history.replaceState(null,'',location.pathname+location.search);setQrKind(null);};

  if (location.hash.startsWith('#journal=')) return <JournalView />;
  if(qrKind&&!localQR)return <RemoteQRPhone key={qrKind} kind={qrKind} onPractice={()=>setLocalQR(true)}/>;
  if(qrKind)return <QRCardGateway key={qrKind} kind={qrKind} gameState={gameState} onBack={()=>{setLocalQR(false);leaveQR();}} onOpen={async(province,difficulty)=>{await controller.openPhysicalCard(qrKind,province,difficulty);setLocalQR(false);leaveQR();}}/>;

  return (
    <div className="min-h-screen bg-[#F8F5EE] flex flex-col font-sans text-gray-900 select-none">
      
      {/* 1. Header (Slide 6-10 Theme) */}
      <Header
        gameState={gameState}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
        onResetGame={() => { controller.resetSetup(); setShowSetup(true); }}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* 2. Main Content Body according to Active Tab with smooth entrance animation */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4">
        <div key={activeTab} className="animate-tab-enter">
          {activeTab === 'board' && (
            <GameBoard
              gameState={gameState}
              isRolling={isRolling}
              onRollDice={handleRollDice}
              onUseTokenSkill={controller.openTokenSkill}
              onEndTurn={handleEndTurn}
              language={language}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab
              player={activePlayer}
              allPlayers={gameState.players}
              artifactGoal={gameState.artifactGoal}
              gameModeRule={gameState.gameModeRule}
              onUseCard={controller.handleUseCard}
              language={language}
            />
          )}

          {activeTab === 'map' && (
            <CulturalMapTab language={language} />
          )}

          {activeTab === 'rules' && (
            <RulebookTab language={language} />
          )}
        </div>
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

      {gameState.pendingPhysicalCard && !showSetup && <PhysicalCardPrompt key={`${gameState.pendingPhysicalCard.playerId}-${gameState.pendingPhysicalCard.spaceIndex}`} connection={<HostQRPanel host={hostQR}/>} kind={gameState.pendingPhysicalCard.kind} province={BOARD_SPACES[gameState.pendingPhysicalCard.spaceIndex].province!} onOpen={(province,difficulty)=>controller.openPhysicalCard(gameState.pendingPhysicalCard!.kind,province,difficulty)}/>}

      {activeCardModal && (
        <CardDrawModal
          key={activeCardModal.id}
          card={activeCardModal}
          remoteConnected={hostQR.active}
          remoteConnection={<HostQRPanel host={hostQR}/>}
          remoteAnswer={hostQR.remoteAnswer?.key===activeCardModal.id?hostQR.remoteAnswer:undefined}
          exploreMode={gameState.options.exploreMode}
          onConsumeBiKip={handleConsumeBiKip}
          player={activePlayer}
          onResolve={handleResolveCard}
          onAskFriend={controller.handleAskFriend}
          onFriendReward={controller.handleFriendReward}
          onGuessReward={controller.handleGuessReward}
          language={language}
        />
      )}

      {activeCornerStation && (
        <CornerStationModal
          station={activeCornerStation}
          player={activePlayer}
          penalizedArtifactsAtStart={gameState.lostAndFound.length}
          lostAndFoundList={gameState.lostAndFound}
          onSelectOption={handleSelectCornerOption}
          onGuideApproval={controller.handleGuideApproval}
          onClose={handleCloseCorner}
          language={language}
        />
      )}

      {activeStealTarget && (
        <StealModal
          attacker={activePlayer}
          target={activeStealTarget}
          allPlayers={gameState.players}
          onExecuteSteal={handleExecuteSteal}
          onCancel={() => handleExecuteSteal('skip')}
          language={language}
        />
      )}

      {showTokenSkillModal && (
        <TokenSkillModal
          player={activePlayer}
          onActivateLotusSwap={handleLotusSwap}
          onActivateBanhMiShift={handleBanhMiShift}
          onClose={controller.handleCloseToken}
          previewQuestion={controller.lanternPreview}
          onPreviewLantern={controller.handlePreviewLantern}
          initialPreview={controller.lanternInitialPreview}
          onActivateLanternRedraw={controller.handleLanternRedraw}
          language={language}
        />
      )}

      {controller.choice && <RuleChoiceModal key={controller.choice.id} choice={controller.choice} onConfirm={controller.confirmChoice} />}
      {controller.notice && <RuleChoiceModal choice={{ title: 'Thông báo', description: controller.notice, options: [{id:'ok',label:'Đã hiểu'}], min:1, max:1 }} onConfirm={() => controller.setNotice(null)} />}

      {gameState.winner && (
        <VictoryModal
          winner={gameState.winner}
          players={gameState.players}
          artifactGoal={gameState.artifactGoal}
          gameModeRule={gameState.gameModeRule}
          onNewGame={() => { controller.resetSetup(); setShowSetup(true); }}
          language={language}
        />
      )}

    </div>
  );
};

export default App;
