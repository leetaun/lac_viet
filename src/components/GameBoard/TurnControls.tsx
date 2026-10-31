import React from 'react';
import { Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TurnControlsProps {
  activePlayer: Player;
  hasRolled: boolean;
  isRolling: boolean;
  onRollDice: () => void;
  onUseTokenSkill: () => void;
  onEndTurn: () => void;
  language: 'vi' | 'en';
}

export const TurnControls: React.FC<TurnControlsProps> = ({
  activePlayer,
  hasRolled,
  isRolling,
  onRollDice,
  onUseTokenSkill,
  onEndTurn,
  language
}) => {
  if (!activePlayer) return null;
  const tokenDef = TOKENS[activePlayer.token] || TOKENS.non_la;

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl p-3 sm:p-4 border border-[#C5A059]/40 shadow-sm flex flex-col gap-2.5">
      {/* Status banner */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activePlayer.color }} />
          <span>{activePlayer.name}:</span>
          <span className="text-gray-600 font-normal">
            {!hasRolled
              ? (language === 'vi' ? 'Tung xúc xắc' : 'Roll dice')
              : (language === 'vi' ? 'Dùng kỹ năng hoặc Kết lượt' : 'Use skill or end turn')}
          </span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Token Skill Button */}
        <button
          type="button"
          disabled={!activePlayer.tokenSkillAvailable}
          onClick={onUseTokenSkill}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 border shadow-sm ${
            activePlayer.tokenSkillAvailable
              ? 'bg-[#FAF6EE] hover:bg-[#F5EFE6] text-[#543310] border-[#C5A059] active:scale-98'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
          }`}
          title={tokenDef.description}
        >
          <Sparkles size={14} className={activePlayer.tokenSkillAvailable ? 'text-[#C5A059]' : 'text-gray-400'} />
          <span className="truncate">
            {tokenDef.name}: {tokenDef.passive}
            {activePlayer.tokenSkillAvailable 
              ? '' 
              : (language === 'vi' ? ' (Đã dùng)' : ' (Used)')}
          </span>
        </button>

        {/* End Turn Button */}
        <button
          type="button"
          disabled={!hasRolled || isRolling}
          onClick={onEndTurn}
          className={`py-2 sm:py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm ${
            hasRolled && !isRolling
              ? 'bg-[#452817] hover:bg-[#5C3A21] text-[#F5E5BE] border border-[#C5A059] active:scale-98'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <span>{language === 'vi' ? 'Kết lượt' : 'End Turn'}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Guide hint */}
      <div className="text-[11px] text-gray-600 bg-[#FAF6EE] p-2 rounded-lg border border-[#C5A059]/25 flex items-center gap-1.5">
        <CheckCircle2 size={13} className="text-[#C5A059] flex-shrink-0" />
        <span className="truncate">
          {language === 'vi' 
            ? '💡 Kỹ năng: 1 lần/vòng · Hồi ở ô START hoặc Ô góc'
            : '💡 Passive: 1/lap · Resets at START or Corner'}
        </span>
      </div>
    </div>
  );
};

