import React from 'react';
import { Volume2, VolumeX, RotateCcw, Trophy, MapPin, User, Sparkles } from 'lucide-react';
import { GameState } from '../types/game';
import { BOARD_SPACES } from '../data/boardData';
import { TOKENS } from '../data/tokens';
import { soundManager } from '../utils/sound';

interface HeaderProps {
  gameState: GameState;
  language: 'vi' | 'en';
  onToggleLanguage: () => void;
  onResetGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameState,
  language,
  onToggleLanguage,
  onResetGame,
  soundEnabled,
  onToggleSound,
}) => {
  const activePlayer = gameState.players[gameState.activePlayerIndex] || gameState.players[0];
  const activeSpace = BOARD_SPACES[activePlayer?.position || 0];
  const tokenDef = activePlayer ? TOKENS[activePlayer.token] : null;

  return (
    <header className="sticky top-0 z-40 bg-[#7E121D] text-white shadow-md border-b-2 border-[#C5A059]">
      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Left: Brand & Active Player */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF6EE] text-[#7E121D] flex items-center justify-center font-bold text-base shadow border border-[#C5A059] flex-shrink-0">
              <span className="font-serif-lacviet">LV</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-lacviet font-bold text-sm sm:text-base text-[#F5E5BE] tracking-wide">
                  LẠC VIỆT
                </span>
                <span className="text-[10px] bg-[#941B26] text-[#E5C07B] px-1.5 py-0.2 rounded border border-[#C5A059]/40 font-mono hidden sm:inline-block">
                  {gameState.mode === 'offline' ? (language === 'vi' ? 'Trọng tài' : 'Referee') :
                   gameState.mode === 'ai' ? 'Vs AI' : 'Online'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#F5E5BE]/90 font-medium">
                <User size={12} className="text-[#C5A059]" />
                <span className="font-semibold text-white truncate max-w-[110px] sm:max-w-[160px]">
                  {activePlayer?.name}
                </span>
                <span className="text-[#E5C07B]/70">· Ghế {activePlayer?.seat}</span>
                {tokenDef && <span className="ml-0.5">{tokenDef.icon}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Position & Artifact Progress */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Current Space */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#5C0D15] px-2.5 py-1 rounded-full border border-[#C5A059]/30 text-xs">
            <MapPin size={13} className="text-[#E5C07B]" />
            <span className="text-white font-medium truncate max-w-[120px]">
              {language === 'vi' ? activeSpace.name : activeSpace.enName}
            </span>
          </div>

          {/* Artifact Counter */}
          <div className="flex items-center gap-1.5 bg-[#5C0D15] px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-[#C5A059] shadow-sm">
            <Trophy size={14} className="text-[#E5C07B]" />
            <span className="font-bold text-xs sm:text-sm text-[#F5E5BE]">
              {(activePlayer?.artifacts || 0) + (activePlayer?.safeArtifacts || 0)}/{gameState.artifactGoal}
            </span>
            <span className="text-[10px] text-[#E5C07B]/80 hidden sm:inline">
              {language === 'vi' ? 'Kỷ vật' : 'Artifacts'}
            </span>
          </div>

          {/* Start Bank Penalized Artifacts if any */}
          {gameState.penalizedArtifactsAtStart > 0 && (
            <div className="hidden lg:flex items-center gap-1 bg-[#D97706]/20 border border-[#D97706] text-[#FDE68A] px-2 py-0.5 rounded text-[11px]">
              <Sparkles size={11} />
              <span>START: {gameState.penalizedArtifactsAtStart} kỷ vật phạt</span>
            </div>
          )}
        </div>

        {/* Right: Controls (Language, Sound, Reset) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language VI / EN Toggle (Matching Slide mockups!) */}
          <button
            onClick={onToggleLanguage}
            className="px-2 py-1 bg-[#5C0D15] hover:bg-[#941B26] text-[#E5C07B] rounded text-xs font-bold border border-[#C5A059]/50 transition-colors shadow-sm"
            title="Đổi ngôn ngữ VI / EN"
          >
            {language === 'vi' ? 'VI / EN' : 'EN / VI'}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundManager.playCardDraw();
            }}
            className="p-1.5 sm:p-2 bg-[#5C0D15] hover:bg-[#941B26] text-[#E5C07B] rounded-full border border-[#C5A059]/40 transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} className="text-gray-400" />}
          </button>

          {/* New Game / Reset */}
          <button
            onClick={onResetGame}
            className="p-1.5 sm:p-2 bg-[#5C0D15] hover:bg-[#941B26] text-[#E5C07B] rounded-full border border-[#C5A059]/40 transition-colors"
            title="Thiết lập trận mới"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};

