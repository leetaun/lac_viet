import React from 'react';
import { Volume2, Volume1, VolumeX, RotateCcw, Trophy, MapPin, User, Sparkles, ChevronDown, Plus, Minus } from 'lucide-react';
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
  volume: number;
  onVolumeChange: (newVol: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  gameState,
  language,
  onToggleLanguage,
  onResetGame,
  soundEnabled,
  onToggleSound,
  volume,
  onVolumeChange,
}) => {
  const [now, setNow] = React.useState(Date.now());
  const [showVolumePopup, setShowVolumePopup] = React.useState(false);
  const volumeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolumePopup(false);
      }
    };
    if (showVolumePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVolumePopup]);
  React.useEffect(()=>{
    if(!gameState.endsAt || gameState.gameStatus!=='playing')return;
    const timer=setInterval(()=>setNow(Date.now()),1000);
    return()=>clearInterval(timer);
  },[gameState.endsAt,gameState.gameStatus]);
  const secondsLeft = gameState.endsAt ? Math.max(0,Math.ceil((gameState.endsAt-now)/1000)) : null;
  const activePlayer = gameState.players[gameState.activePlayerIndex] || gameState.players[0];
  const activeSpace = BOARD_SPACES[activePlayer?.position || 0];
  const tokenDef = activePlayer ? TOKENS[activePlayer.token] : null;

  return (
    <header className="sticky top-0 z-40 bg-[#452817] text-white shadow-md border-b-2 border-[#C5A059]">
      <div className="max-w-7xl mx-auto px-3 py-2 sm:px-4 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Left: Brand & Active Player */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF6EE] text-[#452817] flex items-center justify-center font-bold text-base shadow border border-[#C5A059] flex-shrink-0">
              <span className="font-serif-lacviet">LV</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-lacviet font-bold text-sm sm:text-base text-[#F5E5BE] tracking-wide">
                  LẠC VIỆT
                </span>
                <span className="text-[10px] bg-[#5C3A21] text-[#E5C07B] px-1.5 py-0.2 rounded border border-[#C5A059]/40 font-mono hidden sm:inline-block">
                  {gameState.mode === 'offline' ? (language === 'vi' ? 'Trọng tài' : 'Referee') :
                   gameState.mode === 'ai' ? 'Vs AI' : 'Online'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#F5E5BE]/90 font-medium">
                <User size={12} className="text-[#C5A059]" />
                <span className="font-semibold text-white truncate max-w-[110px] sm:max-w-[160px]">
                  {activePlayer?.name}
                </span>
                <span className="text-[#E5C07B]/70">· P{activePlayer?.seat}</span>
                {tokenDef && <span className="ml-0.5">{tokenDef.icon}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Position & Artifact Progress */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Current Space */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#331C10] px-2.5 py-1 rounded-full border border-[#C5A059]/30 text-xs">
            <MapPin size={13} className="text-[#E5C07B]" />
            <span className="text-white font-medium truncate max-w-[120px]">
              {language === 'vi' ? activeSpace.name : activeSpace.enName}
            </span>
          </div>

          {/* Artifact Counter */}
          <div className="flex items-center gap-1.5 bg-[#331C10] px-2.5 py-1 sm:px-3 sm:py-1 rounded-full border border-[#C5A059] shadow-sm">
            <Trophy size={14} className="text-[#E5C07B]" />
            <span className="font-bold text-xs sm:text-sm text-[#F5E5BE]">
              {(activePlayer?.artifacts || 0) + (activePlayer?.safeArtifacts || 0)}/{gameState.artifactGoal}
            </span>
            <span className="text-[10px] text-[#E5C07B]/80 hidden sm:inline">
              {language === 'vi' ? 'Kỷ vật' : 'Artifacts'}
            </span>
          </div>

          {secondsLeft !== null && (
            <span className="text-[10px] text-[#E5C07B]/80 hidden sm:inline font-mono">
              {secondsLeft > 0 
                ? `⏱️ ${Math.floor(secondsLeft/60)}:${String(secondsLeft%60).padStart(2,'0')}` 
                : (language === 'vi' ? '⏱️ Hết giờ' : "⏱️ Time's up")}
            </span>
          )}
          {/* Start Bank Penalized Artifacts if any */}
          {gameState.lostAndFound.length > 0 && (
            <div className="hidden lg:flex items-center gap-1 bg-amber-900/40 border border-amber-600/60 text-[#FDE68A] px-2 py-0.5 rounded text-[11px]">
              <Sparkles size={11} />
              <span>{language === 'vi' ? `Kho START: ${gameState.lostAndFound.length}` : `START Bank: ${gameState.lostAndFound.length}`}</span>
            </div>
          )}
        </div>

        {/* Right: Controls (Language, Sound, Reset) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language VI / EN Toggle */}
          <button
            onClick={onToggleLanguage}
            className="px-2 py-1 bg-[#331C10] hover:bg-[#5C3A21] text-[#E5C07B] rounded text-xs font-bold border border-[#C5A059]/50 transition-colors shadow-sm"
            title={language === 'vi' ? 'Chuyển sang Tiếng Anh' : 'Switch to Vietnamese'}
          >
            {language === 'vi' ? 'VI / EN' : 'EN / VI'}
          </button>

          {/* Sound & Music Control Group */}
          <div className="relative" ref={volumeRef}>
            <div
              className={`flex items-center bg-[#331C10] hover:bg-[#432515] rounded-full border transition-all duration-300 ${
                soundEnabled && volume > 0
                  ? 'text-[#E5C07B] border-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.35)]'
                  : 'text-gray-400 border-[#C5A059]/20 hover:text-gray-300'
              }`}
            >
              {/* Quick Mute / Unmute Button */}
              <button
                onClick={() => {
                  onToggleSound();
                  soundManager.playCardDraw();
                }}
                className="p-1.5 sm:p-2 rounded-l-full hover:text-white transition-colors flex items-center justify-center"
                title={
                  soundEnabled && volume > 0
                    ? (language === 'vi' ? 'Tắt âm thanh & Nhạc nền' : 'Mute Sound & Music')
                    : (language === 'vi' ? 'Bật âm thanh & Nhạc nền' : 'Enable Sound & Music')
                }
              >
                {!soundEnabled || volume === 0 ? (
                  <VolumeX size={15} />
                ) : volume < 0.5 ? (
                  <Volume1 size={15} />
                ) : (
                  <span className="relative flex items-center justify-center">
                    <Volume2 size={15} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-[#331C10]" />
                  </span>
                )}
              </button>

              {/* Adjust Volume Trigger */}
              <button
                onClick={() => setShowVolumePopup(!showVolumePopup)}
                className="pr-2 pl-1 py-1 sm:py-1.5 text-[11px] font-mono hover:text-white rounded-r-full transition-colors flex items-center gap-0.5 border-l border-[#C5A059]/30"
                title={language === 'vi' ? 'Điều chỉnh âm lượng' : 'Adjust Volume'}
              >
                <span className="min-w-[28px] text-right font-semibold">
                  {soundEnabled ? `${Math.round(volume * 100)}%` : '0%'}
                </span>
                <ChevronDown
                  size={11}
                  className={`transition-transform duration-200 text-[#C5A059] ${
                    showVolumePopup ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Volume Adjustment Popup */}
            {showVolumePopup && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3.5 bg-[#2A160C]/95 backdrop-blur-md rounded-xl border border-[#C5A059] shadow-[0_12px_30px_rgba(0,0,0,0.75)] z-50 text-[#FDE68A] animate-in fade-in duration-150">
                {/* Title & Status */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#C5A059]/30 text-xs">
                  <span className="font-serif-lacviet font-bold tracking-wide text-[#E5C07B] flex items-center gap-1.5">
                    <Volume2 size={14} className="text-[#C5A059]" />
                    {language === 'vi' ? 'ÂM LƯỢNG' : 'VOLUME'}
                  </span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] border ${
                      soundEnabled && volume > 0
                        ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
                        : 'text-red-400 bg-red-950/60 border-red-500/40'
                    }`}
                  >
                    {soundEnabled && volume > 0
                      ? `${Math.round(volume * 100)}%`
                      : (language === 'vi' ? 'Đã tắt' : 'Muted')}
                  </span>
                </div>

                {/* Slider & Increments */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => {
                      const next = Math.max(0, Math.round((volume - 0.1) * 10) / 10);
                      onVolumeChange(next);
                      soundManager.playCardDraw();
                    }}
                    className="p-1.5 bg-[#3D2112] hover:bg-[#5C3A21] active:scale-95 text-[#E5C07B] rounded-lg border border-[#C5A059]/40 transition-all shadow-sm"
                    title={language === 'vi' ? 'Giảm 10%' : 'Decrease 10%'}
                  >
                    <Minus size={13} />
                  </button>

                  <div className="flex-1 relative flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={soundEnabled ? volume : 0}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onVolumeChange(val);
                      }}
                      className="w-full h-2 bg-[#1B0C05] rounded-lg appearance-none cursor-pointer accent-[#C5A059] border border-[#C5A059]/30"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const next = Math.min(1, Math.round((volume + 0.1) * 10) / 10);
                      onVolumeChange(next);
                      soundManager.playCardDraw();
                    }}
                    className="p-1.5 bg-[#3D2112] hover:bg-[#5C3A21] active:scale-95 text-[#E5C07B] rounded-lg border border-[#C5A059]/40 transition-all shadow-sm"
                    title={language === 'vi' ? 'Tăng 10%' : 'Increase 10%'}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Quick Level Presets */}
                <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                  {[0.25, 0.5, 0.75, 1.0].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        onVolumeChange(preset);
                        soundManager.playCardDraw();
                      }}
                      className={`py-1 text-[11px] font-mono font-bold rounded border transition-all ${
                        soundEnabled && Math.round(volume * 100) === Math.round(preset * 100)
                          ? 'bg-[#C5A059] text-[#2A160C] border-[#C5A059] shadow-[0_0_8px_rgba(197,160,89,0.5)] font-extrabold'
                          : 'bg-[#3D2112] hover:bg-[#5C3A21] text-[#E5C07B] border-[#C5A059]/30'
                      }`}
                    >
                      {Math.round(preset * 100)}%
                    </button>
                  ))}
                </div>

                {/* Toggle Mute / Unmute Button in popover */}
                <button
                  onClick={() => {
                    onToggleSound();
                    soundManager.playCardDraw();
                  }}
                  className="w-full py-1.5 bg-[#3D2112] hover:bg-[#5C3A21] text-[#E5C07B] text-[11px] rounded-lg border border-[#C5A059]/40 flex items-center justify-center gap-1.5 transition-colors font-medium shadow-sm"
                >
                  {soundEnabled && volume > 0 ? (
                    <>
                      <VolumeX size={13} className="text-red-400" />
                      <span>{language === 'vi' ? 'Tắt âm thanh' : 'Mute Audio'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} className="text-emerald-400" />
                      <span>{language === 'vi' ? 'Bật lại âm thanh' : 'Unmute Audio'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* New Game / Reset */}
          <button
            onClick={onResetGame}
            className="p-1.5 sm:p-2 bg-[#331C10] hover:bg-[#5C3A21] text-[#E5C07B] rounded-full border border-[#C5A059]/40 transition-colors"
            title={language === 'vi' ? 'Thiết lập ván mới' : 'New Game Setup'}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};

