import React from 'react';
import { Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { Trophy, Shield, Layers, Bot, User } from 'lucide-react';

interface PlayerBarProps {
  players: Player[];
  activePlayerIndex: number;
  artifactGoal: number;
  language: 'vi' | 'en';
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  players,
  activePlayerIndex,
  artifactGoal,
  language
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
      {players.map((player, idx) => {
        const isActive = idx === activePlayerIndex;
        const tokenDef = TOKENS[player.token];
        const totalArtifacts = player.artifacts + player.safeArtifacts;
        const totalCards = 
          player.cards.knowledge.length + 
          player.cards.resource.length + 
          player.cards.fortune.length;

        return (
          <div
            key={player.id}
            className={`relative rounded-xl p-2 sm:p-2.5 transition-all duration-300 ease-out border text-xs ${
              isActive
                ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FDF4DC] border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/50 scale-[1.02] shadow-[0_0_12px_rgba(197,160,89,0.35)]'
                : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white'
            }`}
          >
            {/* Header: Seat & Name */}
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <div className="flex items-center gap-1 min-w-0">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: player.color }}
                >
                  P{player.seat}
                </span>
                <span className="font-bold text-gray-900 truncate text-[11px] sm:text-xs">
                  {player.name}
                </span>
                {player.isAI && (
                  <Bot size={11} className="text-gray-400 flex-shrink-0" title="Máy AI" />
                )}
              </div>
              <span className="text-sm flex-shrink-0" title={tokenDef.name}>
                {tokenDef.icon}
              </span>
            </div>

            {/* Token name & Passive brief */}
            <div className="text-[10px] text-gray-500 truncate mb-1">
              <span className="font-medium text-gray-700">{tokenDef.name}</span>: {tokenDef.passive}
            </div>

            {/* Stats row: Artifacts, Hand Cards, Shield */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100">
              {/* Artifacts */}
              <div className="flex items-center gap-1 text-[#7E121D] font-bold">
                <Trophy size={12} className="text-[#C5A059]" />
                <span>{totalArtifacts}/{artifactGoal}</span>
                {player.safeArtifacts > 0 && (
                  <span className="text-[9px] text-green-600" title="Kỷ vật đã gửi an toàn">
                    ({player.safeArtifacts} an toàn)
                  </span>
                )}
              </div>

              {/* Hand cards & Shield */}
              <div className="flex items-center gap-1.5 text-gray-600">
                <div className="flex items-center gap-0.5" title="Thẻ trên tay">
                  <Layers size={11} />
                  <span>{totalCards}</span>
                </div>
                {player.hasShield && (
                  <Shield size={11} className="text-blue-600 fill-blue-100" title="Đang có Lá chắn bảo vệ" />
                )}
              </div>
            </div>

            {/* Active Turn Indicator banner */}
            {isActive && (
              <div className="mt-1.5 text-center text-[9px] font-bold text-[#7E121D] bg-[#E5C07B]/30 rounded py-0.5 border border-[#C5A059]/40">
                {language === 'vi' ? 'Đang đến lượt' : 'Current Turn'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

