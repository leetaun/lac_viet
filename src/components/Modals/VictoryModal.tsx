import { timedRanking, validArtifacts } from '../../engine/rules';
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Player } from '../../types/game';
import { TOKENS } from '../../data/tokens';
import { getArtifactName, getProvinceName } from '../../data/culturalTranslations';
import { soundManager } from '../../utils/sound';
import { Trophy, RotateCcw, Mic } from 'lucide-react';

interface VictoryModalProps {
  winner: Player;
  players: Player[];
  artifactGoal: number;
  gameModeRule?: 'toc_chien' | 'co_ban' | 'truong_ky';
  onNewGame: () => void;
  language: 'vi' | 'en';
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  players,
  artifactGoal,
  gameModeRule = 'toc_chien',
  onNewGame,
  language
}) => {
  const tokenDef = TOKENS[winner.token];
  const [showStoryMinute, setShowStoryMinute] = useState<boolean>(false);

  useEffect(() => {
    soundManager.playVictory();

    // Trigger confetti bursts
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#C5A059', '#543310', '#E5C07B', '#8C572D', '#3B220C'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
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

  const sortedPlayers = timedRanking(players);

  const winnerValidArtifacts = winner.artifactItems 
    ? winner.artifactItems.filter(a => !a.isSealed || a.storage === 'safe') 
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-backdrop-fade">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-4 border-[#C5A059] animate-modal-pop my-auto">
        
        {/* Banner */}
        <div className="brown-gradient-bg p-6 text-center text-white border-b-2 border-[#C5A059] relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#C5A059] via-[#F5E5BE] to-[#C5A059] mx-auto flex items-center justify-center text-[#543310] shadow-lg mb-2 border-2 border-white animate-bounce-slow">
            <Trophy size={32} />
          </div>

          <span className="text-[11px] uppercase tracking-widest text-[#F5E5BE] font-bold">
            {language === 'vi' ? 'VINH QUY BÁI TỔ · LẠC VIỆT' : 'TRIUMPHANT RETURN · LAC VIET'}
          </span>
          <h2 className="font-serif-lacviet text-2xl sm:text-3xl font-bold mt-1 text-white">
            {winner.name} {language === 'vi' ? 'CHIẾN THẮNG!' : 'WINS!'}
          </h2>

          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-[#F5E5BE]">
            <span>{tokenDef.icon} {language === 'vi' ? tokenDef.name : (tokenDef.enName || tokenDef.name)}</span>
            <span>•</span>
            <span>{language === 'vi' ? 'Đủ 3 miền & Về đích START' : 'All 3 Regions & Reached START'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Winner Artifacts Showcase */}
          <div className="bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#C5A059]/40 space-y-2">
            <div className="text-xs font-bold text-[#543310] flex items-center justify-between">
              <span>{language === 'vi' ? 'BỘ SƯU TẬP KỶ VẬT:' : 'ARTIFACT COLLECTION:'}</span>
              <span>{winnerValidArtifacts.length} {language === 'vi' ? 'món' : 'items'}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {winnerValidArtifacts.map(art => (
                <span
                  key={art.id}
                  className="px-2 py-1 rounded-lg bg-white border border-[#C5A059]/40 text-xs font-medium text-gray-800 shadow-sm"
                >
                  {art.isTreasure ? '⭐ ' : '• '}{getArtifactName(art.name, language)} <span className="text-[10px] text-gray-400">({getProvinceName(art.province, language)})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Hall of Fame Ranking */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {language === 'vi' ? 'Bảng Vàng Thành Tích Toàn Trận' : 'Final Hall of Fame Rankings'}
            </div>

            <div className="space-y-1.5">
              {sortedPlayers.map((player, rank) => {
                const pToken = TOKENS[player.token];
                const totalArt = validArtifacts(player).length;
                const isWinner = player.id === winner.id;

                return (
                  <div
                    key={player.id}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
                      isWinner
                        ? 'bg-amber-50 border-[#C5A059] font-bold text-amber-950 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        rank === 0 ? 'bg-[#C5A059] text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {rank + 1}
                      </span>
                      <span>{pToken.icon}</span>
                      <span>{player.name}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[#543310] font-bold">
                        {totalArt}/{artifactGoal} {language === 'vi' ? 'Kỷ vật' : 'Artifacts'}
                      </span>
                      <span className="text-gray-400 font-normal">
                        ({player.score}{language === 'vi' ? 'đ' : ' pts'})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 10.3: Phút Kể Chuyện Toggle */}
          <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-200 space-y-1.5 text-xs text-blue-950">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-blue-900">
                <Mic size={14} className="text-blue-700" /> {language === 'vi' ? 'PHÚT KỂ CHUYỆN (3 PHÚT)' : 'STORYTELLING MINUTE (3 MINS)'}
              </span>
              <button
                onClick={() => setShowStoryMinute(!showStoryMinute)}
                className="text-[11px] font-bold text-blue-700 hover:underline"
              >
                {showStoryMinute ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Xem gợi ý' : 'Show tips')}
              </button>
            </div>
            {showStoryMinute ? (
              <p className="text-gray-700 leading-relaxed pt-1">
                {language === 'vi'
                  ? 'Mỗi người chơi lần lượt chia sẻ 1 điều bất ngờ hoặc câu chuyện về kỷ vật tâm đắc nhất mang về đích.'
                  : 'Each player takes turns sharing 1 surprising discovery or favorite artifact brought to the finish line.'}
              </p>
            ) : (
              <p className="text-gray-600">
                {language === 'vi'
                  ? 'Mỗi người chơi chia sẻ 1 điều tâm đắc sau hành trình.'
                  : 'Each player shares 1 memorable experience from the journey.'}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2">
          <button
            onClick={onNewGame}
            className="px-5 py-2.5 brown-gradient-bg hover:opacity-95 text-[#F5E5BE] font-bold rounded-xl text-xs sm:text-sm border border-[#C5A059] shadow flex items-center gap-2"
          >
            <RotateCcw size={15} />
            <span>{language === 'vi' ? 'Ván Mới' : 'New Game'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
