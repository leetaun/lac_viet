import React, { useState } from 'react';
import { soundManager } from '../../utils/sound';

interface DiceRollerProps {
  value: number | null;
  isRolling: boolean;
  disabled?: boolean;
  onRoll: () => void;
  language: 'vi' | 'en';
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  value,
  isRolling,
  disabled,
  onRoll,
  language
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value || 1);

  const handleClick = () => {
    if (disabled || isRolling) return;
    soundManager.playDiceRoll();
    onRoll();
  };

  // Render pips on a 6-sided die
  const renderPips = (num: number) => {
    const val = isRolling ? Math.floor(Math.random() * 6) + 1 : (value || num);
    
    // 3x3 grid coordinates for pips
    const pipsLayout: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };

    const activeIndices = pipsLayout[val] || [4];

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-10 h-10 sm:w-12 sm:h-12 p-1.5 sm:p-2 bg-gradient-to-br from-white via-[#FFFDF9] to-[#F5E5BE] rounded-xl shadow-md border-2 border-[#C5A059] items-center justify-items-center">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
              activeIndices.includes(i)
                ? val === 1 || val === 4 ? 'bg-[#C81E1E]' : 'bg-[#1E2538]'
                : 'opacity-0'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={handleClick}
        className={`relative cursor-pointer transition-all duration-200 select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
        } ${isRolling ? 'animate-dice-shake' : ''}`}
        title={language === 'vi' ? 'Nhấn để gieo xúc xắc' : 'Click to roll dice'}
      >
        {renderPips(displayValue)}
      </div>

      <button
        type="button"
        disabled={disabled || isRolling}
        onClick={handleClick}
        className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all duration-150 flex items-center gap-2 ${
          disabled || isRolling
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'crimson-gradient-bg text-[#F5E5BE] border border-[#C5A059] hover:shadow-lg active:scale-98'
        }`}
      >
        <span>🎲</span>
        <span>
          {isRolling 
            ? (language === 'vi' ? 'Đang gieo...' : 'Rolling...')
            : (language === 'vi' ? 'Tung xúc xắc' : 'Roll Dice')}
        </span>
      </button>
    </div>
  );
};

