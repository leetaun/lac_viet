import React from 'react';
import { BoardSpace, Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { BookOpen, Sparkles, ShoppingBag, Swords, Landmark, Flag } from 'lucide-react';

interface BoardSpaceTileProps {
  space: BoardSpace;
  playersOnSpace: Player[];
  activePlayerIndex: number;
  isSelected?: boolean;
  onClick?: () => void;
  orientation?: 'horizontal' | 'vertical' | 'corner';
}

export const BoardSpaceTile: React.FC<BoardSpaceTileProps> = ({
  space,
  playersOnSpace,
  activePlayerIndex,
  isSelected,
  onClick,
  orientation = 'horizontal'
}) => {
  // Color configuration by space type
  const getTypeConfig = () => {
    switch (space.type) {
      case 'start':
        return {
          bg: 'bg-[#1E2538] text-white',
          border: 'border-[#C5A059] border-2 shadow-gold-glow',
          badgeBg: 'bg-[#C5A059] text-[#1E2538]',
          badgeText: 'START',
          icon: <Flag size={14} className="text-[#E5C07B]" />
        };
      case 'corner':
        return {
          bg: 'bg-[#7E121D] text-white',
          border: 'border-[#E5C07B] border-2',
          badgeBg: 'bg-[#E5C07B] text-[#7E121D]',
          badgeText: 'TRẠM GÓC',
          icon: <Landmark size={14} className="text-[#F5E5BE]" />
        };
      case 'knowledge':
        return {
          bg: 'bg-white hover:bg-blue-50/60',
          border: 'border-blue-200 border hover:border-blue-400',
          badgeBg: 'bg-blue-100 text-blue-800',
          badgeText: 'Kiến thức',
          icon: <BookOpen size={13} className="text-blue-600" />
        };
      case 'festival':
        return {
          bg: 'bg-white hover:bg-amber-50/60',
          border: 'border-amber-200 border hover:border-amber-400',
          badgeBg: 'bg-amber-100 text-amber-800',
          badgeText: 'Lễ hội',
          icon: <Sparkles size={13} className="text-amber-600" />
        };
      case 'market':
        return {
          bg: 'bg-white hover:bg-emerald-50/60',
          border: 'border-emerald-200 border hover:border-emerald-400',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          badgeText: 'Thị trường',
          icon: <ShoppingBag size={13} className="text-emerald-600" />
        };
      case 'challenge':
        return {
          bg: 'bg-white hover:bg-red-50/60',
          border: 'border-red-200 border hover:border-red-400',
          badgeBg: 'bg-red-100 text-red-800',
          badgeText: 'Thử thách',
          icon: <Swords size={13} className="text-red-600" />
        };
    }
  };

  const config = getTypeConfig();
  const isCorner = space.type === 'start' || space.type === 'corner';

  return (
    <div
      onClick={onClick}
      className={`relative select-none cursor-pointer transition-all duration-150 rounded-lg p-1.5 flex flex-col justify-between ${
        config.bg
      } ${config.border} ${
        isSelected ? 'ring-2 ring-[#C5A059] scale-[1.03] z-20 shadow-md' : 'shadow-sm'
      } ${
        isCorner
          ? 'aspect-square min-w-[70px] min-h-[70px] sm:min-w-[85px] sm:min-h-[85px]'
          : 'min-w-[58px] min-h-[64px] sm:min-w-[72px] sm:min-h-[75px]'
      }`}
    >
      {/* Space Index & Type Badge */}
      <div className="flex items-center justify-between gap-1 w-full">
        <span className={`text-[9px] font-mono font-bold px-1 rounded ${
          isCorner ? 'bg-black/30 text-[#E5C07B]' : 'bg-gray-100 text-gray-500'
        }`}>
          #{space.index}
        </span>
        <div className="flex items-center gap-0.5">
          {config.icon}
        </div>
      </div>

      {/* Title */}
      <div className="my-0.5 text-center leading-tight">
        <div className={`font-bold text-[11px] sm:text-[12px] truncate ${
          isCorner ? 'text-[#F5E5BE] font-serif-lacviet' : 'text-gray-900'
        }`}>
          {space.name}
        </div>
        <div className={`text-[8px] sm:text-[9px] truncate ${
          isCorner ? 'text-[#E5C07B]/80 font-medium' : 'text-gray-500'
        }`}>
          {config.badgeText}
        </div>
      </div>

      {/* Players Tokens currently resting on this tile */}
      <div className="flex items-center justify-center gap-1 min-h-[18px]">
        {playersOnSpace.map((player) => {
          const tDef = TOKENS[player.token];
          const isActive = player.seat - 1 === activePlayerIndex;

          return (
            <div
              key={player.id}
              className={`relative w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs shadow-md border border-white transition-transform ${
                isActive ? 'animate-token-active scale-110 z-10' : ''
              }`}
              style={{ backgroundColor: player.color }}
              title={`${player.name} (${tDef.name})`}
            >
              <span>{tDef.icon}</span>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

