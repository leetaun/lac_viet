import { isProtected } from '../../engine/rules';
import React, { useState } from 'react';
import { Player, ResourceCard, ArtifactItem } from '../../types/game';
import { Swords, Shield, Trophy, Layers, AlertCircle, Sparkles, X, Check } from 'lucide-react';
import { soundManager } from '../../utils/sound';

interface StealModalProps {
  attacker: Player;
  target: Player;
  allPlayers?: Player[];
  onExecuteSteal: (type: 'artifact' | 'card' | 'skip', resourceCardUsed?: ResourceCard, targetArtifact?: ArtifactItem) => void;
  onCancel: () => void;
  language: 'vi' | 'en';
}

export const StealModal: React.FC<StealModalProps> = ({
  attacker,
  target,
  allPlayers = [],
  onExecuteSteal,
  onCancel,
  language
}) => {
  // Check "Không đánh người ngã" (Section 7.2 & 10.2):
  // Player with the strictly least total artifacts on the board is immune from steals and seals!
  const isLeastArtifactsPlayer = isProtected(target, allPlayers);

  // Stealable regular artifacts in target's pouch (non-treasure, unsealed)
  const stealableArtifacts = target.artifactItems.filter(
    a => !a.isTreasure && a.storage === 'pouch'
  );

  // Any resource card in attacker's hand can be spent
  const anyResourceCard = attacker.cards.resource[0];
  const [selectedResourceCardId, setSelectedResourceCardId] = useState<string>(
    anyResourceCard ? anyResourceCard.id : ''
  );

  const targetHandCardsCount = 
    target.cards.knowledge.length + target.cards.resource.length + target.cards.fortune.length + target.biKipCards.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-backdrop-fade">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-4 border-[#7E121D] animate-modal-pop">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-red-700 via-[#7E121D] to-red-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords size={20} className="text-[#C5A059]" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                BƯỚC 3: CHẠM TRÁN ĐỐI THỦ
              </span>
              <h2 className="font-serif-lacviet text-lg font-bold">
                Dừng Chung Ô Với {target.name}!
              </h2>
            </div>
          </div>
          <button onClick={onCancel} className="p-1 rounded-full text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Target Status Bar */}
          <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-gray-900 text-sm">{target.name} (P{target.seat})</span>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Tay nải: <strong>{target.artifacts}</strong> • Hòm ký gửi: <strong>{target.safeArtifacts}</strong> • Thẻ bài: <strong>{targetHandCardsCount}</strong>
              </div>
            </div>
            {target.hasShield && (
              <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-bold text-[11px]">
                <Shield size={13} />
                <span>Có Lá Chắn</span>
              </div>
            )}
          </div>

          {/* Immunity Banner: "Không đánh người ngã" */}
          {isLeastArtifactsPlayer && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 flex items-start gap-2">
              <Shield size={16} className="text-amber-700 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block text-[#7E121D]">CƠ CHẾ "KHÔNG ĐÁNH NGƯỜI NGÃ":</strong>
                <span>
                  {target.name} đang có ít kỷ vật nhất bàn chơi. Hệ thống tự động kích hoạt bảo vệ miễn nhiễm hoàn toàn với cướp và phong ấn!
                </span>
              </div>
            </div>
          )}

          {/* Option 1: Trả phí Cướp kỷ vật thường */}
          <div className={`p-3 rounded-2xl border transition-all ${
            isLeastArtifactsPlayer || stealableArtifacts.length === 0 || attacker.cards.resource.length === 0
              ? 'bg-gray-50 border-gray-200 opacity-60'
              : 'bg-amber-50/70 border-[#C5A059] shadow-sm'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Trophy size={16} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900">
                    1. Trả phí Cướp Kỷ Vật Thường
                  </div>
                  <div className="text-[10px] text-gray-600">
                    Bỏ 01 thẻ Tài nguyên bất kỳ để lấy 01 kỷ vật trong Tay nải đối thủ (Bảo vật được bảo vệ).
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Card Selector if available */}
            {!isLeastArtifactsPlayer && stealableArtifacts.length > 0 && attacker.cards.resource.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between gap-2">
                <select
                  value={selectedResourceCardId}
                  onChange={(e) => setSelectedResourceCardId(e.target.value)}
                  className="text-xs font-medium p-1.5 border border-gray-300 rounded-lg bg-white flex-1"
                >
                  {attacker.cards.resource.map(r => (
                    <option key={r.id} value={r.id}>
                      Trả thẻ: {r.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    soundManager.playSuccess();
                    const cardUsed = attacker.cards.resource.find(r => r.id === selectedResourceCardId) || attacker.cards.resource[0];
                    onExecuteSteal('artifact', cardUsed, stealableArtifacts[0]);
                  }}
                  className="px-3 py-1.5 bg-[#7E121D] hover:bg-[#941B26] text-white rounded-lg text-xs font-bold shadow flex-shrink-0"
                >
                  Cướp Kỷ Vật
                </button>
              </div>
            )}
          </div>

          {/* Option 2: Trộm 1 thẻ bài túi đồ (Miễn phí) */}
          <div className={`p-3 rounded-2xl border transition-all ${
            targetHandCardsCount === 0
              ? 'bg-gray-50 border-gray-200 opacity-60'
              : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Layers size={16} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900">
                    2. Trộm 1 Thẻ Bài Túi Đồ (Miễn phí)
                  </div>
                  <div className="text-[10px] text-gray-600">
                    Lấy ngẫu nhiên 01 thẻ bài trong túi đồ đối thủ chuyển sang cho bạn.
                  </div>
                </div>
              </div>

              {targetHandCardsCount > 0 && (
                <button
                  onClick={() => {
                    soundManager.playSuccess();
                    onExecuteSteal('card');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex-shrink-0"
                >
                  Trộm Thẻ
                </button>
              )}
            </div>
          </div>

          {/* Option 3: Bỏ qua không cướp */}
          <div className="pt-1">
            <button
              onClick={() => onExecuteSteal('skip')}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all"
            >
              Bỏ qua Chạm trán (Làm nhiệm vụ chính của ô)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
