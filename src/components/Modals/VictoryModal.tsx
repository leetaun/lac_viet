import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { soundManager } from '../../utils/sound';
import { Trophy, Award, Sparkles, RotateCcw } from 'lucide-react';

interface VictoryModalProps {
  winner: Player;
  players: Player[];
  artifactGoal: number;
  onNewGame: () => void;
  language: 'vi' | 'en';
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  players,
  artifactGoal,
  onNewGame,
  language
}) => {
  const tokenDef = TOKENS[winner.token];

  useEffect(() => {
    soundManager.playVictory();

    // Trigger confetti bursts
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#C5A059', '#7E121D', '#E5C07B', '#DC2626', '#1E2538'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [winner]);

  // Sort players by achievements
  const sortedPlayers = [...players].sort((a, b) => {
    const totalA = a.artifacts + a.safeArtifacts;
    const totalB = b.artifacts + b.safeArtifacts;
    return totalB - totalA;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-in zoom-in-95 duration-200">
        
        {/* Banner */}
        <div className="crimson-gradient-bg p-6 text-center text-white border-b-2 border-[#C5A059] relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#C5A059] via-[#F5E5BE] to-[#C5A059] mx-auto flex items-center justify-center text-[#7E121D] shadow-lg mb-2 border-2 border-white">
            <Trophy size={32} />
          </div>

          <span className="text-xs uppercase tracking-widest text-[#F5E5BE] font-bold">
            VINH DANH NHÀ QUÁN QUÂN VĂN HÓA
          </span>
          <h2 className="font-serif-lacviet text-2xl sm:text-3xl font-bold mt-1 text-white">
            {winner.name} ĐÃ CHIẾN THẮNG!
          </h2>

          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-[#F5E5BE]">
            <span>Biểu tượng: {tokenDef.icon} {tokenDef.name}</span>
            <span>•</span>
            <span>Thu thập đủ {artifactGoal} Kỷ vật và về START an toàn</span>
          </div>
        </div>

        {/* Hall of Fame Ranking */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Bảng Vàng Thành Tích Toàn Trận
          </div>

          <div className="space-y-2">
            {sortedPlayers.map((player, rank) => {
              const pToken = TOKENS[player.token];
              const totalArt = player.artifacts + player.safeArtifacts;
              const isWinner = player.id === winner.id;

              return (
                <div
                  key={player.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs sm:text-sm ${
                    isWinner
                      ? 'bg-amber-50 border-[#C5A059] shadow-sm font-bold text-amber-950'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      rank === 0 ? 'bg-amber-400 text-amber-950' :
                      rank === 1 ? 'bg-gray-300 text-gray-800' :
                      'bg-orange-200 text-orange-950'
                    }`}>
                      {rank + 1}
                    </span>
                    <span className="text-base">{pToken.icon}</span>
                    <span>{player.name} (P{player.seat})</span>
                  </div>

                  <div className="flex items-center gap-2 font-bold text-[#7E121D]">
                    <Trophy size={14} className="text-[#C5A059]" />
                    <span>{totalArt} Kỷ vật</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-[#FAF6EE] p-3 rounded-2xl border border-[#C5A059]/30 text-xs text-gray-700 leading-relaxed text-center">
            🌟 <em>"Hành trình vạn dặm khám phá văn hóa Lạc Việt đã khép lại vẻ vang. Tri thức và niềm tự hào dân tộc sẽ mãi đồng hành cùng bạn!"</em>
          </div>

          {/* Action Button */}
          <button
            onClick={onNewGame}
            className="w-full py-3.5 crimson-gradient-bg text-[#F5E5BE] font-bold rounded-2xl text-sm border-2 border-[#C5A059] shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <RotateCcw size={16} />
            <span>Bắt Đầu Ván Chơi Mới</span>
          </button>
        </div>

      </div>
    </div>
  );
};

