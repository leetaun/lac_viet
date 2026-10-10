import React from 'react';
import { Player, ResourceCard } from '../../types/game';
import { Swords, Shield, Trophy, Layers, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface StealModalProps {
  attacker: Player;
  target: Player;
  onExecuteSteal: (type: 'artifact' | 'card', resourceCardUsed?: ResourceCard) => void;
  onCancel: () => void;
  language: 'vi' | 'en';
}

export const StealModal: React.FC<StealModalProps> = ({
  attacker,
  target,
  onExecuteSteal,
  onCancel,
  language
}) => {
  // Check if attacker has a land/resource card
  const landCard = attacker.cards.resource.find(r => r.category === 'land' || r.category === 'steal');
  const targetHasArtifact = target.artifacts > 0;
  const targetTotalCards = target.cards.knowledge.length + target.cards.resource.length + target.cards.fortune.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-[#DC2626] animate-modal-pop">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-700 to-red-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords size={20} className="text-amber-300" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                TƯƠNG TÁC ĐỐI ĐẦU
              </span>
              <h2 className="font-serif-lacviet text-lg font-bold">
                Đỗ Cùng Ô Với {target.name}!
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4">
          <div className="text-xs text-gray-700 bg-red-50 p-3 rounded-xl border border-red-200">
            <strong>Luật tương tác:</strong> Khi bạn di chuyển dừng đúng vào ô đối phương đang đứng:
            <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-gray-600">
              <li>Nếu bỏ ra 1 Thẻ Tài Nguyên: Được cướp 1 Kỷ vật văn hóa!</li>
              <li>Nếu không có thẻ: Chỉ được cướp 1 thẻ bài ngẫu nhiên trên tay đối phương.</li>
            </ul>
          </div>

          {/* Target Status */}
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-gray-900">{target.name} (P{target.seat})</span>
              <div className="text-[11px] text-gray-500">
                Đang mang: <strong>{target.artifacts} Kỷ vật</strong> (gửi an toàn {target.safeArtifacts})
              </div>
            </div>
            {target.hasShield && (
              <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-bold text-[11px]">
                <Shield size={13} />
                <span>Có Lá Chắn</span>
              </div>
            )}
          </div>

          {/* Steal Actions */}
          <div className="space-y-2">
            {/* Action 1: Steal Artifact */}
            <button
              disabled={!targetHasArtifact || !landCard}
              onClick={() => {
                soundManager.playSuccess();
                onExecuteSteal('artifact', landCard);
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                targetHasArtifact && landCard
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950 font-bold shadow-sm'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-200 text-amber-800 rounded-lg">
                  <Trophy size={16} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold">
                    Cướp 1 Kỷ Vật Văn Hóa
                  </div>
                  <div className="text-[11px] font-normal text-gray-600">
                    {landCard 
                      ? `Tiêu hao thẻ [${landCard.name}] để đoạt kỷ vật` 
                      : 'Cần có Thẻ Tài Nguyên (Địa bạ/Chiếm đất) trên tay'}
                  </div>
                </div>
              </div>
            </button>

            {/* Action 2: Steal Hand Card */}
            <button
              disabled={targetTotalCards === 0}
              onClick={() => {
                soundManager.playSuccess();
                onExecuteSteal('card');
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                targetTotalCards > 0
                  ? 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-950 font-bold shadow-sm'
                  : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-200 text-blue-800 rounded-lg">
                  <Layers size={16} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold">
                    Cướp 1 Thẻ Bài Ngẫu Nhiên
                  </div>
                  <div className="text-[11px] font-normal text-gray-600">
                    Rút ngẫu nhiên 1 lá bài trên tay {target.name} ({targetTotalCards} lá)
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-xs font-semibold"
          >
            Bỏ qua không cướp
          </button>
        </div>

      </div>
    </div>
  );
};

