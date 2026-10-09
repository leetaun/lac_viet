import React, { useState } from 'react';
import { GameState, BoardSpace } from '../../types/game';
import { BOARD_SPACES } from '../../data/boardData';
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

  const selectedSpace = selectedSpaceIndex !== null ? BOARD_SPACES[selectedSpaceIndex] : null;

  return (
    <div className="flex flex-col gap-4 pb-20 max-w-7xl mx-auto px-2 sm:px-4">
      {/* 4 Players status bar */}
      <PlayerBar
        players={gameState.players}
        activePlayerIndex={gameState.activePlayerIndex}
        artifactGoal={gameState.artifactGoal}
        language={language}
      />

      {/* Main Board Container */}
      <div className="bg-[#F4EFE6] rounded-3xl p-2 sm:p-4 shadow-board border-2 border-[#C5A059]/40 relative overflow-x-auto">
        {/* Responsive board wrapper */}
        <div className="min-w-[760px] md:min-w-[850px] flex flex-col gap-2">
          
          {/* Top Row: Corner 20 (Trung Bo), Spaces 21-29, Corner 30 (Nam Bo) */}
          <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
            {topSpaces.map(idx => (
              <BoardSpaceTile
                key={idx}
                space={BOARD_SPACES[idx]}
                playersOnSpace={getPlayersOnSpace(idx)}
                activePlayerIndex={gameState.activePlayerIndex}
                isSelected={selectedSpaceIndex === idx}
                onClick={() => setSelectedSpaceIndex(idx)}
              />
            ))}
          </div>

          {/* Middle Section: Left Col, Center Arena, Right Col */}
          <div className="grid grid-cols-11 gap-1 sm:gap-1.5 items-stretch">
            {/* Left Column (Spaces 19 down to 11) */}
            <div className="col-span-1 flex flex-col justify-between gap-1 sm:gap-1.5">
              {[...leftSpaces].reverse().map(idx => (
                <BoardSpaceTile
                  key={idx}
                  space={BOARD_SPACES[idx]}
                  playersOnSpace={getPlayersOnSpace(idx)}
                  activePlayerIndex={gameState.activePlayerIndex}
                  isSelected={selectedSpaceIndex === idx}
                  onClick={() => setSelectedSpaceIndex(idx)}
                />
              ))}
            </div>

            {/* Center Arena: 9 columns wide */}
            <div className="col-span-9 bg-gradient-to-br from-[#FAF6EE] via-[#FFFDF9] to-[#F5E5BE]/30 rounded-2xl p-4 sm:p-6 border border-[#C5A059]/30 flex flex-col justify-between relative shadow-inner overflow-hidden min-h-[360px]">
              {/* Vietnam S-Shape subtle vector backdrop */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.09] flex items-center justify-center">
                <svg viewBox="0 0 400 800" className="h-full max-h-[380px] text-[#7E121D] fill-current">
                  <path d="M 180,40 Q 220,70 190,120 Q 150,180 180,240 Q 210,300 230,360 Q 250,420 220,480 Q 170,540 180,620 Q 190,700 130,760" stroke="#7E121D" strokeWidth="32" fill="none" strokeLinecap="round" />
                </svg>
              </div>

              {/* Center Top: Cultural Title & Region Indicators */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7E121D]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7E121D]">
                    {language === 'vi' ? 'Hành trình 40 ô di sản' : '40-Tile Heritage Journey'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                    Bắc Bộ
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                    Trung Bộ
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                    Nam Bộ
                  </span>
                </div>
              </div>

              {/* Center Middle: Dice Rolling Arena */}
              <div className="flex flex-col items-center justify-center py-4 z-10 gap-3">
                <div className="text-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {language === 'vi' ? 'Lượt của' : 'Turn for'}
                  </span>
                  <div className="font-serif-lacviet text-xl sm:text-2xl font-bold text-[#7E121D] flex items-center justify-center gap-2">
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
                  <div className="text-xs font-medium text-gray-600 bg-white/90 px-3 py-1 rounded-full border border-gray-200 shadow-sm animate-fade-in">
                    {language === 'vi' 
                      ? `Xúc xắc: ${gameState.diceValue} bước` 
                      : `Rolled: ${gameState.diceValue} steps`}
                  </div>
                )}
              </div>

              {/* Center Bottom: Quick Log of recent game actions */}
              <div className="z-10 bg-white/80 backdrop-blur rounded-xl p-2 border border-[#C5A059]/20 text-[11px] text-gray-600 max-h-[70px] overflow-y-auto">
                <div className="font-semibold text-gray-800 mb-0.5 flex items-center gap-1">
                  <Compass size={12} className="text-[#C5A059]" />
                  <span>{language === 'vi' ? 'Nhật ký hành trình:' : 'Journey Log:'}</span>
                </div>
                <div className="space-y-0.5">
                  {gameState.historyLog.slice(-3).reverse().map((log, i) => (
                    <div key={i} className="truncate">
                      • {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (Spaces 31 down to 39) */}
            <div className="col-span-1 flex flex-col justify-between gap-1 sm:gap-1.5">
              {rightSpaces.map(idx => (
                <BoardSpaceTile
                  key={idx}
                  space={BOARD_SPACES[idx]}
                  playersOnSpace={getPlayersOnSpace(idx)}
                  activePlayerIndex={gameState.activePlayerIndex}
                  isSelected={selectedSpaceIndex === idx}
                  onClick={() => setSelectedSpaceIndex(idx)}
                />
              ))}
            </div>
          </div>

          {/* Bottom Row: Corner 10 (Bac Bo), Spaces 9 down to 1, Corner 0 (START) */}
          <div className="grid grid-cols-11 gap-1 sm:gap-1.5">
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(idx => (
              <BoardSpaceTile
                key={idx}
                space={BOARD_SPACES[idx]}
                playersOnSpace={getPlayersOnSpace(idx)}
                activePlayerIndex={gameState.activePlayerIndex}
                isSelected={selectedSpaceIndex === idx}
                onClick={() => setSelectedSpaceIndex(idx)}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Turn Controls Bar */}
      <TurnControls
        activePlayer={activePlayer}
        hasRolled={gameState.hasRolled}
        isRolling={isRolling}
        onRollDice={onRollDice}
        onUseTokenSkill={onUseTokenSkill}
        onEndTurn={onEndTurn}
        language={language}
      />

      {/* Selected Space Inspection Drawer / Modal */}
      {selectedSpace && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl border-2 border-[#C5A059] relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedSpaceIndex(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#7E121D] text-[#F5E5BE]">
                Ô #{selectedSpace.index}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {selectedSpace.subtitle}
              </span>
            </div>

            <h3 className="font-serif-lacviet text-xl font-bold text-[#7E121D] mb-1">
              {selectedSpace.name}
            </h3>

            {selectedSpace.heritageHighlight && (
              <div className="flex items-center gap-1.5 text-xs text-[#C5A059] font-bold mb-3">
                <MapPin size={13} />
                <span>{selectedSpace.heritageHighlight}</span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4 bg-[#FAF6EE] p-3 rounded-xl border border-[#C5A059]/20">
              {selectedSpace.description}
            </p>

            {/* Players currently here */}
            {getPlayersOnSpace(selectedSpace.index).length > 0 && (
              <div className="mb-4 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-800">Người chơi đang ở ô này:</span>
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
              className="w-full py-2 bg-[#7E121D] hover:bg-[#941B26] text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059]"
            >
              Đóng tra cứu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

