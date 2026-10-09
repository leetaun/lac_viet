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
              ? (language === 'vi' ? 'Tung xúc xắc để di chuyển' : 'Roll dice to move')
              : (language === 'vi' ? 'Đã di chuyển. Có thể dùng kỹ năng hoặc kết lượt' : 'Moved. Use skill or end turn')}
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
              ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 active:scale-98'
              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
          }`}
          title={tokenDef.description}
        >
          <Sparkles size={14} className={activePlayer.tokenSkillAvailable ? 'text-amber-600' : 'text-gray-400'} />
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
              ? 'bg-[#1E2538] hover:bg-[#2A344D] text-[#E5C07B] border border-[#C5A059]/40 active:scale-98'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <span>{language === 'vi' ? 'Kết lượt' : 'End Turn'}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Guide hint */}
      <div className="text-[11px] text-gray-500 bg-[#FAF6EE] p-2 rounded-lg border border-[#C5A059]/20 flex items-start gap-1.5">
        <CheckCircle2 size={13} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
        <div>
          {language === 'vi' ? (
            <span>
              <strong>Kỹ năng Token:</strong> Mỗi token chỉ dùng 1 lần/vòng. Được hồi phục khi đi qua ô START hoặc dừng tại 3 ô Góc lớn.
            </span>
          ) : (
            <span>
              <strong>Token Passive:</strong> Usable once per lap. Resets upon passing START or stopping at the 3 Corner Stations.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

