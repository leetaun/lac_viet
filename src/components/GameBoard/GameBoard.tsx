import React, { useLayoutEffect, useRef, useState } from 'react';
import { GameState, BoardSpace } from '../../types/game';
import { BOARD_SPACES } from '../../data/boardData';
import { getBoardSpaceData } from '../../data/culturalTranslations';
import { BoardSpaceTile } from './BoardSpaceTile';
import { DiceRoller } from './DiceRoller';
import { PlayerBar } from './PlayerBar';
import { TurnControls } from './TurnControls';
import { Compass, Info, X, MapPin } from 'lucide-react';

interface GameBoardProps {
  gameState: GameState;
  isRolling: boolean;
  onRollDice: () => void;
  onUseTokenSkill: () => void;
  onEndTurn: () => void;
  language: 'vi' | 'en';
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  isRolling,
  onRollDice,
  onUseTokenSkill,
  onEndTurn,
  language
}) => {
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState<number | null>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layout = layoutRef.current;
    if (!layout) return;
    const header = document.querySelector('header');
    const navigation = document.querySelector('nav');
    const main = layout.closest('main');
    const updateHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const navigationHeight = navigation?.getBoundingClientRect().height ?? 0;
      const mainStyle = main ? window.getComputedStyle(main) : null;
      const verticalPadding = mainStyle
        ? parseFloat(mainStyle.paddingTop) + parseFloat(mainStyle.paddingBottom)
        : 32;
      layout.style.setProperty('--board-layout-height', `${Math.max(0, viewportHeight - headerHeight - navigationHeight - verticalPadding - 8)}px`);
    };
    const observer = new ResizeObserver(updateHeight);
    if (header) observer.observe(header);
    if (navigation) observer.observe(navigation);
    if (main) observer.observe(main);
    window.addEventListener('resize', updateHeight);
    window.visualViewport?.addEventListener('resize', updateHeight);
    updateHeight();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
      window.visualViewport?.removeEventListener('resize', updateHeight);
    };
  }, []);

  const activePlayer = gameState.players[gameState.activePlayerIndex] || gameState.players[0];

  // Helper to get players currently located on a space
  const getPlayersOnSpace = (spaceIdx: number) => {
    return gameState.players.filter(p => p.position === spaceIdx);
  };

  // 4 edges of the board
  // Bottom row (Right to Left): 0 (START) -> 9, then 10 (BAC BO)
  // Left column (Bottom to Top): 11 -> 19, then 20 (TRUNG BO)
  // Top row (Left to Right): 21 -> 29, then 30 (NAM BO)
  // Right column (Top to Bottom): 31 -> 39, returning to 0

  const bottomSpaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const leftSpaces = [11, 12, 13, 14, 15, 16, 17, 18, 19];
  const topSpaces = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  const rightSpaces = [31, 32, 33, 34, 35, 36, 37, 38, 39];

  const boardSpaces = BOARD_SPACES.map(space => {
    const flag = gameState.milestones.find(m => m.spaceIndex === space.index);
    return flag ? { ...space, hasMilestone: true, milestoneOwnerSeat: flag.playerSeat } : space;
  });
  const selectedSpace = selectedSpaceIndex !== null ? boardSpaces[selectedSpaceIndex] : null;

  return (
    <div ref={layoutRef} className="game-board-layout flex flex-col gap-4 pb-20 max-w-7xl mx-auto px-2 sm:px-4">
      {/* 4 Players status bar */}
      <PlayerBar
        players={gameState.players}
        activePlayerIndex={gameState.activePlayerIndex}
        artifactGoal={gameState.artifactGoal}
        gameModeRule={gameState.gameModeRule}
        language={language}
      />

      {/* Main Board Container */}
      <div className="game-board-frame bg-[#F4EFE6] rounded-3xl p-2 sm:p-4 shadow-board border-2 border-[#C5A059]/40 relative overflow-x-auto">
        {/* Responsive board wrapper */}
        <div className="game-board-grid min-w-[760px] md:min-w-[850px] flex flex-col gap-2">
          
          {/* Top Row: Corner 20 (Trung Bo), Spaces 21-29, Corner 30 (Nam Bo) */}
          <div className="board-edge-row grid grid-cols-11 gap-1 sm:gap-1.5">
            {topSpaces.map(idx => (
              <BoardSpaceTile
                key={idx}
                space={boardSpaces[idx]}
                playersOnSpace={getPlayersOnSpace(idx)}
                activePlayerIndex={gameState.activePlayerIndex}
                isSelected={selectedSpaceIndex === idx}
                onClick={() => setSelectedSpaceIndex(idx)}
                language={language}
              />
            ))}
          </div>

          {/* Middle Section: Left Col, Center Arena, Right Col */}
          <div className="board-middle grid grid-cols-11 gap-1 sm:gap-1.5 items-stretch">
            {/* Left Column (Spaces 19 down to 11) */}
            <div className="board-side col-span-1 flex flex-col justify-between gap-1 sm:gap-1.5">
              {[...leftSpaces].reverse().map(idx => (
                <BoardSpaceTile
                  key={idx}
                  orientation="vertical"
                  space={boardSpaces[idx]}
                  playersOnSpace={getPlayersOnSpace(idx)}
                  activePlayerIndex={gameState.activePlayerIndex}
                  isSelected={selectedSpaceIndex === idx}
                  onClick={() => setSelectedSpaceIndex(idx)}
                  language={language}
                />
              ))}
            </div>

            {/* Center Arena: 9 columns wide */}
            <div className="board-arena col-span-9 bg-gradient-to-br from-[#FAF6EE] via-[#FFFDF9] to-[#F5E5BE]/30 rounded-2xl p-4 sm:p-6 border border-[#C5A059]/30 flex flex-col justify-between relative shadow-inner overflow-hidden min-h-[360px]">
              {/* Decorative Vietnam mainland silhouette from geographic coordinates:
                  https://github.com/johan/world.geo.json/blob/master/countries/VNM.geo.json */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.09] flex items-center justify-center">
                <svg aria-hidden="true" focusable="false" viewBox="0 0 400 800" className="h-full max-h-[380px] text-[#543310] fill-current">
                  <path d="M302.4,107.4 L238.3,150.2 L198.3,197.4 L187.8,232.1 L224.5,284.8 L269.4,350.1 L312.9,381.0 L342.1,421.2 L364.1,513.7 L357.6,601.7 L317.6,634.6 L262.6,666.8 L223.4,708.5 L163.6,755.0 L146.2,722.9 L159.7,689.1 L124.0,660.7 L165.6,640.5 L216.0,636.9 L194.9,606.6 L275.6,568.1 L281.5,508.2 L270.4,474.9 L279.1,424.9 L267.0,389.6 L230.7,354.8 L200.4,310.7 L160.5,251.7 L103.0,221.7 L116.8,203.8 L147.5,190.7 L128.9,147.1 L69.8,146.7 L48.2,101.2 L20.2,61.8 L45.9,49.6 L84.2,49.8 L130.9,44.0 L171.8,17.4 L194.9,36.2 L238.8,45.3 L231.2,74.1 L254.1,94.4 Z" />
                </svg>
              </div>

              {/* Center Top: Cultural Title & Region Indicators */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#543310]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#543310]">
                    {language === 'vi' ? '40 Ô Di Sản' : '40 Heritage Spaces'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-semibold border border-blue-200">
                    {language === 'vi' ? 'Bắc Bộ' : 'North'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold border border-amber-200">
                    {language === 'vi' ? 'Trung Bộ' : 'Central'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200">
                    {language === 'vi' ? 'Nam Bộ' : 'South'}
                  </span>
                </div>
              </div>

              {/* Center Middle: Dice Rolling Arena */}
              <div className="board-dice-arena flex flex-col items-center justify-center py-3 z-10 gap-2.5">
                <div className="text-center">
                  <div className="font-serif-lacviet text-xl sm:text-2xl font-bold text-[#543310] flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activePlayer?.color }} />
                    <span>{activePlayer?.name}</span>
                  </div>
                </div>

                {/* Animated Dice */}
                <DiceRoller
                  value={gameState.diceValue}
                  isRolling={isRolling}
                  disabled={gameState.hasRolled || activePlayer?.isAI}
                  onRoll={onRollDice}
                  language={language}
                />

                {gameState.diceValue && (
                  <div className="text-xs font-medium text-gray-700 bg-white/95 px-3 py-1 rounded-full border border-gray-200 shadow-sm animate-fade-in font-mono">
                    🎲 {language === 'vi' ? `${gameState.diceValue} bước` : `${gameState.diceValue} steps`}
                  </div>
                )}
              </div>
              <div className="board-center-controls hidden relative z-10">
                <TurnControls
                  activePlayer={activePlayer}
                  hasRolled={gameState.hasRolled}
                  isRolling={isRolling}
                  onRollDice={onRollDice}
                  onUseTokenSkill={onUseTokenSkill}
                  onEndTurn={onEndTurn}
                  language={language}
                />
              </div>

              {/* Center Bottom: Quick Log of recent game actions */}
              <div className="z-10 bg-white/85 backdrop-blur rounded-xl p-2 border border-[#C5A059]/30 text-[11px] text-gray-600 max-h-[64px] overflow-y-auto">
                <div className="font-semibold text-gray-800 mb-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wide">
                  <Compass size={11} className="text-[#C5A059]" />
                  <span>{language === 'vi' ? 'Nhật ký:' : 'Log:'}</span>
                </div>
                <div className="space-y-0.5">
                  {gameState.historyLog.slice(-2).reverse().map((log, i) => (
                    <div key={i} className="truncate">
                      • {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Spaces 31 down to 39) */}
            <div className="board-side col-span-1 flex flex-col justify-between gap-1 sm:gap-1.5">
              {rightSpaces.map(idx => (
                <BoardSpaceTile
                  key={idx}
                  orientation="vertical"
                  space={boardSpaces[idx]}
                  playersOnSpace={getPlayersOnSpace(idx)}
                  activePlayerIndex={gameState.activePlayerIndex}
                  isSelected={selectedSpaceIndex === idx}
                  onClick={() => setSelectedSpaceIndex(idx)}
                  language={language}
                />
              ))}
            </div>
          </div>

          {/* Bottom Row: Corner 10 (Bac Bo), Spaces 9 down to 1, Corner 0 (START) */}
          <div className="board-edge-row grid grid-cols-11 gap-1 sm:gap-1.5">
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(idx => (
              <BoardSpaceTile
                key={idx}
                space={boardSpaces[idx]}
                playersOnSpace={getPlayersOnSpace(idx)}
                activePlayerIndex={gameState.activePlayerIndex}
                isSelected={selectedSpaceIndex === idx}
                onClick={() => setSelectedSpaceIndex(idx)}
                language={language}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Turn Controls Bar */}
      <div className="board-bottom-controls">
      <TurnControls
        activePlayer={activePlayer}
        hasRolled={gameState.hasRolled}
        isRolling={isRolling}
        onRollDice={onRollDice}
        onUseTokenSkill={onUseTokenSkill}
        onEndTurn={onEndTurn}
        language={language}
      />
      </div>

      {/* Selected Space Inspection Drawer / Modal */}
      {selectedSpace && (() => {
        const spaceData = getBoardSpaceData(selectedSpace, language);
        return (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-backdrop-fade">
            <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border-2 border-[#C5A059] relative animate-modal-pop">
              <button
                onClick={() => setSelectedSpaceIndex(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#543310] text-[#F5E5BE]">
                  {language === 'vi' ? `Ô #${selectedSpace.index}` : `Space #${selectedSpace.index}`}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {spaceData.subtitle}
                </span>
              </div>

              <h3 className="font-serif-lacviet text-xl font-bold text-[#543310] mb-1">
                {spaceData.name}
              </h3>

              {spaceData.heritageHighlight && (
                <div className="flex items-center gap-1.5 text-xs text-[#8C572D] font-bold mb-3">
                  <MapPin size={13} />
                  <span>{spaceData.heritageHighlight}</span>
                </div>
              )}

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4 bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/20">
                {spaceData.description}
              </p>

              {/* Players currently here */}
              {getPlayersOnSpace(selectedSpace.index).length > 0 && (
                <div className="mb-4 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-800">
                    {language === 'vi' ? 'Người chơi tại ô:' : 'Players on this space:'}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {getPlayersOnSpace(selectedSpace.index).map(p => (
                      <span
                        key={p.id}
                        className="px-2 py-0.5 rounded-full text-white text-[11px] font-bold shadow-sm"
                        style={{ backgroundColor: p.color }}
                      >
                        P{p.seat} {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedSpaceIndex(null)}
                className="w-full py-2 bg-[#543310] hover:bg-[#6F441E] text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059]"
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

