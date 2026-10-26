import { isProtected, pouchCards } from '../../engine/rules';
import React from 'react';
import { Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { Trophy, Shield, Layers, Bot, User, Flag, BookOpen, Lock } from 'lucide-react';

interface PlayerBarProps {
  players: Player[];
  activePlayerIndex: number;
  artifactGoal: number;
  gameModeRule?: 'toc_chien' | 'co_ban' | 'truong_ky';
  language: 'vi' | 'en';
}

export const PlayerBar: React.FC<PlayerBarProps> = ({
  players,
  activePlayerIndex,
  artifactGoal,
  gameModeRule = 'toc_chien',
  language
}) => {
  // Find least artifacts count for "Không đánh người ngã"
  const minRequiredPerRegion = gameModeRule === 'truong_ky' ? 2 : 1;

  const playerTotals = players.map(p => {
    const unsealed = p.artifactItems ? p.artifactItems.filter(a => a.storage === 'pouch' && !a.isSealed).length : p.artifacts;
    const safe = p.artifactItems ? p.artifactItems.filter(a => a.storage === 'safe').length : p.safeArtifacts;
    return unsealed + safe;
  });

  const minArtifacts = Math.min(...playerTotals);
  const maxArtifacts = Math.max(...playerTotals);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
      {players.map((player, idx) => {
        const isActive = idx === activePlayerIndex;
        const tokenDef = TOKENS[player.token];

        // Valid Artifacts
        const unsealedPouch = player.artifactItems ? player.artifactItems.filter(a => a.storage === 'pouch' && !a.isSealed) : [];
        const sealedPouch = player.artifactItems ? player.artifactItems.filter(a => a.storage === 'pouch' && a.isSealed) : [];
        const safeItems = player.artifactItems ? player.artifactItems.filter(a => a.storage === 'safe') : [];
        
        const validTotal = (player.artifactItems && player.artifactItems.length > 0)
          ? unsealedPouch.length + safeItems.length
          : player.artifacts + player.safeArtifacts;

        // Regional checks
        const allValid = [...unsealedPouch, ...safeItems];
        const hasBac = allValid.filter(a => a.region === 'bac_bo').length >= minRequiredPerRegion;
        const hasTrung = allValid.filter(a => a.region === 'trung_bo').length >= minRequiredPerRegion;
        const hasNam = allValid.filter(a => a.region === 'nam_bo').length >= minRequiredPerRegion;

        // "Không đánh người ngã" protection badge
        const isImmuneByLeast = isProtected(player, players);

        const totalCards = pouchCards(player).length;

        const biKipCount = player.biKipCards ? player.biKipCards.length : 0;

        return (
          <div
            key={player.id}
            style={{ animationDelay: `${idx * 60}ms` }}
            className={`animate-stagger-item relative rounded-2xl p-2.5 transition-all duration-300 ease-out border text-xs ${
              isActive
                ? 'bg-gradient-to-b from-[#FFFDF9] to-[#FDF4DC] border-[#C5A059] shadow-md ring-2 ring-[#C5A059]/50 scale-[1.02] shadow-[0_0_12px_rgba(197,160,89,0.35)]'
                : 'bg-white/90 border-gray-200 hover:border-gray-300 hover:bg-white'
            }`}
          >
            {/* Header: Seat & Name */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
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
                  <Bot size={11} className="text-gray-400 flex-shrink-0" aria-label="Máy AI" />
                )}
              </div>
              <span className="text-sm flex-shrink-0" title={tokenDef.name}>
                {tokenDef.icon}
              </span>
            </div>

            {/* Regional Badges: Bac - Trung - Nam */}
            <div className="flex items-center gap-1 mb-1 text-[9px] font-bold">
              <span className={`px-1 py-0.2 rounded border ${hasBac ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                Bắc
              </span>
              <span className={`px-1 py-0.2 rounded border ${hasTrung ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                Trung
              </span>
              <span className={`px-1 py-0.2 rounded border ${hasNam ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                Nam
              </span>

              {isImmuneByLeast && (
                <span className="ml-auto text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1 rounded flex items-center gap-0.5" title="Đang có ít kỷ vật nhất bàn: Miễn nhiễm hoàn toàn cướp và phong ấn!">
                  🛡️ Miễn cướp
                </span>
              )}
            </div>

            {/* Stats row: Artifacts, Hand Cards, Milestones, Bi Kip */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-100">
              {/* Artifacts */}
              <div className="flex items-center gap-1 text-[#7E121D] font-bold">
                <Trophy size={12} className="text-[#C5A059]" />
                <span>{validTotal}/{artifactGoal}</span>
                {safeItems.length > 0 && (
                  <span className="text-[9px] text-emerald-700" title="Kỷ vật đã ký gửi an toàn">
                    (+{safeItems.length} gửi)
                  </span>
                )}
                {sealedPouch.length > 0 && (
                  <span className="text-[9px] text-red-600 flex items-center" title="Kỷ vật bị phong ấn">
                    <Lock size={9} /> {sealedPouch.length}
                  </span>
                )}
              </div>

              {/* Hand cards & Bi Kip */}
              <div className="flex items-center gap-1.5 text-gray-600">
                <div className="flex items-center gap-0.5" title="Thẻ bài túi đồ">
                  <Layers size={11} />
                  <span>{totalCards}</span>
                </div>
                <div className="flex items-center gap-0.5 text-amber-800" title="Bí kíp tích lũy">
                  <BookOpen size={11} />
                  <span>{biKipCount}</span>
                </div>
                {player.milestones && player.milestones.length > 0 && (
                  <div className="flex items-center gap-0.5 text-[#7E121D]" title="Cột mốc đã cắm">
                    <Flag size={11} />
                    <span>{player.milestones.length}</span>
                  </div>
                )}
                {player.hasShield && (
                  <Shield size={11} className="text-blue-600 fill-blue-100" aria-label="Lá chắn" />
                )}
              </div>
            </div>

            {/* Active Turn Indicator banner */}
            {isActive && (
              <div className="mt-1 text-center text-[9px] font-bold text-[#7E121D] bg-[#E5C07B]/30 rounded py-0.5 border border-[#C5A059]/40">
                {language === 'vi' ? 'Đang trong lượt' : 'Current Turn'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
